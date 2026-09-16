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

export function NatGatewayAndInstance() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Outbound-only internet for private subnets">
        RDS and Glue live in <strong className="text-white">private subnets</strong> — no inbound connections
        from the internet. But Glue still needs to reach AWS APIs, download JDBC drivers, call external SaaS
        webhooks, or pull container images. <strong className="text-white">NAT (Network Address Translation)</strong>{' '}
        lets private resources initiate outbound connections that appear to come from a public IP in a public
        subnet — without accepting unsolicited inbound traffic to your databases.
      </Callout>

      <Definition term="NAT Gateway">
        <p>
          A <strong className="text-white">NAT Gateway</strong> is a managed AWS service placed in a{' '}
          <strong className="text-white">public subnet</strong> with an Elastic IP. Private subnet route tables
          send <code className="text-core-400">0.0.0.0/0</code> traffic to the NAT Gateway. Outbound packets
          get source-NATted to the NAT&apos;s public IP; return traffic is translated back to the private
          instance ENI. Inbound connections initiated from the internet are not forwarded to private hosts —
          the core security property DE teams want for prod data tiers.
        </p>
      </Definition>

      <LessonSection title="NAT Gateway vs NAT Instance">
        <p className="text-slate-300">
          AWS offers two patterns. Production DE platforms overwhelmingly use{' '}
          <strong className="text-white">NAT Gateway</strong>; NAT Instance is legacy exam trivia and rare
          greenfield designs.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">NAT Gateway (managed)</th>
                <th className="px-4 py-3">NAT Instance (EC2)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Availability', 'AWS-managed HA in AZ; scale to 100 Gbps', 'You patch, size, and failover EC2 yourself'],
                ['Cost model', 'Hourly charge + per-GB processed', 'EC2 instance cost + EBS; cheaper at tiny scale only'],
                ['Maintenance', 'None — AWS operates', 'OS updates, autoscaling group recommended'],
                ['Security groups', 'Not attachable — use NACLs on subnets', 'Security group on the EC2 instance'],
                ['DE recommendation', 'Default for prod Glue/Lambda private egress', 'Labs and cost-sensitive sandboxes only'],
              ].map(([aspect, gw, inst]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{gw}</td>
                  <td className="px-4 py-3">{inst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Route S3 and DynamoDB through <strong className="text-white">gateway endpoints</strong> first — NAT
          per-GB charges add up when Glue writes terabytes nightly. NAT is for everything endpoints do not
          cover (external APIs, some AWS services without endpoints).
        </Callout>
      </LessonSection>

      <LessonSection title="Private subnet outbound without inbound">
        <ContentStep number={1} title="Connection initiation direction">
          <p className="text-slate-300">
            Glue ENI at <code className="text-core-400">10.0.1.50</code> opens HTTPS to a vendor API. Packet
            leaves private subnet → NAT Gateway (public subnet) → Internet Gateway → internet. Reply packets
            match established NAT state and return to Glue. An attacker scanning the NAT public IP cannot
            open PostgreSQL to your RDS — RDS has no public path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What still needs NAT in DE pipelines">
          <p className="text-slate-300">
            External REST APIs, Maven/PyPI if not vendored, some third-party JDBC drivers, Slack/PagerDuty
            webhooks from Lambda in VPC, and AWS services without interface endpoints in your design (minimize
            this list with endpoints).
          </p>
        </ContentStep>
        <ContentStep number={3} title="What should not use NAT">
          <p className="text-slate-300">
            S3 lake read/write, DynamoDB (if used), and intra-VPC JDBC to RDS — use gateway endpoints or local
            routes. Paying NAT tax on every Parquet object multiplies cost at scale.
          </p>
        </ContentStep>
        <Flowchart
          title="Private subnet outbound via NAT (no inbound to RDS)"
          chart={`flowchart LR
  GLUE[Glue private 10.0.1.50]
  RDS[RDS private 10.0.1.120]
  NAT[NAT Gateway public subnet]
  IGW[Internet Gateway]
  EXT[External HTTPS API]
  GLUE -->|JDBC local| RDS
  GLUE -->|0.0.0.0/0| NAT
  NAT --> IGW
  IGW --> EXT
  EXT -.->|return traffic only| NAT
  NAT -.-> GLUE`}
        />
      </LessonSection>

      <LessonSection title="HA and AZ alignment">
        <ContentStep number={1} title="NAT Gateway is AZ-specific">
          <p className="text-slate-300">
            Each NAT Gateway lives in one public subnet in one AZ. If that AZ fails, private subnets routing
            to that NAT lose outbound internet until you fail over routes — plan one NAT per AZ for prod DE
            platforms running critical scheduled Glue loads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Route table per AZ pattern">
          <p className="text-slate-300">
            Private subnet in us-east-1a routes <code className="text-core-400">0.0.0.0/0</code> to NAT in
            us-east-1a — not cross-AZ NAT if avoidable (cross-AZ data charges). Mirror for 1b with its own
            NAT.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Elastic IP requirement">
          <p className="text-slate-300">
            NAT Gateway requires an Elastic IP in the public subnet. Document EIPs in your network inventory —
            accidental release breaks outbound from all dependent private subnets.
          </p>
        </ContentStep>
        <Example title="Prod DE NAT checklist" caption="Before go-live">
{`[ ] NAT Gateway in each AZ public subnet used by private data tiers
[ ] Elastic IP attached per NAT
[ ] Private route table 0.0.0.0/0 → local-AZ NAT (not other AZ)
[ ] S3 gateway endpoint on private route table (lake traffic off NAT)
[ ] CloudWatch alarm on NAT ErrorPortAllocation (subnet IP exhaustion)
[ ] Runbook: Glue job fails external call — verify NAT route vs endpoint gap`}
        </Example>
      </LessonSection>

      <LessonSection title="Cost-aware DE design">
        <ContentStep number={1} title="Monitor NAT ProcessedBytes">
          <p className="text-slate-300">
            CloudWatch metric <code className="text-core-400">BytesOutToDestination</code> on NAT Gateway
            reveals if lake traffic incorrectly hairpins through NAT — fix route tables to S3 endpoint.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Single NAT in dev only">
          <p className="text-slate-300">
            Dev accounts often use one NAT Gateway to save hourly cost — acceptable when AZ outage does not
            block prod SLAs. Prod multi-AZ ETL should not share one NAT across AZs long term.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Interface endpoints reduce NAT need">
          <p className="text-slate-300">
            Secrets Manager, Glue API, STS, and CloudWatch Logs interface endpoints keep control-plane traffic
            off NAT — advanced lesson, but the cost principle starts here: endpoints where possible, NAT for
            the rest.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'NAT Gateway (managed, prod default) lets private subnets initiate outbound internet without inbound exposure to RDS/Glue.',
          'Place NAT in public subnets with EIPs; private route tables use 0.0.0.0/0 → NAT, not IGW.',
          'Prefer S3 gateway endpoints for lake traffic — NAT per-GB charges hurt at DE scale.',
          'One NAT per AZ for HA; align private subnet routes to NAT in the same AZ to avoid cross-AZ fees.',
        ]}
      />
    </LessonArticle>
  )
}
