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

export function VpcForEc2RdsRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Reference layout: public edge, private data">
        Production data platforms place <strong className="text-white">databases and ETL workers in private
        subnets</strong> and reserve public subnets for NAT, load balancers, and bastions. This lesson maps
        the classic three-tier VPC design for EC2 extract workers, RDS OLTP sources, and Redshift analytics
        — the backbone of most AWS DE reference architectures.
      </Callout>

      <Definition term="Public vs private subnet">
        <p>
          A <strong className="text-white">public subnet</strong> route table includes{' '}
          <code className="text-core-400">0.0.0.0/0 → Internet Gateway</code> — resources can receive public
          IPs and accept inbound from the internet when SGs allow. A{' '}
          <strong className="text-white">private subnet</strong> uses{' '}
          <code className="text-core-400">0.0.0.0/0 → NAT Gateway</code> (or no default route) — outbound
          internet only via NAT; no direct inbound from IGW. RDS and Redshift subnet groups use private subnets
          exclusively in prod.
        </p>
      </Definition>

      <LessonSection title="Reference architecture overview">
        <ContentStep number={1} title="Multi-AZ subnet pairs">
          <p className="text-slate-300">
            Span at least two Availability Zones:{' '}
            <code className="text-core-400">10.0.1.0/24</code> and{' '}
            <code className="text-core-400">10.0.2.0/24</code> public (NAT + ALB);{' '}
            <code className="text-core-400">10.0.10.0/24</code> and{' '}
            <code className="text-core-400">10.0.20.0/24</code> private for app/ETL;{' '}
            <code className="text-core-400">10.0.100.0/24</code> and{' '}
            <code className="text-core-400">10.0.200.0/24</code> private for data (RDS, Redshift). S3 gateway
            endpoint on all private route tables. Separate subnet tiers simplify NACL and firewall policy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Traffic flow summary">
          <p className="text-slate-300">
            Internet → IGW → public ALB → app tier (optional). ETL: private EC2/Glue ENI → RDS private IP
            (JDBC extract) → S3 via gateway endpoint → Redshift COPY from S3 (private cluster endpoint). No
            database tier in public subnets.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="EC2 in the VPC">
        <ContentStep number={1} title="Extract and orchestration workers">
          <p className="text-slate-300">
            Legacy or custom ETL on EC2 lives in private subnets with SG allowing outbound to RDS SG and S3
            (via endpoint). SSH/RDP never open to internet — use SSM Session Manager from a role, or bastion
            in public subnet with strict SG. Auto Scaling groups for batch workers share IAM instance profile
            for S3 and Secrets Manager.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When EC2 still appears in DE">
          <p className="text-slate-300">
            Long-running Python/Java custom extract, third-party agents without managed equivalent, or jump
            boxes for DBA-assisted debugging. Prefer Glue/ Lambda where possible — EC2 adds patching burden.
            If used, same private subnet + endpoint pattern as Glue connections.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="RDS in the VPC">
        <ContentStep number={1} title="DB subnet group">
          <p className="text-slate-300">
            RDS requires subnets in at least two AZs — dedicated data private subnets. Not publicly accessible.
            SG allows inbound 5432/3306 from EC2 ETL SG, Glue connection SG, DMS SG only. Route tables for
            DB subnets typically need only local + S3 endpoint (for snapshot export to S3) — no NAT required if
            no outbound internet from RDS itself.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extract without exposing prod">
          <p className="text-slate-300">
            Read replica in same private subnets for light extract; DMS replication instance in private ETL
            subnet for CDC. Application traffic and ETL share VPC routing but different SG boundaries — DE
            never widens RDS SG to entire VPC CIDR.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Redshift in the VPC">
        <ContentStep number={1} title="Enhanced VPC routing">
          <p className="text-slate-300">
            Redshift cluster in private subnets with <em>enhanced VPC routing</em> enabled so COPY/UNLOAD
            traffic uses your VPC route tables — S3 gateway endpoint applies, avoiding public internet paths
            and enabling flow log visibility on data movement.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Access patterns">
          <p className="text-slate-300">
            BI tools connect via private IP or Redshift-managed VPC endpoint / PrivateLink — not public cluster
            endpoint in prod. SG allows 5439 from known CIDRs or SGs (QuickSight, Tableau bridge EC2, dbt
            runner). Spectrum external tables read S3 through IAM + endpoint same as Glue.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Placement vs RDS">
          <p className="text-slate-300">
            Often separate subnet tier or account: OLTP RDS in app/data VPC, Redshift in analytics VPC connected
            via TGW. Pipeline lands curated S3 → COPY — Redshift does not JDBC back to RDS for marts at scale.
          </p>
        </ContentStep>
        <Flowchart
          title="Public/private subnets — EC2, RDS, Redshift"
          chart={`flowchart TB
  IGW[Internet Gateway]
  PUB[Public subnets NAT ALB]
  PRIV[Private subnets EC2 Glue ENI]
  DATA[Private data subnets]
  RDS[(RDS OLTP)]
  RS[(Redshift OLAP)]
  S3[(S3 lake)]
  IGW --> PUB
  PUB -->|NAT outbound| PRIV
  PRIV -->|JDBC| RDS
  PRIV -->|Parquet write| S3
  DATA --> RDS
  DATA --> RS
  RS -->|COPY UNLOAD endpoint| S3
  PRIV -->|Orchestration| PRIV`}
        />
        <Example title="Subnet checklist for new data VPC">
{`Public (per AZ):  NAT Gateway + Elastic IP, optional ALB
Private ETL:       Glue connections, DMS, Lambda in VPC, EC2 workers
Private DATA:      RDS subnet group, Redshift subnet group
Route tables:      S3 gateway endpoint on ALL private tables
                   NAT only on ETL/app private — not always on pure DB subnets`}
        </Example>
        <Callout variant="insight">
          Interview whiteboard: draw IGW on public, NAT in public, RDS/Redshift only in private data subnets,
          Glue/EC2 in private ETL, S3 off endpoint side — satisfies 80% of DE VPC design questions.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Public subnets: IGW route — NAT, ALB, bastion. Private subnets: no direct inbound from internet.',
          'RDS and Redshift subnet groups in private data subnets — not publicly accessible in prod.',
          'EC2/Glue/DMS in private ETL subnets; SG reference between tiers — never 0.0.0.0/0 on database ports.',
          'Redshift enhanced VPC routing + S3 gateway endpoint for COPY/UNLOAD on private paths with flow log visibility.',
          'Multi-AZ subnet pairs per tier; S3 gateway endpoint on every private route table used by workers.',
        ]}
      />
    </LessonArticle>
  )
}
