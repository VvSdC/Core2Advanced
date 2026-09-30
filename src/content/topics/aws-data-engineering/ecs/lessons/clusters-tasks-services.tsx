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

export function ClustersTasksServices() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Four nouns explain almost all of ECS">
        Every ECS setup — a nightly export or a fleet of queue workers — is built from the same four pieces:{' '}
        <strong className="text-white">cluster, task definition, task, and service</strong>. Get these right
        and the console, CLI, and CloudFormation templates suddenly read like plain English.
      </Callout>

      <Definition term="Task vs service">
        <p>
          A <strong className="text-white">task</strong> is one running copy of a task definition — it starts,
          runs its container, and stops. A <strong className="text-white">service</strong> is a long-running
          controller that keeps a desired number of tasks running, replacing any that stop or fail health
          checks. Batch ETL uses tasks; always-on workers and APIs use services.
        </p>
      </Definition>

      <LessonSection title="The four building blocks">
        <ContentStep number={1} title="Cluster — a logical grouping">
          <p className="text-slate-300">
            A cluster is a namespace for tasks and services, not a pile of servers you must size. With
            Fargate, an empty cluster costs nothing. Many teams use one per environment, such as{' '}
            <code className="text-core-400">de-etl-cluster-dev</code> and{' '}
            <code className="text-core-400">de-etl-cluster-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Task definition — the blueprint">
          <p className="text-slate-300">
            A versioned JSON document naming the image, CPU and memory, environment variables, IAM roles, and
            log settings. Each change creates a new revision like{' '}
            <code className="text-core-400">orders-export-task:7</code>. Deep dive in the next module.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Task — a running instance">
          <p className="text-slate-300">
            For batch ETL the task runs to completion: extract, transform, write to S3, exit. Exit code{' '}
            <code className="text-core-400">0</code> means success; anything else means failure — the signal
            Step Functions and CloudWatch alarms use.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Service — keeps N tasks running">
          <p className="text-slate-300">
            A service with desired count 3 always tries to have three healthy tasks. If one crashes, ECS
            starts a replacement. Services can register tasks with a load balancer and scale on metrics like
            SQS queue depth.
          </p>
        </ContentStep>
        <Flowchart
          title="How the pieces relate"
          chart={`flowchart TD
  CL[Cluster de-etl-cluster-prod]
  TD[Task definition orders-export-task rev 7]
  TD --> RT[RunTask standalone]
  TD --> SVC[Service desired count 3]
  RT --> T1[Task runs then exits]
  SVC --> T2[Task]
  SVC --> T3[Task]
  SVC --> T4[Task]
  CL --- RT
  CL --- SVC`}
        />
      </LessonSection>

      <LessonSection title="Standalone RunTask vs service — DE examples">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Workload</th>
                <th className="px-4 py-3">Use</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Nightly RDS to S3 export', 'Standalone task', 'Runs once per schedule and exits with a status'],
                ['dbt run after Glue finishes', 'Standalone task', 'Step Functions starts it and waits for the exit code'],
                ['One-off backfill for 90 days', 'Standalone tasks', 'Launch one task per day partition in parallel'],
                ['SQS queue worker', 'Service', 'Must poll continuously and scale with backlog'],
                ['Internal data API behind ALB', 'Service', 'Needs steady healthy targets for the load balancer'],
                ['Kafka Connect or Debezium', 'Service', 'Long-running connector that must restart on failure'],
              ].map(([workload, use, why]) => (
                <tr key={workload} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{workload}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Rule of thumb: if the job has a natural &quot;done&quot;, it is a task. If &quot;done&quot; means
          something went wrong, it is a service.
        </Callout>
      </LessonSection>

      <LessonSection title="Running a task from the CLI">
        <p className="text-slate-300">
          On Fargate every task gets its own network interface, so <code className="text-core-400">run-task</code>{' '}
          needs subnets and security groups. Private subnets are the norm for DE jobs; they reach S3 and ECR
          through a NAT gateway or VPC endpoints.
        </p>
        <Example title="aws ecs run-task on Fargate" caption="Override an environment variable for a specific run date">
{`aws ecs run-task \\
  --cluster de-etl-cluster-prod \\
  --launch-type FARGATE \\
  --task-definition orders-export-task:7 \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0abc1111,subnet-0abc2222],securityGroups=[sg-0abc3333],assignPublicIp=DISABLED}" \\
  --overrides '{
    "containerOverrides": [
      {
        "name": "orders-export",
        "environment": [{ "name": "RUN_DATE", "value": "2026-09-29" }]
      }
    ]
  }'`}
        </Example>
        <Example title="Creating a service" caption="Two always-on queue workers">
{`aws ecs create-service \\
  --cluster de-etl-cluster-prod \\
  --service-name orders-queue-worker \\
  --task-definition orders-worker-task:3 \\
  --desired-count 2 \\
  --launch-type FARGATE \\
  --network-configuration "awsvpcConfiguration={subnets=[subnet-0abc1111],securityGroups=[sg-0abc3333]}"`}
        </Example>
        <Callout variant="tip" title="Pin revisions in production">
          Reference <code className="text-core-400">orders-export-task:7</code> rather than the bare family
          name in schedulers and Step Functions, so a new revision never slips into prod unreviewed.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cluster = logical grouping; task definition = versioned blueprint; task = running copy; service = keeps N tasks alive.',
          'Batch ETL runs as standalone tasks that exit — exit code 0 is success, anything else is failure.',
          'Queue workers, connectors, and internal APIs run as services that ECS restarts and can scale.',
          'Fargate RunTask needs a network configuration: private subnets, security groups, usually no public IP.',
          'Pin task definition revisions in schedulers and orchestrators for predictable production runs.',
        ]}
      />
    </LessonArticle>
  )
}
