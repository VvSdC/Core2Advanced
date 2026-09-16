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

export function GsiAndLsi() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One table, many access paths — indexes unlock alternate queries">
        DynamoDB serves data by <strong className="text-white">partition key</strong> (and optional{' '}
        <strong className="text-white">sort key</strong>) on the base table. Data engineering pipelines
        often need to look up the same records by a different key — vendor_id instead of order_id, status
        instead of customer_id. <strong className="text-white">Global Secondary Indexes (GSI)</strong> and{' '}
        <strong className="text-white">Local Secondary Indexes (LSI)</strong> provide alternate access
        patterns without duplicating the entire table in RDS or scanning every partition nightly.
      </Callout>

      <Definition term="Global Secondary Index (GSI)">
        <p>
          A <strong className="text-white">GSI</strong> is an index with its own partition key and optional
          sort key — independent of the base table key schema. GSIs have separate throughput (on-demand or
          provisioned) and can project all or selected attributes. You can add GSIs after table creation.
          Query and GetItem against a GSI use the GSI key — not the base table primary key.
        </p>
      </Definition>

      <Definition term="Local Secondary Index (LSI)">
        <p>
          An <strong className="text-white">LSI</strong> shares the same partition key as the base table but
          uses a different sort key. LSIs must be defined at table creation — you cannot add them later. All
          items with a given partition key appear together in the LSI, sorted by the alternate sort key. LSIs
          share the base table&apos;s provisioned capacity (no separate WCU/RCU pool on provisioned mode).
        </p>
      </Definition>

      <LessonSection title="GSI vs LSI — comparison for data engineers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">GSI</th>
                <th className="px-4 py-3">LSI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Partition key', 'Different from base table', 'Same as base table'],
                ['Sort key', 'Optional — your choice', 'Different from base table sort key'],
                ['When created', 'Anytime (up to 20 per table)', 'Only at table creation'],
                ['Capacity', 'Separate on-demand or provisioned', 'Shares base table capacity'],
                ['Item size limit', '400 KB per item (projected attrs)', '400 KB per item'],
                ['Strongly consistent reads', 'Not supported on GSI', 'Supported on LSI'],
                ['DE typical use', 'Lookup by alternate entity ID', 'Same entity, different sort order'],
              ].map(([dim, gsi, lsi]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{gsi}</td>
                  <td className="px-4 py-3">{lsi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Base table vs GSI access paths"
          chart={`flowchart TB
  BASE[Base table PK order_id SK event_time]
  GSI[GSI PK customer_id SK event_time]
  Q1[Query by order_id]
  Q2[Query by customer_id]
  BASE --> Q1
  GSI --> Q2
  WRITE[PutItem to base table]
  WRITE --> BASE
  WRITE -->|async projection| GSI`}
        />
      </LessonSection>

      <LessonSection title="When DE needs alternate access patterns">
        <ContentStep number={1} title="Pipeline watermark lookups">
          <p className="text-slate-300">
            ETL control table keyed by <span className="font-mono text-sm">dataset_name</span> (partition) +
            <span className="font-mono text-sm">run_date</span> (sort). Ops dashboard needs &quot;all failed
            runs today&quot; — add GSI with partition key <span className="font-mono text-sm">status</span>{' '}
            and sort key <span className="font-mono text-sm">run_date</span>. Glue Lambda poller queries GSI
            instead of Scanning the entire control plane table.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CDC and stream consumers">
          <p className="text-slate-300">
            Operational table keyed by <span className="font-mono text-sm">device_id</span>. Analytics
            enrichment job needs records by <span className="font-mono text-sm">facility_id</span> for batch
            joins — GSI on facility_id avoids full table export. Stream consumer writes denormalized GSI keys
            on ingest so lake staging jobs Query efficiently.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Ingest deduplication index">
          <p className="text-slate-300">
            Landing dedupe table: base PK = <span className="font-mono text-sm">source_file_hash</span>, GSI
            PK = <span className="font-mono text-sm">vendor_id</span> + SK ={' '}
            <span className="font-mono text-sm">received_at</span>. Ingest Lambda checks GSI for
            &quot;already processed from this vendor in last hour&quot; before triggering Glue — conditional
            writes on base table, Query on GSI for audit.
          </p>
        </ContentStep>
        <ContentStep number={4} title="When LSI still makes sense">
          <p className="text-slate-300">
            Single-table design with PK = <span className="font-mono text-sm">CUSTOMER#123</span>: base SK =
            <span className="font-mono text-sm">ORDER#timestamp</span>, LSI SK ={' '}
            <span className="font-mono text-sm">STATUS#timestamp</span>. All orders for one customer in one
            partition — Query LSI for open orders without a second partition key. Plan LSIs at greenfield
            table design; most brownfield DE work adds GSIs.
          </p>
        </ContentStep>
        <Example title="GSI projection choice" caption="DE trade-off: storage vs read efficiency">
{`GSI: status-run_date-index
  PartitionKey: status (e.g. FAILED)
  SortKey: run_date
  ProjectionType: INCLUDE
  NonKeyAttributes: [dataset_name, error_message, glue_job_run_id]

Why INCLUDE not KEYS_ONLY: downstream Lambda needs error_message without
GetItem back to base table — saves RCU on high-volume failure triage.`}
        </Example>
        <Callout variant="insight">
          Every GSI write consumes additional WCU — heavy ingest to base table with three GSIs triples write
          amplification. Model indexes from actual Query patterns in pipeline code, not hypothetical reports.
        </Callout>
      </LessonSection>

      <LessonSection title="Index design pitfalls">
        <ContentStep number={1} title="Sparse indexes">
          <p className="text-slate-300">
            GSI only materializes items that include the GSI key attributes — use sparse GSIs for
            &quot;exceptions only&quot; (e.g. only FAILED runs carry status attribute). Reduces index size
            and cost for mostly-successful pipeline tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hot GSI partitions">
          <p className="text-slate-300">
            GSI partition key <span className="font-mono text-sm">status=RUNNING</span> during nightly batch
            can hot-spot one GSI partition — same throttling risk as base table. Prefer high-cardinality GSI
            keys (job_id, shard suffix) or composite keys with date prefix.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Backfill and IaC">
          <p className="text-slate-300">
            Adding GSI to existing table triggers backfill — large tables may take hours; GSIs start
            ACTIVE incrementally. CloudFormation <span className="font-mono text-sm">AWS::DynamoDB::Table</span>{' '}
            updates require careful deployment windows. DE teams document index additions in runbooks alongside
            Glue job changes.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GSI: alternate partition + sort key, add anytime, separate capacity — primary tool for new access patterns.',
          'LSI: same partition key, different sort key, table creation only — strong consistency, shares base capacity.',
          'DE uses GSIs for watermark/status lookups, dedupe audits, and facility/vendor queries without Scan.',
          'Projection type (KEYS_ONLY, INCLUDE, ALL) affects RCU on index Query — INCLUDE common for pipeline metadata.',
          'Every index amplifies writes and can hot-spot — design from proven Query paths, prefer sparse GSIs for exceptions.',
        ]}
      />
    </LessonArticle>
  )
}
