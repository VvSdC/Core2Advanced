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

export function QueueWorkersAndAutoscaling() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="When work arrives all day, keep a few workers pulling from a queue">
        Batch tasks suit &quot;once a night&quot;. But when vendor files land in S3 all day, or an API accepts
        reprocessing requests, you want workers that pull jobs from{' '}
        <code className="text-core-400">de-orders-work-queue-prod</code> as they arrive — each job too long or
        too dependency-heavy for Lambda. An <strong className="text-white">ECS service</strong> keeps those
        workers running, and <strong className="text-white">Application Auto Scaling</strong> grows and shrinks
        them with the backlog.
      </Callout>

      <Definition term="Queue worker service">
        <p>
          An ECS service whose tasks run a loop: long-poll SQS, process a message, delete it on success, repeat.
          The service keeps a <code className="text-core-400">desiredCount</code> of tasks alive and replaces
          crashed ones. Scaling policies change <code className="text-core-400">desiredCount</code> based on a
          CloudWatch metric — ideally <strong className="text-white">backlog per task</strong>, the number of
          visible messages divided by running tasks.
        </p>
      </Definition>

      <LessonSection title="The worker loop done right">
        <ContentStep number={1} title="Long polling and batching">
          <p className="text-slate-300">
            <code className="text-core-400">WaitTimeSeconds=20</code> makes each receive call wait for messages
            instead of returning empty immediately — fewer API calls, lower cost.{' '}
            <code className="text-core-400">MaxNumberOfMessages</code> up to 10 amortizes calls when messages are
            small.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Visibility timeout longer than processing">
          <p className="text-slate-300">
            While a worker processes a message it is hidden from others. If processing outlasts the visibility
            timeout, the message reappears and a second worker starts the same file. Set the timeout comfortably
            above p99 processing time, or extend it with{' '}
            <code className="text-core-400">ChangeMessageVisibility</code> as a heartbeat for long jobs. Delete the
            message only after the S3 write and watermark update succeed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Graceful shutdown on SIGTERM">
          <p className="text-slate-300">
            Scale-in, deployments, and Spot interruptions all send SIGTERM, then SIGKILL after{' '}
            <code className="text-core-400">stopTimeout</code> (default 30 seconds, up to 120 seconds on Fargate).
            The worker should stop receiving new messages, finish or abandon the current one cleanly, and exit.
            Unfinished messages simply become visible again after their timeout.
          </p>
        </ContentStep>
        <Example title="SQS worker with graceful shutdown" caption="Python — runs as the container entrypoint">
{`import json, signal, boto3

sqs = boto3.client("sqs")
QUEUE_URL = "https://sqs.us-east-1.amazonaws.com/111122223333/de-orders-work-queue-prod"
running = True

def handle_sigterm(signum, frame):
    global running
    running = False  # finish current batch, then exit

signal.signal(signal.SIGTERM, handle_sigterm)

while running:
    resp = sqs.receive_message(
        QueueUrl=QUEUE_URL,
        MaxNumberOfMessages=10,
        WaitTimeSeconds=20,
        VisibilityTimeout=900,
    )
    for msg in resp.get("Messages", []):
        job = json.loads(msg["Body"])
        process_file(job["bucket"], job["key"])  # idempotent: overwrite target object
        sqs.delete_message(QueueUrl=QUEUE_URL, ReceiptHandle=msg["ReceiptHandle"])

print("SIGTERM received, exiting cleanly")`}
        </Example>
        <Callout variant="tip">
          Attach a dead-letter queue with <code className="text-core-400">maxReceiveCount</code> around 5. A poison
          file that crashes the worker every time moves to the DLQ instead of looping forever, and a CloudWatch
          alarm on DLQ depth notifies <code className="text-core-400">de-alerts-prod</code>.
        </Callout>
      </LessonSection>

      <LessonSection title="Scaling on backlog per task">
        <ContentStep number={1} title="Why not CPU?">
          <p className="text-slate-300">
            A worker waiting on S3 or a database may sit at low CPU while thousands of messages pile up. Queue
            depth alone is not enough either: 1,000 messages is a crisis for 1 task and nothing for 50. Backlog per
            task captures both — AWS recommends it for SQS-driven scaling.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choosing the target">
          <p className="text-slate-300">
            Target backlog per task = acceptable latency ÷ average processing time. If each file takes 10 seconds
            and you accept 5 minutes of delay, the target is 30 messages per task. Target tracking then adds or
            removes tasks to hold that ratio.
          </p>
        </ContentStep>
        <Example title="Target tracking with metric math" caption="Backlog per task = visible messages ÷ running tasks (RunningTaskCount needs Container Insights)">
{`{
  "TargetValue": 30,
  "CustomizedMetricSpecification": {
    "Metrics": [
      { "Id": "m1", "ReturnData": false,
        "MetricStat": { "Stat": "Sum", "Metric": {
          "Namespace": "AWS/SQS", "MetricName": "ApproximateNumberOfMessagesVisible",
          "Dimensions": [{ "Name": "QueueName", "Value": "de-orders-work-queue-prod" }] } } },
      { "Id": "m2", "ReturnData": false,
        "MetricStat": { "Stat": "Average", "Metric": {
          "Namespace": "ECS/ContainerInsights", "MetricName": "RunningTaskCount",
          "Dimensions": [
            { "Name": "ClusterName", "Value": "de-etl-cluster-prod" },
            { "Name": "ServiceName", "Value": "orders-worker" }] } } },
      { "Id": "e1", "Expression": "m1 / m2", "Label": "BacklogPerTask", "ReturnData": true }
    ]
  },
  "ScaleOutCooldown": 60,
  "ScaleInCooldown": 300
}`}
        </Example>
        <ContentStep number={3} title="Step scaling and scale to zero">
          <p className="text-slate-300">
            Application Auto Scaling allows a minimum capacity of 0 for ECS services. Backlog per task divides by
            zero when no tasks run, so a common pattern pairs target tracking with a{' '}
            <strong className="text-white">step scaling</strong> policy on raw queue depth: if visible messages
            exceed 0, set capacity to at least 1; when the queue has been empty for a while, drop to 0. Test the
            exact behavior in a dev account — alarms on sparse SQS metrics can take a few minutes to react.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="End-to-end picture">
        <Flowchart
          title="SQS-driven ECS workers with autoscaling"
          chart={`flowchart LR
  S3E[S3 object created]
  Q[SQS de-orders-work-queue-prod]
  DLQ[DLQ after 5 receives]
  SVC[ECS service orders-worker]
  LAKE[(S3 acme-lake-prod silver)]
  CW[CloudWatch backlog per task]
  AAS[Application Auto Scaling]
  S3E --> Q
  Q --> SVC
  Q -->|poison messages| DLQ
  SVC --> LAKE
  Q --> CW
  CW --> AAS
  AAS -->|desiredCount| SVC`}
        />
        <ContentStep number={1} title="Operational guardrails">
          <p className="text-slate-300">
            Set a <code className="text-core-400">maxCapacity</code> that downstream systems can absorb — 50 workers
            writing to one RDS instance can exhaust connections. Watch{' '}
            <code className="text-core-400">ApproximateAgeOfOldestMessage</code> as your latency SLO signal, and
            keep processing idempotent because SQS standard queues deliver at least once.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Queue workers are ECS services that long-poll SQS, process, and delete only after success.',
          'Visibility timeout must exceed processing time; heartbeat with ChangeMessageVisibility for long jobs.',
          'Handle SIGTERM: stop receiving, finish cleanly, exit within stopTimeout (max 120 seconds on Fargate).',
          'Scale on backlog per task with target tracking; add step scaling on queue depth to scale from zero.',
          'Use a DLQ, cap maxCapacity for downstream limits, and alarm on age of oldest message.',
        ]}
      />
    </LessonArticle>
  )
}
