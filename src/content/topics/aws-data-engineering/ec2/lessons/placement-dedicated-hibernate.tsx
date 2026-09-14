import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PlacementDedicatedHibernate() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Where and how your instance runs">
        Most ETL workers use default placement — shared hardware in an AZ. Advanced scenarios need{' '}
        <strong className="text-white">placement groups</strong> for low-latency clusters,{' '}
        <strong className="text-white">dedicated hosts</strong> for compliance isolation, or{' '}
        <strong className="text-white">hibernate</strong> to preserve RAM state across stop/start for long
        dev sessions. Know when each matters for data platforms — and when it is overkill.
      </Callout>

      <Definition term="Placement Group">
        <p>
          A <strong className="text-white">placement group</strong> influences how instances are placed on
          underlying hardware. <strong className="text-white">Cluster</strong>: instances packed in same
          AZ for low network latency — HPC, tightly coupled Spark when you manage the cluster yourself
          (rare vs EMR). <strong className="text-white">Spread</strong>: each instance on distinct
          hardware — max availability for small critical nodes (e.g. two Airflow schedulers).{' '}
          <strong className="text-white">Partition</strong>: large distributed systems (Kafka, HDFS-style)
          with fault isolation per rack partition.
        </p>
      </Definition>

      <LessonSection title="Placement groups — DE relevance">
        <ContentStep number={1} title="Cluster placement">
          <p className="text-slate-300">
            Use when inter-node network latency dominates — custom Spark on EC2 without EMR, MPI workloads.
            Trade-off: correlated hardware failure if the rack fails. Most managed services (Glue, EMR)
            handle placement for you.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Spread placement">
          <p className="text-slate-300">
            Up to seven instances per AZ on distinct hardware. Good for{' '}
            <strong className="text-white">Airflow scheduler redundancy</strong> (2 small instances) or
            singleton control nodes where you cannot afford simultaneous host failure.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Partition placement">
          <p className="text-slate-300">
            Large sharded systems — less common in typical S3-centric DE lakes unless you run self-managed
            Kafka or Cassandra on EC2.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Dedicated Hosts and Dedicated Instances">
        <Definition term="Dedicated Instance">
          <p>
            Runs on <strong className="text-white">single-tenant hardware</strong> — no other customer
            instances on that host, but AWS may move your instance to another dedicated host for maintenance.
            Billing per instance hour.
          </p>
        </Definition>
        <Definition term="Dedicated Host">
          <p>
            You allocate an entire physical host — full visibility of sockets/cores for BYOL licensing
            (Windows/SQL Server) and strict compliance (finance, healthcare) requiring physical isolation
            audit trails. Most common DE trigger: regulatory requirement or license compliance, not routine
            ETL.
          </p>
        </Definition>
        <Callout variant="tip">
          Compliance teaser: if a regulator asks &quot;who shares the metal?&quot; — dedicated host gives
          host-level ID and capacity control. For standard lake ingestion, default tenancy plus encryption
          at rest (EBS, S3) satisfies most policies at lower cost.
        </Callout>
      </LessonSection>

      <LessonSection title="EC2 Hibernate">
        <ContentStep number={1} title="What hibernate does">
          <p className="text-slate-300">
            On <strong className="text-white">stop-hibernate</strong>, instance RAM is written to the root
            EBS volume and restored on start — process memory survives, like laptop sleep. Requires
            instance type and AMI that support hibernate, and root volume large enough for RAM + OS.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE use cases">
          <p className="text-slate-300">
            Dev/staging: pause a long-running notebook server or Airflow test box overnight without
            reloading datasets into memory. <strong className="text-white">Not</strong> for production
            schedulers — use proper HA and externalize state to RDS/S3 instead of relying on RAM snapshot.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Limits">
          <p className="text-slate-300">
            Hibernate is stop/start semantics — still pay for EBS and Elastic IP while stopped; not a
            substitute for Spot or Savings Plans optimization on prod batch fleets.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Placement groups: Cluster (low latency), Spread (HA for small critical sets), Partition (large sharded systems).',
          'Spread suits redundant Airflow schedulers; Cluster for self-managed low-latency Spark clusters — rare vs EMR/Glue.',
          'Dedicated Instances/Hosts provide single-tenant hardware for compliance or BYOL — uncommon for routine lake ETL.',
          'Hibernate saves RAM to root EBS on stop — handy for dev boxes; production state belongs in RDS/S3, not hibernated RAM.',
          'Default placement is fine for most stateless ETL workers pulling from SQS and writing to S3.',
        ]}
      />
    </LessonArticle>
  )
}
