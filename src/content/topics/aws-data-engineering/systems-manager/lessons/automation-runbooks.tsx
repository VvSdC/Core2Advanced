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

export function AutomationRunbooks() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Turn the 3 a.m. wiki page into a button">
        &quot;Disk full on an ETL worker&quot; usually means a checklist: snapshot the volume, stop the
        service, grow the disk, restart, tell the team. Done by hand at 3 a.m., steps get skipped.{' '}
        <strong className="text-white">Automation runbooks</strong> encode that checklist as a versioned
        document that calls AWS APIs and runs commands on nodes, with approvals, branching, and rate control
        built in.
      </Callout>

      <Definition term="Automation runbook">
        <p>
          An SSM document of type Automation (<code className="text-core-400">schemaVersion: &apos;0.3&apos;</code>)
          made of <strong className="text-white">mainSteps</strong>. Each step uses an action such as{' '}
          <code className="text-core-400">aws:executeAwsApi</code> or{' '}
          <code className="text-core-400">aws:runCommand</code>, can pass outputs to later steps, and runs under
          an <strong className="text-white">assume role</strong> (<code className="text-core-400">AutomationAssumeRole</code>)
          so the runbook has exactly the permissions it needs — not the caller&apos;s.
        </p>
      </Definition>

      <LessonSection title="Runbook building blocks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['aws:executeAwsApi', 'Calls any AWS API, captures outputs', 'ec2 CreateSnapshot, sns Publish'],
                ['aws:runCommand', 'Runs a Command document on nodes', 'systemctl stop etl-worker'],
                ['aws:executeScript', 'Runs Python or PowerShell inline', 'Parse disk usage, compute new size'],
                ['aws:branch', 'Chooses next step from a value', 'Skip resize if cleanup freed space'],
                ['aws:approve', 'Pauses for human approval', 'On-call approves a prod resize'],
                ['aws:waitForAwsResourceProperty', 'Polls until a property matches', 'Snapshot State = completed'],
              ].map(([action, what, example]) => (
                <tr key={action} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{action}</td>
                  <td className="px-4 py-3">{what}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Start with AWS-owned runbooks">
          <p className="text-slate-300">
            Hundreds are published by AWS: <code className="text-core-400">AWS-RestartEC2Instance</code>,{' '}
            <code className="text-core-400">AWS-StopEC2Instance</code>, <code className="text-core-400">AWS-CreateImage</code>,{' '}
            <code className="text-core-400">AWS-CreateSnapshot</code>, and support runbooks like{' '}
            <code className="text-core-400">AWSSupport-TroubleshootSSH</code>. Read their content in the
            Documents console — they are the best examples of runbook style — then write your own only for what
            is specific to your pipelines.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A custom runbook — grow a full data volume">
        <Example
          title="acme-etl-GrowDataVolume.yaml"
          caption="Snapshot, stop the ETL service, resize, grow the filesystem, restart, notify"
        >
{`schemaVersion: '0.3'
description: Grow the /data volume on an ETL worker safely
assumeRole: '{{ AutomationAssumeRole }}'
parameters:
  InstanceId: { type: String }
  VolumeId: { type: String }
  NewSizeGiB: { type: Integer }
  AutomationAssumeRole: { type: String }
mainSteps:
  - name: snapshotVolume
    action: aws:executeAwsApi
    inputs:
      Service: ec2
      Api: CreateSnapshot
      VolumeId: '{{ VolumeId }}'
      Description: 'pre-resize {{ InstanceId }}'
    outputs:
      - { Name: SnapshotId, Selector: $.SnapshotId, Type: String }
  - name: waitForSnapshot
    action: aws:waitForAwsResourceProperty
    timeoutSeconds: 3600
    inputs:
      Service: ec2
      Api: DescribeSnapshots
      SnapshotIds: ['{{ snapshotVolume.SnapshotId }}']
      PropertySelector: $.Snapshots[0].State
      DesiredValues: [completed]
  - name: stopEtlService
    action: aws:runCommand
    inputs:
      DocumentName: AWS-RunShellScript
      InstanceIds: ['{{ InstanceId }}']
      Parameters:
        commands: ['systemctl stop etl-worker']
  - name: resizeVolume
    action: aws:executeAwsApi
    inputs:
      Service: ec2
      Api: ModifyVolume
      VolumeId: '{{ VolumeId }}'
      Size: '{{ NewSizeGiB }}'
  - name: waitForResize
    action: aws:waitForAwsResourceProperty
    inputs:
      Service: ec2
      Api: DescribeVolumesModifications
      VolumeIds: ['{{ VolumeId }}']
      PropertySelector: $.VolumesModifications[0].ModificationState
      DesiredValues: [optimizing, completed]
  - name: growFilesystemAndStart
    action: aws:runCommand
    inputs:
      DocumentName: AWS-RunShellScript
      InstanceIds: ['{{ InstanceId }}']
      Parameters:
        commands: ['xfs_growfs -d /data', 'systemctl start etl-worker']
  - name: notifyTeam
    action: aws:executeAwsApi
    inputs:
      Service: sns
      Api: Publish
      TopicArn: arn:aws:sns:us-east-1:111122223333:de-alerts-prod
      Message: 'Grew /data on {{ InstanceId }} to {{ NewSizeGiB }} GiB'`}
        </Example>
        <Callout variant="tip">
          Add <code className="text-core-400">onFailure</code> handlers that jump to a notify step, and restart
          the service even if the resize fails — a runbook that leaves the worker stopped is worse than the
          original alert.
        </Callout>
      </LessonSection>

      <LessonSection title="Triggers, rate control, and roles">
        <ContentStep number={1} title="Event-driven remediation">
          <p className="text-slate-300">
            EventBridge rules can target an Automation runbook directly. A common chain: CloudWatch alarm on
            disk usage changes state → EventBridge rule matches the alarm state-change event → runbook starts
            with the instance ID from the event. You can also run runbooks from State Manager (scheduled),
            maintenance windows, OpsCenter items, or the CLI.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rate control across targets">
          <p className="text-slate-300">
            Start one execution against many resources with <code className="text-core-400">--targets</code>{' '}
            and <code className="text-core-400">--target-parameter-name InstanceId</code>, bounded by{' '}
            <code className="text-core-400">--max-concurrency</code> and <code className="text-core-400">--max-errors</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Assume role and pricing">
          <p className="text-slate-300">
            Create a dedicated role trusted by <code className="text-core-400">ssm.amazonaws.com</code> with only
            the EC2, SSM, and SNS actions the runbook calls; callers need{' '}
            <code className="text-core-400">iam:PassRole</code> for it. Automation is billed per step executed
            (plus duration for script steps) — check the pricing page before looping over thousands of resources.
          </p>
        </ContentStep>
        <Flowchart
          title="Alarm-driven runbook"
          chart={`flowchart LR
  CW[CloudWatch alarm disk above 85 percent]
  EB[EventBridge rule alarm state change]
  AUTO[Automation acme-etl-GrowDataVolume]
  SNAP[Snapshot volume]
  RES[Stop resize grow restart]
  SNS[SNS de-alerts-prod]
  CW --> EB
  EB --> AUTO
  AUTO --> SNAP
  SNAP --> RES
  RES --> SNS`}
        />
        <Callout variant="insight">
          Automation vs Step Functions: Automation is for <strong className="text-white">operating
          infrastructure</strong> (nodes, volumes, AMIs) and understands SSM targets and Run Command natively.
          Step Functions is for <strong className="text-white">data workflows</strong> — Glue, Athena, Redshift,
          Lambda with rich retries and Map state. They can call each other, but do not model your nightly load
          as a runbook.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Automation runbooks (schemaVersion 0.3) chain steps: executeAwsApi, runCommand, executeScript, branch, approve, wait.',
          'Reuse AWS-owned runbooks first; write custom ones for pipeline-specific remediation.',
          'Runbooks run under an AutomationAssumeRole — least privilege, independent of the caller.',
          'Trigger from EventBridge (including alarm state changes), State Manager, maintenance windows, or CLI with rate control.',
          'Automation operates infrastructure; Step Functions orchestrates data workflows.',
        ]}
      />
    </LessonArticle>
  )
}
