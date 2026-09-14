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

export function EventsContextInvocation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="What arrives when Lambda runs">
        Every time AWS invokes your handler, it passes two objects: an{' '}
        <strong className="text-white">event</strong> (what happened) and a{' '}
        <strong className="text-white">context</strong> (metadata about this run). Understanding both
        is how you parse S3 bucket/key pairs, avoid timeout surprises, and trace one file through
        CloudWatch logs.
      </Callout>

      <Definition term="Event, context, and invocation">
        <p>
          An <strong className="text-white">event</strong> is a JSON-shaped dict describing the trigger
          — for S3, a list of <code className="text-core-400">Records</code> with bucket, key, size, and
          event name. The <strong className="text-white">context</strong> object exposes runtime facts:
          request ID, function name, memory limit, and remaining milliseconds before timeout. An{' '}
          <strong className="text-white">invocation</strong> is one complete execution from trigger to
          handler return or error — one line item in billing and one logical unit in logs.
        </p>
      </Definition>

      <LessonSection title="Event payloads — especially S3">
        <p className="text-slate-300">
          Different triggers send different shapes. S3 event notifications wrap one or more records in a{' '}
          <code className="text-core-400">Records</code> array — batching can deliver multiple objects in
          one invocation if configured. Your handler should loop records, not assume a single file.
        </p>
        <Example title="Simplified S3 ObjectCreated event" caption="Real payloads include more fields">
{`{
  "Records": [
    {
      "eventName": "ObjectCreated:Put",
      "s3": {
        "bucket": { "name": "company-lake-dev" },
        "object": { "key": "raw/orders/2024-01-15/file.csv", "size": 4096 }
      }
    }
  ]
}`}
        </Example>
        <ContentStep number={1} title="Extract bucket and key safely">
          <p className="text-slate-300">
            URL-decode keys when needed — spaces arrive as <code className="text-core-400">+</code> or{' '}
            <code className="text-core-400">%20</code>. Use{' '}
            <code className="text-core-400">urllib.parse.unquote_plus</code> before boto3{' '}
            <code className="text-core-400">get_object</code> to avoid NoSuchKey on valid uploads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Filter by prefix in code">
          <p className="text-slate-300">
            S3 notifications can filter by prefix/suffix in configuration, but defensive handlers still
            check <code className="text-core-400">key.startswith(&quot;raw/incoming/&quot;)</code> so
            misconfigured triggers do not process curated data.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Other DE event sources (preview)">
          <p className="text-slate-300">
            EventBridge schedules send a time field; SQS wraps messages in Records with a{' '}
            <code className="text-core-400">body</code> string; API Gateway sends HTTP method, path, and
            body. Same handler pattern — read <code className="text-core-400">event</code>, branch on
            shape or use separate functions per trigger type.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Log the full event once in dev">
          <code className="text-core-400">logger.info(json.dumps(event))</code> on first deploy reveals
          exact field paths before you write production parsing logic.
        </Callout>
      </LessonSection>

      <LessonSection title="Context object — high level">
        <p className="text-slate-300">
          The <code className="text-core-400">context</code> parameter is a runtime object (not always
          plain JSON). Common attributes data engineers use:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Attribute</th>
                <th className="px-4 py-3">Why DE cares</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['aws_request_id', 'Correlate CloudWatch log lines and X-Ray traces for one file processing attempt'],
                ['function_name', 'Confirm which alias/version ran when multiple functions share similar code'],
                ['memory_limit_in_mb', 'Log configured memory — ties to GB-second billing and pandas chunk sizing'],
                ['get_remaining_time_in_millis()', 'Check before starting a long S3 download or Glue poll loop — exit gracefully before hard timeout'],
                ['invoked_function_arn', 'Audit which account/Region/function ARN executed in multi-account lakes'],
              ].map(([attr, why]) => (
                <tr key={attr} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-core-400">{attr}</td>
                  <td className="px-4 py-3">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Guard long work with remaining time" caption="Pattern for chunked processing">
{`def lambda_handler(event, context):
    for record in event.get("Records", []):
        if context.get_remaining_time_in_millis() < 30_000:
            logger.warning("Less than 30s left — stop and let retry continue")
            raise TimeoutError("Approaching Lambda timeout")
        process_one_s3_record(record)`}
        </Example>
        <Callout variant="insight">
          Context does not contain S3 bucket names — that lives in <code className="text-core-400">event</code>.
          Mixing them up is a common beginner bug when copying EC2 scripts that only used environment
          variables.
        </Callout>
      </LessonSection>

      <LessonSection title="Invocation — one run end to end">
        <ContentStep number={1} title="Synchronous vs asynchronous">
          <p className="text-slate-300">
            <strong className="text-white">Synchronous</strong> invocations (e.g. API Gateway, CLI invoke)
            wait for the handler return value. <strong className="text-white">Asynchronous</strong>{' '}
            invocations (S3, SNS, EventBridge) queue the event and return quickly; Lambda retries on
            failure with backoff. S3-triggered ETL is async — design idempotent handlers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Idempotency for DE">
          <p className="text-slate-300">
            The same file may trigger twice after retries or duplicate uploads. Write to deterministic
            output keys (e.g. <code className="text-core-400">processed/orders/file.parquet</code>) or
            check S3 head before overwrite so replays do not double-charge downstream systems.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reading invocations in CloudWatch">
          <p className="text-slate-300">
            Each invocation produces START / END / REPORT lines with duration, billed duration, and memory
            used. Filter by <code className="text-core-400">aws_request_id</code> from context to debug
            one bad CSV among thousands.
          </p>
        </ContentStep>
        <Flowchart
          title="Async S3 invocation with retry"
          chart={`flowchart LR
  S3[S3 upload completes]
  S3 --> N[Notification service]
  N --> Q[Lambda async queue]
  Q --> I[Invocation 1]
  I --> H[Handler runs]
  H -->|Success| DONE[Complete]
  H -->|Error| R[Retry invocation 2]
  R --> H`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Event = trigger payload (S3 Records with bucket/key); context = runtime metadata and remaining time.',
          'Loop all Records; URL-decode keys; filter prefixes defensively even if S3 notification filters exist.',
          'Use context.get_remaining_time_in_millis() before long steps to fail gracefully.',
          'Invocation = one billed run — async S3 triggers retry on failure; write idempotent handlers.',
        ]}
      />
    </LessonArticle>
  )
}
