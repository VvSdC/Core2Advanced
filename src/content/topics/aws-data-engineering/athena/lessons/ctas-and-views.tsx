import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CtasAndViews() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="CTAS materializes SQL onto S3 — views do not">
        <strong className="text-white">CREATE TABLE AS SELECT (CTAS)</strong> runs a query and writes new
        files to S3, registering a Glue table — the standard serverless path from CSV/JSON to Parquet.{' '}
        <strong className="text-white">Views</strong> store only the SQL definition; each query re-scans
        underlying tables. Know when to persist vs when to virtualize.
      </Callout>

      <Definition term="CTAS (Create Table As Select)">
        <p>
          CTAS executes SELECT logic once (per run), outputs to an S3 prefix in chosen format — typically{' '}
          <strong className="text-white">Parquet with Snappy compression</strong> — and creates an external
          table in the catalog. Use for silver → gold promotion, format conversion, denormalized aggregates,
          and narrow column subsets for analyst self-service.
        </p>
      </Definition>

      <LessonSection title="CTAS for Parquet conversion">
        <ContentStep number={1} title="CSV or JSON → curated Parquet">
          <p className="text-slate-300">
            One-shot or scheduled CTAS replaces brittle shell scripts: read raw external table, cast types,
            filter bad rows, write partitioned Parquet. Athena charges for bytes scanned on source plus
            write to destination — still cheaper than leaving CSV for daily dashboards.
          </p>
        </ContentStep>
        <Example title="CTAS with Parquet and partitions">
{`CREATE TABLE curated.orders_parquet
WITH (
  format = 'PARQUET',
  parquet_compression = 'SNAPPY',
  external_location = 's3://my-lake/curated/orders_parquet/',
  partitioned_by = ARRAY['year', 'month']
) AS
SELECT
  order_id,
  customer_id,
  CAST(order_ts AS timestamp) AS order_ts,
  amount,
  year,
  month
FROM raw.orders_csv
WHERE year = '2026' AND month = '03';`}
        </Example>
        <ContentStep number={2} title="Operational notes">
          <p className="text-slate-300">
            CTAS needs write access to output prefix and Glue create table permissions. Large CTAS may hit
            workgroup limits — run per-partition batches or use Glue Spark for TB-scale converts. Drop and
            recreate vs INSERT INTO depends on Iceberg/Delta (advanced); classic external CTAS often uses new
            table per run with partition swap pattern.
          </p>
        </ContentStep>
        <Callout variant="tip">
          After CTAS, verify row counts and a sample checksum against source — CTAS is a full scan of
          source data; a typo in WHERE duplicates production data gaps silently.
        </Callout>
      </LessonSection>

      <LessonSection title="Views">
        <Definition term="Athena view">
          <p>
            A view is saved SQL — <span className="font-mono text-sm">CREATE VIEW gold.daily_revenue AS SELECT …</span>.
            No new S3 objects. Good for hiding partition filters, joining curated tables, and exposing
            column subsets to BI tools. Cost follows underlying tables every time the view runs.
          </p>
        </Definition>
        <ContentStep number={1} title="When views win">
          <p className="text-slate-300">
            Standardize <span className="font-mono text-sm">WHERE year = current_year</span> logic; mask PII
            columns with <span className="font-mono text-sm">CAST(NULL AS …)</span> for analyst roles; simplify
            QuickSight datasets. Cheap to maintain — no storage duplication.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When views hurt">
          <p className="text-slate-300">
            Heavy aggregations scanned repeatedly by many users — materialize with CTAS or scheduled Glue job
            instead. Nested views on wide raw tables without partition pushdown multiply scan cost.
          </p>
        </ContentStep>
        <Example title="View with enforced partition filter">
{`CREATE OR REPLACE VIEW curated.orders_recent AS
SELECT order_id, customer_id, order_ts, amount
FROM curated.orders_parquet
WHERE year = CAST(year(current_date) AS varchar)
  AND month = lpad(CAST(month(current_date) AS varchar), 2, '0');`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CTAS runs SELECT once and writes new S3 data + Glue table — primary serverless CSV/JSON → Parquet path.',
          'Use WITH (format=PARQUET, parquet_compression=SNAPPY, partitioned_by=…) for curated lake layout.',
          'Views store SQL only — convenient for access control and standard filters; each query rescans sources.',
          'Materialize heavy aggregates with CTAS or Glue; use views for thin logic and column masking.',
          'Validate CTAS row counts and partition layout before pointing production dashboards at new tables.',
        ]}
      />
    </LessonArticle>
  )
}
