import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Workgroups() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Workgroups isolate teams, costs, and outputs">
        An Athena <strong className="text-white">workgroup</strong> is a named configuration boundary:
        where query results land in S3, which IAM role or KMS key applies, optional per-query data scan
        limits, and CloudWatch metrics tagged by team. Production lakes never use one default workgroup for
        everyone.
      </Callout>

      <Definition term="Athena workgroup">
        <p>
          Each workgroup sets a <strong className="text-white">query result location</strong>{' '}
          (<span className="font-mono text-sm">s3://lake/athena-results/analytics/</span>), enforces{' '}
          <strong className="text-white">bytes scanned limits</strong> (optional), controls{' '}
          <strong className="text-white">engine version</strong>, and publishes metrics like{' '}
          <span className="font-mono text-sm">DataScannedInBytes</span> per workgroup. Users or SSO roles
          are mapped to workgroups so dev ad hoc queries do not overwrite prod result paths.
        </p>
      </Definition>

      <LessonSection title="Isolation and cost controls">
        <ContentStep number={1} title="Separate dev, staging, prod">
          <p className="text-slate-300">
            <span className="font-mono text-sm">wg-de-dev</span>: permissive for engineers, short result
            lifecycle on scratch bucket. <span className="font-mono text-sm">wg-analytics-prod</span>: scan
            cap per query (e.g. 1 TB), results encrypted with CMK, access logged. Prevents a Cartesian join
            in dev from sharing result bucket with compliance exports.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Bytes scanned cutoff">
          <p className="text-slate-300">
            Enable <strong className="text-white">Per query data limit</strong> on analyst workgroups — query
            fails fast instead of scanning 10 TB from a missing partition filter. DE workgroups may have
            higher limits for known CTAS jobs; pair with CloudWatch alarm on workgroup scan totals.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Result location hygiene">
          <p className="text-slate-300">
            Athena writes CSV/JSON results (and metadata) to the workgroup prefix. Apply lifecycle rules —
            expire after 7–30 days. Result objects are not curated data; treat as ephemeral with blocked
            public access and separate prefix from <span className="font-mono text-sm">s3://lake/curated/</span>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE team patterns">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Workgroup</th>
                <th className="px-4 py-3">Who</th>
                <th className="px-4 py-3">Result prefix</th>
                <th className="px-4 py-3">Controls</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['wg-de-pipeline', 'Airflow/Lambda CTAS', 's3://lake/athena-results/pipeline/', 'High scan limit, pipeline IAM role'],
                ['wg-de-adhoc', 'Data engineers', 's3://lake/athena-results/de/', 'Moderate scan cap, 14-day lifecycle'],
                ['wg-bi-analyst', 'Analysts / QuickSight', 's3://lake/athena-results/bi/', 'Strict scan cap, LF grants on curated only'],
                ['wg-qa-validation', 'Post-ETL checks', 's3://lake/athena-results/qa/', 'Scheduled queries, alert on failure'],
              ].map(([wg, who, prefix, controls]) => (
                <tr key={wg} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{wg}</td>
                  <td className="px-4 py-3">{who}</td>
                  <td className="px-4 py-3 font-mono text-xs">{prefix}</td>
                  <td className="px-4 py-3">{controls}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="IAM and SSO mapping">
          <p className="text-slate-300">
            IAM policy condition <span className="font-mono text-sm">athena:WorkGroup</span> restricts which
            workgroup a role may use. Identity Center permission sets map analysts to{' '}
            <span className="font-mono text-sm">wg-bi-analyst</span> only — they cannot submit to pipeline
            workgroup with elevated scan limits.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Observability">
          <p className="text-slate-300">
            CloudWatch metrics and Athena query history filtered by workgroup feed chargeback dashboards.
            Tag workgroups with <span className="font-mono text-sm">cost-center</span> and alert when daily{' '}
            <span className="font-mono text-sm">DataScannedInBytes</span> exceeds budget — often the first sign
            of a bad JOIN or missing partition filter in a new dashboard.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Primary workgroup in console is per-user preference — enforce workgroup via IAM, not honor system.
          Automated jobs should pass <span className="font-mono text-sm">WorkGroup</span> in{' '}
          <span className="font-mono text-sm">StartQueryExecution</span> explicitly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Workgroups isolate query result S3 locations, scan limits, encryption, and CloudWatch metrics per team.',
          'Never share one default workgroup — split dev, pipeline, BI, and QA with lifecycle on result prefixes.',
          'Per-query bytes scanned limits fail expensive queries before they blow the monthly Athena budget.',
          'Map SSO/IAM roles to workgroups with athena:WorkGroup conditions; pipelines pass WorkGroup in API calls.',
          'Result buckets are ephemeral scratch space — lifecycle expire rules, separate from curated lake zones.',
        ]}
      />
    </LessonArticle>
  )
}
