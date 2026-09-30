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

export function DeadLetterQueuesAndRedrive() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One bad message should not block the pipeline forever">
        A malformed manifest, a file pointing to a deleted S3 key, or a schema the consumer cannot parse will
        fail every time it is received. Without a limit, that <strong className="text-white">poison message</strong>{' '}
        cycles endlessly, burns compute, and hides real backlog. A{' '}
        <strong className="text-white">dead-letter queue (DLQ)</strong> catches it after N failed attempts so
        healthy work keeps flowing and engineers can triage the failure calmly.
      </Callout>

      <Definition term="Dead-letter queue and redrive policy">
        <p>
          A DLQ is an ordinary SQS queue that another queue points to through its{' '}
          <span className="font-mono text-sm">RedrivePolicy</span>:{' '}
          <span className="font-mono text-sm">deadLetterTargetArn</span> plus{' '}
          <span className="font-mono text-sm">maxReceiveCount</span> (1–1,000). When a message&apos;s{' '}
          <span className="font-mono text-sm">ApproximateReceiveCount</span> exceeds maxReceiveCount without a
          delete, SQS moves it to the DLQ. <strong className="text-white">Redrive</strong> is the reverse — moving
          messages from the DLQ back to a source queue after the fix ships.
        </p>
      </Definition>

      <LessonSection title="Configuring the DLQ">
        <ContentStep number={1} title="Same type as the source">
          <p className="text-slate-300">
            The DLQ of a Standard queue must be Standard; the DLQ of a FIFO queue must be FIFO. Both must live
            in the same account and Region. Name it clearly:{' '}
            <span className="font-mono text-sm">de-orders-ingest-dlq-prod</span> for{' '}
            <span className="font-mono text-sm">de-orders-ingest-queue-prod</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choosing maxReceiveCount">
          <p className="text-slate-300">
            Too low (1) sends messages to the DLQ on a single transient throttle. Too high (100) lets a poison
            message consume hours of retries. Typical DE values: 3–5 for Lambda consumers, higher when the
            downstream (Redshift, vendor API) has frequent transient errors.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Longer retention on the DLQ">
          <p className="text-slate-300">
            For Standard queues, message expiry is based on the <em>original</em> enqueue timestamp — a message
            that spent 3 days in the source queue has already used 3 days of DLQ retention. Set DLQ retention to
            the maximum (14 days) and longer than the source. FIFO queues reset the enqueue timestamp when a
            message moves to the DLQ, but 14 days is still the safe default.
          </p>
        </ContentStep>
        <Example title="Attach a redrive policy" caption="Source queue points to its DLQ">
{`aws sqs set-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/111122223333/de-orders-ingest-queue-prod \\
  --attributes '{
    "RedrivePolicy": "{\\"deadLetterTargetArn\\":\\"arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-dlq-prod\\",\\"maxReceiveCount\\":\\"5\\"}"
  }'

aws sqs set-queue-attributes \\
  --queue-url https://sqs.us-east-1.amazonaws.com/111122223333/de-orders-ingest-dlq-prod \\
  --attributes MessageRetentionPeriod=1209600`}
        </Example>
        <Callout variant="info">
          On the DLQ, an optional <span className="font-mono text-sm">RedriveAllowPolicy</span> restricts which
          source queues may use it — handy in shared accounts so a stray queue cannot dump messages into the
          orders DLQ.
        </Callout>
      </LessonSection>

      <LessonSection title="Alarm on DLQ depth">
        <ContentStep number={1} title="Any message is a signal">
          <p className="text-slate-300">
            Alarm when <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible</span> on the DLQ is
            greater than 0 for one datapoint. Route to the <span className="font-mono text-sm">de-alerts-prod</span>{' '}
            SNS topic (Slack, PagerDuty). A DLQ nobody watches is just slower data loss — messages expire after
            retention.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Also watch message age">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ApproximateAgeOfOldestMessage</span> on the DLQ approaching 10–12
            days means redrive is overdue before the 14-day expiry deletes evidence.
          </p>
        </ContentStep>
        <Flowchart
          title="Poison message path"
          chart={`flowchart TB
  SRC[de-orders-ingest-queue-prod]
  LAM[Consumer Lambda]
  FAIL[Fails and no delete]
  CNT{Receive count over 5}
  DLQ[de-orders-ingest-dlq-prod]
  ALM[CloudWatch alarm]
  SNS[SNS de-alerts-prod]
  FIX[Deploy fix]
  RED[Redrive to source]
  SRC --> LAM
  LAM --> FAIL
  FAIL --> CNT
  CNT -->|no| SRC
  CNT -->|yes| DLQ
  DLQ --> ALM
  ALM --> SNS
  SNS --> FIX
  FIX --> RED
  RED --> SRC`}
        />
      </LessonSection>

      <LessonSection title="Redrive back to the source">
        <ContentStep number={1} title="Console redrive">
          <p className="text-slate-300">
            In the SQS console, open the DLQ and choose <strong className="text-white">Start DLQ redrive</strong>.
            Pick &quot;redrive to source queues&quot; or a custom destination and an optional velocity (messages
            per second) so replay does not stampede downstream Glue or Redshift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="StartMessageMoveTask API">
          <p className="text-slate-300">
            Automate redrive from runbooks or Step Functions with{' '}
            <span className="font-mono text-sm">StartMessageMoveTask</span>; track with{' '}
            <span className="font-mono text-sm">ListMessageMoveTasks</span> and stop with{' '}
            <span className="font-mono text-sm">CancelMessageMoveTask</span>. The source ARN must be a DLQ. Omit
            the destination to return messages to their original source queues.
          </p>
        </ContentStep>
        <Example title="Redrive with the CLI" caption="Throttled to 50 messages per second">
{`aws sqs start-message-move-task \\
  --source-arn arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-dlq-prod \\
  --max-number-of-messages-per-second 50

aws sqs list-message-move-tasks \\
  --source-arn arn:aws:sqs:us-east-1:111122223333:de-orders-ingest-dlq-prod`}
        </Example>
      </LessonSection>

      <LessonSection title="Triage runbook">
        <ContentStep number={1} title="Inspect before replaying">
          <p className="text-slate-300">
            Peek at a sample of DLQ messages (receive, then let visibility expire — do not delete). Group by
            error type from consumer logs: schema drift, missing S3 object, downstream throttling, code bug.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fix, then redrive — or discard deliberately">
          <p className="text-slate-300">
            Transient cause (throttling, outage): redrive as-is. Code bug: deploy fix, then redrive. Truly invalid
            data: archive message bodies to <span className="font-mono text-sm">s3://acme-lake-prod/quarantine/</span>{' '}
            and purge. Redriving without a fix just refills the DLQ.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Consumers must be idempotent before you redrive — some DLQ messages were partially processed (Parquet
          written, delete failed). Replays should overwrite or skip, never duplicate.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RedrivePolicy moves a message to the DLQ once its receive count exceeds maxReceiveCount (1–1,000).',
          'DLQ must match the source type (FIFO to FIFO) and live in the same account and Region.',
          'Give the DLQ 14-day retention — Standard queue expiry uses the original enqueue timestamp.',
          'Alarm on DLQ depth greater than 0 and route to SNS; an unwatched DLQ is delayed data loss.',
          'Redrive via console or StartMessageMoveTask with a velocity cap — only after the root cause is fixed.',
        ]}
      />
    </LessonArticle>
  )
}
