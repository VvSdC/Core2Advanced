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

export function ArchiveReplayDlqRetry() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Events are ephemeral — production pipelines plan for loss and recovery">
        A missed S3 Object Created can mean silent data gaps. EventBridge offers{' '}
        <strong className="text-white">archive</strong>, <strong className="text-white">replay</strong>,{' '}
        <strong className="text-white">retry policies</strong>, and <strong className="text-white">dead-letter
        queues</strong> so data engineering teams recover from target failures without re-landing source files.
      </Callout>

      <Definition term="EventBridge reliability controls">
        <p>
          <strong className="text-white">Archive</strong> stores matched events on a bus for later replay.{' '}
          <strong className="text-white">Replay</strong> re-injects archived events through rules.{' '}
          <strong className="text-white">Retry policy</strong> configures target invocation retries.{' '}
          <strong className="text-white">DLQ</strong> captures events that exhaust retries — typically an SQS
          queue for manual or automated reprocessing.
        </p>
      </Definition>

      <LessonSection title="Event archive">
        <ContentStep number={1} title="What gets archived">
          <p className="text-slate-300">
            Enable archive on default or custom bus — optionally filter by event pattern. All matching events
            copy to durable storage regardless of rule target success. Retention from one day to indefinite
            (storage cost accrues). Compliance and forensic audit: prove which S3 events fired on a given date.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Archive all S3 Object Created on prod landing bucket — if Lambda bug dropped events for six hours,
            replay after fix without vendor resend. Pair with IaC versioning so replay targets the corrected
            rule/target configuration.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Event replay">
        <ContentStep number={1} title="Starting a replay">
          <p className="text-slate-300">
            Console or API: select time range from archive, choose destination bus, optionally filter by
            event pattern. Events re-enter the bus and match current rules — not historical rule versions.
            Verify rule patterns before replay to avoid double-processing prod data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency requirement">
          <p className="text-slate-300">
            Replay duplicates work — Glue jobs must overwrite partitions or use merge semantics. Watermark
            tables should key on object etag + key, not only event id. Document replay runbooks: disable
            downstream gold jobs, replay bronze only, reconcile counts, re-enable.
          </p>
        </ContentStep>
        <Flowchart
          title="Failure recovery with archive and replay"
          chart={`flowchart TB
  EVT[S3 Object Created events]
  BUS[Event bus with archive enabled]
  RULE[Ingest rule]
  LAM[Lambda target]
  FAIL[Target fails after retries]
  DLQ[(SQS DLQ)]
  ARCH[(Event archive)]
  FIX[Fix Lambda bug deploy]
  REPLAY[Replay time window]
  LAM2[Corrected Lambda]
  GLUE[Glue job idempotent]
  EVT --> BUS
  BUS --> ARCH
  BUS --> RULE
  RULE --> LAM
  LAM --> FAIL
  FAIL --> DLQ
  FIX --> REPLAY
  ARCH --> REPLAY
  REPLAY --> BUS
  BUS --> LAM2
  LAM2 --> GLUE`}
        />
      </LessonSection>

      <LessonSection title="Dead letter queue and retry policy">
        <ContentStep number={1} title="Retry policy">
          <p className="text-slate-300">
            Per target: maximum retry attempts (default 185 over 24 hours for async targets), maximum event age,
            and retry interval. Shorten retries for fast-fail ingest — surface DLQ within minutes during
            incidents instead of hiding failures for hours.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DLQ configuration">
          <p className="text-slate-300">
            Attach SQS queue as dead-letter queue on rule target. After retries exhaust, EventBridge sends
            full event JSON to DLQ. Lambda consumer or ops script parses messages, fixes root cause, and
            optionally re-invokes handler or sends to replay workflow.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DLQ monitoring">
          <p className="text-slate-300">
            CloudWatch alarm on DLQ <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible</span>{' '}
            greater than zero — same urgency as Glue FAILED. Include sample event in alert payload for faster
            triage. DLQ retention (14 days default) must exceed longest weekend outage response time.
          </p>
        </ContentStep>
        <Example title="Target retry + DLQ sketch">
{`Rule target: Lambda ingest-starter
RetryPolicy:
  MaximumRetryAttempts: 10
  MaximumEventAgeInSeconds: 3600
DeadLetterConfig:
  Arn: arn:aws:sqs:us-east-1:123456789012:eventbridge-ingest-dlq

Alarm: DLQ depth >= 1 → SNS ops
Runbook: Logs Insights → fix → replay archive OR redrive DLQ messages`}
        </Example>
        <Callout variant="insight">
          Archive captures events even when no rule matched — useful for debugging wrong patterns. DLQ only
          receives events that matched a rule but failed delivery to target — different failure modes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event archive: durable copy of bus events — compliance, audit, and recovery without vendor resend.',
          'Replay: re-inject time range through current rules — requires idempotent Glue/partition logic.',
          'Retry policy: tune max attempts and event age — fast-fail ingest for quicker DLQ visibility.',
          'DLQ (SQS): exhausted retries land here — alarm on depth, runbook for fix + replay or redrive.',
          'Archive vs DLQ: archive = all matched bus events stored; DLQ = rule matched but target delivery failed.',
        ]}
      />
    </LessonArticle>
  )
}
