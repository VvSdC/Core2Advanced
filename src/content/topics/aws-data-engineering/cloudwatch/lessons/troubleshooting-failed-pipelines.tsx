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

export function TroubleshootingFailedPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="3 AM: alarm fired — follow a runbook, not panic">
        Pipeline failures in AWS DE stacks rarely need guessing. A repeatable path —{' '}
        <strong className="text-white">alarm → metrics context → logs → Insights → root cause → fix/retry</strong>{' '}
        — resolves most Lambda ingest breaks, Glue transform failures, and S3 permission issues. This lesson
        is the operational playbook you attach to every CloudWatch alarm description.
      </Callout>

      <Definition term="Incident triage for data pipelines">
        <p>
          <strong className="text-white">Triage</strong> narrows blast radius first: which stage (landing,
          raw, curated), which vendor or job, since when, and whether DLQ holds poison payloads. Only then
          dive into stack traces. Skipping scope costs hours reading irrelevant Glue logs from unrelated jobs.
        </p>
      </Definition>

      <LessonSection title="Step-by-step runbook">
        <ContentStep number={1} title="Alarm — read the signal">
          <p className="text-slate-300">
            Note alarm name, metric, threshold, state change time, and dimension (FunctionName, QueueName).
            Open linked dashboard widget — is this isolated spike or sustained breach? Check recent deploys
            (Lambda version publish, Glue script change) within 30 minutes of alarm — regressions dominate
            night pages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Metrics context — widen the lens">
          <p className="text-slate-300">
            Same time window: correlated metrics — Errors with Invocations drop (upstream stopped?), Throttles
            with IteratorAge (Kinesis lag), DLQ depth with Lambda errors (poison batch). Step Functions
            execution list filtered FAILED at timestamp. Glue console job runs sorted by start time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Logs — raw text">
          <p className="text-slate-300">
            Open log group for failing resource: <span className="font-mono text-sm">/aws/lambda/ingest-handler</span>,{' '}
            <span className="font-mono text-sm">/aws-glue/jobs/output</span>. Filter time range ±15 min around
            alarm. Search request ID from Step Functions execution input if orchestrated. Pull one full
            stack trace — not just first ERROR line.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Logs Insights — aggregate">
          <p className="text-slate-300">
            Run saved query: error count by bin, top @message patterns, filter by S3 key or JobRunId. Compare
            to prior day same hour — new error string vs recurring vendor schema issue. Export few sample
            lines to ticket for dev handoff if fix needs code change.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Root cause — classify">
          <p className="text-slate-300">
            Bucket: code bug, data quality, IAM/permission, capacity/throttle, config/env drift, upstream
            outage. Document which — postmortems and alarm tuning depend on category not &quot;Glue broke.&quot;
          </p>
        </ContentStep>
        <ContentStep number={6} title="Fix and retry">
          <p className="text-slate-300">
            Roll back Lambda alias, patch Glue script, fix IAM policy, scale concurrency, or replay DLQ
            after schema fix. Verify metric returns OK, DLQ drains, freshness metric recovers. Close with
            alarm OK notification or manual all-clear in Slack.
          </p>
        </ContentStep>
        <Flowchart
          title="Pipeline troubleshooting workflow"
          chart={`flowchart TB
  ALM[Alarm fires SNS]
  ALM --> READ[Read alarm metric dimension time]
  READ --> MET[Correlate dashboard metrics]
  MET --> LOGS[Log group narrow time window]
  LOGS --> INS[Logs Insights aggregate]
  INS --> RC{Root cause class}
  RC -->|code| FIX[Deploy fix or rollback]
  RC -->|data| QUAR[Quarantine vendor replay DLQ]
  RC -->|IAM| POL[Policy role trust fix]
  RC -->|capacity| SCALE[Concurrency DPU scale]
  FIX --> VERIFY[Metrics OK freshness restored]
  QUAR --> VERIFY
  POL --> VERIFY
  SCALE --> VERIFY`}
        />
      </LessonSection>

      <LessonSection title="Common Lambda failure patterns">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely cause</th>
                <th className="px-4 py-3">Fix direction</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Task timed out', 'Large file, slow Glue start poll, VPC ENI cold start', 'Increase timeout, async handoff, reduce work per invoke'],
                ['AccessDenied on S3', 'Execution role missing prefix, KMS key policy', 'IAM policy condition on bucket/prefix; KMS grant'],
                ['Runtime.ImportModuleError', 'Missing layer, wrong architecture', 'Rebuild layer on Amazon Linux; verify deploy package'],
                ['Throttles', 'Account or function concurrency exhausted', 'Reserved concurrency, SQS buffer, account limit increase'],
                ['Duplicate curated writes', 'Non-idempotent handler, at-least-once S3 events', 'Deterministic keys, DynamoDB dedupe ledger'],
              ].map(([symptom, cause, fix]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{symptom}</td>
                  <td className="px-4 py-3">{cause}</td>
                  <td className="px-4 py-3">{fix}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Common Glue and S3 failure patterns">
        <ContentStep number={1} title="Glue">
          <p className="text-slate-300">
            <strong className="text-white">AnalysisException</strong> — schema/column mismatch; compare landing
            sample to catalog. <strong className="text-white">OutOfMemoryError</strong> — raise DPU or push
            filter earlier. <strong className="text-white">Bookmark skew</strong> — reset job bookmark for
            affected prefix after backfill plan. <strong className="text-white">AccessDenied</strong> on S3 —
            job role vs Lake Formation permissions on curated path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3">
          <p className="text-slate-300">
            Intermittent 503 Slow Down — request rate on prefix hot spot; randomize keys or retry with backoff.
            403 on GetObject — role, bucket policy, SCP, or Object Lock legal hold. Event notification gap —
            files land but no Lambda invoke: check EventBridge rule FailedInvocations, notification config on
            correct bucket/prefix.
          </p>
        </ContentStep>
        <Example title="Insights — first query after Lambda error alarm">
{`fields @timestamp, @message
| filter @message like /ERROR|Exception|Task timed out|AccessDenied/
| sort @timestamp desc
| limit 50`}
        </Example>
        <Callout variant="insight">
          Always capture one failing S3 key or Glue JobRunId in the ticket — fixes without reproduction
          metadata get reopened the next night.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Runbook: alarm → metric context → logs → Insights → classify root cause → fix/retry → verify OK.',
          'Scope first: stage, vendor, job, time window, recent deploy — before reading all Glue logs.',
          'Lambda: timeout, AccessDenied, import errors, throttles, idempotency — each has distinct fix path.',
          'Glue: schema AnalysisException, OOM, bookmarks, IAM/LF on curated; S3: 503 prefix heat, 403 policy.',
          'Document JobRunId or S3 key in tickets; link saved Insights queries from alarm descriptions.',
        ]}
      />
    </LessonArticle>
  )
}
