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

export function PartitionAndSortKeys() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Keys are the whole design">
        In RDS you design tables from entities and JOIN them at query time. In DynamoDB you design the{' '}
        <strong className="text-white">primary key from your access patterns</strong> — how Lambdas and jobs
        will look up data. The <strong className="text-white">partition key</strong> decides where AWS stores
        the item; an optional <strong className="text-white">sort key</strong> lets you store multiple items
        under one partition and query them in order. Get the keys wrong and no index saves you from expensive
        scans.
      </Callout>

      <Definition term="Partition key (PK)">
        <p>
          The <strong className="text-white">partition key</strong> (hash key) is a required attribute that
          uniquely identifies an item in a simple key table, or groups items in a composite key table.
          DynamoDB hashes the partition key value to pick a physical storage partition. All items with the
          same partition key live on the same partition — enabling efficient{' '}
          <code className="text-core-400">Query</code> operations within that key.
        </p>
      </Definition>

      <Definition term="Sort key (SK)">
        <p>
          The <strong className="text-white">sort key</strong> (range key) is an optional second part of the
          primary key. Combined with the partition key, it uniquely identifies an item. Items sharing a
          partition key are stored together, sorted by sort key value — enabling range queries like
          &quot;all runs for job X between date A and date B&quot; without scanning the whole table.
        </p>
      </Definition>

      <LessonSection title="Simple key vs composite key">
        <ContentStep number={1} title="Simple key — one attribute is the whole primary key">
          <p className="text-slate-300">
            Table <code className="text-core-400">de-idempotency-keys</code>: partition key ={' '}
            <code className="text-core-400">event_id</code> (e.g.{' '}
            <code className="text-core-400">acme-lake-prod#raw/orders/file.csv</code>). One item per event;
            <code className="text-core-400">GetItem</code> checks existence — perfect for dedup.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Composite key — PK plus SK together identify the item">
          <p className="text-slate-300">
            Table <code className="text-core-400">de-pipeline-state</code>: PK ={' '}
            <code className="text-core-400">job_id</code>, SK ={' '}
            <code className="text-core-400">run_id</code> or{' '}
            <code className="text-core-400">run_date</code>. Many run history rows under one job; query
            latest runs without a separate history table.
          </p>
        </ContentStep>
        <ContentStep number={3} title="No two items share the same full primary key">
          <p className="text-slate-300">
            Duplicate PK+SK on put overwrites (unless conditional). Design SK values to be unique per logical
            row — timestamps, UUIDs, or incremental run numbers.
          </p>
        </ContentStep>
        <Flowchart
          title="Composite key — one partition, many sort keys"
          chart={`flowchart TB
  PK[Partition job_id orders-nightly]
  PK --> SK1[SK 2026-09-14 status FAILED]
  PK --> SK2[SK 2026-09-15 status SUCCEEDED]
  PK --> SK3[SK 2026-09-16 status RUNNING]
  Q[Query PK equals orders-nightly SK between dates] --> SK2
  Q --> SK3`}
        />
      </LessonSection>

      <LessonSection title="Access patterns drive design">
        <p className="text-slate-300">
          Before creating a table, list every read and write your pipeline needs — in plain English. Each
          pattern must map to <code className="text-core-400">GetItem</code>,{' '}
          <code className="text-core-400">Query</code>, or (last resort){' '}
          <code className="text-core-400">Scan</code> on a key or index. If a pattern does not fit, redesign
          keys or add a GSI (next module).
        </p>
        <ContentStep number={1} title="Write down access patterns first">
          <Example title="DE access pattern worksheet" caption="Before you pick keys">
{`1. Get latest bookmark for job_id (single item, latest run)
2. List last 7 runs for job_id (range by date)
3. Check if s3_key was already processed (exact lookup by key)
4. List all jobs with status RUNNING (different pattern — may need GSI)

Pattern 1–2 → PK=job_id, SK=run_date (Query descending for latest)
Pattern 3 → PK=dedup_key (simple table or SK under vendor prefix)
Pattern 4 → GSI on status (advanced — next lessons)`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="One table per pattern family when starting">
          <p className="text-slate-300">
            Beginners often split idempotency (simple key) from job history (composite key) rather than forcing
            one clever table — clearer IAM, easier debugging, fewer hot-partition mistakes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Avoid Scan in production pipelines">
          <p className="text-slate-300">
            <code className="text-core-400">Scan</code> reads every item — cost and latency grow with table
            size. If your design requires frequent Scan, pause and redesign keys or GSIs.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview question: &quot;How would you store Glue job watermarks?&quot; Strong answer: name the
          access pattern (GetItem by job_id for latest; optional Query for history), then propose PK/SK — not
          &quot;we&apos;d use DynamoDB because it scales.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="Partition key choice — distribution matters">
        <ContentStep number={1} title="High cardinality spreads load">
          <p className="text-slate-300">
            Good PK values: <code className="text-core-400">job_id</code>,{' '}
            <code className="text-core-400">vendor_id#file_hash</code>,{' '}
            <code className="text-core-400">uuid</code> — many distinct values hash to many partitions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hot partitions — when too many writes hit one key">
          <p className="text-slate-300">
            Bad PK for write-heavy workloads: <code className="text-core-400">status=RUNNING</code> as
            partition key — every active job hammers one partition. Use GSI for status queries; keep write PK
            high-cardinality.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Composite keys for time-series metadata">
          <p className="text-slate-300">
            PK = <code className="text-core-400">pipeline_name</code>, SK ={' '}
            <code className="text-core-400">ISO timestamp</code> or inverted timestamp for &quot;latest
            first&quot; queries — common DE pattern for run logs without loading CloudWatch for every status
            check.
          </p>
        </ContentStep>
        <Flowchart
          title="Access pattern → key design flow"
          chart={`flowchart LR
  AP[List access patterns]
  AP --> MAP[Map each to GetItem or Query]
  MAP --> PK[Choose high-cardinality PK]
  PK --> SK[Add SK if multiple items per PK]
  SK --> GSI[Need alternate lookup? GSI later]
  GSI --> OK[Avoid Scan in prod]`}
        />
      </LessonSection>

      <LessonSection title="DE examples — keys in practice">
        <ContentStep number={1} title="Idempotency table">
          <p className="text-slate-300">
            PK: <code className="text-core-400">dedup_key</code> ={' '}
            <code className="text-core-400">{`{bucket}#{key}#{event_id}`}</code>. Simple key. Conditional
            PutItem: attribute_not_exists(dedup_key). TTL attribute expires keys after 7 days.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Job bookmark table">
          <p className="text-slate-300">
            PK: <code className="text-core-400">job_id</code>. SK:{' '}
            <code className="text-core-400">LATEST</code> as fixed sort key for one row per job (overwrite
            updates), or SK = run timestamp for full history — pick based on whether you need audit trail in
            the same table.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Vendor config lookup">
          <p className="text-slate-300">
            PK: <code className="text-core-400">vendor_code</code>. Attributes: allowed_prefixes, contact,
            sla_hours. GetItem at Lambda cold start — small table, infrequent writes, high read from many
            concurrent invocations (cache in Lambda memory if needed).
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Partition key determines storage location; sort key enables multiple ordered items per partition.',
          'Design keys from access patterns — list GetItem and Query needs before creating the table.',
          'Prefer high-cardinality partition keys; avoid hot partitions from low-cardinality write keys like status.',
          'Simple key for dedup; composite key for job run history — use GSI when an alternate lookup pattern appears.',
        ]}
      />
    </LessonArticle>
  )
}
