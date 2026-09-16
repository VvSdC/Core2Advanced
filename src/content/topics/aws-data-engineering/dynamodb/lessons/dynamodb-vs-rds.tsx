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

export function DynamodbVsRds() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="OLTP relational vs key-value at scale — different source systems">
        Data engineers ingest from both <strong className="text-white">Amazon RDS</strong> and{' '}
        <strong className="text-white">DynamoDB</strong> into the lake — but the tools, latency, and schema
        contracts differ sharply. RDS offers SQL, joins, and DMS CDC; DynamoDB offers predictable millisecond
        keyed access, Streams, and horizontal scale. Choosing wrong source assumptions breaks pipeline design
        and interview architecture questions.
      </Callout>

      <Definition term="DynamoDB vs RDS for data engineering">
        <p>
          <strong className="text-white">RDS</strong> is managed relational OLTP — JDBC, SQL dumps, DMS full
          load + CDC, snapshot export to S3. <strong className="text-white">DynamoDB</strong> is managed
          NoSQL — access by designed keys, DynamoDB Streams or export to S3, no arbitrary SQL joins on source.
          DE connects both to S3 bronze; extraction mechanism defines job architecture.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">DynamoDB</th>
                <th className="px-4 py-3">RDS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Data model', 'Key-value / document — PK + optional SK', 'Relational — tables, FKs, joins'],
                ['Query flexibility', 'GetItem/Query on keys and GSIs only', 'Full SQL — ad hoc SELECT, joins'],
                ['Scale pattern', 'Horizontal — partition by key design', 'Vertical + read replicas — connection limits'],
                ['Consistency', 'Eventually consistent default; per-item strong optional', 'ACID transactions across rows'],
                ['DE ingest primary', 'Streams + Lambda, export to S3, Kinesis adapter', 'DMS CDC, JDBC Glue, snapshot export'],
                ['Incremental CDC', 'DynamoDB Streams (24h window)', 'DMS logical replication, binlog/WAL'],
                ['Full snapshot', 'PITR export to S3', 'Snapshot export to S3, pg_dump, mysqldump'],
                ['Schema evolution', 'Schemaless items — lake handles variance', 'Migrations via DDL — DMS handles adds'],
                ['Analytics on source', 'Anti-pattern — Scan expensive', 'Anti-pattern — heavy BI on prod OLTP'],
                ['Typical DE role', 'Event/state source at extreme scale', 'System-of-record relational source'],
              ].map(([dim, ddb, rds]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{ddb}</td>
                  <td className="px-4 py-3">{rds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Pipeline patterns by source">
        <ContentStep number={1} title="When DynamoDB is the source">
          <p className="text-slate-300">
            Mobile clickstream, IoT device state, serverless cart, real-time feature store — app team chose
            DynamoDB for scale and ops simplicity. DE ingests via Streams → S3 → Glue silver, or scheduled
            PITR export for reconciliation snapshots. Never JDBC Glue connection to DynamoDB — use API/SDK
            patterns or export.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When RDS is the source">
          <p className="text-slate-300">
            ERP orders, billing, inventory with relational integrity — RDS/Aurora remains source of truth. DE
            uses DMS to S3 Parquet, or Glue JDBC with bookmark on updated_at column. Complex joins happen in
            silver/gold — not on operational RDS during extract.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hybrid platforms">
          <p className="text-slate-300">
            Orders in RDS, session events in DynamoDB — lake merges on customer_id in gold Redshift. Unified
            governance (Glue Catalog, Lake Formation) with separate bronze prefixes. Lineage tracks which mart
            columns originate from which source tier.
          </p>
        </ContentStep>
        <Flowchart
          title="Source routing to lake"
          chart={`flowchart LR
  DDB[DynamoDB OLTP NoSQL]
  RDS[RDS OLTP SQL]
  S3[(S3 bronze)]
  GLUE[Glue silver]
  DDB -->|Streams or export| S3
  RDS -->|DMS or JDBC| S3
  S3 --> GLUE`}
        />
        <Example title="Scenario routing" caption="Which source tooling?">
{`Shopping cart + live inventory joins → RDS (DMS CDC to lake)
10M/sec sensor readings keyed device_id → DynamoDB (Streams to S3)
Pipeline watermark + dedupe tables → DynamoDB (DE-owned, Query not Scan)
Nightly relational mart from 12 normalized tables → RDS source, not DDB`}
        </Example>
        <Callout variant="insight">
          Interview frame: RDS when relational model and SQL migrations matter; DynamoDB when access patterns
          are known, scale is massive, and ops wants serverless. DE adapts extract — does not pick app database.
        </Callout>
      </LessonSection>

      <LessonSection title="Operational differences for DE">
        <ContentStep number={1} title="Networking">
          <p className="text-slate-300">
            RDS in VPC — Glue connections, security groups, Secrets Manager. DynamoDB is API endpoint — Lambda
            and Glue call via IAM; VPC endpoint optional for private subnets. Fewer network tickets for DDB
            ingest; more key-design collaboration with app team.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Backfill and replay">
          <p className="text-slate-300">
            RDS: DMS reload table, or point-in-time restore + export. DynamoDB: PITR export to S3, or stream
            replay limited to 24h — gap fill needs export. Document RPO/RTO per source in platform runbook.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DynamoDB: keyed NoSQL at scale — ingest via Streams/export; no JDBC or arbitrary SQL on source.',
          'RDS: relational OLTP — DMS CDC, JDBC Glue, snapshot export; joins deferred to lake/warehouse.',
          'Wrong extract tool (Scan DDB, heavy BI on RDS) is common anti-pattern — extract to S3 first.',
          'Hybrid lakes merge RDS and DynamoDB bronze on business keys in silver/gold layers.',
          'DE-owned control tables often DynamoDB; ERP/system-of-record often RDS — match tooling to source.',
        ]}
      />
    </LessonArticle>
  )
}
