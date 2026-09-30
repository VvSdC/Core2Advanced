import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithApiGateway() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why API Gateway after Systems Manager in the DE path">
        Systems Manager showed you how to operate the hosts, parameters, and runbooks behind a data platform.
        Until now, data mostly arrived in ways <em>you</em> controlled: vendors dropped files in S3,
        EventBridge schedules kicked off Glue, and internal services emitted events. Real platforms also
        face the opposite direction:{' '}
        <strong className="text-white">partners, mobile apps, SaaS webhooks, and IoT devices push data to
        you over HTTPS — and analysts and apps want data served back through an API, not a bucket
        listing.</strong>{' '}
        In AWS, the managed front door for both directions is{' '}
        <strong className="text-white">Amazon API Gateway</strong>.
      </Callout>

      <Definition term="What is API Gateway in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon API Gateway</strong> is a fully managed service for creating,
          securing, and running HTTP, REST, and WebSocket APIs. For data engineering, it is the{' '}
          <strong className="text-white">HTTPS entry point into the pipeline</strong> — it receives a
          webhook or partner push, checks who is calling, applies rate limits, and hands the request to
          Lambda, SQS, or Step Functions so the data can land in S3 bronze.
        </p>
        <p className="mt-2 text-slate-300">
          Think of API Gateway as{' '}
          <span className="text-core-400">the loading dock for data that arrives by HTTP — it signs for the
          delivery, checks the paperwork, and passes the package to the right team inside</span>.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build API Gateway in layers so authorizers, mapping templates, and VPC links do not overwhelm
          you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="What API Gateway is and the three API types">
          <p className="text-slate-300">
            Learn what the managed front door handles for you, then compare REST, HTTP, and WebSocket APIs
            so you can pick the right type for an ingestion endpoint or a data-serving API.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Resources, methods, and stages">
          <p className="text-slate-300">
            Paths like <code className="text-core-400">/ingest</code>, verbs like{' '}
            <code className="text-core-400">POST</code>, and stages like{' '}
            <code className="text-core-400">prod</code> — enough to read an invoke URL and deploy changes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="API Gateway plus Lambda">
          <p className="text-slate-300">
            The most common backend: the proxy integration event shape in, the response shape out, and
            the errors every beginner hits.
          </p>
        </ContentStep>
        <ContentStep number={4} title="DE use cases, then the checkpoint">
          <p className="text-slate-300">
            Webhooks, partner push APIs, data serving, and pipeline control endpoints — followed by
            authorization, throttling, validation, and direct service integrations in the intermediate
            module.
          </p>
        </ContentStep>
        <Flowchart
          title="API Gateway sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is API Gateway]
  B --> C[REST HTTP WebSocket]
  C --> D[Resources methods stages]
  D --> E[API Gateway plus Lambda]
  E --> F[API Gateway for DE]
  F --> G[Beginner checkpoint]
  G --> H[Auth throttling integrations next]`}
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
                ['API', 'A contract for how callers talk to your system over HTTP — which URLs exist, what they accept, what they return'],
                ['Endpoint', 'The base HTTPS address callers hit, e.g. https://abc123.execute-api.us-east-1.amazonaws.com'],
                ['Resource', 'A path in the API, e.g. /ingest or /datasets/orders — organised as a tree'],
                ['Method', 'An HTTP verb on a resource — GET to read, POST to send data, PUT to replace, DELETE to remove'],
                ['Integration', 'The backend a method forwards to — Lambda, SQS, Step Functions, an HTTP service, or a mock'],
                ['Stage', 'A named, live version of the API such as dev or prod — part of the invoke URL'],
                ['Deployment', 'A snapshot of the API configuration that you publish to a stage (REST APIs need explicit deploys)'],
                ['Authorizer', 'The component that decides whether a caller is allowed — IAM, Cognito or JWT, or a custom Lambda'],
                ['Throttling', 'Rate and burst limits that protect your backend — excess requests get HTTP 429'],
                ['Usage plan', 'A REST API feature that assigns per-customer rate limits and quotas, tied to API keys'],
                ['API key', 'A string a partner sends in the x-api-key header to identify itself for usage plans — identification, not strong auth'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put team, purpose, and environment in the API name:{' '}
          <code className="text-core-400">acme-ingest-api-prod</code> with stage{' '}
          <code className="text-core-400">prod</code>, or{' '}
          <code className="text-core-400">acme-data-serving-api-dev</code> with stage{' '}
          <code className="text-core-400">dev</code>. When a partner reports failing webhooks at 2 a.m.,
          on-call should find the right API in seconds — not guess between three APIs called
          &quot;test&quot;.
        </Callout>
      </LessonSection>

      <LessonSection title="How API Gateway fits in a data platform">
        <p className="text-slate-300">
          API Gateway sits at the edge. Inbound, a partner webhook hits a <code className="text-core-400">POST</code>{' '}
          route; API Gateway authenticates and throttles it, then forwards to Lambda (validate and write) or
          straight to SQS (buffer first) so records land in S3 bronze for Glue. Outbound, an analyst app
          calls a <code className="text-core-400">GET</code> route; Lambda looks up a small answer in
          DynamoDB or reads precomputed Athena results and returns JSON.
        </p>
        <Flowchart
          title="Ingestion and serving through API Gateway"
          chart={`flowchart LR
  P[Partner webhook] --> APIGW[API Gateway]
  APIGW --> L1[Lambda validator]
  APIGW --> Q[SQS buffer]
  L1 --> B[S3 bronze]
  Q --> L2[Lambda consumer]
  L2 --> B
  B --> G[Glue ETL]
  APP[Analyst app] --> APIGW2[API Gateway]
  APIGW2 --> L3[Lambda reader]
  L3 --> DDB[DynamoDB lookups]
  L3 --> ATH[Athena results]`}
        />
        <Callout variant="insight">
          API Gateway is not where data is stored or transformed. It is a thin, well-guarded door. Keep the
          request fast — validate, buffer, acknowledge — and let S3, SQS, Glue, and Step Functions do the
          heavy lifting behind it.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about API Gateway">
        <ContentStep number={1} title="Push-based sources are growing">
          <p className="text-slate-300">
            Stripe, Shopify, GitHub, and many IoT platforms send events by webhook — they will not drop
            files in your bucket. Without an HTTPS endpoint you simply miss that data.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security and limits without servers">
          <p className="text-slate-300">
            TLS, authorization, throttling, and access logging come built in. You do not run an EC2 fleet
            behind a load balancer just to accept a few thousand JSON posts per minute.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Serving data and controlling pipelines">
          <p className="text-slate-300">
            Small data APIs over DynamoDB, and internal endpoints such as{' '}
            <code className="text-core-400">POST /backfill</code> that start a Step Functions execution,
            give other teams a safe, audited way to use the platform without console access.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'API Gateway follows Systems Manager — you have covered files, schedules, and events; now data arrives and leaves over HTTPS.',
          'Roadmap: what it is → REST vs HTTP vs WebSocket → resources, methods, stages → Lambda proxy → DE use cases → checkpoint.',
          'Core vocabulary: API, endpoint, resource, method, integration, stage, deployment, authorizer, throttling, usage plan, API key.',
          'Typical DE pattern: webhook → API Gateway → Lambda or SQS → S3 bronze → Glue; serving via API Gateway → Lambda → DynamoDB or Athena results.',
          'Keep the API thin: validate, buffer, and acknowledge quickly — never do heavy ETL inside the request.',
        ]}
      />
    </LessonArticle>
  )
}
