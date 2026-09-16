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

export function WhatIsEventbridge() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Amazon EventBridge is a{' '}
        <strong className="text-white">serverless event router</strong> in AWS. When something happens — a
        file lands in S3, a Glue job finishes, or a scheduled time arrives — EventBridge receives a small
        JSON message (an event), checks your rules, and delivers copies to the Lambdas, Glue workflows, or
        other services you configured. You do not manage servers, queues, or polling loops; you define
        &quot;if this event looks like X, send it to Y.&quot;
      </Callout>

      <Definition term="Amazon EventBridge">
        <p>
          <strong className="text-white">Amazon EventBridge</strong> is a fully managed service that connects
          application components using events. Producers publish events to an{' '}
          <strong className="text-white">event bus</strong>; consumers are{' '}
          <strong className="text-white">targets</strong> attached to <strong className="text-white">rules</strong>{' '}
          that filter which events get delivered. EventBridge supports AWS service events (S3, Glue, EC2,
          etc.), custom application events, scheduled invocations, and cross-account routing on custom buses.
        </p>
      </Definition>

      <LessonSection title="Event bus — the central router">
        <p className="text-slate-300">
          An event bus is the channel events travel on. Every AWS account has a{' '}
          <strong className="text-white">default event bus</strong> that automatically receives events from
          AWS services in that account and Region. You can also create{' '}
          <strong className="text-white">custom event buses</strong> for application domains, SaaS partners,
          or cross-account fan-in — covered in later lessons.
        </p>
        <ContentStep number={1} title="Default bus — AWS service events land here">
          <p className="text-slate-300">
            When you enable S3 Event Notifications to EventBridge, or when Glue emits job state changes, those
            events appear on the default bus. Rules on that bus decide what happens next — start ETL, alert
            ops, or ignore.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Rules — filters plus routing">
          <p className="text-slate-300">
            Each rule either matches incoming events by pattern or runs on a schedule. A rule can have
            multiple targets — one S3 landing event might simultaneously start a Glue workflow and post to an
            SNS topic for audit.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Targets — who receives the event">
          <p className="text-slate-300">
            Common DE targets: AWS Lambda, AWS Glue (job or workflow), AWS Step Functions, Amazon SNS, Amazon
            SQS, CloudWatch Logs, and another event bus. EventBridge invokes targets with IAM permissions you
            grant on the rule — not with network paths from VPC lessons.
          </p>
        </ContentStep>
        <Flowchart
          title="EventBridge as serverless router"
          chart={`flowchart TB
  PROD[Producers S3 Glue apps schedule]
  PROD --> BUS[Event bus default or custom]
  BUS --> R1[Rule S3 raw landing]
  BUS --> R2[Rule nightly cron]
  BUS --> R3[Rule Glue failure alert]
  R1 --> T1[Lambda validate]
  R1 --> T2[Glue workflow]
  R2 --> T3[Step Functions lake build]
  R3 --> T4[SNS on-call]`}
        />
      </LessonSection>

      <LessonSection title="Relationship to CloudWatch Events naming">
        <p className="text-slate-300">
          If you learned AWS before 2019, you may know <strong className="text-white">CloudWatch Events</strong>.
          EventBridge is the evolution of that service — same default bus, same underlying event format, and
          expanded features (custom buses, Schema Registry, SaaS integrations, archive and replay).
        </p>
        <ContentStep number={1} title="Same default bus, new console and APIs">
          <p className="text-slate-300">
            Rules you created as &quot;CloudWatch Events rules&quot; still work; the API namespace is now{' '}
            <code className="text-core-400">events</code> (EventBridge). Documentation and the console say
            EventBridge; older runbooks may still say CloudWatch Events — they mean the same default bus for
            AWS service events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scheduled rules — shared heritage">
          <p className="text-slate-300">
            Cron and rate schedules on the default bus predate the EventBridge brand. Glue scheduled triggers
            and EventBridge scheduled rules both express &quot;run at 02:00 UTC daily&quot; — choose one
            orchestration layer per pipeline to avoid double-firing the same job.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What EventBridge added beyond CloudWatch Events">
          <p className="text-slate-300">
            Custom event buses, partner event sources (SaaS), event archiving, replay, Schema Registry, and
            richer input transformation — platform features DE teams use at scale after mastering default-bus
            S3 and Glue patterns.
          </p>
        </ContentStep>
        <Callout variant="insight">
          In interviews and architecture reviews, say EventBridge. When you see CloudWatch Events in legacy
          IAM policies or CloudFormation, read it as EventBridge on the default bus unless custom buses are
          explicitly named.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineering cares about EventBridge">
        <ContentStep number={1} title="S3 is event-native through EventBridge">
          <p className="text-slate-300">
            Modern lake ingestion wires S3 Object Created events to validation Lambdas or Glue workflows.
            EventBridge scales with upload rate and filters by bucket, prefix, and suffix — cleaner than
            chaining many S3 notification configurations when multiple consumers need the same landing signal.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue emits operational events">
          <p className="text-slate-300">
            Glue job and crawler state changes appear on the default bus. Rules on FAILED states drive SNS
            pages; SUCCEEDED states chain gold-layer jobs — operational observability without parsing CloudWatch
            Logs by hand.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Schedules for predictable batch">
          <p className="text-slate-300">
            Nightly silver ETL, weekly full recompute, hourly micro-batch — schedule expressions replace cron
            on EC2. EventBridge invokes Step Functions or Glue with a consistent IAM role and retry semantics.
          </p>
        </ContentStep>
        <Example title="DE question — EventBridge or something else?" caption="When EventBridge fits">
{`Use EventBridge when:
  - S3 file landing should trigger downstream processing
  - Glue/Step Functions should start on a cron or rate schedule
  - Multiple teams need the same AWS service event with different filters
  - You want decoupled "something happened" → "run worker" wiring

Consider alternatives when:
  - Single producer → single SQS queue is enough (simple queue, no pattern fan-out)
  - Glue-only DAG with no cross-service steps → native Glue workflow triggers may suffice
  - High-volume stream processing → Kinesis or MSK, not EventBridge as primary ingest`}
        </Example>
      </LessonSection>

      <LessonSection title="What EventBridge is not">
        <ContentStep number={1} title="Not a data store">
          <p className="text-slate-300">
            Events are small JSON messages — metadata about what happened, not the CSV or Parquet payload.
            Your ETL still reads from S3; EventBridge only carries the pointer and context (bucket, key, job
            name, state).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not a replacement for Step Functions for complex DAGs">
          <p className="text-slate-300">
            EventBridge starts work and fans out signals. Long-running multi-step pipelines with branching,
            retries, and human approval usually use Step Functions (often started by EventBridge) — not a chain
            of fifty EventBridge rules alone.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not VPC-bound">
          <p className="text-slate-300">
            EventBridge operates at the AWS service plane. Lambda and Glue targets may run inside your VPC,
            but the bus itself does not require subnets or security groups — complementary to VPC networking,
            not inside it.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'EventBridge is a serverless event router — buses receive events, rules filter or schedule, targets run the next step.',
          'CloudWatch Events is the legacy name for the same default-bus model; modern docs and features use EventBridge.',
          'DE use cases: S3 landing triggers, Glue job state reactions, cron/rate schedules for batch ETL, decoupled multi-consumer fan-out.',
          'EventBridge carries signals and metadata — S3 and Glue still hold the data; Step Functions often orchestrates complex DAGs started by EventBridge.',
        ]}
      />
    </LessonArticle>
  )
}
