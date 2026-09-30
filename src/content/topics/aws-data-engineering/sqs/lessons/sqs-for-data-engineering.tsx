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

export function SqsForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where queues actually show up in a lake platform">
        You now know how a queue works. This lesson answers the practical question:{' '}
        <strong className="text-white">where does a data engineer put a queue, and where should they not?</strong>{' '}
        SQS shines as a buffer and a work list between event sources and ETL. It is a poor database, a poor
        file store, and useless for analytics — teams that forget this end up with expensive, fragile
        pipelines.
      </Callout>

      <Definition term="SQS in the DE stack">
        <p>
          In a data platform, SQS is the <strong className="text-white">work-coordination layer</strong>: it
          holds small messages that describe work — &quot;process this S3 object,&quot; &quot;load this
          partition&quot; — so that workers can pick them up at a safe pace, retry failures, and isolate poison
          inputs in a dead-letter queue. The data itself stays in S3; the state stays in DynamoDB.
        </p>
      </Definition>

      <LessonSection title="Five use cases you will build">
        <ContentStep number={1} title="Ingest buffer for S3 events">
          <p className="text-slate-300">
            S3 ObjectCreated notifications on <code className="text-core-400">acme-lake-prod/raw/</code> go
            to <code className="text-core-400">de-orders-ingest-queue-prod</code> instead of directly to
            Lambda. A 10,000-file vendor backfill becomes a backlog Lambda drains at a capped concurrency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Work queue for per-file ETL">
          <p className="text-slate-300">
            A planner Lambda lists a day&apos;s partitions and sends one message per file. A fleet of ECS
            workers or Lambdas each take one message, convert CSV to Parquet, and delete it — parallelism
            without a scheduler.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Smoothing load on RDS or Redshift">
          <p className="text-slate-300">
            A database can only accept so many concurrent loaders. Limit Lambda maximum concurrency on the
            event source mapping to 5, and the queue absorbs the rest — no connection storms on the warehouse.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Retry isolation with a DLQ">
          <p className="text-slate-300">
            A malformed vendor file fails three times and moves to{' '}
            <code className="text-core-400">de-orders-ingest-dlq-prod</code>. The other 9,999 files keep
            flowing; on-call fixes the parser and redrives the DLQ.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Fan-out with SNS → SQS">
          <p className="text-slate-300">
            One landing event published to SNS reaches a validation queue, an archive queue, and a metrics
            queue — each consumer team scales and fails independently.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reference architecture">
        <Flowchart
          title="Buffered ingest with DLQ and dedup"
          chart={`flowchart LR
  S3[S3 raw landing] --> Q[SQS ingest queue]
  Q --> LAM[Lambda max concurrency 5]
  LAM --> DDB[(DynamoDB dedup)]
  LAM --> GLUE[Glue job per file]
  GLUE --> SIL[S3 silver Parquet]
  LAM --> RDS[(RDS or Redshift load)]
  Q -->|3 failed receives| DLQ[SQS DLQ]
  DLQ --> CW[CloudWatch alarm]`}
        />
        <Callout variant="insight">
          The queue turns a traffic problem into a latency problem. During a spike, files take longer to
          process — but nothing throttles, nothing is dropped, and the downstream database never sees more
          load than you allowed.
        </Callout>
      </LessonSection>

      <LessonSection title="Anti-patterns to avoid">
        <ContentStep number={1} title="SQS as a database">
          <p className="text-slate-300">
            You cannot query a queue, look up a message by key, or keep data past 14 days. Status and history
            belong in DynamoDB; the queue only holds work that has not been done yet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Huge payloads instead of S3 pointers">
          <p className="text-slate-300">
            Messages cap at 1 MiB (256 KiB before August 2025), and you pay per 64 KB chunk. Put the file in S3 and send its bucket and key
            — the claim-check pattern. Never base64-encode CSV rows into a message body.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Using SQS for analytics or replay">
          <p className="text-slate-300">
            Once a message is deleted it is gone, and only one consumer processes each message. If several
            teams need to re-read the same ordered event history, that is Kinesis or the S3 lake itself — not a
            queue.
          </p>
        </ContentStep>
        <Example title="Good vs bad message bodies" caption="Pointer in, data stays in the lake">
{`// Good — claim check, about 150 bytes
{
  "bucket": "acme-lake-prod",
  "key": "raw/orders/vendor=acme/2026-09-30/orders.csv",
  "size": 48213345,
  "dataset": "orders"
}

// Bad — file contents inside the message
{
  "filename": "orders.csv",
  "rows": [
    ["order_id", "customer_id", "amount"],
    ["O-1", "C-1042", "19.99"],
    "... 400,000 more rows ..."
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Queue or something else?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Reach for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Buffer bursts of independent work items', 'SQS Standard'],
                ['Ordered changes per entity', 'SQS FIFO'],
                ['Send one event to many targets', 'SNS, usually into SQS queues'],
                ['Remember what was processed', 'DynamoDB idempotency table'],
                ['Replayable high-volume event stream', 'Kinesis Data Streams'],
                ['Store and analyze the data', 'S3 lake with Glue and Athena'],
              ].map(([need, tool]) => (
                <tr key={need} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{need}</td>
                  <td className="px-4 py-3">{tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Two CloudWatch metrics to watch from day one">
          <code className="text-core-400">ApproximateNumberOfMessagesVisible</code> tells you how big the
          backlog is; <code className="text-core-400">ApproximateAgeOfOldestMessage</code> tells you how late
          the pipeline is running. Alarm on age — it maps directly to your data freshness SLA.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Core DE uses: S3 event ingest buffer, per-file work queue, load smoothing for RDS/Redshift, DLQ retry isolation, SNS → SQS fan-out.',
          'Queues trade throttling for latency — backlog grows safely instead of overwhelming downstream systems.',
          'Send S3 pointers (claim check), never file contents — messages cap at 1 MiB.',
          'Anti-patterns: SQS as a database, huge payloads, and using a queue for analytics or multi-consumer replay.',
          'Watch backlog size and age of oldest message in CloudWatch; alarm on age for freshness SLAs.',
        ]}
      />
    </LessonArticle>
  )
}
