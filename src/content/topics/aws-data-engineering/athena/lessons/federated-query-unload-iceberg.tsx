import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FederatedQueryUnloadIceberg() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena beyond S3 — federated sources, exports, and Iceberg">
        Core Athena is SQL on cataloged S3. Advanced workloads add{' '}
        <strong className="text-white">federated queries</strong> into operational databases,{' '}
        <strong className="text-white">UNLOAD</strong> for bulk export,{' '}
        <strong className="text-white">prepared statements</strong> for parameterized pipelines, and{' '}
        <strong className="text-white">Apache Iceberg</strong> tables for ACID updates on the lake.
      </Callout>

      <Definition term="Athena Federated Query">
        <p>
          <strong className="text-white">Data source connectors</strong> (Lambda-backed) let Athena run SQL
          against DynamoDB, RDS, Redshift, CloudWatch Logs, and custom sources — joined with lake tables in
          one query. Connector Lambda runs in your account; you pay for connector compute plus Athena scan on
          lake side. Use for enrichment and small operational lookups, not full RDS table scans.
        </p>
      </Definition>

      <LessonSection title="Federated Query overview">
        <ContentStep number={1} title="Architecture sketch">
          <p className="text-slate-300">
            Register connector in Athena console → catalog shows{' '}
            <span className="font-mono text-sm">lambda:schema.table</span>. Query joins{' '}
            <span className="font-mono text-sm">curated.orders</span> (S3 Parquet) with{' '}
            <span className="font-mono text-sm">rds.customers</span> (federated). Connector Lambda fetches
            from RDS with pushdown where supported — still risk expensive federated side if unfiltered.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Dimension lookup during ad hoc analysis; validate lake row counts against operational DB snapshot;
            CloudWatch Logs connector for pipeline debug without exporting logs to S3 first. Production ETL
            usually syncs dimensions to S3 — federation is complement, not primary ingest.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Scope connector IAM to read-only on specific RDS tables; cap concurrent federated queries — a bad JOIN
          can hammer operational OLTP.
        </Callout>
      </LessonSection>

      <LessonSection title="Prepared statements teaser">
        <ContentStep number={1} title="Parameterized SQL for pipelines">
          <p className="text-slate-300">
            <span className="font-mono text-sm">PREPARE</span> / <span className="font-mono text-sm">EXECUTE</span>{' '}
            with placeholders (<span className="font-mono text-sm">?</span>) — Airflow and Lambda pass partition
            date without string-concatenating SQL (injection-safe). Stored in workgroup; reuse in scheduled
            queries and validation jobs.
          </p>
        </ContentStep>
        <Example title="Prepared statement sketch">
{`PREPARE daily_count FROM
SELECT COUNT(*) AS cnt
FROM curated.events
WHERE year = ? AND month = ? AND day = ?;

EXECUTE daily_count USING '2026', '03', '15';`}
        </Example>
      </LessonSection>

      <LessonSection title="UNLOAD">
        <Definition term="UNLOAD">
          <p>
            <span className="font-mono text-sm">UNLOAD (SELECT …) TO 's3://…'</span> writes query results as
            Parquet, ORC, Avro, or delimited files to a specified prefix — parallel export without row limit
            of interactive result sets. Use to feed ML buckets, partner SFTP staging, or Redshift COPY from
            lake-derived extracts.
          </p>
        </Definition>
        <ContentStep number={1} title="UNLOAD vs CTAS">
          <p className="text-slate-300">
            CTAS creates a new catalog table; UNLOAD writes files only (unless you register separately). UNLOAD
            supports partitioned output and specific formats for downstream consumers. Both scan source data —
            apply same partition filters.
          </p>
        </ContentStep>
        <Example title="UNLOAD to Parquet">
{`UNLOAD (SELECT customer_id, SUM(amount) AS total
        FROM curated.orders
        WHERE year = '2026' AND month = '03'
        GROUP BY customer_id)
TO 's3://my-lake/exports/monthly_totals/'
WITH (format = 'PARQUET', compression = 'SNAPPY');`}
        </Example>
      </LessonSection>

      <LessonSection title="Iceberg tables overview for Athena">
        <ContentStep number={1} title="Why Iceberg on Athena">
          <p className="text-slate-300">
            Classic external tables: append-only, no single-row UPDATE/DELETE, partition swaps are manual.
            <strong className="text-white"> Apache Iceberg</strong> adds ACID transactions, time travel, schema
            evolution, and hidden partitioning — Athena engine supports Iceberg tables stored on S3 with
            metadata in Glue catalog.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE patterns">
          <p className="text-slate-300">
            Slowly changing dimensions with MERGE; GDPR deletes by key; incremental upserts from CDC without
            rewriting entire partition. Glue 4.0+ and Athena can create/manage Iceberg — compaction jobs
            control small files. Interview line: Iceberg when you need mutability and snapshot isolation on
            the lake; plain Parquet when append-only curated is enough.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Iceberg adds operational complexity (snapshot expiration, orphan file cleanup) — adopt when business
          requires updates/deletes at row level, not for every bronze table.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Federated Query: Lambda connectors join RDS/DynamoDB/etc. with lake SQL — use for small lookups, not OLTP full scans.',
          'Prepared statements parameterize partition dates safely for Airflow, Lambda, and scheduled validation.',
          'UNLOAD exports large result sets to S3 in Parquet/ORC — parallel extract without interactive row caps.',
          'Iceberg on Athena enables ACID MERGE/DELETE/time travel on S3 — when append-only Parquet is insufficient.',
          'All advanced features still bill on bytes scanned on lake tables — partition and column discipline apply.',
        ]}
      />
    </LessonArticle>
  )
}
