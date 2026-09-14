import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EtlPipelineMonitoring() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A lake without observability is a storage bill with surprises">
        S3 landing, Lambda ingest, Glue transform, curated Parquet, Athena serve — each stage can fail
        independently. Production DE teams monitor <strong className="text-white">lag</strong>,{' '}
        <strong className="text-white">failures</strong>, <strong className="text-white">duration</strong>,
        and <strong className="text-white">queue depth</strong> on one pipeline dashboard with alarms tied
        to SLAs. This lesson maps what to watch on a typical lake pipeline and how to lay out CloudWatch
        dashboards ops actually uses.
      </Callout>

      <Definition term="Pipeline observability">
        <p>
          <strong className="text-white">Pipeline observability</strong> means measurable signals at each
          stage — not only &quot;Glue failed&quot; but how far behind landing is, whether curated row counts
          match expectations, and whether DLQ depth implies poison data blocking downstream freshness.
        </p>
      </Definition>

      <LessonSection title="What to monitor on a lake pipeline">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ingest lag', 'Custom IngestLagMinutes or SQS oldest message age', 'Files waiting — SLA miss before transform'],
                ['Lambda Errors / Throttles', 'AWS/Lambda', 'Landing handler broken or concurrency starved'],
                ['Glue job failures', 'EventBridge FAILED + custom heartbeat', 'Curated layer stale; downstream BI wrong'],
                ['Job duration trend', 'Custom GlueJobDurationMs', 'Creeping runtime → DPU/right-size before timeout'],
                ['DLQ depth', 'AWS/SQS ingest-dlq', 'Poison messages; silent data loss if ignored'],
                ['Step Functions failures', 'AWS/States ExecutionsFailed', 'Orchestration chain broke mid-pipeline'],
                ['Curated row delta', 'Custom CuratedRowCountDelta or Athena scheduled query', 'Sanity vs source after transform'],
                ['S3 landing growth', 'AWS/S3 NumberOfObjects / custom', 'Vendor stopped sending vs processor stopped'],
              ].map(([signal, source, why]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{signal}</td>
                  <td className="px-4 py-3 font-mono text-xs">{source}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Stage-by-stage monitoring">
        <ContentStep number={1} title="Landing / ingest">
          <p className="text-slate-300">
            S3 event → SQS → Lambda: alarm queue oldest message age, Lambda error rate, throttles, DLQ &gt; 0.
            Custom metric: minutes since newest successful file per vendor. Metric filter on quarantine log
            lines for quality gate volume.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transform (Glue)">
          <p className="text-slate-300">
            EventBridge on Glue Job State Change FAILED/TIMEOUT. Custom duration and rows-written metrics
            emitted at job end. Compare to historical p95 on dashboard — early warning before hard failure.
            Logs Insights saved query linked from alarm runbook.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Orchestration (Step Functions)">
          <p className="text-slate-300">
            ExecutionsFailed, ExecutionsTimedOut, execution duration per state machine. Map failed state
            name in Slack alert — ops knows whether Glue start vs Athena check failed without opening console.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Serve / freshness">
          <p className="text-slate-300">
            Custom <span className="font-mono text-sm">DataFreshnessMinutes</span> — time since last successful
            curated partition for gold table. Business-facing SLA alarm here; technical alarms upstream give
            lead time to fix before freshness breaches.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Sample dashboard layout">
        <ContentStep number={1} title="Row 1 — SLA and health">
          <p className="text-slate-300">
            Single-value widgets: DataFreshnessMinutes (green/yellow/red), open DLQ count, active Glue failures
            last 24h. Ops glances here in standup.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Row 2 — Ingest">
          <p className="text-slate-300">
            Line charts: Lambda invocations vs errors (metric math rate), SQS visible messages, IngestLagMinutes
            by vendor dimension. Overlay deploy markers as annotations when CI publishes new handler version.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Row 3 — Transform and orchestration">
          <p className="text-slate-300">
            Glue job duration p50/p95, Step Functions success vs failed executions, custom RowsIngested vs
            RowsCurated stacked area — spot divergence indicating transform drops rows.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Row 4 — Logs Insights">
          <p className="text-slate-300">
            Embedded Insights widgets: top ERROR messages last hour, quarantine reasons count. Bridges metrics
            to text without leaving dashboard during incident.
          </p>
        </ContentStep>
        <Flowchart
          title="Lake pipeline monitoring flow"
          chart={`flowchart LR
  LAND[S3 landing]
  Q[SQS plus Lambda]
  RAW[S3 raw]
  GLUE[Glue transform]
  CUR[S3 curated]
  SF[Step Functions]
  LAND --> Q
  Q --> RAW
  RAW --> GLUE
  GLUE --> CUR
  SF --> GLUE
  Q --> M1[Queue lag Lambda errors DLQ]
  GLUE --> M2[Job fail duration rows]
  SF --> M3[Execution failed timeout]
  CUR --> M4[Data freshness SLA]
  M1 --> DASH[CloudWatch dashboard]
  M2 --> DASH
  M3 --> DASH
  M4 --> DASH
  DASH --> ALM[Alarms SNS]`}
        />
        <Callout variant="tip">
          Name alarms and dashboard widgets with pipeline stage prefix —{' '}
          <span className="font-mono text-sm">ingest-*</span>,{' '}
          <span className="font-mono text-sm">glue-*</span>,{' '}
          <span className="font-mono text-sm">freshness-*</span> — so EventBridge and on-call routing stay obvious.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Monitor lag, failures, duration, DLQ depth, and freshness — not just individual service health.',
          'Ingest: SQS age, Lambda errors/throttles, DLQ; Transform: Glue FAILED events + duration trends.',
          'Orchestration: Step Functions failed states; Business: DataFreshnessMinutes on curated output.',
          'Dashboard rows: SLA summary → ingest → transform → Insights ERROR widget for one-pane ops.',
          'Align alarm names with stage prefixes; custom metrics bridge business SLA to technical upstream signals.',
        ]}
      />
    </LessonArticle>
  )
}
