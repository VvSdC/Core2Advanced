import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GlueInMedallionArchitecture() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue is the workhorse between bronze, silver, and gold">
        Medallion architecture layers raw, cleaned, and business-ready data on S3.{' '}
        <strong className="text-white">AWS Glue</strong> crawlers catalog bronze, Spark jobs promote to silver
        Parquet, and aggregate jobs build gold marts — all registered in one Glue Data Catalog for Athena
        and Redshift Spectrum.
      </Callout>

      <Definition term="Medallion architecture">
        <p>
          <strong className="text-white">Bronze</strong> — immutable raw landing as-ingested.{' '}
          <strong className="text-white">Silver</strong> — cleaned, typed, deduped, conformed entities.{' '}
          <strong className="text-white">Gold</strong> — business aggregates and star schemas for BI. Each
          layer is separate S3 prefixes (or buckets) with tightening schema contracts and quality rules.
        </p>
      </Definition>

      <LessonSection title="Bronze with Glue">
        <ContentStep number={1} title="Ingest and catalog">
          <p className="text-slate-300">
            Landing from DMS, Firehose, vendor SFTP, or API dumps to{' '}
            <span className="font-mono text-sm">s3://lake/bronze/{'{source}'}/</span>. Crawler or explicit
            DDL registers raw tables — preserve source fidelity, including bad rows, for replay. Minimal
            transform: optional metadata columns (ingest_ts, source_file).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partitioning bronze">
          <p className="text-slate-300">
            Partition by ingest date or business date even at bronze — eases incremental silver jobs and
            quarantine scoped to one day. Avoid destructive edits; append new files or version by folder.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Silver transforms with Glue">
        <ContentStep number={1} title="Standardization">
          <p className="text-slate-300">
            Glue Spark: ResolveChoice, ApplyMapping, DropFields (PII), Join dims, dedupe by primary key,
            write Snappy Parquet to{' '}
            <span className="font-mono text-sm">s3://lake/silver/</span>. Data Quality rules enforce
            completeness and uniqueness. Bookmarks or CDC drive incremental silver updates.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Entity-centric tables">
          <p className="text-slate-300">
            One silver table per conformed entity — customers, orders, events — not one mega table per source.
            Multiple bronze sources merge in silver with survivorship rules. Catalog documents owner and SLA.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compact and optimize">
          <p className="text-slate-300">
            Scheduled compaction job on silver partitions — coalesce small files, enforce 128–512 MB targets.
            Silver is where Athena cost optimization pays off for all downstream consumers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Gold transforms with Glue">
        <ContentStep number={1} title="Business marts">
          <p className="text-slate-300">
            Read silver via catalog; groupBy metrics — daily revenue, funnel counts, cohort retention. Write
            gold to dedicated prefix or schema. Narrow column sets, pre-joined for BI — may fan out to many
            mart tables from same silver base.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Gold vs Athena CTAS">
          <p className="text-slate-300">
            Heavy multi-table gold with complex Spark logic → Glue job in workflow. Analyst-owned lightweight
            aggregates → Athena CTAS on silver. Production executive KPIs usually Glue-orchestrated with tests;
            ad hoc exploration stays Athena.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serve layer handoff">
          <p className="text-slate-300">
            Gold Parquet on S3 feeds Athena, QuickSight SPICE, or COPY into Redshift for low-latency dashboards.
            Glue does not replace warehouse — it produces gold files the serve layer loads or queries.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Medallion flowchart">
        <Flowchart
          title="Glue across bronze → silver → gold"
          chart={`flowchart TB
  SRC[Sources RDS API files streams]
  BRZ[S3 bronze raw]
  CRAWL[Glue crawler catalog bronze]
  SILJOB[Glue silver ETL]
  DQ[Data Quality gate]
  SIL[S3 silver Parquet typed]
  GLDJOB[Glue gold aggregates]
  GOLD[S3 gold marts]
  CAT[Glue Data Catalog]
  ATH[Athena ad hoc]
  RS[Redshift COPY serve]
  SRC --> BRZ
  BRZ --> CRAWL
  CRAWL --> CAT
  BRZ --> SILJOB
  SILJOB --> DQ
  DQ --> SIL
  SIL --> CAT
  SIL --> GLDJOB
  GLDJOB --> GOLD
  GOLD --> CAT
  CAT --> ATH
  GOLD --> RS`}
        />
        <Callout variant="tip">
          Name jobs and workflows by layer: <span className="font-mono text-sm">silver_orders_daily</span>,{' '}
          <span className="font-mono text-sm">gold_revenue_mart</span> — Cost Explorer and on-call runbooks
          map cleanly to medallion tiers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Bronze: immutable raw on S3 + catalog — crawl or DDL, partition by date, minimal transform.',
          'Silver: Glue Spark cleanses, types, dedupes, drops PII — Snappy Parquet + Data Quality gates.',
          'Gold: business aggregates from silver — Glue for heavy marts; Athena CTAS for light analyst builds.',
          'One Glue Data Catalog spans layers — Athena explores; Redshift COPY serves hot gold.',
          'Workflows chain bronze→silver→gold with conditional triggers and quarantine on quality fail.',
        ]}
      />
    </LessonArticle>
  )
}
