import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithRds() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why RDS after Redshift in the DE path">
        You know how Redshift serves analytics on loaded columnar data — COPY from S3, MPP joins, BI
        dashboards. The next question every data engineer eventually asks is:{' '}
        <strong className="text-white">where does the curated warehouse data actually come from before it
        hits S3?</strong> In most AWS platforms, the answer is an{' '}
        <strong className="text-white">operational relational database</strong> — orders, customers,
        inventory, billing — running on <strong className="text-white">Amazon RDS</strong>. RDS is AWS&apos;s
        managed OLTP service. You do not point executive dashboards at prod RDS, but you absolutely must
        understand how apps write there and how DE pipelines extract from it into the lake.
      </Callout>

      <Definition term="What is RDS in a DE pipeline?">
        <p>
          <strong className="text-white">Amazon RDS (Relational Database Service)</strong> runs managed
          relational engines — PostgreSQL, MySQL, MariaDB, Oracle, SQL Server — optimized for transactional
          applications. Your microservices INSERT and UPDATE live rows; RDS handles backups, patching, and
          Multi-AZ failover. For data engineering, RDS is typically a{' '}
          <strong className="text-white">source system</strong>: snapshot exports, DMS CDC, or JDBC batch
          jobs move data to S3, then Glue, Athena, and Redshift consume it downstream.
        </p>
        <p className="mt-2 text-slate-300">
          Think of RDS as{' '}
          <span className="text-core-400">the live system of record your pipelines read from — never the
          warehouse you serve BI from</span>.
        </p>
      </Definition>

      <LessonSection title="Operational DB vs warehouse — why order matters">
        <p className="text-slate-300">
          Redshift lessons taught you OLAP: bulk loads, columnar scans, concurrent BI. RDS is the mirror
          image — OLTP: row-level transactions, indexed point reads, connection pools from app servers.
          Learning Redshift first gives you the destination; RDS explains the origin of much of what lands
          in S3 and COPY into marts.
        </p>
        <ContentStep number={1} title="RDS — live application writes">
          <p className="text-slate-300">
            Checkout completes, user profile updates, payment captured — milliseconds matter, ACID guarantees
            matter, and heavy analyst GROUP BY queries do not belong here.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 lake — durable intermediate">
          <p className="text-slate-300">
            Nightly exports or CDC streams land Parquet or CSV in bronze and curated zones — replayable,
            multi-consumer, decoupled from prod uptime.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redshift / Athena — analytics tiers">
          <p className="text-slate-300">
            Athena QA-checks lake partitions; Redshift serves certified marts — both fed from RDS extracts,
            not from direct prod SQL by analysts.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Interview framing: RDS runs the business; the lake and warehouse explain the business. DE owns
          the arrow from RDS to S3 — protecting prod while enabling analytics.
        </Callout>
      </LessonSection>

      <LessonSection title="Roadmap for this sub-topic">
        <p className="text-slate-300">
          We build RDS in layers so Multi-AZ failover, security groups, and DMS CDC do not overwhelm you on
          day one. Follow this order:
        </p>
        <ContentStep number={1} title="Basics — engines and instance">
          <p className="text-slate-300">
            Understand what RDS is, supported engines, DB instances, endpoints, ports, parameter groups,
            and storage types — enough to recognize a source database in a pipeline diagram.
          </p>
        </ContentStep>
        <ContentStep number={2} title="HA, backups, and replicas">
          <p className="text-slate-300">
            Learn Multi-AZ for production resilience, automated backups and point-in-time restore, and read
            replicas — including why DE often reads from a replica or export instead of the primary writer.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security and access">
          <p className="text-slate-300">
            VPC subnets, security groups, IAM database authentication, Secrets Manager rotation — how Glue,
            Lambda, and DMS connect without exposing prod to the public internet.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Comparisons and extract patterns (next module)">
          <p className="text-slate-300">
            After this beginner pass: RDS vs Aurora, snapshot export to S3, DMS CDC, JDBC Glue connections,
            RDS vs DynamoDB for DE sources, and cost-aware extract scheduling.
          </p>
        </ContentStep>
        <Flowchart
          title="RDS sub-topic path"
          chart={`flowchart LR
  A[Getting started] --> B[What is RDS]
  B --> C[Supported engines]
  C --> D[Instance endpoint port]
  D --> E[Parameter option groups]
  E --> F[Storage basics]
  F --> G[Putting it together beginner]
  G --> H[Multi-AZ backups security — next]`}
        />
      </LessonSection>

      <LessonSection title="Vocabulary you will use every day">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'DB instance',
                  'One running RDS database deployment — an engine on a chosen instance class with allocated storage in a VPC',
                ],
                [
                  'Endpoint',
                  'The DNS hostname apps and ETL use to connect — e.g. mydb.abc123.us-east-1.rds.amazonaws.com',
                ],
                [
                  'Parameter group',
                  'A named bundle of engine settings (timezone, max_connections, log settings) applied to one or more DB instances',
                ],
                [
                  'Multi-AZ',
                  'Synchronous standby replica in another Availability Zone — automatic failover if the primary fails; apps reconnect to the same endpoint',
                ],
                [
                  'Read replica',
                  'Asynchronous copy of the primary for read scaling — DE can run lighter extracts here to reduce load on the writer (with lag awareness)',
                ],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Naming — quick check">
          Use environment and engine in identifiers:{' '}
          <code className="text-core-400">acme-orders-prod-postgres</code> or{' '}
          <code className="text-core-400">acme-billing-dev-mysql</code>. Clear names help when your Glue
          connection list has twelve JDBC URLs and you need to know which one is safe for nightly export.
        </Callout>
      </LessonSection>

      <LessonSection title="How RDS fits after Redshift in a pipeline">
        <p className="text-slate-300">
          The e-commerce app writes orders to RDS Postgres. A nightly Glue job (or DMS task) extracts
          changes to S3 curated Parquet. Athena confirms row counts; orchestration COPYs into Redshift{' '}
          <code className="text-core-400">analytics.fact_orders</code>. QuickSight reads the warehouse —
          never the production RDS primary during peak checkout hours.
        </p>
        <Flowchart
          title="App → RDS → CDC/export → S3 → Glue/Athena/Redshift"
          chart={`flowchart LR
  APP[Application microservices]
  APP --> RDS[RDS OLTP primary]
  RDS --> CDC[Snapshot export or DMS CDC]
  CDC --> S3[S3 lake bronze and curated]
  S3 --> GLUE[Glue transform and catalog]
  GLUE --> ATH[Athena QA and explore]
  GLUE --> RS[Redshift COPY marts]
  RS --> BI[Dashboards and reporting]`}
        />
        <Callout variant="insight">
          Mature platforms treat RDS as protected OLTP — extracts are scheduled, throttled, and often
          replica- or export-based — while S3 and Redshift absorb analytic load without risking prod
          transactions.
        </Callout>
      </LessonSection>

      <LessonSection title="Why data engineers care about RDS">
        <ContentStep number={1} title="Most curated facts start as operational rows">
          <p className="text-slate-300">
            Customer dimensions, order facts, subscription state — before star schemas in Redshift, rows
            lived in RDS. Understanding endpoints, engines, and backup windows is prerequisite to reliable
            extract design.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extract choices affect pipeline SLAs">
          <p className="text-slate-300">
            Full snapshot export vs incremental CDC vs JDBC paginated SELECT — each pattern depends on RDS
            capabilities, replica lag, and maintenance windows. Wrong choices stall nightly loads or hammer
            prod.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security and compliance boundaries">
          <p className="text-slate-300">
            PII often originates in RDS. DE pipelines need VPC peering, least-privilege IAM, and audit trails
            from source through S3 — RDS security lessons connect directly to Lake Formation and column
            masking downstream.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'RDS follows Redshift in the track — warehouse serves analytics; RDS is the common OLTP source feeding S3 and COPY pipelines.',
          'Roadmap: engines and instance basics → HA/backups/replicas → security → extract patterns and comparisons next.',
          'Core vocabulary: DB instance, endpoint, parameter group, Multi-AZ, read replica.',
          'Typical flow: App → RDS → snapshot export or CDC → S3 → Glue/Athena/Redshift — never heavy BI on prod RDS.',
        ]}
      />
    </LessonArticle>
  )
}
