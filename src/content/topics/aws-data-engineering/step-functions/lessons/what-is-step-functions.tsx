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

export function WhatIsStepFunctions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A workflow engine you never have to run">
        You could orchestrate a pipeline with a cron job on an EC2 instance, a Python script full of{' '}
        <code className="text-core-400">time.sleep</code> polling loops, and a log file nobody reads. Step
        Functions replaces all of that with a <strong className="text-white">managed state machine</strong>:
        you describe the steps, AWS runs them, waits for each one, and keeps a record of what happened — no
        servers, no scheduler process, no polling code.
      </Callout>

      <Definition term="Step Functions">
        <p>
          <strong className="text-white">AWS Step Functions</strong> is a serverless workflow service. You
          define a <strong className="text-white">state machine</strong> — a set of named states and the
          transitions between them — and Step Functions executes it: calling AWS services, passing JSON data
          from one state to the next, retrying on errors, and storing the result of every step. You pay per
          use and never manage the orchestrator itself.
        </p>
        <p className="mt-2 text-slate-300">
          A <span className="text-core-400">state machine</span> is simply a model where the system is always
          in exactly one state (or a set of parallel branches), and well-defined rules say which state comes
          next.
        </p>
      </Definition>

      <LessonSection title="Orchestration vs choreography">
        <p className="text-slate-300">
          There are two ways to make services cooperate. In{' '}
          <strong className="text-white">choreography</strong>, each service reacts to events and emits new
          ones — SNS fans out, SQS buffers, EventBridge routes — and nobody holds the full picture. In{' '}
          <strong className="text-white">orchestration</strong>, one central coordinator tells each service
          what to do and when. Step Functions is an orchestrator.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Choreography — SNS / SQS / EventBridge</th>
                <th className="px-4 py-3">Orchestration — Step Functions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Who knows the flow?', 'Nobody — logic is spread across rules and subscribers', 'The state machine definition, in one file'],
                ['Where is progress tracked?', 'Scattered logs across services', 'Execution history with input and output per step'],
                ['Error handling', 'Each consumer handles its own; DLQs per queue', 'Central Retry and Catch per state'],
                ['Adding a step', 'New rule or subscriber — easy, but hard to see the whole chain', 'Edit the definition — explicit and reviewable'],
                ['Best for', 'Loosely coupled fan-out, many independent consumers', 'Known ordered pipelines with branching and waits'],
              ].map(([aspect, chor, orch]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{chor}</td>
                  <td className="px-4 py-3">{orch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Real platforms use both. EventBridge (choreography) notices that a file landed and starts a Step
          Functions execution (orchestration) that runs the ordered pipeline. Choreography between pipelines,
          orchestration inside a pipeline.
        </Callout>
      </LessonSection>

      <LessonSection title="An analogy — the pre-flight checklist">
        <p className="text-slate-300">
          Pilots do not rely on memory before take-off. They follow a checklist: each item is done in order,
          some items depend on earlier answers, and if something fails they switch to a different procedure.
          A Step Functions state machine is that checklist for your data.
        </p>
        <ContentStep number={1} title="Each checklist item is a state">
          <p className="text-slate-300">
            &quot;Validate the file,&quot; &quot;run the Glue job,&quot; &quot;count rows&quot; — each is a
            named state with a clear job.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decisions change the path">
          <p className="text-slate-300">
            &quot;If row count is zero, abort and alert&quot; is a Choice state — like a recipe that says
            &quot;if the sauce is too thick, add water, otherwise continue.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="The logbook is automatic">
          <p className="text-slate-300">
            Every execution records which items ran, with what input, and what came back — the equivalent
            of the flight log, kept for you.
          </p>
        </ContentStep>
        <Flowchart
          title="Checklist as a state machine"
          chart={`flowchart TD
  A[Validate landing file] --> B[Run Glue orders-silver-etl]
  B --> C[Count rows in Athena]
  C --> D{Rows above zero?}
  D -->|yes| E[Publish success to SNS]
  D -->|no| F[Alert de-alerts-prod and fail]`}
        />
      </LessonSection>

      <LessonSection title="What Step Functions does NOT do">
        <ContentStep number={1} title="It does not crunch your data">
          <p className="text-slate-300">
            Step Functions coordinates; Glue, EMR, Athena, and Redshift do the heavy compute. The state machine
            says &quot;start the job and wait&quot; — the Spark work happens in Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="It does not carry big datasets">
          <p className="text-slate-300">
            Data passed between states is small JSON — the payload limit is{' '}
            <strong className="text-white">256 KB</strong>. Pass S3 URIs like{' '}
            <code className="text-core-400">s3://acme-lake-prod/raw/orders/2026-09-30/</code>, not the rows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="It is not a queue">
          <p className="text-slate-300">
            For buffering millions of independent messages, keep SQS. Step Functions can be triggered from a
            queue consumer, but it does not replace one.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Pricing intuition">
        <p className="text-slate-300">
          Standard workflows are billed per <strong className="text-white">state transition</strong> —
          roughly $0.025 per 1,000 transitions in most regions, with a monthly free tier. Express workflows
          are billed per <strong className="text-white">request plus duration and memory</strong>, which is far
          cheaper for millions of short runs. Check the pricing page for your region before committing.
        </p>
        <Example title="Back-of-envelope cost for a nightly pipeline" caption="Standard workflow, one run per night">
{`States per run:        8 transitions (validate, glue, crawler, athena, choice, sns, ...)
Runs per month:        30
Transitions per month: 8 x 30 = 240
Cost:                  240 / 1,000 x $0.025 = about $0.006 per month

Same design run per file, 50,000 files per day:
8 x 50,000 x 30 = 12,000,000 transitions = about $300 per month
-> this is where Express workflows (per request + duration) start to win`}
        </Example>
        <Callout variant="tip">
          Orchestration cost is almost always tiny next to the Glue DPU-hours it coordinates — but count
          transitions before using Standard for per-record workloads.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Step Functions is a serverless workflow service that executes state machines — named states plus transition rules.',
          'Orchestration (Step Functions) centralizes the flow; choreography (SNS, SQS, EventBridge) spreads it across events — most platforms use both.',
          'Think of a state machine as a pre-flight checklist or recipe: ordered steps, decisions, and an automatic logbook.',
          'It coordinates compute but does not do it — Glue, Athena, and Redshift do the heavy lifting; payloads stay under 256 KB.',
          'Standard is priced per state transition; Express per request plus duration — count transitions for high-volume designs.',
        ]}
      />
    </LessonArticle>
  )
}
