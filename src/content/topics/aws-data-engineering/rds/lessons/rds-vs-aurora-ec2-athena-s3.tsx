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

export function RdsVsAuroraEc2AthenaS3() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="RDS is one option in a wider data platform">
        Managed RDS is the default relational choice — but Aurora, self-managed DB on EC2, Athena on S3, and
        raw S3 each solve different problems. Data engineers need a clear map of{' '}
        <strong className="text-white">operational source</strong> vs{' '}
        <strong className="text-white">analytics lake</strong> vs{' '}
        <strong className="text-white">self-managed control</strong>.
      </Callout>

      <Definition term="Relational and lake alternatives">
        <p>
          <strong className="text-white">Amazon Aurora</strong> is AWS&apos;s cloud-native relational engine
          (Postgres/MySQL compatible) with distributed storage and faster failover.{' '}
          <strong className="text-white">EC2 self-managed DB</strong> runs Postgres/MySQL on your instance —
          full control, full ops burden. <strong className="text-white">Athena + S3</strong> is serverless
          SQL on object storage — the lake analytics layer, not a transactional source replacement.
        </p>
      </Definition>

      <LessonSection title="RDS vs Aurora">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">RDS</th>
                <th className="px-4 py-3">Aurora</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Storage', 'EBS volumes per instance', 'Shared distributed storage — 6 copies across AZs'],
                ['Failover', 'Multi-AZ ~60–120s', 'Aurora ~30s — storage separate from compute'],
                ['Replicas', 'Up to 15 read replicas', 'Up to 15 Aurora replicas — lower lag, auto-scaling readers'],
                ['Serverless', 'RDS Proxy for pooling', 'Aurora Serverless v2 — scale ACUs on demand'],
                ['DE extract', 'DMS, snapshot export, JDBC', 'Same tooling — often higher throughput source'],
                ['Cost', 'Predictable for small/medium', 'Premium at low scale; wins at high I/O sustained load'],
              ].map(([dim, rds, aurora]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{rds}</td>
                  <td className="px-4 py-3">{aurora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Aurora is still a <em>source system</em> for DE — same CDC and export patterns as RDS. Choose Aurora
          when app team needs higher availability and read scale; DE pipeline design unchanged.
        </Callout>
      </LessonSection>

      <LessonSection title="RDS vs EC2 self-managed database">
        <ContentStep number={1} title="When EC2 self-managed makes sense">
          <p className="text-slate-300">
            Exotic extensions, legacy version lock-in, license bring-your-own (Oracle/SQL Server on EC2),
            kernel-level tuning — rare in greenfield DE platforms but common in migrations.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE operational burden">
          <p className="text-slate-300">
            You own patching, backup scripts, failover, and monitoring — no automated PITR unless you build
            it. Extract patterns identical (JDBC, logical replication) but reliability SLA is your problem.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Default recommendation">
          <p className="text-slate-300">
            New operational sources → RDS or Aurora unless explicit blocker. EC2 DB is ops debt — DE teams
            inherit pager duty when backup cron fails.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">RDS/Aurora</th>
                <th className="px-4 py-3">EC2 self-managed</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Backups / PITR', 'Built-in automated', 'DIY — pgBackRest, cron, S3'],
                ['Patching', 'Managed maintenance window', 'Manual OS + engine patches'],
                ['HA', 'Multi-AZ / Aurora failover', 'Patroni, repmgr, custom scripts'],
                ['DE extract tooling', 'DMS, snapshot export native', 'Same JDBC — no snapshot export shortcut'],
                ['Team fit', 'App + DE focus on data', 'Requires dedicated DBA/SRE'],
              ].map(([factor, managed, ec2]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{factor}</td>
                  <td className="px-4 py-3">{managed}</td>
                  <td className="px-4 py-3">{ec2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="RDS vs Athena / S3 — source vs lake">
        <ContentStep number={1} title="RDS is the system of record">
          <p className="text-slate-300">
            Live transactional truth lives in RDS — orders, users, inventory. S3 holds derived copies for
            analytics. Never treat Athena external tables as authoritative for financial reconciliation
            without comparing back to RDS source counts.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 + Athena is the analytics query layer">
          <p className="text-slate-300">
            After extract, curated Parquet on S3 queried by Athena — scan-priced ad hoc SQL, validation, light
            BI. RDS cannot replace this cost model for petabyte history; Athena cannot replace ACID writes for
            checkout.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Medallion boundary">
          <p className="text-slate-300">
            Bronze/raw on S3 mirrors RDS exports. Silver/curated adds typing and dedup. Gold may live in
            Redshift or Athena views — RDS stays upstream, never downstream of the lake for analytics serve.
          </p>
        </ContentStep>
        <Flowchart
          title="RDS source vs S3 lake — division of labor"
          chart={`flowchart TB
  APP[Live application]
  RDS[RDS / Aurora OLTP]
  S3RAW[S3 bronze raw export]
  GLUE[Glue ETL]
  S3CUR[S3 curated Parquet]
  ATH[Athena SQL validation]
  APP --> RDS
  RDS -->|DMS snapshot JDBC| S3RAW
  S3RAW --> GLUE
  GLUE --> S3CUR
  S3CUR --> ATH
  RDS -.->|never replace| ATH`}
        />
        <Example title="Architecture review questions" caption="RDS vs lake placement">
{`Q: Can we drop RDS and query S3 only?
A: Only if app no longer needs ACID OLTP — rare. Usually NO.

Q: Can Athena replace RDS for the app?
A: No — Athena is read-only on S3, no transactional writes.

Q: Where does historical analytics run?
A: S3 lake + Athena/Redshift — fed by RDS extract, not live RDS scans.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Aurora = cloud-native relational with faster failover and scale — same DE extract patterns as RDS.',
          'EC2 self-managed DB = full control, full ops — avoid unless migration or extension requirement forces it.',
          'RDS/Aurora = operational source of record; S3 + Athena = derived lake analytics — never swap their roles.',
          'Medallion flow: RDS → S3 bronze → Glue curated → Athena/Redshift gold.',
          'Architecture reviews: ask whether workload is live transaction (RDS) or historical analysis (lake/warehouse).',
        ]}
      />
    </LessonArticle>
  )
}
