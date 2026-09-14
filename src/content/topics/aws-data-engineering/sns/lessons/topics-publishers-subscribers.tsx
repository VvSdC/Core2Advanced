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

export function TopicsPublishersSubscribers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The five building blocks">
        Every SNS conversation uses the same five words:{' '}
        <strong className="text-white">topic, publisher, subscriber, subscription, message</strong>. Master
        these and CloudWatch alarm wiring, boto3 publish calls, and fan-out diagrams all click into place —
        no new vocabulary per AWS console screen.
      </Callout>

      <Definition term="SNS core entities">
        <p>
          A <strong className="text-white">topic</strong> is the channel. A{' '}
          <strong className="text-white">publisher</strong> sends a <strong className="text-white">message</strong>{' '}
          to that topic. A <strong className="text-white">subscription</strong> connects the topic to a{' '}
          <strong className="text-white">subscriber</strong> endpoint (email address, Lambda ARN, queue ARN).
          SNS delivers one copy of each message per subscription when publish succeeds.
        </p>
      </Definition>

      <LessonSection title="Topic — the channel">
        <ContentStep number={1} title="Creation and identity">
          <p className="text-slate-300">
            Create a topic in the SNS console or via CLI. AWS assigns an ARN like{' '}
            <code className="text-core-400">arn:aws:sns:us-east-1:123456789012:data-pipeline-alerts-dev</code>.
            Publishers and alarm actions reference this ARN — copy it once, paste into every alarm action
            config.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Display name and delivery">
          <p className="text-slate-300">
            Optional <strong className="text-white">display name</strong> appears in SMS sender ID (where
            supported) and email subject prefixes. Keep it short and recognizable —{' '}
            <code className="text-core-400">DataPipeline</code> — so on-call recognizes alerts on a phone lock
            screen.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Topic policy">
          <p className="text-slate-300">
            Resource policy on the topic grants publish rights to CloudWatch alarms, Lambda roles, or other
            accounts. Default dev topics often allow account-root publish; production topics should restrict
            to specific service principals and roles — least privilege from your IAM lessons applies here
            too.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Publisher — who sends messages">
        <p className="text-slate-300">
          Any AWS principal with <code className="text-core-400">sns:Publish</code> permission can publish.
          Common DE publishers:
        </p>
        <ContentStep number={1} title="CloudWatch alarms">
          <p className="text-slate-300">
            When alarm state changes to ALARM (or OK if configured), CloudWatch publishes a JSON message
            describing the metric, threshold, and reason — automatically, no Lambda required for basic email
            alerting.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda and EC2 scripts">
          <p className="text-slate-300">
            After validating an S3 upload or finishing a custom ETL step, your Python code calls{' '}
            <code className="text-core-400">sns.publish</code> with a human-readable subject and body — or
            structured JSON for downstream subscribers to parse.
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS services as publishers">
          <p className="text-slate-300">
            Glue, Auto Scaling, Budgets, and many services can publish directly to SNS topics when configured
            — check each service&apos;s notification settings for pipeline-relevant events like job failure or
            cost threshold breach.
          </p>
        </ContentStep>
        <Flowchart
          title="Common publishers in DE pipelines"
          chart={`flowchart LR
  CW[CloudWatch alarm]
  LAM[Lambda ETL script]
  GLUE[Glue job notification]
  SF[Step Functions branch]
  CW --> TOP[SNS topic]
  LAM --> TOP
  GLUE --> TOP
  SF --> TOP`}
        />
      </LessonSection>

      <LessonSection title="Subscriber — who receives messages">
        <ContentStep number={1} title="Endpoint types">
          <p className="text-slate-300">
            A subscriber is the destination: email address, phone number, Lambda function, SQS queue, HTTP(S)
            URL, mobile push endpoint, or another topic (topic chaining for cross-region or cross-account
            fan-out).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Independent delivery">
          <p className="text-slate-300">
            Each subscription is evaluated separately. If email delivery fails, Lambda and SQS subscriptions
            still receive the message (unless the entire publish fails). Monitor subscription delivery status
            in the SNS console for stuck endpoints.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda as subscriber">
          <p className="text-slate-300">
            SNS invokes your Lambda with an event containing the message body, subject, and metadata. Common
            DE use: parse alarm JSON, format Slack Block Kit payload, call PagerDuty API — transform raw SNS
            into team-specific tooling.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Subscription — linking topic to endpoint">
        <ContentStep number={1} title="Creating a subscription">
          <p className="text-slate-300">
            Specify protocol (email, lambda, sqs, etc.) and endpoint (address, function ARN, queue ARN). SNS
            creates a pending subscription until confirmed — email and SMS require the recipient to click
            Confirm; Lambda and SQS auto-confirm when IAM permissions allow.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Confirmation is security">
          <p className="text-slate-300">
            You cannot subscribe someone else&apos;s email without them confirming — prevents spam abuse.
            Always confirm dev subscriptions before testing alarms; unconfirmed subscriptions silently drop
            messages.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Filter policies (preview)">
          <p className="text-slate-300">
            Subscriptions can attach JSON filter policies so only matching messages deliver — e.g. only Glue
            failure messages to the on-call Lambda, batch-complete messages to the catalog updater. Covered
            in the next module; standard beginner setups deliver all messages to all subscribers.
          </p>
        </ContentStep>
        <Example title="Subscription row in plain English" caption="Email alert for dev pipeline">
{`Topic:     data-pipeline-alerts-dev
Protocol:  email
Endpoint:  engineer@example.com
Status:    Confirmed (after clicking link in AWS email)

When any publisher sends to this topic, engineer@example.com receives a copy.`}
        </Example>
      </LessonSection>

      <LessonSection title="Message — the payload">
        <ContentStep number={1} title="Subject and body">
          <p className="text-slate-300">
            Publish calls include optional <code className="text-core-400">Subject</code> (shown in email) and{' '}
            <code className="text-core-400">Message</code> (main content — plain text or JSON string). Keep
            subjects actionable: &quot;ALARM: ingest-dev-errors in us-east-1&quot; not &quot;Notification.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Message attributes">
          <p className="text-slate-300">
            Key-value metadata attached to the message — used by filter policies and routing logic. Example:
            <code className="text-core-400">severity=critical</code>,{' '}
            <code className="text-core-400">pipeline=orders-ingest</code> for downstream filtering in
            advanced setups.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CloudWatch alarm message format">
          <p className="text-slate-300">
            Alarm notifications arrive as JSON with fields like AlarmName, NewStateReason, and Trigger
            threshold details. Lambda subscribers parse this structure to extract function name and metric —
            your Slack bot can link directly to the CloudWatch console.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How many subscribers can attach?">
        <p className="text-slate-300">
          SNS standard topics support a large number of subscriptions per topic — enough for every email, Lambda,
          and SQS endpoint a typical DE team needs on one alert channel. Practical limits matter less than
          organizational ones: too many subscribers on one noisy topic floods everyone.
        </p>
        <ContentStep number={1} title="Fan-out scale">
          <p className="text-slate-300">
            One publish fan-outs to all confirmed subscriptions in parallel. Adding the tenth subscriber does
            not slow the first nine — SNS handles concurrent delivery with retries per endpoint.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to split topics">
          <p className="text-slate-300">
            Split by severity or audience: <code className="text-core-400">pipeline-critical-prod</code> for
            PagerDuty and SMS, <code className="text-core-400">pipeline-info-prod</code> for email-only batch
            summaries. Fewer subscribers per topic means cleaner signal-to-noise for on-call.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cross-region subscribers">
          <p className="text-slate-300">
            Subscribe endpoints in other regions (e.g. SQS queue in eu-west-1 from a us-east-1 topic) for
            multi-region DR patterns — advanced but worth knowing SNS is not locked to one region&apos;s
            compute.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Beginner rule: one SNS topic per alert category per environment, with 2–5 subscribers (email + one
          Lambda + optional SQS). Scale topic count before subscriber count when noise becomes a problem —
          not the other way around.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Topic = channel (ARN); publisher = sender; subscriber = receiver; subscription = the link; message = payload.',
          'Common publishers: CloudWatch alarms, Lambda/boto3, Glue, Step Functions.',
          'Email/SMS subscriptions require confirmation; Lambda and SQS auto-confirm with correct IAM.',
          'One topic fans out to many subscribers in parallel — split topics by severity when noise grows.',
        ]}
      />
    </LessonArticle>
  )
}
