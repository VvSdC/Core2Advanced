import type { SubTopic } from '../../../types'
import { AuditingKmsWithCloudtrail } from './lessons/auditing-kms-with-cloudtrail'
import { CrossAccountKms } from './lessons/cross-account-kms'
import { EncryptingGlueAthenaRedshift } from './lessons/encrypting-glue-athena-redshift'
import { EncryptionBasics } from './lessons/encryption-basics'
import { EnvelopeEncryption } from './lessons/envelope-encryption'
import { GettingStartedWithKms } from './lessons/getting-started-with-kms'
import { GrantsAndEncryptionContext } from './lessons/grants-and-encryption-context'
import { KeyPolicies } from './lessons/key-policies'
import { KeyRotationAndLifecycle } from './lessons/key-rotation-and-lifecycle'
import { KeyTypes } from './lessons/key-types'
import { KmsCostsAndQuotas } from './lessons/kms-costs-and-quotas'
import { KmsForDataEngineering } from './lessons/kms-for-data-engineering'
import { KmsInPipelines } from './lessons/kms-in-pipelines'
import { MultiRegionKeysAndByok } from './lessons/multi-region-keys-and-byok'
import { PuttingItTogetherKms } from './lessons/putting-it-together-kms'
import { PuttingItTogetherKmsBeginner } from './lessons/putting-it-together-kms-beginner'
import { S3EncryptionSseKms } from './lessons/s3-encryption-sse-kms'
import { WhatIsKms } from './lessons/what-is-kms'

export const kmsSubTopic: SubTopic = {
  id: 'kms',
  title: 'AWS KMS',
  description:
    'Encryption keys for the lake and warehouse — key types, envelope encryption, key policies, SSE-KMS, cross-account access, and cost.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-kms',
          title: 'Getting Started with KMS',
          description: 'Why KMS after Secrets Manager — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithKms,
        },
        {
          id: 'encryption-basics',
          title: 'Encryption Basics',
          description: 'At rest vs in transit, symmetric vs asymmetric — the plain-English version.',
          readTime: '10 min',
          component: EncryptionBasics,
        },
        {
          id: 'what-is-kms',
          title: 'What Is KMS?',
          description: 'Managed keys that never leave AWS — Encrypt, Decrypt, and GenerateDataKey.',
          readTime: '11 min',
          component: WhatIsKms,
        },
        {
          id: 'key-types',
          title: 'Key Types',
          description: 'AWS owned, AWS managed, and customer managed keys — who controls what.',
          readTime: '11 min',
          component: KeyTypes,
        },
        {
          id: 'envelope-encryption',
          title: 'Envelope Encryption',
          description: 'Data keys encrypt the data, KMS keys encrypt the data keys.',
          readTime: '12 min',
          component: EnvelopeEncryption,
        },
        {
          id: 'kms-for-data-engineering',
          title: 'KMS for Data Engineering',
          description: 'Which lake, catalog, queue, and warehouse resources get which key.',
          readTime: '11 min',
          component: KmsForDataEngineering,
        },
        {
          id: 'putting-it-together-kms-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm encryption basics before key policies, grants, and SSE-KMS.',
          readTime: '9 min',
          component: PuttingItTogetherKmsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'key-policies',
          title: 'Key Policies',
          description: 'The resource policy every key has — and how it combines with IAM.',
          readTime: '12 min',
          component: KeyPolicies,
        },
        {
          id: 'grants-and-encryption-context',
          title: 'Grants & Encryption Context',
          description: 'Temporary delegated access and binding ciphertext to its purpose.',
          readTime: '11 min',
          component: GrantsAndEncryptionContext,
        },
        {
          id: 'key-rotation-and-lifecycle',
          title: 'Key Rotation & Lifecycle',
          description: 'Automatic rotation, aliases, disabling, and the deletion waiting period.',
          readTime: '11 min',
          component: KeyRotationAndLifecycle,
        },
        {
          id: 's3-encryption-sse-kms',
          title: 'S3 Encryption with SSE-KMS',
          description: 'SSE-S3 vs SSE-KMS vs DSSE-KMS, default encryption, and S3 Bucket Keys.',
          readTime: '12 min',
          component: S3EncryptionSseKms,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'encrypting-glue-athena-redshift',
          title: 'Encrypting Glue, Athena & Redshift',
          description: 'Security configurations, query result encryption, and warehouse keys.',
          readTime: '13 min',
          component: EncryptingGlueAthenaRedshift,
        },
        {
          id: 'cross-account-kms',
          title: 'Cross-Account KMS',
          description: 'Sharing encrypted lake data between producer and consumer accounts.',
          readTime: '12 min',
          component: CrossAccountKms,
        },
        {
          id: 'kms-costs-and-quotas',
          title: 'KMS Costs & Quotas',
          description: 'Per-request pricing, throttling at scale, and how Bucket Keys save both.',
          readTime: '11 min',
          component: KmsCostsAndQuotas,
        },
        {
          id: 'multi-region-keys-and-byok',
          title: 'Multi-Region Keys & BYOK',
          description: 'Replicated keys for DR, imported key material, and external key stores.',
          readTime: '12 min',
          component: MultiRegionKeysAndByok,
        },
        {
          id: 'auditing-kms-with-cloudtrail',
          title: 'Auditing KMS with CloudTrail',
          description: 'Who decrypted what — reading KMS events and alerting on risky changes.',
          readTime: '11 min',
          component: AuditingKmsWithCloudtrail,
        },
        {
          id: 'kms-in-pipelines',
          title: 'KMS in Pipelines',
          description: 'Patterns and anti-patterns — key-per-domain, AccessDenied debugging, and migrations.',
          readTime: '12 min',
          component: KmsInPipelines,
        },
        {
          id: 'putting-it-together-kms',
          title: 'Putting It All Together',
          description: 'KMS checkpoint, interview quick checks, and what’s next (CloudTrail).',
          readTime: '10 min',
          component: PuttingItTogetherKms,
        },
      ],
    },
  ],
}
