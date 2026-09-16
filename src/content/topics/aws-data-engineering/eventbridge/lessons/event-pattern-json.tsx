import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventPatternJson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Content-based routing beats one Lambda parsing every event">
        EventBridge rules use <strong className="text-white">event patterns</strong> — JSON filters on event
        fields — to decide which events invoke which targets. Data engineers filter S3 Object Created events
        by bucket, prefix, and suffix so vendor A files trigger silver ETL while vendor B files trigger a
        different workflow.
      </Callout>

      <Definition term="Event pattern">
        <p>
          A JSON document describing which events match a rule. Patterns match on{' '}
          <span className="font-mono text-sm">source</span>,{' '}
          <span className="font-mono text-sm">detail-type</span>, and nested{' '}
          <span className="font-mono text-sm">detail</span> fields. Only matched events invoke targets —
          no polling, no filtering inside Lambda for events the rule should have excluded.
        </p>
      </Definition>

      <LessonSection title="Event envelope structure">
        <ContentStep number={1} title="Top-level fields">
          <p className="text-slate-300">
            AWS service events share a common envelope:{' '}
            <span className="font-mono text-sm">version</span>,{' '}
            <span className="font-mono text-sm">id</span>,{' '}
            <span className="font-mono text-sm">detail-type</span>,{' '}
            <span className="font-mono text-sm">source</span>,{' '}
            <span className="font-mono text-sm">account</span>,{' '}
            <span className="font-mono text-sm">time</span>,{' '}
            <span className="font-mono text-sm">region</span>, and{' '}
            <span className="font-mono text-sm">detail</span> (service-specific payload). Patterns filter on
            any of these — most DE rules focus on source, detail-type, and detail subfields.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Matching semantics">
          <p className="text-slate-300">
            Exact match on strings and numbers. Arrays in patterns mean OR —{' '}
            <span className="font-mono text-sm">[&quot;FAILED&quot;, &quot;TIMEOUT&quot;]</span> matches either
            state. Prefix matching uses objects like{' '}
            <span className="font-mono text-sm">{`{ "prefix": "raw/vendor_a/" }`}</span> on string fields.
            Anything not specified is a wildcard.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anything-but and numeric ranges">
          <p className="text-slate-300">
            Exclude test buckets with <span className="font-mono text-sm">anything-but</span>. Numeric
            comparisons on detail fields when events carry sizes or counts — rare for S3 but useful for custom
            application events publishing row counts or file sizes.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="S3 Object Created pattern examples">
        <ContentStep number={1} title="Basic landing prefix filter">
          <p className="text-slate-300">
            Match all Object Created events under a raw prefix in a specific bucket — the bread-and-butter
            lake ingest trigger. Enable S3 EventBridge notifications on the bucket first; without that, no
            events reach the bus.
          </p>
        </ContentStep>
        <Example title="S3 Object Created — vendor landing prefix">
{`{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["company-data-lake-prod"]
    },
    "object": {
      "key": [{
        "prefix": "raw/vendor_a/"
      }]
    }
  }
}`}
        </Example>
        <ContentStep number={2} title="Parquet-only silver trigger">
          <p className="text-slate-300">
            Narrow to <span className="font-mono text-sm">.parquet</span> suffix under bronze — ignore
            manifest sidecar files or <span className="font-mono text-sm">_SUCCESS</span> markers that should
            not start a Glue job.
          </p>
        </ContentStep>
        <Example title="S3 Object Created — Parquet suffix filter">
{`{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": {
      "name": ["company-data-lake-prod"]
    },
    "object": {
      "key": [{
        "wildcard": "bronze/sales/*.parquet"
      }]
    }
  }
}`}
        </Example>
        <ContentStep number={3} title="Glue job failure pattern">
          <p className="text-slate-300">
            Same pattern syntax applies to non-S3 events. Filter Glue Job State Change to specific job names
            and FAILED state — route to SNS without Lambda parsing every SUCCESS event in the account.
          </p>
        </ContentStep>
        <Example title="Glue Job State Change — FAILED on named jobs">
{`{
  "source": ["aws.glue"],
  "detail-type": ["Glue Job State Change"],
  "detail": {
    "jobName": ["silver_orders_etl", "silver_customers_etl"],
    "state": ["FAILED", "TIMEOUT"]
  }
}`}
        </Example>
        <Callout variant="insight">
          Test patterns in the EventBridge console <strong className="text-white">Sample event</strong> tool
          before wiring production targets — a typo in <span className="font-mono text-sm">detail-type</span>{' '}
          (Object Created vs Object Created Notification) silently matches zero events.
        </Callout>
      </LessonSection>

      <LessonSection title="DE pattern design practices">
        <ContentStep number={1} title="One rule per pipeline stage">
          <p className="text-slate-300">
            Separate rules for bronze ingest, silver promotion, and ops alerts — not one mega-rule with a
            Lambda that switches on bucket name. IaC modules per domain team; easier to disable one vendor
            without touching others.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Avoid over-broad patterns">
          <p className="text-slate-300">
            Matching all S3 events in an account invokes targets on every bucket — including access logs and
            Athena spill. Always scope bucket name and prefix. Use separate accounts or custom buses for
            sandbox vs prod isolation.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Custom application events">
          <p className="text-slate-300">
            Publish <span className="font-mono text-sm">detail-type: CuratedPartitionReady</span> with{' '}
            <span className="font-mono text-sm">detail</span> containing table, partition keys, and row count.
            Downstream Athena refresh rules match on table name — contract-driven orchestration beyond raw S3
            keys.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event patterns are JSON filters on source, detail-type, and detail — content-based routing without code.',
          'S3: filter bucket.name and object.key prefix/wildcard; enable EventBridge notifications on bucket first.',
          'Glue FAILED: match jobName + state arrays — avoid Lambda parsing every job event in the account.',
          'Test in console sample tool; typos in detail-type match zero events silently.',
          'One rule per pipeline stage; scope bucket/prefix — never all S3 events in an account.',
        ]}
      />
    </LessonArticle>
  )
}
