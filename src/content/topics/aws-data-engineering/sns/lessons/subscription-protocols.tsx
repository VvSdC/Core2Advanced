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

export function SubscriptionProtocols() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Protocol = delivery method">
        When you create a subscription, you choose a{' '}
        <strong className="text-white">protocol</strong> — how SNS delivers messages to that endpoint. Email
        for humans, Lambda for automation, SQS for buffering — each protocol fits different DE pipeline jobs.
        Pick the right one and your alert path works on the first drill; pick wrong and messages vanish into
        unconfirmed inboxes or throttled HTTP endpoints.
      </Callout>

      <Definition term="Subscription protocol">
        <p>
          A <strong className="text-white">subscription protocol</strong> defines the transport SNS uses for
          one subscriber: <code className="text-core-400">email</code>,{' '}
          <code className="text-core-400">email-json</code>, <code className="text-core-400">sms</code>,{' '}
          <code className="text-core-400">lambda</code>, <code className="text-core-400">sqs</code>,{' '}
          <code className="text-core-400">http</code>, <code className="text-core-400">https</code>, and
          others. The <strong className="text-white">endpoint</strong> is the address for that protocol —
          email string, function ARN, queue URL, or webhook URL.
        </p>
      </Definition>

      <LessonSection title="Protocol overview for data engineers">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Protocol</th>
                <th className="px-4 py-3">Endpoint example</th>
                <th className="px-4 py-3">Typical DE use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['email', 'oncall@company.com', 'Human alerts from CloudWatch alarms — confirm subscription first'],
                ['email-json', 'Same email address', 'Structured JSON body for parsing — less common for beginners'],
                ['sms', '+15551234567', 'Critical escalation when email is too slow — watch cost per message'],
                ['lambda', 'arn:aws:lambda:...:function:slack-notifier', 'Format and post to Slack, PagerDuty, or auto-remediate'],
                ['sqs', 'arn:aws:sqs:...:pipeline-retry-queue', 'Buffer alerts for throttled workers or durable retry'],
                ['https', 'https://hooks.slack.com/services/...', 'Direct webhook — prefer Lambda wrapper for retries and secrets'],
              ].map(([protocol, endpoint, use]) => (
                <tr key={protocol} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{protocol}</td>
                  <td className="px-4 py-3 font-mono text-xs text-core-400">{endpoint}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Email — simplest on-call path">
        <ContentStep number={1} title="Setup flow">
          <p className="text-slate-300">
            SNS console → Subscriptions → Create → protocol email → enter address → Create. AWS sends
            confirmation email — click Confirm subscription. Status must show Confirmed before alarms deliver.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE example — Glue job failure">
          <p className="text-slate-300">
            Subscribe <code className="text-core-400">data-engineering@company.com</code> to topic{' '}
            <code className="text-core-400">glue-job-failures-prod</code>. Configure Glue job notification
            or a CloudWatch alarm on Glue failure metrics to publish to that topic. Email subject includes
            alarm name; body explains which job run failed and why.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limitations">
          <p className="text-slate-300">
            Email is slow for urgent pages (minutes possible), easy to miss in noisy inboxes, and not ideal
            for structured automation. Start here in dev; add Lambda → Slack for prod on-call.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SMS — escalation layer">
        <ContentStep number={1} title="When to use">
          <p className="text-slate-300">
            Reserve SMS for critical prod paths — primary ingest down, data loss risk — not every Glue
            retry warning. Each SMS incurs cost; SNS and carrier limits apply.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Confirmation required">
          <p className="text-slate-300">
            Like email, SMS subscriptions need opt-in confirmation. Use team on-call phones, not personal
            numbers you cannot rotate.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lambda — automation and integrations">
        <ContentStep number={1} title="How delivery works">
          <p className="text-slate-300">
            SNS invokes the function asynchronously with an event containing Records array — each record has
            Sns.Message, Sns.Subject, and metadata. Your handler parses alarm JSON and calls external APIs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE example — Slack notify on pipeline fail">
          <p className="text-slate-300">
            Lambda <code className="text-core-400">de-sns-to-slack-dev</code> subscribed to{' '}
            <code className="text-core-400">data-pipeline-alerts-dev</code>. On invoke, read{' '}
            <code className="text-core-400">event[&apos;Records&apos;][0][&apos;Sns&apos;][&apos;Message&apos;]</code>,
            extract AlarmName and NewStateReason, post formatted blocks to #data-oncall. Store webhook URL in
            Secrets Manager — not in code.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM requirement">
          <p className="text-slate-300">
            SNS needs permission to invoke the Lambda (resource-based policy added on subscribe). Lambda
            execution role needs whatever permissions the handler uses — Secrets Manager read, outbound HTTPS
            if no VPC, or VPC endpoints if inside private subnets.
          </p>
        </ContentStep>
        <Flowchart
          title="Lambda subscriber path"
          chart={`flowchart LR
  AL[CloudWatch ALARM]
  AL --> SNS[SNS topic]
  SNS --> LAM[Lambda slack-notifier]
  LAM --> SM[Secrets Manager webhook URL]
  LAM --> SL[Slack data-oncall channel]`}
        />
      </LessonSection>

      <LessonSection title="SQS — buffer and decouple">
        <ContentStep number={1} title="Why queue an alert">
          <p className="text-slate-300">
            Downstream remediation may take minutes — reprocess S3 prefix, restart Glue with params. SNS → SQS
            stores each notification durably; a worker Lambda polls at controlled concurrency instead of
            being hammered by parallel SNS invokes during incident storms.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE example — buffered retry worker">
          <p className="text-slate-300">
            Queue <code className="text-core-400">pipeline-alert-retry-dev</code> subscribed to alert topic.
            Worker Lambda processes one message at a time: parse failure type, attempt automatic reprocess,
            send email only if retry fails twice. Visibility timeout and DLQ catch poison messages.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Queue policy">
          <p className="text-slate-300">
            SQS queue policy must allow <code className="text-core-400">sns.amazonaws.com</code> to send
            messages with source ARN matching your topic. SNS console often sets this automatically on
            subscribe — verify in queue Access policy if messages never arrive.
          </p>
        </ContentStep>
        <Example title="SNS → SQS message shape" caption="What lands in the queue body">
{`{
  "Type": "Notification",
  "MessageId": "...",
  "TopicArn": "arn:aws:sns:us-east-1:123456789012:data-pipeline-alerts-dev",
  "Subject": "ALARM: ingest-dev-errors",
  "Message": "{ ... CloudWatch alarm JSON ... }",
  "Timestamp": "2026-09-15T02:14:00.000Z"
}

Worker parses Message field — same JSON email subscribers see.`}
        </Example>
      </LessonSection>

      <LessonSection title="HTTP / HTTPS — webhooks">
        <ContentStep number={1} title="Direct webhook delivery">
          <p className="text-slate-300">
            SNS POSTs the message to your URL. Works with Slack incoming webhooks, custom ticketing systems,
            or internal APIs. Endpoint must respond quickly (timeout applies) and handle SNS subscription
            confirmation POSTs on initial setup.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer Lambda wrapper in production">
          <p className="text-slate-300">
            Raw HTTPS subscriptions expose webhook URLs in SNS config and lack easy secret rotation. Pattern:
            SNS → Lambda → HTTPS with retries, logging, and Secrets Manager — easier to test and audit than
            public webhook endpoints receiving SNS directly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Confirmation handshake">
          <p className="text-slate-300">
            HTTP(S) endpoints must handle SubscribeURL confirmation requests — fetch the URL SNS provides or
            auto-confirm via API. Miss this step and subscription stays Pending forever.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mixing protocols on one topic">
        <p className="text-slate-300">
          Production alert topics commonly combine protocols — each serves a different role in the incident
          response chain.
        </p>
        <Flowchart
          title="Multi-protocol fan-out on one topic"
          chart={`flowchart TB
  TOP[data-pipeline-alerts-prod]
  TOP --> E[email — team distribution list]
  TOP --> L[lambda — Slack and PagerDuty]
  TOP --> Q[sqs — auto-reprocess worker]
  TOP --> S[sms — secondary on-call optional]`}
        />
        <Callout variant="tip" title="Beginner starter set">
          Dev: email only — prove alarm path. Dev+1: email + Lambda to Slack. Prod: email + Lambda + SQS
          retry queue. Add SMS only after noise filtering and on-call rotation are solid.
        </Callout>
        <Callout variant="insight">
          Every protocol is the same subscription model — topic, protocol, endpoint, confirm. Learn one,
          configure five. The DE skill is matching protocol to job: humans read email, automation runs in
          Lambda, bursty work buffers in SQS.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Protocol defines delivery method: email, sms, lambda, sqs, http/https — each with distinct DE use cases.',
          'Email on Glue fail: simple human alert — always confirm subscription before testing alarms.',
          'Lambda on notify: parse alarm JSON, post to Slack/PagerDuty, or trigger remediation with secrets in Secrets Manager.',
          'SQS buffer: durable queue between SNS fan-out and throttled workers — SNS → SQS → Lambda is a core DE pattern.',
        ]}
      />
    </LessonArticle>
  )
}
