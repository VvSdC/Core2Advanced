import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AvailabilityDurabilityFaultTolerance() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Your phone&apos;s cloud backup is <strong className="text-white">durable</strong> — the photo
        should still exist even if you drop your phone in a lake. Your phone&apos;s ability to{' '}
        <em>open</em> the photo app right now is <strong className="text-white">availability</strong>.
        Data lakes and warehouses need both: data that never disappears, and systems that stay up when
        something breaks.
      </Callout>

      <Definition term="Availability">
        <p>
          <strong className="text-white">Availability</strong> measures whether a system is up and
          responding when users or pipelines need it. It is often expressed as a percentage over time —
          for example, 99.9% (&quot;three nines&quot;) means roughly 8.7 hours of downtime per year.
        </p>
        <p className="mt-2 text-slate-300">
          For data engineering: can your ingestion pipeline run at 2 a.m.? Can analysts query Redshift
          during business hours? Availability is about <em>access right now</em>.
        </p>
      </Definition>

      <Definition term="Durability">
        <p>
          <strong className="text-white">Durability</strong> measures whether data survives failures —
          disk crashes, data center fires, accidental deletes (with the right protections). Once written,
          durable data should remain intact for its intended lifetime.
        </p>
        <p className="mt-2 text-slate-300">
          Amazon S3 is designed for{' '}
          <strong className="text-white">99.999999999% (11 nines) durability</strong> over a given year.
          At a high level, that means AWS stores multiple copies of your objects across separate
          facilities inside a Region, so a single hardware failure does not lose your Parquet files or
          raw JSON logs. You still configure versioning, lifecycle, and cross-Region replication for
          human errors and disaster scenarios — durability is not the same as &quot;impossible to
          delete.&quot;
        </p>
      </Definition>

      <Definition term="Fault tolerance">
        <p>
          <strong className="text-white">Fault tolerance</strong> is the ability of a system to continue
          operating — or recover quickly — when a component fails, without losing data or corrupting
          results.
        </p>
        <p className="mt-2 text-slate-300">
          A fault-tolerant pipeline might retry failed Glue tasks, read from a Multi-AZ RDS replica when
          the primary blips, or route traffic to healthy Lambda concurrency while one AZ has network
          issues.
        </p>
      </Definition>

      <LessonSection title="Availability vs durability — do not mix them up">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Availability</th>
                <th className="px-4 py-3">Durability</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['What it asks', 'Is the service reachable?', 'Is the data still there after failure?'],
                [
                  'Bad day example',
                  'Redshift cluster rebooting — queries fail for 10 minutes',
                  'S3 object lost due to catastrophic multi-copy failure (extremely rare)',
                ],
                [
                  'DE lever',
                  'Multi-AZ, replicas, retries, health checks',
                  'S3 Standard storage, versioning, cross-Region copy, backup snapshots',
                ],
              ].map(([question, avail, dur]) => (
                <tr key={question} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{question}</td>
                  <td className="px-4 py-3">{avail}</td>
                  <td className="px-4 py-3">{dur}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          S3 can be highly durable while a misconfigured bucket policy blocks all reads — durable but
          unavailable. Conversely, a fast in-memory cache can be available until the node reboots and
          loses everything — available but not durable.
        </Callout>
      </LessonSection>

      <LessonSection title="The S3 durability story (high level)">
        <ContentStep number={1} title="Many copies, spread out">
          <p className="text-slate-300">
            When you PUT an object into S3 Standard, AWS replicates it across multiple devices in at
            least three Availability Zones within the Region. If one disk or one AZ has problems, other
            copies satisfy reads and background repair replaces damaged fragments.
          </p>
        </ContentStep>
        <ContentStep number={2} title="11 nines — what it really means">
          <p className="text-slate-300">
            &quot;11 nines&quot; is a statistical design target for object loss rate, not a guarantee
            against misconfiguration, ransomware, or deleting all versions without MFA delete. Treat it
            as: AWS invests heavily so you do not lose data because a single drive failed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cheaper tiers, different durability models">
          <p className="text-slate-300">
            S3 Glacier and Intelligent-Tiering still protect data, but retrieval takes longer. One Zone
            IA stores data in a single AZ — lower cost, less resilience to AZ loss. Pick tiers consciously
            for lake zones: raw archive vs hot analytics path.
          </p>
        </ContentStep>
        <Flowchart
          title="Durability vs availability in a lake"
          chart={`flowchart TB
  subgraph dur [Durability — data survives]
    S3[S3 multi-AZ copies]
    VER[Versioning + replication]
  end
  subgraph avail [Availability — pipelines and queries run]
    GLUE[Glue jobs retry]
    ATH[Athena / Redshift up]
  end
  INGEST[Data ingestion] --> S3
  S3 --> GLUE
  S3 --> ATH`}
        />
      </LessonSection>

      <LessonSection title="Why lakes and warehouses care">
        <ContentStep number={1} title="Data lakes (S3)">
          <p className="text-slate-300">
            The lake is often the system of record for raw and curated data. Durability protects years of
            history; availability of listing, reading, and writing objects determines whether nightly ETL
            and ad hoc Athena queries succeed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Warehouses (Redshift, RDS)">
          <p className="text-slate-300">
            Warehouses optimize query availability and performance. Snapshots and replicas address
            durability and failover. A warehouse that is down blocks dashboards even if S3 still holds the
            files.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fault tolerance in pipelines">
          <p className="text-slate-300">
            Idempotent writes, dead-letter queues, Step Functions retries, and multi-AZ endpoints turn
            random failures into brief delays instead of corrupted partitions or silent data loss.
          </p>
        </ContentStep>
        <Callout variant="tip">
          When someone asks &quot;is our data safe?&quot; clarify: safe from loss (durability) or safe
          from outage (availability)? The answer and the AWS services involved differ.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Availability = system up and usable; durability = data survives failures; fault tolerance = keeps working through component failure.',
          'S3 Standard targets 11 nines durability via copies across AZs — protect against ops mistakes with versioning, replication, and backups.',
          'Lakes emphasize durable storage; warehouses emphasize query uptime — pipelines need fault-tolerant design for both.',
        ]}
      />
    </LessonArticle>
  )
}
