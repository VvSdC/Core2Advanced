import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GlueJobTypesAndSizing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pick the right Glue job type before tuning workers">
        AWS Glue offers <strong className="text-white">Spark ETL</strong> jobs for distributed transforms and{' '}
        <strong className="text-white">Python Shell</strong> jobs for lightweight single-node scripts. Worker
        type, count, and Glue version determine DPU capacity and cost. Mis-sizing — Spark for a 50 MB script
        or Python Shell for a 2 TB join — is a common DE interview trap.
      </Callout>

      <Definition term="DPU (Data Processing Unit)">
        <p>
          A DPU is a unit of processing power in Glue. For Spark jobs, each worker consumes a configured
          number of DPUs depending on worker type (Standard, G.1X, G.2X, etc.). Billing is per DPU-second
          while the job runs. Right-sizing means enough parallelism for SLA without idle capacity.
        </p>
      </Definition>

      <LessonSection title="Spark vs Python Shell">
        <ContentStep number={1} title="Glue Spark ETL">
          <p className="text-slate-300">
            Distributed PySpark or Scala Spark on a managed cluster. Use for large joins, aggregations,
            Parquet writes with partitioning, DynamicFrame transforms, and anything that needs shuffle across
            nodes. Supports job bookmarks, Spark UI logs, and Glue Studio visual nodes that compile to Spark.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Python Shell">
          <p className="text-slate-300">
            Single-node Python 3.9 environment — no Spark context. Fits small file moves, boto3 orchestration,
            lightweight pandas on modest CSVs, and calling external APIs. Max capacity is one node (1 or 0.0625
            DPU for generation 2). Do not use for multi-TB transforms.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Decision matrix">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Signal</th>
                  <th className="px-4 py-3">Choose Spark</th>
                  <th className="px-4 py-3">Choose Python Shell</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['Data volume', 'GB to PB, needs shuffle', 'Under ~ few GB, no shuffle'],
                  ['Libraries', 'PySpark, DynamicFrame', 'boto3, pandas, requests'],
                  ['Output', 'Partitioned Parquet, large writes', 'Small S3 copy, API POST'],
                  ['Bookmarks', 'Supported on Spark sources', 'Not applicable'],
                  ['Cost profile', 'DPU-hours scale with workers', 'Minimal fixed DPU'],
                ].map(([signal, spark, shell]) => (
                  <tr key={signal} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-medium text-white">{signal}</td>
                    <td className="px-4 py-3">{spark}</td>
                    <td className="px-4 py-3">{shell}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue version, worker types, and worker count">
        <ContentStep number={1} title="Glue version">
          <p className="text-slate-300">
            Glue 4.0 and 5.0 ship newer Spark and Python runtimes, improved performance, and better connector
            support. New jobs should target the latest stable Glue version unless legacy libraries block
            upgrade. Version is set at job creation — changing it may require script compatibility testing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Worker types">
          <p className="text-slate-300">
            <strong className="text-white">Standard</strong> — 4 vCPU, 16 GB RAM, 2 DPUs per worker; legacy
            default. <strong className="text-white">G.1X</strong> — 4 vCPU, 16 GB, 1 DPU; general Spark ETL.{' '}
            <strong className="text-white">G.2X</strong> — 8 vCPU, 32 GB, 2 DPUs; memory-heavy joins and
            wide rows. <strong className="text-white">G.025X</strong> — serverless-style small jobs; low
            overhead for micro-batch. Match worker RAM to shuffle and broadcast needs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Number of workers">
          <p className="text-slate-300">
            More workers increase parallelism for reads and narrow transforms — but shuffle-heavy stages
            bottleneck on skew and partition count, not raw worker count. Start with 2–10 G.1X workers for
            mid-size lake jobs; profile Spark UI for stages with long shuffle or spill to disk. Autoscaling
            (where enabled) adds workers during demand — still cap max to control cost spikes.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Job parameters">
        <ContentStep number={1} title="Default and custom parameters">
          <p className="text-slate-300">
            Pass runtime config via job parameters:{' '}
            <span className="font-mono text-sm">--JOB_NAME</span>,{' '}
            <span className="font-mono text-sm">--TempDir</span>,{' '}
            <span className="font-mono text-sm">--enable-metrics</span>,{' '}
            <span className="font-mono text-sm">--enable-continuous-cloudwatch-log</span>. Custom keys like{' '}
            <span className="font-mono text-sm">--run_date</span> or{' '}
            <span className="font-mono text-sm">--target_prefix</span> are read in script via{' '}
            <span className="font-mono text-sm">getResolvedOptions</span> — same job definition, different
            payloads per trigger.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Spark-specific tuning params">
          <p className="text-slate-300">
            Set conf overrides in job parameters or script: shuffle partitions, adaptive query execution,
            broadcast threshold. Example:{' '}
            <span className="font-mono text-sm">--conf spark.sql.shuffle.partitions=200</span>. Document
            tunings in repo — mysterious conf changes are hard to debug across environments.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Connections and security">
          <p className="text-slate-300">
            Attach Glue connections for VPC JDBC access. Job role needs S3, catalog, Secrets Manager, and
            CloudWatch permissions. Network connections add ENI setup time on cold start — factor into SLA
            for small frequent jobs.
          </p>
        </ContentStep>
        <Example title="getResolvedOptions sketch">
{`from awsglue.utils import getResolvedOptions
import sys

args = getResolvedOptions(sys.argv, ['JOB_NAME', 'run_date', 'source_path'])
run_date = args['run_date']
# Use run_date to filter landing prefix: s3://lake/raw/events/run_date=...`}
        </Example>
      </LessonSection>

      <Callout variant="insight">
        Profile one representative day of data before production sizing. Double workers halve wall time only
        when the job is compute-bound and shuffle is balanced — not when a single hot key dominates the join.
      </Callout>

      <KeyTakeaways
        items={[
          'Spark ETL for distributed lake transforms; Python Shell for small single-node scripts only.',
          'Worker type sets vCPU/RAM per node (G.1X general, G.2X memory-heavy); count sets parallelism.',
          'Use latest stable Glue version; upgrade when connectors and Spark features require it.',
          'Job parameters pass run_date, paths, and Spark conf — one job definition, many scheduled runs.',
          'Right-size with Spark UI: more workers help until shuffle skew or small files dominate — then fix data layout.',
        ]}
      />
    </LessonArticle>
  )
}
