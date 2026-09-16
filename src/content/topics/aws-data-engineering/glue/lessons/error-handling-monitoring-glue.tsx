import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ErrorHandlingMonitoringGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Silent ETL failures corrupt downstream trust">
        Glue jobs fail from IAM denials, skew OOM, bad landing files, and VPC timeouts — often after 40 minutes
        of DPU spend. Production pipelines implement <strong className="text-white">retries with limits</strong>,
        quarantine paths, alerting, and CloudWatch dashboards — not just console log checks the morning after.
      </Callout>

      <Definition term="Glue job failure modes">
        <p>
          Common categories: <strong className="text-white">infra</strong> (VPC ENI, throttling),{' '}
          <strong className="text-white">data</strong> (schema mismatch, corrupt file),{' '}
          <strong className="text-white">code</strong> (null pointer, wrong join key), and{' '}
          <strong className="text-white">resource</strong> (executor OOM, shuffle timeout). Monitoring separates
          these via logs, metrics, and structured error handling in script.
        </p>
      </Definition>

      <LessonSection title="Error handling and retry">
        <ContentStep number={1} title="Job-level retry">
          <p className="text-slate-300">
            Glue console and API allow max retries on failure — useful for transient S3 throttling or VPC ENI
            delays. Cap retries (e.g. 1–2) to avoid infinite DPU loop on permanent data bug. Workflows
            conditional triggers can route FAILED to SNS while blocking gold dependents.
          </p>
        </ContentStep>
        <ContentStep number={2} title="In-script handling">
          <p className="text-slate-300">
            Wrap risky sections: try/except around per-file parse, collect bad records to quarantine DynamicFrame
            write instead of failing entire multi-TB job. Use{' '}
            <span className="font-mono text-sm">raise</span> for unrecoverable contract violations (zero rows
            when minimum expected). Log structured JSON lines with run_id and partition for grep in Logs
            Insights.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Idempotency">
          <p className="text-slate-300">
            Retry-safe jobs overwrite partition or use merge keys — rerunning same{' '}
            <span className="font-mono text-sm">run_date</span> must not duplicate facts. Document whether
            bookmark reset + rerun doubles data. Idempotent design is error recovery strategy, not optional.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Dead letter and quarantine">
          <p className="text-slate-300">
            Failed records →{' '}
            <span className="font-mono text-sm">s3://lake/quarantine/{'{table}'}/{'{run_date}'}/</span> with
            error reason column. Ops replays after fix without reprocessing clean data. Pair with Data Quality
            rules that fail job when quarantine rate exceeds threshold.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Monitoring with CloudWatch">
        <ContentStep number={1} title="Logs">
          <p className="text-slate-300">
            Enable continuous CloudWatch logging and Spark UI event logs (
            <span className="font-mono text-sm">--enable-spark-ui</span>,{' '}
            <span className="font-mono text-sm">--spark-event-logs-path</span>). Driver stdout shows stack
            traces; executor logs reveal task failures. Log group:{' '}
            <span className="font-mono text-sm">/aws-glue/jobs/output</span> and error channel.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Metrics and alarms">
          <p className="text-slate-300">
            Glue publishes job run status, duration, DPU hours. Alarm on{' '}
            <span className="font-mono text-sm">Failed</span> state, duration anomaly (2× baseline), and
            custom metrics via CloudWatch PutMetricData from script (rows written, quarantine count). Dashboard
            per workflow: success rate, avg runtime, DPU cost trend.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Logs Insights queries">
          <p className="text-slate-300">
            Query driver logs for ERROR patterns across jobs. Correlate run_id with workflow execution id.
            Spark UI stored in S3 — download for shuffle skew post-mortem when job succeeded but SLA missed.
          </p>
        </ContentStep>
        <ContentStep number={4} title="SNS and EventBridge">
          <p className="text-slate-300">
            EventBridge rule on Glue Job State Change → SNS/PagerDuty/Lambda ticket. Include job name, run id,
            error message, link to CloudWatch log stream. Separate alerts for SLA miss (job still running
            past window) vs hard fail.
          </p>
        </ContentStep>
        <Example title="CloudWatch alarm sketch — job failure">
{`Metric: AWS/Glue JobRuns failed (or custom from EventBridge)
Threshold: >= 1 failure in 5 minutes
Action: SNS topic → PagerDuty + Slack webhook
Runbook: check /aws-glue/jobs/error → quarantine? bookmark reset? IAM change?`}
        </Example>
      </LessonSection>

      <LessonSection title="Operational runbook habits">
        <ContentStep number={1} title="Structured run metadata">
          <p className="text-slate-300">
            Log job parameters at start: run_date, source path, worker config, git commit hash. Makes
            post-mortem possible when console run history expires.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost of failed long runs">
          <p className="text-slate-300">
            Fail-fast validation (row count, schema check) in first five minutes saves hours of DPU on bad
            batch. Athena or Python Shell pre-check before Spark when cheap.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Tag every job with Environment, Team, and DataProduct — Cost Explorer + failed job alarms become
          actionable ownership, not anonymous DPU spikes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cap Glue auto-retries — transient infra yes; permanent data bugs need quarantine not infinite retry.',
          'Quarantine bad records; fail fast on contract breaks; design idempotent partition writes for reruns.',
          'Enable CloudWatch logs + Spark UI logs; alarm on Failed and duration anomalies.',
          'EventBridge on job state → SNS/PagerDuty; Logs Insights for cross-job ERROR search.',
          'Log run metadata and fail cheap checks early — avoid 45-minute DPU failures on bad landing files.',
        ]}
      />
    </LessonArticle>
  )
}
