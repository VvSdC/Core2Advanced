import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AthenaInAnalyticsWorkflows() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Athena is the lake’s SQL console — not always the serve layer">
        Data engineers use Athena for <strong className="text-white">ad hoc exploration</strong>,{' '}
        <strong className="text-white">post-ETL validation</strong>, and{' '}
        <strong className="text-white">lightweight BI</strong> on curated Parquet. It is the wrong default for
        sub-second dashboards at massive concurrency — that is Redshift or materialized gold tables. Know
        where Athena sits in the analytics workflow.
      </Callout>

      <Definition term="Lake analytics workflow">
        <p>
          Typical path: ingest to S3 raw → Glue ETL to curated Parquet + catalog →{' '}
          <strong className="text-white">Athena SQL</strong> for exploration and QA → promote hot aggregates
          to warehouse or QuickSight SPICE → optional Redshift COPY for low-latency serve. Athena bridges
          engineering and analytics without loading a cluster.
        </p>
      </Definition>

      <LessonSection title="Ad hoc exploration">
        <ContentStep number={1} title="Schema and data profiling">
          <p className="text-slate-300">
            New curated table lands — DE runs distribution checks, null rates, key uniqueness on recent
            partitions before announcing to analysts. Athena replaces downloading Parquet samples locally;
            partition-scoped queries keep exploration cheap.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Incident debugging">
          <p className="text-slate-300">
            Pipeline alert fires — SQL against raw and curated for the affected{' '}
            <span className="font-mono text-sm">year/month/day</span> to compare row counts, spot duplicate
            keys, or trace bad source file via <span className="font-mono text-sm">$path</span> pseudo-column
            patterns in external tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prototype before Glue job">
          <p className="text-slate-300">
            Test JOIN logic and filters in Athena on sample partitions; port proven SQL to Glue Spark or CTAS
            for production scale. Faster iteration than redeploying Spark jobs for every syntax tweak.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Validation after ETL">
        <ContentStep number={1} title="Automated QA queries">
          <p className="text-slate-300">
            Scheduled Athena queries (EventBridge + Lambda or Step Functions): row count vs prior day, referential
            integrity to dimension tables, revenue totals within tolerance. Fail pipeline on threshold breach —
            cheaper than bad data in executive dashboard.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reconciliation">
          <p className="text-slate-300">
            Compare curated aggregates to source system exports or federated RDS snapshot counts. Document
            expected variance (late-arriving facts, currency rounding) in runbooks tied to specific SQL checks.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Store validation SQL in repo with workgroup and partition parameters — reproducible QA beats one-off
          console queries during audits.
        </Callout>
      </LessonSection>

      <LessonSection title="BI light use">
        <ContentStep number={1} title="QuickSight direct query">
          <p className="text-slate-300">
            QuickSight connects to Athena + Glue catalog for dashboards on curated tables — acceptable for
            internal ops metrics with partition filters and SPICE refresh for moderate datasets. Watch scan cost
            when dashboards auto-refresh hourly on wide tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to graduate off Athena">
          <p className="text-slate-300">
            High concurrency, interactive sub-second SLAs, or complex star-schema workloads → Redshift local
            tables or Spectrum hybrid. Athena remains source for ad hoc; warehouse serves production BI.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Lake analytics path flowchart">
        <Flowchart
          title="End-to-end analytics workflow with Athena"
          chart={`flowchart TB
  ING[S3 ingest raw]
  GLUE[Glue ETL job]
  CUR[S3 curated Parquet]
  CAT[Glue Data Catalog]
  EXP[Athena ad hoc exploration]
  QA[Athena scheduled validation]
  PASS{QA pass?}
  GOLD[CTAS or Glue gold aggregates]
  QS[QuickSight SPICE light BI]
  RS[Redshift COPY hot tables]
  EXEC[Executive dashboards]
  ING --> GLUE
  GLUE --> CUR
  GLUE --> CAT
  CUR --> CAT
  CAT --> EXP
  CUR --> QA
  QA --> PASS
  PASS -->|yes| GOLD
  PASS -->|no| FIX[Fix ETL + alert DE]
  GOLD --> QS
  GOLD --> RS
  QS --> EXEC
  RS --> EXEC
  EXP -.->|prototype SQL| GLUE`}
        />
        <Callout variant="insight">
          Athena is the flexible middle — not the landing zone (raw) and not always the final serve (warehouse).
          Position it explicitly in architecture diagrams so stakeholders do not expect warehouse latency from
          serverless lake SQL.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Ad hoc: profile new curated tables, debug incidents, prototype SQL before Glue production jobs.',
          'Post-ETL validation: scheduled partition-scoped QA — row counts, keys, reconciliations — fail pipeline on breach.',
          'Light BI: QuickSight on Athena works with partition discipline and SPICE; graduate hot paths to Redshift.',
          'Workflow: raw → Glue → curated → Athena explore/validate → gold → BI/warehouse serve.',
          'Document validation SQL and scan expectations — Athena’s role is agility with cost-aware guardrails.',
        ]}
      />
    </LessonArticle>
  )
}
