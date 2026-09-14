import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MultiAzMultiRegion() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        A <strong className="text-white">Region</strong> is a city where AWS has data centers. Within that
        city, separate buildings called <strong className="text-white">Availability Zones (AZs)</strong>{' '}
        are far enough apart that one power outage should not take down both.{' '}
        <strong className="text-white">Multi-AZ</strong> protects you inside one city;{' '}
        <strong className="text-white">multi-Region</strong> protects you when the whole city — or your
        compliance rules — require geography-level separation.
      </Callout>

      <Definition term="Multi-AZ (within a Region)">
        <p>
          <strong className="text-white">Multi-AZ</strong> deploys redundant copies of a resource across
          two or more Availability Zones in the same AWS Region. Failover stays local — low latency, same
          data residency, designed to survive single-AZ failure.
        </p>
        <p className="mt-2 text-slate-300">
          Examples: RDS Multi-AZ (synchronous standby), S3 Standard (objects replicated across AZs
          automatically), Application Load Balancer targets in multiple AZ subnets.
        </p>
      </Definition>

      <Definition term="Multi-Region">
        <p>
          <strong className="text-white">Multi-Region</strong> spans two or more AWS Regions — e.g.
          us-east-1 and eu-west-1. Use it for disaster recovery, serving global users with lower latency,
          or meeting data residency requirements (EU data stays in EU Regions).
        </p>
        <p className="mt-2 text-slate-300">
          Examples: S3 Cross-Region Replication (CRR), Redshift snapshot copy, Route 53 routing users to
          the nearest healthy endpoint, Aurora Global Database for low-lag cross-Region reads.
        </p>
      </Definition>

      <LessonSection title="Architecture — Region with AZs and optional DR Region">
        <Flowchart
          title="Multi-AZ vs multi-Region"
          chart={`flowchart TB
  subgraph R1 [Region us-east-1]
    subgraph AZA [AZ-a]
      APP1[EC2 / Lambda]
      DB1[RDS primary]
    end
    subgraph AZB [AZ-b]
      APP2[EC2 / Lambda]
      DB2[RDS standby]
      S3[S3 bucket copies]
    end
    APP1 --> S3
    APP2 --> S3
    DB1 -.sync.-> DB2
  end
  subgraph R2 [Region eu-west-1 optional DR]
    S3DR[S3 replica bucket]
    WHDR[Redshift restore target]
  end
  S3 -->|CRR| S3DR`}
        />
        <p className="mt-4 text-slate-300">
          Primary pipelines read and write in Region 1 across AZ-a and AZ-b. Critical lake data replicates
          asynchronously to Region 2 for DR — not every byte needs CRR; pick curated and raw zones by RPO.
        </p>
      </LessonSection>

      <LessonSection title="When to use which">
        <ContentStep number={1} title="Multi-AZ for high availability">
          <p className="text-slate-300">
            Default for production databases, NAT gateways in each AZ, and stateful services that must
            survive a single data center failure. Most batch pipelines should tolerate AZ failover without
            manual intervention.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-Region for DR and global reach">
          <p className="text-slate-300">
            Regulatory need for EU-only storage? Deploy lake buckets in eu-central-1. US-East-wide outage
            (rare but discussed in DR planning)? Restore from snapshots in us-west-2. Global dashboards?
            Replicate summaries closer to users — not necessarily the entire raw lake.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data residency">
          <p className="text-slate-300">
            Some contracts forbid copying personal data outside a country. Multi-Region replication to the
            US when data must stay in India is a compliance violation — choose Regions at design time, not
            after ingestion starts.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Tradeoffs — cost, complexity, consistency">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">Multi-AZ</th>
                <th className="px-4 py-3">Multi-Region</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cost', 'Moderate — duplicate DB standby, cross-AZ data transfer', 'Higher — full replica storage, inter-Region transfer, duplicate compute for warm DR'],
                ['Complexity', 'Lower — same Region IAM, VPC, endpoints', 'Higher — cross-Region IAM trust, replication lag, failover runbooks'],
                ['Consistency', 'RDS Multi-AZ: synchronous, minimal RPO', 'CRR and async replication: eventual consistency, measurable lag'],
                ['Failover speed', 'Minutes or automatic for managed services', 'Minutes to hours unless warm standby in DR Region'],
              ].map(([factor, az, region]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{factor}</td>
                  <td className="px-4 py-3">{az}</td>
                  <td className="px-4 py-3">{region}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          S3 is multi-AZ by default within a Region — you get durability across AZs without configuring
          Multi-AZ the way RDS requires. Cross-Region is a separate, explicit choice (CRR, multi-Region
          access points).
        </Callout>
        <Callout variant="tip">
          For most DE teams: multi-AZ production in one primary Region + CRR for critical S3 prefixes and
          periodic snapshots off-Region is a practical baseline before active-active multi-Region.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-AZ = redundancy inside one Region (HA against AZ failure); multi-Region = geographic separation (DR, latency, residency).',
          'Architecture: spread compute and databases across AZ-a/AZ-b; optionally replicate S3 and warehouse snapshots to a second Region.',
          'Tradeoffs: multi-Region costs more, adds replication lag and ops complexity — choose Regions early for compliance.',
        ]}
      />
    </LessonArticle>
  )
}
