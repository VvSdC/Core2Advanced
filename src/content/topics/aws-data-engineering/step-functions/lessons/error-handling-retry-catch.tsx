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

export function ErrorHandlingRetryCatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Transient failures are normal — silent failures are not">
        Glue throttles when too many runs start at once, Lambda occasionally returns a service exception, and
        Athena queues queries under load. A production workflow <strong className="text-white">retries the
        transient stuff automatically</strong> and <strong className="text-white">fails loudly</strong> on
        everything else — with an alert in de-alerts-prod and a red execution in the console.
      </Callout>

      <Definition term="Retry and Catch">
        <p>
          Arrays on Task, Parallel, and Map states. <span className="font-mono text-sm">Retry</span> re-runs the
          same state on matching errors with exponential backoff.{' '}
          <span className="font-mono text-sm">Catch</span> runs after retries are exhausted (or immediately if
          no retrier matches) and transitions to a fallback state, optionally injecting the error details into
          the state input via <span className="font-mono text-sm">ResultPath</span>.
        </p>
      </Definition>

      <LessonSection title="Error names you will match">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Error name</th>
                <th className="px-4 py-3">Meaning in a DE pipeline</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['States.ALL', 'Wildcard for any error — must be alone and last in its Retry or Catch list.'],
                ['States.TaskFailed', 'Task failed — e.g. Glue .sync run ended FAILED; matches most task errors.'],
                ['States.Timeout', 'TimeoutSeconds exceeded or no heartbeat within HeartbeatSeconds.'],
                ['States.Permissions', 'Execution role lacked permission to run the task.'],
                ['Lambda.ServiceException / Lambda.TooManyRequestsException', 'Transient Lambda errors — always retry.'],
                ['Glue.ConcurrentRunsExceededException', 'Job hit max concurrent runs — retry with backoff.'],
                ['Glue.InternalServiceException', 'Transient Glue API failure on start — retry a few times.'],
                ['Custom error names', 'Lambda raises DataQualityError — match it exactly in ErrorEquals.'],
              ].map(([name, meaning]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{name}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          <code className="text-core-400">States.ALL</code> does not catch terminal errors such as{' '}
          <code className="text-core-400">States.DataLimitExceeded</code> or{' '}
          <code className="text-core-400">States.Runtime</code> (for example, a JSONPath that points at a
          missing field). Those fail the execution outright — fix the definition.
        </Callout>
      </LessonSection>

      <LessonSection title="Retry fields">
        <ContentStep number={1} title="Backoff math">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ErrorEquals</span> lists matching errors.{' '}
            <span className="font-mono text-sm">IntervalSeconds</span> (default 1) is the first delay,{' '}
            <span className="font-mono text-sm">BackoffRate</span> (default 2.0) multiplies it each attempt,{' '}
            <span className="font-mono text-sm">MaxAttempts</span> (default 3; 0 means never retry) caps
            attempts. Interval 30, rate 2, attempts 3 waits 30 s, 60 s, 120 s.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cap and spread retries">
          <p className="text-slate-300">
            <span className="font-mono text-sm">MaxDelaySeconds</span> caps a single backoff so rate 2.0 does not
            explode to an hour. <span className="font-mono text-sm">JitterStrategy: &quot;FULL&quot;</span>{' '}
            randomizes each delay — when a Map fans out 30 Glue starts that all throttle, jitter stops them
            retrying in lockstep.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Order matters">
          <p className="text-slate-300">
            Retriers are evaluated top to bottom; the first match wins. Put specific errors (throttling) first
            with generous attempts, then a <code className="text-core-400">States.ALL</code> catch-all with
            fewer attempts — or none, so real data bugs are not retried five times.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Catch, timeouts, and the alert path">
        <Flowchart
          title="Glue task with retry, catch, alert, fail"
          chart={`flowchart TB
  G[RunSilverJob Glue sync]
  R{Retryable error}
  B[Backoff and retry]
  C[Catch writes error to state]
  S[NotifyFailure SNS de-alerts-prod]
  F[Fail state]
  OK[Next state]
  G -->|success| OK
  G -->|error| R
  R -->|yes and attempts left| B
  B --> G
  R -->|no or exhausted| C
  C --> S
  S --> F`}
        />
        <Example title="Retry and Catch on a Glue .sync task" caption="de-orders-nightly-sfn-prod">
{`"RunSilverJob": {
  "Type": "Task",
  "Resource": "arn:aws:states:::glue:startJobRun.sync",
  "Parameters": { "JobName": "orders-silver-etl", "Arguments": { "--run_date.$": "$.run_date" } },
  "TimeoutSeconds": 7200,
  "Retry": [
    { "ErrorEquals": ["Glue.ConcurrentRunsExceededException", "Glue.InternalServiceException"],
      "IntervalSeconds": 60, "BackoffRate": 2.0, "MaxAttempts": 5,
      "MaxDelaySeconds": 600, "JitterStrategy": "FULL" },
    { "ErrorEquals": ["States.TaskFailed"], "IntervalSeconds": 120, "MaxAttempts": 1 }
  ],
  "Catch": [
    { "ErrorEquals": ["States.ALL"], "ResultPath": "$.error", "Next": "NotifyFailure" }
  ],
  "Next": "CrawlSilver"
},
"NotifyFailure": {
  "Type": "Task",
  "Resource": "arn:aws:states:::sns:publish",
  "Parameters": {
    "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
    "Subject": "orders nightly FAILED",
    "Message.$": "States.Format('run_date={} error={} cause={}', $.run_date, $.error.Error, $.error.Cause)"
  },
  "ResultPath": null,
  "Next": "PipelineFailed"
},
"PipelineFailed": { "Type": "Fail", "Error": "PipelineFailed", "Cause": "See de-alerts-prod" }`}
        </Example>
        <ContentStep number={1} title="ResultPath on Catch">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ResultPath: &quot;$.error&quot;</span> keeps run_date and adds{' '}
            <code className="text-core-400">Error</code> and <code className="text-core-400">Cause</code> under
            $.error. Without it, the error object replaces the entire input and the alert cannot say which
            partition failed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TimeoutSeconds and HeartbeatSeconds">
          <p className="text-slate-300">
            Tasks have no default timeout on Standard beyond the execution limit — a hung job can wait for days.
            Set <span className="font-mono text-sm">TimeoutSeconds</span> to roughly 2x the normal runtime.{' '}
            <span className="font-mono text-sm">HeartbeatSeconds</span> applies to callback and activity tasks:
            no heartbeat in time raises States.Timeout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Always end the failure path in Fail">
          <p className="text-slate-300">
            If the catch path ends at SNS with End true, the execution shows <em>Succeeded</em> — dashboards stay
            green while data is missing. Route to a Fail state so ExecutionsFailed alarms fire.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Idempotency when retrying Glue">
        <p className="text-slate-300">
          A retry re-runs the whole job. If orders-silver-etl appends to{' '}
          <span className="font-mono text-sm">s3://acme-lake-prod/silver/orders/</span>, a half-finished first
          attempt plus a successful retry duplicates rows. Make writes idempotent: overwrite the{' '}
          <span className="font-mono text-sm">dt=run_date</span> partition (dynamic partition overwrite), write
          to a staging prefix then swap, or MERGE into Iceberg or Hudi tables. Be careful combining Retry with
          job bookmarks — a failed run does not commit its bookmark, but a partially written output does not roll
          back either.
        </p>
        <Callout variant="tip">
          Only retry <code className="text-core-400">States.TaskFailed</code> on Glue once, and only when the job
          is idempotent. Out-of-memory or schema errors will fail again — a second 2-hour attempt just delays
          the alert.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Retry handles transient errors with IntervalSeconds, BackoffRate, MaxAttempts, MaxDelaySeconds, and jitter.',
          'Order retriers specific-first; States.ALL must be last and cannot catch States.Runtime or DataLimitExceeded.',
          'Catch with ResultPath "$.error" preserves input so alerts can name the failed partition.',
          'Failure paths should notify SNS then end in a Fail state — never a green execution with missing data.',
          'Set TimeoutSeconds on every long task and make retried Glue jobs idempotent with partition overwrite.',
        ]}
      />
    </LessonArticle>
  )
}
