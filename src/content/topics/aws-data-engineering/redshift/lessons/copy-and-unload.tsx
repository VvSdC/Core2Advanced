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

export function CopyAndUnload() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="COPY and UNLOAD are the bulk I/O spine of Redshift ETL">
        <span className="font-mono text-sm">COPY</span> parallel-loads from S3 (or other sources) into local
        tables — the primary path from curated lake Parquet/CSV into the warehouse.{' '}
        <span className="font-mono text-sm">UNLOAD</span> exports query results back to S3 for Athena,
        ML pipelines, cross-account sharing, or archival. Both require IAM roles and sensible file layouts.
      </Callout>

      <Definition term="COPY">
        <p>
          Redshift command to ingest files from{' '}
          <span className="font-mono text-sm">s3://</span>, EMR, DynamoDB export, or remote host. Each
          compute node reads assigned files in parallel. Supports CSV, JSON, Avro, ORC, Parquet, and column
          mapping — Parquet from Glue-curated zones is the modern DE default.
        </p>
      </Definition>

      <Definition term="UNLOAD">
        <p>
          Runs a SELECT and writes result rows to S3 as CSV, Parquet, or JSON — parallel export capped by
          cluster/serverless capacity. Used for reverse ETL, feeding SageMaker features, handing off to
          partners, or materializing snapshots cheaper than repeated warehouse queries.
        </p>
      </Definition>

      <LessonSection title="COPY from S3">
        <ContentStep number={1} title="Prerequisites">
          <p className="text-slate-300">
            IAM role attached to cluster/workgroup with{' '}
            <span className="font-mono text-sm">s3:GetObject</span> on source prefix and KMS decrypt if
            encrypted. Target table exists with matching column order/types (or explicit column list). Files
            should be split ~1–125 MB compressed for parallel load.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Typical lake → warehouse load">
          <p className="text-slate-300">
            Glue writes{' '}
            <span className="font-mono text-sm">s3://lake/curated/orders/year=2026/month=03/</span> Parquet.
            Nightly job: <span className="font-mono text-sm">COPY fact_orders FROM 's3://…/month=03/' IAM_ROLE 'arn:…' FORMAT AS PARQUET;</span>{' '}
            then <span className="font-mono text-sm">ANALYZE fact_orders;</span> for optimizer stats.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Incremental patterns">
          <p className="text-slate-300">
            Append COPY into staging, merge with{' '}
            <span className="font-mono text-sm">DELETE + INSERT</span> or use{' '}
            <span className="font-mono text-sm">MERGE</span> (where supported) keyed on sort window. Truncate-and-reload
            for small dimensions. Track loaded prefixes in a pipeline ledger to avoid duplicate COPY.
          </p>
        </ContentStep>
        <Example title="COPY from curated Parquet">
{`COPY analytics.fact_orders
FROM 's3://my-lake/curated/orders/year=2026/month=03/'
IAM_ROLE 'arn:aws:iam::123456789012:role/de-redshift-copy-curated'
FORMAT AS PARQUET
COMPUPDATE OFF
STATUPDATE ON;`}
        </Example>
      </LessonSection>

      <LessonSection title="UNLOAD to S3">
        <ContentStep number={1} title="Export query results">
          <p className="text-slate-300">
            Wrap any SELECT — often filtered gold aggregates or PII-scrubbed extracts. Output lands as
            multiple files per node for parallelism. Same IAM role needs{' '}
            <span className="font-mono text-sm">s3:PutObject</span> on destination prefix.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parquet UNLOAD for downstream Athena">
          <p className="text-slate-300">
            <span className="font-mono text-sm">UNLOAD ('SELECT …') TO 's3://lake/exports/customer_360/' IAM_ROLE 'arn:…' FORMAT AS PARQUET ALLOWOVERWRITE;</span>{' '}
            Register with Glue crawler or CTAS external table — analysts query export in Athena without
            hammering warehouse concurrency.
          </p>
        </ContentStep>
        <Example title="UNLOAD Parquet sketch">
{`UNLOAD ('SELECT customer_id, segment, ltv_score
         FROM gold.customer_360
         WHERE snapshot_date = CURRENT_DATE')
TO 's3://my-lake/exports/customer_360/dt=2026-03-15/'
IAM_ROLE 'arn:aws:iam::123456789012:role/de-redshift-copy-curated'
FORMAT AS PARQUET
ALLOWOVERWRITE
PARALLEL ON;`}
        </Example>
      </LessonSection>

      <LessonSection title="S3 ↔ Redshift patterns">
        <Flowchart
          title="Lake ↔ warehouse bulk I/O"
          chart={`flowchart LR
  subgraph INGEST[S3 to Redshift]
    GLUE[Glue curated Parquet]
    COPY[COPY parallel load]
    FACT[Local fact tables]
    GLUE --> COPY
    COPY --> FACT
  end
  subgraph EXPORT[Redshift to S3]
    SQL[Gold SQL SELECT]
    UNL[UNLOAD Parquet CSV]
    OUT[s3 exports prefix]
    SQL --> UNL
    UNL --> OUT
  end
  OUT --> ATH[Athena ad hoc]
  OUT --> ML[SageMaker features]
  FACT --> BI[QuickSight dashboards]`}
        />
        <Callout variant="tip">
          Prefer COPY from Parquet over CSV — less type coercion, smaller files, faster parallel parse.
          Spectrum can query lake without COPY; COPY when BI needs sub-second local joins and sort-key pruning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'COPY: parallel S3 ingest into local tables — IAM role, file sizing, FORMAT AS PARQUET from curated lake.',
          'UNLOAD: export SELECT results to S3 — Parquet for Athena/ML, CSV for simple handoffs.',
          'Lake → warehouse: Glue curated zone → COPY → ANALYZE; track prefixes to prevent duplicate loads.',
          'Warehouse → lake: UNLOAD gold aggregates to exports prefix — offload ad hoc from WLM queues.',
          'IAM role on cluster/workgroup must Allow GetObject (COPY) and PutObject (UNLOAD) on scoped prefixes.',
        ]}
      />
    </LessonArticle>
  )
}
