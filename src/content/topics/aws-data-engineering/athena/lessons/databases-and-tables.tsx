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

export function DatabasesAndTables() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Metadata vs files">
        When you create an Athena <strong className="text-white">database</strong> or{' '}
        <strong className="text-white">table</strong>, you are not uploading data into Athena. You are
        registering <em>logical metadata</em> — names, column types, S3 locations, file format — in the
        Glue Data Catalog so the query engine knows which objects to open. The actual bytes stay in S3,
        exactly where your ingest pipeline put them.
      </Callout>

      <Definition term="Database in Athena">
        <p>
          An Athena <strong className="text-white">database</strong> is a container in the catalog — similar
          to a schema in PostgreSQL or a dataset in BigQuery. It groups related tables under one name, e.g.{' '}
          <code className="text-core-400">de_lake_dev</code> for development lake tables and{' '}
          <code className="text-core-400">de_lake_prod</code> for production. Creating a database is cheap
          metadata; it does not imply storage cost until files exist under table locations.
        </p>
      </Definition>

      <LessonSection title="Databases and tables — logical layer over files">
        <p className="text-slate-300">
          Traditional databases store rows on disk managed by the DBMS. In a lake,{' '}
          <strong className="text-white">S3 is the disk</strong> and the catalog is the card catalog. A
          table row in Glue says: &quot;these columns, this SerDe, this S3 prefix, these partition keys.&quot;
          Athena&apos;s planner uses that card to build a scan plan over matching S3 objects.
        </p>
        <ContentStep number={1} title="Fully qualified names">
          <p className="text-slate-300">
            Reference tables as{' '}
            <code className="text-core-400">database_name.table_name</code> — e.g.{' '}
            <code className="text-core-400">de_lake_dev.orders</code>. The Athena query editor lets you pick
            database from a dropdown; SQL always uses the two-part name (or sets a default database for the
            session).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tables without data still exist">
          <p className="text-slate-300">
            You can run <code className="text-core-400">CREATE TABLE</code> pointing at an empty S3 prefix.
            Queries succeed structurally but return zero rows until files land. Common during pipeline
            bootstrap — DDL first, Glue job second.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue console and Athena share the same catalog">
          <p className="text-slate-300">
            Create or edit tables in Athena Query editor (DDL), AWS Glue console, or Glue crawlers — all
            write to the same Glue Data Catalog. Change a column type in Glue and Athena sees it on the
            next query.
          </p>
        </ContentStep>
        <Flowchart
          title="Logical table maps to S3 objects"
          chart={`flowchart TB
  subgraph Catalog["Glue Data Catalog"]
    DB[Database de_lake_dev]
    TBL[Table orders columns and partitions]
    DB --> TBL
  end
  subgraph Storage["S3"]
    P1[curated/orders/year=2026/month=03/part-000.parquet]
    P2[curated/orders/year=2026/month=03/part-001.parquet]
  end
  TBL -->|LOCATION and partitions| P1
  TBL --> P2
  ATH[Athena SELECT] --> TBL
  ATH --> P1
  ATH --> P2`}
        />
      </LessonSection>

      <LessonSection title="External tables concept">
        <Definition term="External table">
          <p>
            An <strong className="text-white">external table</strong> (the default for lake data) stores
            metadata in the catalog but data files remain in S3 under the table&apos;s{' '}
            <code className="text-core-400">LOCATION</code>. Dropping an external table with{' '}
            <code className="text-core-400">DROP TABLE</code> removes catalog entry only — files persist.
            Use <code className="text-core-400">DROP TABLE ... PURGE</code> only when you intentionally
            delete underlying data (supported for certain table types; know your syntax before prod use).
          </p>
        </Definition>
        <ContentStep number={1} title="Managed vs external — Athena lake context">
          <p className="text-slate-300">
            In Redshift and Hive, &quot;managed&quot; tables move data into warehouse-controlled storage.
            Athena lake workflows almost always use <em>external</em> tables so Glue, Spark, and Spectrum
            share the same S3 files — one physical copy, many SQL engines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What DDL defines">
          <p className="text-slate-300">
            Column names and types, <code className="text-core-400">STORED AS</code> format (Parquet, CSV,
            etc.), <code className="text-core-400">LOCATION 's3://...'</code>, optional{' '}
            <code className="text-core-400">PARTITIONED BY</code> columns, and SerDe properties for
            delimiters or JSON paths. Mismatch between DDL types and actual file content causes runtime
            errors or null garbage — validate after schema changes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Crawlers vs hand-written DDL">
          <p className="text-slate-300">
            Glue crawlers infer schema from sample files — fast for raw zones with evolving JSON. Hand-written
            DDL in Athena — stable for curated Parquet with known schema. Production curated tables usually
            get explicit DDL or IaC (CloudFormation, Terraform) to avoid crawler drift.
          </p>
        </ContentStep>
        <Example title="Minimal external table DDL" caption="Curated CSV orders — beginner pattern">
{`CREATE EXTERNAL TABLE IF NOT EXISTS de_lake_dev.orders (
  order_id   STRING,
  customer_id STRING,
  amount     DOUBLE,
  order_ts   TIMESTAMP
)
ROW FORMAT SERDE 'org.apache.hadoop.hive.serde2.lazy.LazySimpleSerDe'
WITH SERDEPROPERTIES ('serialization.format' = ',', 'field.delim' = ',')
STORED AS TEXTFILE
LOCATION 's3://acme-lake-dev/curated/orders/'
TBLPROPERTIES ('skip.header.line.count'='1');`}
        </Example>
        <Callout variant="tip" title="Parquet tables are simpler DDL">
          For Parquet, prefer{' '}
          <code className="text-core-400">STORED AS PARQUET</code> — schema lives in file footers; omit
          row-format SerDe boilerplate. Most DE curated tables use Parquet DDL created by Glue jobs or
          CTAS, not manual CSV SerDe blocks.
        </Callout>
      </LessonSection>

      <LessonSection title="Partitions — table metadata that points at path segments">
        <p className="text-slate-300">
          Partitioned tables add directory levels that map to column values —{' '}
          <code className="text-core-400">year=2026/month=03/</code>. Each partition is a separate catalog
          entry pointing at a sub-prefix. Athena uses partition columns in{' '}
          <code className="text-core-400">WHERE</code> clauses to skip irrelevant folders — essential for
          cost and speed at scale.
        </p>
        <ContentStep number={1} title="Partition columns are not in the file (usually)">
          <p className="text-slate-300">
            Hive-style layout stores partition values in the path, not as repeated columns inside every
            Parquet row (though you can also materialize them in file).{' '}
            <code className="text-core-400">PARTITIONED BY (year STRING, month STRING)</code> in DDL tells
            Athena how paths relate to filters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="New folders need catalog updates">
          <p className="text-slate-300">
            When a Glue job writes a new day partition, Athena does not always see it automatically. Run{' '}
            <code className="text-core-400">MSCK REPAIR TABLE</code>, use Glue crawler, or add partitions
            via API — a beginner gotcha when &quot;files exist in S3 but query returns zero rows.&quot;
          </p>
        </ContentStep>
        <Flowchart
          title="Partition pruning on query"
          chart={`flowchart LR
  SQL["SELECT ... WHERE year='2026' AND month='03'"]
  SQL --> PLAN[Athena planner reads partition list]
  PLAN --> SKIP[Skip year=2025 prefixes]
  PLAN --> SCAN[Scan only month=03 paths]
  SCAN --> OUT[Result rows]`}
        />
      </LessonSection>

      <LessonSection title="Views and naming hygiene">
        <ContentStep number={1} title="Views as friendly aliases">
          <p className="text-slate-300">
            <code className="text-core-400">CREATE VIEW recent_orders AS SELECT ...</code> hides partition
            filters and joins from analysts — standard pattern for exposing gold-layer semantics without
            copying data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Environment in database names">
          <p className="text-slate-300">
            Separate databases per environment (<code className="text-core-400">de_lake_dev</code>,{' '}
            <code className="text-core-400">de_lake_prod</code>) prevent accidental cross-env queries in
            the editor — clearer than relying on table name suffixes alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Table names match S3 zones">
          <p className="text-slate-300">
            Align names with lake zones: <code className="text-core-400">raw_events</code>,{' '}
            <code className="text-core-400">processed_orders</code>,{' '}
            <code className="text-core-400">curated_sales_daily</code>. Future-you maps Console breadcrumbs
            to S3 prefixes without opening the catalog JSON.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Strong Athena beginners ask: where do files live (S3 prefix), what catalog entry points there
          (database.table), and are partitions registered? Answer those three before debugging &quot;empty
          query results.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena databases and tables are catalog metadata — logical names and schema over files in S3, not copies inside Athena.',
          'External tables are the lake default: DROP TABLE removes metadata; S3 files remain unless you delete them separately.',
          'DDL defines columns, format, LOCATION, and partitions; crawlers or MSCK REPAIR keep partitions in sync with new S3 folders.',
          'Use environment-scoped database names and curated Parquet external tables for predictable analytics paths.',
        ]}
      />
    </LessonArticle>
  )
}
