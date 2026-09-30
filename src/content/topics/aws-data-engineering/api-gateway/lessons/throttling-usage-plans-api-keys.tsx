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

export function ThrottlingUsagePlansApiKeys() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One partner backfill should not take down everyone else">
        A partner replays six months of webhooks at 3,000 requests per second. Without limits, that flood fans
        out into Lambda, exhausts concurrency, and opens hundreds of connections to the RDS metadata database.
        API Gateway throttling stops the flood at the front door with{' '}
        <code className="text-core-400">429 Too Many Requests</code> — and usage plans give each partner its own
        lane.
      </Callout>

      <Definition term="Token bucket throttling">
        <p>
          API Gateway limits traffic with a token bucket. The <strong className="text-white">rate</strong> is how
          many tokens refill per second (steady-state requests per second); the{' '}
          <strong className="text-white">burst</strong> is the bucket size — how many requests can arrive at once
          before the bucket empties. Each request takes a token; when none are left, the request is rejected with
          429 and never reaches the integration.
        </p>
      </Definition>

      <LessonSection title="The layers of limits">
        <ContentStep number={1} title="Account level per Region">
          <p className="text-slate-300">
            By default, each account gets about 10,000 requests per second with a burst of 5,000, shared across
            all REST, HTTP, and WebSocket APIs in that Region. The rate is adjustable through Service Quotas; the
            burst is set by AWS. Verify current numbers in the quotas page for your Region before capacity
            planning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stage and method level">
          <p className="text-slate-300">
            On a stage you set default rate and burst for every method, then override individual methods — for
            example, {'POST /ingest/{source}'} at 500 rps while <code className="text-core-400">GET /health</code>{' '}
            stays at the stage default. HTTP APIs support stage defaults and per-route overrides too.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Per client with usage plans (REST)">
          <p className="text-slate-300">
            A usage plan attaches rate, burst, and a quota (requests per day, week, or month) to a set of API
            keys and stages. Partner Globex gets 100 rps and 5 million requests per month; a small partner gets 10
            rps. Requests without a valid key are rejected with 403 when the method requires one.
          </p>
        </ContentStep>
        <Flowchart
          title="Which limit applies first"
          chart={`flowchart TB
  REQ[Partner request]
  KEY[Usage plan key limit and quota]
  METH[Method throttle]
  STG[Stage default throttle]
  ACC[Account Region limit]
  INT[Integration SQS or Lambda]
  R429[429 Too Many Requests]
  REQ --> KEY
  KEY -->|tokens left| METH
  METH -->|tokens left| STG
  STG -->|tokens left| ACC
  ACC -->|tokens left| INT
  KEY -->|empty| R429
  METH -->|empty| R429
  ACC -->|empty| R429`}
        />
      </LessonSection>

      <LessonSection title="Usage plans and API keys in practice">
        <ContentStep number={1} title="One key per partner">
          <p className="text-slate-300">
            Create a key per partner, never a shared one — you can revoke Globex without touching Initech, and
            CloudWatch usage reports show who is consuming what. Distribute keys through a secure channel and
            store your copy in Secrets Manager.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keys identify, authorizers authenticate">
          <p className="text-slate-300">
            The key travels in the <code className="text-core-400">x-api-key</code> header. It meters and
            throttles; it does not prove identity. Keep a Lambda or IAM authorizer in front. A Lambda authorizer
            can even return the key through <code className="text-core-400">usageIdentifierKey</code> so partners
            never handle it directly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Quotas are best effort">
          <p className="text-slate-300">
            AWS documents usage plan throttles and quotas as best-effort targets, not hard billing caps. Use them
            to share capacity fairly; use AWS Budgets, WAF rate rules, and downstream limits for true protection.
          </p>
        </ContentStep>
        <Example title="Usage plan for a gold partner" caption="AWS CLI — create plan, then attach the partner key">
{`aws apigateway create-usage-plan \\
  --name partner-gold \\
  --api-stages apiId=a1b2c3d4e5,stage=prod \\
  --throttle rateLimit=100,burstLimit=200 \\
  --quota limit=5000000,period=MONTH

aws apigateway create-usage-plan-key \\
  --usage-plan-id up1234 \\
  --key-id key-globex-prod \\
  --key-type API_KEY`}
        </Example>
      </LessonSection>

      <LessonSection title="429s, retries, and protecting downstream">
        <ContentStep number={1} title="Clients retry with backoff">
          <p className="text-slate-300">
            A 429 means slow down, not give up. Partner SDKs should retry with exponential backoff and jitter —
            wait 200 ms, 400 ms, 800 ms with randomness — and cap attempts. Publish this in your partner
            integration guide along with the idempotency key they must send so retries do not duplicate records.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Size throttles to the weakest link">
          <p className="text-slate-300">
            If the Lambda behind the API has reserved concurrency of 50 and each call takes 200 ms, it handles
            about 250 rps. Throttle the method below that. If the backend opens RDS connections, throttle to what
            the database and RDS Proxy can absorb. Better still, put SQS behind the API so bursts queue instead of
            failing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Throttling as cost control">
          <p className="text-slate-300">
            Every accepted request can trigger Lambda, Firehose, and S3 PUT charges. A misbehaving client at
            unlimited rate becomes a surprise bill. Method throttles plus a CloudWatch alarm on{' '}
            <code className="text-core-400">Count</code> for <code className="text-core-400">acme-ingest-api-prod</code>{' '}
            notifying <code className="text-core-400">de-alerts-prod</code> catch runaway loops early.
          </p>
        </ContentStep>
        <Example title="Client retry loop" caption="Python sketch for a partner SDK">
{`for attempt in range(6):
    resp = session.post(url, json=event, headers={"Idempotency-Key": event["event_id"]})
    if resp.status_code != 429 and resp.status_code < 500:
        break
    time.sleep(min(10, 0.2 * 2 ** attempt) * random.uniform(0.5, 1.5))`}
        </Example>
        <Callout variant="insight">
          Throttle at the gateway, buffer with SQS, cap concurrency on consumers. Each layer protects the next —
          no single setting has to be perfect.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Token bucket: rate is steady requests per second, burst is how many can arrive at once.',
          'Default account limit is about 10,000 rps with 5,000 burst per Region — adjustable, verify for your account.',
          'Stage and method throttles protect specific routes; usage plans give each API key its own rate and quota (REST).',
          '429 means retry with exponential backoff and jitter — pair retries with idempotency keys.',
          'Set throttles below what Lambda concurrency and databases can absorb; they double as cost control.',
        ]}
      />
    </LessonArticle>
  )
}
