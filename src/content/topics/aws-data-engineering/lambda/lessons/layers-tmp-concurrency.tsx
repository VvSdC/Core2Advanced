import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LayersTmpConcurrency() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Beyond the handler — runtime resources matter">
        Lambda functions share more than code: <strong className="text-white">layers</strong> ship
        dependencies, <strong className="text-white">/tmp</strong> holds ephemeral scratch space, and{' '}
        <strong className="text-white">concurrency settings</strong> control how many copies run at once.
        Data engineers tune all three when packaging pandas/pyarrow validators or buffering large CSV
        extracts during ingest.
      </Callout>

      <Definition term="Lambda Layer">
        <p>
          A <strong className="text-white">Lambda Layer</strong> is a ZIP archive mounted at{' '}
          <span className="font-mono text-sm">/opt</span> containing libraries, binaries, or shared code.
          Up to five layers per function; total unzipped deployment + layers limit 250 MB. DE teams publish
          org-wide layers for pandas, pyarrow, great_expectations, or internal schema validators — deploy
          function code separately from heavy wheels.
        </p>
      </Definition>

      <Definition term="/tmp ephemeral storage">
        <p>
          Each execution environment gets <strong className="text-white">/tmp</strong> disk — default 512 MB,
          configurable up to 10 GB. It persists for the lifetime of a warm container (not across cold
          starts on a new instance). Use for downloading S3 objects, unpacking archives, writing temp Parquet
          before multipart upload — then delete files in{' '}
          <span className="font-mono text-sm">finally</span> blocks to avoid filling disk on reused
          containers.
        </p>
      </Definition>

      <LessonSection title="Layers — deeper DE patterns">
        <ContentStep number={1} title="Shared dependency layer">
          <p className="text-slate-300">
            Build one <span className="font-mono text-sm">python-deps</span> layer with pinned pandas +
            pyarrow for all ingest Lambdas. Update the layer version; pin functions to layer version ARN
            for controlled rollouts. Keeps deployment ZIPs small (handler + business logic only).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Internal SDK layer">
          <p className="text-slate-300">
            Package <span className="font-mono text-sm">lake_utils</span> (S3 path helpers, Glue job
            starter, structured logging) as a layer consumed by dozens of pipeline functions. Same pattern
            as shared Python wheels on EC2 — but versioned through Lambda layer ARNs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Layer limits and cold starts">
          <p className="text-slate-300">
            Larger layers increase download/unpack time on cold start. Split rarely-used ML libs into a
            separate layer attached only to functions that need them. Monitor InitDuration in CloudWatch
            after layer changes.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="/tmp for ETL scratch">
        <ContentStep number={1} title="Download-transform-upload">
          <p className="text-slate-300">
            Handler streams landing gzip CSV from S3 to <span className="font-mono text-sm">/tmp/in.csv</span>,
            validates, writes <span className="font-mono text-sm">/tmp/out.parquet</span>, uploads to raw/.
            Increase /tmp to 2–4 GB when single files approach hundreds of MB uncompressed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cleanup on warm reuse">
          <p className="text-slate-300">
            Warm containers reuse /tmp — a previous invocation&apos;s leftover 3 GB file can cause the
            next run to fail with no space left. Always unlink temp paths in{' '}
            <span className="font-mono text-sm">finally</span>; never assume a fresh /tmp per invoke.
          </p>
        </ContentStep>
        <Callout variant="insight">
          If working set exceeds 10 GB or needs durable disk across invocations, Lambda is the wrong tool —
          hand off to Glue, EC2, or Fargate.
        </Callout>
      </LessonSection>

      <LessonSection title="Reserved vs Provisioned concurrency">
        <Definition term="Account concurrency">
          <p>
            By default each region has a soft limit (~1,000 concurrent executions per account). Each
            invoke consumes one concurrent execution until it finishes. Burst S3 landing can exhaust the
            pool — remaining invocations throttle with 429.
          </p>
        </Definition>
        <ContentStep number={1} title="Reserved concurrency">
          <p className="text-slate-300">
            <strong className="text-white">Reserved concurrency</strong> sets a maximum (and minimum
            guarantee) for one function. Example: reserve 50 for{' '}
            <span className="font-mono text-sm">ingest-vendor-a</span> so a runaway dev test Lambda
            cannot starve production ingest. Also caps the function — it cannot burst above its reservation.
            Plain English: &quot;This pipeline gets at most 50 slots; nothing else can steal them, but it
            also cannot use more than 50.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Provisioned concurrency">
          <p className="text-slate-300">
            <strong className="text-white">Provisioned concurrency</strong> keeps N execution environments
            initialized and ready — eliminates cold starts for that count. You pay for provisioned capacity
            even when idle. Plain English: &quot;Keep 10 workers warmed up 24/7 for sub-second API latency.&quot;
            Rare for batch ETL; consider for synchronous API-facing validators on critical paths.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE tuning guidance">
          <p className="text-slate-300">
            Batch ingest: usually neither — rely on SQS buffer + account pool. Reserve concurrency on
            production ingest to protect from noisy neighbors. Avoid provisioned concurrency unless SLA
            demands low tail latency on sync APIs.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Layers package shared dependencies (pandas, pyarrow, internal SDKs) — keep handler ZIPs small; watch cold-start impact.',
          '/tmp is ephemeral scratch disk (512 MB–10 GB) — download S3, write temp files, always clean up on warm reuse.',
          'Reserved concurrency guarantees + caps executions for one function — protects critical ingest from account-wide bursts.',
          'Provisioned concurrency pre-warms environments — reduces cold starts; costs money while idle; rare for batch DE.',
          'Oversized working set or disk needs → move work to Glue/EC2 instead of maxing Lambda limits.',
        ]}
      />
    </LessonArticle>
  )
}
