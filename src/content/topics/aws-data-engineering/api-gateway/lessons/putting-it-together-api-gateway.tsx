import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherApiGateway() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="API Gateway for DE — auth, limits, integrations, and ingestion to the lake">
        You covered authorizers, throttling and usage plans, request validation and mapping, direct service
        integrations, ingestion architectures, private APIs and VPC links, custom domains and deployment,
        caching and limits, monitoring, and security layers. This checkpoint ties intermediate and advanced API
        Gateway lessons before <strong className="text-white">Amazon ECS</strong> — the final sub-topic, where
        long-running and container-based workloads live.
      </Callout>

      <Definition term="API Gateway mental model for data engineering">
        <p>
          Amazon API Gateway is the <strong className="text-white">managed front door</strong> for data: it
          authenticates callers (IAM, JWT, Cognito, Lambda authorizers), protects backends (throttles, WAF,
          resource policies), enforces contracts (validators), and hands requests to Lambda, AWS services, or
          private services over VPC links. For ingestion, it should accept fast, buffer durably in SQS or
          Firehose, and let asynchronous consumers land data in S3 bronze — not do heavy processing inline.
        </p>
      </Definition>

      <LessonSection title="API Gateway sub-topic map">
        <Flowchart
          title="API Gateway lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[API Gateway complete path]
  START --> AUTH[Authorization]
  START --> THR[Throttling and usage plans]
  START --> VAL[Validation and mapping]
  START --> DIR[Direct service integrations]
  START --> ING[Ingestion APIs to the lake]
  START --> PRIV[Private APIs and VPC links]
  START --> DOM[Custom domains and deployment]
  START --> CACHE[Caching and performance]
  START --> MON[Monitoring and tracing]
  START --> SEC[Security WAF resource policies]
  AUTH --> ECSNEXT
  THR --> ECSNEXT
  VAL --> ECSNEXT
  DIR --> ECSNEXT
  ING --> ECSNEXT
  PRIV --> ECSNEXT
  DOM --> ECSNEXT
  CACHE --> ECSNEXT
  MON --> ECSNEXT
  SEC --> ECSNEXT
  ECSNEXT[ECS containers next]`}
        />
      </LessonSection>

      <LessonSection title="Full API Gateway checkpoint — can you explain…">
        <ContentStep number={1} title="Authorization">
          <p className="text-slate-300">
            When IAM auth vs JWT vs Cognito vs Lambda authorizer? Token vs request authorizer? Why authorizer
            caching causes surprise 403s? Why API keys are not authorization?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Limits and contracts">
          <p className="text-slate-300">
            Token bucket rate vs burst? Account, stage, method, and usage plan layers? How validators and JSON
            Schema models reject bad payloads before Lambda? What VTL mapping templates add?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integrations">
          <p className="text-slate-300">
            When to call SQS, Kinesis, or Firehose directly instead of through Lambda? Which targets HTTP API
            first-class integrations support? What the execution role needs?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Ingestion architecture">
          <p className="text-slate-300">
            Why return 202 and process asynchronously? How to dedupe partner retries? Where to verify HMAC
            signatures? How presigned URLs handle files above 10 MB?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Networking and deployment">
          <p className="text-slate-300">
            Private REST API vs VPC link — which problem each solves? Regional vs edge certificates? Base path
            versioning, stage variables, and canaries?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations and security">
          <p className="text-slate-300">
            Latency vs IntegrationLatency? 403 vs 429 vs 502 vs 504? Cache TTL and invalidation? Resource
            policies, WAF, mTLS, and least-privilege integration roles?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Authorizer for an internal Glue job?',
                  'IAM auth with SigV4; role gets execute-api:Invoke on the exact method ARN.',
                ],
                [
                  'Authorizer for a partner webhook?',
                  'Lambda request authorizer or in-processor HMAC check, plus API key for the usage plan.',
                ],
                [
                  'Are API keys security?',
                  'No — they identify clients for quotas and throttles; always pair with a real authorizer.',
                ],
                [
                  'What does a 429 mean?',
                  'Throttle or quota hit at key, method, stage, or account level; clients retry with backoff and jitter.',
                ],
                [
                  'How to reject bad payloads cheaply?',
                  'REST request validator with a JSON Schema model — 400 before any integration runs.',
                ],
                [
                  'Why skip Lambda for SQS?',
                  'Direct AWS integration: no cold start or invocation cost; VTL or parameter mapping builds the call.',
                ],
                [
                  'Ingestion API shape?',
                  'Auth, validate, throttle, enqueue to SQS or Firehose, return 202; async consumer lands S3 bronze.',
                ],
                [
                  'Handling partner retries?',
                  'Stable event_id; DynamoDB conditional PutItem with TTL; duplicates are skipped silently.',
                ],
                [
                  'Private API vs VPC link?',
                  'Private API limits who calls in via execute-api endpoint; VPC link lets the API reach private backends.',
                ],
                [
                  'Edge custom domain certificate?',
                  'ACM certificate in us-east-1; regional domains use a cert in the API Region.',
                ],
                [
                  'Result bigger than 10 MB?',
                  'Return a presigned S3 URL, or async job: POST returns job id, GET polls status then download URL.',
                ],
                [
                  '502 vs 504?',
                  '502: backend errored or returned malformed response. 504: integration exceeded its timeout.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for ECS when…">
          You can whiteboard partner webhook → API Gateway (authorizer, validator, usage plan) → SQS → processor
          → S3 bronze, explain 403 vs 429 vs 502 vs 504 from access logs, and choose between a private API and a
          VPC link — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Amazon ECS">
        <p className="text-slate-300">
          Lambda behind API Gateway is perfect for short, bursty request handling — but it caps at 15 minutes,
          limits deployment package size, and bills per invocation. Long-running ETL, jobs with heavy custom
          dependencies (JDBC drivers, native libraries, ML models), and always-on queue workers fit better in
          containers on <strong className="text-white">Amazon ECS</strong> with Fargate. VPC links let the same
          API Gateway front door route to ECS services in private subnets.
        </p>
        <Flowchart
          title="After API Gateway — course thread"
          chart={`flowchart LR
  API[API Gateway checkpoint]
  LAM[Lambda short requests]
  SQS[SQS buffer]
  ECS[ECS Fargate workers]
  SVC[ECS data service]
  S3[(S3 lake)]
  API --> LAM
  API --> SQS
  SQS --> ECS
  API -->|VPC link| SVC
  LAM --> S3
  ECS --> S3`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding a new partner (auth, usage plan, IP allow-list), debugging a
          spike of 5XX errors (access logs, IntegrationLatency), or deciding whether a new endpoint needs Lambda,
          a direct integration, or an ECS service behind a VPC link.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'API Gateway: managed front door — authorize, throttle, validate, then integrate with Lambda, AWS services, or VPC backends.',
          'Intermediate: authorizers, throttling and usage plans, validation and VTL mapping, direct service integrations.',
          'Advanced: async ingestion to S3 bronze, private APIs and VPC links, domains and canaries, caching, monitoring, security layers.',
          'Ingestion rule: accept fast with 202, buffer in SQS or Firehose, dedupe by event id, presign large uploads.',
          'Next sub-topic: ECS — containers for long-running ETL, custom dependencies, and always-on workers behind VPC links.',
        ]}
      />
    </LessonArticle>
  )
}
