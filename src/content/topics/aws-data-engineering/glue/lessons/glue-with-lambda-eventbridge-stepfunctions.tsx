import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GlueWithLambdaEventbridgeStepfunctions() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Glue is the transform engine — not the whole orchestra">
        Landing signals, pre-flight checks, branching on quality, and human approvals live in{' '}
        <strong className="text-white">Lambda</strong>, <strong className="text-white">EventBridge</strong>,
        and <strong className="text-white">Step Functions</strong>. Glue runs the heavy Spark work; surrounding
        services wire event-driven data platforms that survive production incident response.
      </Callout>

      <Definition term="Event-driven Glue orchestration">
        <p>
          A pattern where S3 uploads, schedule ticks, or custom bus events trigger lightweight handlers that
          validate, parameterize, and start Glue job runs — then react to completion or failure without a
          always-on scheduler EC2. Decouples ingest rate from transform capacity.
        </p>
      </Definition>

      <LessonSection title="Glue + Lambda">
        <ContentStep number={1} title="S3 event → Lambda → Glue">
          <p className="text-slate-300">
            ObjectCreated on landing prefix invokes Lambda: verify file size, stamp{' '}
            <span className="font-mono text-sm">run_date</span>, call{' '}
            <span className="font-mono text-sm">glue:StartJobRun</span> with arguments. Debounce multiple
            small files with SQS buffer if vendor sends 500 JSON files per minute — one Glue run per batch,
            not per file.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Post-Glue Lambda">
          <p className="text-slate-300">
            On job success EventBridge event, Lambda updates watermark table, triggers Athena row-count QA,
            or sends Slack summary. Keep Lambda thin — no multi-GB transforms; delegate to Glue Spark.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM separation">
          <p className="text-slate-300">
            Lambda starter role: StartJobRun on specific job ARNs + read landing S3. Glue job role: read/write
            lake paths + catalog — not admin on all Glue. Principle of least privilege per step.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue + EventBridge">
        <ContentStep number={1} title="Event sources">
          <p className="text-slate-300">
            Native AWS events: S3 (via EventBridge notification), Glue Job State Change, scheduled rules
            (cron), custom application events on default or dedicated bus. Replace brittle CloudWatch Events
            legacy naming — EventBridge is the modern bus.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Routing patterns">
          <p className="text-slate-300">
            Rule: detail-type Glue Job State Change AND jobName silver_etl AND state FAILED → SNS ops.
            Rule: S3 Object Created AND prefix raw/vendor_a/ → target Lambda starter. Content-based filtering
            avoids one Lambda parsing every bucket event.
          </p>
        </ContentStep>
        <ContentStep number={3} title="vs Glue workflow triggers">
          <p className="text-slate-300">
            Glue workflows excel inside Glue-only DAGs. EventBridge excels when pipeline spans Athena, Lambda,
            Step Functions, and third-party SaaS. Most mature platforms use both: EventBridge fan-in, Glue
            workflow for internal crawl→silver chain.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue + Step Functions">
        <ContentStep number={1} title="Standard workflow for pipelines">
          <p className="text-slate-300">
            Step Functions coordinates: Lambda pre-check → Glue StartJobRun.sync (wait for completion) →
            Athena query integration → Choice on row count → parallel gold jobs → SNS. Built-in service
            integrations avoid Lambda polling loops for long Glue runs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Error handling">
          <p className="text-slate-300">
            Catch Glue failure → notify → optional retry branch with backoff. Human approval task for
            backfill bookmark reset. Visual state machine is living runbook — onboard new DEs faster than
            tribal Lambda chain knowledge.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When Step Functions over Glue workflow">
          <p className="text-slate-300">
            Cross-service DAG with conditional Athena, DynamoDB watermark update, external HTTP callback —
            Step Functions. Pure Glue crawl/job sequence — Glue workflow simpler and cheaper orchestration tax.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Integrated orchestration flowchart">
        <Flowchart
          title="Event-driven lake pipeline — multi-service"
          chart={`flowchart TB
  S3[S3 landing ObjectCreated]
  EB[EventBridge rule]
  LAM[Lambda validate and StartJobRun]
  GLUE[Glue Spark silver ETL]
  EB2[EventBridge Job State Change]
  SF[Step Functions continuation]
  ATH[Athena QA query sync]
  CH{Rows OK?}
  GOLD[Glue gold job]
  SNS[SNS success or alert]
  S3 --> EB
  EB --> LAM
  LAM --> GLUE
  GLUE --> EB2
  EB2 --> SF
  SF --> ATH
  ATH --> CH
  CH -->|yes| GOLD
  CH -->|no| SNS
  GOLD --> SNS`}
        />
        <Callout variant="insight">
          Use <span className="font-mono text-sm">StartJobRun.sync</span> in Step Functions for jobs under
          state machine timeout (max 1 year standard workflow) — for multi-hour Glue, split stages or use
          callback pattern with task token.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Lambda: lightweight validate, debounce, StartJobRun — never multi-TB transform in Lambda.',
          'EventBridge: route S3, schedules, Glue job state to targets with content filters.',
          'Step Functions: cross-service DAG with sync Glue wait, Athena QA, retries, human gates.',
          'Glue workflows for Glue-only DAGs; EventBridge + Step Functions when pipeline spans services.',
          'Separate IAM roles per orchestration step — starter vs job execution vs QA reader.',
        ]}
      />
    </LessonArticle>
  )
}
