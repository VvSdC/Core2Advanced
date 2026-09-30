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

export function SystemsManagerSecurityAndIam() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A shell on a prod ETL host can read every secret that host can read">
        Session Manager removes SSH keys and open ports, but it does not remove risk: whoever can start a session
        or send a command to a prod worker inherits that worker&apos;s IAM role — access to{' '}
        <code className="text-core-400">acme-lake-prod</code>, <code className="text-core-400">orders-db-prod</code>{' '}
        credentials, and more. This lesson locks down who can do what, where session data goes, how traffic
        stays private, and what the audit trail actually captures.
      </Callout>

      <Definition term="CloudTrail events vs session logs">
        <p>
          <strong className="text-white">CloudTrail</strong> records Systems Manager API calls —{' '}
          <code className="text-core-400">StartSession</code>, <code className="text-core-400">TerminateSession</code>,{' '}
          <code className="text-core-400">SendCommand</code> — with who, when, and which target and document.
          It does <strong className="text-white">not</strong> record what was typed inside a session.{' '}
          <strong className="text-white">Session logging</strong>, configured in Session Manager preferences,
          streams the session transcript to S3 and/or CloudWatch Logs. You need both for a complete audit story.
        </p>
      </Definition>

      <LessonSection title="Least-privilege IAM for sessions and commands">
        <ContentStep number={1} title="Scope by tag and document">
          <p className="text-slate-300">
            Allow <code className="text-core-400">ssm:StartSession</code> on instances only where{' '}
            <code className="text-core-400">ssm:resourceTag/Env</code> matches the engineer&apos;s environment,
            and only with the documents they need (shell for dev, port forwarding for prod jump hosts). Set{' '}
            <code className="text-core-400">ssm:SessionDocumentAccessCheck</code> so the document restriction is
            enforced even for default shell sessions.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Deny prod commands except on-call">
          <p className="text-slate-300">
            Put a guardrail deny in an SCP or permission boundary: no <code className="text-core-400">SendCommand</code>{' '}
            or <code className="text-core-400">StartSession</code> on <code className="text-core-400">Env=prod</code>{' '}
            instances unless the caller is the on-call role. Explicit deny beats any allow granted elsewhere.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Run As instead of ssm-user">
          <p className="text-slate-300">
            By default sessions run as <code className="text-core-400">ssm-user</code>, which has sudo on Linux.
            Enable Run As and tag IAM principals with <code className="text-core-400">SSMSessionRunAs</code> (for
            example <code className="text-core-400">etl-readonly</code>) so sessions start as a limited OS user.
            For elevated prod access, just-in-time node access adds request-and-approve workflows (a separately
            priced feature — check pricing).
          </p>
        </ContentStep>
        <Example title="Guardrail — prod commands only for on-call" caption="Attach as SCP or permission boundary; ARN pattern matches an Identity Center role">
{`{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "DenyProdNodeAccessExceptOnCall",
      "Effect": "Deny",
      "Action": ["ssm:SendCommand", "ssm:StartSession"],
      "Resource": "arn:aws:ec2:*:111122223333:instance/*",
      "Condition": {
        "StringEquals": { "ssm:resourceTag/Env": "prod" },
        "ArnNotLike": {
          "aws:PrincipalArn": "arn:aws:iam::111122223333:role/aws-reserved/sso.amazonaws.com/*AWSReservedSSO_DataOnCall_*"
        }
      }
    },
    {
      "Sid": "AllowDevShellSessions",
      "Effect": "Allow",
      "Action": "ssm:StartSession",
      "Resource": "arn:aws:ec2:*:111122223333:instance/*",
      "Condition": {
        "StringEquals": { "ssm:resourceTag/Env": "dev" },
        "BoolIfExists": { "ssm:SessionDocumentAccessCheck": "true" }
      }
    }
  ]
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Session Manager preferences">
        <ContentStep number={1} title="Logging, encryption, timeouts">
          <p className="text-slate-300">
            Preferences live in the <code className="text-core-400">SSM-SessionManagerRunShell</code> document per
            Region. Send transcripts to an S3 bucket and a CloudWatch Logs group (both encrypted), encrypt the
            session data stream itself with a KMS key, set an idle timeout and a maximum session duration, and
            enable Run As. KMS session encryption means users need{' '}
            <code className="text-core-400">kms:GenerateDataKey</code> and instance roles need{' '}
            <code className="text-core-400">kms:Decrypt</code> on the key.
          </p>
        </ContentStep>
        <Example title="SSM-SessionManagerRunShell preferences" caption="Port-forwarding and SSH-over-SSM sessions are not transcribed">
{`{
  "schemaVersion": "1.0",
  "description": "Session preferences for the acme data platform",
  "sessionType": "Standard_Stream",
  "inputs": {
    "s3BucketName": "acme-ssm-session-logs-prod",
    "s3KeyPrefix": "sessions/",
    "s3EncryptionEnabled": true,
    "cloudWatchLogGroupName": "/ssm/sessions/prod",
    "cloudWatchEncryptionEnabled": true,
    "cloudWatchStreamingEnabled": true,
    "kmsKeyId": "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab",
    "idleSessionTimeout": "20",
    "maxSessionDuration": "120",
    "runAsEnabled": true,
    "runAsDefaultUser": "etl-readonly",
    "shellProfile": { "linux": "cd /opt/etl && exec bash", "windows": "" }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Private networking with VPC endpoints">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Endpoint</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['com.amazonaws.region.ssm', 'Interface', 'Agent registration and core Systems Manager API'],
                ['com.amazonaws.region.ssmmessages', 'Interface', 'Session channels; agent messaging on agent 3.3.40+'],
                ['com.amazonaws.region.ec2messages', 'Interface', 'Older agents in pre-2024 Regions; optional on current agents'],
                ['com.amazonaws.region.s3', 'Gateway', 'Session logs, command output, OS package repos'],
                ['com.amazonaws.region.logs', 'Interface', 'CloudWatch session logs and command output'],
                ['com.amazonaws.region.kms', 'Interface', 'KMS session encryption and encrypted log destinations'],
              ].map(([endpoint, type, why]) => (
                <tr key={endpoint} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{endpoint}</td>
                  <td className="px-4 py-3">{type}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="No NAT, no internet path">
          <p className="text-slate-300">
            With these endpoints (private DNS enabled, security group allowing 443 from the VPC), private ETL
            subnets need no NAT gateway for Systems Manager. Add endpoint policies to restrict which accounts or
            buckets are reachable — the same data-perimeter thinking from the VPC and KMS sub-topics.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The audit trail end to end">
        <Flowchart
          title="What gets recorded when an engineer opens a session"
          chart={`flowchart LR
  ENG[Engineer via Identity Center]
  API[StartSession API call]
  CT[CloudTrail event who when target]
  SESS[Session data stream KMS encrypted]
  S3[(S3 session logs bucket)]
  CWL[CloudWatch Logs group]
  ATH[Athena over CloudTrail and logs]
  ENG --> API
  API --> CT
  API --> SESS
  SESS --> S3
  SESS --> CWL
  CT --> ATH
  S3 --> ATH`}
        />
        <Callout variant="insight">
          Query CloudTrail in Athena (from the CloudTrail sub-topic) for <code className="text-core-400">StartSession</code>{' '}
          and <code className="text-core-400">SendCommand</code> against <code className="text-core-400">Env=prod</code>{' '}
          targets, then pull the matching transcript from S3 by session ID. That pairing answers &quot;who ran what
          on the prod worker last night&quot; in minutes.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Restrict StartSession and SendCommand by ssm:resourceTag and by document; enforce with SessionDocumentAccessCheck.',
          'Use SCP or boundary denies so only the on-call role can touch Env=prod nodes.',
          'Session preferences: S3 and CloudWatch logging, KMS encryption, idle timeout, max duration, Run As.',
          'VPC endpoints for ssm and ssmmessages (ec2messages only for older agents), plus s3, logs, and kms, remove the need for NAT.',
          'CloudTrail shows who started sessions and commands; session logs show what was typed — you need both.',
        ]}
      />
    </LessonArticle>
  )
}
