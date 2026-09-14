import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Ec2VsLambdaVsGlue() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three ways to run the same transform">
        Landing a CSV, cleaning columns, and writing parquet to curated can run on a cron&apos;d EC2 script,
        a Lambda triggered by S3, or a Glue ETL job. The business outcome is similar — control, ops burden,
        cost shape, and runtime limits differ sharply. Data engineers pick based on workload shape, not loyalty
        to one service.
      </Callout>

      <Definition term="Compute choice for ETL">
        <p>
          <strong className="text-white">EC2</strong> = you manage OS, patching, scaling, and runtime.
          <strong className="text-white"> Lambda</strong> = event-driven functions, AWS manages runtime up
          to 15 minutes. <strong className="text-white">Glue</strong> = managed Spark/Python ETL with Data
          Catalog integration and DPU billing. All three use IAM roles and typically read/write S3.
        </p>
      </Definition>

      <LessonSection title="Comparison — control, ops, cost, runtime, scale">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">EC2</th>
                <th className="px-4 py-3">Lambda</th>
                <th className="px-4 py-3">Glue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Control',
                  'Full — any library, OS tuning, Airflow, custom JVM',
                  'Limited runtime/layers; no arbitrary daemons',
                  'Spark/Python Glue version; some Spark config',
                ],
                [
                  'Ops burden',
                  'High — patch, AMI, ASG, monitoring agents',
                  'Low — deploy function, watch concurrency',
                  'Medium — job defs, DPU tuning, no OS patching',
                ],
                [
                  'Cost shape',
                  'Per hour + EBS (idle cost if always on)',
                  'Per invoke + GB-second (zero when idle)',
                  'Per DPU-hour while job runs',
                ],
                [
                  'Max runtime',
                  'Unlimited while instance runs',
                  '15 minutes hard limit',
                  'Hours typical; long Spark batches',
                ],
                [
                  'Scale',
                  'Manual ASG / manual cluster size',
                  'Automatic concurrency (account limits)',
                  'Auto workers via DPU/job bookmark',
                ],
                [
                  'Best DE fit',
                  'Airflow, custom deps, 24/7 workers, RAPIDS/GPU',
                  'S3 event ingest, small file fan-out, orchestration triggers',
                  'Spark transforms, crawlers, catalog-native ETL',
                ],
              ].map(([dim, ec2, lambda, glue]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{ec2}</td>
                  <td className="px-4 py-3">{lambda}</td>
                  <td className="px-4 py-3">{glue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to pick which for DE">
        <ContentStep number={1} title="Choose EC2 when">
          <p className="text-slate-300">
            You run self-hosted Airflow/Celery, need packages Glue does not ship, exceed Lambda timeout,
            want GPU/RAPIDS, or have steady enough load that hourly EC2 (+ Savings Plans) beats per-DPU
            Glue. Accept ops: AMIs, patching, ASG, CloudWatch Agent.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose Lambda when">
          <p className="text-slate-300">
            Work is short (&lt;15 min), event-driven (S3 Put, SQS message), small memory footprint —
            compress upload, validate schema, enqueue Glue job, lightweight JSON flatten. Zero idle cost;
            watch cold starts and concurrency limits on burst landing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Choose Glue when">
          <p className="text-slate-300">
            Spark-scale transforms, built-in catalog/crawler integration, job bookmarks for incremental
            loads, and you prefer not to operate EMR/EC2 Spark clusters. Pay DPU-hours; optimize worker
            type and job bookmarks to avoid reprocessing entire history.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Hybrid (common in production)">
          <p className="text-slate-300">
            Lambda on S3 event → validates and starts Glue job → Glue writes curated → Redshift COPY.
            Airflow on EC2 (or MWAA) orchestrates the chain. Each step uses the right compute tier and IAM
            role from pipeline identity patterns.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview framing: &quot;I&apos;d use Lambda for the thin ingest edge, Glue for Spark transform,
          EC2 only if we need Airflow executors or libraries Glue cannot support — and I&apos;d measure idle
          time before committing to 24/7 EC2.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EC2: max control and unlimited runtime; highest ops burden and idle cost if always on.',
          'Lambda: best for short event-driven ingest/orchestration; 15-minute cap and package limits.',
          'Glue: managed Spark ETL + catalog; DPU-hour billing; strong for large partitioned transforms.',
          'Cost shape: EC2 hourly, Lambda per-invoke, Glue per DPU-hour — match to utilization and duration.',
          'Production lakes often hybrid: Lambda trigger → Glue transform → warehouse load, orchestrated by Airflow/MWAA.',
        ]}
      />
    </LessonArticle>
  )
}
