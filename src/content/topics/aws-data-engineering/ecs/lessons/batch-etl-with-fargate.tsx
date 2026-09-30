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

export function BatchEtlWithFargate() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A container that starts, does one day of work, and exits">
        The most common ECS pattern in data engineering is not a web service — it is a{' '}
        <strong className="text-white">batch task</strong>. Every night at 02:00,{' '}
        <code className="text-core-400">orders-export</code> starts on Fargate, reads yesterday&apos;s orders,
        writes Parquet to <code className="text-core-400">acme-lake-prod</code>, and stops. You pay only for those
        minutes. This lesson covers the two ways to trigger it — a schedule or a state machine — and how to make
        it safe to rerun.
      </Callout>

      <Definition term="Batch ETL task">
        <p>
          A one-off ECS task launched with <code className="text-core-400">RunTask</code> (no service keeping it
          alive) that processes a bounded slice of data — usually one date partition — and exits. Exit code 0
          means success; any non-zero exit code means failure. Unlike Lambda there is no 15-minute ceiling, and
          unlike Glue you choose any language, library, or binary in the image.
        </p>
      </Definition>

      <LessonSection title="Option 1 — EventBridge Scheduler">
        <ContentStep number={1} title="Cron with a timezone">
          <p className="text-slate-300">
            EventBridge Scheduler supports cron expressions with an IANA timezone, so &quot;02:00 in New York&quot;
            stays at 02:00 across daylight saving changes. The target is the ECS RunTask templated target: cluster
            ARN, task definition revision, Fargate launch type, and network configuration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Container overrides and run dates">
          <p className="text-slate-300">
            The schedule&apos;s input becomes the RunTask overrides. A simple convention: the schedule passes{' '}
            <code className="text-core-400">RUN_DATE=auto</code> and the code computes &quot;yesterday&quot; in the
            business timezone. For backfills, a human or pipeline calls RunTask with an explicit date. The scheduler
            role needs <code className="text-core-400">ecs:RunTask</code> plus{' '}
            <code className="text-core-400">iam:PassRole</code> on both task roles.
          </p>
        </ContentStep>
        <Example title="Nightly schedule for orders-export" caption="EventBridge Scheduler CLI — target.json holds the ECS parameters">
{`aws scheduler create-schedule \\
  --name orders-export-nightly \\
  --schedule-expression "cron(0 2 * * ? *)" \\
  --schedule-expression-timezone "America/New_York" \\
  --flexible-time-window Mode=OFF \\
  --target file://target.json

# target.json
{
  "Arn": "arn:aws:ecs:us-east-1:111122223333:cluster/de-etl-cluster-prod",
  "RoleArn": "arn:aws:iam::111122223333:role/scheduler-run-ecs-de",
  "EcsParameters": {
    "TaskDefinitionArn": "arn:aws:ecs:us-east-1:111122223333:task-definition/orders-export:14",
    "LaunchType": "FARGATE",
    "NetworkConfiguration": {
      "awsvpcConfiguration": {
        "Subnets": ["subnet-0priv1a", "subnet-0priv1b"],
        "SecurityGroups": ["sg-orders-export"],
        "AssignPublicIp": "DISABLED"
      }
    }
  },
  "Input": "{\\"containerOverrides\\":[{\\"name\\":\\"orders-export\\",\\"environment\\":[{\\"name\\":\\"RUN_DATE\\",\\"value\\":\\"auto\\"}]}]}",
  "RetryPolicy": { "MaximumRetryAttempts": 2 }
}`}
        </Example>
        <Callout variant="info">
          Scheduler retries only the <em>launch</em> (for example, capacity errors). It does not watch the task to
          completion or rerun it after a non-zero exit. When you need wait-for-completion, retries of the job
          itself, and downstream steps, move to Step Functions.
        </Callout>
      </LessonSection>

      <LessonSection title="Option 2 — Step Functions with runTask.sync">
        <ContentStep number={1} title="Wait for the task, then react">
          <p className="text-slate-300">
            The <code className="text-core-400">arn:aws:states:::ecs:runTask.sync</code> integration starts the
            task and waits until it stops. When an essential container exits non-zero, the state fails with{' '}
            <code className="text-core-400">States.TaskFailed</code> and the error cause includes the task
            description with the exit code — verify this behavior in your own account with a deliberately failing
            run. <code className="text-core-400">Retry</code> reruns transient failures;{' '}
            <code className="text-core-400">Catch</code> routes the rest to an SNS alert on{' '}
            <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fan out across partitions with Map">
          <p className="text-slate-300">
            A backfill of 30 days becomes a <code className="text-core-400">Map</code> state over a list of dates,
            each iteration running one Fargate task with its own <code className="text-core-400">RUN_DATE</code>.{' '}
            <code className="text-core-400">MaxConcurrency</code> caps parallelism so you do not exhaust RDS
            connections, Fargate quotas, or subnet IP addresses.
          </p>
        </ContentStep>
        <Example title="Backfill state machine" caption="Map over dates, runTask.sync, Retry and Catch — JSONPath ASL">
{`{
  "StartAt": "BackfillDates",
  "States": {
    "BackfillDates": {
      "Type": "Map",
      "ItemsPath": "$.dates",
      "MaxConcurrency": 5,
      "ItemSelector": { "run_date.$": "$$.Map.Item.Value" },
      "ItemProcessor": {
        "StartAt": "RunOrdersExport",
        "States": {
          "RunOrdersExport": {
            "Type": "Task",
            "Resource": "arn:aws:states:::ecs:runTask.sync",
            "Parameters": {
              "Cluster": "de-etl-cluster-prod",
              "TaskDefinition": "orders-export:14",
              "LaunchType": "FARGATE",
              "NetworkConfiguration": {
                "AwsvpcConfiguration": {
                  "Subnets": ["subnet-0priv1a", "subnet-0priv1b"],
                  "SecurityGroups": ["sg-orders-export"],
                  "AssignPublicIp": "DISABLED"
                }
              },
              "Overrides": {
                "ContainerOverrides": [{
                  "Name": "orders-export",
                  "Environment": [{ "Name": "RUN_DATE", "Value.$": "$.run_date" }]
                }]
              }
            },
            "Retry": [{
              "ErrorEquals": ["States.TaskFailed"],
              "IntervalSeconds": 60, "MaxAttempts": 2, "BackoffRate": 2
            }],
            "End": true
          }
        }
      },
      "Catch": [{ "ErrorEquals": ["States.ALL"], "Next": "NotifyFailure" }],
      "Next": "Done"
    },
    "NotifyFailure": {
      "Type": "Task",
      "Resource": "arn:aws:states:::sns:publish",
      "Parameters": {
        "TopicArn": "arn:aws:sns:us-east-1:111122223333:de-alerts-prod",
        "Message.$": "States.JsonToString($)"
      },
      "Next": "Failed"
    },
    "Failed": { "Type": "Fail" },
    "Done": { "Type": "Succeed" }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Make every run safe to repeat">
        <ContentStep number={1} title="Exit codes are your contract">
          <p className="text-slate-300">
            Let unhandled exceptions crash the process — Python exits with code 1. Do not wrap everything in a
            try block that logs and exits 0; the orchestrator would record a green run over missing data. Some
            teams reserve distinct exit codes for &quot;bad input, do not retry&quot; versus transient errors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Overwrite the partition, never append">
          <p className="text-slate-300">
            Retries and backfills mean the same date runs more than once. Write to a staging prefix, then replace{' '}
            <code className="text-core-400">s3://acme-lake-prod/silver/orders/dt=2026-09-29/</code> as a whole, or
            use a table format such as Iceberg with an overwrite. Appending creates duplicates on every retry.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When AWS Batch fits better">
          <p className="text-slate-300">
            If you have hundreds or thousands of queued jobs with priorities, dependencies, and array jobs,{' '}
            <strong className="text-white">AWS Batch</strong> adds job queues and scheduling on top of Fargate or
            EC2 capacity. For a handful of nightly jobs orchestrated by Step Functions, plain ECS RunTask is
            simpler.
          </p>
        </ContentStep>
        <Flowchart
          title="Nightly and backfill paths"
          chart={`flowchart TB
  SCHED[EventBridge Scheduler 02 00 NY]
  SFN[Step Functions backfill]
  MAP[Map over dates max 5]
  RUN[ECS RunTask orders-export 14]
  TASK[Fargate task]
  EXIT{Exit code zero}
  S3[(S3 silver orders dt partition)]
  ALERT[SNS de-alerts-prod]
  SCHED --> RUN
  SFN --> MAP
  MAP --> RUN
  RUN --> TASK
  TASK --> EXIT
  EXIT -->|yes| S3
  EXIT -->|no| ALERT`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Batch ETL on ECS is a RunTask that processes one bounded partition and exits — no service required.',
          'EventBridge Scheduler gives timezone-aware cron and container overrides but does not track completion.',
          'Step Functions runTask.sync waits for the task, enabling Retry, Catch, SNS alerts, and downstream steps.',
          'Map with MaxConcurrency fans out backfills without overwhelming databases, quotas, or subnet IPs.',
          'Exit codes signal success or failure; overwrite whole partitions so retries never duplicate data.',
        ]}
      />
    </LessonArticle>
  )
}
