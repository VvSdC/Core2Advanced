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

export function CrossRegionReadReplica() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read globally, recover regionally">
        Cross-Region read replicas replicate RDS data from a primary in one AWS Region to a read-only instance
        in another. Data engineers use them for <strong className="text-white">disaster recovery</strong>{' '}
        readiness, <strong className="text-white">global read latency</strong> reduction, and{' '}
        <strong className="text-white">Region-local extracts</strong> without cross-Region JDBC on every
        nightly job.
      </Callout>

      <Definition term="Cross-Region read replica">
        <p>
          A cross-Region read replica is an asynchronous read copy of the primary RDS instance deployed in a
          different AWS Region. AWS handles encrypted cross-Region snapshot transfer and ongoing replication
          over the AWS backbone. Replication lag is higher than same-Region replicas — typically seconds to
          minutes depending on write volume and distance.
        </p>
      </Definition>

      <LessonSection title="Disaster recovery use cases">
        <ContentStep number={1} title="Regional failure preparedness">
          <p className="text-slate-300">
            If the entire primary Region becomes unavailable, promote the cross-Region replica to a standalone
            primary — manual step, not automatic like Multi-AZ. RPO equals replication lag at failure time;
            RTO includes DNS cutover and application reconfiguration.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DR drills for DE pipelines">
          <p className="text-slate-300">
            Quarterly drill: promote replica in eu-west-1, re-point DMS source endpoint, verify CDC resumes,
            validate lake row counts. Document runbook before real incident — untested DR is unreliable DR.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not a substitute for lake backup">
          <p className="text-slate-300">
            Cross-Region replica protects operational DB availability — your S3 lake should already be
            cross-Region replicated or multi-Region by design. DE recovery often means replay lake + CDC, not
            only RDS promotion.
          </p>
        </ContentStep>
        <Flowchart
          title="Cross-Region DR topology"
          chart={`flowchart TB
  subgraph US["us-east-1"]
    PRI[Primary RDS Multi-AZ]
    APP[Application tier]
    APP --> PRI
  end
  subgraph EU["eu-west-1"]
    REP[Cross-Region read replica]
    ETL[Regional extract job]
    ETL --> REP
  end
  PRI -->|async cross-Region| REP
  REP -.->|manual promote on DR| NEWPRI[New primary eu-west-1]`}
        />
      </LessonSection>

      <LessonSection title="Global reads and regional extracts">
        <ContentStep number={1} title="Low-latency read access">
          <p className="text-slate-300">
            EU analytics microservice reading US primary adds 100ms+ RTT per query. Cross-Region replica in
            eu-west-1 serves local reads — acceptable for small dashboards with lag tolerance, not for
            write path.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Region-local batch extract">
          <p className="text-slate-300">
            Run Glue in eu-west-1 against local replica → land Parquet in eu-west-1 S3 bucket — avoids
            cross-Region data transfer charges on every JDBC row and satisfies data residency when EU data
            must stay in EU buckets (with legal review — replica may still originate from US primary).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lag-sensitive workloads">
          <p className="text-slate-300">
            Financial reconciliation requiring near-real-time consistency should read primary or use DMS CDC
            to lake — not cross-Region replica with multi-minute lag during peak write periods.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Operational considerations">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Encryption', 'KMS key in source Region; replica uses new key in target Region — plan IAM'],
                ['Network', 'Replica in target Region VPC; security groups independent of primary'],
                ['Promotion', 'Breaks replication — replica becomes standalone; cannot reattach as replica'],
                ['Cost', 'Cross-Region data transfer + second instance bill — monitor lag-driven churn'],
                ['Engine support', 'MySQL, Postgres, MariaDB — verify engine/version compatibility matrix'],
              ].map(([topic, detail]) => (
                <tr key={topic} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{topic}</td>
                  <td className="px-4 py-3">{detail}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Cross-Region extract pattern" caption="EU-local lake ingest">
{`Primary: orders-db.us-east-1.rds.amazonaws.com
Replica: orders-db-replica.eu-west-1.rds.amazonaws.com

Glue job (eu-west-1):
  JDBC → local replica (read-only extract user)
  Output → s3://company-lake-eu/orders/raw/
  Schedule: 03:00 UTC — after US peak, monitor ReplicaLag < 60s before start`}
        </Example>
        <Callout variant="insight">
          Interview answer: Cross-Region read replica = async copy for DR promotion and global/regional reads.
          Higher lag than same-Region; manual promotion on regional failure. DE uses for Region-local extract;
          heavy analytics still belong in the lake/warehouse.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cross-Region read replicas replicate async from primary Region — DR promotion is manual, RPO = lag at failure.',
          'Enable global/regional reads and Region-local extracts without cross-Region JDBC on every query.',
          'Monitor ReplicaLag — cross-Region lag exceeds same-Region; not for strict real-time reconciliation.',
          'Pair with multi-Region S3 lake strategy — RDS replica protects ops DB, lake protects analytics history.',
          'Plan KMS, VPC, and promotion runbooks — test DR drills including DMS endpoint re-pointing.',
        ]}
      />
    </LessonArticle>
  )
}
