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

export function WhatIsParameterStore() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A labeled filing cabinet for pipeline config">
        Not everything a pipeline needs is a secret. Batch sizes, S3 prefixes, target schema names, feature
        flags, and alert thresholds change per environment and should never be hardcoded either.{' '}
        <strong className="text-white">Parameter Store</strong> gives every one of those values a clear path
        like <code className="text-core-400">/de/prod/orders/batch_size</code>, version history, IAM control,
        and — for the standard tier — no storage cost.
      </Callout>

      <Definition term="AWS Systems Manager Parameter Store">
        <p>
          <strong className="text-white">Parameter Store</strong> is a capability of AWS Systems Manager that
          stores named values in a hierarchy of paths. Each parameter has a type —{' '}
          <code className="text-core-400">String</code>, <code className="text-core-400">StringList</code>, or{' '}
          <code className="text-core-400">SecureString</code> — a tier, a version history, and optional labels.
          Code reads parameters at runtime with <code className="text-core-400">GetParameter</code> or fetches a
          whole subtree with <code className="text-core-400">GetParametersByPath</code>.
        </p>
      </Definition>

      <LessonSection title="Parameter types">
        <ContentStep number={1} title="String">
          <p className="text-slate-300">
            A plain text value — <code className="text-core-400">5000</code> for a batch size or{' '}
            <code className="text-core-400">s3://acme-lake-prod/raw/orders/</code> for a landing prefix. Visible
            to anyone allowed to read the parameter.
          </p>
        </ContentStep>
        <ContentStep number={2} title="StringList">
          <p className="text-slate-300">
            A comma-separated list stored as one value — for example allowed vendor codes{' '}
            <code className="text-core-400">acme,globex,initech</code>. Your code splits it on commas.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SecureString">
          <p className="text-slate-300">
            A value encrypted with KMS — the AWS managed key <code className="text-core-400">aws/ssm</code> by
            default or a customer managed key. Reads return ciphertext unless the caller passes{' '}
            <code className="text-core-400">--with-decryption</code> and has{' '}
            <code className="text-core-400">kms:Decrypt</code> on the key.
          </p>
        </ContentStep>
        <Callout variant="insight">
          SecureString is encrypted, but it has no built-in rotation. It suits a static webhook token or a
          low-risk key; database credentials that should rotate belong in Secrets Manager.
        </Callout>
      </LessonSection>

      <LessonSection title="Standard vs Advanced tier">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">Advanced</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Storage cost', 'Free', 'Charged per advanced parameter per month'],
                ['Max value size', '4 KB', '8 KB'],
                ['Parameters per account and Region', 'Up to 10,000', 'Up to 100,000'],
                ['Parameter policies', 'Not supported', 'Expiration, expiration notification, no-change notification'],
                ['Switching', 'Can be upgraded to Advanced', 'Cannot be downgraded — delete and recreate instead'],
              ].map(([aspect, standard, advanced]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{standard}</td>
                  <td className="px-4 py-3">{advanced}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Default to Standard">
          Almost all DE config — batch sizes, prefixes, flags — fits in 4 KB and stays free on the Standard tier.
          Reach for Advanced only when you need a value larger than 4 KB or an expiration policy.
        </Callout>
      </LessonSection>

      <LessonSection title="Hierarchies, versions, labels, and public parameters">
        <ContentStep number={1} title="Paths as a hierarchy">
          <p className="text-slate-300">
            Names like <code className="text-core-400">/de/prod/orders/batch_size</code> and{' '}
            <code className="text-core-400">/de/prod/orders/landing_prefix</code> form a tree. One call to{' '}
            <code className="text-core-400">GetParametersByPath</code> on{' '}
            <code className="text-core-400">/de/prod/orders</code> loads all orders config, and IAM can allow a
            role access to just that path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Versions and labels">
          <p className="text-slate-300">
            Every overwrite creates a new version number, and Parameter Store keeps the latest 100 versions. You
            can attach labels like <code className="text-core-400">stable</code> to a version and read{' '}
            <code className="text-core-400">/de/prod/orders/batch_size:stable</code> — useful for quick rollback.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Public parameters">
          <p className="text-slate-300">
            AWS publishes values under <code className="text-core-400">/aws/service/</code> — for example the
            latest Amazon Linux AMI ID — so CloudFormation templates for EC2-based tools never hardcode an AMI.
          </p>
        </ContentStep>
        <Flowchart
          title="Parameter hierarchy for one pipeline"
          chart={`flowchart TD
  ROOT[de] --> DEV[dev]
  ROOT --> PROD[prod]
  PROD --> ORD[orders]
  ORD --> BS[batch_size 5000]
  ORD --> LP[landing_prefix]
  ORD --> FF[enable_dedup true]
  DEV --> ORDD[orders]
  ORDD --> BSD[batch_size 100]`}
        />
      </LessonSection>

      <LessonSection title="Hands-on — CLI and throughput">
        <Example title="Put and get parameters" caption="AWS CLI — String and SecureString">
{`# Plain config value
aws ssm put-parameter \\
  --name /de/prod/orders/batch_size \\
  --type String --value 5000

# Encrypted value with the default aws/ssm key
aws ssm put-parameter \\
  --name /de/prod/vendor/webhook_token \\
  --type SecureString --value REPLACE_ME

# Update an existing parameter — creates version 2
aws ssm put-parameter --name /de/prod/orders/batch_size \\
  --type String --value 8000 --overwrite

# Read values
aws ssm get-parameter --name /de/prod/orders/batch_size
aws ssm get-parameter --name /de/prod/vendor/webhook_token --with-decryption

# Load the whole orders subtree
aws ssm get-parameters-by-path --path /de/prod/orders --recursive`}
        </Example>
        <ContentStep number={1} title="Default throughput">
          <p className="text-slate-300">
            By default Parameter Store allows roughly 40 get requests per second per account and Region, shared
            across callers. Hundreds of concurrent Lambdas reading on every invocation can hit{' '}
            <code className="text-core-400">ThrottlingException</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Higher throughput setting">
          <p className="text-slate-300">
            Enabling higher throughput raises the limit substantially (up to 10,000 requests per second) and
            charges per API interaction. Caching values in the Lambda execution environment is usually the
            cheaper first fix.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Parameter Store is part of AWS Systems Manager — named values in path hierarchies, read at runtime under IAM.',
          'Types: String, StringList, and SecureString (KMS-encrypted, needs --with-decryption and kms:Decrypt).',
          'Standard tier is free with 4 KB values and up to 10,000 parameters; Advanced tier allows 8 KB and policies, and is charged.',
          'Paths like /de/prod/orders enable GetParametersByPath and path-scoped IAM; versions and labels support rollback.',
          'Default throughput is modest — cache values or enable higher throughput for high-concurrency Lambdas.',
        ]}
      />
    </LessonArticle>
  )
}
