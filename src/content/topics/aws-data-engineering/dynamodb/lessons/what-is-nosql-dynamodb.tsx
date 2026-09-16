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

export function WhatIsNosqlDynamodb() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        <strong className="text-white">NoSQL</strong> databases store and retrieve data differently from
        traditional relational databases like PostgreSQL or MySQL. Instead of fixed tables with rows, columns,
        and JOIN queries, NoSQL systems optimize for specific access patterns — often by a primary key you
        choose upfront. <strong className="text-white">Amazon DynamoDB</strong> is AWS&apos;s managed NoSQL
        offering: a key-value and document store that scales automatically and charges per request or
        provisioned capacity — ideal for pipeline metadata, not for ad-hoc analytics over billions of rows.
      </Callout>

      <Definition term="NoSQL">
        <p>
          <strong className="text-white">NoSQL</strong> (often interpreted as &quot;not only SQL&quot;) refers
          to database systems that relax or replace the rigid schema and JOIN-heavy query model of relational
          databases. Common categories include key-value stores, document stores, wide-column stores, and
          graph databases. Trade-offs: flexible schemas and horizontal scale at the cost of no arbitrary
          cross-table JOINs and design driven by access patterns rather than normalized entity diagrams.
        </p>
      </Definition>

      <Definition term="Amazon DynamoDB">
        <p>
          <strong className="text-white">Amazon DynamoDB</strong> is a fully managed NoSQL database service
          that supports both <strong className="text-white">key-value</strong> and{' '}
          <strong className="text-white">document</strong> data models. Each item is identified by a primary
          key (partition key, optionally with sort key). Items contain flexible attributes — no fixed column
          schema per table beyond the key. AWS handles hardware, replication, and patching; you choose
          capacity mode, define keys and indexes, and call the API from Lambda, Glue, or applications.
        </p>
      </Definition>

      <LessonSection title="Relational vs NoSQL — mental model for DE">
        <p className="text-slate-300">
          RDS stores orders, customers, and line items in normalized tables linked by foreign keys. Analysts
          run SQL JOINs across those tables. DynamoDB stores{' '}
          <strong className="text-white">one item per access pattern</strong> — e.g. one row keyed by{' '}
          <code className="text-core-400">job_id</code> with all fields the orchestrator needs in that single
          document. You do not JOIN DynamoDB to S3 at query time; you read the key, get the item, act.
        </p>
        <ContentStep number={1} title="Relational strengths">
          <p className="text-slate-300">
            Complex queries, ad-hoc reporting, ACID transactions across related rows, mature SQL tooling.
            RDS and Redshift excel here — operational apps and warehouses, not millisecond metadata lookups
            from thousands of concurrent Lambdas.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NoSQL strengths">
          <p className="text-slate-300">
            Massive scale on simple key lookups, flexible item shape, no schema migration for new optional
            attributes, serverless integration. DynamoDB excels when you know{' '}
            <strong className="text-white">exactly how</strong> you will read and write — get item by key,
            query items sharing a partition key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why DE teams use both">
          <p className="text-slate-300">
            Extract RDS to S3 for the lake; store pipeline watermarks and idempotency in DynamoDB. Each
            database does what it is built for — RDS for business truth, S3 for durable files, DynamoDB for
            fast operational state.
          </p>
        </ContentStep>
        <Flowchart
          title="Where DynamoDB sits vs relational sources"
          chart={`flowchart TB
  RDS[RDS relational OLTP]
  RDS --> EXT[Extract to S3]
  EXT --> LAKE[S3 data lake]
  LAKE --> WH[Athena Redshift analytics]
  LAM[Lambda Glue Step Functions]
  LAM --> DDB[(DynamoDB NoSQL metadata)]
  DDB --> LAM
  RDS -.->|not replaced by| DDB`}
        />
      </LessonSection>

      <LessonSection title="Key-value and document — what DynamoDB actually is">
        <ContentStep number={1} title="Key-value layer">
          <p className="text-slate-300">
            At its core, DynamoDB is a key-value store: give it a primary key, get back an item (or nothing).
            <code className="text-core-400">GetItem</code> on{' '}
            <code className="text-core-400">job_id = orders-nightly</code> returns the bookmark — one hop,
            predictable latency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Document layer">
          <p className="text-slate-300">
            Each value is a <strong className="text-white">document</strong> — a JSON-like map of attributes.
            One item might have <code className="text-core-400">status</code>,{' '}
            <code className="text-core-400">last_watermark</code>,{' '}
            <code className="text-core-400">error_count</code>, and a nested{' '}
            <code className="text-core-400">config</code> map. Different items in the same table can have
            different attribute sets — flexible without ALTER TABLE migrations.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a wide-column or graph DB">
          <p className="text-slate-300">
            DynamoDB is not Cassandra (wide-column for time series at extreme scale) or Neptune (graph
            traversals). For DE metadata, job state, and dedup keys, the key-value/document model is the right
            fit — not every NoSQL category solves the same problem.
          </p>
        </ContentStep>
        <Example title="Same data — relational vs DynamoDB shape" caption="Orders pipeline watermark">
{`Relational (RDS) — normalized:
  jobs: job_id, name, owner
  watermarks: job_id (FK), last_ts, last_key

DynamoDB — denormalized for one lookup:
  PK: job_id = "orders-nightly"
  Attributes: { status, last_watermark_ts, last_s3_key, updated_at }

DE read pattern: GetItem(job_id) → all fields in one round trip`}
        </Example>
      </LessonSection>

      <LessonSection title="Managed service — what AWS handles">
        <ContentStep number={1} title="No servers to patch">
          <p className="text-slate-300">
            You create a table in the console, CloudFormation, or CLI — no EC2 instances, no OS patching, no
            storage volume sizing for individual nodes. Capacity mode and optional auto scaling handle
            throughput.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Built-in durability and availability">
          <p className="text-slate-300">
            Data replicates across multiple Availability Zones in a Region by default. Pipeline state survives
            single-AZ failures — important when idempotency keys must not disappear mid-batch.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and encryption">
          <p className="text-slate-300">
            Access is API calls secured by IAM policies — same model as S3 and Lambda. Encryption at rest with
            AWS owned or KMS keys; in transit over TLS. CloudFormation declares table plus least-privilege
            role in one stack.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Say &quot;managed NoSQL key-value and document store&quot; in interviews — then immediately name your
          access pattern: &quot;We key by job_id for bookmark lookups from Lambda, not for warehouse
          aggregations.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="What DynamoDB is not">
        <ContentStep number={1} title="Not a data warehouse">
          <p className="text-slate-300">
            No SQL aggregations across arbitrary columns at petabyte scale. Do not load full datasets into
            DynamoDB for BI dashboards — use S3, Athena, and Redshift. DynamoDB holds{' '}
            <strong className="text-white">small, hot, key-addressed</strong> data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a replacement for RDS OLTP">
          <p className="text-slate-300">
            Business applications with complex relational models, foreign keys, and ad-hoc SQL stay on RDS or
            Aurora. DynamoDB complements the pipeline layer around those systems — watermarks after extract,
            not the source of truth for customer orders.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not schema-free chaos">
          <p className="text-slate-300">
            Items can vary, but <strong className="text-white">primary keys and access patterns are fixed at
            design time</strong>. Changing how you query usually means new GSIs or a new table — design
            upfront, unlike RDS where you ALTER and add indexes more casually.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'NoSQL trades flexible schema and key-based scale for arbitrary JOINs — design tables around how you read and write.',
          'DynamoDB is a managed key-value and document store: primary key in, JSON-like item out, single-digit ms latency.',
          'DE stack: RDS for OLTP truth, S3 for lake files, DynamoDB for pipeline metadata and fast lookups — each tool for its job.',
          'DynamoDB is not a warehouse or RDS replacement — it is operational state and metadata at scale.',
        ]}
      />
    </LessonArticle>
  )
}
