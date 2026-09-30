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

export function ManagementVsDataEvents() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Changing the building vs opening the files">
        Someone renovating an office — moving walls, changing locks — is rare and important. Someone opening
        a filing cabinet happens thousands of times a day. CloudTrail splits API activity the same way:{' '}
        <strong className="text-white">management events</strong> for changes to resources, and{' '}
        <strong className="text-white">data events</strong> for reads and writes of the contents. The split
        drives what is logged by default, what you pay, and which audit questions you can answer.
      </Callout>

      <Definition term="Management event vs data event">
        <p>
          A <strong className="text-white">management event</strong> is a control-plane operation on a
          resource&apos;s configuration — creating a bucket, attaching a policy, defining a Glue table,
          starting a job. A <strong className="text-white">data event</strong> is a data-plane operation on or
          inside a resource — reading an S3 object, invoking a Lambda function, getting a DynamoDB item.
          Management events are logged by default; data events are{' '}
          <span className="text-core-400">off by default and billed per event</span>.
        </p>
      </Definition>

      <LessonSection title="Side by side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Management events</th>
                <th className="px-4 py-3">Data events</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Plane', 'Control plane — configuration', 'Data plane — contents and invocations'],
                [
                  'DE examples',
                  'CreateBucket, PutBucketPolicy, CreateTable, DeleteTable, StartJobRun, CreateKey',
                  'S3 GetObject and PutObject, Lambda Invoke, DynamoDB GetItem and PutItem',
                ],
                ['Default', 'Recorded in event history and by trails', 'Off — must be enabled on a trail or event data store'],
                ['Volume', 'Hundreds to thousands per day', 'Can be millions per day on a busy lake'],
                ['Cost', 'First trail copy free per Region', 'Billed per event — roughly $0.10 per 100,000, check pricing'],
                ['Answers', 'Who changed the table or policy?', 'Who read or wrote this object?'],
              ].map(([aspect, mgmt, data]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{mgmt}</td>
                  <td className="px-4 py-3">{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="Watch the math before enabling data events">
          A Glue job that reads 2 million small Parquet files generates about 2 million{' '}
          <code className="text-core-400">GetObject</code> data events per run. At roughly $0.10 per 100,000,
          that is around $2 per run — or about $60 a month for a nightly job, before S3 storage. Always check
          the current CloudTrail pricing page and scope data events narrowly.
        </Callout>
      </LessonSection>

      <LessonSection title="Read vs write events">
        <ContentStep number={1} title="Read events">
          <p className="text-slate-300">
            Calls that only look: <code className="text-core-400">GetBucketPolicy</code>,{' '}
            <code className="text-core-400">GetTable</code>, <code className="text-core-400">GetObject</code>.
            They are marked <code className="text-core-400">readOnly: true</code> and are usually the majority
            of volume.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Write events">
          <p className="text-slate-300">
            Calls that change something: <code className="text-core-400">PutBucketPolicy</code>,{' '}
            <code className="text-core-400">DeleteTable</code>,{' '}
            <code className="text-core-400">PutObject</code>. For change forensics, write events are what you
            need most.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Choosing">
          <p className="text-slate-300">
            A trail can log read, write, or both. For PII buckets, you usually need reads — the whole point
            is proving who accessed the data. For a raw landing bucket, writes alone may be enough.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Scoping data events with advanced event selectors">
        <p className="text-slate-300">
          <strong className="text-white">Advanced event selectors</strong> let you filter precisely by
          fields such as <code className="text-core-400">eventCategory</code>,{' '}
          <code className="text-core-400">resources.type</code>,{' '}
          <code className="text-core-400">resources.ARN</code>,{' '}
          <code className="text-core-400">readOnly</code>, and{' '}
          <code className="text-core-400">eventName</code>. Instead of logging every object in the lake,
          log only the prefix that holds sensitive data.
        </p>
        <Example title="Management events plus data events on the PII prefix only" caption="aws cloudtrail put-event-selectors --trail-name acme-trail-prod --advanced-event-selectors file://selectors.json">
{`[
  {
    "Name": "Management events",
    "FieldSelectors": [
      { "Field": "eventCategory", "Equals": ["Management"] }
    ]
  },
  {
    "Name": "PII object reads and writes",
    "FieldSelectors": [
      { "Field": "eventCategory", "Equals": ["Data"] },
      { "Field": "resources.type", "Equals": ["AWS::S3::Object"] },
      { "Field": "resources.ARN",
        "StartsWith": ["arn:aws:s3:::acme-lake-prod/gold/pii/"] }
    ]
  }
]`}
        </Example>
        <Flowchart
          title="Which events land in the trail"
          chart={`flowchart TD
  E[API event] --> Q1{Management or data}
  Q1 -->|Management| M[Logged by trail]
  Q1 -->|Data| Q2{Matches selector}
  Q2 -->|gold pii prefix| D[Logged and billed]
  Q2 -->|other lake prefixes| X[Not logged]`}
        />
      </LessonSection>

      <LessonSection title="Taming noisy management events">
        <ContentStep number={1} title="KMS events">
          <p className="text-slate-300">
            Every encrypted S3 read by a Glue job can trigger <code className="text-core-400">Decrypt</code>{' '}
            and <code className="text-core-400">GenerateDataKey</code> calls — these are management events and
            can dominate your logs. Trails offer an option to exclude AWS KMS events (or you filter{' '}
            <code className="text-core-400">eventSource</code> with advanced selectors).
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS Data API events">
          <p className="text-slate-300">
            Applications using the RDS Data API can produce high-volume events too; trails can exclude them
            the same way.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Excluding KMS events from a <em>second</em> analytics trail is common, but keep them in your
          primary audit trail — &quot;who decrypted with the PII key?&quot; is exactly the question the KMS
          lessons prepared you to ask.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Management events = control plane (CreateBucket, PutBucketPolicy, CreateTable, StartJobRun, CreateKey) — logged by default.',
          'Data events = data plane (S3 GetObject/PutObject, Lambda Invoke, DynamoDB item calls) — off by default, billed per event.',
          'Data events cost roughly $0.10 per 100,000 events — check current pricing and do the math on lake-scale reads.',
          'Advanced event selectors scope data events to sensitive prefixes such as s3://acme-lake-prod/gold/pii/.',
          'Choose read, write, or both; exclude noisy KMS or RDS Data API events only where the audit need allows it.',
        ]}
      />
    </LessonArticle>
  )
}
