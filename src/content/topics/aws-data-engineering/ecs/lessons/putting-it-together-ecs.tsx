import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherEcs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="ECS for DE — and the end of the AWS Data Engineering track">
        You covered task definitions, ECR images, awsvpc networking, execution and task roles, batch ETL with
        Fargate, SQS queue workers with autoscaling, logging and Container Insights, deployments and CI/CD, cost
        and Fargate Spot, and how ECS compares with Lambda, Glue, EMR, and EKS. This checkpoint ties the ECS
        lessons together — and, because ECS is the <strong className="text-white">final sub-topic</strong>, it
        also assembles everything you learned across the track into one platform picture.
      </Callout>

      <Definition term="ECS mental model for data engineering">
        <p>
          Amazon ECS is the <strong className="text-white">container compute layer</strong> for work that outgrows
          Lambda but does not need Spark: a versioned task definition describes the container, ECR stores the
          SHA-tagged image, Fargate runs it in private subnets with a least-privilege task role and injected
          secrets, Scheduler or Step Functions launch batch tasks, services with backlog-based autoscaling run
          queue workers, and CloudWatch plus EventBridge tell you when a run fails.
        </p>
      </Definition>

      <LessonSection title="ECS sub-topic map">
        <Flowchart
          title="ECS lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[ECS complete path]
  START --> TD[Task definitions]
  START --> ECR[ECR and images]
  START --> NET[Networking and load balancing]
  START --> IAM[Task roles and secrets]
  START --> BATCH[Batch ETL with Fargate]
  START --> WORK[Queue workers and autoscaling]
  START --> OBS[Logging and Container Insights]
  START --> CICD[Deployments and CI CD]
  START --> COST[Cost and Fargate Spot]
  START --> CMP[ECS vs Lambda Glue EMR EKS]
  TD --> DONE
  ECR --> DONE
  NET --> DONE
  IAM --> DONE
  BATCH --> DONE
  WORK --> DONE
  OBS --> DONE
  CICD --> DONE
  COST --> DONE
  CMP --> DONE
  DONE[Track complete]`}
        />
      </LessonSection>

      <LessonSection title="Full ECS checkpoint — can you explain…">
        <ContentStep number={1} title="Task definitions and images">
          <p className="text-slate-300">
            Why pin <code className="text-core-400">orders-export:14</code> instead of the family name? How do
            containerOverrides pass a backfill date? Why immutable, SHA-tagged images and a lifecycle policy?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Networking">
          <p className="text-slate-300">
            Which VPC endpoints does a private Fargate task need to pull from ECR and write logs? Why reference a
            security group instead of IPs for RDS access? Why do awsvpc services need ip target groups?
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and secrets">
          <p className="text-slate-300">
            Execution role vs task role — which one fails with CannotPullContainerError, which with AccessDenied from
            boto3? How does valueFrom pull one JSON key? Why does a running service not see a rotated secret?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Batch and workers">
          <p className="text-slate-300">
            Scheduler vs Step Functions runTask.sync — what does each give you? How do exit codes and partition
            overwrites make reruns safe? How is backlog per task computed, and how do you scale from zero?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Operations">
          <p className="text-slate-300">
            Where do you look first for an OOM kill versus a secrets initialization error? How do you alert on
            every non-zero exit? What does the circuit breaker do, and how do batch jobs deploy differently?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Cost and fit">
          <p className="text-slate-300">
            When is Fargate Spot safe? Why can NAT gateways cost more than the tasks? When would you choose Glue,
            EMR, Batch, or EKS over ECS?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Task vs service?',
                  'Task: one-off run that exits, ideal for batch. Service: keeps desiredCount running, for workers and APIs.',
                ],
                [
                  'Execution role vs task role?',
                  'Execution: ECS agent pulls image, writes logs, fetches secrets. Task: your code calls S3, Glue, DynamoDB.',
                ],
                [
                  'Fargate vs EC2 launch type?',
                  'Fargate: no hosts, per-second per task. EC2: GPUs, special instances, dense packing, more ops.',
                ],
                [
                  'Why pin revisions?',
                  'Family name resolves to latest ACTIVE; pinning makes prod runs reproducible and rollback explicit.',
                ],
                [
                  'CannotPullContainerError?',
                  'Wrong tag, execution role missing ECR permissions, or no route: NAT or ecr.api, ecr.dkr, S3 endpoints.',
                ],
                [
                  'Secrets in ECS?',
                  'containerDefinitions.secrets valueFrom Secrets Manager or SSM ARN; injected at start; never plain env.',
                ],
                [
                  'Scheduler vs Step Functions?',
                  'Scheduler launches on cron; Step Functions runTask.sync waits, retries, catches, and chains steps.',
                ],
                [
                  'Safe reruns?',
                  'Non-zero exit on failure; overwrite the whole dt partition; idempotent consumers for SQS.',
                ],
                [
                  'Scale SQS workers on?',
                  'Backlog per task = visible messages ÷ running tasks, target = latency ÷ processing time.',
                ],
                [
                  'Graceful shutdown?',
                  'Handle SIGTERM, stop polling, finish within stopTimeout up to 120 s; unfinished messages reappear.',
                ],
                [
                  'Fargate Spot fit?',
                  'Up to about 70% off, 2-minute warning; for idempotent or checkpointed jobs, keep an on-demand base.',
                ],
                [
                  'ECS vs Glue?',
                  'ECS: any container, single node, custom deps. Glue: managed distributed Spark with the Data Catalog.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The whole AWS DE track in one picture">
        <p className="text-slate-300">
          Every sub-topic you studied has a place in one platform. Foundations secure and audit everything; data
          enters through several ingest paths, lands in an S3 lake, gets transformed by the right compute for each
          job, and is served to analysts — with orchestration, state, operations, secrets, and infrastructure as
          code holding it together.
        </p>
        <Flowchart
          title="AWS data platform assembled from the track"
          chart={`flowchart LR
  subgraph FOUND[Foundations]
    IAM[IAM roles]
    KMS[KMS keys]
    CT[CloudTrail audit]
    VPC[VPC and endpoints]
  end
  subgraph INGEST[Ingest]
    APIGW[API Gateway webhooks]
    S3EV[S3 event notifications]
    SQS[SQS buffers]
    EB[EventBridge rules and schedules]
  end
  subgraph LAKE[S3 lake acme-lake-prod]
    BR[(Bronze raw)]
    SI[(Silver clean)]
    GO[(Gold marts)]
  end
  subgraph COMPUTE[Compute]
    LAM[Lambda handlers]
    ECS[ECS Fargate jobs and workers]
    GLUE[Glue Spark and Catalog]
  end
  subgraph SERVE[Serving]
    ATH[Athena]
    RS[Redshift]
  end
  SFN[Step Functions orchestration]
  DDB[(DynamoDB state and watermarks)]
  SEC[Secrets Manager and Parameter Store]
  OPS[CloudWatch SNS Systems Manager]
  CFN[CloudFormation IaC]
  APIGW --> SQS
  S3EV --> SQS
  EB --> SFN
  SQS --> ECS
  SQS --> LAM
  LAM --> BR
  ECS --> BR
  SFN --> ECS
  SFN --> GLUE
  BR --> GLUE
  GLUE --> SI
  SI --> GLUE
  GLUE --> GO
  GO --> ATH
  GO --> RS
  LAM --> DDB
  ECS --> DDB
  SEC --> ECS
  SEC --> GLUE
  OPS --> SFN
  CFN --> COMPUTE
  FOUND --> LAKE`}
        />
        <Callout variant="insight">
          If you can walk someone through this diagram — why each arrow exists, what fails if a box is removed, and
          which alarm fires when it does — you understand AWS data engineering at the level most interviews probe.
        </Callout>
      </LessonSection>

      <LessonSection title="Build your own capstone">
        <ContentStep number={1} title="Pick two ingest paths">
          <p className="text-slate-300">
            A real-time path and a batch path: for example, an API Gateway webhook receiving order events into SQS,
            plus a nightly vendor CSV feed pulled by an ECS task on an EventBridge schedule. Both land in bronze in
            your own <code className="text-core-400">acme-lake-dev</code>-style bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transform and serve">
          <p className="text-slate-300">
            A Step Functions workflow runs Glue to build silver and gold Parquet partitions, updates a DynamoDB
            watermark, and loads a Redshift Serverless table or registers Athena views. Make every stage idempotent
            and prove it by rerunning a date.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Secure and operate it">
          <p className="text-slate-300">
            Least-privilege roles per job, a KMS key for the lake, secrets in Secrets Manager, CloudTrail on, a
            CloudWatch dashboard, and alarms to an SNS topic for failed runs, DLQ depth, and a missing-partition
            freshness check.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Ship it as code with a README">
          <p className="text-slate-300">
            Everything in CloudFormation or CDK, deployed from GitHub Actions with OIDC. The README has an
            architecture diagram, a cost estimate, the failure modes you tested, and what you would change at 100x
            scale. Tear it down when finished — and note the teardown steps too.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Turn it into interview material">
          <p className="text-slate-300">
            Prepare a two-minute walkthrough of the diagram, one story about a bug you hit and how logs or CloudTrail
            revealed it, and one trade-off you made (for example, ECS over Lambda for the vendor feed because of
            runtime). Practice the quick-check tables from every sub-topic out loud.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Ready for interviews when…">
          You can sketch the platform above from memory, justify each compute choice by workload shape, explain how
          a rerun stays idempotent end to end, and describe how you would detect and debug a failed nightly load —
          all without opening the docs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ECS: container compute for jobs beyond Lambda limits that do not need Spark — task definitions, ECR, Fargate.',
          'Intermediate: pinned revisions, SHA-tagged images, private networking with endpoints, execution vs task roles.',
          'Advanced: Scheduler and Step Functions batch runs, backlog-scaled SQS workers, alerts, CI/CD, Spot and cost.',
          'The track assembles into one platform: secure foundations, ingest, S3 lake, right-sized compute, serving, ops.',
          'Consolidate it with a self-built capstone in IaC with alarms and a README diagram — your best interview asset.',
        ]}
      />
    </LessonArticle>
  )
}
