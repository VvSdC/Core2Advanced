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

export function RedshiftVsRds() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Both speak SQL — different jobs">
        Amazon RDS and Amazon Redshift both expose SQL endpoints, so beginners often ask: &quot;Can we just
        use Postgres on RDS for analytics?&quot; You <em>can</em> query RDS for small reports, but RDS is
        an <strong className="text-white">OLTP operational database</strong>; Redshift is an{' '}
        <strong className="text-white">OLAP data warehouse</strong>. For data engineering, RDS is usually a{' '}
        <em>source</em> — Redshift is often a <em>destination</em> for curated analytics data.
      </Callout>

      <Definition term="RDS vs Redshift for DE">
        <p>
          <strong className="text-white">Amazon RDS</strong> runs managed relational engines (PostgreSQL,
          MySQL, etc.) optimized for transactional applications — indexed point reads, ACID row updates,
          moderate connection counts from app servers.{' '}
          <strong className="text-white">Amazon Redshift</strong> is a columnar MPP warehouse optimized for
          bulk loads, large aggregations, and concurrent BI — fed by ETL from RDS exports, CDC streams, or S3
          lake files, not by your checkout API.
        </p>
      </Definition>

      <LessonSection title="High-level comparison for data engineers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">RDS (OLTP)</th>
                <th className="px-4 py-3">Redshift (OLAP)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Primary workload',
                  'Application transactions — CRUD on live data',
                  'Analytics — scans, joins, aggregations on history',
                ],
                [
                  'Storage model',
                  'Row-oriented (Postgres/MySQL pages)',
                  'Columnar on local node disks',
                ],
                [
                  'Scale pattern',
                  'Vertical scale + read replicas',
                  'MPP cluster — add nodes for storage and parallelism',
                ],
                [
                  'Ingest pattern',
                  'Single-row INSERT/UPDATE from apps',
                  'Bulk COPY from S3, JDBC batch, or streaming ingest',
                ],
                [
                  'Query concurrency',
                  'App connection pools — many small queries',
                  'WLM queues — mix of ETL loads and analyst SQL',
                ],
                [
                  'Typical DE role',
                  'Source system — snapshots, DMS CDC, export to S3',
                  'Analytics mart — dbt models, QuickSight, certified KPIs',
                ],
                [
                  'Backup / HA',
                  'Multi-AZ, automated backups, point-in-time restore',
                  'Snapshots, cross-region snapshot copy, RA3 managed storage',
                ],
              ].map(([dim, rds, rs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{rds}</td>
                  <td className="px-4 py-3">{rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="RDS as source, Redshift as analytics destination"
          chart={`flowchart LR
  APP[Application servers]
  APP --> RDS[RDS PostgreSQL OLTP]
  RDS --> DMS[Database Migration Service or export]
  DMS --> S3[S3 staging Parquet]
  S3 --> COPY[Redshift COPY]
  COPY --> RS[Redshift marts]
  RS --> BI[BI and reporting]`}
        />
      </LessonSection>

      <LessonSection title="When RDS is the right tool">
        <ContentStep number={1} title="Powering a live product">
          <p className="text-slate-300">
            User accounts, shopping carts, workflow state — needs sub-100ms indexed lookups and strong
            transactional guarantees. This is RDS/Aurora territory, full stop.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Small internal admin tools">
          <p className="text-slate-300">
            A 10-user ops console querying thousands of rows — RDS with proper indexes is fine. No warehouse
            required until query complexity or data volume grows orders of magnitude.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Staging extracts before the lake">
          <p className="text-slate-300">
            Nightly pg_dump or logical export to S3 — RDS remains system of record; DE owns the path out,
            not ad hoc analyst access to prod.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When Redshift is the right tool">
        <ContentStep number={1} title="Cross-system analytics">
          <p className="text-slate-300">
            Join orders (from RDS export) with marketing spend (from SaaS CSV) and product events (from Kinesis
            pipeline) — warehouse conformed models, not federated prod queries.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Large historical scans">
          <p className="text-slate-300">
            Five years of line-item sales with daily dashboard refreshes — columnar MPP beats row store
            sequential scans even on a beefy RDS instance.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Many concurrent BI users">
          <p className="text-slate-300">
            QuickSight, Tableau, and SQL analysts hitting the same marts — Redshift WLM and concurrency
            scaling target this; RDS connection limits and lock contention become painful quickly.
          </p>
        </ContentStep>
        <Example title="DE scenario — why not query RDS directly?" caption="Black Friday post-mortem">
{`Analyst request: revenue by SKU for last 90 days with returns adjustment.

On RDS: full table scan on order_items + orders + returns — competes with checkout writes, no column pruning, replica lag risk.

On Redshift: fact_sales mart pre-aggregated nightly, sort key on date, DISTKEY on sku — dashboard query completes in seconds, zero prod impact.`}
        </Example>
      </LessonSection>

      <LessonSection title="How data moves from RDS to Redshift">
        <ContentStep number={1} title="Snapshot export to S3">
          <p className="text-slate-300">
            RDS snapshot export produces Parquet in S3 — serverless extract, then{' '}
            <code className="text-core-400">COPY</code> into staging tables. Good for periodic full or
            incremental batch loads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS DMS (CDC)">
          <p className="text-slate-300">
            Database Migration Service captures ongoing changes from RDS binlog/WAL into S3 or directly toward
            warehouse staging — near-real-time analytics without hammering RDS with SELECT.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lake-first pattern">
          <p className="text-slate-300">
            RDS → S3 (raw/bronze) → Glue transform → curated Parquet → Redshift COPY. Athena validates
            along the way; Redshift serves gold — the medallion pattern you will see in production.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Postgres compatibility note">
          Redshift SQL is PostgreSQL-<em>compatible</em>, not identical — no foreign keys enforced, different
          system catalogs, COPY/UNLOAD instead of pg_dump for bulk. Teams reuse mental models from Postgres
          but still read Redshift-specific docs for DDL and tuning.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision guide — quick reference">
        <p className="text-slate-300">
          Ask one question: <strong className="text-white">Is this workload serving a live application
          transaction, or analyzing historical data at scale?</strong> Transaction → RDS. Analytics at scale
          → Redshift (often after S3). When both — which is almost always — pipeline connects them; do not
          collapse them into one database tier.
        </p>
        <Callout variant="insight">
          Interview answer: RDS optimizes row-level OLTP; Redshift optimizes columnar OLAP. DE extracts from
          RDS, lands on S3, loads Redshift marts — protecting prod while enabling BI.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS = managed OLTP (Postgres/MySQL) for applications; Redshift = columnar MPP warehouse for analytics.',
          'Do not run large BI on production RDS — extract via DMS, snapshot export, or ETL to S3, then COPY to Redshift.',
          'RDS scales vertically with replicas; Redshift scales out with MPP nodes and bulk load patterns.',
          'Redshift SQL feels like Postgres but tuning (dist keys, sort keys, COPY) is warehouse-specific — treat them as complementary tiers.',
        ]}
      />
    </LessonArticle>
  )
}
