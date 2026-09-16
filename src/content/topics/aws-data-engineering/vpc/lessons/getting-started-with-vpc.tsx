import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithVpc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why VPC after Glue in the DE path">
        You know how Glue transforms raw S3 into curated Parquet and registers tables in the Data Catalog.
        The next question every data engineer asks is:{' '}
        <strong className="text-white">how do Glue jobs, RDS databases, and Redshift clusters actually talk
        to each other without exposing everything to the public internet?</strong> In most AWS platforms, the
        answer is <strong className="text-white">Amazon VPC (Virtual Private Cloud)</strong> — your isolated
        virtual network where data-plane resources live in private subnets, reach S3 through endpoints, and
        connect to JDBC sources on controlled ports.
      </Callout>

      <Definition term="What is VPC in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon VPC</strong> is your own logically isolated section of the
          AWS cloud — a private network with IP address ranges you define, subnets in Availability Zones,
          route tables, gateways, and firewalls. For data engineering, VPC is the{' '}
          <strong className="text-white">network foundation</strong> that keeps RDS, Redshift, Glue
          connections, DMS replication instances, and Lambda extract functions on private paths while still
          allowing controlled outbound access for patches and APIs.
        </p>
        <p className="mt-2 text-slate-300">
          Think of VPC as{' '}
          <span className="text-core-400">the fenced campus where your data services live — with gates
          (security groups) and roads (route tables) you design</span>.
        </p>
      </Definition>

      <LessonSection title="Data plane networking — why order matters">
        <p className="text-slate-300">
          Glue lessons taught you ETL scripts, crawlers, and catalog metadata. RDS lessons introduced JDBC
          endpoints in private subnets. VPC explains{' '}
          <strong className="text-white">why those connections succeed or fail</strong> — the same Glue job
          that works in a tutorial account may time out in prod because route tables, NAT, or security
          groups were never drawn on the architecture diagram.
        </p>
        <ContentStep number={1} title="Glue / Lambda in VPC — ETL compute">
          <p className="text-slate-300">
            Glue JDBC connections and Lambda functions often run inside your VPC to reach private RDS
            endpoints. They need subnets, security groups, and routes to S3 — usually a gateway or interface
            endpoint instead of hairpinning through the public internet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS / Redshift — databases in private subnets">
          <p className="text-slate-300">
            Production OLTP and warehouse clusters sit in private subnets with no direct inbound internet
            access. Only allowed security group peers — Glue, DMS, bastion — can open TCP sessions on 5432,
            3306, or 5439.
          </p>
        </ContentStep>
        <ContentStep number={3} title="S3 endpoints — lake access without NAT">
          <p className="text-slate-300">
            Curated Parquet still lives in S3. VPC endpoints let private subnets reach S3 over the AWS
            backbone — cheaper and more reliable than routing all lake traffic through a NAT gateway.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: Glue is what transforms data; VPC is where that work happens safely. Most
          &quot;connection timed out&quot; DE incidents are VPC problems, not SQL problems.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build VPC in layers so peering, Transit Gateway, and hybrid Direct Connect do not overwhelm you
          on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Address space — CIDR and IPv4">
          <p className="text-slate-300">
            Understand how VPC IP ranges are planned (/16, /24), why overlapping CIDR blocks break peering,
            and how DE accounts reserve space for prod, dev, and analytics subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subnets and Availability Zones">
          <p className="text-slate-300">
            Split your VPC into subnets per AZ — public vs private — and place RDS, Redshift, and Glue ENIs
            in the right tiers for HA and least exposure.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Internet Gateway, route tables, NAT">
          <p className="text-slate-300">
            Learn how a subnet becomes public (IGW route), how private subnets reach the internet outbound
            only (NAT Gateway), and why DE pipelines need both for JDBC plus S3 writes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Security groups and NACLs">
          <p className="text-slate-300">
            Stateful security groups vs stateless network ACLs — the rules that allow Glue to reach RDS on
            port 5432 while blocking everything else.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Endpoints and hybrid (next module)">
          <p className="text-slate-300">
            After this beginner pass: S3 and DynamoDB gateway endpoints, interface endpoints for Secrets
            Manager and Glue API, VPC peering, and on-prem connectivity for hybrid extract workloads.
          </p>
        </ContentStep>
        <Flowchart
          title="VPC sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is VPC]
  B --> C[CIDR and IPv4]
  C --> D[Subnets and AZs]
  D --> E[IGW and route tables]
  E --> F[NAT Gateway vs instance]
  F --> G[Security groups vs NACLs]
  G --> H[Putting it together beginner]
  H --> I[Endpoints peering hybrid — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'VPC',
                  'Your isolated virtual network in AWS — defines IP space, subnets, routing, and boundaries for all regional resources',
                ],
                [
                  'CIDR block',
                  'The IP address range for your VPC — e.g. 10.0.0.0/16 — determines how many private addresses you can assign',
                ],
                [
                  'Subnet',
                  'A slice of the VPC CIDR in one Availability Zone — public (internet-facing) or private (internal only)',
                ],
                [
                  'Route table',
                  'Rules that send traffic from a subnet to an Internet Gateway, NAT Gateway, VPC endpoint, or local VPC traffic',
                ],
                [
                  'Internet Gateway (IGW)',
                  'VPC attachment that allows bidirectional internet access for resources with public IPs in public subnets',
                ],
                [
                  'NAT Gateway',
                  'Managed service in a public subnet that lets private subnet resources initiate outbound internet connections without accepting inbound from the internet',
                ],
                [
                  'Security group',
                  'Stateful virtual firewall on ENIs — allow Glue SG to reach RDS SG on port 5432; deny is implicit',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and tier in subnet names:{' '}
          <code className="text-core-400">acme-prod-private-data-a</code> or{' '}
          <code className="text-core-400">acme-dev-public-nat-a</code>. When a Glue connection fails at 2
          a.m., clear subnet labels on the diagram beat guessing which /24 holds the JDBC target.
        </Callout>
      </LessonSection>

      <LessonSection title="How VPC fits after Glue in a pipeline">
        <p className="text-slate-300">
          A Glue job in a VPC private subnet reads orders from RDS Postgres (also private), writes Parquet to
          S3 via a gateway endpoint, and logs to CloudWatch. No database port is open to the internet; NAT or
          endpoints cover outbound dependencies. That is the production pattern behind every architecture
          diagram you sketched in the Glue and RDS tracks.
        </p>
        <Flowchart
          title="Internet → IGW → public subnet / NAT → private subnet (RDS/Glue)"
          chart={`flowchart TB
  INT[Internet]
  INT --> IGW[Internet Gateway]
  IGW --> PUB[Public subnet NAT GW bastion]
  PUB --> NAT[NAT Gateway]
  NAT --> PRIV[Private subnet]
  PRIV --> RDS[RDS Postgres]
  PRIV --> GLUE[Glue JDBC connection]
  PRIV --> EP[S3 VPC endpoint]
  EP --> S3[S3 data lake]
  GLUE --> RDS
  GLUE --> EP`}
        />
        <Callout variant="insight">
          Mature DE platforms default to private subnets for every data store and ETL worker — public subnets
          exist mainly for NAT, load balancers, and bastions, not for warehouse or OLTP endpoints.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about VPC">
        <ContentStep number={1} title="Every JDBC timeout starts in the network">
          <p className="text-slate-300">
            Glue connection tests fail when security groups, route tables, or subnet associations are
            wrong — long before your PySpark script runs. VPC literacy shortens incident response from days
            to hours.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost and reliability of data paths">
          <p className="text-slate-300">
            NAT Gateway charges per GB processed; S3 gateway endpoints are free. Designing lake egress through
            endpoints instead of NAT saves real money at terabyte scale.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compliance and segmentation">
          <p className="text-slate-300">
            PCI, HIPAA, and internal policy often require prod data in private subnets with audited SG rules.
            DE pipelines must document which CIDRs and groups can reach PII sources — VPC is where that
            boundary is enforced.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC follows Glue in the track — ETL and catalog logic need a private network where RDS, Redshift, and Glue connect safely.',
          'Roadmap: CIDR/subnets → IGW/NAT/route tables → security groups/NACLs → endpoints and hybrid next.',
          'Core vocabulary: VPC, CIDR, subnet, route table, IGW, NAT Gateway, security group.',
          'Typical pattern: private subnets for RDS/Glue/Redshift, public subnet for NAT, S3 endpoint for lake traffic — no prod DB on the public internet.',
        ]}
      />
    </LessonArticle>
  )
}
