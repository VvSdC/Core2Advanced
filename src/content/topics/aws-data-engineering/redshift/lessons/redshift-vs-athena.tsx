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

export function RedshiftVsAthena() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two SQL engines, complementary roles">
        You already learned Athena — serverless SQL on S3, pay per scan, perfect for lake exploration. Redshift
        is the provisioned warehouse for loaded data and concurrent BI. Both use SQL and often share the same
        Glue catalog, but they answer different questions in the DE lifecycle:{' '}
        <strong className="text-white">what is in the lake right now?</strong> vs{' '}
        <strong className="text-white">what do our certified dashboards need every hour?</strong>
      </Callout>

      <Definition term="Warehouse vs serverless lake SQL">
        <p>
          <strong className="text-white">Athena (serverless lake SQL):</strong> queries external tables on
          S3 in place — no cluster to size, billing tied to data scanned per query, ideal for ad hoc,
          intermittent, and exploratory workloads.{' '}
          <strong className="text-white">Redshift (warehouse):</strong> loads hot subsets into local
          columnar storage with MPP compute reserved for your team — ideal for repeatable queries, strict
          latency, and many concurrent users on the same marts.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Athena</th>
                <th className="px-4 py-3">Redshift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Data location', 'Files stay on S3 — external tables', 'Primary data in cluster local storage; Spectrum for S3 external'],
                ['Compute model', 'Serverless per query — no nodes to manage', 'Provisioned cluster or Serverless RPU capacity'],
                ['Pricing shape', 'Pay per TB scanned (+ optional engine fees)', 'Pay for cluster uptime / RPU-hours while capacity runs'],
                ['Setup friction', 'Low — DDL, result location, partition filters', 'Higher — cluster, IAM for COPY, dist/sort design'],
                ['Latency profile', 'Varies with scan size; cold queries on huge tables slower', 'Tuned marts — consistent low-second BI when designed well'],
                ['Concurrency control', 'Shared service limits; no custom WLM queues', 'WLM queues, concurrency scaling, workload isolation'],
                ['Best DE use', 'QA, exploration, one-off exports, raw zone peeks', 'Certified marts, nightly dbt, QuickSight at scale'],
              ].map(([dim, ath, rs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{ath}</td>
                  <td className="px-4 py-3">{rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="When warehouse vs when lake SQL"
          chart={`flowchart TB
  S3[S3 curated Parquet]
  S3 --> ATH[Athena ad hoc and QA]
  S3 --> COPY[COPY into Redshift]
  COPY --> RS[Redshift local marts]
  S3 --> SPEC[Spectrum external join]
  SPEC --> RS
  ATH --> DEC[Validate before load]
  DEC --> COPY
  RS --> BI[Dashboards SLA queries]`}
        />
      </LessonSection>

      <LessonSection title="When to use Athena">
        <ContentStep number={1} title="Pipeline validation">
          <p className="text-slate-300">
            Partition row counts, null rates, duplicate keys after Glue — Athena against curated S3 before
            triggering Redshift COPY. Pairs with SNS/CloudWatch: alarm fires, Athena confirms data shape.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Exploring raw and new sources">
          <p className="text-slate-300">
            JSON landed in <code className="text-core-400">raw/</code> from a new vendor — external table
            and exploratory SELECT before investing in warehouse DDL and load jobs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Sporadic or unpredictable questions">
          <p className="text-slate-300">
            Legal one-time export, quarterly ad hoc analysis — scan cost matches usage. Keeping a warehouse
            warm for those alone is often wasteful.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Early-stage teams">
          <p className="text-slate-300">
            S3 + Glue + Athena + QuickSight direct to Athena can carry a small org for months. Add Redshift
            when dashboard concurrency or repeated scan cost hurts — not by default on day one.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When to use Redshift">
        <ContentStep number={1} title="Repeated heavy queries">
          <p className="text-slate-300">
            Same revenue mart queried every hour by twelve dashboards — loading once and querying local
            columnar storage beats re-scanning terabytes in Athena each time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Complex joins at scale">
          <p className="text-slate-300">
            Multi-table star joins with billion-row facts — MPP with distribution keys and sort keys targets
            this. Athena handles joins too, but performance and cost on hot paths favor loaded warehouse
            tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Concurrency and SLAs">
          <p className="text-slate-300">
            WLM separates ETL from analysts; concurrency scaling adds burst capacity. Athena lacks the same
            fine-grained queue control for mixed workloads.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Governed semantic layer">
          <p className="text-slate-300">
            dbt models materialized in Redshift, row-level security, audited certified tables — the serving
            tier stakeholders trust for official numbers.
          </p>
        </ContentStep>
        <Example title="DE workflow — Athena QA then Redshift load" caption="Nightly sales pipeline">
{`06:00 Glue writes s3://lake/curated/sales/year=2026/month=03/day=15/
06:10 Athena: SELECT COUNT(*), SUM(amount) ... WHERE year='2026' AND month='03' AND day='15'
06:15 Count within tolerance — trigger COPY into analytics.fact_sales
06:30 dbt tests on Redshift — QuickSight refresh on marts
Ad hoc questions same day? Analysts use Athena on lake; exec dashboard? Redshift mart.`}
        </Example>
      </LessonSection>

      <LessonSection title="Complementary use — the modern AWS pattern">
        <p className="text-slate-300">
          Lake-first storage on S3, shared Glue Data Catalog, Athena as the self-service exploration and QA
          layer, Redshift as the optional (often eventual) serving layer for hot metrics. Data engineers
          orchestrate Glue/Lambda to maintain S3; analysts self-serve in Athena; promoted datasets COPY into
          warehouse marts when access patterns justify it.
        </p>
        <ContentStep number={1} title="Spectrum overlaps Athena's turf">
          <p className="text-slate-300">
            Redshift Spectrum queries external Glue tables on S3 from Redshift SQL — useful when a query
            joins a small local dimension table with a huge S3 fact without loading the entire fact locally.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Same files, two front doors">
          <p className="text-slate-300">
            Curated Parquet in S3 is truth for replay and ML. Redshift holds a performance-optimized subset
            or copy — not a fork of business logic, ideally built from the same dbt sources targeting both
            Athena CTAS and Redshift COPY.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost tradeoff is access-pattern driven">
          <p className="text-slate-300">
            If hourly dashboards scan 2 TB in Athena, monthly scan cost may exceed a small Redshift cluster
            plus one nightly COPY. If queries are rare, Athena wins. Measure, do not assume.
          </p>
        </ContentStep>
        <Flowchart
          title="Medallion with Athena and Redshift front doors"
          chart={`flowchart LR
  RAW[Raw S3] --> PROC[Glue Spark ETL]
  PROC --> CUR[Curated S3 Parquet]
  CUR --> ATH2[Athena explore QA]
  CUR --> WH[Redshift marts when needed]
  ATH2 --> PROM[Decide what to promote]
  PROM --> WH
  WH --> BI[QuickSight dashboards]`}
        />
        <Callout variant="insight">
          Sound bite: Athena optimizes flexible reads on object storage; Redshift optimizes fast repeatable
          analytics on loaded columnar data. Mature platforms use Athena daily and Redshift when concurrency
          and scan repetition demand it.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena: serverless SQL on S3, pay per scan — best for ad hoc lake queries, QA, and exploration.',
          'Redshift: MPP warehouse on loaded data — best for concurrent BI, predictable latency, and certified marts.',
          'Use Athena to validate partitions and explore raw data; COPY hot metrics to Redshift when scan cost or concurrency grows.',
          'Glue catalog ties both together; Spectrum lets Redshift query S3 external tables alongside local facts — complementary, not either-or.',
        ]}
      />
    </LessonArticle>
  )
}
