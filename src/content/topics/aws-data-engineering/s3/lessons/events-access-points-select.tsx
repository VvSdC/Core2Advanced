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

export function EventsAccessPointsSelect() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="S3 is not only storage — it is an event source">
        When new Parquet lands in <span className="font-mono text-sm">landing/</span>, pipelines should
        react. S3 <strong className="text-white">Event Notifications</strong>,{' '}
        <strong className="text-white">EventBridge</strong>,{' '}
        <strong className="text-white">Access Points</strong>, and{' '}
        <strong className="text-white">S3 Select</strong> extend the lake from passive buckets to
        reactive, multi-tenant, and lightweight-query infrastructure.
      </Callout>

      <Definition term="S3 Event Notifications">
        <p>
          Configure the bucket to emit events on <span className="font-mono text-sm">s3:ObjectCreated:*</span>,{' '}
          <span className="font-mono text-sm">s3:ObjectRemoved:*</span>, etc., filtered by prefix/suffix.
          Destinations: SNS, SQS, Lambda — classic pattern for trigger Glue job, virus scan, or metadata
          indexing when <span className="font-mono text-sm">.parquet</span> files arrive.
        </p>
      </Definition>

      <LessonSection title="S3 Event Notifications">
        <ContentStep number={1} title="Event-driven ingest">
          <p className="text-slate-300">
            Partner drops file → S3 PUT → Lambda subscribed via SNS/SQS processes file → writes normalized
            record to raw. Decouples upload from processing; SQS buffers spikes better than direct Lambda
            for bursty partners.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefix and suffix filters">
          <p className="text-slate-300">
            One notification rule per pipeline stage:{' '}
            <span className="font-mono text-sm">landing/vendor-a/</span> + suffix{' '}
            <span className="font-mono text-sm">.csv</span> → vendor A transform. Avoid one Lambda for
            entire bucket unless routing logic inside is intentional.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limitations">
          <p className="text-slate-300">
            At-least-once delivery — handlers must be idempotent. No guaranteed ordering across keys.
            Very high PUT rates on single prefix may need fan-out architecture (Kinesis) instead of per-object Lambda storms.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="EventBridge + S3">
        <ContentStep number={1} title="Why EventBridge">
          <p className="text-slate-300">
            S3 can send events directly to <strong className="text-white">Amazon EventBridge</strong> — route
            to hundreds of targets, archive, replay, content-based filtering, cross-account buses. Better
            for enterprise event meshes than chaining many SNS topics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE patterns">
          <p className="text-slate-300">
            Rule: object created in <span className="font-mono text-sm">curated/finance/</span> → Step
            Functions orchestration → Redshift COPY + Slack notification. Separate rules per domain team
            without duplicating bucket notification configs.
          </p>
        </ContentStep>
        <Flowchart
          title="S3 event paths"
          chart={`flowchart LR
  PUT[S3 ObjectCreated Put]
  PUT --> LEG[S3 Event Notification]
  PUT --> EB[EventBridge default bus]
  LEG --> SNS[SNS]
  LEG --> SQS[SQS]
  LEG --> L1[Lambda]
  EB --> SF[Step Functions]
  EB --> L2[Lambda cross-account]
  EB --> ARCH[Event archive replay]`}
        />
      </LessonSection>

      <LessonSection title="Access Points overview">
        <Definition term="S3 Access Point">
          <p>
            An <strong className="text-white">access point</strong> is a named network endpoint with its own
            IAM policy attached to a shared bucket — each access point enforces a specific prefix and
            permission set. Enables <strong className="text-white">multi-tenant lakes</strong>: Team A and
            Team B share one bucket but use different access point ARNs with isolated policies.
          </p>
        </Definition>
        <ContentStep number={1} title="Policy on access point">
          <p className="text-slate-300">
            Access point policy Allow <span className="font-mono text-sm">GetObject</span> only under{' '}
            <span className="font-mono text-sm">/team-a/*</span>. Applications use access point alias hostname
            — reduces sprawling bucket policies with dozens of principal statements.
          </p>
        </ContentStep>
        <ContentStep number={2} title="VPC Access Points">
          <p className="text-slate-300">
            Restrict access to a VPC — traffic from private subnets through interface endpoints bound to an
            access point. Strong isolation for regulated datasets processed inside known networks.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="S3 Select overview">
        <Definition term="S3 Select">
          <p>
            <strong className="text-white">S3 Select</strong> runs SQL-like queries (
            <span className="font-mono text-sm">SELECT * FROM S3Object WHERE ...</span>) server-side on
            CSV, JSON, or Parquet — returns filtered bytes to the client. Reduces data transfer when you
            need a slice of a large object without spinning up Athena — useful in Lambda with size limits.
          </p>
        </Definition>
        <ContentStep number={1} title="When to use vs Athena">
          <p className="text-slate-300">
            S3 Select: single-object filter, embedded in app code, modest result size. Athena: cataloged
            tables, multi-file SQL, aggregations across partitions. DE teams use Select in lightweight
            validators (schema check first 1 MB of landing CSV) before full Glue crawl.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compression support">
          <p className="text-slate-300">
            Works with GZIP and BZIP2 for CSV/JSON; Parquet column pruning reduces scanned data. Still not a
            replacement for curated partition layout — partition at ingest, query with Athena at scale.
          </p>
        </ContentStep>
        <Example title="S3 Select SQL sketch (CSV)">
{`SELECT s.user_id, s.event_type
FROM S3Object s
WHERE s.event_type = 'purchase'
LIMIT 100`}
        </Example>
        <Callout variant="tip">
          Combine events + Select: on ObjectCreated, Lambda runs Select to validate headers before promoting
          file to raw — fail fast without full-table Athena scan costs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 Event Notifications (SNS/SQS/Lambda) trigger pipeline stages on prefix/suffix filters — design idempotent handlers.',
          'EventBridge adds routing, archive, replay, and cross-account integration beyond classic notifications.',
          'Access Points isolate prefix-scoped IAM on shared buckets — multi-tenant and VPC-bound access patterns.',
          'S3 Select filters single objects server-side — good for validators; Athena for partition-wide SQL.',
          'High-volume prefixes may need SQS buffering or Kinesis instead of unbounded Lambda fan-out.',
        ]}
      />
    </LessonArticle>
  )
}
