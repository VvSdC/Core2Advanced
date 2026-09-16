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

export function QueryVsScan() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Query finds a shelf — Scan reads the entire warehouse">
        DynamoDB performance and cost hinge on how you read data.{' '}
        <strong className="text-white">Query</strong> retrieves items sharing a partition key (optionally
        filtered by sort key condition). <strong className="text-white">Scan</strong> reads every item in the
        table or index. Data engineering jobs that Scan multi-terabyte operational tables for nightly ETL
        routinely trigger throttling, six-figure bills, and angry platform teams — design keys and indexes so
        pipelines Query or Stream, not Scan.
      </Callout>

      <Definition term="Query">
        <p>
          A <strong className="text-white">Query</strong> operation reads one partition (or GSI partition) at
          a time using <span className="font-mono text-sm">KeyConditionExpression</span>. Optional{' '}
          <span className="font-mono text-sm">FilterExpression</span> applies after the key condition — filtered
          items still consume read capacity. Supports pagination via{' '}
          <span className="font-mono text-sm">LastEvaluatedKey</span>. Efficient when access pattern matches
          table or index key design.
        </p>
      </Definition>

      <Definition term="Scan">
        <p>
          A <strong className="text-white">Scan</strong> operation reads every item in a table or index,
          optionally applying a <span className="font-mono text-sm">FilterExpression</span> that discards
          non-matching rows after the read. Scans are parallelized across partitions but still examine all
          data — cost scales with table size, not result size. Acceptable for small control tables; dangerous
          for operational fact stores.
        </p>
      </Definition>

      <LessonSection title="Query vs Scan — side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Query</th>
                <th className="px-4 py-3">Scan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Scope', 'Single partition (or GSI partition)', 'Entire table or index'],
                ['Key required', 'Yes — partition key condition', 'No key condition'],
                ['Cost driver', 'Items read in targeted partition(s)', 'All items scanned (minus filter discard)'],
                ['Latency', 'Low — bounded by partition size', 'Grows with table size'],
                ['DE fit', 'Watermark fetch, status poll, keyed export slice', 'Tiny config tables only'],
                ['Parallel export', 'Per-partition Query in workers', 'Segmented Scan (still expensive)'],
              ].map(([dim, query, scan]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{query}</td>
                  <td className="px-4 py-3">{scan}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Read path cost mental model"
          chart={`flowchart LR
  APP[Pipeline read need]
  APP -->|known partition key| Q[Query one partition]
  APP -->|no key match| BAD[Scan entire table]
  Q --> FEW[Few RCU bounded]
  BAD --> ALL[RCU scales with table size]
  ALL --> THR[Throttling risk]`}
        />
      </LessonSection>

      <LessonSection title="Why Scan is expensive — prefer Query">
        <ContentStep number={1} title="Read capacity math">
          <p className="text-slate-300">
            On-demand billing charges per million read request units. A Scan of 500 GB table reads 500 GB
            whether you need 50 rows or five million. A Query on one partition might read 4 MB. Nightly Glue
            job Scanning prod telemetry table competes with live app traffic for the same table — classic
            DE anti-pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="FilterExpression does not save Scan cost">
          <p className="text-slate-300">
            Scan with <span className="font-mono text-sm">FilterExpression status = FAILED</span> still reads
            every item — DynamoDB applies filter after read. You pay for scanned items, not returned items.
            Fix: GSI with PK = status, Query FAILED partition only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Better alternatives for full exports">
          <p className="text-slate-300">
            Need entire table to S3 for lake ingest? Use{' '}
            <strong className="text-white">DynamoDB export to S3</strong> (PITR-based, no RCU impact) or{' '}
            <strong className="text-white">DynamoDB Streams</strong> + Lambda for incremental CDC. Reserve
            Scan for tables under a few thousand items (feature flags, pipeline config).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Parallel Scan segments">
          <p className="text-slate-300">
            <span className="font-mono text-sm">Segment</span> +{' '}
            <span className="font-mono text-sm">TotalSegments</span> splits Scan across workers — faster wall
            clock, not cheaper. EMR/Glue parallel Scan still consumes RCU proportional to table size. Use only
            when export API unavailable and table is small enough to tolerate.
          </p>
        </ContentStep>
        <Example title="Query vs Scan in boto3" caption="Pipeline watermark read">
{`# GOOD: Query known partition
table.query(
    KeyConditionExpression=Key('dataset_name').eq('orders_silver')
        & Key('run_date').gte('2024-01-01')
)

# BAD: Scan hoping FilterExpression helps
table.scan(
    FilterExpression=Attr('dataset_name').eq('orders_silver')
)  # Still reads entire table — use GSI or redesign keys`}
        </Example>
        <Callout variant="insight">
          CloudWatch metric <span className="font-mono text-sm">ConsumedReadCapacityUnits</span> spiking on
          Scan-heavy Glue connection is a common post-mortem finding. Alarm on Scan operations via Contributor
          Insights or application metrics wrapping boto3.
        </Callout>
      </LessonSection>

      <LessonSection title="DE read pattern checklist">
        <ContentStep number={1} title="Before writing a read path">
          <p className="text-slate-300">
            Ask: Do I know the partition key value? If yes → Query (base or GSI). If no → redesign index, use
            Streams/export, or accept Scan only if table is tiny and off-peak.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pagination discipline">
          <p className="text-slate-300">
            Both Query and Scan paginate — loop on <span className="font-mono text-sm">LastEvaluatedKey</span>{' '}
            until exhausted. Large Query results on hot partition still throttle — cap page size, backoff on
            <span className="font-mono text-sm">ProvisionedThroughputExceededException</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="BatchGetItem for known keys">
          <p className="text-slate-300">
            Enrichment job has list of 500 order_ids from S3 manifest →{' '}
            <span className="font-mono text-sm">BatchGetItem</span> (up to 100 keys per call, 16 MB response
            cap). More efficient than 500 Queries when keys are scattered across partitions — still keyed
            access, not Scan.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Query: single-partition keyed read — cost bounded by partition data read; primary DE read pattern.',
          'Scan: reads entire table/index — cost scales with table size; FilterExpression does not reduce RCU.',
          'Prefer export to S3, Streams CDC, or GSI Query over Scan for large operational tables.',
          'Parallel Scan speeds wall clock but not bill — avoid on prod telemetry and order fact tables.',
          'Design pipeline reads at table creation: watermark keys, status GSIs, BatchGetItem for manifest-driven enrichment.',
        ]}
      />
    </LessonArticle>
  )
}
