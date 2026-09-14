import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithLambda() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Lambda after S3 for data engineering">
        You know who may access AWS (IAM), where long-running code lives (EC2), and where lake data
        is stored (S3). The next question event-driven pipelines ask is:{' '}
        <strong className="text-white">what runs automatically when a file lands?</strong> AWS Lambda
        is the default answer for lightweight, serverless reactions — validate a CSV upload, convert
        JSON to Parquet, fan out a notification, or start a Glue job — without provisioning a server
        that sits idle between events.
      </Callout>

      <Definition term="What is AWS Lambda in a DE pipeline?">
        <p>
          <strong className="text-white">AWS Lambda</strong> runs your code in response to events. You
          upload a function (handler + dependencies), configure memory and timeout, attach an execution
          role, and AWS invokes it when something happens — an S3 object created, a schedule tick, an
          API call, or a message on a queue. You pay per invocation and per millisecond of compute, not
          for an always-on EC2 box.
        </p>
        <p className="mt-2 text-slate-300">
          Think of Lambda as{' '}
          <span className="text-core-400">the reflex layer on top of your S3 lake</span> — storage holds
          the data; Lambda reacts the moment new objects appear.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build Lambda in layers so triggers and concurrency limits do not overwhelm you on day one.
          Follow this order:
        </p>
        <ContentStep number={1} title="Basics — function, handler, runtime">
          <p className="text-slate-300">
            Understand what a Lambda function is, how the handler entry point works, and why Python is
            the common DE runtime for quick transforms and boto3 calls to S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Events, context, and invocation">
          <p className="text-slate-300">
            Learn what arrives in the event payload (especially S3 notifications), what the context
            object tells your code about the current run, and what &quot;invocation&quot; means in logs
            and billing.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Configuration — env, timeout, memory, layers, role">
          <p className="text-slate-300">
            Tune environment variables, timeout, and memory (which also affects CPU), package shared
            dependencies with Layers, and wire the execution role from your IAM knowledge.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Triggers and production patterns (next module)">
          <p className="text-slate-300">
            After this beginner pass: S3 event notifications, EventBridge schedules, SQS buffering,
            concurrency limits, dead-letter queues, and when to hand off heavy work to Glue or EC2.
          </p>
        </ContentStep>
        <Flowchart
          title="Lambda sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is serverless]
  B --> C[Handler and runtime]
  C --> D[Events context invocation]
  D --> E[Env timeout memory]
  E --> F[Layers intro]
  F --> G[Execution role basics]
  G --> H[Putting it together]
  H --> I[Triggers and concurrency — next]`}
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
                ['Function', 'The deployed unit of code — your Python file packaged and named in Lambda (e.g. s3-csv-validator)'],
                ['Handler', 'The entry point AWS calls — format module.function (e.g. app.lambda_handler)'],
                ['Runtime', 'The language version Lambda provides — Python 3.12, Node.js 20, etc.'],
                ['Event', 'JSON payload describing what triggered the run — S3 bucket/key, schedule time, API body'],
                ['Context', 'Runtime metadata about this invocation — request ID, remaining time, memory limit'],
                ['Invocation', 'One execution of your function — counted for billing, logs, and concurrency'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Handler naming — quick check">
          If your file is <code className="text-core-400">processor.py</code> and the function inside is{' '}
          <code className="text-core-400">lambda_handler</code>, set the handler to{' '}
          <code className="text-core-400">processor.lambda_handler</code>. A typo here causes instant
          runtime errors before your DE logic runs.
        </Callout>
      </LessonSection>

      <LessonSection title="How Lambda fits after S3 in a lake">
        <p className="text-slate-300">
          S3 holds raw and processed objects. Lambda sits on the event edge: when a producer uploads to{' '}
          <code className="text-core-400">raw/incoming/</code>, Lambda can validate schema, move bad files
          to a quarantine prefix, write a clean copy to <code className="text-core-400">processed/</code>,
          or publish to SNS so downstream Glue knows work is ready — all without SSH into EC2.
        </p>
        <Flowchart
          title="S3 event → Lambda → processed output or notify"
          chart={`flowchart LR
  UP[Producer uploads CSV to S3 raw/]
  UP --> EV[S3 ObjectCreated event]
  EV --> L[Lambda function]
  L --> R{Valid schema?}
  R -->|Yes| W[Write Parquet to processed/]
  R -->|No| Q[Move to quarantine/ + log]
  W --> N[Optional SNS notify Glue team]
  Q --> N`}
        />
        <Callout variant="insight">
          Lambda excels when work finishes in seconds or a few minutes and scales with sporadic uploads.
          A six-hour Spark dedupe still belongs on Glue or EC2. Mature platforms mix both: Lambda at the
          ingestion edge, heavy transforms deeper in the stack.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about Lambda">
        <ContentStep number={1} title="Event-driven ETL glue">
          <p className="text-slate-300">
            Files landing in S3 are events. Lambda turns &quot;something arrived&quot; into &quot;run this
            Python&quot; automatically — the pattern behind many serverless ingestion pipelines before
            data reaches the catalog.
          </p>
        </ContentStep>
        <ContentStep number={2} title="No idle servers">
          <p className="text-slate-300">
            Nightly batch volume might be zero at 2 p.m. With Lambda you do not pay for an EC2 instance
            waiting. Scale to zero between uploads; AWS spins up concurrent executions when many files
            arrive at once.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM roles you already understand">
          <p className="text-slate-300">
            Every function uses an execution role — the same role mechanics from the IAM track. Scope
            S3 read on <code className="text-core-400">raw/*</code> and write on{' '}
            <code className="text-core-400">processed/*</code>; no long-lived keys in environment
            variables.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda follows S3 in the track — storage is settled; now you react to uploads and events without managing servers.',
          'Roadmap: basics → events/context → config (env, timeout, memory, layers, role) → triggers and production patterns next.',
          'Core vocabulary: function, handler, runtime, event, context, invocation.',
          'Typical DE flow: S3 ObjectCreated → Lambda validates/transforms → writes processed/ or notifies downstream.',
        ]}
      />
    </LessonArticle>
  )
}
