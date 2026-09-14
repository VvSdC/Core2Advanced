import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PartitioningAndParquetOptimization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Partition layout and file format dominate Athena cost">
        Athena bills by <strong className="text-white">data scanned</strong>, not rows returned. Two levers
        matter most: <strong className="text-white">partitioning</strong> (which S3 prefixes you touch) and{' '}
        <strong className="text-white">Parquet</strong> (how many column bytes you read per file). Compression
        and file sizing sit on top — interviewers expect DE candidates to reason through all three.
      </Callout>

      <Definition term="Partitioning optimization">
        <p>
          Choose partition keys that match <strong className="text-white">high-selectivity filters</strong> in
          typical SQL — usually date (<span className="font-mono text-sm">year/month/day</span> or{' '}
          <span className="font-mono text-sm">dt</span>), sometimes region or product line. Goal: each query
          touches the smallest set of prefixes. Avoid ultra-high cardinality keys (user_id, session_id) that
          create millions of tiny folders.
        </p>
      </Definition>

      <LessonSection title="Partitioning deep dive">
        <ContentStep number={1} title="Sweet spot for partition count">
          <p className="text-slate-300">
            Hundreds to low thousands of partitions per table is healthy. Millions of partitions stress Glue
            metadata and slow planning. If daily partitions grow for years, consider rolling older data to
            monthly archive partitions or separate table per era.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Small file problem">
          <p className="text-slate-300">
            Streaming ingest may write 128 KB files per minute — Athena opens each file (overhead + poor
            column statistics). Compact with scheduled Glue job or CTAS: target{' '}
            <strong className="text-white">128 MB–512 MB</strong> per Parquet file in curated zones. Balance
            against parallelism — files too large reduce split parallelism on small clusters.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Multi-level vs single dt column">
          <p className="text-slate-300">
            <span className="font-mono text-sm">year=/month=/day=</span> vs single{' '}
            <span className="font-mono text-sm">dt=2026-03-15</span> — both work with pruning when WHERE matches.
            Single <span className="font-mono text-sm">dt</span> simplifies projection templates; hierarchical
            keys match many Glue ETL defaults. Consistency across the lake matters more than the exact style.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parquet optimization">
        <Definition term="Columnar format (Parquet)">
          <p>
            Parquet stores columns separately in <strong className="text-white">row groups</strong> with
            min/max statistics per column chunk. Athena skips row groups when predicates contradict stats —
            <strong className="text-white"> predicate pushdown</strong>. Selecting three columns from a fifty-column
            table reads roughly three columns&apos; worth of bytes, not the full row width.
          </p>
        </Definition>
        <ContentStep number={1} title="Schema design for analytics">
          <p className="text-slate-300">
            Flatten nested JSON before Parquet write for repeated BI queries. Use appropriate types —{' '}
            <span className="font-mono text-sm">decimal(10,2)</span> for money,{' '}
            <span className="font-mono text-sm">timestamp</span> not string dates. Drop unused landing columns
            in silver layer to shrink every downstream scan.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Sort order within files (advanced)">
          <p className="text-slate-300">
            Sorting Parquet by common filter columns (e.g. customer_id) before write can improve row group
            skipping beyond partition pruning alone. Glue Spark{' '}
            <span className="font-mono text-sm">sortWithinPartitions</span> — tradeoff: slower ETL, faster
            Athena for point lookups within a partition.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Compression">
        <ContentStep number={1} title="Snappy vs Gzip vs ZSTD">
          <p className="text-slate-300">
            <strong className="text-white">Snappy</strong> (default in many Glue jobs): fast decompress, moderate
            ratio — best general choice for Athena. <strong className="text-white">Gzip</strong>: smaller files,
            slower CPU — OK for cold archive queried rarely. <strong className="text-white">ZSTD</strong>:
            strong ratio with reasonable speed — increasingly used in modern pipelines. Compression reduces scan
            bytes and S3 storage cost together.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Codec</th>
                <th className="px-4 py-3">Scan cost</th>
                <th className="px-4 py-3">ETL CPU</th>
                <th className="px-4 py-3">DE default?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Snappy', 'Low bytes, fast read', 'Low', 'Yes — curated tables'],
                ['Gzip', 'Lower bytes, slower read', 'Medium', 'Cold / export only'],
                ['ZSTD', 'Low bytes, good read speed', 'Medium', 'Growing adoption'],
                ['Uncompressed', 'Highest scan cost', 'Lowest write', 'Avoid for analytics'],
              ].map(([codec, scan, cpu, def]) => (
                <tr key={codec} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{codec}</td>
                  <td className="px-4 py-3">{scan}</td>
                  <td className="px-4 py-3">{cpu}</td>
                  <td className="px-4 py-3">{def}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Interview: why Parquet over CSV for curated?">
{`-- Same 1 TB CSV on S3 vs 200 GB Snappy Parquet, query selects 5 of 40 columns
-- CSV scan: ~1 TB (row-oriented, all columns per row)
-- Parquet scan: ~25 GB column data + partition prune on last 7 days
-- Athena cost scales with scan — Parquet + partitions often 10–50x cheaper`}
        </Example>
        <Callout variant="tip">
          ORC is a valid columnar alternative (common on EMR/Hive); on AWS lake + Athena stacks, Parquet is
          the de facto standard — know ORC exists, recommend Parquet for greenfield DE projects.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Partition on columns used in WHERE — typically date; avoid high-cardinality keys and millions of tiny files.',
          'Target 128 MB–512 MB Parquet files; compact streaming micro-files with Glue or CTAS.',
          'Parquet columnar storage + row group statistics enable column pruning and predicate pushdown.',
          'Snappy compression is the default sweet spot for curated Athena tables; compression directly cuts scan bytes.',
          'Interview answer: partition pruning limits prefixes; Parquet limits columns and bytes per file read.',
        ]}
      />
    </LessonArticle>
  )
}
