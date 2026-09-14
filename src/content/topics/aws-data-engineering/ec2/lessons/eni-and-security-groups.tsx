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

export function EniAndSecurityGroups() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every instance has a network face">
        Your ETL worker talks to S3, RDS, and maybe a corporate VPN — all through an{' '}
        <strong className="text-white">Elastic Network Interface (ENI)</strong> in a VPC subnet.
        <strong className="text-white"> Security Groups</strong> are the stateful firewall attached to that
        ENI. Misconfigured SGs are how Airflow UIs leak to the internet or JDBC ports get scanned — lock
        down before you run production pipelines.
      </Callout>

      <Definition term="Elastic Network Interface (ENI)">
        <p>
          An <strong className="text-white">ENI</strong> is a virtual network card: private IP (and optional
          public IP / Elastic IP), MAC address, subnet placement, and one or more security groups. Every
          EC2 instance has at least one primary ENI. Multi-homed designs (separate ENI for management vs
          data plane) appear in advanced topologies; most DE workers use a single ENI in a private subnet
          with NAT for outbound internet.
        </p>
      </Definition>

      <Definition term="Security Group">
        <p>
          A <strong className="text-white">Security Group (SG)</strong> is a stateful virtual firewall for
          ENIs. <strong className="text-white">Stateful</strong> means if inbound SSH is allowed and you
          connect, return traffic is automatically permitted — you do not need a matching outbound rule for
          the response. Default: deny all inbound, allow all outbound. Rules reference protocol, port, and
          source (CIDR or another SG).
        </p>
      </Definition>

      <LessonSection title="Security Group rules — DE examples">
        <ContentStep number={1} title="Inbound SSH (port 22) from your IP only">
          <p className="text-slate-300">
            Type: SSH, Port 22, Source:{' '}
            <span className="font-mono text-sm">203.0.113.10/32</span> (your office or VPN egress). Never{' '}
            <span className="font-mono text-sm">0.0.0.0/0</span> on SSH for ETL boxes — use SSM Session
            Manager instead when possible (no open port 22).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deny public database ports">
          <p className="text-slate-300">
            Do <strong className="text-white">not</strong> open 5432 (Postgres), 3306 (MySQL), or 6379
            (Redis) to the internet. If Airflow metadata DB runs on RDS in the same VPC, allow inbound on
            the <strong className="text-white">RDS security group</strong> from the Airflow EC2 SG — not from
            0.0.0.0/0. EC2 SG outbound is usually all traffic; restriction happens on the DB SG inbound.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Airflow web UI — internal only">
          <p className="text-slate-300">
            Port 8080 inbound from corporate CIDR or a bastion SG only. Better: no public IP on workers;
            access UI via VPN, ALB with SSO, or SSM port forwarding.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Outbound to AWS APIs">
          <p className="text-slate-300">
            Private subnet workers reach S3/Glue via VPC endpoint or NAT gateway. SG outbound{' '}
            <span className="font-mono text-sm">0.0.0.0/0</span> on 443 is common for NAT path; tighten with
            egress-only endpoints for S3/DynamoDB to avoid internet routing.
          </p>
        </ContentStep>
        <Example title="Minimal Airflow worker SG sketch">
          <div className="overflow-x-auto rounded-lg border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300">
            <p>Inbound:</p>
            <p className="mt-1">— SSH 22 ← sg-bastion-only (or none if using SSM)</p>
            <p>— 8080 ← 10.0.0.0/8 (internal VPC CIDR for ALB health checks)</p>
            <p className="mt-2">Outbound:</p>
            <p className="mt-1">— All traffic → 0.0.0.0/0 (or restrict to VPC endpoints + RDS SG reference)</p>
            <p className="mt-2">RDS SG inbound (separate resource):</p>
            <p className="mt-1">— Postgres 5432 ← sg-airflow-worker</p>
          </div>
        </Example>
      </LessonSection>

      <LessonSection title="Traffic flow: Security Group → instance">
        <Flowchart
          title="Inbound SSH and S3 outbound through ENI"
          chart={`flowchart TB
  USER[Engineer laptop — 203.0.113.10]
  IGW[Internet Gateway]
  NAT[NAT Gateway — private subnet egress]
  SG[Security Group — sg-etl-worker]
  ENI[ENI — private IP in subnet]
  EC2[EC2 Airflow worker]
  RDS[(RDS Postgres — metadata)]
  S3[(S3 — pipeline data)]
  USER -->|SSH 22 allowed| IGW
  IGW --> SG
  SG -->|stateful allow| ENI
  ENI --> EC2
  EC2 -->|5432 via RDS SG| RDS
  EC2 -->|443 via NAT or VPC endpoint| NAT
  NAT --> S3`}
        />
        <Callout variant="tip">
          Reference another security group as source (e.g. allow port 8080 from{' '}
          <span className="font-mono text-sm">sg-alb</span>) instead of CIDR when traffic comes from
          load balancers or peer instances — rules stay stable when IPs change.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ENI = virtual NIC with IP, subnet, and security groups — every EC2 instance has at least one.',
          'Security Groups are stateful firewalls: allow inbound SSH 22 from your IP/VPN; never expose DB ports publicly.',
          'Database access: open RDS SG inbound from the worker SG, not 0.0.0.0/0 on the EC2 side.',
          'Prefer private subnets + SSM Session Manager over public SSH; use VPC endpoints for S3 to reduce NAT exposure.',
          'Use SG-to-SG references for ALB and tier-to-tier traffic — cleaner than hard-coded CIDRs.',
        ]}
      />
    </LessonArticle>
  )
}
