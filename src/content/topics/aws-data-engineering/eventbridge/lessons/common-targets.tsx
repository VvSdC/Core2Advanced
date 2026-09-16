import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CommonTargets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Rules match events — targets do the work">
        An EventBridge rule is only useful when it invokes a <strong className="text-white">target</strong>.
        Data engineering pipelines route S3 landings, schedules, and Glue job state changes to Lambda, SQS,
        Step Functions, Glue, and more — choosing the right target keeps orchestration decoupled and
        cost-aware.
      </Callout>

      <Definition term="EventBridge target">
        <p>
          A destination AWS service or API that receives matched events from a rule. Each target can have an
          IAM role, retry policy, dead-letter queue, and input transformer. One rule can fan out to multiple
          targets — for example SNS for humans and SQS for durable replay.
        </p>
      </Definition>

      <LessonSection title="Core targets for data engineering">
        <ContentStep number={1} title="Lambda">
          <p className="text-slate-300">
            Most common DE target: validate landing file metadata, call{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span>, update DynamoDB watermarks, or run
            lightweight Athena CTAS. Async invocation — EventBridge does not wait for completion. Keep handlers
            under 15 minutes; long work belongs in Glue or Step Functions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SNS">
          <p className="text-slate-300">
            Human and team notifications: Glue FAILED → SNS → email, Slack webhook Lambda, PagerDuty. SNS is
            fire-and-forget — not durable storage. Pair with SQS subscription when you need retry and replay
            for downstream processors.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SQS">
          <p className="text-slate-300">
            Buffer high-volume S3 events before Glue starts — debounce 500 small JSON files into batched job
            runs. Standard queue absorbs spikes; FIFO when strict ordering per partition key matters. Lambda
            event source mapping polls SQS — different delivery model than direct Lambda target.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Step Functions">
          <p className="text-slate-300">
            Cross-service DAG: pre-check Lambda → Glue StartJobRun.sync → Athena QA → Choice branch → gold
            job. EventBridge starts the state machine on schedule or S3 event. Built-in service integrations
            avoid Lambda polling loops for long Glue runs.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Glue">
          <p className="text-slate-300">
            Start Glue workflow runs or trigger crawlers directly from EventBridge — no Lambda middle layer
            when logic is purely &quot;start this workflow on cron.&quot; Less flexible than Lambda for
            parameterization but fewer moving parts and no cold start.
          </p>
        </ContentStep>
        <ContentStep number={6} title="ECS / Fargate">
          <p className="text-slate-300">
            Run containerized batch (dbt, custom Python, legacy ETL) on file arrival. EventBridge passes
            task overrides — environment variables for S3 prefix and run date. Useful when Spark/Glue is
            overkill but Lambda memory/time limits are too tight.
          </p>
        </ContentStep>
        <ContentStep number={7} title="CloudWatch Logs">
          <p className="text-slate-300">
            Audit trail target: pipe all pipeline lifecycle events to a dedicated log group for Logs Insights
            queries. Not a processing target — compliance and debugging when you need immutable event history
            without invoking compute.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE target selection guide">
        <Flowchart
          title="Which target for this pipeline step?"
          chart={`flowchart TB
  EVT[Event matched by rule]
  EVT --> Q1{Need human alert?}
  Q1 -->|yes| SNS[SNS topic]
  Q1 -->|no| Q2{Heavy transform?}
  Q2 -->|yes| GLUE[Glue or Step Functions with Glue sync]
  Q2 -->|no| Q3{Multi-service DAG?}
  Q3 -->|yes| SF[Step Functions]
  Q3 -->|no| Q4{High volume burst?}
  Q4 -->|yes| SQS[SQS buffer then Lambda]
  Q4 -->|no| LAM[Lambda direct]
  SNS --> LAM2[Optional Lambda for Slack]
  SQS --> LAM3[Lambda event source mapping]`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Preferred target</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'S3 landing → start ETL',
                  'Lambda or SQS → Lambda',
                  'SQS debounces bursts; Lambda calls StartJobRun',
                ],
                [
                  'Nightly medallion refresh',
                  'Step Functions or Glue workflow',
                  'Multi-step DAG with wait-for-completion',
                ],
                [
                  'Glue job FAILED pager',
                  'SNS',
                  'Fast fan-out to ops; no compute needed',
                ],
                [
                  'Audit all bus events',
                  'CloudWatch Logs',
                  'Searchable history without side effects',
                ],
                [
                  'dbt in container on schedule',
                  'ECS Fargate',
                  'Longer runs than Lambda; packaged deps',
                ],
                [
                  'Downstream team subscribes',
                  'SQS or custom bus rule',
                  'Decouple permissions from producer Lambda',
                ],
              ].map(([pattern, target, why]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{pattern}</td>
                  <td className="px-4 py-3">{target}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Every target needs an IAM role trusting <span className="font-mono text-sm">events.amazonaws.com</span>{' '}
          with least privilege — StartJobRun on one job ARN, not{' '}
          <span className="font-mono text-sm">glue:*</span> on all resources. Failed invocations often trace to
          missing target permissions, not bad event patterns.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda: validate, parameterize, StartJobRun — default lightweight DE target; async, not for long Spark.',
          'SQS: buffer high-volume S3 events; SNS: ops alerts — pair SNS with SQS when replay matters.',
          'Step Functions: cross-service DAG with sync Glue wait; Glue workflow target for Glue-only chains.',
          'ECS Fargate for container batch; CloudWatch Logs for audit — not processing.',
          'Choose target by workload shape: burst buffer (SQS), DAG (Step Functions), alert (SNS), audit (Logs).',
        ]}
      />
    </LessonArticle>
  )
}
