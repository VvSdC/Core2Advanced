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

export function WhatIsCloudwatch() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        CloudWatch is AWS&apos;s built-in{' '}
        <strong className="text-white">monitoring and observability</strong> platform. It answers: Is my
        service running? How busy is it? Did anything error? What did the code log? Should someone be
        notified? For data engineers, that means watching Lambda ingest functions, Glue ETL jobs, EC2
        workers, and even S3 request patterns — all from one AWS service you enable by default.
      </Callout>

      <Definition term="Amazon CloudWatch">
        <p>
          <strong className="text-white">Amazon CloudWatch</strong> collects operational data from AWS
          resources and applications you run on AWS. It stores time-series{' '}
          <strong className="text-white">metrics</strong>, ingests application and service{' '}
          <strong className="text-white">logs</strong>, evaluates{' '}
          <strong className="text-white">alarms</strong> against metric thresholds, and renders{' '}
          <strong className="text-white">dashboards</strong> for visualization. Most AWS services publish
          metrics automatically; Lambda and many others also send logs without extra wiring.
        </p>
      </Definition>

      <LessonSection title="Monitoring vs observability">
        <p className="text-slate-300">
          <strong className="text-white">Monitoring</strong> tells you when something is wrong — a red graph,
          an alarm in ALARM state, an error count above zero.{' '}
          <strong className="text-white">Observability</strong> helps you understand{' '}
          <em>why</em> it went wrong — log lines with request IDs, duration trends before timeout, dimension
          breakdowns by function name or job run. CloudWatch provides both: metrics and alarms for detection,
          logs and (later) Logs Insights for diagnosis.
        </p>
        <ContentStep number={1} title="Detection — metrics and alarms">
          <p className="text-slate-300">
            AWS publishes <code className="text-core-400">Invocations</code> and{' '}
            <code className="text-core-400">Errors</code> for Lambda every minute. An alarm on Errors &gt; 0
            pages on-call within minutes of the first failed ingest — classic monitoring.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Diagnosis — logs and context">
          <p className="text-slate-300">
            The same failed invocation writes a stack trace to{' '}
            <code className="text-core-400">/aws/lambda/your-function</code>. You correlate the alarm
            timestamp with log events to find the bad S3 key or schema mismatch — observability in practice.
          </p>
        </ContentStep>
        <Flowchart
          title="Monitor then observe"
          chart={`flowchart LR
  M[Metrics show Errors spike]
  M --> A[Alarm fires to SNS]
  A --> O[Engineer opens Logs]
  O --> R[Root cause in stack trace]
  R --> F[Fix deploy or reprocess]`}
        />
      </LessonSection>

      <LessonSection title="The four pillars — metrics, logs, alarms, dashboards">
        <ContentStep number={1} title="Metrics — numbers over time">
          <p className="text-slate-300">
            Metrics are datapoints indexed by time — CPU percent, invocation count, bytes written. AWS services
            emit standard metrics (often free at basic resolution). You can publish custom metrics from
            pipeline code (rows loaded, files quarantined) in advanced lessons.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logs — what your code actually said">
          <p className="text-slate-300">
            Logs are timestamped text events grouped in log groups and streams. Lambda logs every{' '}
            <code className="text-core-400">print()</code> and logging call automatically. Glue and EC2 can
            ship logs to CloudWatch with agent configuration — essential for Airflow task logs and custom
            ETL scripts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarms — automated reactions">
          <p className="text-slate-300">
            An alarm watches one or more metrics over a period and enters ALARM when a threshold is breached.
            Actions can notify humans (SNS → email/Slack), trigger Lambda remediation (disable bad trigger,
            rerun Glue with params), or scale resources — the bridge from observation to action.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Dashboards — shared situational awareness">
          <p className="text-slate-300">
            Dashboards arrange metric widgets on a single page. A DE team might show: Lambda invocations vs
            errors (stacked), p99 duration, Glue job success rate, and S3 PUT rate to the raw prefix — the
            morning standup view without exporting CSVs from five consoles.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudWatch big picture"
          chart={`flowchart TB
  subgraph Sources["AWS and your apps"]
    L[Lambda]
    G[Glue]
    E[EC2]
    S3[S3]
  end
  subgraph CW["CloudWatch"]
    MET[Metrics]
    LOG[Logs]
    ALM[Alarms]
    DSH[Dashboards]
  end
  L --> MET
  L --> LOG
  G --> MET
  G --> LOG
  E --> MET
  E --> LOG
  S3 --> MET
  MET --> ALM
  MET --> DSH
  LOG --> DSH
  ALM --> SNS[SNS and actions]`}
        />
        <Example title="DE scenario — one bad upload night" caption="How the four pieces work together">
{`02:14 — Lambda Errors metric rises (metric)
02:14 — Alarm "ingest-errors" → ALARM (alarm)
02:14 — SNS sends Slack message to #data-oncall (action)
02:16 — Engineer opens dashboard, sees duration also up (dashboard)
02:17 — Logs show KeyError on column "order_id" in /aws/lambda/ingest (logs)
02:30 — Fix schema validation, reprocess file from quarantine/`}
        </Example>
        <Callout variant="tip" title="They work together, not in isolation">
          Metrics without logs tell you <em>that</em> something failed, not <em>what</em>. Logs without
          alarms mean you only find out when someone manually checks. Dashboards without alarms are useful
          for trends but do not wake anyone at night. Production pipelines use all four.
        </Callout>
      </LessonSection>

      <LessonSection title="What CloudWatch is not">
        <ContentStep number={1} title="Not a data warehouse">
          <p className="text-slate-300">
            CloudWatch stores operational telemetry, not business datasets. Do not query CloudWatch for
            revenue totals — use Athena on S3. Do use CloudWatch to learn why the job that loads revenue
            into S3 failed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not infinite retention by default">
          <p className="text-slate-300">
            Log retention defaults vary; many teams set 7–30 days for dev and longer for prod with export to
            S3 for compliance. Metrics have their own retention tiers — fine for ops, not a decade-long
            analytics archive.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not the only tool in large orgs">
          <p className="text-slate-300">
            Enterprises often forward CloudWatch logs to Datadog, Splunk, or OpenSearch for unified search.
            On AWS-native stacks, CloudWatch alone is enough for most DE teams starting out — learn it first,
            integrate later if required.
          </p>
        </ContentStep>
        <Callout variant="insight">
          CloudWatch is included in the AWS story you already know: IAM controls who can view alarms, Lambda
          writes logs automatically, S3 can emit request metrics, EC2 needs the Agent for memory and disk.
          It is the glue that makes a multi-service pipeline operable.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudWatch is AWS monitoring and observability — metrics for numbers, logs for text, alarms for alerts, dashboards for visualization.',
          'Monitoring detects problems (alarms on Errors); observability explains them (logs, trends, dimensions).',
          'Most AWS services publish metrics automatically; Lambda also ships logs to CloudWatch without extra code.',
          'Use all four pillars together — metrics and alarms for speed, logs and dashboards for context.',
        ]}
      />
    </LessonArticle>
  )
}
