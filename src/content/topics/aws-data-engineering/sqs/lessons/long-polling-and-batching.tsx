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

export function LongPollingAndBatching() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SQS bills per request — not per message">
        Every <span className="font-mono text-sm">SendMessage</span>,{' '}
        <span className="font-mono text-sm">ReceiveMessage</span>, and{' '}
        <span className="font-mono text-sm">DeleteMessage</span> call is a billable request, even when a receive
        returns nothing. Two habits cut both cost and latency on ingest queues:{' '}
        <strong className="text-white">long polling</strong> (wait for messages instead of hammering an empty
        queue) and <strong className="text-white">batching</strong> (move up to 10 messages per API call).
      </Callout>

      <Definition term="Long polling">
        <p>
          A <span className="font-mono text-sm">ReceiveMessage</span> call with{' '}
          <span className="font-mono text-sm">WaitTimeSeconds</span> between 1 and 20. SQS queries all of its
          servers and holds the connection open until at least one message is available or the wait expires.
          Short polling (<span className="font-mono text-sm">WaitTimeSeconds=0</span>) samples only a subset of
          servers and returns immediately — often empty, sometimes missing messages that do exist.
        </p>
      </Definition>

      <LessonSection title="Short polling vs long polling">
        <ContentStep number={1} title="Short polling behaviour">
          <p className="text-slate-300">
            Returns instantly from a sample of servers. On a low-traffic queue such as{' '}
            <span className="font-mono text-sm">de-vendor-drops-queue-prod</span>, a tight loop produces thousands
            of empty receives per hour. Visible in CloudWatch as{' '}
            <span className="font-mono text-sm">NumberOfEmptyReceives</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Enable long polling on the queue">
          <p className="text-slate-300">
            Set <span className="font-mono text-sm">ReceiveMessageWaitTimeSeconds=20</span> on the queue so every
            consumer defaults to long polling, or pass <span className="font-mono text-sm">WaitTimeSeconds</span>{' '}
            per call (the per-call value wins). Lambda event source mappings already long-poll for you.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Client timeouts">
          <p className="text-slate-300">
            HTTP read timeout in your SDK client must exceed the wait time — a 20 s long poll with a 10 s socket
            timeout surfaces as spurious errors. Boto3 defaults (60 s read timeout) are fine.
          </p>
        </ContentStep>
        <Flowchart
          title="Idle worker — short vs long polling"
          chart={`flowchart LR
  subgraph Short
    S1[Receive wait 0] --> S2[Empty response]
    S2 --> S1
  end
  subgraph Long
    L1[Receive wait 20] --> L2[Hold up to 20 seconds]
    L2 --> L3[Messages or empty]
    L3 --> L1
  end`}
        />
      </LessonSection>

      <LessonSection title="Batch APIs">
        <ContentStep number={1} title="Receive up to 10">
          <p className="text-slate-300">
            <span className="font-mono text-sm">MaxNumberOfMessages</span> ranges 1–10. Asking for 10 does not
            guarantee 10 — Standard queues may return fewer even when more are waiting. Loop until empty rather
            than assuming one call drains the backlog.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SendMessageBatch and DeleteMessageBatch">
          <p className="text-slate-300">
            Up to 10 entries per call, each with a caller-assigned <span className="font-mono text-sm">Id</span>.
            Total batch payload shares the per-message size limit (1 MiB today, 256 KiB historically). Producers
            listing 5,000 new S3 keys send 500 batch calls instead of 5,000 single sends.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partial batch failures">
          <p className="text-slate-300">
            A batch call can return HTTP 200 while individual entries fail. The response has{' '}
            <span className="font-mono text-sm">Successful</span> and{' '}
            <span className="font-mono text-sm">Failed</span> lists — always inspect{' '}
            <span className="font-mono text-sm">Failed</span> and retry only those entries (with backoff), or you
            silently drop messages.
          </p>
        </ContentStep>
        <Example title="Boto3 batch send with partial failure handling" caption="Retry only failed entries">
{`entries = [
    {'Id': str(i), 'MessageBody': json.dumps({'bucket': 'acme-lake-prod', 'key': k})}
    for i, k in enumerate(keys[:10])
]
resp = sqs.send_message_batch(QueueUrl=QUEUE_URL, Entries=entries)

failed_ids = {f['Id'] for f in resp.get('Failed', [])}
if failed_ids:
    retry = [e for e in entries if e['Id'] in failed_ids]
    # log SenderFault vs service errors; retry with exponential backoff
    sqs.send_message_batch(QueueUrl=QUEUE_URL, Entries=retry)`}
        </Example>
      </LessonSection>

      <LessonSection title="Cost math">
        <ContentStep number={1} title="How requests are counted">
          <p className="text-slate-300">
            Each API action is a request, and each <strong className="text-white">64 KB chunk</strong> of payload
            counts as one request. A 200 KB message is billed as 4 requests; a batch of ten 5 KB messages (50 KB
            total) is billed as 1. Standard queues cost about $0.40 per million requests after the monthly free
            tier (FIFO about $0.50) in us-east-1 — check current pricing for your Region.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Requests per month</th>
                <th className="px-4 py-3">Approx cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Idle worker short polling every 100 ms', '~25.9 million', '~$10.40 per worker'],
                ['Idle worker long polling 20 s', '~130,000', '~$0.05 per worker'],
                ['Send 10M small messages one by one', '10 million', '~$4.00'],
                ['Send 10M small messages in batches of 10', '1 million', '~$0.40'],
              ].map(([scenario, requests, cost]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{requests}</td>
                  <td className="px-4 py-3">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Batch the full lifecycle: receive 10, process, then one DeleteMessageBatch. Ten single deletes after a
          batch receive quietly doubles the request bill of a busy ingest queue.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Short polling samples servers and returns immediately — frequent empty receives cost money.',
          'Long polling: WaitTimeSeconds up to 20, or ReceiveMessageWaitTimeSeconds on the queue as default.',
          'MaxNumberOfMessages up to 10; SendMessageBatch and DeleteMessageBatch take up to 10 entries.',
          'Batch calls can partially fail — inspect the Failed list and retry only those entries.',
          'Billing is per request and per 64 KB chunk — batching and long polling cut cost by an order of magnitude.',
        ]}
      />
    </LessonArticle>
  )
}
