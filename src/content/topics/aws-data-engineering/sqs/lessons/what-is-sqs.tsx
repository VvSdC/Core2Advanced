import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsSqs() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="A queue is just a waiting line — managed for you">
        Before SQS, teams ran their own message brokers on EC2 — patching servers, sizing disks, and praying
        the broker survived the month-end spike. SQS removes all of that. You create a queue with one API
        call, send messages to it, and AWS stores them redundantly until a consumer{' '}
        <strong className="text-white">pulls</strong> them. That pull model is the single biggest difference
        from SNS, which you just learned <strong className="text-white">pushes</strong> messages to
        subscribers.
      </Callout>

      <Definition term="Amazon SQS">
        <p>
          <strong className="text-white">Amazon SQS</strong> is a fully managed, serverless message queue.
          Producers call <code className="text-core-400">SendMessage</code>; the message is stored durably
          across multiple servers in the region. Consumers call{' '}
          <code className="text-core-400">ReceiveMessage</code> when they are ready, process the work, and call{' '}
          <code className="text-core-400">DeleteMessage</code> to confirm it is done. Messages are retained
          from 1 minute to 14 days (default 4 days) if nobody deletes them.
        </p>
      </Definition>

      <LessonSection title="Pull model vs push model">
        <p className="text-slate-300">
          The mental model that makes SQS click: the queue never calls your code. Your consumer asks the queue
          for work. That sounds small, but it changes how pipelines behave under load.
        </p>
        <ContentStep number={1} title="SNS pushes — consumers must keep up">
          <p className="text-slate-300">
            SNS delivers to every subscriber immediately. If a subscriber Lambda is throttled or an HTTP
            endpoint is down, SNS retries for a while — but the subscriber has no control over the pace.
          </p>
        </ContentStep>
        <ContentStep number={2} title="SQS waits — consumers set the pace">
          <p className="text-slate-300">
            SQS holds messages until a consumer polls. A worker that can handle 10 files at a time asks for up
            to 10 messages. If the worker is down for an hour, the messages simply wait — nothing is dropped.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lambda hides the polling for you">
          <p className="text-slate-300">
            With a Lambda event source mapping, AWS runs the pollers and invokes your function with a batch of
            messages. It still is a pull model — you just do not write the loop yourself.
          </p>
        </ContentStep>
        <Flowchart
          title="Push vs pull"
          chart={`flowchart LR
  P1[Producer] --> SNS[SNS topic]
  SNS -->|push now| C1[Subscriber]
  P2[Producer] --> Q[(SQS queue)]
  C2[Consumer] -->|poll when ready| Q`}
        />
      </LessonSection>

      <LessonSection title="Decoupling, durability, and at-least-once">
        <ContentStep number={1} title="Decoupling">
          <p className="text-slate-300">
            The producer only needs the queue URL. It does not know whether one Lambda, ten ECS tasks, or
            nothing at all is consuming right now. You can redeploy, pause, or replace consumers without
            touching the S3 notification or upstream app.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Durability">
          <p className="text-slate-300">
            SQS stores each message redundantly across multiple Availability Zones before{' '}
            <code className="text-core-400">SendMessage</code> returns success. An AZ outage does not lose the
            landing notification for <code className="text-core-400">raw/orders/2026-09-30.csv</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="At-least-once delivery">
          <p className="text-slate-300">
            Standard queues guarantee every message is delivered at least once — occasionally more than once.
            That is why the DynamoDB idempotency table you built in the last module still matters: consumers
            must tolerate duplicates.
          </p>
        </ContentStep>
        <Callout variant="insight">
          SQS gives you durability and retries; it does not give you exactly-once side effects. Pair every
          Standard queue consumer with an idempotency check — conditional PutItem on{' '}
          <code className="text-core-400">bucket#key</code> — before starting Glue or writing to S3.
        </Callout>
      </LessonSection>

      <LessonSection title="Analogy — the restaurant order ticket rail">
        <p className="text-slate-300">
          Picture a busy kitchen. Waiters (producers) clip order tickets onto a rail (the queue). Cooks
          (consumers) pull the next ticket when a burner frees up. During the dinner rush the rail fills up,
          but no order is lost and no cook is buried under ten orders at once.
        </p>
        <ContentStep number={1} title="Ticket taken — hidden from other cooks">
          <p className="text-slate-300">
            When a cook grabs a ticket, other cooks cannot see it. That is the visibility timeout — the message
            is in flight, not deleted.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dish served — ticket spiked">
          <p className="text-slate-300">
            When the plate goes out, the ticket is thrown away. That is{' '}
            <code className="text-core-400">DeleteMessage</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cook walks away — ticket goes back">
          <p className="text-slate-300">
            If a cook leaves mid-order, the ticket goes back on the rail after a while for another cook. A
            ticket that keeps failing goes to the manager&apos;s pile — the dead-letter queue.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SQS vs SNS — teaser">
        <p className="text-slate-300">
          You will compare SQS, SNS, EventBridge, and Kinesis in depth later. For now, keep this table in mind:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">SQS</th>
                <th className="px-4 py-3">SNS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Delivery model', 'Pull — consumers poll', 'Push — topic delivers to subscribers'],
                ['Who gets a message?', 'One consumer processes each message', 'Every subscriber gets a copy'],
                ['Storage', 'Kept up to 14 days until deleted', 'Not stored — delivered and gone'],
                ['Main DE job', 'Buffer work and absorb bursts', 'Fan out one event to many targets'],
                ['Common combo', 'Subscribed to an SNS topic', 'Delivers into SQS queues'],
              ].map(([q, sqs, sns]) => (
                <tr key={q} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{q}</td>
                  <td className="px-4 py-3">{sqs}</td>
                  <td className="px-4 py-3">{sns}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          If you need both — every team gets the event, and each team processes at its own pace — use the SNS →
          SQS fan-out pattern from the SNS module: one topic, one queue per consumer.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SQS is a fully managed, serverless message queue — send, receive, process, delete.',
          'Pull model: consumers poll when ready; SNS pushes immediately to every subscriber.',
          'Messages are stored redundantly across AZs and retained 1 minute to 14 days (default 4 days).',
          'Standard queues are at-least-once — consumers must be idempotent, typically via DynamoDB conditional writes.',
          'SQS buffers work for one consumer group; SNS fans out copies — combine them for fan-out plus buffering.',
        ]}
      />
    </LessonArticle>
  )
}
