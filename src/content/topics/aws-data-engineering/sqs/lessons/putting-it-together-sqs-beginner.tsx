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

export function PuttingItTogetherSqsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before visibility timeouts and DLQs">
        You now know why SQS follows DynamoDB, what a managed pull-based queue is, how queues messages
        producers and consumers fit together, when Standard beats FIFO, how a message moves from send to
        delete, and where DE teams use queues vs the lake. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner SQS checklist</strong> — the mental model you need before
        visibility timeout tuning, long polling, DLQ redrive, and Lambda event source mappings.
      </Callout>

      <Definition term="Beginner SQS mental model">
        <p>
          A <strong className="text-white">beginner SQS mental model</strong> for DE includes: a queue between
          every bursty event source and its ETL consumer, Standard by default and FIFO only when per-entity
          order matters, message bodies that carry S3 pointers well under the 1 MiB limit, consumers that delete only after
          the work succeeds, a DynamoDB idempotency check because delivery is at-least-once, a DLQ paired with
          every work queue, and CloudWatch alarms on backlog age — all before tuning visibility timeouts and
          batch sizes in production.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Queue between source and worker">
          <p className="text-slate-300">
            S3 or EventBridge sends to the queue; Lambda or ECS consumes. No direct S3 → Lambda for ingest that
            can burst.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Queue type chosen on purpose">
          <p className="text-slate-300">
            Standard for independent files. FIFO with a meaningful{' '}
            <code className="text-core-400">MessageGroupId</code> only for ordered changes — decided before
            creation, since type cannot change.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pointer messages">
          <p className="text-slate-300">
            Body = bucket, key, size, dataset. Files stay in{' '}
            <code className="text-core-400">acme-lake-prod</code>; the queue carries only the claim check.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Idempotent consumer">
          <p className="text-slate-300">
            Consumer conditional-writes <code className="text-core-400">bucket#key</code> to DynamoDB before
            starting Glue. Duplicate delivery fails the condition and is deleted without side effects.
          </p>
        </ContentStep>
        <ContentStep number={5} title="DLQ, alarms, and IAM">
          <p className="text-slate-300">
            Main queue redrives to <code className="text-core-400">de-orders-ingest-dlq-prod</code>; alarm on
            DLQ depth and oldest-message age. Consumer role scoped to{' '}
            <code className="text-core-400">sqs:ReceiveMessage</code>,{' '}
            <code className="text-core-400">DeleteMessage</code>, and{' '}
            <code className="text-core-400">GetQueueAttributes</code> on that queue ARN — not{' '}
            <code className="text-core-400">sqs:*</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE SQS stack"
          chart={`flowchart TD
  S3[S3 raw landing]
  S3 --> Q[SQS de-orders-ingest-queue-prod]
  Q --> LAM[Lambda consumer]
  LAM --> IDEM[(DynamoDB de-idempotency-prod)]
  LAM --> GLUE[Glue ETL]
  GLUE --> CUR[S3 curated]
  Q -->|max receives exceeded| DLQ[SQS de-orders-ingest-dlq-prod]
  DLQ --> CW[CloudWatch alarm]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is SQS in one sentence?">
          <p className="text-slate-300">
            A fully managed, pull-based message queue that durably holds work until consumers are ready — DE
            uses it to buffer ingest and isolate failures.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQS vs SNS">
          <p className="text-slate-300">
            SQS stores messages for one consumer group to pull; SNS pushes a copy to every subscriber and
            stores nothing. Combine them for fan-out plus buffering.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Message ID vs receipt handle">
          <p className="text-slate-300">
            Message ID is stable — use it for logs. Receipt handle changes on every receive — required for
            delete and change visibility.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Standard vs FIFO">
          <p className="text-slate-300">
            Standard = nearly unlimited throughput, best-effort order, at-least-once. FIFO = order within a
            group, 5-minute dedup, 300 TPS per action or 3,000 msg/s batched.
          </p>
        </ContentStep>
        <ContentStep number={5} title="What happens if you never delete?">
          <p className="text-slate-300">
            The message reappears after each visibility timeout (default 30 s) and is reprocessed until
            retention expires (default 4 days, max 14) or it moves to a DLQ.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Top DE use cases">
          <p className="text-slate-300">
            S3 event buffer, per-file work queue, load smoothing for RDS/Redshift, DLQ retry isolation, SNS →
            SQS fan-out — not a database, file store, or analytics engine.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when the backlog keeps growing?">
          <p className="text-slate-300">
            Check <code className="text-core-400">ApproximateAgeOfOldestMessage</code>, consumer errors in
            CloudWatch Logs, and Lambda throttles or concurrency caps — before assuming SQS itself is slow.
          </p>
        </ContentStep>
        <Example title="Beginner SQS concept drill" caption="No console required yet — explain aloud">
{`1. Draw: S3 landing → SQS → Lambda → DynamoDB dedup → Glue → S3 curated, plus DLQ
2. Why put a queue between S3 and Lambda instead of a direct trigger?
3. Why does the consumer delete AFTER the Glue call, not before?
4. Name one DE workload that needs FIFO and one that should stay Standard
5. Why send an s3:// pointer instead of the CSV rows in the body?
6. Which identifier do you pass to DeleteMessage, and why not the message ID?
7. How does SQS fit between DynamoDB and Step Functions in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong SQS beginners ask three questions before creating a queue: who produces and who consumes,
          does order matter, and what happens when a message fails — a missing answer to question three is
          how poison files block pipelines for days.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme&apos;s vendor uploads 3,200 daily order files to{' '}
          <code className="text-core-400">acme-lake-prod/raw/orders/vendor=acme/2026-09-30/</code> within
          fifteen minutes. S3 event notifications send one message per file to the Standard queue{' '}
          <code className="text-core-400">de-orders-ingest-queue-prod</code>. Lambda{' '}
          <code className="text-core-400">de-orders-ingest</code> consumes batches of 10 with maximum
          concurrency 20, conditional-writes each{' '}
          <code className="text-core-400">bucket#key</code> to{' '}
          <code className="text-core-400">de-idempotency-prod</code>, and starts the Glue job{' '}
          <code className="text-core-400">orders-csv-to-parquet</code> with the S3 path as an argument. Two
          files arrive as duplicate events — the condition fails, the messages are deleted, no second Glue run.
          One file has a broken header; it fails three receives and lands in{' '}
          <code className="text-core-400">de-orders-ingest-dlq-prod</code>, the CloudWatch alarm pages
          on-call, and the other 3,199 files finish in{' '}
          <code className="text-core-400">silver/orders/</code> on time.
        </p>
        <ContentStep number={1} title="Trigger tier — S3 notifications">
          <p className="text-slate-300">Landing signal — at-least-once, bursty, never throttled by the queue.</p>
        </ContentStep>
        <ContentStep number={2} title="Buffer tier — SQS">
          <p className="text-slate-300">Durable backlog, controlled drain rate, DLQ for poison files.</p>
        </ContentStep>
        <ContentStep number={3} title="Coordination tier — DynamoDB">
          <p className="text-slate-300">Dedup keys and job state — duplicates skipped in milliseconds.</p>
        </ContentStep>
        <ContentStep number={4} title="Data tier — S3 + Glue">
          <p className="text-slate-300">Actual CSV to Parquet transformation — where lake economics apply.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate and advanced SQS lessons go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Visibility timeout — sizing to your work">
          <p className="text-slate-300">
            Why messages reappear mid-processing, how to size the timeout against Lambda or Glue duration, and
            when to extend it with <code className="text-core-400">ChangeMessageVisibility</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Long polling and batching">
          <p className="text-slate-300">
            <code className="text-core-400">WaitTimeSeconds</code> up to 20 seconds to cut empty receives, and
            batch send and delete of up to 10 messages to cut request costs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dead-letter queues and redrive">
          <p className="text-slate-300">
            <code className="text-core-400">maxReceiveCount</code>, alarms on DLQ depth, and replaying fixed
            messages back to the source queue.
          </p>
        </ContentStep>
        <ContentStep number={4} title="SQS + Lambda event source mapping">
          <p className="text-slate-300">
            Batch size, batching window, partial batch failure reporting, and maximum concurrency — the
            production pattern behind every scenario in this checkpoint.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Before your first prod ingest queue">
          Replay a real day of landing events into a dev queue and watch backlog age drain — teams that skip
          this discover their consumer concurrency is too low on the busiest vendor day, not in testing.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: queue between bursty sources and ETL, Standard by default, pointer messages, delete after success, DLQ plus alarms.',
          'Self-check: SQS definition, SQS vs SNS, message ID vs receipt handle, Standard vs FIFO, never-deleted messages, DE use cases.',
          'End-to-end: S3 notifications → SQS → Lambda with DynamoDB dedup → Glue → S3 silver, poison files isolated in the DLQ.',
          'At-least-once delivery means DynamoDB idempotency is part of every SQS consumer design.',
          'Next in SQS track: visibility timeout, long polling and batching, DLQ redrive, and Lambda event source mappings.',
        ]}
      />
    </LessonArticle>
  )
}
