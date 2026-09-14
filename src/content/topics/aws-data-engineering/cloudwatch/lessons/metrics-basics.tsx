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

export function MetricsBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Metrics in one sentence">
        A CloudWatch <strong className="text-white">metric</strong> is a named number measured repeatedly
        over time — like a heart-rate monitor for your pipeline. Lambda publishes how many times it ran,
        how many failed, and how long each run took. You graph them, alarm on them, and add them to
        dashboards without installing agents on your code.
      </Callout>

      <Definition term="CloudWatch metric">
        <p>
          A <strong className="text-white">metric</strong> consists of a{' '}
          <strong className="text-white">namespace</strong> (which service — e.g.{' '}
          <code className="text-core-400">AWS/Lambda</code>), a <strong className="text-white">metric
          name</strong> (what is measured — e.g. <code className="text-core-400">Invocations</code>), optional{' '}
          <strong className="text-white">dimensions</strong> (labels that slice the data — e.g.{' '}
          <code className="text-core-400">FunctionName=de-s3-ingest-validator-dev</code>), and{' '}
          <strong className="text-white">datapoints</strong> (value + timestamp). CloudWatch stores these
          as time series you query over minutes, hours, or months.
        </p>
      </Definition>

      <LessonSection title="What metrics look like in practice">
        <p className="text-slate-300">
          Open the CloudWatch console → Metrics → select a service → pick a metric name → optionally filter
          by dimension. The graph shows how that number changed. For a data pipeline, you care less about
          abstract definitions and more about which metrics prove ingest is healthy.
        </p>
        <ContentStep number={1} title="Datapoint">
          <p className="text-slate-300">
            One measurement at one moment — e.g. <code className="text-core-400">Errors = 3</code> between
            14:00 and 14:01 UTC on Monday. Many datapoints form the line on your graph.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Statistic">
          <p className="text-slate-300">
            When CloudWatch aggregates datapoints for alarms or graphs, it uses statistics: Sum, Average,
            Minimum, Maximum, p99, etc. Alarms on Lambda Errors typically use <strong className="text-white">Sum</strong>{' '}
            over 5 minutes — &quot;total errors in the window.&quot;
          </p>
        </ContentStep>
        <ContentStep number={3} title="Period">
          <p className="text-slate-300">
            The length of each bucket (1 minute, 5 minutes). Lambda standard metrics are available at
            1-minute granularity. Longer periods smooth spikes; shorter periods catch brief failures faster.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lambda metrics every DE should know">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it tells you</th>
                <th className="px-4 py-3">DE signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Invocations', 'How many times the function ran', 'Traffic volume — did S3 events arrive?'],
                ['Errors', 'Invocations that failed (uncaught exception, timeout)', 'Pipeline broken — investigate logs immediately'],
                ['Duration', 'Wall-clock time per invocation (ms)', 'Getting slower? Bigger files, cold starts, or downstream S3 latency'],
                ['Throttles', 'Invocations rejected due to concurrency limits', 'Burst uploads exceeding account/function concurrency — backlog risk'],
                ['ConcurrentExecutions', 'Parallel runs at a point in time', 'Capacity planning — are you near the account limit?'],
                ['DeadLetterErrors', 'Failures delivering to configured DLQ', 'Async invoke path broken — messages may be lost'],
              ].map(([metric, tells, signal]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-core-400">{metric}</td>
                  <td className="px-4 py-3">{tells}</td>
                  <td className="px-4 py-3">{signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Reading a Lambda metrics graph" caption="Typical healthy vs unhealthy day">
{`Healthy ingest day:
  Invocations: steady stair-steps after each upload batch
  Errors: flat at 0
  Duration: stable ~200–400 ms

Unhealthy day:
  Invocations: still high (files keep arriving)
  Errors: spikes match Invocations (every file fails)
  Duration: may drop (fail fast) or spike (timeouts)`}
        </Example>
        <Callout variant="insight">
          Errors &gt; 0 with steady Invocations almost always means a code or data bug — bad schema, missing
          IAM permission, wrong env var — not &quot;Lambda is down.&quot; The metric points you to logs; logs
          point you to the fix.
        </Callout>
      </LessonSection>

      <LessonSection title="Other AWS metrics DE pipelines touch">
        <ContentStep number={1} title="Glue">
          <p className="text-slate-300">
            Namespace <code className="text-core-400">Glue</code> includes job run metrics — elapsed time,
            failure counts, DPU hours. Alarm when a nightly <code className="text-core-400">orders-etl</code>{' '}
            job fails so curated tables update before the business day.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3">
          <p className="text-slate-300">
            Request metrics (optional, per-bucket billing) show <code className="text-core-400">PutRequests</code>{' '}
            and <code className="text-core-400">4xxErrors</code>. Useful when ingest volume drops to zero —
            upstream producer may have stopped writing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="EC2">
          <p className="text-slate-300">
            Default <code className="text-core-400">CPUUtilization</code> and status checks for Airflow or
            custom ETL boxes. Memory and disk require the CloudWatch Agent — covered in a later lesson.
          </p>
        </ContentStep>
        <Flowchart
          title="Metric flow from service to you"
          chart={`flowchart LR
  L[Lambda runs handler]
  L --> P[AWS publishes to AWS/Lambda namespace]
  P --> CW[CloudWatch stores time series]
  CW --> G[Graph in console]
  CW --> AL[Alarm evaluation]
  CW --> DB[Dashboard widget]`}
        />
      </LessonSection>

      <LessonSection title="Namespace and dimensions — teaser">
        <p className="text-slate-300">
          Metrics are organized so thousands of functions do not collide into one line:
        </p>
        <ContentStep number={1} title="Namespace">
          <p className="text-slate-300">
            A category prefix — <code className="text-core-400">AWS/Lambda</code>,{' '}
            <code className="text-core-400">AWS/S3</code>,{' '}
            <code className="text-core-400">AWS/Glue</code>, or your custom{' '}
            <code className="text-core-400">MyCompany/DataPipeline</code> when you publish your own.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dimensions">
          <p className="text-slate-300">
            Key-value filters on a metric. Lambda metrics include{' '}
            <code className="text-core-400">FunctionName</code> and{' '}
            <code className="text-core-400">Resource</code> so you graph one ingest function without mixing
            in unrelated Lambdas in the same account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Custom metrics preview">
          <p className="text-slate-300">
            Your handler can call <code className="text-core-400">cloudwatch.put_metric_data()</code> to emit{' '}
            <code className="text-core-400">RowsProcessed</code> or{' '}
            <code className="text-core-400">FilesQuarantined</code> — business KPIs alongside AWS defaults.
            Full patterns come in the next module; for now, know the namespace/dimension model is the same.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Console navigation shortcut">
          CloudWatch → Metrics → All metrics → AWS/Lambda → By Function Name → select your function → check
          Invocations, Errors, Duration. Bookmark that view during development — it becomes your first
          debugging stop after every deploy.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A metric is a time series of measurements identified by namespace, name, and optional dimensions.',
          'Lambda essentials: Invocations (traffic), Errors (failures), Duration (latency), Throttles (capacity).',
          'Metrics are auto-published for most AWS services — graph them, alarm on them, add them to dashboards.',
          'Namespace groups metrics by service; dimensions like FunctionName slice metrics per resource.',
        ]}
      />
    </LessonArticle>
  )
}
