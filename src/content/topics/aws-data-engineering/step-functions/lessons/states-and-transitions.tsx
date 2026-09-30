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

export function StatesAndTransitions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Eight building blocks — every workflow is made of these">
        No matter how big a production state machine looks in the console, it is built from only{' '}
        <strong className="text-white">eight state types</strong>. Learn what each one does and when a data
        engineer reaches for it, and any workflow diagram — nightly ETL, per-file ingest, backfill — becomes
        readable in minutes.
      </Callout>

      <Definition term="State and transition">
        <p>
          A <strong className="text-white">state</strong> is one named step in a state machine, with a{' '}
          <code className="text-core-400">Type</code> that decides its behaviour. A{' '}
          <strong className="text-white">transition</strong> is the move from one state to the next, declared
          with the <code className="text-core-400">Next</code> field. Execution begins at the state named in{' '}
          <code className="text-core-400">StartAt</code> and ends when a state has{' '}
          <code className="text-core-400">End: true</code> or is a Succeed or Fail state.
        </p>
      </Definition>

      <LessonSection title="The eight state types">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Purpose</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Task', 'Do work by calling a service or activity', 'Run Glue job orders-silver-etl and wait for it to finish'],
                ['Choice', 'Branch based on values in the state data', 'If row_count is 0, go to the alert path; otherwise publish'],
                ['Wait', 'Pause for a duration or until a timestamp', 'Wait 10 minutes for late vendor files before validating'],
                ['Pass', 'Pass input through, optionally injecting fixed data', 'Add default run_date and bucket name for manual reruns'],
                ['Parallel', 'Run fixed branches at the same time, wait for all', 'Build gold_daily_sales and gold_customer_ltv side by side'],
                ['Map', 'Run the same steps for each item in a list', 'Process each of 30 partition dates during a backfill'],
                ['Succeed', 'Stop the execution successfully', 'No new files today — end cleanly without error'],
                ['Fail', 'Stop the execution as failed with error and cause', 'Row count check failed — mark run red so alarms fire'],
              ].map(([type, purpose, example]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{purpose}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="Task is where the work happens">
          Only Task states call other services. Choice, Wait, Pass, Succeed, and Fail are flow-control states
          handled by Step Functions itself; Parallel and Map contain their own mini workflows of states.
        </Callout>
      </LessonSection>

      <LessonSection title="StartAt, Next, and End">
        <ContentStep number={1} title="StartAt — the entry point">
          <p className="text-slate-300">
            The top-level <code className="text-core-400">StartAt</code> names the first state. There is
            exactly one entry point per state machine (and one per Parallel branch or Map iterator).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Next — the arrow to the following state">
          <p className="text-slate-300">
            Most states set <code className="text-core-400">Next</code> to another state name. Choice is the
            exception: each rule has its own Next, plus an optional <code className="text-core-400">Default</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="End — a terminal state">
          <p className="text-slate-300">
            A Task, Pass, Wait, Parallel, or Map with <code className="text-core-400">End: true</code> finishes
            the execution successfully. Succeed and Fail are always terminal and never have Next.
          </p>
        </ContentStep>
        <Example title="Minimal transitions" caption="Three states — StartAt, Next, End">
{`{
  "StartAt": "ValidateFile",
  "States": {
    "ValidateFile": { "Type": "Task", "Resource": "arn:aws:states:::lambda:invoke", "Next": "WaitForLateFiles" },
    "WaitForLateFiles": { "Type": "Wait", "Seconds": 600, "Next": "Done" },
    "Done": { "Type": "Succeed" }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="A small nightly ETL workflow">
        <p className="text-slate-300">
          Here is how the state types combine for Acme&apos;s nightly orders pipeline. Read it as a sentence:
          validate, transform, check, then either publish in parallel or fail loudly.
        </p>
        <Flowchart
          title="Nightly orders ETL — state types in action"
          chart={`flowchart TD
  S[StartAt ValidateInput Task] --> G[RunGlueJob Task]
  G --> Q[CountRows Task Athena]
  Q --> C{CheckRows Choice}
  C -->|rows above 0| P[BuildGold Parallel]
  C -->|rows equal 0| F[DataMissing Fail]
  P --> N[NotifySuccess Task SNS]
  N --> OK[Done Succeed]`}
        />
        <ContentStep number={1} title="Tasks do the real work">
          <p className="text-slate-300">
            ValidateInput calls Lambda, RunGlueJob calls Glue, CountRows runs an Athena query, NotifySuccess
            publishes to <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choice guards the gold layer">
          <p className="text-slate-300">
            Zero rows means something upstream broke — the Fail state marks the execution red so CloudWatch
            alarms fire instead of silently publishing an empty table.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Input goes in, output comes out">
        <p className="text-slate-300">
          Every execution starts with a JSON input. Each state receives JSON, does its work, and produces JSON
          output that becomes the next state&apos;s input. By default a Task&apos;s result replaces its input —
          later you will learn fields like <code className="text-core-400">ResultPath</code> that merge results
          instead.
        </p>
        <Example title="Execution input and a Task result" caption="Teaser for Input & Output Processing">
{`Execution input:
{ "run_date": "2026-09-30", "input_uri": "s3://acme-lake-prod/raw/orders/2026-09-30/" }

After RunGlueJob (Glue .sync result, trimmed):
{ "JobName": "orders-silver-etl", "JobRunState": "SUCCEEDED", "ExecutionTime": 412 }

After CountRows (Athena result, trimmed):
{ "row_count": 184223 }`}
        </Example>
        <Callout variant="tip">
          Keep state data small and meaningful — IDs, dates, S3 URIs, counts. The 256 KB payload limit applies
          to the JSON passed between states.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Eight state types: Task, Choice, Wait, Pass, Parallel, Map, Succeed, Fail — only Task calls services.',
          'StartAt names the first state; Next draws the arrows; End: true, Succeed, or Fail finish the execution.',
          'Choice branches on data (row counts, flags); Parallel runs fixed branches together; Map repeats steps per item.',
          'Fail states make bad data visible — a red execution triggers alarms instead of silently publishing.',
          'Each state receives JSON input and emits JSON output — keep it small and pass S3 URIs, not rows.',
        ]}
      />
    </LessonArticle>
  )
}
