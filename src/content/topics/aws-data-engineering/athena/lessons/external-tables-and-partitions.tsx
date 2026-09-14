import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ExternalTablesAndPartitions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena tables are pointers — not storage">
        Almost every Athena table in a data lake is an{' '}
        <strong className="text-white">external table</strong>: metadata in Glue, bytes on S3. Dropping the
        table removes catalog entries only — Parquet files remain. Partitions map filter columns to S3
        prefix paths so queries scan days or regions you actually need.
      </Callout>

      <Definition term="External table">
        <p>
          An external table declares <span className="font-mono text-sm">LOCATION 's3://…'</span>, file
          format (Parquet, ORC, CSV), and column types. Athena reads files under that prefix at query time.
          No data is copied into Athena — billing is per TB scanned from S3, not table &quot;size&quot; in
          the catalog.
        </p>
      </Definition>

      <LessonSection title="Hive-style partitions (year / month / day)">
        <ContentStep number={1} title="Path layout">
          <p className="text-slate-300">
            Standard layout:{' '}
            <span className="font-mono text-sm">
              s3://lake/curated/events/year=2026/month=03/day=15/part-000.snappy.parquet
            </span>
            . The table DDL includes{' '}
            <span className="font-mono text-sm">PARTITIONED BY (year string, month string, day string)</span>{' '}
            — partition column values come from folder names, not from inside each Parquet file (though you
            may also store them as columns for convenience).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Registering partitions">
          <p className="text-slate-300">
            After new daily folders land, run{' '}
            <span className="font-mono text-sm">MSCK REPAIR TABLE curated.events</span> or add partitions via
            Glue API / crawler. Without catalog partition entries, Athena may ignore new S3 folders even when
            paths exist — classic &quot;query returns zero rows for yesterday&quot; bug.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition pruning in SQL">
          <p className="text-slate-300">
            Filter on partition columns in <span className="font-mono text-sm">WHERE</span>:{' '}
            <span className="font-mono text-sm">year='2026' AND month='03'</span>. The engine skips unrelated
            prefixes — the primary cost control for historical tables. Non-partition filters still scan all
            files within matched partitions.
          </p>
        </ContentStep>
        <Example title="Query with partition filters">
{`SELECT event_type, COUNT(*) AS cnt
FROM curated.events
WHERE year = '2026'
  AND month = '03'
  AND day BETWEEN '01' AND '07'
GROUP BY event_type;`}
        </Example>
      </LessonSection>

      <LessonSection title="Partition projection overview">
        <Definition term="Partition projection">
          <p>
            Instead of storing thousands of partition objects in Glue, table properties tell Athena how to{' '}
            <strong className="text-white">synthesize</strong> partition metadata from templates — e.g.{' '}
            <span className="font-mono text-sm">projection.year.type=integer</span>,{' '}
            <span className="font-mono text-sm">projection.year.range=2020,2030</span>. Athena generates
            partition paths on the fly; no MSCK REPAIR for predictable layouts. Ideal for high-cardinality
            date ranges and streaming hourly partitions.
          </p>
        </Definition>
        <ContentStep number={1} title="When to use projection">
          <p className="text-slate-300">
            Tables with regular <span className="font-mono text-sm">year=/month=/day=</span> or{' '}
            <span className="font-mono text-sm">dt=</span> layouts and continuous ingest — avoids Glue
            partition API limits and repair lag. Not a substitute for bad partition key choice (e.g.
            user_id with millions of values).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Storage location template">
          <p className="text-slate-300">
            Set <span className="font-mono text-sm">storage.location.template</span> to{' '}
            <span className="font-mono text-sm">s3://lake/curated/events/year=${'{year}'}/month=${'{month}'}/</span>{' '}
            matching actual S3 keys. Mismatch between template and objects causes empty scans or full-table
            failures.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Combine projection with Parquet and narrow SELECT lists — projection reduces partition metadata
          overhead; columnar format reduces bytes per partition scanned.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'External tables: Glue metadata + S3 data — DROP TABLE does not delete lake files.',
          'Hive partitions map year/month/day (or similar) to S3 prefixes; always filter partition columns in WHERE.',
          'MSCK REPAIR or crawlers sync new folders to the catalog unless partition projection is enabled.',
          'Partition projection synthesizes metadata from templates — great for date/hour layouts at scale.',
          'DE interview staple: zero rows after ingest usually means missing partitions or wrong LOCATION template.',
        ]}
      />
    </LessonArticle>
  )
}
