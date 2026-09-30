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

export function ScalingBackpressureMonitoring() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The queue is your pressure gauge">
        A queue decouples how fast work arrives from how fast it is done. That is only useful if you watch it:
        a growing backlog is fine during a vendor bulk drop and alarming at 3 a.m. on a quiet Tuesday. This
        lesson covers the CloudWatch metrics that tell you which, how to scale consumers on backlog, and how to
        deliberately <strong className="text-white">not</strong> scale when the database downstream cannot take
        more.
      </Callout>

      <Definition term="Backpressure">
        <p>
          Letting work accumulate upstream instead of overloading a slower downstream system. With SQS, the
          queue absorbs the excess while consumers are capped at a rate that RDS, Redshift, or a vendor API can
          sustain. The backlog drains once the burst passes — nothing is dropped, only delayed.
        </p>
      </Definition>

      <LessonSection title="Metrics that matter">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it tells you</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ApproximateNumberOfMessagesVisible', 'Backlog waiting to be received — the main scaling signal.'],
                ['ApproximateNumberOfMessagesNotVisible', 'In-flight messages being processed right now.'],
                ['ApproximateAgeOfOldestMessage', 'Freshness SLA — how stale the oldest unprocessed work is.'],
                ['NumberOfMessagesSent', 'Arrival rate from producers; zero may mean upstream is broken.'],
                ['NumberOfMessagesDeleted', 'Completion rate; compare with Sent to see if you are keeping up.'],
                ['NumberOfEmptyReceives', 'Wasted polls — high values mean short polling or too many workers.'],
              ].map(([metric, meaning]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-white">{metric}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Alarm on age, not just depth">
          <p className="text-slate-300">
            Depth of 50,000 is healthy if you drain 2,000 per second. Age of oldest message over 15 minutes on{' '}
            <span className="font-mono text-sm">de-orders-ingest-queue-prod</span> means the freshness SLA is at
            risk whatever the depth. Alarm on age for SLA, on DLQ depth greater than 0 for failures, and on{' '}
            <span className="font-mono text-sm">NumberOfMessagesSent</span> equal to 0 for an hour during business
            hours to catch a silent upstream.
          </p>
        </ContentStep>
        <Example title="Age-of-oldest alarm to SNS" caption="Freshness SLA of 15 minutes">
{`aws cloudwatch put-metric-alarm \\
  --alarm-name de-orders-ingest-age-high \\
  --namespace AWS/SQS \\
  --metric-name ApproximateAgeOfOldestMessage \\
  --dimensions Name=QueueName,Value=de-orders-ingest-queue-prod \\
  --statistic Maximum --period 60 --evaluation-periods 5 \\
  --threshold 900 --comparison-operator GreaterThanThreshold \\
  --alarm-actions arn:aws:sns:us-east-1:111122223333:de-alerts-prod`}
        </Example>
      </LessonSection>

      <LessonSection title="Protecting downstream systems">
        <ContentStep number={1} title="Cap Lambda with maximum concurrency">
          <p className="text-slate-300">
            An RDS PostgreSQL instance with 200 connections cannot survive 800 concurrent Lambdas. Set the ESM{' '}
            <span className="font-mono text-sm">MaximumConcurrency</span> to what the database tolerates (say 25).
            The backlog grows, age rises, and the database stays healthy — that is backpressure working.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Batch into warehouses">
          <p className="text-slate-300">
            Redshift prefers a few large COPY commands over thousands of single-row inserts. Use a large batch
            size with a batching window, stage records to S3, then COPY — or have consumers write S3 files and let
            a scheduled job load them.
          </p>
        </ContentStep>
        <Flowchart
          title="Backpressure in front of a database"
          chart={`flowchart LR
  BURST[Burst of events]
  Q[SQS backlog absorbs]
  ESM[ESM max concurrency 25]
  LAM[Lambda consumers]
  RDS[(RDS 200 connections)]
  CW[CloudWatch age alarm]
  BURST --> Q
  Q --> ESM
  ESM --> LAM
  LAM --> RDS
  Q --> CW`}
        />
      </LessonSection>

      <LessonSection title="Scaling ECS and EC2 workers">
        <ContentStep number={1} title="Backlog per task">
          <p className="text-slate-300">
            Raw queue depth is a poor scaling target because it ignores fleet size. Use{' '}
            <strong className="text-white">backlog per task</strong> = visible messages ÷ running tasks, computed
            with CloudWatch metric math. Target = acceptable latency ÷ average processing time: a 10-minute
            latency goal at 2 s per message gives a target of 300 messages per task.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Target tracking with bounds">
          <p className="text-slate-300">
            Attach a target-tracking policy to the ECS service or Auto Scaling group with min and max capacity.
            Max capacity is your downstream protection — the same role as Lambda maximum concurrency. Scale-in
            must let tasks finish in-flight messages (stop-timeout longer than processing time).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Backfill strategy">
        <ContentStep number={1} title="Separate queue for replays">
          <p className="text-slate-300">
            A 90-day backfill enqueued into the live queue buries today&apos;s data behind millions of old
            messages and blows the freshness alarm. Use{' '}
            <span className="font-mono text-sm">de-orders-backfill-queue-prod</span> with its own ESM and a lower
            concurrency cap, so live traffic keeps priority and the backfill runs at a known, safe rate.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Enqueue backfills in chunks (one message per day or partition, not per row) and throttle the enqueue
          itself. Watch downstream metrics — RDS CPU, Redshift queue wait — not just SQS depth.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Watch visible, not-visible, age of oldest, sent, deleted, and empty receives per queue.',
          'Alarm on ApproximateAgeOfOldestMessage for SLAs and DLQ depth for failures, routed to SNS.',
          'Backpressure: cap Lambda MaximumConcurrency or ECS max capacity at what downstream can sustain.',
          'Scale workers on backlog per task = visible messages divided by running tasks.',
          'Run backfills on a separate, throttled queue so live freshness is not sacrificed.',
        ]}
      />
    </LessonArticle>
  )
}
