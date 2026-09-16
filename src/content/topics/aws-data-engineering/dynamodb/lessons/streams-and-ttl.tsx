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

export function StreamsAndTtl() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Change log plus automatic expiry — two serverless lifecycle hooks">
        Operational tables in data platforms generate continuous inserts and updates.{' '}
        <strong className="text-white">DynamoDB Streams</strong> capture item-level changes for downstream
        processing. <strong className="text-white">TTL (Time to Live)</strong> deletes expired items without
        batch jobs or Scan. Together they let DE teams build CDC paths to the lake and self-cleaning staging
        tables without cron EC2 delete scripts.
      </Callout>

      <Definition term="DynamoDB Streams">
        <p>
          An optional <strong className="text-white">ordered change log</strong> per DynamoDB table — records
          INSERT, MODIFY, and REMOVE events with optional old and new item images. Stream records persist ~24
          hours. View types: KEYS_ONLY, NEW_IMAGE, OLD_IMAGE, NEW_AND_OLD_IMAGES. Consumers include Lambda
          event source mapping, Kinesis Client Library, and custom pollers — not direct S3 write (that needs
          Lambda or Kinesis Data Streams fan-out).
        </p>
      </Definition>

      <Definition term="TTL (Time to Live)">
        <p>
          TTL automatically deletes items when a designated <strong className="text-white">Number</strong>{' '}
          attribute (epoch seconds) is in the past. Deletes are best-effort within ~48 hours — no WCU charge for
          TTL-driven removal. TTL does not delete items synchronously on expiry timestamp — plan retention
          buffers for compliance. Cannot TTL on nested attributes — top-level attribute only.
        </p>
      </Definition>

      <LessonSection title="DynamoDB Streams">
        <ContentStep number={1} title="Stream view type for DE">
          <p className="text-slate-300">
            <strong className="text-white">NEW_AND_OLD_IMAGES</strong> enables CDC with before/after for
            MODIFY — lake merge logic knows which columns changed. NEW_IMAGE sufficient for append-only ingest
            (IoT telemetry). KEYS_ONLY cheapest but forces GetItem per record in consumer — rarely worth it
            at pipeline scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ordering and duplicates">
          <p className="text-slate-300">
            Records ordered per partition key shard — not global table order. Lambda may deliver duplicate
            batches; consumer must idempotent-write to S3 or use conditional DynamoDB sink. Iterator age
            CloudWatch metric signals consumer lag — alarm before 24h retention loses data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stream vs export vs DMS">
          <p className="text-slate-300">
            Streams: near-real-time incremental, per-item, 24h retention. Export to S3: full or incremental
            snapshot, no stream consumer infra, hours latency. DMS: heterogeneous sources — overkill for
            native DynamoDB-to-lake when Streams + Lambda suffices.
          </p>
        </ContentStep>
        <Flowchart
          title="Stream record lifecycle"
          chart={`flowchart LR
  WRITE[PutItem UpdateItem DeleteItem]
  STREAM[DynamoDB Stream shard]
  LAM[Lambda event source mapping]
  S3[S3 JSON or Parquet landing]
  WRITE --> STREAM
  STREAM --> LAM
  LAM --> S3`}
        />
      </LessonSection>

      <LessonSection title="TTL for expiry">
        <ContentStep number={1} title="Staging and dedupe tables">
          <p className="text-slate-300">
            Ingest dedupe rows: attribute <span className="font-mono text-sm">ttl</span> = now + 7 days epoch.
            No nightly Scan-delete Lambda — table stays bounded. Pipeline audit scratch rows with 30-day TTL
            satisfy retention policy without ops toil.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Session and lock expiry">
          <p className="text-slate-300">
            Distributed Glue concurrency lock with TTL — stale lock auto-releases if worker crashes without
            heartbeat UpdateItem. Conditional acquire + TTL backup prevents permanent deadlock on orphaned
            <span className="font-mono text-sm">dataset_locks</span> rows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="TTL delete events in Streams">
          <p className="text-slate-300">
            TTL removal emits REMOVE event in stream — downstream lake can tombstone deleted keys for GDPR
            erasure audit. If lake should ignore TTL deletes, filter{' '}
            <span className="font-mono text-sm">userIdentity</span> type{' '}
            <span className="font-mono text-sm">Service</span> = dynamodb.amazonaws.com with TTL principal in
            consumer logic.
          </p>
        </ContentStep>
        <Example title="Enable TTL on table" caption="CloudFormation sketch">
{`TimeToLiveSpecification:
  AttributeName: expires_at
  Enabled: true

# Item must include expires_at as Number (Unix epoch seconds)
# e.g. int(time.time()) + 86400 * 7  for 7-day retention`}
        </Example>
        <Callout variant="insight">
          TTL is not a precision scheduler — items may linger past expiry. Do not use TTL alone for
          sub-minute timing; use EventBridge Scheduler for orchestration, TTL for day-scale retention.
        </Callout>
      </LessonSection>

      <LessonSection title="Combining Streams and TTL in pipelines">
        <ContentStep number={1} title="Ephemeral staging with CDC">
          <p className="text-slate-300">
            Hot staging table: Stream → Lambda → S3 bronze; TTL expires staging rows after successful lake
            commit confirmed by conditional watermark update. Bounded table size, complete change history in
            lake.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Monitoring">
          <p className="text-slate-300">
            Alarm <span className="font-mono text-sm">IteratorAge</span> on stream-connected Lambda. Track{' '}
            <span className="font-mono text-sm">UserErrors</span> on TTL-disabled misconfiguration (wrong
            attribute type blocks TTL). Table size should plateau when TTL matches ingest rate — growth signals
            missing expiry attribute on writes.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Streams: ordered per-shard change log (~24h) — INSERT/MODIFY/REMOVE for CDC to Lambda and beyond.',
          'Choose NEW_AND_OLD_IMAGES for merge CDC; expect duplicate batches and design idempotent consumers.',
          'TTL: Number epoch attribute triggers free async delete — ideal for dedupe, staging, and lock expiry.',
          'TTL deletes appear as REMOVE in Streams — filter or propagate tombstones for compliance lakes.',
          'Pair Streams (lake landing) with TTL (table bounds) — avoid Scan-based cleanup jobs on control tables.',
        ]}
      />
    </LessonArticle>
  )
}
