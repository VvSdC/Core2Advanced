import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SyncAsyncInvocation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two ways to call a Lambda function">
        When your Glue workflow, Step Functions state machine, or Python script calls Lambda, AWS can
        either wait for the result (<strong className="text-white">synchronous</strong>) or accept the
        request and process it in the background (<strong className="text-white">asynchronous</strong>).
        Data engineers choose based on whether the caller needs an immediate answer or can tolerate
        eventual completion.
      </Callout>

      <Definition term="Synchronous invocation">
        <p>
          The caller blocks until Lambda finishes or times out (up to 15 minutes). The response body
          contains the function result or error payload. Used when the next step depends on the return
          value — API Gateway REST integration, Step Functions Task state with{' '}
          <span className="font-mono text-sm">lambda:invoke</span> (RequestResponse), or a validation
          Lambda that must return pass/fail before promoting a file from landing to raw.
        </p>
      </Definition>

      <Definition term="Asynchronous invocation">
        <p>
          AWS queues the event and returns HTTP 202 immediately. Lambda processes the event later with
          built-in retry (two additional attempts by default) and optional Dead Letter Queue. Used for
          fire-and-forget workloads — S3 event notifications, EventBridge rules, manual{' '}
          <span className="font-mono text-sm">InvocationType=Event</span> from boto3, or kicking off a
          long-running downstream Glue job without blocking the uploader.
        </p>
      </Definition>

      <LessonSection title="How each invocation type behaves">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Synchronous</th>
                <th className="px-4 py-3">Asynchronous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Caller waits?',
                  'Yes — until success, error, or timeout',
                  'No — 202 Accepted immediately',
                ],
                [
                  'Retries on failure',
                  'Caller must retry (Step Functions, SDK)',
                  'Lambda retries up to 2 times (configurable)',
                ],
                [
                  'Return value',
                  'Returned to caller in response payload',
                  'Not returned to original caller',
                ],
                [
                  'Typical DE triggers',
                  'API Gateway, Step Functions Task, direct SDK sync',
                  'S3 events, EventBridge, SNS, async boto3 invoke',
                ],
                [
                  'Throttling behavior',
                  '429 to caller; caller handles backoff',
                  'Queued; may throttle if queue depth exceeded',
                ],
              ].map(([aspect, sync, async_]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{aspect}</td>
                  <td className="px-4 py-3">{sync}</td>
                  <td className="px-4 py-3">{async_}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When data engineers use each">
        <ContentStep number={1} title="Synchronous — gate before downstream work">
          <p className="text-slate-300">
            A Step Functions workflow invokes a schema-validation Lambda synchronously. If the function
            returns <span className="font-mono text-sm">{'{ "valid": false }'}</span>, the state machine
            branches to an alert path instead of starting a Glue job. The orchestrator needs the answer
            now — async would require polling or a callback pattern.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Synchronous — API-driven micro-ETL">
          <p className="text-slate-300">
            API Gateway + Lambda serves a lightweight &quot;refresh this dataset partition&quot; endpoint.
            The analyst waits for HTTP 200 with row counts. Sync invocation is natural here; keep the
            handler fast or offload heavy work to SQS + async worker.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Asynchronous — S3 landing fan-out">
          <p className="text-slate-300">
            Partner uploads 10,000 CSV files overnight. S3 emits ObjectCreated events; Lambda ingests each
            file asynchronously. Uploaders are not blocked; retries handle transient S3 or network blips.
            Combine with SQS between S3 and Lambda if burst rate exceeds concurrency comfort.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Asynchronous — scheduled housekeeping">
          <p className="text-slate-300">
            EventBridge cron triggers a Lambda that archives Athena query results older than 30 days.
            No caller waits for completion — CloudWatch Logs and optional SNS on failure suffice.
          </p>
        </ContentStep>
        <Flowchart
          title="Sync vs async decision"
          chart={`flowchart TB
  Q{Does caller need return value now?}
  Q -->|Yes| SYNC[Synchronous invoke]
  Q -->|No| ASYNC[Asynchronous invoke]
  SYNC --> SF[Step Functions Task]
  SYNC --> API[API Gateway]
  SYNC --> VAL[Inline validation gate]
  ASYNC --> S3[S3 Event Notification]
  ASYNC --> EB[EventBridge rule]
  ASYNC --> BOTO[boto3 InvocationType Event]`}
        />
        <Callout variant="tip">
          Interview framing: &quot;S3 → Lambda is async by nature — design idempotent handlers and DLQs.
          Step Functions validation steps are sync — return structured JSON the state machine can branch on.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Synchronous: caller blocks until Lambda returns or times out — use when the next step needs the result immediately.',
          'Asynchronous: 202 Accepted, Lambda retries on failure — use for S3 events, EventBridge, fire-and-forget ETL triggers.',
          'S3 and EventBridge invoke Lambda asynchronously; Step Functions Task and API Gateway typically use synchronous invoke.',
          'Async failures retry automatically — pair with DLQ and idempotent writes to avoid duplicate curated partitions.',
          'Match invocation type to orchestration: sync for gates and APIs, async for high-volume lake ingest edges.',
        ]}
      />
    </LessonArticle>
  )
}
