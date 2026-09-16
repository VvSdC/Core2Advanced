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

export function DynamodbVsRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Serving transactions vs analyzing history — never swap the tiers">
        <strong className="text-white">DynamoDB</strong> is OLTP NoSQL built for predictable keyed access at
        massive scale. <strong className="text-white">Amazon Redshift</strong> is OLAP columnar warehouse built
        for aggregations across billions of historical rows. Data engineers land DynamoDB changes in S3, curate
        in Glue, and load Redshift for BI — not query DynamoDB like a warehouse or load Redshift like a live
        cart store.
      </Callout>

      <Definition term="OLTP NoSQL vs OLAP warehouse">
        <p>
          <strong className="text-white">DynamoDB (OLTP NoSQL)</strong> — single-digit-ms GetItem/Query on
          designed keys; horizontal scale; item-centric writes.{' '}
          <strong className="text-white">Redshift (OLAP)</strong> — columnar MPP scans, complex joins,
          sort/dist keys, WLM queues; bulk COPY from S3. Different CAP trade-offs, billing models, and DE
          pipeline roles.
        </p>
      </Definition>

      <LessonSection title="DynamoDB vs Redshift comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">DynamoDB</th>
                <th className="px-4 py-3">Redshift</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Workload type', 'Operational — live reads/writes', 'Analytical — reports, aggregates, joins'],
                ['Data model', 'Key-value / document per item', 'Relational tables — star/snowflake schemas'],
                ['Query style', 'GetItem, Query, BatchGet — key required', 'SQL SELECT — full table scans OK at scale'],
                ['Latency', 'Single-digit milliseconds', 'Seconds to minutes for large scans'],
                ['Concurrency', 'Millions of requests/sec', 'WLM-managed BI + ETL slots'],
                ['Ingest path', 'App writes, Streams, export', 'COPY from S3, INSERT, Spectrum external'],
                ['DE typical role', 'Source — CDC to lake', 'Destination — gold marts, dashboards'],
                ['Cost driver', 'RCU/WCU or on-demand requests', 'Cluster nodes / Serverless RPU-hours + storage'],
                ['Best for', 'Session state, IoT, carts, pipeline control', 'Revenue trends, cohort analysis, 3yr history'],
              ].map(([dim, ddb, rs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{ddb}</td>
                  <td className="px-4 py-3">{rs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Pipeline spine — DynamoDB to Redshift">
        <ContentStep number={1} title="Standard medallion path">
          <p className="text-slate-300">
            DynamoDB → Streams/Export → S3 bronze → Glue silver (dedupe, flatten, type coercion) → S3 gold
            Parquet → Redshift COPY or Spectrum external table → BI tool. Operational store stays lean;
            warehouse holds denormalized history optimized for analyst SQL.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why not federated query DDB from Redshift">
          <p className="text-slate-300">
            Redshift does not natively join live DynamoDB at warehouse scale. Attempts to Sync via Glue
            zero-ETL or land everything in S3 first — do not Scan DynamoDB from custom UDF loops. Lake is the
            integration layer between OLTP NoSQL and OLAP.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Refresh strategies">
          <p className="text-slate-300">
            Near-real-time: Streams → S3 → micro-batch Glue → Redshift merge every 15 min. Daily batch: PITR
            export + full partition overwrite for small tables. Choose based on dashboard SLA — Redshift is
            not millisecond-fresh without constant small loads (cost trade-off).
          </p>
        </ContentStep>
        <Flowchart
          title="DynamoDB operational data to Redshift analytics"
          chart={`flowchart LR
  DDB[(DynamoDB OLTP)]
  STR[Streams or Export]
  S3B[(S3 bronze)]
  GLUE[Glue silver gold]
  S3G[(S3 gold Parquet)]
  RS[(Redshift OLAP)]
  BI[QuickSight BI]
  DDB --> STR
  STR --> S3B
  S3B --> GLUE
  GLUE --> S3G
  S3G -->|COPY| RS
  RS --> BI`}
        />
        <Example title="Wrong vs right tier usage" caption="Architecture review">
{`WRONG: Analyst runs Scan on prod DynamoDB for "total orders last year"
WRONG: Application writes live cart state to Redshift row-by-row INSERT
RIGHT: DynamoDB serves cart; Streams feed lake; Redshift aggregates daily orders mart
RIGHT: DE control table in DynamoDB; executive dashboard queries Redshift only`}
        </Example>
        <Callout variant="tip">
          Redshift SUPER or VARCHAR for semi-structured remnants — but normalize DynamoDB nested maps in
          silver Glue before gold. Analysts expect columns, not raw DynamoDB typed JSON blobs.
        </Callout>
      </LessonSection>

      <LessonSection title="When each store wins">
        <ContentStep number={1} title="Keep in DynamoDB">
          <p className="text-slate-300">
            Pipeline watermarks, idempotency keys, high-velocity event buffer before lake, distributed locks —
            keyed access, TTL cleanup, conditional writes. Not historical revenue reporting.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Land in Redshift">
          <p className="text-slate-300">
            Order facts denormalized for 36-month retention, marketing attribution joins, finance close
            aggregates — columnar compression, sort keys on date, dist key on customer. Source may be
            DynamoDB-derived S3 gold — not live DDB reads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Athena middle ground">
          <p className="text-slate-300">
            Ad hoc QA on yesterday&apos;s S3 export — Athena on lake without loading Redshift. Production BI
            at scale still favors Redshift or dedicated warehouse; Athena for exploratory DE validation.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DynamoDB = OLTP NoSQL source at scale; Redshift = OLAP destination for joins and aggregates.',
          'Pipeline: DDB Streams/export → S3 → Glue → Redshift COPY — never Scan DDB for warehouse-style analytics.',
          'Do not write live app state to Redshift or query prod DynamoDB for BI — extract to lake first.',
          'Refresh via stream micro-batches or daily export depending on dashboard SLA vs cost.',
          'Normalize DynamoDB nested items in silver before Redshift gold — analysts need relational columns.',
        ]}
      />
    </LessonArticle>
  )
}
