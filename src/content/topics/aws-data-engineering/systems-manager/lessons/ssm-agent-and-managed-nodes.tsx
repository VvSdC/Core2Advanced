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

export function SsmAgentAndManagedNodes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="No managed node, no Systems Manager">
        Session Manager, Run Command, and Patch Manager all fail the same way when something is missing:
        the instance simply <strong className="text-white">does not appear in the managed nodes list</strong>.
        Almost every &quot;SSM is broken&quot; ticket comes down to one of three things — the agent, the IAM
        role, or the network. Learn those three and you can fix most problems in minutes.
      </Callout>

      <Definition term="Managed node and SSM Agent">
        <p>
          A <strong className="text-white">managed node</strong> is any machine — EC2 instance, EMR node,
          edge device, or on-prem server — that Systems Manager can see and control. It becomes managed when
          the <strong className="text-white">SSM Agent</strong>, a small open-source process on the machine,
          authenticates with IAM credentials and opens an outbound HTTPS connection to the SSM service. The
          agent <em>polls</em> for work; SSM never needs an inbound port on your server.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">the server phoning home and asking &quot;anything for me?&quot; —
          instead of you knocking on its door over SSH</span>.
        </p>
      </Definition>

      <LessonSection title="The three requirements">
        <ContentStep number={1} title="SSM Agent installed and running">
          <p className="text-slate-300">
            The agent comes preinstalled on AWS-provided AMIs for Amazon Linux 2, Amazon Linux 2023,
            Ubuntu Server (installed as a snap), and Windows Server, among others. Custom or hardened AMIs
            may need it installed manually. On Amazon Linux check it with{' '}
            <code className="text-core-400">sudo systemctl status amazon-ssm-agent</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM permissions for the node">
          <p className="text-slate-300">
            Attach an instance profile whose role includes the AWS managed policy{' '}
            <code className="text-core-400">AmazonSSMManagedInstanceCore</code>. Alternatively, enable{' '}
            <strong className="text-white">Default Host Management Configuration</strong>, an account and
            Region setting that lets SSM manage EC2 instances without a per-instance profile — it requires
            IMDSv2 and a recent agent version.
          </p>
        </ContentStep>
        <ContentStep number={3} title="A network path to the SSM endpoints">
          <p className="text-slate-300">
            The agent must reach <code className="text-core-400">ssm</code>,{' '}
            <code className="text-core-400">ssmmessages</code>, and (for older agent versions){' '}
            <code className="text-core-400">ec2messages</code> on port 443. Public subnets use the internet
            gateway, private subnets use a NAT gateway, or — best for data platforms — VPC interface
            endpoints so traffic never leaves the AWS network.
          </p>
        </ContentStep>
        <Flowchart
          title="What makes a node managed"
          chart={`flowchart LR
  EC2[Private EC2 ETL worker] --> AG[SSM Agent running]
  AG --> ROLE[Instance profile with SSM core policy]
  ROLE --> NET[HTTPS 443 outbound]
  NET --> VPCE[VPC endpoints ssm ssmmessages ec2messages]
  VPCE --> SSM[Systems Manager]
  SSM --> LIST[Appears as managed node]`}
        />
        <Callout variant="tip" title="Security groups — outbound only">
          The node&apos;s security group needs outbound HTTPS to the endpoints; the endpoint&apos;s security
          group needs inbound 443 from the VPC CIDR. You never open inbound port 22 on the node itself.
        </Callout>
      </LessonSection>

      <LessonSection title="Why is my node not showing up?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely cause</th>
                <th className="px-4 py-3">Fix</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Brand-new instance never appears',
                  'No instance profile attached, or role lacks AmazonSSMManagedInstanceCore',
                  'Attach the role, wait a few minutes or restart the agent',
                ],
                [
                  'Works in public subnet, not private',
                  'No NAT gateway and no SSM VPC endpoints',
                  'Create interface endpoints for ssm, ssmmessages, ec2messages with private DNS on',
                ],
                [
                  'Endpoints exist but still offline',
                  'Endpoint security group blocks inbound 443, or private DNS disabled',
                  'Allow 443 from the VPC CIDR and enable private DNS on each endpoint',
                ],
                [
                  'Custom hardened AMI never registers',
                  'SSM Agent not installed or not enabled at boot',
                  'Install the agent in the AMI build and enable the service',
                ],
                [
                  'Node shows Connection lost',
                  'Instance stopped, agent crashed, or disk full so agent cannot write',
                  'Check EC2 state, system log, and free disk space',
                ],
                [
                  'Visible but Session Manager fails',
                  'Old agent version or missing ssmmessages path',
                  'Update SSM Agent and confirm the ssmmessages endpoint',
                ],
              ].map(([symptom, cause, fix]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{symptom}</td>
                  <td className="px-4 py-3">{cause}</td>
                  <td className="px-4 py-3">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Agent logs live at <code className="text-core-400">/var/log/amazon/ssm/amazon-ssm-agent.log</code>{' '}
          on Linux. If you cannot get a shell because SSM is down, the EC2 console&apos;s system log or
          serial console is your fallback — another reason to fix SSM before the incident, not during it.
        </Callout>
      </LessonSection>

      <LessonSection title="Checking managed nodes from the CLI">
        <p className="text-slate-300">
          <code className="text-core-400">describe-instance-information</code> lists every node that has
          registered with SSM, including ping status, platform, and agent version. Filter by tag to check a
          single fleet:
        </p>
        <Example title="List prod ETL workers known to SSM" caption="PingStatus Online means the agent is healthy">
{`aws ssm describe-instance-information \\
  --filters "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod" \\
  --query "InstanceInformationList[].[InstanceId,PingStatus,PlatformName,AgentVersion]" \\
  --output table

# ---------------------------------------------------------------
# |              DescribeInstanceInformation                    |
# +----------------------+---------+-------------------+--------+
# |  i-0abc123def4567890 |  Online | Amazon Linux      | 3.3.x  |
# |  i-0def456abc7890123 |  Online | Amazon Linux      | 3.3.x  |
# +----------------------+---------+-------------------+--------+`}
        </Example>
        <p className="text-slate-300">
          If an instance is running in EC2 but missing from this list, walk the three requirements in
          order: agent, IAM, network.
        </p>
      </LessonSection>

      <LessonSection title="EMR nodes and serverless services">
        <ContentStep number={1} title="EMR on EC2 — nodes are just EC2 instances">
          <p className="text-slate-300">
            EMR cluster nodes run Amazon Linux-based AMIs that typically include SSM Agent — confirm for
            your release label. Add <code className="text-core-400">AmazonSSMManagedInstanceCore</code> to
            the EMR EC2 instance profile and the same VPC endpoints apply, so you can open a session on the
            primary node to read Spark or YARN logs without an EC2 key pair.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue, Athena, Lambda — nothing to manage">
          <p className="text-slate-300">
            Serverless services have no instance for you to log into, so SSM node tools do not apply. You
            debug them with CloudWatch Logs and metrics instead — though they can still read config from
            Parameter Store.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A managed node is any machine whose SSM Agent has registered with Systems Manager over outbound HTTPS.',
          'Three requirements: agent running, IAM via AmazonSSMManagedInstanceCore or Default Host Management Configuration, and a network path to the SSM endpoints.',
          'Private subnets need a NAT gateway or VPC interface endpoints for ssm, ssmmessages, and ec2messages.',
          'Use describe-instance-information filtered by tag to confirm a fleet is Online.',
          'EMR nodes can be managed nodes; Glue, Athena, and Lambda are serverless and need no SSM node access.',
        ]}
      />
    </LessonArticle>
  )
}
