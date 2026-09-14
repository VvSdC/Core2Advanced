import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CostOptimizationDataScanned() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Every dollar in Athena traces to bytes scanned">
        There is no cluster to right-size — cost is{' '}
        <strong className="text-white">$ per TB scanned</strong> (plus minimal per-query fee). Optimization is
        entirely about reading fewer S3 bytes: format, partitions, columns, file sizing, and query discipline.
        This lesson is a practical checklist data engineers use before approving production dashboards.
      </Callout>

      <Definition term="Data scanned">
        <p>
          <span className="font-mono text-sm">Statistics.DataScannedInBytes</span> in query execution metadata
          measures compressed bytes read from S3 for that query — not result row count, not catalog size.
          Same SQL on CSV vs Parquet can differ 10–50x in scan. Workgroup CloudWatch metrics aggregate scan
          for chargeback and anomaly detection.
        </p>
      </Definition>

      <LessonSection title="Storage-layer checklist">
        <ContentStep number={1} title="Convert to Snappy Parquet in curated">
          <p className="text-slate-300">
            Never leave high-churn tables in CSV/JSON for analyst access. Raw zone OK; silver/gold must be
            columnar. CTAS or Glue ETL with explicit compression codec.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partition on query filters">
          <p className="text-slate-300">
            <span className="font-mono text-sm">year/month/day</span> or <span className="font-mono text-sm">dt</span>{' '}
            matching dashboard date ranges. Enable partition projection for predictable layouts to avoid repair
            lag and metadata bloat.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Compact small files">
          <p className="text-slate-300">
            Schedule Glue compaction when average file size drops below ~128 MB. Many tiny files increase
            listing overhead and weaken row group statistics effectiveness.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Drop unused columns early">
          <p className="text-slate-300">
            Strip PII and wide JSON blobs in silver layer — downstream scans inherit column width forever if
            you propagate <span className="font-mono text-sm">SELECT *</span> in CTAS chains.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Query-layer checklist">
        <ContentStep number={1} title="Explicit column lists">
          <p className="text-slate-300">
            Ban <span className="font-mono text-sm">SELECT *</span> in production views and BI datasets. Code
            review SQL for wide tables — largest quick win after Parquet migration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Partition columns in every WHERE">
          <p className="text-slate-300">
            Enforce via views with embedded date filters or BI parameter mandatory fields. Alert when query
            history shows full-table scans on partitioned tables.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Materialize repeated aggregates">
          <p className="text-slate-300">
            Daily KPI scanned by 50 users → CTAS or Glue job to gold summary table partitioned by day. One
            scan at build time vs fifty identical full scans.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Approximate when exact is overkill">
          <p className="text-slate-300">
            <span className="font-mono text-sm">approx_distinct</span>, sampled tables for exploration
            workgroups — separate <span className="font-mono text-sm">wg-de-adhoc</span> with strict scan caps
            from pipeline workgroups.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Governance checklist">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">Mechanism</th>
                <th className="px-4 py-3">Effect</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Per-query scan limit', 'Workgroup bytes cutoff', 'Fail before runaway JOIN'],
                ['Team isolation', 'Separate workgroups + IAM', 'Chargeback + blast radius'],
                ['Result lifecycle', 'S3 expire on athena-results/', 'Storage cost control'],
                ['Lake Formation', 'Table/column grants', 'Prevent raw zone access from BI'],
                ['Scheduled review', 'Athena query history export', 'Find top 10 expensive queries monthly'],
                ['Engine version', 'Stay current on workgroup', 'Performance improvements reduce wall time'],
              ].map(([ctrl, mech, effect]) => (
                <tr key={ctrl} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{ctrl}</td>
                  <td className="px-4 py-3">{mech}</td>
                  <td className="px-4 py-3">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Before/after metric for any optimization project: run identical SQL and compare{' '}
          <span className="font-mono text-sm">DataScannedInBytes</span>. Document scan reduction in PR —
          proves business value beyond &quot;best practice.&quot;
        </Callout>
        <Callout variant="tip">
          Partition projection, Parquet, and column pruning stack multiplicatively — a table with all three
          often scans 1–5% of equivalent CSV full-table <span className="font-mono text-sm">SELECT *</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Athena cost = compressed bytes scanned from S3 — track DataScannedInBytes per query and per workgroup.',
          'Storage checklist: Snappy Parquet curated, sensible partitions, compact files, narrow schemas in silver.',
          'Query checklist: no SELECT *, partition filters always, materialize hot aggregates, approximate for exploration.',
          'Governance: workgroup scan limits, LF grants, result bucket lifecycle, monthly expensive-query review.',
          'Prove optimizations with before/after scan metrics — the interview and stakeholder language for lake SQL ROI.',
        ]}
      />
    </LessonArticle>
  )
}
