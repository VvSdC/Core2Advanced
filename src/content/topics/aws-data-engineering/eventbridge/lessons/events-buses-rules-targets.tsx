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

export function EventsBusesRulesTargets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Four building blocks — one pipeline story">
        Every EventBridge diagram you draw in DE work uses the same four nouns:{' '}
        <strong className="text-white">event</strong>, <strong className="text-white">event bus</strong>,{' '}
        <strong className="text-white">rule</strong>, and <strong className="text-white">target</strong>.
        Master how they connect and you can read any lake trigger architecture — S3 landing, nightly Glue,
        failure alerts — without opening the console.
      </Callout>

      <Definition term="EventBridge building blocks">
        <p>
          An <strong className="text-white">event</strong> is a JSON document describing something that
          happened. An <strong className="text-white">event bus</strong> receives and routes events. A{' '}
          <strong className="text-white">rule</strong> matches events (by pattern or schedule) and selects
          targets. A <strong className="text-white">target</strong> is the AWS resource that EventBridge
          invokes when a rule fires — Lambda, Glue, Step Functions, SNS, and more.
        </p>
      </Definition>

      <LessonSection title="Event — the message">
        <p className="text-slate-300">
          Events are lightweight JSON. AWS service events share common top-level fields; the service-specific
          payload lives in <code className="text-core-400">detail</code>.
        </p>
        <ContentStep number={1} title="Common envelope fields">
          <p className="text-slate-300">
            <code className="text-core-400">version</code>,{' '}
            <code className="text-core-400">id</code>, <code className="text-core-400">detail-type</code>,{' '}
            <code className="text-core-400">source</code>, <code className="text-core-400">account</code>,{' '}
            <code className="text-core-400">time</code>, <code className="text-core-400">region</code>, and{' '}
            <code className="text-core-400">detail</code>. Your rules usually filter on{' '}
            <code className="text-core-400">source</code>,{' '}
            <code className="text-core-400">detail-type</code>, and fields inside{' '}
            <code className="text-core-400">detail</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE examples of events">
          <p className="text-slate-300">
            S3 Object Created (bucket, key, size), Glue Job Run State Change (job name, state SUCCEEDED or
            FAILED), scheduled tick from a cron rule (minimal payload — the schedule itself is the signal).
          </p>
        </ContentStep>
        <Example title="Simplified S3 Object Created event shape" caption="Illustrative — field names vary by config">
{`{
  "version": "0",
  "id": "abc-123-def",
  "detail-type": "Object Created",
  "source": "aws.s3",
  "account": "111122223333",
  "time": "2026-03-15T02:04:11Z",
  "region": "us-east-1",
  "detail": {
    "bucket": { "name": "acme-lake" },
    "object": { "key": "raw/orders/dt=2026-03-15/file.csv", "size": 1048576 }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Event bus — where events arrive">
        <ContentStep number={1} title="Default bus">
          <p className="text-slate-300">
            Named <code className="text-core-400">default</code> in each Region. AWS services publish here
            when configured (S3 to EventBridge, Glue job states, etc.). Most beginner DE rules live on the
            default bus.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom buses (teaser)">
          <p className="text-slate-300">
            Platform teams create buses like <code className="text-core-400">acme-data-platform</code> for
            application teams to publish custom events — isolates prod analytics triggers from unrelated
            account noise. Cross-account policies attach to custom buses.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One bus, many rules">
          <p className="text-slate-300">
            All rules on a bus evaluate independently. One S3 landing event can match three rules — start
            silver ETL, invoke QA Lambda, write to archive — without the uploader knowing about any of them.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Rule — filter or schedule">
        <ContentStep number={1} title="Event pattern rules">
          <p className="text-slate-300">
            Run when an incoming event matches a JSON pattern — e.g.{' '}
            <code className="text-core-400">aws.s3</code> source and Object Created in{' '}
            <code className="text-core-400">raw/orders/</code> prefix. Covered in depth in the event patterns
            lesson.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scheduled rules">
          <p className="text-slate-300">
            Run on cron or rate — no incoming event required. EventBridge generates an internal invocation on
            the timer. Nightly lake builds use this pattern heavily.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rule state and permissions">
          <p className="text-slate-300">
            Rules can be enabled or disabled — disable during maintenance without deleting targets. The rule
            execution role (or target-specific role) needs IAM permission to invoke each target — e.g.{' '}
            <code className="text-core-400">lambda:InvokeFunction</code>,{' '}
            <code className="text-core-400">glue:StartWorkflowRun</code>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Target — who runs next">
        <ContentStep number={1} title="Lambda — validate, transform, lightweight orchestrate">
          <p className="text-slate-300">
            Check file size and schema, move bad files to quarantine prefix, or pass bucket/key to Step
            Functions. Receives the event JSON as the invocation payload (optionally transformed).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue — job or workflow">
          <p className="text-slate-300">
            Start a single Glue ETL job or an entire Glue workflow DAG. Common pattern: S3 rule targets
            workflow <code className="text-core-400">orders-raw-to-silver</code> with run properties derived
            from the event.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Step Functions — multi-step lake build">
          <p className="text-slate-300">
            Scheduled rule starts state machine that chains crawl, ETL, QA Lambda, and SNS success notification
            — EventBridge is the front door; Step Functions is the conductor.
          </p>
        </ContentStep>
        <ContentStep number={4} title="SNS, SQS, CloudWatch Logs">
          <p className="text-slate-300">
            SNS for human alerts on Glue FAILED; SQS for buffering bursts before a limited-concurrency Lambda;
            CloudWatch Logs for audit trail of every matched landing event.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How they connect — end-to-end">
        <Flowchart
          title="Event → bus → rule → target(s)"
          chart={`flowchart LR
  E[Event JSON]
  E --> B[Event bus]
  B --> R[Rule pattern or schedule]
  R --> T1[Target Lambda]
  R --> T2[Target Glue workflow]
  R --> T3[Target SNS alert]
  T1 --> S3R[Read S3 object]
  T2 --> ETL[Spark ETL run]
  T3 --> OPS[On-call notification]`}
        />
        <p className="mt-4 text-slate-300">
          Producers never call targets directly. S3 publishes to the bus; your rule decides whether this
          particular Object Created in <code className="text-core-400">raw/orders/</code> should start Glue.
          A different rule on the same bus might ignore orders and react only to{' '}
          <code className="text-core-400">raw/inventory/</code> — same bus, different filters.
        </p>
        <Callout variant="tip" title="DE wiring checklist">
          For each pipeline trigger, document four lines on the diagram: what event (source + detail-type),
          which bus, which rule name, which target ARN. Missing any one line explains most &quot;nothing
          ran&quot; incidents.
        </Callout>
      </LessonSection>

      <LessonSection title="Multiple targets on one rule">
        <p className="text-slate-300">
          One rule can fan out to several targets simultaneously. A Glue failure rule might send the same
          event to SNS (page on-call) and CloudWatch Logs (audit). EventBridge invokes each target
          independently — if SNS succeeds but Lambda fails, check failed invocations and dead-letter config on
          the failing target, not the whole rule.
        </p>
        <Example title="Beginner rule inventory" caption="Typical DE starter set on default bus">
{`Rule: de-s3-orders-raw-created-prod
  Bus: default
  Pattern: aws.s3 Object Created, bucket acme-lake, prefix raw/orders/
  Targets: Lambda acme-validate-orders-raw, Glue workflow orders-landing

Rule: de-nightly-silver-etl-prod
  Bus: default
  Schedule: cron(0 2 * * ? *)  — 02:00 UTC daily
  Targets: Step Functions acme-lake-nightly-build

Rule: de-glue-job-failed-alert-prod
  Bus: default
  Pattern: Glue Job Run State Change, state FAILED
  Targets: SNS topic de-etl-alerts`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event = JSON message; bus = router; rule = pattern or schedule filter; target = Lambda, Glue, Step Functions, SNS, etc.',
          'Default bus receives most AWS service events; custom buses isolate domains and cross-account traffic (later).',
          'One event on one bus can match multiple rules; one rule can invoke multiple targets — independent fan-out.',
          'Document event source, bus, rule name, and target ARN on every DE trigger in your architecture diagram.',
        ]}
      />
    </LessonArticle>
  )
}
