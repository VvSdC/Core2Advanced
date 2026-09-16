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

export function MultiAz() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Multi-AZ protects the database — not your ETL jobs">
        Amazon RDS Multi-AZ deploys a <strong className="text-white">synchronous standby</strong> in a
        different Availability Zone within the same Region. For data engineers, Multi-AZ matters because
        operational databases are <em>source systems</em> — if prod RDS fails over, CDC streams, snapshot
        exports, and nightly batch extracts must resume against the new primary endpoint without manual
        intervention.
      </Callout>

      <Definition term="Multi-AZ deployment">
        <p>
          With Multi-AZ enabled, RDS maintains a <strong className="text-white">primary instance</strong>{' '}
          and a <strong className="text-white">standby replica</strong> in another AZ. Storage is replicated
          synchronously — commits on the primary are durable on the standby before the transaction
          acknowledges. The standby is not a read endpoint; it exists solely for high availability and
          automatic failover.
        </p>
      </Definition>

      <LessonSection title="How Multi-AZ works">
        <ContentStep number={1} title="Synchronous replication">
          <p className="text-slate-300">
            Every write to the primary is mirrored to the standby in real time. Unlike async read replicas,
            Multi-AZ replication is synchronous — you trade a small latency increase on writes for zero data
            loss on failover (RPO near zero for instance failure).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Automatic failover">
          <p className="text-slate-300">
            If the primary AZ suffers hardware failure, network partition, or instance crash, RDS detects the
            failure and promotes the standby to primary. DNS endpoint updates to point at the new primary —
            typically 60–120 seconds. Applications using the RDS endpoint (not hard-coded IP) reconnect
            automatically.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Maintenance and patching">
          <p className="text-slate-300">
            During planned maintenance (engine upgrades, OS patches), RDS fails over to the standby first,
            applies changes on the old primary, then fails back or completes in place. DE pipelines scheduled
            during maintenance windows should tolerate brief connection blips — idempotent ETL and retry logic
            are essential.
          </p>
        </ContentStep>
        <Flowchart
          title="Multi-AZ primary and standby"
          chart={`flowchart TB
  APP[Application servers]
  ETL[DE batch extract job]
  APP --> EP[RDS endpoint DNS]
  ETL --> EP
  EP --> PRI[Primary instance AZ-a]
  PRI -->|sync replication| STBY[Standby instance AZ-b]
  STBY -.->|failover on failure| PRI2[New primary promoted]
  PRI2 --> EP`}
        />
      </LessonSection>

      <LessonSection title="Failover — what data engineers should know">
        <ContentStep number={1} title="Endpoint stability">
          <p className="text-slate-300">
            The RDS instance endpoint hostname stays the same after failover — only the underlying IP
            changes. Glue JDBC connections, Lambda in VPC, and DMS source endpoints should use the cluster
            endpoint, not cached IPs. Connection pools may need flush-and-reconnect on failover events.
          </p>
        </ContentStep>
        <ContentStep number={2} title="CDC and replication lag">
          <p className="text-slate-300">
            During failover, binlog/WAL capture pauses briefly. DMS and logical replication tasks should
            auto-resume, but expect a small gap in change streams — monitor{' '}
            <code className="text-core-400">CDCLatencySource</code> and reconcile with batch loads if needed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a scaling solution">
          <p className="text-slate-300">
            Multi-AZ does not add read capacity — the standby is invisible to queries. For read scale-out,
            use read replicas (separate lesson). Multi-AZ is purely HA within one Region.
          </p>
        </ContentStep>
        <Example title="Failover impact on nightly extract" caption="Postgres pg_dump to S3">
{`02:00 — Glue job starts JDBC extract from orders_db endpoint.
02:03 — AZ-a primary fails; RDS promotes AZ-b standby (~90s).
02:03–02:05 — Connection refused; job retries with exponential backoff.
02:05 — Job reconnects to same endpoint; pg_dump resumes from transaction snapshot.
02:45 — Parquet lands in s3://lake/raw/orders/ — downstream dbt unaffected if job is idempotent.`}
        </Example>
      </LessonSection>

      <LessonSection title="Multi-AZ vs single-AZ for DE source systems">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Single-AZ</th>
                <th className="px-4 py-3">Multi-AZ</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Production OLTP source',
                  'Unacceptable — extended outage stops writes and CDC',
                  'Standard — automatic failover, near-zero RPO',
                ],
                [
                  'Dev/staging replica of prod schema',
                  'Acceptable for cost — no HA requirement',
                  'Optional — match prod topology for failover testing',
                ],
                [
                  'Extract window overlap with maintenance',
                  'Manual restore from backup on failure',
                  'Failover completes during maintenance — shorter blip',
                ],
                [
                  'Cost',
                  'Lower — one instance bill',
                  '~2× instance cost (standby billed same class)',
                ],
              ].map(([scenario, single, multi]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3">{single}</td>
                  <td className="px-4 py-3">{multi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Interview answer: Multi-AZ = synchronous standby in another AZ for HA failover — not read scaling.
          DE teams care because source uptime and endpoint stability keep CDC and batch extracts flowing.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-AZ deploys a synchronous standby in a different AZ — automatic failover on primary failure.',
          'Standby is not readable — use read replicas for scale-out reads, Multi-AZ for high availability.',
          'RDS endpoint DNS stays constant after failover — apps and ETL reconnect; avoid hard-coded IPs.',
          'Expect brief CDC/extract interruption during failover — design idempotent pipelines with retry logic.',
          'Production OLTP sources feeding the lake should run Multi-AZ; dev/staging can stay single-AZ for cost.',
        ]}
      />
    </LessonArticle>
  )
}
