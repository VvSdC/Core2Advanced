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

export function GlueJobsIntro() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Jobs are where transforms happen">
        Crawlers discover schema; <strong className="text-white">Glue Jobs</strong> execute your ETL logic.
        A job is a managed Spark or Python Shell run that reads from S3, JDBC, or the catalog, applies
        transforms, and writes curated output — the workhorse of lake pipelines between raw landing and
        Athena-ready tables.
      </Callout>

      <Definition term="Glue ETL Job">
        <p>
          A <strong className="text-white">Glue ETL Job</strong> is a serverless execution of a script you
          provide — typically PySpark — on AWS-managed Spark workers. Each{' '}
          <strong className="text-white">job run</strong> is one invocation with its own logs, metrics,
          bookmark state, and billing. Jobs are configured with IAM roles, worker type and count, timeout,
          Glue version, connections to VPC sources, and optional job parameters passed at runtime.
        </p>
      </Definition>

      <LessonSection title="Glue Job lifecycle — high level">
        <ContentStep number={1} title="Configure the job">
          <p className="text-slate-300">
            Name, script location in S3 (or inline in Studio), IAM role, worker settings, connections, default
            arguments — saved as a reusable job definition in the Glue console or IaC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Start a run">
          <p className="text-slate-300">
            Manual click, cron trigger, EventBridge rule, Step Functions task, or Lambda calling{' '}
            <code className="text-core-400">glue:StartJobRun</code> — each run gets a unique JobRunId for
            logs and debugging.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Provision workers and execute">
          <p className="text-slate-300">
            Glue allocates Spark executors per worker settings, runs your script, writes outputs to S3 and/or
            catalog, then releases capacity when the script finishes or times out.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Observe and chain">
          <p className="text-slate-300">
            CloudWatch logs under <code className="text-core-400">/aws-glue/jobs/</code>, job run status in
            console, SNS on failure — downstream Athena QA or Redshift COPY waits on SUCCEEDED state.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue Job run flow"
          chart={`flowchart LR
  TRIG[Schedule EventBridge Lambda]
  TRIG --> START[StartJobRun]
  START --> PROV[Provision Spark workers]
  PROV --> RUN[Execute PySpark script]
  RUN --> OUT[Write S3 and catalog]
  OUT --> LOG[CloudWatch logs metrics]
  LOG --> NEXT[Athena QA or COPY]`}
        />
      </LessonSection>

      <LessonSection title="Job types — Spark, PySpark, Python Shell">
        <p className="text-slate-300">
          Glue supports multiple job command types. Data engineers spend most time on Spark ETL; Python Shell
          covers lighter scripts.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Runtime</th>
                <th className="px-4 py-3">Typical DE use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Spark / PySpark ETL',
                  'Distributed Apache Spark — DynamicFrame and DataFrame APIs',
                  'Large joins, aggregations, JSON flattening, raw-to-curated Parquet, JDBC parallel reads',
                ],
                [
                  'Python Shell',
                  'Single-node Python 3 — no Spark cluster',
                  'Small file copies, lightweight pandas-style transforms, calling APIs, orchestration glue under size limits',
                ],
                [
                  'Spark streaming (advanced)',
                  'Spark Structured Streaming on Glue',
                  'Near-real-time micro-batch from Kinesis or Kafka — separate track from beginner batch ETL',
                ],
              ].map(([type, runtime, use]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{runtime}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="PySpark — default for lake ETL">
          <p className="text-slate-300">
            Your script imports <code className="text-core-400">awsglue.context.GlueContext</code>, builds
            Spark and Glue contexts, reads DynamicFrames, transforms, and writes with catalog-aware sinks.
            Familiar if you know Spark; Glue adds bookmarks and native S3/catalog integration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Python Shell — right-sized workloads">
          <p className="text-slate-300">
            Max memory and runtime limits make Python Shell suitable for modest data volumes — not terabyte
            shuffles. Good for maintenance tasks that do not justify Spark startup overhead.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scala Spark (supported)">
          <p className="text-slate-300">
            Less common in DE teams who standardize on Python — same Spark engine, different language binding.
            PySpark dominates AWS DE examples and hiring interviews.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What a minimal PySpark job conceptually does">
        <Example title="PySpark job skeleton" caption="Conceptual — not a full production script">
{`from awsglue.context import GlueContext
from awsglue.job import Job
from pyspark.context import SparkContext

sc = SparkContext()
glueContext = GlueContext(sc)
spark = glueContext.spark_session
job = Job(glueContext)
job.init("de-orders-raw-to-curated", args)

# Read raw JSON from catalog or S3
dyf = glueContext.create_dynamic_frame.from_catalog(
    database="de_lake_dev", table_name="raw_orders")

# Transform (filter, map, join — details in later lessons)
# ...

# Write curated Parquet and update catalog partitions
glueContext.write_dynamic_frame.from_options(
    frame=curated_dyf,
    connection_type="s3",
    connection_options={"path": "s3://acme-lake/curated/orders/"},
    format="parquet")

job.commit()  # persists bookmark if enabled`}
        </Example>
        <Callout variant="tip" title="Script storage">
          Production scripts live in S3 — e.g.{' '}
          <code className="text-core-400">s3://acme-glue-scripts/orders_raw_to_curated.py</code> — versioned
          alongside Terraform or CI/CD. The job definition points at that key; redeploy script, next run picks
          up changes.
        </Callout>
      </LessonSection>

      <LessonSection title="Job configuration essentials">
        <ContentStep number={1} title="IAM role">
          <p className="text-slate-300">
            Job role needs S3 read/write on source and sink prefixes, catalog permissions, and optionally
            Secrets Manager plus EC2 network interface permissions for VPC JDBC connections to RDS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Connections">
          <p className="text-slate-300">
            Glue Connection stores JDBC URL, subnet, and security groups for RDS in private VPC. Job references
            connection name when reading from operational databases — same pattern as DMS source endpoints.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Job parameters">
          <p className="text-slate-300">
            Pass runtime values — <code className="text-core-400">--run_date</code>,{' '}
            <code className="text-core-400">--env</code> — without editing script per environment. Step
            Functions often inject partition dates on each nightly run.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Timeout and retries">
          <p className="text-slate-300">
            Set max duration to fail fast on hung shuffles; configure CloudWatch alarms on FAILED status.
            Idempotent writes and bookmarks help safe retries without duplicate facts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Jobs in the medallion pipeline">
        <p className="text-slate-300">
          Typical naming and responsibility split across lake zones:
        </p>
        <ContentStep number={1} title="Bronze ingest job">
          <p className="text-slate-300">
            Land API or file drops with minimal change — maybe compression and audit columns — catalog table{' '}
            <code className="text-core-400">raw_events</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Silver curation job">
          <p className="text-slate-300">
            Clean types, dedupe by key, join reference data — output partitioned Parquet{' '}
            <code className="text-core-400">curated_events</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Gold aggregation job">
          <p className="text-slate-300">
            Daily rollups for BI — smaller grain, optimized for Athena CTAS or Redshift COPY — optional fourth
            job or dbt-on-Athena depending on team standards.
          </p>
        </ContentStep>
        <Callout variant="insight">
          One monolithic &quot;do everything&quot; job is hard to debug. Chained jobs with clear inputs and
          outputs — each writing a catalog table — match how Step Functions and on-call runbooks are organized.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Jobs run serverless ETL scripts — mostly PySpark on managed Spark workers, one job run per invocation.',
          'Lifecycle: configure job → StartJobRun → workers execute script → write S3/catalog → logs in CloudWatch.',
          'PySpark for large distributed transforms; Python Shell for small single-node scripts under size limits.',
          'Jobs need IAM roles, optional JDBC Connections for RDS, and parameters for environment-specific runs — core of raw-to-curated lake pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
