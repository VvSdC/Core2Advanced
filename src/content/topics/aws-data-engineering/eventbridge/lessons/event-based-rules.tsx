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

export function EventBasedRules() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Rules that fire when something happens">
        <strong className="text-white">Event-based rules</strong> listen on an event bus and run their
        targets only when an incoming event matches the rule&apos;s event pattern. For data engineering, that
        usually means AWS service events — S3 Object Created, Glue Job Run State Change, DMS replication
        tasks — not a clock on the wall.
      </Callout>

      <Definition term="Event-based rule">
        <p>
          An EventBridge rule with an <strong className="text-white">event pattern</strong> (not a schedule)
          is an event-based rule. When a matching event arrives on the bus, EventBridge evaluates the rule,
          applies optional input transformation, and asynchronously invokes each configured target. Non-matching
          events pass through without invoking those targets.
        </p>
      </Definition>

      <LessonSection title="How event-based rules differ from scheduled rules">
        <ContentStep number={1} title="Trigger = external event">
          <p className="text-slate-300">
            Something in AWS (or a custom publisher) must emit an event. S3 does not invoke Glue directly —
            S3 sends Object Created to the bus; your event-based rule bridges to Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Unpredictable timing">
          <p className="text-slate-300">
            Vendor files may land at 01:12, 03:47, or 14:02. Event-based rules fit micro-batch and
            near-real-time ingest — process each file when it appears instead of waiting for nightly cron.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pattern required">
          <p className="text-slate-300">
            Every event-based rule needs a pattern (or uses a broad one intentionally). Scheduled rules use{' '}
            <code className="text-core-400">schedule-expression</code> instead — covered in the cron/rate
            lesson.
          </p>
        </ContentStep>
        <Flowchart
          title="Event-based vs scheduled mental model"
          chart={`flowchart TB
  subgraph eventBased [Event-based rule]
    S3E[S3 emits event] --> PAT[Pattern match]
    PAT --> TG1[Target Glue]
  end
  subgraph scheduled [Scheduled rule]
    CLK[EventBridge timer] --> TG2[Target Step Functions]
  end`}
        />
      </LessonSection>

      <LessonSection title="Common AWS service events for DE">
        <ContentStep number={1} title="Amazon S3">
          <p className="text-slate-300">
            Enable EventBridge notifications on the bucket. Object Created, Object Deleted, and other
            detail-types feed landing, quarantine, and reconciliation pipelines. Most lake ingest starts here.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS Glue">
          <p className="text-slate-300">
            Job Run State Change and Crawler State Change events report SUCCEEDED, FAILED, TIMEOUT. Chain gold
            jobs on success; page on-call on failure — event-based operational wiring without polling Glue
            API.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS DMS and RDS-related signals">
          <p className="text-slate-300">
            DMS task state changes can trigger validation Lambdas or notify when CDC lag exceeds threshold.
            Combine with scheduled QA for hybrid operational models.
          </p>
        </ContentStep>
        <ContentStep number={4} title="AWS Step Functions">
          <p className="text-slate-300">
            Execution status change events let downstream marts start when the nightly orchestration
            state machine completes — decouple teams without shared Step Functions definitions.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE pipeline patterns with event-based rules">
        <ContentStep number={1} title="Landing → validate → ETL">
          <p className="text-slate-300">
            Rule 1: S3 Object Created in <code className="text-core-400">raw/</code> → Lambda validates schema
            and row counts. Lambda writes good files to <code className="text-core-400">validated/</code> or
            starts Glue directly. Bad files move to <code className="text-core-400">quarantine/</code> with
            SNS alert — all event-driven.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue success chains downstream">
          <p className="text-slate-300">
            Rule 2: Glue Job Run State Change, job{' '}
            <code className="text-core-400">de-silver-orders</code>, state SUCCEEDED → start Glue job{' '}
            <code className="text-core-400">de-gold-orders-daily</code> or Step Functions segment. Silver
            completion becomes the gold trigger without hard-coded waits in Spark scripts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Failure-only alert rule">
          <p className="text-slate-300">
            Rule 3: Glue FAILED for jobs matching prefix <code className="text-core-400">de-</code> → SNS
            topic with job name and error in the payload. Narrow pattern avoids paging on unrelated account
            Glue jobs.
          </p>
        </ContentStep>
        <Example title="Event-based rule inventory — orders pipeline" caption="Three rules, one bus, clear names">
{`Rule A — de-s3-orders-raw-created
  Type: event pattern
  Event: aws.s3 Object Created, bucket acme-lake, prefix raw/orders/
  Target: Glue workflow orders-landing

Rule B — de-glue-silver-orders-success
  Type: event pattern
  Event: Glue Job Run State Change, jobName de-silver-orders, state SUCCEEDED
  Target: Glue job de-gold-orders-daily

Rule C — de-glue-etl-failed-alert
  Type: event pattern
  Event: Glue Job Run State Change, state FAILED, jobName prefix de-
  Target: SNS de-etl-alerts`}
        </Example>
      </LessonSection>

      <LessonSection title="Prerequisites producers often forget">
        <ContentStep number={1} title="S3 must send events to EventBridge">
          <p className="text-slate-300">
            Bucket notification configuration must enable EventBridge — legacy S3→Lambda only does not populate
            the bus. Zero invocations after uploads often means this toggle, not a bad pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue events are automatic on the default bus">
          <p className="text-slate-300">
            Glue job state events appear when jobs run in your account — no extra enable step. If patterns
            never match, verify job name spelling and state field values in a sample event from CloudWatch
            Logs or the console test feature.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Target IAM and concurrency">
          <p className="text-slate-300">
            Event-based bursts — 500 files uploaded at once — invoke 500 target calls. Glue workflows may need
            concurrency limits; SQS buffer between rule and Lambda absorbs spikes. Plan for thundering herd
            on landing days.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Duplicate triggers">
          Do not enable S3→Lambda, S3→SQS, and EventBridge→Glue on the same prefix without coordination —
          triple ETL runs waste money and corrupt idempotency. Pick one primary path; use EventBridge fan-out
          if multiple consumers need the same signal.
        </Callout>
      </LessonSection>

      <LessonSection title="Event-based vs Glue native event triggers">
        <p className="text-slate-300">
          Glue workflows support event triggers wired to EventBridge. For Glue-only DAGs, native workflow event
          triggers are fine. Use account-level EventBridge rules when one S3 event must hit Lambda QA, Glue
          workflow, and SNS audit — multiple services, one pattern, several targets.
        </p>
        <Flowchart
          title="S3 event fans out via EventBridge rules"
          chart={`flowchart LR
  S3[S3 Object Created]
  S3 --> EB[Default bus]
  EB --> R1[Rule landing ETL]
  EB --> R2[Rule QA Lambda]
  EB --> R3[Rule audit log]
  R1 --> GW[Glue workflow]
  R2 --> LAM[Lambda schema check]
  R3 --> LOG[CloudWatch Logs]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event-based rules fire when a matching AWS (or custom) event hits the bus — no schedule involved.',
          'Top DE sources: S3 Object Created for ingest, Glue state change for chain and alert, Step Functions completion for downstream marts.',
          'Enable S3→EventBridge on the bucket; verify patterns with sample events before pointing at prod Glue.',
          'Use EventBridge fan-out when multiple services consume the same event; avoid duplicate S3 notification paths.',
        ]}
      />
    </LessonArticle>
  )
}
