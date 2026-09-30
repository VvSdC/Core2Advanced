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

export function StandardVsExpressWorkflows() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same language, two very different engines">
        When you create a state machine you pick a <strong className="text-white">type</strong>: Standard or
        Express. Both use the same Amazon States Language, but they differ in how long a run can last, how
        many runs per second they handle, how retries behave, where history lives, and how you pay. The type
        is chosen at creation and cannot be changed later — so choose deliberately.
      </Callout>

      <Definition term="Standard and Express workflows">
        <p>
          A <strong className="text-white">Standard workflow</strong> is built for long-running, auditable
          processes: runs can last up to <strong className="text-white">one year</strong>, each workflow
          execution runs exactly once, and full execution history is kept for 90 days. An{' '}
          <strong className="text-white">Express workflow</strong> is built for short, high-volume event
          processing: runs last at most <strong className="text-white">five minutes</strong>, start at very
          high rates, and log history to CloudWatch Logs instead of the Step Functions console.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">Express</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Max duration', 'Up to 1 year', 'Up to 5 minutes'],
                ['Execution semantics', 'Exactly-once workflow execution', 'Asynchronous: at-least-once; synchronous: at-most-once'],
                ['Start rate', 'Thousands per second, with state transition quotas', 'Designed for very high event rates — 100,000+ per second'],
                ['Execution history', 'Full step-by-step history in the console and API, kept 90 days', 'Sent to CloudWatch Logs when logging is enabled'],
                ['Pricing', 'Per state transition', 'Per request plus duration and memory'],
                ['Wait for a job or callback', 'Supports .sync job runs and task-token callbacks', 'Not supported — keep steps short'],
                ['Typical DE use', 'Nightly Glue ETL, backfills, approval gates', 'Per-record transforms from SQS, Kinesis, or API calls'],
              ].map(([aspect, standard, express]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{standard}</td>
                  <td className="px-4 py-3">{express}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="What at-least-once means for you">
          An asynchronous Express execution might run more than once for the same input. Every Task it calls
          must be idempotent — the same conditional-write and dedup-key habits you learned with DynamoDB and
          SQS apply here too.
        </Callout>
      </LessonSection>

      <LessonSection title="Standard — the default for pipelines">
        <ContentStep number={1} title="Long waits are free of compute">
          <p className="text-slate-300">
            A Glue job that runs for 40 minutes, a Wait state until 06:00, or a human approval that takes two
            days — Standard simply pauses. You pay for transitions, not waiting time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Audit-grade history">
          <p className="text-slate-300">
            Every execution of <code className="text-core-400">de-orders-nightly-sfn-prod</code> shows each
            state&apos;s input, output, and timing for 90 days — exactly what you need when finance asks why
            yesterday&apos;s numbers were late.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Exactly-once steps">
          <p className="text-slate-300">
            Standard will not accidentally start the same Glue load twice within an execution — important
            for non-idempotent actions like a Redshift COPY into an append-only table.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Express — the choice for high-volume events">
        <ContentStep number={1} title="Short, per-event work">
          <p className="text-slate-300">
            A small workflow per SQS message or Kinesis record: parse, enrich from DynamoDB, write to Firehose
            — seconds long, millions per day.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost scales with volume sensibly">
          <p className="text-slate-300">
            Priced per request plus duration, Express is usually far cheaper than Standard when you run
            millions of short executions with several states each.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Turn on logging on day one">
          <p className="text-slate-300">
            Without CloudWatch Logs enabled at level ERROR or ALL, a failed Express run leaves almost nothing
            to debug.
          </p>
        </ContentStep>
        <Example title="Choosing the type at creation" caption="--type cannot be changed afterwards">
{`aws stepfunctions create-state-machine \\
  --name de-clickstream-enrich-sfn-prod \\
  --type EXPRESS \\
  --definition file://clickstream-enrich.asl.json \\
  --role-arn arn:aws:iam::111122223333:role/de-clickstream-sfn-role-prod \\
  --logging-configuration file://express-logging.json

# omit --type (or use STANDARD) for de-orders-nightly-sfn-prod`}
        </Example>
      </LessonSection>

      <LessonSection title="DE picks — and nesting both">
        <ContentStep number={1} title="Nightly Glue ETL → Standard">
          <p className="text-slate-300">
            Runs longer than five minutes, needs <code className="text-core-400">startJobRun.sync</code>, and
            benefits from a visual audit trail.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per-record transform from SQS or Kinesis → Express">
          <p className="text-slate-300">
            Short, high-rate, idempotent — exactly the workload Express was designed for.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Both at once — Standard parent, Express child">
          <p className="text-slate-300">
            A Standard parent orchestrates the long pipeline and calls an Express child with{' '}
            <code className="text-core-400">arn:aws:states:::states:startExecution.sync:2</code> for a fast,
            high-volume sub-step — long-running control on the outside, cheap bursts on the inside.
          </p>
        </ContentStep>
        <Flowchart
          title="Standard parent calling an Express child"
          chart={`flowchart LR
  EB[EventBridge nightly] --> P[Standard parent de-orders-nightly-sfn-prod]
  P --> G[Glue orders-silver-etl sync]
  G --> X[Express child validate records]
  X --> P2[Parent continues]
  P2 --> SNS[SNS de-alerts-prod]`}
        />
        <Callout variant="tip">
          Default to Standard for batch pipelines. Reach for Express only when volume or cost forces you to —
          and then make every step idempotent.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Standard: up to 1 year, exactly-once workflow execution, 90 days of full history, priced per state transition.',
          'Express: up to 5 minutes, at-least-once (async) or at-most-once (sync), very high event rates, history in CloudWatch Logs.',
          'Express is priced per request plus duration — cheaper for millions of short runs; Standard wins for long waits.',
          'DE picks: nightly Glue ETL and backfills on Standard; per-record SQS or Kinesis transforms on Express.',
          'Nest them — a Standard parent can call an Express child for high-volume sub-steps; the type is fixed at creation.',
        ]}
      />
    </LessonArticle>
  )
}
