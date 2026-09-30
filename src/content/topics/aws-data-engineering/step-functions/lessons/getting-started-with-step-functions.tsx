import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithStepFunctions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Step Functions after SQS in the DE path">
        SQS taught you how to buffer single units of work — one message, one file, one record — so producers
        and consumers never overwhelm each other. But a real nightly pipeline is not one unit of work. It is{' '}
        <strong className="text-white">validate the landing file → run a Glue job → refresh the crawler →
        check row counts in Athena → notify the team</strong>, with retries when Glue hiccups and a
        different path when the data looks wrong. Queues do not remember which step you are on. That job
        belongs to <strong className="text-white">AWS Step Functions</strong>.
      </Callout>

      <Definition term="What is Step Functions in a DE pipeline?">
        <p>
          <strong className="text-white">AWS Step Functions</strong> is a serverless orchestration service
          that runs a workflow — called a <strong className="text-white">state machine</strong> — step by
          step. Each step calls a service (Lambda, Glue, Athena, SNS, DynamoDB and hundreds more), waits for
          the result, then decides what happens next. For data engineering, Step Functions is the{' '}
          <strong className="text-white">conductor of multi-step pipelines</strong>: it tracks progress,
          retries failures, branches on results, and records every run in a visual history.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">the pipeline runbook turned into code — every step, every retry,
          every &quot;if this then that&quot; written down and executed the same way every night</span>.
        </p>
      </Definition>

      <LessonSection title="From single messages to multi-step pipelines">
        <p className="text-slate-300">
          Earlier modules gave you the building blocks: Lambda for light logic, Glue for Spark transforms,
          Athena for SQL checks, SNS for alerts, EventBridge for schedules, SQS for buffering. Step Functions
          answers the question none of them answer alone:{' '}
          <strong className="text-white">who runs these in order, waits for each one, and handles failure?</strong>
        </p>
        <ContentStep number={1} title="Queues buffer — they do not sequence">
          <p className="text-slate-300">
            An SQS message says &quot;process this file.&quot; It cannot say &quot;after Glue finishes, run
            the crawler, then only publish if the row count is above zero.&quot; Chaining queues for that
            logic creates invisible state spread across five services.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pipelines need memory of progress">
          <p className="text-slate-300">
            If the Athena check fails at step four, you want to know steps one to three succeeded, see the
            exact input each received, and rerun only what broke. Step Functions keeps that execution history
            for you.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retries and branching are built in">
          <p className="text-slate-300">
            Transient Glue errors get automatic retries with backoff; a bad row count takes a different branch
            to SNS instead of publishing to the gold layer — declared in the workflow, not hand-coded in
            every Lambda.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: SQS decouples producers from consumers; EventBridge routes events; Step Functions
          orchestrates a known sequence of steps with state. Most &quot;the pipeline half-ran and nobody
          noticed&quot; incidents come from cron plus Lambda chains that had no orchestrator.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build Step Functions in layers so service integrations, Retry/Catch, and Map do not overwhelm
          you on day one:
        </p>
        <ContentStep number={1} title="Concepts — state machines, states, transitions">
          <p className="text-slate-300">
            What Step Functions is, how orchestration differs from choreography, and the eight state types
            that every workflow is built from.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Definitions — Amazon States Language">
          <p className="text-slate-300">
            Read and write the JSON definition behind every workflow, so you can review it in Git like any
            other code.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Workflow types and DE use cases">
          <p className="text-slate-300">
            Standard vs Express workflows, then where DE teams actually use Step Functions — and where they
            should not.
          </p>
        </ContentStep>
        <Flowchart
          title="Step Functions sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is Step Functions]
  B --> C[States and transitions]
  C --> D[Amazon States Language]
  D --> E[Standard vs Express]
  E --> F[Step Functions for DE]
  F --> G[Beginner checkpoint]
  G --> H[Integrations IO Retry Catch next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['State machine', 'The whole workflow definition — the ordered list of steps and the rules for moving between them'],
                ['State', 'One step in the workflow — e.g. run a Glue job, check a condition, wait, or fail loudly'],
                ['Execution', 'One run of a state machine with a specific input — e.g. the orders pipeline for 2026-09-30'],
                ['Task', 'A state that does work by calling a service — Lambda, Glue, Athena, SNS, DynamoDB'],
                ['Transition', 'Moving from one state to the next via Next — Standard workflows are billed per transition'],
                ['ASL', 'Amazon States Language — the JSON format that defines states, transitions, and error handling'],
                ['Standard / Express', 'The two workflow types — long-running and auditable vs short, high-volume, and cheap per run'],
                ['Service integration', 'A built-in connector that lets a Task call an AWS API directly, without writing a Lambda wrapper'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put team, dataset, cadence, and environment in the state machine name:{' '}
          <code className="text-core-400">de-orders-nightly-sfn-prod</code> or{' '}
          <code className="text-core-400">de-vendor-ingest-sfn-dev</code>. When on-call opens the console at
          2 a.m., a clear name beats &quot;MyStateMachine-3&quot; every time.
        </Callout>
      </LessonSection>

      <LessonSection title="How Step Functions fits in a pipeline">
        <p className="text-slate-300">
          EventBridge fires on a schedule or an S3 landing and starts an execution. The state machine calls a
          validation Lambda, runs Glue job <code className="text-core-400">orders-silver-etl</code> and waits
          for it to finish, runs an Athena query as a quality check, and publishes success or failure to SNS
          topic <code className="text-core-400">de-alerts-prod</code>.
        </p>
        <Flowchart
          title="EventBridge → Step Functions → Lambda, Glue, Athena → SNS"
          chart={`flowchart LR
  EB[EventBridge schedule] --> SF[Step Functions state machine]
  SF --> LAM[Lambda validate]
  SF --> GLUE[Glue orders-silver-etl]
  SF --> ATH[Athena row count check]
  SF --> SNS[SNS de-alerts-prod]
  GLUE --> S3[S3 acme-lake-prod silver]`}
        />
        <ContentStep number={1} title="Why data engineers care — visual history">
          <p className="text-slate-300">
            Every execution shows a graph with green, red, and grey steps plus the input and output of each —
            debugging starts with a picture, not log archaeology.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Built-in retry and error handling">
          <p className="text-slate-300">
            Retry with exponential backoff and Catch to a notify step are declared once in the definition —
            not copy-pasted try/except blocks across ten Lambdas.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No glue-code cron chains">
          <p className="text-slate-300">
            Replaces &quot;cron at 01:00 starts Lambda A, which starts Glue, which fires an event, which starts
            Lambda B&quot; with one definition you can read top to bottom.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Step Functions follows SQS — queues buffer single units of work; Step Functions sequences multi-step pipelines with state.',
          'Roadmap: concepts and states → Amazon States Language → Standard vs Express → DE use cases → integrations, I/O, Retry/Catch next.',
          'Core vocabulary: state machine, state, execution, task, transition, ASL, Standard/Express, service integration.',
          'Typical pattern: EventBridge → Step Functions → Lambda validate, Glue ETL, Athena check → SNS alert.',
          'DEs care because of visual execution history, built-in retries, and replacing brittle cron + Lambda chains.',
        ]}
      />
    </LessonArticle>
  )
}
