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

export function EnvTimeoutMemory() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Knobs every DE function needs">
        Before your S3 trigger fires in production, three configuration settings determine whether the
        handler succeeds: <strong className="text-white">environment variables</strong> for non-secret
        config, <strong className="text-white">timeout</strong> for how long AWS waits, and{' '}
        <strong className="text-white">memory</strong> for RAM — which also scales CPU power. Wrong
        defaults cause silent timeouts mid-upload or over-provisioned GB-second bills.
      </Callout>

      <Definition term="Environment variables, timeout, and memory">
        <p>
          <strong className="text-white">Environment variables</strong> are key-value pairs injected
          into the runtime — bucket names, output prefixes, feature flags, Glue job names.{' '}
          <strong className="text-white">Timeout</strong> is the maximum seconds one invocation may run
          (1 second to 15 minutes). <strong className="text-white">Memory</strong> is MB allocated per
          invocation (128 MB to 10,240 MB); AWS proportionally increases CPU, so more memory often makes
          pandas and compression faster, not just larger heaps.
        </p>
      </Definition>

      <LessonSection title="Environment variables">
        <ContentStep number={1} title="What belongs in env vars">
          <p className="text-slate-300">
            Non-sensitive pipeline config: <code className="text-core-400">OUTPUT_BUCKET</code>,{' '}
            <code className="text-core-400">OUTPUT_PREFIX=processed/orders/</code>,{' '}
            <code className="text-core-400">GLUE_JOB_NAME=sales-daily</code>,{' '}
            <code className="text-core-400">LOG_LEVEL=INFO</code>. Read with{' '}
            <code className="text-core-400">os.environ[&quot;OUTPUT_BUCKET&quot;]</code> so the same code
            deploys to dev and prod with different Console settings.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What does not belong">
          <p className="text-slate-300">
            Database passwords, API keys, and private tokens — use Secrets Manager or SSM Parameter Store
            and fetch at runtime with the execution role. Env vars appear in Console, CloudFormation, and
            some audit exports; treat them as visible to anyone with Lambda read access.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Per-environment pattern">
          <p className="text-slate-300">
            Dev function points env vars at <code className="text-core-400">company-lake-dev</code>; prod
            alias uses <code className="text-core-400">company-lake-prod</code>. Same zip artifact, different
            configuration — standard IaC practice before you have twelve copy-pasted functions.
          </p>
        </ContentStep>
        <Example title="Handler reading env config" caption="No secrets in os.environ">
{`import os

OUTPUT_BUCKET = os.environ["OUTPUT_BUCKET"]
OUTPUT_PREFIX = os.environ.get("OUTPUT_PREFIX", "processed/")

def lambda_handler(event, context):
    # Use OUTPUT_BUCKET when writing transformed objects
    ...`}
        </Example>
      </LessonSection>

      <LessonSection title="Timeout">
        <ContentStep number={1} title="Hard stop at the limit">
          <p className="text-slate-300">
            When timeout elapses, AWS freezes the invocation — your handler does not get a graceful
            Python finally block guarantee. Partial S3 writes or open transactions may leave inconsistent
            state unless you design checkpoints and idempotent output keys.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE starting points">
          <p className="text-slate-300">
            Header validation on small CSV: 30–60 seconds. Download + light pandas transform on megabyte
            files: 2–5 minutes. Anything approaching 15 minutes is a signal to move work to Glue or split
            into Step Functions with multiple Lambdas.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Watch REPORT lines">
          <p className="text-slate-300">
            CloudWatch REPORT logs show <code className="text-core-400">Duration</code> vs configured
            timeout. If duration consistently exceeds 80% of timeout, increase timeout or optimize —
            do not wait for production failures during a large backfill.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Combine with context remaining time">
          Check <code className="text-core-400">context.get_remaining_time_in_millis()</code> before
          starting a second large download in the same invocation — fail fast with a clear error so async
          retry can continue on a fresh invocation.
        </Callout>
      </LessonSection>

      <LessonSection title="Memory and CPU">
        <ContentStep number={1} title="Memory affects more than RAM">
          <p className="text-slate-300">
            AWS allocates CPU power in proportion to memory. A 512 MB function may run CPU-bound work
            (gzip, JSON parsing) slower than the same code at 1,769 MB or 3,008 MB — sometimes finishing
            faster <em>and</em> cheaper in GB-seconds despite higher memory rate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Right-sizing for DE workloads">
          <p className="text-slate-300">
            Pure boto3 copy/head/metadata: start 256–512 MB. pandas on modest files: 1,024–3,008 MB.
            pyarrow Parquet writes: test with increasing memory until duration stops shrinking — plot
            duration × memory in a spreadsheet from CloudWatch metrics.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Out-of-memory failures">
          <p className="text-slate-300">
            Exceeding allocated memory kills the invocation immediately. Loading a 2 GB CSV into pandas
            on a 512 MB function will not swap to disk — it will crash. Stream reads, chunk processing,
            or move heavy jobs off Lambda.
          </p>
        </ContentStep>
        <Flowchart
          title="Tune memory and timeout loop"
          chart={`flowchart TD
  D[Deploy with conservative defaults]
  D --> T[Run realistic S3 test files]
  T --> M{OOM or timeout?}
  M -->|OOM| UP[Increase memory]
  M -->|Timeout| UT[Increase timeout or optimize code]
  M -->|Neither| C{Duration stable?}
  C -->|Yes| DONE[Lock config in IaC]
  C -->|Slow CPU| UP
  UP --> T
  UT --> T`}
        />
        <Example title="DE sizing cheat sheet" caption="Starting points — measure in your account">
{`Task                              Memory    Timeout
S3 head + metadata log            256 MB    30 s
Validate CSV headers only         512 MB    1 min
JSON → Parquet single part        1024 MB   3 min
pandas clean 100 MB file          3008 MB   5 min
Start Glue job (orchestration)    256 MB    1 min`}
        </Example>
        <Callout variant="insight">
          Billing uses GB-seconds: doubling memory doubles the memory component but halving duration can
          break even or save money. Data engineers should treat memory as a performance dial, not only a
          heap size setting.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Env vars for bucket names, prefixes, job names — never secrets; use Secrets Manager for credentials.',
          'Timeout max 15 minutes — set from realistic file sizes; use REPORT logs and remaining time checks.',
          'Memory scales CPU too — test higher memory for pandas/compression; OOM means increase or refactor.',
          'DE workflow: conservative deploy → test with real S3 objects → tune memory/timeout → lock in IaC.',
        ]}
      />
    </LessonArticle>
  )
}
