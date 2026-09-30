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

export function TriggersSchedulesEvents() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A state machine does nothing until something starts it">
        So far you have clicked Start execution in the console. Production workflows start from a schedule
        (02:30 IST every night), a file landing in S3, a message in SQS, an API call from another team, or a
        parent workflow. Each trigger has different guarantees — and different answers to &quot;what if it
        fires twice?&quot;
      </Callout>

      <Definition term="StartExecution">
        <p>
          The API every trigger ultimately calls. It takes the state machine ARN, an optional{' '}
          <span className="font-mono text-sm">name</span>, and an <span className="font-mono text-sm">input</span>{' '}
          JSON string. The caller — EventBridge, Scheduler, Lambda, API Gateway — needs an IAM role or policy
          allowing <span className="font-mono text-sm">states:StartExecution</span> on that state machine.
        </p>
      </Definition>

      <LessonSection title="Event-driven starts">
        <ContentStep number={1} title="EventBridge rule on S3 Object Created">
          <p className="text-slate-300">
            Enable EventBridge notifications on acme-lake-prod, then match{' '}
            <span className="font-mono text-sm">source aws.s3</span>, detail-type{' '}
            <span className="font-mono text-sm">Object Created</span>, and a key prefix. The rule targets
            de-orders-nightly-sfn-prod directly — no Lambda needed. An{' '}
            <strong className="text-white">input transformer</strong> reshapes the large S3 event into the
            small input your workflow expects.
          </p>
        </ContentStep>
        <Example title="Rule pattern and input transformer" caption="Only vendor_a CSV landings start the workflow">
{`// Event pattern
{
  "source": ["aws.s3"],
  "detail-type": ["Object Created"],
  "detail": {
    "bucket": { "name": ["acme-lake-prod"] },
    "object": { "key": [{ "prefix": "landing/vendor_a/" }] }
  }
}

// Target input transformer
"InputPathsMap": { "bucket": "$.detail.bucket.name", "key": "$.detail.object.key" },
"InputTemplate": "{\\"bucket\\": <bucket>, \\"key\\": <key>, \\"source\\": \\"s3-landing\\"}"`}
        </Example>
        <ContentStep number={2} title="SQS in front for bursts and dedupe">
          <p className="text-slate-300">
            When a vendor drops 500 files at once, route events to SQS and let a Lambda consume batches. The
            Lambda groups files, computes a deterministic execution name, and calls StartExecution. SQS absorbs
            the burst, retries failures, and parks poison messages in a DLQ — patterns from the SQS lesson.
          </p>
        </ContentStep>
        <ContentStep number={3} title="API Gateway for other teams">
          <p className="text-slate-300">
            An API Gateway direct service integration calls StartExecution (async, returns the execution ARN)
            or <span className="font-mono text-sm">StartSyncExecution</span> for short Express workflows that
            return a result in the HTTP response. Put IAM or Cognito auth in front — this is a public door into
            your pipeline.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Schedules with EventBridge Scheduler">
        <ContentStep number={1} title="Cron, rate, and time zones">
          <p className="text-slate-300">
            EventBridge Scheduler supports <span className="font-mono text-sm">cron(30 2 * * ? *)</span> and{' '}
            <span className="font-mono text-sm">rate(1 hour)</span> with a{' '}
            <strong className="text-white">time zone</strong> — so 02:30 Asia/Kolkata stays 02:30 through DST
            changes elsewhere. Classic EventBridge scheduled rules only evaluate cron in UTC. Scheduler also
            offers flexible time windows, one-time schedules, and built-in retry with a DLQ.
          </p>
        </ContentStep>
        <Example title="Nightly schedule (AWS CLI)" caption="Templated target starts the state machine directly">
{`aws scheduler create-schedule \\
  --name de-orders-nightly-schedule \\
  --schedule-expression "cron(30 2 * * ? *)" \\
  --schedule-expression-timezone "Asia/Kolkata" \\
  --flexible-time-window Mode=OFF \\
  --target '{
    "Arn": "arn:aws:states:ap-south-1:111122223333:stateMachine:de-orders-nightly-sfn-prod",
    "RoleArn": "arn:aws:iam::111122223333:role/de-scheduler-start-sfn",
    "Input": "{\\"trigger\\": \\"schedule\\"}"
  }'`}
        </Example>
        <Callout variant="tip">
          Let the workflow derive <span className="font-mono text-sm">run_date</span> from{' '}
          <code className="text-core-400">$$.Execution.StartTime</code> (or a first Lambda step) rather than
          hardcoding it in the schedule. Manual backfills then pass run_date explicitly and a Choice picks it
          up with IsPresent.
        </Callout>
      </LessonSection>

      <LessonSection title="Idempotency with execution names">
        <ContentStep number={1} title="Names are unique for 90 days">
          <p className="text-slate-300">
            For Standard workflows an execution name must be unique per state machine for 90 days. Starting a
            second execution with the same name fails with <span className="font-mono text-sm">ExecutionAlreadyExists</span>{' '}
            (unless the first is still running with identical input, in which case the API returns the
            existing execution). Name executions <span className="font-mono text-sm">orders-2026-09-29</span> or
            a hash of the S3 key and duplicate triggers become harmless. Express workflows do not enforce this.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Who can set the name">
          <p className="text-slate-300">
            EventBridge rule targets generate random names, so they cannot dedupe. When duplicates matter, put a
            Lambda (optionally behind SQS) in front that sets the name — and treat ExecutionAlreadyExists as
            success, not failure. Reruns after a real failure should use redrive or a suffixed name like{' '}
            <span className="font-mono text-sm">orders-2026-09-29-rerun1</span>.
          </p>
        </ContentStep>
        <Example title="Lambda starter with deterministic name" caption="Duplicate S3 events start one execution">
{`name = "orders-" + hashlib.sha256(key.encode()).hexdigest()[:32]
try:
    sfn.start_execution(
        stateMachineArn=SFN_ARN,
        name=name,
        input=json.dumps({"bucket": bucket, "key": key, "run_date": run_date}),
    )
except sfn.exceptions.ExecutionAlreadyExists:
    logger.info("duplicate trigger for %s — skipped", key)`}
        </Example>
      </LessonSection>

      <LessonSection title="Nested workflows">
        <p className="text-slate-300">
          A parent orchestrator can start child state machines with{' '}
          <span className="font-mono text-sm">arn:aws:states:::states:startExecution.sync:2</span> and wait for
          them. The <span className="font-mono text-sm">:2</span> variant returns the child&apos;s output as
          parsed JSON; plain .sync returns it as an escaped string. Pass{' '}
          <span className="font-mono text-sm">AWS_STEP_FUNCTIONS_STARTED_BY_EXECUTION_ID</span> set from{' '}
          <code className="text-core-400">$$.Execution.Id</code> so the console links parent and child. Nesting
          keeps each domain workflow small and independently testable.
        </p>
        <Flowchart
          title="Triggers into the orders platform"
          chart={`flowchart LR
  SCH[EventBridge Scheduler cron IST]
  S3E[S3 Object Created rule]
  SQS[SQS buffer]
  LAM[Lambda starter named execution]
  API[API Gateway]
  PAR[Parent orchestrator]
  SFN[de-orders-nightly-sfn-prod]
  SCH --> PAR
  S3E --> SQS --> LAM --> SFN
  API --> SFN
  PAR -->|startExecution sync 2| SFN`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge rules start workflows from S3 Object Created events; input transformers trim the payload.',
          'EventBridge Scheduler adds cron or rate with time zones, flexible windows, retries, and a DLQ.',
          'Standard execution names are unique for 90 days — deterministic names make duplicate triggers harmless.',
          'Rule targets cannot set names; use a Lambda starter (often behind SQS) when dedupe matters.',
          'Nest workflows with states:startExecution.sync:2 to get the child output back as JSON.',
        ]}
      />
    </LessonArticle>
  )
}
