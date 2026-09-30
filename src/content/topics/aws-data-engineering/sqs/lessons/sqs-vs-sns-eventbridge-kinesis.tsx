import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SqsVsSnsEventbridgeKinesis() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Four services, four different shapes">
        AWS gives you a <strong className="text-white">queue</strong> (SQS), a{' '}
        <strong className="text-white">topic</strong> (SNS), an <strong className="text-white">event bus</strong>{' '}
        (EventBridge), and a <strong className="text-white">stream</strong> (Kinesis Data Streams). They overlap
        enough to confuse, but each answers a different question. Pick by delivery model, ordering, and replay
        needs — and expect to combine them, because most real data pipelines use two or three together.
      </Callout>

      <Definition term="Queue vs topic vs bus vs stream">
        <p>
          A <strong className="text-white">queue</strong> holds work until one consumer takes and deletes it. A{' '}
          <strong className="text-white">topic</strong> pushes a copy of each message to every subscriber. An{' '}
          <strong className="text-white">event bus</strong> routes events to targets by content-matching rules. A{' '}
          <strong className="text-white">stream</strong> is an ordered, retained log that many consumers read
          independently at their own positions — reading does not remove records.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">SQS</th>
                <th className="px-4 py-3">SNS</th>
                <th className="px-4 py-3">EventBridge</th>
                <th className="px-4 py-3">Kinesis Data Streams</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Delivery model', 'Pull, competing consumers', 'Push fan-out', 'Push via rules', 'Pull by shard'],
                ['Ordering', 'FIFO per message group', 'FIFO topics only', 'Not guaranteed', 'Per shard by partition key'],
                ['Retention', 'Up to 14 days until deleted', 'None — delivery retries only', 'Archive optional', '24 h default, up to 365 days'],
                ['Replay', 'No — delete is final', 'FIFO topic archive only', 'Archive and replay', 'Yes — re-read by position'],
                ['Consumers per message', 'One', 'Every subscriber', 'Every matching target', 'Many independent readers'],
                ['Throughput', 'Near-unlimited Standard', 'Very high', 'Regional PutEvents quota', 'Scales by shard count'],
              ].map(([dim, sqs, sns, eb, kds]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{sqs}</td>
                  <td className="px-4 py-3">{sns}</td>
                  <td className="px-4 py-3">{eb}</td>
                  <td className="px-4 py-3">{kds}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          Kinesis Data Streams write capacity is 1 MB/s or 1,000 records per second per shard in provisioned
          mode; on-demand mode scales shards automatically. SQS Standard needs no capacity planning at all.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Which service fits"
          chart={`flowchart TB
  START[New integration]
  Q1{Many consumers need same data}
  Q2{Need replay or ordered high volume}
  Q3{Route by event content}
  Q4{Work item done once}
  KDS[Kinesis Data Streams]
  EB[EventBridge]
  SNS[SNS topic]
  SQS[SQS queue]
  START --> Q1
  Q1 -->|yes| Q2
  Q2 -->|yes| KDS
  Q2 -->|no| Q3
  Q3 -->|yes| EB
  Q3 -->|no| SNS
  Q1 -->|no| Q4
  Q4 -->|yes| SQS
  Q4 -->|no| EB`}
        />
        <ContentStep number={1} title="Choose SQS when">
          <p className="text-slate-300">
            Each item is a unit of work processed once — a landed file, a partition to compact, a row to load —
            and you want buffering, retries, DLQs, and a consumer rate you control.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose SNS or EventBridge when">
          <p className="text-slate-300">
            Several teams react to the same event. SNS is simple, high-throughput fan-out with attribute filters.
            EventBridge adds content-based rules over the whole payload, schema registry, SaaS and AWS service
            sources, cross-account buses, and archive with replay.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Choose Kinesis when">
          <p className="text-slate-300">
            Continuous high-volume records — clickstream, IoT telemetry, CDC — where order per key matters and
            multiple consumers (Firehose to S3, a real-time Flink app, an anomaly detector) must each read the
            full stream and be able to rewind.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common data engineering combinations">
        <ContentStep number={1} title="SNS → SQS fan-out">
          <p className="text-slate-300">
            One landing notification published to <span className="font-mono text-sm">de-landing-events</span>{' '}
            fans out to per-consumer queues — validation, archive, metrics — each with its own DLQ and pace. SNS
            gives the copies; SQS gives durability and backpressure.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EventBridge → SQS">
          <p className="text-slate-300">
            S3 events and Glue job state changes land on the default bus; rules match{' '}
            <span className="font-mono text-sm">acme-lake-prod</span> prefixes or FAILED states and target queues.
            The queue buffers bursts and provides retries that an EventBridge-to-Lambda target alone would not
            give you control over.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Kinesis for clickstream, SQS for files">
          <p className="text-slate-300">
            Web events stream through Kinesis into Firehose and S3; the resulting S3 objects trigger notifications
            into SQS for compaction and Glue catalog updates. Streams handle records; queues handle files and jobs.
          </p>
        </ContentStep>
        <Flowchart
          title="Services working together"
          chart={`flowchart LR
  WEB[Web clickstream]
  KDS[Kinesis stream]
  FH[Firehose]
  S3[(acme-lake-prod)]
  EB[EventBridge]
  SNS[SNS topic]
  Q1[SQS compaction queue]
  Q2[SQS audit queue]
  WEB --> KDS
  KDS --> FH
  FH --> S3
  S3 --> EB
  EB --> SNS
  SNS --> Q1
  SNS --> Q2`}
        />
        <Callout variant="tip">
          If a design needs &quot;replay last Tuesday&quot;, SQS alone is the wrong store — delete is final. Keep
          the raw events in S3 or Kinesis, and treat queues as the work list derived from them.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SQS is a work queue: pull, one consumer per message, up to 14 days, no replay after delete.',
          'SNS pushes copies to every subscriber; EventBridge routes by content rules and supports archive and replay.',
          'Kinesis Data Streams is a retained, ordered-per-shard log for high-volume records with many readers.',
          'Common combos: SNS → SQS fan-out, EventBridge → SQS buffering, Kinesis for clickstream into S3.',
          'Replay requirements point to S3, Kinesis, or EventBridge archives — not SQS.',
        ]}
      />
    </LessonArticle>
  )
}
