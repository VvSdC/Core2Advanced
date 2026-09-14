import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PerformanceOptimization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda billing and speed follow memory — and design choices">
        You pay for GB-seconds and per-request duration. Tuning memory also scales CPU proportionally.
        Data engineering handlers that download multi-GB S3 objects, parse CSV in memory, or create fresh
        boto3 clients every invoke waste money and hit timeouts — optimization is architectural, not
        micro-benchmark trivia.
      </Callout>

      <Definition term="Memory-CPU coupling">
        <p>
          Lambda memory settings (128 MB–10 GB) allocate proportional CPU. More memory often{' '}
          <strong className="text-white">reduces total cost</strong> for CPU-bound transforms (compression,
          Parquet encoding) because duration drops faster than price increases. Use AWS Lambda Power Tuning
          tool or CloudWatch logs to find the cost/performance sweet spot per function.
        </p>
      </Definition>

      <LessonSection title="Core optimization patterns">
        <ContentStep number={1} title="Reuse clients and connections">
          <p className="text-slate-300">
            Initialize boto3 clients, regex patterns, and schema objects at module scope. Warm containers
            amortize setup across hundreds of invocations. Avoid opening new DB connections per invoke —
            use RDS Proxy or limit VPC functions that need pools.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stream — do not load entire objects">
          <p className="text-slate-300">
            For S3 reads, iterate <span className="font-mono text-sm">Body.iter_chunks()</span> or use
            S3 Select for header-only validation. Loading a 500 MB CSV into memory on a 512 MB function
            fails fast — and on a 3 GB function it is still slow and expensive.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Right-size memory">
          <p className="text-slate-300">
            Profile with Powertuning: a 1024 MB validator finishing in 800 ms may cost less than 256 MB
            finishing in 3200 ms. Document chosen memory in IaC comments — silent default 128 MB cripples
            pandas workloads.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Avoid huge payloads">
          <p className="text-slate-300">
            Lambda event payload limit 6 MB (async) / 6 MB sync request body. Pass S3 keys in events, not
            file contents. Step Functions state payloads cap at 256 KB — store intermediate results in S3,
            pass URIs between states.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Parallelism inside handler">
          <p className="text-slate-300">
            For independent small S3 objects in one SQS batch, use{' '}
            <span className="font-mono text-sm">concurrent.futures</span> with bounded worker count — do
            not unbounded thread per record on 10 GB files. Match internal parallelism to allocated CPU.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE-specific anti-patterns">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Anti-pattern</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Full Glue Spark job inside Lambda', 'StartJobRun; let Glue scale DPUs'],
                ['Athena query scanning entire curated table', 'Partition-filtered SQL or pre-aggregated metrics'],
                ['Sleep polling Glue job in Lambda loop', 'Step Functions wait state or EventBridge on job success'],
                ['Giant deployment ZIP with unused ML libs', 'Split layers; lazy import heavy modules'],
                ['Synchronous chain of 5 Lambda calls', 'Step Functions or single handler with clear steps'],
                ['No /tmp cleanup on warm containers', 'finally block unlink; monitor /tmp usage'],
              ].map(([bad, fix]) => (
                <tr key={bad} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{bad}</td>
                  <td className="px-4 py-3">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Pass reference not payload">
{`# Good — event carries pointer
{"bucket": "lake-prod", "key": "landing/vendor/file.csv"}

# Bad — embed data
{"rows": [ ... 50000 records ... ]}`}
        </Example>
      </LessonSection>

      <LessonSection title="Observability for tuning">
        <ContentStep number={1} title="CloudWatch metrics">
          <p className="text-slate-300">
            Track Duration, InitDuration, Max Memory Used, Errors, Throttles per function version. Compare
            after memory or packaging changes — InitDuration spikes flag layer bloat.
          </p>
        </ContentStep>
        <ContentStep number={2} title="X-Ray (optional)">
          <p className="text-slate-300">
            Enable active tracing to see boto3 subsegment latency — identifies slow Glue API calls vs S3
            download vs handler logic.
          </p>
        </ContentStep>
        <Callout variant="tip">
          If optimization plateaus above 10 GB memory or 15 minutes, the workload belongs on Glue or EC2 —
          not further Lambda tuning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Memory setting scales CPU — higher memory often lowers total cost for CPU-bound pandas/compression work.',
          'Reuse boto3 clients and compiled objects at module scope; stream S3 reads instead of loading full objects.',
          'Pass S3 keys in events — never multi-MB payloads; Step Functions states should reference S3 for large intermediates.',
          'Avoid polling long jobs inside Lambda — use Step Functions wait or event-driven callbacks.',
          'Profile with Duration, InitDuration, and Max Memory Used — hand off to Glue when hitting 15 min or 10 GB walls.',
        ]}
      />
    </LessonArticle>
  )
}
