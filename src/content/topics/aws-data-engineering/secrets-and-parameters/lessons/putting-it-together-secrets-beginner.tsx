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

export function PuttingItTogetherSecretsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before code, IAM, and rotation">
        You now know why credentials must never be hardcoded, what Secrets Manager and Parameter Store each
        store, how they differ in rotation, size, and cost, and which DE workloads need which secrets. This
        lesson ties those threads into a{' '}
        <strong className="text-white">beginner secrets checklist</strong> — the mental model you need before
        reading secrets in Boto3, designing parameter hierarchies, writing IAM policies, and turning on rotation.
      </Callout>

      <Definition term="Beginner secrets mental model">
        <p>
          A <strong className="text-white">beginner secrets mental model</strong> for DE includes: credentials in
          Secrets Manager with KMS encryption and staging labels, non-secret config in Parameter Store paths per
          environment, pipelines passing only names never values, one IAM role per compute step reading only its
          own secrets, IAM auth preferred wherever AWS supports it, and CloudFormation declaring secrets and
          parameters so every environment matches — all before rotation Lambdas and cross-account sharing.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Credentials in Secrets Manager">
          <p className="text-slate-300">
            <code className="text-core-400">de/prod/rds/orders-reader</code> holds JSON with username, password,
            host, port, and dbname — encrypted with KMS, readers get <code className="text-core-400">AWSCURRENT</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Config in Parameter Store">
          <p className="text-slate-300">
            <code className="text-core-400">/de/prod/orders/batch_size</code> and friends as Standard-tier{' '}
            <code className="text-core-400">String</code> parameters — free, versioned, grouped by path.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Names, not values, in the pipeline">
          <p className="text-slate-300">
            Step Functions input, Glue job arguments, and Lambda environment variables contain only secret names
            and parameter paths — nothing that would be dangerous in execution history or the console.
          </p>
        </ContentStep>
        <ContentStep number={4} title="One role per step">
          <p className="text-slate-300">
            Glue role reads the RDS secret and orders config; Lambda role reads the vendor key; Step Functions
            role starts jobs and reads no secrets.
          </p>
        </ContentStep>
        <ContentStep number={5} title="CloudFormation + IAM">
          <p className="text-slate-300">
            <code className="text-core-400">AWS::SecretsManager::Secret</code> with a generated password and{' '}
            <code className="text-core-400">AWS::SSM::Parameter</code> for config in the platform stack; roles
            scoped to specific secret ARNs and parameter paths — not{' '}
            <code className="text-core-400">secretsmanager:*</code> on all resources.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE secrets stack"
          chart={`flowchart TD
  CFN[CloudFormation stack] --> SEC[Secret de prod rds orders-reader]
  CFN --> KEY[Secret de prod vendor api-key]
  CFN --> PAR[Parameter de prod orders batch_size]
  SF[Step Functions] --> GLUE[Glue orders job]
  SF --> LAM[Lambda vendor ingest]
  GLUE --> SEC
  GLUE --> PAR
  LAM --> KEY
  GLUE --> RDS[RDS orders DB]
  LAM --> API[Vendor API]
  GLUE --> S3[S3 curated]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Why never hardcode a credential?">
          <p className="text-slate-300">
            It leaks through Git history, logs, job arguments, env vars, and execution history — and hardcoded
            copies make rotation a risky hunt.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What is Secrets Manager in one sentence?">
          <p className="text-slate-300">
            A managed, KMS-encrypted store for credentials up to 64 KB with versions, staging labels, and
            built-in rotation — about $0.40 per secret per month.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWSCURRENT vs AWSPREVIOUS vs AWSPENDING">
          <p className="text-slate-300">
            Current value apps read; last good value for rollback; new value being tested during rotation.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Parameter types and tiers">
          <p className="text-slate-300">
            String, StringList, SecureString; Standard is free with 4 KB values, Advanced allows 8 KB and
            policies for a monthly fee.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Which service for which value?">
          <p className="text-slate-300">
            Rotating or shared credentials → Secrets Manager; plain config → Parameter Store String; small static
            secret → SecureString.
          </p>
        </ContentStep>
        <ContentStep number={6} title="When is no secret the right answer?">
          <p className="text-slate-300">
            When IAM auth works — S3, DynamoDB, Athena via roles; RDS IAM auth tokens; Redshift temporary
            credentials or the Data API.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when Glue gets AccessDenied reading a secret?">
          <p className="text-slate-300">
            Check the role has <code className="text-core-400">secretsmanager:GetSecretValue</code> on that
            secret ARN <em>and</em> <code className="text-core-400">kms:Decrypt</code> on its key — a missing KMS
            permission is the classic customer-managed-key surprise.
          </p>
        </ContentStep>
        <Example title="Beginner secrets concept drill" caption="No console required yet — explain aloud">
{`1. Draw: Step Functions → Glue role → Secrets Manager → RDS, plus Lambda role → vendor key
2. Name four places a hardcoded password leaks from in a DE pipeline
3. Why is a Lambda env var not safe for a database password?
4. What does AWSPENDING mean, and who reads it?
5. Where would you store batch_size, and where the Redshift loader password?
6. What does /aws/reference/secretsmanager/ let you do?
7. How do secrets fit after Step Functions in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong beginners ask three questions for every value: is it secret, does it need rotation, and which
          role truly needs it — getting the third one wrong is how dev roles end up reading prod passwords.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme deploys CloudFormation stack <code className="text-core-400">acme-de-platform-prod</code>, which
          creates secret <code className="text-core-400">de/prod/rds/orders-reader</code> with a generated
          password, secret <code className="text-core-400">de/prod/vendor/acme-api-key</code> with a placeholder
          the vendor team fills in, and parameter <code className="text-core-400">/de/prod/orders/batch_size</code>{' '}
          set to <code className="text-core-400">5000</code>. Step Functions workflow{' '}
          <code className="text-core-400">orders-nightly</code> starts with input containing only{' '}
          <code className="text-core-400">env: prod</code>. Lambda{' '}
          <code className="text-core-400">de-vendor-ingest</code> reads the API key, pulls the vendor feed, and
          writes raw JSON to S3. Glue job <code className="text-core-400">orders-extract</code> reads the RDS
          secret and batch size, extracts orders over JDBC, and writes Parquet to{' '}
          <code className="text-core-400">silver/orders/</code>. No password appears in the ASL, job arguments,
          logs, or execution history. When the vendor rotates the key, the team updates the secret once — the next
          run picks it up without a deploy.
        </p>
        <ContentStep number={1} title="Infrastructure tier — CloudFormation">
          <p className="text-slate-300">Secrets, parameters, KMS key, IAM roles — Git-reviewed, identical per env.</p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration tier — Step Functions">
          <p className="text-slate-300">Passes environment and names only — execution history stays clean.</p>
        </ContentStep>
        <ContentStep number={3} title="Access tier — IAM roles + KMS">
          <p className="text-slate-300">Glue and Lambda each read only their own secrets and paths.</p>
        </ContentStep>
        <ContentStep number={4} title="Data tier — RDS, vendor API, S3">
          <p className="text-slate-300">Credentials fetched at runtime, held in memory, never logged.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate lessons go hands-on on the topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Reading secrets in code">
          <p className="text-slate-300">
            Boto3 <code className="text-core-400">get_secret_value</code> and{' '}
            <code className="text-core-400">get_parameter</code> from Lambda and Glue, JSON parsing, error
            handling, and keeping values out of logs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parameter hierarchies and environments">
          <p className="text-slate-300">
            Path design like <code className="text-core-400">/de/prod/orders</code>,{' '}
            <code className="text-core-400">GetParametersByPath</code>, and dev/prod parity.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and resource policies">
          <p className="text-slate-300">
            Least privilege on secret ARNs and parameter paths, <code className="text-core-400">kms:Decrypt</code>,
            and resource policies for cross-account readers.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Secret rotation">
          <p className="text-slate-300">
            Managed rotation for RDS and Redshift, rotation Lambdas for vendor keys, schedules, and how staging
            labels move during a rotation.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Before your first prod secret">
          Write the inventory table first — name, service, owner, rotation schedule, reader roles. Teams that
          skip it end up with orphaned secrets nobody dares to delete and roles that read far more than they need.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: credentials in Secrets Manager, config in Parameter Store, names not values in pipelines, one role per step, CloudFormation + IAM.',
          'Self-check: leak paths, Secrets Manager basics and staging labels, parameter types and tiers, the DE split, IAM auth, AccessDenied debug order.',
          'End-to-end: CloudFormation creates secrets and parameters → Step Functions passes env → Glue and Lambda fetch at runtime → RDS, API, S3.',
          'Next: reading secrets in code, parameter hierarchies, IAM and resource policies, and rotation.',
        ]}
      />
    </LessonArticle>
  )
}
