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

export function PublishAMessage() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Publishing = sending to the topic">
        Subscribers only receive messages when something <em>publishes</em> to the topic. CloudWatch alarms
        publish automatically on state change. Your pipeline code publishes when a batch completes or a
        validation step fails. This lesson covers the mental model and a minimal boto3 example — enough to
        wire custom notifications before advanced filtering and fan-out patterns.
      </Callout>

      <Definition term="Publish operation">
        <p>
          <strong className="text-white">Publishing</strong> sends one message to an SNS topic ARN. SNS then
          fan-outs to all confirmed subscriptions. The caller needs{' '}
          <code className="text-core-400">sns:Publish</code> on that topic. Publish is idempotent from the
          caller&apos;s perspective — call it once per event you want to broadcast, not once per subscriber.
        </p>
      </Definition>

      <LessonSection title="Publishing mental model">
        <ContentStep number={1} title="Identify the topic ARN">
          <p className="text-slate-300">
            Every publish targets a full ARN:{' '}
            <code className="text-core-400">arn:aws:sns:region:account-id:topic-name</code>. Store it in an
            environment variable like <code className="text-core-400">ALERT_TOPIC_ARN</code> so dev and prod
            differ without code changes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Craft subject and message">
          <p className="text-slate-300">
            <code className="text-core-400">Subject</code> is short — appears in email headers (max 100
            characters for SNS). <code className="text-core-400">Message</code> is the body — plain text for
            humans or JSON string for Lambda/SQS parsers. Include pipeline name, environment, and actionable
            detail: bucket, job run ID, row count.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One publish, many deliveries">
          <p className="text-slate-300">
            You do not loop over subscribers in application code. Call publish once; SNS handles fan-out,
            retries per endpoint, and delivery status logging. That separation is the whole point of pub/sub.
          </p>
        </ContentStep>
        <Flowchart
          title="Publish flow"
          chart={`flowchart LR
  APP[Lambda or script]
  APP --> PUB[sns.publish TopicArn Subject Message]
  PUB --> TOP[SNS topic]
  TOP --> D1[Deliver to subscriber 1]
  TOP --> D2[Deliver to subscriber 2]
  TOP --> D3[Deliver to subscriber N]`}
        />
      </LessonSection>

      <LessonSection title="Three ways to publish">
        <ContentStep number={1} title="AWS Console — manual test">
          <p className="text-slate-300">
            SNS → Topics → select topic → Publish message. Enter subject and body, click Publish message.
            Fastest way to verify subscribers work before wiring alarms — every confirmed endpoint should
            receive the test within seconds.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS CLI — scriptable test">
          <p className="text-slate-300">
            <code className="text-core-400">aws sns publish --topic-arn arn:aws:sns:... --subject
            &quot;Test&quot; --message &quot;Pipeline drill&quot;</code> — useful in CI smoke tests or
            shell scripts after deploy to confirm topic policy and credentials.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Boto3 — from pipeline code">
          <p className="text-slate-300">
            Python Lambdas and EC2 ETL scripts use <code className="text-core-400">boto3.client(&apos;sns&apos;).publish(...)</code>.
            Reuse the client at module scope in Lambda (same pattern as S3 and Glue clients). IAM execution
            role must allow publish on the topic ARN — least privilege, one topic per env.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Test publish before alarm drill">
          Console publish with subject &quot;SNS wiring test&quot; confirms subscriptions. Then trigger a
          CloudWatch alarm — if test worked but alarm did not, debug alarm action config or CloudWatch
          service permissions, not SNS itself.
        </Callout>
      </LessonSection>

      <LessonSection title="Simple Boto3 publish example">
        <p className="text-slate-300">
          Toy example: after a dev ingest Lambda validates a file, publish a success notification so the team
          knows the path works — no production PII in the message body.
        </p>
        <Example title="Minimal publish from Lambda" caption="Toy DE notification after validation">
{`import json
import logging
import os
import boto3

logger = logging.getLogger()
logger.setLevel(logging.INFO)

sns = boto3.client("sns")
TOPIC_ARN = os.environ["ALERT_TOPIC_ARN"]

def lambda_handler(event, context):
    bucket = event["Records"][0]["s3"]["bucket"]["name"]
    key = event["Records"][0]["s3"]["object"]["key"]
    row_count = 42  # pretend validation counted rows

    subject = f"DEV ingest OK: {key.split('/')[-1]}"
    body = {
        "event": "ingest_validated",
        "bucket": bucket,
        "key": key,
        "row_count": row_count,
        "request_id": context.aws_request_id,
    }

    response = sns.publish(
        TopicArn=TOPIC_ARN,
        Subject=subject[:100],
        Message=json.dumps(body),
    )
    logger.info("Published to SNS MessageId=%s", response["MessageId"])
    return {"statusCode": 200, "messageId": response["MessageId"]}`}
        </Example>
        <ContentStep number={1} title="Environment variable for topic ARN">
          <p className="text-slate-300">
            Set <code className="text-core-400">ALERT_TOPIC_ARN</code> in Lambda configuration — different
            value per alias or stage. Never hard-code prod ARNs in shared code branches.
          </p>
        </ContentStep>
        <ContentStep number={2} title="JSON in Message field">
          <p className="text-slate-300">
            Email subscribers see raw JSON — acceptable in dev. Lambda subscribers parse with{' '}
            <code className="text-core-400">json.loads</code>. For pretty email, use plain text Message in
            prod human paths and reserve JSON for automation subscriptions with filter policies.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Error handling">
          <p className="text-slate-300">
            Catch <code className="text-core-400">ClientError</code> from botocore — log and optionally
            re-raise if notification failure should fail the invocation (rare for success notifications;
            common for critical failure alerts where you want DLQ retry).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Who publishes besides your code?">
        <ContentStep number={1} title="CloudWatch alarms">
          <p className="text-slate-300">
            No boto3 required — alarm action configuration publishes on state transition. Message format is
            AWS-defined JSON with alarm metadata. Your subscribers must parse this format when subscribed to
            alarm topics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event-driven services">
          <p className="text-slate-300">
            Budgets, GuardDuty, and some Glue settings publish directly. Read each service&apos;s notification
            docs — message shape varies. Same topic can receive multiple publisher types if you design
            subscribers to handle varied payloads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Message attributes for filtering (preview)">
          <p className="text-slate-300">
            <code className="text-core-400">publish(..., MessageAttributes={'{'}...{'}'})</code> attaches
            typed metadata for subscription filter policies — e.g. only deliver messages where{' '}
            <code className="text-core-400">severity</code> equals <code className="text-core-400">critical</code>.
            Covered in the next module; omit for beginner all-subscribers setups.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common publish mistakes">
        <ContentStep number={1} title="Wrong region client">
          <p className="text-slate-300">
            SNS client region must match topic region. A <code className="text-core-400">us-east-1</code>{' '}
            client publishing to a <code className="text-core-400">eu-west-1</code> topic ARN fails — set
            region explicitly or rely on Lambda&apos;s <code className="text-core-400">AWS_REGION</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Missing sns:Publish on role">
          <p className="text-slate-300">
            IAM policy must allow publish on the specific topic ARN, not{' '}
            <code className="text-core-400">*</code> in prod. Symptom: AccessDenied in CloudWatch Logs on
            invoke.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Publishing to empty topic">
          <p className="text-slate-300">
            Publish succeeds even with zero subscribers — SNS accepts the message but nobody receives it.
            Always maintain at least one confirmed subscription in dev for sanity checks.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Publishing is the simplest SNS API call you will make — one ARN, subject, body. The engineering
          discipline is in topic design, subscription choice, and message content that on-call can act on at
          2 a.m. without opening three other consoles.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Publish sends one message to a topic ARN; SNS fan-outs to all confirmed subscribers — no per-recipient loops.',
          'Publish via Console (test), CLI (script), or boto3 sns.publish (pipeline code) — all need sns:Publish IAM.',
          'Toy pattern: env var for TopicArn, json.dumps body, module-scope boto3 client, log MessageId on success.',
          'CloudWatch alarms publish automatically — custom code publishes for batch complete, validation, or business events.',
        ]}
      />
    </LessonArticle>
  )
}
