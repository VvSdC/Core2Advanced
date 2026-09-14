import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RedshiftWithGlueAthenaS3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Redshift sits at the serve layer — Glue and S3 feed it, Athena explores beside it">
        A complete AWS DE stack rarely uses Redshift alone.{' '}
        <strong className="text-white">Glue</strong> transforms and catalogs curated Parquet on{' '}
        <strong className="text-white">S3</strong>; <strong className="text-white">Athena</strong> validates
        and ad hoc queries the same catalog; <strong className="text-white">Redshift</strong> COPYs or
        Spectrum-joins hot data for production BI. This lesson ties the integration patterns together.
      </Callout>

      <Definition term="Medallion + warehouse serve">
        <p>
          Landing/raw → Glue Spark ETL → curated Parquet with Hive partitions → Glue Data Catalog. Athena
          runs partition-scoped QA SQL. Redshift <span className="font-mono text-sm">COPY</span> promotes gold
          grain into local KEY/SORT tables; Spectrum queries cold lake paths without full ingest. QuickSight
          connects to Redshift for dashboards and Athena for exploratory datasets.
        </p>
      </Definition>

      <LessonSection title="Redshift + Glue patterns">
        <ContentStep number={1} title="Glue writes, Redshift loads">
          <p className="text-slate-300">
            Glue job outputs{' '}
            <span className="font-mono text-sm">s3://lake/curated/orders/</span> and updates catalog
            partitions. Step Functions triggers Redshift Data API{' '}
            <span className="font-mono text-sm">COPY</span> on success. Same job role pattern as Athena
            validation — fail fast in SQL before COPY if row counts diverge.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue crawlers vs explicit DDL">
          <p className="text-slate-300">
            Crawlers bootstrap schema for Athena exploration; production gold tables get explicit Glue DDL
            aligned with Redshift dist/sort design. Avoid schema drift between Spectrum external tables and
            local COPY targets — document column renames in one catalog place.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Job bookmarks and incremental COPY">
          <p className="text-slate-300">
            Glue bookmarks track processed S3 keys; COPY only new{' '}
            <span className="font-mono text-sm">year=/month=</span> prefixes listed in manifest. Pipeline
            ledger in DynamoDB prevents double-load on replay.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Redshift + Athena patterns">
        <ContentStep number={1} title="Division of labor">
          <p className="text-slate-300">
            Athena: ad hoc lake SQL, post-ingest validation, CTAS to new curated tables, cost-sensitive
            exploration. Redshift: concurrent BI, complex star joins on local facts, materialized views,
            sub-second SLAs on pre-aggregated gold.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Athena CTAS → Redshift COPY">
          <p className="text-slate-300">
            Analyst prototype in Athena CTAS creates{' '}
            <span className="font-mono text-sm">s3://lake/gold/prototype_agg/</span> — DE promotes to
            production by COPY into{' '}
            <span className="font-mono text-sm">gold.prototype_agg</span> with proper dist/sort after review.
            UNLOAD from Redshift back to lake when warehouse-derived features feed ML.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same catalog, two engines">
          <p className="text-slate-300">
            Spectrum external schema and Athena share Glue databases — fix partition issues once, both engines
            benefit. Lake Formation permissions apply to both where integrated.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="End-to-end DE architecture">
        <Flowchart
          title="S3 + Glue + Athena + Redshift — production flow"
          chart={`flowchart TB
  LAND[S3 landing vendor files]
  GLUE[Glue Spark ETL bookmarks]
  CUR[S3 curated Parquet partitions]
  CAT[Glue Data Catalog]
  ATHQA[Athena partition QA SQL]
  DEC{Validation pass?}
  COPY[Redshift COPY gold facts]
  SPEC[Spectrum external schema]
  LOCAL[Local MVs dashboards]
  UNLOAD[UNLOAD exports to S3]
  LAND --> GLUE
  GLUE --> CUR
  GLUE --> CAT
  CUR --> CAT
  CUR --> ATHQA
  ATHQA --> DEC
  DEC -->|yes| COPY
  DEC -->|no| QUAR[S3 quarantine alert]
  COPY --> LOCAL
  CAT --> SPEC
  CUR --> SPEC
  SPEC --> LOCAL
  LOCAL --> BI[QuickSight JDBC]
  LOCAL --> UNLOAD
  UNLOAD --> CUR
  CAT --> ATHADH[Athena ad hoc]`}
        />
        <Callout variant="insight">
          Whiteboard answer: &quot;Glue owns transform and catalog; Athena validates and explores; Redshift
          serves BI on COPY hot facts plus Spectrum cold history — all on the same S3 curated zone.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue ETL → curated S3 + catalog → Athena QA → Redshift COPY on pass — standard promotion pipeline.',
          'Spectrum + Athena share Glue metadata — fix partitions and schema once for both query engines.',
          'Athena for ad hoc and CTAS prototypes; Redshift for concurrent BI, MVs, and tuned local facts.',
          'Incremental: Glue bookmarks + COPY manifest + ledger — avoid double-loading partitions.',
          'UNLOAD closes the loop — warehouse-derived datasets back to S3 for ML or Athena consumers.',
        ]}
      />
    </LessonArticle>
  )
}
