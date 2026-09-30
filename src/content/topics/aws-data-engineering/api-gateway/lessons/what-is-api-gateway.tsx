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

export function WhatIsApiGateway() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A front door you do not have to build">
        If you wanted to accept webhooks without API Gateway, you would launch EC2 instances, install a web
        server, manage TLS certificates, write auth checks, add rate limiting, put a load balancer in front,
        and patch it all forever. API Gateway replaces that whole stack with a{' '}
        <strong className="text-white">managed service you configure instead of operate</strong> — you
        describe the routes and the backend, and AWS runs the door.
      </Callout>

      <Definition term="Amazon API Gateway">
        <p>
          A fully managed AWS service that lets you create, publish, secure, and monitor{' '}
          <strong className="text-white">HTTP-based APIs (REST and HTTP APIs) and WebSocket APIs</strong> at
          any scale. It accepts client requests, applies security and traffic rules, forwards each request
          to an <strong className="text-white">integration</strong> (Lambda, an AWS service, or an HTTP
          backend), and returns the response to the caller. You pay per request — there are no servers to
          size or patch.
        </p>
      </Definition>

      <LessonSection title="What API Gateway handles for you">
        <ContentStep number={1} title="TLS and a public HTTPS endpoint">
          <p className="text-slate-300">
            Every API gets an HTTPS URL like{' '}
            <code className="text-core-400">https://abc123.execute-api.us-east-1.amazonaws.com</code>{' '}
            out of the box. Certificates and encryption in transit are managed for you; custom domains come
            later.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Authentication and authorization">
          <p className="text-slate-300">
            IAM signatures, Cognito or JWT tokens, or a custom Lambda authorizer decide who may call each
            route — rejected callers never reach your Lambda or your S3 bucket.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Throttling and request validation">
          <p className="text-slate-300">
            Rate and burst limits protect downstream systems; excess traffic gets HTTP{' '}
            <code className="text-core-400">429 Too Many Requests</code>. REST APIs can also reject
            payloads that do not match a JSON schema before any code runs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Routing, logging, and metrics">
          <p className="text-slate-300">
            Requests are routed by path and method to the right integration. Access logs go to CloudWatch
            Logs, and metrics such as <code className="text-core-400">Count</code>,{' '}
            <code className="text-core-400">4XXError</code>, <code className="text-core-400">5XXError</code>,
            and <code className="text-core-400">Latency</code> land in CloudWatch for alarms.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The request lifecycle">
        <p className="text-slate-300">
          Every call follows the same path: the client sends a request, API Gateway checks it, the
          integration does the real work, and the response flows back through API Gateway to the client.
        </p>
        <Flowchart
          title="Request to response"
          chart={`flowchart LR
  C[Client or partner] -->|HTTPS request| GW[API Gateway]
  GW --> AUTH{Authorized and within limits}
  AUTH -->|no| REJ[401 403 or 429]
  AUTH -->|yes| INT[Integration Lambda SQS or HTTP]
  INT --> RESP[Response]
  RESP --> GW2[API Gateway]
  GW2 -->|HTTPS response| C`}
        />
        <Example title="A partner posting an event" caption="curl call and the JSON the integration returns">
{`curl -X POST \\
  https://abc123.execute-api.us-east-1.amazonaws.com/prod/ingest \\
  -H "Content-Type: application/json" \\
  -d '{"source": "partner-a", "event_id": "evt-001", "amount": 42.5}'

# Response from the backend, passed back by API Gateway
HTTP/2 202
{"status": "accepted", "event_id": "evt-001"}`}
        </Example>
        <Callout variant="info" title="Analogy — the hotel front desk">
          API Gateway is the reception desk of a hotel. Guests (clients) never wander into the kitchen or
          housekeeping (your Lambdas and queues). Reception checks ID (authorization), limits how many
          people crowd the desk at once (throttling), and routes each request to the right department
          (integration) — then hands the answer back to the guest.
        </Callout>
      </LessonSection>

      <LessonSection title="Pricing intuition and endpoint types">
        <p className="text-slate-300">
          API Gateway bills mainly <strong className="text-white">per million requests</strong> plus data
          transfer, with optional extras such as REST API caching. HTTP APIs are priced noticeably lower per
          million requests than REST APIs — often a fraction of the cost — which matters for high-volume
          webhooks. Prices vary by region and tier, so always check the current API Gateway pricing page
          before estimating.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Endpoint type</th>
                <th className="px-4 py-3">What it means</th>
                <th className="px-4 py-3">DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Regional', 'Served from one AWS region; clients connect directly. Default for most APIs and the only option for HTTP APIs', 'Ingestion API for partners and apps in the same region as the lake'],
                ['Edge-optimized', 'REST API fronted by a CloudFront distribution managed by AWS to reduce latency for global callers', 'Public data API called by clients around the world'],
                ['Private', 'REST API reachable only from inside your VPC through an interface VPC endpoint', 'Internal pipeline control API used by other teams on the corporate network'],
              ].map(([type, meaning, example]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{meaning}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          For most DE ingestion endpoints, start with a <strong className="text-white">regional</strong> API
          in the same region as your S3 lake. Reach for private APIs when the callers are internal — the
          advanced module covers private APIs and VPC links in depth.
        </Callout>
      </LessonSection>

      <LessonSection title="What API Gateway is not">
        <ContentStep number={1} title="Not a compute or storage layer">
          <p className="text-slate-300">
            It does not transform datasets or store records. Business logic lives in Lambda or containers;
            data lives in S3, DynamoDB, or Redshift.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a bulk file transfer tool">
          <p className="text-slate-300">
            Request payloads are capped (10 MB) and integrations have timeouts measured in seconds. Large
            files go straight to S3 with presigned URLs — a pattern covered later in this sub-topic.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: API Gateway is the managed edge for HTTP traffic — auth, limits, routing, and
          observability. If someone proposes running ETL inside an API request, the right answer is to
          accept, buffer, and process asynchronously.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'API Gateway is a fully managed front door for REST, HTTP, and WebSocket APIs — no servers to run or patch.',
          'It handles TLS, authorization, throttling, validation (REST), routing, logging, and CloudWatch metrics for you.',
          'Every call flows client → API Gateway → integration (Lambda, AWS service, HTTP) → response back through API Gateway.',
          'Billing is mostly per million requests; HTTP APIs cost less than REST APIs — always confirm on the current pricing page.',
          'Endpoint types: regional (default), edge-optimized (REST, global callers), private (REST, VPC only).',
        ]}
      />
    </LessonArticle>
  )
}
