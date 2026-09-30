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

export function LoggingMonitoringContainerInsights() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A task that failed at 02:07 leaves clues — if you set up the right places">
        Fargate tasks are gone the moment they stop: no host to SSH into, no local disk to inspect. Everything you
        need for a 9 a.m. investigation has to be captured while the task runs —{' '}
        <strong className="text-white">logs</strong> in CloudWatch, <strong className="text-white">metrics</strong>{' '}
        from Container Insights, and the <strong className="text-white">stopped reason</strong> ECS records for
        about an hour after the task ends. This lesson wires all three for{' '}
        <code className="text-core-400">orders-export</code>.
      </Callout>

      <Definition term="CloudWatch Container Insights">
        <p>
          A CloudWatch feature, enabled per cluster or account-wide, that collects CPU, memory, network, storage,
          and task counts at cluster, service, and task level into the{' '}
          <code className="text-core-400">ECS/ContainerInsights</code> namespace. The newer{' '}
          <strong className="text-white">enhanced observability</strong> mode adds container-level detail and
          curated dashboards for drilling from a cluster down to a single failing container. It is billed as custom
          metrics and log ingestion, so enable it deliberately.
        </p>
      </Definition>

      <LessonSection title="Getting logs out of the container">
        <ContentStep number={1} title="awslogs driver">
          <p className="text-slate-300">
            The default choice. Anything the container writes to stdout or stderr lands in log group{' '}
            <code className="text-core-400">/ecs/orders-export</code>, in a stream named{' '}
            <code className="text-core-400">prefix/container-name/task-id</code>. Set a retention policy on the
            group (30 to 90 days is typical) — the default is to keep logs forever. Log structured JSON lines with{' '}
            <code className="text-core-400">run_date</code> and row counts so Logs Insights can query them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="FireLens with Fluent Bit">
          <p className="text-slate-300">
            When logs must go somewhere other than CloudWatch — S3 for cheap long-term retention, OpenSearch for
            search, or a third-party tool — add a Fluent Bit sidecar and set the app container&apos;s log driver to{' '}
            <code className="text-core-400">awsfirelens</code>. The sidecar can filter noisy lines and route
            different log types to different destinations.
          </p>
        </ContentStep>
        <Example title="Logs Insights query for last night's run" caption="Assumes JSON log lines with level, run_date, and rows fields">
{`fields @timestamp, level, run_date, rows, message
| filter @logStream like /orders-export/
| filter level = "ERROR" or message like /rows_written/
| sort @timestamp desc
| limit 50`}
        </Example>
      </LessonSection>

      <LessonSection title="Why did my task stop?">
        <ContentStep number={1} title="describe-tasks stoppedReason">
          <p className="text-slate-300">
            <code className="text-core-400">aws ecs describe-tasks</code> returns{' '}
            <code className="text-core-400">stoppedReason</code>, <code className="text-core-400">stopCode</code>,
            and each container&apos;s <code className="text-core-400">exitCode</code> and reason. ECS keeps stopped
            tasks visible only briefly, so capture them with EventBridge (next section) rather than relying on the
            console the next morning.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely cause</th>
                <th className="px-4 py-3">First fix to try</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['OutOfMemoryError, exit code 137', 'Container exceeded task memory', 'Raise memory, process in chunks, check Container Insights peak'],
                ['CannotPullContainerError', 'Wrong tag, no ECR permission, or no network route', 'Verify tag exists, execution role, NAT or ECR and S3 endpoints'],
                ['ResourceInitializationError', 'Could not fetch secrets or registry auth', 'Execution role secret and KMS permissions, secretsmanager endpoint'],
                ['Essential container in task exited, exit 1', 'Your code raised an exception', 'Read the log stream for that task ID'],
                ['Task stuck in PROVISIONING', 'Subnet out of IPs or Fargate capacity', 'Larger subnets, more AZs, retry with backoff'],
                ['Exit code 0 but no output in S3', 'Code swallowed an error', 'Let exceptions fail the process; add row-count checks'],
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
        <ContentStep number={2} title="ECS Exec for live debugging">
          <p className="text-slate-300">
            For a long-running worker behaving oddly, <code className="text-core-400">aws ecs execute-command</code>{' '}
            opens a shell inside the running container. It rides on Systems Manager Session Manager — the same
            channel you used for EC2 in the Systems Manager sub-topic — so it needs{' '}
            <code className="text-core-400">enableExecuteCommand</code> on the task or service,{' '}
            <code className="text-core-400">ssmmessages</code> permissions on the task role, and an{' '}
            <code className="text-core-400">ssmmessages</code> VPC endpoint in private subnets. Sessions are
            logged and auditable in CloudTrail.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Alert on failures with EventBridge">
        <ContentStep number={1} title="ECS Task State Change events">
          <p className="text-slate-300">
            ECS emits an <code className="text-core-400">ECS Task State Change</code> event on every lifecycle
            transition. A rule matching <code className="text-core-400">lastStatus</code> STOPPED with a non-zero
            container exit code, sent to SNS <code className="text-core-400">de-alerts-prod</code>, catches every
            failed batch run whether it was started by Scheduler, Step Functions, or a human. Add a second rule on{' '}
            <code className="text-core-400">stopCode</code> TaskFailedToStart, since tasks that never start have
            no exit code.
          </p>
        </ContentStep>
        <Example title="EventBridge rule pattern" caption="Failed containers on de-etl-cluster-prod">
{`{
  "source": ["aws.ecs"],
  "detail-type": ["ECS Task State Change"],
  "detail": {
    "clusterArn": ["arn:aws:ecs:us-east-1:111122223333:cluster/de-etl-cluster-prod"],
    "lastStatus": ["STOPPED"],
    "containers": {
      "exitCode": [{ "anything-but": 0 }]
    }
  }
}`}
        </Example>
        <Flowchart
          title="ECS observability wiring"
          chart={`flowchart LR
  TASK[Fargate task orders-export]
  LOGS[CloudWatch Logs ecs orders-export]
  FL[FireLens Fluent Bit]
  S3[(S3 log archive)]
  CI[Container Insights metrics]
  EV[Task State Change event]
  RULE[EventBridge rule nonzero exit]
  SNS[SNS de-alerts-prod]
  TASK --> LOGS
  TASK --> FL
  FL --> S3
  TASK --> CI
  TASK --> EV
  EV --> RULE
  RULE --> SNS`}
        />
        <Callout variant="insight">
          Pair failure events with a freshness check: a CloudWatch alarm or small Lambda that verifies today&apos;s{' '}
          <code className="text-core-400">dt=</code> partition exists by 04:00. Events catch tasks that failed;
          freshness checks catch tasks that never started because a schedule was disabled.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'awslogs ships stdout to CloudWatch Logs; set retention and log structured JSON for Logs Insights.',
          'FireLens with Fluent Bit routes container logs to S3, OpenSearch, or third-party tools.',
          'Container Insights provides task and service CPU and memory; enhanced observability adds container detail.',
          'stoppedReason and exit codes explain failures: OOM 137, pull errors, secret init errors, app exceptions.',
          'EventBridge Task State Change rules to SNS alert on every non-zero exit; ECS Exec uses Session Manager.',
        ]}
      />
    </LessonArticle>
  )
}
