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

export function SpectrumExternalTables() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Spectrum queries the lake from Redshift SQL — same Glue catalog as Athena">
        <strong className="text-white">Amazon Redshift Spectrum</strong> runs SQL against external tables
        whose metadata lives in the <strong className="text-white">AWS Glue Data Catalog</strong> and whose
        bytes sit on S3. Join Spectrum external tables with local warehouse facts in one query — without
        COPYing entire history into RMS.
      </Callout>

      <Definition term="Redshift Spectrum">
        <p>
          Spectrum is the Redshift query layer for external schemas. Compute nodes (or serverless RPUs) issue
          parallel S3 reads through the catalog — similar economics to Athena scans but integrated into
          warehouse joins and WLM. You pay for Spectrum data scanned plus warehouse compute time.
        </p>
      </Definition>

      <LessonSection title="External tables and external schema">
        <ContentStep number={1} title="CREATE EXTERNAL SCHEMA">
          <p className="text-slate-300">
            Map a Redshift schema to a Glue database:{' '}
            <span className="font-mono text-sm">CREATE EXTERNAL SCHEMA lake FROM DATA CATALOG DATABASE 'curated' IAM_ROLE 'arn:…';</span>{' '}
            Tables defined in Glue appear as{' '}
            <span className="font-mono text-sm">lake.events</span>,{' '}
            <span className="font-mono text-sm">lake.orders</span> — same definitions Athena uses.
          </p>
        </ContentStep>
        <ContentStep number={2} title="External vs local tables">
          <p className="text-slate-300">
            External tables have no dist/sort keys in Redshift — performance depends on S3 file layout,
            Parquet column pruning, and Hive partition filters. Local gold tables hold hot aggregates with
            KEY/SORT tuning; Spectrum holds cold history or raw curated zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition projection and MSCK">
          <p className="text-slate-300">
            Same catalog rules as Athena: filter{' '}
            <span className="font-mono text-sm">year=</span>,{' '}
            <span className="font-mono text-sm">month=</span> in WHERE. Missing Glue partitions → zero rows.
            Partition projection table properties work through Spectrum when set on Glue table.
          </p>
        </ContentStep>
        <Example title="Join local fact to Spectrum history">
{`SELECT l.customer_id, SUM(l.amount) AS recent_amt,
       COUNT(s.event_id) AS lifetime_events
FROM gold.fact_orders l
JOIN lake.events s
  ON l.customer_id = s.user_id
WHERE l.order_date >= DATEADD(day, -30, CURRENT_DATE)
  AND s.year = '2026' AND s.month = '03'
GROUP BY 1;`}
        </Example>
      </LessonSection>

      <LessonSection title="Glue Data Catalog integration">
        <Definition term="Shared metastore">
          <p>
            Glue databases, tables, and partitions are the{' '}
            <strong className="text-white">single source of truth</strong> for Athena, EMR, Spectrum, and
            Lake Formation permissions. DE workflow: Glue ETL writes Parquet + registers partitions → Spectrum
            external schema sees new data without Redshift DDL replay → COPY subset into local gold when BI
            SLAs require it.
          </p>
        </Definition>
        <ContentStep number={1} title="IAM for Spectrum">
          <p className="text-slate-300">
            Same cluster-associated role as COPY must Allow{' '}
            <span className="font-mono text-sm">glue:GetTable</span>,{' '}
            <span className="font-mono text-sm">glue:GetPartitions</span>, and S3 read on external table
            locations. Lake Formation grants layer on top for column/row filters.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When not to Spectrum">
          <p className="text-slate-300">
            High-frequency dashboard on billion-row fact — COPY hot window locally. Repeated full external
            scans blow scan cost and WLM slots. Spectrum shines for occasional deep history joins, audit
            lookups, and exploratory SQL across zones you already curated for Athena.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lake + warehouse flowchart">
        <Flowchart
          title="Spectrum — Glue catalog lake + local warehouse"
          chart={`flowchart TB
  S3[S3 curated Parquet partitions]
  GLUE[Glue Data Catalog]
  EXT[External schema lake]
  LOCAL[Local gold tables COPY]
  RS[Redshift compute]
  BI[BI dashboards]
  GLUE --> EXT
  S3 --> EXT
  S3 --> LOCAL
  EXT --> RS
  LOCAL --> RS
  RS --> BI
  GLUE -.->|same metadata| ATH[Athena ad hoc]`}
        />
        <Callout variant="insight">
          Interview line: &quot;Spectrum avoids duplicating cold lake data in RMS; I COPY only the grain and
          window BI needs locally, and Spectrum for long-tail history joins in one SQL session.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Spectrum: SQL on Glue-cataloged S3 tables via CREATE EXTERNAL SCHEMA — shared with Athena.',
          'External tables: no dist/sort in Redshift — Parquet, partitions, and file sizing drive performance.',
          'Join Spectrum external tables with local gold facts — one query spans lake + warehouse.',
          'IAM role needs Glue catalog read + S3 GetObject; Lake Formation may govern fine-grained access.',
          'COPY hot paths locally; Spectrum for cold history and exploratory joins — avoid repeated full scans.',
        ]}
      />
    </LessonArticle>
  )
}
