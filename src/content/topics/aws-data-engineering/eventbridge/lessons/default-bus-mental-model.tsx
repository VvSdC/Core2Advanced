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

export function DefaultBusMentalModel() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One bus you already have">
        Every AWS account includes a <strong className="text-white">default event bus</strong> in each Region.
        You did not create it — it is already there, named{' '}
        <code className="text-core-400">default</code>, receiving AWS service events when services are
        configured to publish. Most beginner DE pipelines put all rules here until custom buses are needed
        for isolation or cross-account design.
      </Callout>

      <Definition term="Default event bus">
        <p>
          The <strong className="text-white">default event bus</strong> is the pre-provisioned EventBridge
          bus in your account and Region. AWS services such as S3 (when enabled), Glue, EC2, and Step
          Functions publish events to it automatically. Your event-based and scheduled rules on{' '}
          <code className="text-core-400">default</code> filter and route those signals to targets — Lambda,
          Glue, SNS, and more.
        </p>
      </Definition>

      <LessonSection title="What lands on the default bus">
        <ContentStep number={1} title="AWS service events">
          <p className="text-slate-300">
            Glue job and crawler state changes appear without extra setup. S3 Object Created events appear
            after you enable EventBridge notifications on the bucket. Step Functions execution status,
            CodePipeline stages, and dozens of other services emit here — far more than DE uses, which is
            why patterns matter.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scheduled rule ticks">
          <p className="text-slate-300">
            Scheduled rules you create on the default bus also live on{' '}
            <code className="text-core-400">default</code> — the cron invocation is internal to EventBridge,
            but the rule resource is associated with that bus name.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not custom application events by default">
          <p className="text-slate-300">
            Your Python ETL script does not automatically publish to the default bus — you call{' '}
            <code className="text-core-400">PutEvents</code> with an explicit bus name. Beginner DE paths rely
            on AWS service events and schedules, not custom publishers.
          </p>
        </ContentStep>
        <Flowchart
          title="Default bus — AWS services in, rules filter, targets out"
          chart={`flowchart TB
  S3[S3 with EventBridge enabled]
  GLUE[Glue job runs]
  SF[Step Functions]
  S3 --> DEF[Default event bus]
  GLUE --> DEF
  SF --> DEF
  DEF --> R1[Rule S3 landing]
  DEF --> R2[Rule Glue failed]
  DEF --> R3[Rule nightly cron]
  R1 --> T1[Lambda / Glue]
  R2 --> T2[SNS alert]
  R3 --> T3[Step Functions]`}
        />
      </LessonSection>

      <LessonSection title="Mental model for beginners">
        <ContentStep number={1} title="Single shared inbox per account per Region">
          <p className="text-slate-300">
            Picture one inbox labeled <code className="text-core-400">default</code> in us-east-1. Every AWS
            service letter arrives there. Each rule is a filter rule on a mail slot — only matching envelopes
            go to Lambda or Glue. Unmatched mail stays in the bus history briefly (unless archived) and is
            not delivered to your targets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rules are account-local">
          <p className="text-slate-300">
            Rules on the default bus in account A never see events from account B unless cross-account policies
            and custom buses are configured. Prod and dev should be separate accounts or clearly separated
            bucket names in patterns — not one prod target on vague patterns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Region-local">
          <p className="text-slate-300">
            us-east-1 default bus is independent from eu-west-1. Multi-region lake platforms duplicate rules
            per Region or centralize processing in one Region — architectural choice, not automatic fan-out.
          </p>
        </ContentStep>
        <Callout variant="insight">
          When someone says &quot;EventBridge rule on the default bus,&quot; they mean: no custom bus name in
          CloudFormation — the rule&apos;s <code className="text-core-400">EventBusName</code> is{' '}
          <code className="text-core-400">default</code> or omitted (same thing).
        </Callout>
      </LessonSection>

      <LessonSection title="Default bus in DE workflows">
        <ContentStep number={1} title="S3 landing on default">
          <p className="text-slate-300">
            Enable bucket EventBridge notification → Object Created on default bus → rule with bucket + prefix
            pattern → Glue workflow. This is the standard serverless ingest pattern taught in prior lessons.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue operational events">
          <p className="text-slate-300">
            Every job run emits state change events to default. Alert rules and chain rules coexist — many
            rules, one bus, independent patterns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Nightly schedule on default">
          <p className="text-slate-300">
            Cron rule on default starts Step Functions — same bus as S3 events, different rule type. Operators
            find all DE triggers under EventBridge rules filtered by name prefix{' '}
            <code className="text-core-400">de-</code>.
          </p>
        </ContentStep>
        <Example title="Default bus DE starter checklist" caption="Before adding custom buses">
{`1. S3 buckets: EventBridge notifications enabled?
2. Rules: EventBusName = default (or unset)
3. Patterns: bucket and prefix scoped to this account's lake
4. Scheduled rules: cron documented in UTC
5. Targets: IAM roles allow invoke from events.amazonaws.com
6. Metrics: TriggeredRules and FailedInvocations alarms on prod rules`}
        </Example>
      </LessonSection>

      <LessonSection title="Teaser — when custom buses enter the picture">
        <p className="text-slate-300">
          The default bus works until noise, ownership, or cross-account boundaries break down. Platform teams
          then introduce <strong className="text-white">custom event buses</strong>:
        </p>
        <ContentStep number={1} title="Domain isolation">
          <p className="text-slate-300">
            Bus <code className="text-core-400">acme-analytics</code> carries only data-platform events;
            application microservices use <code className="text-core-400">acme-orders-app</code> — rules do
            not compete with unrelated EC2 or CodeDeploy traffic on default.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-account fan-in">
          <p className="text-slate-300">
            Landing account uploads to S3; processing account rule on a shared custom bus starts Glue — policy
            grants <code className="text-core-400">events:PutEvents</code> from source account. Common in
            multi-account data mesh layouts (advanced track).
          </p>
        </ContentStep>
        <ContentStep number={3} title="SaaS partner events">
          <p className="text-slate-300">
            Partner event sources (billing, CRM, ticketing) attach to dedicated buses — not mixed with raw S3
            Object Created on default. DE teams consume partner signals alongside lake events with clear
            ownership.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner now vs platform later"
          chart={`flowchart LR
  NOW[Default bus only]
  NOW --> S3E[S3 Glue schedules]
  LATER[Custom buses added]
  LATER --> ISO[Domain isolation]
  LATER --> XA[Cross-account]
  LATER --> SAAS[Partner sources]
  NOW -.->|when scale requires| LATER`}
        />
        <Callout variant="tip" title="Start simple">
          Master default-bus S3, Glue, and cron patterns before custom buses. Most interview DE scenarios and
          single-account lakes never leave <code className="text-core-400">default</code> in the beginner
          phase.
        </Callout>
      </LessonSection>

      <LessonSection title="Default bus vs CloudWatch Events legacy">
        <p className="text-slate-300">
          CloudWatch Events always meant the default bus. Nothing special about the name change — your mental
          model stays: AWS services → default bus → your DE rules → targets. Custom buses are the EventBridge-era
          extension for organizations that outgrow one shared inbox.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Default bus (named default) exists in every account/Region — AWS service events and your scheduled rules live here.',
          'Mental model: shared inbox; rules filter; only matching events reach targets — patterns prevent noise.',
          'Beginner DE: S3 (enabled), Glue states, nightly cron on default — no custom bus required.',
          'Custom buses come later for isolation, cross-account fan-in, and SaaS partners — master default first.',
        ]}
      />
    </LessonArticle>
  )
}
