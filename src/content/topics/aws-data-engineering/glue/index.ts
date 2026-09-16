import type { SubTopic } from '../../../types'
import { ApplymappingAndTransforms } from './lessons/applymapping-and-transforms'
import { CrawlersDeepDive } from './lessons/crawlers-deep-dive'
import { CrawlersIntro } from './lessons/crawlers-intro'
import { DataQualitySchemaRegistry } from './lessons/data-quality-schema-registry'
import { DynamicframeVsDataframe } from './lessons/dynamicframe-vs-dataframe'
import { ErrorHandlingMonitoringGlue } from './lessons/error-handling-monitoring-glue'
import { GettingStartedWithGlue } from './lessons/getting-started-with-glue'
import { GlueConnectionsAndVpcTeaser } from './lessons/glue-connections-and-vpc-teaser'
import { GlueDataCatalogBasics } from './lessons/glue-data-catalog-basics'
import { GlueInMedallionArchitecture } from './lessons/glue-in-medallion-architecture'
import { GlueJobsIntro } from './lessons/glue-jobs-intro'
import { GlueJobTypesAndSizing } from './lessons/glue-job-types-and-sizing'
import { GlueWithLambdaEventbridgeStepfunctions } from './lessons/glue-with-lambda-eventbridge-stepfunctions'
import { GlueWorkflowsAndTriggers } from './lessons/glue-workflows-and-triggers'
import { IncrementalEtlAndCdc } from './lessons/incremental-etl-and-cdc'
import { JobBookmarksAndWorkers } from './lessons/job-bookmarks-and-workers'
import { PerformanceAndCostGlue } from './lessons/performance-and-cost-glue'
import { PuttingItTogetherGlue } from './lessons/putting-it-together-glue'
import { PuttingItTogetherGlueBeginner } from './lessons/putting-it-together-glue-beginner'
import { PysparkAndDynamicframes } from './lessons/pyspark-and-dynamicframes'
import { SparkOptimizationGlue } from './lessons/spark-optimization-glue'
import { WhatIsGlue } from './lessons/what-is-glue'

export const glueSubTopic: SubTopic = {
  id: 'glue',
  title: 'AWS Glue',
  description:
    'Serverless ETL — Data Catalog, crawlers, Spark jobs, DynamicFrames, workflows, and lake transforms.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-glue',
          title: 'Getting Started with Glue',
          description: 'Why Glue after RDS — the ETL engine for your lake.',
          readTime: '11 min',
          component: GettingStartedWithGlue,
        },
        {
          id: 'what-is-glue',
          title: 'What Is Glue?',
          description: 'Serverless ETL architecture and core components.',
          readTime: '10 min',
          component: WhatIsGlue,
        },
        {
          id: 'glue-data-catalog-basics',
          title: 'Glue Data Catalog Basics',
          description: 'Databases, tables, schemas, partitions — shared with Athena.',
          readTime: '11 min',
          component: GlueDataCatalogBasics,
        },
        {
          id: 'crawlers-intro',
          title: 'Crawlers Intro',
          description: 'Discover schemas and partitions from S3 automatically.',
          readTime: '10 min',
          component: CrawlersIntro,
        },
        {
          id: 'glue-jobs-intro',
          title: 'Glue Jobs Intro',
          description: 'Spark, PySpark, and Python Shell jobs at a glance.',
          readTime: '11 min',
          component: GlueJobsIntro,
        },
        {
          id: 'dynamicframe-vs-dataframe',
          title: 'DynamicFrame vs DataFrame',
          description: 'Flexible schemas for lake data — and when to convert.',
          readTime: '11 min',
          component: DynamicframeVsDataframe,
        },
        {
          id: 'job-bookmarks-and-workers',
          title: 'Job Bookmarks & Workers',
          description: 'Incremental processing and sizing workers for cost/speed.',
          readTime: '11 min',
          component: JobBookmarksAndWorkers,
        },
        {
          id: 'putting-it-together-glue-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm catalog + job basics before transforms and workflows.',
          readTime: '9 min',
          component: PuttingItTogetherGlueBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'crawlers-deep-dive',
          title: 'Crawlers Deep Dive',
          description: 'S3 and JDBC targets, schema detection, partition discovery.',
          readTime: '12 min',
          component: CrawlersDeepDive,
        },
        {
          id: 'glue-job-types-and-sizing',
          title: 'Job Types & Sizing',
          description: 'Spark vs Python Shell, Glue versions, workers, and parameters.',
          readTime: '12 min',
          component: GlueJobTypesAndSizing,
        },
        {
          id: 'pyspark-and-dynamicframes',
          title: 'PySpark & DynamicFrames',
          description: 'Write Glue ETL in Python — DynamicFrames and DataFrames.',
          readTime: '13 min',
          component: PysparkAndDynamicframes,
        },
        {
          id: 'applymapping-and-transforms',
          title: 'ApplyMapping & Transforms',
          description: 'Map, filter, join, drop, rename — core lake transform toolkit.',
          readTime: '13 min',
          component: ApplymappingAndTransforms,
        },
        {
          id: 'glue-connections-and-vpc-teaser',
          title: 'Connections & VPC Teaser',
          description: 'JDBC connections to RDS/Redshift — why networking matters.',
          readTime: '11 min',
          component: GlueConnectionsAndVpcTeaser,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'glue-workflows-and-triggers',
          title: 'Workflows & Triggers',
          description: 'Orchestrate jobs with schedules, events, and conditions.',
          readTime: '12 min',
          component: GlueWorkflowsAndTriggers,
        },
        {
          id: 'data-quality-schema-registry',
          title: 'Data Quality & Schema Registry',
          description: 'Validate data and evolve schemas safely across producers.',
          readTime: '12 min',
          component: DataQualitySchemaRegistry,
        },
        {
          id: 'spark-optimization-glue',
          title: 'Spark Optimization on Glue',
          description: 'Partitions, joins, shuffle, coalesce, and small files.',
          readTime: '13 min',
          component: SparkOptimizationGlue,
        },
        {
          id: 'incremental-etl-and-cdc',
          title: 'Incremental ETL & CDC',
          description: 'Bookmarks, full vs incremental loads, and schema evolution.',
          readTime: '13 min',
          component: IncrementalEtlAndCdc,
        },
        {
          id: 'error-handling-monitoring-glue',
          title: 'Error Handling & Monitoring',
          description: 'Retries, CloudWatch metrics, and failed job runbooks.',
          readTime: '11 min',
          component: ErrorHandlingMonitoringGlue,
        },
        {
          id: 'glue-with-lambda-eventbridge-stepfunctions',
          title: 'Glue with Lambda, EventBridge & Step Functions',
          description: 'Event-driven and orchestrated ETL beyond Glue Workflows.',
          readTime: '12 min',
          component: GlueWithLambdaEventbridgeStepfunctions,
        },
        {
          id: 'glue-in-medallion-architecture',
          title: 'Glue in Medallion Architecture',
          description: 'Bronze → silver → gold transforms on S3 with Glue jobs.',
          readTime: '12 min',
          component: GlueInMedallionArchitecture,
        },
        {
          id: 'performance-and-cost-glue',
          title: 'Performance & Cost',
          description: 'DPU mindset — cut shuffle, small files, and wasted workers.',
          readTime: '12 min',
          component: PerformanceAndCostGlue,
        },
        {
          id: 'putting-it-together-glue',
          title: 'Putting It All Together',
          description: 'Glue checkpoint, interview quick checks, and what’s next (VPC).',
          readTime: '10 min',
          component: PuttingItTogetherGlue,
        },
      ],
    },
  ],
}
