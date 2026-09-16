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

export function DynamodbInPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="DynamoDB is glue in the pipeline — not just an app database">
        Beyond serving live traffic, data engineering teams use DynamoDB as a{' '}
        <strong className="text-white">state store</strong>,{' '}
        <strong className="text-white">control plane</strong>, and{' '}
        <strong className="text-white">CDC source</strong> in lake architectures. Low-latency keyed reads/writes,
        conditional updates, TTL, and Streams make it the default serverless coordination layer between S3,
        Glue, Lambda, and Step Functions — without standing up RDS for metadata alone.
      </Callout>

      <Definition term="DynamoDB in data pipelines">
        <p>
          Using DynamoDB tables to track pipeline progress (watermarks), gate duplicate work (dedupe), coordinate
          distributed stages (locks), or capture operational changes for lake ingest (Streams CDC). Distinct
          from application domain tables — though the same AWS service and APIs apply.
        </p>
      </Definition>

      <LessonSection title="Pattern 1 — State store">
        <ContentStep number={1} title="Watermarks and run history">
          <p className="text-slate-300">
            PK = <span className="font-mono text-sm">dataset_name</span>, SK ={' '}
            <span className="font-mono text-sm">run_date</span> or{' '}
            <span className="font-mono text-sm">run_id</span>. Attributes: status, last_s3_key, glue_job_run_id,
            row_count, error_message. Step Functions task token or Glue success handler updates row —
            downstream stages Query latest SUCCESS watermark before processing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Feature flags and pipeline config">
          <p className="text-slate-300">
            Small table, high read — Lambda reads config item at cold start (cache with TTL in memory). Toggle
            dataset enablement without redeploying Glue scripts. Conditional writes prevent two ops engineers
            clobbering same config version.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Idempotency ledger">
          <p className="text-slate-300">
            Record processed file hashes or event IDs — conditional PutItem before expensive Glue StartJobRun.
            TTL expires ledger entries after retention window. State store pattern eliminates duplicate lake
            partitions from at-least-once event delivery.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Pattern 2 — Control plane">
        <ContentStep number={1} title="Distributed locks">
          <p className="text-slate-300">
            Only one silver job per dataset at a time — lock item with PK ={' '}
            <span className="font-mono text-sm">LOCK#dataset_name</span>, conditional acquire, heartbeat
            UpdateItem, TTL safety release. Competing schedulers (EventBridge + manual rerun) respect lock —
            prevents concurrent writes to same curated prefix.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration handoff">
          <p className="text-slate-300">
            EventBridge triggers Lambda that writes PENDING row and starts Step Functions with execution name
            derived from PK/SK. Step Functions stages read/update same row — human ops Query GSI on status=FAILED
            for triage dashboard without CloudWatch log diving alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rate limiting and quotas">
          <p className="text-slate-300">
            Token bucket in DynamoDB — increment counter with conditional cap before invoking downstream API
            (vendor pull, cross-account Glue). Serverless alternative to Redis for moderate throughput DE gates.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Pattern 3 — CDC to S3">
        <ContentStep number={1} title="Operational table as lake source">
          <p className="text-slate-300">
            Application DynamoDB table → Streams → Lambda → S3 bronze JSON/Parquet → Glue silver → Redshift/Athena
            gold. DE implements consumer; app team owns key schema. Export to S3 for nightly reconciliation
            alongside stream incremental path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Staging table pattern">
          <p className="text-slate-300">
            Lambda writes validated events to staging DynamoDB table (fast ack to API) — Stream second consumer
            batches to S3 when throughput smoother than direct API → S3. Staging TTL drops after lake commit
            confirmed in watermark state store — two-table split: hot buffer + durable control state.
          </p>
        </ContentStep>
        <Flowchart
          title="Three DynamoDB pipeline roles combined"
          chart={`flowchart TB
  subgraph control [Control plane]
    WM[Watermark table]
    LOCK[Lock table]
    DED[Dedupe table TTL]
  end
  subgraph source [CDC source]
    APP[(App DynamoDB)]
    STR[Streams]
  end
  EB[EventBridge schedule]
  LAM[Lambda gate]
  GLUE[Glue ETL]
  S3[(S3 lake)]
  EB --> LAM
  LAM --> DED
  LAM --> LOCK
  LAM --> GLUE
  GLUE --> WM
  APP --> STR
  STR --> S3
  GLUE --> S3`}
        />
        <Example title="End-to-end ingest gate" caption="State + control + dedupe">
{`1. S3 Object Created → Lambda
2. PutItem dedupe (condition attribute_not_exists) → fail = skip
3. Acquire LOCK#dataset (condition not exists or expired TTL)
4. Update watermark PENDING → Start Glue
5. Glue success → watermark SUCCESS + release lock
6. App orders table (separate) → Streams → S3 bronze in parallel`}
        </Example>
        <Callout variant="insight">
          Separate DE control tables from app domain tables — different IAM, backup, and on-call ownership.
          Control tables are small and Query-heavy; app tables may be TB-scale with Streams consumers.
        </Callout>
      </LessonSection>

      <LessonSection title="Design checklist">
        <ContentStep number={1} title="Keys match access patterns">
          <p className="text-slate-300">
            Query watermark by dataset + date range — not Scan. GSI on status for ops dashboard. Every pipeline
            read path documented before table creation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency everywhere">
          <p className="text-slate-300">
            Conditional writes on state transitions; dedupe before side effects; stream consumer idempotent S3
            keys. At-least-once is guaranteed — exactly-once semantics are engineered, not default.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Observability">
          <p className="text-slate-300">
            CloudWatch alarms on throttling, stream IteratorAge, conditional failure rate spikes. Watermark
            table GSI query for FAILED rows feeds daily ops standup — DynamoDB as operational dashboard backend.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'State store: watermarks, run history, idempotency ledger — keyed Query, conditional updates, TTL cleanup.',
          'Control plane: distributed locks, orchestration handoff, rate limits — coordinates Glue and Step Functions.',
          'CDC to S3: Streams + Lambda from app tables; staging table + TTL for burst buffering before lake.',
          'Keep DE control tables separate from app domain tables — IAM, scale, and ownership differ.',
          'Combine dedupe + lock + watermark in ingest gate; parallel Streams path for operational data to bronze.',
        ]}
      />
    </LessonArticle>
  )
}
