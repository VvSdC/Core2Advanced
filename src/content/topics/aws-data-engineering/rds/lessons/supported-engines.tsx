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

export function SupportedEngines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Pick the engine your app team already uses">
        RDS is not one database — it is a <strong className="text-white">choice of engines</strong> AWS
        operates for you. When you join a DE team, you rarely pick the engine; you inherit whatever
        PostgreSQL, MySQL, or SQL Server version production already runs. Your job is to know each
        engine&apos;s JDBC driver, default port, log formats for CDC, and export options so pipelines
        connect reliably.
      </Callout>

      <Definition term="RDS database engine">
        <p>
          A <strong className="text-white">database engine</strong> on RDS is the actual relational software
          — PostgreSQL 16, MySQL 8.0, etc. — running on a DB instance. Engine choice determines SQL
          dialect, supported extensions, replication mechanics, and which AWS extract features (snapshot
          export, DMS endpoints) apply. You select engine and version at create time; major upgrades require
          planning and often a maintenance window.
        </p>
      </Definition>

      <LessonSection title="Engines RDS supports">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Engine</th>
                <th className="px-4 py-3">Typical use</th>
                <th className="px-4 py-3">Default port</th>
                <th className="px-4 py-3">DE notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'PostgreSQL',
                  'Modern web apps, geospatial (PostGIS), JSON columns',
                  '5432',
                  'Very common DE source; WAL logical replication for DMS; strong ecosystem of JDBC tools',
                ],
                [
                  'MySQL',
                  'LAMP stacks, e-commerce, WordPress backends',
                  '3306',
                  'Extremely common; binlog CDC via DMS; Glue MySQL connector widely documented',
                ],
                [
                  'MariaDB',
                  'MySQL-compatible forks, open-source preference',
                  '3306',
                  'Treat like MySQL for extract patterns; confirm version-specific DMS support',
                ],
                [
                  'Oracle',
                  'Enterprise ERP, legacy commercial apps',
                  '1521',
                  'Licensing considerations; DMS and Glue Oracle connectors; less common in greenfield startups',
                ],
                [
                  'SQL Server',
                  '.NET enterprise apps, Microsoft stack shops',
                  '1433',
                  'Glue and DMS SQL Server support; snapshot export available for some versions',
                ],
              ].map(([engine, use, port, notes]) => (
                <tr key={engine} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{engine}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3">
                    <code className="text-core-400">{port}</code>
                  </td>
                  <td className="px-4 py-3">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Aurora — related but separate">
          Amazon Aurora is AWS&apos;s cloud-native MySQL- and PostgreSQL-compatible engine with separate
          storage and compute scaling. Many production workloads use Aurora instead of standard RDS. Extract
          patterns (DMS, JDBC) are similar; architecture and pricing differ — covered in advanced RDS
          lessons, not this beginner pass.
        </Callout>
      </LessonSection>

      <LessonSection title="PostgreSQL on RDS">
        <ContentStep number={1} title="Why teams choose it">
          <p className="text-slate-300">
            Rich SQL, JSONB, extensions, strong open-source community. Startups and mid-size companies often
            standardize on Postgres for new services — making it the most frequent OLTP source DE teams
            encounter in modern AWS shops.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extract considerations">
          <p className="text-slate-300">
            Logical replication slots for DMS; <code className="text-core-400">pg_dump</code> for ad hoc
            dev copies; JDBC with numeric primary-key ranges for parallel Glue reads. Watch connection
            limits on small instances when Spark opens many concurrent connections.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift familiarity">
          <p className="text-slate-300">
            Redshift SQL is PostgreSQL-compatible in flavor — understanding Postgres types and catalogs helps
            when mapping source columns to warehouse DDL, even though bulk load uses COPY not INSERT.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="MySQL and MariaDB on RDS">
        <ContentStep number={1} title="Why teams choose them">
          <p className="text-slate-300">
            Mature, widely taught, huge hosting history. E-commerce and CMS-backed businesses often run MySQL
            or MariaDB for order and catalog tables — classic fact-table sources for nightly warehouse loads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extract considerations">
          <p className="text-slate-300">
            Binary log (binlog) must be enabled for DMS CDC — often already on for Multi-AZ. Glue MySQL
            connector supports partition column parallel reads. Charset (utf8mb4) and timezone settings
            affect string landing in S3 Parquet.
          </p>
        </ContentStep>
        <ContentStep number={3} title="MariaDB compatibility">
          <p className="text-slate-300">
            MariaDB diverged from MySQL over time. Confirm engine version in the RDS console before assuming
            every MySQL tutorial applies — especially for replication and DMS filter rules.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Oracle and SQL Server on RDS">
        <ContentStep number={1} title="Enterprise footprints">
          <p className="text-slate-300">
            Large enterprises migrating lift-and-shift workloads often keep Oracle or SQL Server on RDS.
            DE teams inherit decades of stored procedures and licensed features — extracts still land on S3,
            but coordination with DBAs is essential.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tooling">
          <p className="text-slate-300">
            Glue provides Oracle and SQL Server JDBC drivers; DMS supports both as sources. Snapshot export
            to S3 supports selected engines — check current AWS docs for your version before designing a
            serverless full extract.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Licensing and edition">
          <p className="text-slate-300">
            Oracle on RDS involves license-included or BYOL models. SQL Server has Web, Standard, Enterprise
            editions. These choices rarely change DE SQL but affect who approves schema changes and backup
            policies.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="DE preference — Postgres and MySQL as common sources">
        <p className="text-slate-300">
          In greenfield AWS analytics architectures, <strong className="text-white">PostgreSQL</strong> and{' '}
          <strong className="text-white">MySQL</strong> dominate as RDS sources because open-source tooling,
          DMS support, and community Glue examples are richest. If your pipeline docs reference generic JDBC
          and binlog/WAL CDC, they usually assume one of these two.
        </p>
        <Flowchart
          title="Engine choice → extract path (typical)"
          chart={`flowchart TD
  ENG{Which RDS engine?}
  ENG -->|Postgres| PG[WAL logical replication DMS]
  ENG -->|MySQL MariaDB| MY[Binlog CDC DMS]
  ENG -->|Oracle SQL Server| ENT[JDBC batch or snapshot export]
  PG --> S3[S3 Parquet or JSON]
  MY --> S3
  ENT --> S3
  S3 --> LAKE[Glue catalog Athena Redshift]`}
        />
        <Example title="Mapping source engine to Glue connection" caption="Checklist when onboarding a new RDS source">
{`1. Engine + version from RDS console (e.g. postgres 15.4)
2. Endpoint hostname and port (5432 / 3306 / 1433 / 1521)
3. JDBC URL pattern for Glue: jdbc:postgresql://host:5432/dbname
4. Read-only user with SELECT on needed schemas only
5. VPC: Glue connection in same VPC/subnets or peered network
6. CDC path: DMS source endpoint + binlog/WAL prerequisites
7. Full refresh path: snapshot export or off-peak JDBC with LIMIT/OFFSET or key ranges`}
        </Example>
        <Callout variant="insight">
          Interview tip: name the engine, default port, and one CDC mechanism (WAL for Postgres, binlog for
          MySQL). That shows you understand RDS as a pipeline source, not just an app backend.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS supports PostgreSQL, MySQL, MariaDB, Oracle, and SQL Server — engine choice drives SQL dialect, ports, and extract tooling.',
          'PostgreSQL and MySQL are the most common DE sources — strong DMS, Glue JDBC, and community patterns.',
          'Postgres default port 5432 (WAL CDC); MySQL/MariaDB 3306 (binlog CDC); Oracle 1521; SQL Server 1433.',
          'Match extract design to engine: DMS CDC for ongoing changes, JDBC or snapshot export for batch full loads — always with least-privilege read access.',
        ]}
      />
    </LessonArticle>
  )
}
