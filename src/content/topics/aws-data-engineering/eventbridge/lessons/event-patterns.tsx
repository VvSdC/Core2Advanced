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

export function EventPatterns() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Filter only the events you care about">
        The default event bus receives thousands of AWS service signals — EC2 state changes, CodePipeline
        runs, S3 operations across every bucket.{' '}
        <strong className="text-white">Event patterns</strong> are JSON filters on your rules so only the
        landing files, failed Glue jobs, or specific prefixes wake up your ETL — not every Object Created in
        the account.
      </Callout>

      <Definition term="Event pattern">
        <p>
          An <strong className="text-white">event pattern</strong> is JSON that describes which incoming
          events match a rule. EventBridge compares each event against the pattern; on match, the rule
          invokes its targets. Patterns filter on top-level fields like{' '}
          <code className="text-core-400">source</code> and{' '}
          <code className="text-core-400">detail-type</code>, and on nested fields inside{' '}
          <code className="text-core-400">detail</code> using dot notation or nested objects — without writing
          code.
        </p>
      </Definition>

      <LessonSection title="Pattern matching — high level">
        <ContentStep number={1} title="Exact match on strings">
          <p className="text-slate-300">
            Most fields use exact string match.{' '}
            <code className="text-core-400">&quot;source&quot;: [&quot;aws.s3&quot;]</code> matches only S3
            events. Arrays mean &quot;match any of these values.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Nested detail fields">
          <p className="text-slate-300">
            S3 bucket name, object key, and size live under{' '}
            <code className="text-core-400">detail</code>. Glue job name and state live there too. Patterns
            mirror the event structure — filter{' '}
            <code className="text-core-400">detail.bucket.name</code> or nested{' '}
            <code className="text-core-400">detail.object.key</code> with prefix-style operators where
            supported.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prefix and suffix matching for S3 keys">
          <p className="text-slate-300">
            DE pipelines almost always scope rules to a prefix like{' '}
            <code className="text-core-400">raw/orders/</code> so curated or temp uploads do not trigger silver
            ETL. EventBridge supports prefix and suffix filters on key paths — essential for medallion zones
            on one shared bucket.
          </p>
        </ContentStep>
        <Flowchart
          title="Event arrives → pattern check → match or ignore"
          chart={`flowchart TD
  EV[Incoming event]
  EV --> P{Rule pattern}
  P -->|match raw/orders/| YES[Invoke targets]
  P -->|match raw/inventory/| INV[Different rule targets]
  P -->|no match| DROP[Event ignored by this rule]
  YES --> GLUE[Glue workflow]
  INV --> LAM[Lambda inventory]`}
        />
      </LessonSection>

      <LessonSection title="DE-focused pattern examples">
        <ContentStep number={1} title="S3 Object Created in raw orders prefix">
          <p className="text-slate-300">
            Match <code className="text-core-400">aws.s3</code>, detail-type Object Created, bucket{' '}
            <code className="text-core-400">acme-lake</code>, key prefix{' '}
            <code className="text-core-400">raw/orders/</code>. Targets start validation Lambda or Glue
            landing workflow — the bread-and-butter lake ingest trigger.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue job failed">
          <p className="text-slate-300">
            Match <code className="text-core-400">aws.glue</code>, Glue Job Run State Change,{' '}
            <code className="text-core-400">detail.state</code> FAILED, optionally restrict to job names
            matching <code className="text-core-400">de-silver-</code> prefix. Target SNS for on-call — ops
            learns before stakeholders ask why dashboards are stale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Multiple detail-types with one rule">
          <p className="text-slate-300">
            An array on <code className="text-core-400">detail-type</code> can match Object Created and
            Object Deleted if you need reconciliation jobs — use sparingly; separate rules keep IAM and
            targets clearer for beginners.
          </p>
        </ContentStep>
        <Example title="Illustrative S3 landing pattern" caption="Structure only — adjust to your bucket layout">
{`{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["acme-lake"]
    },
    "object": {
      "key": [{ "prefix": "raw/orders/" }]
    }
  }
}`}
        </Example>
        <Example title="Illustrative Glue failure pattern" caption="Alert when specific jobs fail">
{`{
  "source": ["aws.glue"],
  "detail-type": ["Glue Job Run State Change"],
  "detail": {
    "state": ["FAILED"],
    "jobName": [{ "prefix": "de-silver-" }]
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Why filtering matters in production">
        <ContentStep number={1} title="Cost and noise">
          <p className="text-slate-300">
            Every target invocation may start a Glue run (DPU-minutes) or Lambda (GB-seconds). A rule without
            prefix filter on a shared lake bucket can trigger silver ETL on QA uploads, manual renames, and
            lifecycle transitions — expensive false positives.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Least privilege IAM">
          <p className="text-slate-300">
            Tight patterns pair with tight target permissions. The landing workflow role needs write access
            only to <code className="text-core-400">silver/orders/</code> — the pattern proves the event is
            in scope before code runs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Environment separation">
          <p className="text-slate-300">
            Separate rules (or separate accounts) for <code className="text-core-400">acme-lake-dev</code> vs{' '}
            <code className="text-core-400">acme-lake-prod</code> bucket names in the pattern — never one
            prod target on a pattern that accidentally matches dev buckets.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Start strict: bucket name + prefix + expected detail-type. Loosen only when a legitimate event is
          dropped — CloudWatch metrics on Invocations and FailedInvocations per rule show gaps quickly.
        </Callout>
      </LessonSection>

      <LessonSection title="Pattern vs schedule — do not confuse">
        <p className="text-slate-300">
          Event pattern rules react to incoming events. Scheduled rules use{' '}
          <code className="text-core-400">schedule-expression</code> instead of a pattern — no S3 event
          required. A nightly silver job uses cron; a file landing job uses pattern. Some pipelines use both:
          schedule for baseline batch, pattern for late-arriving vendor files.
        </p>
      </LessonSection>

      <LessonSection title="Testing patterns safely">
        <ContentStep number={1} title="EventBridge sandbox sample events">
          <p className="text-slate-300">
            Console lets you send sample events to test whether a pattern matches before enabling prod targets.
            Paste a recorded S3 event from CloudTrail or documentation samples.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Target a log first">
          <p className="text-slate-300">
            Point new rules at CloudWatch Logs or a no-op Lambda that only logs the payload. Confirm prefix
            filters behave as expected, then swap target to Glue workflow.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Metrics">
          <p className="text-slate-300">
            Watch <code className="text-core-400">TriggeredRules</code> and{' '}
            <code className="text-core-400">Invocations</code> metrics. Zero invocations after known uploads
            usually means pattern typo — wrong bucket name, missing prefix slash, or S3 notifications not
            enabled to EventBridge.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event patterns are JSON filters — match source, detail-type, and nested detail fields; ignore everything else on the bus.',
          'DE essentials: S3 bucket + key prefix for landing zones; Glue job name + FAILED state for alerts.',
          'Tight patterns save cost and prevent wrong-environment triggers — start strict, loosen with evidence.',
          'Pattern rules react to events; scheduled rules use cron/rate — many pipelines combine both.',
        ]}
      />
    </LessonArticle>
  )
}
