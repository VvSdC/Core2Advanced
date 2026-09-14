import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherRedshift() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Redshift is the warehouse serve layer — MPP tuning + lake integration">
        You covered leader/compute architecture, RA3 managed storage, serverless, distribution and sort keys,
        COPY/UNLOAD, loading best practices, Spectrum, WLM, materialized views, maintenance, data sharing,
        federation, and Glue/Athena/S3 patterns. This checkpoint ties intermediate and advanced Redshift
        lessons together before RDS — operational databases in the DE story.
      </Callout>

      <Definition term="Redshift mental model for data engineering">
        <p>
          Redshift is a <strong className="text-white">columnar MPP warehouse</strong> — pay for compute (nodes
          or RPUs) and storage (RMS), win on dist/sort design, WLM, and selective lake integration. Success
          requires: COPY hot gold from curated Parquet, Spectrum for cold history, ANALYZE/VACUUM discipline,
          and knowing when serverless vs provisioned RA3 fits your concurrency curve.
        </p>
      </Definition>

      <LessonSection title="Redshift sub-topic map">
        <Flowchart
          title="Redshift lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[Redshift complete path]
  START --> ARCH[Leader and compute nodes]
  START --> RA3[RA3 managed storage]
  START --> SLS[Redshift Serverless]
  START --> DIST[Distribution styles]
  START --> SORT[Sort keys ATO]
  START --> COPY[COPY and UNLOAD]
  START --> LOAD[Loading best practices]
  START --> SPEC[Spectrum external tables]
  START --> WLM[WLM concurrency MVs QMR]
  START --> MAINT[VACUUM ANALYZE encoding]
  START --> SHARE[Data sharing federated]
  START --> INT[Glue Athena S3 patterns]
  ARCH --> RDSNEXT
  RA3 --> RDSNEXT
  SLS --> RDSNEXT
  DIST --> RDSNEXT
  SORT --> RDSNEXT
  COPY --> RDSNEXT
  LOAD --> RDSNEXT
  SPEC --> RDSNEXT
  WLM --> RDSNEXT
  MAINT --> RDSNEXT
  SHARE --> RDSNEXT
  INT --> RDSNEXT
  RDSNEXT[RDS — operational DB next]`}
        />
      </LessonSection>

      <LessonSection title="Full Redshift checkpoint — can you explain…">
        <ContentStep number={1} title="Architecture and sizing">
          <p className="text-slate-300">
            Leader vs compute node roles? What RA3 managed storage decouples? When serverless vs provisioned
            RA3 for spiky BI vs steady load?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Physical design">
          <p className="text-slate-300">
            EVEN vs KEY vs ALL with a fact-dimension example? Compound vs interleaved sort? How skew_rows
            and unsorted % inform tuning?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Bulk I/O">
          <p className="text-slate-300">
            COPY from curated Parquet vs Spectrum query-only? Manifest and file sizing? IAM role requirements
            and stl_load_errors debugging?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Operations">
          <p className="text-slate-300">
            WLM queues vs concurrency scaling? Materialized view refresh for dashboards? VACUUM/ANALYZE cadence
            after nightly ETL?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Lake integration">
          <p className="text-slate-300">
            External schema to Glue catalog? Athena vs Redshift division of labor? Datashare vs federated
            query vs CDC to S3?
          </p>
        </ContentStep>
        <ContentStep number={6} title="End-to-end pipeline">
          <p className="text-slate-300">
            Sketch Glue → curated S3 → Athena QA → COPY → gold MV → QuickSight. Where UNLOAD closes the loop
            back to the lake?
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
                  'Leader vs compute node?',
                  'Leader plans/coordinates/merges; compute nodes store slices and run parallel scan/join/aggregate.',
                ],
                [
                  'RA3 benefit?',
                  'Managed storage decouples TB storage from node count — scale compute for WLM, RMS for history.',
                ],
                [
                  'DISTKEY choice?',
                  'Hash on high-cardinality join column shared by largest fact-to-fact or fact-dim join — avoid skew.',
                ],
                [
                  'Compound sort key rule?',
                  'Leading column = most common range filter (usually date) — best zone-map pruning.',
                ],
                [
                  'COPY vs Spectrum?',
                  'COPY local for hot BI joins/sort keys; Spectrum for cold lake history without RMS duplication.',
                ],
                [
                  'Concurrency scaling?',
                  'Temporary burst clusters when WLM queues backlog — cap max for cost; not a substitute for bad dist keys.',
                ],
                [
                  'Materialized views?',
                  'Precomputed aggregates with auto-refresh — shrink dashboard scan cost on billion-row facts.',
                ],
                [
                  'VACUUM vs ANALYZE?',
                  'VACUUM reclaims/resorts; ANALYZE updates planner stats — both after heavy COPY/DELETE.',
                ],
                [
                  'Data sharing?',
                  'Producer datashare → consumer read-only database — no COPY between accounts/clusters.',
                ],
                [
                  'Federated query caution?',
                  'Small RDS lookups OK — full OLTP extract anti-pattern; use DMS/CDC to lake instead.',
                ],
                [
                  'Athena vs Redshift?',
                  'Athena: scan-priced ad hoc on S3; Redshift: MPP warehouse for concurrent low-latency BI on local gold.',
                ],
                [
                  'Serverless vs provisioned?',
                  'Serverless: RPU auto-scale for spiky/idle; provisioned RA3: predictable high concurrency and ops control.',
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
        <Callout variant="tip" title="Ready for RDS when…">
          You can whiteboard COPY from curated Parquet with IAM role, explain KEY+compound sort on a fact table,
          place Spectrum vs local gold, and describe WLM + MV strategy for mixed BI/ETL — without opening the
          docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — RDS">
        <p className="text-slate-300">
          Redshift serves analytics at scale on columnar MPP storage.{' '}
          <strong className="text-white">Amazon RDS</strong> covers operational OLTP databases — PostgreSQL,
          MySQL, and others — that feed CDC pipelines into your lake. The next sub-topic covers RDS basics,
          backups, read replicas, and how DE teams extract operational data without federated query abuse on
          production instances.
        </p>
        <Flowchart
          title="After Redshift — course thread"
          chart={`flowchart LR
  OLTP[RDS operational DB]
  CDC[DMS or CDC to S3]
  LAKE[S3 curated zone]
  RS[Redshift gold]
  BI[Production BI]
  OLTP --> CDC
  CDC --> LAKE
  LAKE --> RS
  RS --> BI
  OLTP -.->|small federated lookup| RS`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding BI developers, tuning a new gold fact after COPY, or
          investigating WLM queue spikes — answers usually trace to dist/sort keys, unsorted %, or missing
          partition filters on Spectrum joins covered in these lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Redshift: MPP columnar warehouse — leader/compute, RA3 RMS, serverless RPUs, dist/sort physical design.',
          'Intermediate: distribution, sort keys, COPY/UNLOAD, loading manifests/IAM — lake to gold ingest spine.',
          'Advanced: Spectrum, WLM/MVs, maintenance, datashares, federation, Glue/Athena/S3 integration patterns.',
          'Use checkpoint questions and interview table before RDS — know warehouse vs lake vs OLTP boundaries.',
          'Next sub-topic: RDS — operational databases, CDC into the lake, and safe extraction for analytics.',
        ]}
      />
    </LessonArticle>
  )
}
