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

export function PuttingItTogetherDynamodbBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before indexes and Streams">
        You now know what DynamoDB is, how tables items and attributes relate, why partition and sort keys
        come from access patterns, how provisioned and on-demand capacity differ, and where DE teams use
        DynamoDB vs the lake. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner DynamoDB checklist</strong> — the mental model you need
        before GSIs, Query vs Scan, and Streams in the next module.
      </Callout>

      <Definition term="Beginner DynamoDB mental model">
        <p>
          A <strong className="text-white">beginner DynamoDB mental model</strong> for DE includes: separate
          tables for idempotency vs job state, primary keys designed from documented access patterns,
          on-demand for spiky ingest tables (or right-sized provisioned for steady config), items under 400
          KB with S3 URIs not file bytes, conditional writes for dedup, IAM least privilege per Lambda role,
          CloudFormation-declared tables per environment, and CloudWatch throttling metrics watched — all
          before GSI design and Stream consumers in production.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Metadata tier — not the lake">
          <p className="text-slate-300">
            DynamoDB holds keys, watermarks, config — S3 holds Parquet/CSV. Diagram shows DynamoDB beside
            orchestration, not replacing bronze/silver/gold buckets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency table — simple key">
          <p className="text-slate-300">
            PK = <code className="text-core-400">dedup_key</code> (bucket and key composite). Conditional
            PutItem on landing Lambda. TTL enabled for automatic expiry.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Job state table — composite key optional">
          <p className="text-slate-300">
            PK = <code className="text-core-400">job_id</code>; SK = run date or{' '}
            <code className="text-core-400">LATEST</code> for single-row bookmark. Glue/Step Functions
            UpdateItem on start and finish.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Capacity mode chosen per table">
          <p className="text-slate-300">
            Idempotency: on-demand for burst ingest. Config: provisioned with auto scaling for steady reads —
            documented on runbook.
          </p>
        </ContentStep>
        <ContentStep number={5} title="CloudFormation + IAM">
          <p className="text-slate-300">
            Tables in platform stack; Lambda roles scoped to{' '}
            <code className="text-core-400">dynamodb:PutItem</code>,{' '}
            <code className="text-core-400">GetItem</code>,{' '}
            <code className="text-core-400">UpdateItem</code> on specific table ARNs — not{' '}
            <code className="text-core-400">dynamodb:*</code> on all resources.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE DynamoDB stack"
          chart={`flowchart TD
  S3[S3 raw landing]
  S3 --> EB[EventBridge optional]
  EB --> LAM[Lambda dedup check]
  LAM --> IDEM[(de-idempotency PK dedup_key)]
  LAM --> STATE[(de-pipeline-state PK job_id)]
  LAM --> GLUE[Glue ETL]
  GLUE --> STATE
  GLUE --> CUR[S3 curated]
  CFN[CloudFormation stack] --> IDEM
  CFN --> STATE`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is DynamoDB in one sentence?">
          <p className="text-slate-300">
            Managed NoSQL key-value/document database for single-digit ms key-based reads and writes — DE uses
            it for pipeline metadata, not warehouse analytics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Table vs item vs attribute">
          <p className="text-slate-300">
            Table = collection; item = one record (400 KB max); attribute = field on an item — JSON-like with
            required primary key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition key vs sort key">
          <p className="text-slate-300">
            PK = hash to partition; SK = optional range within partition for multiple ordered items per PK.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Why access patterns first?">
          <p className="text-slate-300">
            Keys must support GetItem and Query — no arbitrary SQL. Design from how Lambdas read/write, not
            from ER diagrams alone.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Provisioned vs on-demand">
          <p className="text-slate-300">
            Provisioned = set RCU/WCU for steady load; on-demand = per-request auto-scale for spiky or unknown
            traffic.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Top DE use cases">
          <p className="text-slate-300">
            Job bookmarks, idempotency keys, pipeline config, small lookups — not OLTP source of truth or BI
            warehouse.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when Lambda throttles on PutItem?">
          <p className="text-slate-300">
            Check <code className="text-core-400">ThrottledRequests</code> and capacity mode — raise WCU, enable
            auto scaling, or switch to on-demand during backfill — before blaming application logic.
          </p>
        </ContentStep>
        <Example title="Beginner DynamoDB concept drill" caption="No console required yet — explain aloud">
{`1. Draw: S3 landing → Lambda → DynamoDB dedup → Glue → S3 curated + state update
2. Why conditional PutItem for idempotency instead of unconditional PutItem?
3. Name one table that fits simple key vs composite key design
4. When would you pick on-demand over provisioned for a DE table?
5. Why store s3:// URI in DynamoDB but not the CSV bytes?
6. What access pattern forces you toward Scan (and why avoid it)?
7. How does DynamoDB fit after CloudFormation in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong DynamoDB beginners ask three questions before creating a table: what are the read/write
          patterns, what is the primary key, and is this metadata or analytics data — wrong answers on question
          three send teams to expensive Scan anti-patterns.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme deploys CloudFormation stack{' '}
          <code className="text-core-400">acme-de-platform-prod</code> with tables{' '}
          <code className="text-core-400">de-idempotency-prod</code> (on-demand, PK{' '}
          <code className="text-core-400">dedup_key</code>, TTL 7 days) and{' '}
          <code className="text-core-400">de-pipeline-state-prod</code> (provisioned 50 WCU / 25 RCU with auto
          scaling, PK <code className="text-core-400">job_id</code>, SK{' '}
          <code className="text-core-400">run_date</code>). Vendor uploads{' '}
          <code className="text-core-400">raw/orders/2026-09-16.csv</code>; EventBridge invokes Lambda{' '}
          <code className="text-core-400">de-orders-dedup</code>, which conditional-writes{' '}
          <code className="text-core-400">acme-lake-prod#raw/orders/2026-09-16.csv</code> — second duplicate
          event fails condition and exits. Lambda reads latest watermark for{' '}
          <code className="text-core-400">orders-nightly</code>, starts Glue job, Glue UpdateItem status
          RUNNING then SUCCEEDED with new watermark. Parquet lands in{' '}
          <code className="text-core-400">silver/orders/</code>; DynamoDB never holds order rows. On-call sees
          throttling on idempotency during flash sale — switch table to on-demand max, file incident, revert
          to provisioned after traffic study.
        </p>
        <ContentStep number={1} title="Infrastructure tier — CloudFormation">
          <p className="text-slate-300">Tables, TTL, capacity mode, IAM — Git-reviewed, identical env parity.</p>
        </ContentStep>
        <ContentStep number={2} title="Trigger tier — EventBridge / S3">
          <p className="text-slate-300">Landing signal — at-least-once delivery expects dedup layer.</p>
        </ContentStep>
        <ContentStep number={3} title="Coordination tier — DynamoDB">
          <p className="text-slate-300">Dedup keys and job state — milliseconds, durable, key-addressed.</p>
        </ContentStep>
        <ContentStep number={4} title="Data tier — S3 + Glue">
          <p className="text-slate-300">Actual dataset transformation — where lake economics apply.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the DynamoDB track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="GSI and LSI — alternate access patterns">
          <p className="text-slate-300">
            Query jobs by <code className="text-core-400">status</code> without Scan — Global Secondary Index
            with its own partition/sort key. Local Secondary Index for alternate sort on same partition —
            when each fits DE metadata tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query vs Scan — production discipline">
          <p className="text-slate-300">
            Query uses key conditions on PK (and SK range) — efficient. Scan reads entire table — debug and
            one-off ops only. DE pipelines should be Query/GetItem only unless exporting to S3 for analysis.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DynamoDB Streams">
          <p className="text-slate-300">
            Stream Lambda on state table changes writes audit JSON to S3; cross-region replication patterns;
            lightweight change capture for metadata — not a DMS replacement for RDS.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced production features">
          <p className="text-slate-300">
            Transactions, TTL deep dive, DAX caching teaser, on-demand vs provisioned cost modeling, DynamoDB
            vs RDS vs ElastiCache decision matrix — assuming you can explain PK/SK design and idempotency from
            memory.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          DynamoDB connects everything you built in prior modules: CloudFormation creates the table, EventBridge
          and Lambda trigger ingest, Glue transforms S3 data, RDS feeds extracts — DynamoDB remembers pipeline
          progress and prevents duplicate work. Advanced orchestration assumes you can draw the landing → dedup
          → state → ETL path and name when on-demand beats provisioned without opening the console.
        </p>
        <Callout variant="tip" title="Before your first prod idempotency table">
          Load test conditional writes at expected peak S3 event rate in staging — teams that skip this discover
          throttling on the busiest sales day, not during quiet integration tests.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: metadata not lake, separate idempotency/state tables, keys from access patterns, capacity per traffic shape, CloudFormation + IAM.',
          'Self-check: DynamoDB definition, table/item/attribute, PK/SK, capacity modes, DE use cases, throttling debug order.',
          'End-to-end: CloudFormation tables → EventBridge/Lambda dedup → Glue ETL → S3 data + DynamoDB state only.',
          'Next in DynamoDB track: GSI/LSI, Query vs Scan, Streams, and production hardening.',
        ]}
      />
    </LessonArticle>
  )
}
