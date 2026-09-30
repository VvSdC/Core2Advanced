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

export function Authorization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="An open ingestion endpoint is an open door into your lake">
        <code className="text-core-400">acme-ingest-api-prod</code> accepts partner files, internal service
        events, and analyst queries. Each caller type proves identity differently: an internal Glue job signs
        with IAM, an analyst web app carries a Cognito token, a partner sends a signed header your own code
        checks. API Gateway runs that check <strong className="text-white">before</strong> any Lambda, SQS, or
        S3 integration is touched — rejected calls cost you almost nothing.
      </Callout>

      <Definition term="Authorizer">
        <p>
          The piece of API Gateway that decides whether a request may reach the integration. Options are{' '}
          <strong className="text-white">IAM authorization</strong> (SigV4-signed requests checked against IAM
          policies), <strong className="text-white">Cognito user pool authorizers</strong> (REST APIs),{' '}
          <strong className="text-white">JWT authorizers</strong> (HTTP APIs, any OIDC issuer), and{' '}
          <strong className="text-white">Lambda authorizers</strong> (your code decides). A failed check returns{' '}
          <code className="text-core-400">401 Unauthorized</code> or <code className="text-core-400">403 Forbidden</code>{' '}
          and the backend never runs.
        </p>
      </Definition>

      <LessonSection title="IAM authorization — service to service">
        <ContentStep number={1} title="SigV4 signing">
          <p className="text-slate-300">
            Set the method authorization to <code className="text-core-400">AWS_IAM</code>. Callers sign every
            request with Signature Version 4 using their role credentials — the AWS SDKs and botocore&apos;s{' '}
            <code className="text-core-400">SigV4Auth</code> helper do this for you. No
            tokens to issue or rotate: a Lambda, Glue job, or ECS task already has a role.
          </p>
        </ContentStep>
        <ContentStep number={2} title="execute-api:Invoke policies">
          <p className="text-slate-300">
            The caller&apos;s role needs <code className="text-core-400">execute-api:Invoke</code> on the
            method ARN. The ARN encodes API id, stage, verb, and path, so you can grant a pipeline role{' '}
            <code className="text-core-400">POST</code> on {'/ingest/{source}'} in prod only — nothing else. For
            cross-account callers, add a resource policy on the API that allows the other account&apos;s role.
          </p>
        </ContentStep>
        <Example title="Identity policy for an internal producer" caption="Allow POST to the ingest path on the prod stage only">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": "execute-api:Invoke",
      "Resource": "arn:aws:execute-api:us-east-1:111122223333:a1b2c3d4e5/prod/POST/ingest/*"
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Token-based authorizers — Cognito and JWT">
        <ContentStep number={1} title="Cognito user pool authorizer on REST APIs">
          <p className="text-slate-300">
            An analyst app signs users into a Cognito user pool and sends the ID or access token in the{' '}
            <code className="text-core-400">Authorization</code> header. API Gateway validates signature, expiry,
            and issuer, and can require OAuth scopes such as <code className="text-core-400">datasets/read</code>.
            Claims like <code className="text-core-400">cognito:groups</code> reach Lambda in the request context
            for row-level decisions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="JWT authorizer on HTTP APIs">
          <p className="text-slate-300">
            HTTP APIs use a generic JWT authorizer: configure the issuer URL and audience, and any OIDC provider
            works — Cognito, Okta, Entra ID, Auth0. Routes can require specific scopes. It is cheaper and simpler
            than a Lambda authorizer when your identity provider already issues standard JWTs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lambda authorizers — custom logic">
        <ContentStep number={1} title="Token vs request authorizers">
          <p className="text-slate-300">
            A <strong className="text-white">token</strong> authorizer (REST only) receives a single header value,
            typically a bearer token. A <strong className="text-white">request</strong> authorizer receives headers,
            query strings, path, stage variables, and context — needed when a partner sends{' '}
            <code className="text-core-400">X-Partner-Id</code> plus a signature header together.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What it returns">
          <p className="text-slate-300">
            REST authorizers return an IAM policy document (Allow or Deny on{' '}
            <code className="text-core-400">execute-api:Invoke</code>) plus an optional{' '}
            <code className="text-core-400">context</code> map passed to the backend. HTTP APIs with payload
            format 2.0 can return a <strong className="text-white">simple response</strong>:{' '}
            <code className="text-core-400">isAuthorized</code> true or false plus context.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Caching the decision">
          <p className="text-slate-300">
            Results are cached by identity source for a TTL (default 300 seconds, up to 3600). Caching saves
            Lambda invocations, but a cached policy is reused for other methods — return a policy covering all
            methods the caller may use, or a wildcard resource, or you will see confusing 403s on the second path.
          </p>
        </ContentStep>
        <Example title="REST Lambda authorizer response" caption="partner-authorizer allows one partner onto the ingest path">
{`{
  "principalId": "partner-globex",
  "policyDocument": {
    "Version": "2012-10-17",
    "Statement": [
      {
        "Action": "execute-api:Invoke",
        "Effect": "Allow",
        "Resource": "arn:aws:execute-api:us-east-1:111122223333:a1b2c3d4e5/prod/POST/ingest/*"
      }
    ]
  },
  "context": { "partnerId": "globex", "tier": "gold" }
}`}
        </Example>
        <Callout variant="info" title="API keys are not authorization">
          API keys identify a client for usage plans and quotas. They are sent in plain headers, often shared, and
          never rotated by default. Always pair them with a real authorizer — IAM, JWT, Cognito, or Lambda.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing an authorizer">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">API types</th>
                <th className="px-4 py-3">Best DE fit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['IAM (SigV4)', 'REST, HTTP, WebSocket', 'Internal services and cross-account pipelines with roles'],
                ['Cognito user pool', 'REST', 'Analyst or ops web apps with signed-in users'],
                ['JWT authorizer', 'HTTP', 'Any OIDC provider — corporate SSO for data portals'],
                ['Lambda authorizer', 'REST, HTTP, WebSocket', 'Partner HMAC signatures, custom tokens, tenant lookups'],
                ['API key only', 'REST', 'Never alone — metering and quotas, not identity'],
              ].map(([option, types, fit]) => (
                <tr key={option} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{option}</td>
                  <td className="px-4 py-3">{types}</td>
                  <td className="px-4 py-3">{fit}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Who is calling acme-ingest-api-prod"
          chart={`flowchart TB
  Q[Who is the caller]
  Q -->|AWS workload with a role| IAM[IAM auth SigV4]
  Q -->|Human in a web app| U[Which API type]
  U -->|REST| COG[Cognito authorizer]
  U -->|HTTP| JWT[JWT authorizer]
  Q -->|External partner| P[Lambda request authorizer]
  P --> KEY[Plus API key for usage plan]
  IAM --> INT[Integration runs]
  COG --> INT
  JWT --> INT
  KEY --> INT`}
        />
        <Callout variant="tip">
          Partner ingestion: Lambda request authorizer verifying an HMAC or partner token, plus an API key for
          quotas. Internal service: IAM. Analyst app: Cognito or JWT with scopes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'IAM auth with SigV4 and execute-api:Invoke is the default for AWS workloads — no tokens to manage.',
          'Cognito authorizers (REST) and JWT authorizers (HTTP) validate user tokens and scopes without custom code.',
          'Lambda authorizers handle partner-specific logic; token type reads one header, request type reads everything.',
          'Authorizer caching (default 300 s) saves cost but reuses the policy — scope it to all allowed methods.',
          'API keys meter and throttle clients; they are never a substitute for authorization.',
        ]}
      />
    </LessonArticle>
  )
}
