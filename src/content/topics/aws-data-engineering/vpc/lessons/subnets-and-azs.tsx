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

export function SubnetsAndAzs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Subnets are rooms; AZs are buildings">
        A <strong className="text-white">subnet</strong> is a segment of your VPC IP range tied to exactly
        one <strong className="text-white">Availability Zone (AZ)</strong> — a physically separate data center
        campus in the Region. DE platforms spread RDS, Redshift, and Glue across at least two AZs for
        resilience while keeping databases in <strong className="text-white">private</strong> subnets away
        from direct internet exposure.
      </Callout>

      <Definition term="Subnet">
        <p>
          A <strong className="text-white">subnet</strong> is a contiguous slice of your VPC CIDR (e.g.{' '}
          <code className="text-core-400">10.0.1.0/24</code>) associated with one Availability Zone. Every
          ENI — RDS instance, Glue connection, Lambda, Redshift node — launches into a specific subnet and
          receives an IP from that subnet&apos;s range. Subnets do not span AZs; multi-AZ HA means duplicate
          subnet design in AZ-a and AZ-b, not one subnet stretching both.
        </p>
      </Definition>

      <LessonSection title="Public vs private subnets">
        <p className="text-slate-300">
          The labels <strong className="text-white">public</strong> and{' '}
          <strong className="text-white">private</strong> describe routing intent, not a magical AWS flag on
          the subnet resource itself. A subnet is public when its route table sends{' '}
          <code className="text-core-400">0.0.0.0/0</code> to an Internet Gateway; private when default
          internet-bound traffic goes to a NAT Gateway, VPC endpoint, or nowhere.
        </p>
        <ContentStep number={1} title="Private subnets — where DE data lives">
          <p className="text-slate-300">
            RDS primary and standby, Redshift clusters, Glue JDBC ENIs, DMS replication instances, and Lambda
            extract functions belong here. No route to IGW for inbound internet; outbound via NAT or endpoints
            only as needed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Public subnets — edge utilities only">
          <p className="text-slate-300">
            NAT Gateways, internet-facing load balancers, optional bastion hosts. DE rule: never place prod
            OLTP or warehouse ENIs in public subnets unless you have an explicit, audited exception — and
            even then, prefer private plus VPN.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Same VPC, different trust levels">
          <p className="text-slate-300">
            Security groups enforce which private subnet resources may talk — e.g. only Glue SG may reach RDS
            SG. Subnet tier plus SG equals defense in depth; neither replaces the other.
          </p>
        </ContentStep>
        <Example title="Subnet naming convention" caption="Copy into your runbook">
{`acme-prod-private-data-us-east-1a   10.0.1.0/24   route: NAT + S3 endpoint
acme-prod-private-data-us-east-1b   10.0.2.0/24   route: NAT + S3 endpoint
acme-prod-private-analytics-1a    10.0.50.0/24  route: NAT + S3 endpoint
acme-prod-public-nat-us-east-1a     10.0.101.0/24 route: IGW
acme-prod-public-nat-us-east-1b     10.0.102.0/24 route: IGW`}
        </Example>
      </LessonSection>

      <LessonSection title="Availability Zone placement">
        <ContentStep number={1} title="What an AZ is">
          <p className="text-slate-300">
            Each Region has multiple AZs (e.g. us-east-1a, us-east-1b) — isolated power and networking within
            the Region. RDS Multi-AZ standby and Redshift multi-node clusters spread across AZs so single-campus
            failure does not take down nightly loads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subnet per AZ pattern">
          <p className="text-slate-300">
            Create matching private subnets in at least two AZs:{' '}
            <code className="text-core-400">private-data-1a</code> and{' '}
            <code className="text-core-400">private-data-1b</code>. RDS subnet groups must span multiple AZs
            for Multi-AZ; Glue connections should list subnets in at least two AZs so job ENIs survive AZ
            impairment.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AZ capacity and placement">
          <p className="text-slate-300">
            Occasionally an AZ runs out of a specific instance type. DE teams keep subnet pairs ready in three
            AZs in large Regions for Redshift and RDS flexibility — advanced ops, but the mental model starts
            with two.
          </p>
        </ContentStep>
        <Flowchart
          title="Multi-AZ private subnets for RDS and Glue"
          chart={`flowchart TB
  VPC[VPC 10.0.0.0/16]
  VPC --> AZA[AZ us-east-1a]
  VPC --> AZB[AZ us-east-1b]
  AZA --> PRIVA[Private subnet 10.0.1.0/24]
  AZB --> PRIVB[Private subnet 10.0.2.0/24]
  PRIVA --> RDS1[RDS primary]
  PRIVB --> RDS2[RDS Multi-AZ standby]
  PRIVA --> GLUE[Glue connection subnets include both]
  PRIVB --> GLUE
  GLUE --> RDS1`}
        />
      </LessonSection>

      <LessonSection title="Subnet groups and DE services">
        <ContentStep number={1} title="RDS DB subnet group">
          <p className="text-slate-300">
            RDS requires a <strong className="text-white">DB subnet group</strong> — a named list of private
            subnets in at least two AZs. The primary ENI lands in one; Multi-AZ standby in another. Wrong
            subnet group (public-only) is a common prod misconfiguration caught at deploy time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Redshift subnet group">
          <p className="text-slate-300">
            Redshift clusters similarly require subnets across AZs for the cluster subnet group. All nodes
            stay private; clients connect via private IP or Redshift-managed endpoint inside the VPC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue connection subnets">
          <p className="text-slate-300">
            When a Glue job uses a JDBC connection, AWS creates ENIs in the subnets you specify. Pick private
            data subnets with routes to RDS and S3 endpoint; include multiple AZs for resilience. Too few
            free IPs in one subnet blocks concurrent job runs.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Subnet choice is not cosmetic — it determines which route table, which AZ failure domain, and which
          IP pool your extract pipeline uses. Document subnet IDs in the same runbook as JDBC URLs.
        </Callout>
      </LessonSection>

      <LessonSection title="Route table association — one subnet, one table">
        <p className="text-slate-300">
          Each subnet associates with exactly one route table at a time. That association defines public vs
          private behavior. A classic DE mistake: private RDS subnets accidentally associated with the public
          route table (IGW default route) — security review nightmare even if SGs still block inbound.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Subnet type</th>
                <th className="px-4 py-3">Typical routes</th>
                <th className="px-4 py-3">DE resources</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Private data',
                  'Local VPC; 0.0.0.0/0 → NAT; S3 prefix → gateway endpoint',
                  'RDS, Glue ENI, DMS, Lambda extract',
                ],
                [
                  'Private analytics',
                  'Same as private data; may add interface endpoints for Redshift API',
                  'Redshift, EMR (if used), large batch workers',
                ],
                [
                  'Public edge',
                  'Local VPC; 0.0.0.0/0 → IGW',
                  'NAT Gateway, ALB, bastion — not prod databases',
                ],
              ].map(([type, routes, resources]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{routes}</td>
                  <td className="px-4 py-3">{resources}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Subnets are AZ-scoped IP slices of your VPC; multi-AZ HA uses matching subnets in two or more AZs.',
          'Public vs private is defined by route table (IGW vs NAT/endpoint), not by subnet name alone.',
          'DE data tier (RDS, Redshift, Glue, DMS) belongs in private subnets; public subnets host NAT and edge only.',
          'RDS DB subnet groups and Glue connection subnet lists must span AZs with enough free IPs for ENIs.',
        ]}
      />
    </LessonArticle>
  )
}
