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

export function PuttingItTogetherRdsBeginner() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Checkpoint before HA and security deep dives">
        You now know what RDS is, which engines appear in pipelines, how endpoints and ports work, what
        parameter groups control, and how storage differs from S3. This lesson ties those threads into a{' '}
        <strong className="text-white">beginner RDS checklist</strong> — the mental model and vocabulary you
        need before Multi-AZ failover diagrams, backup restore drills, and DMS CDC setup in a dev account.
      </Callout>

      <Definition term="Beginner RDS mental model">
        <p>
          A <strong className="text-white">beginner RDS mental model</strong> for DE includes: RDS as OLTP
          source (not BI target), engine choice (Postgres/MySQL most common), connection via endpoint:port
          and JDBC, parameter groups affecting timezone and connections, gp3 storage on the instance vs S3
          for lake copies, and extract paths (JDBC, snapshot export, DMS) feeding Glue, Athena, and Redshift
          — all before hands-on security group and replica configuration in the next lessons.
        </p>
      </Definition>

      <LessonSection title="Architecture checklist — can you draw this?">
        <ContentStep number={1} title="Apps write to RDS primary">
          <p className="text-slate-300">
            Live transactions on managed OLTP — Postgres or MySQL on a DB instance with gp3 storage and a
            primary endpoint in private subnets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DE extracts without hammering prod">
          <p className="text-slate-300">
            Read replica JDBC, snapshot export to S3, or DMS CDC — scheduled and throttled; never executive
            dashboards on the primary writer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="S3 lake holds analytics copies">
          <p className="text-slate-300">
            Bronze and curated Parquet — durable, replayable, decoupled from RDS disk size and backup windows.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Athena QA, Redshift serve">
          <p className="text-slate-300">
            Athena validates partitions and row counts; Redshift COPY loads certified marts — the pattern you
            learned in the warehouse track, now with a named source tier.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Parameter and storage awareness">
          <p className="text-slate-300">
            Timezone and max_connections documented; storage growth monitored — silent source misconfigurations
            do not become silent lake bugs.
          </p>
        </ContentStep>
        <Flowchart
          title="Beginner RDS → lake → warehouse stack"
          chart={`flowchart TD
  APP[Application OLTP]
  APP --> RDS[RDS primary endpoint]
  RDS --> EXT[Replica JDBC snapshot DMS]
  EXT --> S3[S3 lake curated]
  S3 --> ATH[Athena QA explore]
  S3 --> RS[Redshift COPY marts]
  RS --> BI[Dashboards reporting]
  RDS -.->|not this path| BI`}
        />
      </LessonSection>

      <LessonSection title="Self-check — can you explain these?">
        <ContentStep number={1} title="What is RDS in one sentence?">
          <p className="text-slate-300">
            AWS-managed relational database service (Postgres, MySQL, etc.) for OLTP applications — AWS
            patches and backs up; you manage schema, network access, and sizing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS vs Redshift in one sentence">
          <p className="text-slate-300">
            RDS runs live app transactions (OLTP); Redshift serves analytics (OLAP) — DE extracts from RDS
            to S3, then COPY to Redshift.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Endpoint and port">
          <p className="text-slate-300">
            DNS hostname plus TCP port (5432 Postgres, 3306 MySQL) in JDBC URLs — Glue and DMS connect the
            same way apps do, usually via private VPC paths.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Parameter group purpose">
          <p className="text-slate-300">
            Reusable engine settings bundle — timezone, max_connections, CDC flags — applied to instances;
            changes may require reboot.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Storage vs S3">
          <p className="text-slate-300">
            RDS gp3/io2 disk holds live database files; S3 holds exported lake copies — different cost,
            scale, and access patterns.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Common engines for DE">
          <p className="text-slate-300">
            PostgreSQL and MySQL dominate as sources — WAL/binlog CDC via DMS, JDBC Glue jobs, snapshot
            export for full refreshes.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Why not BI on RDS?">
          <p className="text-slate-300">
            Heavy scans compete with checkout writes, lack columnar MPP, and risk prod outages — warehouse and
            lake tiers exist to absorb analytic load.
          </p>
        </ContentStep>
        <Example title="Beginner RDS concept drill" caption="No console required yet — explain aloud">
{`1. Name three RDS engines and their default ports.
2. What three pieces form a JDBC URL for Glue?
3. Why use a read replica endpoint for ETL instead of primary?
4. Name two parameter group settings DE teams document.
5. What is storage autoscaling and why set a maximum?
6. Draw: App → RDS → export → S3 → Athena/Redshift
7. What does AWS manage vs you manage on RDS?`}
        </Example>
        <Callout variant="insight">
          Strong RDS beginners do not memorize every instance class on day one. They ask: where does live
          data originate, how do we extract without hurting prod, and where does analytics run instead —
          three questions that prevent pointing QuickSight at Postgres production.
        </Callout>
      </LessonSection>

      <LessonSection title="Mini scenario — end-to-end story">
        <p className="text-slate-300">
          A subscription SaaS runs PostgreSQL on RDS (<code className="text-core-400">acme-subs-prod</code>,
          endpoint port 5432, gp3 200 GiB with autoscaling cap 500 GiB). Parameter group sets timezone UTC.
          Nightly Glue JDBC job reads from a read replica — 16 parallel connections, well below{' '}
          <code className="text-core-400">max_connections</code>. Curated Parquet lands in S3; Athena
          confirms row counts; Redshift COPY refreshes <code className="text-core-400">analytics.dim_subscribers</code>.
          Product managers never receive prod JDBC credentials — least privilege via Secrets Manager. When
          marketing asks for near-real-time cohort counts, the team plans DMS CDC in the next module instead
          of shortening JDBC cron to every five minutes on the primary.
        </p>
        <ContentStep number={1} title="OLTP tier — RDS">
          <p className="text-slate-300">Subscription updates — milliseconds, transactional, primary endpoint.</p>
        </ContentStep>
        <ContentStep number={2} title="Extract tier — replica + Glue">
          <p className="text-slate-300">Batch read isolated from writer — lag monitored, off-peak schedule.</p>
        </ContentStep>
        <ContentStep number={3} title="Lake tier — S3">
          <p className="text-slate-300">Curated Parquet — durable, Athena QA, multi-consumer.</p>
        </ContentStep>
        <ContentStep number={4} title="Serve tier — Redshift">
          <p className="text-slate-300">Certified marts — BI queries never touch RDS.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What's next">
        <p className="text-slate-300">
          The next lessons in the RDS track go hands-on on topics this beginner pass introduced:
        </p>
        <ContentStep number={1} title="Multi-AZ and read replicas">
          <p className="text-slate-300">
            Synchronous standby for HA, asynchronous replicas for read scale — when DE should use each
            endpoint and how failover affects connection strings (hint: instance endpoint stays stable).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Backups and restore">
          <p className="text-slate-300">
            Automated backups, point-in-time restore, manual snapshots — and snapshot export to S3 as a
            serverless extract pattern with minimal prod query load.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security and network access">
          <p className="text-slate-300">
            VPC subnets, security groups, encryption at rest and in transit, IAM database authentication,
            Secrets Manager — how Glue, Lambda, and DMS connect safely.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Extract patterns and comparisons">
          <p className="text-slate-300">
            DMS CDC deep dive, RDS vs Aurora for DE sources, RDS vs DynamoDB, cost-aware scheduling, and
            integrating RDS extracts into medallion lake architectures with CloudWatch alarms on pipeline
            failure.
          </p>
        </ContentStep>
        <p className="mt-4 text-slate-300">
          RDS connects everything you built in prior modules: IAM grants extract roles, VPC carries JDBC
          traffic, S3 receives exports, Glue transforms and catalogs, Athena validates, Redshift serves —
          CloudWatch alerts when replica lag or free storage threatens tonight&apos;s load. Advanced tracks
          assume you can explain OLTP source vs OLAP destination without opening the RDS console.
        </p>
        <Callout variant="tip" title="Before you create a Glue connection">
          Re-read the endpoint/port lesson and confirm security group paths with your network diagram. Teams
          that skip VPC planning burn days on connection timeouts — the architecture map saves time before
          the first JDBC test crawl.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Beginner model: App → RDS OLTP → extract (replica/export/DMS) → S3 lake → Athena QA / Redshift marts — never BI on prod RDS.',
          'Self-check: RDS definition, vs Redshift, endpoint:port JDBC, parameter groups, storage vs S3, common engines.',
          'Document timezone, max_connections, and CDC parameters before first extract; monitor storage growth.',
          'Next in RDS track: Multi-AZ, read replicas, backups and snapshot export, security groups, then DMS CDC and Aurora comparisons.',
        ]}
      />
    </LessonArticle>
  )
}
