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

export function IdempotentConsumers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Duplicates are normal — design for them">
        Standard SQS queues deliver <strong className="text-white">at least once</strong>. Add visibility
        timeouts that expire mid-run, Lambda retries, DLQ redrives, and S3 notifications that themselves
        duplicate, and every consumer will eventually see the same work twice. An{' '}
        <strong className="text-white">idempotent consumer</strong> produces the same end state whether a message
        is processed once or five times — no double-counted revenue, no duplicate Glue runs.
      </Callout>

      <Definition term="Idempotent consumer">
        <p>
          A message handler whose side effects are safe to repeat. It derives an{' '}
          <strong className="text-white">idempotency key</strong> from each message, checks or records that key
          atomically before doing irreversible work, and writes outputs to deterministic locations so replays
          overwrite rather than append.
        </p>
      </Definition>

      <LessonSection title="Choosing the idempotency key">
        <ContentStep number={1} title="SQS message ID — narrow protection">
          <p className="text-slate-300">
            <span className="font-mono text-sm">messageId</span> is stable across redeliveries of the same
            message, so it catches visibility-timeout duplicates. It does not catch the producer sending the same
            event twice (two sends, two message IDs) or S3 emitting duplicate notifications.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Business key — the DE default">
          <p className="text-slate-300">
            Build the key from what the message is <em>about</em>: bucket + object key + eTag for landing files,{' '}
            <span className="font-mono text-sm">order_id</span> + <span className="font-mono text-sm">version</span>{' '}
            for CDC rows, <span className="font-mono text-sm">dataset</span> +{' '}
            <span className="font-mono text-sm">run_date</span> for batch triggers. Same logical event, same key —
            regardless of how many messages carried it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Where FIFO dedup fits">
          <p className="text-slate-300">
            FIFO dedup IDs stop duplicate sends inside 5 minutes. Consumers still need their own gate for
            redrives, late duplicates, and partial failures after side effects.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DynamoDB conditional ingest gate">
        <Flowchart
          title="Gate before side effects"
          chart={`flowchart TB
  MSG[SQS message]
  KEY[Derive business key]
  PUT[Conditional PutItem]
  NEW[Key is new]
  DUP[Key exists]
  WORK[Write S3 and start Glue]
  DONE[Mark COMPLETED]
  SKIP[Skip and delete message]
  MSG --> KEY
  KEY --> PUT
  PUT --> NEW
  PUT --> DUP
  NEW --> WORK
  WORK --> DONE
  DUP --> SKIP`}
        />
        <ContentStep number={1} title="Claim the key atomically">
          <p className="text-slate-300">
            <span className="font-mono text-sm">PutItem</span> into{' '}
            <span className="font-mono text-sm">de-ingest-dedupe-prod</span> with{' '}
            <span className="font-mono text-sm">attribute_not_exists(pk)</span>. Exactly one concurrent consumer
            wins; the others get <span className="font-mono text-sm">ConditionalCheckFailedException</span> and
            treat it as &quot;already handled&quot;. Add a TTL attribute so rows expire after the replay window.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Handle crashes between claim and completion">
          <p className="text-slate-300">
            Store <span className="font-mono text-sm">status=IN_PROGRESS</span> with a lease expiry. If a consumer
            crashes after claiming, a later retry can take over once the lease expires, then set{' '}
            <span className="font-mono text-sm">COMPLETED</span>. Without this, a crash leaves the key claimed and
            the work never done.
          </p>
        </ContentStep>
        <Example title="Conditional claim in Python" caption="Duplicate is a success path">
{`from botocore.exceptions import ClientError

def claim(key: str, now: int) -> bool:
    try:
        dedupe.put_item(
            Item={'pk': key, 'status': 'IN_PROGRESS',
                  'lease_until': now + 900, 'expires_at': now + 7 * 86400},
            ConditionExpression='attribute_not_exists(pk) OR (#s = :ip AND lease_until < :now)',
            ExpressionAttributeNames={'#s': 'status'},
            ExpressionAttributeValues={':ip': 'IN_PROGRESS', ':now': now},
        )
        return True
    except ClientError as e:
        if e.response['Error']['Code'] == 'ConditionalCheckFailedException':
            return False          # already done or in progress elsewhere — skip
        raise`}
        </Example>
      </LessonSection>

      <LessonSection title="Overwrite-safe outputs">
        <ContentStep number={1} title="Deterministic S3 keys">
          <p className="text-slate-300">
            Name outputs from the input, not from time or random UUIDs:{' '}
            <span className="font-mono text-sm">silver/orders/dt=2026-09-30/src=part-0001.parquet</span>. A replay
            rewrites the same object instead of adding a second copy that Athena counts twice.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Upserts and partition overwrites">
          <p className="text-slate-300">
            Warehouse loads use MERGE on business keys, Glue writes use dynamic partition overwrite, and counters
            use conditional updates keyed by event ID. Avoid blind INSERT and append-mode writes in anything a
            queue message can trigger.
          </p>
        </ContentStep>
        <Callout variant="info">
          Powertools for AWS Lambda (Python) ships an <strong className="text-white">idempotency utility</strong>{' '}
          that wraps a handler or function with a DynamoDB-backed record keyed by a JMESPath expression over the
          payload — including in-progress locking and cached results. It is a good default instead of
          hand-rolling the gate.
        </Callout>
      </LessonSection>

      <LessonSection title="Testing replay">
        <ContentStep number={1} title="Prove it before production does">
          <p className="text-slate-300">
            Integration test: send the same message twice, assert one DynamoDB COMPLETED row, one S3 object, one
            Glue run. Chaos test: kill the consumer after the S3 write but before delete, let visibility expire,
            and verify the retry leaves identical output. Run a DLQ redrive of already-processed messages in
            staging and confirm row counts do not change.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'At-least-once delivery means every consumer sees duplicates — idempotency is mandatory, not optional.',
          'Prefer business keys (bucket + key + eTag, order_id + version) over SQS message IDs.',
          'Gate side effects with DynamoDB conditional PutItem; treat ConditionalCheckFailed as a skip.',
          'Deterministic S3 keys, MERGE, and partition overwrite make replays converge to the same state.',
          'Use Powertools idempotency where it fits, and test duplicate sends, crashes, and DLQ redrives.',
        ]}
      />
    </LessonArticle>
  )
}
