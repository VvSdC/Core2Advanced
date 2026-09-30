import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SecretsForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Make the list before you make the secrets">
        A typical data platform has a surprising number of credentials: source database readers, warehouse
        loaders, vendor SFTP logins, SaaS API keys, Snowflake or Databricks tokens, webhook signing secrets.
        Before creating anything, strong teams write an{' '}
        <strong className="text-white">inventory</strong> — what each secret is, which service stores it, and
        which IAM role reads it. This lesson builds that inventory for a realistic pipeline.
      </Callout>

      <Definition term="Secret inventory">
        <p>
          A <strong className="text-white">secret inventory</strong> is a documented list of every credential
          and sensitive config value a platform uses, with its name, storage service, owner, rotation schedule,
          and the IAM roles allowed to read it. It turns &quot;who can see the Redshift password?&quot; from an
          investigation into a lookup.
        </p>
      </Definition>

      <LessonSection title="Inventory of DE secrets">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Secret</th>
                <th className="px-4 py-3">Used by</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RDS source reader', 'Glue extract jobs, DMS tasks', 'Read-only DB user; managed rotation in Secrets Manager'],
                ['Redshift loader', 'Glue load jobs, Step Functions load step', 'Consider IAM auth or the Redshift Data API instead of a stored password'],
                ['Vendor SFTP or API key', 'Lambda ingestion functions', 'Often issued by the vendor — rotate on their schedule, store in Secrets Manager'],
                ['Snowflake or Databricks token', 'Glue or Lambda publishing to external platforms', 'Service user or personal access token with expiry — never a human account'],
                ['Webhook signing secret', 'Lambda behind API Gateway', 'Verifies inbound vendor events; small static value, SecureString is acceptable'],
              ].map(([secret, usedBy, notes]) => (
                <tr key={secret} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{secret}</td>
                  <td className="px-4 py-3">{usedBy}</td>
                  <td className="px-4 py-3">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          One secret per consumer purpose, not one per database. A separate reader secret for Glue and a
          separate loader secret for Redshift means a leak of one never grants the other&apos;s permissions.
        </Callout>
      </LessonSection>

      <LessonSection title="Config parameters per environment">
        <p className="text-slate-300">
          Configuration follows the same environment prefix as secrets, so one job codebase runs in dev and prod
          by changing a single <code className="text-core-400">env</code> value.
        </p>
        <Example title="Parameter layout for the orders pipeline" caption="Same keys, different values per env">
{`/de/dev/orders/batch_size          = 100
/de/dev/orders/landing_prefix      = s3://acme-lake-dev/raw/orders/
/de/dev/flags/enable_dedup         = false

/de/prod/orders/batch_size         = 5000
/de/prod/orders/landing_prefix     = s3://acme-lake-prod/raw/orders/
/de/prod/flags/enable_dedup        = true

# Secrets use the same env segment
de/dev/rds/orders-reader
de/prod/rds/orders-reader`}
        </Example>
        <Callout variant="tip" title="Keep environments separate by name and by IAM">
          Dev roles should be unable to read <code className="text-core-400">de/prod/*</code>. Matching prefixes
          make that a one-line IAM condition instead of a long list of ARNs.
        </Callout>
      </LessonSection>

      <LessonSection title="Who reads what">
        <p className="text-slate-300">
          Each compute service gets its own IAM role, and each role reads only the secrets and parameters its
          step needs. The Step Functions role usually needs <em>no</em> secrets at all — it only starts jobs and
          invokes Lambdas.
        </p>
        <Flowchart
          title="Roles mapped to secrets and parameters"
          chart={`flowchart LR
  SFR[Step Functions role] --> START[Start Glue and invoke Lambda only]
  GR[Glue job role] --> S1[Secret rds orders-reader]
  GR --> S2[Secret redshift loader]
  GR --> P1[Params de prod orders]
  LR[Lambda ingest role] --> S3[Secret vendor acme-api-key]
  LR --> P2[Params de prod flags]`}
        />
        <ContentStep number={1} title="Glue role">
          <p className="text-slate-300">
            <code className="text-core-400">secretsmanager:GetSecretValue</code> on the RDS reader and Redshift
            loader secrets, <code className="text-core-400">ssm:GetParametersByPath</code> on{' '}
            <code className="text-core-400">/de/prod/orders</code>, and{' '}
            <code className="text-core-400">kms:Decrypt</code> on the keys that encrypt them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda ingestion role">
          <p className="text-slate-300">
            Only the vendor API key secret and the flags path — it never needs database credentials.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Step Functions role">
          <p className="text-slate-300">
            Permissions to start Glue job runs and invoke Lambdas. Passing secret names in the state input is
            fine; passing secret values is not — execution history would store them.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Prefer IAM auth — the best secret is no secret">
        <ContentStep number={1} title="AWS services call each other with IAM">
          <p className="text-slate-300">
            S3, DynamoDB, SQS, Athena, and Glue Data Catalog need no stored credentials — the execution role is
            the credential. Never create access keys for Lambda or Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS IAM database authentication">
          <p className="text-slate-300">
            MySQL and PostgreSQL on RDS can accept short-lived IAM auth tokens (valid 15 minutes) instead of a
            password — nothing long-lived to leak or rotate.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift temporary credentials and the Data API">
          <p className="text-slate-300">
            <code className="text-core-400">GetClusterCredentials</code> issues temporary database credentials
            from IAM, and the Redshift Data API runs SQL over HTTPS with IAM or a secret ARN — no JDBC password in
            your Lambda.
          </p>
        </ContentStep>
        <Callout variant="info">
          Secrets Manager is still needed for systems outside AWS IAM — vendor APIs, SFTP servers, Snowflake,
          Databricks — and for tools that only speak username and password.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inventory first: RDS readers, Redshift loaders, vendor SFTP/API keys, Snowflake or Databricks tokens, webhook signing secrets.',
          'Use one secret per consumer purpose so a leaked reader never grants loader permissions.',
          'Mirror environment prefixes in secrets and parameters (de/prod/..., /de/prod/...) so IAM can separate dev from prod.',
          'Map roles to secrets: Glue reads DB creds and orders config, Lambda reads vendor keys, Step Functions usually reads none.',
          'Prefer IAM auth — execution roles, RDS IAM auth tokens, Redshift temporary credentials or Data API — so there is no secret to store.',
        ]}
      />
    </LessonArticle>
  )
}
