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

export function RdsInDataPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Extract without breaking the source">
        RDS is the most common <strong className="text-white">operational source</strong> in AWS data
        pipelines. Data engineers choose among batch dump, change data capture (CDC), and managed replication
        (DMS) — balancing freshness, prod impact, and operational complexity.
      </Callout>

      <Definition term="RDS extraction patterns">
        <p>
          <strong className="text-white">Batch dump</strong> — periodic full or incremental JDBC export,
          pg_dump, or snapshot export to S3. <strong className="text-white">CDC</strong> — continuous capture
          of inserts/updates/deletes via binlog (MySQL) or logical replication (Postgres).{' '}
          <strong className="text-white">AWS DMS</strong> — managed service implementing batch and CDC
          replication from RDS to S3, Redshift, or another database.
        </p>
      </Definition>

      <LessonSection title="Batch dump patterns">
        <ContentStep number={1} title="JDBC full extract">
          <p className="text-slate-300">
            Glue or custom job runs SELECT * (prefer keyed incremental WHERE updated_at &gt; watermark) →
            writes Parquet to S3 bronze. Simple, scheduled nightly. Load on RDS during off-peak; watch
            Performance Insights for scan-heavy tables without indexes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Native dump utilities">
          <p className="text-slate-300">
            Postgres pg_dump / MySQL mysqldump on EC2 or Glue shell — logical export to S3. Good for schema +
            data migration; less ideal for daily incremental at billion-row scale compared to CDC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Snapshot export to S3">
          <p className="text-slate-300">
            RDS snapshot export produces Parquet without live JDBC load — serverless, consistent
            point-in-time. Best for initial lake backfill or weekly full refresh alongside daily CDC delta.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Change Data Capture (CDC)">
        <ContentStep number={1} title="Logical replication (Postgres)">
          <p className="text-slate-300">
            Enable <code className="text-core-400">rds.logical_replication</code> — publication on source
            tables, subscription or DMS task consumes WAL changes. Near-real-time rows land in S3 or staging
            DB — minutes latency typical.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Binlog (MySQL)">
          <p className="text-slate-300">
            DMS reads ROW-format binlog — captures every change. Requires adequate binlog retention and
            monitoring slot lag. Schema changes (ALTER) need pipeline coordination — DMS handles many but not
            all DDL events gracefully.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Merge into curated lake">
          <p className="text-slate-300">
            CDC files arrive as INSERT/UPDATE/DELETE events — Glue job merges into curated Parquet (or Iceberg
            for ACID MERGE). Downstream Redshift COPY or Spectrum external tables consume curated output.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="AWS DMS teaser">
        <ContentStep number={1} title="What DMS provides">
          <p className="text-slate-300">
            Database Migration Service runs replication instance in VPC — source endpoint (RDS), target
            endpoint (S3, Redshift, Kinesis, another RDS). Full load + ongoing CDC in one task. Handles
            many engine pairs — DE teams use S3 target with Parquet partitioning for lake ingest.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to choose DMS">
          <p className="text-slate-300">
            Need sub-hour freshness without custom binlog consumers; migrating tables incrementally; replicating
            to Redshift staging continuously. Skip DMS for weekly batch only — Glue JDBC may suffice.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Operational cautions">
          <p className="text-slate-300">
            DMS adds load on source (WAL/binlog readers). Size replication instance appropriately; monitor{' '}
            <code className="text-core-400">CDCLatencySource</code>. Table with no primary key requires LOB
            handling and full-row comparisons — fix schema first.
          </p>
        </ContentStep>
        <Flowchart
          title="App → RDS → lake pipeline"
          chart={`flowchart LR
  APP[Application OLTP]
  RDS[RDS source Multi-AZ]
  subgraph extract [Extract layer]
    BATCH[Batch JDBC / snapshot export]
    CDC[DMS CDC binlog WAL]
  end
  S3B[S3 bronze CDC or batch]
  GLUE[Glue merge curated]
  S3C[S3 curated Parquet]
  WH[Redshift or Athena]
  APP --> RDS
  RDS --> BATCH
  RDS --> CDC
  BATCH --> S3B
  CDC --> S3B
  S3B --> GLUE
  GLUE --> S3C
  S3C --> WH`}
        />
      </LessonSection>

      <LessonSection title="Pattern selection guide">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Requirement</th>
                <th className="px-4 py-3">Recommended pattern</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Nightly warehouse refresh', 'Incremental JDBC or snapshot export → Glue → COPY'],
                ['Near-real-time dashboard', 'DMS CDC → S3 → stream processing or micro-batch Glue'],
                ['Initial historical backfill', 'Snapshot export to Parquet — then enable CDC for delta'],
                ['One-time migration off RDS', 'DMS full load to target DB or S3 — cutover window'],
                ['Minimal ops custom code', 'DMS managed CDC over self-built Debezium on EC2'],
              ].map(([req, pattern]) => (
                <tr key={req} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{req}</td>
                  <td className="px-4 py-3">{pattern}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Hybrid batch + CDC" caption="Production medallion ingest">
{`Sunday 02:00 — snapshot export full orders table to s3://lake/bronze/orders/snapshot/
Every 5 min — DMS CDC appends to s3://lake/bronze/orders/cdc/date=...
Hourly Glue — merge CDC into curated orders Parquet (dedupe by primary key)
03:00 Redshift COPY — gold fact_orders from curated prefix
Validation — Athena row count vs RDS COUNT(*) on read replica`}
        </Example>
        <Callout variant="insight">
          Golden rule: minimize direct SELECT load on prod primary — use replicas for validation, snapshot
          export for bulk, DMS for continuous change — never ad hoc analyst access to OLTP.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Batch dump: JDBC incremental, pg_dump, snapshot export — simple, off-peak, good for nightly refresh.',
          'CDC: binlog/WAL capture — near-real-time; requires replication params and merge logic in Glue.',
          'DMS: managed full load + CDC to S3/Redshift — default for continuous RDS → lake without custom consumers.',
          'Pipeline flow: App → RDS → bronze S3 → Glue curated → Redshift/Athena — protect prod at every step.',
          'Choose pattern by freshness SLA: nightly = batch; sub-hour = DMS CDC; backfill = snapshot export first.',
        ]}
      />
    </LessonArticle>
  )
}
