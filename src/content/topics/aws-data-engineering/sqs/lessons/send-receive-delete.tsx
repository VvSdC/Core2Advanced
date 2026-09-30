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

export function SendReceiveDelete() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three API calls run every queue">
        Almost everything you do with SQS comes down to three calls:{' '}
        <code className="text-core-400">SendMessage</code>,{' '}
        <code className="text-core-400">ReceiveMessage</code>, and{' '}
        <code className="text-core-400">DeleteMessage</code>. The surprise for beginners is that receiving a
        message does <strong className="text-white">not</strong> remove it. Until you delete it, SQS assumes
        the work might have failed and will hand it out again.
      </Callout>

      <Definition term="Message lifecycle">
        <p>
          A message is <strong className="text-white">available</strong> after it is sent. When a consumer
          receives it, it becomes <strong className="text-white">in flight</strong> — hidden from other
          consumers for the visibility timeout (default 30 seconds, max 12 hours). If the consumer calls{' '}
          <code className="text-core-400">DeleteMessage</code> with the receipt handle, the message is gone for
          good. If not, it becomes available again when the timeout expires.
        </p>
      </Definition>

      <LessonSection title="The lifecycle in one picture">
        <Flowchart
          title="Send → in flight → delete or retry"
          chart={`flowchart LR
  P[Producer] -->|SendMessage| AV[Available in queue]
  AV -->|ReceiveMessage| FL[In flight hidden]
  FL -->|DeleteMessage with receipt handle| DONE((Gone))
  FL -->|visibility timeout expires| AV
  AV -->|retention expires| EXP((Expired))`}
        />
        <p className="mt-4 text-slate-300">
          Retention (1 minute to 14 days, default 4 days) is the outer limit: a message nobody deletes is
          eventually dropped. Visibility timeout is the inner loop: how long one consumer gets before the
          message is offered to someone else.
        </p>
      </LessonSection>

      <LessonSection title="Console walkthrough">
        <ContentStep number={1} title="Create the queue">
          <p className="text-slate-300">
            SQS console → Create queue → Standard → name{' '}
            <code className="text-core-400">de-orders-ingest-queue-dev</code>. Leave visibility timeout at 30
            seconds and retention at 4 days for now.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Send a message">
          <p className="text-slate-300">
            Open the queue → Send and receive messages → paste a body like{' '}
            <code className="text-core-400">
              {'{"bucket": "acme-lake-dev", "key": "raw/orders/2026-09-30.csv"}'}
            </code>{' '}
            → Send message.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Poll for messages">
          <p className="text-slate-300">
            Click Poll for messages. Your message appears with its message ID and receive count. Watch the{' '}
            <em>Messages available</em> and <em>Messages in flight</em> counters swap.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Delete — or watch it come back">
          <p className="text-slate-300">
            Select the message and Delete. Repeat the experiment without deleting: after 30 seconds, polling
            returns the same message with a receive count of 2.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="AWS CLI — the same three calls">
        <Example title="Send, receive, delete with the AWS CLI" caption="Receive returns the ReceiptHandle you need for delete">
{`QUEUE_URL=https://sqs.us-east-1.amazonaws.com/123456789012/de-orders-ingest-queue-dev

# 1. Send
aws sqs send-message \\
  --queue-url "$QUEUE_URL" \\
  --message-body '{"bucket": "acme-lake-dev", "key": "raw/orders/2026-09-30.csv"}'

# 2. Receive (long poll up to 20 s, up to 10 messages)
aws sqs receive-message \\
  --queue-url "$QUEUE_URL" \\
  --max-number-of-messages 10 \\
  --wait-time-seconds 20

# 3. Delete using the ReceiptHandle from step 2
aws sqs delete-message \\
  --queue-url "$QUEUE_URL" \\
  --receipt-handle "AQEBwJnKyrHigUMZj6rYigCgxlaS3SLy0a..."`}
        </Example>
        <Callout variant="tip">
          <code className="text-core-400">--wait-time-seconds 20</code> turns on long polling: the call waits
          up to 20 seconds for a message instead of returning empty immediately. Fewer empty receives means a
          smaller bill — you will tune this properly in the long polling lesson.
        </Callout>
      </LessonSection>

      <LessonSection title="Boto3 — a minimal worker loop">
        <Example title="Poll, process, delete" caption="Delete only after the work succeeds">
{`import json
import os
import boto3

sqs = boto3.client("sqs")
QUEUE_URL = os.environ["QUEUE_URL"]

def process(bucket: str, key: str) -> None:
    print(f"processing s3://{bucket}/{key}")  # start Glue, load rows, etc.

while True:
    resp = sqs.receive_message(
        QueueUrl=QUEUE_URL,
        MaxNumberOfMessages=10,
        WaitTimeSeconds=20,
    )
    for msg in resp.get("Messages", []):
        body = json.loads(msg["Body"])
        try:
            process(body["bucket"], body["key"])
        except Exception as exc:
            print(f"failed {msg['MessageId']}: {exc}")  # no delete -> retried later
            continue
        sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=msg["ReceiptHandle"])`}
        </Example>
        <ContentStep number={1} title="Why you must delete">
          <p className="text-slate-300">
            SQS cannot tell whether your code finished. Deleting is your acknowledgement. Forget it and every
            message is reprocessed after each visibility timeout until retention expires — duplicate Glue runs
            and duplicate rows in silver.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Receipt handle vs message ID">
          <p className="text-slate-300">
            The message ID identifies the message forever — log it. The receipt handle identifies{' '}
            <em>this particular receive</em> and changes every time the message is received. Delete and change
            visibility need the latest receipt handle; the message ID will not work.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda deletes for you">
          <p className="text-slate-300">
            With a Lambda event source mapping, a successful invocation deletes the batch automatically. A
            thrown error leaves the messages to reappear — covered in the SQS + Lambda lesson.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Delete after the side effect, not before. Deleting first and then crashing loses the work; deleting
          last and crashing just causes a retry — which your DynamoDB idempotency check already handles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lifecycle: SendMessage → available → ReceiveMessage → in flight → DeleteMessage, or back to available after the visibility timeout.',
          'Receiving does not delete — the consumer must call DeleteMessage after the work succeeds.',
          'Delete needs the receipt handle from the latest receive; the message ID is for logging and tracing.',
          'CLI: aws sqs send-message, receive-message (up to 10 messages, wait up to 20 s), delete-message.',
          'Delete after side effects so crashes cause retries, not lost work — and keep consumers idempotent.',
        ]}
      />
    </LessonArticle>
  )
}
