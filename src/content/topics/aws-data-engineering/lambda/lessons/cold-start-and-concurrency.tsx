import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ColdStartAndConcurrency() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="First invoke is slower — plan for it">
        When Lambda creates a new execution environment, your handler pays a{' '}
        <strong className="text-white">cold start</strong>: download deployment package, start runtime,
        run initialization code. Warm invocations reuse the container — much faster. For burst S3 landing
        or sync API validators, cold starts and <strong className="text-white">concurrency limits</strong>{' '}
        define tail latency and throttle behavior.
      </Callout>

      <Definition term="Cold start vs warm start">
        <p>
          A <strong className="text-white">cold start</strong> occurs when no idle execution environment
          exists for your function — AWS provisions one, mounts layers, runs the runtime bootstrap, then
          executes your handler (and any top-level module imports). A <strong className="text-white">warm
          start</strong> reuses an existing environment: only handler code runs. CloudWatch reports{' '}
          <span className="font-mono text-sm">InitDuration</span> separately from{' '}
          <span className="font-mono text-sm">Duration</span> on cold invocations.
        </p>
      </Definition>

      <LessonSection title="What drives cold start latency">
        <ContentStep number={1} title="Runtime and package size">
          <p className="text-slate-300">
            Python 3.12 with pandas + pyarrow layers adds seconds of import time. Slim deployment ZIPs,
            lazy imports inside handler, and splitting heavy libs to functions that truly need them reduce
            InitDuration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC-attached functions">
          <p className="text-slate-300">
            Functions in a VPC create ENIs for private RDS/Redshift access — cold starts often add 5–15+
            seconds. Avoid VPC unless required; use RDS Proxy, public endpoints with security groups, or
            data API patterns when possible.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Provisioned concurrency">
          <p className="text-slate-300">
            Pre-initialized environments eliminate cold starts up to the provisioned count — at ongoing
            cost. Justified for latency-sensitive sync APIs; overkill for async batch ingest with SQS
            buffering.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concurrency and throttling">
        <Definition term="Concurrent executions">
          <p>
            Each in-flight invocation consumes one concurrent execution slot in the account/region. Default
            soft limit ~1,000 (request increase via support). When all slots are busy, new sync invokes
            return <span className="font-mono text-sm">429 TooManyRequestsException</span>; async invokes
            queue until capacity frees or throttle.
          </p>
        </Definition>
        <ContentStep number={1} title="Burst landing scenario">
          <p className="text-slate-300">
            5,000 S3 PUTs in one minute → 5,000 async Lambda attempts. Without SQS buffer, account
            concurrency saturates; excess events retry or fail. SQS + ESM caps effective parallelism to
            batch size × concurrent batches — predictable load on downstream Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reserved concurrency tradeoff">
          <p className="text-slate-300">
            Reserving 200 for ingest guarantees capacity but subtracts 200 from the unreserved pool for
            other functions. Over-reserving starves dev/test Lambdas in the same account.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Monitoring">
          <p className="text-slate-300">
            Watch <span className="font-mono text-sm">ConcurrentExecutions</span>,{' '}
            <span className="font-mono text-sm">Throttles</span>, and{' '}
            <span className="font-mono text-sm">UnreservedConcurrentExecutions</span> in CloudWatch.
            Alarm on throttles during landing windows — signals need for SQS, higher limit, or reserved
            capacity.
          </p>
        </ContentStep>
        <Flowchart
          title="Concurrency under burst load"
          chart={`flowchart TB
  BURST[5000 S3 events]
  BURST --> DIRECT[Direct Lambda invoke]
  BURST --> BUFFER[SQS buffer plus ESM]
  DIRECT --> THROT[Account throttle 429]
  BUFFER --> BATCH[Controlled batch invoke]
  BATCH --> GLUE[Glue job starts]`}
        />
      </LessonSection>

      <LessonSection title="Idempotency for retries">
        <ContentStep number={1} title="Why retries duplicate work">
          <p className="text-slate-300">
            Async invoke retries, SQS visibility timeout redelivery, and at-least-once S3 notifications
            mean the same file may hit your handler twice. Without idempotency, you double-write curated
            partitions or start duplicate Glue runs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency patterns">
          <p className="text-slate-300">
            Use S3 object ETag + key as dedupe key in DynamoDB conditional write. Write output to
            deterministic path <span className="font-mono text-sm">raw/vendor=foo/date=2026-03-15/file.parquet</span>{' '}
            — overwrite is safe. Pass Glue <span className="font-mono text-sm">JobRunId</span> from
            idempotency token so duplicate StartJobRun calls are detectable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partial failure in batches">
          <p className="text-slate-300">
            SQS partial batch response: return failed message IDs only so successful records are not
            reprocessed. Track per-record status in structured logs for replay audits.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview answer: &quot;At-least-once delivery is guaranteed — I design handlers to be idempotent
          using deterministic S3 keys, DynamoDB dedupe tables, and Glue job bookmarks downstream.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cold start = new execution environment (InitDuration); warm = reused container — slim packages and lazy imports help.',
          'VPC Lambda adds ENI setup latency — only attach when private resource access requires it.',
          'Account concurrent execution limit throttles burst invokes — SQS buffering smooths S3 landing spikes.',
          'Reserved concurrency protects critical functions but reduces the shared pool — tune deliberately.',
          'Retries are at-least-once — idempotent writes, dedupe keys, and partial batch failure handling prevent duplicate ETL.',
        ]}
      />
    </LessonArticle>
  )
}
