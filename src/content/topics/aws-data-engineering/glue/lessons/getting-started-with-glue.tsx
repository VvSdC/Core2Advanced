import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Glue after RDS in the DE path">
        You know how RDS holds live OLTP rows — orders, customers, inventory — and how DE extracts those
        rows to S3 for analytics. The next question every data engineer asks is:{' '}
        <strong className="text-white">who transforms raw lake files into curated Parquet and registers
        schema so Athena and Redshift can query them?</strong> In most AWS platforms, the answer is{' '}
        <strong className="text-white">AWS Glue</strong> — the serverless ETL service that crawls S3,
        runs Spark jobs, and maintains the Glue Data Catalog your lake engines share.
      </Callout>

      <Definition term="What is Glue in a DE pipeline?">
        <p>
          <strong className="text-white">AWS Glue</strong> is a fully managed extract, transform, and load
          (ETL) service built for data lakes on S3. It provides a{' '}
          <strong className="text-white">Data Catalog</strong> (Hive-compatible metadata),{' '}
          <strong className="text-white">crawlers</strong> that discover schema and partitions from files,
          and <strong className="text-white">jobs</strong> that run PySpark or Python Shell scripts to clean,
          join, and reshape data. For data engineering, Glue is typically the{' '}
          <strong className="text-white">transform and catalog layer</strong> between raw landing zones and
          curated tables Athena validates and Redshift COPYs.
        </p>
        <p className="mt-2 text-slate-300">
          Think of Glue as{' '}
          <span className="text-core-400">the ETL engine that turns messy lake files into queryable,
          partitioned datasets with shared metadata</span>.
        </p>
      </Definition>

      <LessonSection title="Extract → transform → catalog — why order matters">
        <p className="text-slate-300">
          RDS lessons taught you the OLTP source: apps write rows, DE extracts to S3 bronze. Glue is the
          mirror step on the lake side — not querying for BI, but{' '}
          <strong className="text-white">building the curated layer</strong> analysts and warehouses consume.
          Learning RDS first gives you the origin; Glue explains how raw exports become reliable tables.
        </p>
        <ContentStep number={1} title="RDS / DMS / export — data arrives in S3">
          <p className="text-slate-300">
            JDBC extracts, snapshot exports, or CDC streams land CSV, JSON, or Parquet in a raw prefix —
            durable, replayable, but often schema-loose and unpartitioned.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue Job — clean, type, partition">
          <p className="text-slate-300">
            Spark ETL reads raw paths, applies business rules, writes curated Parquet with hive-style
            partitions like <code className="text-core-400">year=2026/month=03/</code>, and optionally
            updates catalog entries.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Catalog + Athena / Redshift — consume">
          <p className="text-slate-300">
            Glue Data Catalog registers databases and tables. Athena runs QA SQL; Redshift COPY or Spectrum
            loads or joins the same S3 layout — one metadata source, multiple engines.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: RDS is where business data is born; Glue is where DE shapes it for the lake.
          Without Glue (or equivalent Spark on EMR), raw S3 folders stay opaque to SQL engines.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build Glue in layers so Spark internals, job bookmarks, and workflow orchestration do not
          overwhelm you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — catalog and vocabulary">
          <p className="text-slate-300">
            Understand what Glue is, how the Data Catalog maps databases and tables to S3, and core terms —
            crawler, job, DynamicFrame, bookmark, worker — enough to read a pipeline diagram.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Crawlers and jobs">
          <p className="text-slate-300">
            Learn how crawlers discover schema and partitions from S3, and how Glue jobs run PySpark or
            Python Shell scripts with IAM roles and connections to JDBC sources like RDS.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Transforms and lake patterns">
          <p className="text-slate-300">
            DynamicFrame vs DataFrame, job bookmarks for incremental processing, worker sizing, and writing
            curated Parquet — the patterns that separate one-off scripts from production ETL.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Workflows and advanced integration (next module)">
          <p className="text-slate-300">
            After this beginner pass: Glue Workflows and triggers, Studio visual ETL, Lake Formation
            permissions, JDBC connection pooling, and orchestration with Step Functions and EventBridge.
          </p>
        </ContentStep>
        <Flowchart
          title="Glue sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is Glue]
  B --> C[Data Catalog basics]
  C --> D[Crawlers intro]
  D --> E[Glue Jobs intro]
  E --> F[DynamicFrame vs DataFrame]
  F --> G[Bookmarks and workers]
  G --> H[Putting it together beginner]
  H --> I[Transforms workflows JDBC — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Data Catalog',
                  'The Hive-compatible metastore — databases, tables, columns, partitions — shared by Glue, Athena, and Redshift Spectrum',
                ],
                [
                  'Crawler',
                  'A scheduled or on-demand scan of a data store (usually S3) that infers schema and registers or updates tables in the catalog',
                ],
                [
                  'Job',
                  'A Glue ETL run — PySpark or Python Shell script — that reads sources, transforms data, and writes outputs (often S3 Parquet)',
                ],
                [
                  'DynamicFrame',
                  'Glue\'s Spark abstraction for semi-structured data — handles nested JSON and schema variations better than a plain DataFrame at ingest',
                ],
                [
                  'Bookmark',
                  'Job state that tracks which S3 files or JDBC rows were already processed — enables incremental runs instead of full reprocessing',
                ],
                [
                  'Worker',
                  'A unit of compute capacity for a Glue job — type (G.1X, G.2X, etc.) and count determine parallelism and memory for Spark executors',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and purpose in identifiers:{' '}
          <code className="text-core-400">de-glue-orders-raw-to-curated-dev</code> or{' '}
          <code className="text-core-400">de-crawler-bronze-events-prod</code>. Clear names help when
          Step Functions chains twelve job runs and you need to know which one writes to the gold prefix.
        </Callout>
      </LessonSection>

      <LessonSection title="How Glue fits after RDS in a pipeline">
        <p className="text-slate-300">
          The e-commerce app writes orders to RDS Postgres. A nightly DMS or export task lands JSON in{' '}
          <code className="text-core-400">s3://acme-lake/raw/orders/</code>. A Glue job reads that prefix,
          flattens nested line items, writes Parquet to{' '}
          <code className="text-core-400">s3://acme-lake/curated/orders/</code>, and updates the catalog.
          Athena confirms row counts; orchestration COPYs into Redshift{' '}
          <code className="text-core-400">analytics.fact_orders</code>.
        </p>
        <Flowchart
          title="S3 raw → Glue Job → S3 curated → Catalog → Athena/Redshift"
          chart={`flowchart LR
  RDS[RDS OLTP source]
  RDS --> RAW[S3 raw landing]
  RAW --> JOB[Glue ETL Job Spark]
  JOB --> CUR[S3 curated Parquet]
  JOB --> CAT[Glue Data Catalog]
  CAT --> ATH[Athena QA and explore]
  CUR --> RS[Redshift COPY or Spectrum]
  RS --> BI[Dashboards and reporting]`}
        />
        <Callout variant="insight">
          Mature platforms treat Glue as the default lake ETL — crawlers bootstrap schema, jobs enforce
          business rules and partitioning, and the catalog keeps Athena and Redshift aligned on the same
          table definitions.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about Glue">
        <ContentStep number={1} title="Serverless Spark without cluster ops">
          <p className="text-slate-300">
            You define a job script, worker type, and count; AWS provisions Spark executors for the run and
            tears them down when finished. No EMR cluster to patch or resize for nightly batch — pay for
            DPU-minutes per job run.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog is the lake's phone book">
          <p className="text-slate-300">
            Without catalog metadata, S3 is just keys. Glue registers which prefix holds which columns and
            partitions — Athena and Spectrum need that map before any SQL works.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Native fit for medallion architecture">
          <p className="text-slate-300">
            Bronze raw → silver cleaned → gold aggregated — each zone is an S3 prefix plus catalog tables.
            Glue jobs promote data between zones; bookmarks and partitions keep incremental loads efficient.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue follows RDS in the track — RDS is the OLTP source; Glue transforms raw S3 into curated, cataloged lake tables.',
          'Roadmap: catalog basics → crawlers and jobs → DynamicFrame and bookmarks → workflows and JDBC deep dives next.',
          'Core vocabulary: Data Catalog, crawler, job, DynamicFrame, bookmark, worker.',
          'Typical flow: S3 raw → Glue Job → S3 curated + catalog update → Athena QA / Redshift COPY — shared metadata across engines.',
        ]}
      />
    </LessonArticle>
  )
}
