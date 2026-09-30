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

export function MonitoringLoggingAndTracing() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="&quot;Your API returned 502&quot; — now what?">
        A partner emails a request id and a timestamp. Without logs you are guessing. With access logs, metrics,
        and tracing on <code className="text-core-400">acme-ingest-api-prod</code>, you can tell in minutes
        whether the call was rejected by the authorizer, throttled, broken by the Lambda, or timed out waiting on
        a downstream service — and alarm on it before the partner notices.
      </Callout>

      <Definition term="Three observability signals">
        <p>
          <strong className="text-white">CloudWatch metrics</strong> count requests, errors, and latency per API
          and stage. <strong className="text-white">Access logs</strong> write one line per request in a format
          you define. <strong className="text-white">Execution logs</strong> (REST only) record step-by-step
          processing inside the gateway. <strong className="text-white">X-Ray tracing</strong> (REST) follows a
          request through the gateway into Lambda, SQS, and DynamoDB.
        </p>
      </Definition>

      <LessonSection title="Metrics and alarms">
        <ContentStep number={1} title="The core metrics">
          <p className="text-slate-300">
            <code className="text-core-400">Count</code>, <code className="text-core-400">4XXError</code>,{' '}
            <code className="text-core-400">5XXError</code>, <code className="text-core-400">Latency</code>,{' '}
            <code className="text-core-400">IntegrationLatency</code>, and — with caching —{' '}
            <code className="text-core-400">CacheHitCount</code> and <code className="text-core-400">CacheMissCount</code>.
            HTTP APIs publish similar metrics with lowercase <code className="text-core-400">4xx</code> and{' '}
            <code className="text-core-400">5xx</code> names. Enable detailed metrics for per-method breakdowns.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alarms that matter for ingestion">
          <p className="text-slate-300">
            Alarm on 5XX rate above 1 percent for 5 minutes, p99 <code className="text-core-400">Latency</code>{' '}
            above your partner SLA, and a drop in <code className="text-core-400">Count</code> to near zero during
            business hours — silence often means a partner integration broke. Send all three to SNS{' '}
            <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <Example title="5XX alarm" caption="AWS CLI — notify de-alerts-prod">
{`aws cloudwatch put-metric-alarm \\
  --alarm-name acme-ingest-api-prod-5xx \\
  --namespace AWS/ApiGateway \\
  --metric-name 5XXError \\
  --dimensions Name=ApiName,Value=acme-ingest-api-prod Name=Stage,Value=prod \\
  --statistic Sum --period 300 --evaluation-periods 1 \\
  --threshold 25 --comparison-operator GreaterThanThreshold \\
  --treat-missing-data notBreaching \\
  --alarm-actions arn:aws:sns:us-east-1:111122223333:de-alerts-prod`}
        </Example>
      </LessonSection>

      <LessonSection title="Access logs and execution logs">
        <ContentStep number={1} title="Custom access log format">
          <p className="text-slate-300">
            Log JSON so CloudWatch Logs Insights and Athena can query fields directly. Include request id, source
            IP, method, path, status, latency, authorizer and integration errors, and the partner id from the
            authorizer context. REST access logs can go to CloudWatch Logs or Firehose — Firehose lands them in S3
            for long-term Athena analysis.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Execution logs — handle with care">
          <p className="text-slate-300">
            REST execution logs at <code className="text-core-400">ERROR</code> or <code className="text-core-400">INFO</code>{' '}
            level show authorizer results, mapping output, and integration responses. Full request and response
            data logging writes payloads — including tokens and PII — into CloudWatch. Enable it briefly in dev
            for debugging, never permanently in prod.
          </p>
        </ContentStep>
        <Example title="Access log format" caption="JSON format set on the prod stage">
{`{
  "requestId": "$context.requestId",
  "ip": "$context.identity.sourceIp",
  "method": "$context.httpMethod",
  "path": "$context.resourcePath",
  "status": "$context.status",
  "latencyMs": "$context.responseLatency",
  "integrationLatencyMs": "$context.integrationLatency",
  "partnerId": "$context.authorizer.partnerId",
  "authorizerError": "$context.authorizer.error",
  "integrationError": "$context.integrationErrorMessage",
  "errorMessage": "$context.error.message"
}`}
        </Example>
        <Example title="Logs Insights — top errors by partner" caption="Run against the access log group">
{`fields @timestamp, partnerId, status, errorMessage, integrationError
| filter status >= 400
| stats count(*) as errors by partnerId, status, errorMessage
| sort errors desc
| limit 20`}
        </Example>
      </LessonSection>

      <LessonSection title="Tracing and the debugging runbook">
        <ContentStep number={1} title="X-Ray on REST stages">
          <p className="text-slate-300">
            Turn on active tracing per stage. The service map shows gateway, authorizer Lambda, integration Lambda,
            and downstream calls with timings. Use sampling rules so high-volume ingestion does not trace every
            request. HTTP APIs do not support X-Ray today — rely on access logs and Lambda tracing there.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the status code first">
          <p className="text-slate-300">
            <strong className="text-white">403</strong>: missing or denied auth, resource policy or WAF block, or a
            path that does not exist (REST says &quot;Missing Authentication Token&quot;).{' '}
            <strong className="text-white">429</strong>: throttle or usage plan quota.{' '}
            <strong className="text-white">502</strong>: the Lambda errored or returned a malformed proxy response.{' '}
            <strong className="text-white">504</strong>: integration timeout — the backend took too long.
          </p>
        </ContentStep>
        <Flowchart
          title="Debugging a failed partner call"
          chart={`flowchart TB
  S[Find requestId in access logs]
  S --> C403[403 status]
  S --> C429[429 status]
  S --> C502[502 status]
  S --> C504[504 status]
  C403 --> A1[Check authorizer error resource policy WAF and path]
  C429 --> A2[Check usage plan stage and account throttles]
  C502 --> A3[Check Lambda logs and proxy response shape]
  C504 --> A4[Check IntegrationLatency and backend timeout]`}
        />
        <Callout variant="tip">
          Pass <code className="text-core-400">$context.requestId</code> into the backend (header or message
          attribute) and log it in Lambda. One id then links gateway access logs, Lambda logs, SQS messages, and
          the bronze record.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Watch Count, 4XXError, 5XXError, Latency, and IntegrationLatency; alarm on error rate, p99 latency, and silence.',
          'JSON access logs with request id, source IP, status, and error fields are the first debugging tool.',
          'Execution logs are REST-only and can capture secrets and PII — keep full data logging out of prod.',
          'X-Ray tracing works on REST stages; HTTP APIs rely on access logs and Lambda-side tracing.',
          'Triage by status code: 403 auth or path, 429 throttling, 502 bad backend response, 504 timeout.',
        ]}
      />
    </LessonArticle>
  )
}
