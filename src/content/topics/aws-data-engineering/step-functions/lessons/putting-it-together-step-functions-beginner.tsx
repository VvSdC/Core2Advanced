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

export function PuttingItTogetherStepFunctionsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before integrations and error handling">
        You now know why orchestration follows SQS, what a state machine is, the eight state types, how to
        read Amazon States Language, when to choose Standard or Express, and where DE teams use Step
        Functions. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner Step Functions checklist</strong> — the mental model you need
        before service integration patterns, input and output processing, and Retry/Catch.
      </Callout>

      <Definition term="Beginner Step Functions mental model">
        <p>
          A <strong className="text-white">beginner Step Functions mental model</strong> for DE includes: one
          state machine per pipeline with a clear name, EventBridge as the trigger, Task states that call
          Lambda, Glue, Athena, and SNS through service integrations, Choice states that gate bad data, Fail
          states that make problems visible, Standard for batch and Express for high-volume short work,
          payloads under 256 KB with S3 URIs instead of rows, and the ASL definition in Git deployed by
          CloudFormation with a least-privilege execution role.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Trigger — EventBridge, not cron on a server">
          <p className="text-slate-300">
            A schedule rule or S3 landing event starts the execution with input like{' '}
            <code className="text-core-400">run_date</code> and <code className="text-core-400">input_uri</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestrator — one named state machine">
          <p className="text-slate-300">
            <code className="text-core-400">de-orders-nightly-sfn-prod</code>, Standard type, owns the order
            of steps — not a chain of Lambdas calling each other.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Workers — services do the heavy lifting">
          <p className="text-slate-300">
            Lambda validates, Glue transforms, Athena checks — each called from a Task state. Step Functions
            never touches the rows.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Gates and outcomes — Choice, Succeed, Fail">
          <p className="text-slate-300">
            A Choice on row count decides between success notification and a Fail state that turns the
            execution red and alerts <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Definition and permissions — Git plus IAM">
          <p className="text-slate-300">
            ASL in Git, deployed via CloudFormation; the execution role allows only{' '}
            <code className="text-core-400">lambda:InvokeFunction</code>,{' '}
            <code className="text-core-400">glue:StartJobRun</code>, Athena query actions, and{' '}
            <code className="text-core-400">sns:Publish</code> on specific ARNs.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE Step Functions stack"
          chart={`flowchart TD
  EB[EventBridge schedule] --> SF[de-orders-nightly-sfn-prod]
  SF --> LAM[Lambda validate]
  SF --> GLUE[Glue orders-silver-etl sync]
  SF --> ATH[Athena row count]
  SF --> SNS[SNS de-alerts-prod]
  GLUE --> S3[S3 acme-lake-prod silver]
  CFN[CloudFormation stack] --> SF
  GIT[ASL in Git] --> CFN`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is Step Functions in one sentence?">
          <p className="text-slate-300">
            A serverless workflow service that runs state machines — calling services in order, passing JSON
            between steps, retrying, branching, and recording history.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration vs choreography">
          <p className="text-slate-300">
            Orchestration = one coordinator owns the flow; choreography = services react to events via SNS,
            SQS, and EventBridge with no central owner.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Name the eight state types">
          <p className="text-slate-300">
            Task, Choice, Wait, Pass, Parallel, Map, Succeed, Fail — only Task calls other services.
          </p>
        </ContentStep>
        <ContentStep number={4} title="What do StartAt, Next, and End do?">
          <p className="text-slate-300">
            StartAt names the first state, Next points to the following state, End: true finishes the
            execution successfully.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Standard vs Express">
          <p className="text-slate-300">
            Standard = up to 1 year, exactly-once, per-transition pricing, 90-day history; Express = up to 5
            minutes, at-least-once async, per request plus duration, logs in CloudWatch.
          </p>
        </ContentStep>
        <ContentStep number={6} title="What does .sync mean on a Glue Resource ARN?">
          <p className="text-slate-300">
            Start the Glue job and wait until it finishes before moving on — no polling Lambda required.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Why pass S3 URIs instead of data?">
          <p className="text-slate-300">
            State payloads are limited to 256 KB and orchestration is not compute — Glue and Athena read the
            data from S3 themselves.
          </p>
        </ContentStep>
        <Example title="Beginner Step Functions concept drill" caption="No console required yet — explain aloud">
{`1. Draw: EventBridge -> state machine -> Lambda validate -> Glue -> Athena check -> SNS
2. Which state type stops bad data from reaching gold, and which makes the run red?
3. Write the StartAt and first two states of that pipeline in ASL from memory
4. Why is the nightly Glue pipeline Standard and not Express?
5. When would an Express workflow be the right pick for a DE team?
6. What breaks if a Lambda returns 50,000 rows into the state data?
7. How does Step Functions fit after SQS in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong Step Functions beginners ask three questions before building a workflow: what are the ordered
          steps, what happens when each one fails, and is this batch or per-event — the last answer picks
          Standard or Express.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme deploys CloudFormation stack <code className="text-core-400">acme-de-orchestration-prod</code>{' '}
          with Standard state machine <code className="text-core-400">de-orders-nightly-sfn-prod</code> and an
          EventBridge schedule at 01:00 UTC. The execution starts with input{' '}
          <code className="text-core-400">run_date = 2026-09-30</code> and{' '}
          <code className="text-core-400">input_uri = s3://acme-lake-prod/raw/orders/2026-09-30/</code>.
          Lambda <code className="text-core-400">de-orders-validate-prod</code> confirms the files exist and
          the header matches. Glue job <code className="text-core-400">orders-silver-etl</code> runs via{' '}
          <code className="text-core-400">startJobRun.sync</code> for 14 minutes and writes Parquet to{' '}
          <code className="text-core-400">silver/orders/</code>. An Athena task counts rows for the run date:
          184,223. The Choice state sees a positive count and publishes a success message to{' '}
          <code className="text-core-400">de-alerts-prod</code>. On a night the vendor sends an empty file, the
          count is zero — the Fail state turns the execution red, the alert fires, and on-call opens the graph
          to see exactly which step and input caused it.
        </p>
        <ContentStep number={1} title="Trigger tier — EventBridge">
          <p className="text-slate-300">Schedule starts one execution per night with a run date input.</p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration tier — Step Functions">
          <p className="text-slate-300">Order, waiting, branching, and history — no data inside the payload.</p>
        </ContentStep>
        <ContentStep number={3} title="Compute tier — Lambda, Glue, Athena">
          <p className="text-slate-300">Validation, Spark transform, and SQL quality check do the real work.</p>
        </ContentStep>
        <ContentStep number={4} title="Notification tier — SNS">
          <p className="text-slate-300">Success or failure reaches the team without anyone watching a console.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate Step Functions lessons go hands-on with what this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Service integrations">
          <p className="text-slate-300">
            Request-response, run a job with <code className="text-core-400">.sync</code>, and wait for a
            callback with a task token — when to use each for Glue, Athena, and external systems.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Input and output processing">
          <p className="text-slate-300">
            <code className="text-core-400">InputPath</code>, <code className="text-core-400">Parameters</code>,{' '}
            <code className="text-core-400">ResultSelector</code>, <code className="text-core-400">ResultPath</code>,
            and <code className="text-core-400">OutputPath</code> — shaping the JSON that flows between states.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retry and Catch">
          <p className="text-slate-300">
            Exponential backoff for transient Glue and throttling errors, fallbacks to notify steps, and
            failing loudly instead of swallowing errors.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Choice, Wait, and Parallel in depth">
          <p className="text-slate-300">
            Branching on data, waiting for late files, and building gold tables side by side.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Before your first prod state machine">
          Run the workflow in dev with a deliberately empty input file and a deliberately failing Glue job —
          confirm both paths turn the execution red and reach SNS before trusting it with prod data.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: EventBridge trigger, one named state machine, Task states calling services, Choice gates, Fail for visibility.',
          'Self-check: definition, orchestration vs choreography, eight state types, StartAt/Next/End, Standard vs Express, .sync, 256 KB payloads.',
          'End-to-end: EventBridge schedule → state machine → Lambda validate → Glue ETL → Athena row count → SNS.',
          'Next in the Step Functions track: service integrations, input and output processing, Retry/Catch, and Choice/Wait/Parallel.',
        ]}
      />
    </LessonArticle>
  )
}
