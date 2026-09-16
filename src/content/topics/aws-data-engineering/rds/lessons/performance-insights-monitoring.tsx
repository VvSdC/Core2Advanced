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

export function PerformanceInsightsMonitoring() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Watch the source before your extract breaks prod">
        Data engineers share RDS with application teams. When a nightly Glue job or rogue analyst query spikes
        CPU or I/O, you need <strong className="text-white">Performance Insights</strong>,{' '}
        <strong className="text-white">Enhanced Monitoring</strong>, and maintenance discipline to diagnose
        load — and parameter groups to tune behavior before escalations land on your Slack channel.
      </Callout>

      <Definition term="RDS observability stack">
        <p>
          <strong className="text-white">Performance Insights</strong> captures database load by wait events
          and top SQL — who is consuming CPU and I/O.{' '}
          <strong className="text-white">Enhanced Monitoring</strong> delivers OS-level metrics (CPU, disk,
          filesystem) at 1–60 second granularity via CloudWatch.{' '}
          <strong className="text-white">Maintenance windows</strong> schedule patching and upgrades;{' '}
          <strong className="text-white">parameter groups</strong> control engine settings like memory,
          connections, and logging.
        </p>
      </Definition>

      <LessonSection title="Performance Insights">
        <ContentStep number={1} title="Database load dashboard">
          <p className="text-slate-300">
            Performance Insights shows average active sessions (AAS) over time — the RDS equivalent of
            &quot;how busy is the DB.&quot; Slice by wait event (CPU, IO:DataFileRead, Lock:transactionid)
            to see whether load is compute, disk, or contention.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Top SQL identification">
          <p className="text-slate-300">
            Identify queries consuming the most load — often a missing index on a table your extract JOINs,
            or an analyst SELECT * without LIMIT. DE teams use this to prove extract queries need indexes or
            should move off prod entirely.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retention tiers">
          <p className="text-slate-300">
            Free tier retains 7 days; paid extends to 2 years — useful for correlating monthly ETL spikes with
            application releases. Export findings to justify DMS CDC instead of repeated heavy JDBC pulls.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Enhanced Monitoring">
        <ContentStep number={1} title="OS-level granularity">
          <p className="text-slate-300">
            Standard CloudWatch RDS metrics update every 60 seconds. Enhanced Monitoring pushes metrics every
            1, 5, 10, 15, 30, or 60 seconds — disk queue depth, filesystem usage, memory breakdown — essential
            when diagnosing I/O saturation during parallel extract workers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudWatch alarms">
          <p className="text-slate-300">
            Alarm on <code className="text-core-400">CPUUtilization</code>,{' '}
            <code className="text-core-400">FreeStorageSpace</code>,{' '}
            <code className="text-core-400">DatabaseConnections</code>, and{' '}
            <code className="text-core-400">ReadLatency</code>/<code className="text-core-400">WriteLatency</code>.
            Route to SNS → Slack/PagerDuty. DE pipelines should pause or throttle on sustained CPU &gt; 80%
            if SLA allows — protect prod over extract SLAs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integration with pipeline observability">
          <p className="text-slate-300">
            Correlate Glue job start times (CloudWatch Logs) with RDS load spikes in Performance Insights —
            builds the case for off-peak scheduling, read replica routing, or lake-first architecture.
          </p>
        </ContentStep>
        <Flowchart
          title="Diagnosing extract-induced load"
          chart={`flowchart LR
  GLUE[Glue job starts 02:00 UTC]
  PI[Performance Insights]
  CW[CloudWatch alarms]
  GLUE --> PI
  PI -->|top SQL| BAD[Full table scan on orders]
  PI --> CW
  CW -->|CPU high| SNS[SNS alert to DE team]
  BAD --> FIX[Add index or move to DMS CDC]`}
        />
      </LessonSection>

      <LessonSection title="Maintenance windows">
        <ContentStep number={1} title="Scheduled patching">
          <p className="text-slate-300">
            RDS applies engine patches and OS updates during the maintenance window — typically weekly 1-hour
            block. Multi-AZ instances fail over to standby during patching — brief connection blip. Schedule
            extract jobs outside this window or implement retry logic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deferred maintenance">
          <p className="text-slate-300">
            Critical patches may force application outside your window if deferred too long. Balance Black
            Friday freeze periods with security compliance — communicate blackout dates to DE schedulers.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Manual vs auto minor version upgrade">
          <p className="text-slate-300">
            Control whether minor engine upgrades apply automatically — prod sources often require manual
            approval and staging validation before prod maintenance applies Postgres/MySQL minor bumps.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parameter groups — deeper teaser">
        <ContentStep number={1} title="What parameter groups control">
          <p className="text-slate-300">
            DB parameter groups hold engine-specific settings:{' '}
            <code className="text-core-400">max_connections</code>,{' '}
            <code className="text-core-400">shared_buffers</code>,{' '}
            <code className="text-core-400">log_statement</code>,{' '}
            <code className="text-core-400">rds.logical_replication</code> (for CDC),{' '}
            <code className="text-core-400">rds.force_ssl</code>. Changes often require reboot — plan in
            maintenance window.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE-relevant parameters">
          <p className="text-slate-300">
            Enable logical replication (Postgres) or binlog ROW format (MySQL) for DMS CDC. Tune{' '}
            <code className="text-core-400">work_mem</code> cautiously — large sorts in extract queries can
            exhaust memory per connection. Enable slow query logging for forensic analysis after incidents.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cluster vs instance parameter groups">
          <p className="text-slate-300">
            Aurora uses cluster-level and instance-level groups — know which parameters apply where. RDS
            single-instance uses one DB parameter group. Always test parameter changes on staging before prod
            — wrong <code className="text-core-400">max_wal_senders</code> can break replication.
          </p>
        </ContentStep>
        <Example title="CDC prerequisite parameters" caption="Postgres logical replication for DMS">
{`Parameter group changes (require reboot):
  rds.logical_replication = 1
  max_wal_senders = 10+ (scale with DMS tasks)
  max_replication_slots = 10+

MySQL equivalent:
  binlog_format = ROW
  binlog retention hours aligned with DMS recovery window`}
        </Example>
        <Callout variant="tip">
          Performance Insights tells you <em>what</em> SQL hurts; parameter groups let you <em>configure</em>{' '}
          replication and logging for CDC — coordinate with DBAs before enabling logical replication on prod.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Performance Insights: AAS load dashboard + top SQL by wait event — diagnose extract vs app contention.',
          'Enhanced Monitoring: 1–60s OS metrics — disk queue, memory; pair with CloudWatch alarms on CPU/connections.',
          'Maintenance windows: schedule extracts outside patching; Multi-AZ failover causes brief blips — retry ETL.',
          'Parameter groups: engine tuning + CDC prerequisites (logical replication, binlog ROW) — reboot often required.',
          'Correlate Glue/Lambda job timestamps with PI spikes — evidence to move heavy reads off prod to lake/warehouse.',
        ]}
      />
    </LessonArticle>
  )
}
