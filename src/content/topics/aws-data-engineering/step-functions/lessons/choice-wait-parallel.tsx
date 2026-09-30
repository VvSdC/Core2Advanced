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

export function ChoiceWaitParallel() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Real pipelines branch, pause, and fan out">
        A nightly job is rarely a straight line. Full refresh on the first of the month, incremental otherwise.
        Wait until the vendor&apos;s 02:00 SLA before checking the landing bucket. Build orders and customers
        silver tables at the same time. <strong className="text-white">Choice</strong>,{' '}
        <strong className="text-white">Wait</strong>, and <strong className="text-white">Parallel</strong>{' '}
        express all three without a line of Lambda.
      </Callout>

      <Definition term="Flow-control states">
        <p>
          <span className="font-mono text-sm">Choice</span> evaluates rules against the state input and picks
          the next state. <span className="font-mono text-sm">Wait</span> pauses for a duration or until a
          timestamp at no compute cost. <span className="font-mono text-sm">Parallel</span> runs independent
          branches concurrently and continues only when all branches finish, emitting an array of branch
          outputs.
        </p>
      </Definition>

      <LessonSection title="Choice — branch on data">
        <ContentStep number={1} title="Comparison operators">
          <p className="text-slate-300">
            Each rule names a <span className="font-mono text-sm">Variable</span> path and one operator:{' '}
            <span className="font-mono text-sm">StringEquals</span>,{' '}
            <span className="font-mono text-sm">NumericGreaterThan</span>,{' '}
            <span className="font-mono text-sm">BooleanEquals</span>,{' '}
            <span className="font-mono text-sm">TimestampLessThan</span>,{' '}
            <span className="font-mono text-sm">IsPresent</span>, <span className="font-mono text-sm">IsNull</span>.
            Path variants such as <span className="font-mono text-sm">NumericGreaterThanPath</span> compare two
            fields in the input.
          </p>
        </ContentStep>
        <ContentStep number={2} title="And, Or, Not, and Default">
          <p className="text-slate-300">
            Combine rules with <span className="font-mono text-sm">And</span>,{' '}
            <span className="font-mono text-sm">Or</span>, <span className="font-mono text-sm">Not</span>. Rules
            are checked in order; the first match wins. Always set <span className="font-mono text-sm">Default</span>{' '}
            — if nothing matches and there is no Default, the execution fails with{' '}
            <code className="text-core-400">States.NoChoiceMatched</code>. A Choice state cannot be an End state.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Guard optional fields with IsPresent">
          <p className="text-slate-300">
            Comparing a missing field raises a runtime error. Check{' '}
            <span className="font-mono text-sm">IsPresent: true</span> inside an And before comparing an
            optional <code className="text-core-400">$.full_refresh</code> flag passed by manual backfills.
          </p>
        </ContentStep>
        <Example title="Choice with And, IsPresent, and Default" caption="Full refresh vs incremental">
{`"RouteLoadType": {
  "Type": "Choice",
  "Choices": [
    {
      "And": [
        { "Variable": "$.full_refresh", "IsPresent": true },
        { "Variable": "$.full_refresh", "BooleanEquals": true }
      ],
      "Next": "RunFullRefresh"
    },
    { "Variable": "$.row_count", "NumericGreaterThan": 0, "Next": "RunIncremental" }
  ],
  "Default": "NoNewData"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Wait — pause without paying for compute">
        <ContentStep number={1} title="Seconds, Timestamp, SecondsPath">
          <p className="text-slate-300">
            <span className="font-mono text-sm">Seconds: 300</span> for a fixed delay.{' '}
            <span className="font-mono text-sm">Timestamp</span> waits until an ISO-8601 time such as the
            vendor SLA. <span className="font-mono text-sm">SecondsPath</span> and{' '}
            <span className="font-mono text-sm">TimestampPath</span> read the value from input, so a Lambda can
            compute &quot;wait until 02:15 UTC today&quot;. A Standard execution can wait up to one year; you pay
            only the state transitions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The polling loop">
          <p className="text-slate-300">
            For services without .sync — Glue crawlers, Redshift Data API, a vendor file — loop Wait → check →
            Choice. Add a counter or a TimeoutSeconds guard so a stuck crawler cannot loop forever and blow
            through the 25,000-event execution history limit.
          </p>
        </ContentStep>
        <Example title="Wait for the vendor file" caption="Poll every 10 minutes until the landing object exists">
{`"WaitForVendor": { "Type": "Wait", "Seconds": 600, "Next": "CheckLanding" },
"CheckLanding": {
  "Type": "Task",
  "Resource": "arn:aws:states:::aws-sdk:s3:listObjectsV2",
  "Parameters": {
    "Bucket": "acme-lake-prod",
    "Prefix.$": "States.Format('landing/vendor_a/dt={}/', $.run_date)"
  },
  "ResultSelector": { "count.$": "$.KeyCount" },
  "ResultPath": "$.landing",
  "Next": "FileArrived"
},
"FileArrived": {
  "Type": "Choice",
  "Choices": [{ "Variable": "$.landing.count", "NumericGreaterThan": 0, "Next": "RunSilver" }],
  "Default": "WaitForVendor"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Parallel — independent work side by side">
        <ContentStep number={1} title="Branches and output">
          <p className="text-slate-300">
            Each entry in <span className="font-mono text-sm">Branches</span> is a mini state machine with its
            own StartAt and States. Every branch gets the same input. The Parallel output is an{' '}
            <strong className="text-white">array</strong> in branch order —{' '}
            <code className="text-core-400">$[0]</code> is the first branch — so use ResultSelector or
            ResultPath to reshape it before the next state.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One branch fails, everything fails">
          <p className="text-slate-300">
            If any branch fails and does not catch its own error, Step Functions stops the other branches and
            the Parallel state fails. Put Retry and Catch on the Parallel state itself for &quot;all or
            nothing&quot;, or inside each branch when partial success is acceptable.
          </p>
        </ContentStep>
        <Example title="Two Glue jobs in parallel" caption="orders and customers silver built concurrently">
{`"BuildSilver": {
  "Type": "Parallel",
  "Branches": [
    { "StartAt": "Orders", "States": { "Orders": {
        "Type": "Task", "Resource": "arn:aws:states:::glue:startJobRun.sync",
        "Parameters": { "JobName": "orders-silver-etl" }, "End": true } } },
    { "StartAt": "Customers", "States": { "Customers": {
        "Type": "Task", "Resource": "arn:aws:states:::glue:startJobRun.sync",
        "Parameters": { "JobName": "customers-silver-etl" }, "End": true } } }
  ],
  "ResultSelector": { "orders_state.$": "$[0].JobRunState", "customers_state.$": "$[1].JobRunState" },
  "ResultPath": "$.silver",
  "Catch": [{ "ErrorEquals": ["States.ALL"], "ResultPath": "$.error", "Next": "NotifyFailure" }],
  "Next": "CrawlSilver"
}`}
        </Example>
        <Flowchart
          title="Choice, Wait, and Parallel in one nightly flow"
          chart={`flowchart TB
  W[Wait for vendor SLA]
  C{File arrived}
  P[Parallel BuildSilver]
  O[Glue orders silver]
  CU[Glue customers silver]
  J[Join branch results]
  N[NotifyFailure SNS]
  W --> C
  C -->|no| W
  C -->|yes| P
  P --> O
  P --> CU
  O --> J
  CU --> J
  P -.->|any branch fails| N`}
        />
        <Callout variant="tip">
          Parallel is for a fixed, known set of branches. When the number of items comes from data — 30
          tables, 700 daily partitions — use Map instead (next lesson).
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Choice rules run in order; always define Default or risk States.NoChoiceMatched.',
          'Use IsPresent inside And before comparing optional fields like full_refresh.',
          'Wait supports Seconds, Timestamp, SecondsPath, and TimestampPath — free idle time for SLAs and polling loops.',
          'Parallel output is an array in branch order; reshape it with ResultSelector.',
          'An uncaught failure in any branch fails the whole Parallel — catch on the Parallel or inside branches.',
        ]}
      />
    </LessonArticle>
  )
}
