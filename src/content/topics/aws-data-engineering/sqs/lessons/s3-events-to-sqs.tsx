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

export function S3EventsToSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every landed file becomes a unit of work">
        When a vendor drops files into <span className="font-mono text-sm">s3://acme-lake-prod/landing/</span>, S3
        can emit an <span className="font-mono text-sm">ObjectCreated</span> notification per object. Pointing
        those notifications at an SQS queue turns the landing zone into a durable work list: nothing is lost if
        consumers are down, bursts are absorbed, and ETL runs at the pace downstream systems can handle.
      </Callout>

      <Definition term="S3 event notification to SQS">
        <p>
          A bucket notification configuration that sends a JSON message to a Standard SQS queue when matching
          events occur (for example <span className="font-mono text-sm">s3:ObjectCreated:*</span> with prefix{' '}
          <span className="font-mono text-sm">landing/orders/</span> and suffix{' '}
          <span className="font-mono text-sm">.csv</span>). S3 needs permission via the queue access policy. FIFO
          queues are not supported as direct S3 notification targets — route through EventBridge if you need
          FIFO.
        </p>
      </Definition>

      <LessonSection title="Wiring it up">
        <ContentStep number={1} title="Direct notification or EventBridge">
          <p className="text-slate-300">
            <strong className="text-white">Direct</strong>: simplest, lowest latency, one destination per
            overlapping prefix/suffix rule. <strong className="text-white">EventBridge</strong>: enable
            &quot;Send notifications to EventBridge&quot; on the bucket, then rules with rich filtering (key
            patterns, size) fan out to multiple targets including SQS FIFO, Step Functions, and archives with
            replay.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Queue policy for s3.amazonaws.com">
          <p className="text-slate-300">
            Grant <span className="font-mono text-sm">sqs:SendMessage</span> to the S3 service principal and pin
            it with <span className="font-mono text-sm">aws:SourceArn</span> (the bucket) and{' '}
            <span className="font-mono text-sm">aws:SourceAccount</span> to prevent confused-deputy access from
            other buckets. If the queue uses SSE-KMS with a customer managed key, the key policy must also allow
            S3 to call <span className="font-mono text-sm">kms:GenerateDataKey</span> and{' '}
            <span className="font-mono text-sm">kms:Decrypt</span>.
          </p>
        </ContentStep>
        <Example title="Queue access policy" caption="Allow only acme-lake-prod in this account">
{`{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "AllowS3LandingEvents",
    "Effect": "Allow",
    "Principal": { "Service": "s3.amazonaws.com" },
    "Action": "sqs:SendMessage",
    "Resource": "arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-queue-prod",
    "Condition": {
      "ArnLike": { "aws:SourceArn": "arn:aws:s3:::acme-lake-prod" },
      "StringEquals": { "aws:SourceAccount": "111122223333" }
    }
  }]
}`}
        </Example>
        <ContentStep number={3} title="The test event">
          <p className="text-slate-300">
            Saving the notification configuration sends an <span className="font-mono text-sm">s3:TestEvent</span>{' '}
            message with no <span className="font-mono text-sm">Records</span> array. Consumers must recognise and
            skip it, or the first message after deployment lands in the DLQ.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Parsing the message">
        <ContentStep number={1} title="Records inside the body">
          <p className="text-slate-300">
            The SQS body is a JSON string containing a <span className="font-mono text-sm">Records</span> list —
            usually one record, but code should loop. Each record has{' '}
            <span className="font-mono text-sm">s3.bucket.name</span>,{' '}
            <span className="font-mono text-sm">s3.object.key</span>,{' '}
            <span className="font-mono text-sm">size</span>, <span className="font-mono text-sm">eTag</span>, and{' '}
            <span className="font-mono text-sm">sequencer</span>. Via SNS the body is wrapped in an envelope; via
            EventBridge the shape is an EventBridge event with <span className="font-mono text-sm">detail</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="URL-decode object keys">
          <p className="text-slate-300">
            Keys arrive URL-encoded: spaces become <span className="font-mono text-sm">+</span>, and{' '}
            <span className="font-mono text-sm">=</span> in Hive partitions becomes{' '}
            <span className="font-mono text-sm">%3D</span>. Always apply{' '}
            <span className="font-mono text-sm">urllib.parse.unquote_plus</span> before calling GetObject or you
            will get NoSuchKey on files like <span className="font-mono text-sm">dt=2026-09-30/Q3 orders.csv</span>.
          </p>
        </ContentStep>
        <Example title="Lambda parsing S3 events from SQS" caption="Skip test events, decode keys">
{`import json, urllib.parse

def handler(event, context):
    failures = []
    for record in event['Records']:
        body = json.loads(record['body'])
        if body.get('Event') == 's3:TestEvent':
            continue
        try:
            for s3rec in body.get('Records', []):
                bucket = s3rec['s3']['bucket']['name']
                key = urllib.parse.unquote_plus(s3rec['s3']['object']['key'])
                size = s3rec['s3']['object'].get('size', 0)
                register_landing_file(bucket, key, size)   # DynamoDB ingest gate
        except Exception:
            failures.append({'itemIdentifier': record['messageId']})
    return {'batchItemFailures': failures}`}
        </Example>
      </LessonSection>

      <LessonSection title="Bursts and triggering Glue">
        <Flowchart
          title="Landing zone buffered by SQS"
          chart={`flowchart TB
  V[Vendor bulk drop 20k files]
  S3[(acme-lake-prod landing)]
  Q[de-orders-ingest-queue-prod]
  L[Lambda ingest gate]
  DDB[(DynamoDB file registry)]
  G[Glue job micro-batch]
  DLQ[DLQ plus alarm]
  V --> S3
  S3 -->|ObjectCreated| Q
  Q --> L
  L --> DDB
  DDB --> G
  Q -->|max receives| DLQ`}
        />
        <ContentStep number={1} title="Buffer the bulk drop">
          <p className="text-slate-300">
            A vendor backfill of 20,000 files generates 20,000 notifications in minutes. Direct S3 → Lambda would
            spike concurrency; with SQS the backlog sits in the queue and a capped ESM drains it steadily while{' '}
            <span className="font-mono text-sm">ApproximateAgeOfOldestMessage</span> tells you how far behind you
            are.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per-file Glue trigger vs micro-batch">
          <p className="text-slate-300">
            Starting one Glue job per file means 20,000 job runs, minutes of startup each, and concurrency
            quota errors. Instead, register each file in DynamoDB (or batch 1,000 records with a batching window)
            and start one Glue run per partition or per N files. Per-file triggers are fine only for rare, large
            files.
          </p>
        </ContentStep>
        <Callout variant="tip">
          S3 notifications are at-least-once and can arrive out of order. Deduplicate on bucket + key + eTag (or
          sequencer) in DynamoDB before starting expensive work.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3 ObjectCreated notifications to a Standard queue turn the landing zone into a durable work list.',
          'Queue policy must allow s3.amazonaws.com with aws:SourceArn and aws:SourceAccount conditions.',
          'Skip the s3:TestEvent message and loop over the Records array in each body.',
          'URL-decode keys with unquote_plus before GetObject — spaces and partition equals signs are encoded.',
          'Buffer bulk drops in SQS and micro-batch Glue runs instead of one job per file.',
        ]}
      />
    </LessonArticle>
  )
}
