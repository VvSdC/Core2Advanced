import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SubscriptionPoliciesRetryDlq() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Delivery failures should not vanish silently">
        SNS tries hard to reach every subscriber — but SQS policies, Lambda throttles, and expired HTTPS
        endpoints cause failures. <strong className="text-white">Delivery retry policies</strong> and{' '}
        <strong className="text-white">dead-letter queues</strong> for subscriptions ensure failed
        notifications land somewhere auditable instead of disappearing after SNS exhausts retries.
      </Callout>

      <Definition term="SNS subscription">
        <p>
          A <strong className="text-white">subscription</strong> binds a topic to a protocol endpoint:
          SQS, Lambda, HTTP/S, email, SMS, Firehose, etc. Each subscription has its own delivery policy,
          filter policy, raw message delivery setting, and optional DLQ. Fan-out means one publish triggers
          independent delivery attempts per subscription.
        </p>
      </Definition>

      <LessonSection title="Subscription policies overview">
        <ContentStep number={1} title="Topic policy vs subscription">
          <p className="text-slate-300">
            <strong className="text-white">Topic policy</strong> controls who can publish and subscribe
            (IAM, cross-account). <strong className="text-white">Subscription</strong> settings control
            how one endpoint receives messages — filter policy, delivery policy (HTTP retry backoff), and
            DLQ. SQS queue policy must allow <span className="font-mono text-sm">sns.amazonaws.com</span>{' '}
            to <span className="font-mono text-sm">sqs:SendMessage</span> — a common DE misconfiguration
            blocks all fan-out.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Raw message delivery">
          <p className="text-slate-300">
            For SQS/Lambda/HTTP, enable raw delivery when consumers expect the published body only — not
            the SNS envelope with <span className="font-mono text-sm">Message</span>,{' '}
            <span className="font-mono text-sm">Subject</span>, and{' '}
            <span className="font-mono text-sm">Timestamp</span> wrapper. ETL Lambdas parsing S3 JSON
            events usually want raw delivery off (default envelope) or consistent parsing code for both.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Subscription role (SQS DLQ)">
          <p className="text-slate-300">
            When attaching a DLQ to an SNS subscription, SNS assumes an IAM role to write failed deliveries
            to the DLQ SQS queue. Least privilege: role can only send to that DLQ ARN. Missing role is a
            frequent Terraform/CloudFormation oversight on new environments.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Delivery retry">
        <ContentStep number={1} title="Default retry behavior">
          <p className="text-slate-300">
            SNS retries failed deliveries to SQS, Lambda, HTTP, and other protocols with exponential backoff
            over hours (protocol-dependent). Lambda throttling, SQS KMS denies, and HTTP 5xx all trigger
            retries. Email/SMS failures retry separately — ops email bounces do not block SQS delivery.
          </p>
        </ContentStep>
        <ContentStep number={2} title="HTTP delivery policy">
          <p className="text-slate-300">
            HTTPS subscribers (Slack webhooks, internal APIs) customize min/max delay and num retries in
            delivery policy JSON. DE integrations should set reasonable caps so a dead webhook does not
            retry for days at full SNS cost — pair with DLQ or CloudWatch alarm on{' '}
            <span className="font-mono text-sm">NumberOfNotificationsFailed</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda as subscriber">
          <p className="text-slate-300">
            SNS invokes Lambda synchronously for each message. Lambda errors (unhandled exception, timeout)
            cause SNS retry — can duplicate side effects if handler is not idempotent. Prefer SNS → SQS →
            Lambda ESM when you need batching, partial batch failure, and a queue-level DLQ with clearer
            replay semantics.
          </p>
        </ContentStep>
        <Flowchart
          title="SNS delivery retry path"
          chart={`flowchart TB
  PUB[Publish to topic]
  PUB --> SUB1[SQS subscription]
  PUB --> SUB2[Lambda subscription]
  SUB1 -->|SendMessage OK| QOK[Message in queue]
  SUB1 -->|access denied throttle| RETRY1[SNS retry backoff]
  SUB2 -->|invoke error| RETRY2[SNS retry backoff]
  RETRY1 -->|exhausted| DLQ1[Subscription DLQ]
  RETRY2 -->|exhausted| DLQ2[Subscription DLQ or lost]
  RETRY1 -->|success later| QOK`}
        />
      </LessonSection>

      <LessonSection title="Dead Letter Queue for failed deliveries">
        <Definition term="Subscription DLQ">
          <p>
            An SQS queue designated to receive messages SNS could not deliver to the primary subscription
            endpoint after retries complete. Distinct from Lambda&apos;s async DLQ or SQS consumer DLQ —
            this captures <strong className="text-white">SNS-to-subscriber transport failures</strong>, not
            application processing failures after successful delivery.
          </p>
        </Definition>
        <ContentStep number={1} title="When DE needs subscription DLQ">
          <p className="text-slate-300">
            Critical audit trail queues, compliance archives, and billing event sinks should always have
            subscription DLQs. Replay from DLQ after fixing queue policy or KMS key policy — otherwise
            pipeline events during the outage window are lost forever.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Monitoring">
          <p className="text-slate-300">
            CloudWatch metrics: <span className="font-mono text-sm">NumberOfNotificationsFailed</span>,{' '}
            <span className="font-mono text-sm">NumberOfNotificationsDelivered</span> per topic. Alarm
            when failed &gt; 0 for 5 minutes. DLQ depth alarm on the subscription DLQ itself — any message
            means SNS gave up on delivery.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Three DLQ layers in DE">
          <p className="text-slate-300">
            (1) SNS subscription DLQ — transport to SQS failed. (2) SQS consumer DLQ — Lambda/Glue worker
            failed processing. (3) Lambda async DLQ — direct SNS→Lambda or async invoke failures. Interview
            designs should name which layer catches which failure mode.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Fixing a misconfigured SQS policy does not replay missed notifications — only new publishes flow.
          For gaps, rely on S3 inventory, Glue job bookmarks, or upstream event replay from EventBridge
          archive if configured.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Topic policy = who publishes/subscribes; per-subscription settings = filters, delivery retry, DLQ.',
          'SQS queue policy must allow sns.amazonaws.com SendMessage — top fan-out failure in DE setups.',
          'SNS retries failed SQS/Lambda/HTTP deliveries with backoff; exhausted retries go to subscription DLQ.',
          'Prefer SNS → SQS → Lambda ESM over direct SNS → Lambda for batching, idempotency, and queue DLQ.',
          'Monitor NumberOfNotificationsFailed and subscription DLQ depth — transport failures need explicit replay plans.',
        ]}
      />
    </LessonArticle>
  )
}
