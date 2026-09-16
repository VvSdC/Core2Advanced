import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherRds() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="RDS is the operational source — extract, protect, compare">
        You covered Multi-AZ and read replicas, backups and PITR, security groups and IAM auth, encryption
        and Secrets Manager, RDS Proxy, Performance Insights, cross-Region replicas, comparisons against
        Redshift/DynamoDB/Aurora/EC2/Athena/S3, and pipeline extraction patterns. This checkpoint ties
        intermediate and advanced RDS lessons together before AWS Glue — the serverless ETL engine for your
        lake.
      </Callout>

      <Definition term="RDS mental model for data engineering">
        <p>
          Amazon RDS is a <strong className="text-white">managed OLTP relational source</strong> — Postgres,
          MySQL, and others powering live applications. DE success means: protect prod (Multi-AZ, extract
          off primary), secure pipelines (SG + SSL + Secrets Manager), choose the right extract pattern
          (batch vs CDC/DMS), and route analytics to the lake/warehouse — never collapse OLTP and OLAP tiers.
        </p>
      </Definition>

      <LessonSection title="RDS sub-topic map">
        <Flowchart
          title="RDS lesson map — intermediate through advanced"
          chart={`flowchart TB
  START[RDS complete path]
  START --> MAZ[Multi-AZ failover]
  START --> RR[Read replicas]
  START --> BKP[Backups snapshots PITR]
  START --> SEC[Security groups IAM auth]
  START --> ENC[Encryption SSL Secrets]
  START --> PROXY[RDS Proxy]
  START --> PI[Performance Insights monitoring]
  START --> CRR[Cross-Region read replica]
  START --> CMP1[RDS vs Redshift DynamoDB]
  START --> CMP2[RDS vs Aurora EC2 Athena S3]
  START --> PIPE[RDS in data pipelines]
  MAZ --> GLUENEXT
  RR --> GLUENEXT
  BKP --> GLUENEXT
  SEC --> GLUENEXT
  ENC --> GLUENEXT
  PROXY --> GLUENEXT
  PI --> GLUENEXT
  CRR --> GLUENEXT
  CMP1 --> GLUENEXT
  CMP2 --> GLUENEXT
  PIPE --> GLUENEXT
  GLUENEXT[AWS Glue — serverless ETL next]`}
        />
      </LessonSection>

      <LessonSection title="Full RDS checkpoint — can you explain…">
        <ContentStep number={1} title="High availability and read scale">
          <p className="text-slate-300">
            Multi-AZ vs read replica — sync standby for failover vs async read endpoint? When is a replica
            OK for light reporting vs when must analytics move to Redshift?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Backup and recovery">
          <p className="text-slate-300">
            Automated backup vs manual snapshot? How PITR restores to a new instance for forensic re-extract?
            Snapshot export to S3 Parquet for backfill?
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security">
          <p className="text-slate-300">
            Security group wiring for Glue/Lambda/DMS? IAM DB auth vs Secrets Manager trade-offs? Encryption
            at rest (KMS at create) and SSL in transit?
          </p>
        </ContentStep>
        <ContentStep number={4} title="Operations">
          <p className="text-slate-300">
            When RDS Proxy for Lambda connection storms? Performance Insights for proving extract hurts prod?
            Parameter group CDC prerequisites (logical replication, binlog ROW)?
          </p>
        </ContentStep>
        <ContentStep number={5} title="Comparisons">
          <p className="text-slate-300">
            RDS vs Redshift — source vs destination? RDS vs DynamoDB — relational vs key-value ingest?
            RDS vs Aurora/EC2? RDS vs Athena/S3 — system of record vs lake?
          </p>
        </ContentStep>
        <ContentStep number={6} title="Pipeline integration">
          <p className="text-slate-300">
            Sketch batch JDBC vs DMS CDC vs snapshot export. Where does bronze land on S3? How does Glue
            merge CDC into curated before Redshift COPY?
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
                  'Multi-AZ vs read replica?',
                  'Multi-AZ: sync standby, automatic failover, not readable. Replica: async, read scale-out, own endpoint.',
                ],
                [
                  'PITR window?',
                  'Automated daily snapshot + continuous logs — restore any second within retention (1–35 days) to new instance.',
                ],
                [
                  'Snapshot export use case?',
                  'Serverless Parquet to S3 from snapshot — initial lake backfill without JDBC load on live prod.',
                ],
                [
                  'Why security groups not 0.0.0.0/0?',
                  'RDS in VPC — allow only Glue/Lambda/DMS SGs inbound on 5432/3306; prod should not be public.',
                ],
                [
                  'IAM DB auth vs Secrets Manager?',
                  'IAM: 15-min tokens, no static password. Secrets Manager: universal JDBC, automatic rotation.',
                ],
                [
                  'Encryption at rest gotcha?',
                  'Must enable at instance creation — migrate via encrypted snapshot copy if legacy unencrypted.',
                ],
                [
                  'When RDS Proxy?',
                  'Many short Lambda connections — pools to prevent max_connections exhaustion; not for long Glue jobs.',
                ],
                [
                  'Read replica for BI?',
                  'Light indexed queries OK; heavy analytics → extract to S3/Redshift — avoid replica as warehouse.',
                ],
                [
                  'Cross-Region replica purpose?',
                  'DR promotion (manual), global/regional reads, Region-local extract — higher async lag.',
                ],
                [
                  'RDS vs Redshift for DE?',
                  'RDS = OLTP source (DMS/export); Redshift = OLAP destination (COPY marts) — pipeline connects them.',
                ],
                [
                  'RDS vs Athena/S3?',
                  'RDS = live ACID system of record; S3+Athena = derived lake analytics on exported history.',
                ],
                [
                  'Batch vs CDC choice?',
                  'Nightly SLA = incremental JDBC/snapshot; sub-hour freshness = DMS CDC with merge to curated.',
                ],
                [
                  'CDC prerequisites Postgres?',
                  'rds.logical_replication=1, max_wal_senders, max_replication_slots — reboot required.',
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
        <Callout variant="tip" title="Ready for Glue when…">
          You can whiteboard App → RDS → DMS/batch → S3 bronze → Glue curated → Redshift, explain Multi-AZ
          vs replica, and defend why BI does not run on prod RDS — without opening the docs.
        </Callout>
      </LessonSection>

      <LessonSection title="What comes next — AWS Glue">
        <p className="text-slate-300">
          RDS lessons established how operational data leaves the source safely.{' '}
          <strong className="text-white">AWS Glue</strong> is the serverless ETL service that crawls schemas,
          runs Spark/Python transforms, schedules workflows, and lands curated Parquet in S3 — the transform
          layer between RDS extracts and Athena/Redshift serve tiers.
        </p>
        <Flowchart
          title="After RDS — course thread"
          chart={`flowchart LR
  RDS[RDS operational source]
  BRZ[S3 bronze extract]
  GLUE[AWS Glue ETL]
  CUR[S3 curated Parquet]
  ATH[Athena validation]
  RS[Redshift gold]
  RDS --> BRZ
  BRZ --> GLUE
  GLUE --> CUR
  CUR --> ATH
  CUR --> RS`}
        />
        <Callout variant="insight">
          Revisit this checkpoint when onboarding to a new team&apos;s RDS source, designing extract for a
          fresh microservice DB, or defending lake-first architecture in a design review — answers trace to
          HA, security, extract pattern, and comparison lessons covered here.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS: managed OLTP source — Multi-AZ HA, read replicas for light reads, backups/PITR for recovery.',
          'Intermediate: security groups, IAM auth, KMS encryption, SSL, Secrets Manager — secure extract paths.',
          'Advanced: RDS Proxy, Performance Insights, cross-Region DR, comparisons, batch/CDC/DMS pipeline patterns.',
          'Never run heavy BI on prod RDS — extract to S3 lake, serve from Athena/Redshift.',
          'Next sub-topic: AWS Glue — crawlers, Spark jobs, and workflows transforming bronze RDS data into curated lake tables.',
        ]}
      />
    </LessonArticle>
  )
}
