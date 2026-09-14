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

export function AlarmsBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Alarms turn graphs into action">
        A metric graph shows Errors spiking at 3 a.m. — but only if someone is watching. A CloudWatch{' '}
        <strong className="text-white">alarm</strong> watches that metric for you and sends an SNS
        notification, triggers a Lambda, or stops an Auto Scaling action when a threshold is crossed. For
        data pipelines, alarms are how ingest failures reach on-call before the morning report is empty.
      </Callout>

      <Definition term="CloudWatch alarm">
        <p>
          A <strong className="text-white">CloudWatch alarm</strong> evaluates a metric (or math expression
          on metrics) over one or more time periods and compares the result to a threshold you define. It
          maintains a <strong className="text-white">state</strong> — OK, ALARM, or INSUFFICIENT_DATA — and
          runs <strong className="text-white">actions</strong> when the state changes (typically notify via
          SNS when entering ALARM).
        </p>
      </Definition>

      <LessonSection title="Why alarms exist for DE pipelines">
        <ContentStep number={1} title="Fail fast, notify fast">
          <p className="text-slate-300">
            Batch pipelines often run unattended. An alarm on Lambda <code className="text-core-400">Errors</code>{' '}
            &gt; 0 or Glue job failure metrics means the team learns within minutes — time to reprocess from
            raw/ before downstream SLAs slip.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Guard silent degradation">
          <p className="text-slate-300">
            Not every failure throws an exception. Alarm on{' '}
            <code className="text-core-400">Invocations</code> &lt; 1 for 24 hours when you expect nightly
            uploads — catches &quot;pipeline ran successfully but nothing arrived&quot; scenarios metrics-only
            error checks miss.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automate first response">
          <p className="text-slate-300">
            Alarm actions can invoke a Lambda that posts to Slack, opens a ticket, or disables a broken S3
            trigger until someone fixes schema validation — reduce toil without replacing human judgment on
            complex incidents.
          </p>
        </ContentStep>
        <Flowchart
          title="Alarm lifecycle in a pipeline"
          chart={`flowchart LR
  M[Metric Errors every minute]
  M --> E[Alarm evaluates 5-min Sum]
  E --> T{Sum greater than threshold?}
  T -->|Yes| AL[State ALARM]
  T -->|No| OK[State OK]
  AL --> SNS[SNS topic]
  SNS --> EM[Email Slack PagerDuty]
  AL --> LAM[Optional Lambda remediation]`}
        />
      </LessonSection>

      <LessonSection title="Threshold idea — high level">
        <p className="text-slate-300">
          A threshold is the line in the sand: &quot;when this metric statistic crosses this number for this
          many periods, treat it as a problem.&quot; You do not need calculus — start simple and tune after
          real traffic teaches you normal vs abnormal.
        </p>
        <ContentStep number={1} title="Pick the metric">
          <p className="text-slate-300">
            Example: Lambda namespace, metric <code className="text-core-400">Errors</code>, dimension{' '}
            <code className="text-core-400">FunctionName = de-s3-ingest-validator-dev</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pick statistic and period">
          <p className="text-slate-300">
            Common pattern: <strong className="text-white">Sum</strong> of Errors over{' '}
            <strong className="text-white">5 consecutive 1-minute periods</strong> — &quot;more than zero
            errors sustained for five minutes&quot; avoids paging on a single flaky retry.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Set the threshold">
          <p className="text-slate-300">
            For Errors, threshold <code className="text-core-400">0</code> with &quot;Greater than threshold&quot;
            fires on any error burst. For duration, threshold <code className="text-core-400">10000</code> ms
            catches invocations approaching your 15-second timeout before they start timing out en masse.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Define evaluation periods">
          <p className="text-slate-300">
            <strong className="text-white">Datapoints to alarm</strong> vs{' '}
            <strong className="text-white">evaluation periods</strong>: e.g. 3 out of 5 periods must breach
            — reduces noise from single-minute blips during deployments.
          </p>
        </ContentStep>
        <Example title="First DE alarm — Lambda errors" caption="Console-friendly settings">
{`Alarm name:     ingest-dev-errors
Metric:         AWS/Lambda → Errors → FunctionName ingest-dev
Statistic:      Sum
Period:         60 seconds
Evaluation:     5 periods, alarm if >= 1 period breaches
Threshold:      Greater than 0
Action:         SNS topic data-pipeline-alerts → email + Slack webhook`}
        </Example>
        <Callout variant="tip" title="Start with one alarm per critical function">
          Do not alarm on everything day one. One Errors alarm on your main ingest Lambda plus one on your
          nightly Glue job failure metric covers more incidents than ten untuned duration alarms that page
          every deploy.
        </Callout>
      </LessonSection>

      <LessonSection title="Alarm states — OK, ALARM, INSUFFICIENT_DATA">
        <p className="text-slate-300">
          Every alarm is always in exactly one of three states. Actions fire on{' '}
          <strong className="text-white">state transitions</strong>, not on every evaluation tick — so you
          get notified when things get worse or recover, not every minute while broken.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Meaning</th>
                <th className="px-4 py-3">Typical DE situation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['OK', 'Metric is within acceptable bounds', 'Zero errors, invocations flowing, job succeeded'],
                ['ALARM', 'Threshold breached per your evaluation rule', 'Errors spiking, job failed, no invocations when expected'],
                ['INSUFFICIENT_DATA', 'Not enough metric datapoints to decide', 'New function never invoked yet, metric disabled, or gap in publishing'],
              ].map(([state, meaning, situation]) => (
                <tr key={state} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{state}</td>
                  <td className="px-4 py-3">{meaning}</td>
                  <td className="px-4 py-3">{situation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="OK → ALARM">
          <p className="text-slate-300">
            Problem detected — SNS fires, on-call investigates logs. This is the transition that matters
            most for pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ALARM → OK">
          <p className="text-slate-300">
            Recovery — optional &quot;all clear&quot; notification so the team knows reprocessing succeeded
            without manually refreshing the dashboard.
          </p>
        </ContentStep>
        <ContentStep number={3} title="INSUFFICIENT_DATA">
          <p className="text-slate-300">
            Common on brand-new Lambdas before first invoke, or &quot;no data&quot; alarms waiting for nightly
            traffic. Configure whether missing data treats as breaching, not breaching, or ignore — for
            &quot;expected daily batch&quot; alarms, missing data often means the batch never ran.
          </p>
        </ContentStep>
        <Callout variant="insight">
          INSUFFICIENT_DATA is not a bug — it is CloudWatch being honest that it cannot judge your threshold
          yet. After deploy, invoke your function once manually so error alarms leave INSUFFICIENT_DATA before
          you rely on them in prod.
        </Callout>
      </LessonSection>

      <LessonSection title="SNS — the usual alarm destination">
        <p className="text-slate-300">
          Alarms do not email directly — they publish to an <strong className="text-white">Amazon SNS
          topic</strong>, and subscriptions (email, SMS, Lambda, HTTP) receive the message. One topic{' '}
          <code className="text-core-400">data-pipeline-alerts</code> can fan out to the whole DE team and a
          Lambda that formats Slack blocks — reuse across Lambda, Glue, and custom metric alarms.
        </p>
        <Flowchart
          title="Metric alarm to humans"
          chart={`flowchart LR
  CW[CloudWatch alarm]
  CW --> SNS[SNS topic pipeline-alerts]
  SNS --> E1[Email on-call]
  SNS --> E2[Lambda to Slack]
  SNS --> E3[SQS for ticketing integration]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alarms watch metrics and change state when thresholds breach — turning passive graphs into notifications and actions.',
          'Threshold = metric + statistic + period + comparison value; start with Lambda Errors Sum > 0 on critical ingest functions.',
          'Three states: OK (healthy), ALARM (problem), INSUFFICIENT_DATA (not enough datapoints — common on new resources).',
          'Wire alarms to SNS topics for email, Slack, or Lambda automation — one topic can serve the whole pipeline.',
        ]}
      />
    </LessonArticle>
  )
}
