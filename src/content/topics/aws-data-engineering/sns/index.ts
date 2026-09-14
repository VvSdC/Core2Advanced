import type { SubTopic } from '../../../types'
import { CrossAccountEncryptionCloudwatch } from './lessons/cross-account-encryption-cloudwatch'
import { FanOutArchitecture } from './lessons/fan-out-architecture'
import { GettingStartedWithSns } from './lessons/getting-started-with-sns'
import { MessageFiltering } from './lessons/message-filtering'
import { PublishAMessage } from './lessons/publish-a-message'
import { PuttingItTogetherSns } from './lessons/putting-it-together-sns'
import { PuttingItTogetherSnsBeginner } from './lessons/putting-it-together-sns-beginner'
import { SnsForPipelineAlerts } from './lessons/sns-for-pipeline-alerts'
import { SnsInDataPipelines } from './lessons/sns-in-data-pipelines'
import { SnsToEmailAndOps } from './lessons/sns-to-email-and-ops'
import { SnsToLambda } from './lessons/sns-to-lambda'
import { SnsToSqs } from './lessons/sns-to-sqs'
import { StandardVsFifoTopics } from './lessons/standard-vs-fifo-topics'
import { SubscriptionPoliciesRetryDlq } from './lessons/subscription-policies-retry-dlq'
import { SubscriptionProtocols } from './lessons/subscription-protocols'
import { TopicsPublishersSubscribers } from './lessons/topics-publishers-subscribers'
import { WhatIsSns } from './lessons/what-is-sns'

export const snsSubTopic: SubTopic = {
  id: 'sns',
  title: 'SNS',
  description:
    'Pub/sub notifications for pipeline alerts and fan-out — topics, subscriptions, filtering, and SQS/Lambda patterns.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-sns',
          title: 'Getting Started with SNS',
          description: 'Why SNS after CloudWatch — alerts, fan-out, and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithSns,
        },
        {
          id: 'what-is-sns',
          title: 'What Is SNS?',
          description: 'Pub/sub on AWS — topics as channels vs queues (SQS teaser).',
          readTime: '10 min',
          component: WhatIsSns,
        },
        {
          id: 'topics-publishers-subscribers',
          title: 'Topics, Publishers & Subscribers',
          description: 'The five building blocks — who publishes, who listens, what a message is.',
          readTime: '11 min',
          component: TopicsPublishersSubscribers,
        },
        {
          id: 'subscription-protocols',
          title: 'Subscription Protocols',
          description: 'Email, SMS, Lambda, SQS, and HTTP — pick the right listener.',
          readTime: '11 min',
          component: SubscriptionProtocols,
        },
        {
          id: 'publish-a-message',
          title: 'Publish a Message',
          description: 'Console, CLI, and Boto3 — send an event into a topic.',
          readTime: '10 min',
          component: PublishAMessage,
        },
        {
          id: 'sns-for-pipeline-alerts',
          title: 'SNS for Pipeline Alerts',
          description: 'CloudWatch Alarm → SNS → on-call email or chat.',
          readTime: '11 min',
          component: SnsForPipelineAlerts,
        },
        {
          id: 'putting-it-together-sns-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm pub/sub basics before FIFO, filters, and fan-out.',
          readTime: '9 min',
          component: PuttingItTogetherSnsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'standard-vs-fifo-topics',
          title: 'Standard vs FIFO Topics',
          description: 'Throughput vs ordering and deduplication — when DE picks which.',
          readTime: '11 min',
          component: StandardVsFifoTopics,
        },
        {
          id: 'message-filtering',
          title: 'Message Filtering',
          description: 'Subscription filter policies — route by attributes, not by many topics.',
          readTime: '12 min',
          component: MessageFiltering,
        },
        {
          id: 'subscription-policies-retry-dlq',
          title: 'Retry & Dead Letter Queues',
          description: 'Delivery retries and DLQs when a subscriber keeps failing.',
          readTime: '11 min',
          component: SubscriptionPoliciesRetryDlq,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'sns-to-sqs',
          title: 'SNS → SQS',
          description: 'Buffer work with queues after a broadcast.',
          readTime: '11 min',
          component: SnsToSqs,
        },
        {
          id: 'sns-to-lambda',
          title: 'SNS → Lambda',
          description: 'Invoke functions from topics — with idempotency in mind.',
          readTime: '10 min',
          component: SnsToLambda,
        },
        {
          id: 'sns-to-email-and-ops',
          title: 'SNS → Email & Ops',
          description: 'Human alerts, subscription confirmation, and on-call hygiene.',
          readTime: '10 min',
          component: SnsToEmailAndOps,
        },
        {
          id: 'fan-out-architecture',
          title: 'Fan-Out Architecture',
          description: 'One event, many consumers — classic SNS → SQS fan-out for lakes.',
          readTime: '13 min',
          component: FanOutArchitecture,
        },
        {
          id: 'cross-account-encryption-cloudwatch',
          title: 'Cross-Account, Encryption & CloudWatch',
          description: 'Share topics safely, encrypt with KMS, and watch delivery metrics.',
          readTime: '12 min',
          component: CrossAccountEncryptionCloudwatch,
        },
        {
          id: 'sns-in-data-pipelines',
          title: 'SNS in Data Pipelines',
          description: 'Alerts vs work distribution — patterns and anti-patterns.',
          readTime: '12 min',
          component: SnsInDataPipelines,
        },
        {
          id: 'putting-it-together-sns',
          title: 'Putting It All Together',
          description: 'SNS checkpoint, interview quick checks, and what’s next (Athena).',
          readTime: '10 min',
          component: PuttingItTogetherSns,
        },
      ],
    },
  ],
}
