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

export function FifoOrderingAndDeduplication() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="FIFO is ordered per group — not globally">
        A FIFO queue does not force every message through one single-file line. You choose a{' '}
        <strong className="text-white">MessageGroupId</strong>, and SQS guarantees order{' '}
        <em>within</em> each group while processing different groups in parallel. Getting the group key right is
        the difference between a correct CDC pipeline and either scrambled updates or a queue that crawls.
      </Callout>

      <Definition term="MessageGroupId and MessageDeduplicationId">
        <p>
          <span className="font-mono text-sm">MessageGroupId</span> (required on FIFO sends) tags messages that
          must be processed strictly in order; only one batch per group is in flight at a time.{' '}
          <span className="font-mono text-sm">MessageDeduplicationId</span> identifies a send — any message with
          the same dedup ID accepted within the <strong className="text-white">5-minute deduplication
          interval</strong> is acknowledged but not delivered again. With{' '}
          <span className="font-mono text-sm">ContentBasedDeduplication</span> enabled, SQS uses a SHA-256 hash of
          the body as the dedup ID.
        </p>
      </Definition>

      <LessonSection title="Ordering semantics">
        <ContentStep number={1} title="Order within a group">
          <p className="text-slate-300">
            Customer <span className="font-mono text-sm">C-1042</span> updates address, then closes account.
            Both messages use <span className="font-mono text-sm">MessageGroupId=C-1042</span>, so consumers
            always see update before close. The next message for C-1042 is not delivered until the current one is
            deleted or its visibility expires.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parallelism across groups">
          <p className="text-slate-300">
            Thousands of customers means thousands of independent groups; many consumers work concurrently, one
            per active group. Lambda FIFO consumers scale to the number of active groups — a single group ID for
            everything caps you at one concurrent invocation.
          </p>
        </ContentStep>
        <Flowchart
          title="Per-entity ordering with message groups"
          chart={`flowchart LR
  CDC[CDC producer]
  Q[de-customers-cdc-queue-prod.fifo]
  G1[Group C-1042]
  G2[Group C-2077]
  G3[Group C-3310]
  W1[Consumer A]
  W2[Consumer B]
  W3[Consumer C]
  CDC --> Q
  Q --> G1
  Q --> G2
  Q --> G3
  G1 -->|in order| W1
  G2 -->|in order| W2
  G3 -->|in order| W3`}
        />
        <ContentStep number={3} title="Choosing the group key for CDC">
          <p className="text-slate-300">
            Use the entity primary key — <span className="font-mono text-sm">customer_id</span>,{' '}
            <span className="font-mono text-sm">order_id</span> — so changes to one row stay ordered while the
            table as a whole processes in parallel. Grouping by table name orders everything and throttles
            throughput to one consumer; grouping by random UUID gives parallelism but no useful ordering.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Deduplication">
        <ContentStep number={1} title="Explicit dedup ID vs content-based">
          <p className="text-slate-300">
            Prefer an explicit business-derived ID such as{' '}
            <span className="font-mono text-sm">orders:2026-09-30:part-0001</span> or the CDC log sequence number.
            Content-based dedup breaks when bodies include a timestamp or trace ID that changes on retry — two
            logically identical sends hash differently and both get delivered.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The 5-minute window">
          <p className="text-slate-300">
            Dedup protects against producer retries (network timeout after SQS accepted the send), not against
            the same event arriving an hour later. Long-horizon duplicates still need an idempotent consumer
            backed by a DynamoDB dedupe table.
          </p>
        </ContentStep>
        <Example title="FIFO send with group and dedup IDs" caption="Per-customer ordering, sequence-based dedup">
{`sqs.send_message(
    QueueUrl='https://sqs.us-east-1.amazonaws.com/111122223333/de-customers-cdc-queue-prod.fifo',
    MessageBody=json.dumps({'op': 'UPDATE', 'customer_id': 'C-1042', 'lsn': 88213377}),
    MessageGroupId='C-1042',
    MessageDeduplicationId='customers-88213377',
)`}
        </Example>
        <Callout variant="tip">
          Dedup IDs can be up to 128 characters. Derive them deterministically from the source event — the CDC log
          sequence number or an S3 key plus eTag — so a retried producer always regenerates exactly the same ID
          instead of a fresh UUID that defeats deduplication.
        </Callout>
      </LessonSection>

      <LessonSection title="Throughput and pitfalls">
        <ContentStep number={1} title="High-throughput FIFO">
          <p className="text-slate-300">
            Default FIFO supports 300 API calls per second per action (3,000 messages per second with batches of
            10). Enabling high-throughput mode —{' '}
            <span className="font-mono text-sm">DeduplicationScope=messageGroup</span> and{' '}
            <span className="font-mono text-sm">FifoThroughputLimit=perMessageGroupId</span> — raises limits to
            tens of thousands of transactions per second in major Regions, provided traffic spreads across many
            group IDs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Head-of-line blocking">
          <p className="text-slate-300">
            A poison message at the front of group C-1042 blocks every later message for that customer until it
            succeeds or moves to the FIFO DLQ. Keep maxReceiveCount modest, alarm on{' '}
            <span className="font-mono text-sm">ApproximateAgeOfOldestMessage</span>, and remember a stuck group
            does not block other groups.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hot groups">
          <p className="text-slate-300">
            One tenant producing 90% of events creates a single hot group that runs serially. Split by a finer key
            (tenant plus entity ID) when strict tenant-wide ordering is not actually required.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Ask &quot;what must be ordered relative to what?&quot; The smallest scope that preserves correctness is
          the right MessageGroupId — usually one business entity, rarely a whole table.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'FIFO orders messages within a MessageGroupId and processes different groups in parallel.',
          'Use the entity key (customer_id) as group ID for CDC — table-level groups serialize everything.',
          'Dedup IDs suppress repeat sends inside a 5-minute window; content-based dedup hashes the body.',
          'High-throughput FIFO needs per-group dedup scope and many distinct group IDs.',
          'Poison messages cause head-of-line blocking for their group — pair FIFO with a FIFO DLQ and age alarms.',
        ]}
      />
    </LessonArticle>
  )
}
