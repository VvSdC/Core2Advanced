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

export function VpnDirectConnectPrivatelink() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Hybrid sources feed the lake through private paths">
        Not all operational data starts in AWS. On-prem ERP, factory SCADA historians, and partner SFTP drops
        need secure connectivity into your VPC.{' '}
        <strong className="text-white">Site-to-Site VPN</strong>,{' '}
        <strong className="text-white">Direct Connect</strong>, and{' '}
        <strong className="text-white">AWS PrivateLink</strong> each solve different hybrid and SaaS
        integration problems for data engineering teams.
      </Callout>

      <Definition term="Hybrid connectivity for data platforms">
        <p>
          Hybrid connectivity extends your VPC network to non-AWS networks or exposes AWS services to consumers
          without public internet. DE cares about predictable bandwidth for bulk backfill, low-latency CDC
          streams, and compliance-friendly paths that keep PII off the public internet during extract and
          landing to S3 bronze tiers.
        </p>
      </Definition>

      <LessonSection title="Site-to-Site VPN">
        <ContentStep number={1} title="IPsec over internet">
          <p className="text-slate-300">
            A Site-to-Site VPN connects your on-prem router/firewall to a{' '}
            <strong className="text-white">Virtual Private Gateway</strong> or{' '}
            <strong className="text-white">Transit Gateway</strong> via encrypted IPsec tunnels (two tunnels
            for HA). On-prem CIDR routes propagate into VPC route tables — DMS replication instances or
            self-hosted agents can JDBC to on-prem Oracle/SQL Server from private subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Nightly batch JDBC extract through VPN when Direct Connect is not yet provisioned; dev/test hybrid
            links; failover path alongside DX. Throughput limited by internet link and VPN caps — fine for
            incremental CDC megabytes, painful for multi-TB initial load without compression or physical
            seeding (snowball, shipped disk, or one-time bulk over DX).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Routing and DNS">
          <p className="text-slate-300">
            Route tables in data VPC must include on-prem prefixes via VGW/TGW. Route 53 Resolver rules
            forward DNS for corp.local so JDBC URLs resolve. MTU and asymmetric routing cause subtle JDBC
            timeouts — network team coordination is part of DE onboarding checklists.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Direct Connect">
        <ContentStep number={1} title="Dedicated private fiber">
          <p className="text-slate-300">
            Direct Connect (DX) establishes a private connection from your datacenter or colo to AWS through
            a partner or dedicated port. Lower, consistent latency and higher throughput than VPN over internet.
            Virtual interfaces (VIFs) terminate on VGW or TGW — same routing model as VPN but with SLA-grade
            capacity for warehouse-scale backfill.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE bulk load pattern">
          <p className="text-slate-300">
            Initial lake migration: on-prem DB → extract agent → S3 over DX path → Glue catalog → curated
            Parquet. Steady-state CDC via DMS with DX handling continuous replication load. VPN as backup when
            DX fails — dual-path hybrid is common in finance and healthcare DE architectures.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DX Gateway and multi-account">
          <p className="text-slate-300">
            DX Gateway associates VIFs with multiple VPCs across accounts via TGW — central hybrid ingress for
            a multi-account data mesh without per-VPC DX ports. Data platform teams request DX capacity
            planning alongside Redshift and S3 ingest forecasts.
          </p>
        </ContentStep>
        <Example title="Hybrid extract path">
{`On-prem SQL Server (192.168.50.0/24)
  → DX or VPN → TGW → Ingest VPC (10.30.0.0/16)
  → DMS replication instance (private subnet)
  → S3 bronze via gateway endpoint
  → Glue curated job

No public IP on source or DMS — SG allows DMS SG only`}
        </Example>
      </LessonSection>

      <LessonSection title="AWS PrivateLink">
        <ContentStep number={1} title="Private connectivity to services">
          <p className="text-slate-300">
            PrivateLink exposes a service via <strong className="text-white">VPC endpoint services</strong>{' '}
            (provider) consumed by <strong className="text-white">interface endpoints</strong> (consumer) in
            other VPCs or accounts. Traffic stays on AWS backbone — not internet, not peering CIDR overlap
            issues. SaaS vendors offer PrivateLink for Snowflake, Datadog, and others; internal teams expose
            internal APIs to data VPCs the same way.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE consumer patterns">
          <p className="text-slate-300">
            Analytics VPC consumes a PrivateLink endpoint to a central API gateway in shared services — trigger
            pipelines without public URLs. Cross-account S3 access sometimes uses PrivateLink-powered access
            points. Contrast with VPC endpoints (AWS services) — PrivateLink is for customer/partner services.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Provider side for internal platforms">
          <p className="text-slate-300">
            Central data platform team exposes metadata catalog or orchestration API via NLB + endpoint service;
            domain team VPCs create interface endpoints with approval. Replaces brittle IP allowlists on public
            ALBs for inter-team ETL triggers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Hybrid lake sources">
        <ContentStep number={1} title="Landing zone on S3">
          <p className="text-slate-300">
            Standard pattern: hybrid extract lands raw files or CDC in S3 bronze (via DX/VPN-connected agent
            or Storage Gateway). Glue crawlers and Spark jobs run entirely in AWS VPC — hybrid link only for
            extract window, not every Athena query. Minimize cross-prem round trips after initial load.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security and compliance">
          <p className="text-slate-300">
            DX and VPN traffic bypasses public internet — satisfies data residency and exfiltration policies.
            Encrypt in transit (TLS on JDBC, SSE-KMS on S3). Network ACLs and SGs still required — private
            path is not implicit authentication.
          </p>
        </ContentStep>
        <Flowchart
          title="Hybrid source to lake"
          chart={`flowchart LR
  ONPREM[(On-prem OLTP)]
  DX[Direct Connect or VPN]
  TGW[Transit Gateway]
  DMS[DMS in ingest VPC]
  S3[(S3 bronze)]
  GLUE[Glue curated]
  ONPREM --> DX
  DX --> TGW
  TGW --> DMS
  DMS --> S3
  S3 --> GLUE`}
        />
        <Callout variant="insight">
          Interview sketch: VPN = quick encrypted internet tunnel; DX = dedicated high-throughput hybrid;
          PrivateLink = private AWS-network access to a service endpoint — not the same as S3 gateway endpoint.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Site-to-Site VPN: IPsec to VGW/TGW — good for dev and backup hybrid JDBC/CDC; bandwidth limited by internet.',
          'Direct Connect: private high-throughput path for TB backfill and steady DMS CDC — pair VPN as failover.',
          'PrivateLink: consumer interface endpoints to partner or internal NLB services — not the same as AWS VPC endpoints.',
          'Hybrid lake pattern: extract over DX/VPN → S3 bronze → Glue in AWS VPC — minimize ongoing cross-prem queries.',
          'TGW centralizes hybrid attachments for multi-account DE platforms; coordinate routing, DNS Resolver, and SG rules.',
        ]}
      />
    </LessonArticle>
  )
}
