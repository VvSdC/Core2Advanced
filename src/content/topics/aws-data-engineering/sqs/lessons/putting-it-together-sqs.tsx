import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SQS for DE — buffering, retries, ordering, and safe consumers">
        You covered visibility timeouts, long polling and batching, DLQs and redrive, attributes, delay and
        retention, SQS + Lambda event source mappings, S3 events into queues, FIFO ordering and deduplication,
        idempotent consumers, scaling and backpressure, security, and how SQS compares with SNS, EventBridge,
        and Kinesis. This checkpoint ties intermediate and advanced SQS lessons before{' '}
        <strong className="text-white">Step Functions</strong> — orchestrating multi-step workflows on top of the
        work that queues buffer.
      </Callout>

      <Definition term="SQS mental model for data engineering">
        <p>
          Amazon SQS is the <strong className="text-white">durable work list</strong> between producers and
          consumers: messages are hidden while in flight and deleted only on success, retries are governed by
          visibility timeout and maxReceiveCount, failures land in a DLQ for redrive, and delivery is
          at-least-once — so consumers must be idempotent. Queues absorb bursts and let you cap consumer
          concurrency to protect downstream systems — not a stream, not a database, and not a replay store.
        </p>
      </Definition>

      <LessonSection title="SQS sub-topic map">
        <Flowchart
          title="SQS lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[SQS complete path]
  START --> VT[Visibility timeout]
  START --> LP[Long polling and batching]
  START --> DLQ[DLQ and redrive]
  START --> ATTR[Attributes delay retention]
  START --> LAM[SQS plus Lambda]
  START --> S3E[S3 events to SQS]
  START --> FIFO[FIFO ordering and dedup]
  START --> IDEM[Idempotent consumers]
  START --> SCALE[Scaling and monitoring]
  START --> SEC[Security and encryption]
  START --> CMP[SQS vs SNS EventBridge Kinesis]
  VT --> SFNNEXT
  LP --> SFNNEXT
  DLQ --> SFNNEXT
  ATTR --> SFNNEXT
  LAM --> SFNNEXT
  S3E --> SFNNEXT
  FIFO --> SFNNEXT
  IDEM --> SFNNEXT
  SCALE --> SFNNEXT
  SEC --> SFNNEXT
  CMP --> SFNNEXT
  SFNNEXT[Step Functions orchestration next]`}
        />
      </LessonSection>

      <LessonSection title="Full SQS checkpoint — can you explain…">
        <ContentStep number={1} title="Message lifecycle">
          <p className="text-slate-300">
            What happens between ReceiveMessage and DeleteMessage? Why size visibility timeout to at least 6× the
            Lambda timeout? When would you use ChangeMessageVisibility as a heartbeat, and what is the 12-hour
            ceiling?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost and efficiency">
          <p className="text-slate-300">
            Short vs long polling and NumberOfEmptyReceives? How batch APIs report partial failures? Why a 200 KB
            message is billed as 4 requests?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Failure handling">
          <p className="text-slate-300">
            How maxReceiveCount moves poison messages to a DLQ? Why DLQ retention should be 14 days? How to redrive
            with StartMessageMoveTask at a safe velocity — and why only after a fix?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Lambda and S3 integration">
          <p className="text-slate-300">
            Batch size limits for Standard vs FIFO? ReportBatchItemFailures response shape? Queue policy for
            s3.amazonaws.com with aws:SourceArn? Why URL-decode keys and skip s3:TestEvent?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Ordering and correctness">
          <p className="text-slate-300">
            MessageGroupId scope for per-customer CDC? Dedup ID vs content-based dedup and the 5-minute window?
            Idempotency keys and the DynamoDB conditional ingest gate?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations and architecture">
          <p className="text-slate-300">
            Which alarms — age of oldest, DLQ depth, zero sends? Maximum concurrency vs reserved concurrency?
            SSE-SQS vs SSE-KMS for S3 producers? When SNS, EventBridge, or Kinesis instead of SQS?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Visibility timeout?',
                  'Hides received messages; default 30 s, max 12 h; at least 6× Lambda timeout; heartbeat for long jobs.',
                ],
                [
                  'Long polling?',
                  'WaitTimeSeconds up to 20; fewer empty receives, lower cost, no missed messages from sampling.',
                ],
                [
                  'Batch APIs?',
                  'Up to 10 per Send/Delete/Receive; check the Failed list — HTTP 200 can hide failed entries.',
                ],
                [
                  'Poison messages?',
                  'RedrivePolicy with maxReceiveCount to a same-type DLQ; alarm on depth; redrive after fix.',
                ],
                [
                  'Message size?',
                  '256 KiB classic limit, 1 MiB since 2025; claim-check with S3 pointer for anything large.',
                ],
                [
                  'SQS + Lambda partial failure?',
                  'ReportBatchItemFailures; return batchItemFailures with failed messageIds only.',
                ],
                [
                  'Protect RDS from bursts?',
                  'ESM MaximumConcurrency — backlog waits in queue instead of throttles burning receive counts.',
                ],
                [
                  'S3 events to SQS?',
                  'Standard queue; policy for s3.amazonaws.com with SourceArn; unquote_plus keys; skip test event.',
                ],
                [
                  'FIFO ordering?',
                  'Ordered per MessageGroupId, parallel across groups; group by entity key, not table.',
                ],
                [
                  'Exactly once?',
                  'FIFO dedup covers 5-minute send retries only — consumers still need idempotency gates.',
                ],
                [
                  'Key metrics?',
                  'Visible, NotVisible, AgeOfOldestMessage, Sent vs Deleted, EmptyReceives, DLQ depth.',
                ],
                [
                  'SQS vs Kinesis?',
                  'SQS: work items, delete on success, no replay. Kinesis: retained ordered log, many readers, rewind.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for Step Functions when…">
          You can whiteboard S3 → SQS → Lambda ESM with partial batch failures, a DLQ with alarm and redrive, a
          DynamoDB idempotency gate, and a concurrency cap protecting the warehouse — and size the visibility
          timeout without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Step Functions">
        <p className="text-slate-300">
          SQS buffers work and makes each unit retryable — but a pipeline is more than one unit. Validate, run a
          Glue job, wait for it, update a DynamoDB watermark, run data quality checks, and notify on failure:{' '}
          <strong className="text-white">AWS Step Functions</strong> orchestrates those multi-step workflows with
          built-in retries, catches, parallel branches, and wait states — and can consume from or send to SQS
          at the edges.
        </p>
        <Flowchart
          title="After SQS — course thread"
          chart={`flowchart LR
  S3[(S3 landing)]
  SQS[SQS buffers work]
  LAM[Lambda ingest gate]
  DDB[(DynamoDB dedupe)]
  SFN[Step Functions workflow]
  GLUE[Glue job]
  DQ[Data quality checks]
  SNS[SNS alerts]
  S3 --> SQS
  SQS --> LAM
  LAM --> DDB
  LAM --> SFN
  SFN -->|retry and catch| GLUE
  GLUE --> DQ
  SFN -->|on failure| SNS`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when a queue backs up (check age of oldest and concurrency caps), when
          duplicates appear in the lake (check visibility timeout and idempotency), or when the DLQ alarm fires —
          answers trace to the lessons on lifecycle, DLQs, Lambda integration, and monitoring covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SQS: durable, at-least-once work list — hide on receive, delete on success, DLQ after max receives.',
          'Intermediate: visibility timeout sizing, long polling and batching, DLQ redrive, attributes and limits.',
          'Advanced: Lambda ESM with partial failures, S3 events, FIFO groups, idempotency, backpressure, security.',
          'Pick SQS for work items; SNS or EventBridge for fan-out and routing; Kinesis for retained streams.',
          'Next sub-topic: Step Functions — orchestrate multi-step pipelines with retries on top of queued work.',
        ]}
      />
    </LessonArticle>
  )
}
