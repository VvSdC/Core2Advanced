import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HaDisasterRecovery() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        High availability is like having two checkout lanes open so one slow cashier does not stop the
        store. Disaster recovery is the plan for when the whole store floods — where do you reopen, how
        fast, and with what inventory? Data platforms need both everyday resilience and a plan for rare
        catastrophes.
      </Callout>

      <Definition term="High availability (HA)">
        <p>
          <strong className="text-white">High availability</strong> means minimizing downtime during
          common failures — a server reboot, a single AZ outage, a failed ETL task — by using redundancy,
          failover, and automated recovery within or across Availability Zones.
        </p>
        <p className="mt-2 text-slate-300">
          Example: RDS Multi-AZ automatically fails over to a standby in another AZ if the primary
          database instance fails. Analysts might see a brief blip, not a day-long outage.
        </p>
      </Definition>

      <Definition term="Disaster recovery (DR)">
        <p>
          <strong className="text-white">Disaster recovery</strong> is the process and architecture for
          restoring operations after a large-scale event — Region-wide disruption, ransomware, accidental
          mass deletion, or extended provider outage. DR plans define <em>how</em> you recover and{' '}
          <em>how much</em> data and time you can afford to lose (RTO and RPO — covered in a later
          lesson).
        </p>
      </Definition>

      <Definition term="Reliability">
        <p>
          <strong className="text-white">Reliability</strong> is the broader ability of a system to
          perform its intended function correctly and consistently over time — including HA, DR, data
          integrity, and operational processes. AWS groups reliability as a Well-Architected pillar; HA and
          DR are how you achieve it in practice.
        </p>
      </Definition>

      <LessonSection title="HA vs DR vs reliability">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Typical DE example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'High availability',
                  'Survive component / AZ failure, seconds to minutes',
                  'Multi-AZ RDS, redundant NAT, Glue job retries',
                ],
                [
                  'Disaster recovery',
                  'Survive Region or major logical disaster, minutes to hours',
                  'S3 cross-Region replication, Redshift snapshot restore in another Region',
                ],
                [
                  'Reliability',
                  'Overall trustworthy platform — design + ops + testing',
                  'Runbooks, DR drills, monitoring, idempotent pipelines',
                ],
              ].map(([term, scope, example]) => (
                <tr key={term} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{term}</td>
                  <td className="px-4 py-3">{scope}</td>
                  <td className="px-4 py-3">{example}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="DR strategies — conceptual overview">
        <p className="text-slate-300">
          AWS and industry frameworks describe DR on a spectrum from cheapest/slowest to fastest/most
          expensive. You do not need every strategy on day one — pick based on business impact of
          downtime.
        </p>
        <ContentStep number={1} title="Backup and restore">
          <p className="text-slate-300">
            Regular backups (RDS snapshots, Redshift snapshots, S3 versioning) stored safely — often in
            another Region. After a disaster, you provision new infrastructure and restore from backup.
            Lowest steady cost; highest recovery time (RTO).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pilot light">
          <p className="text-slate-300">
            Core data is replicated continuously (e.g. S3 CRR, RDS read replica in DR Region), but compute
            stays minimal — a small Redshift cluster or no Glue workers until failover. You &quot;turn on
            the pilot light&quot; by scaling up during recovery.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Warm standby">
          <p className="text-slate-300">
            A reduced-capacity copy of the stack runs in the DR Region — smaller warehouse, fewer workers,
            but ready to accept traffic after DNS or routing switch. Faster failover than pilot light;
            higher ongoing cost.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Multi-site (active-active)">
          <p className="text-slate-300">
            Full stacks in two or more Regions serving traffic simultaneously. Best RTO/RPO for global
            users; hardest to build — data consistency, conflict resolution, and cost multiply. Common for
            large consumer apps; less common for batch-heavy DE unless SLAs demand it.
          </p>
        </ContentStep>
        <Flowchart
          title="DR strategy spectrum"
          chart={`flowchart LR
  A[Backup and restore] --> B[Pilot light]
  B --> C[Warm standby]
  C --> D[Multi-site active-active]
  A2[Lowest cost / slowest recovery] -.-> A
  D2[Highest cost / fastest recovery] -.-> D`}
        />
        <Callout variant="insight">
          Most data teams start with backup and restore plus cross-Region S3 replication for critical
          datasets, then add warm standby for the warehouse if finance cannot tolerate a day offline.
        </Callout>
      </LessonSection>

      <LessonSection title="What data engineers should document">
        <ContentStep number={1} title="Critical data paths">
          <p className="text-slate-300">
            List which S3 prefixes, databases, and tables are authoritative. Without that map, DR becomes
            guesswork during an incident.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Recovery order">
          <p className="text-slate-300">
            Restore identity (IAM roles), network (VPC), storage (S3, snapshots), then compute (Glue,
            Redshift), then replay or validate pipelines. Identity first — jobs fail mysteriously if roles
            are wrong.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Test the plan">
          <p className="text-slate-300">
            An untested DR plan is a wish. Schedule tabletop exercises and occasional restore drills to a
            sandbox account or Region.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HA handles everyday failures (AZ, instance); DR handles catastrophes (Region, mass corruption); reliability covers the whole trustworthy system.',
          'DR strategies range from backup/restore → pilot light → warm standby → multi-site active-active — more speed costs more money and complexity.',
          'Document critical data, recovery order, and run DR tests — especially before production pipelines depend on you.',
        ]}
      />
    </LessonArticle>
  )
}
