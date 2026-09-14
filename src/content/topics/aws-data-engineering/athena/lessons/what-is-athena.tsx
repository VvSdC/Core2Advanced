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

export function WhatIsAthena() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Athena is AWS&apos;s managed{' '}
        <strong className="text-white">serverless SQL query service</strong> for data in S3. You write
        familiar SQL — <code className="text-core-400">SELECT</code>,{' '}
        <code className="text-core-400">WHERE</code>, <code className="text-core-400">GROUP BY</code> — in
        a browser editor; Athena reads files from your lake and returns rows. No servers to launch, no
        JDBC cluster URL to babysit. For data engineers, that means validating partitions, debugging ingest,
        and answering ad hoc questions on the same S3 paths Glue and Lambda already write.
      </Callout>

      <Definition term="Amazon Athena">
        <p>
          <strong className="text-white">Amazon Athena</strong> is an interactive, ANSI SQL-compatible
          query service built on distributed query engine technology (Presto/Trino lineage). It integrates
          with the AWS Glue Data Catalog for table metadata, reads open formats on S3 (CSV, JSON, Parquet,
          ORC, Avro, and more), and writes query results back to S3. Billing is primarily based on the
          amount of data scanned per query — covered in depth later in this sub-topic.
        </p>
      </Definition>

      <LessonSection title="Serverless query service">
        <p className="text-slate-300">
          <strong className="text-white">Serverless</strong> here means AWS operates the compute layer. You
          do not provision instances, choose node types, or scale a cluster before a big query. Open the
          Athena console (or call the API), submit SQL, and Athena allocates engine resources for that
          execution. When the query finishes, those resources are released — you are not paying for an idle
          warehouse overnight.
        </p>
        <ContentStep number={1} title="Interactive and batch-friendly">
          <p className="text-slate-300">
            Analysts run exploratory queries from the Console. Pipelines trigger Athena via API (
            <code className="text-core-400">StartQueryExecution</code>) for scheduled sanity checks — row
            count thresholds, duplicate detection, schema drift alerts. Same engine, different callers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Standard SQL surface">
          <p className="text-slate-300">
            Most team members already know SQL. Athena supports joins, window functions, CTAS (
            <code className="text-core-400">CREATE TABLE AS SELECT</code>), and common aggregations — enough
            for 80% of lake exploration without learning Spark syntax first.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Regional service">
          <p className="text-slate-300">
            Run Athena in the same region as your S3 bucket to avoid cross-region data transfer charges and
            latency. Table metadata in Glue is also regional —{' '}
            <code className="text-core-400">de_lake_dev.orders</code> in{' '}
            <code className="text-core-400">us-east-1</code> is separate from a homonymous table in{' '}
            <code className="text-core-400">eu-west-1</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Serverless query — no cluster lifecycle"
          chart={`flowchart TB
  USER[Analyst or Lambda API caller]
  USER --> SUB[Submit SQL to Athena]
  SUB --> ENG[Athena managed query engine]
  ENG --> S3READ[Read files from S3]
  S3READ --> RES[Write results to S3 prefix]
  RES --> DONE[Query complete — no servers left running]`}
        />
      </LessonSection>

      <LessonSection title="Athena and S3 — inseparable partners">
        <p className="text-slate-300">
          Athena does not store your dataset. <strong className="text-white">S3 holds the bytes</strong>;
          Athena holds no copy of your table data on its own disks. A table definition says &quot;column{' '}
          <code className="text-core-400">order_id</code> is a string, files live at{' '}
          <code className="text-core-400">s3://lake/curated/orders/</code>, format is Parquet.&quot; When
          you query, Athena lists and reads objects under that prefix (respecting partition filters).
        </p>
        <ContentStep number={1} title="External tables by default">
          <p className="text-slate-300">
            Lake tables are <em>external</em> — drop the table metadata and files remain in S3. Delete
            files from S3 and the table still exists but returns fewer or zero rows. DE teams manage both
            the catalog entry and the object lifecycle.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Same bucket layout as Glue and Spark">
          <p className="text-slate-300">
            Hive-style paths like{' '}
            <code className="text-core-400">curated/events/year=2026/month=03/day=15/part-000.parquet</code>{' '}
            are what Glue jobs write and Athena reads. One layout, many consumers — no duplicate export step
            for ad hoc SQL.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Results also live on S3">
          <p className="text-slate-400">
            Every query produces output files (CSV by default) in your configured results location — another
            S3 prefix, not an in-console-only grid with unlimited retention. Plan lifecycle rules on that
            prefix so scratch results do not accumulate forever.
          </p>
        </ContentStep>
        <Example title="DE scenario — validate last night&apos;s load" caption="Curated orders table">
{`S3 location: s3://acme-lake-dev/curated/orders/
Glue table:  de_lake_dev.orders (Parquet, partitioned by year/month/day)
Athena SQL:
  SELECT year, month, day, COUNT(*) AS row_count
  FROM de_lake_dev.orders
  WHERE year = '2026' AND month = '03' AND day = '14'
  GROUP BY 1, 2, 3;

Expected: one row with row_count matching Glue job log — if zero, alarm already fired via SNS, now you confirm missing partition.`}
        </Example>
      </LessonSection>

      <LessonSection title="Pay per data scanned (teaser)">
        <p className="text-slate-300">
          Athena&apos;s pricing model is simple to state and easy to get wrong in practice: you are charged
          for the volume of data Athena <em>scans</em> to answer your query, not for rows returned. A{' '}
          <code className="text-core-400">SELECT *</code> over a year of unpartitioned CSV costs far more
          than a{' '}
          <code className="text-core-400">SELECT order_id, amount WHERE year='2026' AND month='03'</code>{' '}
          on Snappy Parquet with partition pruning.
        </p>
        <ContentStep number={1} title="Why format matters immediately">
          <p className="text-slate-300">
            Columnar formats (Parquet, ORC) let Athena read only the columns referenced in SQL. Row formats
            (CSV, JSON lines) often require scanning entire rows even for one column — a beginner cost trap
            on large tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why partitions matter immediately">
          <p className="text-slate-300">
            Partition columns in the path let Athena skip whole prefixes. Forgetting{' '}
            <code className="text-core-400">WHERE year = ...</code> on a daily-partitioned fact table can
            scan terabytes instead of gigabytes — the most common Athena bill surprise for new teams.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Preview before you pay">
          <p className="text-slate-300">
            The Athena Console shows estimated data scanned before you run (when available). Use{' '}
            <code className="text-core-400">LIMIT 10</code> during exploration, filter early, and select
            only columns you need. Dedicated cost lessons come later; the habit starts here.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Cost mindset from day one">
          Treat every Athena query like a metered API call: partition filter + column list + Parquet in
          curated zones = predictable bills. Full-table CSV scans in raw = expensive archaeology.
        </Callout>
      </LessonSection>

      <LessonSection title="What Athena is not">
        <ContentStep number={1} title="Not a transactional OLTP database">
          <p className="text-slate-300">
            Athena is for analytics over files — not millisecond upserts on primary keys. Use RDS or
            DynamoDB for operational workloads; use Athena to analyze their exports landed on S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a always-on warehouse">
          <p className="text-slate-300">
            Redshift and similar warehouses optimize for concurrent BI dashboards and complex multi-table
            workloads with resident data. Athena excels at ad hoc lake SQL and federated reads — many teams
            use both. The warehouse teaser lesson compares them directly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a catalog by itself">
          <p className="text-slate-300">
            Athena consumes metadata from Glue (or a compatible Hive metastore). Crawlers, DDL, and partition
            maintenance live in the catalog/Glue layer — Athena queries what is registered. Missing
            partitions mean missing rows, not Athena bugs.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Athena sits naturally after S3 in your mental model: storage holds files, Glue names them as
          tables, Athena runs SQL. It connects forward to cost-aware lake design, QuickSight dashboards,
          and Redshift Spectrum — the query layer on every modern AWS data lake.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena is serverless interactive SQL — submit queries, AWS runs the engine, no cluster to manage.',
          'S3 stores data and query results; Athena reads external table metadata from Glue and scans files in place.',
          'Billing is driven by data scanned — format, column selection, and partitions are your first cost levers.',
          'Use Athena for lake analytics and validation; pair with Glue for metadata and Redshift when warehouse SLAs require it.',
        ]}
      />
    </LessonArticle>
  )
}
