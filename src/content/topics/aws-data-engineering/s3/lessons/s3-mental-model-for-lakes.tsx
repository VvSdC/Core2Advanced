import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function S3MentalModelForLakes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The lake is not a database — it is S3 plus conventions">
        A <strong className="text-white">data lake</strong> on AWS is mostly an S3 bucket (or family of
        buckets) with agreed prefix layout, file formats, and catalog metadata. There is no single &quot;lake
        service&quot; you launch — you combine S3 storage with Glue, Athena, and optionally Redshift
        Spectrum. This lesson builds the mental model before storage classes and security deep dives.
      </Callout>

      <Definition term="Data lake on AWS">
        <p>
          A <strong className="text-white">data lake</strong> stores structured and unstructured data at
          scale in open file formats (Parquet, JSON, CSV, Avro) on S3. Compute engines query in place
          instead of loading everything into a warehouse first. The{' '}
          <strong className="text-white">Glue Data Catalog</strong> (or Iceberg/Delta metadata) records
          table names, columns, and partition locations pointing at s3:// prefixes.
        </p>
      </Definition>

      <LessonSection title="Why lakes live on S3">
        <ContentStep number={1} title="Separation of storage and compute">
          <p className="text-slate-300">
            S3 bills per GB-month; Glue and Athena bill when you run jobs and queries. Scale ingestion
            without resizing a cluster. Pause compute; data stays cheap on S3 Standard until lifecycle
            policies tier it down.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Open formats and portability">
          <p className="text-slate-300">
            Parquet and CSV on S3 can be read by Spark, Athena, Redshift Spectrum, DuckDB locally, and
            other clouds via export — you are not locked into one database vendor&apos;s proprietary file
            layout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Durability for raw landing zones">
          <p className="text-slate-300">
            Append-only raw layers survive pipeline retries and reprocessing. If yesterday&apos;s ETL logic
            was wrong, re-read immutable raw files and rebuild processed output without re-extracting from
            source systems.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Fine-grained IAM at prefix level">
          <p className="text-slate-300">
            Policies can allow analysts on <code className="text-core-400">curated/*</code> while blocking{' '}
            <code className="text-core-400">raw/*</code> that contains PII — the IAM sub-topic applied to
            lake zones.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Medallion layout — raw, processed, curated">
        <p className="text-slate-300">
          A common beginner-friendly pattern divides one bucket (or three buckets) into zones by prefix.
          Names vary by company; the idea is consistent: land raw, transform, publish trusted tables.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Prefix</th>
                <th className="px-4 py-3">What lives here</th>
                <th className="px-4 py-3">Typical format</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['raw/', 'Exact copies from sources — DB dumps, API JSON, clickstream batches', 'CSV, JSON, gzip logs — schema may drift'],
                ['processed/', 'Cleaned, typed, deduplicated — ETL output ready for modeling', 'Parquet partitioned by date or id'],
                ['curated/', 'Business-ready datasets — star schema facts, KPI aggregates', 'Parquet or Iceberg — documented in catalog'],
              ].map(([prefix, what, format]) => (
                <tr key={prefix} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">
                    <code className="text-core-400">{prefix}</code>
                  </td>
                  <td className="px-4 py-3">{what}</td>
                  <td className="px-4 py-3">{format}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Partition keys in the path">
          Under processed, paths like{' '}
          <code className="text-core-400">processed/orders/year=2024/month=01/day=15/</code> map to Athena
          partition columns. Queries with <code className="text-core-400">WHERE year=2024 AND month=1</code>{' '}
          scan less data — lower cost and faster results.
        </Callout>
      </LessonSection>

      <LessonSection title="Prefix design teaser — rules of thumb">
        <ContentStep number={1} title="Hive-style partitions">
          <p className="text-slate-300">
            Use <code className="text-core-400">key=value/</code> segments for columns you filter on often.
            Avoid deep random paths that force full bucket scans.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Many medium files beat one giant file">
          <p className="text-slate-300">
            Target roughly 128 MB–1 GB Parquet files for Spark and Athena. Thousands of 1 KB files hurt
            list performance and job startup — compact small files in ETL.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stable names for curated">
          <p className="text-slate-300">
            <code className="text-core-400">curated/dim_customer/</code> should survive rewrites of{' '}
            <code className="text-core-400">raw/</code>. Downstream dashboards point at curated table names
            in Glue, not at raw landing paths.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Separate scratch and results">
          <p className="text-slate-300">
            Athena query results and Spark shuffle temp data belong in dedicated prefixes or buckets (e.g.{' '}
            <code className="text-core-400">s3://acme-athena-results/</code>) with short lifecycle expiration
            — not mixed into curated.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How services attach to the same bucket">
        <Flowchart
          title="Lake on S3 — ingest, catalog, query"
          chart={`flowchart TB
  subgraph Ingest["Ingest to raw/"]
    I1[App uploads via Boto3]
    I2[Database export to S3]
    I3[Kinesis Firehose]
  end
  S3[(S3 — raw processed curated)]
  subgraph Catalog["Metadata"]
    GC[Glue Data Catalog tables and partitions]
  end
  subgraph Compute["Query and transform"]
    G[Glue ETL Spark]
    A[Athena SQL]
    R[Redshift Spectrum]
  end
  I1 --> S3
  I2 --> S3
  I3 --> S3
  G --> S3
  S3 --> GC
  GC --> A
  GC --> R
  G --> GC
  S3 --> A
  S3 --> R`}
        />
        <Callout variant="insight">
          The catalog stores <em>where</em> data is (s3:// paths and schema), not the bytes themselves.
          A Glue crawler or explicit DDL registers partitions when new{' '}
          <code className="text-core-400">day=15/</code> folders appear. Broken lakes often have files in
          S3 with no catalog entry — Athena returns zero rows until someone runs MSCK REPAIR or adds
          partitions.
        </Callout>
      </LessonSection>

      <LessonSection title="Lake vs warehouse — complementary">
        <p className="text-slate-300">
          S3 holds the lake files; Redshift or RDS may hold a warehouse copy for low-latency BI. Many
          architectures query S3 directly with Athena for exploration and load hot subsets into Redshift.
          EC2 cron scripts you built earlier read/write the same prefixes Glue jobs will own later.
        </p>
        <ContentStep number={1} title="Lake strengths">
          <p className="text-slate-300">
            Cheap storage, schema-on-read, diverse formats, replay from raw.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to add a warehouse">
          <p className="text-slate-300">
            Sub-second dashboards on heavily joined star schemas, heavy concurrent BI users, or strict
            workload isolation — Spectrum and Athena hit limits; load curated Parquet into Redshift tables.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'An AWS data lake is S3 plus prefix conventions, open formats, and a catalog — not one monolithic service.',
          'Medallion zones: raw/ (land), processed/ (clean), curated/ (trusted) — IAM can scope each prefix.',
          'Partition keys in paths (year=, month=) reduce scan cost for Athena and Spark.',
          'Glue catalog points engines at s3:// locations; files without catalog entries are invisible to SQL.',
        ]}
      />
    </LessonArticle>
  )
}
