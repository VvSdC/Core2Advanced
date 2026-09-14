import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AlarmsDeepDive() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Alarms turn metrics into action — if you configure them correctly">
        A CloudWatch Alarm watches a metric and changes state when a condition holds over time. Misconfigured
        thresholds — too sensitive or too lazy — cause pager fatigue or missed Glue failures. Data engineers
        need to understand <strong className="text-white">evaluation periods</strong>,{' '}
        <strong className="text-white">datapoints to alarm</strong>, and the three{' '}
        <strong className="text-white">alarm states</strong> before wiring SNS to a production lake pipeline.
      </Callout>

      <Definition term="CloudWatch Alarm">
        <p>
          An alarm compares a metric (or math expression) against a threshold over consecutive evaluation
          periods. When the condition is met, the alarm enters <span className="font-mono text-sm">ALARM</span>{' '}
          and can trigger SNS, Lambda, EventBridge, or Auto Scaling actions. Alarms are the bridge between
          passive dashboards and active incident response for Lambda errors, Glue failures, and DLQ depth.
        </p>
      </Definition>

      <LessonSection title="Thresholds, periods, and datapoints">
        <ContentStep number={1} title="Threshold">
          <p className="text-slate-300">
            Static threshold example: Lambda <span className="font-mono text-sm">Errors</span> &gt; 5 in
            one period. Metric math example:{' '}
            <span className="font-mono text-sm">(Errors / Invocations) * 100</span> &gt; 1% error rate —
            better for bursty ingest where absolute error count spikes on small volume.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Evaluation period">
          <p className="text-slate-300">
            The granularity CloudWatch uses when checking the condition — typically 60 seconds (1 minute)
            or 300 seconds (5 minutes). Lambda and Glue publish at 1-minute resolution. Match period to
            how quickly you must detect failure vs how noisy the metric is.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Datapoints to alarm (M out of N)">
          <p className="text-slate-300">
            <strong className="text-white">Datapoints to alarm</strong> is how many breaching periods
            within <strong className="text-white">evaluation periods</strong> trigger ALARM. Example: 2
            datapoints out of 3 evaluation periods — tolerate one flaky minute before paging. For nightly
            Glue, use longer periods or treat missing data carefully (see INSUFFICIENT_DATA).
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pipeline signal</th>
                <th className="px-4 py-3">Suggested pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Lambda Errors', 'Error rate > 1% for 2 of 3 minutes — avoids single cold-start blip'],
                ['Lambda Throttles', 'Sum > 0 for 1 of 1 — any throttle on ingest is urgent'],
                ['Glue failed runs', 'Custom metric or EventBridge; static 1 failure if job is daily'],
                ['SQS DLQ depth', 'ApproximateNumberOfMessagesVisible > 0 for 5 min — poison message'],
                ['Ingest lag gauge', 'IngestLagMinutes > SLA threshold for 3 of 5 periods'],
              ].map(([signal, pattern]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{signal}</td>
                  <td className="px-4 py-3">{pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Alarm states: OK, ALARM, INSUFFICIENT_DATA">
        <Definition term="OK">
          <p>
            The metric is within the defined threshold (or the alarm condition is not met). Transitions from
            ALARM to OK can also trigger actions — useful for &quot;recovered&quot; Slack notifications so
            on-call knows the ingest handler stabilized without manually checking the dashboard.
          </p>
        </Definition>
        <Definition term="ALARM">
          <p>
            The threshold condition is satisfied for the configured number of evaluation periods. SNS fires,
            Lambda remediation runs, or EventBridge routes to ticketing. For DE pipelines, ALARM on Lambda
            Errors should link to a runbook: check Logs Insights, DLQ depth, recent deploy.
          </p>
        </Definition>
        <Definition term="INSUFFICIENT_DATA">
          <p>
            CloudWatch does not have enough metric datapoints to evaluate the alarm — common when a Lambda
            had zero invocations, a Glue job did not run tonight, or a custom metric stopped publishing.
            Configure <strong className="text-white">Treat missing data</strong>:{' '}
            <span className="font-mono text-sm">missing</span> (ignore),{' '}
            <span className="font-mono text-sm">breaching</span> (treat as bad — alert if nightly job
            never reported), or <span className="font-mono text-sm">notBreaching</span>. Wrong choice on a
            daily Glue job alarm means silent failure when the job never started.
          </p>
        </Definition>
        <Flowchart
          title="Alarm state transitions"
          chart={`flowchart TB
  START[Metric datapoints arrive]
  START --> EVAL{Threshold met for M of N periods?}
  EVAL -->|yes| ALARM[ALARM state]
  EVAL -->|no enough data| INSUF[INSUFFICIENT_DATA]
  EVAL -->|no not met| OK[OK state]
  ALARM -->|condition clears| OK
  OK -->|condition met again| ALARM
  INSUF -->|data returns| EVAL
  ALARM --> SNS[SNS Lambda EventBridge action]
  OK --> RECOVER[Optional recovery notify]`}
        />
      </LessonSection>

      <LessonSection title="DE alarm design patterns">
        <ContentStep number={1} title="Error rate vs absolute errors">
          <p className="text-slate-300">
            Low-traffic staging functions need percentage-based alarms; high-volume prod ingest can use
            absolute thresholds with higher floors. Combine both in composite alarms (covered in advanced
            lessons) when one signal alone is ambiguous.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Actions and runbooks">
          <p className="text-slate-300">
            Attach SNS topic per severity — <span className="font-mono text-sm">data-ops-critical</span> vs{' '}
            <span className="font-mono text-sm">data-ops-warn</span>. Message body should include alarm
            name, metric, threshold, and link to dashboard. Lambda action can auto-scale concurrency or
            disable a bad alias — use cautiously with idempotent replay paths.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarm on missing nightly job">
          <p className="text-slate-300">
            For scheduled Glue: alarm on custom heartbeat metric with{' '}
            <span className="font-mono text-sm">Treat missing data = breaching</span> after the expected
            run window, or use EventBridge Scheduler failure events — metric absence alone is easy to
            misconfigure without a deliberate heartbeat.
          </p>
        </ContentStep>
        <Callout variant="insight">
          INSUFFICIENT_DATA is not &quot;healthy&quot; — for critical daily ETL, missing data often means
          the job never ran or stopped emitting metrics. Document treat-missing-data per alarm in IaC.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alarms compare metrics to thresholds over evaluation periods; use M-out-of-N datapoints to reduce noise.',
          'OK = within threshold; ALARM = condition met → trigger SNS/Lambda/EventBridge; plan recovery notifications.',
          'INSUFFICIENT_DATA = not enough datapoints — configure Treat missing data for nightly Glue and sparse Lambdas.',
          'DE patterns: Lambda error rate %, any Throttle, DLQ depth > 0, custom IngestLagMinutes vs SLA.',
          'Pair alarm actions with runbooks (Logs Insights, DLQ, recent deploy) — metrics alone do not fix pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
