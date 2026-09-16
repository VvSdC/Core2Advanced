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

export function MonitoringEventbridge() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Silent rule failures mean files land with no processing">
        EventBridge delivers events asynchronously — target IAM errors, throttled Lambda, or misconfigured
        patterns fail quietly unless you monitor{' '}
        <strong className="text-white">FailedInvocations</strong>, dead-letter queues, and target health in{' '}
        <strong className="text-white">CloudWatch</strong>. Data engineering on-call treats EventBridge metrics
        like Glue job failure alarms.
      </Callout>

      <Definition term="EventBridge observability">
        <p>
          CloudWatch namespace <span className="font-mono text-sm">AWS/Events</span> publishes per-rule metrics:
          Invocations, FailedInvocations, TriggeredRules, and matched events. Targets attach DLQs whose depth
          alarms complement rule metrics. Archive retention provides forensic replay when metrics show gaps.
        </p>
      </Definition>

      <LessonSection title="Core CloudWatch metrics">
        <ContentStep number={1} title="FailedInvocations">
          <p className="text-slate-300">
            Count of target delivery failures after retries — IAM deny on Lambda invoke, invalid Step Functions
            ARN, KMS key policy block. Alarm threshold greater than zero on ingest rules pages ops immediately.
            Most common root cause: target execution role or resource policy missing{' '}
            <span className="font-mono text-sm">lambda:InvokeFunction</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Invocations and TriggeredRules">
          <p className="text-slate-300">
            Invocations = successful target calls. Compare to S3 PUT rate or expected schedule — zero invocations
            during business hours while files land indicates pattern mismatch or disabled rule, not target
            failure. TriggeredRules counts rule matches — debug filter too narrow vs too broad.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DeadLetterInvocations">
          <p className="text-slate-300">
            Events sent to configured DLQ after exhausting retries. Pair with SQS{' '}
            <span className="font-mono text-sm">ApproximateNumberOfMessagesVisible</span> alarm — dual signal
            ensures DLQ permission issues on EventBridge side also surface.
          </p>
        </ContentStep>
        <Flowchart
          title="Monitoring stack for ingest rule"
          chart={`flowchart TB
  RULE[EventBridge ingest rule]
  TGT[Lambda target]
  MET[CloudWatch AWS Events metrics]
  ALM1[Alarm FailedInvocations gt 0]
  ALM2[Alarm Invocations anomaly]
  DLQ[(SQS DLQ)]
  ALM3[Alarm DLQ depth gt 0]
  SNS[SNS ops Slack]
  LOG[CloudWatch Logs target optional]
  RULE --> TGT
  RULE --> MET
  MET --> ALM1
  MET --> ALM2
  TGT -->|fail| DLQ
  DLQ --> ALM3
  ALM1 --> SNS
  ALM2 --> SNS
  ALM3 --> SNS
  RULE --> LOG`}
        />
      </LessonSection>

      <LessonSection title="DLQ monitoring and runbooks">
        <ContentStep number={1} title="DLQ alarm configuration">
          <p className="text-slate-300">
            Standard queue per critical rule; 14-day retention minimum. Alarm on visible messages greater than
            zero for 1 minute — include rule name and environment in SNS message via alarm description. Separate
            DLQs for ingest vs ops-notification rules — different runbooks.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Triage steps">
          <p className="text-slate-300">
            Sample DLQ message — full event JSON with id and time. Check Lambda logs for same timestamp. Verify
            rule enabled, target ARN correct version/alias, execution role trust policy. Re-drive: delete after
            fix or use replay from archive for batch recovery.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Ingest-specific signals">
          <p className="text-slate-300">
            Compare S3 <span className="font-mono text-sm">NumberOfObjects</span> or access log PUT count to rule
            Invocations — divergence means EventBridge notification disabled on bucket or prefix filter wrong.
            Glue FAILED rules should never share DLQ with ingest — ops noise hides data gaps.
          </p>
        </ContentStep>
        <Example title="CloudWatch alarm — FailedInvocations on ingest rule">
{`Namespace: AWS/Events
Metric: FailedInvocations
Dimensions: RuleName= s3-raw-ingest-prod
Statistic: Sum
Period: 300 seconds
Threshold: >= 1
Action: SNS arn:aws:sns:...:data-platform-ops

Companion alarm:
Metric: ApproximateNumberOfMessagesVisible on eventbridge-ingest-dlq
Threshold: >= 1`}
        </Example>
      </LessonSection>

      <LessonSection title="Dashboard and logging">
        <ContentStep number={1} title="Pipeline dashboard widgets">
          <p className="text-slate-300">
            Single pane: ingest rule Invocations/FailedInvocations, DLQ depth, Lambda Errors/Duration, Glue
            job Failed count, S3 landing PUT rate. Annotate deployments — correlate FailedInvocations spike with
            IAM policy change.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logs Insights">
          <p className="text-slate-300">
            Optional CloudWatch Logs target on bus copies events for query — find all Object Created for key
            prefix during incident window. Lambda logs should include EventBridge{' '}
            <span className="font-mono text-sm">id</span> field for cross-link.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Enable EventBridge logging (CloudTrail data events for PutEvents on custom buses) in regulated
          environments — who published forged pipeline-complete events is an audit question.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Alarm FailedInvocations on every critical rule — silent IAM/ARN failures block ingest without S3 errors.',
          'Compare Invocations to S3 PUT rate — zero invocations with landing files = pattern or notification issue.',
          'DLQ depth alarm per rule; separate ingest vs ops DLQs; 14-day retention minimum.',
          'Dashboard: FailedInvocations + DLQ + Lambda Errors + Glue Failed + S3 PUT for end-to-end visibility.',
          'Triage DLQ sample event → Lambda logs → role/ARN; recover via archive replay after fix.',
        ]}
      />
    </LessonArticle>
  )
}
