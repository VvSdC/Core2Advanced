import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherVpc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="VPC is the fabric — RDS, Glue, and Lambda plug into it">
        You covered public/private IPs and ENIs, DNS and DHCP, VPC endpoints, peering and Transit Gateway,
        VPN/Direct Connect/PrivateLink, flow logs and Network Firewall, Route 53 private zones, reference
        architectures for EC2/RDS/Redshift, Lambda VPC tradeoffs, which services need VPC, and the DE security
        checklist. This checkpoint ties intermediate and advanced VPC lessons before{' '}
        <strong className="text-white">Amazon EventBridge</strong> — event-driven orchestration for your lake.
      </Callout>

      <Definition term="VPC mental model for data engineering">
        <p>
          Amazon VPC is the <strong className="text-white">private network fabric</strong> for OLTP sources,
          warehouse clusters, and VPC-attached ETL workers. DE success means: place data tiers in private
          subnets, connect extract via SG-referenced paths (Glue connections, Lambda VPC, DMS), route lake I/O
          through S3 gateway endpoints, and scale multi-VPC/hybrid with TGW and Resolver — without exposing
          databases to the internet.
        </p>
      </Definition>

      <LessonSection title="VPC sub-topic map">
        <Flowchart
          title="VPC lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[VPC complete path]
  START --> IP[Public private IP ENI]
  START --> DNS[DNS and DHCP]
  START --> EP[VPC endpoints S3 interface]
  START --> PEER[VPC peering and TGW]
  START --> HYB[VPN DX PrivateLink]
  START --> FL[Flow logs Network Firewall]
  START --> R53[Route 53 private zones]
  START --> REF[EC2 RDS Redshift layout]
  START --> LAM[Lambda VPC networking]
  START --> WHCH[Which services need VPC]
  START --> SEC[VPC security checklist DE]
  IP --> EBNEXT
  DNS --> EBNEXT
  EP --> EBNEXT
  PEER --> EBNEXT
  HYB --> EBNEXT
  FL --> EBNEXT
  R53 --> EBNEXT
  REF --> EBNEXT
  LAM --> EBNEXT
  WHCH --> EBNEXT
  SEC --> EBNEXT
  EBNEXT[EventBridge event-driven next]`}
        />
      </LessonSection>

      <LessonSection title="Full VPC checkpoint — can you explain…">
        <ContentStep number={1} title="Addressing and ENIs">
          <p className="text-slate-300">
            Public vs private IP? When Elastic IP on NAT? How Glue and Lambda consume ENIs and subnet IPs?
            Why hard-coding RDS IP breaks after failover?
          </p>
        </ContentStep>
        <ContentStep number={2} title="DNS, DHCP, and endpoints">
          <p className="text-slate-300">
            AmazonProvidedDNS and enableDnsSupport? S3 gateway vs Secrets Manager interface endpoint? Why Glue
            in private subnet loves S3 gateway for TB Parquet without NAT cost?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Multi-VPC and hybrid">
          <p className="text-slate-300">
            Peering non-transitive limitation? When TGW over mesh peering? VPN vs DX for hybrid CDC vs bulk
            backfill? PrivateLink vs AWS VPC endpoint?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Reference architecture">
          <p className="text-slate-300">
            Draw public subnets (NAT/ALB) vs private ETL vs private data (RDS/Redshift)? Redshift enhanced VPC
            routing purpose? Which tier gets S3 gateway on route table?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Lambda and service matrix">
          <p className="text-slate-300">
            When Lambda needs VPC vs default for S3-only? Glue connection vs no connection? RDS/Redshift always
            in VPC — Athena/S3 default path?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Security and observability">
          <p className="text-slate-300">
            DE checklist top items? Flow log REJECT vs SG fix? When Network Firewall beyond SG + endpoints?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Private vs public subnet?',
                  'Public: route to IGW. Private: no direct inbound from internet; outbound via NAT or endpoints only.',
                ],
                [
                  'Why S3 gateway endpoint?',
                  'Free route table prefix list — private subnet S3 I/O without NAT data processing charges.',
                ],
                [
                  'Glue JDBC fails timeout?',
                  'SG/subnet/route first; DNS second; secret IAM third. Flow logs prove REJECT on 5432.',
                ],
                [
                  'Peering vs TGW?',
                  'Peering: 1:1 non-transitive. TGW: hub-spoke transitive routing for multi-account platforms.',
                ],
                [
                  'Lambda VPC tradeoff?',
                  'Needed for private RDS; adds cold start + ENI IPs; needs S3 endpoint or NAT for lake writes.',
                ],
                [
                  'Interface vs gateway endpoint?',
                  'Gateway: S3/DynamoDB route tables, free. Interface: ENI + PrivateLink, hourly, private DNS for APIs.',
                ],
                [
                  'RDS publicly accessible?',
                  'Avoid prod — private IP + SG from Glue/Lambda/DMS only.',
                ],
                [
                  'VPN vs Direct Connect?',
                  'VPN: IPsec over internet, quick/cheap. DX: dedicated fiber, TB backfill and steady CDC.',
                ],
                [
                  'Which services need your VPC?',
                  'RDS, Redshift, DMS, EC2, EMR in subnets; Glue/Lambda only when TCP to private IP; S3/Athena IAM default.',
                ],
                [
                  'Flow logs use case?',
                  'Metadata ACCEPT/REJECT — debug SG blocks on Glue→RDS without packet capture.',
                ],
                [
                  'Route 53 private zone?',
                  'VPC-scoped DNS — CNAME stable aliases for RDS/ALB; Resolver for hybrid corp.local.',
                ],
                [
                  'Redshift enhanced VPC routing?',
                  'COPY/UNLOAD uses your route tables — S3 gateway endpoint applies, flow logs visible.',
                ],
                [
                  'DE VPC top 3 rules?',
                  'No public RDS; S3 gateway on ETL routes; SG reference Glue→RDS not 0.0.0.0/0.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for EventBridge when…">
          You can whiteboard private RDS → Glue connection → S3 gateway endpoint → curated lake, explain why
          S3-only Glue skips VPC, and defend no public database — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Amazon EventBridge">
        <p className="text-slate-300">
          VPC lessons established how pipelines reach private sources and move lake data efficiently.{' '}
          <strong className="text-white">Amazon EventBridge</strong> is the serverless event bus that reacts
          to S3 object creates, scheduled rules, and custom application events — triggering Lambda, Glue
          workflows, and Step Functions without polling. Networking gets bits to services; EventBridge
          coordinates when work runs.
        </p>
        <Flowchart
          title="After VPC — course thread"
          chart={`flowchart LR
  RDS[(RDS private VPC)]
  GLUE[Glue JDBC connection]
  S3[(S3 curated lake)]
  EB[EventBridge rules]
  LAM[Lambda Step Functions]
  RDS --> GLUE
  GLUE --> S3
  S3 -->|Object Created event| EB
  EB --> LAM
  LAM --> S3`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding to a new team VPC, debugging Glue connection timeouts, or
          designing a multi-account landing zone — answers trace to endpoints, SG, DNS, and hybrid lessons
          covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC: private fabric for RDS/Redshift/DMS; Glue/Lambda attach only for private JDBC/API paths.',
          'Intermediate: IPs/ENIs, DNS/DHCP, S3 gateway + interface endpoints — NAT avoidance for lake I/O.',
          'Advanced: peering/TGW, hybrid VPN/DX/PrivateLink, flow logs, Route 53, Lambda tradeoffs, DE checklist.',
          'Reference layout: public NAT/ALB, private ETL, private data — SG references, no public databases.',
          'Next sub-topic: Amazon EventBridge — schedule and react to lake events to orchestrate Lambda, Glue, and Step Functions.',
        ]}
      />
    </LessonArticle>
  )
}
