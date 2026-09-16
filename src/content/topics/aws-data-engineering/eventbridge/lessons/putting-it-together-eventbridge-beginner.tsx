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

export function PuttingItTogetherEventbridgeBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before targets and production deep dives">
        You now know what EventBridge is, how events buses rules and targets connect, how event patterns filter
        S3 and Glue signals, how event-based rules differ from scheduled cron and rate rules, and why the
        default bus is your starting inbox. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner EventBridge checklist</strong> — the mental model you need
        before input transformers, archive and replay, and cross-account buses in a dev account.
      </Callout>

      <Definition term="Beginner EventBridge mental model">
        <p>
          A <strong className="text-white">beginner EventBridge mental model</strong> for DE includes: default
          bus in the lake Region, S3 EventBridge notifications enabled on ingest buckets, event-based rules
          scoped by bucket and prefix for landing, separate rules for Glue FAILED alerts and SUCCEEDED chains,
          cron scheduled rule for nightly Step Functions or Glue workflow baseline, named rules with{' '}
          <code className="text-core-400">de-</code> prefix, IAM on targets verified, and CloudWatch metrics
          on invocations — all before custom buses and production hardening in the next module.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Default bus as hub">
          <p className="text-slate-300">
            All beginner rules on <code className="text-core-400">default</code> in the same Region as the
            lake bucket and Glue jobs — documented on the pipeline diagram.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 → EventBridge enabled">
          <p className="text-slate-300">
            Bucket notification configuration sends events to EventBridge — not only legacy Lambda or SQS
            unless intentionally parallel (avoid duplicate ETL).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Landing rule with tight pattern">
          <p className="text-slate-300">
            Event pattern: <code className="text-core-400">aws.s3</code>, Object Created, prod bucket name,{' '}
            <code className="text-core-400">raw/</code> zone prefix — target Lambda validate or Glue workflow
            start.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Nightly scheduled rule">
          <p className="text-slate-300">
            Cron e.g. <code className="text-core-400">cron(0 2 * * ? *)</code> UTC targeting Step Functions
            or Glue workflow for medallion batch — documented alongside vendor cutoff times.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Operational rules">
          <p className="text-slate-300">
            Glue FAILED pattern → SNS on-call; optional SUCCEEDED chain to downstream gold job — narrow job
            name prefix <code className="text-core-400">de-</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE EventBridge stack"
          chart={`flowchart TD
  S3[S3 raw landing enabled]
  S3 --> DEF[Default bus]
  CRON[Scheduled cron 02:00 UTC] --> DEF
  GLUEE[Glue job state events] --> DEF
  DEF --> R1[Rule S3 landing]
  DEF --> R2[Rule nightly batch]
  DEF --> R3[Rule Glue failed]
  R1 --> GW[Glue workflow / Lambda]
  R2 --> SF[Step Functions lake build]
  R3 --> SNS[SNS alert]
  GW --> CUR[S3 curated]
  SF --> CUR`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is EventBridge in one sentence?">
          <p className="text-slate-300">
            A serverless event router — buses receive events, rules match patterns or schedules, targets run
            the next pipeline step.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event vs bus vs rule vs target">
          <p className="text-slate-300">
            Event = JSON message; bus = router; rule = filter or timer; target = Lambda, Glue, Step Functions,
            SNS, etc.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Event-based vs scheduled rule">
          <p className="text-slate-300">
            Event-based reacts to AWS service events (S3, Glue). Scheduled uses cron or rate — no incoming
            event required.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Why event patterns?">
          <p className="text-slate-300">
            The default bus is noisy — bucket + prefix + detail-type filters prevent wrong triggers and wasted
            Glue runs.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Default bus">
          <p className="text-slate-300">
            Pre-existing per account/Region inbox for AWS service events and your rules — named{' '}
            <code className="text-core-400">default</code>.
          </p>
        </ContentStep>
        <ContentStep number={6} title="CloudWatch Events vs EventBridge">
          <p className="text-slate-300">
            Same default bus heritage; EventBridge adds custom buses, archive, Schema Registry — say EventBridge
            in modern docs.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when S3 rule never fires?">
          <p className="text-slate-300">
            Confirm S3 EventBridge notifications enabled, then pattern bucket/prefix, then target IAM — before
            opening Glue logs.
          </p>
        </ContentStep>
        <Example title="Beginner EventBridge concept drill" caption="No console required yet — explain aloud">
{`1. Draw: S3 upload → default bus → rule → Glue workflow → curated S3
2. Why enable S3 EventBridge instead of only S3→Lambda?
3. What cron runs daily at 02:00 UTC?
4. Name two event-based DE use cases and one scheduled use case
5. What happens if two rules match the same S3 event?
6. Why avoid duplicate S3 notification paths to Lambda and EventBridge?
7. When would you introduce a custom bus instead of default?`}
        </Example>
        <Callout variant="insight">
          Strong EventBridge beginners do not memorize every target type on day one. They ask: what event starts
          the pipeline, which rule filters it, and what runs next — three questions that prevent silent missed
          loads and double-fired ETL.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme enables EventBridge on <code className="text-core-400">acme-lake-prod</code>. Rule{' '}
          <code className="text-core-400">de-s3-orders-raw-created</code> matches Object Created under{' '}
          <code className="text-core-400">raw/orders/</code> and starts Glue workflow{' '}
          <code className="text-core-400">orders-landing</code>. Rule{' '}
          <code className="text-core-400">de-nightly-lake-build</code> runs{' '}
          <code className="text-core-400">cron(0 2 * * ? *)</code> and starts Step Functions{' '}
          <code className="text-core-400">acme-lake-nightly</code> for crawl, silver, gold, and Athena QA.
          Rule <code className="text-core-400">de-glue-failed-alert</code> sends Glue FAILED events for jobs
          prefixed <code className="text-core-400">de-</code> to SNS{' '}
          <code className="text-core-400">de-etl-alerts</code>. VPC carries Glue JDBC traffic; EventBridge
          carries start signals — when a vendor file lands at 03:20 UTC, landing workflow runs immediately;
          nightly batch still reconciles at 02:00. On-call checks TriggeredRules metric when stakeholders report
          missing data — pattern typo before Spark.
        </p>
        <ContentStep number={1} title="Signal tier — S3 and Glue emit events">
          <p className="text-slate-300">Producers publish to default bus — enable S3, Glue automatic.</p>
        </ContentStep>
        <ContentStep number={2} title="Filter tier — rules and patterns">
          <p className="text-slate-300">Bucket, prefix, job name, state — strict patterns per environment.</p>
        </ContentStep>
        <ContentStep number={3} title="Action tier — targets">
          <p className="text-slate-300">Glue workflows, Step Functions, SNS — IAM roles per target.</p>
        </ContentStep>
        <ContentStep number={4} title="Schedule tier — cron baseline">
          <p className="text-slate-300">Nightly batch independent of unpredictable file arrival times.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the EventBridge track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Targets in depth — Lambda, Glue, Step Functions">
          <p className="text-slate-300">
            Input transformers pass bucket and key into Glue workflow run properties; dead-letter queues catch
            failed invocations; retry policies and maximum event age for prod reliability.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 patterns and multi-prefix lakes">
          <p className="text-slate-300">
            Medallion zones on one bucket — separate rules per bronze, silver quarantine, and partner prefix;
            suffix filters for <code className="text-core-400">.csv</code> vs{' '}
            <code className="text-core-400">.parquet</code> landings.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Archive, replay, and audit">
          <p className="text-slate-300">
            Event archive on the bus replays missed events after outage — recover landing workflows without
            manual re-upload; compliance teams audit who received which signals.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Production features — custom buses and cross-account">
          <p className="text-slate-300">
            Custom buses for data mesh accounts, Schema Registry for contract testing, EventBridge Pipes for
            point-to-point SQS→Lambda with filtering — full platform diagrams assuming you can explain
            default-bus S3 and cron triggers from memory.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          EventBridge connects everything you built in prior modules: VPC places Glue on private paths, S3
          holds lake data, Glue transforms and catalogs, RDS feeds extracts — EventBridge decides when those
          pieces run and alerts when they fail. Advanced orchestration with Step Functions and Glue Workflows
          assumes you can draw the S3 → bus → rule → target path and name one nightly cron expression without
          opening the console.
        </p>
        <Callout variant="tip" title="Before your first prod landing rule">
          Point the rule at CloudWatch Logs for one day of real uploads. Confirm prefix filters match vendor
          key layout — teams that skip this burn days on zero-invocation mysteries when the prefix lacks a
          trailing slash.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: default bus, S3 EventBridge enabled, scoped landing patterns, nightly cron, Glue FAILED alerts, de- rule naming.',
          'Self-check: EventBridge definition, four building blocks, event vs scheduled rules, patterns, default bus, debug order.',
          'Combine event-based landing with scheduled baseline — VPC for network, EventBridge for when ETL runs.',
          'Next in EventBridge track: target transformers and DLQ, advanced S3 patterns, archive/replay, custom buses and cross-account.',
        ]}
      />
    </LessonArticle>
  )
}
