import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventSourceMapping() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda can poll streams and queues for you">
        Not every trigger pushes events into Lambda. For <strong className="text-white">SQS</strong>,{' '}
        <strong className="text-white">Kinesis Data Streams</strong>, and{' '}
        <strong className="text-white">DynamoDB Streams</strong>, AWS creates an{' '}
        <strong className="text-white">Event Source Mapping (ESM)</strong> — Lambda polls the source,
        batches records, and invokes your function. This is the managed consumer pattern data engineers
        use for backpressure, replay, and ordered shard processing.
      </Callout>

      <Definition term="Event Source Mapping">
        <p>
          An <strong className="text-white">Event Source Mapping</strong> is a Lambda resource that links
          your function to a pull-based event source. Lambda&apos;s poller reads messages or stream records,
          optionally filters them, invokes the function with a batch, and checkpoints progress (SQS delete,
          Kinesis iterator advance, DynamoDB stream sequence). You configure batch size, parallelization,
          bisect-on-error, and starting position (LATEST vs TRIM_HORIZON for streams).
        </p>
      </Definition>

      <LessonSection title="ESM vs direct triggers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Who invokes Lambda?</th>
                <th className="px-4 py-3">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Direct (push) trigger',
                  'AWS service pushes event to Lambda',
                  'S3 ObjectCreated, EventBridge rule, SNS subscription, API Gateway',
                ],
                [
                  'Event Source Mapping (pull)',
                  'Lambda poller pulls batch and invokes function',
                  'SQS queue, Kinesis stream, DynamoDB stream, MSK, MQ',
                ],
              ].map(([pattern, who, examples]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{who}</td>
                  <td className="px-4 py-3">{examples}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          S3 → Lambda is push (S3 calls Lambda). S3 → SQS → Lambda is pull (ESM polls SQS). The second
          pattern buffers landing spikes and gives you DLQ on the queue — standard for high-volume DE ingest.
        </Callout>
      </LessonSection>

      <LessonSection title="ESM on common DE sources">
        <ContentStep number={1} title="SQS queue consumer">
          <p className="text-slate-300">
            Landing notifications land in SQS (from S3 event notification or custom producer). ESM batch
            size up to 10 (FIFO: up to 10 with batching window). Lambda processes batch; successful
            handling deletes messages. Failed batches return to queue until maxReceiveCount → DLQ. Scale
            concurrency with queue depth — classic buffer between bursty uploads and transform workers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Kinesis Data Streams">
          <p className="text-slate-300">
            Real-time clickstream or CDC events shard across Kinesis. One Lambda consumer per shard (or
            enhanced fan-out). ESM checkpoint tracks sequence numbers — replay from TRIM_HORIZON for
            backfill or LATEST for forward-only. Use when ordering within a partition key matters (e.g.{' '}
            <span className="font-mono text-sm">user_id</span> events processed in order per shard).
          </p>
        </ContentStep>
        <ContentStep number={3} title="DynamoDB Streams">
          <p className="text-slate-300">
            Operational tables emit INSERT/MODIFY/REMOVE records. Lambda ESM triggers incremental sync to
            S3 (JSON lines in raw/) or updates a serving cache. Starting position TRIM_HORIZON replays
            table history — useful for initial lake backfill from DynamoDB metadata stores.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Error handling knobs">
          <p className="text-slate-300">
            <span className="font-mono text-sm">BisectBatchOnFunctionError</span> splits failing batches
            to isolate poison records. <span className="font-mono text-sm">MaximumRetryAttempts</span> and{' '}
            <span className="font-mono text-sm">OnFailure</span> destination route persistent failures to
            SQS/SNS/Lambda. For DE pipelines, always wire OnFailure to an ops queue with the raw payload
            for manual replay.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Architecture contrast">
        <Flowchart
          title="Push trigger vs Event Source Mapping"
          chart={`flowchart TB
  subgraph push [Push trigger — S3 direct]
    S3P[S3 ObjectCreated]
    S3P --> L1[Lambda invoked by S3]
  end
  subgraph pull [Pull — ESM on SQS]
    S3Q[S3 notification]
    S3Q --> SQ[SQS queue]
    SQ --> ESM[Event Source Mapping poller]
    ESM --> L2[Lambda batch invoke]
    L2 --> GLUE[Start Glue job]
  end`}
        />
        <Callout variant="tip">
          When partners dump thousands of files per minute, skip direct S3 → Lambda. Fan-in through SQS +
          ESM controls concurrency and preserves messages until processing succeeds.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event Source Mapping = Lambda polls SQS, Kinesis, DynamoDB streams (and similar) and invokes your function in batches.',
          'Direct triggers (S3, EventBridge, SNS) push events; ESM pulls — use ESM when you need buffering, batching, or checkpointed replay.',
          'SQS + ESM is the DE pattern for taming S3 landing bursts; configure DLQ and bisect-on-error for poison files.',
          'Kinesis/DynamoDB ESM preserves shard ordering and sequence checkpoints — good for CDC and ordered ingest.',
          'Configure OnFailure destinations and idempotent handlers — ESM retries failed batches automatically.',
        ]}
      />
    </LessonArticle>
  )
}
