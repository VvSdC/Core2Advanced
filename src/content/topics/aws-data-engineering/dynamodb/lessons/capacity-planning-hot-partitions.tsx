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

export function CapacityPlanningHotPartitions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="DynamoDB scales — until one partition key owns the party">
        On-demand tables absorb most DE workloads, but{' '}
        <strong className="text-white">hot partitions</strong> still throttle when read/write traffic
        concentrates on a single partition key value. Nightly batch jobs writing all watermarks under{' '}
        <span className="font-mono text-sm">GLOBAL</span>, or telemetry keyed only by date, can spike{' '}
        <span className="font-mono text-sm">ProvisionedThroughputExceededException</span> and stall pipelines.
        Capacity planning means matching mode, keys, and burst patterns — not just picking on-demand and
        forgetting.
      </Callout>

      <Definition term="Capacity mode">
        <p>
          <strong className="text-white">On-demand</strong> — pay per request; AWS scales RCU/WCU automatically
          with per-partition soft limits (~3000 RCU / 1000 WCU per partition, subject to change).{' '}
          <strong className="text-white">Provisioned</strong> — you set table and optional GSI throughput;
          auto scaling adjusts within bounds. DE control tables often use on-demand; predictable steady ingest
          may save cost with provisioned + auto scaling.
        </p>
      </Definition>

      <Definition term="Hot partition">
        <p>
          A <strong className="text-white">hot partition</strong> receives disproportionate traffic relative to
          other partitions because partition key cardinality is too low or access pattern skews to one value
          (e.g. all files tagged <span className="font-mono text-sm">status=PROCESSING</span> on one GSI
          partition). DynamoDB splits partitions by size, not by traffic — hot keys hit per-partition throughput
          ceiling before table-level limits.
        </p>
      </Definition>

      <LessonSection title="Capacity planning for DE tables">
        <ContentStep number={1} title="Estimate write/read profile">
          <p className="text-slate-300">
            Pipeline control plane: ~50 writes/min steady, 500/min burst at top of hour — on-demand fits.
            High-velocity IoT landing table: 50k writes/sec sustained — model partition key cardinality,
            item size (1 WCU = 1 KB rounded up), GSI write amplification. Use AWS Calculator and load test
            with realistic key distribution before prod cutover.
          </p>
        </ContentStep>
        <ContentStep number={2} title="On-demand vs provisioned decision">
          <p className="text-slate-300">
            On-demand: spiky DE workloads, new projects, unknown traffic. Provisioned + auto scaling: stable
            nightly batch with predictable RCU (watermark reads) — can reduce cost 50%+ at scale. Switch modes
            once per 24 hours — plan migration windows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="GSI capacity is separate">
          <p className="text-slate-300">
            Each GSI bills its own reads/writes on provisioned mode; on-demand GSIs scale independently. Three
            GSIs on hot ingest table = 4× write path (base + 3 projections). DE teams cap GSIs at proven Query
            needs — every index is a recurring cost line item.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Table type</th>
                <th className="px-4 py-3">Typical mode</th>
                <th className="px-4 py-3">Planning note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Pipeline watermarks', 'On-demand', 'Low volume, burst at schedule — hot key risk on bad PK design'],
                ['Ingest dedupe (TTL)', 'On-demand', 'Write-heavy spikes; TTL keeps size bounded'],
                ['Operational CDC source', 'On-demand or provisioned', 'Match app team; DE reads via Streams not Scan'],
                ['Feature flags / config', 'On-demand', 'Tiny table — capacity rarely matters'],
              ].map(([type, mode, note]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{mode}</td>
                  <td className="px-4 py-3">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Hot partitions — causes and fixes">
        <ContentStep number={1} title="Symptoms">
          <p className="text-slate-300">
            Intermittent <span className="font-mono text-sm">ProvisionedThroughputExceededException</span> on
            on-demand table. CloudWatch Contributor Insights shows one partition key dominating. Glue job
            writing sequential IDs to single partition — throughput flatlines despite &quot;unlimited&quot;
            on-demand marketing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Write sharding patterns">
          <p className="text-slate-300">
            Composite partition key: <span className="font-mono text-sm">date#shard</span> where shard = hash(id)
            mod N (10–100). Query all shards for date with parallel Query calls in Lambda — trade single Query
            simplicity for write spread. Suffix random salt on high-velocity append-only logs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid low-cardinality GSI keys">
          <p className="text-slate-300">
            GSI PK = boolean <span className="font-mono text-sm">is_active</span> puts all active rows on two
            partitions — unusable at scale. Use sparse GSI (only failures indexed) or high-cardinality status
            like <span className="font-mono text-sm">job_id</span>.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Adaptive capacity and retries">
          <p className="text-slate-300">
            DynamoDB briefly borrows unused partition capacity — helps mild skew, not fundamental bad keys.
            SDK exponential backoff on throttling — batch writers should jitter retries. DE jobs must not
            tight-loop Scan on throttled table — amplifies outage.
          </p>
        </ContentStep>
        <Flowchart
          title="Hot partition mitigation"
          chart={`flowchart TB
  HOT[Traffic spikes one PK value]
  HOT --> CI[Contributor Insights confirm]
  CI --> FIX{Fix strategy}
  FIX --> SHARD[Add shard suffix to PK]
  FIX --> GSI[Redesign GSI cardinality]
  FIX --> SPREAD[Spread batch writes over time]
  SHARD --> OK[Even partition load]
  GSI --> OK
  SPREAD --> OK`}
        />
        <Example title="Write sharding sketch" caption="Telemetry ingest">
{`# Instead of PK = "2024-06-01" (one hot partition)
PK = f"2024-06-01#{device_id[-2:]}"  # 256 shards by hex suffix

# Read path: Query each shard prefix in parallel for daily rollup
# Or aggregate in stream consumer before DynamoDB write`}
        </Example>
        <Callout variant="insight">
          DE batch jobs cause hot partitions when they write all status updates at cron boundary — stagger
          writes with random delay or shard by dataset_name (high cardinality) not RUN_DATE alone.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'On-demand auto-scales table throughput but per-partition limits still apply — hot keys throttle first.',
          'Plan capacity from item size, GSI amplification, and burst patterns — control tables usually on-demand.',
          'Hot partition: low-cardinality PK/GSI or skewed access — fix with sharding, sparse indexes, staggered writes.',
          'Contributor Insights identifies dominating keys — use before blaming Lambda or Glue timeouts.',
          'Exponential backoff on throttling; never respond to hot partition with full-table Scan retry loops.',
        ]}
      />
    </LessonArticle>
  )
}
