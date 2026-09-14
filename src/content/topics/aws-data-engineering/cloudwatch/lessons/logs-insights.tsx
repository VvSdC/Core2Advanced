import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LogsInsights() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Metrics tell you something broke — Logs Insights tells you why">
        CloudWatch Alarms on Lambda <span className="font-mono text-sm">Errors</span> or Glue job failure
        metrics wake you at 2 AM. <strong className="text-white">Logs Insights</strong> is the query
        language that searches structured log lines across log groups in seconds — the first tool a data
        engineer reaches for after an alarm fires on an ingest or transform pipeline.
      </Callout>

      <Definition term="CloudWatch Logs Insights">
        <p>
          <strong className="text-white">Logs Insights</strong> runs SQL-like queries against CloudWatch
          Log groups without exporting to S3 or spinning up Athena. It parses fields from JSON logs,
          aggregates counts, filters by time range, and returns results in the console or via API — ideal
          for ad hoc debugging during pipeline incidents.
        </p>
      </Definition>

      <LessonSection title="How Insights fits the DE observability stack">
        <ContentStep number={1} title="Log groups per service">
          <p className="text-slate-300">
            Lambda writes to <span className="font-mono text-sm">/aws/lambda/ingest-handler</span>. Glue
            jobs emit to <span className="font-mono text-sm">/aws-glue/jobs/output</span> and error streams.
            Step Functions log execution history to their own groups. Insights can query one group or many
            in a single run — correlate a failed Glue start from Lambda with the downstream Spark stack trace.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query language mental model">
          <p className="text-slate-300">
            Start with <span className="font-mono text-sm">fields</span> to project columns,{' '}
            <span className="font-mono text-sm">filter</span> to narrow rows,{' '}
            <span className="font-mono text-sm">stats</span> to aggregate, and{' '}
            <span className="font-mono text-sm">sort</span> to rank. Auto-discovered fields appear when
            logs are JSON; plain text logs rely on{' '}
            <span className="font-mono text-sm">parse @message</span> patterns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Saved queries and dashboards">
          <p className="text-slate-300">
            Pin recurring queries — error rate by function name, top 10 Glue OOM messages, DLQ replay
            audit trail. Wire Insights widgets into CloudWatch dashboards for ops standups without opening
            each log group manually.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Finding errors in Lambda-style logs">
        <Definition term="@message and structured JSON">
          <p>
            Lambda default format includes <span className="font-mono text-sm">REPORT</span>,{' '}
            <span className="font-mono text-sm">START</span>, and <span className="font-mono text-sm">END</span>{' '}
            lines plus your <span className="font-mono text-sm">logger.info</span> output in{' '}
            <span className="font-mono text-sm">@message</span>. Structured JSON logs let Insights auto-extract{' '}
            <span className="font-mono text-sm">event</span>, <span className="font-mono text-sm">key</span>, and{' '}
            <span className="font-mono text-sm">request_id</span> fields — filter without regex when possible.
          </p>
        </Definition>
        <Example title="Count Lambda errors in the last hour">
{`fields @timestamp, @message
| filter @message like /ERROR|Exception|Task timed out/
| stats count() as error_count by bin(5m)`}
        </Example>
        <Example title="Top failing S3 keys from structured ingest logs">
{`fields @timestamp, key, event, @message
| filter event = "ingest_failed" or @message like /ClientError/
| stats count() as failures by key
| sort failures desc
| limit 20`}
        </Example>
        <Example title="Lambda duration outliers (REPORT lines)">
{`filter @type = "REPORT"
| fields @requestId, @duration, @billedDuration, @maxMemoryUsed
| filter @duration > 10000
| sort @duration desc
| limit 50`}
        </Example>
        <Callout variant="tip" title="DE habit">
          Include <span className="font-mono text-sm">context.aws_request_id</span> and the S3{' '}
          <span className="font-mono text-sm">key</span> in every log line from ingest handlers — Insights
          queries become one-liners instead of regex archaeology across plain text.
        </Callout>
      </LessonSection>

      <LessonSection title="Finding errors in Glue-style logs">
        <ContentStep number={1} title="Glue log group layout">
          <p className="text-slate-300">
            Spark driver logs land in <span className="font-mono text-sm">/aws-glue/jobs/output</span>;
            continuous logging may also stream to CloudWatch during the run. Search for{' '}
            <span className="font-mono text-sm">AnalysisException</span>,{' '}
            <span className="font-mono text-sm">OutOfMemoryError</span>, partition path mismatches, and
            bookmark skew messages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Correlate job run ID">
          <p className="text-slate-300">
            Glue logs often include <span className="font-mono text-sm">JobRunId</span>. Filter Insights
            on that ID after pulling it from the Glue console or the Lambda that called{' '}
            <span className="font-mono text-sm">start_job_run</span> — isolate one failed nightly batch
            among hundreds of concurrent runs.
          </p>
        </ContentStep>
        <Example title="Glue ERROR and Exception lines">
{`fields @timestamp, @message
| filter @message like /ERROR|Exception|AnalysisException|OutOfMemory/
| sort @timestamp desc
| limit 100`}
        </Example>
        <Example title="Parse Glue job name from log prefix">
{`parse @message /JobName=(?<jobName>[^ ]+)/
| filter jobName = "curated-daily-transform"
| filter @message like /FAILED/
| display @timestamp, @message`}
        </Example>
      </LessonSection>

      <LessonSection title="Query patterns for pipeline ops">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Insights approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Sudden Lambda error spike', 'stats count() by bin(1m), filter ERROR, compare to baseline window'],
                ['Single bad vendor file', 'filter key or prefix, sort @timestamp, read first exception'],
                ['Glue schema drift', 'filter AnalysisException or cannot resolve column, group by @message'],
                ['Timeout vs OOM', 'REPORT @duration near timeout vs Glue OutOfMemory in same JobRunId'],
                ['DLQ replay audit', 'filter event = "dlq_replay" in replay Lambda logs, stats by operator'],
              ].map(([scenario, approach]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{approach}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Insights queries are charged per scanned GB — narrow time ranges and log groups before scanning
          30 days of verbose DEBUG logs across the whole account. Start with the alarm timestamp ±15 minutes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Logs Insights queries CloudWatch Log groups with fields, filter, stats, and sort — no export required.',
          'Structured JSON logs (key, event, request_id) make Lambda/Glue error hunts fast; plain text needs parse.',
          'Lambda: filter ERROR/Exception, parse REPORT lines for duration outliers; include aws_request_id.',
          'Glue: search /aws-glue/jobs/output for AnalysisException, OOM, and filter by JobRunId.',
          'Save recurring queries for error counts and top failing keys; narrow time range to control scan cost.',
        ]}
      />
    </LessonArticle>
  )
}
