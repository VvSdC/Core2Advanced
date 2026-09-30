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

export function ObservabilityAndDebugging() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The workflow failed at 03:12 — now what?">
        Step Functions is one of the most debuggable services in AWS: every Standard execution keeps a visual
        graph and a complete event history showing exactly which state failed, with what input, and why. Add
        CloudWatch metrics and alarms so you hear about it first, logs for Express workflows, and redrive so
        you can resume from the failed step instead of rerunning a 3-hour pipeline from the top.
      </Callout>

      <Definition term="Execution event history">
        <p>
          The ordered list of events for one execution — <span className="font-mono text-sm">ExecutionStarted</span>,{' '}
          <span className="font-mono text-sm">TaskStateEntered</span>, <span className="font-mono text-sm">TaskScheduled</span>,{' '}
          <span className="font-mono text-sm">TaskSucceeded</span> or <span className="font-mono text-sm">TaskFailed</span>,{' '}
          <span className="font-mono text-sm">ExecutionFailed</span> — each with timestamps, input, output, and
          error details. Standard workflows keep it for 90 days after the execution closes; Express workflows
          only have what you send to CloudWatch Logs.
        </p>
      </Definition>

      <LessonSection title="Console graph and event history">
        <ContentStep number={1} title="Read the graph first">
          <p className="text-slate-300">
            The graph view colors each state: green succeeded, red failed, orange caught error, blue in
            progress. Click the red state to see its input, output, and the error and cause — for a Glue .sync
            failure the cause contains the job run ID and Glue&apos;s ErrorMessage.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Follow the data, not just the error">
          <p className="text-slate-300">
            Many failures are data-shape problems: a Choice hitting a missing field, a ResultPath that overwrote
            run_date. Compare the input of the failed state with the output of the state before it — the table
            view and <span className="font-mono text-sm">aws stepfunctions get-execution-history</span> show every
            transition.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Jump to the service">
          <p className="text-slate-300">
            Task states link to the underlying resource — the Glue job run, the Lambda log stream, the Athena
            query. The real stack trace usually lives there, in the Glue driver logs in CloudWatch.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Metrics, alarms, logs, and tracing">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric (AWS/States)</th>
                <th className="px-4 py-3">Alarm idea</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ExecutionsFailed', '≥ 1 in 5 minutes → SNS de-alerts-prod.'],
                ['ExecutionsTimedOut', '≥ 1 — a job or poll loop is hanging.'],
                ['ExecutionThrottled', 'Sustained > 0 — trigger storm or StartExecution quota.'],
                ['ExecutionTime', 'p90 above 2x normal runtime — data growth or Glue slowdown.'],
                ['ExecutionsStarted', '0 by 03:30 — the schedule never fired (treat missing data as breaching).'],
                ['ExecutionsAborted', 'Unexpected aborts — someone stopped prod manually.'],
              ].map(([metric, alarm]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{metric}</td>
                  <td className="px-4 py-3">{alarm}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="CloudWatch Logs levels">
          <p className="text-slate-300">
            Logging levels are <span className="font-mono text-sm">ALL</span>,{' '}
            <span className="font-mono text-sm">ERROR</span>, <span className="font-mono text-sm">FATAL</span>, and{' '}
            <span className="font-mono text-sm">OFF</span>. Standard workflows typically use ERROR (history already
            exists); Express workflows need ALL to debug at all. <span className="font-mono text-sm">includeExecutionData</span>{' '}
            writes full inputs and outputs to the log — convenient, but those may contain customer emails, PII,
            or tokens. Leave it off for sensitive pipelines or restrict the log group with KMS and tight IAM.
          </p>
        </ContentStep>
        <ContentStep number={2} title="X-Ray tracing">
          <p className="text-slate-300">
            Enable <span className="font-mono text-sm">tracingConfiguration enabled=true</span> to get an X-Ray
            service map across Step Functions, Lambda, and SDK calls — useful for spotting which Lambda or API
            call adds latency in high-volume Express workflows.
          </p>
        </ContentStep>
        <Example title="Enable logging and tracing (AWS CLI)" caption="ERROR logs without execution data">
{`aws stepfunctions update-state-machine \\
  --state-machine-arn arn:aws:states:us-east-1:111122223333:stateMachine:de-orders-nightly-sfn-prod \\
  --logging-configuration '{
    "level": "ERROR",
    "includeExecutionData": false,
    "destinations": [{ "cloudWatchLogsLogGroup": {
      "logGroupArn": "arn:aws:logs:us-east-1:111122223333:log-group:/aws/vendedlogs/states/de-orders-nightly:*" } }]
  }' \\
  --tracing-configuration enabled=true`}
        </Example>
      </LessonSection>

      <LessonSection title="Redrive and TestState">
        <ContentStep number={1} title="Redrive from the failed state">
          <p className="text-slate-300">
            <span className="font-mono text-sm">RedriveExecution</span> restarts a failed, aborted, or timed-out
            Standard execution <strong className="text-white">from the states that did not succeed</strong>, using
            the original definition and input, within 14 days of the failure. The Glue job that already
            succeeded is not rerun; only the failed Redshift load retries. Distributed Map runs can redrive just
            their failed child executions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TestState for one state at a time">
          <p className="text-slate-300">
            The <span className="font-mono text-sm">TestState</span> API runs a single state definition with an
            input and role — no deploy. With inspection level DEBUG it shows the data after InputPath,
            Parameters, ResultSelector, and ResultPath, which makes JSONPath mistakes obvious. Pair it with{' '}
            <span className="font-mono text-sm">ValidateStateMachineDefinition</span> in CI.
          </p>
        </ContentStep>
        <Example title="Redrive and TestState (AWS CLI)" caption="Resume last night, test a state in isolation">
{`aws stepfunctions redrive-execution \\
  --execution-arn arn:aws:states:us-east-1:111122223333:execution:de-orders-nightly-sfn-prod:orders-2026-09-29

aws stepfunctions test-state \\
  --definition file://states/get-dq-result.json \\
  --role-arn arn:aws:iam::111122223333:role/de-orders-sfn-role \\
  --input '{"dq": {"id": "a1b2c3"}, "run_date": "2026-09-29"}' \\
  --inspection-level DEBUG`}
        </Example>
        <Flowchart
          title="Debugging runbook"
          chart={`flowchart TB
  AL[Alarm ExecutionsFailed]
  EX[Open failed execution]
  ST[Find red state]
  TY{Error type}
  SVC[Open Glue or Lambda logs]
  DATA[Fix JSONPath with TestState]
  PERM[Fix execution role policy]
  FIX[Deploy fix]
  RD[Redrive execution]
  AL --> EX --> ST --> TY
  TY -->|TaskFailed| SVC
  TY -->|Runtime| DATA
  TY -->|Permissions| PERM
  SVC --> FIX
  DATA --> FIX
  PERM --> FIX
  FIX --> RD`}
        />
        <Callout variant="insight">
          Redrive reuses the original definition, so a fix to the ASL itself needs a fresh execution. Fixes in
          Glue scripts, IAM policies, or data are picked up by redrive — which covers most 3 a.m. incidents.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Start from the graph and event history — failed state input, output, error, and cause tell most of the story.',
          'Alarm on ExecutionsFailed, ExecutionsTimedOut, ExecutionThrottled, ExecutionTime, and missing ExecutionsStarted.',
          'Log at ERROR for Standard, ALL for Express; includeExecutionData can leak PII into logs.',
          'RedriveExecution resumes failed Standard executions from the failed states within 14 days.',
          'TestState debugs one state and its JSONPath processing without deploying the whole workflow.',
        ]}
      />
    </LessonArticle>
  )
}
