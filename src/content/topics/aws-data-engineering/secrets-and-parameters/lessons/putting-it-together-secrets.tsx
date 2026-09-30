import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Secrets & parameters for DE — retrieval, IAM, rotation, and pipeline hygiene">
        You covered reading secrets in Lambda and Glue, parameter hierarchies across environments, IAM and
        resource policies, rotation, Glue connections backed by secrets, caching and the Lambda extension,
        CloudFormation dynamic references, cross-account and multi-region sharing, auditing, and pipeline
        patterns. This checkpoint ties intermediate and advanced lessons together before{' '}
        <strong className="text-white">AWS KMS</strong> — the keys that encrypt every secret and SecureString.
      </Callout>

      <Definition term="Secrets mental model for data engineering">
        <p>
          <strong className="text-white">Secrets Manager</strong> holds credentials that rotate — database
          users, API keys — and <strong className="text-white">Parameter Store</strong> holds hierarchical config
          and simple secure strings. Pipelines pass names and paths, compute roles fetch values at runtime with
          least-privilege IAM plus <code className="text-core-400">kms:Decrypt</code>, rotation keeps leaked
          copies short-lived, caching keeps high-rate code cheap, and CloudTrail plus Config prove it all
          happened — values never land in templates, job arguments, execution history, or logs.
        </p>
      </Definition>

      <LessonSection title="Secrets sub-topic map">
        <Flowchart
          title="Secrets and parameters lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Secrets and parameters path]
  START --> RSC[Reading secrets in code]
  START --> PHE[Parameter hierarchies]
  START --> IAM[IAM and resource policies]
  START --> ROT[Secret rotation]
  START --> GLC[Glue connections]
  START --> CCH[Caching and extension]
  START --> CFN[CloudFormation references]
  START --> XAR[Cross account multi region]
  START --> AUD[Auditing and monitoring]
  START --> PIPE[Secrets in pipelines]
  RSC --> KMSNEXT
  PHE --> KMSNEXT
  IAM --> KMSNEXT
  ROT --> KMSNEXT
  GLC --> KMSNEXT
  CCH --> KMSNEXT
  CFN --> KMSNEXT
  XAR --> KMSNEXT
  AUD --> KMSNEXT
  PIPE --> KMSNEXT
  KMSNEXT[AWS KMS next]`}
        />
      </LessonSection>

      <LessonSection title="Full secrets checkpoint — can you explain…">
        <ContentStep number={1} title="Retrieval in code">
          <p className="text-slate-300">
            How does a Lambda read <code className="text-core-400">de/prod/rds/orders-reader</code> once per
            container? Why does <code className="text-core-400">get_parameter</code> need{' '}
            <code className="text-core-400">WithDecryption=True</code>? What do ResourceNotFound, AccessDenied, and
            DecryptionFailure each point to?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hierarchies and environments">
          <p className="text-slate-300">
            Why put the environment high in <code className="text-core-400">/de/prod/orders/batch_size</code>? How
            do labels give safe rollout and rollback? How does one IAM statement scope a role to prod config?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Access control">
          <p className="text-slate-300">
            Why the <code className="text-core-400">-??????</code> suffix wildcard on secret ARNs? What does{' '}
            <code className="text-core-400">kms:ViaService</code> prevent? How do resource policies and tag-based
            ABAC complement identity policies?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Rotation and caching">
          <p className="text-slate-300">
            Walk through createSecret, setSecret, testSecret, finishSecret and the staging labels. Why do alternating
            users protect a four-hour Glue job? How do caches and the Lambda extension stay correct after rotation?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Infrastructure and sharing">
          <p className="text-slate-300">
            How does a Glue connection use SECRET_ID from a private subnet? Where can ssm-secure dynamic references
            be used? What three policies does cross-account sharing need, and how do replica secrets support DR?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations and pipeline hygiene">
          <p className="text-slate-300">
            How do you alert on RotationFailed? Which Config rules catch missing rotation and unused secrets? Why
            must Step Functions input carry ARNs, not passwords — and what is step one when a key leaks?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Secrets Manager vs Parameter Store?',
                  'SM: rotation, cross-account policies, replicas, per-secret cost. SSM: hierarchical config, cheap or free standard tier.',
                ],
                [
                  'Where to fetch in Lambda?',
                  'Module scope or a TTL cache — reused across warm invocations; name in env var, value in memory only.',
                ],
                [
                  'GetParametersByPath use case?',
                  'Load all config under /de/prod/orders/ with Recursive=True and a paginator.',
                ],
                [
                  'Why -?????? in secret ARNs?',
                  'Secrets Manager adds a random 6-character suffix; ? matches exactly one character, avoiding over-broad *.',
                ],
                [
                  'What does kms:ViaService do?',
                  'Allows Decrypt only when the request comes through Secrets Manager or SSM, not direct KMS calls.',
                ],
                [
                  'Rotation steps?',
                  'createSecret AWSPENDING, setSecret in DB, testSecret, finishSecret moves AWSCURRENT; old gets AWSPREVIOUS.',
                ],
                [
                  'Single vs alternating users?',
                  'Alternating keeps the previous user valid until next rotation — no lockout for long-running jobs.',
                ],
                [
                  'Glue in private subnet cannot read secret?',
                  'Add Secrets Manager interface endpoint or NAT; self-referencing SG; role needs GetSecretValue and kms:Decrypt.',
                ],
                [
                  'Lambda extension basics?',
                  'localhost:2773, X-Aws-Parameters-Secrets-Token header from AWS_SESSION_TOKEN, TTL env vars.',
                ],
                [
                  'Secrets in CloudFormation?',
                  'Dynamic references or GenerateSecretString; never literal values, NoEcho defaults, or Outputs.',
                ],
                [
                  'Cross-account secret sharing?',
                  'Secret resource policy + CMK key policy + consumer identity policy; full ARN; not aws/secretsmanager key.',
                ],
                [
                  'Leaked DB password — first move?',
                  'Rotate immediately, then investigate CloudTrail and DB logs, scrub Git and logs, find the escape path.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for KMS when…">
          You can whiteboard a Glue job reading a rotated RDS secret through a VPC endpoint, write its
          least-privilege IAM policy with the ARN suffix wildcard and kms:ViaService, and explain why Step
          Functions carries only the secret ARN — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — AWS KMS">
        <p className="text-slate-300">
          Every secret in Secrets Manager and every SecureString in Parameter Store is encrypted with a{' '}
          <strong className="text-white">KMS key</strong> — and you have already met{' '}
          <code className="text-core-400">kms:Decrypt</code>, key policies for cross-account sharing, and the
          limits of the AWS managed key. <strong className="text-white">AWS KMS</strong> goes deeper: customer
          managed keys, key policies versus IAM, grants, rotation of the keys themselves, and envelope encryption
          that protects S3 lake objects, Glue job bookmarks and catalogs, and Redshift clusters.
        </p>
        <Flowchart
          title="After secrets — course thread"
          chart={`flowchart LR
  SEC[Secrets checkpoint]
  KMS[AWS KMS keys]
  SM[Secrets Manager]
  SSM[SecureString parameters]
  S3[(S3 lake SSE-KMS)]
  GLUE[Glue encryption]
  RS[(Redshift encryption)]
  SEC --> KMS
  KMS --> SM
  KMS --> SSM
  KMS --> S3
  KMS --> GLUE
  KMS --> RS`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, debugging an AccessDenied or DecryptionFailure from a Glue
          job, or preparing a security review — most answers trace back to IAM scope, KMS permissions, rotation
          labels, and reference passing covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Secrets Manager for rotating credentials, Parameter Store for hierarchical config — both fetched at runtime by IAM roles.',
          'Intermediate: Boto3 retrieval, /de/env/pipeline paths, least-privilege IAM with kms:Decrypt, rotation labels.',
          'Advanced: Glue SECRET_ID connections, caching and the Lambda extension, dynamic references, cross-account and replicas.',
          'Operations: CloudTrail audit, RotationFailed alerts, Config rules, and a rotate-first leak runbook.',
          'Next sub-topic: AWS KMS — key policies, customer managed keys, and envelope encryption across S3, Glue, and Redshift.',
        ]}
      />
    </LessonArticle>
  )
}
