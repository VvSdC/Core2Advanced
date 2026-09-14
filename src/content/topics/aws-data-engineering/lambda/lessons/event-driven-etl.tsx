import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventDrivenEtl() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="From file drop to curated table — events drive the chain">
        Modern lake ingest is <strong className="text-white">event-driven</strong>: a file lands, events
        propagate, Lambda validates and orchestrates, Glue transforms at scale, catalog updates, and
        Athena or Redshift serve analysts. This lesson walks the end-to-end story and marks where Lambda
        stops and Glue or EC2 must take over.
      </Callout>

      <Definition term="Event-driven ETL">
        <p>
          <strong className="text-white">Event-driven ETL</strong> reacts to state changes (S3 ObjectCreated,
          schedule tick, queue message, DynamoDB stream record) instead of polling on fixed cron only.
          Components are loosely coupled — each stage scales independently, retries are localized, and
          new consumers subscribe without rewriting upstream producers.
        </p>
      </Definition>

      <LessonSection title="End-to-end story — vendor file to dashboard">
        <ContentStep number={1} title="Landing">
          <p className="text-slate-300">
            Vendor SFTP/sync writes <span className="font-mono text-sm">s3://lake/landing/vendor=acme/dt=2026-03-15/file.csv</span>.
            S3 emits ObjectCreated → SQS (buffer) → Lambda ESM batch of 10.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Validate and ledger">
          <p className="text-slate-300">
            Lambda checks headers, row count sanity, virus scan hook if required. Writes status to
            DynamoDB <span className="font-mono text-sm">ingest_ledger</span> with conditional put (idempotent).
            On success, copies to <span className="font-mono text-sm">raw/</span> and starts Step Functions
            execution with partition metadata.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Orchestrate transform">
          <p className="text-slate-300">
            Step Functions: Lambda task starts Glue job with arguments → Wait for Glue job status (callback
            or poll with backoff) → Lambda runs Athena row-count check on output prefix → Lambda triggers
            Redshift COPY for gold table slice → SNS notify Slack #data-ops.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Catalog and serve">
          <p className="text-slate-300">
            Glue crawler or job writes catalog partition; analysts query Athena on curated; dashboard reads
            Redshift gold. Failure at any step routes to DLQ + PagerDuty via EventBridge rule on Step
            Functions FAILED state.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Architecture flowchart">
        <Flowchart
          title="Event-driven ETL on Lambda"
          chart={`flowchart TB
  VENDOR[Vendor drop]
  VENDOR --> LAND[S3 landing]
  LAND --> SQS[SQS buffer]
  SQS --> ESM[Lambda ESM ingest]
  ESM --> DDB[DynamoDB ledger]
  ESM --> RAW[S3 raw]
  ESM --> SF[Step Functions]
  SF --> L1[Lambda start Glue]
  L1 --> GLUE[Glue Spark ETL]
  GLUE --> CUR[S3 curated Parquet]
  GLUE --> CAT[Glue Catalog]
  SF --> L2[Lambda Athena sanity]
  SF --> L3[Lambda Redshift COPY trigger]
  CUR --> ATH[Athena SQL]
  CUR --> RS[Redshift gold]
  SF -->|fail| DLQ[SQS DLQ plus alert]
  ATH --> BI[QuickSight]
  RS --> BI`}
        />
      </LessonSection>

      <LessonSection title="Lambda limits — when to hand off">
        <Definition term="15-minute hard timeout">
          <p>
            Lambda maximum execution time is <strong className="text-white">15 minutes</strong> — not
            configurable higher. Any single step exceeding this (large file parse, waiting for Glue,
            bulk COPY orchestration with tight polling) must move to Step Functions wait states, async
            callbacks, or a different compute tier.
          </p>
        </Definition>
        <ContentStep number={1} title="Hand off to Glue when">
          <p className="text-slate-300">
            Transform needs Spark distributed shuffle, job bookmarks over millions of files, or runtime
            beyond 15 minutes. Lambda starts the job; Glue owns the transform. Do not embed pandas
            full-table joins on terabyte datasets in Lambda.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hand off to EC2/Fargate when">
          <p className="text-slate-300">
            Custom libraries Glue lacks, GPU processing, or long-running Airflow/Celery workers. Lambda
            enqueues work to SQS; EC2 ASG workers drain the queue. Lambda remains the event edge only.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stay on Lambda when">
          <p className="text-slate-300">
            Per-file validation under a few minutes, metadata writes, StartJobRun, lightweight format
            conversion on small files, partition repair SQL, webhook adapters, scheduled housekeeping.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">Move to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Single file/process > 15 min', 'Glue job or EC2 worker'],
                ['Needs Spark shuffle / large join', 'Glue or EMR'],
                ['Working set > 10 GB RAM or /tmp', 'Glue or EC2'],
                ['Steady 24/7 high CPU', 'EC2 ASG or Fargate — cost model'],
                ['Per-object validate + trigger', 'Lambda — ideal fit'],
              ].map(([signal, move]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{signal}</td>
                  <td className="px-4 py-3">{move}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Interview narrative: &quot;Lambda is my event edge and orchestration glue — Spark scale belongs in
          Glue; I use Step Functions to bridge the 15-minute gap and handle retries across services.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event-driven ETL: S3 landing → SQS buffer → Lambda validate → Step Functions → Glue → curated → serve.',
          'Lambda owns idempotent ingest, ledger updates, and job orchestration — not terabyte Spark transforms.',
          '15-minute timeout is hard — use Step Functions for long waits; Glue/EC2 for heavy compute.',
          'DLQ + Step Functions error handling + EventBridge alerts give ops visibility across the chain.',
          'Hand off to Glue when you need bookmarks, shuffle, or >15 min; hand off to EC2 for custom long-running workers.',
        ]}
      />
    </LessonArticle>
  )
}
