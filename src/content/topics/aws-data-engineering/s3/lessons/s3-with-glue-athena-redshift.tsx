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

export function S3WithGlueAthenaRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="S3 is the lake — these services are the query engine">
        Objects in S3 are inert until cataloged and queried.{' '}
        <strong className="text-white">AWS Glue</strong> discovers schema and runs ETL;{' '}
        <strong className="text-white">Athena</strong> runs serverless SQL on S3;{' '}
        <strong className="text-white">Redshift Spectrum</strong> joins local warehouse tables with external
        Parquet on S3. Data engineers wire all three to the same zone layout and IAM roles.
      </Callout>

      <Definition term="Glue Data Catalog">
        <p>
          The <strong className="text-white">Glue Data Catalog</strong> stores databases, tables, and
          partitions pointing at S3 locations — Hive-compatible metadata shared by Athena, Redshift
          Spectrum, EMR, and Lake Formation. Crawlers or jobs register{' '}
          <span className="font-mono text-sm">s3://lake/curated/sales/</span> so SQL engines know column
          names and partition keys without hardcoding paths in every query.
        </p>
      </Definition>

      <LessonSection title="S3 + Glue patterns">
        <ContentStep number={1} title="Crawlers on raw and curated">
          <p className="text-slate-300">
            Schedule crawlers on new raw prefixes for schema drift detection; register curated Parquet with
            partition indexes. Crawler IAM role needs <span className="font-mono text-sm">s3:List</span> and{' '}
            <span className="font-mono text-sm">GetObject</span> on target prefixes plus Glue catalog write.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue ETL jobs">
          <p className="text-slate-300">
            Spark jobs read raw JSON/CSV, apply transforms, write Snappy Parquet to processed/curated with{' '}
            <span className="font-mono text-sm">partitionBy</span>. Job bookmarks track processed files —
            incremental raw ingestion without full rescans. Job role: read raw, write curated, CloudWatch logs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue Studio and workflows">
          <p className="text-slate-300">
            Orchestrate crawl → job → trigger Lambda on success. Workflows replace brittle cron-only scripts
            with dependency-aware pipelines native to the catalog.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="S3 + Athena patterns">
        <ContentStep number={1} title="External tables">
          <p className="text-slate-300">
            Athena queries Glue catalog tables — SQL against curated Parquet without loading into a cluster.
            Pay per TB scanned; partition pruning and columnar format are mandatory cost controls.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Workgroups and IAM">
          <p className="text-slate-300">
            Separate workgroups per team (dev/prod) with query result locations in{' '}
            <span className="font-mono text-sm">s3://lake/athena-results/</span>. Analyst SSO roles need S3
            read on curated + Athena API; result bucket write scoped per workgroup.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CTAS and UNLOAD">
          <p className="text-slate-300">
            CREATE TABLE AS SELECT materializes query output to new S3 prefix — silver → gold promotion.
            UNLOAD exports Redshift-friendly files. Both write through Athena-managed locations — plan KMS and
            lifecycle on output prefixes.
          </p>
        </ContentStep>
        <Example title="Athena query on curated table (sketch)">
{`SELECT product_id, SUM(revenue) AS total
FROM curated.sales
WHERE year = '2026' AND month = '03'
GROUP BY product_id
ORDER BY total DESC
LIMIT 100;`}
        </Example>
      </LessonSection>

      <LessonSection title="S3 + Redshift Spectrum patterns">
        <ContentStep number={1} title="External schema">
          <p className="text-slate-300">
            Redshift external schema maps to Glue database — Spectrum queries S3 Parquet using Redshift SQL
            while hot data stays in local DIST/SORT tables. Join{' '}
            <span className="font-mono text-sm">local_fact</span> with{' '}
            <span className="font-mono text-sm">spectrum.curated_events</span> for hybrid models.
          </p>
        </ContentStep>
        <ContentStep number={2} title="COPY from S3">
          <p className="text-slate-300">
            Bulk load curated files into local tables for low-latency dashboards — IAM role on Redshift
            cluster/snapshot with <span className="font-mono text-sm">s3:GetObject</span> on curated prefix.
            Use for gold tables queried sub-second; keep cold history on Spectrum only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Performance notes">
          <p className="text-slate-300">
            Spectrum performance depends on file size, partition pruning, and Redshift cluster size — not a
            replacement for proper sort keys on loaded facts. Monitor Spectrum scans via SVL_S3QUERY summaries.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lake query path flowchart">
        <Flowchart
          title="End-to-end lake query path"
          chart={`flowchart TB
  S3R[S3 raw prefix]
  S3C[S3 curated Parquet]
  GLUE[Glue crawler and ETL]
  CAT[Glue Data Catalog]
  ATH[Athena SQL — serverless]
  RS[Redshift Spectrum external schema]
  LOCAL[Redshift local tables COPY]
  BI[QuickSight BI]
  S3R --> GLUE
  GLUE --> S3C
  GLUE --> CAT
  S3C --> CAT
  CAT --> ATH
  CAT --> RS
  S3C --> ATH
  S3C --> RS
  ATH --> BI
  S3C --> LOCAL
  LOCAL --> BI
  RS --> BI`}
        />
        <Callout variant="tip">
          One catalog, many engines: register tables once in Glue; Athena for ad hoc and lightweight serve;
          Redshift for mixed local + Spectrum workloads; avoid duplicating schema in three places without
          automation.
        </Callout>
        <Callout variant="insight">
          Lake Formation can sit above Glue catalog for fine-grained table/column grants — same S3 paths,
          centralized authorization for Athena and Spectrum principals.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Catalog is shared metadata — crawlers and ETL register S3 paths for downstream SQL engines.',
          'Glue ETL: raw → Parquet curated with bookmarks for incremental processing; scope job IAM by prefix.',
          'Athena: serverless SQL on cataloged S3 — partition pruning and Parquet minimize scan cost.',
          'Redshift Spectrum queries external Glue tables on S3; COPY loads hot subsets locally for performance.',
          'Flow: S3 zones → Glue catalog → Athena / Spectrum / COPY → BI — one layout, multiple serve paths.',
        ]}
      />
    </LessonArticle>
  )
}
