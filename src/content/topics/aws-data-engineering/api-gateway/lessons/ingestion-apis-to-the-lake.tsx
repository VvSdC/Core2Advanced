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

export function IngestionApisToTheLake() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Accept fast, process later, never lose an event">
        Partners and SaaS webhooks expect a quick 2xx, retry on anything else, and will happily send the same
        event three times. A production ingestion API must answer in milliseconds, survive bursts, dedupe
        retries, and still land every record in <code className="text-core-400">acme-lake-prod</code> bronze
        partitioned by date. This lesson assembles the pieces from earlier sub-topics into one architecture.
      </Callout>

      <Definition term="Ingestion API">
        <p>
          A public or partner-facing endpoint whose only job is to <strong className="text-white">authenticate,
          validate, and durably buffer</strong> incoming data, then acknowledge. Processing — parsing, enrichment,
          dedupe, writing Parquet — happens asynchronously behind a queue or stream. The API returns{' '}
          <code className="text-core-400">202 Accepted</code> (or 200) as soon as the record is safely in SQS or
          Firehose.
        </p>
      </Definition>

      <LessonSection title="Reference architecture">
        <Flowchart
          title="acme-ingest-api-prod to the lake"
          chart={`flowchart TB
  SRC[Partner or SaaS webhook]
  GW[API Gateway auth validation throttling]
  Q[SQS de-webhooks-queue-prod]
  DLQ[SQS DLQ]
  LAM[Processor Lambda]
  DDB[DynamoDB dedupe table]
  FH[Firehose]
  S3[S3 bronze dt partitions]
  GLUE[Glue crawler or partition projection]
  ATH[Athena and silver jobs]
  SRC --> GW
  GW -->|202 Accepted| SRC
  GW --> Q
  Q --> LAM
  Q -->|max receives exceeded| DLQ
  LAM --> DDB
  LAM --> FH
  FH --> S3
  S3 --> GLUE
  GLUE --> ATH`}
        />
        <ContentStep number={1} title="Edge: API Gateway">
          <p className="text-slate-300">
            Authorizer identifies the partner, request validator rejects malformed bodies, usage plan throttles
            each partner, and a direct SQS integration or thin Lambda enqueues the raw payload with the request id
            and partner id as message attributes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Buffer: SQS or Firehose">
          <p className="text-slate-300">
            SQS when each event needs per-record logic (signature checks, dedupe, routing). Firehose when records
            can go straight to S3 with buffering and optional Lambda transform — lowest operational effort for
            pure append logs. Both absorb bursts far beyond what a consumer can process in real time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Land: S3 bronze partitioned by date">
          <p className="text-slate-300">
            Write to <code className="text-core-400">s3://acme-lake-prod/bronze/partner_events/source=globex/dt=2026-09-30/</code>.
            Keep the raw payload untouched plus envelope fields. Partition projection in Glue avoids crawler runs
            for predictable date prefixes.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Correctness: idempotency and signatures">
        <ContentStep number={1} title="Dedupe with event ids">
          <p className="text-slate-300">
            Require partners to send a stable <code className="text-core-400">event_id</code> or{' '}
            <code className="text-core-400">Idempotency-Key</code> header. The processor does a DynamoDB conditional{' '}
            <code className="text-core-400">PutItem</code> with <code className="text-core-400">attribute_not_exists(event_id)</code>{' '}
            and a TTL of a few days. Condition failure means duplicate — delete the message and move on.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Verify webhook signatures">
          <p className="text-slate-300">
            SaaS providers sign the raw body with HMAC-SHA256 using a shared secret. Store the secret in Secrets
            Manager as <code className="text-core-400">de/prod/webhooks/globex-signing-secret</code>, cache it in
            the Lambda authorizer or processor, compute the HMAC over the exact raw bytes, and compare in constant
            time. Also reject stale timestamps to block replays.
          </p>
        </ContentStep>
        <Example title="HMAC verification in the processor" caption="Python — raw body, constant-time compare, timestamp window">
{`import hashlib, hmac, json, time

def verify(raw_body: bytes, sig_header: str, ts_header: str, secret: bytes) -> bool:
    if abs(time.time() - int(ts_header)) > 300:
        return False  # replay protection: 5-minute window
    signed = ts_header.encode() + b"." + raw_body
    expected = hmac.new(secret, signed, hashlib.sha256).hexdigest()
    return hmac.compare_digest(expected, sig_header)

def handler(event, context):
    for msg in event["Records"]:
        attrs = msg["messageAttributes"]  # signature headers copied in by the API mapping
        raw = msg["body"].encode()
        if not verify(raw, attrs["signature"]["stringValue"], attrs["timestamp"]["stringValue"], SECRET):
            continue  # forged or stale — log and drop
        body = json.loads(raw)
        try:
            dedupe.put_item(
                Item={"event_id": body["event_id"], "expires_at": int(time.time()) + 3 * 86400},
                ConditionExpression="attribute_not_exists(event_id)",
            )
        except dedupe.meta.client.exceptions.ConditionalCheckFailedException:
            continue  # duplicate delivery — already landed
        firehose.put_record(DeliveryStreamName=STREAM, Record={"Data": json.dumps(body) + "\\n"})`}
        </Example>
        <Callout variant="info" title="Where to verify the signature">
          Verifying in a Lambda authorizer rejects forgeries before they touch the queue, but Lambda authorizers
          never receive the request body. If the signature covers the body, verify in the processor Lambda — or
          use a thin Lambda integration that checks and then enqueues.
        </Callout>
      </LessonSection>

      <LessonSection title="Failure handling and large payloads">
        <ContentStep number={1} title="DLQ and replay">
          <p className="text-slate-300">
            Set a redrive policy with max receives of 5 to a DLQ. Alarm on{' '}
            <code className="text-core-400">ApproximateNumberOfMessagesVisible</code> above 0 on the DLQ, notify{' '}
            <code className="text-core-400">de-alerts-prod</code>, fix the bug, then use SQS redrive to move messages
            back. Because bronze keeps raw payloads, you can also replay from S3 if logic changes later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Large files via presigned URLs">
          <p className="text-slate-300">
            API Gateway payloads cap at 10 MB. For partner CSV drops, expose{' '}
            <code className="text-core-400">POST /uploads</code> that returns a presigned S3 PUT URL scoped to{' '}
            <code className="text-core-400">bronze/uploads/source=globex/</code> with a short expiry. The partner
            uploads directly to S3; an S3 event notification then drives processing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Capacity planning">
          <p className="text-slate-300">
            Estimate peak rps per partner and total. Check the account Region throttle, SQS is effectively
            unlimited for standard queues, Firehose has per-stream throughput quotas, and processor Lambda
            concurrency sets drain speed. Size so a 10x burst queues for minutes, not hours.
          </p>
        </ContentStep>
        <Flowchart
          title="Large file upload path"
          chart={`flowchart LR
  P[Partner]
  API[POST uploads]
  URL[Presigned PUT URL]
  S3[S3 bronze uploads]
  EVT[S3 event notification]
  Q[SQS processing queue]
  P --> API
  API --> URL
  URL --> P
  P -->|PUT file| S3
  S3 --> EVT
  EVT --> Q`}
        />
        <Callout variant="tip">
          Return the request id and the event id in every 202 response. When a partner says &quot;you lost our
          event&quot;, you can search access logs and bronze by that id in seconds.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Ingestion APIs authenticate, validate, buffer, and return 202 fast — processing happens asynchronously.',
          'SQS fits per-record logic; Firehose fits straight-to-S3 append logs with minimal code.',
          'Dedupe with partner event ids and DynamoDB conditional writes with TTL — retries are normal.',
          'Verify HMAC webhook signatures over the raw body with a secret from Secrets Manager and a timestamp window.',
          'Use DLQs plus redrive for failures, and presigned S3 URLs for anything near or above 10 MB.',
        ]}
      />
    </LessonArticle>
  )
}
