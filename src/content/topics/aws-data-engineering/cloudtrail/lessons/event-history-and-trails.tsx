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

export function EventHistoryAndTrails() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Ninety days is shorter than you think">
        An auditor asks in March who changed the <code className="text-core-400">acme-lake-prod</code>{' '}
        bucket policy last November. Event history cannot help — it only keeps 90 days. A{' '}
        <strong className="text-white">trail</strong> that has been writing log files to S3 since the account
        was created can answer in minutes. This lesson explains the difference and how to create your first
        trail.
      </Callout>

      <Definition term="Event history vs trail">
        <p>
          <strong className="text-white">Event history</strong> is the free, built-in, read-only view of the
          last 90 days of management events in a Region.{' '}
          <strong className="text-white">A trail</strong> is a configuration you create that continuously
          delivers events as log files to an S3 bucket you own (and optionally to CloudWatch Logs), where you
          control retention, encryption, and who can read them.
        </p>
      </Definition>

      <LessonSection title="Event history — the free starting point">
        <ContentStep number={1} title="What you get">
          <p className="text-slate-300">
            Management events for the last 90 days, per Region, searchable by attributes such as event
            name, user name, resource name, or event source. No setup, no cost, no bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you do not get">
          <p className="text-slate-300">
            No data events (no S3 <code className="text-core-400">GetObject</code>), no history older than
            90 days, and no single view across Regions or accounts — you switch Regions to look elsewhere.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Looking up events from the CLI">
          <p className="text-slate-300">
            <code className="text-core-400">lookup-events</code> queries the same history. It is handy in a
            runbook but slow for bulk analysis — that is what trails plus Athena are for.
          </p>
        </ContentStep>
        <Example title="Find recent Glue DeleteTable calls" caption="Event history lookup — one Region at a time">
{`aws cloudtrail lookup-events \\
  --region us-east-1 \\
  --lookup-attributes AttributeKey=EventName,AttributeValue=DeleteTable \\
  --start-time 2026-09-29T00:00:00Z \\
  --end-time 2026-09-30T12:00:00Z \\
  --max-results 20`}
        </Example>
      </LessonSection>

      <LessonSection title="Trails — long-term, centralized logs">
        <ContentStep number={1} title="Delivered to S3, optionally CloudWatch Logs">
          <p className="text-slate-300">
            A trail writes gzipped JSON log files to S3 every few minutes. Streaming to CloudWatch Logs is
            optional and enables metric filters and alarms, at CloudWatch ingestion prices.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Multi-Region vs single-Region">
          <p className="text-slate-300">
            A multi-Region trail (the console default and the recommended choice) captures events from every
            Region — including Regions you do not use, where an attacker might hide resources. Single-Region
            trails are rare and mostly legacy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What it costs">
          <p className="text-slate-300">
            The first copy of management events delivered by a trail in each Region is free; you pay S3
            storage for the files. Additional copies of management events (a second trail) and all data
            events are billed per event — check the current CloudTrail pricing page before enabling them.
          </p>
        </ContentStep>
        <Flowchart
          title="Event history vs trail"
          chart={`flowchart LR
  API[API calls in account] --> EH[Event history]
  API --> TR[Trail org-trail-prod]
  EH --> V[90 days management only]
  TR --> S3[S3 log bucket]
  TR --> CWL[CloudWatch Logs optional]
  S3 --> LC[Lifecycle to Glacier]
  S3 --> ATH[Athena queries]`}
        />
      </LessonSection>

      <LessonSection title="Creating your first trail">
        <p className="text-slate-300">
          In the console: <strong className="text-white">CloudTrail → Trails → Create trail</strong>. Give it
          a name, choose or create an S3 bucket (the console writes the required bucket policy for you),
          enable log file validation, optionally enable SSE-KMS with the key patterns from the KMS lessons,
          choose management events (read and write), and leave data events off for now.
        </p>
        <Example title="Create and start a multi-Region trail" caption="The bucket must already allow cloudtrail.amazonaws.com to write">
{`aws cloudtrail create-trail \\
  --name acme-trail-prod \\
  --s3-bucket-name acme-cloudtrail-logs-archive \\
  --is-multi-region-trail \\
  --enable-log-file-validation

# A new trail created from the CLI does not log until started
aws cloudtrail start-logging --name acme-trail-prod

aws cloudtrail get-trail-status --name acme-trail-prod`}
        </Example>
        <Callout variant="tip" title="Forgetting start-logging">
          Trails created via the CLI or API are not logging until you call{' '}
          <code className="text-core-400">start-logging</code>. Always confirm{' '}
          <code className="text-core-400">IsLogging: true</code> in{' '}
          <code className="text-core-400">get-trail-status</code> — a silent, stopped trail is worse than no
          trail because everyone assumes it works.
        </Callout>
      </LessonSection>

      <LessonSection title="Where the files land — and how long they stay">
        <p className="text-slate-300">
          CloudTrail uses a predictable, date-partitioned key layout. It looks just like the Hive-style
          prefixes you design for lake tables — which is exactly why Athena queries it so well.
        </p>
        <Example title="S3 key layout for a trail" caption="Account, Region, then year/month/day">
{`s3://acme-cloudtrail-logs-archive/
  AWSLogs/111122223333/CloudTrail/us-east-1/2026/09/30/
    111122223333_CloudTrail_us-east-1_20260930T0215Z_a1b2c3d4.json.gz
  AWSLogs/111122223333/CloudTrail-Digest/us-east-1/2026/09/30/
    ...digest files for integrity validation`}
        </Example>
        <ContentStep number={1} title="Retention is an S3 lifecycle decision">
          <p className="text-slate-300">
            CloudTrail never deletes trail log files. You decide retention with S3 lifecycle rules — for
            example, Standard for 90 days, Glacier Flexible Retrieval until year 7, then expire.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Protect the bucket">
          <p className="text-slate-300">
            Block public access, restrict who can delete objects, and consider versioning or Object Lock.
            Integrity and encryption get their own intermediate lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event history: free, on by default, 90 days, management events only, one Region at a time.',
          'Trails deliver log files to S3 (and optionally CloudWatch Logs) so you control retention and analysis.',
          'Use multi-Region trails; the first copy of management events is free, extra copies and data events are billed.',
          'CLI-created trails need start-logging — verify IsLogging with get-trail-status.',
          'Keys follow AWSLogs/account/CloudTrail/region/yyyy/mm/dd; retention is set by S3 lifecycle rules.',
        ]}
      />
    </LessonArticle>
  )
}
