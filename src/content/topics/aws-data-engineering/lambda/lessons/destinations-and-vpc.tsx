import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DestinationsAndVpc() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Success and failure routing — plus private network access">
        Lambda can forward invocation results to other services via{' '}
        <strong className="text-white">Destinations</strong>, and it can run inside your{' '}
        <strong className="text-white">VPC</strong> to reach private databases. Both features shape how
        event-driven ETL chains report outcomes and how you connect to RDS without public endpoints.
      </Callout>

      <Definition term="Lambda Destinations">
        <p>
          <strong className="text-white">Destinations</strong> route the result of an asynchronous
          invocation (or Event Source Mapping failure) to SNS, SQS, Lambda, or EventBridge — separate
          targets for <strong className="text-white">OnSuccess</strong> and{' '}
          <strong className="text-white">OnFailure</strong>. The destination receives metadata (request
          context, response or error payload) without embedding callback logic in every handler.
        </p>
      </Definition>

      <Definition term="VPC Lambda">
        <p>
          Attaching a Lambda to VPC subnets places its ENIs in your network so it can reach private IP
          resources — RDS PostgreSQL metadata DB, Redshift in VPC, ElastiCache, internal REST APIs. Lambda
          still runs on AWS-managed infrastructure; you configure subnets, security groups, and (usually)
          NAT gateway or VPC endpoints for AWS API calls like S3 and Glue.
        </p>
      </Definition>

      <LessonSection title="Destinations for DE orchestration">
        <ContentStep number={1} title="OnSuccess → Step Functions">
          <p className="text-slate-300">
            Ingest Lambda completes validation asynchronously → OnSuccess destination triggers Step Functions
            execution with the response payload. Decouples &quot;file OK&quot; notification from the
            handler&apos;s return path — cleaner than boto3{' '}
            <span className="font-mono text-sm">start_execution</span> inside every success branch.
          </p>
        </ContentStep>
        <ContentStep number={2} title="OnFailure → ops queue">
          <p className="text-slate-300">
            Failed async invoke after retries → SQS <span className="font-mono text-sm">ingest-failures</span>{' '}
            with original event + error message. Separate from DLQ (which holds the triggering event) —
            destinations carry richer execution context for triage dashboards.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Destinations vs DLQ">
          <p className="text-slate-300">
            DLQ stores the event that failed processing. Destinations fire on success or failure with
            structured callback payloads — use both: DLQ for replay, destination for alerting and
            downstream chaining. ESM supports OnFailure destination similarly.
          </p>
        </ContentStep>
        <Flowchart
          title="Destinations in ingest flow"
          chart={`flowchart LR
  S3[S3 async invoke]
  S3 --> L[Ingest Lambda]
  L -->|success| DEST_OK[OnSuccess to EventBridge]
  L -->|fail after retries| DEST_FAIL[OnFailure to SQS ops]
  DEST_OK --> SF[Step Functions start Glue chain]
  DEST_FAIL --> OPS[On-call replay dashboard]`}
        />
      </LessonSection>

      <LessonSection title="VPC Lambda — when and how">
        <ContentStep number={1} title="When DE needs VPC">
          <p className="text-slate-300">
            Lambda must INSERT pipeline run metadata into private RDS. Lambda reads from Redshift via
            private cluster endpoint. No public IP on the database — VPC attachment is required. S3-only
            pipelines rarely need VPC if using IAM and public S3 endpoints.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Networking checklist">
          <p className="text-slate-300">
            Place Lambda in private subnets; security group allows egress to RDS SG on 5432. Add S3 and
            Glue <strong className="text-white">VPC gateway/interface endpoints</strong> to avoid NAT
            charges and improve reliability for boto3 calls. Without endpoints, NAT must route S3/Glue
            traffic.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cold start tradeoff">
          <p className="text-slate-300">
            ENI creation on cold start adds significant latency (often 5–15+ seconds). Mitigations: minimize
            VPC functions, use provisioned concurrency on critical ones, RDS Proxy for connection pooling,
            or move heavy DB work to Glue/EC2 and keep Lambda S3-only at the edge.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Hyperplane (ENI improvement)">
          <p className="text-slate-300">
            AWS improved VPC Lambda networking over time — still slower than non-VPC for first invoke.
            Always measure InitDuration after VPC enablement; do not assume &quot;serverless is always
            fast.&quot;
          </p>
        </ContentStep>
        <Callout variant="insight">
          Default pattern: Lambda in no VPC for S3 → validate → Glue. Add VPC only for the subset of
          functions that truly touch private IPs — split monolithic handlers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Destinations route async invoke success/failure to SNS, SQS, Lambda, or EventBridge — decouple callbacks from handler code.',
          'Use OnSuccess for orchestration triggers (Step Functions); OnFailure for ops queues alongside DLQ replay.',
          'VPC Lambda reaches private RDS/Redshift — requires subnets, security groups, and S3/Glue VPC endpoints or NAT.',
          'VPC attachment increases cold start latency — split S3-edge (no VPC) from DB-touching functions (VPC).',
          'Measure InitDuration after VPC changes; provisioned concurrency only if sync latency SLA demands it.',
        ]}
      />
    </LessonArticle>
  )
}
