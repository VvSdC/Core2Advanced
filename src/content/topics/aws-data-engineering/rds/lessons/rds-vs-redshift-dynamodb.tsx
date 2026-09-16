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

export function RdsVsRedshiftDynamodb() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three SQL-ish stores — three different jobs">
        Amazon RDS, Redshift, and DynamoDB all appear in data engineering pipelines — but RDS is{' '}
        <strong className="text-white">relational OLTP</strong>, Redshift is{' '}
        <strong className="text-white">columnar OLAP</strong>, and DynamoDB is{' '}
        <strong className="text-white">NoSQL key-value/document</strong>. Choosing wrong tier wastes money
        and breaks SLAs.
      </Callout>

      <Definition term="Storage tier mental model">
        <p>
          <strong className="text-white">RDS</strong> serves live applications with ACID transactions and
          complex relational schemas. <strong className="text-white">Redshift</strong> serves analytics at
          scale on historical data via bulk load and MPP scans.{' '}
          <strong className="text-white">DynamoDB</strong> serves predictable single-digit-ms access patterns
          on massive scale with flexible schema — often event streams, session state, or high-throughput
          ingestion, not ad hoc SQL joins.
        </p>
      </Definition>

      <LessonSection title="RDS vs Redshift">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">RDS</th>
                <th className="px-4 py-3">Redshift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Workload', 'OLTP — row CRUD from apps', 'OLAP — aggregations, joins on history'],
                ['Storage', 'Row-oriented (Postgres/MySQL pages)', 'Columnar MPP on node storage'],
                ['Ingest', 'Single-row INSERT/UPDATE', 'Bulk COPY from S3, JDBC batch'],
                ['Concurrency', 'App connection pools — small queries', 'WLM queues — BI + ETL mix'],
                ['DE role', 'Source — DMS CDC, snapshot export', 'Destination — gold marts, dashboards'],
                ['Scale', 'Vertical + read replicas', 'Horizontal — add nodes / serverless RPUs'],
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
        <ContentStep number={1} title="Pipeline pattern">
          <p className="text-slate-300">
            RDS → S3 (DMS/snapshot export) → Glue curated → Redshift COPY → BI. Never run large BI directly
            on prod RDS — extract first, serve from warehouse.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="RDS vs DynamoDB">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">RDS</th>
                <th className="px-4 py-3">DynamoDB</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Data model', 'Relational — tables, joins, FKs', 'Key-value / document — partition + sort key'],
                ['Query pattern', 'Flexible SQL, ad hoc joins', 'GetItem/Query on key design — no arbitrary joins'],
                ['Scale', 'Vertical + replicas — connection limits', 'Horizontal — single-table PB scale'],
                ['Consistency', 'Strong ACID transactions', 'Eventually consistent default; optional strong reads'],
                ['DE ingest', 'JDBC, DMS CDC, logical replication', 'DynamoDB Streams → Lambda/Kinesis → S3'],
                ['Analytics', 'Poor for full scans — extract to lake', 'Export to S3 PITR; Streams for CDC'],
              ].map(([dim, rds, ddb]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{rds}</td>
                  <td className="px-4 py-3">{ddb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="When apps pick DynamoDB over RDS">
          <p className="text-slate-300">
            Session stores, IoT telemetry keyed by device_id+timestamp, shopping carts at extreme scale —
            access patterns are known upfront. DE ingests via Streams or export, not SQL SELECT.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When RDS remains correct">
          <p className="text-slate-300">
            Complex relational models (orders ↔ line items ↔ inventory), reporting needing SQL during
            migration, teams with Postgres expertise — RDS/Aurora wins. DE uses familiar JDBC/DMS tooling.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE decision tables — combined view">
        <Flowchart
          title="Source system routing in the lake"
          chart={`flowchart LR
  RDS[RDS OLTP]
  DDB[DynamoDB]
  RS[Redshift OLAP]
  RDS -->|DMS JDBC export| S3[S3 lake]
  DDB -->|Streams export| S3
  S3 --> RS
  RS --> BI[BI dashboards]`}
        />
        <Example title="Scenario routing" caption="Which store for what?">
{`Live order processing with inventory joins → RDS (source)
Clickstream events 10M/sec keyed by user_id → DynamoDB (source)
Executive revenue dashboard 3yr history → Redshift (destination)
Ad hoc QA on yesterday's export files → Athena on S3 (lake SQL)`}
        </Example>
        <Callout variant="tip" title="Interview framing">
          Ask: <em>Is this serving a live transaction, or analyzing history at scale?</em> Transaction +
          relational → RDS/DynamoDB by access pattern. Analytics → Redshift/lake. DE connects sources to
          destinations — rarely collapses tiers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS = relational OLTP source; Redshift = columnar OLAP destination — extract between them, never large BI on prod RDS.',
          'DynamoDB = NoSQL at scale — ingest via Streams/export, not JDBC; key design drives access, not SQL joins.',
          'RDS vs DynamoDB: choose RDS for relational ACID; DynamoDB for known key patterns at massive throughput.',
          'Pipeline spine: operational stores → S3 lake → Redshift gold — each tier optimized for its workload.',
          'Use comparison tables in architecture reviews — wrong tier shows up as connection storms or scan bills.',
        ]}
      />
    </LessonArticle>
  )
}
