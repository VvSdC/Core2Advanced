import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithSns() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why SNS after CloudWatch for data engineering">
        You know who may access AWS (IAM), where data lives (S3), how event-driven code runs (Lambda), and
        how to watch pipeline health (CloudWatch metrics, logs, alarms). The next question every on-call
        team asks is:{' '}
        <strong className="text-white">when an alarm fires, who gets notified — and can one alert reach
        email, Slack, and a retry Lambda at the same time?</strong> Amazon SNS (Simple Notification Service)
        is AWS&apos;s pub/sub messaging layer. It takes one message from a publisher (CloudWatch alarm, Glue
        job, your Python script) and fans it out to every subscriber on a topic — the standard pattern for
        pipeline alerts and event-driven fan-out in data engineering.
      </Callout>

      <Definition term="What is SNS in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon SNS</strong> is a managed publish/subscribe service. A{' '}
          <strong className="text-white">publisher</strong> sends a message to an SNS{' '}
          <strong className="text-white">topic</strong> — a named channel. Every{' '}
          <strong className="text-white">subscriber</strong> with an active{' '}
          <strong className="text-white">subscription</strong> receives a copy: email, SMS, Lambda, SQS queue,
          HTTP endpoint, and more. You do not maintain a list of recipients in your alarm config — you point
          alarms at one topic and manage subscribers separately.
        </p>
        <p className="mt-2 text-slate-300">
          Think of SNS as{' '}
          <span className="text-core-400">the loudspeaker on top of CloudWatch</span> — metrics and alarms
          detect problems; SNS delivers the wake-up call to every channel your team needs.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build SNS in layers so subscription protocols and fan-out architectures do not overwhelm you on
          day one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — pub/sub and topics">
          <p className="text-slate-300">
            Understand what pub/sub means, how a topic acts as a channel, and how publishers and subscribers
            relate — the vocabulary behind every CloudWatch alarm action you will configure.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Subscriptions — who receives messages">
          <p className="text-slate-300">
            Learn subscription protocols: email for on-call, Lambda for Slack or auto-remediation, SQS for
            buffered downstream processing — and when each fits a DE pipeline.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Publishing — sending messages">
          <p className="text-slate-300">
            See how messages enter a topic from the Console, CLI, or boto3 — including how CloudWatch alarms
            publish automatically when state changes to ALARM.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Fan-out architectures (next module)">
          <p className="text-slate-300">
            After this beginner pass: message filtering, FIFO topics, cross-account subscriptions, SNS → SQS
            → Lambda patterns for decoupled ETL, and wiring PagerDuty or Slack webhooks for production
            on-call.
          </p>
        </ContentStep>
        <Flowchart
          title="SNS sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is SNS]
  B --> C[Topics publishers subscribers]
  C --> D[Subscription protocols]
  D --> E[Publish a message]
  E --> F[Pipeline alerts]
  F --> G[Putting it together]
  G --> H[Filtering and fan-out — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Topic', 'A named channel — e.g. arn:aws:sns:us-east-1:123456789012:data-pipeline-alerts-dev'],
                ['Publisher', 'Who sends a message into the topic — CloudWatch alarm, Lambda, Glue, your boto3 script'],
                ['Subscriber', 'Who receives copies — email inbox, Lambda function, SQS queue, HTTP endpoint'],
                ['Subscription', 'The link between a topic and a subscriber endpoint — must be confirmed for email/SMS'],
                ['Message', 'The payload published to the topic — alarm JSON, plain text, or structured notification body'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Topic naming — quick check">
          Use environment and purpose in the name:{' '}
          <code className="text-core-400">data-pipeline-alerts-dev</code> or{' '}
          <code className="text-core-400">glue-job-failures-prod</code>. One topic per alert category keeps
          subscriptions manageable — do not mix dev test alarms with prod PagerDuty on the same topic.
        </Callout>
      </LessonSection>

      <LessonSection title="How SNS fits after CloudWatch in a pipeline">
        <p className="text-slate-300">
          CloudWatch detects that Lambda Errors spiked or Glue job duration exceeded normal. An alarm enters
          ALARM state and publishes to an SNS topic. SNS delivers that notification to every confirmed
          subscriber — your email, a Lambda that posts to Slack, an SQS queue that buffers work for a
          remediation worker. You configure the alarm once; you add or remove subscribers without touching
          alarm rules.
        </p>
        <Flowchart
          title="Alarm or publisher → SNS topic → email / Lambda / SQS"
          chart={`flowchart LR
  PUB[CloudWatch alarm or publisher]
  PUB --> TOP[SNS topic data-pipeline-alerts]
  TOP --> EM[Email on-call engineer]
  TOP --> LAM[Lambda posts to Slack]
  TOP --> SQS[SQS queue for retry worker]
  TOP --> SMS[SMS optional escalation]`}
        />
        <Callout variant="insight">
          Mature data platforms wire every critical alarm to SNS on day one — not directly to a single email
          address. A Lambda with no SNS topic is an alarm that breaks when the on-call rotation changes.
          SNS decouples &quot;something went wrong&quot; from &quot;who needs to know and how.&quot;
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about SNS">
        <ContentStep number={1} title="Alerting without hard-coded recipients">
          <p className="text-slate-300">
            Point ten CloudWatch alarms at one SNS topic. Subscribe the team email, a Slack Lambda, and an
            audit SQS queue. Add a new on-call phone number by creating one SMS subscription — no alarm
            reconfiguration across the fleet.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fan-out for event-driven ETL">
          <p className="text-slate-300">
            When a nightly batch completes, publish one SNS message. Subscribers trigger: catalog update
            Lambda, downstream Glue job via SQS, and a metrics Lambda that writes custom CloudWatch data —
            one event, many reactions without point-to-point wiring.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Bridge between monitoring and action">
          <p className="text-slate-300">
            CloudWatch tells you <em>what</em> metric breached. SNS delivers that context to humans and
            automation. Pair with Lambda subscribers for auto-disable of broken triggers, ticket creation,
            or reprocess scripts — the action layer on top of observability.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS follows CloudWatch in the track — alarms detect problems; SNS delivers notifications and enables fan-out.',
          'Roadmap: pub/sub basics → subscriptions → publishing → pipeline alerts → filtering and fan-out next.',
          'Core vocabulary: topic, publisher, subscriber, subscription, message.',
          'Typical flow: CloudWatch alarm or publisher → SNS topic → email, Lambda, SQS, or other subscribers.',
        ]}
      />
    </LessonArticle>
  )
}
