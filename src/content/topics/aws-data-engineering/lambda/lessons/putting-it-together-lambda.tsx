import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda is the serverless compute layer of your lake">
        You covered invocation models, triggers, ESM, layers, concurrency, packaging, VPC, destinations,
        service integrations, and event-driven ETL patterns. This checkpoint ties intermediate and advanced
        Lambda lessons together before CloudWatch — metrics, logs, and alarms for everything you just built.
      </Callout>

      <Definition term="Lambda mental model for data engineering">
        <p>
          Lambda is the <strong className="text-white">short-lived, event-driven edge</strong> of your
          pipeline: react to S3/SQS/EventBridge, validate and route, start Glue/Step Functions, ledger
          state in DynamoDB — stay under 15 minutes, design idempotent handlers, scope IAM by prefix,
          buffer bursts with SQS, and hand heavy transform to Glue or EC2.
        </p>
      </Definition>

      <LessonSection title="Lambda sub-topic map">
        <Flowchart
          title="Lambda lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Lambda complete path]
  START --> SYNC[Sync vs async invocation]
  START --> ESM[Event Source Mapping]
  START --> TRIG[Common triggers S3 EventBridge SQS]
  START --> LTC[Layers tmp concurrency]
  START --> VER[Versions aliases DLQ]
  START --> COLD[Cold start and concurrency]
  START --> DEST[Destinations and VPC]
  START --> DATA[Lambda with data services]
  START --> PY[Python boto3 logging]
  START --> PKG[Packaging and layers]
  START --> PERF[Performance optimization]
  START --> ETL[Event-driven ETL]
  SYNC --> CWNEXT
  ESM --> CWNEXT
  TRIG --> CWNEXT
  LTC --> CWNEXT
  VER --> CWNEXT
  COLD --> CWNEXT
  DEST --> CWNEXT
  DATA --> CWNEXT
  PY --> CWNEXT
  PKG --> CWNEXT
  PERF --> CWNEXT
  ETL --> CWNEXT
  CWNEXT[CloudWatch — observability next]`}
        />
      </LessonSection>

      <LessonSection title="Full Lambda checkpoint — can you explain…">
        <ContentStep number={1} title="Invocation and triggers">
          <p className="text-slate-300">
            When is S3 → Lambda async vs when does Step Functions need sync invoke? What is the difference
            between S3 direct trigger and S3 → SQS → ESM?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reliability">
          <p className="text-slate-300">
            How do DLQ, destinations, and idempotent S3 writes interact on duplicate delivery? What does
            bisect-on-error do for Kinesis batches?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Concurrency">
          <p className="text-slate-300">
            What happens when 5,000 S3 events hit account concurrency limit? Reserved vs provisioned
            concurrency — when would you pay for provisioned in a DE pipeline?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Packaging and performance">
          <p className="text-slate-300">
            Why build layers on Amazon Linux? Why does increasing memory sometimes reduce total cost?
            When must you switch from Lambda to Glue?
          </p>
        </ContentStep>
        <ContentStep number={5} title="VPC and integrations">
          <p className="text-slate-300">
            Why avoid VPC for S3-only ingest? How does Lambda start Glue and pass job arguments? What is
            the Step Functions role vs Lambda execution role?
          </p>
        </ContentStep>
        <ContentStep number={6} title="End-to-end design">
          <p className="text-slate-300">
            Sketch landing → raw → curated with Lambda, Glue, DynamoDB ledger, and failure paths. Where do
            quarantine prefixes and replay from DLQ fit?
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
                  'Lambda max timeout?',
                  '15 minutes hard limit — hand long transform to Glue/EC2; use Step Functions for orchestration waits.',
                ],
                [
                  'S3 → Lambda vs S3 → SQS → Lambda?',
                  'Direct async push; SQS+ESM buffers bursts, controls concurrency, enables DLQ on queue.',
                ],
                [
                  'Cold start causes?',
                  'New execution environment — package size, layers, VPC ENI setup; InitDuration in logs.',
                ],
                [
                  'Idempotency why?',
                  'At-least-once delivery (S3, SQS, async retries) — deterministic keys, DynamoDB dedupe, Glue bookmarks.',
                ],
                [
                  'Layers purpose?',
                  'Share deps across functions; python/site-packages layout; 250 MB combined unzipped limit.',
                ],
                [
                  'Reserved vs provisioned concurrency?',
                  'Reserved caps/guarantees pool for one function; provisioned pre-warms environments — costs while idle.',
                ],
                [
                  'Lambda vs Glue for CSV → Parquet?',
                  'Lambda for small per-file edge; Glue Spark for large/multi-file/partition-scale transform.',
                ],
                [
                  'VPC Lambda tradeoff?',
                  'Private RDS/Redshift access; slower cold start; need S3/Glue VPC endpoints or NAT.',
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
        <Callout variant="tip" title="Ready for CloudWatch when…">
          You can whiteboard an event-driven ingest pipeline with SQS buffering, explain why a throttled
          Lambda needs reserved concurrency or account limit increase, and describe how you would replay
          DLQ messages after a schema fix — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — CloudWatch">
        <p className="text-slate-300">
          Every Lambda function you deploy emits logs to CloudWatch Logs and metrics (Duration, Errors,
          Throttles, ConcurrentExecutions). Glue jobs, Step Functions, and S3 request metrics live in the
          same observability layer. CloudWatch Alarms on DLQ depth, Lambda error rate, and Glue failure
          metrics close the loop on the pipelines you designed here — turning architecture into operable
          production systems.
        </p>
        <Flowchart
          title="After Lambda — course thread"
          chart={`flowchart LR
  S3[S3 lake storage]
  LAM[Lambda checkpoint]
  CW[CloudWatch logs metrics alarms]
  GLUE[Glue ETL deep dive]
  ORCH[Step Functions orchestration]
  WH[Athena Redshift serve]
  S3 --> LAM
  LAM --> CW
  CW --> GLUE
  GLUE --> ORCH
  ORCH --> WH`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding a new event source, tuning landing burst capacity, or
          debugging duplicate curated partitions — the answers usually trace to invocation type, idempotency,
          or concurrency limits covered in these lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda DE role: event edge — validate S3 landing, ledger state, orchestrate Glue/Step Functions, stay under 15 min.',
          'Reliability trio: SQS buffer + idempotent writes + DLQ/destinations for replay and alerting.',
          'Performance: module-scope clients, right-sized memory, slim layers, stream S3 — hand off heavy work to Glue.',
          'Use checkpoint questions and interview table before CloudWatch — ops without metrics is blind flying.',
          'Next sub-topic: CloudWatch — logs, metrics, and alarms for Lambda, Glue, and pipeline health.',
        ]}
      />
    </LessonArticle>
  )
}
