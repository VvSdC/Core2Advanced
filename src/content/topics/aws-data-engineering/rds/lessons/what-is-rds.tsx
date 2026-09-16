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

export function WhatIsRds() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="In simple terms">
        Amazon RDS is AWS&apos;s managed{' '}
        <strong className="text-white">relational database service</strong>. Instead of installing
        PostgreSQL or MySQL on an EC2 instance yourself — patching OS, configuring replication, scheduling
        backups — you choose an engine and instance size; AWS runs the database engine on your behalf. For
        data engineers, RDS is where live business data is created and updated before pipelines extract it
        to S3, Athena, and Redshift.
      </Callout>

      <Definition term="Amazon RDS">
        <p>
          <strong className="text-white">Amazon RDS (Relational Database Service)</strong> is a fully managed
          service that provisions, operates, and scales relational databases in the cloud. It supports
          PostgreSQL, MySQL, MariaDB, Oracle, and Microsoft SQL Server (plus compatibility with Aurora in
          advanced tracks). You define instance class, storage, VPC placement, and backup retention; RDS
          handles software installation, minor version patching, and automated backup infrastructure.
        </p>
      </Definition>

      <LessonSection title="Managed relational database — what that means">
        <p className="text-slate-300">
          A <strong className="text-white">relational database</strong> stores data in tables with rows and
          columns, enforces schemas, supports SQL, and provides ACID transactions — the standard backend for
          web apps, ERP systems, and internal tools. <strong className="text-white">Managed</strong> means
          AWS abstracts much of the undifferentiated heavy lifting so your team focuses on schema, queries,
          and application logic rather than disk failure drills at 3 a.m.
        </p>
        <ContentStep number={1} title="Familiar SQL surface">
          <p className="text-slate-300">
            Developers use standard drivers (JDBC, psycopg2, mysql-connector) and SQL dialects they already
            know. DE extract jobs often reuse the same JDBC URLs with read-only credentials scoped to
            specific tables.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Single primary writer (typical)">
          <p className="text-slate-300">
            Most RDS workloads have one primary instance accepting writes. Read replicas and Multi-AZ add
            read scale and HA — covered in later lessons — but the mental model starts with one authoritative
            database for live transactions.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Regional, VPC-hosted">
          <p className="text-slate-300">
            RDS instances live in your VPC subnets — not on the public internet by default. Glue connections,
            Lambda in VPC, and DMS replication instances reach RDS through private IPs and security group
            rules you control.
          </p>
        </ContentStep>
        <Flowchart
          title="RDS in the application and analytics stack"
          chart={`flowchart TB
  APP[Web and API services]
  APP --> RDS[RDS managed OLTP]
  RDS --> BKP[Automated backups snapshots]
  RDS --> EXT[DE extract DMS export JDBC]
  EXT --> S3[S3 data lake]
  S3 --> WH[Athena Redshift analytics]`}
        />
      </LessonSection>

      <LessonSection title="What AWS manages vs what you manage">
        <p className="text-slate-300">
          The shared responsibility model for RDS splits operational tasks clearly. Knowing the boundary
          helps DE teams coordinate with application owners on patching windows, credential rotation, and
          when extracts must pause.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">AWS manages</th>
                <th className="px-4 py-3">You manage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Database engine installation and minor version patching (during maintenance windows)',
                  'Schema design, indexes, and query tuning for your application',
                ],
                [
                  'Underlying host OS and hypervisor for the DB instance',
                  'Choosing instance class, storage type, and Multi-AZ / replica topology',
                ],
                [
                  'Automated backup infrastructure and snapshot storage (when enabled)',
                  'Backup retention period, manual snapshots before major changes, restore testing',
                ],
                [
                  'Multi-AZ synchronous replication and automatic failover mechanics',
                  'Application connection retry logic and DNS endpoint usage after failover',
                ],
                [
                  'Monitoring infrastructure (Enhanced Monitoring, Performance Insights APIs)',
                  'Setting alarms on CPU, storage, connections; responding to replica lag for DE jobs',
                ],
                [
                  'Encryption at rest option using KMS keys you specify',
                  'KMS key policies, IAM who can decrypt, TLS in transit configuration',
                ],
              ].map(([aws, you], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3">{aws}</td>
                  <td className="px-4 py-3">{you}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Maintenance windows matter for DE">
          <p className="text-slate-300">
            AWS applies patches during a weekly maintenance window you configure. Long-running JDBC extracts
            may fail mid-query — orchestrate heavy jobs outside that window or use snapshot export which is
            decoupled from live query load.
          </p>
        </ContentStep>
        <ContentStep number={2} title="You own the data model">
          <p className="text-slate-300">
            Normalized OLTP schemas (many small tables, foreign keys) are normal in RDS. DE pipelines often
            denormalize into wide Parquet or fact tables in S3 — the warehouse shape differs from the source
            on purpose.
          </p>
        </ContentStep>
        <ContentStep number={3} title="You own network access">
          <p className="text-slate-300">
            Security groups must allow Glue or DMS security groups to reach port 5432 (Postgres) or 3306
            (MySQL). Misconfigured SGs are the top reason extract jobs fail in dev — not wrong SQL.
          </p>
        </ContentStep>
        <Example title="Responsibility drill" caption="Who fixes what?">
{`Scenario: Nightly Glue JDBC job fails with "connection timed out"

You check: security group inbound rules, subnet routing, credentials in Secrets Manager, RDS publicly accessible flag (should usually be No).

AWS already handled: host hardware, engine process running, automated backup job completion.

Scenario: Postgres minor version upgrade scheduled

AWS applies patch in maintenance window.
You verify: application compatibility, pause or retry DE extracts, test restore from snapshot if major jump.`}
        </Example>
      </LessonSection>

      <LessonSection title="What RDS is not">
        <ContentStep number={1} title="Not a data warehouse">
          <p className="text-slate-300">
            Do not run large historical aggregations for BI on production RDS — use S3, Athena, or Redshift
            after extract. You already learned this contrast in the Redshift vs RDS lesson.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Not serverless SQL on files">
          <p className="text-slate-300">
            Athena queries S3 in place. RDS stores rows in managed database files on provisioned storage —
            different access pattern, different cost model, different scaling knobs.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Not NoSQL">
          <p className="text-slate-300">
            DynamoDB and DocumentDB serve key-value and document workloads. RDS is for structured relational
            data with SQL joins and transactions — the dominant pattern for traditional app backends DE
            extracts from.
          </p>
        </ContentStep>
        <Callout variant="insight">
          RDS is the OLTP tier in your mental model: apps write here, pipelines read (carefully) and copy
          elsewhere for analytics — complementary to everything you built in S3, Glue, Athena, and Redshift.
        </Callout>
      </LessonSection>

      <LessonSection title="Common DE touchpoints with RDS">
        <ContentStep number={1} title="JDBC connections from Glue or Spark">
          <p className="text-slate-300">
            Glue crawlers and ETL jobs connect with JDBC drivers, often reading in parallel by partition
            column — requires read replica or off-peak scheduling to protect the primary.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RDS snapshot export to S3">
          <p className="text-slate-300">
            Export a snapshot to Parquet in S3 without querying live tables — serverless extract ideal for
            full-table refreshes with minimal prod impact (engine support and options vary; detailed in
            advanced lessons).
          </p>
        </ContentStep>
        <ContentStep number={3} title="AWS DMS for CDC">
          <p className="text-slate-300">
            Database Migration Service reads transaction logs (binlog/WAL) and streams changes to S3 or
            downstream targets — near-real-time lake ingestion without repeated full-table SELECT on prod.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS is AWS\'s managed relational database service — PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server on provisioned instances.',
          'AWS manages engine patching, host infrastructure, backup mechanics, and Multi-AZ failover; you manage schema, sizing, network access, and extract scheduling.',
          'RDS powers live OLTP applications; DE treats it as a source to extract from — not an analytics destination.',
          'Common DE patterns: JDBC Glue jobs, snapshot export to S3, and DMS CDC — all require understanding VPC endpoints and least-privilege credentials.',
        ]}
      />
    </LessonArticle>
  )
}
