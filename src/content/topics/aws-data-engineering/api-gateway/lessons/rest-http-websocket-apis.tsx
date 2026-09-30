import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RestHttpWebsocketApis() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One service, three kinds of API">
        When you click &quot;Create API&quot; in the API Gateway console, the first decision is the API
        type: <strong className="text-white">REST API</strong>,{' '}
        <strong className="text-white">HTTP API</strong>, or{' '}
        <strong className="text-white">WebSocket API</strong>. The choice decides your price, your latency,
        and which features exist at all — and you cannot flip an existing API from one type to another. A few
        minutes of thought here saves a rebuild later.
      </Callout>

      <Definition term="API types in API Gateway">
        <p>
          <strong className="text-white">REST APIs</strong> (the original, sometimes called v1) and{' '}
          <strong className="text-white">HTTP APIs</strong> (the newer, leaner v2) both serve classic
          request-response HTTP traffic. <strong className="text-white">WebSocket APIs</strong> keep a
          long-lived, two-way connection open so the server can push messages to connected clients. REST
          APIs have the most features; HTTP APIs trade features for lower cost and latency.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Feature</th>
                <th className="px-4 py-3">REST API</th>
                <th className="px-4 py-3">HTTP API</th>
                <th className="px-4 py-3">WebSocket API</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Traffic style', 'Request-response', 'Request-response', 'Two-way, persistent connection'],
                ['Relative price', 'Highest per million requests', 'Lowest — a fraction of REST', 'Per message plus connection minutes'],
                ['API keys and usage plans', 'Yes', 'No', 'No'],
                ['Request validation', 'Yes — JSON schema models', 'No', 'Yes — route models'],
                ['Body mapping templates', 'Yes — VTL templates', 'No — parameter mapping only', 'Yes'],
                ['Response caching', 'Yes — per stage', 'No', 'No'],
                ['AWS WAF', 'Yes', 'No — put CloudFront in front', 'No'],
                ['Endpoint types', 'Regional, edge-optimized, private', 'Regional only', 'Regional only'],
                ['Resource policies', 'Yes', 'No', 'No'],
                ['JWT authorizer', 'No — use Cognito or a Lambda authorizer', 'Yes — native', 'No — Lambda authorizer'],
                ['AWS service integrations', 'Almost any AWS API via mapping templates', 'Selected first-class ones such as SQS, EventBridge, Kinesis, Step Functions', 'Yes'],
                ['Deployments', 'Explicit deploy to a stage', 'Automatic deploys optional', 'Explicit deploy to a stage'],
              ].map(([feature, rest, http, ws]) => (
                <tr key={feature} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{feature}</td>
                  <td className="px-4 py-3">{rest}</td>
                  <td className="px-4 py-3">{http}</td>
                  <td className="px-4 py-3">{ws}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          AWS narrows the gap between REST and HTTP APIs over time. Before committing, check the current
          &quot;Choose between REST APIs and HTTP APIs&quot; page in the API Gateway developer guide — the
          table above reflects the common, long-standing differences.
        </Callout>
      </LessonSection>

      <LessonSection title="What each type is good at">
        <ContentStep number={1} title="REST API — the full-featured gateway">
          <p className="text-slate-300">
            Choose REST when you need partner API keys with per-customer quotas, JSON schema validation that
            rejects bad payloads before Lambda runs, mapping templates that reshape a request and send it
            straight to an AWS service, response caching, WAF rules, or a private VPC-only endpoint.
          </p>
        </ContentStep>
        <ContentStep number={2} title="HTTP API — cheap, fast, simple">
          <p className="text-slate-300">
            Choose HTTP when you mainly proxy to Lambda or an HTTP backend with JWT (Cognito, Auth0, Okta),
            IAM, or Lambda authorization. Lower price and latency make it attractive for high-volume
            webhooks where you do the validation in code anyway.
          </p>
        </ContentStep>
        <ContentStep number={3} title="WebSocket API — push updates to clients">
          <p className="text-slate-300">
            Clients connect once; API Gateway assigns a <code className="text-core-400">connectionId</code>{' '}
            and routes messages by route key such as <code className="text-core-400">$connect</code>,{' '}
            <code className="text-core-400">$disconnect</code>, or a custom{' '}
            <code className="text-core-400">subscribe</code> route. Your backend pushes updates to a
            connection ID. DE example: a live pipeline status dashboard that shows Glue job progress
            without the browser polling every few seconds.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <p className="text-slate-300">
          Walk through these questions in order. The first &quot;yes&quot; usually decides it.
        </p>
        <Flowchart
          title="Which API type should I pick"
          chart={`flowchart TD
  START[New API for the data platform] --> Q1{Server must push to clients}
  Q1 -->|yes| WS[WebSocket API]
  Q1 -->|no| Q2{Need API keys usage plans WAF or private endpoint}
  Q2 -->|yes| REST[REST API]
  Q2 -->|no| Q3{Need schema validation caching or VTL mapping}
  Q3 -->|yes| REST
  Q3 -->|no| HTTP[HTTP API]`}
        />
        <Callout variant="tip" title="DE default picks">
          For a simple webhook or data-serving endpoint backed by Lambda, start with an{' '}
          <strong className="text-white">HTTP API</strong>. Pick a{' '}
          <strong className="text-white">REST API</strong> when you need direct AWS service integrations
          with mapping templates (for example, writing straight to Kinesis or DynamoDB without Lambda),
          partner usage plans with API keys, request validation, or WAF protection on the API itself.
        </Callout>
      </LessonSection>

      <LessonSection title="Common DE scenarios">
        <ContentStep number={1} title="Shopify webhook into the lake">
          <p className="text-slate-300">
            One route, Lambda verifies the HMAC signature and writes to S3 — HTTP API. Cheapest per request
            and the signature check happens in code.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Twenty partners pushing daily data">
          <p className="text-slate-300">
            Each partner gets an API key and a usage plan capping requests per day; payloads are validated
            against a JSON schema — REST API.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Internal backfill trigger">
          <p className="text-slate-300">
            Only callers inside the corporate VPC should reach it — REST API with a private endpoint and a
            resource policy.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: &quot;HTTP API by default for cost and simplicity, REST API when I need API
          management or direct service integrations, WebSocket only for real-time server push.&quot; That
          one sentence shows you know the trade-off, not just the names.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'REST API has the most features: API keys, usage plans, validation, VTL mapping, caching, WAF, private endpoints, resource policies.',
          'HTTP API is cheaper and lower latency with native JWT authorizers, but deliberately omits many REST features.',
          'WebSocket API keeps two-way connections with connection IDs and route keys — e.g. live pipeline status dashboards.',
          'DE default: HTTP API for simple Lambda backends; REST API for direct service integrations, partner usage plans, validation, or WAF.',
          'You cannot convert between types later — and feature parity changes, so verify against current AWS docs.',
        ]}
      />
    </LessonArticle>
  )
}
