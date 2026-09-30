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

export function SecurityEncryptionAccess() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Queues carry sensitive pointers and payloads">
        Ingest queues hold S3 paths, customer IDs, and sometimes full records. Securing them means answering
        three questions: <strong className="text-white">who</strong> can send and receive (IAM and queue
        policies), <strong className="text-white">how</strong> messages are protected at rest and in transit
        (SSE and TLS), and <strong className="text-white">from where</strong> the queue can be reached (VPC
        endpoints). Get these right once in infrastructure-as-code and every new pipeline inherits them.
      </Callout>

      <Definition term="Identity policy vs queue access policy">
        <p>
          An <strong className="text-white">identity policy</strong> attaches to an IAM role or user and says
          what that principal may do. A <strong className="text-white">queue access policy</strong> is a
          resource policy on the queue that says which principals — roles, other accounts, or AWS services like{' '}
          <span className="font-mono text-sm">s3.amazonaws.com</span> and{' '}
          <span className="font-mono text-sm">sns.amazonaws.com</span> — may act on it. Within one account either
          can grant access; across accounts, both sides must allow.
        </p>
      </Definition>

      <LessonSection title="Least-privilege access">
        <ContentStep number={1} title="Split producer and consumer roles">
          <p className="text-slate-300">
            Producers need <span className="font-mono text-sm">sqs:SendMessage</span> (also covers
            SendMessageBatch). Consumers need <span className="font-mono text-sm">sqs:ReceiveMessage</span>,{' '}
            <span className="font-mono text-sm">sqs:DeleteMessage</span>,{' '}
            <span className="font-mono text-sm">sqs:ChangeMessageVisibility</span>, and{' '}
            <span className="font-mono text-sm">sqs:GetQueueAttributes</span> (required by Lambda ESM). Admin
            actions like <span className="font-mono text-sm">SetQueueAttributes</span> and{' '}
            <span className="font-mono text-sm">PurgeQueue</span> belong to the deployment role only.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-account send">
          <p className="text-slate-300">
            A vendor-integration account publishes into{' '}
            <span className="font-mono text-sm">de-orders-ingest-queue-prod</span> in the lake account. The queue
            policy grants the vendor role ARN <span className="font-mono text-sm">sqs:SendMessage</span>; the
            vendor role&apos;s own identity policy must also allow it. Prefer naming a specific role over the whole
            account root.
          </p>
        </ContentStep>
        <Example title="Queue policy — cross-account send plus TLS enforcement" caption="Resource policy on the queue">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "VendorSend",
      "Effect": "Allow",
      "Principal": { "AWS": "arn:aws:iam::444455556666:role/vendor-orders-publisher" },
      "Action": "sqs:SendMessage",
      "Resource": "arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-queue-prod"
    },
    {
      "Sid": "DenyInsecureTransport",
      "Effect": "Deny",
      "Principal": "*",
      "Action": "sqs:*",
      "Resource": "arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-queue-prod",
      "Condition": { "Bool": { "aws:SecureTransport": "false" } }
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Encryption at rest">
        <ContentStep number={1} title="SSE-SQS">
          <p className="text-slate-300">
            SQS-managed encryption keys, no extra cost, no KMS permissions to manage, and enabled by default on
            new queues. Works with S3 and SNS producers without key-policy changes. The right default unless
            compliance requires control of the key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SSE-KMS">
          <p className="text-slate-300">
            Encrypt with the AWS managed key <span className="font-mono text-sm">aws/sqs</span> or a customer
            managed key for audit trails in CloudTrail, key rotation control, and the ability to revoke access by
            editing the key policy. Producers need <span className="font-mono text-sm">kms:GenerateDataKey</span>{' '}
            and <span className="font-mono text-sm">kms:Decrypt</span>; consumers need{' '}
            <span className="font-mono text-sm">kms:Decrypt</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data key reuse period">
          <p className="text-slate-300">
            <span className="font-mono text-sm">KmsDataKeyReusePeriodSeconds</span> (60–86,400, default 300)
            controls how long SQS reuses a data key before calling KMS again. Longer periods cut KMS request cost
            and throttling risk on busy queues; shorter periods limit how much data one key protects.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Service producers need a customer managed key">
          <p className="text-slate-300">
            When S3 notifications, SNS, or EventBridge send to a KMS-encrypted queue, the key policy must allow
            that service principal <span className="font-mono text-sm">kms:GenerateDataKey</span> and{' '}
            <span className="font-mono text-sm">kms:Decrypt</span>. The <span className="font-mono text-sm">aws/sqs</span>{' '}
            key policy cannot be edited, so these integrations silently fail with it — use a customer managed key
            or SSE-SQS.
          </p>
        </ContentStep>
        <Callout variant="info">
          Silent failure is the key phrase: S3 does not surface KMS errors on uploads. If a new S3 → SQS
          integration delivers nothing, check the queue&apos;s encryption key policy before anything else.
        </Callout>
      </LessonSection>

      <LessonSection title="Network paths">
        <ContentStep number={1} title="VPC interface endpoints">
          <p className="text-slate-300">
            Glue jobs, ECS workers, and Lambdas in private subnets reach SQS through an interface endpoint{' '}
            (<span className="font-mono text-sm">com.amazonaws.us-east-1.sqs</span>) — no NAT gateway, traffic
            stays on the AWS network. Endpoint policies can restrict which queues are reachable from the VPC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lock the queue to the endpoint">
          <p className="text-slate-300">
            Add a Deny statement with <span className="font-mono text-sm">aws:SourceVpce</span> so consumers can
            only receive from inside the VPC. Carve out exceptions for service principals like S3 that send from
            outside it.
          </p>
        </ContentStep>
        <Flowchart
          title="Private access path"
          chart={`flowchart LR
  ECS[ECS worker private subnet]
  VPCE[SQS interface endpoint]
  Q[de-orders-ingest-queue-prod]
  KMS[KMS customer key]
  S3[S3 notifications]
  ECS --> VPCE
  VPCE --> Q
  S3 -->|service principal| Q
  Q --> KMS`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Identity policies grant principals; queue policies grant on the resource — cross-account needs both.',
          'Least privilege: producers SendMessage; consumers Receive, Delete, ChangeMessageVisibility, GetQueueAttributes.',
          'SSE-SQS is the free default; SSE-KMS adds key control, CloudTrail audit, and KMS permissions.',
          'S3, SNS, and EventBridge producers need a customer managed key policy — not aws/sqs.',
          'Deny when aws:SecureTransport is false; use VPC interface endpoints and aws:SourceVpce for private access.',
        ]}
      />
    </LessonArticle>
  )
}
