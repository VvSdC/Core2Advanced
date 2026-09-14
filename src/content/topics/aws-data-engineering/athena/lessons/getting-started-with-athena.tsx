import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithAthena() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why Athena after SNS for data engineering">
        You know who may access AWS (IAM), where lake data lives (S3), how event-driven code runs (Lambda),
        how to watch pipeline health (CloudWatch), and how alerts reach the team (SNS). The next question
        every analyst and data engineer asks is:{' '}
        <strong className="text-white">how do I run SQL on the files we already stored in S3 — without
        spinning up a database server?</strong> Amazon Athena is AWS&apos;s serverless query engine for
        data lakes. It reads files in S3 using table metadata from the Glue Data Catalog and returns
        results you can download or feed into dashboards — the standard way to explore and validate lake
        data in a DE workflow.
      </Callout>

      <Definition term="What is Athena in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon Athena</strong> is an interactive query service that runs
          standard SQL (Presto/Trino-based) directly against data in S3. You define{' '}
          <strong className="text-white">databases</strong> and <strong className="text-white">tables</strong>{' '}
          in a <strong className="text-white">catalog</strong> (usually AWS Glue Data Catalog), write{' '}
          <code className="text-core-400">SELECT</code> statements in the query editor, and Athena scans
          only the files your query needs. Query output lands in an S3{' '}
          <strong className="text-white">results location</strong> you configure — typically a dedicated
          prefix like <code className="text-core-400">s3://acme-athena-results/</code>.
        </p>
        <p className="mt-2 text-slate-300">
          Think of Athena as{' '}
          <span className="text-core-400">the SQL window on top of your S3 lake</span> — Glue and Lambda
          land and transform files; Athena lets humans and scripts ask questions about those files
          immediately.
        </p>
      </Definition>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build Athena in layers so catalog DDL, partition repair, and cost tuning do not overwhelm you
          on day one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — SQL on S3">
          <p className="text-slate-300">
            Understand what Athena is, how databases and external tables map to S3 prefixes, run your first{' '}
            <code className="text-core-400">SELECT</code>, and set a query results location — enough to
            query a curated Parquet folder from the Console.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Catalog and partitions">
          <p className="text-slate-300">
            Learn how Glue crawlers and DDL create table metadata, why Hive-style partitions (
            <code className="text-core-400">year=2026/month=03/</code>) slash scan cost, and when to run{' '}
            <code className="text-core-400">MSCK REPAIR</code> or use partition projection.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Formats and cost control">
          <p className="text-slate-300">
            See why Parquet and ORC beat CSV for repeated analytics, how Athena bills per data scanned,
            and patterns like column selection, partition filters, and workgroups for team governance.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Advanced lake SQL (next module)">
          <p className="text-slate-300">
            After this beginner pass: CTAS and INSERT INTO for materializing results, federated queries,
            Iceberg tables on S3, integration with QuickSight, and when to load subsets into Redshift
            instead of scanning the full lake every time.
          </p>
        </ContentStep>
        <Flowchart
          title="Athena sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is Athena]
  B --> C[Databases and tables]
  C --> D[First SQL query]
  D --> E[File formats]
  E --> F[Query results location]
  F --> G[Athena vs warehouse teaser]
  G --> H[Putting it together]
  H --> I[Catalog partitions CTAS cost — next]`}
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
                  'Database',
                  'A namespace in the catalog — e.g. de_lake_dev — groups related tables like a schema in traditional SQL',
                ],
                [
                  'Table',
                  'Logical metadata (columns, location, format) pointing at files under an S3 prefix — not a copy of the data',
                ],
                [
                  'Catalog',
                  'The Hive-compatible metadata store — AWS Glue Data Catalog by default — Athena reads table definitions from here',
                ],
                [
                  'Query result location',
                  'S3 prefix where Athena writes CSV/JSON result files for each query — required before your first run',
                ],
                [
                  'Workgroup',
                  'A named settings bundle — result location, encryption, cost controls, query history — scoped per team or environment',
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
        <Callout variant="tip" title="Results bucket — quick check">
          Create a dedicated bucket or prefix for Athena output:{' '}
          <code className="text-core-400">s3://acme-athena-results/</code>. Set it once in Settings →
          Manage → Query result location (account default) or in a dev workgroup. Never reuse your raw
          landing bucket — lifecycle and IAM stay cleaner when scratch output is isolated.
        </Callout>
      </LessonSection>

      <LessonSection title="How Athena fits after SNS in a pipeline">
        <p className="text-slate-300">
          SNS tells you when something broke or finished. Athena tells you <em>what the data looks like</em>{' '}
          after ingest: row counts per partition, null rates in a new column, whether yesterday&apos;s file
          landed in the right prefix. When a CloudWatch alarm fires on Lambda errors, your first debug step
          is often CloudWatch Logs; your second is Athena confirming whether curated tables have rows for
          the expected date.
        </p>
        <Flowchart
          title="S3 data → Glue Catalog → Athena SQL → results in S3"
          chart={`flowchart LR
  S3[S3 lake files CSV JSON Parquet]
  S3 --> GLUE[Glue Data Catalog databases and tables]
  GLUE --> ATH[Athena query editor SQL]
  ATH --> SCAN[Athena engine scans matching files]
  SCAN --> RES[Query results written to S3]
  RES --> YOU[Analyst downloads or QuickSight reads]`}
        />
        <Callout variant="insight">
          Mature data platforms treat Athena as the default ad hoc SQL layer on the lake — not a replacement
          for every warehouse workload, but the fastest way to validate that tonight&apos;s Glue job wrote
          the right row counts before stakeholders open Monday dashboards.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about Athena">
        <ContentStep number={1} title="Query the lake you already built">
          <p className="text-slate-300">
            S3 holds raw, processed, and curated zones. Athena queries those same keys without ETL into a
            separate database first — ideal for exploration, QA checks, and one-off investigations while
            pipelines are still maturing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Serverless — no cluster to resize">
          <p className="text-slate-300">
            No EC2 instances or Redshift nodes to patch at 2 a.m. Athena scales query capacity behind the
            scenes. You pay for data scanned per query, not for idle warehouse capacity — a strong fit for
            intermittent analyst workloads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Shared catalog with Glue and Redshift Spectrum">
          <p className="text-slate-300">
            Table definitions in Glue Data Catalog are reused by Athena, Glue jobs, and Redshift Spectrum.
            Define partitions and schema once; multiple engines read the same S3 layout — less metadata
            drift across the platform.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena follows SNS in the track — alerts tell you something happened; Athena lets you inspect the data in S3 with SQL.',
          'Roadmap: SQL on S3 → catalog and partitions → formats and cost → CTAS and advanced patterns next.',
          'Core vocabulary: database, table, catalog, query result location, workgroup.',
          'Typical flow: S3 files → Glue Catalog metadata → Athena SQL → scan files → results written to S3 output prefix.',
        ]}
      />
    </LessonArticle>
  )
}
