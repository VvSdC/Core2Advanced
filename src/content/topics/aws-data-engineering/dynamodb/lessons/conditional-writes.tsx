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

export function ConditionalWrites() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Assume every pipeline trigger fires twice">
        S3 events duplicate, Lambda retries, Step Functions replay stages, and Glue bookmarks reset during
        incidents. DynamoDB <strong className="text-white">conditional writes</strong> let data engineering
        control plane tables enforce &quot;only if not already processed&quot; and &quot;only if version
        matches&quot; atomically — the foundation of safe updates and idempotency without a separate locking
        service.
      </Callout>

      <Definition term="Conditional write">
        <p>
          A write operation (<span className="font-mono text-sm">PutItem</span>,{' '}
          <span className="font-mono text-sm">UpdateItem</span>,{' '}
          <span className="font-mono text-sm">DeleteItem</span>) that succeeds only when a{' '}
          <span className="font-mono text-sm">ConditionExpression</span> evaluates to true — for example,
          attribute_not_exists(pk), version = 3, or status = PENDING. If the condition fails, DynamoDB returns{' '}
          <span className="font-mono text-sm">ConditionalCheckFailedException</span> and makes no change.
          Conditions are evaluated atomically with the write.
        </p>
      </Definition>

      <LessonSection title="Conditional writes for safe updates">
        <ContentStep number={1} title="Optimistic locking with version attribute">
          <p className="text-slate-300">
            Pipeline state item carries <span className="font-mono text-sm">version</span> integer. Update
            Step Functions stage only if <span className="font-mono text-sm">version = expected</span>, then
            increment version in same UpdateItem. Concurrent writers — two Lambda invocations from duplicate
            S3 events — one wins, one gets ConditionalCheckFailed and exits cleanly without corrupting state.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Status transition guards">
          <p className="text-slate-300">
            Watermark row: allow transition PENDING → RUNNING only when{' '}
            <span className="font-mono text-sm">status = PENDING</span>. Prevents re-entry after SUCCESS.
            Failed conditional → log and skip — duplicate trigger handled without starting second Glue job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Create-if-not-exists dedupe">
          <p className="text-slate-300">
            Ingest dedupe table: <span className="font-mono text-sm">PutItem</span> with{' '}
            <span className="font-mono text-sm">attribute_not_exists(file_hash)</span>. First arrival inserts;
            retry sees existing hash and aborts downstream Glue trigger. TTL on dedupe rows expires old hashes
            automatically after retention window.
          </p>
        </ContentStep>
        <Flowchart
          title="Idempotent ingest with conditional PutItem"
          chart={`flowchart TB
  EVT[S3 event duplicate]
  LAM[Lambda ingest gate]
  DDB[(Dedupe table)]
  PUT[PutItem file_hash condition not exists]
  EVT --> LAM
  LAM --> PUT
  PUT -->|success first time| GLUE[Start Glue job]
  PUT -->|ConditionalCheckFailed| SKIP[Skip duplicate safe]`}
        />
      </LessonSection>

      <LessonSection title="Idempotency patterns for DE">
        <ContentStep number={1} title="Idempotency keys from upstream">
          <p className="text-slate-300">
            API Gateway or Kinesis producer sends <span className="font-mono text-sm">idempotency_key</span>.
            Lambda writes result to DynamoDB with condition{' '}
            <span className="font-mono text-sm">attribute_not_exists(idempotency_key)</span> before side
            effects (S3 write, Glue StartJobRun). Retry returns cached response from existing item — same
            pattern as payment systems, applied to pipeline orchestration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TransactWriteItems for multi-item atomicity">
          <p className="text-slate-300">
            Move watermark and audit log in one transaction — both succeed or neither. Useful when updating
            <span className="font-mono text-sm">pipeline_runs</span> and{' '}
            <span className="font-mono text-sm">dataset_locks</span> together. Up to 100 actions per
            transaction; 4 MB size limit. Prefer over best-effort dual UpdateItem for control plane consistency.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Handling ConditionalCheckFailed in code">
          <p className="text-slate-300">
            Treat failure as success path for idempotency — catch exception, read current item, return prior
            run_id. Do not retry conditional write blindly in loop — indicates legitimate conflict or duplicate.
            Metric: rate of conditional failures per dataset — spike may mean upstream duplicate storm or bug.
          </p>
        </ContentStep>
        <Example title="UpdateItem with condition" caption="Stage transition guard">
{`table.update_item(
    Key={'dataset_name': 'orders', 'run_date': '2024-06-01'},
    UpdateExpression='SET #s = :running, glue_run_id = :run, version = version + :inc',
    ConditionExpression='#s = :pending AND version = :ver',
    ExpressionAttributeNames={'#s': 'status'},
    ExpressionAttributeValues={
        ':running': 'RUNNING',
        ':pending': 'PENDING',
        ':run': glue_run_id,
        ':ver': 4,
        ':inc': 1,
    },
)
# ConditionalCheckFailedException → another worker already claimed run`}
        </Example>
        <Callout variant="tip">
          Combine conditional writes with TTL on ephemeral dedupe rows — automatic cleanup without Scan-delete
          batch jobs. Set <span className="font-mono text-sm">expires_at</span> epoch seconds; DynamoDB removes
          items within 48 hours of expiry at no WCU cost.
        </Callout>
      </LessonSection>

      <LessonSection title="Anti-patterns and ops">
        <ContentStep number={1} title="Read-modify-write without condition">
          <p className="text-slate-300">
            GetItem → if status PENDING then UpdateItem — race window between read and write. Two Lambdas both
            see PENDING and both start Glue. Always encode expectation in ConditionExpression on the write.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Overwriting with unconditional PutItem">
          <p className="text-slate-300">
            PutItem without condition replaces entire item — drops attributes not in payload. Pipeline state
            tables should use UpdateItem with explicit SET clauses or PutItem with condition on version.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Testing idempotency">
          <p className="text-slate-300">
            Integration tests replay same S3 event twice — assert one Glue run, second invocation exits with
            conditional skip. Chaos: kill Lambda mid-write and verify retry does not double-charge downstream.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ConditionExpression makes writes atomic — succeed only if version, status, or existence matches expectation.',
          'Idempotency: attribute_not_exists on dedupe key; optimistic locking with version increment on UpdateItem.',
          'ConditionalCheckFailed is often the happy path for duplicate events — catch, read state, skip side effects.',
          'TransactWriteItems coordinates multi-table control plane updates — watermark + lock in one atomic step.',
          'Never rely on read-modify-write without condition — race conditions duplicate Glue runs and lake writes.',
        ]}
      />
    </LessonArticle>
  )
}
