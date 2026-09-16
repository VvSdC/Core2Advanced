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

export function ReadReplicas() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read replicas scale reads — but warehouses scale analytics">
        Amazon RDS read replicas provide <strong className="text-white">asynchronous read copies</strong> of
        your primary database. Data engineers use them to offload light reporting queries and reduce load on
        the primary — but heavy analytics belong in Redshift or the S3 lake, not on a read replica scanning
        billions of rows.
      </Callout>

      <Definition term="Read replica">
        <p>
          A read replica is a separate RDS instance that replicates data from the primary via{' '}
          <strong className="text-white">asynchronous replication</strong> (binlog for MySQL, WAL for
          PostgreSQL). It exposes its own endpoint for read-only queries. Replication lag — typically
          milliseconds to seconds — means replicas are eventually consistent, not identical to primary at
          every instant.
        </p>
      </Definition>

      <LessonSection title="Read replicas for scale-out reads">
        <ContentStep number={1} title="Offload read traffic">
          <p className="text-slate-300">
            Route SELECT-heavy workloads — internal dashboards, API read paths, metadata lookups — to replica
            endpoints. The primary stays free for INSERT/UPDATE/DELETE from the live application. You can
            create up to 15 read replicas per primary (engine-dependent).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Replica lag awareness">
          <p className="text-slate-300">
            Monitor <code className="text-core-400">ReplicaLag</code> in CloudWatch. Batch extracts that need
            point-in-time consistency should read from the primary or wait until lag is near zero. CDC via DMS
            reads from primary binlog/WAL — replicas are not CDC sources.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Promotion for DR">
          <p className="text-slate-300">
            A read replica can be promoted to a standalone primary — useful for cross-region DR drills or
            breaking replication intentionally. Promotion is manual (or scripted); it does not auto-failover
            like Multi-AZ.
          </p>
        </ContentStep>
        <Flowchart
          title="Read replica traffic routing"
          chart={`flowchart LR
  APP[Application writes]
  RO[Read-only clients]
  APP --> PRI[Primary RDS]
  PRI -->|async replication| REP1[Read replica 1]
  PRI --> REP2[Read replica 2]
  RO --> REP1
  RO --> REP2
  PRI -.->|avoid heavy analytics| BI[Use warehouse instead]`}
        />
      </LessonSection>

      <LessonSection title="Multi-AZ vs read replica">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Multi-AZ</th>
                <th className="px-4 py-3">Read replica</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Purpose', 'High availability — failover', 'Read scale-out — query offload'],
                ['Replication', 'Synchronous', 'Asynchronous'],
                ['Readable?', 'No — standby is hidden', 'Yes — dedicated read endpoint'],
                ['Failover', 'Automatic (~60–120s)', 'Manual promotion only'],
                ['Same Region only?', 'Yes (standby in another AZ)', 'Same or cross-Region'],
                ['Count', 'One standby per primary', 'Up to 15 replicas per primary'],
                ['DE use case', 'Keep source alive for CDC/extract', 'Light reporting without hitting primary'],
              ].map(([dim, multi, replica]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{dim}</td>
                  <td className="px-4 py-3">{multi}</td>
                  <td className="px-4 py-3">{replica}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Production OLTP sources typically run <strong className="text-white">Multi-AZ + one or more read
          replicas</strong> — Multi-AZ for HA, replicas for read offload. They solve different problems and
          complement each other.
        </Callout>
      </LessonSection>

      <LessonSection title="DE perspective — reporting on replica vs warehouse">
        <ContentStep number={1} title="When a read replica is enough">
          <p className="text-slate-300">
            Small internal reports — last 7 days of orders, row counts for QA, schema validation queries —
            against indexed tables with tight WHERE clauses. Keeps analysts off the primary without standing
            up a warehouse.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When to prefer the warehouse">
          <p className="text-slate-300">
            Full-table scans, multi-year history, cross-system joins (orders + marketing + events), dozens of
            concurrent BI users — row-oriented RDS (even on a replica) will choke. Extract to S3, load
            Redshift, serve from marts. Replica lag and connection limits make replicas a poor substitute for
            OLAP.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Anti-pattern: replica as analytics tier">
          <p className="text-slate-300">
            Pointing QuickSight or Tableau directly at a read replica for executive dashboards on unbounded
            date ranges is a common mistake. You save warehouse cost briefly, then pay in replica lag
            incidents, DBA escalations, and primary-adjacent lock contention on large sorts.
          </p>
        </ContentStep>
        <Example title="DE decision — ops report vs BI mart" caption="Same team, different targets">
{`Ops report: SELECT COUNT(*) FROM orders WHERE created_at > NOW() - INTERVAL '24 hours'
→ Read replica — indexed, small result, no warehouse needed.

Executive dashboard: revenue by region, SKU, cohort — 3 years, 50 concurrent users
→ Redshift mart fed by nightly COPY from S3 — never the read replica.`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Read replicas = async read-only copies with their own endpoints — scale SELECT traffic off the primary.',
          'Multi-AZ = HA failover (sync, not readable); read replica = read scale-out (async, readable) — different jobs.',
          'Monitor ReplicaLag — eventually consistent; not suitable for strict point-in-time reads without checking lag.',
          'Light reporting on replicas is fine; heavy analytics belong in Redshift/Athena on the lake — not RDS replicas.',
          'Replicas can be promoted to standalone primaries for DR — unlike Multi-AZ automatic failover.',
        ]}
      />
    </LessonArticle>
  )
}
