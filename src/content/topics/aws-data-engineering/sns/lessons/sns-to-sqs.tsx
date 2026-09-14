import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SnsToSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SNS decouples producers; SQS absorbs bursts">
        The <strong className="text-white">SNS → SQS</strong> pattern is the backbone of event-driven data
        lakes: one S3 landing notification or pipeline status publish fans out to durable queues consumed
        by Lambda, EC2 workers, or Glue triggers at controlled rates. SNS handles fan-out; SQS handles
        buffering, backpressure, and DLQ replay.
      </Callout>

      <Definition term="SNS → SQS subscription">
        <p>
          SNS delivers each message to subscribed SQS queues by calling{' '}
          <span className="font-mono text-sm">SendMessage</span>. The queue stores the SNS notification
          envelope (unless raw delivery is enabled). Lambda consumers use Event Source Mapping with batch
          size and partial batch failure reporting — the standard DE ingest pattern after S3 events.
        </p>
      </Definition>

      <LessonSection title="SNS → SQS pattern">
        <ContentStep number={1} title="Wire-up checklist">
          <p className="text-slate-300">
            Create SNS topic → create SQS queue → subscribe queue to topic → add queue policy allowing SNS
            ARN → attach filter policy if needed → configure Lambda ESM or worker poll. Enable encryption
            consistently (SSE-SQS or KMS) when topic uses KMS — queue key must permit SNS service principal.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Message shape">
          <p className="text-slate-300">
            Default delivery wraps your payload in SNS JSON with{' '}
            <span className="font-mono text-sm">Type</span>,{' '}
            <span className="font-mono text-sm">MessageId</span>,{' '}
            <span className="font-mono text-sm">TopicArn</span>, and stringified{' '}
            <span className="font-mono text-sm">Message</span>. Lambda handlers parse{' '}
            <span className="font-mono text-sm">json.loads(record[&apos;body&apos;])[&apos;Message&apos;]</span>{' '}
            for nested S3 events — or enable raw message delivery when publishing custom JSON only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="FIFO pairing">
          <p className="text-slate-300">
            FIFO SNS → FIFO SQS preserves order and dedupe. Standard SNS → Standard SQS for high-volume
            landing zones. Do not mix FIFO topic with Standard queue — subscription will fail.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why buffer with queues">
        <ContentStep number={1} title="Burst absorption">
          <p className="text-slate-300">
            Black Friday file drops can generate thousands of S3 ObjectCreated events per minute. Direct
            SNS → Lambda invokes one function per message — hits concurrency limits and cold-start storms.
            SNS → SQS → Lambda ESM smooths invocations with batching and maximum concurrency on the mapping.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Independent consumer speed">
          <p className="text-slate-300">
            Fan-out to three queues: fast validation Lambda (batch 10), slow compliance archive (batch 1),
            metrics counter (batch 100). Each queue depth visible in CloudWatch — scale workers per backlog
            without coupling teams.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DLQ and replay">
          <p className="text-slate-300">
            SQS redrive policy sends poison messages to DLQ after max receives. Ops replays DLQ to main
            queue after schema fix — clearer than replaying SNS publishes. Subscription DLQ catches SNS
            transport failures before message ever enters the worker queue.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Visibility timeout tuning">
          <p className="text-slate-300">
            Set visibility timeout ≥ 6× Lambda timeout for ESM consumers processing Glue triggers or large
            metadata writes. Too short → duplicate processing; too long → slow recovery on crash.
          </p>
        </ContentStep>
        <Callout variant="tip">
          DE default: S3 → SNS → SQS → Lambda ESM over S3 → Lambda direct. Same latency for first message,
          vastly better behavior under burst and clearer failure isolation.
        </Callout>
      </LessonSection>

      <LessonSection title="Architecture flowchart">
        <Flowchart
          title="SNS → SQS fan-out for lake ingest"
          chart={`flowchart TB
  S3[S3 ObjectCreated]
  SNS[SNS landing-events]
  Q1[SQS validate-queue]
  Q2[SQS archive-queue]
  Q3[SQS metrics-queue]
  L1[Lambda validator ESM]
  L2[Lambda archiver ESM]
  L3[Lambda metrics ESM]
  GLUE[Glue start on valid]
  DLQ[SQS DLQ plus alarm]
  S3 --> SNS
  SNS --> Q1
  SNS --> Q2
  SNS --> Q3
  Q1 --> L1
  Q2 --> L2
  Q3 --> L3
  L1 --> GLUE
  L1 -->|fail max receive| DLQ`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS → SQS: SNS SendMessage to queue; queue policy must trust topic ARN; optional filter per subscription.',
          'Buffer bursts with SQS before Lambda — ESM batching and concurrency caps beat direct SNS → Lambda storms.',
          'Parse SNS envelope Message field unless raw delivery enabled; document shape in consumer code.',
          'Use SQS DLQ for processing failures; subscription DLQ for SNS transport failures — both need alarms.',
          'FIFO SNS pairs with FIFO SQS only; Standard pairing for high-volume landing fan-out.',
        ]}
      />
    </LessonArticle>
  )
}
