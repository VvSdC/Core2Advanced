import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why SQS after DynamoDB in the DE path">
        DynamoDB taught you how a pipeline remembers state — idempotency keys, watermarks, and job status
        rows that stop the same file from being processed twice. The next problem shows up the first time a
        vendor drops 5,000 files into the landing bucket in ten minutes:{' '}
        <strong className="text-white">direct S3 → Lambda triggers fire all at once, hit concurrency limits,
        hammer downstream databases, and lose retries in the noise.</strong>{' '}
        The fix in almost every AWS data platform is{' '}
        <strong className="text-white">Amazon SQS</strong> — a managed queue that holds work until consumers
        are ready. DynamoDB dedupes; SQS buffers.
      </Callout>

      <Definition term="What is SQS in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon Simple Queue Service (SQS)</strong> is a fully managed message
          queue. Producers put small messages on a queue; consumers poll the queue, process each message, and
          delete it when done. For data engineering, SQS is the{' '}
          <strong className="text-white">shock absorber between event sources and ETL workers</strong> — S3
          landing notifications, EventBridge events, and SNS fan-out wait safely in a queue while Lambda or
          Glue-triggering workers drain it at a controlled pace.
        </p>
        <p className="mt-2 text-slate-300">
          Think of SQS as{' '}
          <span className="text-core-400">the waiting line in front of your pipeline — nobody gets dropped,
          and workers take the next ticket only when they have capacity</span>.
        </p>
      </Definition>

      <LessonSection title="Buffering — why order matters">
        <p className="text-slate-300">
          EventBridge and SNS lessons taught you how events are routed. DynamoDB taught you how to make
          processing idempotent. SQS explains{' '}
          <strong className="text-white">how work waits when consumers are slower than producers</strong> — the
          missing piece between &quot;an event happened&quot; and &quot;a worker finished the job.&quot;
        </p>
        <ContentStep number={1} title="Bursts overwhelm direct triggers">
          <p className="text-slate-300">
            S3 → Lambda direct invokes one function per event. A month-end backfill can spike to thousands of
            concurrent invocations, exhaust account concurrency, and throttle unrelated functions. Putting a
            queue in between lets Lambda pull batches at a rate you cap.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Downstream systems need protection">
          <p className="text-slate-300">
            A Lambda that loads rows into RDS or starts Glue jobs can only go so fast. SQS lets the backlog
            grow in the queue — durable and visible in CloudWatch — instead of overloading the database.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Failures get isolated, not lost">
          <p className="text-slate-300">
            A message that fails processing reappears after its visibility timeout and is retried. After
            repeated failures it moves to a dead-letter queue (DLQ) for inspection — the bad file never blocks
            the good ones.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: SNS and EventBridge route events; SQS holds work; DynamoDB remembers what was
          done. Most &quot;our ingest Lambda fell over during the backfill&quot; incidents are missing
          queues, not slow code.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build SQS in layers so visibility timeouts, DLQs, and Lambda event source mappings do not
          overwhelm you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Core model — queues, messages, producers, consumers">
          <p className="text-slate-300">
            Understand what a queue is, what a message carries, and who sends and polls — enough to read a
            pipeline architecture diagram with a queue in it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Queue types — Standard vs FIFO">
          <p className="text-slate-300">
            Standard for high-volume landing events; FIFO when order and deduplication inside a message group
            matter, such as change data capture per customer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lifecycle — send, receive, delete">
          <p className="text-slate-300">
            Walk one message through the console, AWS CLI, and Boto3 so the in-flight state and receipt handle
            make sense before tuning anything.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE use cases and next module">
          <p className="text-slate-300">
            After this beginner pass: visibility timeout sizing, long polling and batching, DLQ redrive, SQS +
            Lambda event source mapping, and S3 events → SQS patterns.
          </p>
        </ContentStep>
        <Flowchart
          title="SQS sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is SQS]
  B --> C[Queues messages producers consumers]
  C --> D[Standard vs FIFO]
  D --> E[Send receive delete]
  E --> F[SQS for DE]
  F --> G[Putting it together beginner]
  G --> H[Visibility DLQ Lambda — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Queue', 'A named, durable waiting line for messages — e.g. one queue per ingest pipeline'],
                [
                  'Message',
                  'One unit of work up to 1 MiB — usually JSON with an S3 bucket and key, not the file itself',
                ],
                ['Producer', 'Anything that sends messages — S3 notifications, EventBridge, SNS, or your app'],
                [
                  'Consumer',
                  'Anything that polls, processes, and deletes messages — Lambda, ECS workers, EC2 scripts',
                ],
                [
                  'Visibility timeout',
                  'How long a received message stays hidden from other consumers — default 30 seconds, max 12 hours',
                ],
                [
                  'DLQ',
                  'Dead-letter queue — where messages go after failing too many receives, so they stop blocking the main queue',
                ],
                [
                  'Receipt handle',
                  'A token returned with each receive — you need it to delete that message or change its visibility',
                ],
                [
                  'Polling',
                  'Consumers ask the queue for messages — short polling returns immediately, long polling waits up to 20 seconds',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use team, dataset, purpose, and environment in queue names:{' '}
          <code className="text-core-400">de-orders-ingest-queue-prod</code> and its partner{' '}
          <code className="text-core-400">de-orders-ingest-dlq-prod</code>. When on-call opens the SQS console
          at 2 a.m. and sees a growing backlog, the name should say which pipeline is stuck.
        </Callout>
      </LessonSection>

      <LessonSection title="How SQS fits in a pipeline">
        <p className="text-slate-300">
          A file lands in <code className="text-core-400">acme-lake-prod/raw/orders/</code>. S3 or
          EventBridge sends a notification to the ingest queue. Lambda polls in batches, checks DynamoDB for
          duplicates, and starts a Glue job or writes curated output back to S3. Messages that keep failing
          land in the DLQ with a CloudWatch alarm.
        </p>
        <Flowchart
          title="S3 / EventBridge → SQS → Lambda / Glue → S3"
          chart={`flowchart LR
  S3[S3 raw landing] --> EB[EventBridge rule]
  S3 --> Q[SQS de-orders-ingest-queue-prod]
  EB --> Q
  Q --> LAM[Lambda consumer batches]
  LAM --> DDB[(DynamoDB dedup)]
  LAM --> GLUE[Glue ETL job]
  GLUE --> CUR[S3 curated Parquet]
  Q -->|too many failures| DLQ[SQS DLQ plus alarm]`}
        />
      </LessonSection>

      <LessonSection title="Why data engineers care about SQS">
        <ContentStep number={1} title="Backpressure without code">
          <p className="text-slate-300">
            Queue depth grows when consumers fall behind and shrinks when they catch up. You get backpressure
            for free — no custom rate limiter in every Lambda.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Retries and failure isolation built in">
          <p className="text-slate-300">
            Unfinished messages come back automatically; poison messages move to a DLQ. Replaying a fixed
            batch is a redrive, not a manual re-upload of vendor files.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serverless, pay per request">
          <p className="text-slate-300">
            No brokers to patch or scale. You pay per API request, and the queue handles bursty landing
            traffic that would be expensive to provision for in advance.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SQS follows DynamoDB in the track — DynamoDB dedupes and stores state; SQS buffers work between event sources and ETL consumers.',
          'Roadmap: core model → Standard vs FIFO → send/receive/delete → DE use cases → visibility timeout, DLQ, Lambda next.',
          'Core vocabulary: queue, message, producer, consumer, visibility timeout, DLQ, receipt handle, polling.',
          'Typical pattern: S3 or EventBridge → SQS → Lambda (DynamoDB dedup) → Glue → S3 curated, with a DLQ and alarm.',
          'Name queues by team, dataset, purpose, and environment — e.g. de-orders-ingest-queue-prod.',
        ]}
      />
    </LessonArticle>
  )
}
