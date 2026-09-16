import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherDynamodb() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="DynamoDB for DE — keys, streams, control plane, and lake CDC">
        You covered partition/sort keys, on-demand capacity, GSIs and LSIs, Query vs Scan, conditional writes,
        Streams and TTL, Streams + Lambda to S3, capacity and hot partitions, single-table overview,
        comparisons with RDS and Redshift, and pipeline patterns. This checkpoint ties intermediate and advanced
        DynamoDB lessons before <strong className="text-white">SQS</strong> — buffering and decoupling high-volume
        landing events from Lambda and Glue consumers.
      </Callout>

      <Definition term="DynamoDB mental model for data engineering">
        <p>
          Amazon DynamoDB is the <strong className="text-white">serverless keyed store</strong> for operational
          scale and pipeline coordination: design access patterns first (Query not Scan), use GSIs for alternate
          lookups, conditional writes for idempotency, Streams + Lambda for CDC to S3, TTL for self-cleaning
          tables, and separate control-plane tables from app domain data — not a warehouse, not a relational
          OLTP replacement for every workload.
        </p>
      </Definition>

      <LessonSection title="DynamoDB sub-topic map">
        <Flowchart
          title="DynamoDB lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[DynamoDB complete path]
  START --> GSI[GSI and LSI]
  START --> QVS[Query vs Scan]
  START --> CW[Conditional writes]
  START --> ST[Streams and TTL]
  START --> SL[Streams plus Lambda]
  START --> CAP[Capacity hot partitions]
  START --> STD[Single table overview]
  START --> VRDS[DynamoDB vs RDS]
  START --> VRS[DynamoDB vs Redshift]
  START --> PIPE[DynamoDB in pipelines]
  GSI --> SQSNEXT
  QVS --> SQSNEXT
  CW --> SQSNEXT
  ST --> SQSNEXT
  SL --> SQSNEXT
  CAP --> SQSNEXT
  STD --> SQSNEXT
  VRDS --> SQSNEXT
  VRS --> SQSNEXT
  PIPE --> SQSNEXT
  SQSNEXT[SQS buffering next]`}
        />
      </LessonSection>

      <LessonSection title="Full DynamoDB checkpoint — can you explain…">
        <ContentStep number={1} title="Keys and indexes">
          <p className="text-slate-300">
            When GSI vs LSI? How alternate access pattern for status-based failed-run lookup? Why GSI write
            amplification matters on ingest-heavy tables?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reads and writes">
          <p className="text-slate-300">
            Query vs Scan cost model? Why FilterExpression does not save Scan RCU? Conditional writes for dedupe
            and optimistic locking? TransactWriteItems when?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Streams, TTL, CDC">
          <p className="text-slate-300">
            Stream view type for MODIFY merges? IteratorAge alarm threshold rationale? TTL precision limits and
            REMOVE events in Streams?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Capacity and design">
          <p className="text-slate-300">
            Hot partition symptoms and sharding fix? On-demand vs provisioned for pipeline control tables?
            Single-table design impact on stream consumer routing?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Architecture comparisons">
          <p className="text-slate-300">
            DynamoDB vs RDS extract tooling? DynamoDB vs Redshift tier roles? Why never Scan prod table for BI?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Pipeline patterns">
          <p className="text-slate-300">
            Watermark + lock + dedupe ingest gate? CDC path to S3 bronze? Separate control tables from app tables?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'GSI vs LSI?',
                  'GSI: new PK/SK anytime, separate capacity. LSI: same PK, different SK, table create only.',
                ],
                [
                  'Why avoid Scan?',
                  'Reads entire table — RCU scales with size; FilterExpression does not reduce read cost.',
                ],
                [
                  'Conditional write use case?',
                  'Dedupe PutItem attribute_not_exists; version guard on watermark status transition.',
                ],
                [
                  'Streams retention?',
                  '~24 hours — alarm IteratorAge; PITR export fills gaps beyond retention.',
                ],
                [
                  'TTL behavior?',
                  'Number epoch attribute; async delete within ~48h; free WCU; not precise scheduler.',
                ],
                [
                  'Streams + Lambda to lake?',
                  'Event source mapping; flatten typed JSON; idempotent S3 keys with sequence number.',
                ],
                [
                  'Hot partition fix?',
                  'Shard suffix on PK; high-cardinality GSI keys; stagger batch writes — not Scan retry.',
                ],
                [
                  'DynamoDB vs RDS ingest?',
                  'DDB: Streams/export. RDS: DMS/JDBC. No SQL joins on DDB source.',
                ],
                [
                  'DynamoDB vs Redshift?',
                  'DDB OLTP source; Redshift OLAP destination — lake mediates, no warehouse Scan on DDB.',
                ],
                [
                  'Single-table DE impact?',
                  'Filter stream by PK prefix; separate S3 landing prefixes; expect denormalized items.',
                ],
                [
                  'Export vs Streams?',
                  'Streams near-real-time incremental; export full/point-in-time snapshot without RCU hit.',
                ],
                [
                  'Control plane patterns?',
                  'Watermarks, locks, dedupe with conditional writes and TTL — separate from app tables.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for SQS when…">
          You can whiteboard DynamoDB Streams → Lambda → S3 bronze, explain Query vs Scan on watermark table,
          and design ingest gate with dedupe + lock + conditional writes — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — SQS">
        <p className="text-slate-300">
          DynamoDB coordinates state and captures changes — but landing zones still receive event bursts that
          overwhelm direct Lambda triggers. <strong className="text-white">Amazon SQS</strong> buffers and
          batches work between EventBridge, S3 notifications, and consumers — pairing naturally with DynamoDB
          control tables (dedupe in DDB, buffer in SQS, process in Glue/Lambda).
        </p>
        <Flowchart
          title="After DynamoDB — course thread"
          chart={`flowchart LR
  DDB[DynamoDB checkpoint]
  SQS[SQS buffering]
  EB[EventBridge]
  LAM[Lambda Glue]
  S3[(S3 lake)]
  DDB -->|watermarks dedupe| LAM
  EB --> SQS
  SQS --> LAM
  LAM --> S3
  DDB -->|Streams CDC| S3
  DDB --> SQS`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, debugging duplicate Glue runs (check conditional writes),
          or sizing stream consumers (IteratorAge) — answers trace to lessons on keys, Scan avoidance, Streams,
          and pipeline patterns covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DynamoDB: keyed OLTP/coordination — Query/GSI access, conditional idempotency, Streams CDC to lake.',
          'Intermediate: GSI/LSI, Query vs Scan, conditional writes, Streams + TTL lifecycle hooks.',
          'Advanced: Streams+Lambda architecture, hot partitions, single-table awareness, RDS/Redshift tiering.',
          'Pipeline roles: state store (watermarks), control plane (locks), CDC source (Streams to S3).',
          'Next sub-topic: SQS — buffer event bursts between orchestration and DynamoDB-gated consumers.',
        ]}
      />
    </LessonArticle>
  )
}
