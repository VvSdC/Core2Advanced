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

export function FirstSqlQuery() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your first lake SELECT">
        If you can write basic SQL, you can use Athena. Pick a database, choose a table registered over S3,
        type a <code className="text-core-400">SELECT</code>, and run. Athena handles distributed reads
        across files. This lesson walks through the query editor mental model and a toy example you can
        adapt once your dev lake has a curated table — or run against sample data AWS documents in tutorials.
      </Callout>

      <Definition term="Query execution">
        <p>
          Each time you click <strong className="text-white">Run</strong> (or call{' '}
          <code className="text-core-400">StartQueryExecution</code>), Athena starts a{' '}
          <strong className="text-white">query execution</strong> — a single job with a unique ID. It
          transitions through states: <code className="text-core-400">QUEUED</code>,{' '}
          <code className="text-core-400">RUNNING</code>, then{' '}
          <code className="text-core-400">SUCCEEDED</code> or <code className="text-core-400">FAILED</code>.
          Results appear in the Console and as files under your query result location in S3.
        </p>
      </Definition>

      <LessonSection title="Query editor mental model">
        <p className="text-slate-300">
          The Athena query editor in the AWS Console is three panes in practice: a{' '}
          <strong className="text-white">database selector</strong> (which catalog namespace to use), a{' '}
          <strong className="text-white">SQL editor</strong> (one or more statements separated by
          semicolons), and a <strong className="text-white">results/history</strong> area showing recent
          executions, data scanned, and output rows.
        </p>
        <ContentStep number={1} title="Set database context">
          <p className="text-slate-300">
            Choose <code className="text-core-400">de_lake_dev</code> (or your dev database) from the
            dropdown so unqualified table names resolve correctly. Alternatively prefix every table:{' '}
            <code className="text-core-400">de_lake_dev.orders</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Configure results location first">
          <p className="text-slate-300">
            Before the first query, set Settings → Query result location to{' '}
            <code className="text-core-400">s3://acme-athena-results/</code> (or a workgroup override).
            Without it, queries fail fast — Athena has nowhere to write output.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Run one statement at a time while learning">
          <p className="text-slate-300">
            Highlight a single <code className="text-core-400">SELECT</code> and click Run, or run the whole
            buffer if only one statement is present. DDL (<code className="text-core-400">CREATE TABLE</code>
            ) and DML behave the same execution lifecycle — only result preview differs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Read execution details">
          <p className="text-slate-300">
            After success, check <strong className="text-white">Data scanned</strong> — your first cost
            signal. Open the query ID in History to see runtime, SQL text, and link to result files in S3.
            Failed queries show error messages (syntax, missing partition, type mismatch) inline.
          </p>
        </ContentStep>
        <Flowchart
          title="Console query flow"
          chart={`flowchart TD
  A[Open Athena query editor]
  A --> B[Select database]
  B --> C[Confirm result location configured]
  C --> D[Write SQL SELECT]
  D --> E[Run query]
  E --> F{Succeeded?}
  F -->|Yes| G[View rows and data scanned]
  F -->|No| H[Read error fix SQL or catalog]
  G --> I[Optional download CSV from results]`}
        />
      </LessonSection>

      <LessonSection title="Running a simple SELECT">
        <p className="text-slate-300">
          Start with read-only queries — no{' '}
          <code className="text-core-400">DROP</code> or{' '}
          <code className="text-core-400">DELETE</code> until you understand external tables. Pattern:
          filter early, limit while exploring, select named columns instead of{' '}
          <code className="text-core-400">*</code> on large tables.
        </p>
        <ContentStep number={1} title="Peek at shape — LIMIT">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT * FROM de_lake_dev.orders LIMIT 10;</code> — confirms
            table exists, columns deserialize correctly, and sample values look sane. Cheap on small
            partitions; still mind data scanned on huge unpartitioned CSV.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Count rows for a partition">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT COUNT(*) FROM de_lake_dev.orders WHERE year = '2026' AND month = '03';</code>{' '}
            — classic post-load validation comparing to Glue job metrics or SNS alert thresholds.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Aggregate for QA">
          <p className="text-slate-300">
            <code className="text-core-400">SELECT COUNT(*), SUM(amount) FROM ... GROUP BY day</code> —
            catches partial loads and amount drift before BI tools refresh.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Example SQL against a toy table">
        <p className="text-slate-300">
          Imagine a dev curated table <code className="text-core-400">de_lake_dev.sample_orders</code> with
          five columns, Parquet files under{' '}
          <code className="text-core-400">s3://acme-lake-dev/curated/sample_orders/</code>, partitioned by{' '}
          <code className="text-core-400">year</code> and <code className="text-core-400">month</code>.
          Below is a progressive drill — run in order.
        </p>
        <Example title="Step 1 — sample rows" caption="Verify readability">
{`SELECT
  order_id,
  customer_id,
  amount,
  order_ts
FROM de_lake_dev.sample_orders
WHERE year = '2026'
  AND month = '03'
LIMIT 10;`}
        </Example>
        <Example title="Step 2 — daily row counts" caption="Post-ingest sanity check">
{`SELECT
  year,
  month,
  CAST(day AS INT) AS day,
  COUNT(*) AS order_count
FROM de_lake_dev.sample_orders
WHERE year = '2026'
  AND month = '03'
GROUP BY year, month, day
ORDER BY day;`}
        </Example>
        <Example title="Step 3 — simple business metric" caption="Revenue by customer">
{`SELECT
  customer_id,
  COUNT(*) AS orders,
  ROUND(SUM(amount), 2) AS total_amount
FROM de_lake_dev.sample_orders
WHERE year = '2026'
  AND month = '03'
GROUP BY customer_id
ORDER BY total_amount DESC
LIMIT 20;`}
        </Example>
        <Callout variant="tip" title="Highlight partial SQL">
          In the editor, select only the lines of one query before Run — handy when your buffer contains
          notes or multiple examples. Same pattern as SQL clients on traditional databases.
        </Callout>
      </LessonSection>

      <LessonSection title="Common first-query failures">
        <ContentStep number={1} title="TABLE_NOT_FOUND">
          <p className="text-slate-300">
            Wrong database selected or typo in{' '}
            <code className="text-core-400">database.table</code>. Confirm table in Glue console under the
            same account and region.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No output location">
          <p className="text-slate-300">
            Error mentions output bucket — set query result location in Settings or workgroup before retry.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Access denied on S3">
          <p className="text-slate-300">
            Your IAM user or role needs <code className="text-core-400">s3:GetObject</code> on table data
            and <code className="text-core-400">s3:PutObject</code> on results prefix, plus{' '}
            <code className="text-core-400">athena:StartQueryExecution</code> and Glue read permissions.
            Least-privilege IAM lessons apply directly here.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Zero rows but files exist">
          <p className="text-slate-300">
            Missing partition registration or wrong <code className="text-core-400">WHERE</code> filter.
            List S3 prefix in Console, compare to partition columns, run repair or crawler — covered in
            advanced catalog lessons.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Your first successful Athena query proves the full chain: IAM allows access, catalog entry matches
          S3 layout, result location accepts writes, SQL syntax is valid. That end-to-end path is the same
          for every production analytics workflow on the lake.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Query editor: pick database, confirm result location, write SQL, run, inspect rows and data scanned.',
          'Start with LIMIT and partition-filtered SELECTs — validate shape before heavy aggregations.',
          'Each run is a query execution with an ID, state, and S3 result files — check History for debugging.',
          'TABLE_NOT_FOUND, missing output location, and IAM S3 errors are the usual beginner blockers.',
        ]}
      />
    </LessonArticle>
  )
}
