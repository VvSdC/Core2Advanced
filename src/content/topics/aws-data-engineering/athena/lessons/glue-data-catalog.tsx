import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GlueDataCatalog() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena does not store your table metadata">
        Amazon Athena is a serverless SQL engine — it reads objects from S3 using metadata in the{' '}
        <strong className="text-white">AWS Glue Data Catalog</strong>. Without catalog entries, Athena has
        no column names, partition keys, or SerDe hints. Glue is Athena&apos;s metastore; S3 is the data
        plane.
      </Callout>

      <Definition term="Glue Data Catalog as Athena metastore">
        <p>
          The catalog holds <strong className="text-white">databases</strong>,{' '}
          <strong className="text-white">tables</strong>, and{' '}
          <strong className="text-white">partitions</strong> in a Hive-compatible model. Each table points at
          an S3 <span className="font-mono text-sm">LOCATION</span>, declares input format and SerDe, and
          lists partition columns. Athena, Redshift Spectrum, EMR, and Lake Formation all read the same
          catalog — register once, query everywhere.
        </p>
      </Definition>

      <LessonSection title="How databases and tables are shared">
        <ContentStep number={1} title="Single source of truth">
          <p className="text-slate-300">
            When a Glue crawler or ETL job creates{' '}
            <span className="font-mono text-sm">curated.sales</span>, Athena immediately sees it under the
            same database name. No duplicate schema in Athena — you pick the catalog database in the query
            editor or pass <span className="font-mono text-sm">Database=curated</span> to the API.
          </p>
        </ContentStep>
        <ContentStep number={2} title="How metadata gets into the catalog">
          <p className="text-slate-300">
            <strong className="text-white">Crawlers</strong> infer schema from S3 prefixes and register
            partitions. <strong className="text-white">Glue ETL</strong> writes Parquet and updates the
            catalog via the Data Catalog API. <strong className="text-white">DDL in Athena</strong>{' '}
            (CREATE EXTERNAL TABLE) writes directly to Glue. <strong className="text-white">MSCK REPAIR</strong>{' '}
            or partition projection syncs partition lists with S3 folder layout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="IAM and Lake Formation">
          <p className="text-slate-300">
            Athena execution role needs <span className="font-mono text-sm">glue:GetTable</span>,{' '}
            <span className="font-mono text-sm">GetPartitions</span>, and S3 read on table locations. Lake
            Formation can layer column- and row-level grants on the same catalog entries — Athena honors LF
            policies when enabled on the workgroup.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Registration method</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Partition handling</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Glue crawler', 'Raw/bronze discovery, schema drift', 'Adds partitions from S3 paths'],
                ['Glue ETL job', 'Curated Parquet with known schema', 'DynamicFrame sink writes catalog + S3'],
                ['Athena DDL', 'Manual external tables, quick prototypes', 'PARTITIONED BY + MSCK or projection'],
                ['API / Terraform', 'IaC, multi-env promotion', 'BatchCreatePartition on deploy'],
              ].map(([method, best, parts]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{method}</td>
                  <td className="px-4 py-3">{best}</td>
                  <td className="px-4 py-3">{parts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Catalog → Athena query path">
        <Flowchart
          title="Glue Data Catalog in the lake query stack"
          chart={`flowchart TB
  S3RAW[S3 raw CSV JSON]
  S3CUR[S3 curated Parquet]
  CRAWL[Glue crawler]
  ETL[Glue Spark ETL]
  DDL[Athena CREATE EXTERNAL TABLE]
  CAT[Glue Data Catalog]
  DB[(Database curated)]
  TBL[(Table sales partitions)]
  WG[Athena workgroup]
  ATH[Athena Presto engine]
  OUT[S3 query results]
  S3RAW --> CRAWL
  S3CUR --> ETL
  CRAWL --> CAT
  ETL --> CAT
  DDL --> CAT
  CAT --> DB
  DB --> TBL
  TBL --> WG
  WG --> ATH
  S3CUR --> ATH
  ATH --> OUT`}
        />
        <Callout variant="tip">
          Name databases by zone or domain — <span className="font-mono text-sm">raw</span>,{' '}
          <span className="font-mono text-sm">curated</span>, <span className="font-mono text-sm">analytics</span>{' '}
          — so analysts know scan cost and data quality expectations before running SQL.
        </Callout>
        <Callout variant="insight">
          If Athena returns &quot;Table not found,&quot; check region alignment first — catalog, workgroup,
          and S3 bucket must live in the same Region unless using cross-Region catalog patterns (rare in DE).
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena uses the Glue Data Catalog as its Hive metastore — databases, tables, and partitions point at S3.',
          'Crawlers, Glue ETL, and Athena DDL all write to the same catalog; no separate Athena-only schema store.',
          'One catalog entry powers Athena, Spectrum, EMR, and Lake Formation — register metadata once per table.',
          'Execution IAM needs Glue read + S3 GetObject on table LOCATION prefixes; Lake Formation adds fine-grained grants.',
          'Broken queries often trace to missing partitions, wrong SerDe/format, or Region mismatch — not Athena itself.',
        ]}
      />
    </LessonArticle>
  )
}
