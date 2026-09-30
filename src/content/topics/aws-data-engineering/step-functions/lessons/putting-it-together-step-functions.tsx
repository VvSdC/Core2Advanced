import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherStepFunctions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Step Functions for DE — integrations, data flow, resilience, and scale">
        You covered service integration patterns, JSONPath input and output processing, Retry and Catch,
        Choice, Wait and Parallel, Map and Distributed Map, a full Glue → Athena → Redshift pipeline, callbacks
        and human approval, triggers and schedules, observability and redrive, and how Step Functions compares
        with Glue Workflows and MWAA. This checkpoint ties the intermediate and advanced lessons together before{' '}
        <strong className="text-white">Secrets Manager &amp; Parameter Store</strong> — keeping the credentials
        your workflows depend on out of code and out of ASL.
      </Callout>

      <Definition term="Step Functions mental model for data engineering">
        <p>
          AWS Step Functions is the <strong className="text-white">serverless control plane</strong> for
          pipelines: a Standard state machine sequences Glue, Athena, Redshift, Lambda, and external systems
          with the right wait pattern (.sync, poll loop, or task token), shapes JSON between states, retries
          transient errors, catches the rest into SNS and a Fail state, fans out with Map, and leaves an
          auditable history you can redrive — it orchestrates the work, it never moves the data itself.
        </p>
      </Definition>

      <LessonSection title="Step Functions sub-topic map">
        <Flowchart
          title="Step Functions lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Step Functions complete path]
  START --> SI[Service integrations]
  START --> IO[Input and output processing]
  START --> RC[Retry and Catch]
  START --> CWP[Choice Wait Parallel]
  START --> MAP[Map and Distributed Map]
  START --> PIPE[Glue Athena Redshift pipeline]
  START --> CB[Callbacks and approval]
  START --> TR[Triggers and schedules]
  START --> OBS[Observability and redrive]
  START --> CMP[vs Glue Workflows and MWAA]
  SI --> SECNEXT
  IO --> SECNEXT
  RC --> SECNEXT
  CWP --> SECNEXT
  MAP --> SECNEXT
  PIPE --> SECNEXT
  CB --> SECNEXT
  TR --> SECNEXT
  OBS --> SECNEXT
  CMP --> SECNEXT
  SECNEXT[Secrets Manager next]`}
        />
      </LessonSection>

      <LessonSection title="Full Step Functions checkpoint — can you explain…">
        <ContentStep number={1} title="Integrations">
          <p className="text-slate-300">
            Request Response vs .sync vs .waitForTaskToken? Why a Glue crawler or Redshift Data API call needs a
            poll loop? Optimized vs AWS SDK integrations, and which IAM actions .sync adds?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Data flow between states">
          <p className="text-slate-300">
            The order of InputPath, Parameters, ResultSelector, ResultPath, OutputPath? What the .$ suffix does?
            How to reach $$.Execution.Id? Why S3 URIs instead of payloads over 256 KB?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Resilience">
          <p className="text-slate-300">
            Retry backoff math with MaxDelaySeconds and jitter? Why Catch uses ResultPath $.error? Why every
            failure path ends in a Fail state? How to make a retried Glue job idempotent?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Flow control and scale">
          <p className="text-slate-300">
            Choice with IsPresent and Default? Wait-based polling loops and history limits? Parallel failure
            semantics? Inline Map vs Distributed Map, ItemReader, ToleratedFailurePercentage, and MaxConcurrency
            to protect Glue quotas?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Triggers and external work">
          <p className="text-slate-300">
            EventBridge rule vs Scheduler with time zones? Execution names for idempotency? Task tokens for
            on-prem jobs, dbt Cloud, and approval gates — with HeartbeatSeconds?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Operations and architecture">
          <p className="text-slate-300">
            Which CloudWatch metrics to alarm on? When includeExecutionData is risky? Redrive vs new execution?
            Step Functions vs Glue Workflows vs MWAA for a given team?
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
                  'Three integration patterns?',
                  'Request Response returns on API ack; .sync waits for job completion; .waitForTaskToken waits for callback.',
                ],
                [
                  'Crawler in a workflow?',
                  'aws-sdk:glue:startCrawler, then Wait, GetCrawler, Choice on State READY and LastCrawl.Status.',
                ],
                [
                  'ResultPath vs OutputPath?',
                  'ResultPath places the result inside the original input; OutputPath filters what moves on.',
                ],
                [
                  'Payload too large?',
                  '256 KB limit — write to S3, pass the URI; keep Athena results to one aggregate row.',
                ],
                [
                  'Retry vs Catch?',
                  'Retry reruns the state with backoff; Catch routes to a fallback after retries are exhausted.',
                ],
                [
                  'Silent failure risk?',
                  'Catch path ending at SNS with End true shows Succeeded — always end in a Fail state.',
                ],
                [
                  'Parallel branch fails?',
                  'Other branches stop and the Parallel fails unless the error is caught.',
                ],
                [
                  'Backfill 730 partitions?',
                  'Distributed Map over a CSV of dates, MaxConcurrency sized to Glue concurrent-run limits.',
                ],
                [
                  'Human approval?',
                  'waitForTaskToken, SNS email with API Gateway links calling SendTaskSuccess or SendTaskFailure.',
                ],
                [
                  'Duplicate S3 triggers?',
                  'Deterministic execution name — Standard rejects duplicates for 90 days.',
                ],
                [
                  'Resume a failed run?',
                  'RedriveExecution reruns only unsuccessful states within 14 days, same definition and input.',
                ],
                [
                  'Step Functions vs MWAA?',
                  'SFN: serverless, per transition, AWS-native. MWAA: Python DAGs, catchup backfills, always-on cost.',
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
        <Callout variant="tip" title="Ready for Secrets Manager when…">
          You can whiteboard de-orders-nightly-sfn-prod end to end — Glue .sync, crawler poll loop, Athena QA
          gate, Redshift Data API load, Retry and Catch into SNS and Fail — and explain how it is triggered,
          deduplicated, monitored, and redriven, without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Secrets Manager & Parameter Store">
        <p className="text-slate-300">
          Your workflows now call Glue jobs that connect over JDBC to RDS, Redshift loads, and third-party APIs
          for vendor extracts — every one needs credentials. Those must{' '}
          <strong className="text-white">never</strong> live in ASL definitions, execution input, or Glue job
          arguments, where they show up in event history, CloudWatch Logs, and CloudFormation templates.{' '}
          <strong className="text-white">AWS Secrets Manager</strong> stores and rotates passwords and API keys;{' '}
          <strong className="text-white">SSM Parameter Store</strong> holds configuration such as bucket names and
          feature flags. Workflows pass a secret ARN or parameter name; the service fetches the value at
          runtime with IAM.
        </p>
        <Flowchart
          title="After Step Functions — course thread"
          chart={`flowchart LR
  SFN[Step Functions checkpoint]
  SM[Secrets Manager]
  PS[Parameter Store]
  GLUE[Glue JDBC job]
  RS[Redshift Data API]
  API[Vendor API Lambda]
  SFN -->|passes secret ARN only| GLUE
  SFN --> RS
  SFN --> API
  SM --> GLUE
  SM --> RS
  SM --> API
  PS -->|config values| SFN`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding DEs, debugging a red execution at 3 a.m. (check the failed
          state input and redrive), or reviewing a new pipeline design — answers trace to lessons on
          integrations, data flow, error handling, Map, triggers, and observability covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Step Functions: serverless control plane — right wait pattern per service, JSON shaping, retries, and auditable history.',
          'Intermediate: integration patterns, JSONPath processing, Retry and Catch, Choice, Wait, and Parallel.',
          'Advanced: Distributed Map at scale, full lake pipeline, callbacks and approval, triggers, observability, orchestrator choice.',
          'Production habits: idempotent names and jobs, bounded poll loops, SNS plus Fail on every error path, redrive.',
          'Next sub-topic: Secrets Manager and Parameter Store — credentials by ARN, never in ASL or execution input.',
        ]}
      />
    </LessonArticle>
  )
}
