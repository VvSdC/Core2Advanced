import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CommonTriggers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Lambda sits at the center of event-driven lakes">
        Data pipelines rarely start with a cron on a server anymore. Files land in S3, schedules fire on
        EventBridge, messages queue in SQS — and <strong className="text-white">Lambda</strong> is the
        lightweight handler that validates, routes, and orchestrates the next step toward Glue, Athena,
        and Redshift.
      </Callout>

      <Definition term="Lambda trigger">
        <p>
          A <strong className="text-white">trigger</strong> is the AWS resource or rule that causes Lambda
          to run: permissions on the function (resource-based policy) plus configuration on the source
          (bucket notification, EventBridge target, API route). Each trigger passes a JSON{' '}
          <strong className="text-white">event</strong> shape your handler must parse — S3 events wrap
          bucket/key metadata; SQS events wrap Records arrays; EventBridge events carry detail payloads.
        </p>
      </Definition>

      <LessonSection title="Trigger overview for data engineering">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">DE use case</th>
                <th className="px-4 py-3">Invoke type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'S3',
                  'File landed → validate, copy to raw/, start Glue',
                  'Async push',
                ],
                [
                  'EventBridge',
                  'Schedule nightly partition repair; route cross-service events',
                  'Async push',
                ],
                [
                  'SNS',
                  'Fan-out alerts + trigger multiple Lambdas on same upload',
                  'Async push',
                ],
                [
                  'SQS',
                  'Buffered ingest queue; controlled concurrency',
                  'ESM pull',
                ],
                [
                  'API Gateway',
                  'On-demand refresh, webhook from SaaS vendor',
                  'Sync push',
                ],
                [
                  'CloudWatch Events / Alarms',
                  'React to failed Glue job metric; auto-remediation',
                  'Async push',
                ],
              ].map(([source, useCase, invokeType]) => (
                <tr key={source} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{source}</td>
                  <td className="px-4 py-3">{useCase}</td>
                  <td className="px-4 py-3">{invokeType}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Per-trigger DE patterns">
        <ContentStep number={1} title="S3 ObjectCreated">
          <p className="text-slate-300">
            Filter by prefix <span className="font-mono text-sm">landing/vendor-a/</span> and suffix{' '}
            <span className="font-mono text-sm">.csv</span>. Handler reads headers, writes manifest to
            DynamoDB, copies to <span className="font-mono text-sm">raw/</span> on success. Grant S3
            permission to invoke Lambda; Lambda execution role needs{' '}
            <span className="font-mono text-sm">s3:GetObject</span> on source and{' '}
            <span className="font-mono text-sm">PutObject</span> on destination prefix.
          </p>
        </ContentStep>
        <ContentStep number={2} title="EventBridge schedule">
          <p className="text-slate-300">
            Cron <span className="font-mono text-sm">cron(0 6 * * ? *)</span> triggers partition
            maintenance Lambda — list Athena partitions, add missing ones, expire stale query results in
            S3. Decouples housekeeping from Glue job runtime.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SNS fan-out">
          <p className="text-slate-300">
            One S3 notification → SNS topic → Lambda ingest + Lambda metrics counter + email ops on
            failure path. Useful when multiple teams subscribe to the same landing signal without
            duplicating bucket notification configs.
          </p>
        </ContentStep>
        <ContentStep number={4} title="SQS buffer">
          <p className="text-slate-300">
            S3 → SQS → Lambda ESM. Messages carry S3 event JSON. Lambda batch processes 10 files at a
            time; partial batch failure leaves failed messages for retry. Preferred over direct S3 → Lambda
            at high volume.
          </p>
        </ContentStep>
        <ContentStep number={5} title="API Gateway">
          <p className="text-slate-300">
            Partner webhook POSTs JSON payload; Lambda validates signature, writes to landing prefix,
            returns 200. Sync invoke — keep handler under a few seconds or return 202 and enqueue to SQS
            for heavy work.
          </p>
        </ContentStep>
        <ContentStep number={6} title="CloudWatch Alarm">
          <p className="text-slate-300">
            Alarm on Glue job failure metric or custom &quot;files stuck in landing &gt; 1h&quot; metric →
            Lambda opens ticket, reruns job with <span className="font-mono text-sm">StartJobRun</span>,
            or moves files to quarantine prefix.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Mini flowcharts">
        <Flowchart
          title="S3 → Lambda ingest path"
          chart={`flowchart LR
  UP[Partner upload]
  UP --> S3[S3 landing prefix]
  S3 --> NOTIF[S3 Event Notification]
  NOTIF --> L[Lambda validate]
  L --> RAW[S3 raw prefix]
  L --> GLUE[Start Glue ETL]
  L --> DLQ[DLQ on failure]`}
        />
        <Flowchart
          title="EventBridge schedule → Lambda"
          chart={`flowchart LR
  EB[EventBridge rule cron]
  EB --> L[Lambda housekeeping]
  L --> ATH[Athena MSCK REPAIR]
  L --> S3DEL[Delete stale athena-results]
  L --> CW[CloudWatch custom metric]`}
        />
        <Callout variant="tip">
          Map each trigger to one handler concern — avoid a single mega-Lambda for S3 + API + schedule.
          Separate functions simplify IAM (least privilege per prefix) and independent concurrency tuning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'S3, EventBridge, SNS, API Gateway, CloudWatch, and SQS are the core Lambda triggers in DE pipelines.',
          'S3 and EventBridge push async events; SQS uses Event Source Mapping for pull-based batching.',
          'S3 → Lambda: validate and hand off to Glue/raw — filter by prefix/suffix; design idempotent handlers.',
          'EventBridge schedules decouple cron housekeeping from long Glue jobs.',
          'High-volume landing: S3 → SQS → Lambda beats direct S3 → Lambda for concurrency control.',
        ]}
      />
    </LessonArticle>
  )
}
