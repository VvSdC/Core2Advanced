import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SnsInDataPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SNS is signal — not your transform engine">
        SNS excels at <strong className="text-white">notification and fan-out</strong> in lake pipelines.
        It is the wrong tool for heavy routing logic, guaranteed exactly-once processing, or storing
        events. This lesson separates recommended DE patterns from anti-patterns and shows end-to-end
        placement alongside S3, Lambda, and Glue.
      </Callout>

      <Definition term="SNS in the lake architecture">
        <p>
          SNS sits in the <strong className="text-white">control plane</strong> of event-driven ETL: S3 and
          custom publishers notify many consumers; CloudWatch alarms reach humans; pipeline status broadcasts
          orchestration continuations. Transform, validation, and catalog updates happen in Lambda, Glue, and
          Step Functions — SNS does not replace them.
        </p>
      </Definition>

      <LessonSection title="Recommended patterns: alerts vs work distribution">
        <ContentStep number={1} title="Alerts and human response">
          <p className="text-slate-300">
            CloudWatch → SNS → email/Slack/PagerDuty for Lambda Errors, Glue failures, DLQ depth, custom
            SLA breach metrics. Low volume, high urgency, duplicate alert acceptable with dedupe in chat.
            No idempotent side effects in email path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Work distribution via fan-out">
          <p className="text-slate-300">
            S3 landing → SNS → filtered SQS queues → Lambda ESM → Glue/Step Functions. SNS distributes
            work; SQS holds work; Lambda/Glue executes. Scale consumers independently; replay from SQS DLQ
            after fixes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Orchestration signals">
          <p className="text-slate-300">
            Glue completion Lambda publishes{' '}
            <span className="font-mono text-sm">status=SUCCEEDED</span> to orchestration topic — Step
            Functions waiting on SQS callback queue resumes. Decouples job completion from workflow definition
            without polling Glue API.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Audit and lineage side channels">
          <p className="text-slate-300">
            Parallel subscription to immutable audit SQS → Firehose → S3 parquet audit log. Primary ingest
            path unaffected; compliance gets every event without parsing shared Lambda logs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Anti-patterns">
        <ContentStep number={1} title="SNS as durable event store">
          <p className="text-slate-300">
            SNS retains no replay log — messages are fire-and-forget after delivery attempts. Need replay?
            Use SQS, EventBridge archive, or Kinesis. Re-publishing from S3 inventory is your recovery,
            not SNS rewind.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Direct SNS → Lambda for high-volume ETL">
          <p className="text-slate-300">
            Per-object S3 events at scale through SNS → Lambda causes concurrency storms and duplicate Glue
            runs on retry. Always buffer with SQS and idempotent ledger.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Complex routing in publish code">
          <p className="text-slate-300">
            Publishing to twelve topics from one Lambda because teams could not agree on filters — use one
            topic + subscription filter policies or EventBridge for content-based routing with schema registry.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Sensitive data in alarm topics">
          <p className="text-slate-300">
            PII in S3 keys or row samples embedded in SNS messages to broad email topics — violates least
            privilege and audit. Publish IDs and links; fetch details in secured Lambda formatter.
          </p>
        </ContentStep>
        <ContentStep number={5} title="FIFO everywhere">
          <p className="text-slate-300">
            FIFO SNS for million-object backfills — throughput and subscriber limits hurt. Standard + idempotent
            consumers almost always win for lake scale.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Rule of thumb: if failure to deliver would lose money or compliance evidence, pair SNS with SQS
          (subscription DLQ + consumer DLQ) and alarm on both SNS failed metrics and queue depth.
        </Callout>
      </LessonSection>

      <LessonSection title="End-to-end flowchart — S3, Lambda, Glue">
        <Flowchart
          title="SNS in a production lake pipeline"
          chart={`flowchart TB
  VENDOR[Vendor SFTP drop]
  LAND[S3 landing]
  SNS1[SNS landing-events]
  QVAL[SQS validate]
  QAUD[SQS audit]
  LVAL[Lambda validate ESM]
  LAUD[Lambda audit ESM]
  DDB[DynamoDB ingest ledger]
  RAW[S3 raw zone]
  SF[Step Functions]
  GLUE[Glue Spark ETL]
  CUR[S3 curated]
  PUB[Lambda publish status]
  SNS2[SNS pipeline-status]
  QORCH[SQS orchestration]
  CW[CloudWatch alarms]
  SNS3[SNS data-ops-critical]
  SLACK[Slack email on-call]
  VENDOR --> LAND
  LAND --> SNS1
  SNS1 --> QVAL
  SNS1 --> QAUD
  QVAL --> LVAL
  QAUD --> LAUD
  LVAL --> DDB
  LVAL --> RAW
  LVAL --> SF
  SF --> GLUE
  GLUE --> CUR
  GLUE --> PUB
  PUB --> SNS2
  SNS2 --> QORCH
  QORCH --> SF
  LVAL -->|Errors metric| CW
  GLUE -->|Job failure| CW
  CW --> SNS3
  SNS3 --> SLACK`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use SNS for alerts (CloudWatch → humans) and fan-out work distribution (S3 → many SQS workers).',
          'SNS is not durable storage — pair with SQS, EventBridge archive, or Kinesis for replay needs.',
          'Anti-patterns: high-volume direct SNS→Lambda ETL, twelve topics instead of filters, PII in messages.',
          'End-to-end: landing SNS fans out validate/audit; Glue status SNS continues orchestration; ops SNS pages.',
          'Always alarm SNS NumberOfNotificationsFailed and consumer DLQ depth on critical pipeline topics.',
        ]}
      />
    </LessonArticle>
  )
}
