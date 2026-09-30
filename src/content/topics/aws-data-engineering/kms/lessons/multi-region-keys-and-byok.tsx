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

export function MultiRegionKeysAndByok() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Advanced key options — and when you do not need them">
        By default a KMS key lives in one Region and AWS generates and protects its material. That is the right
        answer for most data engineering teams. This lesson covers the exceptions: disaster recovery across
        Regions with <strong className="text-white">multi-Region keys</strong>, compliance rules that demand you
        generate the material yourself (<strong className="text-white">BYOK</strong>), and{' '}
        <strong className="text-white">custom key stores</strong> that keep keys in hardware you control.
      </Callout>

      <Definition term="Multi-Region key">
        <p>
          A set of interoperable KMS keys in different Regions that share the same key ID and key material. The key
          ID starts with <span className="font-mono text-sm">mrk-</span>. One is the{' '}
          <strong className="text-white">primary</strong>; the others are <strong className="text-white">replicas</strong>{' '}
          created with <span className="font-mono text-sm">ReplicateKey</span>. Ciphertext produced in one Region
          can be decrypted by the related key in another Region without a cross-Region call.
        </p>
      </Definition>

      <LessonSection title="Multi-Region keys for DR">
        <ContentStep number={1} title="Same material, independent resources">
          <p className="text-slate-300">
            Each replica has its own ARN, key policy, grants, aliases, and tags — you manage them per Region. Key
            material and rotation are shared: rotation is controlled on the primary and propagates. You can promote a
            replica to primary with <span className="font-mono text-sm">UpdatePrimaryRegion</span> if the original
            Region is lost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Where they actually help">
          <p className="text-slate-300">
            They shine for client-side encryption: records encrypted by your code with the AWS Encryption SDK in
            us-east-1 and copied to us-west-2 decrypt locally there. Integrated services such as S3 treat multi-Region
            keys like single-Region keys — S3 Cross-Region Replication still decrypts and re-encrypts with the
            replica key you configure. A multi-Region key simplifies that setup but is not required for CRR.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Trade-offs">
          <p className="text-slate-300">
            Each primary and replica is billed as a separate key. Because material is shared, a compromise affects
            every Region, and security teams usually want tighter review before creating them. Use them for data that
            must be readable in more than one Region, not by default.
          </p>
        </ContentStep>
        <Example title="Create a primary and replicate it" caption="DR key for the orders lake">
{`aws kms create-key --multi-region \\
  --description "de-lake-prod multi-Region primary" --region us-east-1
# KeyId: mrk-1234abcd12ab34cd56ef1234567890ab

aws kms replicate-key \\
  --key-id arn:aws:kms:us-east-1:111122223333:key/mrk-1234abcd12ab34cd56ef1234567890ab \\
  --replica-region us-west-2

aws kms create-alias --alias-name alias/de-lake-prod-mrk \\
  --target-key-id mrk-1234abcd12ab34cd56ef1234567890ab --region us-west-2`}
        </Example>
        <Flowchart
          title="Multi-Region key in a DR design"
          chart={`flowchart LR
  P[Primary key us-east-1]
  R[Replica key us-west-2]
  APP[Ingest app encrypts records]
  S3E[(Lake bucket us-east-1)]
  S3W[(DR bucket us-west-2)]
  DR[DR readers decrypt locally]
  P -->|same key material| R
  APP --> P
  APP --> S3E
  S3E -->|replication| S3W
  S3W --> DR
  DR --> R`}
        />
      </LessonSection>

      <LessonSection title="Imported key material — BYOK">
        <ContentStep number={1} title="How it works">
          <p className="text-slate-300">
            Create a key with origin <span className="font-mono text-sm">EXTERNAL</span>, call{' '}
            <span className="font-mono text-sm">GetParametersForImport</span> for a wrapping public key and import
            token, wrap your material generated in your own HSM, then{' '}
            <span className="font-mono text-sm">ImportKeyMaterial</span>. KMS then uses it like any other key.
          </p>
        </ContentStep>
        <ContentStep number={2} title="You own durability and expiration">
          <p className="text-slate-300">
            You can set an expiration date, and you can delete imported material immediately with{' '}
            <span className="font-mono text-sm">DeleteImportedKeyMaterial</span> — no waiting period. That control is
            the point for some regulators, but it also means you must keep a secure copy: if the material expires or
            is deleted and you cannot re-import the same bytes, the data is gone. Automatic rotation is not available
            for imported material; rotation support for imported keys has been expanding, so check current docs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Custom key stores and choosing wisely">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Option</th>
                <th className="px-4 py-3">Where key material lives</th>
                <th className="px-4 py-3">Operational cost</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Standard CMK', 'KMS-managed HSMs, AWS generates material', 'Lowest — the default for DE'],
                ['Imported material', 'KMS HSMs, you generate and back up material', 'Medium — you manage copies and expiry'],
                ['CloudHSM key store', 'Your AWS CloudHSM cluster in your VPC', 'High — cluster sizing, HA, patching'],
                ['External key store', 'Your key manager outside AWS via an XKS proxy', 'Highest — latency and availability are yours'],
              ].map(([opt, where, cost]) => (
                <tr key={opt} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{opt}</td>
                  <td className="px-4 py-3">{where}</td>
                  <td className="px-4 py-3">{cost}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <ContentStep number={1} title="Custom key store risks for pipelines">
          <p className="text-slate-300">
            With an external key store, every Decrypt for a Glue job leaves AWS. If the proxy or external HSM is slow
            or down, the lake is unreadable. Custom key stores also have their own request quotas, lower than the
            standard pool — a large Spark job can overwhelm them.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When a normal CMK is enough">
          <p className="text-slate-300">
            For most data teams, a standard customer managed key per environment and data domain — with a tight key
            policy, rotation, and CloudTrail auditing — satisfies security and compliance reviews. Reach for BYOK or
            custom key stores only when a written requirement demands it.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Ask &quot;what failure are we protecting against?&quot; before choosing. Multi-Region keys protect
          availability; BYOK and custom key stores protect control. Neither makes data more encrypted than a
          standard CMK.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-Region keys share key ID (mrk- prefix) and material across Regions; policies, grants, and aliases are per Region.',
          'They help most with client-side encrypted data moving between Regions; S3 CRR treats them like single-Region keys.',
          'BYOK imports your own material — you own backup, expiration, and immediate deletion risk.',
          'CloudHSM and external key stores give maximum control at the cost of latency, availability, and lower quotas.',
          'Most data engineering teams need only standard customer managed keys with good policies and rotation.',
        ]}
      />
    </LessonArticle>
  )
}
