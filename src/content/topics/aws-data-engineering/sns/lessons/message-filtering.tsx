import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MessageFiltering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One topic, many pipelines — filter at the subscription">
        Without filtering, every S3 landing event hits every subscriber — analytics, compliance, and
        quarantine teams all receive the same firehose.{' '}
        <strong className="text-white">Subscription filter policies</strong> route messages by JSON
        body fields or message attributes so each DE consumer only sees relevant events. This reduces
        cost, noise, and accidental double-processing.
      </Callout>

      <Definition term="Subscription filter policy">
        <p>
          A <strong className="text-white">filter policy</strong> attached to an SNS subscription defines
          which messages that subscriber receives. Filters match on the message body (when JSON) or on{' '}
          <strong className="text-white">MessageAttributes</strong>. Non-matching messages are dropped for
          that subscription only — other subscribers still receive them. This is attribute-based routing
          without publishing to multiple topics.
        </p>
      </Definition>

      <LessonSection title="Message Filtering / subscription filter policies">
        <ContentStep number={1} title="Body vs attributes">
          <p className="text-slate-300">
            S3 event notifications embed bucket, key, and event name in the JSON body — filter on{' '}
            <span className="font-mono text-sm">Records[0].s3.object.key</span> prefix patterns. For custom
            publishers (Lambda, Glue callback), set MessageAttributes like{' '}
            <span className="font-mono text-sm">pipeline</span>,{' '}
            <span className="font-mono text-sm">severity</span>,{' '}
            <span className="font-mono text-sm">env</span> — cleaner than parsing nested body in every
            filter.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Filter policy syntax">
          <p className="text-slate-300">
            Policies use JSON with field names mapping to arrays of allowed values or prefix/suffix/numeric
            matches. A subscription with no filter receives everything. Each filtered subscription is
            evaluated independently — one message can match zero, one, or many subscriptions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scope filter policies (advanced)">
          <p className="text-slate-300">
            For cross-account or multi-team topics, combine IAM with filter policies so subscribers cannot
            broaden filters beyond allowed attribute namespaces — prevents a misconfigured subscription
            from draining all production events into a dev queue.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Attribute-based routing examples for DE">
        <ContentStep number={1} title="Route by landing prefix">
          <p className="text-slate-300">
            Single SNS topic on S3 bucket notifications. Subscription A filter: key prefix{' '}
            <span className="font-mono text-sm">landing/finance/</span> → finance-ingest SQS. Subscription
            B: prefix <span className="font-mono text-sm">landing/marketing/</span> → marketing-ingest SQS.
            One bucket, one topic, domain-separated queues without duplicate S3 notification configs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Route by severity for ops">
          <p className="text-slate-300">
            Custom metric publisher Lambda sends to SNS with attribute{' '}
            <span className="font-mono text-sm">severity=critical|warning|info</span>. Critical
            subscription → PagerDuty SQS; warning → Slack Lambda only; info → audit archive queue. CloudWatch
            alarms can publish to the same topic with alarm name embedded as attribute for routing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Environment isolation">
          <p className="text-slate-300">
            Attribute <span className="font-mono text-sm">env=prod</span> vs{' '}
            <span className="font-mono text-sm">env=staging</span> on pipeline status events. Staging
            subscribers never see prod traffic even if topic ARN is shared in a platform account — critical
            for shared data platform teams.
          </p>
        </ContentStep>
        <Example title="Filter policy — severity attribute">
{`{
  "severity": ["critical"]
}`}
        </Example>
        <Example title="Filter policy — S3 key prefix (body filter)">
{`{
  "Records": {
    "s3": {
      "object": {
        "key": [{ "prefix": "landing/vendor=acme/" }]
      }
    }
  }
}`}
        </Example>
        <Example title="Publisher — set MessageAttributes (boto3)">
{`import boto3

sns = boto3.client("sns")

sns.publish(
    TopicArn="arn:aws:sns:us-east-1:123456789012:pipeline-events",
    Message='{"job": "curated-daily", "status": "FAILED"}',
    MessageAttributes={
        "pipeline": {"DataType": "String", "StringValue": "curated-daily"},
        "severity": {"DataType": "String", "StringValue": "critical"},
        "env": {"DataType": "String", "StringValue": "prod"},
    },
)`}
        </Example>
        <Callout variant="tip">
          Prefer MessageAttributes for routing keys you control. S3 body filters are powerful but brittle
          if event schema changes — document filter policies in IaC next to subscription definitions.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Subscription filter policies drop non-matching messages per subscriber — other subscriptions unaffected.',
          'Filter on JSON body (S3 events) or MessageAttributes (custom publishers) for domain and severity routing.',
          'DE pattern: one landing bucket topic → filtered SQS queues per dataset, team, or environment.',
          'Set pipeline, severity, and env attributes at publish time for clean ops and staging isolation.',
          'Document filters in IaC; body prefix filters on S3 keys are common but sensitive to key layout changes.',
        ]}
      />
    </LessonArticle>
  )
}
