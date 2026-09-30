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

export function RunCommand() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Twelve servers, one fix">
        Session Manager is perfect for one server. But when a config change means restarting the loader
        on all twelve ETL workers, opening twelve shells is slow and error-prone.{' '}
        <strong className="text-white">Run Command</strong> sends the same script to every matching node
        at once, controls how fast it rolls out, stops if too many fail, and saves every node&apos;s output
        — all recorded in CloudTrail.
      </Callout>

      <Definition term="Run Command">
        <p>
          <strong className="text-white">Run Command</strong> is a Systems Manager capability that executes
          an <strong className="text-white">SSM document</strong> on one or many managed nodes, chosen by
          instance ID, tag, or resource group. Each run gets a command ID; each node produces an invocation
          with its own status and output, which can be stored in S3 or CloudWatch Logs.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as{' '}
          <span className="text-core-400">a group text to your fleet — one message, every recipient runs it,
          and you get a read receipt from each</span>.
        </p>
      </Definition>

      <LessonSection title="Documents, targets, and rate control">
        <ContentStep number={1} title="Pick a document — what to run">
          <p className="text-slate-300">
            <code className="text-core-400">AWS-RunShellScript</code> runs shell commands on Linux;{' '}
            <code className="text-core-400">AWS-RunPowerShellScript</code> does the same on Windows. AWS
            also owns documents such as <code className="text-core-400">AWS-UpdateSSMAgent</code> and{' '}
            <code className="text-core-400">AWS-ConfigureAWSPackage</code>. Your team can write custom
            documents like <code className="text-core-400">Acme-RestartEtlLoader</code> with typed
            parameters so nobody pastes raw commands.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose targets — where to run">
          <p className="text-slate-300">
            List instance IDs for a handful of nodes, or — better — target tags like{' '}
            <code className="text-core-400">Role=etl-worker</code> plus{' '}
            <code className="text-core-400">Env=prod</code>, or a resource group. Tag targeting picks up
            newly launched workers automatically.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Set rate control — how fast and how safely">
          <p className="text-slate-300">
            <strong className="text-white">Max concurrency</strong> limits how many nodes run at once (a
            number or a percentage such as 25%). <strong className="text-white">Max errors</strong> stops
            sending to new nodes once that many invocations fail. Restarting a quarter of workers at a time
            keeps the pipeline serving while you roll out.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Send output somewhere durable">
          <p className="text-slate-300">
            The console and API return only a truncated portion of long output. Point Run Command at an S3
            bucket and a CloudWatch Logs group to keep the full stdout and stderr for every node.
          </p>
        </ContentStep>
        <Flowchart
          title="One Run Command fanning out to a fleet"
          chart={`flowchart LR
  ENG[Engineer or pipeline] --> RC[Run Command send]
  RC --> DOC[Document AWS-RunShellScript]
  DOC --> TGT[Targets tag Role etl-worker]
  TGT --> W1[Worker 1]
  TGT --> W2[Worker 2]
  TGT --> W3[Worker 3]
  W1 --> OUT[Output S3 and CloudWatch]
  W2 --> OUT
  W3 --> OUT`}
        />
      </LessonSection>

      <LessonSection title="Hands-on — check disk and restart the loader">
        <p className="text-slate-300">
          First, a read-only check: how full is <code className="text-core-400">/data</code> on every prod
          ETL worker?
        </p>
        <Example title="Check disk space across the fleet" caption="Read-only commands first — always">
{`aws ssm send-command \\
  --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod" \\
  --parameters 'commands=["df -h /data","du -sh /data/tmp"]' \\
  --comment "Disk check before cleanup" \\
  --query "Command.CommandId" --output text

# 3f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b`}
        </Example>
        <p className="text-slate-300">
          Then the change itself, rolled out a quarter at a time and stopping after the first failure:
        </p>
        <Example title="Restart the ETL loader on all prod workers" caption="Rate control plus durable output">
{`aws ssm send-command \\
  --document-name "AWS-RunShellScript" \\
  --targets "Key=tag:Role,Values=etl-worker" "Key=tag:Env,Values=prod" \\
  --parameters 'commands=["sudo systemctl restart etl-loader","systemctl is-active etl-loader"]' \\
  --max-concurrency "25%" \\
  --max-errors "1" \\
  --timeout-seconds 600 \\
  --output-s3-bucket-name "acme-ssm-output-prod" \\
  --output-s3-key-prefix "run-command/etl-loader/" \\
  --cloud-watch-output-config "CloudWatchOutputEnabled=true,CloudWatchLogGroupName=/ssm/run-command" \\
  --comment "Restart loader after batch-size change"`}
        </Example>
        <Example title="Check per-node results" caption="One invocation per targeted node">
{`aws ssm list-command-invocations \\
  --command-id 3f1e2d3c-4b5a-6978-8a9b-0c1d2e3f4a5b \\
  --details \\
  --query "CommandInvocations[].[InstanceId,Status]" \\
  --output table

# |  i-0abc123def4567890 |  Success |
# |  i-0def456abc7890123 |  Success |
# |  i-0123abc456def7890 |  Failed  |`}
        </Example>
        <Callout variant="tip" title="Idempotent scripts only">
          Write commands that are safe to run twice — <code className="text-core-400">mkdir -p</code>,
          restarting a service, deleting files older than seven days. A script that appends to a config file
          every run will slowly corrupt your fleet.
        </Callout>
      </LessonSection>

      <LessonSection title="Run Command vs Session Manager vs Automation">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Session Manager', 'Interactive investigation on one node', 'Read a stack trace in a failed job log'],
                ['Run Command', 'Same script on many nodes, one step', 'Clear temp files on every etl-worker'],
                ['Automation', 'Multi-step workflows, including AWS API calls', 'Snapshot volume, resize instance, restart service'],
              ].map(([tool, best, example]) => (
                <tr key={tool} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{tool}</td>
                  <td className="px-4 py-3">{best}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          A healthy progression: investigate once with Session Manager, fix the fleet with Run Command, then
          turn the fix into an Automation runbook or custom document so the next on-call engineer clicks one
          button instead of retyping commands.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Run Command executes an SSM document such as AWS-RunShellScript on one or many managed nodes.',
          'Target by tags like Role=etl-worker and Env=prod so new nodes are included automatically.',
          'Rate control — max concurrency and max errors — keeps rollouts safe and stops on failure.',
          'Send output to S3 and CloudWatch Logs; check per-node status with list-command-invocations.',
          'Session Manager for one-node investigation, Run Command for one-step fleet fixes, Automation for multi-step workflows.',
        ]}
      />
    </LessonArticle>
  )
}
