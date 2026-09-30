import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithEcs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why ECS after API Gateway — the last piece of compute">
        API Gateway taught you how to put a managed front door on Lambda and internal services. Along the
        way you have run code on Lambda, Glue, and EC2. But every data platform eventually hits a job that{' '}
        <strong className="text-white">does not fit any of them cleanly</strong>: a vendor export that needs a
        Java CLI and runs for 40 minutes, a dbt project with pinned dependencies, or a worker that must poll
        an SQS queue all day. The answer on AWS is usually{' '}
        <strong className="text-white">Amazon ECS</strong> — run your code in a container, and let AWS start,
        stop, and restart it for you. ECS is the final sub-topic of this track.
      </Callout>

      <Definition term="What is ECS in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon Elastic Container Service (ECS)</strong> is AWS&apos;s managed
          container orchestrator. You package a job — code, libraries, drivers, binaries — into a container
          image, store it in Amazon ECR, and ask ECS to run it on serverless{' '}
          <strong className="text-white">Fargate</strong> capacity or on EC2 instances you manage.
        </p>
        <p className="mt-2 text-slate-300">
          Think of ECS as{' '}
          <span className="text-core-400">the &quot;run anything, for as long as it needs&quot; compute layer
          of your data platform — the place jobs go when Lambda is too small and Glue is the wrong shape</span>.
        </p>
      </Definition>

      <LessonSection title="Where Lambda and Glue stop fitting">
        <ContentStep number={1} title="Lambda limits — time, memory, packaging">
          <p className="text-slate-300">
            Lambda caps a single invocation at <strong className="text-white">15 minutes</strong> and about{' '}
            <strong className="text-white">10 GB</strong> of memory, and zip deployments have tight size limits.
            A pandas job that needs 45 minutes, or a large JDBC export, simply cannot finish there.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue is Spark-shaped">
          <p className="text-slate-300">
            Glue shines for distributed Spark transforms over the lake. It is awkward for a single-process
            Java tool, a vendor&apos;s command-line binary, or a dbt run that just sends SQL to Redshift.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Custom dependencies and always-on workers">
          <p className="text-slate-300">
            Some jobs need ODBC drivers, a specific Python build, a Debezium connector, or a process that
            listens on a queue 24/7. Containers let you bundle exactly what the job needs and run it on your
            schedule — or forever.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: Lambda for short event handlers, Glue for distributed Spark, ECS on Fargate for
          &quot;everything else&quot; — long single-node jobs, custom runtimes, and long-running workers.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We assume no prior Docker knowledge. The beginner pass builds the mental model in this order:
        </p>
        <ContentStep number={1} title="Containers and Docker basics">
          <p className="text-slate-300">
            Images, containers, Dockerfiles, and registries — the packaging format ECS runs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ECS core model">
          <p className="text-slate-300">
            What an orchestrator does, then clusters, task definitions, tasks, and services.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Capacity and DE use cases">
          <p className="text-slate-300">
            Fargate vs EC2, where ECS fits in data pipelines, and a beginner checkpoint before task
            definitions, ECR, networking, and IAM task roles in the intermediate module.
          </p>
        </ContentStep>
        <Flowchart
          title="ECS sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[Containers and Docker]
  B --> C[What is ECS]
  C --> D[Clusters tasks services]
  D --> E[Fargate vs EC2]
  E --> F[ECS for DE]
  F --> G[Beginner checkpoint]
  G --> H[Task definitions ECR networking next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Container', 'A running, isolated process that carries its own code and dependencies — works the same on a laptop and in AWS'],
                ['Image', 'The read-only package a container starts from — code, libraries, OS files, and the start command'],
                ['Dockerfile', 'A text recipe that describes how to build an image, step by step'],
                ['Registry / ECR', 'A storage service for images; Amazon ECR is AWS’s private registry that ECS pulls from'],
                ['Cluster', 'A logical grouping in ECS where tasks and services run — e.g. one per environment'],
                ['Task definition', 'The blueprint for a job: which image, how much CPU and memory, env vars, roles, logging'],
                ['Task', 'One running copy of a task definition — for batch ETL, it starts, does work, and exits'],
                ['Service', 'Keeps N tasks running at all times and replaces any that fail — for workers and APIs'],
                ['Launch type / capacity provider', 'Where tasks physically run — Fargate or EC2 instances'],
                ['Fargate', 'Serverless capacity for containers — no servers to patch, pay per vCPU and GB per second'],
                ['Task role', 'The IAM role your code uses at runtime — e.g. to write to S3 or read a secret'],
                ['Execution role', 'The IAM role ECS itself uses to pull the image from ECR and send logs to CloudWatch'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put purpose and environment in names: cluster{' '}
          <code className="text-core-400">de-etl-cluster-prod</code>, task definition{' '}
          <code className="text-core-400">orders-export-task</code>, and tag images with the git commit SHA
          (e.g. <code className="text-core-400">orders-export:3f9c2ab</code>) instead of{' '}
          <code className="text-core-400">latest</code> — so on-call knows exactly which code ran last night.
        </Callout>
      </LessonSection>

      <LessonSection title="How ECS fits in a pipeline">
        <p className="text-slate-300">
          A scheduler or orchestrator calls ECS <code className="text-core-400">RunTask</code>. Fargate
          starts a task, pulls the image from ECR, and the container reads from RDS or an external API,
          writes files to S3, streams logs to CloudWatch, and exits. Exit code 0 means success.
        </p>
        <Flowchart
          title="Scheduler → ECS RunTask on Fargate → S3"
          chart={`flowchart LR
  SCH[EventBridge Scheduler] --> ECS[ECS RunTask on Fargate]
  SFN[Step Functions] --> ECS
  ECR[ECR image repository] --> ECS
  ECS --> SRC[Read RDS or vendor API]
  ECS --> S3[Write S3 bronze]
  ECS --> CW[CloudWatch Logs]`}
        />
        <ContentStep number={1} title="Why data engineers care">
          <p className="text-slate-300">
            No time limit for batch jobs, any language or binary, reproducible builds pinned to a git SHA,
            and the same IAM, VPC, CloudWatch, and Secrets Manager patterns you already know. Fargate means
            no servers to patch, and you pay only while the task runs.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ECS is the final compute piece: containers for jobs too long, too heavy, or too custom for Lambda, and not Spark-shaped enough for Glue.',
          'Roadmap: containers and Docker → what ECS is → clusters, tasks, services → Fargate vs EC2 → DE use cases → checkpoint.',
          'Core vocabulary: image, container, Dockerfile, ECR, cluster, task definition, task, service, Fargate, task role, execution role.',
          'Typical pattern: EventBridge Scheduler or Step Functions → RunTask on Fargate → image from ECR → S3 output and CloudWatch logs.',
          'Name clusters and task definitions by purpose and environment; tag images with the git SHA, not latest.',
        ]}
      />
    </LessonArticle>
  )
}
