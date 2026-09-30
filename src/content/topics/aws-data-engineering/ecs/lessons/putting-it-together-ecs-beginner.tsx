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

export function PuttingItTogetherEcsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before task definitions and ECR">
        You now know why containers exist, how images and Dockerfiles work, what ECS orchestrates, how
        clusters, tasks, and services relate, when Fargate beats EC2, and which DE jobs belong on ECS. This
        lesson ties those threads into a{' '}
        <strong className="text-white">beginner ECS checklist</strong> — the mental model you need before
        task definitions, ECR, networking, and IAM task roles in the next module.
      </Callout>

      <Definition term="Beginner ECS mental model">
        <p>
          A <strong className="text-white">beginner ECS mental model</strong> for DE includes: jobs packaged
          as images tagged with a git SHA and stored in ECR, one cluster per environment, a task definition
          sizing CPU and memory, standalone tasks for batch ETL and services for always-on workers, Fargate as
          the default capacity in private subnets, a scheduler or Step Functions calling RunTask, logs in
          CloudWatch, exit codes alarmed, and no secrets baked into images.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Image in ECR — built from a Dockerfile">
          <p className="text-slate-300">
            Code plus dependencies in one image, tagged like{' '}
            <code className="text-core-400">vendor-export:3f9c2ab</code>, pushed to a private ECR repository.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cluster per environment">
          <p className="text-slate-300">
            <code className="text-core-400">de-etl-cluster-prod</code> separate from dev — a logical grouping,
            not servers to size when using Fargate.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Task definition — the blueprint">
          <p className="text-slate-300">
            Image URI, CPU and memory, environment variables, task role, execution role, and CloudWatch
            logging — revisioned and pinned in schedulers.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Task or service — chosen on purpose">
          <p className="text-slate-300">
            Batch job with a natural end → standalone task. Queue worker or connector → service with a
            desired count.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Trigger, outputs, and observability">
          <p className="text-slate-300">
            EventBridge Scheduler or Step Functions starts the task; output goes to S3; logs stream to
            CloudWatch; a non-zero exit code raises an alarm.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE ECS stack"
          chart={`flowchart TD
  GIT[Git repo and Dockerfile] --> ECR[ECR repository]
  SCH[EventBridge Scheduler] --> RUN[RunTask on Fargate]
  ECR --> RUN
  RUN --> TASK[Task in de-etl-cluster-prod]
  TASK --> SRC[Source DB or vendor]
  TASK --> S3[S3 bronze]
  TASK --> CW[CloudWatch Logs]
  TASK --> EVT[Task state change event]
  EVT --> ALARM[Alert on non-zero exit]`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is ECS in one sentence?">
          <p className="text-slate-300">
            AWS&apos;s managed container orchestrator — it places, runs, restarts, and scales containers on
            Fargate or EC2 capacity.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Image vs container">
          <p className="text-slate-300">
            Image = read-only package built from a Dockerfile; container = one running copy of that image.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Task definition vs task vs service">
          <p className="text-slate-300">
            Blueprint vs one running copy vs a controller that keeps N copies healthy.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Why ECS instead of Lambda for some jobs?">
          <p className="text-slate-300">
            Lambda stops at 15 minutes and about 10 GB of memory; ECS tasks run as long as needed with any
            runtime or binary you install.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Fargate vs EC2 capacity">
          <p className="text-slate-300">
            Fargate = no hosts, per-task billing and isolation; EC2 = you manage instances for GPUs, huge
            sizes, daemons, or dense steady fleets.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Top DE use cases">
          <p className="text-slate-300">
            Long Python jobs, vendor CLIs and JDBC drivers, dbt runs, DB exports, SQS workers, CDC connectors
            — not big Spark, tiny event handlers, or ad-hoc SQL.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when a nightly task fails?">
          <p className="text-slate-300">
            Read the stopped task&apos;s <code className="text-core-400">stoppedReason</code> and{' '}
            <code className="text-core-400">exitCode</code>, then its CloudWatch log stream — image pull error,
            out of memory, or application exception.
          </p>
        </ContentStep>
        <Example title="Beginner ECS concept drill" caption="No console required yet — explain aloud">
{`1. Draw: Dockerfile → ECR → Scheduler → RunTask on Fargate → S3 + CloudWatch
2. Why tag images with a git SHA instead of latest?
3. Name one DE job that should be a task and one that should be a service
4. What does exit code 0 mean to Step Functions or an alarm?
5. Why must a Fargate RunTask include subnets and security groups?
6. When would you choose EC2 capacity over Fargate?
7. Why never put a database password inside an image?`}
        </Example>
        <Callout variant="insight">
          Strong ECS beginners ask three questions before containerizing: does it outgrow Lambda, does it
          need a custom environment, and does it have a natural end — the last answer decides task vs
          service.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme&apos;s vendor publishes a nightly file on SFTP that must be pulled with the vendor&apos;s Java
          CLI, decrypted, and converted — about 40 minutes of work, too long for Lambda. The team writes a
          Dockerfile on a Java base image, builds{' '}
          <code className="text-core-400">vendor-export:3f9c2ab</code>, and pushes it to ECR. Task definition{' '}
          <code className="text-core-400">vendor-export-task</code> requests 2 vCPU and 8 GB on Fargate in
          cluster <code className="text-core-400">de-etl-cluster-prod</code>, private subnets only. EventBridge
          Scheduler calls RunTask at 02:00 every night. The container writes to{' '}
          <code className="text-core-400">s3://acme-lake-prod/bronze/vendor/</code>, logs to CloudWatch, and
          exits 0. One night the vendor rotates a certificate: the task exits 1, an EventBridge rule on ECS
          task state change publishes to SNS, and on-call reads the log stream before the morning dashboards
          refresh.
        </p>
        <ContentStep number={1} title="Packaging tier — Dockerfile and ECR">
          <p className="text-slate-300">Java CLI and code in one image, tagged by commit, stored privately.</p>
        </ContentStep>
        <ContentStep number={2} title="Trigger tier — EventBridge Scheduler">
          <p className="text-slate-300">Cron at 02:00 calls RunTask with a pinned task definition revision.</p>
        </ContentStep>
        <ContentStep number={3} title="Compute tier — ECS on Fargate">
          <p className="text-slate-300">2 vCPU / 8 GB task runs 40 minutes, then stops — pay only for that.</p>
        </ContentStep>
        <ContentStep number={4} title="Data and ops tier — S3 and CloudWatch">
          <p className="text-slate-300">Bronze files in S3; logs and exit-code alerts for on-call.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate ECS lessons go hands-on with what this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Task definitions">
          <p className="text-slate-300">
            CPU and memory combinations, container definitions, environment variables, log configuration,
            and revisions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ECR and images">
          <p className="text-slate-300">
            Pushing and tagging, image scanning, and lifecycle policies that clean up old pipeline images.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Networking and IAM task roles">
          <p className="text-slate-300">
            awsvpc mode, private subnets and VPC endpoints, load balancers for services — then task role vs
            execution role and injecting Secrets Manager values at runtime.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Before your first prod ECS job">
          Run the image locally with production-like env vars and a memory limit such as{' '}
          <code className="text-core-400">docker run --memory 8g</code> — out-of-memory surprises are far
          cheaper on a laptop than at 02:00.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: image in ECR tagged by git SHA, cluster per environment, task definition blueprint, Fargate by default, no secrets in images.',
          'Self-check: ECS definition, image vs container, task definition vs task vs service, Lambda limits, Fargate vs EC2, DE use cases, debug order.',
          'End-to-end: Dockerfile → ECR → EventBridge Scheduler → RunTask on Fargate → S3 bronze, CloudWatch logs, exit-code alerts.',
          'Next in the ECS track: task definitions, ECR, networking, and IAM task roles and secrets.',
        ]}
      />
    </LessonArticle>
  )
}
