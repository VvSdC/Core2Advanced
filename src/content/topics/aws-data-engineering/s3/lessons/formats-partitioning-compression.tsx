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

export function FormatsPartitioningCompression() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="How you store bytes determines query cost">
        Athena bills by data scanned; Glue job runtime scales with bytes read. Choosing{' '}
        <strong className="text-white">format</strong>,{' '}
        <strong className="text-white">partition layout</strong>, and{' '}
        <strong className="text-white">compression</strong> on S3 is the highest-leverage cost and
        performance decision in lake design — more than picking instance sizes.
      </Callout>

      <Definition term="Columnar vs row-oriented formats">
        <p>
          <strong className="text-white">CSV and JSON</strong> are row-oriented — read entire rows even when
          SQL selects two columns. <strong className="text-white">Parquet</strong> (and ORC, Avro with
          projection) stores columns separately with statistics — Athena and Spark skip irrelevant columns
          and row groups. Default curated format for AWS DE stacks:{' '}
          <strong className="text-white">Snappy-compressed Parquet</strong>.
        </p>
      </Definition>

      <LessonSection title="CSV vs JSON vs Parquet">
        <ContentStep number={1} title="CSV">
          <p className="text-slate-300">
            Universal ingest from partners; no schema embedded — fragile typing (dates as strings). Acceptable
            in raw/bronze; convert to Parquet in silver. Watch delimiter/quote escaping and header rows in
            crawlers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="JSON">
          <p className="text-slate-300">
            Semi-structured events, nested fields — good in raw; Athena handles JSON with struct types but
            scan cost high on wide documents. Normalize nested JSON to flat Parquet in processing for
            repeated analytics.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Parquet">
          <p className="text-slate-300">
            Columnar, splittable, schema embedded, predicate pushdown via row group statistics. Glue DynamicFrames
            and Spark write Parquet natively. Use for processed/curated and any path queried more than once.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Scan efficiency</th>
                <th className="px-4 py-3">Schema</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CSV', 'Raw landing', 'Low', 'External / crawler inferred'],
                ['JSON', 'Raw events', 'Low–medium', 'Flexible nested'],
                ['Parquet', 'Silver/Gold', 'High', 'Embedded in file footer'],
              ].map(([fmt, zone, scan, schema]) => (
                <tr key={fmt} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{fmt}</td>
                  <td className="px-4 py-3">{zone}</td>
                  <td className="px-4 py-3">{scan}</td>
                  <td className="px-4 py-3">{schema}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Partitioning">
        <Definition term="Hive-style partitioning">
          <p>
            Paths like{' '}
            <span className="font-mono text-sm">s3://lake/curated/sales/year=2026/month=03/day=15/part-000.parquet</span>{' '}
            map partition columns to directories. Athena and Glue partition projection prune irrelevant
            prefixes — scan only days queried, not entire history.
          </p>
        </Definition>
        <ContentStep number={1} title="Choose partition keys wisely">
          <p className="text-slate-300">
            High-cardinality filters in typical queries: date, region, product line. Avoid over-partitioning
            (millions of tiny prefixes per user_id) — creates small file problem. Sweet spot: hundreds to
            low thousands of partitions per table, each with reasonably sized files.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partition projection">
          <p className="text-slate-300">
            Athena can synthesize partition metadata from path templates without running MSCK REPAIR — reduces
            crawler dependency for date ranges with predictable layout. Document template in Glue/Athena table
            properties.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dynamic vs static partitions">
          <p className="text-slate-300">
            Spark/Glue writes use <span className="font-mono text-sm">partitionBy('date')</span> — one folder
            per run. Backfill jobs should target explicit partition predicates to avoid full-table rewrite.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Compression and the small file problem">
        <ContentStep number={1} title="Compression codecs">
          <p className="text-slate-300">
            <strong className="text-white">Snappy</strong> — default Parquet balance of speed and ratio.
            <strong className="text-white"> GZIP</strong> — smaller, slower; common on CSV landing.
            <strong className="text-white"> ZSTD</strong> — emerging in Spark 3.x for better ratio. Match codec
            to read/write profile: ingest once scan many → favor ratio; streaming micro-batches → favor speed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Small file problem">
          <p className="text-slate-300">
            Thousands of files under one partition (Kinesis Firehose default, per-event Lambda writes) —
            each file carries LIST overhead, S3 request cost, and poor Parquet row group efficiency. Symptoms:
            slow Athena, Glue job straggler tasks, high S3 request bills.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compaction strategies">
          <p className="text-slate-300">
            Scheduled Glue job coalesces daily micro-files into 128–256 MB Parquet targets. Iceberg/Delta on
            S3 add automatic compaction options. Set Firehose buffering interval/size higher when latency
            allows.
          </p>
        </ContentStep>
        <Flowchart
          title="Format and file size decision"
          chart={`flowchart TD
  IN[Ingest arrives]
  IN --> Q1{One-time export or repeated queries?}
  Q1 -->|One-time| CSVJSON[CSV or JSON in raw OK]
  Q1 -->|Repeated| PAR[Convert to Parquet silver]
  PAR --> PART[Partition by date and domain keys]
  PART --> COMP[Snappy or ZSTD compression]
  COMP --> SIZE{Files under 128 MB?}
  SIZE -->|No| CURATED[Curated ready for Athena]
  SIZE -->|Yes many tiny files| COMPACT[Compaction job coalesce]
  COMPACT --> CURATED`}
        />
        <Example title="Target file sizing (Spark/Glue sketch)">
{`# Coalesce or repartition before write
df.repartition(4).write \\
  .mode("overwrite") \\
  .partitionBy("year", "month", "day") \\
  .parquet("s3://lake/curated/events/")`}
        </Example>
        <Callout variant="insight">
          Rule of thumb: 128 MB–1 GB per Parquet file in active partitions; partition pruning should eliminate
          &gt;90% of prefixes on typical date-filtered dashboards.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Raw: CSV/JSON acceptable; curated: Snappy Parquet for column pruning and lower Athena scan cost.',
          'Partition by columns used in WHERE — typically date hierarchy; avoid ultra-high-cardinality partition keys.',
          'Snappy default for Parquet; GZIP on CSV landing; consider ZSTD for cold large archives.',
          'Small files hurt Athena/Glue and S3 request costs — compact micro-batches to 128–256 MB targets.',
          'Partition projection and compaction jobs are standard ops for mature lakes at scale.',
        ]}
      />
    </LessonArticle>
  )
}
