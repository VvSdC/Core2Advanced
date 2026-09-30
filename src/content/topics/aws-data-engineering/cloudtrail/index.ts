import type { SubTopic } from '../../../types'
import { AuditingDataAccess } from './lessons/auditing-data-access'
import { CloudtrailForDataEngineering } from './lessons/cloudtrail-for-data-engineering'
import { CloudtrailLake } from './lessons/cloudtrail-lake'
import { CloudtrailVsConfigVsCloudwatch } from './lessons/cloudtrail-vs-config-vs-cloudwatch'
import { CloudwatchLogsMetricFilters } from './lessons/cloudwatch-logs-metric-filters'
import { EventHistoryAndTrails } from './lessons/event-history-and-trails'
import { EventbridgeRealTimeAlerts } from './lessons/eventbridge-real-time-alerts'
import { ForensicsAndIncidentResponse } from './lessons/forensics-and-incident-response'
import { GettingStartedWithCloudtrail } from './lessons/getting-started-with-cloudtrail'
import { InsightsEvents } from './lessons/insights-events'
import { LogFileIntegrityAndEncryption } from './lessons/log-file-integrity-and-encryption'
import { ManagementVsDataEvents } from './lessons/management-vs-data-events'
import { OrganizationAndMultiRegionTrails } from './lessons/organization-and-multi-region-trails'
import { PuttingItTogetherCloudtrail } from './lessons/putting-it-together-cloudtrail'
import { PuttingItTogetherCloudtrailBeginner } from './lessons/putting-it-together-cloudtrail-beginner'
import { QueryingCloudtrailWithAthena } from './lessons/querying-cloudtrail-with-athena'
import { ReadingACloudtrailEvent } from './lessons/reading-a-cloudtrail-event'
import { WhatIsCloudtrail } from './lessons/what-is-cloudtrail'

export const cloudTrailSubTopic: SubTopic = {
  id: 'cloudtrail',
  title: 'CloudTrail',
  description:
    'API audit trails for security, compliance, and change forensics — trails, data events, Athena queries, CloudTrail Lake, and alerts.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-cloudtrail',
          title: 'Getting Started with CloudTrail',
          description: 'Why CloudTrail after KMS — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithCloudtrail,
        },
        {
          id: 'what-is-cloudtrail',
          title: 'What Is CloudTrail?',
          description: 'The record of who did what, when, and from where in your account.',
          readTime: '10 min',
          component: WhatIsCloudtrail,
        },
        {
          id: 'event-history-and-trails',
          title: 'Event History & Trails',
          description: 'The free 90-day view vs trails that deliver logs to S3.',
          readTime: '11 min',
          component: EventHistoryAndTrails,
        },
        {
          id: 'management-vs-data-events',
          title: 'Management vs Data Events',
          description: 'Control-plane changes vs object-level reads and writes — and their cost.',
          readTime: '11 min',
          component: ManagementVsDataEvents,
        },
        {
          id: 'reading-a-cloudtrail-event',
          title: 'Reading a CloudTrail Event',
          description: 'userIdentity, eventName, sourceIPAddress, errorCode — field by field.',
          readTime: '12 min',
          component: ReadingACloudtrailEvent,
        },
        {
          id: 'cloudtrail-for-data-engineering',
          title: 'CloudTrail for Data Engineering',
          description: 'Who deleted the table, changed the bucket policy, or read the PII.',
          readTime: '11 min',
          component: CloudtrailForDataEngineering,
        },
        {
          id: 'putting-it-together-cloudtrail-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm audit basics before org trails, Athena, and CloudTrail Lake.',
          readTime: '9 min',
          component: PuttingItTogetherCloudtrailBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'organization-and-multi-region-trails',
          title: 'Organization & Multi-Region Trails',
          description: 'One trail for every account and Region, delivered to a log archive.',
          readTime: '12 min',
          component: OrganizationAndMultiRegionTrails,
        },
        {
          id: 'log-file-integrity-and-encryption',
          title: 'Log Integrity & Encryption',
          description: 'Digest files, SSE-KMS, Object Lock, and tamper-resistant log buckets.',
          readTime: '11 min',
          component: LogFileIntegrityAndEncryption,
        },
        {
          id: 'querying-cloudtrail-with-athena',
          title: 'Querying CloudTrail with Athena',
          description: 'Partition-projected tables and the SQL questions auditors actually ask.',
          readTime: '12 min',
          component: QueryingCloudtrailWithAthena,
        },
        {
          id: 'cloudtrail-lake',
          title: 'CloudTrail Lake',
          description: 'Managed event data stores with SQL — when it beats DIY Athena.',
          readTime: '11 min',
          component: CloudtrailLake,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'eventbridge-real-time-alerts',
          title: 'EventBridge Real-Time Alerts',
          description: 'React to risky API calls in seconds — rules, SNS, and auto-remediation.',
          readTime: '12 min',
          component: EventbridgeRealTimeAlerts,
        },
        {
          id: 'cloudwatch-logs-metric-filters',
          title: 'CloudWatch Logs & Metric Filters',
          description: 'Stream trails to Logs, count patterns, and alarm on them.',
          readTime: '11 min',
          component: CloudwatchLogsMetricFilters,
        },
        {
          id: 'insights-events',
          title: 'Insights Events',
          description: 'Detect unusual API call and error rates automatically.',
          readTime: '10 min',
          component: InsightsEvents,
        },
        {
          id: 'auditing-data-access',
          title: 'Auditing Data Access',
          description: 'S3 data events, Glue Catalog, Lake Formation, Athena, and Redshift audit trails.',
          readTime: '12 min',
          component: AuditingDataAccess,
        },
        {
          id: 'forensics-and-incident-response',
          title: 'Forensics & Incident Response',
          description: 'Reconstruct an incident timeline from CloudTrail step by step.',
          readTime: '12 min',
          component: ForensicsAndIncidentResponse,
        },
        {
          id: 'cloudtrail-vs-config-vs-cloudwatch',
          title: 'CloudTrail vs Config vs CloudWatch',
          description: 'API history, resource state, and runtime metrics — three different questions.',
          readTime: '11 min',
          component: CloudtrailVsConfigVsCloudwatch,
        },
        {
          id: 'putting-it-together-cloudtrail',
          title: 'Putting It All Together',
          description: 'CloudTrail checkpoint, interview quick checks, and what’s next (Systems Manager).',
          readTime: '10 min',
          component: PuttingItTogetherCloudtrail,
        },
      ],
    },
  ],
}
