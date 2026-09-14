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

export function OltpVsOlap() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two kinds of database work">
        Not every database exists for the same reason. Your shopping app needs millisecond inserts when
        someone clicks &quot;Buy now.&quot; Your finance team needs to sum revenue across three years of
        orders. Those are different workloads —{' '}
        <strong className="text-white">OLTP</strong> (online transaction processing) vs{' '}
        <strong className="text-white">OLAP</strong> (online analytical processing). Redshift is built for
        OLAP. Understanding the split explains why warehouses exist and why you do not run BI on your
        production RDS instance.
      </Callout>

      <Definition term="OLTP vs OLAP">
        <p>
          <strong className="text-white">OLTP</strong> systems handle day-to-day business operations — many
          small, fast reads and writes on current data (place order, update inventory, log in).{' '}
          <strong className="text-white">OLAP</strong> systems handle analysis — fewer, heavier queries
          scanning large historical datasets (trends, cohorts, executive KPIs). Data engineers move data from
          OLTP sources into lakes and warehouses so analytics never starve production apps.
        </p>
      </Definition>

      <LessonSection title="OLTP — plain English">
        <p className="text-slate-300">
          Think of the database behind a live product: each user action triggers a tiny, urgent operation.
          The system must stay correct under concurrency — two people cannot buy the last item — and respond
          in milliseconds.
        </p>
        <ContentStep number={1} title="Many short transactions">
          <p className="text-slate-300">
            Insert one order row, update account balance, fetch user profile — thousands per second, each
            touching a small number of rows.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Normalized schema">
          <p className="text-slate-300">
            Tables split to avoid duplication (customers, orders, order_items) — efficient writes, but
            analytics queries need many joins even for simple reports.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS examples">
          <p className="text-slate-300">
            Amazon RDS, Aurora, DynamoDB — operational stores for applications. DE pipelines{' '}
            <em>extract</em> from these; they rarely <em>query</em> them for nightly BI at scale.
          </p>
        </ContentStep>
        <Example title="OLTP-style query" caption="Application database — one customer">
{`SELECT order_id, total, status
FROM orders
WHERE customer_id = 8842
ORDER BY created_at DESC
LIMIT 20;

Touches ~20 rows — fast index lookup on customer_id.`}
        </Example>
      </LessonSection>

      <LessonSection title="OLAP — plain English">
        <p className="text-slate-300">
          Think of the questions analysts and executives ask across months or years of history. Queries
          scan millions or billions of rows, aggregate, group, and join — seconds to minutes is acceptable if
          the answer is trustworthy and shared org-wide.
        </p>
        <ContentStep number={1} title="Fewer, heavier queries">
          <p className="text-slate-300">
            Monthly revenue by region, funnel conversion by cohort, inventory turns across SKUs — each query
            may read huge portions of fact tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Denormalized or star-schema models">
          <p className="text-slate-300">
            Fact tables (events, sales) and dimension tables (date, product, store) designed for read
            performance — sometimes wide tables pre-joined in ETL to simplify BI.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS examples">
          <p className="text-slate-300">
            Amazon Redshift, Athena on curated Parquet, OpenSearch for log analytics — OLAP-oriented
            engines. S3 holds the files; Redshift and Athena compute on them.
          </p>
        </ContentStep>
        <Example title="OLAP-style query" caption="Warehouse — entire business history">
{`SELECT d.year, d.quarter, r.region_name, SUM(f.revenue) AS total_revenue
FROM fact_sales f
JOIN dim_date d ON f.date_key = d.date_key
JOIN dim_region r ON f.region_key = r.region_key
WHERE d.year BETWEEN 2022 AND 2025
GROUP BY 1, 2, 3;

Scans large fact slices — needs columnar MPP warehouse or partitioned lake SQL.`}
        </Example>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">OLTP</th>
                <th className="px-4 py-3">OLAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Primary goal', 'Run the business in real time', 'Understand the business over time'],
                ['Query pattern', 'Many small point lookups and writes', 'Few large scans and aggregations'],
                ['Data freshness', 'Current state — milliseconds old', 'Often batch — hours to a day lag OK'],
                ['Schema style', 'Normalized (3NF) for write integrity', 'Star/snowflake or wide marts for reads'],
                ['Concurrency', 'Thousands of app connections', 'Dozens to hundreds of analysts and dashboards'],
                ['Typical AWS service', 'RDS, Aurora, DynamoDB', 'Redshift, Athena on curated S3'],
                ['DE pipeline role', 'Source — CDC, exports, snapshots', 'Destination — COPY, dbt models, marts'],
              ].map(([dim, oltp, olap]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{oltp}</td>
                  <td className="px-4 py-3">{olap}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="OLTP source → ETL → OLAP warehouse"
          chart={`flowchart LR
  APP[Web or mobile app]
  APP --> OLTP[RDS OLTP database]
  OLTP --> ETL[Glue Lambda DMS export]
  ETL --> S3[S3 lake]
  S3 --> OLAP[Redshift OLAP warehouse]
  OLAP --> BI[Analysts and dashboards]`}
        />
      </LessonSection>

      <LessonSection title="Why warehouses exist for analytics">
        <ContentStep number={1} title="Protect production performance">
          <p className="text-slate-300">
            A rogue analyst running SELECT * on orders can lock or slow the checkout database. Warehouses
            isolate heavy reads from operational SLAs — the first reason DE teams build separate analytics
            paths.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Optimize storage for scans, not single-row updates">
          <p className="text-slate-300">
            Columnar MPP engines like Redshift are engineered for aggregations across history. OLTP row
            stores excel at indexed point lookups — wrong tool for petabyte GROUP BY.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integrate many sources into one model">
          <p className="text-slate-300">
            Revenue analysis needs CRM, billing, and product usage — three OLTP systems. The warehouse
            combines them into conformed dimensions and shared facts so &quot;one version of truth&quot; is
            queryable in one SQL dialect.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Governance and certification">
          <p className="text-slate-300">
            Finance certifies metrics in warehouse tables (dbt tests, row-level security, audit logs).
            Self-serve Athena on raw lake zones coexists, but board slides come from governed marts in
            Redshift.
          </p>
        </ContentStep>
        <Callout variant="tip" title="DE sound bite">
          OLTP feeds the business; OLAP explains the business. Pipelines copy OLTP data out — never let BI
          query prod directly at scale.
        </Callout>
      </LessonSection>

      <LessonSection title="Common beginner mistakes">
        <ContentStep number={1} title="Running dashboards on RDS replicas">
          <p className="text-slate-300">
            Read replicas help moderate read load but still row-oriented and not designed for cross-table
            billion-row aggregations. They are a band-aid, not a warehouse strategy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Treating Redshift like an app database">
          <p className="text-slate-300">
            Single-row INSERT loops from Lambda, frequent UPDATE on wide tables, no sort/dist keys — anti-patterns
            that fight Redshift&apos;s bulk-load, read-optimized design.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Skipping the lake hop">
          <p className="text-slate-300">
            Some teams COPY straight from RDS exports to Redshift (valid). Many land on S3 first for replay,
            Athena QA, and multiple consumers — lake as hub, warehouse as serving node.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Redshift belongs on the OLAP side of your architecture diagram. Every OLTP box should have an arrow
          leaving it toward S3 or the warehouse — never a thick arrow from BI straight into prod.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'OLTP = many fast small transactions on current data (RDS, DynamoDB); OLAP = heavy analytical queries on historical data (Redshift, Athena).',
          'Warehouses exist to isolate analytics from production, optimize columnar scans, and integrate multiple sources into one model.',
          'DE pipelines extract from OLTP sources, land on S3, and load curated tables into Redshift for BI — never run large BI on prod OLTP.',
          'Redshift is an OLAP engine — bulk COPY loads, star schemas, and MPP queries — not a substitute for application databases.',
        ]}
      />
    </LessonArticle>
  )
}
