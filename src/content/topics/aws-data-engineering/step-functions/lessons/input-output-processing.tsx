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

export function InputOutputProcessing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every state receives JSON and emits JSON">
        The most common Step Functions bug is not a failed Glue job — it is a state that overwrote the{' '}
        <span className="font-mono text-sm">run_date</span> the next state needed. Input and output
        processing fields let you pick what goes into a task, trim what comes out, and decide where the result
        lands in the running state document.
      </Callout>

      <Definition term="Input and output processing (JSONPath)">
        <p>
          Five optional fields applied in a fixed order around each Task:{' '}
          <span className="font-mono text-sm">InputPath</span> (select part of the state input) →{' '}
          <span className="font-mono text-sm">Parameters</span> (build the API request) → task runs →{' '}
          <span className="font-mono text-sm">ResultSelector</span> (trim the raw result) →{' '}
          <span className="font-mono text-sm">ResultPath</span> (where to put the result inside the original
          input) → <span className="font-mono text-sm">OutputPath</span> (select what passes to the next state).
        </p>
      </Definition>

      <LessonSection title="The processing pipeline">
        <Flowchart
          title="JSONPath processing order inside one Task state"
          chart={`flowchart LR
  IN[State input]
  IP[InputPath]
  PA[Parameters]
  TK[Task call]
  RS[ResultSelector]
  RP[ResultPath]
  OP[OutputPath]
  OUT[State output]
  IN --> IP --> PA --> TK --> RS --> RP --> OP --> OUT
  IN -.->|original input kept for| RP`}
        />
        <ContentStep number={1} title="InputPath and Parameters">
          <p className="text-slate-300">
            <span className="font-mono text-sm">InputPath: &quot;$.job&quot;</span> narrows the input to one
            object. <span className="font-mono text-sm">Parameters</span> builds the request: static values as
            normal keys, dynamic values with a <code className="text-core-400">.$</code> suffix on the key —{' '}
            <span className="font-mono text-sm">&quot;JobName.$&quot;: &quot;$.name&quot;</span>. Forget the
            suffix and Glue receives the literal string $.name.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ResultSelector and ResultPath">
          <p className="text-slate-300">
            A Glue .sync result carries dozens of fields. <span className="font-mono text-sm">ResultSelector</span>{' '}
            keeps only <code className="text-core-400">Id</code> and <code className="text-core-400">JobRunState</code>.{' '}
            <span className="font-mono text-sm">ResultPath: &quot;$.glue&quot;</span> merges that into the
            original input instead of replacing it. <span className="font-mono text-sm">ResultPath: null</span>{' '}
            discards the result entirely — ideal after an SNS publish.
          </p>
        </ContentStep>
        <ContentStep number={3} title="OutputPath">
          <p className="text-slate-300">
            Final filter before the next state. Defaults to <span className="font-mono text-sm">$</span> (everything).
            Use it sparingly — dropping fields here is how run_date disappears three states later.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked example — JSON at each stage">
        <Example title="1. State input" caption="Execution input for de-orders-nightly-sfn-prod">
{`{
  "run_date": "2026-09-29",
  "bucket": "acme-lake-prod",
  "job": { "name": "orders-silver-etl", "workers": 10 }
}`}
        </Example>
        <Example title="2. Task definition" caption="Every processing field in one state">
{`"RunSilverJob": {
  "Type": "Task",
  "Resource": "arn:aws:states:::glue:startJobRun.sync",
  "Parameters": {
    "JobName.$": "$.job.name",
    "NumberOfWorkers.$": "$.job.workers",
    "WorkerType": "G.1X",
    "Arguments": {
      "--run_date.$": "$.run_date",
      "--execution_id.$": "$$.Execution.Id"
    }
  },
  "ResultSelector": {
    "run_id.$": "$.Id",
    "state.$": "$.JobRunState",
    "seconds.$": "$.ExecutionTime"
  },
  "ResultPath": "$.glue",
  "Next": "CrawlSilver"
}`}
        </Example>
        <Example title="3. State output" caption="Original input preserved, trimmed result under $.glue">
{`{
  "run_date": "2026-09-29",
  "bucket": "acme-lake-prod",
  "job": { "name": "orders-silver-etl", "workers": 10 },
  "glue": { "run_id": "jr_7f3a...", "state": "SUCCEEDED", "seconds": 412 }
}`}
        </Example>
        <Callout variant="insight">
          <span className="font-mono text-sm">$$</span> addresses the <strong className="text-white">context object</strong>,
          not the state input: <code className="text-core-400">$$.Execution.Id</code>,{' '}
          <code className="text-core-400">$$.Execution.StartTime</code>,{' '}
          <code className="text-core-400">$$.State.EnteredTime</code>, and{' '}
          <code className="text-core-400">$$.Task.Token</code>. Passing the execution ID into Glue arguments
          lets you trace a Spark run back to its workflow.
        </Callout>
      </LessonSection>

      <LessonSection title="Intrinsic functions">
        <ContentStep number={1} title="Build values without a Lambda">
          <p className="text-slate-300">
            Intrinsics run inside <span className="font-mono text-sm">Parameters</span> and{' '}
            <span className="font-mono text-sm">ResultSelector</span> on keys ending in .$.{' '}
            <span className="font-mono text-sm">States.Format</span> builds S3 URIs and SQL,{' '}
            <span className="font-mono text-sm">States.StringToJson</span> parses a JSON string returned by
            an API, <span className="font-mono text-sm">States.Array</span> packs values into a list, and{' '}
            <span className="font-mono text-sm">States.UUID</span> mints a unique batch ID.
          </p>
        </ContentStep>
        <Example title="Intrinsics in Parameters" caption="Athena QA query and S3 prefix built inline">
{`"Parameters": {
  "QueryString.$": "States.Format('SELECT count(*) FROM silver.orders WHERE dt = \\'{}\\'', $.run_date)",
  "output_prefix.$": "States.Format('s3://{}/silver/orders/dt={}/', $.bucket, $.run_date)",
  "batch_id.$": "States.UUID()",
  "datasets.$": "States.Array('orders', 'customers')",
  "config.$": "States.StringToJson($.config_json)"
}`}
        </Example>
        <ContentStep number={2} title="The 256 KB payload limit">
          <p className="text-slate-300">
            State input and output are capped at 256 KB. Exceeding it fails with{' '}
            <code className="text-core-400">States.DataLimitExceeded</code>. Never pass rows or file contents
            between states — write data to S3 and pass the URI, like{' '}
            <span className="font-mono text-sm">s3://acme-lake-prod/tmp/manifest.json</span>. Athena
            GetQueryResults on a big result set is the classic way to hit this.
          </p>
        </ContentStep>
        <Callout variant="info" title="JSONata — the newer option">
          State machines can set <span className="font-mono text-sm">QueryLanguage: &quot;JSONata&quot;</span>.
          JSONata replaces the five JSONPath fields with <span className="font-mono text-sm">Arguments</span> and{' '}
          <span className="font-mono text-sm">Output</span> plus expressions for math, string, and date logic.
          Many existing pipelines and docs still use JSONPath, so learn both — this track uses JSONPath.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Order: InputPath → Parameters → task → ResultSelector → ResultPath → OutputPath.',
          'Keys ending in .$ are evaluated as paths or intrinsics; without the suffix values are literal strings.',
          'ResultPath "$.field" keeps the original input; ResultPath null discards the task result.',
          '$$ is the context object — Execution.Id, StartTime, and Task.Token for callbacks.',
          'Payloads cap at 256 KB — pass S3 URIs, never datasets, between states.',
        ]}
      />
    </LessonArticle>
  )
}
