import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FanOutArchitecture() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One event, many consumers — SNS exists for this">
        <strong className="text-white">Fan-out</strong> publishes once and delivers to every subscriber
        independently. In data engineering, a single S3 landing event or pipeline completion signal often
        must trigger validation, archival, metrics, and downstream team queues simultaneously. SNS fan-out
        avoids N separate S3 notification configurations and keeps producers dumb.
      </Callout>

      <Definition term="Fan-out pattern">
        <p>
          <strong className="text-white">Fan-out</strong> decouples event producers from consumers: one SNS
          topic receives the event; multiple SQS queues, Lambda functions, HTTP endpoints, and email
          subscribers each get their own delivery attempt. Adding a new analytics consumer means adding a
          subscription — not republishing from S3 or changing upstream Glue code.
        </p>
      </Definition>

      <LessonSection title="Fan-out: one event → many consumers">
        <ContentStep number={1} title="Producer stays simple">
          <p className="text-slate-300">
            S3 publishes to one SNS topic per bucket (or shared platform topic). Custom publishers (Step
            Functions, Lambda) call <span className="font-mono text-sm">Publish</span> once with pipeline
            metadata. Producers do not know how many teams consume the event — filters on subscriptions
            slice traffic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Independent failure domains">
          <p className="text-slate-300">
            Archive queue policy mistake does not block validation queue — SNS tracks delivery per
            subscription. Each leg has its own retry, DLQ, and CloudWatch metrics. Compliance team backlog
            does not throttle real-time ingest validators.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost and scale">
          <p className="text-slate-300">
            SNS charges per publish and per delivery. Fan-out to ten queues on a billion-object inventory
            replay adds up — use filter policies to avoid delivering irrelevant events to every subscriber.
            For replay storms, consider EventBridge with content filtering or direct SQS from controlled
            replay tool instead of blasting all subscribers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Classic SNS → SQS fan-out for DE pipelines">
        <ContentStep number={1} title="Landing zone fan-out">
          <p className="text-slate-300">
            S3 <span className="font-mono text-sm">ObjectCreated</span> → SNS{' '}
            <span className="font-mono text-sm">lake-landing</span> → queues:{' '}
            <span className="font-mono text-sm">ingest-primary</span>,{' '}
            <span className="font-mono text-sm">virus-scan</span>,{' '}
            <span className="font-mono text-sm">lineage-audit</span>,{' '}
            <span className="font-mono text-sm">realtime-metrics</span>. Each queue feeds specialized
            Lambda ESM or Fargate worker with tuned batch size and concurrency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipeline status fan-out">
          <p className="text-slate-300">
            Glue job completion Lambda publishes to{' '}
            <span className="font-mono text-sm">pipeline-status</span> with attributes{' '}
            <span className="font-mono text-sm">status=SUCCEEDED|FAILED</span>. Subscribers: Step Functions
            callback queue (continue orchestration), catalog refresh queue, Slack notifier (filter FAILED
            only), data quality check queue (filter SUCCEEDED on curated jobs).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarm fan-out">
          <p className="text-slate-300">
            CloudWatch composite alarm on ingest health → SNS → email on-call, SQS audit trail, Lambda
            auto-remediation (scale concurrency), EventBridge partner bus for enterprise ticketing. Same
            ALARM transition, four response paths.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Architecture flowchart">
        <Flowchart
          title="S3 landing fan-out — classic DE pattern"
          chart={`flowchart TB
  DROP[Vendor file drop]
  S3[S3 landing bucket]
  SNS[SNS lake-landing topic]
  F1[Filter finance prefix]
  F2[Filter all objects]
  Q1[SQS finance-ingest]
  Q2[SQS virus-scan]
  Q3[SQS audit-archive]
  Q4[SQS metrics-stream]
  L1[Lambda finance ETL]
  L2[Lambda scan]
  L3[Lambda archive]
  L4[Lambda PutMetricData]
  GLUE[Glue curated job]
  DROP --> S3
  S3 --> SNS
  SNS --> F1
  SNS --> F2
  F1 --> Q1
  F2 --> Q2
  F2 --> Q3
  F2 --> Q4
  Q1 --> L1
  Q2 --> L2
  Q3 --> L3
  Q4 --> L4
  L1 --> GLUE`}
        />
        <Callout variant="tip">
          Whiteboard interview: draw one SNS topic in the center, 3–4 SQS queues with filter labels, one
          Lambda per queue, note independent DLQ per queue — shows you understand decoupling and blast radius.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fan-out: one publish → independent delivery per subscriber; add consumers via new subscriptions.',
          'Classic DE: S3 → SNS → multiple SQS queues for ingest, scan, audit, metrics — each with own ESM.',
          'Filter policies prevent every subscriber from receiving every event — critical at scale and cost.',
          'Per-subscription retry and DLQ isolate failures — archive backlog does not block primary ingest.',
          'Pipeline status topics with MessageAttributes enable SUCCEEDED/FAILED routing without multiple publishes.',
        ]}
      />
    </LessonArticle>
  )
}
