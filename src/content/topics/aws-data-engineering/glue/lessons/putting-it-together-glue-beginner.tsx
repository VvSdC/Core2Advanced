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

export function PuttingItTogetherGlueBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before crawler and transform deep dives">
        You now know what Glue is, how the Data Catalog maps S3 to SQL metadata, what crawlers and jobs do,
        when DynamicFrame beats DataFrame, and how bookmarks and workers shape incremental production runs.
        This lesson ties those threads into a{' '}
        <strong className="text-white">beginner Glue checklist</strong> — the mental model you need before
        hands-on crawler configuration, PySpark transform libraries, JDBC connections to RDS, and Glue
        Workflows in a dev account.
      </Callout>

      <Definition term="Beginner lake ETL mental model">
        <p>
          A <strong className="text-white">beginner lake ETL mental model</strong> for DE includes: S3 raw
          prefix with landing files, Glue Data Catalog database and tables (crawler or DDL), a Glue Job concept
          that promotes raw to curated Parquet, shared catalog consumed by Athena for QA, awareness of
          DynamicFrame for messy ingest and bookmarks for nightly increments, plus IAM job roles with S3 and
          catalog permissions — all before production worker tuning, Lake Formation, and Step Functions
          orchestration chains.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Data lands in S3 raw">
          <p className="text-slate-300">
            RDS export, DMS CDC, API batch, or partner drop — files under a dedicated prefix like{' '}
            <code className="text-core-400">s3://acme-lake-dev/raw/orders/</code>, not mixed with curated or
            Athena scratch output.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog knows the raw table">
          <p className="text-slate-300">
            Crawler or DDL created <code className="text-core-400">de_lake_dev.raw_orders</code> with LOCATION
            matching the prefix — Athena can peek before any transform exists.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue Job transforms to curated">
          <p className="text-slate-300">
            PySpark job reads raw (DynamicFrame at bronze), cleans types, writes partitioned Parquet to{' '}
            <code className="text-core-400">s3://acme-lake-dev/curated/orders/</code>, registers{' '}
            <code className="text-core-400">curated_orders</code> in catalog.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Athena validates curated table">
          <p className="text-slate-300">
            Partition-filtered <code className="text-core-400">SELECT COUNT(*)</code> confirms nightly load —
            same catalog Athena lessons used, now fed by Glue instead of manual uploads only.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Optional Redshift COPY downstream">
          <p className="text-slate-300">
            Certified curated Parquet COPYs into warehouse marts — Glue built the file layout Redshift
            expects; Spectrum can query in place if full COPY is not needed yet.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner Glue → lake → query stack"
          chart={`flowchart TD
  RDS[RDS or file source]
  RDS --> RAW[S3 raw prefix]
  RAW --> CAT1[Catalog raw table]
  RAW --> JOB[Glue PySpark Job]
  JOB --> CUR[S3 curated Parquet]
  JOB --> CAT2[Catalog curated table]
  CAT2 --> ATH[Athena QA SQL]
  CUR --> RS[Redshift COPY optional]
  RS --> BI[Dashboards reporting]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — prove ETL metadata loop">
        <p className="text-slate-300">
          Glue is not real until raw files, job output, catalog entries, and Athena agree on one partition —
          not just reading about DynamicFrames.
        </p>
        <ContentStep number={1} title="Storage: raw JSON in S3">
          <p className="text-slate-300">
            DMS or export wrote <code className="text-core-400">s3://acme-lake-dev/raw/orders/dt=2026-09-16/</code>{' '}
            files — same RDS-to-lake path from the previous sub-topic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog: crawler on raw">
          <p className="text-slate-300">
            Crawler registered <code className="text-core-400">de_lake_dev.raw_orders</code> — analyst runs
            limited Athena SELECT to inspect schema before job hardens types.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Transform: Glue job run">
          <p className="text-slate-300">
            Job <code className="text-core-400">de-orders-raw-to-curated-dev</code> resolves schema, dedupes
            by <code className="text-core-400">order_id</code>, writes{' '}
            <code className="text-core-400">year=2026/month=09/day=16/</code> Parquet with bookmark enabled
            for next night.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Validation: Athena on curated">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT COUNT(*) FROM de_lake_dev.curated_orders WHERE year=&apos;2026&apos;
            AND month=&apos;09&apos; AND day=&apos;16&apos;;</code> — row count matches job log; SNS all-clear
            to stakeholders.
          </p>
        </ContentStep>
        <Example title="Beginner Glue drill checklist" caption="Dev-only — use sample or synthetic data">
{`1. S3 raw prefix contains landing files (JSON, CSV, or Parquet)
2. Glue database de_lake_dev exists
3. Crawler or DDL registered raw table with correct LOCATION
4. Glue job defined with IAM role, script in S3, at least 2 G.1X workers for dev
5. Job run SUCCEEDED — curated Parquet visible in S3 curated prefix
6. Catalog curated table exists with matching schema and partitions
7. Athena partition-filtered SELECT returns expected rows
8. Can explain: DynamicFrame at ingest, bookmark for next run, catalog links S3 to SQL`}
        </Example>
        <Callout variant="insight">
          Teams that skip catalog updates after jobs wonder why Athena returns zero rows on fresh Parquet.
          Teams that disable bookmarks re-scan entire raw history nightly. This checklist catches both before
          prod schedules and on-call pages.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is Glue in one sentence?">
          <p className="text-slate-300">
            AWS serverless ETL for data lakes — crawlers and jobs maintain catalog metadata and transform S3
            data for Athena and Redshift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog vs S3 files">
          <p className="text-slate-300">
            Catalog = metadata (database, table, columns, partitions). S3 = bytes. Job can write files without
            catalog update — Athena blind until crawler, DDL, or job sink registers table.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Crawler vs Job">
          <p className="text-slate-300">
            Crawler discovers schema and partitions; Job applies business transforms and writes curated output.
            Discovery vs transformation.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DynamicFrame vs DataFrame">
          <p className="text-slate-300">
            DynamicFrame for messy semi-structured ingest with schema flexibility; DataFrame for strict SQL
            transforms once schema is resolved — convert between them at pipeline boundaries.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Bookmark purpose">
          <p className="text-slate-300">
            Tracks already-processed source data so incremental job runs read only new files or rows — commit
            on success, idempotent sinks for retries.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Worker type and count in one line">
          <p className="text-slate-300">
            Worker type sets memory/CPU per Spark executor; count sets parallelism — G.1X default in dev,
            G.2X when OOM during joins.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the Glue track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Crawler deep dive">
          <p className="text-slate-300">
            Custom classifiers, table grouping strategies, crawler vs{' '}
            <code className="text-core-400">MSCK REPAIR</code>, scheduling with EventBridge, and keeping raw
            catalog sync when partner schemas drift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transforms and PySpark patterns">
          <p className="text-slate-300">
            Built-in DynamicFrame transforms, joins across catalog tables, JDBC parallel reads from RDS with
            Connections, writing partitioned Parquet with sink options, and data quality checks before
            promoting to gold.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue Workflows and orchestration">
          <p className="text-slate-300">
            Triggers chaining crawler → job → conditional Athena check, integration with Step Functions and
            Lambda starters, and failure notifications through SNS — the production scheduling layer above
            single manual job runs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Security, cost, and Lake Formation">
          <p className="text-slate-300">
            Fine-grained catalog permissions, column-level access for PII from RDS extracts, job cost
            optimization (bookmarks, worker right-sizing, Glue version upgrades), and cross-account catalog
            sharing for multi-account data mesh patterns.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          Glue connects everything you built so far: IAM grants job roles S3 and catalog access, S3 holds lake
          zones, RDS feeds raw extracts, Athena validates curated output, CloudWatch and SNS alert on FAILED
          job runs — Glue is the transform and catalog glue between source systems and query engines. Advanced
          Redshift, QuickSight, and pipeline modules assume you can explain raw → job → curated → catalog →
          Athena without looking up every console path.
        </p>
        <Callout variant="insight">
          Strong Glue beginners do not memorize every PySpark function on day one. They ask: where is raw data,
          what catalog tables point there, what job promotes to curated, and did catalog partitions update after
          the last run? Answer those four before Workflows, JDBC tuning, or Iceberg tables.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner checklist: S3 raw data, catalog raw table, Glue job to curated Parquet, catalog curated table, Athena partition-filtered validation.',
          'Prove end-to-end: bytes in S3, metadata in catalog, transform in Glue job, QA SQL in Athena — four layers, one pipeline.',
          'Next in Glue track: crawler deep dive, PySpark transforms and JDBC, Workflows orchestration, Lake Formation and cost tuning.',
          'Glue closes the loop after RDS — extract to S3, Glue shapes and registers, Athena and Redshift consume — the operable lake ETL minimum.',
        ]}
      />
    </LessonArticle>
  )
}
