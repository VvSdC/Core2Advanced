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

export function CloudwatchLogsMetricFilters() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Count the bad things, then alarm on the count">
        EventBridge reacts to individual events. Sometimes you want a <strong className="text-white">rate</strong>{' '}
        instead: &quot;more than 20 AccessDenied errors in five minutes&quot; or &quot;any root activity at
        all&quot;. Sending the trail to CloudWatch Logs lets metric filters turn matching log lines into CloudWatch
        metrics — and you already know how alarms on metrics notify SNS. This is also how the CIS AWS Foundations
        Benchmark monitoring controls are traditionally implemented.
      </Callout>

      <Definition term="Metric filter">
        <p>
          A pattern attached to a CloudWatch Logs log group. Each ingested log event that matches increments a
          custom metric (for example <code className="text-core-400">CISBenchmark/UnauthorizedAPICalls</code>) by a
          value you choose. For JSON logs like CloudTrail, patterns select fields with{' '}
          <code className="text-core-400">$.fieldName</code> syntax and support equality, wildcards, and boolean
          operators. Filters only apply to events ingested after the filter is created.
        </p>
      </Definition>

      <LessonSection title="Send the trail to CloudWatch Logs">
        <ContentStep number={1} title="IAM role for CloudTrail">
          <p className="text-slate-300">
            Configure the trail with a log group ARN and a role that{' '}
            <code className="text-core-400">cloudtrail.amazonaws.com</code> can assume, granting{' '}
            <code className="text-core-400">logs:CreateLogStream</code> and{' '}
            <code className="text-core-400">logs:PutLogEvents</code> on that log group. For an org trail, the log
            group lives in the management (or delegated admin) account and receives every member account&apos;s
            events.
          </p>
        </ContentStep>
        <Example title="Wire trail to a log group" caption="Log group in the same account and Region as the trail">
{`aws logs create-log-group --log-group-name /cloudtrail/org-trail-prod
aws logs put-retention-policy --log-group-name /cloudtrail/org-trail-prod --retention-in-days 90

aws cloudtrail update-trail --name org-trail-prod \\
  --cloud-watch-logs-log-group-arn arn:aws:logs:us-east-1:111122223333:log-group:/cloudtrail/org-trail-prod:* \\
  --cloud-watch-logs-role-arn arn:aws:iam::111122223333:role/cloudtrail-to-cwlogs`}
        </Example>
        <ContentStep number={2} title="Mind the ingestion bill">
          <p className="text-slate-300">
            CloudWatch Logs charges per GB ingested (on the order of $0.50 per GB for the Standard class in many
            Regions — check current pricing) plus storage. An org trail across dozens of accounts can be many GB
            per day. Set short retention (S3 keeps the long-term copy), and if you add data events to the trail,
            remember they flow to CloudWatch too. Check whether a cheaper log class supports metric filters before
            switching.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="CIS benchmark style filters">
        <ContentStep number={1} title="The classic set">
          <p className="text-slate-300">
            The CIS monitoring controls cover unauthorized API calls, console sign-in without MFA, root account
            usage, IAM policy changes, CloudTrail configuration changes, KMS key disable or scheduled deletion, S3
            bucket policy changes, and network changes. Each is one metric filter plus one alarm.
          </p>
        </ContentStep>
        <Example title="Filter patterns" caption="Use one pattern per metric filter">
{`# Unauthorized API calls
{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") }

# Root account usage (excluding AWS service events)
{ $.userIdentity.type = "Root" && $.userIdentity.invokedBy NOT EXISTS && $.eventType != "AwsServiceEvent" }

# IAM policy changes
{ ($.eventName = PutRolePolicy) || ($.eventName = DeleteRolePolicy) ||
  ($.eventName = AttachRolePolicy) || ($.eventName = DetachRolePolicy) ||
  ($.eventName = CreatePolicy) || ($.eventName = DeletePolicy) ||
  ($.eventName = CreatePolicyVersion) || ($.eventName = SetDefaultPolicyVersion) }

# CloudTrail configuration changes
{ ($.eventName = CreateTrail) || ($.eventName = UpdateTrail) || ($.eventName = DeleteTrail) ||
  ($.eventName = StartLogging) || ($.eventName = StopLogging) }

# KMS key disabled or scheduled for deletion
{ ($.eventSource = kms.amazonaws.com) && (($.eventName = DisableKey) || ($.eventName = ScheduleKeyDeletion)) }`}
        </Example>
        <Example title="Filter plus alarm to SNS" caption="Unauthorized API calls, more than 20 in 5 minutes">
{`aws logs put-metric-filter \\
  --log-group-name /cloudtrail/org-trail-prod \\
  --filter-name unauthorized-api-calls \\
  --filter-pattern '{ ($.errorCode = "*UnauthorizedOperation") || ($.errorCode = "AccessDenied*") }' \\
  --metric-transformations metricName=UnauthorizedAPICalls,metricNamespace=CISBenchmark,metricValue=1

aws cloudwatch put-metric-alarm \\
  --alarm-name cis-unauthorized-api-calls \\
  --namespace CISBenchmark --metric-name UnauthorizedAPICalls \\
  --statistic Sum --period 300 --evaluation-periods 1 \\
  --threshold 20 --comparison-operator GreaterThanThreshold \\
  --treat-missing-data notBreaching \\
  --alarm-actions arn:aws:sns:us-east-1:111122223333:de-alerts-prod`}
        </Example>
        <Flowchart
          title="Metric filter alerting path"
          chart={`flowchart LR
  TRAIL[org-trail-prod]
  LG[Log group cloudtrail org-trail-prod]
  MF[Metric filter]
  MET[CISBenchmark metric]
  AL[CloudWatch alarm]
  SNS[SNS de-alerts-prod]
  TRAIL --> LG
  LG --> MF
  MF --> MET
  MET --> AL
  AL --> SNS`}
        />
        <Callout variant="info">
          AWS Security Hub&apos;s CIS standard checks that these filters and alarms exist. Many teams now implement
          the same detections with EventBridge rules instead — both are valid; auditors care that the detection
          exists and routes to a human.
        </Callout>
      </LessonSection>

      <LessonSection title="Logs Insights for ad hoc investigation">
        <ContentStep number={1} title="Fast queries over recent events">
          <p className="text-slate-300">
            For the last few days, Logs Insights is often quicker than Athena: no table, fields auto-discovered
            from JSON, results in seconds. Scans are billed per GB, so narrow the time range.
          </p>
        </ContentStep>
        <Example title="Logs Insights queries" caption="Run against /cloudtrail/org-trail-prod">
{`# Who is getting AccessDenied, and on what?
fields @timestamp, userIdentity.arn, eventSource, eventName, errorCode
| filter errorCode like /AccessDenied|UnauthorizedOperation/
| stats count(*) as denied by userIdentity.arn, eventName
| sort denied desc
| limit 20

# Every Glue catalog change in the window
fields @timestamp, userIdentity.arn, eventName, requestParameters.databaseName, requestParameters.name
| filter eventSource = "glue.amazonaws.com" and eventName like /Create|Update|Delete/
| sort @timestamp desc`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Deliver the trail to CloudWatch Logs with an IAM role CloudTrail assumes for CreateLogStream and PutLogEvents.',
          'Metric filters turn matching JSON events into metrics — errorCode AccessDenied, Root usage, IAM and CloudTrail changes.',
          'CIS benchmark monitoring is one filter plus one alarm per control, routed to SNS de-alerts-prod.',
          'Logs Insights answers recent questions fast; Athena over S3 handles long history.',
          'Ingestion cost is real — short retention in Logs, long retention in S3, and watch data events.',
        ]}
      />
    </LessonArticle>
  )
}
