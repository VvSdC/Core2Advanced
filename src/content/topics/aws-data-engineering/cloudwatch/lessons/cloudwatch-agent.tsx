import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CloudwatchAgent() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Default EC2 metrics are not enough for production ETL fleets">
        EC2 publishes CPU and network — not memory used, disk free space, or your Airflow worker log files.
        The <strong className="text-white">CloudWatch Agent</strong> installs on instances to collect OS-level
        metrics and ship log files to CloudWatch Logs. Data engineers running Spark workers, Airflow, or
        custom Python ETL on EC2 need the agent (or an equivalent sidecar) before alarms can catch OOM or
        full staging disks.
      </Callout>

      <Definition term="CloudWatch Agent">
        <p>
          A lightweight daemon (<span className="font-mono text-sm">amazon-cloudwatch-agent</span>) configured
          via JSON or SSM Parameter Store. It collects <strong className="text-white">custom metrics</strong>{' '}
          (mem_used_percent, disk_used_percent), <strong className="text-white">logs</strong> from file paths,
          and optional statsd/prometheus endpoints — publishing to CloudWatch in the same account/region as
          the instance.
        </p>
      </Definition>

      <LessonSection title="What the agent collects">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Collection type</th>
                <th className="px-4 py-3">Examples</th>
                <th className="px-4 py-3">DE use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['OS metrics', 'mem_used_percent, disk_used_percent, diskio, swap', 'Prevent OOM and /data full mid-batch'],
                ['Log files', '/var/log/airflow/*.log, /opt/etl/app.log', 'Central search and metric filters on ERROR'],
                ['Custom log parsing', 'Collectd statsd, procstat', 'Per-process CPU for long-running workers'],
                ['JMX / optional plugins', 'Java heap on Spark executors (when configured)', 'Driver/worker JVM pressure'],
              ].map(([type, examples, use]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3 font-mono text-xs">{examples}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Deployment pattern for DE fleets">
        <ContentStep number={1} title="Config in SSM Parameter Store">
          <p className="text-slate-300">
            Store agent JSON config in Parameter Store — one parameter per role (
            <span className="font-mono text-sm">/cloudwatch-agent/etl-worker</span>). User-data or SSM State
            Manager association installs the agent and points at the parameter on boot. Same AMI, different
            config via tags — schedulers vs workers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="IAM instance profile">
          <p className="text-slate-300">
            Instance role needs <span className="font-mono text-sm">cloudwatch:PutMetricData</span>,{' '}
            <span className="font-mono text-sm">logs:CreateLogGroup</span>,{' '}
            <span className="font-mono text-sm">logs:CreateLogStream</span>,{' '}
            <span className="font-mono text-sm">logs:PutLogEvents</span>, and{' '}
            <span className="font-mono text-sm">ssm:GetParameter</span> for config pull. Scope log groups
            by prefix <span className="font-mono text-sm">/etl/</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarms and dashboards">
          <p className="text-slate-300">
            Alarm <span className="font-mono text-sm">mem_used_percent &gt; 85</span> and{' '}
            <span className="font-mono text-sm">disk_used_percent &gt; 90</span> on ASG dimension. Dashboard
            per fleet: CPU (native EC2) + mem/disk (agent) + custom queue lag from application PutMetricData.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudWatch Agent on ETL EC2"
          chart={`flowchart LR
  EC2[EC2 ETL worker]
  AGENT[CloudWatch Agent]
  SSM[SSM Parameter config]
  CWM[CloudWatch Metrics CWAgent namespace]
  CWL[CloudWatch Logs /etl/airflow]
  ALARM[Alarms SNS]
  EC2 --> AGENT
  SSM --> AGENT
  AGENT --> CWM
  AGENT --> CWL
  CWM --> ALARM
  CWL --> INSIGHTS[Logs Insights]`}
        />
      </LessonSection>

      <LessonSection title="When DE needs the agent">
        <ContentStep number={1} title="Self-managed batch on EC2">
          <p className="text-slate-300">
            Airflow on EC2, Celery workers, custom pandas/polars jobs, legacy Spark not on Glue/EMR — any
            long-lived process where disk and RAM matter. Lambda and Glue managed runtimes handle their own
            logging; EC2 does not expose mem/disk without the agent.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hybrid pipeline">
          <p className="text-slate-300">
            Landing triggers Lambda, heavy transform on EC2 ASG — agent on workers gives parity with Lambda
            CloudWatch logs for ops triage. Same runbook: alarm → Logs Insights → root cause.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When you might skip it">
          <p className="text-slate-300">
            Pure serverless lake (S3, Lambda, Glue, Step Functions only) — agent adds no value on compute
            you do not manage. Use Container Insights or ADOT for ECS/Fargate instead. EMR publishes many
            metrics natively — still may want agent for custom log paths on master node.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Pair agent log shipping with metric filters on ERROR patterns — turn log lines into countable
          metrics without application code changes on legacy ETL scripts.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudWatch Agent collects OS metrics (mem, disk) and log files from EC2 — default EC2 metrics lack these.',
          'Deploy via SSM Parameter Store config + State Manager or user-data; IAM for PutMetricData and PutLogEvents.',
          'DE needs agent on Airflow/EC2 ETL fleets, hybrid Lambda+EC2 pipelines, and staging disk monitoring.',
          'Alarm mem_used_percent and disk_used_percent before nightly batches fail silently from OOM or full disk.',
          'Skip for pure serverless; use native EMR/Container Insights where applicable instead of blind agent install.',
        ]}
      />
    </LessonArticle>
  )
}
