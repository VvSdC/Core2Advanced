import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DnsAndDhcp() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Name resolution and DHCP options keep pipelines connected">
        Glue JDBC URLs, Redshift endpoints, and Secrets Manager hostnames all depend on{' '}
        <strong className="text-white">DNS inside the VPC</strong>. Misconfigured DHCP options or disabled
        DNS resolution cause mysterious <em>connection timed out</em> errors even when security groups are
        correct. Data engineers must understand how AWS resolves{' '}
        <code className="text-core-400">*.amazonaws.com</code> names for managed services.
      </Callout>

      <Definition term="Amazon Provided DNS (Route 53 Resolver in VPC)">
        <p>
          Every VPC receives the reserved address{' '}
          <code className="text-core-400">VPC CIDR base + 2</code> (for example{' '}
          <code className="text-core-400">10.0.0.2</code> in a <code className="text-core-400">10.0.0.0/16</code>{' '}
          VPC) as the DNS server when <em>enableDnsSupport</em> is on. This resolver answers queries for
          EC2 private DNS names, RDS endpoints, interface VPC endpoint private DNS names, and forwards public
          names to the internet. Without it, JDBC strings using AWS hostnames fail to resolve.
        </p>
      </Definition>

      <LessonSection title="DNS in VPC">
        <ContentStep number={1} title="Enable DNS hostnames and resolution">
          <p className="text-slate-300">
            Two VPC settings work together: <em>DNS resolution</em> (enableDnsSupport) assigns the Amazon
            DNS IP to instances via DHCP; <em>DNS hostnames</em> (enableDnsHostnames) gives running instances
            public DNS names like <code className="text-core-400">ip-10-0-1-25.ec2.internal</code>. For DE,
            the critical outcome is that{' '}
            <code className="text-core-400">mydb.xxxxx.us-east-1.rds.amazonaws.com</code> resolves to the
            current private IP of the database — including after Multi-AZ failover.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private hosted zones and hybrid DNS">
          <p className="text-slate-300">
            Route 53 private hosted zones associate with one or more VPCs to resolve internal names (for
            example <code className="text-core-400">etl.internal</code> → internal load balancer). Multi-VPC
            data platforms use private zones for service discovery between ingestion microservices and
            orchestration layers. Resolver rules forward on-prem AD DNS for hybrid lake sources — covered
            further in Route 53 and VPN lessons.
          </p>
        </ContentStep>
        <ContentStep number={3} title="VPC endpoint private DNS">
          <p className="text-slate-300">
            Interface endpoints (Glue, Secrets Manager, STS) can enable <em>private DNS names</em> so the
            standard regional hostname resolves to the endpoint ENI inside your VPC. Glue jobs fetching
            secrets then hit the private endpoint without traversing NAT — lower latency and cost. Gateway
            endpoints (S3, DynamoDB) use prefix lists in route tables, not DNS override.
          </p>
        </ContentStep>
        <Example title="DNS failure vs SG failure">
{`Symptom: UnknownHostException on RDS hostname
  → Check VPC enableDnsSupport / enableDnsHostnames
  → Verify DHCP option set uses AmazonProvidedDNS
  → Test from EC2 in same subnet: nslookup mydb....rds.amazonaws.com

Symptom: Connection timed out (host resolves)
  → Security group or route table — not DNS
  → nslookup returns 10.0.2.87 but TCP 5432 blocked`}
        </Example>
      </LessonSection>

      <LessonSection title="DHCP options sets">
        <ContentStep number={1} title="What DHCP options configure">
          <p className="text-slate-300">
            A DHCP options set is associated with a VPC and defines: <strong className="text-white">domain
            name</strong> (optional search suffix), <strong className="text-white">domain name servers</strong>{' '}
            (typically <code className="text-core-400">AmazonProvidedDNS</code>), and optional NTP and NetBIOS
            settings. EC2 and ENI-based services receive these values at launch. Wrong DNS servers — pointing
            to on-prem only without Resolver forwarding — break AWS endpoint resolution from private subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AmazonProvidedDNS vs custom">
          <p className="text-slate-300">
            Standard DE VPCs use <code className="text-core-400">AmazonProvidedDNS</code> alone or as primary
            with custom resolvers for hybrid. Replacing Amazon DNS entirely with external servers without
            Route 53 Resolver inbound/outbound rules breaks{' '}
            <code className="text-core-400">*.amazonaws.com</code> resolution unless those servers forward
            AWS-specific queries correctly — a frequent misconfiguration in enterprise landing zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Changing DHCP options">
          <p className="text-slate-300">
            You cannot edit a DHCP options set in place — create a new set and associate it with the VPC.
            Existing instances pick up changes on renewal or reboot; plan maintenance for long-running ETL
            boxes. IaC templates should pin <code className="text-core-400">AmazonProvidedDNS</code> unless
            network team documents hybrid Resolver architecture.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Setting</th>
                <th className="px-4 py-3">Typical DE value</th>
                <th className="px-4 py-3">If wrong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'domain-name-servers',
                  'AmazonProvidedDNS',
                  'RDS/Glue/Secrets hostnames fail to resolve',
                ],
                [
                  'domain-name',
                  'ec2.internal or corp.local (optional)',
                  'Short names may not resolve as expected',
                ],
                [
                  'enableDnsSupport',
                  'true',
                  'No Amazon DNS IP at VPC+2',
                ],
                [
                  'enableDnsHostnames',
                  'true',
                  'Instances lack usable internal DNS names',
                ],
              ].map(([setting, value, impact]) => (
                <tr key={setting} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{setting}</td>
                  <td className="px-4 py-3">{value}</td>
                  <td className="px-4 py-3">{impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="DE troubleshooting checklist">
        <ContentStep number={1} title="From the same subnet as the job">
          <p className="text-slate-300">
            Spin up a debug EC2 or use SSM in the Glue connection subnet. Resolve the JDBC hostname, then{' '}
            <code className="text-core-400">telnet</code> or <code className="text-core-400">nc</code> on the
            DB port. Split failures: DNS first, then routing, then security groups.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Interface endpoint DNS">
          <p className="text-slate-300">
            If Secrets Manager calls hang from private subnets, confirm the endpoint has private DNS enabled
            and the job role allows <code className="text-core-400">secretsmanager:GetSecretValue</code> — IAM
            errors look different from DNS failures but both block credential fetch at job startup.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Document standard JDBC URLs using AWS-provided hostnames (not hard-coded IPs). IPs change on
          restore, clone, or failover — DNS endpoints stay stable for pipeline config.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Amazon Provided DNS (VPC+2) resolves RDS, Redshift, EC2, and endpoint hostnames — enableDnsSupport required.',
          'enableDnsHostnames lets instances receive resolvable internal names; JDBC should use AWS service hostnames not IPs.',
          'DHCP options set domain-name-servers — use AmazonProvidedDNS unless hybrid Resolver rules are in place.',
          'Interface VPC endpoints with private DNS keep Glue/ Lambda on private paths to Secrets Manager and Glue API.',
          'UnknownHostException = DNS/DHCP; connection timed out after resolve = SG or routing — test from same subnet.',
        ]}
      />
    </LessonArticle>
  )
}
