import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DataLakeZones() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Folders are not chaos — they are contracts">
        A production data lake partitions S3 by <strong className="text-white">zone</strong> — each zone
        has allowed formats, retention, access roles, and quality expectations. Whether you label them
        raw/processed/curated or bronze/silver/gold, the architecture is the same: progressive refinement
        from ingest to trusted analytics.
      </Callout>

      <Definition term="Medallion architecture (Bronze / Silver / Gold)">
        <p>
          Popularized in Databricks; maps cleanly to S3 prefixes on AWS.{' '}
          <strong className="text-white">Bronze</strong> = immutable raw landing.{' '}
          <strong className="text-white">Silver</strong> = cleaned, conformed, deduplicated.{' '}
          <strong className="text-white">Gold</strong> = business-level aggregates and feature tables
          optimized for consumption. Glue, Athena, and Redshift Spectrum all read the same S3 layout —
          names differ, semantics align with raw/processed/curated.
        </p>
      </Definition>

      <LessonSection title="Raw / Processed / Curated zones">
        <ContentStep number={1} title="Raw (Bronze)">
          <p className="text-slate-300">
            Append-only landing: source files, API dumps, CDC streams materialized as JSON/CSV/Avro.
            Schema may drift; PII may exist — restrict IAM to ingest and transform roles only. Long retention;
            lifecycle to IA/Glacier by age. Path example:{' '}
            <span className="font-mono text-sm">s3://lake/raw/events/year=2026/month=03/day=15/</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Processed (Silver)">
          <p className="text-slate-300">
            Validated, typed, deduplicated — often Parquet with stable schema. Null handling, unit
            normalization, join keys resolved. Glue jobs read raw, write processed. Analysts may debug here
            but prod dashboards should not depend on silver without SLA ownership.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Curated (Gold)">
          <p className="text-slate-300">
            Business-ready datasets: star-schema facts, daily KPI rolls, ML feature stores. Strict schema
            contracts, column-level governance (Lake Formation), read-heavy IAM for Athena/Redshift/QuickSight.
            Highest query frequency — keep Standard storage class on hot partitions.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Zone</th>
                <th className="px-4 py-3">Medallion</th>
                <th className="px-4 py-3">Typical format</th>
                <th className="px-4 py-3">Who reads</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Raw', 'Bronze', 'JSON, CSV, Avro', 'Glue crawlers, transform jobs'],
                ['Processed', 'Silver', 'Parquet, Iceberg', 'DE debug, downstream Gold jobs'],
                ['Curated', 'Gold', 'Parquet, aggregated', 'Analysts, BI, ML serve, Redshift'],
              ].map(([zone, medal, fmt, readers]) => (
                <tr key={zone} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{zone}</td>
                  <td className="px-4 py-3">{medal}</td>
                  <td className="px-4 py-3 font-mono text-xs">{fmt}</td>
                  <td className="px-4 py-3">{readers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Architecture flowchart">
        <Flowchart
          title="Zone flow — source to serve"
          chart={`flowchart LR
  SRC[Sources — APIs DBs streams files]
  ING[Ingest — Lambda Kinesis Firehose]
  RAW[S3 raw bronze — append-only]
  GLUE[Glue Spark jobs]
  PROC[S3 processed silver — cleaned Parquet]
  CUR[S3 curated gold — KPI tables]
  ATH[Athena ad hoc SQL]
  RS[Redshift Spectrum COPY]
  QS[QuickSight dashboards]
  SRC --> ING
  ING --> RAW
  RAW --> GLUE
  GLUE --> PROC
  PROC --> GLUE
  GLUE --> CUR
  CUR --> ATH
  CUR --> RS
  CUR --> QS`}
        />
        <ContentStep number={1} title="Single bucket vs multi-bucket">
          <p className="text-slate-300">
            Small teams: one bucket, prefix zones (<span className="font-mono text-sm">raw/</span>,{' '}
            <span className="font-mono text-sm">processed/</span>,{' '}
            <span className="font-mono text-sm">curated/</span>). Enterprise: separate buckets per zone for
            IAM boundary and lifecycle — e.g. raw bucket with Glacier lifecycle, curated bucket with stricter
            encryption and no delete for analysts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Governance per zone">
          <p className="text-slate-300">
            Tag objects with <span className="font-mono text-sm">data_zone=raw</span>,{' '}
            <span className="font-mono text-sm">dataset=sales</span>,{' '}
            <span className="font-mono text-sm">pii=true</span>. Lake Formation LF-Tags enforce column
            grants on curated while raw stays locked down. Lifecycle rules filter on tags for tiering.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anti-pattern: skip silver">
          <p className="text-slate-300">
            Jumping raw → curated in one job works for prototypes; production needs replayable silver when
            business rules change — reprocess silver to gold without re-ingesting from source systems.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Document zone contracts in a data catalog README: expected partition keys, SLA freshness, owning
          team, and allowed consumers — S3 layout is your API surface.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Raw/Bronze = immutable landing; Processed/Silver = cleaned conformed; Curated/Gold = business-ready serve layer.',
          'Progressive refinement on S3 prefixes — same pattern under medallion or raw/processed/curated naming.',
          'IAM and lifecycle differ per zone: tight write on raw, read-heavy on curated, Glacier on aging raw.',
          'Single bucket with prefixes vs multi-bucket — trade simplicity vs hard security boundaries.',
          'Keep silver for replayability when transformation logic changes — do not over-collapse zones in prod.',
        ]}
      />
    </LessonArticle>
  )
}
