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

export function SqsPlusLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda does the polling so you do not have to">
        With an <strong className="text-white">event source mapping (ESM)</strong>, Lambda runs pollers against
        your queue, groups messages into batches, invokes your function, and deletes messages when the function
        succeeds. You write a handler that processes a list of records — no receive loops, no delete calls, no
        worker fleet. It is the default consumer for DE ingest queues like{' '}
        <span className="font-mono text-sm">de-orders-ingest-queue-prod</span>.
      </Callout>

      <Definition term="SQS event source mapping">
        <p>
          A Lambda resource linking a queue ARN to a function with settings for{' '}
          <span className="font-mono text-sm">BatchSize</span>,{' '}
          <span className="font-mono text-sm">MaximumBatchingWindowInSeconds</span>,{' '}
          <span className="font-mono text-sm">FunctionResponseTypes</span> (for partial batch failures), filter
          criteria, and <span className="font-mono text-sm">ScalingConfig.MaximumConcurrency</span>. Invocations
          are synchronous; if the function throws, the whole batch returns to the queue after the visibility
          timeout unless you report per-item failures.
        </p>
      </Definition>

      <LessonSection title="Batching knobs">
        <ContentStep number={1} title="Batch size">
          <p className="text-slate-300">
            Default is 10. Standard queues support up to <strong className="text-white">10,000</strong> records
            per batch, but anything above 10 requires a batching window of at least 1 second. FIFO queues cap at{' '}
            <strong className="text-white">10</strong>. The invocation payload limit (6 MB) also bounds real batch
            size for large messages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Batching window">
          <p className="text-slate-300">
            <span className="font-mono text-sm">MaximumBatchingWindowInSeconds</span> (0–300) tells Lambda to wait
            and accumulate records until the batch is full, the window expires, or the payload reaches 6 MB. For
            compaction-style consumers that merge many small S3 events into one Parquet write, a 30–60 s window
            with batch size 1,000 slashes invocations and small files.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Visibility timeout vs function timeout">
          <p className="text-slate-300">
            Messages are in flight while the batch waits and while the function runs. Set the queue visibility
            timeout to at least 6× the function timeout plus the batching window — otherwise messages reappear
            mid-invocation and get processed twice.
          </p>
        </ContentStep>
        <Example title="Create the mapping" caption="Batch 100, 20 s window, partial failures, capped concurrency">
{`aws lambda create-event-source-mapping \\
  --function-name de-orders-ingest-fn \\
  --event-source-arn arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-queue-prod \\
  --batch-size 100 \\
  --maximum-batching-window-in-seconds 20 \\
  --function-response-types ReportBatchItemFailures \\
  --scaling-config MaximumConcurrency=20`}
        </Example>
      </LessonSection>

      <LessonSection title="Partial batch failures">
        <ContentStep number={1} title="Why whole-batch retry hurts">
          <p className="text-slate-300">
            Without <span className="font-mono text-sm">ReportBatchItemFailures</span>, one bad record among 100
            fails the invocation and all 100 return to the queue. The 99 good records are reprocessed, receive
            counts climb for everyone, and healthy messages can end up in the DLQ next to the poison one.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Return batchItemFailures">
          <p className="text-slate-300">
            Enable the response type on the ESM and return the message IDs that failed. Lambda deletes the rest.
            Returning an empty list means full success; throwing an exception still means full batch failure.
          </p>
        </ContentStep>
        <Example title="Python handler with partial batch response" caption="Only failed records are retried">
{`import json, urllib.parse

def handler(event, context):
    failures = []
    for record in event['Records']:
        try:
            body = json.loads(record['body'])
            key = urllib.parse.unquote_plus(body['key'])
            process_landing_file(bucket=body['bucket'], key=key)   # idempotent
        except Exception as exc:
            print(json.dumps({'messageId': record['messageId'],
                              'receiveCount': record['attributes']['ApproximateReceiveCount'],
                              'error': str(exc)}))
            failures.append({'itemIdentifier': record['messageId']})
    return {'batchItemFailures': failures}`}
        </Example>
        <Callout variant="info">
          For FIFO queues, stop processing at the first failure and report that record plus every later record
          in the batch — otherwise later messages in the same group would succeed out of order.
        </Callout>
      </LessonSection>

      <LessonSection title="Scaling and concurrency">
        <Flowchart
          title="How the ESM scales"
          chart={`flowchart LR
  Q[SQS backlog grows]
  POLL[Lambda pollers]
  BATCH[Batches formed]
  CAP{Below max concurrency}
  INV[Invoke more functions]
  HOLD[Messages wait in queue]
  DS[(Redshift or RDS)]
  Q --> POLL
  POLL --> BATCH
  BATCH --> CAP
  CAP -->|yes| INV
  CAP -->|no| HOLD
  INV --> DS`}
        />
        <ContentStep number={1} title="Scaling behaviour">
          <p className="text-slate-300">
            Standard queues: Lambda adds pollers as backlog grows, scaling up by up to about 300 concurrent
            invocations per minute, limited by account and reserved concurrency. FIFO queues scale only to the
            number of active message groups, because each group is processed in order by one invocation at a
            time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Maximum concurrency vs reserved concurrency">
          <p className="text-slate-300">
            <span className="font-mono text-sm">MaximumConcurrency</span> (2–1,000) caps how many invocations the
            ESM itself drives — pollers simply stop fetching, and messages wait safely in the queue. Reserved
            concurrency alone caps the function but pollers keep receiving; throttled batches return to the queue
            and burn receive counts toward the DLQ. Use max concurrency to protect RDS connection pools or
            Redshift COPY slots.
          </p>
        </ContentStep>
        <Callout variant="tip">
          If you set both, keep reserved concurrency at or above the ESM&apos;s maximum concurrency — otherwise
          you reintroduce throttling on the batches the ESM already received.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event source mapping polls, batches, invokes, and deletes on success — no custom worker loop.',
          'Batch size up to 10,000 for Standard (window of at least 1 s above 10); FIFO caps at 10.',
          'Enable ReportBatchItemFailures and return batchItemFailures so only failed records retry.',
          'Queue visibility timeout of at least 6× function timeout plus batching window.',
          'Use ScalingConfig MaximumConcurrency to protect downstream databases without throttle-driven DLQ spills.',
        ]}
      />
    </LessonArticle>
  )
}
