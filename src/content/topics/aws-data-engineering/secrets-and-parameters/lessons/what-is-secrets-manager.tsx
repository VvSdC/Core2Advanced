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

export function WhatIsSecretsManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A vault built for credentials that change">
        Database passwords and API keys are not like normal config: they must be encrypted, access must be
        audited, and they should change regularly without breaking pipelines.{' '}
        <strong className="text-white">AWS Secrets Manager</strong> is purpose-built for exactly that — it
        stores credentials encrypted with KMS, keeps versions, and can rotate RDS and Redshift passwords for you
        on a schedule.
      </Callout>

      <Definition term="AWS Secrets Manager">
        <p>
          <strong className="text-white">AWS Secrets Manager</strong> is a managed service that stores, encrypts,
          versions, and rotates secrets. Each secret has a name or ARN, a KMS key, an optional resource policy,
          and one or more versions of a secret value — typically a JSON string up to{' '}
          <strong className="text-white">64 KB</strong>. Applications retrieve the current value at runtime with{' '}
          <code className="text-core-400">GetSecretValue</code>, authorized by IAM.
        </p>
      </Definition>

      <LessonSection title="What a secret looks like">
        <ContentStep number={1} title="Name, ARN, and JSON value">
          <p className="text-slate-300">
            A secret like <code className="text-core-400">de/prod/rds/orders-reader</code> usually stores a JSON
            object with <code className="text-core-400">username</code>,{' '}
            <code className="text-core-400">password</code>, <code className="text-core-400">host</code>,{' '}
            <code className="text-core-400">port</code>, and <code className="text-core-400">dbname</code> —
            everything a Glue JDBC connection needs, in one place. Binary values are also supported.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Encryption with KMS">
          <p className="text-slate-300">
            Every secret value is encrypted with a KMS key — the AWS managed key{' '}
            <code className="text-core-400">aws/secretsmanager</code> by default, or a customer managed key
            (CMK) when you need your own key policy or cross-account access. Readers need both secret read
            permission and <code className="text-core-400">kms:Decrypt</code> on that key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Versions and staging labels">
          <p className="text-slate-300">
            Each update creates a new version. Staging labels point at versions:{' '}
            <code className="text-core-400">AWSCURRENT</code> is what callers get by default,{' '}
            <code className="text-core-400">AWSPREVIOUS</code> is the prior value for rollback, and{' '}
            <code className="text-core-400">AWSPENDING</code> marks a new value during rotation before it is
            promoted.
          </p>
        </ContentStep>
        <Flowchart
          title="Staging labels during rotation"
          chart={`flowchart LR
  V1[Version 1 old password] -->|label| PREV[AWSPREVIOUS]
  V2[Version 2 active password] -->|label| CUR[AWSCURRENT]
  V3[Version 3 new password] -->|label| PEND[AWSPENDING]
  PEND -->|rotation finishes| CUR
  APP[Glue or Lambda reader] --> CUR`}
        />
      </LessonSection>

      <LessonSection title="Features data engineers rely on">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Why it matters for pipelines</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Built-in rotation', 'Schedule rotation (for example every 30 days); managed rotation for RDS, Redshift, and DocumentDB updates the database and the secret together'],
                ['Native DB integrations', 'RDS and Redshift can manage the master user password in Secrets Manager; Glue connections and the Redshift Data API accept a secret ARN'],
                ['Resource policies', 'Attach a policy to the secret itself to grant another account’s role access — used for central data platform accounts'],
                ['Replication', 'Replicate a secret to other Regions so DR pipelines in the secondary Region read the same credential locally'],
                ['Deletion protection', 'Deleting schedules removal after a 7 to 30 day recovery window, so an accidental delete can be restored'],
                ['CloudTrail audit', 'Every GetSecretValue call is logged with the calling principal — who read which secret, and when'],
              ].map(([feature, why]) => (
                <tr key={feature} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{feature}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Rotation is the feature that justifies Secrets Manager for database credentials. A password that
          changes every 30 days — without anyone touching Glue jobs — turns a leaked credential from a
          permanent breach into a short-lived one.
        </Callout>
      </LessonSection>

      <LessonSection title="Pricing — what it costs">
        <ContentStep number={1} title="Per secret per month">
          <p className="text-slate-300">
            About <strong className="text-white">$0.40 per secret per month</strong>, prorated for secrets that
            exist part of the month. Replica secrets in other Regions are billed as separate secrets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per API call">
          <p className="text-slate-300">
            About <strong className="text-white">$0.05 per 10,000 API calls</strong>. A Lambda that fetches a
            secret on every invocation at millions of invocations per day adds up — caching (covered later) keeps
            this negligible.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Cost sanity check">
          Twenty pipeline secrets cost roughly $8 per month plus API calls. That is trivial next to the cost of a
          single leaked warehouse credential — but do not create one secret per job run or per customer without
          thinking about the monthly count.
        </Callout>
      </LessonSection>

      <LessonSection title="Hands-on — create and read a secret with the CLI">
        <p className="text-slate-300">
          Use placeholder values when practicing. In production, RDS managed rotation or a rotation Lambda sets
          the real password so no human ever types it.
        </p>
        <Example title="Create and retrieve a secret" caption="AWS CLI — placeholder values only">
{`# Create a JSON secret for the orders source database
aws secretsmanager create-secret \\
  --name de/prod/rds/orders-reader \\
  --description "Read-only user for Glue orders extract" \\
  --secret-string '{"username":"orders_reader","password":"REPLACE_ME","host":"orders-db.example.internal","port":5432,"dbname":"orders"}' \\
  --tags Key=team,Value=de Key=env,Value=prod

# Read the current value (AWSCURRENT by default)
aws secretsmanager get-secret-value \\
  --secret-id de/prod/rds/orders-reader \\
  --query SecretString --output text

# Read the previous version for rollback checks
aws secretsmanager get-secret-value \\
  --secret-id de/prod/rds/orders-reader \\
  --version-stage AWSPREVIOUS`}
        </Example>
        <Callout variant="info">
          Running <code className="text-core-400">get-secret-value</code> in a terminal prints the password to
          your screen and shell history. Fine for a sandbox with placeholders; avoid it on shared machines with
          real credentials.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secrets Manager stores KMS-encrypted secrets — usually JSON up to 64 KB — retrieved at runtime with GetSecretValue under IAM.',
          'Encryption uses aws/secretsmanager by default or a customer managed key; readers also need kms:Decrypt.',
          'Versions plus staging labels AWSCURRENT, AWSPREVIOUS, and AWSPENDING make rotation and rollback safe.',
          'Built-in rotation, RDS/Redshift/DocumentDB integrations, resource policies, and replication are why DE teams pick it for credentials.',
          'Pricing is about $0.40 per secret per month plus $0.05 per 10,000 API calls — cache reads in high-volume Lambdas.',
        ]}
      />
    </LessonArticle>
  )
}
