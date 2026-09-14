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

export function DashboardsBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One screen, whole pipeline">
        Alarms wake you when something breaks. <strong className="text-white">Dashboards</strong> show
        whether the pipeline looks healthy during the day — invocations trending up, errors flat at zero,
        Glue jobs finishing on schedule. CloudWatch dashboards are free-form grids of graphs, numbers, and
        log widgets you share with the team so nobody hunts through five AWS consoles every morning.
      </Callout>

      <Definition term="CloudWatch dashboard">
        <p>
          A <strong className="text-white">CloudWatch dashboard</strong> is a named collection of widgets
          — line graphs, stacked areas, single-value numbers, text notes, and alarm status tiles — arranged
          on a page in the CloudWatch console or embedded via API. Widgets query metrics and logs from your
          account (or cross-account with setup) and refresh automatically on a interval you choose.
        </p>
      </Definition>

      <LessonSection title="Why dashboards matter for data engineering">
        <ContentStep number={1} title="Situational awareness">
          <p className="text-slate-300">
            Before standup, open one dashboard instead of clicking Lambda → Metrics, Glue → Runs, S3 →
            Metrics separately. Spot &quot;errors up, invocations flat&quot; — a sign uploads stopped — in
            seconds.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shared truth">
          <p className="text-slate-300">
            Pin the same dashboard URL in Slack or the team wiki. New engineers see the same graphs veterans
            use during incidents — no tribal knowledge about which function name to search.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Trends alarms miss">
          <p className="text-slate-300">
            Duration creeping from 200 ms to 2 s over two weeks does not page anyone until timeout — but the
            dashboard line slopes upward and prompts right-sizing memory or file-size limits before a outage.
          </p>
        </ContentStep>
        <Flowchart
          title="Dashboard in daily ops"
          chart={`flowchart LR
  AM[Morning standup]
  AM --> D[Open DE pipeline dashboard]
  D --> H{Errors flat? Invocations expected?}
  H -->|Yes| GO[Proceed with deploys]
  H -->|No| INV[Drill into logs or alarms]
  INV --> FIX[Fix before business impact]`}
        />
      </LessonSection>

      <LessonSection title="Widget types you will use">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Widget</th>
                <th className="px-4 py-3">Shows</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Line graph', 'Metric over time', 'Lambda Duration p99 last 24 hours'],
                ['Stacked area', 'Multiple metrics layered', 'Invocations vs Errors on same axis'],
                ['Number', 'Single latest statistic', 'Total Glue job failures today'],
                ['Alarm status', 'Current alarm state tiles', 'Red/green for ingest-errors and glue-failure alarms'],
                ['Text / markdown', 'Runbook links and notes', 'Link to reprocess runbook and on-call rotation'],
                ['Logs table', 'Recent log query results', 'Last 20 ERROR lines from ingest log group — advanced'],
              ].map(([widget, shows, example]) => (
                <tr key={widget} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{widget}</td>
                  <td className="px-4 py-3">{shows}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Build from metrics you already alarm on">
          If you created an Errors alarm on <code className="text-core-400">de-s3-ingest-validator-dev</code>,
          add the same metric to the dashboard as a graph. Alarms and dashboards should tell a consistent
          story — not different function names on each screen.
        </Callout>
      </LessonSection>

      <LessonSection title="What a DE dashboard might show">
        <p className="text-slate-300">
          A beginner pipeline dashboard for a lake ingest path (S3 → Lambda → Glue → curated) might organize
          widgets in rows by stage:
        </p>
        <ContentStep number={1} title="Row 1 — Ingest Lambda (edge)">
          <p className="text-slate-300">
            Graphs: <code className="text-core-400">Invocations</code> (Sum, 1 h),{' '}
            <code className="text-core-400">Errors</code> (Sum, 1 h),{' '}
            <code className="text-core-400">Duration</code> (Average and p99). Number widget: concurrent
            executions now. Alarm tile: <code className="text-core-400">ingest-dev-errors</code> state.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Row 2 — Glue batch (core ETL)">
          <p className="text-slate-300">
            Graphs: job run success vs failure count, elapsed time for{' '}
            <code className="text-core-400">orders-etl-nightly</code>, DPU hours (cost signal). Text widget:
            expected completion window 02:00–04:00 UTC.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Row 3 — Storage signal (optional)">
          <p className="text-slate-300">
            If S3 request metrics enabled: <code className="text-core-400">PutRequests</code> to the raw
            prefix bucket — confirms upstream producers still writing even before Lambda processes files.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Row 4 — Runbook and context">
          <p className="text-slate-300">
            Markdown widget: links to log group, SNS topic, reprocess CLI commands, and &quot;who owns this
            pipeline&quot; — turns the dashboard into an incident starting point, not just pretty graphs.
          </p>
        </ContentStep>
        <Example title="Sample dashboard layout" caption="Logical widget grid">
{`┌─────────────────────────────────────────────────────────┐
│  INGEST LAMBDA                                          │
│  [Invocations graph] [Errors graph] [Duration p99]      │
│  [Alarm: ingest-errors]  [ConcurrentExecutions number]  │
├─────────────────────────────────────────────────────────┤
│  GLUE NIGHTLY                                           │
│  [Job success/fail] [Elapsed time] [DPU hours]          │
├─────────────────────────────────────────────────────────┤
│  [S3 PutRequests]  [Runbook text + log group links]     │
└─────────────────────────────────────────────────────────┘`}
        </Example>
        <Flowchart
          title="Pipeline stages on one dashboard"
          chart={`flowchart LR
  subgraph D["Dashboard widgets"]
    W1[Lambda ingest metrics]
    W2[Glue job metrics]
    W3[S3 put rate]
    W4[Alarm status tiles]
  end
  S3[S3 raw uploads] --> W3
  S3 --> W1
  W1 --> W2
  W4 --> W1
  W4 --> W2`}
        />
      </LessonSection>

      <LessonSection title="Building and sharing — practical tips">
        <ContentStep number={1} title="Start from automatic dashboard">
          <p className="text-slate-300">
            Lambda console offers a prebuilt monitoring dashboard per function — clone useful widgets into
            your team dashboard, then add Glue and cross-service graphs. Faster than empty canvas on day one.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Time range and timezone">
          <p className="text-slate-300">
            Set default range to Last 24 hours or This week for batch pipelines. Align with UTC or your team
            timezone so &quot;the dip at 2 a.m.&quot; matches the Glue schedule everyone references.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Naming and environments">
          <p className="text-slate-300">
            Separate dashboards for <code className="text-core-400">pipeline-dev</code> and{' '}
            <code className="text-core-400">pipeline-prod</code> — same layout, different function names and
            alarm tiles — avoids mixing test invocations with production traffic in one graph.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Dashboards complement alarms">
          <p className="text-slate-300">
            Dashboards do not replace alarms — they reduce surprise during daylight and help post-incident
            review (&quot;show me the last 6 hours when we reprocessed&quot;). Pair both on every critical
            path.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Executives rarely open CloudWatch — export a weekly screenshot or wire key number widgets to a
          status page if needed. For the DE team, the dashboard is the daily health check; for leadership,
          derive one KPI (e.g. successful nightly job runs / 7) from the same metrics.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Dashboards combine metric graphs, numbers, alarm tiles, and notes on one shared screen for pipeline health.',
          'A DE dashboard typically shows ingest Lambda (invocations, errors, duration), Glue job outcomes, and optional S3 traffic.',
          'Use trends for slow degradation; use alarms for immediate failures — dashboards and alarms work together.',
          'Clone Lambda auto-dashboards to start fast; split dev and prod dashboards to avoid mixed signals.',
        ]}
      />
    </LessonArticle>
  )
}
