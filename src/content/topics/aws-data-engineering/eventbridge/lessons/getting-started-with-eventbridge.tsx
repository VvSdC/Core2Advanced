import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithEventbridge() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why EventBridge after VPC in the DE path">
        You know how VPC keeps RDS, Glue, and Redshift on private paths while S3 endpoints carry lake traffic.
        The next question every data engineer asks is:{' '}
        <strong className="text-white">how do pipelines start automatically when a file lands in S3, a
        nightly ETL window opens, or a Glue job finishes — without cron scripts on a server?</strong> In most
        AWS platforms, the answer is <strong className="text-white">Amazon EventBridge</strong> — the
        serverless event router that connects AWS service signals to Lambda, Glue, Step Functions, and
        downstream targets with rules you define once.
      </Callout>

      <Definition term="What is EventBridge in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon EventBridge</strong> is a managed event bus that receives
          events from AWS services and custom applications, matches them against rules you write, and delivers
          matching events to targets — Lambda functions, Glue workflows, Step Functions state machines, SNS
          topics, and more. For data engineering, EventBridge is the{' '}
          <strong className="text-white">orchestration trigger layer</strong> that turns &quot;something
          happened&quot; into &quot;run the next step of the pipeline.&quot;
        </p>
        <p className="mt-2 text-slate-300">
          Think of EventBridge as{' '}
          <span className="text-core-400">the post office for your data platform — events arrive, rules sort
          them, and the right worker picks up the job</span>.
        </p>
      </Definition>

      <LessonSection title="Event-driven pipelines — why order matters">
        <p className="text-slate-300">
          VPC lessons taught you where Glue and RDS live on the network. Glue lessons taught you how raw S3
          becomes curated Parquet. EventBridge explains{' '}
          <strong className="text-white">when and why those jobs start</strong> — the same nightly batch that
          works in a tutorial may miss files in prod because nobody wired an S3 Object Created rule to the
          silver ETL trigger.
        </p>
        <ContentStep number={1} title="S3 landing — file arrives, pipeline reacts">
          <p className="text-slate-300">
            A vendor drops CSV into{' '}
            <code className="text-core-400">s3://acme-lake/raw/orders/</code>. S3 emits an event to the
            default event bus. An EventBridge rule filters on bucket and prefix, then invokes a Lambda
            validator or starts a Glue workflow — no polling, no always-on scheduler watching the bucket.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scheduled ETL — cron without a server">
          <p className="text-slate-300">
            Nightly warehouse loads run on a schedule expression — rate or cron — that targets a Glue job,
            Step Functions state machine, or Lambda orchestrator. EventBridge replaces fragile cron on EC2
            with a managed, IAM-audited trigger.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Downstream reactions — job done, notify or chain">
          <p className="text-slate-300">
            When a Glue job state changes to SUCCEEDED or FAILED, EventBridge can fan out to SNS for on-call
            alerts, trigger a downstream gold aggregate, or write to a log archive for replay and audit.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: VPC is where ETL runs; EventBridge is what tells ETL to run. Most &quot;the
          pipeline never started&quot; DE incidents are missing or misconfigured EventBridge rules, not bad
          Spark code.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build EventBridge in layers so custom buses, schema registry, and cross-account patterns do not
          overwhelm you on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Core concepts — buses, rules, targets">
          <p className="text-slate-300">
            Understand what an event is, how the default bus receives AWS service events, how rules match
            patterns or schedules, and how targets receive the payload — enough to read a pipeline diagram.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event patterns — filter what you care about">
          <p className="text-slate-300">
            Learn event pattern matching at a high level — filter S3 creates in one prefix, Glue job failures
            only, or specific detail fields — so one bus does not flood every target with noise.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Scheduled rules — cron and rate for batch ETL">
          <p className="text-slate-300">
            Rate expressions for simple intervals and cron for precise nightly windows — align with upstream
            vendor delivery and downstream SLA for lake builds.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Targets, archive, and production pipelines (next module)">
          <p className="text-slate-300">
            After this beginner pass: Lambda and Glue as targets, input transformers, dead-letter queues,
            event archive and replay, Step Functions chains, and multi-account event buses for platform teams.
          </p>
        </ContentStep>
        <Flowchart
          title="EventBridge sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is EventBridge]
  B --> C[Buses rules targets]
  C --> D[Event patterns]
  D --> E[Event-based rules]
  E --> F[Scheduled cron rate]
  F --> G[Default bus mental model]
  G --> H[Putting it together beginner]
  H --> I[Targets archive pipelines — next]`}
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
                [
                  'Event',
                  'A JSON record describing something that happened — source, detail-type, time, and a detail payload with bucket names, job states, etc.',
                ],
                [
                  'Event bus',
                  'The router that receives events — the default bus gets AWS service events in your account; custom buses isolate domains or accounts',
                ],
                [
                  'Rule',
                  'A named filter plus routing config — matches events by pattern or runs on a schedule, then forwards to one or more targets',
                ],
                [
                  'Target',
                  'The destination for matched events — Lambda, Glue workflow, Step Functions, SNS, SQS, another bus, and more',
                ],
                [
                  'Event pattern',
                  'JSON filter on event fields — e.g. only S3 Object Created in a specific bucket and prefix, or only Glue Job Run State Change with FAILED',
                ],
                [
                  'Schedule expression',
                  'Cron or rate string that fires a rule on a timer — e.g. nightly 02:00 UTC for batch ETL without a cron daemon',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and purpose in rule names:{' '}
          <code className="text-core-400">de-s3-orders-raw-landing-prod</code> or{' '}
          <code className="text-core-400">de-nightly-silver-etl-schedule-dev</code>. When a pipeline fails
          silently at 2 a.m., clear rule names on the architecture diagram beat searching fifty generic
          &quot;trigger-rule&quot; entries in the console.
        </Callout>
      </LessonSection>

      <LessonSection title="How EventBridge fits after VPC in a pipeline">
        <p className="text-slate-300">
          A vendor uploads orders CSV to S3. EventBridge receives the Object Created event, a rule matches
          the raw prefix, and the target starts a Glue workflow that runs in your VPC private subnets. VPC
          carries JDBC and S3 endpoint traffic; EventBridge carries the &quot;start now&quot; signal — two
          layers, one production pipeline.
        </p>
        <Flowchart
          title="S3 Object Created → EventBridge rule → Lambda / Glue"
          chart={`flowchart LR
  VND[Vendor or app upload]
  VND --> S3[S3 raw prefix]
  S3 --> EB[EventBridge default bus]
  EB --> RULE[Rule event pattern]
  RULE --> LAM[Lambda validate]
  RULE --> GLUE[Glue workflow start]
  LAM --> GLUE
  GLUE --> CUR[S3 curated Parquet]
  GLUE --> CAT[Glue Data Catalog]`}
        />
        <Callout variant="insight">
          Mature DE platforms combine scheduled rules for predictable batch windows with event-based rules for
          unpredictable file landings — one EventBridge bus, many rules, each target doing one job well.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about EventBridge">
        <ContentStep number={1} title="No polling, no fragile cron servers">
          <p className="text-slate-300">
            S3 event notifications through EventBridge scale with object volume. Scheduled rules replace cron
            on a bastion host — fewer moving parts, IAM-audited triggers, and CloudWatch metrics per rule.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decouple producers from consumers">
          <p className="text-slate-300">
            The team that owns the landing bucket does not hard-code Glue job ARNs in Lambda. They emit events;
            DE teams attach rules and targets. Add a QA Lambda or SNS alert by adding a target, not rewriting
            the uploader.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Glue and Step Functions integration">
          <p className="text-slate-300">
            EventBridge starts Glue workflows, invokes individual Glue jobs, and kicks off Step Functions for
            multi-service orchestration — the glue between &quot;file landed&quot; and &quot;twelve-step lake
            build completed.&quot;
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge follows VPC in the track — private network paths for ETL; EventBridge triggers when ETL should run.',
          'Roadmap: buses/rules/targets → event patterns → event-based and scheduled rules → default bus → targets and archive next.',
          'Core vocabulary: event, bus, rule, target, event pattern, schedule expression.',
          'Typical pattern: S3 Object Created → EventBridge rule → Lambda validate or Glue workflow — plus cron schedules for nightly batch.',
        ]}
      />
    </LessonArticle>
  )
}
