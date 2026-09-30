import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsSystemsManager() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One name, many tools">
        &quot;Systems Manager&quot; is not a single feature — it is an{' '}
        <strong className="text-white">umbrella over a dozen-plus capabilities</strong> that share one
        agent, one console, and one IAM model. Newcomers get lost because the console sidebar lists
        everything at once. This lesson sorts the tools into four groups and shows the one data engineering
        use for each, so you know which handful matter for your pipelines.
      </Callout>

      <Definition term="AWS Systems Manager">
        <p>
          <strong className="text-white">AWS Systems Manager</strong> is a management service for viewing,
          controlling, and automating operations on compute nodes and application configuration across AWS
          accounts, Regions, and on-premises machines. Most node-level features work through the{' '}
          <strong className="text-white">SSM Agent</strong> installed on each server and are described by{' '}
          <strong className="text-white">SSM documents</strong> — reusable JSON or YAML definitions of
          what to run.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy:{' '}
          <span className="text-core-400">a universal remote control for your fleet — one remote, many
          buttons, and IAM decides which buttons each person is allowed to press</span>.
        </p>
      </Definition>

      <LessonSection title="The four capability groups">
        <ContentStep number={1} title="Node tools — reach and manage servers">
          <p className="text-slate-300">
            Session Manager, Run Command, Patch Manager, State Manager, Fleet Manager, Inventory, and
            Distributor. This is where data engineers spend 90% of their SSM time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Change management — make risky changes safely">
          <p className="text-slate-300">
            Automation runbooks, Maintenance Windows, and Change Calendar — schedule patching outside the
            nightly load window and block changes during month-end close.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Application tools — configuration">
          <p className="text-slate-300">
            Parameter Store (you already know it) and AppConfig for feature flags and validated config
            rollouts to running applications.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Operations — see problems across the estate">
          <p className="text-slate-300">
            OpsCenter collects operational issues as OpsItems; Explorer gives a dashboard summary across
            accounts and Regions.
          </p>
        </ContentStep>
        <Flowchart
          title="Systems Manager capability map"
          chart={`flowchart TD
  SSM[AWS Systems Manager]
  SSM --> NODE[Node tools]
  SSM --> CHG[Change management]
  SSM --> APP[Application tools]
  SSM --> OPS[Operations]
  NODE --> N1[Session Manager and Run Command]
  NODE --> N2[Patch Manager and State Manager]
  NODE --> N3[Fleet Manager Inventory Distributor]
  CHG --> C1[Automation and Maintenance Windows]
  CHG --> C2[Change Calendar]
  APP --> A1[Parameter Store and AppConfig]
  OPS --> O1[OpsCenter and Explorer]`}
        />
      </LessonSection>

      <LessonSection title="One DE example per capability">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Capability</th>
                <th className="px-4 py-3">Group</th>
                <th className="px-4 py-3">Data engineering example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Session Manager', 'Node', 'Open a shell on a private EC2 ETL worker to read a failed job log'],
                ['Run Command', 'Node', 'Restart the loader service on every Role=etl-worker node at once'],
                ['Patch Manager', 'Node', 'Apply OS security patches to Airflow hosts every Sunday'],
                ['State Manager', 'Node', 'Ensure the CloudWatch agent is always installed on ETL hosts'],
                ['Fleet Manager', 'Node', 'Browse files and processes on a node from the console'],
                ['Inventory', 'Node', 'Find every host still running an old Java version before a Spark upgrade'],
                ['Distributor', 'Node', 'Package and roll out a custom JDBC driver bundle to workers'],
                ['Automation', 'Change', 'Runbook: snapshot volume, resize instance, restart ETL service'],
                ['Maintenance Windows', 'Change', 'Run patching only between 10:00 and 14:00 UTC, away from nightly loads'],
                ['Change Calendar', 'Change', 'Block automated changes during quarter-end reporting'],
                ['Parameter Store', 'Application', 'Already learned: /de/prod/orders/batch-size read at job start'],
                ['AppConfig', 'Application', 'Toggle a new dedup rule for one pipeline without redeploying'],
                ['OpsCenter', 'Operations', 'Track a recurring disk-full alarm on ETL hosts as an OpsItem'],
                ['Explorer', 'Operations', 'Summary of open OpsItems and patch compliance across accounts'],
              ].map(([cap, group, example]) => (
                <tr key={cap} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{cap}</td>
                  <td className="px-4 py-3">{group}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="Some capabilities have been closed to new customers">
          AWS periodically moves SSM features into maintenance. For example, Change Manager stopped
          accepting new customers in November 2025, Application Manager in July 2026, and the related
          Incident Manager service closed to new customers in late 2025. Existing users keep access, but new
          platforms should not build on them. Always check the Systems Manager docs before adopting a
          less-common capability.
        </Callout>
      </LessonSection>

      <LessonSection title="Which tools a data engineer really uses">
        <p className="text-slate-300">
          You do not need all fourteen on day one. In a typical data platform the priority order is:
        </p>
        <ContentStep number={1} title="Must know — Session Manager, Run Command, Parameter Store">
          <p className="text-slate-300">
            Debug a host, fix a fleet, read config. These three cover most on-call work on EC2-based
            pipelines.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Should know — Patch Manager, State Manager, Automation">
          <p className="text-slate-300">
            Keep data hosts patched and consistent, and turn repeated manual fixes into runbooks. Covered in
            the intermediate lessons.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Nice to know — Inventory, Fleet Manager, OpsCenter, AppConfig">
          <p className="text-slate-300">
            Useful as the platform grows and a central ops team emerges; rarely your first task.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: &quot;We run EC2 Airflow workers in private subnets with no SSH. Engineers use
          Session Manager, fleet fixes go through Run Command, config lives in Parameter Store, and CloudTrail
          audits it all.&quot; That one sentence shows you understand modern server operations.
        </Callout>
      </LessonSection>

      <LessonSection title="Cost intuition">
        <p className="text-slate-300">
          Most core node features — Session Manager, Run Command, Patch Manager, State Manager, and
          Inventory — carry no extra SSM charge for EC2 instances; you pay for the EC2 itself plus what you
          log. Charges typically appear for Parameter Store advanced parameters or higher throughput,
          Automation beyond its free allowance, OpsCenter items, AppConfig requests, and Session Manager or
          Run Command on hybrid (on-prem) nodes, which moved to pay-as-you-go pricing in 2026. Prices and
          free tiers change — check the AWS Systems Manager pricing page before estimating.
        </p>
        <Callout variant="tip" title="Hidden costs to remember">
          VPC interface endpoints for SSM are billed per endpoint per AZ per hour, and session logs in
          CloudWatch Logs are billed by ingestion and storage. For a small team these usually cost more than
          SSM itself — share one set of endpoints per VPC rather than per project.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Systems Manager is an umbrella of capabilities sharing one agent, SSM documents, and IAM.',
          'Four groups: node tools, change management, application tools (Parameter Store, AppConfig), and operations (OpsCenter, Explorer).',
          'DE priority: Session Manager, Run Command, Parameter Store first; Patch Manager, State Manager, Automation next.',
          'Some capabilities such as Change Manager and Application Manager are closed to new customers — verify availability before adopting.',
          'Core node features are generally free for EC2; watch advanced tiers, hybrid nodes, VPC endpoints, and log storage costs.',
        ]}
      />
    </LessonArticle>
  )
}
