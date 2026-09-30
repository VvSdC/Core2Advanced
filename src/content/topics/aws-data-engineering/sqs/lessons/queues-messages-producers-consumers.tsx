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

export function QueuesMessagesProducersConsumers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Four building blocks, every SQS design">
        Every SQS architecture diagram — from a single-file ingest Lambda to a multi-team fan-out — is built
        from the same four pieces: a <strong className="text-white">queue</strong>, the{' '}
        <strong className="text-white">messages</strong> inside it, the{' '}
        <strong className="text-white">producers</strong> that send them, and the{' '}
        <strong className="text-white">consumers</strong> that poll and delete them. Learn what each one
        carries and you can read any queue-based pipeline at a glance.
      </Callout>

      <Definition term="Queue, message, producer, consumer">
        <p>
          A <strong className="text-white">queue</strong> is a named, regional container identified by a URL
          and an ARN. A <strong className="text-white">message</strong> is a text body up to 1 MiB plus
          optional attributes. A <strong className="text-white">producer</strong> is any AWS service or
          application that calls <code className="text-core-400">SendMessage</code>. A{' '}
          <strong className="text-white">consumer</strong> is any process that calls{' '}
          <code className="text-core-400">ReceiveMessage</code>, does the work, and calls{' '}
          <code className="text-core-400">DeleteMessage</code>.
        </p>
      </Definition>

      <LessonSection title="The queue — URL and ARN">
        <p className="text-slate-300">
          A queue has two identifiers, and you use them in different places. Mixing them up is one of the most
          common beginner errors in IAM policies and Boto3 code.
        </p>
        <ContentStep number={1} title="Queue URL — for API calls">
          <p className="text-slate-300">
            SDK and CLI calls take the URL, e.g.{' '}
            <code className="text-core-400">
              https://sqs.us-east-1.amazonaws.com/123456789012/de-orders-ingest-queue-prod
            </code>
            . Store it in a Lambda environment variable rather than hard-coding it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Queue ARN — for permissions and wiring">
          <p className="text-slate-300">
            IAM policies, S3 event notifications, SNS subscriptions, and Lambda event source mappings reference
            the ARN:{' '}
            <code className="text-core-400">
              arn:aws:sqs:us-east-1:123456789012:de-orders-ingest-queue-prod
            </code>
            .
          </p>
        </ContentStep>
        <ContentStep number={3} title="Queue settings live on the queue">
          <p className="text-slate-300">
            Visibility timeout, retention period, max message size, encryption, and the DLQ redrive policy are
            queue attributes — every message on that queue inherits them.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Anatomy of a message">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Part</th>
                <th className="px-4 py-3">What it is</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Body',
                  'The payload — text up to 1 MiB (256 KiB before August 2025), usually JSON. For DE, a pointer like an S3 bucket and key, never the file bytes',
                ],
                [
                  'Message ID',
                  'Unique ID SQS assigns when the message is sent — stable for the life of the message, useful in logs',
                ],
                [
                  'Receipt handle',
                  'Token returned on each receive — required to delete the message; changes every time the message is received',
                ],
                [
                  'Message attributes',
                  'Up to 10 typed key-value pairs you set, e.g. dataset=orders or source=vendor-acme — readable without parsing the body',
                ],
                [
                  'System attributes',
                  'Set by SQS — SentTimestamp, ApproximateReceiveCount, ApproximateFirstReceiveTimestamp',
                ],
              ].map(([part, meaning]) => (
                <tr key={part} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{part}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="A typical DE message as a consumer sees it" caption="Body is a pointer to S3 — the file stays in the lake">
{`{
  "MessageId": "7b1c2f0e-4a9d-4c1e-9f2a-2d6f8e1a3b77",
  "ReceiptHandle": "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a...",
  "Body": "{\\"bucket\\": \\"acme-lake-prod\\", \\"key\\": \\"raw/orders/2026-09-30.csv\\", \\"size\\": 48213345}",
  "Attributes": {
    "SentTimestamp": "1790752200000",
    "ApproximateReceiveCount": "1"
  },
  "MessageAttributes": {
    "dataset": { "DataType": "String", "StringValue": "orders" }
  }
}`}
        </Example>
        <Callout variant="tip">
          <code className="text-core-400">ApproximateReceiveCount</code> greater than 1 means this message was
          received before and not deleted — a retry. Log it; it is your first clue when a file is being
          processed repeatedly.
        </Callout>
      </LessonSection>

      <LessonSection title="Producers — who sends messages">
        <ContentStep number={1} title="S3 event notifications">
          <p className="text-slate-300">
            The bucket sends an ObjectCreated event straight to the queue when a file lands under a prefix like{' '}
            <code className="text-core-400">raw/orders/</code>. The queue policy must allow the S3 service
            principal for that bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EventBridge rules">
          <p className="text-slate-300">
            A rule matches S3, Glue job state change, or custom events and targets the queue — useful when you
            need content filtering before work is queued.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SNS subscriptions">
          <p className="text-slate-300">
            An SNS topic delivers a copy to each subscribed queue — the fan-out pattern from the SNS module.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Your own applications">
          <p className="text-slate-300">
            A Python extractor, an API backend, or a Step Functions task calls{' '}
            <code className="text-core-400">SendMessage</code> directly with Boto3 to enqueue work items.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Consumers — who does the work">
        <ContentStep number={1} title="Lambda via event source mapping">
          <p className="text-slate-300">
            The most common DE consumer. AWS polls the queue and invokes your function with batches of up to
            10 messages by default; successful batches are deleted for you.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EC2 or ECS workers">
          <p className="text-slate-300">
            Long-running containers loop on <code className="text-core-400">ReceiveMessage</code> — the right
            choice when one file takes longer than Lambda&apos;s 15-minute limit or needs lots of memory.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue trigger Lambda">
          <p className="text-slate-300">
            Glue does not read SQS directly. A small Lambda consumes the message, checks DynamoDB for
            duplicates, and calls <code className="text-core-400">glue:StartJobRun</code> with the S3 path as a
            job argument.
          </p>
        </ContentStep>
        <Flowchart
          title="Producers → queue → consumers"
          chart={`flowchart LR
  S3[S3 notification] --> Q[(SQS queue)]
  EB[EventBridge rule] --> Q
  SNS[SNS topic] --> Q
  APP[App or Boto3] --> Q
  Q --> LAM[Lambda ESM]
  Q --> ECS[ECS or EC2 worker]
  Q --> GT[Glue trigger Lambda]
  GT --> GLUE[Glue job]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use the queue URL in SDK/CLI calls and the queue ARN in IAM policies, S3 notifications, SNS subscriptions, and Lambda mappings.',
          'A message has a body (up to 1 MiB), a stable message ID, a per-receive receipt handle, and optional attributes.',
          'DE messages carry pointers — bucket and key — not file contents.',
          'Producers: S3 notifications, EventBridge, SNS, and your own apps. Consumers: Lambda ESM, ECS/EC2 workers, Glue trigger Lambdas.',
          'ApproximateReceiveCount above 1 signals a retry — log it when debugging repeated processing.',
        ]}
      />
    </LessonArticle>
  )
}
