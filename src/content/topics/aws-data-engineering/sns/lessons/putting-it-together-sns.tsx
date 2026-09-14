import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherSns() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SNS ties alerts to fan-out ETL — you are ops-ready">
        You covered Standard vs FIFO, filter policies, subscription retry and DLQ, SNS→SQS/Lambda/email,
        fan-out architecture, cross-account encryption, CloudWatch delivery metrics, and pipeline placement.
        This checkpoint confirms you can design and defend SNS in production lake systems before moving to
        Athena for the query layer.
      </Callout>

      <Definition term="SNS mental model for data engineering">
        <p>
          SNS is the <strong className="text-white">pub/sub fan-out bus</strong>: publish once from S3,
          CloudWatch, or pipeline code; route with subscription filters; buffer work in SQS; notify humans
          via email/Slack; monitor delivery in CloudWatch. Standard topics by default; FIFO when ordering
          demands it; idempotent consumers always; never treat SNS as durable storage.
        </p>
      </Definition>

      <LessonSection title="SNS sub-topic map">
        <Flowchart
          title="SNS lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[SNS complete path]
  START --> STD[Standard vs FIFO topics]
  START --> FILT[Message filtering]
  START --> SUB[Subscription retry DLQ]
  START --> SQS[SNS to SQS]
  START --> LAM[SNS to Lambda]
  START --> EMAIL[SNS to email ops]
  START --> FAN[Fan-out architecture]
  START --> XACC[Cross-account encryption CW]
  START --> PIPE[SNS in data pipelines]
  STD --> ATHNEXT
  FILT --> ATHNEXT
  SUB --> ATHNEXT
  SQS --> ATHNEXT
  LAM --> ATHNEXT
  EMAIL --> ATHNEXT
  FAN --> ATHNEXT
  XACC --> ATHNEXT
  PIPE --> ATHNEXT
  ATHNEXT[Athena — query layer next]`}
        />
      </LessonSection>

      <LessonSection title="Full SNS checkpoint — can you explain…">
        <ContentStep number={1} title="Topic types">
          <p className="text-slate-300">
            When Standard vs FIFO SNS? What subscriber types does FIFO allow? How does MessageGroupId affect
            parallel tenant processing?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Routing and policies">
          <p className="text-slate-300">
            How do subscription filter policies route finance vs marketing landing prefixes? What breaks if
            SQS queue policy missing sns.amazonaws.com SendMessage?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Integration patterns">
          <p className="text-slate-300">
            Why SNS → SQS → Lambda over SNS → Lambda for S3 ingest? Where does subscription DLQ differ from
            consumer DLQ?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Ops and security">
          <p className="text-slate-300">
            Why must email subscribers confirm? Which CloudWatch metric signals SNS delivery regression?
            What KMS permissions cross-account publish requires?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Architecture">
          <p className="text-slate-300">
            Whiteboard S3 landing fan-out to validate, audit, and metrics queues. Where do CloudWatch alarms
            re-enter SNS for paging?
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
                  'SNS vs SQS?',
                  'SNS fan-out pub/sub push to many subscribers; SQS point-to-point queue with pull consumers and DLQ replay.',
                ],
                [
                  'Standard vs FIFO SNS?',
                  'Standard: scale, at-least-once, any subscriber. FIFO: order per MessageGroupId, dedupe, mostly FIFO SQS subs.',
                ],
                [
                  'Why filter policies?',
                  'One topic, many consumers — route by body prefix or MessageAttributes without republishing.',
                ],
                [
                  'SNS → SQS → Lambda why?',
                  'Buffer bursts, ESM batching/concurrency, clearer DLQ replay, idempotent processing isolation.',
                ],
                [
                  'Subscription DLQ vs SQS DLQ?',
                  'Subscription DLQ: SNS could not deliver to endpoint. SQS DLQ: consumer failed processing after delivery.',
                ],
                [
                  'Email not receiving alerts?',
                  'PendingConfirmation — click confirm link; verify alarm action topic ARN matches subscription.',
                ],
                [
                  'Encrypted SNS failure?',
                  'Check KMS key policy for publisher role and SNS service; SQS subscriber queue encryption alignment.',
                ],
                [
                  'SNS as event store?',
                  'Anti-pattern — no replay; use SQS retention, EventBridge archive, or reprocess from S3 inventory.',
                ],
                [
                  'Fan-out cost concern?',
                  'Filter irrelevant events; avoid delivering billion replay events to all ten subscribers blindly.',
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
        <Callout variant="tip" title="Ready for Athena when…">
          You can sketch landing → SNS fan-out → Glue with alarm and DLQ paths, explain why email confirmation
          matters, and choose Standard vs FIFO without hesitating — SNS is the nervous system, not the brain
          of your pipeline.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Athena">
        <p className="text-slate-300">
          Curated Parquet in S3 — produced after SNS-driven ingest and Glue transform — becomes queryable
          through Amazon Athena. Serverless SQL over the Glue Catalog, partition pruning, workgroup cost
          controls, and federated queries connect the storage and orchestration layers you built to analyst
          self-service. SNS told you when data landed; Athena lets you ask questions of it.
        </p>
        <Flowchart
          title="After SNS — course thread"
          chart={`flowchart LR
  S3[S3 lake zones]
  SNS[SNS checkpoint]
  GLUE[Glue ETL]
  CAT[Glue Catalog]
  ATH[Athena SQL]
  BI[QuickSight dashboards]
  S3 --> SNS
  SNS --> GLUE
  GLUE --> CAT
  CAT --> ATH
  ATH --> BI`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding a new landing bucket or debugging missing alerts — answers
          usually trace to unconfirmed email subs, queue policy, KMS, or filter policy mismatch.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SNS DE role: fan-out pub/sub for alerts and parallel ingest — Standard default, FIFO when ordered.',
          'SNS → SQS → Lambda is the durable ETL pattern; direct SNS → Lambda for lightweight ops formatters.',
          'Filters route by attribute/prefix; subscription DLQ catches transport failures; CloudWatch monitors delivery.',
          'Cross-account + KMS need aligned topic, key, and queue policies — platform account centralizes ops topics.',
          'Next sub-topic: Athena — serverless SQL over curated S3 data in the Glue Catalog.',
        ]}
      />
    </LessonArticle>
  )
}
