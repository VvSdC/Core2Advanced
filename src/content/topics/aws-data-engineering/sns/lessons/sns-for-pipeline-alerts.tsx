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

export function SnsForPipelineAlerts() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The standard DE alert chain">
        The most common SNS use case in data engineering is{' '}
        <strong className="text-white">CloudWatch Alarm → SNS → on-call</strong>. Metrics prove something
        broke; the alarm evaluates thresholds; SNS delivers the wake-up call. Master this chain once and you
        can replicate it for every Lambda, Glue job, and custom metric in your lake — same topic pattern,
        same confirmation drill, same incident flow.
      </Callout>

      <Definition term="Pipeline alert path">
        <p>
          A <strong className="text-white">pipeline alert path</strong> connects observability to human or
          automated response: CloudWatch (or custom metric) → alarm rule → SNS topic → subscribers (email,
          Lambda/Slack, SQS worker). The alarm is the publisher; SNS is the delivery layer; subscribers
          decide what &quot;on-call&quot; means for your team.
        </p>
      </Definition>

      <LessonSection title="CloudWatch Alarm → SNS → email/on-call">
        <ContentStep number={1} title="Create the SNS topic first">
          <p className="text-slate-300">
            SNS → Create topic → <code className="text-core-400">data-pipeline-alerts-dev</code>. Copy the
            ARN. Subscribe your email; click Confirm in the AWS confirmation message. Status must read
            Confirmed — pending subscriptions receive nothing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Create the CloudWatch alarm">
          <p className="text-slate-300">
            CloudWatch → Alarms → Create → select metric (e.g. Lambda Errors for{' '}
            <code className="text-core-400">de-s3-ingest-validator-dev</code>) → threshold (Sum &gt; 0 over
            1 minute) → Configure actions → ALARM state → Send notification to SNS topic → pick your topic
            ARN. Optionally notify on OK when recovering.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarm publishes — you receive">
          <p className="text-slate-300">
            When the metric breaches threshold, alarm state becomes ALARM. CloudWatch publishes to SNS
            automatically. Email arrives with subject like &quot;ALARM: ingest-dev-errors in US East (N.
            Virginia)&quot; and JSON body with NewStateReason, threshold, and metric dimensions — enough to
            jump to logs.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudWatch Alarm → SNS → email/on-call"
          chart={`flowchart LR
  MET[Lambda Errors metric]
  MET --> ALM[CloudWatch alarm ingest-dev-errors]
  ALM -->|state ALARM| SNS[SNS data-pipeline-alerts-dev]
  SNS --> EM[Email on-call engineer]
  SNS --> LAM[Lambda Slack optional]
  ALM -->|state OK| SNS2[SNS recovery notification optional]`}
        />
      </LessonSection>

      <LessonSection title="Which metrics to alarm on — DE starters">
        <ContentStep number={1} title="Lambda ingestion functions">
          <p className="text-slate-300">
            <code className="text-core-400">Errors</code> Sum &gt; 0 — any failure pages. Add{' '}
            <code className="text-core-400">Throttles</code> &gt; 0 if concurrency limits bite during bulk
            uploads. <code className="text-core-400">Duration</code> p99 approaching timeout warns before
            hard failures on large files.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue ETL jobs">
          <p className="text-slate-300">
            Alarm on failed job runs via Glue metrics or CloudWatch Events (EventBridge) rules — publish to
            same SNS topic with job name in the rule description. Include job run ID in downstream Lambda
            parsing for one-click console links.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Silent failure — missing data">
          <p className="text-slate-300">
            <code className="text-core-400">Invocations</code> &lt; 1 for 24 hours when nightly batch expected
            — catches &quot;no errors but nothing ran&quot; gaps. Pair with S3 request metrics on{' '}
            <code className="text-core-400">raw/incoming/</code> prefix if uploads should trigger Lambda.
          </p>
        </ContentStep>
        <Callout variant="tip" title="One topic vs many">
          Beginner dev account: one topic <code className="text-core-400">data-pipeline-alerts-dev</code> for
          all dev alarms. Prod: split critical (PagerDuty/SMS) from informational (email-only) to reduce
          on-call fatigue.
        </Callout>
      </LessonSection>

      <LessonSection title="Email on-call pattern">
        <ContentStep number={1} title="What the email contains">
          <p className="text-slate-300">
            AWS-formatted notification: alarm name, account, region, reason string (&quot;Threshold Crossed:
            1 datapoint was greater than 0.0&quot;), and trigger details (namespace, metric, dimensions).
            Search inbox for alarm name to correlate with dashboard red tiles.
          </p>
        </ContentStep>
        <ContentStep number={2} title="From email to logs">
          <p className="text-slate-300">
            Note timestamp from email → CloudWatch Logs →{' '}
            <code className="text-core-400">/aws/lambda/de-s3-ingest-validator-dev</code> → filter around
            that time → find stack trace. The alarm tells you <em>that</em>; logs tell you <em>why</em> —
            same flow from the CloudWatch beginner checkpoint.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Team distribution lists">
          <p className="text-slate-300">
            Subscribe <code className="text-core-400">data-oncall@company.com</code> instead of individuals —
            rotation happens in your paging tool or mail group, not in AWS. Re-subscribe when distribution
            list changes; remove departed engineers&apos; personal subscriptions.
          </p>
        </ContentStep>
        <Example title="Sample alarm email subject line" caption="What on-call sees on phone">
{`ALARM: "ingest-dev-errors" in US East (N. Virginia)

Body includes:
- AlarmName: ingest-dev-errors
- NewStateValue: ALARM
- NewStateReason: Threshold Crossed: 1 datapoint [1.0 (15/09/26 02:14:00)] was greater than the threshold (0.0).
- Trigger: AWS/Lambda Errors FunctionName=de-s3-ingest-validator-dev`}
        </Example>
      </LessonSection>

      <LessonSection title="Beyond email — Lambda on-call">
        <ContentStep number={1} title="Slack and PagerDuty">
          <p className="text-slate-300">
            Subscribe a Lambda that formats alarm JSON into Slack blocks or PagerDuty Events API v2 payload.
            On-call sees rich context in the tool they already watch — not buried email. One SNS topic, multiple
            protocols: email for audit trail, Lambda for active paging.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Auto-remediation (careful)">
          <p className="text-slate-300">
            Lambda subscriber can disable a broken S3 trigger, rerun Glue with{' '}
            <code className="text-core-400">--force</code>, or scale up workers — only for well-understood
            failures with idempotent fixes. Human notification should still fire; automation reduces toil, not
            judgment on novel incidents.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SQS for alert backlog">
          <p className="text-slate-300">
            During widespread outages, dozens of alarms fire at once. SNS → SQS buffers remediation tasks;
            worker processes one pipeline at a time instead of 50 concurrent Lambda invokes competing for
            Glue concurrency slots.
          </p>
        </ContentStep>
        <Flowchart
          title="Production alert fan-out"
          chart={`flowchart TB
  subgraph Detect["Detection"]
    M1[Lambda Errors]
    M2[Glue failure]
    M3[Missing invocations]
  end
  subgraph Alarm["CloudWatch alarms"]
    A1[ingest-errors]
    A2[glue-failed]
    A3[nightly-missed]
  end
  subgraph Notify["SNS data-pipeline-alerts-prod"]
    TOP[Topic]
  end
  M1 --> A1
  M2 --> A2
  M3 --> A3
  A1 --> TOP
  A2 --> TOP
  A3 --> TOP
  TOP --> EM[Email archive]
  TOP --> PD[Lambda PagerDuty]
  TOP --> SL[Lambda Slack]
  TOP --> Q[SQS remediation queue]`}
        />
      </LessonSection>

      <LessonSection title="Verify the alert path in dev">
        <ContentStep number={1} title="Controlled failure">
          <p className="text-slate-300">
            Temporarily raise an exception in dev Lambda or use a test event that fails validation. Invoke
            twice so Errors metric registers within the alarm period.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Wait for evaluation">
          <p className="text-slate-300">
            Alarm evaluation takes one or more periods (often 1–5 minutes). Dashboard alarm tile turns red;
            SNS delivers within seconds of ALARM state.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Confirm end-to-end">
          <p className="text-slate-300">
            Email received → logs show root cause → fix and redeploy → successful invoke → alarm returns OK
            (if OK action configured). Teams that skip this drill discover broken subscriptions in real
            outages.
          </p>
        </ContentStep>
        <Callout variant="insight">
          SNS for pipeline alerts is not optional infrastructure — it is how operable platforms close the
          loop between CloudWatch observability and humans who can fix data. Wire it on the first Lambda you
          deploy, not the week before production launch.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Standard DE chain: CloudWatch metric → alarm threshold → SNS topic → email/Lambda/SQS subscribers.',
          'Create topic and confirm email subscription before attaching alarm actions — pending subs drop messages.',
          'Starter alarms: Lambda Errors, Glue failures, missing Invocations for expected batch windows.',
          'Prod pattern: same topic fans out to email archive, Slack/PagerDuty Lambda, and optional SQS remediation queue.',
        ]}
      />
    </LessonArticle>
  )
}
