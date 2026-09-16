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

export function CidrAndIpv4() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="IP addresses without the PhD">
        Every resource in your VPC gets an <strong className="text-white">IPv4 address</strong> like{' '}
        <code className="text-core-400">10.0.2.45</code>. The{' '}
        <strong className="text-white">CIDR block</strong> you pick when creating the VPC defines how many
        such addresses exist and which numbers are valid. You do not need to memorize binary math — you need
        to read <code className="text-core-400">/16</code> and <code className="text-core-400">/24</code>{' '}
        on architecture diagrams and avoid overlapping ranges that break peering later.
      </Callout>

      <Definition term="CIDR (Classless Inter-Domain Routing)">
        <p>
          <strong className="text-white">CIDR notation</strong> writes an IP network as a base address plus a
          prefix length — e.g. <code className="text-core-400">10.0.0.0/16</code>. The number after the
          slash tells how many leading bits are fixed for the network portion; the rest are available for
          host addresses. AWS VPCs use IPv4 CIDR blocks; each subnet must be a{' '}
          <strong className="text-white">subset</strong> of the VPC CIDR and cannot overlap sibling subnets.
        </p>
      </Definition>

      <LessonSection title="/16 and /24 in plain English">
        <p className="text-slate-300">
          Think of the slash number as &quot;how big the neighborhood is.&quot; A{' '}
          <strong className="text-white">smaller</strong> number after the slash means a{' '}
          <strong className="text-white">bigger</strong> neighborhood.
        </p>
        <ContentStep number={1} title="/16 — the whole VPC campus">
          <p className="text-slate-300">
            <code className="text-core-400">10.0.0.0/16</code> is a common prod VPC size — about 65,000
            usable private addresses from <code className="text-core-400">10.0.0.0</code> through{' '}
            <code className="text-core-400">10.0.255.255</code>. Large enough for hundreds of subnets,
            Glue ENIs, RDS failover IPs, and future Redshift node growth without redesigning the VPC.
          </p>
        </ContentStep>
        <ContentStep number={2} title="/24 — one subnet building">
          <p className="text-slate-300">
            <code className="text-core-400">10.0.1.0/24</code> yields 256 addresses (251 usable after AWS
            reserves five per subnet). Typical pattern: one /24 private subnet per AZ for data tier, another
            /24 public per AZ for NAT — e.g.{' '}
            <code className="text-core-400">10.0.1.0/24</code> (private-a),{' '}
            <code className="text-core-400">10.0.2.0/24</code> (private-b),{' '}
            <code className="text-core-400">10.0.101.0/24</code> (public-a).
          </p>
        </ContentStep>
        <ContentStep number={3} title="/28 — tiny utility subnet">
          <p className="text-slate-300">
            <code className="text-core-400">10.0.101.0/28</code> has only 16 addresses — enough for a NAT
            Gateway and a bastion, not for a Redshift cluster. Match subnet size to expected ENI count plus
            headroom.
          </p>
        </ContentStep>
        <Example title="Quick CIDR size reference" caption="Memorize these three for interviews">
{`/16  → ~65,536 addresses  → typical whole VPC (10.0.0.0/16)
/24  → 256 addresses        → typical subnet per AZ
/28  → 16 addresses         → NAT or firewall subnet only

Rule of thumb: VPC /16, subnets /24 unless you have a reason to go smaller.`}
        </Example>
      </LessonSection>

      <LessonSection title="Private vs public IP ranges (RFC 1918)">
        <p className="text-slate-300">
          AWS VPC private addresses use RFC 1918 ranges — not routable on the public internet:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Range</th>
                <th className="px-4 py-3">Common DE usage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['10.0.0.0/8', 'Most common in AWS examples — 10.0.0.0/16 prod, 10.1.0.0/16 dev'],
                ['172.16.0.0/12', 'Alternative when 10.x is exhausted or corporate standard mandates 172.x'],
                ['192.168.0.0/16', 'Smaller labs; less headroom for large /16-style campus designs'],
              ].map(([range, usage]) => (
                <tr key={range} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{range}</td>
                  <td className="px-4 py-3">{usage}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Public IP vs public subnet">
          A &quot;public subnet&quot; means a route to an Internet Gateway exists — not that RDS gets a public
          IP. DE databases stay private IPs even when the subnet is labeled public; only NAT and bastions
          belong there.
        </Callout>
      </LessonSection>

      <LessonSection title="Planning address space for DE accounts">
        <ContentStep number={1} title="Separate VPCs per environment">
          <p className="text-slate-300">
            Prod <code className="text-core-400">10.0.0.0/16</code>, staging{' '}
            <code className="text-core-400">10.1.0.0/16</code>, dev{' '}
            <code className="text-core-400">10.2.0.0/16</code> — non-overlapping CIDRs so VPC peering and
            Transit Gateway routes do not collide. Overlap forces NAT hairpin or duplicate NAT — painful for
            Glue connections that must reach peered RDS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reserve tiers in the second octet">
          <p className="text-slate-300">
            Example convention inside <code className="text-core-400">10.0.0.0/16</code>:{' '}
            <code className="text-core-400">10.0.1.0/24</code>–<code className="text-core-400">10.0.9.0/24</code>{' '}
            for private data subnets; <code className="text-core-400">10.0.101.0/24</code>+ for public/NAT;
            <code className="text-core-400">10.0.50.0/24</code> for analytics (Redshift). Document the map
            before the first RDS instance — retrofitting subnets is disruptive.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Headroom for managed services">
          <p className="text-slate-300">
            Redshift adds many nodes; Glue creates ENIs per job run in VPC mode; RDS Multi-AZ adds standby
            ENIs. Undersized /28 data subnets exhaust IPs silently — CloudWatch shows ENI creation failures
            long after the VPC was &quot;done.&quot;
          </p>
        </ContentStep>
        <Flowchart
          title="Example DE VPC address plan (10.0.0.0/16)"
          chart={`flowchart LR
  VPC[10.0.0.0/16 VPC]
  VPC --> PRIVA[10.0.1.0/24 private AZ-a RDS Glue]
  VPC --> PRIVB[10.0.2.0/24 private AZ-b RDS replica]
  VPC --> ANAL[10.0.50.0/24 private AZ-a Redshift]
  VPC --> PUBA[10.0.101.0/24 public AZ-a NAT]
  VPC --> PUBB[10.0.102.0/24 public AZ-b NAT]`}
        />
      </LessonSection>

      <LessonSection title="Secondary CIDRs and IPv6 (awareness)">
        <ContentStep number={1} title="Adding CIDR blocks to a running VPC">
          <p className="text-slate-300">
            If a prod VPC runs out of /24 subnets, AWS allows associating additional IPv4 CIDR blocks (e.g.
            add <code className="text-core-400">10.1.0.0/16</code> to the same VPC). Plan this before
            emergency — routing and NACL updates must stay consistent.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IPv6">
          <p className="text-slate-300">
            AWS can assign IPv6 /56 per VPC. Most DE JDBC and legacy BI tools still use IPv4 today — know
            IPv6 exists for completeness, but beginner DE diagrams stay IPv4-first.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview question: &quot;Why not use 192.168.0.0/16 for every account?&quot; — Because peering prod
          analytics to shared services VPC requires unique, non-overlapping CIDRs; duplicate ranges make
          routing ambiguous.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CIDR notation (e.g. 10.0.0.0/16) defines your VPC IP neighborhood; /16 for VPC, /24 for typical subnets.',
          'Use RFC 1918 private ranges (10.x most common); plan non-overlapping CIDRs per env for future peering.',
          'Reserve subnet tiers for private data, analytics, and public/NAT — document before provisioning RDS or Redshift.',
          'Undersized subnets exhaust ENI capacity; Glue, RDS Multi-AZ, and Redshift all consume multiple IPs.',
        ]}
      />
    </LessonArticle>
  )
}
