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

export function CapacityModes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="How you pay for throughput">
        DynamoDB charges for <strong className="text-white">read and write throughput</strong> to your tables.
        You choose a <strong className="text-white">capacity mode</strong> when creating the table (and can
        switch later with planning): <strong className="text-white">provisioned</strong> — you set Read
        Capacity Units (RCU) and Write Capacity Units (WCU) in advance — or{' '}
        <strong className="text-white">on-demand</strong> — you pay per request and AWS scales capacity
        automatically. For DE pipelines, the choice usually comes down to traffic shape: steady metadata
        updates vs spiky S3 landing bursts.
      </Callout>

      <Definition term="Provisioned capacity">
        <p>
          In <strong className="text-white">provisioned capacity</strong> mode, you specify RCU and WCU for
          the table (and optionally per GSI). One RCU supports one strongly consistent read per second for
          items up to 4 KB, or two eventually consistent reads. One WCU supports one write per second for items
          up to 1 KB. Exceeding provisioned capacity throttles requests unless auto scaling adds capacity —
          predictable cost, requires capacity planning.
        </p>
      </Definition>

      <Definition term="On-demand capacity">
        <p>
          In <strong className="text-white">on-demand</strong> mode, you do not provision RCU/WCU. DynamoDB
          instantly scales to handle traffic and bills per million read/write request units consumed. Ideal
          when load is unknown, spiky, or intermittent — common for event-driven pipelines that idle most of
          the day then surge when vendors drop files. Generally higher per-request cost at sustained high
          throughput vs well-tuned provisioned capacity.
        </p>
      </Definition>

      <LessonSection title="Provisioned vs on-demand — side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Provisioned</th>
                <th className="px-4 py-3">On-demand</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Planning',
                  'You estimate peak RCU/WCU; auto scaling adjusts within bounds',
                  'No capacity planning — AWS scales automatically',
                ],
                [
                  'Cost profile',
                  'Lower at steady, predictable load',
                  'Higher at sustained high volume; can be cheaper at very low or bursty load',
                ],
                [
                  'Throttling',
                  'Possible if traffic exceeds provisioned capacity without scaling',
                  'Rare — service scales; account-level soft limits still exist',
                ],
                [
                  'DE fit',
                  'Steady job heartbeat updates, config reads every minute',
                  'S3 landing bursts, unpredictable vendor uploads, dev/test tables',
                ],
              ].map(([aspect, prov, od]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{prov}</td>
                  <td className="px-4 py-3">{od}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Pick capacity mode — decision sketch"
          chart={`flowchart TD
  START[New DE metadata table]
  START --> Q1{Traffic predictable?}
  Q1 -->|Steady 24/7 writes| PROV[Provisioned plus auto scaling]
  Q1 -->|Spiky or unknown| OD[On-demand]
  PROV --> MON[Watch ConsumedCapacity metrics]
  OD --> REV[Review monthly cost vs provisioned]`}
        />
      </LessonSection>

      <LessonSection title="When DE teams pick provisioned">
        <ContentStep number={1} title="Steady pipeline heartbeats">
          <p className="text-slate-300">
            A Step Functions loop writes job status every 30 seconds; config table serves hundreds of reads
            per minute from long-running workers. Traffic is flat — provisioned with auto scaling min/max
            caps cost better than on-demand at scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Known peak from load testing">
          <p className="text-slate-300">
            Load test shows max 500 writes/sec during backfill window — provision 600 WCU with auto scaling
            headroom. Finance prefers fixed baseline plus scaling over open-ended on-demand during multi-day
            replays.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Production tables with mature metrics">
          <p className="text-slate-300">
            After months of CloudWatch <code className="text-core-400">ConsumedReadCapacityUnits</code> and{' '}
            <code className="text-core-400">ConsumedWriteCapacityUnits</code>, convert on-demand dev tables
            to provisioned prod with right-sized units — common platform team optimization.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When DE teams pick on-demand">
        <ContentStep number={1} title="Event-driven idempotency bursts">
          <p className="text-slate-300">
            Black Friday: ten thousand S3 Object Created events per minute, each Lambda conditional-writes an
            idempotency key. Traffic is zero most nights, extreme for hours — on-demand absorbs spikes without
            manual WCU tuning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dev, staging, and prototypes">
          <p className="text-slate-300">
            Engineers create tables, run tests sporadically, forget to tear down — on-demand avoids paying
            provisioned capacity on idle dev metadata tables while still allowing occasional load tests.
          </p>
        </ContentStep>
        <ContentStep number={3} title="New pipelines with unknown volume">
          <p className="text-slate-300">
            First production month of a new vendor ingest — you do not know write rate yet. Start on-demand,
            collect metrics, switch to provisioned when the curve stabilizes.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Switching modes">
          You can change capacity mode on an existing table. Plan a maintenance window for large tables —
          platform teams often run new pipelines on-demand for 30 days, then right-size provisioned capacity
          for steady-state cost.
        </Callout>
      </LessonSection>

      <LessonSection title="RCU and WCU — provisioned teaser">
        <p className="text-slate-300">
          Even if you start on-demand, understanding RCU/WCU helps read CloudWatch metrics and cost reports
          after the fact.
        </p>
        <ContentStep number={1} title="Read Capacity Unit (RCU)">
          <p className="text-slate-300">
            One RCU = one strongly consistent read per second for an item up to 4 KB. Larger items consume
            more units in 4 KB chunks. Eventually consistent reads use half the RCUs — common default for
            idempotency checks where stale-by-seconds is acceptable.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Write Capacity Unit (WCU)">
          <p className="text-slate-300">
            One WCU = one standard write per second for an item up to 1 KB. Transactional writes and larger
            items cost more. Small idempotency items (bucket, key, timestamp) typically cost 1 WCU each.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Auto scaling">
          <p className="text-slate-300">
            Application Auto Scaling adjusts provisioned RCU/WCU between min and max based on utilization
            targets — e.g. keep at 70% consumed capacity. Reduces throttling without over-provisioning 24/7
            for nightly-only batch metadata.
          </p>
        </ContentStep>
        <Example title="Rough sizing sketch — idempotency table" caption="Order-of-magnitude only">
{`Assumption: peak 200 S3 events/sec, each 1 conditional write (~1 KB item)

Provisioned WCU needed ≈ 200 (plus headroom → 250 WCU with auto scaling max 400)

Reads: 200 GetItem/sec check + 200 failed/skip → ~400 eventually consistent reads/sec
→ ~200 RCU at 50% for eventual consistency

If peak lasts 2 hours/month only → on-demand may cost less than 250 WCU × 730 hours
Run AWS Pricing Calculator with your Region and item sizes before prod.`}
        </Example>
      </LessonSection>

      <LessonSection title="Operational signals — throttling and cost">
        <ContentStep number={1} title="ThrottledRequests metric">
          <p className="text-slate-300">
            Provisioned mode under capacity shows throttling in CloudWatch — Lambdas retry, but pipeline
            latency spikes. Fix: raise WCU/RCU, enable auto scaling, or switch hot table to on-demand during
            backfill.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Consumed vs provisioned">
          <p className="text-slate-300">
            If consumed capacity averages 10% of provisioned 24/7, you over-pay — lower baseline or use
            on-demand for that table.
          </p>
        </ContentStep>
        <ContentStep number={3} title="GSI capacity">
          <p className="text-slate-300">
            Each GSI has its own capacity settings in provisioned mode — writes to the base table propagate to
            indexes. Budget for index WCU when estimating (covered with GSI lessons).
          </p>
        </ContentStep>
        <Callout variant="insight">
          DE interview angle: &quot;We use on-demand for idempotency during unpredictable ingest, provisioned
          for job config with steady reads&quot; — shows you match mode to access pattern, not one-size-fits-all.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Provisioned = you set RCU/WCU; on-demand = pay per request, AWS auto-scales.',
          'Pick provisioned for steady pipeline metadata; on-demand for spiky S3 landing and unknown new workloads.',
          'RCU/WCU measure read/write throughput in 4 KB / 1 KB chunks — useful for metrics even on on-demand.',
          'Watch ThrottledRequests and consumed vs provisioned; switch modes after you have production traffic data.',
        ]}
      />
    </LessonArticle>
  )
}
