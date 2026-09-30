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

export function StandardVsFifoQueues() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pick the queue type before you create the queue">
        SQS offers two queue types, and you cannot convert one into the other after creation.{' '}
        <strong className="text-white">Standard</strong> queues trade strict ordering for nearly unlimited
        throughput. <strong className="text-white">FIFO</strong> queues guarantee order and deduplicate
        within a message group, at a lower throughput ceiling. Most lake ingest uses Standard; ordered change
        data per entity reaches for FIFO.
      </Callout>

      <Definition term="Standard queue vs FIFO queue">
        <p>
          A <strong className="text-white">Standard queue</strong> delivers each message at least once, in
          best-effort order, with nearly unlimited transactions per second. A{' '}
          <strong className="text-white">FIFO queue</strong> (name must end in{' '}
          <code className="text-core-400">.fifo</code>) delivers messages in the exact order they were sent{' '}
          <em>within each message group</em>, and drops duplicate sends that arrive within a 5-minute
          deduplication window.
        </p>
      </Definition>

      <LessonSection title="Standard queues — throughput first">
        <ContentStep number={1} title="Nearly unlimited throughput">
          <p className="text-slate-300">
            Standard queues scale transparently — a backfill that sends hundreds of thousands of landing
            notifications per minute needs no capacity planning on the queue itself.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Best-effort ordering">
          <p className="text-slate-300">
            Messages usually come out roughly in the order they went in, but not always. The notification for{' '}
            <code className="text-core-400">orders/part-0002.csv</code> may arrive before{' '}
            <code className="text-core-400">part-0001.csv</code>. For independent files, that does not matter.
          </p>
        </ContentStep>
        <ContentStep number={3} title="At-least-once delivery">
          <p className="text-slate-300">
            Occasionally the same message is delivered twice. Your consumer checks DynamoDB with a conditional
            write on <code className="text-core-400">bucket#key</code> before side effects — the same
            idempotency pattern from the DynamoDB module.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="FIFO queues — order and dedup first">
        <ContentStep number={1} title="Ordering within a message group">
          <p className="text-slate-300">
            Every FIFO send includes a <code className="text-core-400">MessageGroupId</code>. Messages with
            the same group ID are delivered strictly in order, one batch at a time. Different groups are
            processed in parallel — so use a natural key like{' '}
            <code className="text-core-400">customer_id</code> or <code className="text-core-400">table_name</code>
            , not one constant group for everything.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deduplication — 5-minute window">
          <p className="text-slate-300">
            Supply a <code className="text-core-400">MessageDeduplicationId</code> or enable content-based
            deduplication (SQS hashes the body). A second send with the same ID within 5 minutes is accepted
            but not delivered again — handy when a producer retries after a network timeout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Throughput limits">
          <p className="text-slate-300">
            By default a FIFO queue supports 300 transactions per second per API action — up to 3,000 messages
            per second when you batch 10 messages per call. High-throughput mode raises the ceiling
            dramatically by partitioning on message group ID, as long as your traffic spreads across many
            groups.
          </p>
        </ContentStep>
        <Example title="Sending to a FIFO queue with Boto3" caption="Group by customer so each customer's changes stay in order">
{`import json
import boto3

sqs = boto3.client("sqs")
QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/123456789012/de-customer-cdc-queue-prod.fifo"

sqs.send_message(
    QueueUrl=QUEUE_URL,
    MessageBody=json.dumps({"customer_id": "C-1042", "op": "UPDATE", "lsn": 88121}),
    MessageGroupId="C-1042",                     # order is guaranteed per group
    MessageDeduplicationId="C-1042-88121",       # retries within 5 min are dropped
)`}
        </Example>
        <Callout variant="insight">
          FIFO dedup protects against producer retries within 5 minutes — not against a file re-uploaded an
          hour later or a consumer that crashed after writing to S3. You still need a DynamoDB idempotency
          check for end-to-end safety.
        </Callout>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">FIFO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Throughput', 'Nearly unlimited', '300 TPS per action, 3,000 msg/s batched, more in high-throughput mode'],
                ['Ordering', 'Best effort', 'Strict within a message group'],
                ['Delivery', 'At least once — duplicates possible', 'No duplicate delivery within the 5-minute dedup window'],
                ['Queue name', 'Any valid name', 'Must end in .fifo'],
                ['Required send fields', 'Queue URL and body', 'Plus MessageGroupId, and dedup ID unless content-based'],
                ['Typical DE use', 'S3 landing events, per-file ETL work', 'CDC per entity, ordered state transitions'],
              ].map(([feature, std, fifo]) => (
                <tr key={feature} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{feature}</td>
                  <td className="px-4 py-3">{std}</td>
                  <td className="px-4 py-3">{fifo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Which one does a data engineer pick?">
        <ContentStep number={1} title="Default to Standard">
          <p className="text-slate-300">
            Independent files, independent events, idempotent consumers — Standard is cheaper, faster, and
            simpler. S3 event notifications also only target Standard queues.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose FIFO when order changes the answer">
          <p className="text-slate-300">
            Applying INSERT then DELETE for the same customer in the wrong order corrupts the target table.
            That is a FIFO job, grouped by customer or primary key.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pair types end to end">
          <p className="text-slate-300">
            FIFO SNS topics deliver only to FIFO queues. Decide ordering requirements for the whole path, not
            one hop at a time.
          </p>
        </ContentStep>
        <Flowchart
          title="Standard or FIFO decision"
          chart={`flowchart TD
  A[New queue] --> B{Does order matter per entity}
  B -->|no| STD[Standard queue]
  B -->|yes| C{Traffic spread over many groups}
  C -->|yes| HT[FIFO high throughput mode]
  C -->|no| FIFO[FIFO queue]
  STD --> IDEM[Idempotent consumer with DynamoDB]
  FIFO --> IDEM
  HT --> IDEM`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Standard: nearly unlimited throughput, best-effort ordering, at-least-once delivery — the default for lake ingest.',
          'FIFO: strict order within a MessageGroupId, dedup within a 5-minute window, name must end in .fifo.',
          'FIFO throughput: 300 TPS per action, 3,000 msg/s with batching of 10; high-throughput mode for many groups.',
          'Queue type is fixed at creation — you cannot convert Standard to FIFO later.',
          'Neither type removes the need for an idempotent consumer backed by DynamoDB conditional writes.',
        ]}
      />
    </LessonArticle>
  )
}
