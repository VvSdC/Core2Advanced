import type { SubTopic } from '../../../types'
import { BackupsSnapshotsPitr } from './lessons/backups-snapshots-pitr'
import { CrossRegionReadReplica } from './lessons/cross-region-read-replica'
import { DbInstanceEndpointPort } from './lessons/db-instance-endpoint-port'
import { EncryptionSslSecrets } from './lessons/encryption-ssl-secrets'
import { GettingStartedWithRds } from './lessons/getting-started-with-rds'
import { MultiAz } from './lessons/multi-az'
import { ParameterAndOptionGroups } from './lessons/parameter-and-option-groups'
import { PerformanceInsightsMonitoring } from './lessons/performance-insights-monitoring'
import { PuttingItTogetherRds } from './lessons/putting-it-together-rds'
import { PuttingItTogetherRdsBeginner } from './lessons/putting-it-together-rds-beginner'
import { RdsInDataPipelines } from './lessons/rds-in-data-pipelines'
import { RdsProxy } from './lessons/rds-proxy'
import { RdsVsAuroraEc2AthenaS3 } from './lessons/rds-vs-aurora-ec2-athena-s3'
import { RdsVsRedshiftDynamodb } from './lessons/rds-vs-redshift-dynamodb'
import { ReadReplicas } from './lessons/read-replicas'
import { SecurityGroupsIamAuth } from './lessons/security-groups-iam-auth'
import { StorageBasics } from './lessons/storage-basics'
import { SupportedEngines } from './lessons/supported-engines'
import { WhatIsRds } from './lessons/what-is-rds'

export const rdsSubTopic: SubTopic = {
  id: 'rds',
  title: 'RDS',
  description:
    'Managed relational databases — engines, Multi-AZ, backups, security, and RDS as a lake source.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-rds',
          title: 'Getting Started with RDS',
          description: 'Why RDS after Redshift — operational DB as a DE source.',
          readTime: '11 min',
          component: GettingStartedWithRds,
        },
        {
          id: 'what-is-rds',
          title: 'What Is RDS?',
          description: 'Managed relational databases — what AWS runs for you.',
          readTime: '10 min',
          component: WhatIsRds,
        },
        {
          id: 'supported-engines',
          title: 'Supported Engines',
          description: 'MySQL, PostgreSQL, MariaDB, Oracle, SQL Server — DE source notes.',
          readTime: '11 min',
          component: SupportedEngines,
        },
        {
          id: 'db-instance-endpoint-port',
          title: 'DB Instance, Endpoint & Port',
          description: 'How apps and ETL connect — hostname, port, and JDBC URLs.',
          readTime: '11 min',
          component: DbInstanceEndpointPort,
        },
        {
          id: 'parameter-and-option-groups',
          title: 'Parameter & Option Groups',
          description: 'Tune engine settings without rebuilding the instance.',
          readTime: '10 min',
          component: ParameterAndOptionGroups,
        },
        {
          id: 'storage-basics',
          title: 'Storage Basics',
          description: 'gp3/io storage, autoscaling, and RDS disk vs the S3 lake.',
          readTime: '10 min',
          component: StorageBasics,
        },
        {
          id: 'putting-it-together-rds-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm OLTP basics before HA, backups, and security.',
          readTime: '9 min',
          component: PuttingItTogetherRdsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'multi-az',
          title: 'Multi-AZ',
          description: 'Synchronous standby for high availability and failover.',
          readTime: '12 min',
          component: MultiAz,
        },
        {
          id: 'read-replicas',
          title: 'Read Replicas',
          description: 'Scale reads — and when DE should use a warehouse instead.',
          readTime: '12 min',
          component: ReadReplicas,
        },
        {
          id: 'backups-snapshots-pitr',
          title: 'Backups, Snapshots & PITR',
          description: 'Automated backups, manual snapshots, and point-in-time restore.',
          readTime: '12 min',
          component: BackupsSnapshotsPitr,
        },
        {
          id: 'security-groups-iam-auth',
          title: 'Security Groups & IAM Auth',
          description: 'Network allowlists and IAM database authentication.',
          readTime: '12 min',
          component: SecurityGroupsIamAuth,
        },
        {
          id: 'encryption-ssl-secrets',
          title: 'Encryption, SSL & Secrets',
          description: 'KMS at rest, TLS in transit, Secrets Manager for passwords.',
          readTime: '12 min',
          component: EncryptionSslSecrets,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'rds-proxy',
          title: 'RDS Proxy',
          description: 'Connection pooling for Lambda and bursty app traffic.',
          readTime: '11 min',
          component: RdsProxy,
        },
        {
          id: 'performance-insights-monitoring',
          title: 'Performance Insights & Monitoring',
          description: 'Find slow SQL, enhanced metrics, and maintenance windows.',
          readTime: '12 min',
          component: PerformanceInsightsMonitoring,
        },
        {
          id: 'cross-region-read-replica',
          title: 'Cross-Region Read Replica',
          description: 'DR and global read scale across Regions.',
          readTime: '11 min',
          component: CrossRegionReadReplica,
        },
        {
          id: 'rds-vs-redshift-dynamodb',
          title: 'RDS vs Redshift & DynamoDB',
          description: 'OLTP vs warehouse vs NoSQL — pick the right store.',
          readTime: '13 min',
          component: RdsVsRedshiftDynamodb,
        },
        {
          id: 'rds-vs-aurora-ec2-athena-s3',
          title: 'RDS vs Aurora, EC2, Athena & S3',
          description: 'Managed Postgres/MySQL family, self-managed, and lake roles.',
          readTime: '13 min',
          component: RdsVsAuroraEc2AthenaS3,
        },
        {
          id: 'rds-in-data-pipelines',
          title: 'RDS in Data Pipelines',
          description: 'Batch extract, CDC, and DMS paths from OLTP to the lake.',
          readTime: '13 min',
          component: RdsInDataPipelines,
        },
        {
          id: 'putting-it-together-rds',
          title: 'Putting It All Together',
          description: 'RDS checkpoint, interview quick checks, and what’s next (Glue).',
          readTime: '10 min',
          component: PuttingItTogetherRds,
        },
      ],
    },
  ],
}
