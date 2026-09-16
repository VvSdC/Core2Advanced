import type { SubTopic } from '../../../types'
import { ArchiveReplayDlqRetry } from './lessons/archive-replay-dlq-retry'
import { CommonTargets } from './lessons/common-targets'
import { CrossAccountEventBus } from './lessons/cross-account-event-bus'
import { CustomAndPartnerBuses } from './lessons/custom-and-partner-buses'
import { DefaultBusMentalModel } from './lessons/default-bus-mental-model'
import { EventBasedRules } from './lessons/event-based-rules'
import { EventbridgeDrivenPipelines } from './lessons/eventbridge-driven-pipelines'
import { EventbridgeVsSnsSqs } from './lessons/eventbridge-vs-sns-sqs'
import { EventPatternJson } from './lessons/event-pattern-json'
import { EventPatterns } from './lessons/event-patterns'
import { EventsBusesRulesTargets } from './lessons/events-buses-rules-targets'
import { GettingStartedWithEventbridge } from './lessons/getting-started-with-eventbridge'
import { InputTransformer } from './lessons/input-transformer'
import { MonitoringEventbridge } from './lessons/monitoring-eventbridge'
import { PuttingItTogetherEventbridge } from './lessons/putting-it-together-eventbridge'
import { PuttingItTogetherEventbridgeBeginner } from './lessons/putting-it-together-eventbridge-beginner'
import { S3ObjectCreatedEvents } from './lessons/s3-object-created-events'
import { ScheduledRulesCronRate } from './lessons/scheduled-rules-cron-rate'
import { SchemaRegistryEventbridge } from './lessons/schema-registry-eventbridge'
import { WhatIsEventbridge } from './lessons/what-is-eventbridge'

export const eventBridgeSubTopic: SubTopic = {
  id: 'eventbridge',
  title: 'EventBridge',
  description:
    'Event buses, schedules, and routing — drive Glue, Lambda, and lake pipelines from events.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-eventbridge',
          title: 'Getting Started with EventBridge',
          description: 'Why EventBridge after VPC — event-driven DE pipelines.',
          readTime: '11 min',
          component: GettingStartedWithEventbridge,
        },
        {
          id: 'what-is-eventbridge',
          title: 'What Is EventBridge?',
          description: 'Serverless event router — and the CloudWatch Events rename.',
          readTime: '10 min',
          component: WhatIsEventbridge,
        },
        {
          id: 'events-buses-rules-targets',
          title: 'Events, Buses, Rules & Targets',
          description: 'The four building blocks and how they connect.',
          readTime: '11 min',
          component: EventsBusesRulesTargets,
        },
        {
          id: 'event-patterns',
          title: 'Event Patterns',
          description: 'Match only the events you care about — filter early.',
          readTime: '11 min',
          component: EventPatterns,
        },
        {
          id: 'event-based-rules',
          title: 'Event-Based Rules',
          description: 'React to AWS service events like S3 Object Created.',
          readTime: '10 min',
          component: EventBasedRules,
        },
        {
          id: 'scheduled-rules-cron-rate',
          title: 'Scheduled Rules, Cron & Rate',
          description: 'Nightly ETL and rate-based schedules for Glue and Lambda.',
          readTime: '12 min',
          component: ScheduledRulesCronRate,
        },
        {
          id: 'default-bus-mental-model',
          title: 'Default Bus Mental Model',
          description: 'Where AWS service events land — custom buses come next.',
          readTime: '10 min',
          component: DefaultBusMentalModel,
        },
        {
          id: 'putting-it-together-eventbridge-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm buses and rules before targets and production features.',
          readTime: '9 min',
          component: PuttingItTogetherEventbridgeBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'common-targets',
          title: 'Common Targets',
          description: 'Lambda, SNS, SQS, Step Functions, Glue, ECS, and Logs.',
          readTime: '12 min',
          component: CommonTargets,
        },
        {
          id: 'event-pattern-json',
          title: 'Event Pattern JSON',
          description: 'Write precise patterns for S3, Glue, and custom events.',
          readTime: '12 min',
          component: EventPatternJson,
        },
        {
          id: 's3-object-created-events',
          title: 'S3 Object Created Events',
          description: 'Land-file → process with EventBridge (vs legacy notifications).',
          readTime: '12 min',
          component: S3ObjectCreatedEvents,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'custom-and-partner-buses',
          title: 'Custom & Partner Buses',
          description: 'Isolate app and SaaS events from the default AWS bus.',
          readTime: '11 min',
          component: CustomAndPartnerBuses,
        },
        {
          id: 'cross-account-event-bus',
          title: 'Cross-Account Event Bus',
          description: 'Route events across lake and workload accounts safely.',
          readTime: '12 min',
          component: CrossAccountEventBus,
        },
        {
          id: 'archive-replay-dlq-retry',
          title: 'Archive, Replay, DLQ & Retry',
          description: 'Recover from misses and harden delivery for production.',
          readTime: '13 min',
          component: ArchiveReplayDlqRetry,
        },
        {
          id: 'input-transformer',
          title: 'Input Transformer',
          description: 'Reshape event payloads before they hit Lambda or Glue.',
          readTime: '11 min',
          component: InputTransformer,
        },
        {
          id: 'schema-registry-eventbridge',
          title: 'Schema Registry',
          description: 'Discover and version event schemas for producers and consumers.',
          readTime: '11 min',
          component: SchemaRegistryEventbridge,
        },
        {
          id: 'eventbridge-driven-pipelines',
          title: 'EventBridge-Driven Pipelines',
          description: 'Combine schedules and S3 events into end-to-end lake flows.',
          readTime: '13 min',
          component: EventbridgeDrivenPipelines,
        },
        {
          id: 'eventbridge-vs-sns-sqs',
          title: 'EventBridge vs SNS vs SQS',
          description: 'Pick the right messaging primitive for each DE use case.',
          readTime: '12 min',
          component: EventbridgeVsSnsSqs,
        },
        {
          id: 'monitoring-eventbridge',
          title: 'Monitoring EventBridge',
          description: 'Failed invocations, metrics, and DLQ alarms with CloudWatch.',
          readTime: '11 min',
          component: MonitoringEventbridge,
        },
        {
          id: 'putting-it-together-eventbridge',
          title: 'Putting It All Together',
          description: 'EventBridge checkpoint, interview quick checks, and what’s next (CloudFormation).',
          readTime: '10 min',
          component: PuttingItTogetherEventbridge,
        },
      ],
    },
  ],
}
