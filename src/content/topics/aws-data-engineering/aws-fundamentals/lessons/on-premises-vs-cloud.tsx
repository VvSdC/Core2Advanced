import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OnPremisesVsCloud() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two ways to run data infrastructure">
        <strong className="text-white">On-premises</strong> (&quot;on-prem&quot;) means servers you
        own or lease in your office or a colocation facility. <strong className="text-white">Cloud</strong>{' '}
        means renting virtual resources from AWS and peers. Most real companies use a mix — this lesson
        compares the extremes so you can reason about tradeoffs.
      </Callout>

      <Definition term="CapEx vs OpEx">
        <p>
          <strong className="text-white">CapEx</strong> (capital expenditure) is upfront money for
          physical assets — servers, switches, storage arrays — depreciated over years.{' '}
          <strong className="text-white">OpEx</strong> (operational expenditure) is ongoing spend —
          monthly cloud bills, power, staff — treated as a running cost. On-prem skews CapEx; cloud
          skews OpEx.
        </p>
      </Definition>

      <LessonSection title="Pain points of on-premises for data teams">
        <ContentStep number={1} title="Capacity planning">
          <p className="text-slate-300">
            You must forecast storage and compute years ahead. Underestimate and pipelines miss SLAs;
            overestimate and racks sit idle while finance asks why the Hadoop cluster is at 12% CPU.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hardware lead times">
          <p className="text-slate-300">
            Ordering new nodes can take weeks or months — procurement, shipping, racking, cabling,
            burn-in. A sudden dataset or acquisition cannot wait for a PO approval cycle.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Operational burden">
          <p className="text-slate-300">
            Your team patches OS images, replaces disks, plans datacenter cooling, and schedules
            maintenance windows. That time is not spent on schema design or data quality rules.
          </p>
        </ContentStep>
        <Flowchart
          title="On-prem timeline vs cloud"
          chart={`flowchart TB
  subgraph OnPrem["On-premises new capacity"]
    A1[Forecast need] --> A2[Budget approval]
    A2 --> A3[Order hardware]
    A3 --> A4[Ship and rack]
    A4 --> A5[Weeks to months]
  end
  subgraph Cloud["Cloud new capacity"]
    B1[API or Console click] --> B2[Minutes to hours]
  end`}
        />
      </LessonSection>

      <LessonSection title="Advantages of cloud for data engineering">
        <ContentStep number={1} title="Speed to experiment">
          <p className="text-slate-300">
            Spin up a test Redshift cluster, load sample data, run queries, tear it down — all in an
            afternoon. On-prem experiments often need a capital project.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Global reach">
          <p className="text-slate-300">
            Replicate data near users in multiple Regions without building datacenters abroad. Latency
            and data residency policies drive Region choice — we cover that in a dedicated lesson.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rich managed catalog">
          <p className="text-slate-300">
            S3, Glue, Athena, Kinesis, and dozens of other services are integrated by design. Building
            the same stack on-prem means stitching open-source projects and hiring specialists for each
            layer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Honest tradeoffs of cloud">
        <ContentStep number={1} title="Vendor considerations">
          <p className="text-slate-300">
            Deep use of proprietary APIs (Glue job bookmarks, specific IAM patterns) creates switching
            cost. Mitigate with open formats (Parquet, Iceberg), infrastructure as code, and portable
            SQL where possible.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shared responsibility">
          <p className="text-slate-300">
            AWS secures the cloud; you secure what you put in it — bucket policies, encryption keys,
            network ACLs. A misconfigured public S3 bucket is your mistake, not AWS&apos;s outage.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Networking learning curve">
          <p className="text-slate-300">
            VPCs, subnets, security groups, and endpoints take time to learn. On-prem networking is
            also hard, but cloud mistakes can expose data to the internet in minutes if defaults are
            wrong.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Cost surprises">
          Cloud is not automatically cheaper. Idle oversized instances, unpartitioned Athena scans, and
          forgotten EBS volumes add up. FinOps — tagging, budgets, right-sizing — is part of the DE job.
        </Callout>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">On-premises</th>
                <th className="px-4 py-3">Cloud (AWS)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Upfront cost', 'High CapEx for hardware', 'Low upfront; OpEx per usage'],
                ['Scaling speed', 'Slow — procurement cycle', 'Fast — API/Console in minutes'],
                ['Maintenance', 'Your team owns hardware/OS', 'Provider owns physical layer; you configure services'],
                ['Elasticity', 'Fixed capacity between purchases', 'Scale up/down with demand'],
                ['Data residency', 'You choose physical location', 'You choose AWS Region; check compliance'],
                ['Skill focus', 'Datacenter + software', 'IAM, VPC, services + software'],
              ].map(([topic, onPrem, cloud]) => (
                <tr key={topic} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{topic}</td>
                  <td className="px-4 py-3">{onPrem}</td>
                  <td className="px-4 py-3">{cloud}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'On-prem = CapEx, slow scaling, and heavy ops; cloud = OpEx, fast elasticity, and managed services.',
          'DE teams gain experiment speed, global Regions, and integrated pipeline services in the cloud.',
          'Tradeoffs include vendor coupling, shared responsibility for security, and a networking learning curve — plus cost discipline.',
        ]}
      />
    </LessonArticle>
  )
}
