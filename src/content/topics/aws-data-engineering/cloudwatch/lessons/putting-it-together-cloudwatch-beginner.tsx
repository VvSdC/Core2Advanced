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

export function PuttingItTogetherCloudwatchBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before Logs Insights and custom metrics">
        You now know what CloudWatch is, how metrics differ from logs, where Lambda log groups live, how
        alarms watch thresholds and notify SNS, and how dashboards visualize pipeline health. This lesson
        ties those threads into a{' '}
        <strong className="text-white">beginner CloudWatch checklist</strong> — minimum observability on
        your dev ingest Lambda before Logs Insights queries and the CloudWatch Agent enter the picture.
      </Callout>

      <Definition term="Beginner pipeline observability stack">
        <p>
          A <strong className="text-white">beginner observability stack</strong> for a DE dev account
          includes: one Lambda function with known metrics in{' '}
          <code className="text-core-400">AWS/Lambda</code>, its log group with retention set, one Errors
          alarm wired to an SNS topic you can receive, and a simple dashboard with invocations, errors, and
          duration graphs plus the alarm status tile — all scoped to dev resources, not production PII
          traffic.
        </p>
      </Definition>

      <LessonSection title="Setup checklist — observability in one afternoon">
        <ContentStep number={1} title="Confirm metrics exist">
          <p className="text-slate-300">
            Invoke your dev Lambda manually (Console test event or CLI). Open CloudWatch → Metrics →
            AWS/Lambda → By Function Name → select{' '}
            <code className="text-core-400">de-s3-ingest-validator-dev</code> (or your function). Verify{' '}
            <code className="text-core-400">Invocations</code>, <code className="text-core-400">Errors</code>,
            and <code className="text-core-400">Duration</code> show datapoints.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Verify log group and retention">
          <p className="text-slate-300">
            CloudWatch → Log groups →{' '}
            <code className="text-core-400">/aws/lambda/de-s3-ingest-validator-dev</code>. Confirm START /
            END / REPORT lines appear. Set retention to 7 days for dev. Add one{' '}
            <code className="text-core-400">logger.info</code> line with bucket and key in your handler.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Create SNS topic and subscribe">
          <p className="text-slate-300">
            SNS topic <code className="text-core-400">data-pipeline-alerts-dev</code>. Subscribe your email;
            confirm subscription. This topic will receive alarm notifications — same pattern for Slack Lambda
            later.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Create Errors alarm">
          <p className="text-slate-300">
            CloudWatch alarm <code className="text-core-400">ingest-dev-errors</code>: Lambda Errors, Sum, 1-min
            periods, threshold &gt; 0, 1 evaluation period, action to SNS topic on ALARM and optionally OK.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Build dev dashboard">
          <p className="text-slate-300">
            Dashboard <code className="text-core-400">de-pipeline-dev</code>: three line graphs (Invocations,
            Errors, Duration) for your function, one alarm widget for{' '}
            <code className="text-core-400">ingest-dev-errors</code>, markdown note with log group link.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner observability verification flow"
          chart={`flowchart TD
  A[Invoke dev Lambda once]
  A --> B[Metrics show Invocations]
  B --> C[Log group has START and INFO lines]
  C --> D[Set 7-day log retention]
  D --> E[Create SNS topic and confirm email]
  E --> F[Create Errors alarm to SNS]
  F --> G[Build dashboard with graphs and alarm tile]
  G --> H[Trigger test error and receive email]`}
        />
      </LessonSection>

      <LessonSection title="Mini scenario — prove the alarm path">
        <p className="text-slate-300">
          Observability is not real until you have seen a notification arrive. Safely test in dev:
        </p>
        <ContentStep number={1} title="Induce a controlled failure">
          <p className="text-slate-300">
            Temporarily raise an exception in your handler (e.g.{' '}
            <code className="text-core-400">raise ValueError(&quot;test alarm path&quot;)</code>) or pass a
            test event missing a required field. Invoke twice so the Errors metric registers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Watch state transition">
          <p className="text-slate-300">
            CloudWatch → Alarms → <code className="text-core-400">ingest-dev-errors</code> should move from
            OK to ALARM within a few minutes. Dashboard alarm tile turns red.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Confirm SNS delivery">
          <p className="text-slate-300">
            Check email (or SNS delivery status). Message includes alarm name, reason, and timestamp — enough
            to jump to logs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Diagnose via logs">
          <p className="text-slate-300">
            Open the log group, search around the alarm time, find the stack trace with{' '}
            <code className="text-core-400">test alarm path</code>. Fix the handler, redeploy, invoke
            successfully — alarm returns OK.
          </p>
        </ContentStep>
        <Example title="Incident drill checklist" caption="Dev-only — do not run in prod">
{`1. Deploy intentional failure branch
2. Invoke function twice (1 min apart)
3. Wait up to 5 min for alarm evaluation
4. Receive SNS email — note RequestId in logs
5. Revert failure, deploy fix, invoke success
6. Confirm alarm OK and Errors graph back to zero`}
        </Example>
        <Callout variant="insight">
          Teams that skip this drill discover broken SNS subscriptions or wrong IAM on alarm actions during
          a real outage. Five minutes in dev saves an hour at 3 a.m.
        </Callout>
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="Metric vs log">
          <p className="text-slate-300">
            Metric = numeric time series (Errors count). Log = text event (stack trace line). Both come from
            the same failed invoke but serve different jobs — alarm vs grep.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Log group vs log stream">
          <p className="text-slate-300">
            Group = all logs for one function. Stream = sequence inside the group, often per Lambda container.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Alarm threshold in plain English">
          <p className="text-slate-300">
            &quot;Sum of Errors over 1 minute &gt; 0 for 1 period&quot; means any error in that minute fires
            the alarm — tune periods upward to reduce noise.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Three alarm states">
          <p className="text-slate-300">
            OK (healthy), ALARM (breached), INSUFFICIENT_DATA (not enough metric points — new or idle
            function).
          </p>
        </ContentStep>
        <ContentStep number={5} title="Why SNS sits between alarm and email">
          <p className="text-slate-300">
            One topic fans out to many subscribers — email, Lambda, SMS — without reconfiguring every alarm.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Dashboard vs alarm">
          <p className="text-slate-300">
            Dashboard = human glance during the day. Alarm = automated wake-up when thresholds breach.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What comes next">
        <p className="text-slate-300">
          The next lessons in the CloudWatch track go deeper on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="CloudWatch Logs Insights">
          <p className="text-slate-300">
            SQL-like queries across log groups — filter errors, aggregate by bucket name, chart latency from
            REPORT lines. Replaces manual stream clicking when log volume exceeds a few dozen invocations per
            hour.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Custom metrics">
          <p className="text-slate-300">
            Publish <code className="text-core-400">RowsProcessed</code>,{' '}
            <code className="text-core-400">FilesQuarantined</code>, or{' '}
            <code className="text-core-400">GlueJobLagMinutes</code> with{' '}
            <code className="text-core-400">PutMetricData</code> from Lambda or EC2 — business KPIs on the
            same dashboards as AWS defaults.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CloudWatch Agent on EC2">
          <p className="text-slate-300">
            Memory, disk, and custom log files from Airflow or long-running ETL boxes — metrics EC2 does not
            publish by default. Pairs with the EC2 monitoring lesson you may have seen earlier in the track.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Production patterns">
          <p className="text-slate-300">
            Composite alarms, anomaly detection, cross-account dashboards, log subscription filters to S3 or
            OpenSearch, and wiring SNS to Slack or PagerDuty — scale observability as pipeline count grows.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          CloudWatch connects everything you built so far: IAM roles let functions write logs, Lambda runs
          ingest, S3 holds data, and now you can prove the chain works — or know within minutes when it does
          not. Glue, Step Functions, and EventBridge modules ahead assume you will alarm and dashboard the
          jobs they orchestrate.
        </p>
        <Callout variant="insight">
          Strong CloudWatch beginners do not memorize every statistic on day one. They ask: What metric proves
          success? Where do logs land? Who gets paged? What does the dashboard show at 9 a.m.? Answer those
          four for each critical pipeline before adding fancy queries.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner checklist: verify Lambda metrics, set log retention, SNS topic, Errors alarm, and a dev dashboard with alarm tile.',
          'Run a controlled failure drill in dev to prove SNS and alarm wiring before production depends on it.',
          'Next in CloudWatch track: Logs Insights, custom metrics with PutMetricData, CloudWatch Agent on EC2, and production alerting patterns.',
          'Observability closes the loop on IAM + S3 + Lambda — metrics detect, logs explain, alarms notify, dashboards contextualize.',
        ]}
      />
    </LessonArticle>
  )
}
