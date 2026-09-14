import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EbsVolumeTypes() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Not all disks are equal">
        A 500 GiB EBS volume can be a cheap gp3 boot disk or an io2 Block Express volume provisioned for
        hundreds of thousands of IOPS. For data engineering, the choice affects how fast Spark spills to
        disk, how quickly you land files before uploading to S3, and your monthly bill. Match volume type
        to throughput vs IOPS needs — do not default everything to gp2 out of habit.
      </Callout>

      <Definition term="IOPS vs throughput">
        <p>
          <strong className="text-white">IOPS</strong> (I/O operations per second) matters for many small
          random reads/writes — database files, lots of small parquet files.{' '}
          <strong className="text-white">Throughput</strong> (MiB/s) matters for large sequential scans —
          writing multi-GB staging files, log rotation, bulk COPY temp. gp3 lets you tune both
          independently; older gp2 ties them together via volume size.
        </p>
      </Definition>

      <LessonSection title="Main EBS volume types">
        <ContentStep number={1} title="gp3 (General Purpose SSD — default choice)">
          <p className="text-slate-300">
            Baseline 3,000 IOPS and 125 MiB/s included; scale IOPS up to 16,000 and throughput up to
            1,000 MiB/s without growing disk size. Best price/performance for Airflow workers, app servers,
            moderate ETL staging, and root volumes. Replace legacy gp2 in new designs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="gp2 (General Purpose SSD — legacy)">
          <p className="text-slate-300">
            IOPS scales with volume size (3 IOPS/GiB, burst on small volumes). Still common on older
            stacks. Migrate to gp3 for predictable tuning and often lower cost at the same performance.
          </p>
        </ContentStep>
        <ContentStep number={3} title="io2 / io2 Block Express (Provisioned IOPS SSD)">
          <p className="text-slate-300">
            Provision IOPS independently (up to 64,000 on io2 Block Express on supported instances).
            Sub-millisecond latency for IO-heavy workloads — high-concurrency OLTP sidecars, heavy random
            I/O on self-managed DBs co-located with ETL. Expensive; use when gp3 cannot meet SLA.
          </p>
        </ContentStep>
        <ContentStep number={4} title="st1 (Throughput Optimized HDD)">
          <p className="text-slate-300">
            Low-cost magnetic, throughput-oriented, cannot be boot volume. Rare in modern DE — sequential
            log archives where extreme IOPS are not needed. Often beaten by gp3 on cost for mixed workloads.
          </p>
        </ContentStep>
        <ContentStep number={5} title="sc1 (Cold HDD)">
          <p className="text-slate-300">
            Lowest cost, lowest performance. Infrequently accessed bulk — not for active ETL scratch. Prefer
            S3 Intelligent-Tiering or Glacier for cold data instead of sc1 on EC2.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Choosing for DE workloads">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Scenario</th>
                <th className="px-4 py-3">Suggested type</th>
                <th className="px-4 py-3">Tuning note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Airflow scheduler + web on one EC2', 'gp3', 'Baseline IOPS enough; bump throughput if log volume huge'],
                ['Python ETL staging 50–200 GB files before S3', 'gp3', 'Raise throughput (MiB/s) over IOPS — sequential writes'],
                ['Self-managed Postgres/MySQL on EC2 for Airflow metadata', 'gp3 or io2', 'io2 if connection count + random I/O spikes'],
                ['Spark executor EBS shuffle (non-ideal vs local NVMe)', 'gp3 high throughput', 'Prefer instance store on I family if shuffle-heavy'],
                ['Root volume OS + Docker images', 'gp3', '30–100 GiB typical; snapshot for AMI builds'],
                ['Dev sandbox — cost over speed', 'gp3 small', 'Stop instance when idle; don\'t over-provision IOPS'],
              ].map(([scenario, type, note]) => (
                <tr key={scenario} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{scenario}</td>
                  <td className="px-4 py-3 font-mono text-xs">{type}</td>
                  <td className="px-4 py-3">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="gp3 tuning sketch for a staging volume">
          <p className="text-slate-300">
            500 GiB gp3 for <span className="font-mono text-sm">/data/staging</span>: baseline 3,000 IOPS
            and 125 MiB/s may suffice for nightly batches. If CloudWatch{' '}
            <span className="font-mono text-sm">VolumeThroughputPercentage</span> pegs at 100% during
            landing, increase throughput to 500 MiB/s before jumping to io2 — sequential ETL is often
            throughput-bound, not IOPS-bound.
          </p>
        </Example>
        <Callout variant="tip">
          Compare EBS metrics in CloudWatch: <span className="font-mono text-sm">VolumeReadOps</span> /{' '}
          <span className="font-mono text-sm">VolumeWriteOps</span> for IOPS pressure;{' '}
          <span className="font-mono text-sm">VolumeThroughputPercentage</span> for MiB/s ceiling. Right-size
          gp3 before paying io2 prices.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'gp3 is the default for most DE EC2: independent IOPS and throughput tuning without resizing disk.',
          'Throughput (MiB/s) drives large sequential ETL staging; IOPS drives random small-file or DB patterns.',
          'io2/io2 Block Express for sustained high IOPS with low latency — use when gp3 metrics prove insufficient.',
          'st1/sc1 HDD tiers are niche; active pipeline scratch belongs on gp3 or instance store, cold data on S3.',
          'Watch VolumeThroughputPercentage and IOPS metrics — bump gp3 throughput before upgrading to io2.',
        ]}
      />
    </LessonArticle>
  )
}
