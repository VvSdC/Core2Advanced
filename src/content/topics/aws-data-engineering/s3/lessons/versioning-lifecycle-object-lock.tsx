import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VersioningLifecycleObjectLock() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Objects change — your lake needs rules for time">
        Pipelines overwrite curated partitions, analysts re-upload files, and compliance teams demand
        immutability. S3 <strong className="text-white">versioning</strong>,{' '}
        <strong className="text-white">lifecycle rules</strong>, and{' '}
        <strong className="text-white">Object Lock</strong> together govern how long data lives, when it
        cheapens, and whether it can be deleted — core DE platform hygiene beyond upload-and-forget.
      </Callout>

      <Definition term="S3 versioning">
        <p>
          With <strong className="text-white">versioning enabled</strong>, every overwrite or delete creates
          a new version (or a delete marker) instead of destroying the prior bytes. You can recover from
          bad ETL writes, accidental <span className="font-mono text-sm">aws s3 rm</span>, and audit who
          changed what via version IDs in CloudTrail and S3 access logs.
        </p>
      </Definition>

      <LessonSection title="Versioning for data lakes">
        <ContentStep number={1} title="Enable on production lake buckets">
          <p className="text-slate-300">
            Turn versioning on for raw, curated, and audit buckets. Ingest Lambdas that PUT the same key
            nightly still append versions — pair with lifecycle to expire noncurrent versions after N days
            so storage does not grow forever.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Delete markers and recovery">
          <p className="text-slate-300">
            A delete without version ID adds a <strong className="text-white">delete marker</strong> — the
            object appears gone but prior versions remain. Restore by removing the marker or promoting an
            older versionId. Critical for incident response when someone truncates a prefix.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Replication and MFA delete">
          <p className="text-slate-300">
            Cross-region replication requires versioning on source (and often destination). MFA Delete
            (optional) adds friction to permanent deletes — consider for regulated buckets; most DE teams
            rely on Object Lock + IAM Deny instead.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Athena and Glue read the <em>current</em> version by default. Version-aware tools must pass{' '}
          <span className="font-mono text-sm">versionId</span> — rare in SQL paths but important for forensic restores.
        </Callout>
      </LessonSection>

      <LessonSection title="Lifecycle rules — transition and expire">
        <Definition term="S3 lifecycle configuration">
          <p>
            <strong className="text-white">Lifecycle rules</strong> automate transitions between storage
            classes and expiration of objects or noncurrent versions. Filter by prefix, tags, or object
            size — e.g. move <span className="font-mono text-sm">raw/year=2022/</span> to Glacier after
            180 days and delete noncurrent versions after 30 days.
          </p>
        </Definition>
        <ContentStep number={1} title="Transition actions">
          <p className="text-slate-300">
            Move current objects to Standard-IA, Glacier, or Deep Archive after a day count. DE pattern:
            raw → IA at 90d → Glacier at 365d; keep curated Standard longer or tier by{' '}
            <span className="font-mono text-sm">dataset=tier2</span> tags.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Expiration actions">
          <p className="text-slate-300">
            Permanently delete objects or <strong className="text-white">noncurrent versions</strong> after
            retention windows. Expire incomplete multipart uploads after 7 days — saves hidden cost from
            failed large uploads.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Abort incomplete multipart">
          <p className="text-slate-300">
            Spark and large COPY jobs that fail mid-upload leave parts billed as storage. A lifecycle rule
            aborting incomplete uploads after 7 days is a standard DE bucket baseline.
          </p>
        </ContentStep>
        <Flowchart
          title="Lifecycle flow — raw prefix example"
          chart={`flowchart LR
  UP[PUT to raw/events/date=2026-01-01/]
  V[Versioning ON — version v1 v2]
  D30{Age greater than 30 days?}
  IA[Transition to Standard-IA]
  D365{Age greater than 365 days?}
  GL[Transition to Glacier Flexible]
  NC{Noncurrent version age greater than 30 days?}
  EXP[Expire noncurrent versions]
  UP --> V
  V --> D30
  D30 -->|Yes| IA
  IA --> D365
  D365 -->|Yes| GL
  V --> NC
  NC -->|Yes| EXP`}
        />
      </LessonSection>

      <LessonSection title="Object Lock and retention overview">
        <Definition term="S3 Object Lock">
          <p>
            <strong className="text-white">Object Lock</strong> enforces write-once-read-many (WORM) retention
            on buckets with versioning enabled at creation. Modes:{' '}
            <strong className="text-white">Governance</strong> (privileged users can override with special
            permission) and <strong className="text-white">Compliance</strong> (no one, including root, can
            shorten retention). Use for regulatory archives, financial records, and tamper-evident audit trails.
          </p>
        </Definition>
        <ContentStep number={1} title="Retention period vs legal hold">
          <p className="text-slate-300">
            <strong className="text-white">Retention period</strong> locks objects for a fixed duration from
            upload. <strong className="text-white">Legal hold</strong> blocks deletion until explicitly
            removed — independent of retention clock. DE teams ingest compliance streams into Object Lock
            buckets with multi-year retention.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Interaction with lifecycle">
          <p className="text-slate-300">
            Lifecycle cannot delete or shorten retention on locked objects. Plan transitions carefully —
            you can move storage class but expiration respects lock. Document which prefixes are WORM vs
            normal lifecycle-managed zones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When DE enables Object Lock">
          <p className="text-slate-300">
            Healthcare, finance, and public-sector lakes storing immutable audit logs. Not needed on every
            bronze scratch bucket — operational overhead and cost. Pair with replication to a lock-enabled
            DR bucket for geographic resilience.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Versioning + lifecycle without Object Lock protects against accidents; Object Lock protects against
          malicious or privileged deletion — choose based on threat model and regulation, not habit.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Enable versioning on production lake buckets — recover from bad writes and deletes via version IDs and delete marker removal.',
          'Lifecycle automates transition (IA, Glacier) and expiration; always abort incomplete multipart uploads after 7 days.',
          'Expire noncurrent versions to control version storage growth — raw buckets especially.',
          'Object Lock (Governance vs Compliance) provides WORM retention and legal hold for regulated datasets.',
          'Lifecycle and Object Lock interact — locked objects cannot be expired early; design prefix separation.',
        ]}
      />
    </LessonArticle>
  )
}
