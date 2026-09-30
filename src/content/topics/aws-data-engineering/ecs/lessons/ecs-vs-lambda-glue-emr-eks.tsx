import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EcsVsLambdaGlueEmrEks() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Six ways to run code on AWS — and interviewers want you to pick one">
        By now you have seen Lambda, Glue, and ECS, and you have heard of EMR, EKS, and AWS Batch. They overlap,
        and &quot;which compute would you use for this pipeline?&quot; is one of the most common system design
        questions for data engineers. The answer is never a favorite service — it is a match between the workload
        shape (event, batch, Spark, always-on) and each service&apos;s limits and operational cost.
      </Callout>

      <Definition term="Compute selection for data workloads">
        <p>
          Choosing where a data job runs based on <strong className="text-white">runtime length</strong>,{' '}
          <strong className="text-white">data volume</strong> (single machine vs distributed),{' '}
          <strong className="text-white">dependencies</strong> (standard Python vs custom binaries),{' '}
          <strong className="text-white">trigger pattern</strong> (event, schedule, queue, request), and{' '}
          <strong className="text-white">team skills</strong> (serverless vs Kubernetes). Most real platforms use
          several services, each for what it does best.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Max runtime</th>
                <th className="px-4 py-3">Scaling model</th>
                <th className="px-4 py-3">Pricing</th>
                <th className="px-4 py-3">Ops burden</th>
                <th className="px-4 py-3">Deps and languages</th>
                <th className="px-4 py-3">Spark</th>
                <th className="px-4 py-3">Best DE fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Lambda', '15 minutes', 'Per event, automatic', 'Requests plus GB-seconds', 'Lowest', 'Runtimes or container image up to 10 GB', 'No', 'Event handlers, S3 triggers, light transforms'],
                ['ECS on Fargate', 'No hard limit', 'RunTask per job or service autoscaling', 'vCPU and GB per second', 'Low to medium', 'Anything in a container', 'Single-node only, not managed', 'Containerized batch, queue workers, connectors'],
                ['AWS Batch', 'Configurable timeout', 'Job queues onto Fargate, EC2, or EKS', 'Underlying compute only', 'Medium', 'Anything in a container', 'Not its focus', 'Large queues of jobs, array jobs, priorities'],
                ['Glue', 'Configurable, default 48 hours', 'Serverless Spark workers', 'DPU-hours per second', 'Low', 'PySpark, Scala, Python shell, limited extra libs', 'Yes, managed', 'Spark ETL on the lake, catalog-integrated jobs'],
                ['EMR on EC2', 'Cluster lifetime', 'You size clusters, managed scaling', 'EC2 plus EMR fee, Spot friendly', 'High', 'Spark, Hive, Trino, Flink, custom bootstrap', 'Yes, full control', 'Heavy or tuned Spark, long-lived clusters'],
                ['EMR Serverless', 'Configurable job timeout', 'Automatic workers per job', 'vCPU and GB used', 'Low to medium', 'Spark and Hive with custom images', 'Yes', 'Spark at scale without cluster management'],
                ['EKS', 'No hard limit', 'Kubernetes pods and node autoscaling', 'Control plane plus nodes or Fargate', 'Highest', 'Anything, plus the Kubernetes ecosystem', 'Via Spark operator or EMR on EKS', 'Orgs standardized on Kubernetes'],
              ].map(([service, runtime, scaling, pricing, ops, deps, spark, fit]) => (
                <tr key={service} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{service}</td>
                  <td className="px-4 py-3">{runtime}</td>
                  <td className="px-4 py-3">{scaling}</td>
                  <td className="px-4 py-3">{pricing}</td>
                  <td className="px-4 py-3">{ops}</td>
                  <td className="px-4 py-3">{deps}</td>
                  <td className="px-4 py-3">{spark}</td>
                  <td className="px-4 py-3">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          Limits and features change — Lambda memory and timeout, Glue versions, and EMR Serverless defaults have
          all moved over the years. Use this table for reasoning, then confirm current quotas in the docs before a
          design review.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision flow by workload">
        <Flowchart
          title="Which compute for this data job"
          chart={`flowchart TB
  START[New data workload]
  EVT{Short event handler under 15 min}
  SPARK{Needs distributed Spark}
  TUNE{Needs deep cluster tuning}
  K8S{Org standard is Kubernetes}
  QUEUE{Thousands of queued jobs}
  ALWAYS{Always on worker or API}
  LAMBDA[Lambda]
  GLUE[Glue or EMR Serverless]
  EMR[EMR on EC2]
  EKS[EKS or EMR on EKS]
  BATCH[AWS Batch]
  SVC[ECS service]
  TASK[ECS Fargate RunTask]
  START --> EVT
  EVT -->|yes| LAMBDA
  EVT -->|no| SPARK
  SPARK -->|yes| TUNE
  TUNE -->|no| GLUE
  TUNE -->|yes| EMR
  SPARK -->|no| K8S
  K8S -->|yes| EKS
  K8S -->|no| QUEUE
  QUEUE -->|yes| BATCH
  QUEUE -->|no| ALWAYS
  ALWAYS -->|yes| SVC
  ALWAYS -->|no| TASK`}
        />
        <ContentStep number={1} title="Event handlers → Lambda">
          <p className="text-slate-300">
            Validate an uploaded file, route an S3 event, write a DynamoDB watermark, transform a small JSON payload.
            Sub-second startup, no idle cost, native triggers. Move off Lambda when jobs approach the 15-minute limit
            or need binaries that do not fit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Containerized batch → ECS on Fargate">
          <p className="text-slate-300">
            A 40-minute vendor extract using a proprietary SDK, a dbt run, a Polars job that fits on one 16 vCPU
            task, or a JDBC export from RDS. You control the image, pay per second, and orchestrate with Step
            Functions — no cluster to manage.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Spark at scale → Glue, EMR Serverless, or EMR">
          <p className="text-slate-300">
            Once data outgrows one machine — terabytes of joins across the lake — you want a distributed engine.
            Glue is the default for catalog-integrated ETL; EMR Serverless for Spark with more control; EMR on EC2
            when you need specific instance types, tuning, or long-lived clusters. Do not hand-roll Spark clusters on
            ECS.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common combinations in real platforms">
        <ContentStep number={1} title="Lambda in front, ECS behind">
          <p className="text-slate-300">
            An S3 event triggers a Lambda that validates the file and sends a message to{' '}
            <code className="text-core-400">de-orders-work-queue-prod</code>; ECS workers do the heavy parsing.
            Lambda handles the burst of events cheaply; ECS handles the long work.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ECS extract, Glue transform, Redshift serve">
          <p className="text-slate-300">
            Step Functions runs an ECS task that pulls from a vendor API into bronze, then a Glue job builds silver
            and gold, then a Redshift COPY or Spectrum query serves analysts. Each step uses the cheapest compute that
            fits its shape.
          </p>
        </ContentStep>
        <ContentStep number={3} title="EKS when the platform team already runs it">
          <p className="text-slate-300">
            If the company runs everything on Kubernetes with Airflow, Spark operator, and shared observability,
            joining that platform beats standing up a parallel ECS estate. Without that existing investment, ECS is
            usually the simpler choice for DE teams.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Interview framing">
          State the workload shape first, name the constraint that rules out the simpler option (&quot;it runs 90
          minutes, so not Lambda; it fits on one machine, so not Spark&quot;), then pick. Showing the elimination
          reasoning matters more than the final answer.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda for short event-driven work; ECS on Fargate for containerized jobs without a runtime ceiling.',
          'Glue, EMR Serverless, and EMR are for distributed Spark — do not build Spark clusters on ECS.',
          'AWS Batch adds job queues, priorities, and array jobs on top of Fargate or EC2 capacity.',
          'EKS makes sense when the organization already standardizes on Kubernetes; otherwise ECS is simpler.',
          'Real platforms combine services: Lambda triggers, ECS extracts, Glue transforms, Redshift or Athena serves.',
        ]}
      />
    </LessonArticle>
  )
}
