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

export function TaskDefinitions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The recipe card ECS follows every time it starts your job">
        A Docker image says <em>what</em> code to run. A <strong className="text-white">task definition</strong>{' '}
        says <em>how</em> to run it on AWS: how much CPU and memory, which image tag, which command, which
        environment variables and secrets, where logs go, and which IAM roles to use. Every nightly{' '}
        <code className="text-core-400">orders-export</code> run on{' '}
        <code className="text-core-400">de-etl-cluster-prod</code> starts from one of these JSON documents.
      </Callout>

      <Definition term="Task definition">
        <p>
          A versioned JSON blueprint registered with ECS that describes one or more containers that run together
          as a <strong className="text-white">task</strong>. It is identified by a{' '}
          <strong className="text-white">family</strong> name plus an immutable revision number — for example{' '}
          <code className="text-core-400">orders-export:14</code>. You never edit a revision; you register a new
          one, and tasks, services, schedules, and Step Functions states point at the revision they should use.
        </p>
      </Definition>

      <LessonSection title="Anatomy of a Fargate task definition">
        <ContentStep number={1} title="Task-level settings">
          <p className="text-slate-300">
            <code className="text-core-400">family</code> names the job.{' '}
            <code className="text-core-400">requiresCompatibilities</code> set to{' '}
            <code className="text-core-400">FARGATE</code> tells ECS to validate against Fargate rules, which
            require <code className="text-core-400">networkMode</code> <code className="text-core-400">awsvpc</code>{' '}
            — every task gets its own network interface. <code className="text-core-400">executionRoleArn</code>{' '}
            and <code className="text-core-400">taskRoleArn</code> attach the two IAM roles covered in the IAM
            lesson.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CPU and memory must be a valid Fargate pair">
          <p className="text-slate-300">
            On Fargate you size the whole task, and only certain combinations are accepted. Asking for 1 vCPU with
            16 GB fails registration. Pick the smallest pair that fits your peak pandas or Polars memory plus
            headroom — Container Insights later tells you whether you guessed right.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">cpu units</th>
                <th className="px-4 py-3">vCPU</th>
                <th className="px-4 py-3">Allowed memory</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['256', '0.25', '512 MB, 1 GB, 2 GB'],
                ['512', '0.5', '1 GB to 4 GB in 1 GB steps'],
                ['1024', '1', '2 GB to 8 GB in 1 GB steps'],
                ['2048', '2', '4 GB to 16 GB in 1 GB steps'],
                ['4096', '4', '8 GB to 30 GB in 1 GB steps'],
                ['8192', '8', '16 GB to 60 GB in 4 GB steps'],
                ['16384', '16', '32 GB to 120 GB in 8 GB steps'],
              ].map(([units, vcpu, mem]) => (
                <tr key={units} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{units}</td>
                  <td className="px-4 py-3">{vcpu}</td>
                  <td className="px-4 py-3">{mem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={3} title="Storage and CPU architecture">
          <p className="text-slate-300">
            Fargate tasks get 20 GiB of ephemeral disk by default; raise it with{' '}
            <code className="text-core-400">ephemeralStorage.sizeInGiB</code> (up to 200 GiB) when a job
            downloads a large vendor file before converting it to Parquet.{' '}
            <code className="text-core-400">runtimePlatform</code> with{' '}
            <code className="text-core-400">cpuArchitecture</code> <code className="text-core-400">ARM64</code>{' '}
            runs on Graviton, which is usually cheaper — but the image must be built for arm64.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Container definitions — the part you edit most">
        <ContentStep number={1} title="Image, command, environment">
          <p className="text-slate-300">
            <code className="text-core-400">image</code> should reference an ECR tag you control (a git SHA, not{' '}
            <code className="text-core-400">latest</code>). <code className="text-core-400">command</code>{' '}
            overrides the Dockerfile CMD. <code className="text-core-400">environment</code> holds non-sensitive
            config like bucket names; <code className="text-core-400">secrets</code> pulls passwords from Secrets
            Manager or Parameter Store at start time.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logs, essential flag, ports, health checks">
          <p className="text-slate-300">
            <code className="text-core-400">logConfiguration</code> with the{' '}
            <code className="text-core-400">awslogs</code> driver ships stdout to CloudWatch Logs.{' '}
            <code className="text-core-400">essential: true</code> means that if this container exits, the whole
            task stops — the batch job container is always essential; a log-router sidecar might not be.{' '}
            <code className="text-core-400">portMappings</code> and{' '}
            <code className="text-core-400">healthCheck</code> matter for services behind a load balancer, rarely
            for batch jobs.
          </p>
        </ContentStep>
        <Example title="orders-export task definition" caption="Fargate, ARM64, 1 vCPU / 4 GB, secrets injected, logs to CloudWatch">
{`{
  "family": "orders-export",
  "requiresCompatibilities": ["FARGATE"],
  "networkMode": "awsvpc",
  "cpu": "1024",
  "memory": "4096",
  "runtimePlatform": { "cpuArchitecture": "ARM64", "operatingSystemFamily": "LINUX" },
  "ephemeralStorage": { "sizeInGiB": 50 },
  "executionRoleArn": "arn:aws:iam::111122223333:role/ecsTaskExecutionRole-de",
  "taskRoleArn": "arn:aws:iam::111122223333:role/orders-export-task-role",
  "containerDefinitions": [
    {
      "name": "orders-export",
      "image": "111122223333.dkr.ecr.us-east-1.amazonaws.com/de/orders-export:3f9c2ab",
      "essential": true,
      "command": ["python", "-m", "orders_export.main"],
      "environment": [
        { "name": "LAKE_BUCKET", "value": "acme-lake-prod" },
        { "name": "RUN_DATE", "value": "auto" }
      ],
      "secrets": [
        {
          "name": "DB_PASSWORD",
          "valueFrom": "arn:aws:secretsmanager:us-east-1:111122223333:secret:de/orders-db-AbCdEf:password::"
        }
      ],
      "logConfiguration": {
        "logDriver": "awslogs",
        "options": {
          "awslogs-group": "/ecs/orders-export",
          "awslogs-region": "us-east-1",
          "awslogs-stream-prefix": "orders-export"
        }
      }
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Revisions, pinning, and per-run overrides">
        <ContentStep number={1} title="Register and pin">
          <p className="text-slate-300">
            <code className="text-core-400">aws ecs register-task-definition</code> returns a new revision each
            call. Referencing <code className="text-core-400">orders-export</code> without a number resolves to the
            latest ACTIVE revision — convenient in dev, risky in prod. Pin{' '}
            <code className="text-core-400">orders-export:14</code> in schedules and state machines so a teammate
            registering revision 15 does not silently change tonight&apos;s run.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Overrides at RunTask">
          <p className="text-slate-300">
            One task definition serves every date. At launch, pass{' '}
            <code className="text-core-400">overrides.containerOverrides</code> to change the command or
            environment for that run only — a backfill for{' '}
            <code className="text-core-400">RUN_DATE=2026-09-01</code> uses the same revision as the nightly job.
            You can also override task CPU and memory for a one-off heavy backfill.
          </p>
        </ContentStep>
        <Example title="Register, then run a backfill with an override" caption="Shell">
{`aws ecs register-task-definition --cli-input-json file://orders-export.json

aws ecs run-task \\
  --cluster de-etl-cluster-prod \\
  --launch-type FARGATE \\
  --task-definition orders-export:14 \\
  --network-configuration 'awsvpcConfiguration={subnets=[subnet-0a1b,subnet-0c2d],securityGroups=[sg-0etl],assignPublicIp=DISABLED}' \\
  --overrides '{"containerOverrides":[{"name":"orders-export","environment":[{"name":"RUN_DATE","value":"2026-09-01"}]}]}'`}
        </Example>
        <Flowchart
          title="From JSON to a running task"
          chart={`flowchart LR
  JSON[Task definition JSON]
  REG[register-task-definition]
  REV[Revision orders-export 14]
  RUN[RunTask with overrides]
  TASK[Fargate task running]
  JSON --> REG
  REG --> REV
  REV --> RUN
  RUN --> TASK
  REV -->|pinned by| SCHED[Schedules and state machines]`}
        />
        <Callout variant="tip">
          Keep the task definition JSON in the same Git repo as the job code and render the image tag in CI. The
          revision history then maps one-to-one to commits, which makes rollback a one-line change.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A task definition is a versioned blueprint: family plus immutable revision, such as orders-export:14.',
          'Fargate requires awsvpc networking and a valid task-level cpu and memory pair.',
          'containerDefinitions hold image, command, environment, secrets, awslogs config, and the essential flag.',
          'Pin revisions in prod schedules and state machines; register a new revision for every change.',
          'Use containerOverrides at RunTask to pass per-run values like RUN_DATE instead of cloning definitions.',
        ]}
      />
    </LessonArticle>
  )
}
