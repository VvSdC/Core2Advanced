import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function S3Replication() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="One bucket is not a DR strategy">
        Regional outages, compliance residency, and analytics closer to users all push data engineers toward{' '}
        <strong className="text-white">S3 replication</strong> — automatic asynchronous copy of objects
        (and optionally metadata) to another bucket. Understand CRR vs SRR before you promise RPO on the lake.
      </Callout>

      <Definition term="S3 replication">
        <p>
          <strong className="text-white">S3 replication</strong> copies new and changed objects from a{' '}
          <strong className="text-white">source bucket</strong> to a{' '}
          <strong className="text-white">destination bucket</strong>. Requires versioning on the source;
          destination typically has versioning too. Replication is{' '}
          <strong className="text-white">eventually consistent</strong> — not synchronous with the PUT — plan
          RPO in minutes, not zero.
        </p>
      </Definition>

      <LessonSection title="CRR — Cross-Region Replication">
        <ContentStep number={1} title="What CRR does">
          <p className="text-slate-300">
            Copies objects across AWS Regions — e.g. us-east-1 primary lake to eu-west-1 for GDPR-local
            analytics or us-west-2 DR. Each region bills storage independently; cross-region data transfer
            fees apply on replication traffic.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases for CRR">
          <p className="text-slate-300">
            <strong className="text-white">Disaster recovery:</strong> secondary region can serve read-only
            Athena/Glue if primary is impaired.{' '}
            <strong className="text-white">Multi-region analytics:</strong> EU team queries local replica
            without cross-region scan charges every morning.{' '}
            <strong className="text-white">Compliance:</strong> copy audit logs to a residency-bound bucket.
          </p>
        </ContentStep>
        <ContentStep number={3} title="CRR filters">
          <p className="text-slate-300">
            Replicate entire bucket or filter by prefix/tag — replicate only{' '}
            <span className="font-mono text-sm">curated/</span> to DR, not scratch{' '}
            <span className="font-mono text-sm">tmp/</span>. S3 Batch Replication can backfill existing objects
            not covered at rule creation time.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SRR — Same-Region Replication">
        <ContentStep number={1} title="What SRR does">
          <p className="text-slate-300">
            Copies within the same Region to a different bucket — often different AWS account. Latency and
            transfer cost lower than CRR; still asynchronous.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases for SRR">
          <p className="text-slate-300">
            <strong className="text-white">Aggregate logs</strong> from many source buckets into one
            centralized logging bucket. <strong className="text-white">Cross-account lake:</strong> producer
            account replicates to consumer account&apos;s bucket with bucket owner enforced.{' '}
            <strong className="text-white">Separation of duties:</strong> prod write bucket vs security
            analytics read bucket in same region.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Replication IAM: S3 needs permission on source and destination; destination bucket policy must
          allow replication service principal. Cross-account CRR/SRR is a common exam and design-review topic.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers use replication">
        <Flowchart
          title="Replication patterns in DE platforms"
          chart={`flowchart TB
  subgraph primary [Primary region us-east-1]
    SRC[Source bucket — raw and curated]
  end
  subgraph crr [CRR — DR and EU analytics]
    DR[DR bucket us-west-2]
    EU[EU replica eu-west-1]
  end
  subgraph srr [SRR — same region]
    LOG[Central logging bucket]
    ACCT[Cross-account consumer bucket]
  end
  SRC -->|CRR filtered curated| DR
  SRC -->|CRR compliance prefix| EU
  SRC -->|SRR aggregate| LOG
  SRC -->|SRR cross-account| ACCT`}
        />
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Goal</th>
                <th className="px-4 py-3">Replication type</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Regional DR', 'CRR', 'Failover runbook; Glue catalog separate — replicate or rebuild'],
                ['Local analytics abroad', 'CRR', 'Athena in EU on EU bucket; watch catalog sync'],
                ['Central log lake', 'SRR', 'Many app buckets → one SIEM prefix'],
                ['Cross-account sharing', 'SRR or CRR', 'Bucket owner, KMS keys, and IAM on both sides'],
                ['Compliance copy', 'CRR + Object Lock', 'Immutable copy in bound region'],
              ].map(([goal, type, notes]) => (
                <tr key={goal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{goal}</td>
                  <td className="px-4 py-3">{type}</td>
                  <td className="px-4 py-3">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="What replication does not fix">
          <p className="text-slate-300">
            Glue Data Catalog, Lake Formation permissions, and Athena workgroups do not replicate with S3
            objects — document catalog DR separately. Deletes can replicate as delete markers depending on
            configuration; versioning helps recovery.
          </p>
        </ContentStep>
        <ContentStep number={2} title="KMS and replication">
          <p className="text-slate-300">
            SSE-KMS objects need key policy allowing replication in source and destination regions. Use
            multi-Region KMS keys (MRKs) or distinct keys with grants — encryption mismatches are a top
            replication failure cause in enterprise lakes.
          </p>
        </ContentStep>
        <Callout variant="insight">
          RPO for replicated lake data is typically minutes — not zero. For near-sync requirements, combine
          replication with application dual-writes or streaming (Kinesis → multiple sinks), not PUT alone.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CRR copies across Regions — DR, residency, and regional analytics; SRR copies within a Region — aggregation and cross-account patterns.',
          'Versioning required on source; replication is asynchronous — plan RPO accordingly.',
          'Use prefix/tag filters to replicate curated/compliance paths, not all scratch data.',
          'Replication does not copy Glue catalog — design metadata DR separately.',
          'Coordinate KMS key policies for SSE-KMS replicated objects; use Batch Replication for backfill.',
        ]}
      />
    </LessonArticle>
  )
}
