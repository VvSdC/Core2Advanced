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

export function ScheduledRulesCronRate() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Run ETL on the clock — no cron server">
        Not every pipeline starts because a file landed. Nightly silver builds, weekly full recompute, and
        hourly staging refreshes run on a timer.{' '}
        <strong className="text-white">Scheduled EventBridge rules</strong> use rate or cron expressions to
        invoke Glue, Step Functions, or Lambda — managed, IAM-audited, and visible in CloudWatch metrics.
      </Callout>

      <Definition term="Scheduled rule">
        <p>
          An EventBridge rule with a <strong className="text-white">schedule expression</strong> instead of an
          event pattern. EventBridge invokes the rule&apos;s targets on the defined interval or cron schedule
          in the rule&apos;s Region. No incoming event is required — the scheduler generates the invocation.
        </p>
      </Definition>

      <LessonSection title="Rate expressions — simple intervals">
        <ContentStep number={1} title="Syntax">
          <p className="text-slate-300">
            <code className="text-core-400">rate(value unit)</code> — unit is minute, minutes, hour, hours,
            day, or days. Examples: <code className="text-core-400">rate(15 minutes)</code>,{' '}
            <code className="text-core-400">rate(1 hour)</code>,{' '}
            <code className="text-core-400">rate(1 day)</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When DE teams use rate">
          <p className="text-slate-300">
            Staging environment refresh every hour, CDC lag checker every five minutes, or dev sandbox
            re-seed daily. Rate is easy but drifts relative to wall-clock — not ideal when vendor files must
            land before ETL at a fixed UTC time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Minimum interval">
          <p className="text-slate-300">
            One minute is the finest rate granularity. Sub-minute polling belongs elsewhere (Kinesis, streaming
            consumers) — not scheduled EventBridge for heavy Glue jobs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cron expressions — precise windows">
        <ContentStep number={1} title="EventBridge cron format">
          <p className="text-slate-300">
            Six fields: <code className="text-core-400">cron(minutes hours day-of-month month day-of-week year)</code>.
            Use <code className="text-core-400">?</code> for day-of-month or day-of-week when the other field
            is specified. Times are in UTC unless you document local offset for stakeholders.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Nightly batch anchor">
          <p className="text-slate-300">
            <code className="text-core-400">cron(0 2 * * ? *)</code> — 02:00 UTC every day. Classic window
            after upstream RDS snapshot and vendor SFTP cutoff complete. Target starts Step Functions lake
            build or Glue workflow with all medallion steps.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Weekday-only prod, anytime dev">
          <p className="text-slate-300">
            <code className="text-core-400">cron(0 3 ? * MON-FRI *)</code> — 03:00 UTC Monday through Friday
            for business-day reporting marts. Reduces weekend spend when sources do not update.
          </p>
        </ContentStep>
        <Example title="Cron cheat sheet for DE schedules" caption="All times UTC">
{`cron(0 2 * * ? *)       — daily at 02:00
cron(30 1 * * ? *)      — daily at 01:30
cron(0 */6 * * ? *)     — every 6 hours on the hour
cron(0 4 ? * SUN *)     — Sundays at 04:00 (weekly full rebuild)
cron(0 0 1 * ? *)       — first day of month at midnight
rate(1 hour)            — every hour from rule creation time
rate(1 day)             — every 24 hours from rule creation time`}
        </Example>
      </LessonSection>

      <LessonSection title="DE nightly ETL schedule examples">
        <ContentStep number={1} title="Medallion nightly — Step Functions">
          <p className="text-slate-300">
            Rule <code className="text-core-400">de-nightly-lake-build-prod</code>, schedule{' '}
            <code className="text-core-400">cron(0 2 * * ? *)</code>, target Step Functions{' '}
            <code className="text-core-400">acme-lake-nightly</code> — chains crawl bronze, silver ETL, gold
            aggregate, Athena row-count QA, SNS success. One schedule, one orchestration entry point.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Direct Glue workflow">
          <p className="text-slate-300">
            Rule <code className="text-core-400">de-glue-orders-silver-schedule</code>,{' '}
            <code className="text-core-400">cron(15 2 * * ? *)</code>, target Glue workflow{' '}
            <code className="text-core-400">orders-raw-to-silver</code> — staggered 15 minutes after main
            lake build so shared workers are free.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hourly staging refresh">
          <p className="text-slate-300">
            Rule <code className="text-core-400">de-staging-refresh-dev</code>,{' '}
            <code className="text-core-400">rate(1 hour)</code>, target Lambda that copies subset from prod
            snapshot to dev bucket — acceptable drift in non-prod; not for prod SLA paths.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Pre-flight health check">
          <p className="text-slate-300">
            Rule <code className="text-core-400">de-pre-etl-guard</code>,{' '}
            <code className="text-core-400">cron(45 1 * * ? *)</code>, target Lambda verifying vendor file
            count and RDS snapshot age — fails SNS before 02:00 main job if upstream is not ready.
          </p>
        </ContentStep>
        <Flowchart
          title="Nightly DE schedule timeline (UTC)"
          chart={`flowchart LR
  T1[01:45 pre-flight Lambda]
  T2[02:00 main Step Functions]
  T3[02:15 staggered Glue workflow]
  T4[03:00 Redshift COPY window]
  T1 --> T2
  T2 --> T3
  T3 --> T4`}
        />
      </LessonSection>

      <LessonSection title="Scheduled rules vs event-based — choosing">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Prefer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Vendor drops files unpredictably', 'Event-based S3 Object Created rule'],
                ['Fixed nightly warehouse load after known cutoff', 'Scheduled cron rule'],
                ['Late files after nightly batch', 'Both — cron baseline plus S3 catch-up rule'],
                ['Glue failure alert', 'Event-based Glue state rule, not schedule'],
                ['Dev environment hourly reset', 'Scheduled rate rule'],
              ].map(([scenario, prefer]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{prefer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Mature platforms combine scheduled baseline batch with event-based catch-up — cron at 02:00 processes
          expected load; S3 rules handle stragglers without waiting until tomorrow.
        </Callout>
      </LessonSection>

      <LessonSection title="Operational notes">
        <ContentStep number={1} title="UTC everywhere in code">
          <p className="text-slate-300">
            Document cron in UTC in IaC and runbooks; add local time in parentheses for business stakeholders
            (02:00 UTC = 9:30 PM IST previous day, etc.) to prevent on-call confusion.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Disable during maintenance">
          <p className="text-slate-300">
            Set rule state to DISABLED during schema migrations — faster than deleting targets. Re-enable
            after validation; missed schedules do not backfill automatically unless your target logic handles
            catch-up.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid duplicate schedulers">
          <p className="text-slate-300">
            Pick EventBridge or Glue workflow scheduled trigger for the same job — not both at identical cron
            unless intentionally redundant with idempotent jobs. Double fire wastes DPU and corrupts
            non-idempotent writes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Idempotency">
          <p className="text-slate-300">
            Scheduled runs may overlap if a Glue job exceeds the schedule interval. Use job bookmarks, partition
            overwrite modes, or Step Functions concurrency limits so hourly rate rules do not stack destructive
            concurrent writes.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scheduled rules use rate(…) for simple intervals or cron(…) for fixed UTC windows — no event pattern.',
          'DE staples: cron(0 2 * * ? *) for nightly lake build; staggered crons for dependent Glue workflows; rate for dev refresh.',
          'Combine scheduled baseline with event-based S3 catch-up for vendors with unpredictable delivery.',
          'Document UTC, disable rules during maintenance, avoid duplicate Glue + EventBridge schedules on the same job.',
        ]}
      />
    </LessonArticle>
  )
}
