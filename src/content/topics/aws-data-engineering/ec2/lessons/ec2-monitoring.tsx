import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Ec2Monitoring() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You cannot right-size what you do not measure">
        Default EC2 metrics tell you CPU and network — not disk fullness, memory pressure, or whether your
        Airflow worker is stuck on a zombie process. Data engineers running custom ETL on EC2 need{' '}
        <strong className="text-white">CloudWatch</strong>, the <strong className="text-white">CloudWatch
        Agent</strong>, and often <strong className="text-white">Systems Manager</strong> for ops without
        SSH keys scattered across the team.
      </Callout>

      <Definition term="EC2 basic monitoring">
        <p>
          Free <strong className="text-white">basic monitoring</strong> (5-minute intervals, 1-minute for
          some metrics) includes <span className="font-mono text-sm">CPUUtilization</span>, network in/out,
          disk read/write <strong className="text-white">ops</strong> (not filesystem free space), and
          status check failures. Enough to spot pegged CPU or a dead instance — not enough for OOM or{' '}
          <span className="font-mono text-sm">/data</span> at 99% full.
        </p>
      </Definition>

      <LessonSection title="CloudWatch metrics that matter for DE">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">DE signal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CPUUtilization', 'EC2 default', 'CPU-bound ETL, need C family or more workers'],
                ['StatusCheckFailed', 'EC2 default', 'Hardware or system impairment — replace instance'],
                ['VolumeQueueLength / ThroughputPercentage', 'EBS', 'Disk throttling — tune gp3 or bottleneck'],
                ['mem_used_percent', 'CloudWatch Agent', 'Memory pressure before OOM kill on Python/Spark'],
                ['disk_used_percent', 'CloudWatch Agent', 'Staging disk full — failed writes mid-batch'],
                ['Custom: queue lag', 'Your app → PutMetricData', 'Airflow/Celery backlog for ASG scaling'],
              ].map(([metric, source, signal]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs">{metric}</td>
                  <td className="px-4 py-3">{source}</td>
                  <td className="px-4 py-3">{signal}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="CloudWatch Agent">
        <ContentStep number={1} title="Install via SSM or AMI">
          <p className="text-slate-300">
            Package collects memory, disk, and custom log files. Store config in SSM Parameter Store; use
            State Manager association to install on all instances tagged{' '}
            <span className="font-mono text-sm">Role=etl-worker</span> — consistent fleet observability.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logs and alarms">
          <p className="text-slate-300">
            Ship <span className="font-mono text-sm">/var/log/airflow/*.log</span> or ETL app logs to
            CloudWatch Logs. Alarm on <span className="font-mono text-sm">mem_used_percent &gt; 85</span> or{' '}
            <span className="font-mono text-sm">disk_used_percent &gt; 90</span> — page before nightly batch
            fails at 02:00.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dashboards">
          <p className="text-slate-300">
            Per-ASG dashboard: CPU, memory, disk, custom queue metric. Compare with Glue job DPU metrics
            when deciding EC2 vs managed ETL.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Systems Manager for ops">
        <ContentStep number={1} title="Session Manager">
          <p className="text-slate-300">
            Shell access without SSH port 22 or bastion keys — IAM-controlled, session logged to CloudTrail.
            Install SSM Agent (default on Amazon Linux). Ideal for debugging a stuck worker in a private
            subnet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Patch Manager and Run Command">
          <p className="text-slate-300">
            Run ad hoc scripts across the fleet: restart Airflow worker, clear temp dirs, validate boto3
            version. Patch baselines for OS security updates on long-lived schedulers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Inventory (teaser)">
          <p className="text-slate-300">
            SSM Inventory collects installed packages, applications, and platform details — audit which
            workers still run Python 3.9 vs 3.11 without logging into each box. Feeds compliance reports
            for SOX-style data platforms.
          </p>
        </ContentStep>
        <Flowchart
          title="Observability stack on an ETL EC2 fleet"
          chart={`flowchart LR
  EC2[EC2 ETL workers]
  CWA[CloudWatch Agent]
  SSM[Systems Manager Agent]
  CW[CloudWatch Metrics and Logs]
  ALARM[CloudWatch Alarms — SNS]
  DASH[Operations dashboard]
  SM[Session Manager — no SSH]
  EC2 --> CWA
  EC2 --> SSM
  CWA --> CW
  CW --> ALARM
  CW --> DASH
  SSM --> SM`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Default EC2 metrics cover CPU and network — not memory or disk free space; add CloudWatch Agent for those.',
          'Alarm on mem_used_percent, disk_used_percent, EBS throughput, and StatusCheckFailed before batch SLAs break.',
          'Ship Airflow/ETL logs to CloudWatch Logs for centralized search and metric filters on ERROR patterns.',
          'Systems Manager Session Manager replaces SSH for private workers — IAM-audited shell access.',
          'SSM Inventory and Run Command help patch and audit fleet-wide Python/runtime versions at scale.',
        ]}
      />
    </LessonArticle>
  )
}
