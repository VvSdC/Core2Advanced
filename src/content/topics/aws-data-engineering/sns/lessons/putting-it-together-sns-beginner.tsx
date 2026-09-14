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

export function PuttingItTogetherSnsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before filtering and advanced fan-out">
        You now know what SNS is, how pub/sub differs from SQS pull queues, the five core entities (topic,
        publisher, subscriber, subscription, message), subscription protocols for DE pipelines, how to publish
        via Console and boto3, and the CloudWatch Alarm → SNS → on-call pattern. This lesson ties those
        threads into a{' '}
        <strong className="text-white">beginner SNS checklist</strong> — minimum notification wiring on
        your dev alert topic before Standard vs FIFO, message filtering, and multi-queue fan-out enter the
        picture.
      </Callout>

      <Definition term="Beginner pipeline notification stack">
        <p>
          A <strong className="text-white">beginner notification stack</strong> for a DE dev account
          includes: one SNS topic scoped to dev alerts, at least one confirmed email subscription, one
          CloudWatch alarm on your dev Lambda Errors metric publishing to that topic, a successful Console
          test publish, and optionally one Lambda subscriber for Slack — all before prod PagerDuty or SMS
          escalation.
        </p>
      </Definition>

      <LessonSection title="Setup checklist — notifications in one afternoon">
        <ContentStep number={1} title="Create dev alert topic">
          <p className="text-slate-300">
            SNS → Create topic → <code className="text-core-400">data-pipeline-alerts-dev</code>. Copy ARN
            to a note — you will paste it into alarm actions and Lambda env vars.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subscribe and confirm email">
          <p className="text-slate-300">
            Create subscription: protocol email, your address. Open AWS confirmation email → Confirm
            subscription. Verify status shows Confirmed in SNS console — not Pending.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Console test publish">
          <p className="text-slate-300">
            Topic → Publish message → subject &quot;SNS wiring test&quot;, body &quot;Dev drill&quot; →
            Publish. Email should arrive within seconds. If not, check spam and subscription status before
            debugging alarms.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Wire CloudWatch alarm to topic">
          <p className="text-slate-300">
            Use the alarm from your CloudWatch beginner checkpoint (
            <code className="text-core-400">ingest-dev-errors</code>) or create new: Lambda Errors, Sum &gt; 0,
            action on ALARM → your SNS topic ARN. Save alarm.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Run controlled failure drill">
          <p className="text-slate-300">
            Induce dev Lambda failure, wait for alarm ALARM state, confirm SNS email with alarm JSON body.
            Fix handler, invoke success, confirm OK notification if configured.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner SNS verification flow"
          chart={`flowchart TD
  A[Create data-pipeline-alerts-dev topic]
  A --> B[Subscribe email and confirm]
  B --> C[Console test publish — email arrives]
  C --> D[Attach alarm action to topic ARN]
  D --> E[Trigger dev Lambda error]
  E --> F[Receive alarm email within minutes]
  F --> G[Fix and confirm alarm returns OK]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — prove pub/sub end-to-end">
        <p className="text-slate-300">
          SNS is not real until you have seen a message fan-out from an automated publisher — not just a
          manual Console click.
        </p>
        <ContentStep number={1} title="Publisher: CloudWatch alarm">
          <p className="text-slate-300">
            Alarm on <code className="text-core-400">de-s3-ingest-validator-dev</code> Errors publishes when
            threshold breaches — AWS is the publisher; you did not write boto3 for this path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Channel: SNS topic">
          <p className="text-slate-300">
            Single topic receives alarm message. Topic ARN is the only string repeated across alarm configs
            — change subscribers without editing alarms.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Subscriber: your email">
          <p className="text-slate-300">
            Confirmed subscription delivers copy. Parse AlarmName from subject; open log group from dimension
            FunctionName in message body.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Optional: boto3 publish">
          <p className="text-slate-300">
            Add <code className="text-core-400">sns.publish</code> on success path in dev Lambda with{' '}
            <code className="text-core-400">ALERT_TOPIC_ARN</code> env var — proves your code can notify
            too, not only alarms.
          </p>
        </ContentStep>
        <Example title="Beginner SNS drill checklist" caption="Dev-only — do not run in prod">
{`1. Topic created with dev-scoped name
2. Email subscription Confirmed (not Pending)
3. Console publish received in inbox
4. Alarm action points to correct topic ARN
5. Controlled Lambda failure triggers alarm email
6. Alarm JSON contains FunctionName and NewStateReason
7. Optional: boto3 publish on success returns MessageId in logs
8. Fix failure; alarm OK; Errors metric back to zero`}
        </Example>
        <Callout variant="insight">
          Teams that wire alarms directly to personal email addresses reconfigure every rotation. SNS topic +
          distribution list subscription survives org changes — five minutes of topic setup saves hours across
          dozens of alarms.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Topic vs subscription">
          <p className="text-slate-300">
            Topic = the channel (ARN). Subscription = one link from topic to one endpoint (email, Lambda,
            queue) with a protocol.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Publisher vs subscriber">
          <p className="text-slate-300">
            Publisher sends messages in (CloudWatch alarm, boto3 script). Subscriber receives copies out
            (email inbox, Lambda invoke, SQS message).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why confirm email subscriptions">
          <p className="text-slate-300">
            Prevents unauthorized spam. Pending subscriptions silently ignore messages — the #1 beginner bug
            when alarm emails never arrive.
          </p>
        </ContentStep>
        <ContentStep number={4} title="SNS push vs SQS pull">
          <p className="text-slate-300">
            SNS pushes to all subscribers at once. SQS holds messages until workers poll. Combine as SNS →
            SQS → Lambda when you need fan-out plus buffering.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Why alarms use SNS instead of direct email">
          <p className="text-slate-300">
            One topic fans out to email, Slack Lambda, and SQS without editing each alarm. Add subscribers
            as the team grows.
          </p>
        </ContentStep>
        <ContentStep number={6} title="What sns.publish needs">
          <p className="text-slate-300">
            Topic ARN, subject, message body, and IAM <code className="text-core-400">sns:Publish</code> on
            that ARN. Region must match topic region.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the SNS track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Standard vs FIFO topics">
          <p className="text-slate-300">
            FIFO topics provide strict ordering and deduplication — useful when downstream processing must
            handle events in sequence (e.g. ordered catalog updates). Standard topics remain the default for
            alerts and parallel fan-out.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Message filtering">
          <p className="text-slate-300">
            Subscription filter policies route only matching messages — critical alerts to PagerDuty Lambda,
            info-level batch summaries to email only. Reduces noise without splitting into dozens of topics.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fan-out architectures">
          <p className="text-slate-300">
            One SNS topic with multiple SQS queue subscriptions — each queue feeds a different downstream
            pipeline stage. The pattern behind decoupled micro-batch ETL: publish once when raw landings
            complete; catalog, quality checks, and analytics each consume at their own pace.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Production integrations">
          <p className="text-slate-300">
            Cross-account topics, SSE encryption, delivery status logging to CloudWatch, dead-letter queues
            for failed Lambda subscriptions, and wiring to EventBridge for complex routing alongside SNS
            fan-out.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          SNS connects everything you built so far: IAM grants publish rights, Lambda can be publisher or
          subscriber, CloudWatch alarms detect failure, and SNS tells humans and automation. SQS, Step
          Functions, and EventBridge modules ahead assume you can wire a topic and confirm a subscription
          without looking up the console path.
        </p>
        <Callout variant="insight">
          Strong SNS beginners do not memorize every protocol on day one. They ask: What topic per environment?
          Who is subscribed and confirmed? What publishes — alarms, code, or both? Did the dev drill email
          arrive? Answer those four before adding filter policies or FIFO complexity.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner checklist: dev topic, confirmed email sub, Console test publish, alarm wired to topic ARN, failure drill completed.',
          'Prove automated path: CloudWatch alarm publishes → SNS fan-out → email with alarm JSON — not just manual publish.',
          'Next in SNS track: Standard vs FIFO topics, subscription message filtering, multi-SQS fan-out, production encryption and cross-account.',
          'SNS closes the loop on CloudWatch — detection via alarms, delivery via topics, action via email/Lambda/SQS subscribers.',
        ]}
      />
    </LessonArticle>
  )
}
