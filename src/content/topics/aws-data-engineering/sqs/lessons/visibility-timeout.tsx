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

export function VisibilityTimeout() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Receiving a message does not remove it">
        When a consumer calls <span className="font-mono text-sm">ReceiveMessage</span>, SQS hides the message
        instead of deleting it. If the consumer finishes and calls{' '}
        <span className="font-mono text-sm">DeleteMessage</span>, the work is done. If it crashes, times out, or
        forgets to delete, the message <strong className="text-white">reappears</strong> for another consumer.
        That hiding window is the <strong className="text-white">visibility timeout</strong> — the single most
        important knob on a data engineering work queue.
      </Callout>

      <Definition term="Visibility timeout">
        <p>
          The period during which SQS prevents other consumers from receiving a message that has already been
          received. While hidden, the message is <strong className="text-white">in flight</strong>. Default is{' '}
          <span className="font-mono text-sm">30 seconds</span>; valid range is 0 seconds to{' '}
          <span className="font-mono text-sm">12 hours</span>. It can be set on the queue, overridden per{' '}
          <span className="font-mono text-sm">ReceiveMessage</span> call, or extended per message with{' '}
          <span className="font-mono text-sm">ChangeMessageVisibility</span>.
        </p>
      </Definition>

      <LessonSection title="The in-flight lifecycle">
        <Flowchart
          title="What happens after ReceiveMessage"
          chart={`flowchart TB
  VIS[Message visible in queue]
  RCV[Consumer receives message]
  INF[In flight and hidden]
  OK[Processing succeeds]
  DEL[DeleteMessage removes it]
  FAIL[Crash or timeout expires]
  BACK[Message visible again]
  VIS --> RCV
  RCV --> INF
  INF --> OK
  OK --> DEL
  INF --> FAIL
  FAIL --> BACK
  BACK --> RCV`}
        />
        <ContentStep number={1} title="Hidden, not deleted">
          <p className="text-slate-300">
            Consumer on <span className="font-mono text-sm">de-orders-ingest-queue-prod</span> receives a
            manifest message and starts validating a 2 GB CSV in{' '}
            <span className="font-mono text-sm">s3://acme-lake-prod/landing/orders/</span>. For the next 30
            seconds (default) no other worker can see that message. The{' '}
            <span className="font-mono text-sm">ApproximateNumberOfMessagesNotVisible</span> metric counts these
            in-flight messages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Delete is the commit">
          <p className="text-slate-300">
            Only <span className="font-mono text-sm">DeleteMessage</span> with the{' '}
            <span className="font-mono text-sm">ReceiptHandle</span> from that receive ends the lifecycle. Delete
            after side effects succeed — Parquet written, DynamoDB watermark updated, Glue run started — never
            before. Deleting first turns a crash into silent data loss.
          </p>
        </ContentStep>
        <ContentStep number={3} title="In-flight quotas">
          <p className="text-slate-300">
            A Standard queue allows roughly 120,000 in-flight messages; FIFO allows 20,000. A huge visibility
            timeout combined with slow or stuck consumers can hit that ceiling and make receives return empty
            even though the backlog is large.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Sizing the timeout">
        <ContentStep number={1} title="Too short — duplicate processing">
          <p className="text-slate-300">
            Timeout 30 s but the Glue-trigger Lambda takes 90 s: the message reappears mid-run, a second worker
            picks it up, and two Glue jobs write the same partition. Symptoms: rising{' '}
            <span className="font-mono text-sm">ApproximateReceiveCount</span>, duplicate S3 objects, DLQ
            filling with messages that were actually processed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Too long — slow retries">
          <p className="text-slate-300">
            Timeout 12 h on a job that normally takes 20 s: when a worker crashes, the message stays hidden for
            12 hours before retry. SLA breaches look like &quot;stuck&quot; data with no errors anywhere.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rule of thumb for Lambda consumers">
          <p className="text-slate-300">
            AWS recommends setting the queue visibility timeout to at least{' '}
            <strong className="text-white">6× the function timeout</strong> (plus any{' '}
            <span className="font-mono text-sm">MaximumBatchingWindowInSeconds</span>). A 60 s Lambda timeout
            means a queue visibility timeout of at least 360 s. The headroom covers throttled invocations that
            Lambda retries while the batch is still in flight. For EC2/ECS workers, size to p99 processing time
            plus margin.
          </p>
        </ContentStep>
        <Example title="Set queue default visibility timeout" caption="6× a 60-second Lambda timeout">
{`aws sqs set-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/111122223333/de-orders-ingest-queue-prod \\
  --attributes VisibilityTimeout=360`}
        </Example>
      </LessonSection>

      <LessonSection title="Heartbeats for long jobs">
        <ContentStep number={1} title="ChangeMessageVisibility as a heartbeat">
          <p className="text-slate-300">
            Variable-length work (a 5 min to 2 h backfill chunk on ECS) should not rely on a single static
            timeout. Start with a modest value such as 5 minutes and extend it periodically while work
            progresses. If the worker dies, heartbeats stop and the message returns quickly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The 12-hour ceiling">
          <p className="text-slate-300">
            Extensions cannot push total visibility beyond 12 hours from the original receive. Work longer than
            that belongs in Step Functions, AWS Batch, or a Glue job tracked in DynamoDB — the queue message
            should start the job, not babysit it.
          </p>
        </ContentStep>
        <Example title="Boto3 heartbeat loop" caption="Extend visibility while a chunk is processed">
{`import boto3, threading

sqs = boto3.client('sqs')
QUEUE_URL = 'https://sqs.us-east-1.amazonaws.com/111122223333/de-orders-ingest-queue-prod'

def heartbeat(receipt_handle, stop_event):
    while not stop_event.wait(120):          # every 2 minutes
        sqs.change_message_visibility(
            QueueUrl=QUEUE_URL,
            ReceiptHandle=receipt_handle,
            VisibilityTimeout=300,           # hide for 5 more minutes
        )

stop = threading.Event()
threading.Thread(target=heartbeat, args=(msg['ReceiptHandle'], stop), daemon=True).start()
process_chunk(msg)                            # long-running work
stop.set()
sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=msg['ReceiptHandle'])`}
        </Example>
        <Callout variant="tip">
          Setting visibility to <span className="font-mono text-sm">0</span> with ChangeMessageVisibility
          releases a message immediately — useful when a worker knows it cannot handle a message (for example,
          during graceful shutdown) and wants another worker to retry now rather than after the timeout.
        </Callout>
      </LessonSection>

      <LessonSection title="Visibility timeout as a retry delay">
        <ContentStep number={1} title="Implicit backoff">
          <p className="text-slate-300">
            When processing fails and you do not delete, the next attempt happens after the visibility timeout.
            Some teams intentionally call ChangeMessageVisibility with a growing value based on{' '}
            <span className="font-mono text-sm">ApproximateReceiveCount</span> — 30 s, 2 min, 10 min — to back
            off from a flaky downstream API without a separate retry queue.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Visibility timeout, maxReceiveCount on the DLQ, and idempotent consumers are one design: the timeout
          controls when retries happen, the redrive policy controls how many, and idempotency makes duplicates
          harmless.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Received messages are hidden (in flight), not deleted — DeleteMessage after success is the commit.',
          'Default visibility timeout is 30 s; range 0 s to 12 h; override per receive or per message.',
          'Too short causes duplicate processing; too long delays retries after crashes.',
          'Lambda consumers: queue visibility timeout of at least 6× the function timeout.',
          'Use ChangeMessageVisibility heartbeats for variable-length work; move multi-hour jobs to orchestration.',
        ]}
      />
    </LessonArticle>
  )
}
