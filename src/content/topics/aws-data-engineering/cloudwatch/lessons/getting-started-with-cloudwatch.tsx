import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithCloudwatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why CloudWatch after Lambda for data engineering">
        You know who may access AWS (IAM), where long-running code lives (EC2), where lake data is stored
        (S3), and how event-driven functions react to uploads (Lambda). The next question every pipeline
        team asks is:{' '}
        <strong className="text-white">how do we know the pipeline is healthy — and who gets paged when
        it is not?</strong> Amazon CloudWatch is AWS&apos;s monitoring and observability service. It
        collects metrics, stores logs, fires alarms, and builds dashboards so you can see Lambda errors,
        Glue job failures, and ETL latency before stakeholders notice missing data.
      </Callout>

      <Definition term="What is CloudWatch in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon CloudWatch</strong> is the central nervous system for AWS
          operations. AWS services automatically publish <strong className="text-white">metrics</strong>{' '}
          (numbers over time — invocations, errors, duration). Your code and services write{' '}
          <strong className="text-white">logs</strong> (text lines — stack traces, row counts, debug output).
          You configure <strong className="text-white">alarms</strong> that watch metrics and notify SNS,
          email, or another Lambda when thresholds breach.{' '}
          <strong className="text-white">Dashboards</strong> combine graphs so on-call engineers see pipeline
          health at a glance.
        </p>
        <p className="mt-2 text-slate-300">
          Think of CloudWatch as{' '}
          <span className="text-core-400">the eyes and ears on top of your compute and storage</span> — Lambda
          runs the work; CloudWatch tells you whether that work succeeded, how fast, and what it logged.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build CloudWatch in layers so alarm math and Logs Insights queries do not overwhelm you on day
          one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — metrics and logs">
          <p className="text-slate-300">
            Understand what a metric is, which Lambda metrics AWS publishes for free, and where Lambda log
            lines land in log groups and log streams — the foundation for every DE troubleshooting session.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Alarms — threshold and notify">
          <p className="text-slate-300">
            Learn why alarms exist, how a simple threshold works (errors &gt; 5 in 5 minutes), and the three
            alarm states: OK, ALARM, and INSUFFICIENT_DATA.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dashboards — pipeline health at a glance">
          <p className="text-slate-300">
            Combine Lambda invocations, errors, and duration with Glue job metrics on one screen so daily
            standups do not require clicking through ten service consoles.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Pipeline monitoring patterns (next module)">
          <p className="text-slate-300">
            After this beginner pass: CloudWatch Logs Insights for SQL-like log queries, custom metrics with{' '}
            <code className="text-core-400">PutMetricData</code>, the CloudWatch Agent on EC2, composite
            alarms, and wiring SNS to Slack or PagerDuty for production on-call.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudWatch sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is CloudWatch]
  B --> C[Metrics basics]
  C --> D[Log groups and streams]
  D --> E[Alarms basics]
  E --> F[Dashboards basics]
  F --> G[Putting it together]
  G --> H[Logs Insights and custom metrics — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Metric', 'A numeric measurement over time — Lambda Invocations, Errors, Duration in milliseconds'],
                ['Log group', 'A named container for logs from one source — e.g. /aws/lambda/de-s3-ingest-validator-dev'],
                ['Log stream', 'A sequence of log events within a group — usually one stream per Lambda invocation container'],
                ['Alarm', 'A rule that watches a metric and changes state when a threshold is crossed — triggers SNS or actions'],
                ['Dashboard', 'A customizable page of graphs and widgets showing metrics and logs for your pipeline'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Log group naming — quick check">
          Every Lambda function gets a log group named{' '}
          <code className="text-core-400">/aws/lambda/&lt;function-name&gt;</code>. If your function is{' '}
          <code className="text-core-400">de-s3-ingest-validator-dev</code>, open CloudWatch Logs and search
          for that path — your <code className="text-core-400">print()</code> and logger output appear there
          within seconds of an invoke.
        </Callout>
      </LessonSection>

      <LessonSection title="How CloudWatch fits after Lambda in a pipeline">
        <p className="text-slate-300">
          Lambda executes your ingestion logic. CloudWatch answers the questions that follow every deploy:
          Is the function being invoked? Are errors spiking? Is duration creeping up as file sizes grow? When
          something breaks at 2 a.m., the log group holds the stack trace — not an SSH session on a forgotten
          EC2 box.
        </p>
        <Flowchart
          title="Service → CloudWatch → alarm → SNS or Lambda"
          chart={`flowchart LR
  SVC[Lambda Glue EC2 S3]
  SVC --> CW[CloudWatch metrics and logs]
  CW --> AL[CloudWatch alarm]
  AL -->|ALARM state| ACT[SNS email Slack PagerDuty]
  ACT --> L2[Optional Lambda auto-remediation]
  CW --> DASH[Dashboard for team visibility]`}
        />
        <Callout variant="insight">
          Mature data platforms treat monitoring as part of the pipeline definition, not an afterthought.
          A Lambda with no error alarm is a function that fails silently until a business analyst asks why
          yesterday&apos;s partition is missing. CloudWatch closes that gap with minimal setup.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about CloudWatch">
        <ContentStep number={1} title="See pipeline failures before users do">
          <p className="text-slate-300">
            Alarm on <code className="text-core-400">Errors</code> or{' '}
            <code className="text-core-400">Throttles</code> for ingestion Lambdas. Alarm on Glue job failure
            metrics or custom &quot;rows processed&quot; counters. Notification arrives while reprocessing
            is still possible — not after the morning dashboard is empty.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Debug with logs, not guesswork">
          <p className="text-slate-300">
            Lambda automatically ships stdout and stderr to CloudWatch Logs. Your{' '}
            <code className="text-core-400">logger.info(f&quot;Processed {'{'}row_count{'}'} rows&quot;)</code>{' '}
            lines become searchable evidence when Athena shows zero rows for a partition.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One place for cross-service visibility">
          <p className="text-slate-300">
            A single dashboard can show S3 request rates, Lambda duration, Glue DPU usage, and EC2 CPU from
            the same account. Data pipelines span many services — CloudWatch is where you stitch the story
            together for on-call and post-incident review.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudWatch follows Lambda in the track — compute runs the pipeline; CloudWatch proves it is healthy and surfaces failures.',
          'Roadmap: metrics and logs → alarms → dashboards → Logs Insights, custom metrics, and Agent next.',
          'Core vocabulary: metric, log group, log stream, alarm, dashboard.',
          'Typical flow: AWS service publishes metrics and logs → CloudWatch alarm watches threshold → SNS or Lambda notifies the team.',
        ]}
      />
    </LessonArticle>
  )
}
