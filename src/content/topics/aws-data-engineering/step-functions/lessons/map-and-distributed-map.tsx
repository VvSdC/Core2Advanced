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

export function MapAndDistributedMap() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Same steps, many items">
        Backfill two years of daily partitions. Reprocess every table in a list. Validate four million JSON
        files a vendor dropped in S3. Each is &quot;run these steps for every item&quot; — the job of the{' '}
        <strong className="text-white">Map</strong> state. Inline Map handles dozens of items inside one
        execution; <strong className="text-white">Distributed Map</strong> handles millions by spawning child
        workflow executions.
      </Callout>

      <Definition term="Map state">
        <p>
          A state that iterates over an array (or, in distributed mode, a dataset in S3) and runs an{' '}
          <span className="font-mono text-sm">ItemProcessor</span> sub-workflow for each item, with concurrency
          controlled by <span className="font-mono text-sm">MaxConcurrency</span>. Output is an array of
          iteration results — or, for distributed mode, result files written to S3.
        </p>
      </Definition>

      <LessonSection title="Inline Map">
        <ContentStep number={1} title="ItemsPath and MaxConcurrency">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ItemsPath: &quot;$.tables&quot;</span> points at an array in the
            state input. <span className="font-mono text-sm">ItemSelector</span> (formerly Parameters) shapes each
            item and can add context like <code className="text-core-400">$$.Map.Item.Value</code> and{' '}
            <code className="text-core-400">$$.Map.Item.Index</code>. MaxConcurrency 0 means &quot;as many as
            possible&quot;, but inline Map tops out at around 40 concurrent iterations.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Inline limits">
          <p className="text-slate-300">
            Every iteration writes events into the parent&apos;s history, which is capped at 25,000 events for a
            Standard execution. The whole array must also fit within the 256 KB payload limit. A few hundred
            small items is fine; 730 partitions × 6 states each is not.
          </p>
        </ContentStep>
        <Example title="Inline Map over a table list" caption="Five silver jobs, at most three at once">
{`"RefreshTables": {
  "Type": "Map",
  "ItemsPath": "$.tables",
  "MaxConcurrency": 3,
  "ItemSelector": { "table.$": "$$.Map.Item.Value", "run_date.$": "$.run_date" },
  "ItemProcessor": {
    "ProcessorConfig": { "Mode": "INLINE" },
    "StartAt": "RunJob",
    "States": {
      "RunJob": {
        "Type": "Task",
        "Resource": "arn:aws:states:::glue:startJobRun.sync",
        "Parameters": {
          "JobName.$": "States.Format('{}-silver-etl', $.table)",
          "Arguments": { "--run_date.$": "$.run_date" }
        },
        "End": true
      }
    }
  },
  "ResultPath": "$.table_results",
  "Next": "CrawlSilver"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Distributed Map">
        <ContentStep number={1} title="Child executions at scale">
          <p className="text-slate-300">
            With <span className="font-mono text-sm">ProcessorConfig Mode: DISTRIBUTED</span>, each batch of
            items runs as a separate <strong className="text-white">child workflow execution</strong> (Standard
            or Express) with its own history. Up to 10,000 child executions run in parallel, so the parent
            history stays small no matter how many items you process.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ItemReader — read items from S3">
          <p className="text-slate-300">
            Instead of an input array, <span className="font-mono text-sm">ItemReader</span> can use{' '}
            <span className="font-mono text-sm">s3:listObjectsV2</span> (one item per object under a prefix) or{' '}
            <span className="font-mono text-sm">s3:getObject</span> with an InputType of CSV, JSON, or MANIFEST
            (S3 Inventory). A CSV of 730 backfill dates or an inventory of 4 million objects becomes the item
            list without passing through state payloads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="ItemBatcher, ResultWriter, tolerated failures">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ItemBatcher</span> groups items (MaxItemsPerBatch,
            MaxInputBytesPerBatch) so one child processes 500 small files instead of one.{' '}
            <span className="font-mono text-sm">ResultWriter</span> writes results and a manifest to S3 rather
            than returning them. <span className="font-mono text-sm">ToleratedFailurePercentage</span> or{' '}
            <span className="font-mono text-sm">ToleratedFailureCount</span> lets the run succeed when a few bad
            files fail — above the threshold the Map fails with States.ExceedToleratedFailureThreshold.
          </p>
        </ContentStep>
        <Example title="Distributed Map over S3 objects" caption="Validate every file under a vendor prefix">
{`"ValidateFiles": {
  "Type": "Map",
  "ItemReader": {
    "Resource": "arn:aws:states:::s3:listObjectsV2",
    "Parameters": { "Bucket": "acme-lake-prod", "Prefix": "landing/vendor_a/2026/" }
  },
  "ItemBatcher": { "MaxItemsPerBatch": 500 },
  "MaxConcurrency": 200,
  "ToleratedFailurePercentage": 1,
  "ItemProcessor": {
    "ProcessorConfig": { "Mode": "DISTRIBUTED", "ExecutionType": "EXPRESS" },
    "StartAt": "ValidateBatch",
    "States": {
      "ValidateBatch": {
        "Type": "Task",
        "Resource": "arn:aws:states:::lambda:invoke",
        "Parameters": { "FunctionName": "de-validate-json-prod", "Payload.$": "$" },
        "End": true
      }
    }
  },
  "ResultWriter": {
    "Resource": "arn:aws:states:::s3:putObject",
    "Parameters": { "Bucket": "acme-lake-prod", "Prefix": "sfn-results/validate/" }
  },
  "End": true
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Choosing a mode and protecting downstream">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Inline Map</th>
                <th className="px-4 py-3">Distributed Map</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Item source', 'Array in state input', 'Input array or S3 via ItemReader'],
                ['Concurrency', 'About 40 iterations', 'Up to 10,000 child executions'],
                ['History', 'Shares parent 25,000-event limit', 'Each child has its own history'],
                ['Results', 'Array in state output', 'Array or files via ResultWriter'],
                ['DE fit', 'Table lists, a few dozen dates', 'Multi-year backfills, millions of objects'],
              ].map(([dim, inline, dist]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{inline}</td>
                  <td className="px-4 py-3">{dist}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Backfill 2 years of daily partitions"
          chart={`flowchart TB
  CSV[S3 CSV of 730 run dates]
  DM[Distributed Map MaxConcurrency 10]
  C1[Child execution per date]
  G[Glue orders silver sync]
  RW[ResultWriter to S3]
  SNS[SNS summary de-alerts-prod]
  CSV --> DM
  DM --> C1
  C1 --> G
  G --> RW
  RW --> SNS`}
        />
        <ContentStep number={1} title="MaxConcurrency protects the systems you call">
          <p className="text-slate-300">
            10,000 parallel children calling Glue will hit the job&apos;s max concurrent runs, your account DPU
            quota, or the Redshift connection limit within seconds. Set MaxConcurrency to what the{' '}
            <em>downstream</em> tolerates — for a 730-day backfill of orders-silver-etl, 10 concurrent runs with
            jittered retries on Glue.ConcurrentRunsExceededException is usually faster than 200 throttled ones.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Distributed Map child executions of type Express are billed per request and duration, which is far
          cheaper for millions of short Lambda validations. Use Standard children when each item runs a
          long Glue .sync job or needs exactly-once semantics.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inline Map iterates an input array with about 40 concurrent iterations and shares the parent history limit.',
          'Distributed Map runs child executions — up to 10,000 in parallel — reading items from S3 with ItemReader.',
          'ItemBatcher groups small items; ResultWriter sends results to S3 instead of the 256 KB payload.',
          'ToleratedFailurePercentage lets a few bad files fail without failing the whole run.',
          'Size MaxConcurrency for downstream quotas — Glue concurrent runs, DPUs, and warehouse connections.',
        ]}
      />
    </LessonArticle>
  )
}
