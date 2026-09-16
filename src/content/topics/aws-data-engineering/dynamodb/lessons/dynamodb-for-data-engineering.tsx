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

export function DynamodbForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Metadata and coordination — not the lake">
        Data engineers reach for DynamoDB when they need{' '}
        <strong className="text-white">fast, durable, key-based storage</strong> for pipeline coordination —
        not when they need to query billions of rows with SQL aggregations. Think job state, dedup keys, small
        config maps, and reference lookups that Lambdas and Glue touch thousands of times per hour — while
        Parquet files live in S3 and dashboards read from Athena or Redshift.
      </Callout>

      <Definition term="DynamoDB in the DE platform">
        <p>
          In a typical AWS data platform, DynamoDB is the{' '}
          <strong className="text-white">operational metadata tier</strong>: it remembers what the pipeline
          already processed, where incremental jobs stopped, which feature flags are on, and lightweight
          vendor or SKU lookups too small for a warehouse but too hot for S3 object GET on every Lambda
          invocation.
        </p>
      </Definition>

      <LessonSection title="Typical DE use cases">
        <ContentStep number={1} title="Job bookmarks and pipeline state">
          <p className="text-slate-300">
            Store last processed timestamp, S3 prefix offset, or CDC binlog position keyed by{' '}
            <code className="text-core-400">job_id</code>. Glue custom script or Step Functions task reads
            state at start, writes at end — survives Lambda timeouts and retries without reprocessing entire
            datasets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency keys and deduplication">
          <p className="text-slate-300">
            EventBridge and S3 notifications deliver at-least-once. Conditional PutItem on{' '}
            <code className="text-core-400">bucket#key</code> ensures only the first Lambda run starts ETL.
            TTL expires keys after a safe window — table stays bounded without manual cleanup jobs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pipeline and platform config">
          <p className="text-slate-300">
            Vendor allowlists, environment-specific bucket mappings, rate limit knobs, maintenance flags —
            ops updates DynamoDB rows; orchestrators read on each run. Faster iteration than CloudFormation
            deploy for non-infrastructure toggles (still use IaC for table creation and IAM).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Small reference lookups">
          <p className="text-slate-300">
            Mapping <code className="text-core-400">vendor_code → timezone</code>,{' '}
            <code className="text-core-400">sku → category</code> for enrichment in Lambda before writing
            curated Parquet — thousands of rows, high read rate, rare updates. Fits DynamoDB better than
            joining RDS on every micro-batch row when the mapping is denormalized and small.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Workflow tokens and lease locks">
          <p className="text-slate-300">
            Distributed lock for &quot;only one nightly reconcile runs&quot; — conditional write with TTL lease.
            Step Functions task tokens stored until callback — orchestration patterns without a dedicated
            workflow database.
          </p>
        </ContentStep>
        <Flowchart
          title="DE platform tiers — where DynamoDB fits"
          chart={`flowchart TB
  SRC[RDS APIs files]
  SRC --> BRZ[S3 bronze silver gold]
  BRZ --> WH[Athena Redshift BI]
  ORCH[EventBridge Lambda Glue Step Functions]
  ORCH --> DDB[(DynamoDB metadata tier)]
  DDB --> ORCH
  ORCH --> BRZ
  WH -.->|analytics not| DDB`}
        />
      </LessonSection>

      <LessonSection title="Patterns paired with other DE services">
        <ContentStep number={1} title="EventBridge + Lambda + DynamoDB">
          <p className="text-slate-300">
            S3 landing event → Lambda checks idempotency table → updates job state → invokes Glue. EventBridge
            starts work; DynamoDB prevents duplicate work — the duo that stops double silver writes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue read/write for custom bookmarks">
          <p className="text-slate-300">
            Native Glue job bookmarks cover S3 sources; custom JDBC or API sources often need manual DynamoDB
            watermarks in PySpark driver code — same GetItem/UpdateItem pattern from Lambda, inside the job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CloudFormation declares the table">
          <p className="text-slate-300">
            Table name, key schema, capacity mode, TTL, and IAM policies live in the platform stack beside S3
            and Lambda — dev/prod parity, no console-only metadata tables drifting from Git.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Streams to S3 audit trail (teaser)">
          <p className="text-slate-300">
            DynamoDB Streams emit item changes; Lambda writes audit JSON to S3 for compliance — lightweight
            CDC for metadata changes without DMS. Full Streams lesson in the next module.
          </p>
        </ContentStep>
        <Example title="Acme orders pipeline — DynamoDB touchpoints" caption="End-to-end metadata only">
{`Tables:
  de-idempotency-prod     PK: dedup_key (bucket#key)
  de-pipeline-state-prod  PK: job_id, SK: run_date

Flow:
  1. S3 raw/orders/file.csv lands
  2. Lambda conditional PutItem dedup_key → proceed if new
  3. Lambda GetItem job_id latest watermark
  4. Start Glue with watermark parameter
  5. Glue UpdateItem status RUNNING → SUCCEEDED + new watermark
  6. Parquet written to S3 silver/ — NOT stored in DynamoDB

Data volume in DynamoDB: kilobytes of keys/state
Data volume in S3: gigabytes of orders`}
        </Example>
      </LessonSection>

      <LessonSection title="What NOT to use DynamoDB for">
        <ContentStep number={1} title="Analytics warehouse replacement">
          <p className="text-slate-300">
            No ad-hoc GROUP BY across millions of items, no BI tool SQL layer, no petabyte historical
            reporting. That is S3 + Athena, Redshift, or OpenSearch. Scanning DynamoDB for dashboards is an
            anti-pattern — cost explodes and queries slow down.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Primary business OLTP">
          <p className="text-slate-300">
            Customer orders, accounts, and payments stay on RDS or Aurora — ACID across relations, mature ORM
            tooling, DMS extract to lake. DynamoDB is not the system of record for core business entities in
            most enterprises.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Large blob or file storage">
          <p className="text-slate-300">
            400 KB item limit — no CSV payloads, model artifacts, or Parquet files. Store pointers (S3 URIs)
            in DynamoDB; store bytes in S3.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Complex ad-hoc queries">
          <p className="text-slate-300">
            &quot;Find all jobs that failed last Tuesday across vendors where retry_count &gt; 3&quot; — without
            a designed GSI, this becomes Scan. Prefer CloudWatch Logs Insights, OpenSearch, or audit tables in
            S3/Athena for operational analytics over DynamoDB Scan.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Graph traversals and heavy JOINs">
          <p className="text-slate-300">
            Multi-hop relationship queries belong in Neptune, RDS, or precomputed lake tables — not multiple
            DynamoDB round trips emulating JOINs in application code at scale.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Rule of thumb: if the data fits in a spreadsheet tab and you always look it up by a known key, DynamoDB
          is a candidate. If analysts need SQL over history, keep it in the lake.
        </Callout>
      </LessonSection>

      <LessonSection title="DynamoDB vs nearby alternatives — DE lens">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Better fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Pipeline idempotency and state', 'DynamoDB — key lookups, conditional writes, TTL'],
                ['Transactional business data + SQL', 'RDS / Aurora — extract to S3 for analytics'],
                ['Historical aggregations and BI', 'S3 + Athena / Redshift'],
                ['Sub-millisecond cache of config', 'ElastiCache — volatile; DynamoDB when durability matters'],
                ['Full dataset file storage', 'S3 — DynamoDB stores URIs and metadata only'],
              ].map(([need, fit]) => (
                <tr key={need} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{need}</td>
                  <td className="px-4 py-3">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use DynamoDB for job state, idempotency, config, small lookups, and locks — pipeline coordination at key-based speed.',
          'Pair with EventBridge/Lambda/Glue for dedup and bookmarks; declare tables in CloudFormation with IAM.',
          'Do not use for warehouse analytics, OLTP source of truth, file storage, or ad-hoc Scan-heavy reporting.',
          'Lake holds data; DynamoDB holds metadata about how and when that data was processed.',
        ]}
      />
    </LessonArticle>
  )
}
