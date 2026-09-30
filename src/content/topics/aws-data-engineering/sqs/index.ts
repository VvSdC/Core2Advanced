import type { SubTopic } from '../../../types'
import { DeadLetterQueuesAndRedrive } from './lessons/dead-letter-queues-and-redrive'
import { FifoOrderingAndDeduplication } from './lessons/fifo-ordering-and-deduplication'
import { GettingStartedWithSqs } from './lessons/getting-started-with-sqs'
import { IdempotentConsumers } from './lessons/idempotent-consumers'
import { LongPollingAndBatching } from './lessons/long-polling-and-batching'
import { MessageAttributesDelayRetention } from './lessons/message-attributes-delay-retention'
import { PuttingItTogetherSqs } from './lessons/putting-it-together-sqs'
import { PuttingItTogetherSqsBeginner } from './lessons/putting-it-together-sqs-beginner'
import { QueuesMessagesProducersConsumers } from './lessons/queues-messages-producers-consumers'
import { S3EventsToSqs } from './lessons/s3-events-to-sqs'
import { ScalingBackpressureMonitoring } from './lessons/scaling-backpressure-monitoring'
import { SecurityEncryptionAccess } from './lessons/security-encryption-access'
import { SendReceiveDelete } from './lessons/send-receive-delete'
import { SqsForDataEngineering } from './lessons/sqs-for-data-engineering'
import { SqsPlusLambda } from './lessons/sqs-plus-lambda'
import { SqsVsSnsEventbridgeKinesis } from './lessons/sqs-vs-sns-eventbridge-kinesis'
import { StandardVsFifoQueues } from './lessons/standard-vs-fifo-queues'
import { VisibilityTimeout } from './lessons/visibility-timeout'
import { WhatIsSqs } from './lessons/what-is-sqs'

export const sqsSubTopic: SubTopic = {
  id: 'sqs',
  title: 'Amazon SQS',
  description:
    'Queues for decoupling producers and consumers — visibility timeouts, DLQs, FIFO, Lambda batching, and buffering lake ingest.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-sqs',
          title: 'Getting Started with SQS',
          description: 'Why SQS after DynamoDB — buffering bursts, roadmap, and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithSqs,
        },
        {
          id: 'what-is-sqs',
          title: 'What Is SQS?',
          description: 'A managed message queue — pull-based work vs SNS push broadcasts.',
          readTime: '10 min',
          component: WhatIsSqs,
        },
        {
          id: 'queues-messages-producers-consumers',
          title: 'Queues, Messages, Producers & Consumers',
          description: 'The building blocks — who sends, who polls, and what a message carries.',
          readTime: '11 min',
          component: QueuesMessagesProducersConsumers,
        },
        {
          id: 'standard-vs-fifo-queues',
          title: 'Standard vs FIFO Queues',
          description: 'Throughput and at-least-once vs ordering and exactly-once processing.',
          readTime: '11 min',
          component: StandardVsFifoQueues,
        },
        {
          id: 'send-receive-delete',
          title: 'Send, Receive & Delete',
          description: 'The message lifecycle — console, CLI, and Boto3.',
          readTime: '11 min',
          component: SendReceiveDelete,
        },
        {
          id: 'sqs-for-data-engineering',
          title: 'SQS for Data Engineering',
          description: 'Ingest buffers, work queues, and smoothing Glue/Lambda load.',
          readTime: '11 min',
          component: SqsForDataEngineering,
        },
        {
          id: 'putting-it-together-sqs-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm queue basics before visibility timeouts, DLQs, and Lambda.',
          readTime: '9 min',
          component: PuttingItTogetherSqsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'visibility-timeout',
          title: 'Visibility Timeout',
          description: 'Why messages reappear — sizing the timeout to your processing time.',
          readTime: '11 min',
          component: VisibilityTimeout,
        },
        {
          id: 'long-polling-and-batching',
          title: 'Long Polling & Batching',
          description: 'Fewer empty receives, cheaper bills, and batch send/delete.',
          readTime: '11 min',
          component: LongPollingAndBatching,
        },
        {
          id: 'dead-letter-queues-and-redrive',
          title: 'Dead-Letter Queues & Redrive',
          description: 'Poison messages, maxReceiveCount, and replaying fixed work.',
          readTime: '12 min',
          component: DeadLetterQueuesAndRedrive,
        },
        {
          id: 'message-attributes-delay-retention',
          title: 'Attributes, Delay & Retention',
          description: 'Metadata, delay queues, retention windows, and message size limits.',
          readTime: '11 min',
          component: MessageAttributesDelayRetention,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'sqs-plus-lambda',
          title: 'SQS + Lambda',
          description: 'Event source mapping, batch item failures, and max concurrency.',
          readTime: '13 min',
          component: SqsPlusLambda,
        },
        {
          id: 's3-events-to-sqs',
          title: 'S3 Events → SQS',
          description: 'Buffer landing-zone notifications before ETL consumers.',
          readTime: '12 min',
          component: S3EventsToSqs,
        },
        {
          id: 'fifo-ordering-and-deduplication',
          title: 'FIFO Ordering & Deduplication',
          description: 'Message group IDs, dedup IDs, and ordered CDC-style processing.',
          readTime: '12 min',
          component: FifoOrderingAndDeduplication,
        },
        {
          id: 'idempotent-consumers',
          title: 'Idempotent Consumers',
          description: 'At-least-once delivery meets DynamoDB conditional writes.',
          readTime: '12 min',
          component: IdempotentConsumers,
        },
        {
          id: 'scaling-backpressure-monitoring',
          title: 'Scaling, Backpressure & Monitoring',
          description: 'Queue depth, age of oldest message, and protecting downstream systems.',
          readTime: '12 min',
          component: ScalingBackpressureMonitoring,
        },
        {
          id: 'security-encryption-access',
          title: 'Security, Encryption & Access',
          description: 'Queue policies, SSE-SQS vs SSE-KMS, and VPC endpoints.',
          readTime: '11 min',
          component: SecurityEncryptionAccess,
        },
        {
          id: 'sqs-vs-sns-eventbridge-kinesis',
          title: 'SQS vs SNS vs EventBridge vs Kinesis',
          description: 'Queue, topic, bus, or stream — pick the right messaging service.',
          readTime: '12 min',
          component: SqsVsSnsEventbridgeKinesis,
        },
        {
          id: 'putting-it-together-sqs',
          title: 'Putting It All Together',
          description: 'SQS checkpoint, interview quick checks, and what’s next (Step Functions).',
          readTime: '10 min',
          component: PuttingItTogetherSqs,
        },
      ],
    },
  ],
}
