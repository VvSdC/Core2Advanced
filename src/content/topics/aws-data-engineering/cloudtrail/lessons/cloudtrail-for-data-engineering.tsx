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

export function CloudtrailForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The audit log is a DE tool, not just a security tool">
        Security teams love CloudTrail, but data engineers use it just as often: the morning dashboard is
        empty because a table vanished, a lifecycle rule archived fresh data to Glacier, or the nightly
        workflow never started. In each case the fix begins with one question —{' '}
        <strong className="text-white">what changed, and who changed it?</strong>
      </Callout>

      <Definition term="Change forensics for data platforms">
        <p>
          <strong className="text-white">Change forensics</strong> means reconstructing what happened to a
          pipeline, table, bucket, or key from the API record. For DE, CloudTrail management events cover
          almost every configuration change in Glue, S3, Step Functions, KMS, and IAM; data events add the
          missing piece — <span className="text-core-400">who actually read or wrote the data itself</span>.
        </p>
      </Definition>

      <LessonSection title="Questions CloudTrail answers for DE teams">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Look for</th>
                <th className="px-4 py-3">Event type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Who deleted or changed a Glue table?', 'glue DeleteTable, UpdateTable', 'Management'],
                ['Who dropped partitions?', 'glue DeletePartition, BatchDeletePartition', 'Management'],
                ['Who edited the bucket policy or lifecycle rule?', 's3 PutBucketPolicy, DeleteBucketPolicy, PutBucketLifecycle', 'Management'],
                ['Who stopped the nightly Glue trigger?', 'glue StopTrigger, UpdateTrigger', 'Management'],
                ['Who changed the Step Functions workflow?', 'states UpdateStateMachine', 'Management'],
                ['Who scheduled deletion of a KMS key?', 'kms ScheduleKeyDeletion, DisableKey', 'Management'],
                ['Who read PII objects in gold/pii/?', 's3 GetObject on that prefix', 'Data — must be enabled'],
              ].map(([q, look, type]) => (
                <tr key={q} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{q}</td>
                  <td className="px-4 py-3">{look}</td>
                  <td className="px-4 py-3">{type}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          <code className="text-core-400">requestParameters</code> often holds the <em>before</em> picture
          you need for recovery: an earlier <code className="text-core-400">CreateTable</code> or{' '}
          <code className="text-core-400">UpdateTable</code> event contains the full table input — columns,
          location, SerDe, partition keys — and a <code className="text-core-400">PutBucketPolicy</code>{' '}
          event contains the complete policy document.
        </Callout>
      </LessonSection>

      <LessonSection title="Debugging AccessDenied in pipeline roles">
        <p className="text-slate-300">
          A Glue job that worked yesterday fails with{' '}
          <code className="text-core-400">AccessDeniedException</code> today. The job log tells you it
          failed; CloudTrail tells you <strong className="text-white">which API, on which resource, for which
          role</strong>.
        </p>
        <ContentStep number={1} title="Filter by role and errorCode">
          <p className="text-slate-300">
            Look for events where the <code className="text-core-400">sessionIssuer.userName</code> inside{' '}
            <code className="text-core-400">userIdentity</code> is the job role and{' '}
            <code className="text-core-400">errorCode</code> is present.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read eventSource and eventName">
          <p className="text-slate-300">
            <code className="text-core-400">kms.amazonaws.com Decrypt</code> means the key policy or grant is
            the problem, not S3. <code className="text-core-400">s3 PutObject</code> points at the bucket
            policy or an SCP.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Look just before the first failure">
          <p className="text-slate-300">
            A <code className="text-core-400">PutKeyPolicy</code>,{' '}
            <code className="text-core-400">PutBucketPolicy</code>, or{' '}
            <code className="text-core-400">DetachRolePolicy</code> event minutes before the first denial is
            usually the root cause.
          </p>
        </ContentStep>
        <Example title="Teaser — recent denials for the Glue ETL role" caption="Athena over trail logs; the table setup comes in the Athena lesson">
{`SELECT eventtime, eventsource, eventname, errorcode,
       json_extract_scalar(requestparameters, '$.bucketName') AS bucket
FROM   cloudtrail_logs
WHERE  useridentity.sessioncontext.sessionissuer.username = 'de-glue-etl-role'
  AND  errorcode IS NOT NULL
  AND  eventtime > '2026-09-29T00:00:00Z'
ORDER  BY eventtime DESC
LIMIT  50;`}
        </Example>
        <Flowchart
          title="AccessDenied triage with CloudTrail"
          chart={`flowchart TD
  F[Glue job fails AccessDenied] --> Q[Query events for job role with errorCode]
  Q --> S{Which eventSource}
  S -->|kms| K[Check key policy and grants]
  S -->|s3| B[Check bucket policy and SCP]
  S -->|glue| G[Check Lake Formation and IAM]
  K --> C[Find recent policy change event]
  B --> C
  G --> C`}
        />
      </LessonSection>

      <LessonSection title="Compliance evidence">
        <ContentStep number={1} title="SOC 2 — change management">
          <p className="text-slate-300">
            Auditors sample production changes and ask for proof of who made them and when. A multi-Region
            trail with log file validation, retained for the audit period, is standard evidence.
          </p>
        </ContentStep>
        <ContentStep number={2} title="GDPR and HIPAA — access to personal data">
          <p className="text-slate-300">
            Regulators and data subjects can ask who accessed personal or health data. That requires S3 data
            events (read) on the buckets or prefixes that hold it — management events alone cannot answer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Query history for analysts">
          <p className="text-slate-300">
            Athena <code className="text-core-400">StartQueryExecution</code> events include the query text
            in <code className="text-core-400">requestParameters</code>, so you can show which tables an
            analyst queried — though Lake Formation and Athena query history add detail later.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cost-aware data event scoping">
        <p className="text-slate-300">
          Turning on data events for every bucket in a busy lake can cost more than the ETL itself. Scope by
          sensitivity:
        </p>
        <ContentStep number={1} title="Always: PII and regulated prefixes">
          <p className="text-slate-300">
            Read and write data events on <code className="text-core-400">s3://acme-lake-prod/gold/pii/</code>{' '}
            and similar paths — this is where access evidence matters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Often: writes on curated zones">
          <p className="text-slate-300">
            Write-only events on <code className="text-core-400">silver/</code> and{' '}
            <code className="text-core-400">gold/</code> catch unexpected overwrites without paying for every
            read by dashboards.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Rarely: raw landing and temp paths">
          <p className="text-slate-300">
            High-volume, low-sensitivity prefixes such as <code className="text-core-400">raw/</code> and{' '}
            <code className="text-core-400">tmp/</code> are usually left out, or covered by cheaper S3 server
            access logs.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Management events answer most DE change questions: Glue tables and partitions, bucket policies, lifecycle rules, triggers, Step Functions, KMS keys.',
          'Who read PII is only answerable with S3 data events enabled on those prefixes.',
          'For AccessDenied, filter by the job role and errorCode, read eventSource, then look for the policy change just before.',
          'CloudTrail is core compliance evidence for SOC 2 change management and GDPR/HIPAA access reviews.',
          'Scope data events by sensitivity — reads on PII, writes on curated zones, skip high-volume raw and temp paths.',
        ]}
      />
    </LessonArticle>
  )
}
