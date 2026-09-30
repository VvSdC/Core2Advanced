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

export function PuttingItTogetherApiGatewayBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before authorization and direct integrations">
        You now know why API Gateway follows Systems Manager, what the managed front door handles for you,
        how REST, HTTP, and WebSocket APIs differ, how resources, methods, and stages build an invoke URL,
        how the Lambda proxy contract works, and which DE patterns use APIs well. This lesson ties those
        threads into a <strong className="text-white">beginner API Gateway checklist</strong> — the mental
        model you need before authorizers, usage plans, mapping templates, and direct service integrations.
      </Callout>

      <Definition term="Beginner API Gateway mental model">
        <p>
          A <strong className="text-white">beginner API Gateway mental model</strong> for DE includes: API
          Gateway as a thin HTTPS door (not compute or storage), the right API type per use case (HTTP by
          default, REST for API management), clear resource paths and stages per environment, Lambda proxy
          handlers that return a correct response shape, invoke permissions scoped by source ARN, a buffer
          between the API and heavy processing, presigned URLs for large files, secrets pulled from Secrets
          Manager, and CloudWatch alarms on 5XX errors — all before production partner traffic.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Edge tier — API Gateway only routes and guards">
          <p className="text-slate-300">
            The diagram shows API Gateway at the edge with auth and throttling, forwarding to Lambda or a
            queue — never running ETL or storing records itself.
          </p>
        </ContentStep>
        <ContentStep number={2} title="API type chosen on purpose">
          <p className="text-slate-300">
            HTTP API for a signature-verified webhook; REST API when partners need API keys and usage
            plans, schema validation, WAF, or a private endpoint. The choice is written in the design doc.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Routes, stages, and naming">
          <p className="text-slate-300">
            Routes like <code className="text-core-400">POST /webhooks/shopify</code>, APIs named{' '}
            <code className="text-core-400">acme-ingest-api-prod</code> with stage{' '}
            <code className="text-core-400">prod</code>, and a separate dev API built from the same template.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Lambda contract and permissions">
          <p className="text-slate-300">
            Handler parses the string <code className="text-core-400">body</code>, returns{' '}
            <code className="text-core-400">statusCode</code> plus a string body, and has a resource policy
            for <code className="text-core-400">apigateway.amazonaws.com</code> scoped to this API&apos;s ARN.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Buffer and bronze landing">
          <p className="text-slate-300">
            Data lands in <code className="text-core-400">s3://acme-lake-prod/bronze/</code> quickly; Glue
            processes it later on a schedule or S3 event — the API never waits on Glue.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner DE API Gateway stack"
          chart={`flowchart TD
  SRC[Shopify webhook] --> GW[HTTP API acme-ingest-api-prod]
  GW --> LAM[Lambda signature check]
  SM[Secrets Manager webhook secret] --> LAM
  LAM --> B[S3 bronze shopify]
  B --> GLUE[Glue ETL later]
  GLUE --> SIL[S3 silver]
  GW --> CW[CloudWatch 5xx alarm]
  CW --> SNS[SNS on-call]
  CFN[CloudFormation stack] --> GW
  CFN --> LAM`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is API Gateway in one sentence?">
          <p className="text-slate-300">
            A fully managed front door for REST, HTTP, and WebSocket APIs that handles TLS, auth, throttling,
            routing, and logging, then forwards each request to an integration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="REST vs HTTP vs WebSocket">
          <p className="text-slate-300">
            REST = most features (keys, usage plans, validation, caching, WAF, private); HTTP = cheaper and
            simpler with JWT auth; WebSocket = two-way connections for live updates.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resource, method, stage, deployment">
          <p className="text-slate-300">
            Resource = path; method = verb on the path; deployment = snapshot; stage = live named pointer to
            a deployment that appears in the invoke URL.
          </p>
        </ContentStep>
        <ContentStep number={4} title="What does a Lambda proxy handler return?">
          <p className="text-slate-300">
            An object with integer <code className="text-core-400">statusCode</code>, optional headers, and{' '}
            <code className="text-core-400">body</code> as a string — anything else risks a 502.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Why not upload a 2 GB file through the API?">
          <p className="text-slate-300">
            Payloads are capped at 10 MB and integrations time out in about 29 seconds — issue a presigned S3
            URL instead.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Top DE use cases">
          <p className="text-slate-300">
            Ingestion webhooks, partner push APIs, small data-serving APIs, pipeline control endpoints, and
            presigned upload URLs.
          </p>
        </ContentStep>
        <ContentStep number={7} title="First debug when callers see 5XX?">
          <p className="text-slate-300">
            Check whether Lambda was invoked at all (permission, integration ARN), then Lambda errors and
            timeouts, then the response shape — using stage logs and the <code className="text-core-400">5xx</code>{' '}
            metric in CloudWatch.
          </p>
        </ContentStep>
        <Example title="Beginner API Gateway concept drill" caption="No console required yet — explain aloud">
{`1. Draw: webhook → API Gateway → Lambda → S3 bronze → Glue → S3 silver
2. Which API type for a single Lambda webhook, and which for 20 partners with quotas?
3. Split this URL into API, region, stage, path:
   https://abc123.execute-api.us-east-1.amazonaws.com/prod/ingest/shopify
4. Why must the Lambda body be json.dumps(...) and not a dict?
5. Which principal needs lambda:InvokeFunction, and where is that granted?
6. Why return 202 instead of running Glue inside the request?
7. How does API Gateway fit after Systems Manager in the learning path?`}
        </Example>
        <Callout variant="insight">
          Strong API Gateway beginners ask three questions before creating an API: who calls it and how do
          they authenticate, how big and how bursty is the traffic, and what happens to the data after the
          request returns — a weak answer to the last one is how webhook events get silently lost.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          Acme deploys CloudFormation stack <code className="text-core-400">acme-ingest-prod</code> with HTTP
          API <code className="text-core-400">acme-ingest-api-prod</code> and route{' '}
          <code className="text-core-400">POST /webhooks/shopify</code> integrated with Lambda{' '}
          <code className="text-core-400">acme-shopify-webhook</code>. Shopify sends an order-created event
          with an <code className="text-core-400">X-Shopify-Hmac-Sha256</code> header. The Lambda reads the
          webhook secret from Secrets Manager (<code className="text-core-400">acme/prod/shopify/webhook-secret</code>,
          cached between invocations), recomputes the HMAC over the raw body, and returns 401 if it does not
          match. Valid events are written to{' '}
          <code className="text-core-400">s3://acme-lake-prod/bronze/shopify/dt=2026-09-30/</code> keyed by
          the Shopify webhook ID, so retries overwrite instead of duplicating, and the Lambda returns a 2xx
          within milliseconds. An hourly Glue job turns bronze JSON into silver Parquet. A CloudWatch alarm
          on the API&apos;s <code className="text-core-400">5xx</code> metric notifies on-call through SNS —
          the night a bad deploy broke the handler, the alarm fired within minutes and Shopify&apos;s
          automatic retries refilled the gap after rollback.
        </p>
        <ContentStep number={1} title="Edge tier — API Gateway">
          <p className="text-slate-300">HTTPS endpoint, route, throttling, access logs — no servers.</p>
        </ContentStep>
        <ContentStep number={2} title="Validation tier — Lambda plus Secrets Manager">
          <p className="text-slate-300">Signature check with a rotated secret; bad requests stop here.</p>
        </ContentStep>
        <ContentStep number={3} title="Landing tier — S3 bronze">
          <p className="text-slate-300">Raw JSON, partitioned by date, idempotent keys.</p>
        </ContentStep>
        <ContentStep number={4} title="Processing and ops tier — Glue and CloudWatch">
          <p className="text-slate-300">Batch transforms later; alarms watch the front door.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The intermediate API Gateway lessons go hands-on with topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Authorization">
          <p className="text-slate-300">
            IAM signatures for internal callers, Cognito and JWT authorizers for apps, and Lambda authorizers
            for custom partner tokens — who may call which route.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Throttling, usage plans, and API keys">
          <p className="text-slate-300">
            Account, stage, and route limits; per-partner quotas; and handling 429 responses gracefully.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Request validation and mapping">
          <p className="text-slate-300">
            JSON schema models that reject bad payloads before Lambda runs, and mapping templates that
            reshape requests.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Direct service integrations">
          <p className="text-slate-300">
            Send requests straight to SQS, Kinesis, S3, DynamoDB, or Step Functions — no Lambda in the path.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          API Gateway connects the platform you built to the outside world: IAM and Secrets Manager guard it,
          Lambda and SQS absorb requests, S3 and Glue store and transform the data, and CloudWatch and
          CloudTrail watch it all. The intermediate module assumes you can draw the webhook → buffer → bronze
          path and explain the Lambda proxy contract from memory.
        </p>
        <Callout variant="tip" title="Before your first prod webhook endpoint">
          Replay a captured webhook against the dev stage twice and confirm one object in bronze, then send a
          tampered payload and confirm a 401 — teams that skip this discover gaps during a partner&apos;s
          busiest day.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: thin HTTPS door, deliberate API type, clear routes and stages, correct Lambda proxy contract, scoped permissions.',
          'Self-check: definition, REST vs HTTP vs WebSocket, resource/method/stage/deployment, response shape, payload limits, 5XX debug order.',
          'End-to-end: Shopify webhook → HTTP API → Lambda signature check with Secrets Manager → S3 bronze → Glue; CloudWatch alarm on 5xx.',
          'Next in the API Gateway track: authorization, throttling and usage plans, validation and mapping, direct service integrations.',
        ]}
      />
    </LessonArticle>
  )
}
