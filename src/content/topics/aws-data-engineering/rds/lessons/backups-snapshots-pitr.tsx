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

export function BackupsSnapshotsPitr() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Backups protect the source — and your ability to re-extract history">
        RDS automated backups and manual snapshots are how data engineers recover from corruption, bad
        migrations, or accidental DROP TABLE — and how you can spin up a{' '}
        <strong className="text-white">point-in-time copy</strong> of operational data for re-processing
        into the lake without touching production.
      </Callout>

      <Definition term="RDS backup types">
        <p>
          <strong className="text-white">Automated backups</strong> run daily during a backup window and
          capture transaction logs continuously for point-in-time recovery (PITR).{' '}
          <strong className="text-white">Manual snapshots</strong> are user-initiated full copies you retain
          until deleted — ideal for pre-migration baselines, cross-account sharing, or long-term archive
          before major schema changes.
        </p>
      </Definition>

      <LessonSection title="Automated backups">
        <ContentStep number={1} title="Daily snapshots + continuous log backup">
          <p className="text-slate-300">
            RDS takes a daily snapshot of your DB instance storage and backs up transaction logs every 5
            minutes (configurable retention 1–35 days, default 7). Together they enable restore to any second
            within the retention window — not just the last daily snapshot.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Backup window">
          <p className="text-slate-300">
            Schedule the backup window during low-traffic hours — often aligned with ETL off-peak. I/O
            impact is minimal on modern RDS but DE teams should avoid overlapping heavy extract jobs with
            backup I/O spikes on undersized instances.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retention and compliance">
          <p className="text-slate-300">
            Extend retention for regulated data (finance, healthcare) — 35 days may not satisfy audit
            requirements; pair with manual snapshots exported to S3 via snapshot export for longer archive
            in the lake.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Manual snapshots">
        <ContentStep number={1} title="User-initiated full copy">
          <p className="text-slate-300">
            Create a manual snapshot before engine upgrades, major DDL, or data migration cutover. Snapshots
            persist until you delete them — independent of automated backup retention. Billing continues for
            snapshot storage.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cross-account and cross-Region copy">
          <p className="text-slate-300">
            Share snapshots with another AWS account (DR, sandbox refresh) or copy to another Region for
            geo-redundancy. DE teams use shared snapshots to hydrate staging RDS instances with prod-like
            data — mask PII before granting analyst access.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Snapshot export to S3">
          <p className="text-slate-300">
            RDS snapshot export produces Parquet files in S3 — serverless extract without JDBC load on live
            prod. Ideal for one-time historical backfill into the lake when CDC was not yet enabled.
          </p>
        </ContentStep>
        <Flowchart
          title="Backup paths for data engineering"
          chart={`flowchart TB
  PROD[Production RDS]
  PROD --> AUTO[Automated daily + logs]
  PROD --> MAN[Manual snapshot]
  AUTO --> PITR[Point-in-time restore]
  MAN --> REST[Restore to new instance]
  MAN --> EXP[Snapshot export to S3 Parquet]
  PITR --> STG[Staging RDS for re-extract]
  EXP --> LAKE[S3 lake bronze zone]
  LAKE --> ETL[Glue transform to curated]`}
        />
      </LessonSection>

      <LessonSection title="Point-in-Time Recovery (PITR)">
        <ContentStep number={1} title="Restore to any second">
          <p className="text-slate-300">
            PITR replays transaction logs onto the most recent daily snapshot to reconstruct database state
            at a chosen timestamp — e.g., five minutes before a bad migration dropped a column. Restores to a{' '}
            <em>new</em> instance; it does not overwrite the existing primary in place.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use case — forensic re-extract">
          <p className="text-slate-300">
            Pipeline bug corrupted curated data for three days before detection. PITR restore to a sandbox
            RDS at T-72h, re-run extract to S3, merge corrected partitions into the lake — prod stays
            untouched.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limitations">
          <p className="text-slate-300">
            PITR only reaches back within automated backup retention (max 35 days). For longer history, rely
            on lake partitions and manual snapshot archive. PITR creates a new instance with new endpoint —
            update connection strings for re-extract jobs.
          </p>
        </ContentStep>
        <Example title="PITR workflow for lake correction" caption="Accidental DELETE without WHERE">
{`Incident: 14:32 UTC — DELETE FROM staging_orders ran on prod by mistake.
Response:
  1. PITR restore new instance to 14:31 UTC
  2. pg_dump / snapshot export affected tables to S3
  3. Glue job merges corrected rows into lake curated zone
  4. Downstream Redshift COPY refresh for impacted dates
  5. Decommission PITR sandbox instance`}
        </Example>
      </LessonSection>

      <LessonSection title="Backup strategy checklist for DE teams">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Control</th>
                <th className="px-4 py-3">Recommendation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Automated backup retention', '7+ days prod; align with max acceptable re-extract window'],
                ['Pre-migration snapshot', 'Manual snapshot before every major DDL or engine upgrade'],
                ['Staging refresh', 'Restore latest snapshot to masked staging — never live prod for analysts'],
                ['Lake as long-term archive', 'RDS backups for ops recovery; S3 lake for analytics history'],
                ['Test restore quarterly', 'Verify PITR runbook — untested backups are wishful thinking'],
              ].map(([control, rec]) => (
                <tr key={control} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{control}</td>
                  <td className="px-4 py-3">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview answer: Automated backups = daily snapshot + continuous logs for PITR (1–35 days).
          Manual snapshots persist until deleted — for migration baselines and cross-account share. Snapshot
          export to S3 Parquet is the DE-friendly bulk extract path.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Automated backups: daily snapshot + 5-minute log backups — enable PITR within retention (1–35 days).',
          'Manual snapshots: user-initiated, retained until deleted — pre-migration, cross-account, long archive.',
          'PITR restores to a new instance at any second in retention — forensic re-extract without touching prod.',
          'Snapshot export to S3 Parquet = serverless bulk extract for lake backfill — no JDBC load on primary.',
          'Lake holds long-term analytics history; RDS backups hold operational recovery — both layers matter for DE.',
        ]}
      />
    </LessonArticle>
  )
}
