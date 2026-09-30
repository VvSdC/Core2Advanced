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

export function OperatingEtlHostsAndEmr() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The servers that still exist in a serverless-leaning data platform">
        Glue and Athena have no nodes to manage, but many teams still run EC2 ETL workers (custom Python,
        vendor tools, JDBC extractors) and EMR clusters for heavy Spark. This lesson assembles everything from
        the sub-topic into a day-to-day operating model: how to reach, configure, debug, and heal those hosts
        with Systems Manager instead of SSH keys and tribal knowledge.
      </Callout>

      <Definition term="Operating model for data hosts">
        <p>
          Every host is <strong className="text-white">tagged</strong> (Role, Env, Pipeline),{' '}
          <strong className="text-white">managed</strong> (SSM Agent plus instance profile),{' '}
          <strong className="text-white">configured by State Manager</strong>,{' '}
          <strong className="text-white">observed</strong> by the CloudWatch agent,{' '}
          <strong className="text-white">healed by Automation</strong> on alarms, and reads config from Parameter
          Store and secrets from Secrets Manager at runtime. Humans connect through Session Manager only when
          automation is not enough.
        </p>
      </Definition>

      <LessonSection title="EMR clusters and Systems Manager">
        <ContentStep number={1} title="Getting EMR nodes managed">
          <p className="text-slate-300">
            EMR on EC2 nodes run Amazon Linux-based AMIs, which normally include SSM Agent — but verify on your
            release, and remember the node also needs SSM permissions. Add{' '}
            <code className="text-core-400">AmazonSSMManagedInstanceCore</code> to the EMR EC2 instance profile
            (for example a custom version of <code className="text-core-400">EMR_EC2_DefaultRole</code>). If the
            agent is missing on a custom AMI, install it with a bootstrap action.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Debugging on the primary node">
          <p className="text-slate-300">
            Start a session to the primary node, switch to the <code className="text-core-400">hadoop</code> user,
            and use <code className="text-core-400">yarn application -list</code>,{' '}
            <code className="text-core-400">yarn logs -applicationId</code>, or{' '}
            <code className="text-core-400">spark-shell</code> for interactive checks. For web UIs, use{' '}
            <code className="text-core-400">AWS-StartPortForwardingSession</code> to forward the YARN
            ResourceManager port (8088) or Spark History Server (18080) to localhost — no SOCKS proxy, no key pair.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Run Command across core nodes">
          <p className="text-slate-300">
            EMR tags every node with <code className="text-core-400">aws:elasticmapreduce:job-flow-id</code> and{' '}
            <code className="text-core-400">aws:elasticmapreduce:instance-group-role</code>. Target those tags to
            check disk or collect logs on all core nodes of one cluster at once. Do not patch long-lived clusters
            in place — move to a newer EMR release and relaunch; transient clusters make this automatic.
          </p>
        </ContentStep>
        <Example title="Check HDFS and local disk on every core node" caption="Tag keys set by EMR; cluster ID is a placeholder">
{`aws ssm send-command \\
  --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:aws:elasticmapreduce:job-flow-id,Values=j-2AXXXXXXGAPLF" \\
            "Key=tag:aws:elasticmapreduce:instance-group-role,Values=CORE" \\
  --parameters 'commands=["df -h /mnt","sudo -u hdfs hdfs dfsadmin -report | head -20"]' \\
  --max-concurrency "50%" \\
  --cloud-watch-output-config "CloudWatchOutputEnabled=true,CloudWatchLogGroupName=/ssm/emr-diagnostics"`}
        </Example>
      </LessonSection>

      <LessonSection title="EC2 ETL workers — the managed-node checklist">
        <ContentStep number={1} title="Tags drive everything">
          <p className="text-slate-300">
            <code className="text-core-400">Role=etl-worker</code>, <code className="text-core-400">Env=prod</code>,{' '}
            <code className="text-core-400">Pipeline=orders</code>. State Manager associations, patch policies,
            IAM conditions, maintenance window targets, and inventory queries all key off these tags. An untagged
            worker is effectively invisible to your operations.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Config and secrets at runtime">
          <p className="text-slate-300">
            The worker reads settings with <code className="text-core-400">get-parameters-by-path</code> under{' '}
            <code className="text-core-400">/acme/prod/etl/orders/</code> and fetches the{' '}
            <code className="text-core-400">orders-db-prod</code> password from Secrets Manager when a job starts.
            Never pass secrets as Run Command parameters or bake them into user data — command parameters are
            visible in command history to anyone with read access.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Self-healing disk alarms">
          <p className="text-slate-300">
            The CloudWatch agent (installed by association) publishes disk usage. An alarm at 85% on{' '}
            <code className="text-core-400">/data</code> triggers an Automation runbook through EventBridge that
            first cleans temp files older than three days, re-checks usage, grows the volume only if still
            needed, and reports to <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <Flowchart
          title="Disk alarm remediation on an ETL worker"
          chart={`flowchart TB
  CWA[CloudWatch agent disk metric]
  ALARM[Alarm data disk above 85 percent]
  EB[EventBridge rule]
  RB[Automation runbook]
  CLEAN[Run Command delete old temp files]
  CHECK{Still above threshold}
  GROW[Snapshot and grow volume]
  DONE[Notify SNS de-alerts-prod]
  CWA --> ALARM
  ALARM --> EB
  EB --> RB
  RB --> CLEAN
  CLEAN --> CHECK
  CHECK -->|yes| GROW
  CHECK -->|no| DONE
  GROW --> DONE`}
        />
      </LessonSection>

      <LessonSection title="Incident runbook — which SSM tool for which problem">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Incident</th>
                <th className="px-4 py-3">First move</th>
                <th className="px-4 py-3">SSM tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Disk full on /data', 'Clean temp, then grow volume', 'Automation runbook (alarm-triggered)'],
                ['ETL service hung on one host', 'Check logs, restart service', 'Session Manager or Run Command'],
                ['Same fix needed on 30 workers', 'Rate-controlled command by tag', 'Run Command'],
                ['Spark job failing on EMR', 'yarn logs on primary node', 'Session Manager + port forwarding to UIs'],
                ['CVE in a package or JDBC driver', 'Find affected hosts', 'Inventory + Athena, then Patch Manager'],
                ['Config drift after manual edit', 'Re-apply desired state', 'State Manager association'],
                ['Analyst needs prod DB access', 'Temporary tunnel', 'Port forwarding session'],
                ['Host missing from Systems Manager', 'Check agent, role, endpoints', 'Fleet Manager unmanaged view'],
              ].map(([incident, move, tool]) => (
                <tr key={incident} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{incident}</td>
                  <td className="px-4 py-3">{move}</td>
                  <td className="px-4 py-3">{tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Every time an incident needs a human session, ask whether the fix belongs in a runbook or association.
          The goal is fewer sessions over time, not faster typing.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EMR nodes can be SSM-managed: verify the agent and add AmazonSSMManagedInstanceCore to the EMR instance profile.',
          'Use sessions and port forwarding to debug Spark and YARN; target EMR tags for Run Command across core nodes.',
          'Relaunch EMR on newer releases instead of patching long-lived clusters.',
          'ETL workers: tags, State Manager config, Parameter Store settings, and Secrets Manager credentials at runtime.',
          'Alarm → EventBridge → Automation turns common incidents like full disks into self-healing workflows.',
        ]}
      />
    </LessonArticle>
  )
}
