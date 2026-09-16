import type { SubTopic } from '../../../types'
import { CapacityModes } from './lessons/capacity-modes'
import { CapacityPlanningHotPartitions } from './lessons/capacity-planning-hot-partitions'
import { ConditionalWrites } from './lessons/conditional-writes'
import { DynamodbForDataEngineering } from './lessons/dynamodb-for-data-engineering'
import { DynamodbInPipelines } from './lessons/dynamodb-in-pipelines'
import { DynamodbVsRds } from './lessons/dynamodb-vs-rds'
import { DynamodbVsRedshift } from './lessons/dynamodb-vs-redshift'
import { GettingStartedWithDynamodb } from './lessons/getting-started-with-dynamodb'
import { GsiAndLsi } from './lessons/gsi-and-lsi'
import { PartitionAndSortKeys } from './lessons/partition-and-sort-keys'
import { PuttingItTogetherDynamodb } from './lessons/putting-it-together-dynamodb'
import { PuttingItTogetherDynamodbBeginner } from './lessons/putting-it-together-dynamodb-beginner'
import { QueryVsScan } from './lessons/query-vs-scan'
import { SingleTableDesignOverview } from './lessons/single-table-design-overview'
import { StreamsAndTtl } from './lessons/streams-and-ttl'
import { StreamsPlusLambda } from './lessons/streams-plus-lambda'
import { TablesItemsAttributes } from './lessons/tables-items-attributes'
import { WhatIsNosqlDynamodb } from './lessons/what-is-nosql-dynamodb'

export const dynamoDbSubTopic: SubTopic = {
  id: 'dynamodb',
  title: 'DynamoDB',
  description:
    'Managed NoSQL — keys, indexes, streams, and when DynamoDB fits data engineering (not warehouses).',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-dynamodb',
          title: 'Getting Started with DynamoDB',
          description: 'Why DynamoDB after CloudFormation — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithDynamodb,
        },
        {
          id: 'what-is-nosql-dynamodb',
          title: 'What Is NoSQL & DynamoDB?',
          description: 'Key-value / document store vs relational — the big idea.',
          readTime: '10 min',
          component: WhatIsNosqlDynamodb,
        },
        {
          id: 'tables-items-attributes',
          title: 'Tables, Items & Attributes',
          description: 'JSON-like items — how data is stored and named.',
          readTime: '10 min',
          component: TablesItemsAttributes,
        },
        {
          id: 'partition-and-sort-keys',
          title: 'Partition & Sort Keys',
          description: 'Access patterns first — design keys for how you read.',
          readTime: '12 min',
          component: PartitionAndSortKeys,
        },
        {
          id: 'capacity-modes',
          title: 'Capacity Modes',
          description: 'On-Demand vs Provisioned — pick for spiky or steady work.',
          readTime: '11 min',
          component: CapacityModes,
        },
        {
          id: 'dynamodb-for-data-engineering',
          title: 'DynamoDB for Data Engineering',
          description: 'State, idempotency, config — not analytics warehouses.',
          readTime: '11 min',
          component: DynamodbForDataEngineering,
        },
        {
          id: 'putting-it-together-dynamodb-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm NoSQL basics before indexes, Query, and Streams.',
          readTime: '9 min',
          component: PuttingItTogetherDynamodbBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'gsi-and-lsi',
          title: 'GSI & LSI',
          description: 'Secondary indexes for alternate access patterns.',
          readTime: '12 min',
          component: GsiAndLsi,
        },
        {
          id: 'query-vs-scan',
          title: 'Query vs Scan',
          description: 'Query is efficient; Scan reads the table — use carefully.',
          readTime: '11 min',
          component: QueryVsScan,
        },
        {
          id: 'conditional-writes',
          title: 'Conditional Writes',
          description: 'Safe updates and idempotent pipeline writes.',
          readTime: '11 min',
          component: ConditionalWrites,
        },
        {
          id: 'streams-and-ttl',
          title: 'Streams & TTL',
          description: 'Change capture and automatic item expiry.',
          readTime: '11 min',
          component: StreamsAndTtl,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'streams-plus-lambda',
          title: 'Streams + Lambda',
          description: 'CDC-style pipelines from DynamoDB into the lake.',
          readTime: '12 min',
          component: StreamsPlusLambda,
        },
        {
          id: 'capacity-planning-hot-partitions',
          title: 'Capacity Planning & Hot Partitions',
          description: 'Avoid throttling — distribute keys and size capacity wisely.',
          readTime: '12 min',
          component: CapacityPlanningHotPartitions,
        },
        {
          id: 'single-table-design-overview',
          title: 'Single-Table Design Overview',
          description: 'Conceptual overview of modeling many entities in one table.',
          readTime: '12 min',
          component: SingleTableDesignOverview,
        },
        {
          id: 'dynamodb-vs-rds',
          title: 'DynamoDB vs RDS',
          description: 'NoSQL vs relational OLTP — pick for the access pattern.',
          readTime: '11 min',
          component: DynamodbVsRds,
        },
        {
          id: 'dynamodb-vs-redshift',
          title: 'DynamoDB vs Redshift',
          description: 'Operational store vs analytics warehouse — different jobs.',
          readTime: '10 min',
          component: DynamodbVsRedshift,
        },
        {
          id: 'dynamodb-in-pipelines',
          title: 'DynamoDB in Pipelines',
          description: 'State store, control plane, and CDC patterns for DE.',
          readTime: '12 min',
          component: DynamodbInPipelines,
        },
        {
          id: 'putting-it-together-dynamodb',
          title: 'Putting It All Together',
          description: 'DynamoDB checkpoint, interview quick checks, and what’s next (SQS).',
          readTime: '10 min',
          component: PuttingItTogetherDynamodb,
        },
      ],
    },
  ],
}
