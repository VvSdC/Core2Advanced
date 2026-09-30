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

export function StateManagerAndAssociations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Say what every ETL host should look like — and let SSM keep it that way">
        Run Command fixes something once. But a new worker launched next week, or a host where someone
        &quot;temporarily&quot; stopped the CloudWatch agent, will quietly drift.{' '}
        <strong className="text-white">State Manager</strong> re-applies your desired configuration on a
        schedule to every node that matches a tag — new ones included — and reports which nodes are compliant.
      </Callout>

      <Definition term="State Manager association">
        <p>
          An <strong className="text-white">association</strong> binds an SSM document (Command or Automation)
          to a set of <strong className="text-white">targets</strong> (instance IDs, tags, resource groups, or all
          managed nodes) with <strong className="text-white">parameters</strong> and a{' '}
          <strong className="text-white">schedule</strong> (cron or rate). It runs when created, when a new node
          starts matching the targets, and then on every schedule tick. Each run records a status — Success,
          Failed, or Pending — that feeds association compliance.
        </p>
      </Definition>

      <LessonSection title="Desired state for data hosts">
        <ContentStep number={1} title="Typical associations on ETL workers">
          <p className="text-slate-300">
            Install the CloudWatch agent with <code className="text-core-400">AWS-ConfigureAWSPackage</code>;
            configure it from a Parameter Store config with{' '}
            <code className="text-core-400">AmazonCloudWatch-ManageAgent</code>; keep SSM Agent current with{' '}
            <code className="text-core-400">AWS-UpdateSSMAgent</code>; collect inventory with{' '}
            <code className="text-core-400">AWS-GatherSoftwareInventory</code>; and apply a custom Command
            document that installs a logrotate rule for <code className="text-core-400">/var/log/etl</code> and
            enforces a security baseline (no password SSH, required packages).
          </p>
        </ContentStep>
        <ContentStep number={2} title="New nodes are handled automatically">
          <p className="text-slate-300">
            Target by tag, not instance ID. When Auto Scaling launches a worker tagged{' '}
            <code className="text-core-400">Role=etl-worker</code>, the association applies to it shortly after
            it registers with Systems Manager — no user-data scripts to keep in sync.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Drift correction">
          <p className="text-slate-300">
            If someone edits the agent config or stops the service on a host, the next scheduled run puts it
            back. Make documents <strong className="text-white">idempotent</strong> — safe to run every 30
            minutes without restarting services that are already correct.
          </p>
        </ContentStep>
        <Flowchart
          title="Association lifecycle"
          chart={`flowchart TB
  ASSOC[Association CloudWatch agent config]
  TGT[Targets tag Role etl-worker]
  NEW[New worker registers]
  SCHED[Schedule tick rate 30 minutes]
  RUN[Document runs on matching nodes]
  OK[Status Success compliant]
  BAD[Status Failed non compliant]
  ALERT[EventBridge rule to SNS de-alerts-prod]
  ASSOC --> TGT
  NEW --> RUN
  SCHED --> RUN
  TGT --> RUN
  RUN --> OK
  RUN --> BAD
  BAD --> ALERT`}
        />
      </LessonSection>

      <LessonSection title="Creating an association">
        <ContentStep number={1} title="Rate controls">
          <p className="text-slate-300">
            <code className="text-core-400">--max-concurrency</code> limits how many nodes run at once;{' '}
            <code className="text-core-400">--max-errors</code> stops the rollout after too many failures. A
            broken config then hits a few workers, not the whole fleet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compliance severity and schedule options">
          <p className="text-slate-300">
            <code className="text-core-400">--compliance-severity</code> sets how a failure is ranked in
            compliance reports. <code className="text-core-400">--apply-only-at-cron-interval</code> skips the
            immediate run at creation — useful when you want the first run inside a quiet window. Rate
            schedules for associations have a minimum interval (30 minutes at the time of writing).
          </p>
        </ContentStep>
        <Example
          title="Keep the CloudWatch agent configured on every prod ETL worker"
          caption="Agent config JSON lives in Parameter Store as AmazonCloudWatch-etl-worker"
        >
{`aws ssm create-association \\
  --association-name "etl-worker-cloudwatch-agent" \\
  --name "AmazonCloudWatch-ManageAgent" \\
  --targets "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod" \\
  --parameters '{
    "action": ["configure"],
    "mode": ["ec2"],
    "optionalConfigurationSource": ["ssm"],
    "optionalConfigurationLocation": ["AmazonCloudWatch-etl-worker"],
    "optionalRestart": ["yes"]
  }' \\
  --schedule-expression "rate(1 day)" \\
  --max-concurrency "20%" \\
  --max-errors "10%" \\
  --compliance-severity "HIGH"

# Check status per node
aws ssm describe-association-executions \\
  --association-id <association-id>`}
        </Example>
        <Callout variant="tip">
          Store the agent config in Parameter Store (you learned hierarchies earlier) and change it there. The
          association picks up the new config on its next run — config as data, not as SSH edits.
        </Callout>
      </LessonSection>

      <LessonSection title="State Manager vs Run Command vs Automation">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Runs</th>
                <th className="px-4 py-3">Use it for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Run Command', 'Once, when you call it', 'Ad hoc: check disk on all workers, restart a hung service'],
                ['State Manager', 'On a schedule, plus new nodes', 'Desired state: agents installed, configs applied, inventory'],
                ['Automation', 'Once per trigger, multi-step', 'Workflows: snapshot, stop, resize, restart, notify'],
              ].map(([tool, runs, use]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{tool}</td>
                  <td className="px-4 py-3">{runs}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="They compose">
          <p className="text-slate-300">
            An association can run an Automation runbook on a schedule, and a runbook can call Run Command as a
            step. Rule of thumb: if you find yourself running the same Run Command every week, turn it into an
            association.
          </p>
        </ContentStep>
        <Callout variant="info">
          Quick Setup host management configurations create several of these associations for you (agent
          updates, inventory, CloudWatch agent). Look in State Manager before creating duplicates — two
          inventory associations on the same node conflict.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'An association = document + targets + parameters + schedule; it keeps nodes in a desired state.',
          'Target by tag so new Auto Scaling workers are configured automatically.',
          'Scheduled re-runs correct drift — write idempotent documents.',
          'Rate controls and compliance severity limit blast radius and rank failures.',
          'Run Command is one-off, State Manager is continuous, Automation is multi-step workflows.',
        ]}
      />
    </LessonArticle>
  )
}
