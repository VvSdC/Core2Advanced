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

export function CustomMetrics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="AWS metrics cover the platform — custom metrics cover your pipeline">
        Lambda publishes <span className="font-mono text-sm">Duration</span> and{' '}
        <span className="font-mono text-sm">Errors</span> automatically. They do not know how many rows
        you landed, whether a vendor SLA was missed, or how deep your quarantine prefix grew. Data engineers
        emit <strong className="text-white">custom metrics</strong> via{' '}
        <span className="font-mono text-sm">PutMetricData</span> to make business and pipeline health visible
        on the same dashboards and alarms as native AWS signals.
      </Callout>

      <Definition term="AWS metrics vs custom metrics">
        <p>
          <strong className="text-white">AWS metrics</strong> are published by services into fixed namespaces
          like <span className="font-mono text-sm">AWS/Lambda</span> — you consume them, you do not define
          them. <strong className="text-white">Custom metrics</strong> live in namespaces you choose (e.g.{' '}
          <span className="font-mono text-sm">DataPlatform/Ingest</span>) and represent application counters,
          gauges, and timings your code or agent publishes explicitly.
        </p>
      </Definition>

      <LessonSection title="Namespace and dimensions">
        <ContentStep number={1} title="Namespace">
          <p className="text-slate-300">
            Group related metrics under one namespace —{' '}
            <span className="font-mono text-sm">DataPlatform/Ingest</span>,{' '}
            <span className="font-mono text-sm">DataPlatform/Glue</span>,{' '}
            <span className="font-mono text-sm">DataPlatform/Quality</span>. Avoid one metric name per vendor
            file; use dimensions instead so alarms and dashboards stay maintainable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dimensions">
          <p className="text-slate-300">
            Dimensions are key-value pairs that slice a metric:{' '}
            <span className="font-mono text-sm">Environment=prod</span>,{' '}
            <span className="font-mono text-sm">Vendor=acme</span>,{' '}
            <span className="font-mono text-sm">Stage=landing</span>. CloudWatch treats each unique
            dimension set as a separate time series. High-cardinality dimensions (every S3 key) explode
            cost and hit service limits — aggregate at vendor or dataset level.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Metric types for DE">
          <p className="text-slate-300">
            <strong className="text-white">Count</strong> — rows ingested, files quarantined, DLQ messages
            replayed. <strong className="text-white">Gauge</strong> — backlog depth, oldest unprocessed
            partition age. <strong className="text-white">Milliseconds</strong> — end-to-end landing-to-curated
            latency per vendor. Use consistent units; CloudWatch stores timestamps in UTC.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric name</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">DE use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RowsIngested', 'Count', 'Vendor, Environment', 'Volume tracking per partner SLA'],
                ['FilesQuarantined', 'Count', 'Reason, Vendor', 'Quality gate failures'],
                ['IngestLagMinutes', 'Gauge', 'Vendor', 'Oldest unprocessed landing file age'],
                ['GlueJobDurationMs', 'Milliseconds', 'JobName', 'Trend job runtime for right-sizing DPU'],
                ['CuratedRowCountDelta', 'Count', 'Table', 'Sanity check vs source after transform'],
              ].map(([name, type, dims, use]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs">{name}</td>
                  <td className="px-4 py-3">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{dims}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="PutMetricData mental model for DE job counters">
        <Definition term="PutMetricData">
          <p>
            The CloudWatch API call <span className="font-mono text-sm">put_metric_data</span> sends one
            or more datapoints to a namespace. Each datapoint includes metric name, value, unit, optional
            dimensions, and timestamp. Batching up to 20 metrics per call reduces API overhead in high-volume
            ingest Lambdas.
          </p>
        </Definition>
        <Flowchart
          title="Custom metric flow in an ingest Lambda"
          chart={`flowchart LR
  S3[S3 ObjectCreated]
  LAM[Lambda ingest handler]
  PROC[Validate and copy to raw]
  CW[CloudWatch PutMetricData]
  DASH[Dashboard and alarms]
  S3 --> LAM
  LAM --> PROC
  PROC --> CW
  CW --> DASH`}
        />
        <Example title="Emit row count and quarantine counter from Lambda">
{`import boto3
from datetime import datetime, timezone

cloudwatch = boto3.client("cloudwatch")
NAMESPACE = "DataPlatform/Ingest"

def emit_rows(vendor: str, row_count: int) -> None:
    cloudwatch.put_metric_data(
        Namespace=NAMESPACE,
        MetricData=[
            {
                "MetricName": "RowsIngested",
                "Value": row_count,
                "Unit": "Count",
                "Timestamp": datetime.now(timezone.utc),
                "Dimensions": [
                    {"Name": "Vendor", "Value": vendor},
                    {"Name": "Environment", "Value": "prod"},
                ],
            }
        ],
    )

def emit_quarantine(vendor: str, reason: str) -> None:
    cloudwatch.put_metric_data(
        Namespace=NAMESPACE,
        MetricData=[
            {
                "MetricName": "FilesQuarantined",
                "Value": 1,
                "Unit": "Count",
                "Dimensions": [
                    {"Name": "Vendor", "Value": vendor},
                    {"Name": "Reason", "Value": reason},
                ],
            }
        ],
    )`}
        </Example>
        <ContentStep number={1} title="Where to emit">
          <p className="text-slate-300">
            Lambda after successful parse; Glue driver script at job end (via boto3 in Python shell or
            Spark listener); Step Functions task success/failure callbacks. Emit on success and failure
            paths — silent success with no metrics hides gradual drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM">
          <p className="text-slate-300">
            Execution roles need <span className="font-mono text-sm">cloudwatch:PutMetricData</span> scoped
            to your namespace via condition keys where possible. Glue job roles and Lambda roles both publish
            custom metrics the same way.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost and cardinality">
          <p className="text-slate-300">
            First 10 custom metrics per month are free tier; beyond that, per-metric monthly charges apply.
            Never dimension by full S3 key or UUID — roll up to vendor, job name, or error category. Use
            Embedded Metric Format (EMF) in Lambda for efficient structured logging that CloudWatch extracts
            into metrics automatically.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview line: &quot;I pair native Lambda Errors with custom RowsIngested and IngestLagMinutes so
          alarms catch both platform failures and silent pipeline stalls.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS metrics are service-published (AWS/Lambda); custom metrics use your namespace and PutMetricData.',
          'Dimensions slice metrics (Vendor, Environment) — avoid high-cardinality keys like full S3 object path.',
          'DE counters: RowsIngested, FilesQuarantined, IngestLagMinutes, GlueJobDurationMs — Count, Gauge, or Ms units.',
          'Emit from Lambda/Glue/Step Functions on success and failure; batch PutMetricData calls when volume is high.',
          'Scope IAM cloudwatch:PutMetricData; consider EMF in Lambda to derive metrics from structured logs.',
        ]}
      />
    </LessonArticle>
  )
}
