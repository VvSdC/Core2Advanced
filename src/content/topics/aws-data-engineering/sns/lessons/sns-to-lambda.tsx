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

export function SnsToLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Direct invoke is simple — know when to avoid it">
        SNS can invoke Lambda directly on each published message — useful for lightweight formatters,
        Slack notifiers, and alarm enrichment. For heavy ETL, direct subscription duplicates work on retry
        and lacks SQS batching. Data engineers choose SNS → Lambda for ops glue code and SNS → SQS →
        Lambda for ingest workloads.
      </Callout>

      <Definition term="SNS Lambda subscription">
        <p>
          When Lambda subscribes to a topic, SNS invokes the function synchronously with an event payload
          containing the SNS message metadata and body. Lambda success returns 200; unhandled errors trigger
          SNS delivery retries — potentially invoking the function multiple times for the same logical event.
        </p>
      </Definition>

      <LessonSection title="SNS → Lambda">
        <ContentStep number={1} title="Setup and permissions">
          <p className="text-slate-300">
            Subscribe Lambda to topic in console or IaC. Lambda resource policy must allow{' '}
            <span className="font-mono text-sm">sns.amazonaws.com</span> to invoke. Execution role needs
            whatever the handler calls — post Slack webhook (HTTPS), read S3 for context, start Step
            Functions. Keep handlers small and fast — SNS invoke timeout aligns with Lambda timeout.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event payload shape">
          <p className="text-slate-300">
            Each invocation receives{' '}
            <span className="font-mono text-sm">Records[0].Sns.Message</span> (string),{' '}
            <span className="font-mono text-sm">Subject</span>,{' '}
            <span className="font-mono text-sm">TopicArn</span>, and{' '}
            <span className="font-mono text-sm">MessageAttributes</span>. CloudWatch alarm payloads embed
            JSON in Message — parse and enrich before posting to Slack with dashboard links.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When direct subscribe fits DE">
          <p className="text-slate-300">
            Alarm formatter: CloudWatch → SNS → Lambda → Slack blocks with Logs Insights query link. Glue
            failure notifier: custom metric topic → Lambda gathers JobRunId from message and opens ticket.
            Not for per-file S3 transform at scale — use SQS buffer.
          </p>
        </ContentStep>
        <Example title="Alarm formatter handler sketch">
{`import json
import logging
import urllib.request

logger = logging.getLogger()
logger.setLevel(logging.INFO)

SLACK_URL = "https://hooks.slack.com/services/..."

def handler(event, context):
    for record in event.get("Records", []):
        sns = record["Sns"]
        alarm = json.loads(sns["Message"])
        name = alarm.get("AlarmName", "unknown")
        reason = alarm.get("NewStateReason", "")
        payload = {"text": f"ALARM: {name}\\n{reason}"}
        req = urllib.request.Request(
            SLACK_URL,
            data=json.dumps(payload).encode(),
            headers={"Content-Type": "application/json"},
        )
        urllib.request.urlopen(req)
    return {"statusCode": 200}`}
        </Example>
        <Flowchart
          title="SNS → Lambda vs SNS → SQS → Lambda"
          chart={`flowchart TB
  ALARM[CloudWatch Alarm]
  TOPIC[SNS ops-topic]
  ALARM --> TOPIC
  TOPIC --> LDirect[Lambda Slack formatter]
  TOPIC --> Q[SQS ingest-queue]
  Q --> ESM[Lambda ESM batch 10]
  ESM --> GLUE[Glue StartJobRun]
  LDirect --> SLACK[Slack notify]
  ESM -->|poison| DLQ[SQS DLQ replay]`}
        />
      </LessonSection>

      <LessonSection title="Idempotency reminder">
        <ContentStep number={1} title="At-least-once from SNS retries">
          <p className="text-slate-300">
            SNS retries failed Lambda invocations. A handler that starts Glue without dedupe can launch
            duplicate JobRuns. Use deterministic job name suffix from S3 etag, DynamoDB conditional write
            on message ID, or check ingest ledger before side effects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer queue for side effects">
          <p className="text-slate-300">
            Side-effect-heavy work (StartJobRun, COPY, partition registration) belongs behind SQS with
            idempotent consumer and partial batch failure. Use SNS → Lambda only when duplicate Slack
            messages are acceptable or deduped with message ID cache (DynamoDB TTL 24h).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partial failure in multi-record events">
          <p className="text-slate-300">
            SNS typically sends one record per invoke, but design handlers to loop Records safely. On
            failure, entire invoke fails and SNS retries all — another reason single-purpose formatters
            outperform monolithic orchestrators on direct subscription.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview split: &quot;SNS → Lambda for stateless notification and enrichment; SNS → SQS → Lambda
          for stateful ETL triggers with DLQ replay and controlled concurrency.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS invokes Lambda synchronously per message; errors trigger SNS retries — at-least-once delivery.',
          'Parse Records[0].Sns.Message for CloudWatch alarms and custom JSON pipeline events.',
          'Best for Slack formatters, ticket enrichment, lightweight ops — not high-volume S3 per-object ETL.',
          'Idempotency required: dedupe on MessageId, ledger checks, or move side effects to SQS consumer.',
          'Lambda resource policy must allow sns.amazonaws.com invoke; keep handlers fast and single-purpose.',
        ]}
      />
    </LessonArticle>
  )
}
