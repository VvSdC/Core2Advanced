import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FlowLogsAndNetworkFirewall() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Prove who talked to RDS — and block what should not">
        When Glue cannot reach a database, security groups are the first check —{' '}
        <strong className="text-white">VPC Flow Logs</strong> prove whether packets were accepted or rejected.
        At scale, <strong className="text-white">AWS Network Firewall</strong> adds centralized stateful
        inspection for egress control from data subnets — complementing SG least privilege for compliance-heavy
        DE platforms.
      </Callout>

      <Definition term="VPC Flow Log">
        <p>
          VPC Flow Logs capture metadata about IP traffic flowing through ENIs, subnets, or the entire VPC:
          source/destination IP and port, protocol, action (ACCEPT/REJECT), and bytes. They do not capture
          packet payloads — sufficient to debug SG/NACL denials and audit JDBC connection attempts from Glue
          workers to RDS without enabling intrusive packet capture on production databases.
        </p>
      </Definition>

      <LessonSection title="VPC Flow Logs">
        <ContentStep number={1} title="What gets logged">
          <p className="text-slate-300">
            Enable at VPC, subnet, or ENI scope. Each record includes account, interface ID, srcaddr, dstaddr,
            srcport, dstport, protocol, packets, bytes, start/end time, action, and log-status.{' '}
            <strong className="text-white">REJECT</strong> rows with dstport 5432 or 3306 from Glue subnet
            CIDRs pinpoint missing RDS SG rules faster than guesswork.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Destinations and analysis">
          <p className="text-slate-300">
            Publish to CloudWatch Logs, S3, or Kinesis Data Firehose. DE platform teams ship flow logs to S3
            and query with Athena for incident forensics: &quot;Did any IP outside sg-glue connect to RDS last
            Tuesday?&quot; Integrate with Security Hub and GuardDuty for anomaly detection on unexpected
            cross-VPC traffic during extract windows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE troubleshooting workflow">
          <p className="text-slate-300">
            Reproduce failed JDBC from Glue job timestamp → filter flow logs on RDS ENI or subnet for REJECT
            from Glue worker IP → confirm SG fix → re-run job. Contrast ACCEPT on 443 to Secrets Manager
            endpoint ENI vs REJECT on 5432 — separates credential fetch success from database block.
          </p>
        </ContentStep>
        <Example title="Flow log REJECT pattern">
{`Glue worker 10.0.1.88 → RDS 10.0.2.50:5432
Flow log: action=REJECT, interface-id=eni-rds...

Fix: RDS SG add inbound PostgreSQL from sg-glue-connection

After fix: action=ACCEPT, bytes increase during job window`}
        </Example>
      </LessonSection>

      <LessonSection title="Network Firewall overview">
        <ContentStep number={1} title="Centralized inspection">
          <p className="text-slate-300">
            AWS Network Firewall is a managed stateful firewall deployed in dedicated firewall subnets per AZ.
            Route tables steer traffic from data subnets through firewall endpoints before IGW, NAT, or TGW.
            Supports Suricata-compatible rules: domain lists, IP sets, protocol inspection — beyond what SGs
            express conveniently at fleet scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE egress control use case">
          <p className="text-slate-300">
            Data subnets with NAT for vendor APIs: Network Firewall allowlists approved FQDNs (license server,
            geocoding API) and denies all other outbound internet — preventing a compromised Spark worker from
            exfiltrating lake data. S3 and AWS API traffic stays on gateway/interface endpoints, bypassing
            internet egress rules where route design permits.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Operational tradeoffs">
          <p className="text-slate-300">
            Adds latency, cost, and routing complexity — justified for regulated industries, not every startup
            lake. SG + endpoint-first design satisfies most DE needs; Network Firewall is the belt on
            suspenders when compliance mandates centralized egress logging and domain allowlists.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">DE role</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Security group',
                  'ENI level stateful',
                  'Primary: allow Glue SG → RDS SG on DB port',
                ],
                [
                  'NACL',
                  'Subnet stateless',
                  'Coarse subnet blocks; rarely changed for ETL',
                ],
                [
                  'VPC Flow Logs',
                  'Audit metadata',
                  'Prove REJECT/ACCEPT during JDBC incidents',
                ],
                [
                  'Network Firewall',
                  'Centralized stateful',
                  'Egress domain allowlist from data subnets',
                ],
              ].map(([control, scope, role]) => (
                <tr key={control} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{control}</td>
                  <td className="px-4 py-3">{scope}</td>
                  <td className="px-4 py-3">{role}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Observability in pipeline incidents">
        <ContentStep number={1} title="Correlate with CloudWatch">
          <p className="text-slate-300">
            Glue job failure timestamp + flow log REJECT + RDS SG change timeline in CloudTrail = complete RCA.
            Enable flow logs before go-live on prod data VPCs — retroactive logs do not exist for past failures.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost awareness">
          <p className="text-slate-300">
            Flow log volume grows with Spark parallelism and NAT traffic. Filter custom format fields, sample
            in nonprod, or use S3 lifecycle to Glacier for long retention. Athena queries on partitioned S3
            flow log tables are cheap forensics compared to repeated failed multi-hour Glue runs.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Enable flow logs on RDS subnet and Glue connection subnets first — highest signal for DE connectivity
          debugging with minimal initial scope.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'VPC Flow Logs capture ACCEPT/REJECT metadata — prove SG blocks on Glue→RDS JDBC without packet capture.',
          'Ship flow logs to S3 + Athena or CloudWatch for incident RCA and compliance audit of extract traffic.',
          'Network Firewall: centralized stateful inspection for egress allowlists — beyond SG for regulated egress control.',
          'SG remains primary DE control; flow logs debug; Network Firewall when compliance mandates domain-level egress policy.',
          'Enable flow logs before prod cutover — correlate REJECT rows with job failures and CloudTrail SG changes.',
        ]}
      />
    </LessonArticle>
  )
}
