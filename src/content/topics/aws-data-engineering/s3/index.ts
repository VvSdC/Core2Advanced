import type { SubTopic } from '../../../types'
import { BucketsObjectsKeys } from './lessons/buckets-objects-keys'
import { DataLakeZones } from './lessons/data-lake-zones'
import { EventsAccessPointsSelect } from './lessons/events-access-points-select'
import { FormatsPartitioningCompression } from './lessons/formats-partitioning-compression'
import { GettingStartedWithS3 } from './lessons/getting-started-with-s3'
import { InventoryBatchConsistency } from './lessons/inventory-batch-consistency'
import { MultipartAndPresigned } from './lessons/multipart-and-presigned'
import { PuttingItTogetherS3 } from './lessons/putting-it-together-s3'
import { PuttingItTogetherS3Beginner } from './lessons/putting-it-together-s3-beginner'
import { S3Boto3Basics } from './lessons/s3-boto3-basics'
import { S3CliBasics } from './lessons/s3-cli-basics'
import { S3Encryption } from './lessons/s3-encryption'
import { S3MentalModelForLakes } from './lessons/s3-mental-model-for-lakes'
import { S3Replication } from './lessons/replication'
import { S3SecurityPolicies } from './lessons/s3-security-policies'
import { S3WithGlueAthenaRedshift } from './lessons/s3-with-glue-athena-redshift'
import { StorageClasses } from './lessons/storage-classes'
import { UploadDownloadConsole } from './lessons/upload-download-console'
import { VersioningLifecycleObjectLock } from './lessons/versioning-lifecycle-object-lock'

export const s3SubTopic: SubTopic = {
  id: 's3',
  title: 'S3',
  description:
    'Object storage for data lakes — keys, tiers, security, lake zones, and Glue/Athena/Redshift patterns.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-s3',
          title: 'Getting Started with S3',
          description: 'Why S3 is the lake hub — roadmap and starter vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithS3,
        },
        {
          id: 'buckets-objects-keys',
          title: 'Buckets, Objects & Keys',
          description: 'Buckets, keys, prefixes, naming, and s3:// URL patterns.',
          readTime: '12 min',
          component: BucketsObjectsKeys,
        },
        {
          id: 'upload-download-console',
          title: 'Upload & Download (Console)',
          description: 'Move files in the Console and understand prefix listing.',
          readTime: '10 min',
          component: UploadDownloadConsole,
        },
        {
          id: 's3-cli-basics',
          title: 'S3 CLI Basics',
          description: 'aws s3 ls, cp, and sync — automate what you clicked.',
          readTime: '11 min',
          component: S3CliBasics,
        },
        {
          id: 's3-boto3-basics',
          title: 'S3 with Boto3',
          description: 'List, upload, and download from Python with IAM roles.',
          readTime: '12 min',
          component: S3Boto3Basics,
        },
        {
          id: 's3-mental-model-for-lakes',
          title: 'S3 Mental Model for Lakes',
          description: 'Why lakes live on S3 — raw / processed / curated prefixes.',
          readTime: '11 min',
          component: S3MentalModelForLakes,
        },
        {
          id: 'putting-it-together-s3-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm the object model before storage classes and security.',
          readTime: '9 min',
          component: PuttingItTogetherS3Beginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'storage-classes',
          title: 'Storage Classes',
          description: 'Standard through Glacier — hot lakes vs cold archives.',
          readTime: '13 min',
          component: StorageClasses,
        },
        {
          id: 'versioning-lifecycle-object-lock',
          title: 'Versioning, Lifecycle & Object Lock',
          description: 'Protect history, auto-tier/expire data, and retention locks.',
          readTime: '13 min',
          component: VersioningLifecycleObjectLock,
        },
        {
          id: 'replication',
          title: 'Replication (CRR & SRR)',
          description: 'Copy objects across Regions or within a Region for DR and analytics.',
          readTime: '11 min',
          component: S3Replication,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 's3-security-policies',
          title: 'Security Policies & Block Public Access',
          description: 'IAM vs bucket policies, ACLs, and locking down lake buckets.',
          readTime: '14 min',
          component: S3SecurityPolicies,
        },
        {
          id: 's3-encryption',
          title: 'Encryption',
          description: 'SSE-S3, SSE-KMS, SSE-C, and HTTPS in transit.',
          readTime: '12 min',
          component: S3Encryption,
        },
        {
          id: 'multipart-and-presigned',
          title: 'Multipart Upload & Presigned URLs',
          description: 'Large-file uploads and time-limited share links.',
          readTime: '11 min',
          component: MultipartAndPresigned,
        },
        {
          id: 'events-access-points-select',
          title: 'Events, Access Points & S3 Select',
          description: 'Notifications, EventBridge, Access Points, and selective reads.',
          readTime: '13 min',
          component: EventsAccessPointsSelect,
        },
        {
          id: 'inventory-batch-consistency',
          title: 'Inventory, Batch & Consistency',
          description: 'Fleet reports, batch ops, and strong read-after-write basics.',
          readTime: '11 min',
          component: InventoryBatchConsistency,
        },
        {
          id: 'data-lake-zones',
          title: 'Data Lake Zones',
          description: 'Raw / processed / curated and bronze / silver / gold layouts.',
          readTime: '12 min',
          component: DataLakeZones,
        },
        {
          id: 'formats-partitioning-compression',
          title: 'Formats, Partitioning & Compression',
          description: 'CSV/JSON/Parquet, partitions, compression, and small files.',
          readTime: '14 min',
          component: FormatsPartitioningCompression,
        },
        {
          id: 's3-with-glue-athena-redshift',
          title: 'S3 with Glue, Athena & Redshift',
          description: 'Catalog, query, and Spectrum patterns on the lake.',
          readTime: '12 min',
          component: S3WithGlueAthenaRedshift,
        },
        {
          id: 'putting-it-together-s3',
          title: 'Putting It All Together',
          description: 'S3 checkpoint, interview quick checks, and what’s next (Lambda).',
          readTime: '10 min',
          component: PuttingItTogetherS3,
        },
      ],
    },
  ],
}
