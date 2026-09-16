import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LambdaVpcNetworking() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda defaults to AWS network — VPC is opt-in for private RDS">
        Functions without VPC config reach S3, DynamoDB, and public APIs over AWS-managed networking with no
        ENI setup. Attach Lambda to a VPC only when it must reach{' '}
        <strong className="text-white">private IP resources</strong> — RDS, ElastiCache, internal APIs — at
        the cost of cold start latency and subnet IP planning.
      </Callout>

      <Definition term="Lambda VPC configuration">
        <p>
          Configuring a function with subnets and security groups places its ENIs (via the Hyperplane ENI
          model) in your VPC so outbound connections to private CIDRs route locally. The function loses
          default public internet access unless subnets have NAT or you use VPC endpoints for AWS APIs. IAM
          permissions are unchanged — VPC is purely network placement.
        </p>
      </Definition>

      <LessonSection title="Lambda in VPC">
        <ContentStep number={1} title="When to attach VPC">
          <p className="text-slate-300">
            Attach VPC config for: JDBC/ psycopg2 to private RDS or Aurora; calling internal ALB/NLB on
            private IPs; Redis/ElastiCache in private subnets; on-prem resources via VPN/DX/TGW routes.
            Do <em>not</em> attach for S3-triggered transforms that only call S3 + DynamoDB — default
            Lambda networking is faster and simpler.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subnets and security groups">
          <p className="text-slate-300">
            Choose private subnets with route to RDS (local VPC) and S3 gateway endpoint or NAT for other
            AWS APIs. Lambda SG needs outbound to RDS SG on DB port; RDS SG inbound from Lambda SG. Add
            interface endpoints for Secrets Manager if fetching DB credentials without NAT.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM execution role">
          <p className="text-slate-300">
            Lambda also needs <code className="text-core-400">ec2:CreateNetworkInterface</code> and related
            ENI permissions (often via AWSLambdaVPCAccessExecutionRole managed policy). Missing ENI permissions
            cause deploy failures before any JDBC attempt.
          </p>
        </ContentStep>
        <Example title="VPC vs non-VPC Lambda for DE">
{`S3 event → Lambda → write Parquet to another prefix
  → NO VPC — S3/DynamoDB via default networking

EventBridge schedule → Lambda → query private RDS → write S3
  → VPC required — private subnets + SG + S3 endpoint or NAT
  → Consider RDS Proxy for connection pooling`}
        </Example>
      </LessonSection>

      <LessonSection title="Cold start and ENI tradeoffs">
        <ContentStep number={1} title="Hyperplane ENI model">
          <p className="text-slate-300">
            Modern Lambda shares Hyperplane ENIs across functions in the same subnet/SG combo — cold starts
            improved vs legacy dedicated ENI per function but still slower than non-VPC. First invocation or
            scale-out after idle may add seconds — problematic for sub-second SLAs, acceptable for scheduled
            extract every 15 minutes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IP address consumption">
          <p className="text-slate-300">
            Each subnet/SG combination consumes ENI capacity. High concurrency Lambda in VPC can exhaust{' '}
            <code className="text-core-400">/24</code> subnets — use larger CIDRs or RDS Proxy to reduce
            connection fan-out (Proxy pools DB connections; Lambda still needs ENI for reachability). Monitor
            subnet IP utilization in CloudWatch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Internet and AWS API access from VPC Lambda">
          <p className="text-slate-300">
            VPC Lambda without NAT cannot reach public internet — fine if only private RDS + S3 endpoint.
            Without S3 gateway endpoint, S3 calls fail from VPC Lambda even though non-VPC Lambda works —
            common migration bug when teams add VPC for RDS but forget endpoints.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">Non-VPC Lambda</th>
                <th className="px-4 py-3">VPC Lambda</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Cold start', 'Fastest', 'Additional ENI setup latency'],
                ['Private RDS', 'Not reachable', 'Reachable with SG rules'],
                ['S3 access', 'Default path', 'Needs gateway endpoint or NAT'],
                ['Subnet IPs', 'None consumed', 'ENI capacity per subnet/SG'],
                ['Connection storms', 'N/A for RDS', 'Use RDS Proxy + pool limits'],
              ].map(([factor, nonVpc, vpc]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{factor}</td>
                  <td className="px-4 py-3">{nonVpc}</td>
                  <td className="px-4 py-3">{vpc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When DE needs VPC Lambda">
        <ContentStep number={1} title="Private RDS micro-extract">
          <p className="text-slate-300">
            Lightweight hourly snapshot: Lambda in VPC runs SELECT into memory, writes JSON to S3 — Glue
            handles heavy transform later. RDS Proxy in front of Aurora/RDS prevents{' '}
            <code className="text-core-400">max_connections</code> exhaustion when concurrency spikes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alternatives to VPC Lambda">
          <p className="text-slate-300">
            If extract grows beyond Lambda timeout/memory, move to Glue connection or ECS Fargate in same
            subnets — same SG patterns, better for long JDBC scans. If only S3 + API Gateway needed, stay
            off VPC entirely.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Event-driven pipeline placement">
          <p className="text-slate-300">
            Pattern: S3 landing → non-VPC Lambda validates schema → EventBridge → VPC Lambda enriches from RDS
            → S3. Split functions: only the RDS-touching function pays VPC cold start tax.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Before enabling VPC on an existing S3-only Lambda, verify all AWS SDK calls have endpoint or NAT
          paths — silent S3 failures after VPC attach are a top DE onboarding incident.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Default Lambda reaches S3/DynamoDB without VPC — attach VPC only for private IP targets (RDS, internal ALB).',
          'VPC Lambda needs private subnets, SG rules, ENI IAM permissions, and S3 gateway endpoint or NAT for lake writes.',
          'Cold start and ENI setup add latency vs non-VPC — acceptable for scheduled extract, not ultra-low-latency APIs.',
          'Use RDS Proxy with VPC Lambda to pool DB connections and reduce max_connections storms at high concurrency.',
          'Split pipeline: non-VPC for S3-only steps, VPC only for functions that JDBC to private databases.',
        ]}
      />
    </LessonArticle>
  )
}
