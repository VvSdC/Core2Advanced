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

export function MessageAttributesDelayRetention() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A message is more than its body">
        Beyond the payload, every SQS message carries metadata you set (message attributes) and metadata SQS
        sets for you (system attributes such as receive count and sent time). Queues also control{' '}
        <strong className="text-white">when</strong> a message becomes visible (delay),{' '}
        <strong className="text-white">how long</strong> it survives unprocessed (retention), and{' '}
        <strong className="text-white">how big</strong> it can be. These settings decide whether your ingest
        queue is debuggable and whether large payloads fit at all.
      </Callout>

      <Definition term="Message attributes vs system attributes">
        <p>
          <strong className="text-white">Message attributes</strong> are up to 10 typed name/value pairs
          (String, Number, Binary) that producers attach — for example{' '}
          <span className="font-mono text-sm">dataset=orders</span>,{' '}
          <span className="font-mono text-sm">schema_version=3</span>. They count toward the message size limit.{' '}
          <strong className="text-white">System attributes</strong> are set by SQS:{' '}
          <span className="font-mono text-sm">ApproximateReceiveCount</span>,{' '}
          <span className="font-mono text-sm">SentTimestamp</span>,{' '}
          <span className="font-mono text-sm">ApproximateFirstReceiveTimestamp</span>, and for FIFO{' '}
          <span className="font-mono text-sm">MessageGroupId</span> and{' '}
          <span className="font-mono text-sm">SequenceNumber</span>.
        </p>
      </Definition>

      <LessonSection title="Using attributes in DE consumers">
        <ContentStep number={1} title="Route without parsing the body">
          <p className="text-slate-300">
            A consumer reads <span className="font-mono text-sm">dataset</span> and{' '}
            <span className="font-mono text-sm">schema_version</span> attributes to pick a parser before touching
            the body. When messages arrive via SNS, subscription filter policies can match these same attributes
            to route orders vs inventory events to different queues.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Request system attributes explicitly">
          <p className="text-slate-300">
            ReceiveMessage returns system attributes only when asked via{' '}
            <span className="font-mono text-sm">MessageSystemAttributeNames</span>. Log{' '}
            <span className="font-mono text-sm">ApproximateReceiveCount</span> on every failure — a count of 4 on
            a queue with maxReceiveCount 5 tells you the next failure lands in the DLQ. Compute queue latency as
            now minus <span className="font-mono text-sm">SentTimestamp</span> (epoch milliseconds).
          </p>
        </ContentStep>
        <Example title="Send and receive with attributes" caption="Boto3">
{`sqs.send_message(
    QueueUrl=QUEUE_URL,
    MessageBody=json.dumps({'bucket': 'acme-lake-prod', 'key': 'landing/orders/2026-09-30/part-0001.csv'}),
    MessageAttributes={
        'dataset': {'DataType': 'String', 'StringValue': 'orders'},
        'schema_version': {'DataType': 'Number', 'StringValue': '3'},
    },
)

resp = sqs.receive_message(
    QueueUrl=QUEUE_URL,
    MaxNumberOfMessages=10,
    WaitTimeSeconds=20,
    MessageAttributeNames=['All'],
    MessageSystemAttributeNames=['ApproximateReceiveCount', 'SentTimestamp'],
)`}
        </Example>
      </LessonSection>

      <LessonSection title="Delay queues and per-message delay">
        <ContentStep number={1} title="Queue-level delay">
          <p className="text-slate-300">
            <span className="font-mono text-sm">DelaySeconds</span> on the queue (0–900, i.e. up to 15 minutes)
            hides every new message for that long after send. Use case: S3 landing events for multipart vendor
            drops where a companion <span className="font-mono text-sm">_SUCCESS</span> marker arrives seconds
            later — a 60 s delay lets the full batch settle before validation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per-message timers — Standard only">
          <p className="text-slate-300">
            Standard queues accept <span className="font-mono text-sm">DelaySeconds</span> on individual{' '}
            <span className="font-mono text-sm">SendMessage</span> calls, overriding the queue default. FIFO
            queues do not support per-message delay — only the queue-level setting — because it would break
            ordering within a message group.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Delay vs visibility timeout">
          <p className="text-slate-300">
            Delay hides a message <em>before</em> its first receive; visibility timeout hides it{' '}
            <em>after</em> a receive. Delayed messages appear in{' '}
            <span className="font-mono text-sm">ApproximateNumberOfMessagesDelayed</span>, not in the visible
            count. For waits longer than 15 minutes, use EventBridge Scheduler or Step Functions Wait states.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Retention and size limits">
        <ContentStep number={1} title="Retention window">
          <p className="text-slate-300">
            <span className="font-mono text-sm">MessageRetentionPeriod</span> ranges from 60 seconds to 14 days
            (1,209,600 s); default is 4 days. Unconsumed messages older than that are deleted silently. Set
            ingest queues high enough to survive a long weekend outage, and DLQs at 14 days.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Message size">
          <p className="text-slate-300">
            For years the limit was <strong className="text-white">256 KiB</strong> per message including
            attributes — still the number in most docs, exams, and in upstream services like SNS. Since August
            2025 SQS accepts up to <strong className="text-white">1 MiB</strong>{' '}
            (<span className="font-mono text-sm">MaximumMessageSize</span> 1,024–1,048,576 bytes). Remember billing
            counts each 64 KB chunk, so a 1 MiB message costs 16 requests to send.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Claim-check pattern for large payloads">
          <p className="text-slate-300">
            Do not stuff records into messages. Write the payload to S3 and send a small pointer — bucket, key,
            size, checksum. The <strong className="text-white">SQS Extended Client Library</strong> (Java and
            Python) automates this: bodies over a threshold are stored in S3 (up to 2 GB) and the message carries
            a reference that the receiving client resolves transparently.
          </p>
        </ContentStep>
        <Flowchart
          title="Claim-check pattern"
          chart={`flowchart LR
  PROD[Producer]
  S3[(S3 acme-lake-prod payloads)]
  Q[SQS pointer message]
  CONS[Consumer]
  PROD -->|1 put large object| S3
  PROD -->|2 send bucket and key| Q
  Q --> CONS
  CONS -->|3 get object| S3`}
        />
        <Callout variant="tip">
          In data engineering the payload is almost always already in S3 — the landing file itself. Send the S3
          URI, byte size, and ETag as the message body and keep messages tiny, cheap, and fast.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Up to 10 message attributes for routing metadata; system attributes like ApproximateReceiveCount come from SQS.',
          'Delay queues hide new messages 0–15 minutes; per-message delay works on Standard queues only.',
          'Retention ranges 1 minute to 14 days, default 4 days — expired messages vanish silently.',
          'Classic limit 256 KiB (still used by SNS and exams); SQS now allows up to 1 MiB, billed per 64 KB chunk.',
          'Large payloads use claim-check: data in S3, pointer in SQS — the Extended Client Library automates it.',
        ]}
      />
    </LessonArticle>
  )
}
