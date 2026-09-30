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

export function LogFileIntegrityAndEncryption() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="An audit log you cannot trust is just a text file">
        The first thing a careful attacker does after stealing admin credentials is cover their tracks —
        delete log files, edit out the <code className="text-core-400">GetObject</code> calls on the gold
        bucket, or stop the trail. Auditors ask the same question from the other side: &quot;How do you know these
        logs were not altered?&quot; CloudTrail answers with{' '}
        <strong className="text-white">digest files</strong>, <strong className="text-white">SSE-KMS</strong>,
        and a bucket that nobody in the workload account can touch.
      </Callout>

      <Definition term="Log file integrity validation">
        <p>
          When enabled on a trail, CloudTrail delivers an hourly <strong className="text-white">digest
          file</strong> that lists the SHA-256 hash of every log file delivered in that hour, plus the hash of the
          previous digest. Each digest is signed with a CloudTrail-held private key (SHA-256 with RSA). The chain
          of digests lets you prove a log file was not modified, deleted, or inserted after delivery.
        </p>
      </Definition>

      <LessonSection title="Digest files and validate-logs">
        <ContentStep number={1} title="How the chain works">
          <p className="text-slate-300">
            Digests land under <code className="text-core-400">AWSLogs/111122223333/CloudTrail-Digest/us-east-1/</code>{' '}
            next to the log files. Because each digest references the previous one, deleting a digest breaks the
            chain; changing a log file changes its hash; removing a log file leaves a hash with no matching object.
            Enable it at creation with <code className="text-core-400">--enable-log-file-validation</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Run validation on a schedule and during incidents">
          <p className="text-slate-300">
            The CLI command fetches the public keys, walks the digest chain, and re-hashes each log file. Run it
            weekly from the security account and always before handing evidence to legal or auditors. Validation
            needs read access to the bucket and decrypt on the trail KMS key.
          </p>
        </ContentStep>
        <Example title="Validate a week of logs" caption="Reports valid, invalid, and missing files">
{`aws cloudtrail validate-logs \\
  --trail-arn arn:aws:cloudtrail:us-east-1:111122223333:trail/org-trail-prod \\
  --start-time 2026-09-23T00:00:00Z \\
  --end-time 2026-09-30T00:00:00Z \\
  --verbose

# Results requested for 2026-09-23T00:00:00Z to 2026-09-30T00:00:00Z
# Results found for 2026-09-23T00:30:26Z to 2026-09-29T23:30:26Z:
# 168/168 digest files valid
# 5210/5210 log files valid`}
        </Example>
        <Callout variant="info">
          Validation proves integrity, not completeness of what CloudTrail recorded. If someone ran{' '}
          <code className="text-core-400">StopLogging</code>, the gap is valid — which is why StopLogging itself
          must alert (covered in the EventBridge lesson).
        </Callout>
      </LessonSection>

      <LessonSection title="SSE-KMS with a dedicated key">
        <ContentStep number={1} title="Why not just SSE-S3">
          <p className="text-slate-300">
            Trail logs are encrypted with SSE-S3 by default. Switching to SSE-KMS with a dedicated customer managed
            key adds a second gate: reading a log requires both <code className="text-core-400">s3:GetObject</code>{' '}
            and <code className="text-core-400">kms:Decrypt</code>, and every decrypt is itself logged. A data
            engineer with broad S3 read in the archive account still cannot read audit logs without key access.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Key policy for CloudTrail">
          <p className="text-slate-300">
            The key (in the same Region as the bucket) must let CloudTrail call{' '}
            <code className="text-core-400">kms:GenerateDataKey*</code> and{' '}
            <code className="text-core-400">kms:DescribeKey</code>, conditioned on the trail ARN and the CloudTrail
            encryption context. Readers — the security Athena role, the validation job — get{' '}
            <code className="text-core-400">kms:Decrypt</code> only. Per AWS docs, digest files are encrypted with
            SSE-S3 even when the trail uses SSE-KMS.
          </p>
        </ContentStep>
        <Example title="Trail CMK key policy statements" caption="Key alias/cloudtrail-org-trail in the log-archive account">
{`{
  "Sid": "AllowCloudTrailEncryptLogs",
  "Effect": "Allow",
  "Principal": { "Service": "cloudtrail.amazonaws.com" },
  "Action": "kms:GenerateDataKey*",
  "Resource": "*",
  "Condition": {
    "StringEquals": {
      "aws:SourceArn": "arn:aws:cloudtrail:us-east-1:111122223333:trail/org-trail-prod"
    },
    "StringLike": {
      "kms:EncryptionContext:aws:cloudtrail:arn": "arn:aws:cloudtrail:*:111122223333:trail/*"
    }
  }
},
{
  "Sid": "AllowSecurityAnalystsDecrypt",
  "Effect": "Allow",
  "Principal": { "AWS": "arn:aws:iam::444455556666:role/security-log-reader" },
  "Action": "kms:Decrypt",
  "Resource": "*",
  "Condition": {
    "StringLike": {
      "kms:EncryptionContext:aws:cloudtrail:arn": "arn:aws:cloudtrail:*:111122223333:trail/*"
    }
  }
}`}
        </Example>
      </LessonSection>

      <LessonSection title="Tamper-resistant bucket">
        <ContentStep number={1} title="Versioning, Object Lock, MFA delete">
          <p className="text-slate-300">
            Enable versioning so overwrites keep the original. Add <strong className="text-white">S3 Object
            Lock</strong> in compliance mode with a retention period matching policy (for example 400 days) —
            not even the root user can delete locked versions early. MFA delete adds a root-MFA requirement to
            permanently delete versions or change versioning state.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Restrictive bucket policy">
          <p className="text-slate-300">
            Beyond the CloudTrail write statements, deny <code className="text-core-400">s3:DeleteObject</code>,{' '}
            <code className="text-core-400">s3:PutBucketPolicy</code>, and{' '}
            <code className="text-core-400">s3:PutLifecycleConfiguration</code> to everyone except a break-glass
            role, deny non-TLS requests, and grant read only to the security reader role. Lifecycle transitions to
            Glacier are fine; lifecycle expiration shorter than retention is not.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separate account is the real control">
          <p className="text-slate-300">
            All of this lives in the log-archive account. The analytics account that runs Glue, Athena, and
            Redshift has zero permissions on the bucket or key. Compromise of the workload account — even full
            admin — cannot reach the evidence.
          </p>
        </ContentStep>
        <Flowchart
          title="Layers protecting trail logs"
          chart={`flowchart TB
  TRAIL[org-trail-prod]
  KMS[Dedicated CMK SSE-KMS]
  S3[(acme-cloudtrail-logs-archive)]
  DIG[Hourly digest files]
  LOCK[Object Lock compliance mode]
  POL[Deny delete bucket policy]
  VAL[validate-logs job]
  TRAIL --> KMS
  KMS --> S3
  TRAIL --> DIG
  DIG --> S3
  S3 --> LOCK
  S3 --> POL
  VAL -->|verifies chain| S3`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Log file integrity validation writes hourly signed digest files chaining SHA-256 hashes of every log file.',
          'aws cloudtrail validate-logs proves logs were not modified or deleted — run it on a schedule and before sharing evidence.',
          'Encrypt trail logs with SSE-KMS using a dedicated CMK; reading logs then needs both S3 read and kms:Decrypt.',
          'Versioning, Object Lock compliance mode, MFA delete, and deny-delete policies make the bucket tamper-resistant.',
          'Keep bucket and key in a separate log-archive account so workload admins cannot erase evidence.',
        ]}
      />
    </LessonArticle>
  )
}
