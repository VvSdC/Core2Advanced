import type { SubTopic } from '../../../types'
import { AlarmsBasics } from './lessons/alarms-basics'
import { AlarmsDeepDive } from './lessons/alarms-deep-dive'
import { AwsMetricsNamespaces } from './lessons/aws-metrics-namespaces'
import { CloudwatchAgent } from './lessons/cloudwatch-agent'
import { CloudwatchIntegrations } from './lessons/cloudwatch-integrations'
import { CustomMetrics } from './lessons/custom-metrics'
import { DashboardsBasics } from './lessons/dashboards-basics'
import { EtlPipelineMonitoring } from './lessons/etl-pipeline-monitoring'
import { EventbridgeVsCloudwatchEvents } from './lessons/eventbridge-vs-cloudwatch-events'
import { GettingStartedWithCloudwatch } from './lessons/getting-started-with-cloudwatch'
import { LogsGroupsStreams } from './lessons/logs-groups-streams'
import { LogsInsights } from './lessons/logs-insights'
import { MetricFiltersCompositeAnomaly } from './lessons/metric-filters-composite-anomaly'
import { MetricsBasics } from './lessons/metrics-basics'
import { PuttingItTogetherCloudwatch } from './lessons/putting-it-together-cloudwatch'
import { PuttingItTogetherCloudwatchBeginner } from './lessons/putting-it-together-cloudwatch-beginner'
import { TroubleshootingFailedPipelines } from './lessons/troubleshooting-failed-pipelines'
import { WhatIsCloudwatch } from './lessons/what-is-cloudwatch'

export const cloudWatchSubTopic: SubTopic = {
  id: 'cloudwatch',
  title: 'CloudWatch',
  description:
    'Metrics, logs, alarms, and dashboards — observe Lambda, Glue, and end-to-end ETL health.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-cloudwatch',
          title: 'Getting Started with CloudWatch',
          description: 'Why monitoring comes after Lambda — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithCloudwatch,
        },
        {
          id: 'what-is-cloudwatch',
          title: 'What Is CloudWatch?',
          description: 'Metrics, logs, alarms, and dashboards as one observability toolkit.',
          readTime: '10 min',
          component: WhatIsCloudwatch,
        },
        {
          id: 'metrics-basics',
          title: 'Metrics Basics',
          description: 'Invocations, errors, duration — the numbers services emit.',
          readTime: '11 min',
          component: MetricsBasics,
        },
        {
          id: 'logs-groups-streams',
          title: 'Log Groups & Streams',
          description: 'Where Lambda logs land, retention, and how streams work.',
          readTime: '11 min',
          component: LogsGroupsStreams,
        },
        {
          id: 'alarms-basics',
          title: 'Alarms Basics',
          description: 'Thresholds and OK / ALARM / INSUFFICIENT_DATA at a glance.',
          readTime: '10 min',
          component: AlarmsBasics,
        },
        {
          id: 'dashboards-basics',
          title: 'Dashboards Basics',
          description: 'Pipeline health boards for DE teams.',
          readTime: '10 min',
          component: DashboardsBasics,
        },
        {
          id: 'putting-it-together-cloudwatch-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm the observability basics before Insights and custom metrics.',
          readTime: '9 min',
          component: PuttingItTogetherCloudwatchBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'logs-insights',
          title: 'CloudWatch Logs Insights',
          description: 'Query logs to find errors and slow invocations fast.',
          readTime: '12 min',
          component: LogsInsights,
        },
        {
          id: 'aws-metrics-namespaces',
          title: 'AWS Metrics & Namespaces',
          description: 'Common DE namespaces and how dimensions slice metrics.',
          readTime: '11 min',
          component: AwsMetricsNamespaces,
        },
        {
          id: 'custom-metrics',
          title: 'Custom Metrics',
          description: 'Publish your own job counters with namespace and dimensions.',
          readTime: '12 min',
          component: CustomMetrics,
        },
        {
          id: 'alarms-deep-dive',
          title: 'Alarms Deep Dive',
          description: 'Evaluation periods, datapoints to alarm, and missing data.',
          readTime: '12 min',
          component: AlarmsDeepDive,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'cloudwatch-agent',
          title: 'CloudWatch Agent',
          description: 'OS metrics and logs from EC2 for self-managed ETL hosts.',
          readTime: '11 min',
          component: CloudwatchAgent,
        },
        {
          id: 'metric-filters-composite-anomaly',
          title: 'Metric Filters, Composite & Anomaly',
          description: 'Turn log patterns into metrics; combine alarms; detect anomalies.',
          readTime: '13 min',
          component: MetricFiltersCompositeAnomaly,
        },
        {
          id: 'eventbridge-vs-cloudwatch-events',
          title: 'EventBridge vs CloudWatch Events',
          description: 'Modern naming and how scheduling/routing still fit monitoring.',
          readTime: '10 min',
          component: EventbridgeVsCloudwatchEvents,
        },
        {
          id: 'cloudwatch-integrations',
          title: 'CloudWatch Integrations',
          description: 'Wire alarms to SNS, Lambda, and EventBridge for response.',
          readTime: '11 min',
          component: CloudwatchIntegrations,
        },
        {
          id: 'etl-pipeline-monitoring',
          title: 'ETL Pipeline Monitoring',
          description: 'What to watch: lag, failures, duration, DLQ, freshness.',
          readTime: '13 min',
          component: EtlPipelineMonitoring,
        },
        {
          id: 'troubleshooting-failed-pipelines',
          title: 'Troubleshooting Failed Pipelines',
          description: 'Alarm → logs → Insights → root cause runbook for DE.',
          readTime: '13 min',
          component: TroubleshootingFailedPipelines,
        },
        {
          id: 'putting-it-together-cloudwatch',
          title: 'Putting It All Together',
          description: 'CloudWatch checkpoint, interview quick checks, and what’s next (SNS).',
          readTime: '10 min',
          component: PuttingItTogetherCloudwatch,
        },
      ],
    },
  ],
}
