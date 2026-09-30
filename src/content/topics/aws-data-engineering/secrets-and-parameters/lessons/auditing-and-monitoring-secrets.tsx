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

export function AuditingAndMonitoringSecrets() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Know who opened the vault, and hear about it when rotation breaks">
        Storing secrets well is not the end. You also need answers to &quot;who read the prod orders password
        last week?&quot;, &quot;did last night&apos;s rotation actually succeed?&quot;, and &quot;which secrets
        has nobody touched in six months?&quot; CloudTrail, EventBridge, CloudWatch, and AWS Config give you
        those answers — and a runbook tells you what to do when a key leaks anyway.
      </Callout>

      <Definition term="Secrets observability">
        <p>
          The combination of an <strong className="text-white">audit trail</strong> (CloudTrail records of every
          Secrets Manager and SSM API call), <strong className="text-white">alerts</strong> (EventBridge rules and
          CloudWatch alarms on rotation failures or unusual access), and{' '}
          <strong className="text-white">compliance checks</strong> (AWS Config rules for rotation and unused
          secrets). None of these ever contain the secret value itself.
        </p>
      </Definition>

      <LessonSection title="CloudTrail — the audit trail">
        <ContentStep number={1} title="What gets recorded">
          <p className="text-slate-300">
            Secrets Manager logs <code className="text-core-400">GetSecretValue</code>,{' '}
            <code className="text-core-400">PutSecretValue</code>, <code className="text-core-400">RotateSecret</code>,{' '}
            <code className="text-core-400">DeleteSecret</code>, and policy changes as CloudTrail events with the
            caller identity, source IP, time, and secret ID. SSM logs{' '}
            <code className="text-core-400">GetParameter</code> and friends the same way. The secret value is never
            in the event — the response elements are omitted.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rotation lifecycle events">
          <p className="text-slate-300">
            Secrets Manager also emits service events such as{' '}
            <code className="text-core-400">RotationStarted</code>,{' '}
            <code className="text-core-400">RotationSucceeded</code>, and{' '}
            <code className="text-core-400">RotationFailed</code>. These flow to EventBridge, so you can route
            them like any other pipeline event.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query access with Athena">
          <p className="text-slate-300">
            With a trail delivering to S3 and a CloudTrail table in Athena, &quot;who read{' '}
            <code className="text-core-400">de/prod/rds/orders-reader</code> in the last 30 days&quot; becomes a
            SQL query. Unexpected principals — a developer&apos;s SSO role instead of the Glue role — are worth
            investigating.
          </p>
        </ContentStep>
        <Example title="Athena — who read the orders secret" caption="Assumes a cloudtrail_logs table over the trail bucket">
{`SELECT eventtime,
       useridentity.arn AS caller,
       sourceipaddress,
       json_extract_scalar(requestparameters, '$.secretId') AS secret_id
FROM cloudtrail_logs
WHERE eventsource = 'secretsmanager.amazonaws.com'
  AND eventname = 'GetSecretValue'
  AND json_extract_scalar(requestparameters, '$.secretId') LIKE '%orders-reader%'
  AND eventtime > to_iso8601(current_timestamp - interval '30' day)
ORDER BY eventtime DESC;`}
        </Example>
      </LessonSection>

      <LessonSection title="Alerts — rotation failures and unusual access">
        <ContentStep number={1} title="EventBridge rule on RotationFailed">
          <p className="text-slate-300">
            A failed rotation leaves AWSCURRENT unchanged, so nothing breaks immediately — which is exactly why it
            goes unnoticed for months. Route <code className="text-core-400">RotationFailed</code> to an SNS topic
            the on-call data platform team subscribes to.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CloudWatch alarms">
          <p className="text-slate-300">
            Use a CloudWatch Logs metric filter on the trail log group to count{' '}
            <code className="text-core-400">GetSecretValue</code> calls or AccessDenied errors per secret, and
            alarm on spikes. Alarm on errors in the rotation Lambda itself, and watch API usage metrics for
            throttling as call volume grows.
          </p>
        </ContentStep>
        <Flowchart
          title="Rotation failure alerting"
          chart={`flowchart LR
  SM[Secrets Manager rotation]
  EB[EventBridge rule]
  SNS[SNS topic de-oncall]
  CW[CloudWatch alarm]
  LAM[Rotation Lambda errors]
  ONC[On-call engineer]
  SM -->|RotationFailed event| EB
  EB --> SNS
  LAM --> CW
  CW --> SNS
  SNS --> ONC`}
        />
        <Example title="EventBridge event pattern" caption="Target: SNS topic de-oncall">
{`{
  "source": ["aws.secretsmanager"],
  "detail-type": ["AWS Service Event via CloudTrail"],
  "detail": {
    "eventSource": ["secretsmanager.amazonaws.com"],
    "eventName": ["RotationFailed", "RotationAbandoned"]
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Compliance, cleanup, and leak detection">
        <ContentStep number={1} title="AWS Config managed rules">
          <p className="text-slate-300">
            <code className="text-core-400">secretsmanager-rotation-enabled-check</code> flags secrets without
            rotation; <code className="text-core-400">secretsmanager-scheduled-rotation-success-check</code> flags
            rotations that did not complete; <code className="text-core-400">secretsmanager-secret-unused</code>{' '}
            flags secrets not accessed within a set number of days. Aggregate results across accounts for a
            single compliance view.
          </p>
        </ContentStep>
        <ContentStep number={2} title="LastAccessedDate for cleanup">
          <p className="text-slate-300">
            <code className="text-core-400">DescribeSecret</code> and <code className="text-core-400">ListSecrets</code>{' '}
            return <code className="text-core-400">LastAccessedDate</code> (day precision). Secrets from retired
            pipelines are both cost and risk: confirm the owner tag, then delete with a recovery window (7 to 30
            days) so a mistaken deletion can be restored.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Catch secrets before they land">
          <p className="text-slate-300">
            Pre-commit tools such as <code className="text-core-400">git-secrets</code> and GitHub secret scanning
            with push protection stop credentials entering repositories. Amazon Macie can detect credentials in
            S3 objects — useful when someone exports a config file into the landing bucket.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Runbook for a leaked credential">
          <p className="text-slate-300">
            <strong className="text-white">Rotate first, investigate second.</strong> Immediately run{' '}
            <code className="text-core-400">RotateSecret</code> (or deactivate a leaked IAM access key) so the
            exposed value stops working. Then use CloudTrail and database audit logs to see what the credential
            accessed, remove it from Git history and logs, check for downstream copies, and write up how it
            escaped.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Practise the leak runbook in staging: rotate de/staging/rds/orders-reader on demand and confirm every
          Glue job and Lambda recovers on its own. If something breaks, you found a hardcoded copy.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail records who called GetSecretValue, PutSecretValue, and RotateSecret — never the value.',
          'Route RotationFailed events through EventBridge to SNS; silent rotation failures are common.',
          'AWS Config rules check rotation enabled, rotation success, and unused secrets across accounts.',
          'LastAccessedDate plus owner tags drive safe cleanup with a deletion recovery window.',
          'Leaked credential runbook: rotate or revoke first, then investigate with CloudTrail and scrub copies.',
        ]}
      />
    </LessonArticle>
  )
}
