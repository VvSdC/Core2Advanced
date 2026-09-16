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

export function PuttingItTogetherVpcBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before endpoints and hybrid deep dives">
        You now know what a VPC is, how CIDR blocks size your address space, why public and private subnets
        differ, how IGW and route tables define internet paths, why NAT gives private subnets outbound-only
        access, and how security groups gate Glue-to-RDS traffic. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner VPC checklist</strong> — the mental model you need before S3
        interface endpoints, VPC peering, and hybrid Direct Connect diagrams in a dev account.
      </Callout>

      <Definition term="Beginner VPC mental model">
        <p>
          A <strong className="text-white">beginner VPC mental model</strong> for DE includes: one VPC per
          environment with non-overlapping /16 CIDR, private subnets in two AZs for RDS/Redshift/Glue, public
          subnets for NAT only, route tables with local + S3 gateway endpoint + NAT (never IGW on data tier),
          NAT Gateway per AZ for prod outbound, and security groups wiring Glue SG to RDS SG on 5432 — all
          before hands-on endpoint and peering labs in the next module.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="VPC and CIDR planned">
          <p className="text-slate-300">
            Prod <code className="text-core-400">10.0.0.0/16</code>, dev{' '}
            <code className="text-core-400">10.2.0.0/16</code> — documented subnet map for private data,
            analytics, and public/NAT tiers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private subnets host data plane">
          <p className="text-slate-300">
            RDS, Redshift, Glue JDBC ENIs, DMS in private subnets across at least two AZs — DB subnet groups
            and Glue connection subnet lists match the diagram.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Public subnets host NAT only">
          <p className="text-slate-300">
            Internet Gateway attached to VPC; public route table{' '}
            <code className="text-core-400">0.0.0.0/0 → IGW</code>; NAT Gateway with Elastic IP in each AZ
            used by ETL.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Private routes without inbound internet">
          <p className="text-slate-300">
            Private route table: local VPC, S3 prefix to gateway endpoint,{' '}
            <code className="text-core-400">0.0.0.0/0 → NAT</code> — no IGW association on RDS subnets.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Security groups wired for ETL">
          <p className="text-slate-300">
            RDS SG inbound allows Glue SG, DMS SG, Lambda SG on 5432/3306 — reference SG IDs, not{' '}
            <code className="text-core-400">0.0.0.0/0</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE VPC stack"
          chart={`flowchart TD
  INT[Internet]
  INT --> IGW[Internet Gateway]
  IGW --> PUB[Public subnet NAT]
  PUB --> NAT[NAT Gateway]
  NAT --> PRIV[Private subnets multi-AZ]
  PRIV --> RDS[RDS Postgres]
  PRIV --> GLUE[Glue JDBC ENI]
  PRIV --> EP[S3 gateway endpoint]
  EP --> S3[S3 lake]
  GLUE --> RDS
  GLUE --> EP
  RDS -.->|no inbound from internet| INT`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is VPC in one sentence?">
          <p className="text-slate-300">
            Your isolated virtual network in an AWS Region — you define IP ranges, subnets, routes, and
            firewalls where RDS, Glue, and Redshift ENIs live.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Public vs private subnet">
          <p className="text-slate-300">
            Public: route table sends <code className="text-core-400">0.0.0.0/0</code> to IGW. Private:
            default internet via NAT or endpoints — no direct inbound from internet to DB ENIs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why NAT Gateway?">
          <p className="text-slate-300">
            Lets Glue/Lambda in private subnets reach external HTTPS and APIs outbound without assigning
            public IPs to databases or accepting unsolicited inbound connections.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Security group vs NACL">
          <p className="text-slate-300">
            SG: stateful ENI firewall, allow-only, primary for Glue→RDS. NACL: stateless subnet filter with
            deny support — secondary guardrail.
          </p>
        </ContentStep>
        <ContentStep number={5} title="/16 vs /24">
          <p className="text-slate-300">
            /16 sizes the whole VPC (~65k addresses); /24 is a typical subnet per AZ (~256 addresses).
          </p>
        </ContentStep>
        <ContentStep number={6} title="Why S3 endpoint on private route table?">
          <p className="text-slate-300">
            Keeps lake traffic off NAT — lower cost, higher reliability for Glue Parquet writes at scale.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug step for JDBC timeout?">
          <p className="text-slate-300">
            Verify Glue connection subnets route to RDS subnet (local), then RDS SG allows Glue SG on DB port —
            before Spark logs or SQL.
          </p>
        </ContentStep>
        <Example title="Beginner VPC concept drill" caption="No console required yet — explain aloud">
{`1. Draw: Internet → IGW → public/NAT → private (RDS, Glue) → S3 endpoint → S3
2. Why place RDS in a private subnet?
3. What three routes belong on a private data subnet route table?
4. NAT Gateway vs NAT Instance — which for prod DE?
5. How do you allow Glue to reach RDS without opening 5432 to the internet?
6. What makes a subnet "public" — name or route table?
7. Why use non-overlapping CIDRs across prod and dev VPCs?`}
        </Example>
        <Callout variant="insight">
          Strong VPC beginners do not memorize every endpoint type on day one. They ask: where do data stores
          sit, how does ETL reach them and S3, and what is blocked from the internet — three questions that
          prevent publicly accessible prod RDS and NAT bill shock on lake egress.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme runs PostgreSQL RDS (<code className="text-core-400">acme-orders-prod</code>) in{' '}
          <code className="text-core-400">10.0.1.0/24</code> private subnet us-east-1a with standby in{' '}
          <code className="text-core-400">10.0.2.0/24</code>. Glue connection{' '}
          <code className="text-core-400">jdbc-orders-prod</code> uses subnets 1a and 1b with{' '}
          <code className="text-core-400">sg-glue-etl</code>. RDS SG allows{' '}
          <code className="text-core-400">sg-glue-etl</code> on 5432. Private route table sends S3 to gateway
          endpoint; nightly job writes curated Parquet without NAT charges. External Slack webhook from a
          Lambda in the same private subnet uses NAT in <code className="text-core-400">10.0.101.0/24</code>.
          No RDS public accessibility; QuickSight reads Redshift in{' '}
          <code className="text-core-400">10.0.50.0/24</code>, not RDS. When JDBC test fails, the on-call
          engineer checks route association and SG rules before opening the Glue script.
        </p>
        <ContentStep number={1} title="Network tier — VPC + private subnets">
          <p className="text-slate-300">Isolated campus, multi-AZ, documented CIDR map.</p>
        </ContentStep>
        <ContentStep number={2} title="Routing tier — local, endpoint, NAT">
          <p className="text-slate-300">Lake on endpoint; APIs on NAT; no IGW on data subnets.</p>
        </ContentStep>
        <ContentStep number={3} title="Firewall tier — security groups">
          <p className="text-slate-300">Glue SG to RDS SG — stateful, least privilege.</p>
        </ContentStep>
        <ContentStep number={4} title="Pipeline tier — Glue + S3 + warehouse">
          <p className="text-slate-300">Same JDBC and lake patterns from prior modules — now with named network controls.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the VPC track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="VPC endpoints — S3, DynamoDB, interface">
          <p className="text-slate-300">
            Gateway endpoints for lake traffic; interface endpoints for Secrets Manager, Glue API, STS —
            reduce NAT dependency and tighten private-only data plane design.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC peering and shared services">
          <p className="text-slate-300">
            Connect prod data VPC to shared logging or tooling VPC — requires non-overlapping CIDRs and
            symmetric route table updates on both sides.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hybrid and on-prem sources">
          <p className="text-slate-300">
            Site-to-Site VPN and Direct Connect for extracting on-prem Oracle or SQL Server into the lake —
            routing and security groups extend beyond pure AWS-native RDS.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE architecture patterns">
          <p className="text-slate-300">
            Medallion lake in private subnets, Redshift Serverless workgroups, Glue Studio connections,
            Lake Formation with VPC-bound crawlers — full platform diagrams assuming you can explain IGW vs
            NAT vs endpoint without opening the VPC console.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          VPC connects everything you built in prior modules: IAM grants API access, VPC carries JDBC and
          COPY traffic, S3 holds lake data via endpoints, Glue transforms in private subnets, RDS and
          Redshift stay off the public internet — CloudWatch alerts when NAT errors or SG drift threaten
          tonight&apos;s load. Advanced tracks assume you can draw the Internet → IGW → NAT → private data
          plane path from memory.
        </p>
        <Callout variant="tip" title="Before your first Glue VPC connection test">
          Re-read security groups vs NACLs and sketch subnet IDs on paper. Teams that skip the diagram burn
          days on connection timeouts — the architecture map saves time before the first JDBC crawl.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: /16 VPC, private multi-AZ subnets for RDS/Glue/Redshift, public subnets for NAT, S3 endpoint on private routes, SG wiring for JDBC.',
          'Self-check: VPC definition, public vs private, NAT purpose, SG vs NACL, CIDR sizes, S3 endpoint benefit, JDBC debug order.',
          'Prod DE never puts OLTP on the public internet — local routes for intra-VPC, endpoints for lake, NAT for residual outbound only.',
          'Next in VPC track: gateway and interface endpoints, peering, hybrid VPN/Direct Connect, and full medallion DE architecture patterns.',
        ]}
      />
    </LessonArticle>
  )
}
