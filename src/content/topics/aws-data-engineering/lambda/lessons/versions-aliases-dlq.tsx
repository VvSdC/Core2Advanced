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

export function VersionsAliasesDlq() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Ship safely — rollback when ingest breaks">
        Publishing a bad Lambda handler can corrupt every file in landing.{' '}
        <strong className="text-white">Versions</strong> and <strong className="text-white">aliases</strong>{' '}
        let you deploy, test, and roll back. <strong className="text-white">Dead Letter Queues</strong>{' '}
        capture events Lambda cannot process after retries — essential visibility for pipeline ops.
      </Callout>

      <Definition term="Lambda version">
        <p>
          Each publish creates an immutable <strong className="text-white">version</strong> ($LATEST is
          mutable; numbered versions are snapshots). Triggers can point at version 7 while you iterate on
          $LATEST. DE teams publish after CI passes; production aliases reference stable version numbers
          — not $LATEST.
        </p>
      </Definition>

      <Definition term="Lambda alias">
        <p>
          An <strong className="text-white">alias</strong> (e.g. <span className="font-mono text-sm">prod</span>,{' '}
          <span className="font-mono text-sm">staging</span>) is a pointer to a version with optional{' '}
          <strong className="text-white">weighted routing</strong> — 90% version 12, 10% version 13 for
          canary. EventBridge rules and Step Functions should target alias ARNs so rollback is changing
          the alias weight, not every downstream integration.
        </p>
      </Definition>

      <Definition term="Dead Letter Queue (DLQ)">
        <p>
          For <strong className="text-white">asynchronous</strong> invokes and Event Source Mapping failures,
          a DLQ (typically SQS) stores the failed event payload after retries exhaust. Operators replay
          from DLQ after fixing schema bugs — without re-uploading source files from partners.
        </p>
      </Definition>

      <LessonSection title="Versions and aliases in pipeline CI/CD">
        <ContentStep number={1} title="Publish on merge">
          <p className="text-slate-300">
            CI deploys code → <span className="font-mono text-sm">PublishVersion</span> → version N.
            Staging alias moves to N; integration tests run against staging S3 prefix. Prod alias
            shifts after sign-off.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Canary ingest handler">
          <p className="text-slate-300">
            Route 5% of S3 events (via EventBridge or dual notification) to canary alias on new version.
            Compare error rates in CloudWatch; shift prod alias to 100% when metrics match baseline.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rollback in minutes">
          <p className="text-slate-300">
            Bad deploy misroutes parquet columns → spike in Glue job failures. Point{' '}
            <span className="font-mono text-sm">prod</span> alias back to version N-1 — no redeploy of
            old code needed if version still exists.
          </p>
        </ContentStep>
        <Flowchart
          title="Alias-based deploy"
          chart={`flowchart LR
  CI[CI publish version N]
  CI --> STG[staging alias to N]
  STG --> TEST[Integration tests]
  TEST --> PROD[prod alias to N]
  PROD --> ROLL[rollback repoint alias to N minus 1]`}
        />
      </LessonSection>

      <LessonSection title="DLQ and retry behavior">
        <ContentStep number={1} title="Async invoke retries">
          <p className="text-slate-300">
            Asynchronous invocations retry twice by default (three attempts total) with backoff between
            1 minute and 2 hours. Unhandled exceptions or timeouts count as failures. Configure{' '}
            <span className="font-mono text-sm">MaximumRetryAttempts</span> (0–2) per function.
          </p>
        </ContentStep>
        <ContentStep number={2} title="ESM retries">
          <p className="text-slate-300">
            SQS/Kinesis ESM retries until batch succeeds or hits{' '}
            <span className="font-mono text-sm">MaximumRetryAttempts</span> / bisect isolates poison pill.
            <span className="font-mono text-sm">OnFailure</span> destination sends failed batch metadata
            to SQS/SNS/Lambda — parallel concept to DLQ.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DLQ wiring">
          <p className="text-slate-300">
            Set <span className="font-mono text-sm">DeadLetterConfig</span> TargetArn to{' '}
            <span className="font-mono text-sm">ingest-lambda-dlq</span> SQS queue. CloudWatch alarm on{' '}
            <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible</span> pages on-call.
            Replay tool reads DLQ, re-invokes with fixed handler version.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Error handling basics">
          <p className="text-slate-300">
            Distinguish <strong className="text-white">retryable</strong> (S3 503, Glue throttling) vs{' '}
            <strong className="text-white">non-retryable</strong> (schema mismatch). For non-retryable,
            catch, log structured error, write quarantine manifest to S3, return success to avoid infinite
            retries — or fail fast to DLQ for manual triage.
          </p>
        </ContentStep>
        <Example title="DLQ config sketch (CloudFormation fragment)">
{`DeadLetterConfig:
  TargetArn: arn:aws:sqs:us-east-1:123456789012:ingest-lambda-dlq
MaximumRetryAttempts: 2`}
        </Example>
        <Callout variant="tip">
          Sync invokes (Step Functions) do not use Lambda DLQ — Step Functions owns retry/catch on the Task
          state. Configure both layers for hybrid orchestrations.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Versions are immutable snapshots; aliases (prod/staging) point triggers at stable code — never bind production to $LATEST.',
          'Weighted aliases enable canary deploys of ingest handlers before full prod cutover.',
          'Async invoke retries up to 3 times by default; then failed events go to DLQ if configured.',
          'ESM uses OnFailure destinations and bisect-on-error — complement with SQS DLQ for ops replay.',
          'Classify retryable vs non-retryable errors — avoid infinite retries on bad schema; use quarantine + DLQ visibility.',
        ]}
      />
    </LessonArticle>
  )
}
