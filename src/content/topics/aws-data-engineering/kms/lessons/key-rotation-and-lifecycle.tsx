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

export function KeyRotationAndLifecycle() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Rotating a key should never mean rewriting the lake">
        Compliance says &quot;rotate encryption keys yearly.&quot; For a 400 TB lake, re-encrypting every
        Parquet file would be absurd. KMS automatic rotation swaps in new key material behind the same key ID
        and keeps the old material for decryption — nothing in{' '}
        <span className="font-mono text-sm">acme-lake-prod</span> has to change. Deletion is the opposite: one
        careless call and every object encrypted under the key becomes unreadable forever.
      </Callout>

      <Definition term="Key material rotation">
        <p>
          Replacing the cryptographic secret inside a KMS key while keeping its key ID, ARN, aliases, and policy.
          New Encrypt and GenerateDataKey calls use the newest material; Decrypt automatically picks the material
          that produced the ciphertext, because the ciphertext records which version was used. Old material is
          retained until the key itself is deleted.
        </p>
      </Definition>

      <LessonSection title="Automatic and on-demand rotation">
        <ContentStep number={1} title="Automatic rotation">
          <p className="text-slate-300">
            Supported for symmetric encryption customer managed keys with KMS-generated material. Enable it with{' '}
            <span className="font-mono text-sm">EnableKeyRotation</span> and optionally set a rotation period
            between <strong className="text-white">90 and 2,560 days</strong> — the default is 365. AWS managed
            keys rotate automatically every year and you cannot change that.
          </p>
        </ContentStep>
        <ContentStep number={2} title="On-demand rotation">
          <p className="text-slate-300">
            <span className="font-mono text-sm">RotateKeyOnDemand</span> rotates immediately — useful after a
            suspected exposure of a role that could call Decrypt — without changing the automatic schedule. There is
            a per-key cap on on-demand rotations (25 at the time of writing; check the KMS docs for the current
            limit). <span className="font-mono text-sm">ListKeyRotations</span> shows the history.
          </p>
        </ContentStep>
        <ContentStep number={3} title="What rotation does not do">
          <p className="text-slate-300">
            It does not re-encrypt existing data or data keys — old ciphertext keeps decrypting under old
            material. If a data key itself leaked, rotation does not help that ciphertext; you would need to
            re-encrypt the affected objects. Asymmetric and HMAC keys do not support automatic rotation.
          </p>
        </ContentStep>
        <Example title="Enable rotation with a custom period" caption="alias/de-lake-prod, rotate every 180 days">
{`KEY_ID=$(aws kms describe-key --key-id alias/de-lake-prod \\
  --query KeyMetadata.KeyId --output text)

aws kms enable-key-rotation --key-id $KEY_ID --rotation-period-in-days 180
aws kms get-key-rotation-status --key-id $KEY_ID
aws kms rotate-key-on-demand --key-id $KEY_ID     # immediate, schedule unchanged
aws kms list-key-rotations --key-id $KEY_ID`}
        </Example>
        <Callout variant="info">
          Pricing note: rotations add storage cost for retained material, but AWS currently caps this at the
          first two rotations — later rotations are not billed. Confirm on the KMS pricing page.
        </Callout>
      </LessonSection>

      <LessonSection title="Aliases for manual rotation">
        <ContentStep number={1} title="Point code at the alias, not the key ID">
          <p className="text-slate-300">
            Pipelines reference <span className="font-mono text-sm">alias/de-lake-prod</span>. To move to a brand
            new key — different key policy, imported material, or a key type that cannot auto-rotate — create the
            new key and run <span className="font-mono text-sm">UpdateAlias</span>. New writes use the new key
            instantly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Keep the old key enabled">
          <p className="text-slate-300">
            Existing objects still reference the old key ARN inside their metadata, not the alias. Keep the old
            key enabled until every object has been re-encrypted, for example with an S3 Batch Operations copy.
            Only then consider disabling it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key states and deletion">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">State</th>
                <th className="px-4 py-3">Can encrypt or decrypt?</th>
                <th className="px-4 py-3">Reversible?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Enabled', 'Yes', 'Normal operating state'],
                ['Disabled', 'No — calls fail with DisabledException', 'Yes, EnableKey'],
                ['PendingDeletion', 'No — calls fail during the waiting period', 'Yes, CancelKeyDeletion then EnableKey'],
                ['Deleted', 'Key and all material gone', 'Never — data is lost'],
              ].map(([state, use, reversible]) => (
                <tr key={state} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{state}</td>
                  <td className="px-4 py-3">{use}</td>
                  <td className="px-4 py-3">{reversible}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="ScheduleKeyDeletion waiting period">
          <p className="text-slate-300">
            KMS never deletes a key immediately. <span className="font-mono text-sm">ScheduleKeyDeletion</span>{' '}
            requires a waiting period of <strong className="text-white">7 to 30 days</strong>, default 30. During
            that window the key is unusable, which is your safety net: failing pipelines reveal who still depends
            on it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why deleting a key means losing the data">
          <p className="text-slate-300">
            Every data key protecting every S3 object, Redshift block, and Glue bookmark is wrapped by the KMS key.
            Once the key is deleted, those data keys can never be unwrapped — no support ticket recovers them.
            Prefer <strong className="text-white">disable</strong> for keys you think are unused, and wait months.
          </p>
        </ContentStep>
        <Flowchart
          title="Safe retirement of a KMS key"
          chart={`flowchart TB
  CHECK[Check CloudTrail usage for 90 days]
  DIS[Disable key]
  WAIT[Watch for failures]
  SCHED[ScheduleKeyDeletion 30 days]
  ALERT[EventBridge rule to SNS]
  CANCEL[CancelKeyDeletion]
  GONE[Key deleted]
  CHECK --> DIS --> WAIT
  WAIT -->|failures appear| CANCEL
  WAIT -->|quiet| SCHED
  SCHED --> ALERT
  ALERT -->|someone objects| CANCEL
  SCHED -->|window ends| GONE`}
        />
        <Callout variant="tip">
          Create an EventBridge rule on CloudTrail events for <span className="font-mono text-sm">ScheduleKeyDeletion</span>{' '}
          and <span className="font-mono text-sm">DisableKey</span> that notifies an SNS topic, and a CloudWatch
          alarm on attempted use of a key pending deletion. Restrict ScheduleKeyDeletion to a break-glass admin
          role in the key policy.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Automatic rotation for symmetric CMKs: 90–2,560 day period, default 365 — same key ID, no re-encryption needed.',
          'Old key material is retained, so existing ciphertext keeps decrypting after rotation; on-demand rotation is capped per key.',
          'Use aliases to swap to a new key (manual rotation) — keep the old key enabled until old objects are re-encrypted.',
          'States: Enabled, Disabled, PendingDeletion; ScheduleKeyDeletion waits 7–30 days (default 30).',
          'Deleting a key permanently destroys access to everything it protected — disable first and alert on deletion scheduling.',
        ]}
      />
    </LessonArticle>
  )
}
