import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VpcPeeringAndTgw() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One lake, many VPCs — peering or Transit Gateway">
        Enterprise data platforms rarely live in a single VPC. Ingestion, processing, and serving tiers may
        sit in separate accounts or environments.{' '}
        <strong className="text-white">VPC peering</strong> connects two VPCs directly;{' '}
        <strong className="text-white">Transit Gateway (TGW)</strong> scales hub-and-spoke routing for dozens
        of VPCs and on-prem networks — the pattern multi-account DE platforms adopt.
      </Callout>

      <Definition term="VPC peering">
        <p>
          A peering connection is a non-transitive, one-to-one link between two VPCs. Routes in each VPC&apos;s
          route tables forward traffic to the peer&apos;s CIDR via the peering connection ID. Security groups
          can reference peer SGs in the same Region. No overlapping CIDR blocks allowed. Peering does not
          pass through a central hub — each pair needs its own connection and route updates.
        </p>
      </Definition>

      <LessonSection title="VPC Peering">
        <ContentStep number={1} title="When peering fits DE workloads">
          <p className="text-slate-300">
            Simple cases: shared services VPC (central DNS, logging) peered to a data VPC; dev VPC peered to
            a sandbox RDS VPC for JDBC testing; two-team VPCs in one account needing Redshift-to-RDS private
            access. Low operational overhead for two or three VPC pairs with stable CIDR planning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Peering limitations">
          <p className="text-slate-300">
            <strong className="text-white">Non-transitive:</strong> if A peers with B and B peers with C, A
            cannot reach C through B — you need A–C peering or TGW. Cross-Region peering adds latency and
            separate billing. No transitive routing means mesh peering explodes:{' '}
            <em>n(n−1)/2</em> connections for n VPCs — unmaintainable at platform scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE routing and SG">
          <p className="text-slate-300">
            Add routes in both directions: data VPC private subnet → peer CIDR via pcx-xxx. RDS SG allows
            Glue connection SG from peer VPC (SG referencing works same Region). Document which CIDR owns
            which environment — overlapping plans block peering acceptance.
          </p>
        </ContentStep>
        <Example title="Peering for cross-VPC JDBC">
{`Data VPC: 10.10.0.0/16 (Glue, lake subnets)
Shared RDS VPC: 10.20.0.0/16 (central OLTP replicas)

Peering pcx-abc between VPCs
Route in data VPC: 10.20.0.0/16 → pcx-abc
Route in RDS VPC: 10.10.0.0/16 → pcx-abc

Glue connection in 10.10.1.0/24 → JDBC to 10.20.2.50 (RDS private IP)
RDS SG: allow sg-glue-data on 5432`}
        </Example>
      </LessonSection>

      <LessonSection title="Transit Gateway">
        <ContentStep number={1} title="Hub-and-spoke routing">
          <p className="text-slate-300">
            Attach each VPC to a Transit Gateway with a TGW attachment. Route tables on the TGW control which
            attachments can talk — for example <em>prod data VPC</em> can reach <em>shared services</em> and{' '}
            <em>on-prem</em> but not <em>dev VPC</em>. One attachment per VPC replaces full mesh peering.
            Supports inter-Region peering of TGWs for global platforms.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TGW route tables and segmentation">
          <p className="text-slate-300">
            Network teams create route tables: <strong className="text-white">spoke-prod</strong>,{' '}
            <strong className="text-white">spoke-nonprod</strong>,{' '}
            <strong className="text-white">shared-services</strong>. Propagate VPC CIDRs or use static routes.
            DE asks for routes from ingestion VPC to warehouse VPC and to hybrid DNS — not blanket full mesh.
            Blackhole routes isolate compromised segments during incidents.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost and HA">
          <p className="text-slate-300">
            TGW charges per attachment and per GB processed — still cheaper operationally than managing 50
            peerings. Deploy TGW in multiple AZs; attachments inherit AZ requirements. Large Spark cross-VPC
            traffic may need compression and schedule awareness — TGW is not a data transfer accelerator.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When multi-account DE platforms use TGW">
        <ContentStep number={1} title="Landing zone pattern">
          <p className="text-slate-300">
            Organizations split accounts: <em>data-ingest</em>, <em>data-process</em>, <em>data-consumption</em>,{' '}
            <em>network-shared</em>. Each account owns a VPC attached to a central TGW in the network account.
            IAM and SCPs enforce boundaries; TGW provides private connectivity for DMS → RDS in app account →
            Glue in data account → Redshift in analytics account — all without public endpoints.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hybrid and shared services">
          <p className="text-slate-300">
            TGW integrates VPN and Direct Connect attachments — on-prem SAP or mainframe batch lands in a
            staging VPC, routes to lake ingestion VPC. Shared services VPC hosts centralized logging, Resolver
            endpoints, and PrivateLink consumer endpoints for SaaS — spokes consume without internet egress.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When peering still wins">
          <p className="text-slate-300">
            Two VPCs, one team, no growth forecast — peering is faster to stand up. TGW when attachment count
            exceeds roughly four VPCs, you need segmentation policies, or multi-account is mandatory. Interview
            answer: peering = simple pairwise; TGW = enterprise scale and transitive routing through a hub.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Cross-account TGW requires RAM (Resource Access Manager) sharing of the attachment or centralized
          network account ownership — coordinate with cloud foundation team before deploying cross-account Glue
          connections.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC peering: 1:1, non-transitive, no overlapping CIDR — fine for 2–3 VPC pairs, not platform scale.',
          'Transit Gateway: hub-and-spoke, transitive via TGW route tables — standard for multi-account DE landing zones.',
          'Multi-account DE: ingest/process/consume VPCs attach to TGW for private DMS, Glue, Redshift paths without public internet.',
          'TGW route tables segment prod vs nonprod; pair with SG least privilege — routing alone is not security.',
          'Choose peering for simplicity; TGW when mesh would explode or hybrid VPN/DX centralization is required.',
        ]}
      />
    </LessonArticle>
  )
}
