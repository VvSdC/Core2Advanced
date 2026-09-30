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

export function IamTaskRolesAndSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two roles, two jobs — the classic ECS interview question">
        Every ECS task definition can carry two IAM roles, and mixing them up causes the most common permission
        bugs. One role is used by <strong className="text-white">ECS itself</strong> to get your task started. The
        other is used by <strong className="text-white">your Python code</strong> once it is running. Get this
        split right and secrets injection, least privilege, and auditing all fall into place.
      </Callout>

      <Definition term="Task execution role vs task role">
        <p>
          The <strong className="text-white">task execution role</strong>, set in{' '}
          <code className="text-core-400">executionRoleArn</code>, is assumed by the ECS agent to pull the image
          from ECR, create log streams and write to CloudWatch Logs, and fetch values listed in{' '}
          <code className="text-core-400">secrets</code>. The <strong className="text-white">task role</strong>, set
          in <code className="text-core-400">taskRoleArn</code>, is assumed by the application: boto3 inside the
          container receives its temporary credentials and uses them for S3, Glue, DynamoDB, and SQS calls.
        </p>
      </Definition>

      <LessonSection title="Which role needs which permission">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Who performs it</th>
                <th className="px-4 py-3">Role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Pull image from de/orders-export', 'ECS agent before start', 'Execution role'],
                ['Write stdout to /ecs/orders-export', 'awslogs driver', 'Execution role'],
                ['Inject DB_PASSWORD from Secrets Manager', 'ECS agent at start', 'Execution role'],
                ['Decrypt a CMK-encrypted injected secret', 'ECS agent at start', 'Execution role'],
                ['Write Parquet to acme-lake-prod silver', 'Your code', 'Task role'],
                ['Update watermark in DynamoDB', 'Your code', 'Task role'],
                ['Start a Glue crawler', 'Your code', 'Task role'],
                ['Read a secret at runtime with boto3', 'Your code', 'Task role'],
              ].map(([action, who, role]) => (
                <tr key={action} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{action}</td>
                  <td className="px-4 py-3">{who}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="The debugging shortcut">
          <p className="text-slate-300">
            If the task never reaches RUNNING — <code className="text-core-400">CannotPullContainerError</code> or{' '}
            <code className="text-core-400">ResourceInitializationError</code> — look at the execution role and the
            network. If the task runs and your logs show <code className="text-core-400">AccessDenied</code> from
            boto3, look at the task role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Trust policy">
          <p className="text-slate-300">
            Both roles trust the service principal <code className="text-core-400">ecs-tasks.amazonaws.com</code>.
            Add <code className="text-core-400">aws:SourceAccount</code> or{' '}
            <code className="text-core-400">aws:SourceArn</code> conditions to guard against confused-deputy use.
            The AWS managed <code className="text-core-400">AmazonECSTaskExecutionRolePolicy</code> covers ECR and
            logs, but not secrets — add those yourself.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Least-privilege policies">
        <ContentStep number={1} title="Task role scoped to one prefix and one table">
          <p className="text-slate-300">
            One task role per job family. <code className="text-core-400">orders-export-task-role</code> can write
            only to its own silver prefix and update only its watermark table — a bug or compromised dependency
            cannot touch finance data.
          </p>
        </ContentStep>
        <Example title="orders-export task role policy" caption="Scoped S3 prefix, one DynamoDB table, one Glue crawler">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject", "s3:PutObject", "s3:DeleteObject"],
      "Resource": "arn:aws:s3:::acme-lake-prod/silver/orders/*"
    },
    {
      "Effect": "Allow",
      "Action": "s3:ListBucket",
      "Resource": "arn:aws:s3:::acme-lake-prod",
      "Condition": { "StringLike": { "s3:prefix": ["silver/orders/*"] } }
    },
    {
      "Effect": "Allow",
      "Action": ["dynamodb:GetItem", "dynamodb:UpdateItem"],
      "Resource": "arn:aws:dynamodb:us-east-1:111122223333:table/de-pipeline-watermarks-prod"
    },
    {
      "Effect": "Allow",
      "Action": "glue:StartCrawler",
      "Resource": "arn:aws:glue:us-east-1:111122223333:crawler/orders-silver"
    }
  ]
}`}
        </Example>
        <Example title="Extra execution role statement for secrets" caption="Attach alongside AmazonECSTaskExecutionRolePolicy">
{`{
  "Effect": "Allow",
  "Action": ["secretsmanager:GetSecretValue", "ssm:GetParameters", "kms:Decrypt"],
  "Resource": [
    "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/orders-db-*",
    "arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/orders-export/*",
    "arn:aws:kms:us-east-1:111122223333:key/1111aaaa-22bb-33cc-44dd-555566667777"
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Injecting secrets into containers">
        <ContentStep number={1} title="valueFrom syntax">
          <p className="text-slate-300">
            In <code className="text-core-400">containerDefinitions.secrets</code>, each entry has a{' '}
            <code className="text-core-400">name</code> (the environment variable your code reads) and a{' '}
            <code className="text-core-400">valueFrom</code>. For Secrets Manager, append a JSON key to the secret
            ARN to pull one field; for Parameter Store, use the parameter ARN, or its name if it lives in the same
            Region and account.
          </p>
        </ContentStep>
        <Example title="secrets block" caption="Secrets Manager JSON key plus a SecureString parameter">
{`"secrets": [
  {
    "name": "DB_PASSWORD",
    "valueFrom": "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/orders-db-AbCdEf:password::"
  },
  {
    "name": "VENDOR_API_KEY",
    "valueFrom": "arn:aws:ssm:us-east-1:111122223333:parameter/de/prod/orders-export/vendor-api-key"
  }
]`}
        </Example>
        <ContentStep number={2} title="Injected once, at task start">
          <p className="text-slate-300">
            ECS resolves the value when the task starts and places it in the container environment. It does not
            refresh. After a Secrets Manager rotation, a nightly batch task simply picks up the new value on its
            next run; a long-running service needs a new deployment with{' '}
            <code className="text-core-400">--force-new-deployment</code>, or should read the secret at runtime
            with a short cache instead.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Never plaintext environment variables for credentials">
          <p className="text-slate-300">
            Values in <code className="text-core-400">environment</code> are visible to anyone who can describe the
            task definition, and they end up in Git and CloudFormation templates. Passwords, tokens, and API keys
            always go through <code className="text-core-400">secrets</code>. If the secret uses a customer managed
            KMS key, the execution role needs <code className="text-core-400">kms:Decrypt</code> and the key policy
            must allow it.
          </p>
        </ContentStep>
        <Flowchart
          title="Who assumes which role during a task lifecycle"
          chart={`flowchart TB
  START[RunTask orders-export]
  AGENT[ECS agent assumes execution role]
  PULL[Pull image from ECR]
  SEC[Fetch secrets and decrypt with KMS]
  LOGS[Create log stream]
  APP[Container starts]
  CODE[Code uses task role credentials]
  S3[(S3 silver orders)]
  DDB[(DynamoDB watermarks)]
  START --> AGENT
  AGENT --> PULL
  AGENT --> SEC
  AGENT --> LOGS
  PULL --> APP
  SEC --> APP
  APP --> CODE
  CODE --> S3
  CODE --> DDB`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Execution role is for the ECS agent: ECR pull, CloudWatch Logs, and fetching injected secrets.',
          'Task role is for your code: S3, Glue, DynamoDB, SQS — one tightly scoped role per job family.',
          'Stuck before RUNNING points to execution role or network; AccessDenied in app logs points to task role.',
          'Inject credentials with secrets valueFrom a Secrets Manager ARN plus JSON key or an SSM parameter ARN.',
          'Injected values are resolved at task start — redeploy services or read at runtime to pick up rotation.',
        ]}
      />
    </LessonArticle>
  )
}
