import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function StorageClasses() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Storage class is a cost vs access trade-off">
        S3 is not one homogeneous blob store — every object lives in a{' '}
        <strong className="text-white">storage class</strong> that sets durability, availability, retrieval
        latency, and price. Data engineers pick classes per zone in the lake: hot landing data stays
        Standard; aging raw logs move to IA or Glacier; compliance archives sink to Deep Archive.
      </Callout>

      <Definition term="S3 storage class">
        <p>
          A <strong className="text-white">storage class</strong> defines how S3 stores an object and what
          you pay for storage, requests, and retrieval. You can set a default at bucket level, override per
          object at upload, or automate transitions with lifecycle rules — the backbone of lake cost
          optimization without deleting history.
        </p>
      </Definition>

      <LessonSection title="Frequent access — Standard and Intelligent-Tiering">
        <ContentStep number={1} title="S3 Standard">
          <p className="text-slate-300">
            Default for active lake paths: <span className="font-mono text-sm">landing/</span>,{' '}
            <span className="font-mono text-sm">curated/</span> queried daily. Eleven nines durability,
            low millisecond latency, no retrieval fee. Use for pipelines, Athena hot partitions, and any
            object read unpredictably but often.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 Intelligent-Tiering">
          <p className="text-slate-300">
            AWS monitors access patterns and moves objects between frequent and infrequent access tiers
            automatically — no retrieval penalties when data becomes hot again. Strong fit for{' '}
            <strong className="text-white">unknown or mixed access</strong> datasets: self-serve analyst
            folders, multi-tenant prefixes, or bronze zones where some partitions are queried weekly and
            others never. Small monitoring fee per object; saves ops time vs hand-tuned lifecycle rules.
          </p>
        </ContentStep>
        <Callout variant="tip">
          DE default: Standard (or Intelligent-Tiering for ambiguous bronze) on write; push predictable
          cold data to IA/Glacier with lifecycle — don&apos;t prematurely archive partitions Athena still scans.
        </Callout>
      </LessonSection>

      <LessonSection title="Infrequent access — Standard-IA and One Zone-IA">
        <ContentStep number={1} title="S3 Standard-IA">
          <p className="text-slate-300">
            Lower storage cost, higher retrieval cost, minimum 128 KB object size and 30-day storage
            charge. Same regional durability as Standard (multi-AZ). Use for{' '}
            <strong className="text-white">monthly or quarterly</strong> access: old raw batches, backup
            snapshots of ETL configs, staging data kept for reprocessing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 One Zone-IA">
          <p className="text-slate-300">
            Stores data in a single Availability Zone — cheaper than Standard-IA but not resilient to AZ
            loss. Acceptable only for{' '}
            <strong className="text-white">reproducible derived data</strong> you can rebuild from raw
            elsewhere (e.g. recomputable aggregates) — never sole copy of compliance or financial records.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Archive — Glacier family overview">
        <ContentStep number={1} title="S3 Glacier Instant Retrieval">
          <p className="text-slate-300">
            Millisecond access like IA but archive pricing tier. Good for audit logs you must read quickly
            on rare occasions without waiting minutes — regulatory lookups, infrequent but urgent forensics.
          </p>
        </ContentStep>
        <ContentStep number={2} title="S3 Glacier Flexible Retrieval">
          <p className="text-slate-300">
            Formerly S3 Glacier. Retrieval in minutes to hours (Expedited, Standard, Bulk). Classic{' '}
            <strong className="text-white">cold archive</strong>: multi-year raw retention, DR copies,
            tape-replacement compliance stores. Plan retrieval jobs into batch reprocessing windows.
          </p>
        </ContentStep>
        <ContentStep number={3} title="S3 Glacier Deep Archive">
          <p className="text-slate-300">
            Lowest storage cost; retrieval in 12–48 hours. For data kept years &quot;just in case&quot; —
            historical clickstreams, expired contract archives. Pair with lifecycle expiration when legal
            hold ends.
          </p>
        </ContentStep>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Access pattern</th>
                <th className="px-4 py-3">DE use case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Standard', 'Hot, unpredictable', 'Landing, curated, active Athena partitions'],
                ['Intelligent-Tiering', 'Mixed / unknown', 'Bronze self-serve, multi-tenant prefixes'],
                ['Standard-IA', 'Monthly+', 'Aging raw, reprocessable staging'],
                ['One Zone-IA', 'Monthly+, reproducible', 'Cheap scratch aggregates — not sole copy'],
                ['Glacier Instant', 'Rare but fast', 'Audit logs, urgent compliance reads'],
                ['Glacier Flexible', 'Cold, batch restore', 'Long-retention raw, DR archive'],
                ['Deep Archive', 'Coldest', 'Multi-year compliance, historical archive'],
              ].map(([cls, pattern, use]) => (
                <tr key={cls} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{cls}</td>
                  <td className="px-4 py-3">{pattern}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When a data engineer picks which class">
        <Flowchart
          title="Hot lake vs archive decision"
          chart={`flowchart TD
  OBJ[New object lands in S3]
  OBJ --> Q1{Queried weekly or in active pipelines?}
  Q1 -->|Yes| STD[S3 Standard or Intelligent-Tiering]
  Q1 -->|No| Q2{Need ms access if read?}
  Q2 -->|Yes| IA[S3 Standard-IA or Glacier Instant]
  Q2 -->|No| Q3{Can wait hours for restore?}
  Q3 -->|Yes| FLEX[S3 Glacier Flexible Retrieval]
  Q3 -->|No| DEEP[S3 Glacier Deep Archive]
  STD --> LIFE[Lifecycle rules automate later transitions]
  IA --> LIFE
  FLEX --> LIFE
  DEEP --> LIFE`}
        />
        <ContentStep number={1} title="Hot lake paths">
          <p className="text-slate-300">
            Ingest landing zones, current-month curated Parquet, feature store exports consumed by daily
            jobs — keep Standard. If access is erratic across tenants, Intelligent-Tiering on bronze reduces
            manual lifecycle tuning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Warm retention">
          <p className="text-slate-300">
            Raw data older than 90 days with occasional reprocessing — lifecycle to Standard-IA. Still in
            same region; Glue and Athena work after paying retrieval — validate job SLAs before bulk moves.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cold archive">
          <p className="text-slate-300">
            Legal retention, DR copies, superseded datasets — Glacier Flexible or Deep Archive. Document
            restore runbooks; Batch Operations or S3 Inventory help reconcile what is archived where.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Cost mistake to avoid: archiving partitions still referenced by Glue crawlers or Athena views —
          queries fail or spike cost on restore. Align lifecycle age with partition pruning and catalog
          metadata.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Storage class = durability, latency, and cost — pick per lake zone, not one class for the whole bucket.',
          'Standard / Intelligent-Tiering for hot and unknown access; Standard-IA for predictable infrequent reads; Glacier tiers for archive.',
          'One Zone-IA saves money but loses AZ resilience — only for reproducible data.',
          'DE workflow: hot landing/curated on Standard → lifecycle to IA → Glacier for aging raw and compliance archive.',
          'Use lifecycle automation; revisit classes when query patterns or retention policies change.',
        ]}
      />
    </LessonArticle>
  )
}
