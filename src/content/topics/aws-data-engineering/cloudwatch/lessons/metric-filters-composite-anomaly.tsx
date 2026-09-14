import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MetricFiltersCompositeAnomaly() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Logs can become metrics — and alarms can combine signals">
        Not every failure has a native AWS metric. A Glue stack trace only exists in logs until a{' '}
        <strong className="text-white">metric filter</strong> counts ERROR lines. Noisy single-metric alarms
        cause pager fatigue — <strong className="text-white">composite alarms</strong> require multiple
        conditions. Seasonal ingest volume breaks static thresholds —{' '}
        <strong className="text-white">anomaly detection</strong> learns normal bands. These three features
        separate hobby dashboards from operable DE platforms.
      </Callout>

      <Definition term="Metric filter">
        <p>
          A <strong className="text-white">metric filter</strong> watches a CloudWatch Log group, matches
          log events against a filter pattern, and increments a custom metric in a namespace you define.
          Example: every line matching <span className="font-mono text-sm">ERROR</span> in{' '}
          <span className="font-mono text-sm">/aws/lambda/ingest-handler</span> increments{' '}
          <span className="font-mono text-sm">IngestLogErrors</span> — alarm on that metric without
          PutMetricData in application code.
        </p>
      </Definition>

      <LessonSection title="Metric filters from logs">
        <ContentStep number={1} title="Filter patterns">
          <p className="text-slate-300">
            Simple match: literal <span className="font-mono text-sm">ERROR</span> or{' '}
            <span className="font-mono text-sm">?ERROR ?Exception</span>. JSON logs:{' '}
            <span className="font-mono text-sm">{'{ $.event = "ingest_failed" }'}</span> (space-delimited
            filter syntax). Glue driver logs: match{' '}
            <span className="font-mono text-sm">AnalysisException</span> or{' '}
            <span className="font-mono text-sm">OutOfMemoryError</span> to count transform failures.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Emitted metric">
          <p className="text-slate-300">
            Choose metric name and value (usually 1 per match, or extract numeric field). Metric appears
            under the log group&apos;s namespace or a custom namespace. Create alarm on sum over 5 minutes
            &gt; threshold — bridges Logs Insights ad hoc queries to automated paging.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE examples">
          <p className="text-slate-300">
            Lambda: count <span className="font-mono text-sm">Task timed out</span> in REPORT-adjacent logs.
            Ingest: count <span className="font-mono text-sm">quarantine</span> log events. Step Functions:
            filter execution failure JSON from execution log group. Legacy EC2 ETL: agent-shipped logs +
            filter on ERROR without redeploying Python.
          </p>
        </ContentStep>
        <Flowchart
          title="Log line to alarm via metric filter"
          chart={`flowchart LR
  LOG[CloudWatch Log group]
  MF[Metric filter pattern match]
  MET[Custom metric LogErrors]
  ALM[CloudWatch Alarm]
  SNS[SNS pager]
  LOG --> MF
  MF --> MET
  MET --> ALM
  ALM --> SNS`}
        />
      </LessonSection>

      <LessonSection title="Composite alarms">
        <Definition term="Composite alarm">
          <p>
            A <strong className="text-white">composite alarm</strong> combines the state of other alarms
            with AND/OR rules — e.g. ALARM only when{' '}
            <span className="font-mono text-sm">Lambda-Errors-High</span> AND{' '}
            <span className="font-mono text-sm">DLQ-Depth-NonZero</span> are both ALARM. Reduces false
            positives when a single blip on Errors self-heals but DLQ still holds poison messages.
          </p>
        </Definition>
        <ContentStep number={1} title="OR for severity rollup">
          <p className="text-slate-300">
            Composite OR: any of ingest Lambda error, Glue failure event alarm, or SQS oldest message age
            → single <span className="font-mono text-sm">Pipeline-Degraded</span> SNS topic for tier-1
            response. Child alarms still visible individually on dashboard.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AND for confirmed incident">
          <p className="text-slate-300">
            Composite AND: error rate elevated AND custom IngestLagMinutes above SLA — confirms not just
            one bad invoke but backlog building. Fewer pages, higher confidence.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limitations">
          <p className="text-slate-300">
            Composite alarms evaluate child alarm states, not raw metrics directly. Plan child alarm
            treat-missing-data consistently — one child stuck INSUFFICIENT_DATA affects composite logic.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Anomaly detection overview">
        <Definition term="CloudWatch anomaly detection">
          <p>
            Machine learning builds a <strong className="text-white">expected band</strong> around a metric
            based on historical behavior — daily seasonality, weekday vs weekend ingest volume. Alarm when
            values fall <strong className="text-white">outside the band</strong> instead of fixed threshold
            1000 rows/minute that breaks every Black Friday.
          </p>
        </Definition>
        <ContentStep number={1} title="Good DE candidates">
          <p className="text-slate-300">
            Invocations on scheduled ingest Lambdas, S3 AllRequests on landing bucket, custom RowsIngested
            with strong daily pattern. Needs ~ two weeks of history for stable bands — not ideal day-one
            on brand-new pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pair with static floors">
          <p className="text-slate-300">
            Use anomaly for volume drift; keep static alarms on Errors &gt; 0 and DLQ depth — some failures
            are rare and never train a meaningful band. Interview: &quot;Anomaly for seasonality, static
            for hard failures.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Console and IaC">
          <p className="text-slate-300">
            Enable anomaly detection on metric graph → create alarm on band breach. Supported in CloudFormation
            and Terraform for prod parity. Band width sensitivity adjustable — tighter = more alerts.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Metric filters are the fastest win for legacy ETL that logs to files but never called PutMetricData —
          ops gets countable ERROR metrics overnight.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Metric filters turn log pattern matches into CloudWatch metrics — ERROR, ingest_failed, Glue exceptions.',
          'Alarm on filter metrics to automate log-based signals without application PutMetricData changes.',
          'Composite alarms combine child alarms with AND/OR — reduce noise, rollup pipeline severity.',
          'Anomaly detection learns seasonal bands for Invocations/RowsIngested — pair with static Error/DLQ alarms.',
          'Plan child alarm missing-data behavior; metric filters bridge legacy EC2/Airflow logs to paging.',
        ]}
      />
    </LessonArticle>
  )
}
