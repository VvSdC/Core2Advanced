import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Ra3AndManagedStorage() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="RA3 decouples compute from storage — scale each independently">
        Older dense-storage nodes tied disk size to node count.{' '}
        <strong className="text-white">RA3 node types</strong> use{' '}
        <strong className="text-white">Redshift Managed Storage (RMS)</strong> in S3-backed tiers — you add
        compute nodes for query concurrency without buying excess local SSD for cold historical data.
      </Callout>

      <Definition term="RA3 node">
        <p>
          <span className="font-mono text-sm">ra3.xlplus</span>,{' '}
          <span className="font-mono text-sm">ra3.4xlarge</span>, and{' '}
          <span className="font-mono text-sm">ra3.16xlarge</span> are the modern provisioned node family. Local
          NVMe acts as cache; durable columnar data lives in managed storage. Resize operations and snapshot
          restore are faster than legacy DC2 for many workloads because bulk bytes are not re-copied onto
          every node&apos;s local disk.
        </p>
      </Definition>

      <Definition term="Redshift Managed Storage (RMS)">
        <p>
          RMS automatically tiers data between high-performance local cache and{' '}
          <strong className="text-white">durable S3-backed storage</strong> managed by Redshift. Hot blocks
          stay near compute; colder blocks spill transparently. You pay for stored GB in RMS separately from
          compute node hours — the core decoupling story for data engineers sizing multi-TB warehouses.
        </p>
      </Definition>

      <LessonSection title="Decouple compute and storage">
        <ContentStep number={1} title="Legacy coupling problem">
          <p className="text-slate-300">
            On DC2, each node had fixed local SSD. Need 50 TB storage? You bought enough nodes to hold 50 TB
            even if query concurrency only needed half the CPU. Idle compute on storage-heavy, lightly queried
            archive tables was common — bad cost story for DE teams.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RA3 + RMS model">
          <p className="text-slate-300">
            Store 100 TB in RMS; run 4 <span className="font-mono text-sm">ra3.4xlarge</span> nodes for nightly
            ETL and 8 during business hours via scheduled resize or concurrency scaling. Storage bill tracks
            data volume; compute bill tracks node hours and query load — tune each dimension.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cache behavior for DE">
          <p className="text-slate-300">
            Frequently scanned gold fact tables benefit from warm cache after COPY or steady BI traffic.
            Massive one-off full-table scans on cold history may see higher latency until blocks promote —
            sort keys and selective queries still matter; RMS is not a substitute for pruning.
          </p>
        </ContentStep>
        <Flowchart
          title="RA3 — compute vs managed storage"
          chart={`flowchart LR
  subgraph COMPUTE[Compute layer]
    N1[RA3 node 1 NVMe cache]
    N2[RA3 node 2 NVMe cache]
    NN[RA3 node N NVMe cache]
  end
  subgraph RMS[Redshift Managed Storage]
    HOT[Hot columnar blocks]
    COLD[Cold blocks S3-backed]
  end
  SQL[SQL workloads] --> N1
  SQL --> N2
  SQL --> NN
  N1 <-->|cache miss hit| HOT
  N2 <-->|cache miss hit| HOT
  NN <-->|cache miss hit| HOT
  HOT --> COLD`}
        />
      </LessonSection>

      <LessonSection title="When DE chooses RA3">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Why RA3 fits</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Multi-year fact history + daily hot aggregates', 'Large RMS footprint, moderate steady compute'],
                ['Growing lake COPY into warehouse without constant resize', 'Add storage without proportional node bump'],
                ['Dev/test clusters paused often', 'Snapshot/restore and elasticity cheaper vs all-local SSD'],
                ['Mixed BI + batch — burst concurrency', 'Pair with concurrency scaling on RA3 compute'],
              ].map(([scenario, why]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          New provisioned clusters should default to RA3 unless you have a legacy DC2 constraint. Managed
          storage is the AWS direction — interview answer: &quot;RA3 separates CPU/RAM for MPP from durable
          columnar bytes in RMS, so I scale nodes for WLM concurrency and pay RMS for retained history.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RA3 nodes use local NVMe cache + Redshift Managed Storage (S3-backed) for durable columnar data.',
          'Decoupling: add RMS capacity without matching node count; add nodes for concurrency without excess SSD.',
          'Legacy DC2 tied storage to node count — RA3 is the modern default for TB-scale warehouses.',
          'Cache warmth affects cold-scan latency — sort keys and selective queries still critical on RA3.',
          'Cost model splits RMS GB-months from compute node hours — right-size each for ETL vs BI patterns.',
        ]}
      />
    </LessonArticle>
  )
}
