import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SystemsManagerVsAlternatives() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SSM is one answer — sometimes the best answer is no servers at all">
        Interviewers and architects will ask why you chose Session Manager over a bastion, or Systems Manager
        over Ansible. The honest answer depends on how many servers your data platform really has. This lesson
        compares the options for <strong className="text-white">access</strong> and{' '}
        <strong className="text-white">configuration</strong>, and shows when a modern DE team barely touches
        Systems Manager.
      </Callout>

      <Definition term="Two separate problems">
        <p>
          <strong className="text-white">Node access</strong> — how a human reaches a host (SSH with bastion, EC2
          Instance Connect, Session Manager). <strong className="text-white">Configuration management</strong> —
          how hosts reach and keep a desired state (State Manager, Ansible, Chef, Puppet, or immutable images
          that never change after launch). Many tools cover one; Systems Manager covers both, plus patching and
          runbooks.
        </p>
      </Definition>

      <LessonSection title="Comparing the options">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Inbound port</th>
                <th className="px-4 py-3">Identity and audit</th>
                <th className="px-4 py-3">Best fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['SSH + bastion', '22 on bastion; bastion to hosts', 'SSH keys; OS logs only', 'Legacy estates; avoid for new builds'],
                ['EC2 Instance Connect', '22 reachable from your network', 'IAM pushes a short-lived key; CloudTrail', 'Quick SSH to hosts with reachable IPs'],
                ['EC2 Instance Connect Endpoint', '22 from the endpoint SG only', 'IAM and CloudTrail; no public IP needed', 'SSH or RDP to private hosts without agents'],
                ['SSM Session Manager', 'None — agent dials out', 'IAM, CloudTrail, session transcripts', 'Private data hosts, tunnels, hybrid nodes'],
                ['Ansible, Chef, Puppet', 'Usually SSH or own agent', 'Tool-specific; code in Git', 'Large existing config codebases, multi-cloud'],
                ['Immutable images or serverless', 'None — no login expected', 'Pipeline and IaC history', 'Stateless workers, Glue, EMR Serverless, Fargate'],
              ].map(([option, port, audit, fit]) => (
                <tr key={option} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{option}</td>
                  <td className="px-4 py-3">{port}</td>
                  <td className="px-4 py-3">{audit}</td>
                  <td className="px-4 py-3">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Session Manager vs EC2 Instance Connect Endpoint">
          <p className="text-slate-300">
            Both give private-subnet access without a bastion. Instance Connect Endpoint needs no agent and works
            with plain SSH clients, but still uses port 22 inside the VPC and does not transcribe sessions. Session
            Manager needs the agent and a role, and in return gives session logging, Run As, port forwarding to
            remote hosts like RDS, and the rest of the SSM toolset.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SSM vs Ansible, Chef, Puppet">
          <p className="text-slate-300">
            They overlap with State Manager. You do not have to choose: SSM documents such as{' '}
            <code className="text-core-400">AWS-ApplyAnsiblePlaybooks</code> and{' '}
            <code className="text-core-400">AWS-ApplyChefRecipes</code> run existing playbooks and recipes through
            Run Command or State Manager, replacing SSH-based push with the agent&apos;s outbound channel.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Immutable infrastructure — the direction most DE platforms move">
        <ContentStep number={1} title="Golden AMIs and containers">
          <p className="text-slate-300">
            EC2 Image Builder bakes patched AMIs; Auto Scaling instance refresh swaps workers. Containers on ECS
            Fargate or EKS carry their dependencies in the image — you rebuild, not patch. Even then, ECS Exec
            uses Session Manager under the hood when you need a shell in a running task.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Serverless data services">
          <p className="text-slate-300">
            Glue jobs, EMR Serverless, Athena, Redshift Serverless, Lambda, and Step Functions have no hosts to
            patch or log into. A team built entirely on these uses Systems Manager mostly for Parameter Store and
            maybe one port-forwarding jump host for private databases.
          </p>
        </ContentStep>
        <Flowchart
          title="Choosing how to access and manage a data host"
          chart={`flowchart TB
  Q1{Do you need a server at all}
  SVL[Use Glue EMR Serverless Lambda Fargate]
  Q2{Stateless and rebuildable}
  IMM[Golden AMI plus instance refresh]
  Q3{Existing Ansible or Chef code}
  ANS[Run playbooks via SSM documents]
  SSM[State Manager Patch Manager runbooks]
  ACC{Human access needed}
  SM[Session Manager with logging]
  NONE[No interactive access]
  Q1 -->|no| SVL
  Q1 -->|yes| Q2
  Q2 -->|yes| IMM
  Q2 -->|no| Q3
  Q3 -->|yes| ANS
  Q3 -->|no| SSM
  IMM --> ACC
  ANS --> ACC
  SSM --> ACC
  ACC -->|yes| SM
  ACC -->|no| NONE`}
        />
      </LessonSection>

      <LessonSection title="When a DE team barely needs SSM">
        <ContentStep number={1} title="Signals you are in that world">
          <p className="text-slate-300">
            No long-lived EC2 in the pipeline, EMR only as transient or serverless jobs, databases reached through
            Query Editor v2 or a single tunnel host, and configuration in Parameter Store and Secrets Manager.
            Patch Manager, Inventory, and maintenance windows then belong to a platform team, if anyone.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you still keep">
          <p className="text-slate-300">
            Parameter Store for config, a port-forwarding path to private databases, Session Manager as the
            break-glass access method for any remaining hosts, and an SCP that forbids opening port 22 at all.
            Knowing the full toolset still matters: interviews and migrations from legacy ETL servers test it.
          </p>
        </ContentStep>
        <Callout variant="insight">
          The best operational server is the one you deleted. Use Systems Manager well for the hosts you must
          keep, and keep asking whether each one could become a Glue job, an EMR Serverless application, or a
          container.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Separate node access (bastion, Instance Connect, Session Manager) from configuration management (State Manager, Ansible, images).',
          'Session Manager: no inbound ports, IAM plus CloudTrail plus transcripts, port forwarding, hybrid support.',
          'EC2 Instance Connect Endpoint is agentless private SSH, but without session logging or SSM features.',
          'Existing Ansible or Chef code can run through SSM documents instead of SSH push.',
          'Immutable and serverless designs shrink SSM to Parameter Store, a DB tunnel, and break-glass access.',
        ]}
      />
    </LessonArticle>
  )
}
