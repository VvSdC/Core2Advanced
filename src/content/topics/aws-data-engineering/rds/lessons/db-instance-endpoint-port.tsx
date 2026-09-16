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

export function DbInstanceEndpointPort() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Three strings every connection needs">
        When a Glue job, Lambda function, or DMS task connects to RDS, it uses the same three pieces of
        information your application developers use: a <strong className="text-white">hostname</strong>{' '}
        (endpoint), a <strong className="text-white">port</strong>, and database credentials. Data engineers
        who can read the RDS console endpoint panel and translate it into a JDBC URL avoid half of all
        first-week extract failures.
      </Callout>

      <Definition term="DB instance">
        <p>
          A <strong className="text-white">DB instance</strong> is a single running deployment of an RDS
          database engine — for example, one PostgreSQL 15 server on a{' '}
          <code className="text-core-400">db.t3.medium</code> with 100 GiB storage in{' '}
          <code className="text-core-400">us-east-1a</code>. It has a unique identifier (
          <code className="text-core-400">acme-orders-prod</code>), status (available, backing-up,
          modifying), and one or more endpoints depending on Multi-AZ and read replica configuration.
        </p>
      </Definition>

      <Definition term="Endpoint">
        <p>
          An <strong className="text-white">endpoint</strong> is the DNS hostname clients use to reach the
          DB instance. AWS assigns a stable name like{' '}
          <code className="text-core-400">acme-orders-prod.c9akciq32.us-east-1.rds.amazonaws.com</code>.
          For Multi-AZ, applications connect to the <em>instance endpoint</em>; RDS routes to the current
          primary after failover — the hostname does not change. Read replicas have separate endpoints for
          read-only traffic.
        </p>
      </Definition>

      <LessonSection title="Endpoint and port — how to read the console">
        <ContentStep number={1} title="Endpoint hostname">
          <p className="text-slate-300">
            Copy from RDS → Databases → your instance → Connectivity and security. This hostname resolves
            to a private IP in your VPC (when not publicly accessible). Glue connections store this string
            in the JDBC URL host segment.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Port">
          <p className="text-slate-300">
            The TCP port the engine listens on — defaults are 5432 (PostgreSQL), 3306 (MySQL/MariaDB), 1433
            (SQL Server), 1521 (Oracle). You can customize at create time, but teams rarely do; document
            the actual port if non-default.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Database name">
          <p className="text-slate-300">
            The logical database inside the instance (e.g.{' '}
            <code className="text-core-400">orders_db</code>) — required in JDBC URLs alongside hostname and
            port. One RDS instance can host multiple databases on Postgres; MySQL treats this as schema
            context depending on connector settings.
          </p>
        </ContentStep>
        <Example title="JDBC URL patterns" caption="Glue and Spark use these formats">
{`PostgreSQL:
  jdbc:postgresql://acme-orders-prod.xxxx.us-east-1.rds.amazonaws.com:5432/orders_db

MySQL:
  jdbc:mysql://acme-billing.xxxx.us-east-1.rds.amazonaws.com:3306/billing

SQL Server:
  jdbc:sqlserver://acme-erp.xxxx.us-east-1.rds.amazonaws.com:1433;databaseName=erp

Host:port shorthand for quick tests:
  acme-orders-prod.xxxx.us-east-1.rds.amazonaws.com:5432`}
        </Example>
      </LessonSection>

      <LessonSection title="How applications and ETL connect">
        <p className="text-slate-300">
          Every client follows the same pattern: resolve hostname → open TCP connection on port → authenticate
          → run SQL. The difference between a checkout API and a nightly Glue job is{' '}
          <em>which endpoint</em>, <em>how many connections</em>, and <em>what SQL</em> — not the connection
          mechanics.
        </p>
        <ContentStep number={1} title="Application servers (OLTP)">
          <p className="text-slate-300">
            App tiers use connection pools (HikariCP, PgBouncer) pointed at the{' '}
            <strong className="text-white">primary instance endpoint</strong>. Many short read/write queries;
            pool size tuned to avoid exhausting{' '}
            <code className="text-core-400">max_connections</code> on the DB.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Glue / Spark JDBC (batch extract)">
          <p className="text-slate-300">
            ETL jobs open parallel connections — often partitioned by numeric ID ranges. Prefer a{' '}
            <strong className="text-white">read replica endpoint</strong> when available to isolate analytics
            load from the writer. Schedule off-peak if only primary exists.
          </p>
        </ContentStep>
        <ContentStep number={3} title="DMS replication instance">
          <p className="text-slate-300">
            DMS connects to the primary (or source for CDC) with credentials stored in the endpoint
            configuration. Network path: DMS replication instance in VPC subnet → security group allows
            inbound on RDS port → RDS security group allows DMS SG.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Lambda in VPC">
          <p className="text-slate-300">
            Event-driven micro-ETL may query RDS from Lambda attached to private subnets. Cold starts plus
            connection setup favor RDS Proxy for connection pooling — advanced topic; beginner takeaway:
            Lambda needs VPC config to reach private RDS endpoints.
          </p>
        </ContentStep>
        <Flowchart
          title="Client → hostname:port → RDS"
          chart={`flowchart LR
  APP[App server pool]
  GLUE[Glue JDBC job]
  DMS[DMS replication]
  APP --> EP[Instance endpoint :5432]
  GLUE --> REP[Read replica endpoint :5432]
  DMS --> EP
  EP --> RDS[RDS primary DB instance]
  REP --> RR[Read replica]`}
        />
      </LessonSection>

      <LessonSection title="Primary vs replica endpoints for DE">
        <p className="text-slate-300">
          Using the wrong endpoint is a common production incident: a heavy Spark job on the primary during
          Black Friday slows checkout. DE best practice:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Endpoint type</th>
                <th className="px-4 py-3">Use for</th>
                <th className="px-4 py-3">DE caution</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Instance (primary)',
                  'Application writes; DMS CDC source',
                  'Avoid large JDBC scans here when replica or export exists',
                ],
                [
                  'Read replica',
                  'Read-only SELECT; lighter JDBC extracts',
                  'Replication lag — data may be seconds/minutes behind primary',
                ],
                [
                  'Custom endpoint (cluster)',
                  'Aurora: routes reads/writes (advanced)',
                  'Not standard RDS single-instance; Aurora track covers this',
                ],
                [
                  'Snapshot export',
                  'No live TCP query — export files to S3',
                  'Best for full refresh without connection storm on prod',
                ],
              ].map(([type, use, caution]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{type}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3">{caution}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Glue connection checklist">
          When creating a Glue JDBC connection: VPC, subnet, security group (self-referencing or RDS SG
          inbound rule), endpoint hostname, port, and Secrets Manager or username/password. Test with a
          one-table crawl before scheduling a terabyte parallel read.
        </Callout>
      </LessonSection>

      <LessonSection title="Network path — why connection fails even with correct hostname">
        <ContentStep number={1} title="Same VPC or peering">
          <p className="text-slate-300">
            Glue and RDS must share network reachability. Glue connection ENIs live in subnets you pick;
            route tables must reach RDS subnet CIDRs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security groups are stateful firewalls">
          <p className="text-slate-300">
            RDS SG must allow inbound TCP on your port from the Glue connection SG (or DMS SG). Outbound on
            Glue SG is usually open; the inbound rule on RDS is what beginners forget.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Publicly accessible = usually No">
          <p className="text-slate-300">
            Production RDS should not be internet-facing. If{' '}
            <code className="text-core-400">Publicly accessible</code> is No, only in-VPC clients connect —
            correct for DE, but your laptop cannot telnet the port without a bastion or VPN.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A DB instance is one running RDS engine deployment; its endpoint is the DNS hostname clients connect to.',
          'Connection format is hostname:port plus database name and credentials — JDBC URLs encode all three for Glue and Spark.',
          'Apps write to the primary endpoint; DE should prefer read replicas or snapshot export for heavy reads when possible.',
          'Network success requires VPC placement, security group rules on the RDS port, and private (non-public) access for production.',
        ]}
      />
    </LessonArticle>
  )
}
