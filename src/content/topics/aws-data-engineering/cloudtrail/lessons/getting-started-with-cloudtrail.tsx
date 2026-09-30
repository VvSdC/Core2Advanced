import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithCloudtrail() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why CloudTrail after KMS in the DE path">
        In the KMS lessons, every time a Glue job read an encrypted Parquet file, a{' '}
        <code className="text-core-400">kms:Decrypt</code> call happened behind the scenes. The same is true
        for everything else you have built: attaching an IAM policy, editing a bucket policy, starting a Glue
        job, updating a Step Functions definition — <strong className="text-white">every one of these is an
        API call</strong>. The question every security review, auditor, and on-call engineer eventually asks
        is: <strong className="text-white">who made that call, when, from where, and did it succeed?</strong>{' '}
        In AWS, the answer lives in <strong className="text-white">AWS CloudTrail</strong>.
      </Callout>

      <Definition term="What is CloudTrail in a DE platform?">
        <p>
          <strong className="text-white">AWS CloudTrail</strong> is the service that records API activity in
          your AWS accounts — calls made from the console, the CLI, SDKs, and by AWS services acting on your
          behalf. For data engineering, CloudTrail is the{' '}
          <strong className="text-white">audit and change-forensics layer</strong> of the platform: the place
          you go when a Glue table vanishes, a bucket policy suddenly allows public reads, or a pipeline role
          starts failing with <code className="text-core-400">AccessDenied</code>.
        </p>
        <p className="mt-2 text-slate-300">
          Think of CloudTrail as{' '}
          <span className="text-core-400">the building&apos;s badge-access log for your AWS APIs — it does
          not stop anyone at the door, but it remembers exactly who walked through it</span>.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We start with the free, always-on pieces and add paid features only once you know why you need
          them. Follow this order:
        </p>
        <ContentStep number={1} title="What CloudTrail records — and what it does not">
          <p className="text-slate-300">
            API calls with who, what, when, where, and result — plus the blind spots, like SQL inside a
            Redshift query or commands run on an EC2 instance.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event history vs trails">
          <p className="text-slate-300">
            The free 90-day event history every account has, versus trails that deliver log files to S3 so
            you can keep them for years.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Management vs data events">
          <p className="text-slate-300">
            Control-plane changes such as <code className="text-core-400">CreateTable</code> versus object
            reads such as <code className="text-core-400">GetObject</code> — and why the second kind costs
            money and needs careful scoping.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Reading events and DE use cases">
          <p className="text-slate-300">
            Decode a raw JSON event field by field, then apply it to real DE questions — who deleted the
            table, who changed the lifecycle rule, who read the PII.
          </p>
        </ContentStep>
        <Flowchart
          title="CloudTrail sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is CloudTrail]
  B --> C[Event history and trails]
  C --> D[Management vs data events]
  D --> E[Reading an event]
  E --> F[CloudTrail for DE]
  F --> G[Beginner checkpoint]
  G --> H[Org trails Athena Lake — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Event', 'One recorded API call or activity — a JSON document with who, what, when, where, and result'],
                [
                  'Management event',
                  'A control-plane action that creates, changes, or reads configuration — CreateBucket, PutBucketPolicy, CreateTable, StartJobRun, CreateKey',
                ],
                [
                  'Data event',
                  'A data-plane action on the resource contents — S3 GetObject/PutObject, Lambda Invoke, DynamoDB item reads — off by default and billed per event',
                ],
                [
                  'Insights event',
                  'An optional event CloudTrail raises when API call volume or error rates look unusual compared to your baseline',
                ],
                ['Trail', 'A configuration that continuously delivers events as log files to an S3 bucket (and optionally CloudWatch Logs)'],
                ['Event history', 'The free, built-in, searchable view of the last 90 days of management events in each Region'],
                [
                  'Event data store',
                  'The storage unit of CloudTrail Lake — a managed, SQL-queryable store of events with its own retention (covered later)',
                ],
                ['Log file', 'A gzipped JSON file in S3 holding a batch of events, written every few minutes by a trail'],
                [
                  'Digest file',
                  'An hourly file that holds hashes of the log files so you can prove logs were not modified or deleted',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Put scope and environment in trail and bucket names:{' '}
          <code className="text-core-400">org-trail-prod</code> for the organization trail and{' '}
          <code className="text-core-400">acme-cloudtrail-logs-archive</code> for the log bucket. When an
          auditor asks &quot;where are the prod audit logs?&quot;, the name should answer the question before
          anyone opens the console.
        </Callout>
      </LessonSection>

      <LessonSection title="Where CloudTrail fits in the platform">
        <p className="text-slate-300">
          In a mature setup, every account in the AWS Organization — dev, staging, prod, data lake — is
          covered by one <strong className="text-white">organization trail</strong>. Log files land in a
          locked-down S3 bucket in a dedicated log archive account. From there, Athena queries history,
          CloudWatch Logs powers metric filters and alarms, and EventBridge reacts to risky calls in near real
          time.
        </p>
        <Flowchart
          title="Accounts → org trail → log archive → analysis and alerts"
          chart={`flowchart LR
  DEV[Dev account] --> ORG[Org trail]
  STG[Staging account] --> ORG
  PRD[Prod data account] --> ORG
  ORG --> S3[S3 log archive bucket]
  ORG --> CWL[CloudWatch Logs optional]
  PRD --> EB[EventBridge rules]
  S3 --> ATH[Athena audit queries]
  CWL --> ALM[Metric filters and alarms]
  EB --> SNS[SNS security alerts]`}
        />
        <Callout variant="insight">
          Interview framing: CloudWatch tells you <em>how</em> the system is behaving; CloudTrail tells you{' '}
          <em>who changed it</em>. Most &quot;the pipeline broke overnight and nobody touched anything&quot;
          incidents end with a CloudTrail event proving someone did.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about CloudTrail">
        <ContentStep number={1} title="Who deleted or changed the Glue table?">
          <p className="text-slate-300">
            <code className="text-core-400">DeleteTable</code>,{' '}
            <code className="text-core-400">UpdateTable</code>, and{' '}
            <code className="text-core-400">BatchDeletePartition</code> are management events. CloudTrail
            shows the exact principal and time — and often the full table definition you need to rebuild it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Who changed the bucket policy?">
          <p className="text-slate-300">
            A <code className="text-core-400">PutBucketPolicy</code> event carries the new policy document in
            its request parameters, so you can see exactly what was granted and to whom.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Who read the PII?">
          <p className="text-slate-300">
            With S3 data events enabled on sensitive prefixes, every{' '}
            <code className="text-core-400">GetObject</code> on{' '}
            <code className="text-core-400">gold/pii/</code> is recorded — the evidence GDPR and HIPAA reviews
            ask for.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CloudTrail follows KMS because every key use, IAM change, bucket policy edit, and Glue job start is an API call that needs an audit record.',
          'Roadmap: what it records → event history vs trails → management vs data events → reading events → DE use cases.',
          'Core vocabulary: event, management event, data event, Insights event, trail, event history, event data store, log file, digest file.',
          'Target architecture: all accounts → organization trail → S3 log archive → Athena, CloudWatch Logs, and EventBridge.',
          'DE questions CloudTrail answers: who deleted the Glue table, who changed the bucket policy, who read PII objects.',
        ]}
      />
    </LessonArticle>
  )
}
