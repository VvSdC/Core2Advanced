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

export function WhatIsVpc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Amazon VPC is your own{' '}
        <strong className="text-white">private virtual network inside AWS</strong>. Just like a company
        office has internal LAN segments, Wi-Fi VLANs, and a firewall at the edge, a VPC gives you IP
        ranges, subnets, routing, and security rules so EC2, RDS, Glue, Lambda, and Redshift communicate on
        private addresses you control — separate from every other AWS customer&apos;s network.
      </Callout>

      <Definition term="Amazon VPC">
        <p>
          <strong className="text-white">Amazon Virtual Private Cloud (VPC)</strong> is a logically isolated
          network environment in an AWS Region where you launch resources with private (and optionally
          public) IP addresses. You define a CIDR block, create subnets across Availability Zones, attach
          Internet Gateways and NAT Gateways, configure route tables, and apply security groups and network
          ACLs. Nothing inside your VPC is reachable from the internet unless you explicitly design that
          path.
        </p>
      </Definition>

      <LessonSection title="Isolated virtual network — what that means">
        <p className="text-slate-300">
          When you create an RDS instance or a Glue connection &quot;in a VPC,&quot; AWS attaches an{' '}
          <strong className="text-white">Elastic Network Interface (ENI)</strong> with an IP from your subnet
          range. Traffic between two ENIs in the same VPC stays on the AWS network fabric — it does not
          traverse the public internet. Isolation is per-account and per-VPC by default; connecting two VPCs
          or on-prem networks requires peering, Transit Gateway, or VPN — topics for later lessons.
        </p>
        <ContentStep number={1} title="Regional scope">
          <p className="text-slate-300">
            A VPC lives in one AWS Region. Your us-east-1 prod VPC is separate from eu-west-1 — DE pipelines
            that replicate cross-region need explicit networking (VPC peering, PrivateLink, or public
            endpoints with encryption), not automatic LAN reachability.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Default VPC vs custom VPC">
          <p className="text-slate-300">
            New accounts often get a default VPC with a public subnet per AZ and an Internet Gateway attached.
            Production data platforms almost always use a <strong className="text-white">custom VPC</strong>{' '}
            with deliberate private subnets for databases and ETL — the default is fine for quick tests, not
            for regulated prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DNS inside the VPC">
          <p className="text-slate-300">
            Enable DNS hostnames and DNS resolution so RDS endpoints like{' '}
            <code className="text-core-400">mydb.abc123.us-east-1.rds.amazonaws.com</code> resolve to private
            IPs from Glue workers in the same VPC — JDBC URLs depend on this.
          </p>
        </ContentStep>
        <Flowchart
          title="VPC as the container for DE resources"
          chart={`flowchart TB
  VPC[Your VPC 10.0.0.0/16]
  VPC --> SUB1[Private subnet AZ-a]
  VPC --> SUB2[Private subnet AZ-b]
  VPC --> SUB3[Public subnet AZ-a]
  SUB1 --> RDS[RDS Postgres]
  SUB1 --> GLUE[Glue connection ENI]
  SUB2 --> RS[Redshift cluster]
  SUB3 --> NAT[NAT Gateway]
  GLUE --> RDS
  GLUE --> S3EP[S3 endpoint]
  S3EP --> S3[S3 lake]`}
        />
      </LessonSection>

      <LessonSection title="Why data engineering cares about VPC">
        <ContentStep number={1} title="Databases are VPC-native">
          <p className="text-slate-300">
            RDS, Aurora, and Redshift cluster nodes receive private IPs in subnets you choose during
            provisioning. Glue JDBC connections, DMS replication instances, and Lambda in VPC must sit in
            subnets that can route to those IPs — and security groups must allow the traffic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue jobs need network context">
          <p className="text-slate-300">
            Serverless Glue can run without a VPC for S3-only jobs. The moment a job reads RDS or Redshift,
            you attach a <strong className="text-white">Glue connection</strong> with subnet IDs and a
            security group — that is VPC configuration, not Spark code.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift private access">
          <p className="text-slate-300">
            Analytics clusters are almost always in private subnets. BI tools reach them through VPN,
            Direct Connect, Redshift Serverless workgroup in VPC, or a bastion — not by exposing port 5439 to
            the world.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Lake egress without exposing data">
          <p className="text-slate-300">
            S3 is outside your VPC but integrated via gateway endpoints or NAT. DE architects choose
            endpoints so terabytes of Parquet writes never hairpin through a brittle public path.
          </p>
        </ContentStep>
        <Example title="DE question — is this a VPC problem?" caption="Symptoms and likely causes">
{`Symptom: Glue JDBC test connection fails — "connection timed out"

Likely VPC causes:
  - Glue connection subnets cannot route to RDS subnet
  - RDS security group does not allow Glue connection security group on 5432
  - RDS in private subnet but Glue connection not attached to VPC
  - NACL blocking ephemeral return ports (less common than SG)

Symptom: Glue job reads S3 fine in default mode but fails in VPC

Likely VPC causes:
  - No S3 gateway endpoint and no NAT route for private subnet
  - Missing route 0.0.0.0/0 to NAT in private subnet route table`}
        </Example>
      </LessonSection>

      <LessonSection title="What VPC is not">
        <ContentStep number={1} title="Not a replacement for IAM">
          <p className="text-slate-300">
            VPC controls <em>network</em> reachability. IAM controls <em>who</em> can call AWS APIs. A Glue
            role still needs <code className="text-core-400">s3:PutObject</code> on the curated bucket even
            if network paths are perfect.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not global">
          <p className="text-slate-300">
            S3 bucket names are global; VPC CIDR planning is per-Region. Multi-region DE platforms repeat
            VPC design in each Region or use centralized networking hubs — not one VPC spanning the globe.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not optional for most prod data stores">
          <p className="text-slate-300">
            Some serverless services (Athena, plain S3, EventBridge) operate at the AWS service plane without
            your VPC. The moment you add RDS, Redshift, or VPC-attached Glue, network design becomes
            mandatory — there is no &quot;skip VPC&quot; path for typical lakehouse sources.
          </p>
        </ContentStep>
        <Callout variant="insight">
          VPC is the physical layout of your data platform: where OLTP, warehouse, and ETL live relative to
          each other and to S3 — complementary to everything you built in IAM, Glue, RDS, and Redshift.
        </Callout>
      </LessonSection>

      <LessonSection title="Default building blocks in every DE VPC">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Component</th>
                <th className="px-4 py-3">DE role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Private app/data subnets', 'RDS, Redshift, Glue ENIs, DMS — no direct inbound internet'],
                ['Public subnets (minimal)', 'NAT Gateway, optional bastion or ALB — not for database ENIs'],
                ['Internet Gateway', 'Edge for public subnet resources that need bidirectional internet'],
                ['NAT Gateway', 'Outbound-only internet from private subnets (APIs, patches) without public IPs on DBs'],
                ['S3 gateway endpoint', 'Private route to lake buckets — preferred over NAT for S3 traffic'],
                ['Security groups', 'Allow Glue SG → RDS SG on 5432; deny everything else by default'],
              ].map(([component, role]) => (
                <tr key={component} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{component}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC is your isolated virtual network in an AWS Region — IP ranges, subnets, routing, and firewalls you define.',
          'DE workloads (RDS, Redshift, Glue JDBC, DMS, Lambda in VPC) get ENIs with private IPs; reachability is by design, not automatic.',
          'Glue S3-only jobs may skip VPC; any JDBC or private warehouse access requires subnet, route, and security group planning.',
          'Most prod incidents labeled "connection timeout" are VPC misconfiguration — not bad SQL or Spark code.',
        ]}
      />
    </LessonArticle>
  )
}
