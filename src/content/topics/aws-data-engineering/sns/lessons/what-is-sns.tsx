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

export function WhatIsSns() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        SNS is AWS&apos;s managed{' '}
        <strong className="text-white">publish/subscribe messaging</strong> service. One sender publishes a
        message to a topic; AWS pushes copies to every subscriber — no polling, no maintaining recipient
        lists in application code. For data engineers, that means CloudWatch alarms, Glue notifications, and
        pipeline scripts can broadcast &quot;job failed&quot; or &quot;batch complete&quot; to email, Lambda,
        and queues in one shot.
      </Callout>

      <Definition term="Amazon SNS">
        <p>
          <strong className="text-white">Amazon Simple Notification Service (SNS)</strong> provides topics
          (channels), subscriptions (delivery endpoints), and a publish API. Publishers send messages;
          SNS handles fan-out delivery to all active subscribers. It integrates natively with CloudWatch
          alarms, Lambda, SQS, EventBridge, and many AWS services as both publisher and subscriber.
        </p>
      </Definition>

      <LessonSection title="Pub/sub messaging on AWS">
        <p className="text-slate-300">
          <strong className="text-white">Publish/subscribe</strong> separates senders from receivers. The
          publisher does not know who listens — it posts to a topic. Subscribers register interest via
          subscriptions. When a message arrives, SNS delivers independently to each endpoint. Contrast with
          direct email: if you hard-code three addresses in alarm config, adding a fourth means editing every
          alarm. With SNS, you add one subscription to the topic.
        </p>
        <ContentStep number={1} title="Push delivery model">
          <p className="text-slate-300">
            SNS <em>pushes</em> messages to subscribers as soon as they are published (with retries for
            transient failures). Email arrives in your inbox; Lambda is invoked; SQS receives a new message.
            You do not poll SNS — it comes to you.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decoupling producers and consumers">
          <p className="text-slate-300">
            Your ingest Lambda publishes &quot;file validated&quot; to a topic without importing downstream
            job code. Catalog Lambda and Glue-trigger Lambda each subscribe separately. Replace one consumer
            without redeploying the publisher — essential as pipelines grow.
          </p>
        </ContentStep>
        <Flowchart
          title="Pub/sub vs point-to-point"
          chart={`flowchart TB
  subgraph PubSub["SNS pub/sub"]
    P1[Publisher] --> T[Topic]
    T --> S1[Subscriber A]
    T --> S2[Subscriber B]
    T --> S3[Subscriber C]
  end
  subgraph Point["Point-to-point — harder to scale"]
    P2[Publisher] --> S4[Direct call A]
    P2 --> S5[Direct call B]
    P2 --> S6[Direct call C]
  end`}
        />
      </LessonSection>

      <LessonSection title="Topic as a channel">
        <p className="text-slate-300">
          An SNS <strong className="text-white">topic</strong> is a logical access point with a unique ARN
          (Amazon Resource Name). Publishers target the ARN; subscribers attach to it. Topics are regional —
          create <code className="text-core-400">data-pipeline-alerts</code> in{' '}
          <code className="text-core-400">us-east-1</code> if that is where your Lambdas and alarms live.
        </p>
        <ContentStep number={1} title="One topic, many purposes — but scope wisely">
          <p className="text-slate-300">
            A topic named <code className="text-core-400">glue-failures-prod</code> might receive messages
            from Glue failure events, related CloudWatch alarms, and a manual &quot;reprocess failed&quot;
            button Lambda. Keep topics aligned by alert category or environment so subscribers do not get
            irrelevant noise.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Standard topics (beginner default)">
          <p className="text-slate-300">
            Standard SNS topics deliver at-least-once with best-effort ordering — perfect for alerts and
            fan-out ETL triggers. FIFO topics (covered later) add strict ordering and deduplication when
            sequence matters — not required for your first pipeline alarm.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Access control via IAM">
          <p className="text-slate-300">
            Topic policies and IAM control who can publish and subscribe. CloudWatch alarm service role needs{' '}
            <code className="text-core-400">sns:Publish</code> on the topic ARN. Your boto3 script uses the
            same permission model you learned in IAM — no special SNS-only magic.
          </p>
        </ContentStep>
        <Example title="DE scenario — one topic, three reactions" caption="Nightly batch completion">
{`Topic: de-nightly-batch-complete-prod
Publisher: Step Functions success branch calls sns.publish
Subscribers:
  1. Email → data-ops@company.com (human confirmation)
  2. Lambda → refresh-catalog (updates Glue catalog partition)
  3. SQS → downstream-analytics-queue (buffers Spark job trigger)

One publish after batch success — three downstream actions without coupling.`}
        </Example>
      </LessonSection>

      <LessonSection title="SNS vs SQS — push vs pull (teaser)">
        <p className="text-slate-300">
          Both move messages between services, but the delivery model differs — a common exam and interview
          topic for data engineers.
        </p>
        <ContentStep number={1} title="SNS — push, fan-out">
          <p className="text-slate-300">
            One message goes to <em>all</em> subscribers simultaneously. Great for alerts (&quot;tell
            everyone&quot;) and triggering parallel downstream work. No message retention in the topic itself
            — if no subscriber exists, the message is gone after publish attempts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQS — pull, one consumer per message">
          <p className="text-slate-300">
            Messages sit in a <em>queue</em> until a worker polls and deletes them. One message typically
            handled by one consumer — ideal for buffering, backpressure, and retry with visibility timeout.
            Workers pull when ready; SNS pushes whether they are ready or not.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Common DE pattern — SNS → SQS → Lambda">
          <p className="text-slate-300">
            Subscribe an SQS queue to an SNS topic. SNS fans out; the queue buffers; Lambda polls the queue
            at a controlled rate. Combines broadcast intent with durable, throttled processing — the pattern
            behind many production ETL triggers.
          </p>
        </ContentStep>
        <Flowchart
          title="SNS push vs SQS pull"
          chart={`flowchart LR
  subgraph SNS["SNS — push fan-out"]
    PUB1[Publish] --> TOP[Topic]
    TOP -->|push| L1[Lambda]
    TOP -->|push| L2[Email]
    TOP -->|push| Q1[SQS]
  end
  subgraph SQS["SQS — pull queue"]
    PROD[Producer] --> QU[Queue]
    QU -->|poll| W1[Worker Lambda]
    QU -->|poll| W2[EC2 worker]
  end`}
        />
        <Callout variant="tip" title="When to choose which">
          Use SNS when one event should notify or trigger multiple targets at once — alarms, completion
          broadcasts. Use SQS when work must be queued, retried, or processed by one worker at a time. Use
          both when you need fan-out <em>and</em> buffering — SNS topic with SQS subscriptions.
        </Callout>
      </LessonSection>

      <LessonSection title="What SNS is not">
        <ContentStep number={1} title="Not a data store">
          <p className="text-slate-300">
            SNS does not hold messages for later replay like a log archive. Subscribers must process or
            forward promptly. For audit trails, subscribe SQS or Kinesis Firehose to persist notification
            payloads to S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not guaranteed exactly-once">
          <p className="text-slate-300">
            Standard topics may deliver duplicates on retries. Design subscribers to be idempotent — processing
            the same &quot;Glue job failed&quot; alert twice should not open two identical tickets.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a replacement for EventBridge for complex routing">
          <p className="text-slate-300">
            EventBridge excels at event buses with schema-based rules across AWS accounts and SaaS partners.
            SNS excels at simple fan-out and alarm delivery. Many pipelines use both — EventBridge for
            routing, SNS for human notification. Learn SNS first; EventBridge deep dives come later in the
            track.
          </p>
        </ContentStep>
        <Callout variant="insight">
          SNS sits naturally after CloudWatch in your mental model: metrics and logs observe, alarms evaluate,
          SNS notifies and fans out. It also connects forward to Lambda and SQS — the messaging glue between
          detection and action in every operable data platform.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS is managed pub/sub — publishers send to topics; AWS pushes copies to all subscribers.',
          'A topic is a regional channel identified by ARN — scope topics by environment and alert category.',
          'SNS pushes and fans out; SQS queues and workers pull — often combined as SNS → SQS → Lambda.',
          'Use SNS for alerts and broadcast triggers; design subscribers for idempotency and pair with SQS when buffering is needed.',
        ]}
      />
    </LessonArticle>
  )
}
