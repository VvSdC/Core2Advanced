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

export function StepFunctionsForDataEngineering() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where Step Functions earns its place in a data platform">
        You now know the states, the JSON, and the two workflow types. This lesson answers the practical
        question: <strong className="text-white">which data engineering jobs should run on Step Functions,
        and which should not?</strong> The right answer saves you from fragile cron chains — the wrong one
        turns an orchestrator into an expensive, slow queue.
      </Callout>

      <Definition term="Pipeline orchestration">
        <p>
          <strong className="text-white">Pipeline orchestration</strong> is coordinating the order, timing,
          retries, and branching of the steps that move data — ingest, validate, transform, quality-check,
          load, notify. Step Functions orchestrates;{' '}
          <span className="text-core-400">Glue, Athena, Redshift, and Lambda do the actual data work</span>,
          and S3 holds the data itself.
        </p>
      </Definition>

      <LessonSection title="Five common DE use cases">
        <ContentStep number={1} title="Nightly ETL orchestration">
          <p className="text-slate-300">
            EventBridge Scheduler starts <code className="text-core-400">de-orders-nightly-sfn-prod</code> at
            01:00: validate → Glue <code className="text-core-400">orders-silver-etl</code> → crawler → Athena
            check → SNS. The classic Standard workflow.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Per-file ingest workflow">
          <p className="text-slate-300">
            An S3 landing event in <code className="text-core-400">acme-lake-prod/raw/</code> starts one
            execution per vendor file: check schema, convert to Parquet, register the partition, archive the
            original.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Backfills with Map">
          <p className="text-slate-300">
            Reprocess 90 days of history by passing a list of dates to a Map state with a concurrency limit
            of 5 — parallel but polite to Glue capacity and source systems.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Data quality gates">
          <p className="text-slate-300">
            Run an Athena or Glue Data Quality check after the transform; a Choice state publishes to gold only
            when checks pass, otherwise Fail and alert <code className="text-core-400">de-alerts-prod</code>.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Lake → warehouse loads">
          <p className="text-slate-300">
            Glue writes silver Parquet, then the Redshift Data API runs COPY and a merge procedure — multiple
            services, one visible sequence.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Replacing cron + Lambda chains">
        <p className="text-slate-300">
          Many teams start with a cron schedule that invokes Lambda A, which starts Glue, whose completion
          event triggers Lambda B, which runs Athena and emails someone. It works — until it silently stops
          halfway and nobody can see where.
        </p>
        <Flowchart
          title="Before — invisible chain vs after — one state machine"
          chart={`flowchart TB
  subgraph Before
    C1[Cron rule] --> L1[Lambda start Glue]
    L1 --> G1[Glue job]
    G1 --> E1[Job state event]
    E1 --> L2[Lambda run Athena]
    L2 --> M1[Email]
  end
  subgraph After
    S2[EventBridge schedule] --> SF[de-orders-nightly-sfn-prod]
    SF --> G2[Glue sync]
    G2 --> A2[Athena check]
    A2 --> N2[SNS de-alerts-prod]
  end`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Concern</th>
                <th className="px-4 py-3">Cron + Lambda chain</th>
                <th className="px-4 py-3">Step Functions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Where did it stop?', 'Search logs across four services', 'Red state in the execution graph'],
                ['Retries', 'Hand-written in each Lambda', 'Retry block per state with backoff'],
                ['Waiting for Glue', 'Polling Lambda or extra event rule', 'startJobRun.sync waits for you'],
                ['Rerun one day', 'Manually invoke the right Lambda with the right payload', 'Start execution with run_date input or redrive'],
              ].map(([concern, before, after]) => (
                <tr key={concern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{concern}</td>
                  <td className="px-4 py-3">{before}</td>
                  <td className="px-4 py-3">{after}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Anti-patterns to avoid">
        <ContentStep number={1} title="Heavy data inside the state payload">
          <p className="text-slate-300">
            The payload passed between states is capped at <strong className="text-white">256 KB</strong>.
            Returning thousands of rows from Lambda or an Athena result set into state data will fail. Pass
            S3 URIs and counts; let Glue and Athena read the data from S3.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Using Step Functions as a queue">
          <p className="text-slate-300">
            Starting one Standard execution per clickstream event to &quot;buffer&quot; work is slow and
            costly. Buffer in SQS or Kinesis; orchestrate batches, or use Express for short per-record flows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Giant monolith state machines">
          <p className="text-slate-300">
            One 120-state definition covering every dataset is unreadable and risky to change. Split per
            dataset or domain and use nested executions for shared steps.
          </p>
        </ContentStep>
        <Example title="Pass pointers, not data" caption="Good vs bad state payload">
{`// BAD - rows inside the state (hits the 256 KB limit fast)
{ "run_date": "2026-09-30", "rows": [ { "order_id": 1, "amount": 42.5 }, ... ] }

// GOOD - small, meaningful pointers
{
  "run_date": "2026-09-30",
  "input_uri": "s3://acme-lake-prod/raw/orders/2026-09-30/",
  "output_uri": "s3://acme-lake-prod/silver/orders/run_date=2026-09-30/",
  "row_count": 184223
}`}
        </Example>
        <Callout variant="insight">
          A quick smell test: if your state data could be printed on one screen and every value is an ID, date,
          count, flag, or S3 URI, you are using Step Functions correctly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Top DE use cases: nightly ETL, per-file ingest, Map-based backfills, data quality gates, and lake-to-warehouse loads.',
          'Step Functions replaces cron + Lambda chains with one visible definition, built-in retries, and .sync waits.',
          'Keep state payloads under 256 KB — pass S3 URIs, dates, and counts, never the rows themselves.',
          'Do not use Step Functions as a queue — buffer in SQS or Kinesis and orchestrate batches.',
          'Split giant monolith state machines per dataset or domain; share steps through nested executions.',
        ]}
      />
    </LessonArticle>
  )
}
