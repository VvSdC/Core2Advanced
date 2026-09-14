import type { SubTopic } from '../../../types'
import { ColdStartAndConcurrency } from './lessons/cold-start-and-concurrency'
import { CommonTriggers } from './lessons/common-triggers'
import { DestinationsAndVpc } from './lessons/destinations-and-vpc'
import { EnvTimeoutMemory } from './lessons/env-timeout-memory'
import { EventDrivenEtl } from './lessons/event-driven-etl'
import { EventSourceMapping } from './lessons/event-source-mapping'
import { EventsContextInvocation } from './lessons/events-context-invocation'
import { ExecutionRoleBasics } from './lessons/execution-role-basics'
import { FunctionHandlerRuntime } from './lessons/function-handler-runtime'
import { GettingStartedWithLambda } from './lessons/getting-started-with-lambda'
import { LambdaWithDataServices } from './lessons/lambda-with-data-services'
import { LayersIntro } from './lessons/layers-intro'
import { LayersTmpConcurrency } from './lessons/layers-tmp-concurrency'
import { PackagingAndLayers } from './lessons/packaging-and-layers'
import { PerformanceOptimization } from './lessons/performance-optimization'
import { PuttingItTogetherLambda } from './lessons/putting-it-together-lambda'
import { PuttingItTogetherLambdaBeginner } from './lessons/putting-it-together-lambda-beginner'
import { PythonBoto3Logging } from './lessons/python-boto3-logging'
import { SyncAsyncInvocation } from './lessons/sync-async-invocation'
import { VersionsAliasesDlq } from './lessons/versions-aliases-dlq'
import { WhatIsLambdaServerless } from './lessons/what-is-lambda-serverless'

export const lambdaSubTopic: SubTopic = {
  id: 'lambda',
  title: 'AWS Lambda',
  description:
    'Serverless compute for event-driven ETL — handlers, triggers, concurrency, packaging, and production patterns.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-lambda',
          title: 'Getting Started with Lambda',
          description: 'Why Lambda after S3 — roadmap and starter vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithLambda,
        },
        {
          id: 'what-is-lambda-serverless',
          title: 'What Is Lambda & Serverless?',
          description: 'No servers to manage — scale to zero and pay for use.',
          readTime: '10 min',
          component: WhatIsLambdaServerless,
        },
        {
          id: 'function-handler-runtime',
          title: 'Function, Handler & Runtime',
          description: 'Python handlers — the entry point every invocation hits.',
          readTime: '12 min',
          component: FunctionHandlerRuntime,
        },
        {
          id: 'events-context-invocation',
          title: 'Events, Context & Invocation',
          description: 'What arrives in the event, what context provides, and how invoke works.',
          readTime: '11 min',
          component: EventsContextInvocation,
        },
        {
          id: 'env-timeout-memory',
          title: 'Env Vars, Timeout & Memory',
          description: 'Configure behavior without redeploying code — and size for CPU.',
          readTime: '11 min',
          component: EnvTimeoutMemory,
        },
        {
          id: 'layers-intro',
          title: 'Layers Intro',
          description: 'Share libraries across functions without fat zip files.',
          readTime: '10 min',
          component: LayersIntro,
        },
        {
          id: 'execution-role-basics',
          title: 'Execution Role Basics',
          description: 'IAM for Lambda — least privilege to read/write the lake.',
          readTime: '11 min',
          component: ExecutionRoleBasics,
        },
        {
          id: 'putting-it-together-lambda-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm the serverless mental model before triggers and concurrency.',
          readTime: '9 min',
          component: PuttingItTogetherLambdaBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'sync-async-invocation',
          title: 'Sync vs Async Invocation',
          description: 'Wait for a response vs fire-and-forget for pipeline steps.',
          readTime: '11 min',
          component: SyncAsyncInvocation,
        },
        {
          id: 'event-source-mapping',
          title: 'Event Source Mapping',
          description: 'Poll-based sources like SQS — contrast with push triggers.',
          readTime: '11 min',
          component: EventSourceMapping,
        },
        {
          id: 'common-triggers',
          title: 'Common Triggers',
          description: 'S3, EventBridge, SNS, SQS, API Gateway, and CloudWatch.',
          readTime: '13 min',
          component: CommonTriggers,
        },
        {
          id: 'layers-tmp-concurrency',
          title: 'Layers, /tmp & Concurrency Controls',
          description: 'Ephemeral disk, reserved concurrency, and provisioned concurrency.',
          readTime: '12 min',
          component: LayersTmpConcurrency,
        },
        {
          id: 'versions-aliases-dlq',
          title: 'Versions, Aliases & DLQ',
          description: 'Safe deploys, aliases, dead-letter queues, and retries.',
          readTime: '12 min',
          component: VersionsAliasesDlq,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'cold-start-and-concurrency',
          title: 'Cold Starts, Concurrency & Idempotency',
          description: 'Warm paths, throttling, and safe retries for ETL.',
          readTime: '13 min',
          component: ColdStartAndConcurrency,
        },
        {
          id: 'destinations-and-vpc',
          title: 'Destinations & VPC Lambda',
          description: 'Success/failure destinations and private networking tradeoffs.',
          readTime: '12 min',
          component: DestinationsAndVpc,
        },
        {
          id: 'lambda-with-data-services',
          title: 'Lambda with Data Services',
          description: 'Patterns with S3, Athena, Glue, DynamoDB, and Step Functions.',
          readTime: '13 min',
          component: LambdaWithDataServices,
        },
        {
          id: 'python-boto3-logging',
          title: 'Python, Boto3 & Logging',
          description: 'SDK habits, structured logs, and exception handling.',
          readTime: '12 min',
          component: PythonBoto3Logging,
        },
        {
          id: 'packaging-and-layers',
          title: 'Packaging & Layer Creation',
          description: 'Deployment packages and building dependency layers.',
          readTime: '12 min',
          component: PackagingAndLayers,
        },
        {
          id: 'performance-optimization',
          title: 'Performance Optimization',
          description: 'Memory/CPU, client reuse, and keeping payloads lean.',
          readTime: '11 min',
          component: PerformanceOptimization,
        },
        {
          id: 'event-driven-etl',
          title: 'Event-Driven ETL',
          description: 'End-to-end Lambda ETL — and when to hand off to Glue/EC2.',
          readTime: '13 min',
          component: EventDrivenEtl,
        },
        {
          id: 'putting-it-together-lambda',
          title: 'Putting It All Together',
          description: 'Lambda checkpoint, interview quick checks, and what’s next (CloudWatch).',
          readTime: '10 min',
          component: PuttingItTogetherLambda,
        },
      ],
    },
  ],
}
