import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function S3ObjectCreatedEvents() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="File lands in S3 — the pipeline should wake up automatically">
        Lake ingest starts when objects appear in landing prefixes.{' '}
        <strong className="text-white">S3 Object Created → EventBridge</strong> is the modern, flexible path
        for event-driven ETL — replacing brittle direct Lambda notifications when you need content filtering,
        multiple subscribers, and cross-service routing on the default bus.
      </Callout>

      <Definition term="S3 EventBridge notification">
        <p>
          Bucket configuration that sends Object Created (and other) events to the default EventBridge event
          bus instead of — or in addition to — direct SNS/SQS/Lambda destinations. Events appear with{' '}
          <span className="font-mono text-sm">source: aws.s3</span> and{' '}
          <span className="font-mono text-sm">detail-type: Object Created</span>, carrying bucket, key, size,
          and etag in <span className="font-mono text-sm">detail</span>.
        </p>
      </Definition>

      <LessonSection title="EventBridge vs older S3 notification paths">
        <ContentStep number={1} title="Legacy direct notifications">
          <p className="text-slate-300">
            Classic S3 event notifications push directly to one SNS topic, SQS queue, or Lambda function per
            configuration — max one destination type per rule, limited filtering (prefix/suffix only), no
            native fan-out to five different services without SNS in the middle.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EventBridge path advantages">
          <p className="text-slate-300">
            Single bucket config sends all events to the bus. Multiple EventBridge rules filter by prefix,
            suffix, or wildcard — each targeting Lambda, SQS, Step Functions, or SNS independently. Same event
            drives ingest Lambda and audit Logs target. Integrates with archive, replay, and cross-account bus
            policies.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When legacy still appears">
          <p className="text-slate-300">
            Older Terraform modules, single-Lambda ingest, or third-party tools expecting direct S3→Lambda ARN.
            Migration path: enable EventBridge on bucket, create equivalent rule with event pattern, cut over
            targets, retire direct notification. Both can coexist briefly — watch for duplicate processing.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Direct S3 notification</th>
                <th className="px-4 py-3">S3 → EventBridge</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Destinations per config', 'One (SNS, SQS, or Lambda)', 'Unlimited rules on bus'],
                ['Filtering', 'Prefix/suffix only', 'Full event pattern JSON'],
                ['Fan-out', 'Needs SNS middle layer', 'Native multi-target rules'],
                ['Replay / archive', 'Not available', 'Event archive + replay'],
                ['Cross-account', 'Complex', 'Event bus resource policy'],
                ['DE recommendation', 'Legacy simple cases', 'Default for new lake pipelines'],
              ].map(([aspect, direct, eb]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{direct}</td>
                  <td className="px-4 py-3">{eb}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Land-file → process flowchart">
        <Flowchart
          title="S3 Object Created — event-driven lake ingest"
          chart={`flowchart TB
  UPLOAD[Vendor SFTP or API writes file]
  S3[(S3 landing bucket raw prefix)]
  EBNOTIF[S3 EventBridge notification enabled]
  BUS[Default event bus]
  RULE[EventBridge rule prefix filter]
  SQS[SQS buffer optional]
  LAM[Lambda validate metadata]
  GLUE[Glue StartJobRun silver ETL]
  SILVER[(S3 silver Parquet partition)]
  UPLOAD --> S3
  S3 --> EBNOTIF
  EBNOTIF --> BUS
  BUS --> RULE
  RULE --> SQS
  RULE --> LAM
  SQS --> LAM
  LAM --> GLUE
  GLUE --> SILVER`}
        />
        <ContentStep number={1} title="Enable EventBridge on bucket">
          <p className="text-slate-300">
            Console: bucket → Properties → Event notifications → Send notifications to Amazon EventBridge.
            API: <span className="font-mono text-sm">PutBucketNotificationConfiguration</span> with
            EventBridgeConfiguration. Without this step, rules never see Object Created events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rule matches landing prefix">
          <p className="text-slate-300">
            Event pattern scopes <span className="font-mono text-sm">raw/vendor_a/</span> in prod bucket —
            ignores Athena results, quarantine, and other prefixes in the same bucket.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda validates before Glue">
          <p className="text-slate-300">
            Check object size, extension, and optional manifest row — reject empty files to SNS without
            burning DPU. Pass <span className="font-mono text-sm">--run_date</span> and{' '}
            <span className="font-mono text-sm">--input_path</span> job arguments from event detail key.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Debounce with SQS">
          <p className="text-slate-300">
            When vendors drop thousands of small files per minute, target SQS first — Lambda batches messages
            and starts one Glue run per N files or time window. Prevents Glue job stampede and bookmark chaos.
          </p>
        </ContentStep>
        <Callout variant="tip">
          S3 events are <strong className="text-white">at-least-once</strong> — design idempotent Glue jobs
          (partition overwrite, merge keys) because duplicate Object Created delivery happens under retries and
          multipart upload completion edge cases.
        </Callout>
      </LessonSection>

      <LessonSection title="Operational gotchas">
        <ContentStep number={1} title="Event delay">
          <p className="text-slate-300">
            Object Created usually arrives within seconds but is not synchronous with PUT completion. Do not
            chain same-request read in Lambda assuming immediate consistency — S3 read-after-write applies,
            but event delivery adds latency.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Directory markers and manifests">
          <p className="text-slate-300">
            Folder creation or zero-byte markers may emit events — filter suffix and minimum size in Lambda if
            pattern cannot exclude them. <span className="font-mono text-sm">_SUCCESS</span> files from Spark
            should not re-trigger bronze ingest on output paths — separate buckets or strict prefix boundaries.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Monitor FailedInvocations">
          <p className="text-slate-300">
            Files land but nothing runs: check EventBridge{' '}
            <span className="font-mono text-sm">FailedInvocations</span> on the rule, Lambda DLQ, and that
            bucket EventBridge notification stayed enabled after bucket policy changes.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Enable S3 EventBridge notification on bucket — events land on default bus with source aws.s3.',
          'Prefer EventBridge over direct S3→Lambda for filtering, fan-out, archive, and cross-account routing.',
          'Flow: land file → bus → prefix rule → optional SQS debounce → Lambda validate → Glue StartJobRun.',
          'At-least-once delivery — idempotent partition writes and debounce for file storms.',
          'Monitor FailedInvocations; scope prefixes so silver/_SUCCESS paths do not re-trigger bronze ingest.',
        ]}
      />
    </LessonArticle>
  )
}
