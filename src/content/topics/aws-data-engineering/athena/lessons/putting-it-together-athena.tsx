import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherAthena() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena is serverless SQL on your lake — if the catalog and format are right">
        You covered Glue catalog integration, external tables, partitions, DDL, CTAS, views, workgroups,
        Parquet optimization, predicate pushdown, cost controls, federated query, UNLOAD, Iceberg, Lambda/Glue
        patterns, and analytics workflows. This checkpoint ties intermediate and advanced Athena lessons
        together before Redshift — the warehouse serve layer for low-latency BI.
      </Callout>

      <Definition term="Athena mental model for data engineering">
        <p>
          Athena is <strong className="text-white">Presto-compatible SQL</strong> over Glue-cataloged S3 — billing
          on bytes scanned, not cluster uptime. Success requires: curated Snappy Parquet, partition filters in
          every production query, workgroup isolation, catalog hygiene, and knowing when to hand off to Glue
          (transform) or Redshift (serve).
        </p>
      </Definition>

      <LessonSection title="Athena sub-topic map">
        <Flowchart
          title="Athena lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Athena complete path]
  START --> CAT[Glue Data Catalog]
  START --> EXT[External tables and partitions]
  START --> DDL[Creating tables DDL]
  START --> CTAS[CTAS and views]
  START --> WG[Workgroups]
  START --> PART[Partitioning Parquet optimization]
  START --> PUSH[Predicate pushdown SELECT star]
  START --> FED[Federated UNLOAD Iceberg]
  START --> INT[Lambda and Glue patterns]
  START --> COST[Cost optimization scan bytes]
  START --> WF[Analytics workflows]
  CAT --> RSNEXT
  EXT --> RSNEXT
  DDL --> RSNEXT
  CTAS --> RSNEXT
  WG --> RSNEXT
  PART --> RSNEXT
  PUSH --> RSNEXT
  FED --> RSNEXT
  INT --> RSNEXT
  COST --> RSNEXT
  WF --> RSNEXT
  RSNEXT[Redshift — warehouse serve next]`}
        />
      </LessonSection>

      <LessonSection title="Full Athena checkpoint — can you explain…">
        <ContentStep number={1} title="Catalog and tables">
          <p className="text-slate-300">
            Where does Athena store table metadata? What is the difference between external and managed tables
            in practice (DROP behavior)? When do you MSCK REPAIR vs partition projection?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Format and partitions">
          <p className="text-slate-300">
            Why is curated Parquet with Snappy the default? What is the small file problem and how do you fix
            it? Which partition keys are good vs bad for a clickstream table?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cost">
          <p className="text-slate-300">
            What drives Athena bill — rows returned or bytes scanned? How do partition pruning and column
            selection stack? What does a workgroup scan limit protect against?
          </p>
        </ContentStep>
        <ContentStep number={4} title="CTAS vs views vs UNLOAD">
          <p className="text-slate-300">
            When CTAS to convert CSV → Parquet? When a view is enough? When UNLOAD instead of downloading
            interactive results?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Pipeline integration">
          <p className="text-slate-300">
            How does Lambda run a post-ETL row count check? When does Glue replace Athena for the same SQL?
            Where does Iceberg fit vs append-only Parquet?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Analytics placement">
          <p className="text-slate-300">
            Sketch raw → curated → validation → gold → BI. Why is Athena wrong as sole serve for sub-second
            executive dashboards at scale?
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interview-style quick checks">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Strong answer sketch</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Athena pricing model?',
                  'Pay per TB data scanned from S3 (+ small per-query fee); not cluster hours — optimize bytes read.',
                ],
                [
                  'Metastore for Athena?',
                  'AWS Glue Data Catalog — Hive-compatible databases, tables, partitions shared with Spectrum/EMR.',
                ],
                [
                  'Partition pruning vs predicate pushdown?',
                  'Pruning skips S3 prefixes on partition columns; pushdown skips Parquet row groups via column stats.',
                ],
                [
                  'Why avoid SELECT *?',
                  'Parquet reads all columns referenced — star scan wastes bytes on wide curated tables.',
                ],
                [
                  'CTAS use case?',
                  'Materialize query to new S3 Parquet table — format conversion, gold aggregates, silver promotion.',
                ],
                [
                  'Workgroup purpose?',
                  'Isolate result location, scan limits, encryption, metrics — dev vs BI vs pipeline separation.',
                ],
                [
                  'Query returns zero rows after ingest?',
                  'Missing partitions (MSCK/projection), wrong LOCATION, or SerDe mismatch — data may exist on S3.',
                ],
                [
                  'Athena vs Redshift?',
                  'Athena: serverless ad hoc on S3, scan-priced; Redshift: provisioned MPP warehouse for low-latency serve and high concurrency.',
                ],
                [
                  'Iceberg when?',
                  'ACID MERGE/DELETE/time travel on lake — when append-only Parquet external tables are insufficient.',
                ],
                [
                  'Federated query caution?',
                  'Lambda connector to RDS/DynamoDB — OK for small lookups; full OLTP table scan via federation is anti-pattern.',
                ],
              ].map(([question, answer]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{answer}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Ready for Redshift when…">
          You can whiteboard a partitioned Parquet curated table, explain why a missing{' '}
          <span className="font-mono text-sm">year=</span> filter blows the budget, describe CTAS vs Glue for
          silver → gold, and place Athena correctly between Glue ETL and warehouse serve — without opening the
          docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — Redshift">
        <p className="text-slate-300">
          Athena excels at flexible SQL on the lake at scan-based cost. Amazon Redshift provides a{' '}
          <strong className="text-white">provisioned columnar warehouse</strong> for hot facts, sort/dist keys,
          concurrency scaling, and Spectrum joins to the same Glue-cataloged S3 you queried in Athena. The
          next sub-topic covers local tables, COPY from curated prefixes, workload management, and when to
          load gold aggregates from Athena CTAS into Redshift for sub-second dashboards.
        </p>
        <Flowchart
          title="After Athena — course thread"
          chart={`flowchart LR
  S3[S3 lake zones]
  GLUE[Glue catalog ETL]
  ATH[Athena checkpoint]
  RS[Redshift warehouse]
  BI[Production BI]
  S3 --> GLUE
  GLUE --> ATH
  ATH --> RS
  S3 --> RS
  RS --> BI
  ATH -.->|ad hoc remain| BI`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding analysts, tuning a new curated table, or investigating a
          scan cost spike — answers usually trace to partitions, Parquet, SELECT lists, or workgroup limits
          covered in these lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena: Glue catalog + S3 data, scan-priced SQL — Parquet, partitions, and column discipline are mandatory.',
          'Intermediate: external tables, DDL, CTAS/views, workgroups — foundation for team-scale lake querying.',
          'Advanced: pushdown, cost checklist, federated/UNLOAD/Iceberg, Lambda/Glue integration, workflow placement.',
          'Use checkpoint questions and interview table before Redshift — know when lake SQL ends and warehouse begins.',
          'Next sub-topic: Redshift — COPY, sort keys, Spectrum, and production BI serve on curated lake data.',
        ]}
      />
    </LessonArticle>
  )
}
