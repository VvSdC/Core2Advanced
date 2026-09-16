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

export function IgwRouteTables() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Routes tell packets where to go">
        A <strong className="text-white">route table</strong> is a list of destination → target rules attached
        to subnets. An <strong className="text-white">Internet Gateway (IGW)</strong> is the VPC&apos;s front
        door to the public internet. Together they define whether traffic from a Glue worker, NAT Gateway, or
        bastion can reach AWS APIs, vendor patches, or — critically for DE — whether your{' '}
        <strong className="text-white">private RDS stays unreachable from the internet</strong> because its
        subnet never points default routes at the IGW.
      </Callout>

      <Definition term="Internet Gateway (IGW)">
        <p>
          An <strong className="text-white">Internet Gateway</strong> is a horizontally scaled, redundant VPC
          component that allows communication between your VPC and the internet. It supports IPv4 and IPv6,
          performs NAT for instances with public IPv4 addresses, and is attached at the VPC level — not inside
          a subnet. Resources in public subnets use a route table entry{' '}
          <code className="text-core-400">0.0.0.0/0 → igw-xxxx</code> to reach the internet bidirectionally
          when they also have a public IP or Elastic IP.
        </p>
      </Definition>

      <LessonSection title="Route tables and routes">
        <p className="text-slate-300">
          Every VPC has a <strong className="text-white">main route table</strong> (implicit local routes for
          the VPC CIDR). Custom route tables override associations per subnet. A{' '}
          <strong className="text-white">route</strong> matches a destination CIDR and sends matching packets
          to a target: Internet Gateway, NAT Gateway, VPC endpoint, Transit Gateway, or{' '}
          <code className="text-core-400">local</code> for traffic staying inside the VPC.
        </p>
        <ContentStep number={1} title="Local route — always present">
          <p className="text-slate-300">
            <code className="text-core-400">10.0.0.0/16 → local</code> means traffic destined to any IP in
            your VPC stays internal. Glue ENI at <code className="text-core-400">10.0.1.50</code> talking to
            RDS at <code className="text-core-400">10.0.1.120</code> uses this route — no IGW, no NAT.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default internet route">
          <p className="text-slate-300">
            <code className="text-core-400">0.0.0.0/0 → igw-xxxx</code> sends all other IPv4 traffic to the
            internet via the Internet Gateway. This makes a subnet <strong className="text-white">public</strong>{' '}
            when resources there have public IPs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="NAT route for private subnets">
          <p className="text-slate-300">
            Private data subnets use <code className="text-core-400">0.0.0.0/0 → nat-xxxx</code> instead of
            IGW — outbound internet only, initiated from inside. Covered in detail in the NAT lesson; route
            tables are where that distinction is enforced.
          </p>
        </ContentStep>
        <ContentStep number={4} title="S3 gateway endpoint route">
          <p className="text-slate-300">
            A prefix list route sends S3 traffic to a <strong className="text-white">gateway endpoint</strong>{' '}
            — stays on AWS network, no NAT charge. DE private subnets should prefer this for lake read/write.
          </p>
        </ContentStep>
        <Example title="Two route tables side by side" caption="Public vs private DE subnets">
{`Public route table (NAT subnet):
  10.0.0.0/16  → local
  0.0.0.0/0    → igw-0abc123

Private data route table (RDS, Glue):
  10.0.0.0/16  → local
  pl-63a5400a  → vpce-0s3gateway   (S3 prefix list → gateway endpoint)
  0.0.0.0/0    → nat-0def456       (outbound APIs, patches — not for S3 if endpoint exists)`}
        </Example>
      </LessonSection>

      <LessonSection title="How a subnet becomes public">
        <p className="text-slate-300">
          A subnet is public when <strong className="text-white">both</strong> conditions hold:
        </p>
        <ContentStep number={1} title="Route table sends 0.0.0.0/0 to IGW">
          <p className="text-slate-300">
            The subnet association must use a route table with an Internet Gateway default route — not NAT,
            not missing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resources need a public IP path (when they talk to internet)">
          <p className="text-slate-300">
            EC2 instances use &quot;Auto-assign public IPv4&quot; or an Elastic IP. NAT Gateway ENIs live in
            public subnets with public addresses. RDS in a public-routed subnet still should{' '}
            <strong className="text-white">not</strong> enable &quot;Publicly accessible&quot; — routing alone
            does not expose the database port without public IP plus SG misconfiguration.
          </p>
        </ContentStep>
        <Flowchart
          title="Traffic paths from route table choice"
          chart={`flowchart TB
  GLUE[Glue ENI private subnet]
  RDS[RDS private IP]
  S3[S3 bucket]
  INT[Internet API]
  GLUE -->|local route 10.0.0.0/16| RDS
  GLUE -->|S3 prefix to endpoint| S3
  GLUE -->|0.0.0.0/0 to NAT| NAT[NAT in public subnet]
  NAT -->|0.0.0.0/0 to IGW| IGW[Internet Gateway]
  IGW --> INT`}
        />
        <Callout variant="insight">
          DE security reviews ask: &quot;Show me the route table for the RDS subnet.&quot; Correct answer:
          local plus S3 endpoint plus NAT — never IGW on the database tier.
        </Callout>
      </LessonSection>

      <LessonSection title="Internet Gateway behavior DE teams rely on">
        <ContentStep number={1} title="One IGW per VPC">
          <p className="text-slate-300">
            Attach a single Internet Gateway to the VPC edge. Detaching IGW breaks public subnet internet
            access — including NAT Gateway outbound if NAT depends on IGW path from public subnet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IGW is not a NAT for private IPs">
          <p className="text-slate-300">
            Private subnet instances without public IPs cannot use IGW directly — even if mis-associated with
            a public route table, outbound internet fails. That is why NAT exists for Glue to reach external
            APIs while RDS stays private.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Symmetric return for public IPs">
          <p className="text-slate-300">
            IGW handles return traffic for established connections to public IPs. Bastions in public subnets
            use this for emergency DBA SSH — then port-forward to private RDS, not public RDS endpoints.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Troubleshooting route table mistakes">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely route table issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Glue in VPC cannot reach S3',
                  'Private subnet missing S3 gateway endpoint route and no NAT default route',
                ],
                [
                  'Glue reaches S3 but not external API',
                  'NAT route missing or NAT in wrong public subnet without IGW path',
                ],
                [
                  'RDS reachable from internet unexpectedly',
                  'Publicly accessible Yes plus public IP — fix SG and disable public access, fix route tier',
                ],
                [
                  'Cross-subnet JDBC works in one AZ only',
                  'Local route OK — check SG/NACL, not route table (local covers all VPC CIDR)',
                ],
              ].map(([symptom, issue]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{symptom}</td>
                  <td className="px-4 py-3">{issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Console check before opening a ticket">
          VPC → Subnets → select subnet → Route table tab → Routes. Confirm IGW appears only on public/NAT
          subnets, never on RDS subnet groups.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Internet Gateway is the VPC attachment for bidirectional internet access; route 0.0.0.0/0 → IGW makes a subnet public.',
          'Route tables bind destinations to targets: local for intra-VPC, endpoint for S3, NAT for private outbound, IGW for public tier.',
          'DE private subnets: local + S3 gateway endpoint + NAT default route — not IGW on data-tier associations.',
          'Glue→RDS uses local routes; Glue→S3 prefers endpoint routes; misconfigured routes cause timeouts before Spark starts.',
        ]}
      />
    </LessonArticle>
  )
}
