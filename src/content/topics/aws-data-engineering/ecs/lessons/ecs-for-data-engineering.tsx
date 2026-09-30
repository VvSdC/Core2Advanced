import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EcsForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where ECS earns its place in a data platform">
        You now know what containers, tasks, services, and Fargate are. The practical question is{' '}
        <strong className="text-white">which pipeline jobs should actually run on ECS</strong> — and which
        should stay on Lambda, Glue, or Athena. Choosing well keeps the platform simple; choosing badly
        means maintaining containers for work a managed service already does better.
      </Callout>

      <Definition term="ECS as the DE &quot;custom compute&quot; tier">
        <p>
          In a data platform, ECS is the{' '}
          <strong className="text-white">custom compute tier</strong>: single-node or small-fleet jobs and
          long-running processes that need their own runtime, libraries, or binaries — scheduled by
          EventBridge Scheduler or Step Functions, reading from sources, and writing to the S3 lake or
          warehouse like any other stage.
        </p>
        <p className="mt-2 text-slate-300">
          <span className="text-core-400">If a managed service fits the job shape, use it. If the job needs
          &quot;my exact environment, for as long as it takes,&quot; reach for ECS on Fargate.</span>
        </p>
      </Definition>

      <LessonSection title="Batch jobs that outgrow Lambda">
        <ContentStep number={1} title="Long-running or memory-heavy Python">
          <p className="text-slate-300">
            A pandas or polars job that loads a 6 GB vendor file, joins reference data, and writes Parquet
            for 50 minutes. Too long for Lambda, too small to justify a Spark cluster — a 4 vCPU / 16 GB
            Fargate task fits perfectly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom binaries and drivers">
          <p className="text-slate-300">
            Jobs that need a vendor Java CLI, an Oracle or SQL Server JDBC/ODBC driver, an SFTP client, or a
            compiled geospatial library. Install them once in the Dockerfile and every run has them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="dbt runs and database exports">
          <p className="text-slate-300">
            A container with <code className="text-core-400">dbt-redshift</code> pinned to an exact version
            runs <code className="text-core-400">dbt build</code> after Glue finishes. Similar images run
            nightly <code className="text-core-400">pg_dump</code> or bulk exports from RDS into S3 bronze.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Parallel backfills">
          <p className="text-slate-300">
            Reprocessing 90 days of history? Launch one task per day partition, passing{' '}
            <code className="text-core-400">RUN_DATE</code> as an environment override — or let a Step
            Functions Map state fan out the tasks and track which days failed.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Long-running services">
        <ContentStep number={1} title="SQS queue workers">
          <p className="text-slate-300">
            An ECS service polls <code className="text-core-400">orders-ingest-queue</code>, processes
            messages that take minutes each, and scales task count with queue backlog — ideal when Lambda&apos;s
            15-minute limit or per-invocation cold starts get in the way.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CDC and streaming connectors">
          <p className="text-slate-300">
            Kafka Connect workers or Debezium reading database change logs and publishing to MSK or Kinesis.
            These must run continuously and restart on failure — exactly what a service does.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Internal data APIs and orchestration workers">
          <p className="text-slate-300">
            A FastAPI service that serves curated metrics behind an ALB, or behind API Gateway through a VPC
            link. Teams running self-hosted Airflow often put schedulers and workers on ECS too, though MWAA
            is the managed alternative.
          </p>
        </ContentStep>
        <Flowchart
          title="ECS jobs across a lake pipeline"
          chart={`flowchart LR
  RDS[RDS source] --> EXP[ECS export task]
  SFTP[Vendor SFTP] --> JAVA[ECS Java CLI task]
  EXP --> BRONZE[S3 bronze]
  JAVA --> BRONZE
  BRONZE --> GLUE[Glue Spark transforms]
  GLUE --> SILVER[S3 silver]
  SILVER --> DBT[ECS dbt task]
  DBT --> RS[Redshift marts]
  SQS[SQS queue] --> WORK[ECS worker service]
  WORK --> SILVER`}
        />
      </LessonSection>

      <LessonSection title="Anti-patterns — when not to use ECS">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Workload</th>
                <th className="px-4 py-3">Better fit</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Terabyte-scale distributed transforms', 'Glue or EMR', 'Spark spreads work across many executors; one container cannot'],
                ['Tiny S3 event handler under a minute', 'Lambda', 'No image to maintain, scales to zero, per-millisecond billing'],
                ['Ad-hoc SQL over the lake', 'Athena', 'Serverless queries — no code or compute to run'],
                ['Simple scheduled SQL in the warehouse', 'Redshift scheduled queries or Step Functions', 'No container needed to send one statement'],
                ['Stateful database hosting', 'RDS or DynamoDB', 'Managed durability, backups, and failover'],
              ].map(([workload, fit, why]) => (
                <tr key={workload} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{workload}</td>
                  <td className="px-4 py-3">{fit}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview framing: &quot;ECS is where we put jobs that need a custom environment or run longer than
          Lambda allows, but are not big enough to need Spark. Everything else goes to the managed service
          built for that shape.&quot;
        </Callout>
        <Callout variant="tip" title="Quick test before containerizing">
          Ask three questions: does it exceed Lambda limits, does it need custom binaries or pinned
          dependencies, and is it single-node rather than distributed? Two &quot;yes&quot; answers usually
          point to ECS on Fargate.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ECS is the custom compute tier: long or memory-heavy single-node jobs, custom binaries, drivers, and pinned toolchains like dbt.',
          'Run-to-completion tasks handle exports, vendor CLIs, and dbt; services handle SQS workers, CDC connectors, and internal APIs.',
          'Self-hosted Airflow and Kafka Connect or Debezium commonly run on ECS; MWAA and MSK Connect are managed alternatives.',
          'Anti-patterns: big distributed Spark belongs on Glue or EMR, tiny event handlers on Lambda, ad-hoc SQL on Athena.',
          'Containerize when a job exceeds Lambda limits, needs a custom environment, and is not Spark-shaped.',
        ]}
      />
    </LessonArticle>
  )
}
