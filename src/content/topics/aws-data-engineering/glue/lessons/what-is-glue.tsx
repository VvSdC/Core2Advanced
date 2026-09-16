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

export function WhatIsGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        AWS Glue is AWS&apos;s managed{' '}
        <strong className="text-white">serverless ETL service</strong> for data lakes. Instead of standing up
        Spark clusters on EC2 or EMR yourself — installing Hadoop, tuning executors, patching AMIs — you
        write a script (usually PySpark), define workers and connections, and Glue runs the job on demand.
        It also hosts the <strong className="text-white">Glue Data Catalog</strong>, the metadata layer Athena
        and Redshift Spectrum read when they query S3.
      </Callout>

      <Definition term="AWS Glue">
        <p>
          <strong className="text-white">AWS Glue</strong> is a fully managed extract, transform, and load
          service designed for analytics workloads on Amazon S3. It combines a serverless Spark runtime
          (Glue Jobs), schema discovery (Glue Crawlers), a centralized Hive-compatible metastore (Glue Data
          Catalog), connection management for JDBC and other sources, and optional visual ETL (Glue Studio).
          You pay primarily for crawler runs and job DPU-minutes — not for idle cluster capacity.
        </p>
      </Definition>

      <LessonSection title="Serverless ETL — what that means for DE">
        <p className="text-slate-300">
          <strong className="text-white">ETL</strong> is extract (read from sources), transform (clean, join,
          aggregate), load (write to destinations). <strong className="text-white">Serverless</strong> means
          AWS provisions and releases compute for each job run — you do not SSH into a long-lived Spark master
          or resize an EMR cluster at 2 a.m.
        </p>
        <ContentStep number={1} title="Job-based billing">
          <p className="text-slate-300">
            A Glue job run spins up Spark workers for the duration of your script, then stops. Cost scales
            with worker type, worker count, and runtime — ideal for nightly batch and event-driven transforms,
            not 24/7 streaming (that is Kinesis, Flink, or managed streaming elsewhere).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Managed Spark runtime">
          <p className="text-slate-300">
            Glue ships with Apache Spark, PySpark, and Glue-specific libraries (DynamicFrame, bookmarks,
            built-in transforms). You choose a Glue version (Spark 3.x line) — AWS maintains the runtime;
            you maintain the script and IAM permissions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integrated with the AWS lake stack">
          <p className="text-slate-300">
            Jobs read and write S3 natively, assume IAM roles for least-privilege access, use Glue
            Connections for VPC JDBC to RDS, and write catalog entries Athena queries the same hour — no
            separate metastore to sync manually in the default setup.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue in the lake analytics stack"
          chart={`flowchart TB
  SRC[RDS JDBC S3 raw APIs]
  SRC --> GLUE[Glue Jobs ETL]
  GLUE --> S3[S3 curated Parquet]
  GLUE --> CAT[Glue Data Catalog]
  CAT --> ATH[Athena SQL]
  CAT --> RS[Redshift Spectrum]
  S3 --> RS2[Redshift COPY]
  RS2 --> BI[BI dashboards]`}
        />
      </LessonSection>

      <LessonSection title="Glue architecture — main components">
        <p className="text-slate-300">
          Glue is not a single binary — it is a set of services that work together. Data engineers touch
          these components daily; knowing names and boundaries prevents &quot;I fixed the job but Athena
          still shows old schema&quot; confusion.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">Role in DE pipelines</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Data Catalog',
                  'Stores databases, tables, columns, partitions — the metastore Athena, Spectrum, and jobs reference',
                ],
                [
                  'Crawlers',
                  'Scan S3, JDBC, DynamoDB, etc. and infer or update table definitions in the catalog',
                ],
                [
                  'ETL Jobs',
                  'Run PySpark or Python Shell scripts — the core transform engine for lake promotion',
                ],
                [
                  'Connections',
                  'Network and credential templates for JDBC (RDS), VPC endpoints, and compatible sources',
                ],
                [
                  'Triggers & Workflows',
                  'Schedule or chain crawlers and jobs — cron, on-demand, or event-driven orchestration',
                ],
                [
                  'Studio / Notebook',
                  'Visual DAG editor and interactive Spark for prototyping transforms before production scripts',
                ],
                [
                  'Data Quality (optional)',
                  'Rules and evaluations on datasets — row counts, uniqueness, range checks in pipeline gates',
                ],
              ].map(([component, role]) => (
                <tr key={component} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{component}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Catalog is central">
          <p className="text-slate-300">
            Every other Glue feature either writes to or reads from the Data Catalog. A job that outputs
            Parquet without updating catalog metadata leaves Athena blind until a crawler or DDL run
            registers the new table or partition.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Jobs need IAM roles">
          <p className="text-slate-300">
            Glue assumes a service role and often a separate job role with S3, catalog, and connection
            permissions. This mirrors Lambda execution roles — misconfigured IAM is the top reason jobs
            fail with AccessDenied on the first S3 read.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Crawlers complement jobs">
          <p className="text-slate-300">
            Crawlers discover schema; jobs enforce business logic. Production gold tables often get explicit
            DDL from jobs rather than crawler-only inference — crawlers excel at bootstrap and drift detection.
          </p>
        </ContentStep>
        <Example title="Component responsibility drill" caption="Who does what?">
{`Scenario: New JSON files land in s3://lake/raw/events/ nightly

Crawler (optional): Infers columns, adds partitions to de_lake_dev.raw_events
Glue Job: Parses timestamps, drops PII fields, writes Parquet to s3://lake/curated/events/
Catalog: Holds de_lake_dev.curated_events with partition keys year, month, day
Athena: SELECT COUNT(*) WHERE year='2026' — reads catalog + S3 curated prefix
Step Functions (optional): Starts job after S3 event, waits, triggers Athena QA Lambda`}
        </Example>
      </LessonSection>

      <LessonSection title="What Glue manages vs what you manage">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">AWS manages</th>
                <th className="px-4 py-3">You manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Spark cluster provisioning and teardown per job run',
                  'Job script logic, transforms, and error handling',
                ],
                [
                  'Glue runtime versions and compatible Spark libraries',
                  'Choosing Glue version, worker type, and worker count for workload',
                ],
                [
                  'Crawler infrastructure and schema inference engine',
                  'Crawler schedules, S3 paths, and whether to update vs add tables',
                ],
                [
                  'Data Catalog storage and Hive-compatible API',
                  'Database/table naming, partition design, and DDL accuracy',
                ],
                [
                  'Integration APIs with Athena, Lake Formation, and EventBridge',
                  'IAM policies, VPC connections to RDS, and secrets in Secrets Manager',
                ],
              ].map(([aws, you], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3">{aws}</td>
                  <td className="px-4 py-3">{you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What Glue is not">
        <ContentStep number={1} title="Not a data warehouse">
          <p className="text-slate-300">
            Glue transforms and catalogs data on S3 — it does not serve concurrent BI queries like Redshift.
            Athena queries the output; Glue builds the output.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not real-time streaming ETL by default">
          <p className="text-slate-300">
            Standard Glue jobs are batch-oriented (minutes to hours). Micro-batch and streaming use other
            services or specialized Glue streaming features — batch lake promotion is the beginner focus.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a replacement for every Lambda function">
          <p className="text-slate-300">
            Small file renames or single-row validations fit Lambda. Heavy joins across terabytes of Parquet
            fit Glue Spark — choose the tool by data volume and transform complexity.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Glue is the managed ETL and catalog tier in your mental model: RDS and APIs feed raw S3; Glue
          shapes and registers curated S3; Athena and Redshift consume — complementary to everything you
          learned in S3, IAM, Lambda, and RDS tracks.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AWS Glue is serverless managed ETL for data lakes — Spark jobs on demand plus a shared Data Catalog.',
          'Main components: Data Catalog, Crawlers, ETL Jobs, Connections, Triggers/Workflows, Studio.',
          'AWS manages Spark runtime and job infrastructure; you manage scripts, IAM, partition design, and catalog accuracy.',
          'Glue transforms and catalogs S3 data — it is not a warehouse or ad hoc SQL engine; Athena and Redshift query what Glue prepares.',
        ]}
      />
    </LessonArticle>
  )
}
