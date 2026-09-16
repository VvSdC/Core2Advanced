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

export function GlueDataCatalogBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The catalog is how SQL finds files">
        S3 stores bytes; SQL engines need names, columns, types, and partition paths. The{' '}
        <strong className="text-white">Glue Data Catalog</strong> is that map — a Hive-compatible metastore
        where <strong className="text-white">databases</strong> group <strong className="text-white">tables</strong>,
        each table points at an S3 prefix with a <strong className="text-white">schema</strong> and optional{' '}
        <strong className="text-white">partitions</strong>. Athena, Glue jobs, and Redshift Spectrum all read
        the same catalog in a typical lake setup.
      </Callout>

      <Definition term="Glue Data Catalog">
        <p>
          The <strong className="text-white">AWS Glue Data Catalog</strong> is a managed metadata repository
          that stores table definitions compatible with the Apache Hive metastore model. Each{' '}
          <strong className="text-white">table</strong> records column names and data types, SerDe and input
          format (CSV, JSON, Parquet, ORC), the S3 <strong className="text-white">LOCATION</strong>, and
          partition keys. The catalog does not store your data — only the instructions for engines to find
          and interpret files on S3.
        </p>
      </Definition>

      <LessonSection title="Building blocks — database, table, schema, partitions">
        <ContentStep number={1} title="Database">
          <p className="text-slate-300">
            A namespace — like a schema in Postgres — e.g.{' '}
            <code className="text-core-400">de_lake_dev</code> or{' '}
            <code className="text-core-400">analytics_curated</code>. Groups related tables. Athena&apos;s
            dropdown and Spectrum external schemas reference the same database names from Glue.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Table">
          <p className="text-slate-300">
            Metadata for one dataset: columns, format, S3 location. An{' '}
            <strong className="text-white">external table</strong> points at files in place — dropping the
            table removes metadata only, not S3 objects. This is the default for lake tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Schema (columns and types)">
          <p className="text-slate-300">
            Ordered list of column names and Hive types (<code className="text-core-400">string</code>,{' '}
            <code className="text-core-400">bigint</code>, <code className="text-core-400">timestamp</code>,
            etc.). Must align with file contents — Parquet is self-describing but Athena still uses catalog
            types for planning; CSV/JSON rely heavily on correct SerDe and column definitions.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Partitions">
          <p className="text-slate-300">
            Logical slices of a table — usually hive-style folders{' '}
            <code className="text-core-400">year=2026/month=03/day=15/</code>. Partition columns are
            registered in the catalog so engines prune paths instead of scanning the entire bucket history.
          </p>
        </ContentStep>
        <Flowchart
          title="Catalog hierarchy"
          chart={`flowchart TD
  CAT[Glue Data Catalog]
  CAT --> DB1[Database de_lake_dev]
  DB1 --> T1[Table raw_orders]
  DB1 --> T2[Table curated_orders]
  T2 --> COLS[Schema columns and types]
  T2 --> LOC[S3 LOCATION prefix]
  T2 --> PART[Partitions year month day]`}
        />
      </LessonSection>

      <LessonSection title="How catalog entries get created">
        <p className="text-slate-300">
          Metadata can arrive three common ways — often combined in one platform:
        </p>
        <ContentStep number={1} title="Glue Crawler">
          <p className="text-slate-300">
            Scans S3 (or JDBC) paths, infers schema, creates or updates tables and partition entries
            automatically — fast bootstrap, watch for schema drift on nested JSON.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Explicit DDL">
          <p className="text-slate-300">
            Athena <code className="text-core-400">CREATE EXTERNAL TABLE</code> or CloudFormation/Terraform
            Glue table resources — production gold tables often use explicit DDL so column names and types
            match downstream Redshift COPY exactly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue Job API">
          <p className="text-slate-300">
            Jobs call catalog APIs or use{' '}
            <code className="text-core-400">write_dynamic_frame.from_catalog</code> /{' '}
            <code className="text-core-400">getSink</code> patterns to register partitions after writing
            Parquet — keeps catalog in sync with job output without a separate crawler pass.
          </p>
        </ContentStep>
        <Example title="External table DDL sketch" caption="Athena-compatible — metadata only">
{`CREATE EXTERNAL TABLE de_lake_dev.curated_orders (
  order_id bigint,
  customer_id bigint,
  order_ts timestamp,
  total_amount decimal(10,2)
)
PARTITIONED BY (year string, month string, day string)
STORED AS PARQUET
LOCATION 's3://acme-lake/curated/orders/';`}
        </Example>
      </LessonSection>

      <LessonSection title="Shared metastore — Athena, Glue, Redshift Spectrum">
        <p className="text-slate-300">
          One catalog, many consumers — the main reason DE standardizes on Glue Data Catalog instead of
          maintaining separate Hive metastores per team.
        </p>
        <ContentStep number={1} title="Athena">
          <p className="text-slate-300">
            Default catalog is Glue. Every <code className="text-core-400">SELECT</code> resolves table
            location and partitions from catalog metadata, then scans matching S3 objects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue Jobs">
          <p className="text-slate-300">
            Jobs read source tables <code className="text-core-400">from_catalog</code> and write sinks that
            update destination tables — same database names in dev and prod with different S3 locations per
            environment.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift Spectrum">
          <p className="text-slate-300">
            External schemas in Redshift map to Glue databases. A Spectrum query joins local Redshift tables
            with catalog-backed external tables on S3 — fix a partition in Glue, both Athena and Spectrum
            benefit.
          </p>
        </ContentStep>
        <Flowchart
          title="One catalog, multiple query engines"
          chart={`flowchart LR
  CAT[Glue Data Catalog]
  S3[S3 lake files]
  S3 -.->|LOCATION| CAT
  CAT --> ATH[Athena]
  CAT --> GLUE[Glue Jobs read write]
  CAT --> SPEC[Redshift Spectrum]
  ATH --> QA[QA and ad hoc SQL]
  SPEC --> WH[Warehouse joins on lake]`}
        />
        <Callout variant="insight">
          Lake Formation can sit on top of the same catalog for fine-grained table and column permissions —
          advanced topic, but the catalog remains the shared metadata layer underneath.
        </Callout>
      </LessonSection>

      <LessonSection title="Common beginner mistakes">
        <ContentStep number={1} title="LOCATION mismatch">
          <p className="text-slate-300">
            Table points at <code className="text-core-400">s3://bucket/curated/orders/</code> but job wrote
            to <code className="text-core-400">s3://bucket/curated/order/</code> — zero rows until paths align.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Missing partitions">
          <p className="text-slate-300">
            Files exist under <code className="text-core-400">year=2026/</code> but catalog has no partition
            entry — run crawler, <code className="text-core-400">MSCK REPAIR TABLE</code>, or job partition
            registration.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Format / SerDe mismatch">
          <p className="text-slate-300">
            Table says CSV but files are Parquet — queries fail or return garbage. Match{' '}
            <code className="text-core-400">STORED AS</code> and SerDe to actual file format.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Dev naming convention">
          Mirror environment in database names: <code className="text-core-400">de_lake_dev</code>,{' '}
          <code className="text-core-400">de_lake_prod</code>. Same table names across envs — different
          LOCATION prefixes — reduces copy-paste errors when promoting DDL.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue Data Catalog stores databases, tables, schemas, and partitions — metadata only, not the data files.',
          'External tables point at S3 LOCATION; dropping a table does not delete S3 objects.',
          'Partitions (e.g. year/month/day) let Athena and Spectrum prune scans — must stay registered when new folders appear.',
          'Athena, Glue jobs, and Redshift Spectrum share the same catalog — define metadata once, query from multiple engines.',
        ]}
      />
    </LessonArticle>
  )
}
