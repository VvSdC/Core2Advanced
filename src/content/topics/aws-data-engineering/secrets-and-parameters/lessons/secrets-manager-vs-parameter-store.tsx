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

export function SecretsManagerVsParameterStore() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two services, overlapping features, one clear split">
        Both services encrypt values with KMS, both are read with IAM, and both have versions — so beginners
        often ask which one is &quot;right.&quot; The honest answer: most data platforms use{' '}
        <strong className="text-white">both</strong>. Secrets Manager holds credentials that must rotate;
        Parameter Store holds configuration that must be organized. This lesson gives you the comparison and a
        decision rule you can defend in a design review.
      </Callout>

      <Definition term="The DE split">
        <p>
          The <strong className="text-white">DE split</strong> is the common convention of storing database and
          API credentials in <strong className="text-white">Secrets Manager</strong> (rotation, cross-account
          sharing, database integrations) and non-secret pipeline configuration — batch sizes, S3 prefixes,
          feature flags — in <strong className="text-white">Parameter Store</strong> (free Standard tier,
          hierarchical paths), with <code className="text-core-400">SecureString</code> reserved for small static
          secrets that do not need rotation.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Secrets Manager</th>
                <th className="px-4 py-3">Parameter Store</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Purpose', 'Credentials — DB users, API keys, tokens', 'Configuration plus optional encrypted values'],
                ['Rotation', 'Built-in schedules and managed rotation', 'None built in — you would build it yourself'],
                ['Cost', 'About $0.40 per secret per month plus $0.05 per 10,000 calls', 'Standard tier free; Advanced tier and higher throughput charged'],
                ['Max size', '64 KB', '4 KB Standard, 8 KB Advanced'],
                ['Cross-account access', 'Resource policy on the secret plus a customer managed KMS key', 'No resource policies; Advanced parameters can be shared through AWS RAM'],
                ['Multi-Region replication', 'Built-in replica secrets', 'Not built in — copy with your own automation'],
                ['Native DB integrations', 'RDS, Redshift, DocumentDB, Glue connections, Redshift Data API', 'None specific to databases'],
                ['Versioning', 'Versions with staging labels AWSCURRENT, AWSPREVIOUS, AWSPENDING', 'Numbered versions, last 100 kept, custom labels'],
                ['Hierarchy', 'Flat names — slashes are only a naming convention', 'True paths with GetParametersByPath'],
              ].map(([aspect, sm, ps]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{sm}</td>
                  <td className="px-4 py-3">{ps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          The deciding features are almost always <strong className="text-white">rotation</strong> and{' '}
          <strong className="text-white">cost</strong>. If a value should change on a schedule, pay the $0.40.
          If it is a plain setting read by many jobs, keep it free in Parameter Store.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Where should this value live?"
          chart={`flowchart TD
  START[New value for a pipeline] --> Q1{Is it a secret}
  Q1 -->|No| PSS[Parameter Store String or StringList]
  Q1 -->|Yes| Q2{Needs rotation or DB integration}
  Q2 -->|Yes| SM[Secrets Manager]
  Q2 -->|No| Q3{Shared cross account or replicated}
  Q3 -->|Yes| SM
  Q3 -->|No| Q4{Larger than 4 KB}
  Q4 -->|Yes| SM
  Q4 -->|No| SEC[Parameter Store SecureString]`}
        />
        <ContentStep number={1} title="Start with: is it a secret?">
          <p className="text-slate-300">
            A batch size or S3 prefix is not a secret — plain <code className="text-core-400">String</code>{' '}
            parameters keep it readable, versioned, and free.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Secrets that rotate go to Secrets Manager">
          <p className="text-slate-300">
            RDS source readers, Redshift loaders, and Snowflake service users should rotate — Secrets Manager
            handles that without touching Glue or Lambda code.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Small static secrets can be SecureString">
          <p className="text-slate-300">
            A webhook signing token that only one Lambda reads, in one account, may reasonably be a SecureString.
            If it later needs rotation or sharing, migrate it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common DE split in practice">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Reason</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['de/prod/rds/orders-reader', 'Secrets Manager', 'Glue JDBC credential, rotated every 30 days'],
                ['de/prod/redshift/loader', 'Secrets Manager', 'Warehouse write access, managed rotation'],
                ['de/prod/vendor/acme-api-key', 'Secrets Manager', 'Vendor key shared with an ingestion account'],
                ['/de/prod/orders/batch_size', 'Parameter Store String', 'Plain tuning value'],
                ['/de/prod/orders/landing_prefix', 'Parameter Store String', 'S3 prefix per environment'],
                ['/de/prod/flags/enable_dedup', 'Parameter Store String', 'Feature flag flipped without deploys'],
              ].map(([name, service, reason]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{name}</td>
                  <td className="px-4 py-3">{service}</td>
                  <td className="px-4 py-3">{reason}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="One API for both — the reference path">
          Parameter Store can return a Secrets Manager secret through the special path{' '}
          <code className="text-core-400">/aws/reference/secretsmanager/</code> followed by the secret name. Code
          that already reads config with <code className="text-core-400">GetParameter</code> can fetch a secret
          the same way — the secret still lives, rotates, and is billed in Secrets Manager.
        </Callout>
        <Example title="Reading a secret through Parameter Store" caption="Requires --with-decryption">
{`aws ssm get-parameter \\
  --name /aws/reference/secretsmanager/de/prod/rds/orders-reader \\
  --with-decryption \\
  --query Parameter.Value --output text

# Returns the same JSON as secretsmanager get-secret-value (AWSCURRENT)`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secrets Manager: credentials with rotation, 64 KB values, resource policies, replication, and DB integrations — about $0.40 per secret per month.',
          'Parameter Store: hierarchical config, free Standard tier with 4 KB values, SecureString for encrypted values without rotation.',
          'Decision rule: not secret → String parameter; rotating, shared, replicated, or large secret → Secrets Manager; small static secret → SecureString.',
          'Common DE split: DB and API credentials in Secrets Manager; batch sizes, S3 prefixes, and feature flags in Parameter Store.',
          'The /aws/reference/secretsmanager/ path lets GetParameter read Secrets Manager secrets with one API.',
        ]}
      />
    </LessonArticle>
  )
}
