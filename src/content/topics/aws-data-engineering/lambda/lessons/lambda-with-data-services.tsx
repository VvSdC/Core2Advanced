import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LambdaWithDataServices() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda is the glue between lake services">
        A production data platform connects S3, Glue, Athena, DynamoDB, and Step Functions.{' '}
        <strong className="text-white">Lambda</strong> is the short-lived compute that reacts to events,
        starts jobs, runs lightweight transforms, and coordinates multi-step pipelines — without
        operating EC2 workers for every trigger.
      </Callout>

      <Definition term="Lambda as orchestration edge">
        <p>
          In mature DE architectures, Lambda rarely replaces Spark — it{' '}
          <strong className="text-white">validates, routes, and triggers</strong>. Read a landing object,
          check schema, write manifest, call <span className="font-mono text-sm">glue:StartJobRun</span>,
          or advance a Step Functions workflow. Heavy transforms stay in Glue; Lambda owns the thin
          event-driven layer.
        </p>
      </Definition>

      <LessonSection title="Integration patterns by service">
        <ContentStep number={1} title="Lambda + S3">
          <p className="text-slate-300">
            Trigger on ObjectCreated; use <span className="font-mono text-sm">head_object</span> for
            metadata; stream small files; copy or transform to raw/. Generate success marker files{' '}
            <span className="font-mono text-sm">_SUCCESS</span> for downstream partition discovery. IAM:
            scoped GetObject/PutObject on prefix ARNs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda + Glue">
          <p className="text-slate-300">
            After validation, call <span className="font-mono text-sm">StartJobRun</span> with job name
            and arguments (source path, partition date). Poll optional via Step Functions, not blocking
            Lambda sleep loops. Pass job bookmark-compatible paths so Glue incremental logic aligns with
            ingest dedupe keys.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda + Athena">
          <p className="text-slate-300">
            Run <span className="font-mono text-sm">StartQueryExecution</span> for lightweight checks —
            row count sanity, duplicate detection on small samples. Poll{' '}
            <span className="font-mono text-sm">GetQueryExecution</span> until SUCCEEDED; read results
            from S3 output location. Avoid large scans in Lambda — use partition-filtered SQL only.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Lambda + DynamoDB">
          <p className="text-slate-300">
            Track ingest state: file key → status (pending/processed/failed). Conditional writes prevent
            duplicate processing. Stream → Lambda for CDC export to S3 JSON Lines in raw/. On-demand
            billing suits sporadic pipeline metadata.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Lambda + Step Functions">
          <p className="text-slate-300">
            Step Functions invokes Lambda for discrete steps (validate, notify, branch on JSON result).
            Lambda starts Step Functions execution for multi-hour Glue + Redshift COPY chains. Each Lambda
            step stays under 15 minutes; the state machine owns long-running waits.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Event-driven ETL architecture">
        <Flowchart
          title="Lambda-centric lake ingest"
          chart={`flowchart TB
  PARTNER[Partner SFTP or API]
  PARTNER --> LAND[S3 landing]
  LAND --> L1[Lambda validate]
  L1 --> DDB[DynamoDB ingest ledger]
  L1 --> RAW[S3 raw]
  L1 --> SF[Step Functions workflow]
  SF --> L2[Lambda start Glue]
  L2 --> GLUE[Glue ETL job]
  GLUE --> CUR[S3 curated Parquet]
  GLUE --> CAT[Glue Data Catalog]
  CUR --> ATH[Athena ad hoc SQL]
  CUR --> RS[Redshift COPY]
  SF --> L3[Lambda notify Slack]`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service</th>
                <th className="px-4 py-3">Lambda role</th>
                <th className="px-4 py-3">Glue/EC2 alternative</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['S3', 'Event react, copy, lightweight transform', 'EC2 cron sync scripts'],
                ['Glue', 'StartJobRun, pass parameters', 'Glue triggers alone (no pre-validation)'],
                ['Athena', 'Sanity queries, partition repair', 'Scheduled Athena in Airflow'],
                ['DynamoDB', 'State ledger, stream CDC to S3', 'Glue streaming job'],
                ['Step Functions', 'Step worker, execution starter', 'Airflow/MWAA DAG tasks'],
              ].map(([svc, role, alt]) => (
                <tr key={svc} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{svc}</td>
                  <td className="px-4 py-3">{role}</td>
                  <td className="px-4 py-3">{alt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Split IAM roles per integration surface — an S3-only ingest Lambda should not carry Athena and
          Redshift permissions &quot;for later.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda connects lake services at the event edge — validate S3 landing, ledger in DynamoDB, orchestrate via Step Functions.',
          'Glue StartJobRun from Lambda is the standard handoff from thin ingest to Spark transform.',
          'Athena from Lambda suits small partition-scoped sanity checks — not full-table scans.',
          'DynamoDB tracks idempotent ingest state; streams enable CDC export to raw S3.',
          'Step Functions + Lambda chains multi-step ETL while respecting the 15-minute Lambda cap per step.',
        ]}
      />
    </LessonArticle>
  )
}
