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

export function AmazonStatesLanguage() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The diagram is a picture — the JSON is the truth">
        The Step Functions console draws a pretty graph, but behind every graph is a JSON document written in{' '}
        <strong className="text-white">Amazon States Language (ASL)</strong>. Code reviews, CloudFormation
        templates, and incident debugging all happen against that JSON. Once you can read ASL, you can read
        any team&apos;s pipeline.
      </Callout>

      <Definition term="Amazon States Language (ASL)">
        <p>
          <strong className="text-white">Amazon States Language</strong> is the JSON-based specification for
          defining a state machine. A definition has an optional <code className="text-core-400">Comment</code>,
          a required <code className="text-core-400">StartAt</code>, and a required{' '}
          <code className="text-core-400">States</code> object whose keys are state names. Each state declares
          its <code className="text-core-400">Type</code> and how it transitions —{' '}
          <code className="text-core-400">Next</code> or <code className="text-core-400">End</code>.
        </p>
      </Definition>

      <LessonSection title="The shape of a definition">
        <ContentStep number={1} title="Top level — Comment, StartAt, States">
          <p className="text-slate-300">
            <code className="text-core-400">Comment</code> is free text for humans.{' '}
            <code className="text-core-400">StartAt</code> must exactly match one key in{' '}
            <code className="text-core-400">States</code> — state names are case-sensitive.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Each state — Type plus type-specific fields">
          <p className="text-slate-300">
            Task states add <code className="text-core-400">Resource</code> (what to call) and usually{' '}
            <code className="text-core-400">Parameters</code> (what to send). Choice states add{' '}
            <code className="text-core-400">Choices</code> and <code className="text-core-400">Default</code>.
            Fail states add <code className="text-core-400">Error</code> and{' '}
            <code className="text-core-400">Cause</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resource ARNs — the service integration">
          <p className="text-slate-300">
            Optimized integrations use ARNs like{' '}
            <code className="text-core-400">arn:aws:states:::lambda:invoke</code>,{' '}
            <code className="text-core-400">arn:aws:states:::sns:publish</code>, and{' '}
            <code className="text-core-400">arn:aws:states:::glue:startJobRun.sync</code>. The{' '}
            <code className="text-core-400">.sync</code> suffix means &quot;start the job and wait until it
            finishes&quot; — no polling Lambda needed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A complete small pipeline in ASL">
        <p className="text-slate-300">
          This definition validates the input with Lambda, runs Glue job{' '}
          <code className="text-core-400">orders-silver-etl</code> and waits, checks the result with a Choice,
          and publishes to SNS topic <code className="text-core-400">de-alerts-prod</code> before succeeding or
          failing.
        </p>
        <Example title="de-orders-nightly-sfn-prod.asl.json" caption="JSONPath style — the classic ASL syntax">
{`{
  "Comment": "Acme nightly orders: validate -> Glue -> check -> notify",
  "StartAt": "ValidateInput",
  "States": {
    "ValidateInput": {
      "Type": "Task",
      "Resource": "arn:aws:states:::lambda:invoke",
      "Parameters": {
        "FunctionName": "de-orders-validate-prod",
        "Payload.$": "$"
      },
      "ResultPath": "$.validation",
      "Next": "RunGlueJob"
    },
    "RunGlueJob": {
      "Type": "Task",
      "Resource": "arn:aws:states:::glue:startJobRun.sync",
      "Parameters": {
        "JobName": "orders-silver-etl",
        "Arguments": {
          "--run_date.$": "$.run_date",
          "--input_uri.$": "$.input_uri"
        }
      },
      "ResultPath": "$.glue",
      "Catch": [
        { "ErrorEquals": ["States.ALL"], "ResultPath": "$.error", "Next": "NotifyFailure" }
      ],
      "Next": "CheckGlueResult"
    },
    "CheckGlueResult": {
      "Type": "Choice",
      "Choices": [
        { "Variable": "$.glue.JobRunState", "StringEquals": "SUCCEEDED", "Next": "NotifySuccess" }
      ],
      "Default": "NotifyFailure"
    },
    "NotifySuccess": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
        "Message": "orders-silver-etl succeeded"
      },
      "Next": "PipelineSucceeded"
    },
    "NotifyFailure": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
        "Message": "orders-silver-etl FAILED - check execution history"
      },
      "Next": "PipelineFailed"
    },
    "PipelineSucceeded": { "Type": "Succeed" },
    "PipelineFailed": { "Type": "Fail", "Error": "OrdersPipelineFailed", "Cause": "Glue job did not succeed" }
  }
}`}
        </Example>
        <Flowchart
          title="What the console draws from that JSON"
          chart={`flowchart TD
  V[ValidateInput Lambda] --> G[RunGlueJob Glue sync]
  G --> C{CheckGlueResult}
  G -.->|Catch| NF[NotifyFailure SNS]
  C -->|SUCCEEDED| NS[NotifySuccess SNS]
  C -->|Default| NF
  NS --> OK[PipelineSucceeded]
  NF --> KO[PipelineFailed]`}
        />
        <Callout variant="info" title="Reading the $ paths">
          <code className="text-core-400">$</code> is the whole state input;{' '}
          <code className="text-core-400">$.run_date</code> picks one field. A key ending in{' '}
          <code className="text-core-400">.$</code> means &quot;evaluate this value as a path&quot;.{' '}
          <code className="text-core-400">ResultPath</code> tucks each result under a key so earlier data
          survives — covered fully in Input &amp; Output Processing, with Catch in Retry &amp; Catch.
        </Callout>
      </LessonSection>

      <LessonSection title="JSONPath vs JSONata">
        <p className="text-slate-300">
          The example above uses <strong className="text-white">JSONPath</strong>, the original query language
          you will see in most existing pipelines. Step Functions also supports{' '}
          <strong className="text-white">JSONata</strong>, a newer option set with{' '}
          <code className="text-core-400">QueryLanguage</code>. JSONata replaces the many path fields with{' '}
          <code className="text-core-400">Arguments</code> and <code className="text-core-400">Output</code>{' '}
          and lets you write expressions — string formatting, maths, conditions — inline.
        </p>
        <Example title="The Glue task in JSONata style" caption="Same intent, newer syntax">
{`"RunGlueJob": {
  "Type": "Task",
  "QueryLanguage": "JSONata",
  "Resource": "arn:aws:states:::glue:startJobRun.sync",
  "Arguments": {
    "JobName": "orders-silver-etl",
    "Arguments": {
      "--run_date": "{% $states.input.run_date %}",
      "--input_uri": "{% $states.input.input_uri %}"
    }
  },
  "Next": "CheckGlueResult"
}`}
        </Example>
        <Callout variant="tip">
          Pick one query language per state machine and stick to it — mixing styles makes reviews harder. Learn
          JSONPath first because you will read it in existing code; consider JSONata for new workflows.
        </Callout>
      </LessonSection>

      <LessonSection title="Workflow Studio vs code — and keeping it in Git">
        <ContentStep number={1} title="Workflow Studio — design visually">
          <p className="text-slate-300">
            The drag-and-drop designer in the console is great for sketching and learning. It generates ASL
            you can copy out — but a console-only definition has no review history.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Code — review like any other pipeline code">
          <p className="text-slate-300">
            Store <code className="text-core-400">.asl.json</code> files in Git and deploy with CloudFormation
            (<code className="text-core-400">AWS::StepFunctions::StateMachine</code>) so dev, staging, and prod
            run identical definitions with environment-specific ARNs substituted.
          </p>
        </ContentStep>
        <Example title="Validate and deploy from the CLI" caption="Catch typos before prod">
{`aws stepfunctions validate-state-machine-definition \\
  --definition file://de-orders-nightly-sfn-prod.asl.json

aws stepfunctions create-state-machine \\
  --name de-orders-nightly-sfn-prod \\
  --definition file://de-orders-nightly-sfn-prod.asl.json \\
  --role-arn arn:aws:iam::111122223333:role/de-orders-sfn-role-prod`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ASL is JSON: Comment, StartAt, and States; each state has a Type and Next or End.',
          'Task Resource ARNs like arn:aws:states:::glue:startJobRun.sync call services directly — .sync waits for completion.',
          'JSONPath ($.field, keys ending in .$) is the classic syntax; JSONata is the newer option via QueryLanguage.',
          'Workflow Studio is for sketching; production definitions live in Git and deploy via CloudFormation.',
          'Validate definitions in CI with validate-state-machine-definition before they reach prod.',
        ]}
      />
    </LessonArticle>
  )
}
