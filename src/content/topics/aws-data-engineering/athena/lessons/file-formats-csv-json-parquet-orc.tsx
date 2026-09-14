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

export function FileFormatsCsvJsonParquetOrc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Format drives scan cost">
        Athena reads whatever format your table DDL declares. The same logical table costs pennies as
        Snappy Parquet and dollars as wide CSV if you scan terabytes. Data engineers choose format per lake
        zone: forgiving row formats in raw, columnar compressed formats in curated — because Athena bills
        by data scanned, not by row count returned.
      </Callout>

      <Definition term="SerDe and stored format">
        <p>
          Athena uses Hive-compatible <strong className="text-white">SerDes</strong> ( serializers/deserializers
          ) to interpret bytes on S3 as typed columns. <code className="text-core-400">STORED AS TEXTFILE</code>{' '}
          with CSV SerDe, <code className="text-core-400">STORED AS PARQUET</code>,{' '}
          <code className="text-core-400">STORED AS ORC</code>, and OpenX JSON SerDe for JSON lines are
          common in DE pipelines. The DDL format must match actual files — Parquet DDL on CSV paths fails
          or returns garbage.
        </p>
      </Definition>

      <LessonSection title="CSV — universal landing format">
        <ContentStep number={1} title="When CSV fits">
          <p className="text-slate-300">
            Partner exports, legacy dumps, quick human-readable samples in{' '}
            <code className="text-core-400">raw/</code> zones. Everyone can open CSV; crawlers infer columns
            easily. Acceptable for one-time loads and small tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Athena CSV gotchas">
          <p className="text-slate-300">
            Header rows need{' '}
            <code className="text-core-400">skip.header.line.count</code> table property. Delimiters,
            quotes, and embedded commas require correct SerDe properties. All columns are strings until cast
            — type errors show up mid-query. No column pruning: reading two fields still scans full rows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE guidance">
          <p className="text-slate-300">
            Query CSV in raw for debugging; convert to Parquet in silver/curated Glue jobs for anything
            queried more than once. Treat raw CSV Athena queries as expensive archaeology, not daily BI.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="JSON — semi-structured events">
        <ContentStep number={1} title="When JSON fits">
          <p className="text-slate-300">
            Application logs, API payloads, Kinesis Firehose deliveries in{' '}
            <code className="text-core-400">raw/events/</code>. Nested objects map to Athena{' '}
            <code className="text-core-400">STRUCT</code> and <code className="text-core-400">ARRAY</code>{' '}
            types — powerful for exploration without upfront flattening.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scan cost on wide JSON">
          <p className="text-slate-300">
            Each line is often a full document. Selecting one field still reads entire JSON documents per
            row — better than CSV for nested data, worse than Parquet for repeated aggregate queries on flat
            columns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE guidance">
          <p className="text-slate-300">
            Use JSON external tables for raw inspection; normalize to flat Parquet in processing for
            dashboards and recurring reports. JsonSerDe and OpenX JsonSerDe differ — match crawler choice in
            DDL.
          </p>
        </ContentStep>
        <Example title="JSON path access sketch" caption="Raw clickstream">
{`SELECT
  json_extract_scalar(line, '$.user_id') AS user_id,
  json_extract_scalar(line, '$.event_type') AS event_type
FROM de_lake_dev.raw_clicks
WHERE year = '2026' AND month = '03'
LIMIT 100;`}
        </Example>
      </LessonSection>

      <LessonSection title="Parquet — default for curated analytics">
        <ContentStep number={1} title="Columnar layout">
          <p className="text-slate-300">
            Parquet stores columns separately in row groups with min/max statistics. Athena reads only
            columns referenced in <code className="text-core-400">SELECT</code> and skips row groups that
            statistics prove irrelevant — massive scan reduction on wide tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Embedded schema and compression">
          <p className="text-slate-300">
            Types live in file footers — simpler DDL than CSV SerDe. Snappy compression is the DE default:
            fast decompress, good ratio. Splittable for parallel scans across workers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue and Spark native write">
          <p className="text-slate-300">
            Glue DynamicFrames and Spark{' '}
            <code className="text-core-400">write.parquet()</code> produce Athena-ready files. Most curated
            tables you query daily should be Parquet under hive partitions.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="ORC — columnar alternative">
        <ContentStep number={1} title="Similar benefits to Parquet">
          <p className="text-slate-300">
            Optimized Row Columnar (ORC) also stores columns separately with compression and predicate
            pushdown. Hive-heavy estates often standardize on ORC; AWS lake tutorials skew Parquet — both
            are valid curated formats for Athena.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When teams pick ORC">
          <p className="text-slate-300">
            Legacy Hadoop clusters, certain Spark tuning guides, or mixed Hive/Athena estates already
            invested in ORC tooling. Greenfield AWS DE stacks usually choose Parquet for broader tool
            compatibility (Spark, DuckDB, Pandas).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same Athena rules apply">
          <p className="text-slate-300">
            <code className="text-core-400">STORED AS ORC</code> in DDL, partition for prune, avoid small
            files — identical operational playbook to Parquet.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Typical zone</th>
                <th className="px-4 py-3">Column pruning</th>
                <th className="px-4 py-3">Athena scan cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CSV', 'Raw landing', 'No', 'High on wide tables'],
                ['JSON', 'Raw events', 'Limited', 'Medium–high'],
                ['Parquet', 'Curated / gold', 'Yes', 'Low with filters'],
                ['ORC', 'Curated (Hive shops)', 'Yes', 'Low with filters'],
              ].map(([fmt, zone, prune, cost]) => (
                <tr key={fmt} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{fmt}</td>
                  <td className="px-4 py-3">{zone}</td>
                  <td className="px-4 py-3">{prune}</td>
                  <td className="px-4 py-3">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Why columnar (Parquet/ORC) wins for analytics">
        <p className="text-slate-300">
          Analytics queries usually touch a subset of columns across many rows —{' '}
          <code className="text-core-400">SUM(amount)</code>,{' '}
          <code className="text-core-400">COUNT(DISTINCT user_id)</code>, not every field in the export.
          Columnar formats align storage with that access pattern; row formats align with transactional
          single-row reads — the wrong fit for Athena-style scans.
        </p>
        <Flowchart
          title="Format choice by query pattern"
          chart={`flowchart TD
  Q[Will analysts query this path repeatedly?]
  Q -->|No once or debug| RAW[CSV or JSON in raw OK]
  Q -->|Yes dashboards QA| COL[Parquet or ORC in curated]
  COL --> PART[Add partition columns]
  PART --> COMP[Snappy compression]
  COMP --> CHEAP[Lower Athena scan bill]`}
        />
        <ContentStep number={1} title="Column projection">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT order_id, amount</code> on Parquet reads two column
            chunks — not the entire row width. On a 200-column export, savings multiply.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Row group statistics">
          <p className="text-slate-300">
            Min/max stats per row group let Athena skip blocks where{' '}
            <code className="text-core-400">amount &gt; 1000</code> cannot match — predicate pushdown inside
            files, not just partition folders.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Smaller bytes on wire">
          <p className="text-slate-300">
            Compression plus encoding shrink S3 storage and scan volume — same query literally reads fewer
            gigabytes, directly reducing the Athena meter.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Rule of thumb: raw may be CSV/JSON; anything in the curated prefix your team queries weekly should
          be Snappy Parquet (or ORC) with sane file sizes (128 MB–1 GB targets) and date partitions — the
          highest-leverage Athena cost decision you make as a DE.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CSV and JSON suit raw exploration; both lack efficient column pruning — costly at scale in Athena.',
          'Parquet is the default curated format on AWS lakes; ORC is equivalent columnar choice in Hive-heavy stacks.',
          'Columnar formats enable column projection and row-group predicate pushdown — lower scan bytes and lower bills.',
          'DDL STORED AS must match actual S3 files; convert raw row formats to Parquet in Glue/Spark before recurring SQL.',
        ]}
      />
    </LessonArticle>
  )
}
