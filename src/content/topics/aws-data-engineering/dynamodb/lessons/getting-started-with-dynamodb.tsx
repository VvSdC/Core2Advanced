import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithDynamodb() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why DynamoDB after CloudFormation in the DE path">
        You know how CloudFormation turns lake buckets, IAM roles, and EventBridge rules into repeatable
        stacks across dev, staging, and prod. The next question every data platform team asks is:{' '}
        <strong className="text-white">where do we store job state, idempotency keys, pipeline config, and
        small metadata lookups — without standing up a relational database for every micro-service?</strong>{' '}
        In most AWS data platforms, the answer is{' '}
        <strong className="text-white">Amazon DynamoDB</strong> — the managed NoSQL database that scales
        reads and writes on single-digit millisecond latency for key-based access patterns.
      </Callout>

      <Definition term="What is DynamoDB in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon DynamoDB</strong> is a fully managed NoSQL database that
          stores data as items in tables, keyed by a partition key (and optionally a sort key). For data
          engineering, DynamoDB is the{' '}
          <strong className="text-white">operational metadata and state layer</strong> — job bookmarks,
          pipeline checkpoints, idempotency tokens, feature flags, and small reference lookups that Lambdas,
          Glue jobs, and Step Functions read and write at high throughput without JDBC connection pools.
        </p>
        <p className="mt-2 text-slate-300">
          Think of DynamoDB as{' '}
          <span className="text-core-400">the fast scratchpad and ledger for your pipeline — not the warehouse,
          but the place that remembers where each job left off and whether this file was already processed</span>.
        </p>
      </Definition>

      <LessonSection title="Operational metadata — why order matters">
        <p className="text-slate-300">
          CloudFormation lessons taught you how lake infrastructure gets created repeatably. Glue and
          EventBridge lessons taught you how ETL runs and when it starts. DynamoDB explains{' '}
          <strong className="text-white">where pipelines remember state between runs</strong> — the same
          incremental watermark, idempotency key, or job status row that prevents double-processing a file
          or losing progress after a Lambda timeout.
        </p>
        <ContentStep number={1} title="Job state and bookmarks">
          <p className="text-slate-300">
            A Glue job or Lambda writes the last processed timestamp or S3 key to a DynamoDB item keyed by{' '}
            <code className="text-core-400">job_name</code>. The next run reads that watermark and processes
            only new data — the same pattern as Glue job bookmarks, but under your control for custom
            orchestrators.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency and deduplication">
          <p className="text-slate-300">
            S3 Object Created events can fire twice. A Lambda checks DynamoDB for{' '}
            <code className="text-core-400">bucket#key</code> before starting ETL. If the item exists, skip;
            if not, write a conditional put and proceed — no duplicate silver-layer writes from retried
            events.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Config and small lookups">
          <p className="text-slate-300">
            Pipeline config — allowed vendor prefixes, environment flags, rate limits — lives in a DynamoDB
            table instead of hard-coded env vars. Ops updates a row; the next Lambda invocation picks up the
            change without redeploying code.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: S3 holds the data lake; RDS holds transactional business rows; DynamoDB holds
          pipeline metadata and fast key lookups. Most &quot;we processed the same file twice&quot; DE
          incidents are missing idempotency keys in DynamoDB, not bad Spark transforms.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build DynamoDB in layers so GSIs, conditional writes, and Streams do not overwhelm you on day
          one. Follow this order:
        </p>
        <ContentStep number={1} title="NoSQL and core model — tables, items, keys">
          <p className="text-slate-300">
            Understand NoSQL vs relational, what a table and item look like, and why partition and sort keys
            define how you access data — enough to read a pipeline architecture diagram.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keys and access patterns — design from queries">
          <p className="text-slate-300">
            Learn partition key and sort key mental models — you design the table around how Lambdas and jobs
            will read and write, not around a normalized schema diagram.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Capacity modes — provisioned vs on-demand">
          <p className="text-slate-300">
            Provisioned RCU/WCU for predictable steady load; on-demand for spiky event-driven pipelines —
            pick based on traffic shape and cost tolerance.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE use cases and next module">
          <p className="text-slate-300">
            After this beginner pass: Global Secondary Indexes (GSI), Query vs Scan, DynamoDB Streams to Lambda
            and S3, TTL for ephemeral state, and comparisons with RDS and ElastiCache for platform design.
          </p>
        </ContentStep>
        <Flowchart
          title="DynamoDB sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is NoSQL DynamoDB]
  B --> C[Tables items attributes]
  C --> D[Partition and sort keys]
  D --> E[Capacity modes]
  E --> F[DynamoDB for DE]
  F --> G[Putting it together beginner]
  G --> H[GSI Query Streams — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Table',
                  'A named collection of items — like one spreadsheet for pipeline state, separate from your S3 lake buckets',
                ],
                [
                  'Item',
                  'One record in a table — a JSON-like document with attributes, e.g. one job bookmark or one idempotency key',
                ],
                [
                  'Attribute',
                  'A name-value field on an item — e.g. last_run_at, status, s3_prefix — can be string, number, map, or list',
                ],
                [
                  'Partition key',
                  'The required primary key that determines which physical partition stores the item — all reads/writes for one key hit one partition',
                ],
                [
                  'Sort key',
                  'Optional second part of the primary key — lets multiple items share a partition key and be queried in sorted order',
                ],
                [
                  'RCU / WCU',
                  'Read Capacity Unit and Write Capacity Unit — how provisioned mode meters throughput; on-demand abstracts this into per-request billing (teaser for now)',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and purpose in table names:{' '}
          <code className="text-core-400">de-pipeline-state-prod</code> or{' '}
          <code className="text-core-400">de-idempotency-keys-dev</code>. When on-call searches DynamoDB at
          2 a.m., clear table names beat generic &quot;metadata&quot; or &quot;config&quot; entries with no
          owner documented.
        </Callout>
      </LessonSection>

      <LessonSection title="How DynamoDB fits after CloudFormation in a pipeline">
        <p className="text-slate-300">
          CloudFormation creates the S3 bucket, Lambda execution role, and DynamoDB table in one stack.
          EventBridge fires when a file lands; Lambda checks idempotency in DynamoDB, updates job state, and
          starts Glue. Optional DynamoDB Streams capture item changes and fan out to another Lambda that
          writes audit rows to S3 — infrastructure from CloudFormation, triggers from EventBridge, state in
          DynamoDB.
        </p>
        <Flowchart
          title="App/Lambda → DynamoDB ↔ Streams → Lambda → S3"
          chart={`flowchart LR
  EB[EventBridge S3 landing]
  EB --> LAM[Lambda orchestrator]
  LAM --> DDB[(DynamoDB state and idempotency)]
  DDB --> STR[DynamoDB Streams optional]
  STR --> LAM2[Lambda audit writer]
  LAM2 --> S3[S3 audit or curated]
  LAM --> GLUE[Glue workflow]
  GLUE --> DDB
  GLUE --> CUR[S3 curated Parquet]`}
        />
        <Callout variant="insight">
          Mature DE platforms treat DynamoDB as the system of record for pipeline metadata — not as a
          replacement for the lake or warehouse, but as the fast, durable layer that coordinates who processed
          what and when.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about DynamoDB">
        <ContentStep number={1} title="Serverless-friendly — no connection pools">
          <p className="text-slate-300">
            Lambda and Step Functions call DynamoDB over HTTPS with IAM — no JDBC drivers, no connection
            pool exhaustion, no VPC requirement for basic access. Ideal for event-driven pipeline steps that
            spin up, read state, write state, and exit.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Predictable latency at scale">
          <p className="text-slate-300">
            Single-digit millisecond reads and writes for key-based access — whether you store ten thousand
            idempotency keys or ten million job history rows. Throughput scales with capacity mode; hot
            partitions are a design concern covered when you learn keys and GSIs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integrates with the DE stack">
          <p className="text-slate-300">
            Glue can read and write DynamoDB; Streams trigger Lambda for change-data-capture-lite patterns;
            CloudFormation declares tables with IAM policies beside the buckets they coordinate — one platform
            template, repeatable across environments.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DynamoDB follows CloudFormation in the track — CloudFormation creates infrastructure; DynamoDB stores pipeline state, idempotency, and config.',
          'Roadmap: NoSQL and core model → partition/sort keys → capacity modes → DE use cases → GSI, Query, Streams next.',
          'Core vocabulary: table, item, attribute, partition key, sort key, RCU/WCU (provisioned capacity teaser).',
          'Typical pattern: Lambda/EventBridge → DynamoDB for state and dedup → optional Streams → Lambda → S3 audit; Glue reads/writes watermarks.',
        ]}
      />
    </LessonArticle>
  )
}
