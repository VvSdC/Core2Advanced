import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StandardVsFifoTopics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Most DE pipelines use Standard topics — FIFO is the exception">
        Amazon SNS offers <strong className="text-white">Standard</strong> and{' '}
        <strong className="text-white">FIFO</strong> topics. Standard topics maximize throughput and
        fan-out for alerts and parallel ETL triggers. FIFO topics add strict ordering and deduplication
        when your downstream cannot tolerate duplicate or out-of-order pipeline events. Picking the wrong
        type shows up as duplicate Glue runs or missed ordering guarantees in interview designs.
      </Callout>

      <Definition term="SNS Standard topic">
        <p>
          A <strong className="text-white">Standard SNS topic</strong> delivers messages to all subscribers
          with best-effort ordering and at-least-once delivery. Throughput scales with traffic — ideal for
          CloudWatch alarm fan-out, S3 event notifications to multiple SQS queues, and ops alerting where
          duplicate notifications are annoying but not catastrophic.
        </p>
      </Definition>

      <Definition term="SNS FIFO topic">
        <p>
          A <strong className="text-white">FIFO SNS topic</strong> name must end in{' '}
          <span className="font-mono text-sm">.fifo</span>. Messages are ordered within a{' '}
          <strong className="text-white">MessageGroupId</strong> and deduplicated using{' '}
          <strong className="text-white">MessageDeduplicationId</strong> (or content-based deduplication).
          Throughput is lower than Standard — use when ordering or exactly-once publish semantics matter
          for downstream FIFO SQS or Step Functions handoffs.
        </p>
      </Definition>

      <LessonSection title="Standard Topics vs FIFO Topics">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Standard</th>
                <th className="px-4 py-3">FIFO</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Delivery', 'At-least-once; duplicates possible', 'Deduplication window (5 min default)'],
                ['Ordering', 'Best-effort; no guarantee', 'Strict per MessageGroupId'],
                ['Throughput', 'Nearly unlimited scale', '3,000 msg/s per topic (with batching)'],
                ['Subscribers', 'Any protocol', 'SQS FIFO only (plus limited integrations)'],
                ['Naming', 'Any valid name', 'Must end with .fifo'],
                ['DE default', 'Alerts, fan-out ETL triggers', 'Ordered ledger / sequential partition processing'],
              ].map(([dim, std, fifo]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{std}</td>
                  <td className="px-4 py-3">{fifo}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Standard — the DE workhorse">
          <p className="text-slate-300">
            CloudWatch Alarm → SNS → three SQS queues (analytics, audit, Slack formatter Lambda). S3 event
            notification → SNS → fan-out to raw-ingest and metrics queues. Duplicate delivery means two
            Slack pages or two Lambda invocations — mitigate with idempotent consumers, not FIFO unless
            required.
          </p>
        </ContentStep>
        <ContentStep number={2} title="FIFO — when the pipeline demands it">
          <p className="text-slate-300">
            Sequential processing per customer partition: publish with{' '}
            <span className="font-mono text-sm">MessageGroupId=customer_id</span> so all events for one
            tenant arrive in order at a FIFO SQS queue consumed by a single-threaded worker. Cross-tenant
            parallelism still scales because different group IDs process in parallel.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Ordering and deduplication (FIFO)">
        <ContentStep number={1} title="MessageGroupId">
          <p className="text-slate-300">
            SNS FIFO passes <span className="font-mono text-sm">MessageGroupId</span> to subscribed FIFO
            SQS queues. All messages sharing a group ID are delivered in publish order. DE pattern: group
            by <span className="font-mono text-sm">source_system</span> or{' '}
            <span className="font-mono text-sm">dataset_name</span> when downstream transform must not
            reorder dependent batches (staging → validation → promote).
          </p>
        </ContentStep>
        <ContentStep number={2} title="MessageDeduplicationId">
          <p className="text-slate-300">
            Provide an explicit dedupe ID (e.g. Glue JobRunId, S3 object version id, ingest batch UUID) or
            enable content-based deduplication on the topic. Within the 5-minute deduplication interval,
            republishing the same ID is silently accepted — prevents double-trigger when your orchestrator
            retries a publish after timeout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="FIFO subscriber constraint">
          <p className="text-slate-300">
            FIFO SNS topics can only subscribe FIFO SQS queues (plus SMS/email in some cases). You cannot
            fan-out a FIFO topic to Standard SQS, Lambda direct, or HTTP the way Standard topics do.
            Architecture must commit to FIFO end-to-end for ordered legs.
          </p>
        </ContentStep>
        <Flowchart
          title="FIFO ordering within a message group"
          chart={`flowchart LR
  PUB1[Publish batch A group=vendor_x]
  PUB2[Publish batch B group=vendor_x]
  PUB3[Publish batch C group=vendor_y]
  TOPIC[SNS FIFO topic]
  Q1[FIFO SQS vendor_x queue]
  Q2[FIFO SQS vendor_y queue]
  PUB1 --> TOPIC
  PUB2 --> TOPIC
  PUB3 --> TOPIC
  TOPIC -->|A then B ordered| Q1
  TOPIC -->|C parallel group| Q2`}
        />
        <Callout variant="insight">
          FIFO SNS does not replace idempotent consumers. Dedupe covers duplicate publishes within the
          window — downstream Lambda and Glue still need deterministic keys and ledger checks for
          at-least-once delivery from SQS.
        </Callout>
      </LessonSection>

      <LessonSection title="When DE picks which">
        <ContentStep number={1} title="Choose Standard when">
          <p className="text-slate-300">
            CloudWatch alarms, Glue failure notifications, S3 landing fan-out to multiple teams, EventBridge
            bridge topics, and any workload where duplicate messages are handled by idempotent SQS
            consumers or duplicate alerts are acceptable with dedupe in Slack.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose FIFO when">
          <p className="text-slate-300">
            Strict per-partition ordering into FIFO SQS, regulatory audit trail requiring ordered event
            log per entity, or coordinating with FIFO downstream that rejects out-of-order batch IDs.
            Accept lower throughput and limited subscriber types.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anti-pattern">
          <p className="text-slate-300">
            Using FIFO SNS for high-volume S3 ObjectCreated storms — throughput caps and subscriber limits
            hurt more than occasional duplicate Glue triggers. Buffer with Standard SNS → Standard SQS →
            ESM with batching instead.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Interview line: &quot;Standard SNS for alarm fan-out and parallel lake ingest; FIFO only when
          MessageGroupId ordering is a hard requirement and my subscribers are FIFO SQS.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Standard SNS: high throughput, at-least-once, best-effort order — default for DE alerts and fan-out.',
          'FIFO SNS: strict order per MessageGroupId + deduplication; name ends in .fifo; subscribers mostly FIFO SQS.',
          'MessageDeduplicationId or content-based dedupe prevents duplicate publishes within the 5-minute window.',
          'Pick Standard unless ordering is mandatory; mitigate duplicates with idempotent SQS/Lambda consumers.',
          'FIFO limits fan-out protocols — design FIFO end-to-end only when partition ordering is non-negotiable.',
        ]}
      />
    </LessonArticle>
  )
}
