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

export function ParameterAndOptionGroups() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Settings bundles — not one-off console tweaks">
        RDS stores engine configuration in reusable <strong className="text-white">groups</strong> rather
        than scattering ad hoc changes across instances. A <strong className="text-white">parameter group</strong>{' '}
        holds engine settings like timezone and connection limits. An{' '}
        <strong className="text-white">option group</strong> (where supported) enables add-on features like
        Oracle Enterprise Manager. Data engineers rarely create these on day one, but you must recognize when
        a misconfigured parameter breaks an extract or shifts timestamps in the lake.
      </Callout>

      <Definition term="DB parameter group">
        <p>
          A <strong className="text-white">DB parameter group</strong> is a named collection of engine
          configuration parameters applied to one or more DB instances. Examples:{' '}
          <code className="text-core-400">max_connections</code>,{' '}
          <code className="text-core-400">log_statement</code>,{' '}
          <code className="text-core-400">timezone</code>,{' '}
          <code className="text-core-400">shared_preload_libraries</code> (Postgres). AWS provides default
          groups per engine version; teams clone defaults into{' '}
          <code className="text-core-400">acme-postgres15-prod</code> and attach it at launch or modify time.
          Some changes apply immediately; others require a reboot.
        </p>
      </Definition>

      <Definition term="Option group">
        <p>
          An <strong className="text-white">option group</strong> enables optional engine features and
          plugins — primarily for Oracle and SQL Server on RDS (e.g. OEM Agent, SQL Server Audit). PostgreSQL
          and MySQL on RDS use parameter groups for most tunables; option groups are less central for typical
          Postgres/MySQL DE sources. When present, options may also require reboot to take effect.
        </p>
      </Definition>

      <LessonSection title="Parameter groups at beginner level">
        <ContentStep number={1} title="Default vs custom">
          <p className="text-slate-300">
            Every new instance gets a default parameter group for its engine major version. Production teams
            create custom groups so dev, staging, and prod share identical settings — change once, apply to
            all attached instances.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Static vs dynamic parameters">
          <p className="text-slate-300">
            <strong className="text-white">Dynamic</strong> parameters apply without reboot (e.g. some logging
            levels). <strong className="text-white">Static</strong> parameters need a maintenance reboot —
            plan before flipping settings on a prod primary during business hours.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Engine-specific names">
          <p className="text-slate-300">
            Postgres <code className="text-core-400">rds.logical_replication</code> enables DMS CDC; MySQL{' '}
            <code className="text-core-400">binlog_format</code> must be ROW for many CDC setups. You do not
            memorize every parameter now — know they exist in the parameter group console and affect pipeline
            prerequisites.
          </p>
        </ContentStep>
        <Flowchart
          title="Parameter group lifecycle"
          chart={`flowchart LR
  DEF[Default parameter group]
  DEF --> CLONE[Clone to custom group]
  CLONE --> EDIT[Edit parameters timezone connections logging]
  EDIT --> ATTACH[Attach to DB instance]
  ATTACH --> REBOOT{Reboot required?}
  REBOOT -->|Yes| MW[Maintenance window reboot]
  REBOOT -->|No| LIVE[Live apply]`}
        />
      </LessonSection>

      <LessonSection title="Option groups at beginner level">
        <ContentStep number={1} title="When you encounter them">
          <p className="text-slate-300">
            Oracle and SQL Server RDS instances select an option group at creation. Options add features
            beyond base engine install — audit plugins, OEM monitoring agents, etc. Postgres/MySQL DE
            pipelines seldom touch option groups.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compatibility with engine version">
          <p className="text-slate-300">
            Option groups bind to engine type and major version. Upgrading RDS engine version may require a
            new option group — coordinate with DBAs before major upgrades that coincide with extract
            schedules.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Separate from parameter groups">
          <p className="text-slate-300">
            Parameters tune behavior (numbers, flags, strings). Options install/add modules. Both attach to
            the instance but are managed in different console sections — avoid confusing them in runbooks.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why data engineers care">
        <p className="text-slate-300">
          DE jobs read timestamps, strings, and row counts from RDS. Parameter defaults on the source
          instance flow into S3 and downstream warehouses — silent mismatches cause join failures and
          audit discrepancies.
        </p>
        <ContentStep number={1} title="Timezone">
          <p className="text-slate-300">
            If RDS stores <code className="text-core-400">TIMESTAMP WITHOUT TIME ZONE</code> in UTC but
            application servers assume US/Eastern, extracts look wrong until someone checks the parameter
            group <code className="text-core-400">timezone</code> setting. Align source, extract job, and
            lake column semantics in documentation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="max_connections teaser">
          <p className="text-slate-300">
            Each JDBC connection from Glue parallel tasks consumes a slot. Default{' '}
            <code className="text-core-400">max_connections</code> on small instances is modest — a
            misconfigured Spark job with 200 partitions can exhaust connections and block checkout traffic.
            Use replicas, lower concurrency, or RDS Proxy (advanced) instead of raising limits blindly.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Logging and CDC prerequisites">
          <p className="text-slate-300">
            DMS CDC may require enabling logical replication (Postgres) or verifying binlog retention
            (MySQL) via parameters. Pipeline design meetings should confirm these flags before promising
            near-real-time lake latency.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Character set and collation">
          <p className="text-slate-300">
            MySQL <code className="text-core-400">character_set_server</code> affects emoji and international
            text landing in Parquet. Unexpected mojibake in S3 often traces back to source charset parameters,
            not the Glue job.
          </p>
        </ContentStep>
        <Example title="Parameters DE teams document" caption="Copy into your source onboarding runbook">
{`Engine: PostgreSQL 15
Parameter group: acme-postgres15-prod

Document these before first extract:
  timezone ............... UTC (confirm with app team)
  max_connections ........ 200 (watch Glue parallel degree)
  rds.logical_replication .. on (if DMS CDC)
  log_min_duration_statement . 1000 ms (optional slow query audit)

After any parameter group change:
  1. Note static vs dynamic in change ticket
  2. Schedule reboot if required
  3. Re-run row-count QA in Athena on next partition`}
        </Example>
        <Callout variant="insight">
          Strong DE onboarding asks the DBA for the attached parameter group name and exports a screenshot
          of timezone, max_connections, and CDC-related flags — before writing a single line of Glue code.
        </Callout>
      </LessonSection>

      <LessonSection title="Changing parameters safely">
        <ContentStep number={1} title="Clone, do not edit default">
          <p className="text-slate-300">
            AWS default groups are read-only templates. Clone to{' '}
            <code className="text-core-400">acme-postgres15-de-friendly</code>, modify the clone, attach to
            dev instance first, validate extracts, then promote to prod during a change window.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pending-reboot queue">
          <p className="text-slate-300">
            Console shows parameters with <em>pending-reboot</em> status. Until reboot, old values still
            run — do not assume CDC is enabled until the instance restarts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Communicate with app owners">
          <p className="text-slate-300">
            Parameter changes are shared infrastructure. DE requests for logging or replication settings
            must coordinate with application SLOs — a reboot fails over Multi-AZ briefly; plan accordingly.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Parameter groups bundle engine settings (timezone, max_connections, logging, CDC flags) applied to DB instances.',
          'Option groups enable optional add-ons — mainly Oracle/SQL Server; less common for Postgres/MySQL DE paths.',
          'DE cares about timezone alignment, connection limits for parallel JDBC, and CDC prerequisite parameters.',
          'Clone custom parameter groups from defaults; test in dev; watch pending-reboot status before assuming changes are live.',
        ]}
      />
    </LessonArticle>
  )
}
