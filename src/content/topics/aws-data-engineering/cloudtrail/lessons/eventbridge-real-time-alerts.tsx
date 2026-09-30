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

export function EventbridgeRealTimeAlerts() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena tells you what happened yesterday — EventBridge tells you now">
        If someone makes <code className="text-core-400">acme-lake-prod</code> public at 2 a.m., finding it in
        tomorrow&apos;s Athena report is too late. CloudTrail also emits management events to Amazon EventBridge
        within seconds to minutes, so a rule can page the data team, revert the change with Lambda, or pause a
        risky action for approval — the same EventBridge you used for pipeline triggers, now used for security.
      </Callout>

      <Definition term="AWS API Call via CloudTrail">
        <p>
          The EventBridge <code className="text-core-400">detail-type</code> for API calls recorded by CloudTrail.
          These events arrive on the <strong className="text-white">default event bus</strong> in the Region where
          the call was made, with <code className="text-core-400">source</code> set to the service (for example{' '}
          <code className="text-core-400">aws.s3</code>) and the full CloudTrail record in{' '}
          <code className="text-core-400">detail</code>. Console sign-ins use a separate detail-type,{' '}
          <code className="text-core-400">AWS Console Sign In via CloudTrail</code>. Global services such as IAM
          emit in <code className="text-core-400">us-east-1</code>.
        </p>
      </Definition>

      <LessonSection title="How CloudTrail events reach EventBridge">
        <ContentStep number={1} title="Prerequisites and scope">
          <p className="text-slate-300">
            A trail with logging enabled is required for API call events to be delivered. Write management events
            flow by default; read-only events (Get, List, Describe) need a rule that explicitly opts into all
            CloudTrail management events, and S3 object-level events arrive only if the trail logs those data
            events. Delivery is best effort — keep S3 as the system of record.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-account routing">
          <p className="text-slate-300">
            In an organization, each workload account forwards matching events to a central security event bus in
            the security account (cross-account bus policy scoped by <code className="text-core-400">aws:PrincipalOrgID</code>).
            Rules there fan out to SNS, Lambda, and Step Functions. Deploy the forwarding rule to every Region with
            StackSets, including IAM rules in us-east-1.
          </p>
        </ContentStep>
        <Flowchart
          title="Real-time CloudTrail alerting"
          chart={`flowchart LR
  API[Risky API call]
  CT[CloudTrail]
  EB[Default event bus]
  SEC[Central security bus]
  SNS[SNS de-alerts-prod]
  LAM[Remediation Lambda]
  SFN[Step Functions approval]
  API --> CT
  CT --> EB
  EB -->|forward rule| SEC
  SEC --> SNS
  SEC --> LAM
  SEC --> SFN`}
        />
      </LessonSection>

      <LessonSection title="Event patterns for a data platform">
        <Example title="Bucket policy changed on the lake bucket" caption="Also add DeleteBucketPolicy and DeletePublicAccessBlock">
{`{
  "source": ["aws.s3"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["s3.amazonaws.com"],
    "eventName": ["PutBucketPolicy", "DeleteBucketPolicy", "DeletePublicAccessBlock"],
    "requestParameters": { "bucketName": ["acme-lake-prod"] }
  }
}`}
        </Example>
        <Example title="Glue table deleted and KMS key scheduled for deletion" caption="Two rules, or one rule with $or">
{`{
  "source": ["aws.glue"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventName": ["DeleteTable", "BatchDeleteTable", "DeleteDatabase"],
    "requestParameters": { "databaseName": ["silver", "gold"] }
  }
}

{
  "source": ["aws.kms"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": { "eventName": ["ScheduleKeyDeletion", "DisableKey"] }
}`}
        </Example>
        <Example title="Audit trail tampering and console login without MFA" caption="StopLogging should always page someone">
{`{
  "source": ["aws.cloudtrail"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventName": ["StopLogging", "DeleteTrail", "UpdateTrail", "PutEventSelectors"]
  }
}

{
  "source": ["aws.signin"],
  "detail-type": ["AWS Console Sign In via CloudTrail"],
  "detail": {
    "eventName": ["ConsoleLogin"],
    "additionalEventData": { "MFAUsed": ["No"] }
  }
}`}
        </Example>
        <Callout variant="tip">
          Use input transformers to send a short human message to SNS — caller ARN, event name, bucket or table,
          source IP — instead of dumping the full JSON into the on-call inbox.
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing targets">
        <ContentStep number={1} title="SNS de-alerts-prod for awareness">
          <p className="text-slate-300">
            Every rule targets <code className="text-core-400">de-alerts-prod</code>, which fans out to email,
            chat, and the paging tool. Glue <code className="text-core-400">DeleteTable</code> on{' '}
            <code className="text-core-400">silver.orders</code> during business hours may be a planned migration —
            a human decides.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Lambda for auto-remediation">
          <p className="text-slate-300">
            Some changes are never acceptable: <code className="text-core-400">StopLogging</code> on{' '}
            <code className="text-core-400">org-trail-prod</code> gets an immediate{' '}
            <code className="text-core-400">StartLogging</code>; <code className="text-core-400">DeletePublicAccessBlock</code>{' '}
            on the lake bucket gets the block re-applied. Make remediation idempotent, log what it did, and exclude
            the remediation role from the rule to avoid loops.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Step Functions for approval">
          <p className="text-slate-300">
            For gray areas — a KMS <code className="text-core-400">ScheduleKeyDeletion</code> still in its waiting
            period — start a state machine that notifies the key owner and waits for a callback token. No approval
            within the window triggers <code className="text-core-400">CancelKeyDeletion</code>.
          </p>
        </ContentStep>
        <Example title="Remediation Lambda sketch" caption="Re-enable the trail if anyone stops it">
{`import boto3
ct = boto3.client('cloudtrail')

def handler(event, context):
    detail = event['detail']
    trail = detail['requestParameters']['name']
    caller = detail['userIdentity']['arn']
    if 'break-glass' in caller:
        return 'allowed'
    ct.start_logging(Name=trail)
    return f'restarted {trail} stopped by {caller}'`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail API calls reach the default event bus as detail-type AWS API Call via CloudTrail, in the Region of the call.',
          'Match on source, eventName, and requestParameters such as bucketName or databaseName to target lake resources.',
          'Always alert on StopLogging, DeleteTrail, ScheduleKeyDeletion, public bucket changes, and console logins without MFA.',
          'SNS de-alerts-prod for awareness, Lambda for safe idempotent auto-remediation, Step Functions for approvals.',
          'Forward events from every account and Region to a central security bus; S3 remains the system of record.',
        ]}
      />
    </LessonArticle>
  )
}
