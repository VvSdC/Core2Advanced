import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StepFunctionsVsGlueWorkflowsMwaa() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three orchestrators, one interview question">
        &quot;Why Step Functions and not Airflow?&quot; comes up in every AWS data engineering interview and
        every platform design review. AWS gives you three first-party answers —{' '}
        <strong className="text-white">Step Functions</strong>, <strong className="text-white">Glue Workflows</strong>,
        and <strong className="text-white">Amazon MWAA</strong> (Managed Workflows for Apache Airflow) — plus
        lightweight options like EventBridge Pipes. The right choice depends on scope, team skills, and how you
        backfill.
      </Callout>

      <Definition term="Orchestrator">
        <p>
          The component that decides <em>what runs next</em> and <em>what happens on failure</em> across the
          steps of a pipeline. It does not move data itself — Glue, Athena, Redshift, and Lambda do the work;
          the orchestrator sequences, retries, branches, and records history.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Step Functions</th>
                <th className="px-4 py-3">Glue Workflows</th>
                <th className="px-4 py-3">MWAA (Airflow)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Scope', '200+ AWS services plus HTTPS endpoints', 'Glue jobs and crawlers only', 'Anything with an operator or Python'],
                ['Cost model', 'Per state transition (Standard) or request plus duration (Express)', 'No extra charge — pay for jobs and crawlers', 'Hourly environment and workers, even when idle'],
                ['Ops overhead', 'Serverless, nothing to patch', 'Serverless, nothing to patch', 'Environment sizing, Airflow upgrades, dependency pinning'],
                ['Definition', 'ASL JSON or YAML, CDK, Workflow Studio', 'Triggers configured in console or IaC', 'Python DAG files in S3'],
                ['Backfill UX', 'Distributed Map over dates or loop executions', 'Rerun workflow with new run properties', 'Native catchup and airflow dags backfill'],
                ['Cross-service reach', 'Native integrations plus callbacks', 'Weak — needs Lambda or EventBridge glue', 'Strong via providers, including non-AWS'],
                ['Team skills', 'AWS-native, IaC-comfortable engineers', 'Glue-centric teams', 'Python and Airflow-experienced teams'],
                ['Failure handling', 'Retry, Catch, redrive per state', 'Basic — rerun failed nodes', 'Task retries, clear and rerun tasks'],
              ].map(([dim, sfn, glue, mwaa]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{sfn}</td>
                  <td className="px-4 py-3">{glue}</td>
                  <td className="px-4 py-3">{mwaa}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When each one fits">
        <ContentStep number={1} title="Step Functions">
          <p className="text-slate-300">
            Event-driven or scheduled pipelines that span several AWS services: S3 landing → Lambda validation →
            Glue → Athena QA → Redshift → SNS, with human approval or external callbacks. Cheap when runs are
            few and long (a nightly run is a few dozen transitions), serverless, and the graph doubles as a
            runbook. Weakest at date-based backfills with dependencies between days.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue Workflows">
          <p className="text-slate-300">
            A small DAG made only of Glue crawlers and jobs — crawl raw, run orders-silver-etl, crawl silver —
            with shared run properties. No orchestration bill, but conditional logic is limited to trigger
            predicates on job state, and anything outside Glue needs EventBridge or Lambda bolted on.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Amazon MWAA">
          <p className="text-slate-300">
            Hundreds of DAGs, heavy dependency graphs between datasets, frequent backfills, sensors on non-AWS
            systems, and a team that already knows Airflow. You pay for an always-on environment (a small one
            runs hundreds of dollars a month) and own DAG code quality, but you get catchup, data-interval
            semantics, and a huge provider ecosystem. MWAA can still call Step Functions for AWS-heavy
            sub-flows.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Simpler still — EventBridge and Pipes">
          <p className="text-slate-300">
            A two-step chain may not need an orchestrator at all. An EventBridge rule on Glue Job State Change
            can start the next job; <strong className="text-white">EventBridge Pipes</strong> connects a source
            (SQS, Kinesis, DynamoDB Streams) to a target with optional filtering and enrichment. Once you need
            retries per step, branching, or a visible run history, graduate to Step Functions.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Cost sanity check">
          <p className="text-slate-300">
            A nightly Standard workflow with 40 transitions costs fractions of a cent per run — 30 runs a month
            is nowhere near the price of an idle MWAA environment. The math flips at scale: a Standard workflow
            processing millions of events a day pays per transition, so move that hot path to Express or
            Distributed Map with Express children, and compare against MWAA only when DAG count and backfill
            needs justify an always-on environment.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision flowchart">
        <Flowchart
          title="Pick an orchestrator"
          chart={`flowchart TB
  S[New pipeline]
  Q1{Only one or two steps}
  Q2{Only Glue jobs and crawlers}
  Q3{Team runs many Airflow DAGs}
  Q4{Heavy date backfills and sensors}
  EB[EventBridge rule or Pipes]
  GW[Glue Workflows]
  MW[Amazon MWAA]
  SF[Step Functions]
  S --> Q1
  Q1 -->|yes| EB
  Q1 -->|no| Q2
  Q2 -->|yes and simple| GW
  Q2 -->|no| Q3
  Q3 -->|yes| MW
  Q3 -->|no| Q4
  Q4 -->|yes| MW
  Q4 -->|no| SF`}
        />
        <Callout variant="insight">
          Mature platforms often mix them: MWAA schedules cross-domain dependencies, each domain&apos;s pipeline
          is a Step Functions state machine started by an Airflow operator, and trivial hops use EventBridge.
          Choose per pipeline, not per company.
        </Callout>
        <Callout variant="tip" title="Interview framing">
          Answer with trade-offs, not loyalty: &quot;Step Functions for serverless, AWS-native, event-driven
          workflows with per-state retries; MWAA when we need Airflow-style backfills and many interdependent
          DAGs; Glue Workflows for small Glue-only chains.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Step Functions: serverless, pay per transition, broad AWS integrations, callbacks, and redrive — best for AWS-native pipelines.',
          'Glue Workflows: free orchestration for Glue-only DAGs with limited branching and reach.',
          'MWAA: Python DAGs, native backfill and catchup, big provider ecosystem — at the cost of an always-on environment.',
          'EventBridge rules and Pipes handle one-hop chains without a full orchestrator.',
          'Decide per pipeline by scope, backfill needs, cost model, and team skills — mixing orchestrators is normal.',
        ]}
      />
    </LessonArticle>
  )
}
