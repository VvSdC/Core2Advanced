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

export function WhatIsLambdaServerless() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Lambda is AWS&apos;s way of running a <strong className="text-white">small piece of your code</strong>{' '}
        only when something triggers it. You do not pick an instance type, patch an OS, or SSH in. Upload
        your handler, set memory and timeout, attach a role — AWS runs it and sends you a bill for the
        milliseconds it actually executed.
      </Callout>

      <Definition term="AWS Lambda">
        <p>
          <strong className="text-white">AWS Lambda</strong> is a serverless compute service. You provide
          code; AWS provides the runtime, scaling, and underlying hardware. Each run is isolated, billed
          separately, and capped at 15 minutes maximum duration — a hard limit data engineers must respect
          when choosing Lambda vs Glue or EC2.
        </p>
      </Definition>

      <LessonSection title="What &quot;serverless&quot; really means">
        <p className="text-slate-300">
          &quot;Serverless&quot; does <em>not</em> mean no servers exist — AWS still runs your code on
          machines. It means <strong className="text-white">you do not manage those servers</strong>: no
          AMI selection, no Auto Scaling Group tuning, no patching Tuesday for the Lambda layer. You
          manage the function configuration and the business logic inside the handler.
        </p>
        <ContentStep number={1} title="You focus on the handler">
          <p className="text-slate-300">
            Write Python that reads an S3 event, transforms rows, writes Parquet. AWS handles placing
            that code on capacity, recycling containers between invocations, and scaling concurrent
            executions when 500 files upload at once.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AWS focuses on the platform">
          <p className="text-slate-300">
            Runtime security patches, isolation between tenants, and capacity in each Region are AWS&apos;s
            responsibility under the shared responsibility model — similar in spirit to how S3 manages
            disks while you manage bucket policies.
          </p>
        </ContentStep>
        <Flowchart
          title="Serverless vs EC2 mental model"
          chart={`flowchart TB
  subgraph EC2["EC2 — you manage the box"]
    E1[Choose instance type]
    E2[Install Python and deps]
    E3[Keep server running or stop it]
    E4[Pay while instance exists]
  end
  subgraph Lambda["Lambda — you manage the function"]
    L1[Upload code and set handler]
    L2[Configure memory timeout role]
    L3[AWS runs on each event]
    L4[Pay per invocation and duration]
  end`}
        />
      </LessonSection>

      <LessonSection title="Pay per use and scale to zero">
        <ContentStep number={1} title="Billing basics">
          <p className="text-slate-300">
            You pay for <strong className="text-white">requests</strong> (per million invocations) and{' '}
            <strong className="text-white">duration</strong> (GB-seconds: memory allocated × time running).
            Idle time costs nothing — there is no &quot;stopped but still billed&quot; EC2 hour when no
            files arrive.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Scale to zero">
          <p className="text-slate-300">
            Between events, Lambda runs zero copies of your function. The first upload after a quiet
            weekend may hit a <strong className="text-white">cold start</strong> — a few extra milliseconds
            while AWS prepares a runtime. For bursty ingestion that trade-off is usually acceptable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Automatic scale-out">
          <p className="text-slate-300">
            One S3 prefix might receive 1,000 simultaneous uploads. Lambda can run many parallel
            invocations (subject to account concurrency limits) without you launching 1,000 EC2 instances
            manually — each invocation processes one event unless you batch in code.
          </p>
        </ContentStep>
        <Example title="Rough cost intuition" caption="Not a quote — illustrates pay-per-use">
{`Scenario: 50,000 CSV files/month, 200 ms avg, 512 MB memory
EC2: t3.small 24/7 ≈ fixed monthly cost even if 20 days are quiet
Lambda: pay ~50k invocations + GB-seconds only when files land
Heavy month: Lambda scales; quiet month: bill drops toward zero`}
        </Example>
        <Callout variant="tip" title="When pay-per-use hurts">
          Steady high-throughput workloads running 24/7 at full CPU can cost more on Lambda than a
          right-sized EC2 or Glue job. Serverless wins on sporadic, short tasks — classic ingestion
          triggers and orchestration glue.
        </Callout>
      </LessonSection>

      <LessonSection title="When data engineering uses Lambda">
        <ContentStep number={1} title="Light transforms on file arrival">
          <p className="text-slate-300">
            Validate headers, decompress gzip, convert JSON lines to a single Parquet part, strip PII
            columns, or partition by date in the key path — work that finishes in seconds and fits in
            memory you configure (up to 10 GB).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Orchestration glue">
          <p className="text-slate-300">
            A Lambda function receives an S3 event and calls{' '}
            <code className="text-core-400">glue:StartJobRun</code>, posts to Slack via SNS, or writes a
            row to DynamoDB tracking table — coordinating heavier jobs without hosting Airflow for a
            single step.
          </p>
        </ContentStep>
        <ContentStep number={3} title="File triggers at the lake edge">
          <p className="text-slate-300">
            S3 event notifications (covered in the next module) invoke Lambda on{' '}
            <code className="text-core-400">s3:ObjectCreated:*</code>. That pattern is the serverless
            front door to medallion layouts: raw upload → Lambda quality check → processed prefix ready
            for Glue crawler.
          </p>
        </ContentStep>
        <ContentStep number={4} title="What Lambda is not for">
          <p className="text-slate-300">
            Long Spark jobs, training ML models for hours, or workloads needing more than 15 minutes or
            10 GB RAM belong on Glue, EMR, or EC2. Lambda is a scalpel, not the entire ETL factory.
          </p>
        </ContentStep>
        <Example title="DE workload fit" caption="Lambda vs alternatives">
{`Workload                         Lambda?        Why
S3 upload → validate + move       Yes            Seconds, event-driven
Nightly 4-hour Spark dedupe       No             Exceeds 15 min; use Glue
Schedule: start Glue at 2 AM      Yes            EventBridge + StartJobRun
Streaming aggregation             Kinesis/Lambda   Specialized; later module
Ad-hoc pandas on 50 GB file       No             Memory/time limits; EC2/Glue`}
        </Example>
        <Callout variant="insight">
          Production data platforms rarely pick one compute style. Lambda handles the reactive edge; Glue
          handles batch Spark; EC2 handles custom long runners. Knowing Lambda&apos;s limits is as
          important as knowing its strengths.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda runs your code on demand — serverless means you manage the function, not servers or OS patching.',
          'Pay per invocation and GB-second duration; scale to zero between events; automatic parallel scale on bursts.',
          'DE uses Lambda for light transforms, orchestration glue, and S3 file-trigger reactions at the lake edge.',
          'Not for 15+ minute or multi-GB Spark work — pair Lambda with Glue, EC2, and S3 for full pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
