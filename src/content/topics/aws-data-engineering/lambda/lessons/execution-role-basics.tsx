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

export function ExecutionRoleBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same IAM story, new principal">
        Every Lambda function must have an <strong className="text-white">execution role</strong> — an
        IAM role Lambda assumes before your handler runs. If the role cannot{' '}
        <code className="text-core-400">s3:GetObject</code> on the landing prefix, boto3 fails with
        AccessDenied even when your Python logic is perfect. This lesson ties Lambda to the IAM track
        with a least-privilege S3 example.
      </Callout>

      <Definition term="Lambda execution role">
        <p>
          The <strong className="text-white">execution role</strong> is the IAM identity your function
          code runs as. Its <strong className="text-white">trust policy</strong> allows the principal{' '}
          <code className="text-core-400">lambda.amazonaws.com</code> to assume the role. Its{' '}
          <strong className="text-white">permissions policies</strong> grant API actions — S3 read/write,
          Glue start, CloudWatch Logs, Secrets Manager get — scoped to specific ARNs.
        </p>
      </Definition>

      <LessonSection title="How Lambda gets credentials">
        <ContentStep number={1} title="Automatic at invoke time">
          <p className="text-slate-300">
            When an invocation starts, Lambda calls STS, receives temporary credentials, and exposes them
            to boto3 inside the runtime — same temporary credential pattern as EC2 instance profiles,
            no access keys in your zip.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudWatch Logs permission">
          <p className="text-slate-300">
            Almost every function needs{' '}
            <code className="text-core-400">logs:CreateLogGroup</code>,{' '}
            <code className="text-core-400">logs:CreateLogStream</code>, and{' '}
            <code className="text-core-400">logs:PutLogEvents</code>. The managed policy{' '}
            <code className="text-core-400">AWSLambdaBasicExecutionRole</code> attaches these — add it
            unless you enjoy silent failures with no logs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One role per function (usually)">
          <p className="text-slate-300">
            Split roles when S3 paths differ: a raw validator reads{' '}
            <code className="text-core-400">raw/incoming/*</code> only; a Glue starter needs{' '}
            <code className="text-core-400">glue:StartJobRun</code> but maybe no S3 write. Shared
            mega-roles violate least privilege and complicate audits.
          </p>
        </ContentStep>
        <Flowchart
          title="Execution role at invocation"
          chart={`flowchart LR
  INV[Invocation starts]
  INV --> L[Lambda assumes execution role]
  L --> STS[STS temporary credentials]
  STS --> B[boto3 in handler]
  B --> S3[S3 GetObject PutObject]
  B --> CW[CloudWatch Logs]
  B --> G[Glue StartJobRun optional]`}
        />
      </LessonSection>

      <LessonSection title="Least privilege — S3 read/write example">
        <p className="text-slate-300">
          Scenario: function triggered by uploads to{' '}
          <code className="text-core-400">company-lake-dev</code>, reads from{' '}
          <code className="text-core-400">raw/incoming/</code>, writes validated Parquet to{' '}
          <code className="text-core-400">processed/orders/</code>.
        </p>
        <ContentStep number={1} title="ListBucket on the bucket ARN">
          <p className="text-slate-300">
            <code className="text-core-400">s3:ListBucket</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev</code> with a{' '}
            <code className="text-core-400">s3:prefix</code> condition limiting to{' '}
            <code className="text-core-400">raw/incoming/</code> if you list objects — many handlers only
            GetObject by key from the event and skip ListBucket entirely.
          </p>
        </ContentStep>
        <ContentStep number={2} title="GetObject on read prefix">
          <p className="text-slate-300">
            Allow <code className="text-core-400">s3:GetObject</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev/raw/incoming/*</code> — not{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev/*</code> unless you truly need
            every prefix.
          </p>
        </ContentStep>
        <ContentStep number={3} title="PutObject on write prefix">
          <p className="text-slate-300">
            Allow <code className="text-core-400">s3:PutObject</code> (and optionally{' '}
            <code className="text-core-400">s3:AbortMultipartUpload</code>) on{' '}
            <code className="text-core-400">arn:aws:s3:::company-lake-dev/processed/orders/*</code> only.
            Deny write to <code className="text-core-400">curated/</code> from this ingestion role.
          </p>
        </ContentStep>
        <Example title="Minimal permissions policy excerpt" caption="Illustrative — tighten ARNs for your account">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": ["s3:GetObject"],
      "Resource": "arn:aws:s3:::company-lake-dev/raw/incoming/*"
    },
    {
      "Effect": "Allow",
      "Action": ["s3:PutObject"],
      "Resource": "arn:aws:s3:::company-lake-dev/processed/orders/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
      ],
      "Resource": "arn:aws:logs:*:*:*"
    }
  ]
}`}
        </Example>
        <Example title="Trust policy excerpt" caption="Required on the role — not on the function">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": { "Service": "lambda.amazonaws.com" },
      "Action": "sts:AssumeRole"
    }
  ]
}`}
        </Example>
        <Callout variant="tip" title="S3 trigger permission is separate">
          S3 needs permission to <em>invoke</em> your function — a resource-based policy on the Lambda
          function allowing <code className="text-core-400">s3.amazonaws.com</code>. That is not the
          execution role — both sides must be configured (covered in the triggers lesson).
        </Callout>
      </LessonSection>

      <LessonSection title="Common DE mistakes">
        <ContentStep number={1} title="AmazonS3FullAccess on ingestion">
          <p className="text-slate-300">
            Console wizards make pipelines work fast and audits painful. Replace full access with prefix-scoped
            policies before prod — same discipline as EC2 and Glue job roles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Wrong trust principal">
          <p className="text-slate-300">
            An EC2 instance profile role cannot attach as a Lambda execution role without changing trust
            to <code className="text-core-400">lambda.amazonaws.com</code>. Copy policies, not roles,
            between services.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Missing PassRole when humans deploy">
          <p className="text-slate-300">
            Engineers creating functions via CLI need <code className="text-core-400">iam:PassRole</code>{' '}
            on the execution role ARN — IAM lesson recap. Lambda will reject create/update without it.
          </p>
        </ContentStep>
        <Callout variant="insight">
          When boto3 raises AccessDenied, check: (1) execution role permissions, (2) KMS key policy if
          bucket uses SSE-KMS, (3) bucket policy explicit Deny, (4) SCP at org level. Role issues are
          still the most common fix for beginners.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Execution role = trust lambda.amazonaws.com + permissions for S3, logs, Glue, etc.',
          'Lambda injects temporary creds — boto3 uses the role automatically; no keys in code.',
          'Least privilege: GetObject on raw/incoming/*, PutObject on processed/orders/*, plus basic logging.',
          'S3 invoke permission on the function is separate from the execution role — both required for triggers.',
        ]}
      />
    </LessonArticle>
  )
}
