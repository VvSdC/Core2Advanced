import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EventbridgeVsSnsSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three messaging patterns — pick by routing vs fan-out vs buffer">
        Data pipelines use <strong className="text-white">EventBridge</strong>,{' '}
        <strong className="text-white">SNS</strong>, and <strong className="text-white">SQS</strong> together
        — not interchangeably. EventBridge routes and filters events; SNS fan-out notifications; SQS buffers
        and decouples workers. Confusing them leads to missing replays, alert fatigue, or Lambda stampedes.
      </Callout>

      <Definition term="Routing vs fan-out vs queue">
        <p>
          <strong className="text-white">EventBridge</strong> — content-filtered event router with 20+ AWS
          target types and optional archive. <strong className="text-white">SNS</strong> — pub/sub topic pushing
          to subscribers (Lambda, SQS, email, HTTP) with optional filter policies.{' '}
          <strong className="text-white">SQS</strong> — durable queue; consumers poll; back-pressure and batching
          for workers.
        </p>
      </Definition>

      <LessonSection title="Comparison for data engineering">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">EventBridge</th>
                <th className="px-4 py-3">SNS</th>
                <th className="px-4 py-3">SQS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Primary role',
                  'Event router + scheduler',
                  'Fan-out notifications',
                  'Work queue / buffer',
                ],
                [
                  'Filtering',
                  'Rich JSON event patterns',
                  'Subscription filter policies',
                  'No filtering (consumer logic)',
                ],
                [
                  'Delivery model',
                  'Push to targets (async)',
                  'Push to subscribers',
                  'Pull by consumer',
                ],
                [
                  'Durability / replay',
                  'Archive + replay',
                  'No native replay',
                  'Retention 1–14 days',
                ],
                [
                  'AWS service events',
                  'Native (S3, Glue, etc.)',
                  'Via SNS topic subscription',
                  'Via S3 direct or EB target',
                ],
                [
                  'Typical DE use',
                  'Orchestrate pipeline stages',
                  'Ops alerts to humans',
                  'Debounce S3 file storms',
                ],
                [
                  'Ordering',
                  'No guarantee across events',
                  'No strict order',
                  'FIFO optional per group',
                ],
                [
                  'DLQ',
                  'Per rule target SQS DLQ',
                  'Lambda async DLQ on sub',
                  'Native DLQ on queue',
                ],
              ].map(([dim, eb, sns, sqs]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{eb}</td>
                  <td className="px-4 py-3">{sns}</td>
                  <td className="px-4 py-3">{sqs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use which">
        <ContentStep number={1} title="Choose EventBridge when">
          <p className="text-slate-300">
            Reacting to AWS service events with pattern matching — S3 prefix, Glue FAILED, schedule cron.
            Multiple independent targets from one event type. Cross-account bus, archive/replay, input
            transformer, Step Functions start. Central orchestration layer for the lake.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Choose SNS when">
          <p className="text-slate-300">
            Simple alert fan-out — Glue failed email + Slack Lambda + PagerDuty HTTPS. Few subscribers, human
            in loop, no need for event archive. CloudWatch alarm action → SNS is the fastest ops wire. Not for
            durable pipeline state — messages are not replayed after delivery.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Choose SQS when">
          <p className="text-slate-300">
            Buffer between event burst and slow workers — thousands of S3 files, Lambda polls batches of 10.
            Throttle concurrency, accumulate for single Glue run. Dead-letter queue for poison messages.
            Often sits <em>behind</em> EventBridge (EB target → SQS → Lambda) not instead of EventBridge.
          </p>
        </ContentStep>
        <Flowchart
          title="Combined pattern — typical DE stack"
          chart={`flowchart TB
  S3[S3 Object Created]
  EB[EventBridge rule filtered]
  SQS[SQS buffer queue]
  LAM[Lambda batch processor]
  GLUE[Glue ETL]
  EB2[EventBridge Glue FAILED rule]
  SNS[SNS ops topic]
  S3 --> EB
  EB --> SQS
  EB --> LAM
  SQS --> LAM
  LAM --> GLUE
  GLUE --> EB2
  EB2 --> SNS`}
        />
        <Callout variant="insight">
          Anti-pattern: S3 → SNS → Lambda for complex multi-subscriber lake ingest — use EventBridge instead.
          Anti-pattern: EventBridge → SNS as only processing path for critical ETL — SNS has no replay; add
          SQS or archive.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision shortcuts">
        <ContentStep number={1} title="Interview one-liners">
          <p className="text-slate-300">
            &quot;Route and filter AWS events with multiple targets&quot; → EventBridge. &quot;Notify teams&quot;
            → SNS. &quot;Buffer and batch work&quot; → SQS. &quot;Replay last Tuesday&apos;s S3 events&quot; →
            EventBridge archive, not SNS or SQS alone.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost and ops">
          <p className="text-slate-300">
            EventBridge charges per event published and invocations; SNS per delivery; SQS per request and
            retention. High-volume landing without SQS buffer can spike Lambda costs — SQS batching often
            cheaper than per-file EventBridge→Lambda direct at scale.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge: content-filtered router, AWS service events, archive/replay, orchestration — lake nervous system.',
          'SNS: fan-out human alerts — fast ops wiring, no replay, pair with EventBridge for FAILED signals.',
          'SQS: buffer/debounce file storms — often EventBridge target → SQS → Lambda, not S3 direct alone.',
          'Combined stack: EB filters S3 → SQS batch → Glue; EB Glue FAILED → SNS ops.',
          'Replay needs EventBridge archive; do not rely on SNS for durable pipeline delivery.',
        ]}
      />
    </LessonArticle>
  )
}
