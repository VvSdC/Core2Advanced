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

export function ServiceIntegrations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Stop writing Lambda functions that only call other services">
        A Task state can call Glue, Athena, ECS, SNS, SQS, DynamoDB, and 200+ other AWS services directly.
        The question is not <em>whether</em> Step Functions can call a service — it is{' '}
        <strong className="text-white">how long it waits</strong>: fire and move on, wait until the job
        finishes, or pause until someone hands back a token. Picking the right pattern removes most custom
        polling code from a data pipeline.
      </Callout>

      <Definition term="Service integration pattern">
        <p>
          The suffix on a Task state&apos;s <span className="font-mono text-sm">Resource</span> ARN that tells
          Step Functions how to wait. No suffix = <strong className="text-white">Request Response</strong>{' '}
          (call the API, take the HTTP response, continue).{' '}
          <span className="font-mono text-sm">.sync</span> = <strong className="text-white">Run a Job</strong>{' '}
          (start it and wait for completion). <span className="font-mono text-sm">.waitForTaskToken</span> ={' '}
          <strong className="text-white">Wait for Callback</strong> (pause until an external system calls
          SendTaskSuccess or SendTaskFailure with the token).
        </p>
      </Definition>

      <LessonSection title="The three integration patterns">
        <ContentStep number={1} title="Request Response — the default">
          <p className="text-slate-300">
            <span className="font-mono text-sm">arn:aws:states:::glue:startJobRun</span> returns as soon as
            Glue accepts the request — you get a <code className="text-core-400">JobRunId</code>, not a
            finished job. Perfect for fire-and-forget calls: <span className="font-mono text-sm">sns:publish</span>,{' '}
            <span className="font-mono text-sm">sqs:sendMessage</span>,{' '}
            <span className="font-mono text-sm">dynamodb:putItem</span> on a watermark table. Dangerous for
            jobs: the next state runs while Spark is still reading S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Run a Job — .sync">
          <p className="text-slate-300">
            <span className="font-mono text-sm">arn:aws:states:::glue:startJobRun.sync</span>,{' '}
            <span className="font-mono text-sm">athena:startQueryExecution.sync</span>,{' '}
            <span className="font-mono text-sm">ecs:runTask.sync</span>,{' '}
            <span className="font-mono text-sm">batch:submitJob.sync</span>, and{' '}
            <span className="font-mono text-sm">emr-serverless:startJobRun.sync</span> start the work and hold
            the state until it reaches a terminal status. A FAILED Glue run surfaces as{' '}
            <code className="text-core-400">States.TaskFailed</code>, so Retry and Catch work naturally. You
            pay for two transitions on a Standard workflow — not for the minutes spent waiting.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Wait for Callback — .waitForTaskToken">
          <p className="text-slate-300">
            The state passes <code className="text-core-400">$$.Task.Token</code> to a target (SQS message,
            Lambda payload, SNS email) and pauses — up to one year on Standard. An on-prem loader, dbt Cloud
            webhook, or approver calls <span className="font-mono text-sm">SendTaskSuccess</span> with the
            token to resume. Use it for anything without a native .sync integration.
          </p>
        </ContentStep>
        <Flowchart
          title="How long does the Task state wait"
          chart={`flowchart LR
  T[Task state]
  RR[Request Response]
  SY[Run a Job sync]
  CB[Wait for Callback]
  T --> RR
  T --> SY
  T --> CB
  RR -->|API returns| N1[Next state immediately]
  SY -->|job SUCCEEDED| N2[Next state after job]
  SY -->|job FAILED| E[States.TaskFailed]
  CB -->|SendTaskSuccess| N3[Next state with token output]`}
        />
      </LessonSection>

      <LessonSection title="Optimized vs AWS SDK integrations">
        <ContentStep number={1} title="Optimized integrations">
          <p className="text-slate-300">
            Hand-tuned by AWS for ~20 services (Lambda, Glue, Athena, ECS, Batch, EMR, SNS, SQS, DynamoDB, nested
            Step Functions). They support .sync where it makes sense and shape the output — for example{' '}
            <span className="font-mono text-sm">lambda:invoke</span> wraps the function result under{' '}
            <code className="text-core-400">Payload</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS SDK integrations">
          <p className="text-slate-300">
            <span className="font-mono text-sm">arn:aws:states:::aws-sdk:service:action</span> reaches almost
            any API — <span className="font-mono text-sm">aws-sdk:glue:startCrawler</span>,{' '}
            <span className="font-mono text-sm">aws-sdk:redshiftdata:executeStatement</span>,{' '}
            <span className="font-mono text-sm">aws-sdk:s3:listObjectsV2</span>. Parameter names match the API
            reference in PascalCase. SDK integrations support Request Response and .waitForTaskToken but{' '}
            <strong className="text-white">not .sync</strong> — for crawlers you build a poll loop with Wait +
            GetCrawler + Choice.
          </p>
        </ContentStep>
        <Example
          title="Glue .sync and crawler via SDK"
          caption="Two Task states from de-orders-nightly-sfn-prod"
        >
{`"StartCrawler": {
  "Type": "Task",
  "Resource": "arn:aws:states:::aws-sdk:glue:startCrawler",
  "Parameters": { "Name": "orders-silver-crawler" },
  "Next": "RunSilverJob"
},
"RunSilverJob": {
  "Type": "Task",
  "Resource": "arn:aws:states:::glue:startJobRun.sync",
  "Parameters": {
    "JobName": "orders-silver-etl",
    "Arguments": { "--run_date.$": "$.run_date", "--bucket": "acme-lake-prod" }
  },
  "Next": "NotifySuccess"
}`}
        </Example>
      </LessonSection>

      <LessonSection title="DE services and which pattern to use">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Service call</th>
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['glue:startJobRun.sync', 'Run a Job', 'Wait for Spark ETL to finish before crawl or QA.'],
                ['athena:startQueryExecution.sync', 'Run a Job', 'Data-quality or CTAS query must complete first.'],
                ['aws-sdk:glue:startCrawler', 'Request Response + poll', 'No .sync — loop on GetCrawler state.'],
                ['aws-sdk:redshiftdata:executeStatement', 'Request Response + poll', 'Poll DescribeStatement until FINISHED.'],
                ['ecs:runTask.sync / batch:submitJob.sync', 'Run a Job', 'Containerized extract or dbt Core run.'],
                ['lambda:invoke', 'Request Response', 'Short validation under 15 minutes.'],
                ['sqs:sendMessage.waitForTaskToken', 'Wait for Callback', 'External worker or on-prem job reports back.'],
                ['sns:publish', 'Request Response', 'Alert de-alerts-prod — no need to wait.'],
              ].map(([call, pattern, why]) => (
                <tr key={call} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{call}</td>
                  <td className="px-4 py-3">{pattern}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="IAM — the state machine role">
        <ContentStep number={1} title="The role calls services, not you">
          <p className="text-slate-300">
            Every integration runs as the state machine&apos;s execution role. Request Response to Glue needs{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span>; .sync additionally needs{' '}
            <span className="font-mono text-sm">glue:GetJobRun</span>, <span className="font-mono text-sm">glue:GetJobRuns</span>, and{' '}
            <span className="font-mono text-sm">glue:BatchStopJobRun</span> so Step Functions can poll and stop
            the run when the execution is aborted. Athena .sync also needs S3 access to the results bucket and
            Glue Catalog read permissions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scope to resource ARNs">
          <p className="text-slate-300">
            Restrict to <span className="font-mono text-sm">job/orders-silver-etl</span>, the specific crawler, and{' '}
            <span className="font-mono text-sm">de-alerts-prod</span>. Missing permissions fail at runtime with{' '}
            <code className="text-core-400">States.Permissions</code> or a service AccessDenied — the console
            auto-generates a starter policy, but review it before prod.
          </p>
        </ContentStep>
        <Callout variant="tip">
          ECS and Batch .sync integrations create a managed EventBridge rule to track job completion, so the
          role also needs <span className="font-mono text-sm">events:PutTargets</span>,{' '}
          <span className="font-mono text-sm">events:PutRule</span>, and{' '}
          <span className="font-mono text-sm">events:DescribeRule</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'No suffix = Request Response; .sync = wait for job completion; .waitForTaskToken = wait for external callback.',
          'Use glue:startJobRun.sync and athena:startQueryExecution.sync so downstream states never race unfinished jobs.',
          'AWS SDK integrations (aws-sdk:service:action) reach almost any API but do not support .sync — build poll loops.',
          'Crawlers and Redshift Data API have no .sync — Wait + describe call + Choice is the standard pattern.',
          'The execution role needs start, get, and stop permissions for .sync — scope them to exact job and topic ARNs.',
        ]}
      />
    </LessonArticle>
  )
}
