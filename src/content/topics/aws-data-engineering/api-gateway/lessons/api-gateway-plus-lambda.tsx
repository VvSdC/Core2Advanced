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

export function ApiGatewayPlusLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The most common pairing in serverless DE">
        You already know Lambda from the compute module. Put API Gateway in front of it and a partner can
        send data to your Lambda over HTTPS with auth and throttling handled for you. The catch: API Gateway
        hands Lambda a specific <strong className="text-white">event shape</strong>, and Lambda must return
        a specific <strong className="text-white">response shape</strong>. Get the contract right and
        everything works; get it wrong and callers see a mysterious 502.
      </Callout>

      <Definition term="Lambda proxy integration">
        <p>
          An integration type where API Gateway forwards the <strong className="text-white">entire HTTP
          request</strong> — method, path, headers, query string, path parameters, and body — to Lambda as a
          JSON event, and turns Lambda&apos;s return value directly into the HTTP response. No mapping
          templates are needed; your code owns parsing and status codes. It is the default choice for both
          REST APIs (<code className="text-core-400">AWS_PROXY</code>) and HTTP APIs.
        </p>
      </Definition>

      <LessonSection title="The event shape Lambda receives">
        <p className="text-slate-300">
          REST APIs send <strong className="text-white">payload format 1.0</strong>. HTTP APIs default to{' '}
          <strong className="text-white">payload format 2.0</strong>, which is slimmer and uses different
          field names. Know which one your handler gets before you read{' '}
          <code className="text-core-400">event[&quot;httpMethod&quot;]</code> and find it missing.
        </p>
        <Example title="REST API event — payload format 1.0" caption="Trimmed; real events carry more headers and requestContext fields">
{`{
  "resource": "/ingest/{source}",
  "path": "/ingest/shopify",
  "httpMethod": "POST",
  "headers": {"Content-Type": "application/json"},
  "queryStringParameters": {"dry_run": "false"},
  "pathParameters": {"source": "shopify"},
  "body": "{\\"event_id\\": \\"evt-001\\", \\"event_type\\": \\"order_created\\"}",
  "isBase64Encoded": false
}`}
        </Example>
        <Example title="HTTP API event — payload format 2.0" caption="routeKey, rawPath, and requestContext.http replace httpMethod and path">
{`{
  "version": "2.0",
  "routeKey": "POST /ingest/{source}",
  "rawPath": "/ingest/shopify",
  "rawQueryString": "dry_run=false",
  "headers": {"content-type": "application/json"},
  "pathParameters": {"source": "shopify"},
  "requestContext": {"http": {"method": "POST", "sourceIp": "203.0.113.10"}, "requestId": "req-abc"},
  "body": "{\\"event_id\\": \\"evt-001\\", \\"event_type\\": \\"order_created\\"}",
  "isBase64Encoded": false
}`}
        </Example>
        <Callout variant="info">
          Notice that <code className="text-core-400">body</code> is always a <em>string</em>, not a parsed
          object — you must call <code className="text-core-400">json.loads</code>. Binary payloads arrive
          base64-encoded with <code className="text-core-400">isBase64Encoded</code> set to true.
        </Callout>
      </LessonSection>

      <LessonSection title="The response shape — and a handler that lands data in bronze">
        <p className="text-slate-300">
          Return a dictionary with <code className="text-core-400">statusCode</code> (integer), optional{' '}
          <code className="text-core-400">headers</code>, and <code className="text-core-400">body</code> as
          a <strong className="text-white">string</strong>. The handler below validates JSON, rejects bad
          input with 400, and writes accepted events to S3 bronze keyed by{' '}
          <code className="text-core-400">event_id</code> so retries overwrite rather than duplicate.
        </p>
        <Example title="Python ingest handler" caption="Works with both payload formats because it only reads pathParameters, body, and isBase64Encoded">
{`import base64, json, os
from datetime import datetime, timezone
import boto3

s3 = boto3.client("s3")
BUCKET = os.environ["LAKE_BUCKET"]          # acme-lake-prod
REQUIRED = {"event_id", "event_type"}

def respond(status, payload):
    return {
        "statusCode": status,
        "headers": {"Content-Type": "application/json"},
        "body": json.dumps(payload),        # must be a string
    }

def handler(event, context):
    source = (event.get("pathParameters") or {}).get("source", "unknown")
    raw = event.get("body") or ""
    if event.get("isBase64Encoded"):
        raw = base64.b64decode(raw).decode("utf-8")
    try:
        record = json.loads(raw)
    except json.JSONDecodeError:
        return respond(400, {"error": "body must be valid JSON"})
    if not isinstance(record, dict) or not REQUIRED <= record.keys():
        return respond(400, {"error": f"required fields: {sorted(REQUIRED)}"})

    now = datetime.now(timezone.utc)
    key = f"bronze/{source}/dt={now:%Y-%m-%d}/{record['event_id']}.json"
    s3.put_object(Bucket=BUCKET, Key=key, Body=raw.encode("utf-8"),
                  ContentType="application/json")
    return respond(202, {"status": "accepted", "s3_key": key})`}
        </Example>
      </LessonSection>

      <LessonSection title="Permissions — two directions">
        <ContentStep number={1} title="API Gateway may invoke Lambda">
          <p className="text-slate-300">
            The function needs a <strong className="text-white">resource-based policy</strong> allowing{' '}
            <code className="text-core-400">lambda:InvokeFunction</code> for the principal{' '}
            <code className="text-core-400">apigateway.amazonaws.com</code>, scoped by source ARN. The
            console adds it when you wire the integration; CLI and IaC users must add it themselves.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda may write to S3">
          <p className="text-slate-300">
            The Lambda <strong className="text-white">execution role</strong> needs{' '}
            <code className="text-core-400">s3:PutObject</code> on{' '}
            <code className="text-core-400">arn:aws:s3:::acme-lake-prod/bronze/*</code> — and KMS encrypt
            permissions if the bucket uses SSE-KMS.
          </p>
        </ContentStep>
        <Example title="Grant API Gateway permission to invoke the function" caption="Source ARN limits it to POST on /ingest paths of API abc123">
{`aws lambda add-permission \\
  --function-name acme-ingest-handler \\
  --statement-id apigw-ingest-post \\
  --action lambda:InvokeFunction \\
  --principal apigateway.amazonaws.com \\
  --source-arn "arn:aws:execute-api:us-east-1:111122223333:abc123/*/POST/ingest/*"`}
        </Example>
      </LessonSection>

      <LessonSection title="Errors, timeouts, and cold starts">
        <Flowchart
          title="Debugging a 5XX from a Lambda-backed API"
          chart={`flowchart TD
  E[Caller sees 5XX] --> Q1{Lambda logs show an invocation}
  Q1 -->|no| P[Check invoke permission and integration ARN]
  Q1 -->|yes| Q2{Function errored or timed out}
  Q2 -->|yes| F[Fix code or reduce work per request]
  Q2 -->|no| M[Check response shape statusCode and string body]`}
        />
        <ContentStep number={1} title="502 — Malformed Lambda proxy response">
          <p className="text-slate-300">
            The classic REST API error. Usual causes: <code className="text-core-400">body</code> returned
            as a dict instead of a JSON string, a missing or string <code className="text-core-400">statusCode</code>,
            or an unhandled exception. Enable execution logs on the stage to see the exact message.
          </p>
        </ContentStep>
        <ContentStep number={2} title="The integration timeout">
          <p className="text-slate-300">
            By default API Gateway waits about <strong className="text-white">29 seconds</strong> for the
            integration (HTTP APIs cap at 30), even if the Lambda timeout is 15 minutes — the caller gets a
            504 while Lambda keeps running. AWS now lets you request a higher limit for regional and private
            REST APIs, with trade-offs; check current quotas. For DE, the better fix is to acknowledge fast
            and process asynchronously.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cold starts">
          <p className="text-slate-300">
            The first request to a new Lambda environment pays initialization time — usually hundreds of
            milliseconds. Webhook senders rarely care, but for latency-sensitive data APIs keep packages
            small, create boto3 clients outside the handler, and consider provisioned concurrency.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda proxy integration forwards the whole request as JSON; your code parses it and returns the full HTTP response.',
          'REST APIs send payload 1.0 (httpMethod, path, pathParameters, body); HTTP APIs default to 2.0 (routeKey, rawPath, requestContext.http).',
          'Return statusCode as an integer, headers, and body as a string — otherwise REST APIs answer 502 Malformed Lambda proxy response.',
          'Grant apigateway.amazonaws.com lambda:InvokeFunction via a resource-based policy, and give the execution role only the S3 access it needs.',
          'The default integration timeout is about 29 seconds — acknowledge quickly and push heavy work to SQS, Step Functions, or Glue.',
        ]}
      />
    </LessonArticle>
  )
}
