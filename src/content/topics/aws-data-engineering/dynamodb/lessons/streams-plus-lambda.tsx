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

export function StreamsPlusLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Operational table to lake bronze in minutes — no nightly Scan">
        The canonical DynamoDB CDC pattern for data engineering: enable{' '}
        <strong className="text-white">DynamoDB Streams</strong>, attach{' '}
        <strong className="text-white">Lambda event source mapping</strong>, transform records to JSON or
        Parquet, land in S3, register in Glue Catalog. Near-real-time change capture toward lakes without
        polling, JDBC, or full-table export on every schedule tick.
      </Callout>

      <Definition term="Streams + Lambda CDC">
        <p>
          Lambda polls stream shards via event source mapping with configurable batch size and parallelization
          factor. Each invocation receives a batch of stream records — deserialize DynamoDB attribute format,
          map to flat JSON, write to S3 prefix partitioned by date, optionally emit to Kinesis Firehose for
          buffering. Failed batches retry; after max retries, records go to Lambda DLQ or on-failure destination
          — same reliability model as Kinesis consumers.
        </p>
      </Definition>

      <LessonSection title="Architecture — change capture toward lakes">
        <Flowchart
          title="DynamoDB Streams + Lambda to S3 lake"
          chart={`flowchart TB
  APP[Application writes]
  DDB[(DynamoDB table)]
  STR[DynamoDB Stream]
  ESM[Lambda event source mapping]
  LAM[Transform Lambda]
  S3[(S3 bronze prefix)]
  GLUE[Glue Crawler or partition projection]
  ATH[Athena / Spark downstream]
  APP --> DDB
  DDB --> STR
  STR --> ESM
  ESM --> LAM
  LAM --> S3
  S3 --> GLUE
  GLUE --> ATH`}
        />
        <ContentStep number={1} title="Enable stream and mapping">
          <p className="text-slate-300">
            Table stream view <span className="font-mono text-sm">NEW_AND_OLD_IMAGES</span> for MODIFY CDC.
            Lambda execution role: <span className="font-mono text-sm">dynamodb:GetRecords</span> on stream
            ARN, <span className="font-mono text-sm">s3:PutObject</span> on bronze bucket, optional KMS
            encrypt. Starting position TRIM_HORIZON for backfill from stream retention; LATEST for forward-only
            after cutover.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Transform and partition strategy">
          <p className="text-slate-300">
            Flatten DynamoDB typed JSON ({'{'}{'S'}: value{'}'} format) to plain columns. Partition S3 by{' '}
            <span className="font-mono text-sm">year/month/day/hour</span> from{' '}
            <span className="font-mono text-sm">ApproximateCreationDateTime</span> or business timestamp in
            item. Include <span className="font-mono text-sm">event_type</span> (INSERT/MODIFY/REMOVE) and
            sequence number for dedupe in silver Glue job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Batching and throughput">
          <p className="text-slate-300">
            Default batch size 100 — tune up for small items, down for large payloads approaching 6 MB Lambda
            event limit. Parallelization factor splits one shard across multiple Lambda instances — use when
            single consumer lags (high IteratorAge). On-demand table scales writes; Lambda concurrency cap may
            become bottleneck before DynamoDB does.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Production DE concerns">
        <ContentStep number={1} title="Idempotency and ordering">
          <p className="text-slate-300">
            Same record may appear in multiple batches after retry — S3 key should include sequence number or
            content hash. Silver job merges on primary key + sequence. Per-partition ordering preserved within
            shard — global ordering not guaranteed across keys.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Large item and REMOVE handling">
          <p className="text-slate-300">
            MODIFY with big nested documents — consider landing full NEW_IMAGE to S3 and referencing in catalog.
            REMOVE events: write tombstone file with PK/SK only for GDPR delete propagation to curated layer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Failure and recovery">
          <p className="text-slate-300">
            IteratorAge alarm — if consumer down near 24h, data loss risk when stream records expire. Recovery:
            fix Lambda, optionally trigger PITR export to S3 for gap window, reconcile counts in Athena.
            BisectBatchOnFunctionError isolates poison records — pair with DLQ inspection runbook.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Alternative: Kinesis Data Streams adapter">
          <p className="text-slate-300">
            High-volume teams use DynamoDB Streams → Kinesis Data Streams (0.5 MB/s per shard) → multiple
            consumers (Lambda, Firehose, custom). Decouples lake ingest from other stream consumers (search
            index, cache invalidation) without duplicate Lambda mappings on same table.
          </p>
        </ContentStep>
        <Example title="Lambda handler sketch" caption="Stream batch to S3">
{`def handler(event, context):
    for record in event['Records']:
        event_name = record['eventName']  # INSERT, MODIFY, REMOVE
        seq = record['dynamodb']['SequenceNumber']
        new_img = record['dynamodb'].get('NewImage', {})
        pk = new_img.get('order_id', {}).get('S', 'removed')
        key = f"bronze/orders/dt={date}/seq={seq}.json"
        s3.put_object(Bucket=BUCKET, Key=key, Body=json.dumps(flatten(new_img)))
    # Partial batch failure: return batchItemFailures for retry semantics`}
        </Example>
        <Callout variant="tip">
          Enable S3 bucket EventBridge notification on bronze prefix → trigger Glue job on object count
          threshold — batch silver transforms without per-record Glue startup cost.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Streams + Lambda: standard near-real-time DynamoDB CDC path — transform stream records to S3 bronze.',
          'NEW_AND_OLD_IMAGES for MODIFY merges; partition by event time; include sequence for idempotent silver.',
          'Tune batch size and parallelization factor; alarm IteratorAge before 24h stream retention expires.',
          'Idempotent S3 writes and tombstone REMOVE events — retries and duplicates are normal.',
          'Scale-out option: Streams to Kinesis Data Streams for multiple downstream lake and app consumers.',
        ]}
      />
    </LessonArticle>
  )
}
