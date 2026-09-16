import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GlueWorkflowsAndTriggers() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Workflows orchestrate Glue jobs — triggers start the chain">
        A single nightly lake build may run crawl → validate → silver ETL → gold aggregate → catalog update.
        <strong className="text-white"> Glue workflows</strong> model that DAG natively with{' '}
        <strong className="text-white">triggers</strong> for schedule, events, and conditional branching —
        lighter than Step Functions for Glue-only pipelines, though many teams combine both at scale.
      </Callout>

      <Definition term="Glue workflow">
        <p>
          A managed directed acyclic graph of Glue crawlers, jobs, and triggers with run history in the Glue
          console. Each node completes before downstream conditional triggers fire. Workflows expose single-run
          visibility — which step failed, retry count, and elapsed time per job — without custom orchestration
          code.
        </p>
      </Definition>

      <LessonSection title="Workflows">
        <ContentStep number={1} title="Building the DAG">
          <p className="text-slate-300">
            Add jobs and crawlers as nodes; wire dependencies so silver ETL waits for landing crawl success.
            A workflow run starts at trigger activation and walks the graph. Failed nodes block dependents unless
            you configure partial recovery or parallel branches for independent marts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Run properties and parameters">
          <p className="text-slate-300">
            Pass workflow run properties (e.g.{' '}
            <span className="font-mono text-sm">run_date</span>) into child job arguments — one scheduled
            date drives all steps. Avoid hardcoding paths in each job; centralize in trigger payload or
            workflow default parameters for environment promotion (dev/staging/prod).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Observability">
          <p className="text-slate-300">
            Workflow runs appear in Glue console and CloudWatch. Tag workflows for cost allocation. For
            cross-service orchestration (Lambda QA, SNS alert), export completion events to EventBridge — Glue
            workflows alone do not call arbitrary AWS APIs without a job or external trigger.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Trigger types">
        <ContentStep number={1} title="Scheduled triggers">
          <p className="text-slate-300">
            Cron-style schedule starts the workflow or individual job — e.g. daily 02:00 UTC after upstream
            batch lands. Same semantics as EventBridge rules but native to Glue. Use for predictable batch
            windows; align with SLA and upstream vendor delivery times.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Event triggers">
          <p className="text-slate-300">
            Fire when an external event arrives — commonly S3 object create via EventBridge rule targeting a
            Glue trigger, or manual start. Fits near-real-time micro-batch when landing files appear
            unpredictably but processing logic stays batch-oriented.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Conditional triggers">
          <p className="text-slate-300">
            Activate after a predecessor job or crawler completes with{' '}
            <strong className="text-white">SUCCEEDED</strong>,{' '}
            <strong className="text-white">FAILED</strong>, or other states. Model success paths (silver after
            crawl OK) and optional failure branches (notify ops crawler). Conditional triggers are the edges
            of the workflow DAG — no separate dependency config file.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Glue Studio teaser">
        <p className="text-slate-300">
          <strong className="text-white">AWS Glue Studio</strong> provides visual ETL authoring — drag sources,
          transforms, and targets; Studio generates PySpark. Workflows can include Studio-created jobs alongside
          hand-written scripts. Studio accelerates prototyping and onboarding; production teams often export
          scripts to Git for review, testing, and Spark tuning beyond visual defaults.
        </p>
        <Callout variant="tip">
          Studio is not a substitute for partition strategy, bookmark design, or cost sizing — validate
          generated code for unnecessary shuffles and missing{' '}
          <span className="font-mono text-sm">transformation_ctx</span> on bookmarked sources.
        </Callout>
      </LessonSection>

      <LessonSection title="Workflow orchestration flowchart">
        <Flowchart
          title="Nightly lake workflow — triggers and dependencies"
          chart={`flowchart TB
  SCHED[Scheduled trigger 02:00 UTC]
  CRAWL[Crawler raw zone]
  T1{Conditional: crawl OK?}
  SILVER[Glue job silver ETL]
  T2{Conditional: silver OK?}
  GOLD[Glue job gold aggregates]
  T3{Conditional: gold OK?}
  SNS[SNS success via Lambda job]
  FAIL[SNS alert on failure]
  SCHED --> CRAWL
  CRAWL --> T1
  T1 -->|yes| SILVER
  T1 -->|no| FAIL
  SILVER --> T2
  T2 -->|yes| GOLD
  T2 -->|no| FAIL
  GOLD --> T3
  T3 -->|yes| SNS
  T3 -->|no| FAIL`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Glue workflows DAG crawlers and jobs with unified run history — native lake orchestration.',
          'Scheduled triggers for cron batch; event triggers for S3 landing signals; conditional for success/fail edges.',
          'Pass run_date via workflow run properties — one schedule drives all downstream job parameters.',
          'Glue Studio visual ETL compiles to PySpark — good for prototypes; production scripts belong in Git.',
          'Combine with EventBridge/Step Functions when pipeline spans Lambda, Athena QA, and non-Glue steps.',
        ]}
      />
    </LessonArticle>
  )
}
