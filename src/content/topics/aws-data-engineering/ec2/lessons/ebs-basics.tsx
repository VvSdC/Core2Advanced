import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EbsBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Disk that survives reboots">
        When your ETL worker writes temp parquet to disk or Airflow logs to local paths, you are choosing
        between <strong className="text-white">EBS</strong> (network block storage that persists) and{' '}
        <strong className="text-white">instance store</strong> (fast local disks tied to the physical
        host). For most DE boxes — schedulers, long-running workers, anything you stop and start — EBS
        is the safe default.
      </Callout>

      <Definition term="Amazon EBS (Elastic Block Store)">
        <p>
          <strong className="text-white">EBS</strong> provides network-attached block volumes you mount
          like a hard drive (<span className="font-mono text-sm">/dev/xvdf</span> →{' '}
          <span className="font-mono text-sm">/data</span>). Volumes live independently of any single
          instance: they persist when you <strong className="text-white">stop</strong> an instance and can
          be detached and reattached to another instance in the same Availability Zone. Size, type, and
          IOPS are configurable after launch (with limits per type).
        </p>
      </Definition>

      <Definition term="Instance Store">
        <p>
          <strong className="text-white">Instance store</strong> is ephemeral storage on the physical
          server — included with some instance types (especially I and older C/M with &quot;instance
          store&quot; in specs). Very high IOPS and throughput, but data is{' '}
          <strong className="text-white">lost</strong> if the instance stops, terminates, or the underlying
          hardware fails. Use for scratch, shuffle spill, or staging with a sync-to-S3 step — not for
          Airflow metadata or anything you cannot rebuild.
        </p>
      </Definition>

      <LessonSection title="EBS vs Instance Store for data engineering">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Attribute</th>
                <th className="px-4 py-3">EBS</th>
                <th className="px-4 py-3">Instance Store</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Persistence', 'Survives stop; snapshot to S3; reattach in same AZ', 'Lost on stop/terminate/hardware failure'],
                ['Performance', 'gp3/io2 tunable; network latency', 'Often highest local IOPS/throughput'],
                ['DE use case', 'Airflow logs, Python venv, JDBC drivers, modest staging', 'Spark shuffle spill, bulk local sort before S3 upload'],
                ['Backup', 'Snapshots, AMIs', 'You must copy data elsewhere yourself'],
                ['Cost model', 'Pay per GB-month + IOPS/throughput provisioned', 'Included in instance price (no separate volume bill)'],
              ].map(([attr, ebs, inst]) => (
                <tr key={attr} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{attr}</td>
                  <td className="px-4 py-3">{ebs}</td>
                  <td className="px-4 py-3">{inst}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="How a volume attaches to an instance">
        <ContentStep number={1} title="Launch or attach">
          <p className="text-slate-300">
            At launch, the root volume (OS disk) is always EBS for most instance types. You add data
            volumes in the same AZ — e.g. 500 GiB gp3 mounted at{' '}
            <span className="font-mono text-sm">/opt/airflow</span> for a self-hosted Airflow box.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mount inside the OS">
          <p className="text-slate-300">
            AWS exposes the block device; you partition, format (xfs/ext4), and mount in fstab so ETL
            scripts write to persistent paths. Terminate protection + EBS = you can rebuild the instance
            and reattach the same volume.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Stop vs terminate">
          <p className="text-slate-300">
            <strong className="text-white">Stop</strong>: instance state saved; EBS volumes remain; private IP
            may change unless Elastic IP. <strong className="text-white">Terminate</strong>: instance
            destroyed; EBS volumes delete if{' '}
            <span className="font-mono text-sm">DeleteOnTermination=true</span> (default on root). Set{' '}
            <span className="font-mono text-sm">DeleteOnTermination=false</span> on data volumes you want
            to keep.
          </p>
        </ContentStep>
        <Flowchart
          title="EBS volume lifecycle on an ETL worker"
          chart={`flowchart TB
  VOL[EBS volume — gp3 500 GiB]
  EC2[EC2 ETL worker — same AZ]
  MNT[Mount /data — logs staging venv]
  STOP[Stop instance]
  START[Start instance]
  TERM[Terminate instance]
  SNAP[EBS snapshot to S3]
  VOL -->|Attach at launch| EC2
  EC2 --> MNT
  MNT --> STOP
  STOP -->|Volume persists| START
  START --> EC2
  MNT --> SNAP
  TERM -->|DeleteOnTermination false| VOL
  TERM -->|DeleteOnTermination true| DEL[Volume deleted]`}
        />
      </LessonSection>

      <Callout variant="insight">
        DE rule of thumb: state and logs on EBS (or S3); hot scratch on instance store only when you have
        a defined flush-to-durable-storage step. Never put the only copy of Airflow&apos;s Postgres data on
        instance store unless you accept total loss.
      </Callout>

      <KeyTakeaways
        items={[
          'EBS = network block storage attached to one instance in an AZ; persists across stop/start; root + data volumes.',
          'Instance store = fast local ephemeral disk; lost on stop/terminate — use for scratch with sync to S3/EBS.',
          'Set DeleteOnTermination=false on data volumes you must keep when the instance is terminated.',
          'Stop keeps EBS; terminate destroys the instance — EBS survives only if not set to delete on termination.',
          'Airflow, schedulers, and long-lived ETL workers: persist logs and app data on EBS (or RDS/S3), not instance store alone.',
        ]}
      />
    </LessonArticle>
  )
}
