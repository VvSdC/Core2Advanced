import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VpcSecurityChecklistDe() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Network hygiene for production data pipelines">
        VPC misconfiguration is the leading cause of JDBC extract failures and audit findings. This checklist
        distills what data engineering teams verify before go-live and during quarterly reviews — aligned
        with how RDS, Glue, Lambda, and Redshift actually connect in prod.
      </Callout>

      <Definition term="DE VPC security baseline">
        <p>
          A production data VPC baseline means: databases never internet-exposed, extract paths use security
          group references not CIDR sprawl, lake I/O uses S3 gateway endpoints, secrets fetched over interface
          endpoints, and connectivity provable via flow logs — layered with IAM and encryption covered in RDS
          and IAM lessons.
        </p>
      </Definition>

      <LessonSection title="No public RDS (and Redshift)">
        <ContentStep number={1} title="Publicly accessible = off">
          <p className="text-slate-300">
            RDS and Aurora: <em>Publicly accessible</em> disabled. Redshift: avoid public cluster endpoint;
            use VPC-only access, PrivateLink, or VPN for BI tools. Dev exceptions require separate dev account/VPC,
            not prod flags.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private subnets only for data tier">
          <p className="text-slate-300">
            DB subnet groups contain only private subnets without IGW routes. NACLs default allow; rely on SG
            for precision. Emergency DBA access via SSM Session Manager to bastion in public subnet or VPN —
            not opening 5432 to office IP ranges on prod RDS.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Extract sources use SG references">
          <p className="text-slate-300">
            RDS SG inbound: Glue connection SG, DMS SG, Lambda VPC SG, RDS Proxy SG — not entire{' '}
            <code className="text-core-400">10.0.0.0/16</code> and never{' '}
            <code className="text-core-400">0.0.0.0/0</code>. Read-only DB users for ETL separate from app
            credentials.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Endpoints for S3 and control plane">
        <ContentStep number={1} title="S3 gateway endpoint mandatory">
          <p className="text-slate-300">
            Associate S3 gateway endpoint with every private route table used by Glue connections, EMR, Lambda
            in VPC, Redshift (enhanced VPC routing). Endpoint policy scoped to org lake buckets. Eliminates NAT
            exfiltration path for bulk lake traffic and cuts cost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Interface endpoints for secrets and APIs">
          <p className="text-slate-300">
            Deploy Secrets Manager, STS, Glue, CloudWatch Logs, KMS interface endpoints in data VPC. Enable
            private DNS. Endpoint SG allows 443 from worker SGs. Prevents credential and log traffic over NAT/internet.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DynamoDB gateway if used">
          <p className="text-slate-300">
            If pipeline state, locks, or KCL leases use DynamoDB from private subnets, add DynamoDB gateway
            endpoint to same route tables — same free pattern as S3.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Security group least privilege">
        <ContentStep number={1} title="Reference SGs, not IPs">
          <p className="text-slate-300">
            Source in inbound rules: other SG IDs (sg-glue-etl → sg-rds-prod). Avoid static private IPs — Lambda
            and Glue ENIs change. Cross-VPC same Region: peering/TGW plus SG referencing still works for RDS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One SG role per tier">
          <p className="text-slate-300">
            Naming: <code className="text-core-400">sg-glue-connection-prod</code>,{' '}
            <code className="text-core-400">sg-lambda-extract-prod</code>,{' '}
            <code className="text-core-400">sg-rds-prod</code>. Document matrix in IaC README. No shared
            &quot;data SG&quot; with 0.0.0.0/0 outbound exceptions for convenience.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Outbound matters for VPC Lambda/Glue">
          <p className="text-slate-300">
            Worker SG outbound: HTTPS to endpoint SG, DB port to RDS SG, deny unnecessary internet unless NAT
            egress approved and firewalled. Review default allow-all outbound periodically — tighten for regulated
            workloads.
          </p>
        </ContentStep>
        <Example title="Pre-go-live DE VPC checklist">
{`[ ] RDS/Redshift: private subnets, not publicly accessible
[ ] RDS SG: inbound only from Glue/DMS/Lambda/Proxy SGs on DB port
[ ] Glue JDBC connections: private subnets, multi-AZ, enough free IPs
[ ] S3 gateway endpoint on all ETL/data private route tables
[ ] Secrets Manager + STS interface endpoints with private DNS
[ ] Lambda in VPC: S3 endpoint present; RDS Proxy if high concurrency
[ ] Flow logs enabled on RDS + Glue subnets → S3 or CloudWatch
[ ] No 0.0.0.0/0 on database SG inbound
[ ] DHCP: AmazonProvidedDNS; enableDnsSupport/hostnames true
[ ] NAT only where needed; document approved external FQDNs
[ ] IaC (Terraform/CloudFormation) — no console drift`}
        </Example>
      </LessonSection>

      <LessonSection title="Additional DE hardening">
        <ContentStep number={1} title="Subnet and IP capacity">
          <p className="text-slate-300">
            Size ETL subnets for peak Glue workers + Lambda concurrency ENIs. Alert on low IP count before
            month-end jobs. Separate prod/nonprod VPCs or at least subnets — no shared RDS between environments
            in one SG rule.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Observability and change control">
          <p className="text-slate-300">
            VPC Flow Logs on data subnets; CloudTrail for SG and route table changes. Pipeline failures during
            change windows often trace to SG edits — require peer review on network IaC same as application code.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Encryption and identity (cross-layer)">
          <p className="text-slate-300">
            VPC alone does not encrypt data — pair checklist with SSL on JDBC, KMS on S3/RDS, Secrets Manager
            or IAM DB auth. Network layer gets packets to the port; identity layer authenticates; encryption
            protects payload — all three required for audit.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Quarterly review">
          Re-run this checklist after any new microservice DB onboarded, Glue connection added, or network team
          TGW route change — silent regressions are common when app teams request &quot;temporary&quot; SG rules.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'No public RDS/Redshift in prod — private subnets, SG references from Glue/Lambda/DMS only on DB ports.',
          'S3 gateway endpoint on every private route table touching ETL; interface endpoints for Secrets Manager, STS, Glue, Logs.',
          'SG least privilege: reference other SGs not CIDRs; dedicated SG per tier; never 0.0.0.0/0 inbound on databases.',
          'Enable flow logs, DNS settings, subnet IP capacity, and IaC — prove connectivity and prevent drift.',
          'Layer VPC checklist with SSL, KMS, and Secrets Manager — network gets you to the port, not authenticated or encrypted alone.',
        ]}
      />
    </LessonArticle>
  )
}
