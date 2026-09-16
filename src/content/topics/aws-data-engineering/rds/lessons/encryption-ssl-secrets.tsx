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

export function EncryptionSslSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Encrypt at rest, in transit, and manage credentials centrally">
        Operational databases hold PII, financial records, and source-of-truth business data. Data engineering
        pipelines must respect the same encryption and credential standards as production apps — especially
        when JDBC connections cross VPC boundaries or land extracts in S3.
      </Callout>

      <Definition term="RDS encryption layers">
        <p>
          <strong className="text-white">Encryption at rest</strong> uses AWS KMS to encrypt DB instance
          storage, automated backups, read replicas, and snapshots.{' '}
          <strong className="text-white">Encryption in transit</strong> uses SSL/TLS between clients and RDS.{' '}
          <strong className="text-white">Secrets Manager</strong> stores and rotates database credentials
          consumed by Glue, Lambda, and DMS — avoiding plaintext passwords in job configs.
        </p>
      </Definition>

      <LessonSection title="Encryption at rest (KMS)">
        <ContentStep number={1} title="Enable at creation">
          <p className="text-slate-300">
            RDS encryption at rest must be enabled when the instance is created — you cannot turn it on on an
            unencrypted instance in place. Migrate via snapshot copy to encrypted snapshot, then restore. All
            storage, backups, replicas, and snapshots inherit the KMS key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CMK vs AWS managed key">
          <p className="text-slate-300">
            Default aws/rds key works for most teams. Customer managed keys (CMK) give key policy control,
            cross-account access, and CloudTrail audit — required for many compliance frameworks. DE snapshot
            exports to S3 produce encrypted Parquet — ensure lake bucket KMS policy allows Glue/Athena decrypt.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Snapshot export chain">
          <p className="text-slate-300">
            Encrypted snapshot → export to S3 uses the same KMS key. Downstream Glue jobs need{' '}
            <code className="text-core-400">kms:Decrypt</code> on the RDS key and{' '}
            <code className="text-core-400">kms:GenerateDataKey</code> on the S3 bucket key when writing
            curated output.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SSL/TLS in transit">
        <ContentStep number={1} title="Force SSL connections">
          <p className="text-slate-300">
            RDS provides a CA certificate bundle — configure JDBC with{' '}
            <code className="text-core-400">sslmode=require</code> (Postgres) or{' '}
            <code className="text-core-400">useSSL=true</code> (MySQL). Parameter groups can enforce{' '}
            <code className="text-core-400">rds.force_ssl=1</code> to reject non-TLS connections — recommended
            for prod sources.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipeline compliance">
          <p className="text-slate-300">
            Data in motion from RDS → Glue → S3 crosses multiple hops. TLS to RDS is step one; also encrypt
            S3 objects (SSE-S3 or SSE-KMS) and use TLS for all AWS API calls. End-to-end encryption story
            matters for SOC2 and GDPR audits.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Certificate rotation">
          <p className="text-slate-300">
            RDS rotates server certificates periodically — update trust stores in long-running EC2 workers or
            pinned JDBC configs. Managed services (Glue, DMS) handle this automatically when using standard
            connection templates.
          </p>
        </ContentStep>
        <Flowchart
          title="Encrypted extract path"
          chart={`flowchart LR
  RDS[RDS encrypted at rest KMS]
  GLUE[Glue JDBC SSL/TLS]
  S3[S3 SSE-KMS curated]
  RDS -->|TLS in transit| GLUE
  GLUE -->|encrypted write| S3
  SM[Secrets Manager] -->|credentials| GLUE`}
        />
      </LessonSection>

      <LessonSection title="Secrets Manager for credentials">
        <ContentStep number={1} title="Centralized secret storage">
          <p className="text-slate-300">
            Store <code className="text-core-400">username</code>,{' '}
            <code className="text-core-400">password</code>, <code className="text-core-400">host</code>,{' '}
            <code className="text-core-400">port</code>, <code className="text-core-400">dbname</code> as a
            JSON secret. Glue connections, Lambda environment resolution, and DMS endpoints reference the
            secret ARN — not inline strings in CloudFormation or Git.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Automatic rotation">
          <p className="text-slate-300">
            Secrets Manager can rotate RDS credentials on a schedule via Lambda rotation function — updates
            both the secret and the DB user password atomically. Pipelines must handle brief connection failures
            during rotation — retry with backoff or schedule rotation outside extract windows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM permissions">
          <p className="text-slate-300">
            Glue execution role needs <code className="text-core-400">secretsmanager:GetSecretValue</code> on
            the secret ARN. Scope resource policies — dev Glue role cannot read prod DB secret. Cross-account
            secrets require explicit resource policy on the secret.
          </p>
        </ContentStep>
        <Example title="Glue connection pattern" caption="Secrets Manager + SSL">
{`Glue Connection properties:
  JDBC URL: jdbc:postgresql://orders.xxxx.region.rds.amazonaws.com:5432/orders
  SSL: require
  Secret ID: arn:aws:secretsmanager:region:acct:secret:prod/orders-db-AbCdEf

Execution role policy:
  secretsmanager:GetSecretValue on secret ARN
  kms:Decrypt on RDS and Secrets Manager CMKs`}
        </Example>
      </LessonSection>

      <LessonSection title="DE compliance checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">Implementation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['At-rest encryption', 'KMS on RDS instance — plan before create; snapshot migrate if legacy'],
                ['In-transit encryption', 'SSL required on all JDBC; rds.force_ssl in parameter group'],
                ['Credential storage', 'Secrets Manager ARN in Glue/Lambda/DMS — zero Git plaintext'],
                ['Lake output encryption', 'SSE-KMS on S3 curated bucket; IAM for Glue decrypt/encrypt'],
                ['PII in extracts', 'Column masking in staging; encrypt snapshots shared cross-account'],
              ].map(([control, impl]) => (
                <tr key={control} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{control}</td>
                  <td className="px-4 py-3">{impl}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview answer: RDS encrypts storage/backups with KMS; clients use SSL/TLS; Secrets Manager holds
          rotatable credentials for pipelines — three layers DE teams must wire into Glue and DMS IAM roles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Encryption at rest (KMS) must be enabled at RDS creation — snapshots, replicas, and backups inherit the key.',
          'SSL/TLS in transit — enforce with parameter group rds.force_ssl; required for compliance on extract paths.',
          'Secrets Manager centralizes DB credentials for Glue/Lambda/DMS — enable rotation, scope IAM tightly.',
          'Encrypted snapshot export → S3 requires KMS decrypt permissions on pipeline execution roles.',
          'End-to-end: encrypted RDS → TLS JDBC → SSE-KMS S3 — document the chain for audit readiness.',
        ]}
      />
    </LessonArticle>
  )
}
