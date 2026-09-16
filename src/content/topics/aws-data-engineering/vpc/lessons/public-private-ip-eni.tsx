import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PublicPrivateIpEni() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every VPC resource talks through an ENI — public or private">
        Data engineering pipelines fail at the network layer when IP addressing is misunderstood.{' '}
        <strong className="text-white">Private IPs</strong> reach RDS, Redshift, and Glue workers inside
        subnets. <strong className="text-white">Public IPs</strong> (or Elastic IPs) expose bastions and
        NAT gateways to the internet. Every attachment — EC2, Lambda in VPC, Glue connection worker — uses an{' '}
        <strong className="text-white">Elastic Network Interface (ENI)</strong>.
      </Callout>

      <Definition term="Private IP address in a VPC">
        <p>
          A private IP is drawn from the subnet&apos;s CIDR block (for example{' '}
          <code className="text-core-400">10.0.1.45</code> in{' '}
          <code className="text-core-400">10.0.1.0/24</code>). It is routable only within the VPC and connected
          networks (peering, Transit Gateway, VPN). RDS, Redshift, and most ETL targets use private endpoints —
          Glue JDBC connections and Lambda in VPC must resolve and connect to these addresses, not public DNS.
        </p>
      </Definition>

      <LessonSection title="Public vs private IP">
        <ContentStep number={1} title="Private IP — default for data tier">
          <p className="text-slate-300">
            Subnets can be public or private, but the IP itself is just an address in RFC 1918 space. A{' '}
            <strong className="text-white">private subnet</strong> has no direct internet route (no IGW path
            for instances without public IP). RDS in a private subnet gets only a private IP — the correct
            pattern for production sources. Glue connections attach ENIs here to JDBC to the database hostname.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Public IP — internet-reachable">
          <p className="text-slate-300">
            When you launch an instance in a public subnet with{' '}
            <em>Auto-assign public IPv4 address</em>, AWS assigns a public IP mapped to the instance ENI via
            the Internet Gateway. NAT gateways also consume public IPs so private subnets can initiate outbound
            internet traffic. DE teams use public subnets sparingly — bastion hosts, NAT, load balancer nodes —
            not for databases or Spark workers holding sensitive data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Publicly accessible RDS — anti-pattern for prod">
          <p className="text-slate-300">
            RDS can be flagged <em>publicly accessible</em>, which assigns a public DNS that resolves to a
            public IP. Convenient for dev, dangerous for prod: security groups become the only gate. Production
            extract pipelines should connect via private endpoint from Glue/Lambda ENIs in the same VPC.
          </p>
        </ContentStep>
        <Example title="Which IP does my Glue job see?">
{`RDS endpoint: mydb.abc123.us-east-1.rds.amazonaws.com
  → Resolves to private IP 10.0.2.87 (private subnet)

Glue connection ENI: 10.0.1.142 (private subnet)
  → Route table: local VPC + NAT for outbound API calls
  → SG on RDS must allow 10.0.1.142's SG on port 5432

If RDS were publicly accessible:
  → Public IP — avoid; same SG mistakes expose internet`}
        </Example>
      </LessonSection>

      <LessonSection title="Elastic IP (EIP)">
        <ContentStep number={1} title="Static public IPv4">
          <p className="text-slate-300">
            An Elastic IP is a static public IPv4 address you allocate to your account and associate with an
            ENI (NAT gateway, bastion EC2, legacy ETL box). Unlike auto-assigned public IPs, an EIP persists
            across stop/start until you release it. NAT gateways require an EIP per AZ — a recurring cost DE
            budgets should include when private subnets need outbound internet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE cost and design note">
          <p className="text-slate-300">
            Heavy S3 traffic from private subnets through NAT burns data processing charges.{' '}
            <strong className="text-white">S3 gateway endpoints</strong> (covered later) route S3 traffic
            without NAT — Elastic IPs stay on NAT for non-AWS endpoints (PyPI, vendor APIs). Right-size NAT:
            one per AZ for HA, not one per job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Release unused EIPs">
          <p className="text-slate-300">
            Unassociated Elastic IPs incur hourly charges. Tear down lab bastions and release EIPs when
            migrating to SSM Session Manager for admin access — common hygiene in data platform IaC reviews.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Elastic Network Interface (ENI) overview">
        <ContentStep number={1} title="What an ENI is">
          <p className="text-slate-300">
            An ENI is a virtual network card: private IP(s), optional public IP, MAC address, security groups,
            and source/dest check flag. EC2 instances have a primary ENI; you can attach secondary ENIs for
            multi-homing. Every IP-based conversation in the VPC — JDBC, HTTPS to Secrets Manager endpoint,
            Redshift COPY from S3 — flows through an ENI subject to route tables and security groups.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Managed ENIs for DE services">
          <p className="text-slate-300">
            <strong className="text-white">Glue connections</strong> create ENIs in your subnets per worker
            (or per capacity unit depending on job type). <strong className="text-white">Lambda in VPC</strong>{' '}
            creates ENIs for functions attached to subnets — cold starts include ENI provisioning latency.{' '}
            <strong className="text-white">DMS replication instances</strong> are EC2 under the hood with ENIs
            in your subnets. Plan subnet IP capacity:{' '}
            <code className="text-core-400">/24</code> subnets exhaust quickly with parallel Glue workers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Primary private IPv4 and DNS">
          <p className="text-slate-300">
            Each ENI gets a primary private IPv4 from the subnet. Additional secondary IPs support high-density
            containers or custom networking. Enable{' '}
            <em>DNS hostnames</em> and <em>DNS resolution</em> on the VPC so{' '}
            <code className="text-core-400">*.rds.amazonaws.com</code> resolves to the current private IP after
            failover — critical for long-lived JDBC pools that must reconnect to the same logical endpoint.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Resource</th>
                <th className="px-4 py-3">ENI behavior</th>
                <th className="px-4 py-3">DE implication</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'EC2 ETL worker',
                  'Primary ENI in chosen subnet',
                  'You pick subnet, SG, and whether public IP is assigned',
                ],
                [
                  'Glue JDBC job',
                  'AWS-managed ENIs in connection subnets',
                  'Cold start + IP consumption; multi-AZ subnets for HA',
                ],
                [
                  'Lambda in VPC',
                  'Hyperplane ENIs shared across functions (modern)',
                  'Still plan subnet size; cold start tradeoff for private RDS',
                ],
                [
                  'RDS / Redshift',
                  'Service-managed ENI in DB subnet group',
                  'Private IP only in standard prod layout',
                ],
                [
                  'NAT Gateway',
                  'AWS-managed ENI + Elastic IP',
                  'Outbound path for private subnet internet; billable',
                ],
              ].map(([resource, behavior, implication]) => (
                <tr key={resource} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{resource}</td>
                  <td className="px-4 py-3">{behavior}</td>
                  <td className="px-4 py-3">{implication}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Subnet IP exhaustion">
          Before scaling Glue max workers or Lambda concurrency in VPC, check available IPs in connection
          subnets. Expand CIDR or add subnets in the same route table — a common production incident during
          month-end batch surges.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Private IPs (RFC 1918) route inside VPC — RDS, Redshift, and Glue JDBC targets use private endpoints in prod.',
          'Public IPs and Elastic IPs expose resources to the internet — use for NAT and bastions, not databases.',
          'Elastic IP gives static public IPv4; NAT gateways need one per AZ — budget NAT + consider S3 endpoints to cut egress.',
          'ENI is the virtual NIC: IP, SG, MAC — every EC2, Glue worker, Lambda-in-VPC, and DMS instance uses ENIs.',
          'Plan subnet IP capacity for Glue/Lambda ENIs; enable VPC DNS so RDS endpoints resolve correctly after failover.',
        ]}
      />
    </LessonArticle>
  )
}
