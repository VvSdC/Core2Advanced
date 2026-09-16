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

export function StorageBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Database disk is not S3">
        RDS stores table data on <strong className="text-white">provisioned block storage</strong> attached
        to your DB instance — separate from the S3 lake you query in Athena. Storage type affects IOPS,
        latency, and cost. Data engineers care because growing OLTP tables lengthen extract windows, fill
        backup storage, and trigger autoscaling events that show up on finance dashboards.
      </Callout>

      <Definition term="RDS storage">
        <p>
          <strong className="text-white">RDS storage</strong> is the durable disk volume holding database
          files — data files, indexes, transaction logs — for a DB instance. You choose a{' '}
          <strong className="text-white">storage type</strong> and initial size at launch; many types allow
          increasing allocated storage and IOPS without downtime (with limits). Storage is tied to the
          instance (except Aurora, which uses a separate distributed storage layer in advanced lessons).
        </p>
      </Definition>

      <LessonSection title="Storage types — high-level overview">
        <p className="text-slate-300">
          AWS offers General Purpose SSD (gp2/gp3), Provisioned IOPS SSD (io1/io2), and magnetic (legacy).
          Beginners on Postgres/MySQL dev instances almost always see <strong className="text-white">gp3</strong>{' '}
          — the current default general-purpose choice balancing cost and performance.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Profile</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'gp3 (General Purpose SSD)',
                  'Baseline 3,000 IOPS and 125 MiB/s throughput; scale IOPS/throughput independently of size',
                  'Default for most OLTP — dev through moderate prod workloads',
                ],
                [
                  'gp2 (General Purpose SSD, previous gen)',
                  'IOPS scales with volume size (3 IOPS/GiB, burst credits)',
                  'Legacy instances; new launches prefer gp3',
                ],
                [
                  'io1 / io2 (Provisioned IOPS SSD)',
                  'Dedicated IOPS you provision; io2 Block Express for highest performance and durability SLAs',
                  'Heavy write OLTP, large InnoDB/Postgres on busy primaries — coordinate with DBAs',
                ],
                [
                  'magnetic (standard)',
                  'HDD, limited IOPS',
                  'Legacy only — not recommended for new DE source systems',
                ],
              ].map(([type, profile, use]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{profile}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="DE perspective">
          You rarely choose RDS storage type as a data engineer — but you notice when a full-table JDBC
          scan saturates disk IOPS and DBAs upgrade gp3 to io2. Prefer snapshot export or replica reads
          to reduce pressure on primary storage subsystems during large extracts.
        </Callout>
      </LessonSection>

      <LessonSection title="Allocated storage and growth">
        <ContentStep number={1} title="Size at launch">
          <p className="text-slate-300">
            You pick initial GiB (e.g. 100 GiB). RDS uses what the database actually consumes; empty
            allocated space still bills. Application teams monitor{' '}
            <code className="text-core-400">FreeStorageSpace</code> CloudWatch metric — DE should subscribe
            to alerts before extracts fail because disk is full.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Maximum storage threshold">
          <p className="text-slate-300">
            Each instance has a configured maximum storage cap. Autoscaling stops at that cap — plan headroom
            before holiday traffic doubles order table size.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Storage vs compute scaling">
          <p className="text-slate-300">
            Increasing storage does not add CPU or RAM — a common beginner mistake. A disk-full Postgres still
            needs either more GiB or archival/partition strategy; bigger instance class is a separate change.
          </p>
        </ContentStep>
        <Flowchart
          title="RDS storage vs S3 lake storage"
          chart={`flowchart TB
  RDS[RDS provisioned SSD gp3 io2]
  RDS --> OLTP[Live rows indexes WAL]
  OLTP --> EXT[Extract export CDC]
  EXT --> S3[S3 object storage lake]
  S3 --> ATH[Athena scan on demand]
  S3 --> RS[Redshift COPY hot marts]
  note1[RDS disk = transactional working set]
  note2[S3 = durable cheap analytics copy]`}
        />
      </LessonSection>

      <LessonSection title="Storage autoscaling teaser">
        <p className="text-slate-300">
          <strong className="text-white">Storage autoscaling</strong> lets RDS automatically increase
          allocated storage when free space drops below a threshold you set — up to a maximum limit. It helps
          ops teams avoid 3 a.m. pages for disk full, but it is not unlimited or instant magic.
        </p>
        <ContentStep number={1} title="How it triggers">
          <p className="text-slate-300">
            When used space crosses the threshold (e.g. 90% full) for a sustained period, RDS expands allocated
            storage in increments. Expansion typically occurs without downtime for supported engines and
            storage types.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Set a sensible maximum">
          <p className="text-slate-300">
            Autoscaling without a cap can surprise finance — runaway application logs or missing retention
            policies fill disk forever. Cap maximum storage and fix root cause (archival to S3, partition
            drops) in parallel.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DE impact during scale events">
          <p className="text-slate-300">
            Storage expansion may briefly affect I/O latency. Schedule very large JDBC exports outside known
            growth windows when possible — or use snapshot export which reads a frozen snapshot, not live
            growing files.
          </p>
        </ContentStep>
        <Example title="Storage signals for pipeline owners" caption="CloudWatch metrics to watch">
{`FreeStorageSpace       — alert before extracts fail mid-run
VolumeBytesUsed        — trend growth; forecast when lake full refreshes needed
ReadIOPS / WriteIOPS   — heavy ETL on primary shows here first
DiskQueueDepth         — sustained queue suggests storage or query tuning issue

DE action: if FreeStorageSpace drops weekly, talk to app team about retention —
  archiving old partitions to S3 beats endlessly autoscaling RDS.`}
        </Example>
      </LessonSection>

      <LessonSection title="Backups and snapshots use storage too">
        <ContentStep number={1} title="Automated backups">
          <p className="text-slate-300">
            RDS automated backups store transaction logs and daily snapshots — billed separately from instance
            storage. Longer retention (35 days max) improves point-in-time restore but increases backup
            storage cost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Manual snapshots">
          <p className="text-slate-300">
            Manual snapshots persist until you delete them — common before major migrations. Snapshot export
            to S3 (DE pattern) reads from a snapshot, decoupling extract IO from live instance disks.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lake copy is separate">
          <p className="text-slate-300">
            S3 holds the analytics copy; RDS disk holds OLTP working set. Do not assume backing up RDS
            replaces landing curated Parquet in the lake — different retention, access patterns, and
            consumers.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why storage basics matter for extract design">
        <ContentStep number={1} title="Bigger tables = longer full refreshes">
          <p className="text-slate-300">
            A 500 GiB orders table means a naive SELECT * JDBC job reads hundreds of gigabytes over the
            network — plan incremental CDC or partition-based exports instead of weekly full scans.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Index and log volume">
          <p className="text-slate-300">
            Storage includes indexes and WAL/binlog files. Heavy indexing helps app queries but increases
            snapshot size and backup duration — factors in RTO when planning disaster recovery drills with
            DE stakeholders.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Archival to S3 reduces RDS pressure">
          <p className="text-slate-300">
            Mature teams move cold history from RDS to S3 (app archival or DMS) and keep hot months on
            prod — shrinking storage cost and shortening extract windows for nightly jobs.
          </p>
        </ContentStep>
        <Callout variant="insight">
          RDS storage is for running the app; S3 storage is for analyzing history at scale. DE pipelines
          exist partly to move cold data off expensive transactional disk into cheap object storage.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS uses provisioned block storage (gp3 general purpose, io1/io2 for high IOPS) — separate from S3 lake storage.',
          'Allocated storage grows with data; autoscaling can expand disk automatically up to a maximum you configure.',
          'Monitor FreeStorageSpace and IOPS — full disks and IO saturation break extracts and app traffic alike.',
          'Snapshot export and S3 archival reduce reliance on live RDS disk for large DE workloads — storage basics explain why.',
        ]}
      />
    </LessonArticle>
  )
}
