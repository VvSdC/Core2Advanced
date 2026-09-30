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

export function AuditingKmsWithCloudtrail() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="KMS turns &quot;who read the data?&quot; into a query">
        S3 access logs tell you an object was fetched. KMS tells you something stronger: every time a principal
        unwrapped a data key for an SSE-KMS object, there is a CloudTrail record naming the principal, the key, and
        the encryption context. For <span className="font-mono text-sm">alias/de-pii-prod</span>, that record is
        often exactly what auditors and incident responders ask for.
      </Callout>

      <Definition term="KMS CloudTrail event">
        <p>
          A log entry CloudTrail writes for every KMS API call — management operations like{' '}
          <span className="font-mono text-sm">PutKeyPolicy</span> and cryptographic operations like{' '}
          <span className="font-mono text-sm">Decrypt</span> and{' '}
          <span className="font-mono text-sm">GenerateDataKey</span>. Events include the caller identity, source
          service, key ARN, and encryption context. They never include plaintext or data keys.
        </p>
      </Definition>

      <LessonSection title="Reading a Decrypt event">
        <ContentStep number={1} title="Fields that matter">
          <p className="text-slate-300">
            <span className="font-mono text-sm">userIdentity</span> tells you who (the Glue job role session or an
            analyst); <span className="font-mono text-sm">invokedBy</span> or the source IP shows whether S3 or
            Athena called on their behalf; <span className="font-mono text-sm">resources</span> holds the key ARN;
            and <span className="font-mono text-sm">requestParameters.encryptionContext</span> shows which object or
            bucket was involved.
          </p>
        </ContentStep>
        <Example title="Trimmed Decrypt event" caption="Glue job reading an SSE-KMS object">
{`{
  "eventSource": "kms.amazonaws.com",
  "eventName": "Decrypt",
  "eventTime": "2026-09-28T02:14:07Z",
  "userIdentity": {
    "type": "AssumedRole",
    "arn": "arn:aws:sts::111122223333:assumed-role/glue-orders-silver-etl/GlueJobRunnerSession"
  },
  "sourceIPAddress": "s3.amazonaws.com",
  "requestParameters": {
    "encryptionAlgorithm": "SYMMETRIC_DEFAULT",
    "encryptionContext": {
      "aws:s3:arn": "arn:aws:s3:::acme-lake-prod/silver/orders/dt=2026-09-27/part-0001.parquet"
    }
  },
  "resources": [{
    "type": "AWS::KMS::Key",
    "ARN": "arn:aws:kms:us-east-1:111122223333:key/1234abcd-12ab-34cd-56ef-1234567890ab"
  }]
}`}
        </Example>
        <Callout variant="info">
          KMS events are high volume. CloudTrail trails can exclude KMS events to save cost — do not enable that
          option on trails you rely on for PII audit, or keep a dedicated trail that includes them.
        </Callout>
      </LessonSection>

      <LessonSection title="Alerting on risky key changes">
        <ContentStep number={1} title="Events that should page someone">
          <p className="text-slate-300">
            <span className="font-mono text-sm">ScheduleKeyDeletion</span>,{' '}
            <span className="font-mono text-sm">DisableKey</span>,{' '}
            <span className="font-mono text-sm">PutKeyPolicy</span>, and{' '}
            <span className="font-mono text-sm">DeleteImportedKeyMaterial</span> can each cut off every pipeline
            that depends on a key. Route them through EventBridge to SNS, just like the alerting patterns from the
            EventBridge sub-topic.
          </p>
        </ContentStep>
        <Example title="EventBridge rule pattern" caption="Targets an SNS topic such as de-security-alerts">
{`{
  "source": ["aws.kms"],
  "detail-type": ["AWS API Call via CloudTrail"],
  "detail": {
    "eventSource": ["kms.amazonaws.com"],
    "eventName": ["ScheduleKeyDeletion", "DisableKey", "PutKeyPolicy", "DeleteImportedKeyMaterial"]
  }
}`}
        </Example>
        <Flowchart
          title="Risky KMS change to on-call alert"
          chart={`flowchart LR
  ADM[Admin calls ScheduleKeyDeletion]
  KMS[KMS API]
  CT[CloudTrail event]
  EB[EventBridge rule]
  SNS[SNS de-security-alerts]
  ONCALL[On-call reviews and cancels]
  ADM --> KMS --> CT --> EB --> SNS --> ONCALL`}
        />
      </LessonSection>

      <LessonSection title="Answering audit questions with Athena and Config">
        <ContentStep number={1} title="Who decrypted the PII key last week?">
          <p className="text-slate-300">
            With CloudTrail logs in S3 and a table in the Glue Catalog (from the Athena sub-topic), filter on event
            source, event name, time, and the PII key ARN in <span className="font-mono text-sm">resources</span>.
            Group by principal to see which roles and people read protected data.
          </p>
        </ContentStep>
        <Example title="Athena — decrypts of alias/de-pii-prod key" caption="Standard CloudTrail Athena table">
{`SELECT
  useridentity.arn AS principal,
  json_extract_scalar(requestparameters, '$.encryptionContext["aws:s3:arn"]') AS object_or_bucket,
  count(*) AS decrypt_calls
FROM cloudtrail_logs
WHERE eventsource = 'kms.amazonaws.com'
  AND eventname = 'Decrypt'
  AND eventtime >= '2026-09-21T00:00:00Z'
  AND cardinality(filter(resources, r -> r.arn =
      'arn:aws:kms:us-east-1:111122223333:key/9999eeee-12ab-34cd-56ef-1234567890ab')) > 0
GROUP BY 1, 2
ORDER BY decrypt_calls DESC;`}
        </Example>
        <ContentStep number={2} title="Continuous compliance with AWS Config">
          <p className="text-slate-300">
            The managed rule <span className="font-mono text-sm">cmk-backing-key-rotation-enabled</span> flags
            customer managed keys without automatic rotation. Pair it with Security Hub controls for keys pending
            deletion and key policies allowing overly broad decrypt, so drift shows up without anyone running queries.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Keep the PII key separate from the general lake key — then &quot;who touched PII&quot; is one key ARN
          filter instead of parsing thousands of object paths.
        </Callout>
      </LessonSection>

      <LessonSection title="Teaser — CloudTrail is next">
        <p className="text-slate-300">
          Everything in this lesson depended on CloudTrail quietly recording API calls. The next sub-topic covers
          CloudTrail itself: organization trails, data events versus management events, log file integrity, and
          querying the trail for security investigations across the whole data platform — not just KMS.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every KMS API call is logged in CloudTrail with caller, key ARN, and encryption context — never plaintext.',
          'Decrypt events answer who read protected data; S3 context shows the object or, with Bucket Keys, the bucket.',
          'Alert on ScheduleKeyDeletion, DisableKey, PutKeyPolicy via EventBridge to SNS.',
          'Query CloudTrail in Athena by key ARN to report decrypts of the PII key over a time window.',
          'Use AWS Config cmk-backing-key-rotation-enabled for continuous rotation compliance.',
        ]}
      />
    </LessonArticle>
  )
}
