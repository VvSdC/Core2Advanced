import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CreatingTablesDdl() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="DDL is how you teach Athena where bytes live">
        Before SQL can run, the catalog needs a table definition: columns,{' '}
        <strong className="text-white">SerDe</strong>, <strong className="text-white">format</strong>, and{' '}
        <strong className="text-white">LOCATION</strong>. Data engineers write{' '}
        <span className="font-mono text-sm">CREATE EXTERNAL TABLE</span> in Athena, Glue, or IaC — the sketch
        below is the mental model for interviews and debugging SerDe mismatches.
      </Callout>

      <Definition term="CREATE EXTERNAL TABLE sketch">
        <p>
          Core pieces: table name and columns; optional{' '}
          <span className="font-mono text-sm">PARTITIONED BY</span>;{' '}
          <span className="font-mono text-sm">ROW FORMAT SERDE</span> (how to parse rows);{' '}
          <span className="font-mono text-sm">STORED AS</span> (file format);{' '}
          <span className="font-mono text-sm">LOCATION</span> (S3 prefix). Wrong SerDe → garbage columns or
          query failures; wrong LOCATION → empty results.
        </p>
      </Definition>

      <LessonSection title="CSV external table (toy example)">
        <ContentStep number={1} title="When CSV DDL makes sense">
          <p className="text-slate-300">
            Partner drops comma-separated files to raw/. You need quick Athena access before Glue ETL converts
            to Parquet. OpenCSV SerDe handles headers and delimiters; specify types explicitly — Athena does
            not infer as flexibly as a crawler on first run.
          </p>
        </ContentStep>
        <Example title="CSV external table on S3 landing">
{`CREATE EXTERNAL TABLE IF NOT EXISTS raw.orders_csv (
  order_id   bigint,
  customer_id bigint,
  order_ts   string,
  amount     double
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.OpenCSVSerde'
WITH SERDEPROPERTIES (
  'separatorChar' = ',',
  'quoteChar'     = '"',
  'escapeChar'    = '\\\\'
)
STORED AS TEXTFILE
LOCATION 's3://my-lake/raw/orders/'
TBLPROPERTIES ('skip.header.line.count'='1');`}
        </Example>
        <Callout variant="insight">
          CSV in production analytics is expensive — use this pattern for exploration and QA, then CTAS or
          Glue ETL to Snappy Parquet in curated.
        </Callout>
      </LessonSection>

      <LessonSection title="Parquet external table (toy example)">
        <ContentStep number={1} title="Parquet DDL pattern">
          <p className="text-slate-300">
            Curated zone files are already Parquet — use{' '}
            <span className="font-mono text-sm">STORED AS PARQUET</span> and the Parquet Hive SerDe (or
            omit SerDe when format implies Parquet in Athena). Column types should match what Glue ETL wrote;
            add partition columns matching folder layout.
          </p>
        </ContentStep>
        <Example title="Partitioned Parquet external table">
{`CREATE EXTERNAL TABLE IF NOT EXISTS curated.orders (
  order_id    bigint,
  customer_id bigint,
  order_ts    timestamp,
  amount      decimal(10,2)
)
PARTITIONED BY (
  year  string,
  month string
)
STORED AS PARQUET
LOCATION 's3://my-lake/curated/orders/';`}
        </Example>
        <ContentStep number={2} title="After CREATE — register partitions">
          <p className="text-slate-300">
            Run <span className="font-mono text-sm">MSCK REPAIR TABLE curated.orders</span> or enable partition
            projection table properties. Glue ETL jobs that use{' '}
            <span className="font-mono text-sm">enableUpdateCatalog</span> may create table + partitions
            automatically — prefer that for pipelines, DDL for bootstrap.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SerDe / format / LOCATION checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">CSV</th>
                <th className="px-4 py-3">Parquet</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['STORED AS', 'TEXTFILE', 'PARQUET'],
                ['SerDe', 'OpenCSVSerde / LazySimpleSerDe', 'ParquetHiveSerDe (often implicit)'],
                ['LOCATION', 'Prefix with .csv objects', 'Prefix with .parquet objects'],
                ['Partition cols', 'In path only or duplicated in file', 'Usually in path; may omit from file'],
                ['Cost profile', 'High scan — row format', 'Lower scan — columnar + compression'],
              ].map(([comp, csv, pq]) => (
                <tr key={comp} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{comp}</td>
                  <td className="px-4 py-3">{csv}</td>
                  <td className="px-4 py-3">{pq}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CREATE EXTERNAL TABLE binds column schema, SerDe, STORED AS format, and S3 LOCATION — no data copy.',
          'CSV: OpenCSVSerde + TEXTFILE for raw exploration; plan Parquet promotion for repeated queries.',
          'Parquet: STORED AS PARQUET + PARTITIONED BY matching S3 folder keys; repair or project partitions.',
          'SerDe/format/LOCATION mismatches are the top cause of corrupt reads and empty query results.',
          'Production pipelines often let Glue ETL register tables; DDL remains essential for bootstrap and fixes.',
        ]}
      />
    </LessonArticle>
  )
}
