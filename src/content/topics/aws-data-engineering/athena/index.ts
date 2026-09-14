import type { SubTopic } from '../../../types'
import { AthenaInAnalyticsWorkflows } from './lessons/athena-in-analytics-workflows'
import { AthenaVsWarehouseTeaser } from './lessons/athena-vs-warehouse-teaser'
import { AthenaWithLambdaAndGlue } from './lessons/athena-with-lambda-and-glue'
import { CostOptimizationDataScanned } from './lessons/cost-optimization-data-scanned'
import { CreatingTablesDdl } from './lessons/creating-tables-ddl'
import { CtasAndViews } from './lessons/ctas-and-views'
import { DatabasesAndTables } from './lessons/databases-and-tables'
import { ExternalTablesAndPartitions } from './lessons/external-tables-and-partitions'
import { FederatedQueryUnloadIceberg } from './lessons/federated-query-unload-iceberg'
import { FileFormatsCsvJsonParquetOrc } from './lessons/file-formats-csv-json-parquet-orc'
import { FirstSqlQuery } from './lessons/first-sql-query'
import { GettingStartedWithAthena } from './lessons/getting-started-with-athena'
import { GlueDataCatalog } from './lessons/glue-data-catalog'
import { PartitioningAndParquetOptimization } from './lessons/partitioning-and-parquet-optimization'
import { PredicatePushdownAndSelectStar } from './lessons/predicate-pushdown-and-select-star'
import { PuttingItTogetherAthena } from './lessons/putting-it-together-athena'
import { PuttingItTogetherAthenaBeginner } from './lessons/putting-it-together-athena-beginner'
import { QueryResultsLocation } from './lessons/query-results-location'
import { WhatIsAthena } from './lessons/what-is-athena'
import { Workgroups } from './lessons/workgroups'

export const athenaSubTopic: SubTopic = {
  id: 'athena',
  title: 'Athena',
  description:
    'Serverless SQL on S3 — catalogs, partitions, Parquet, cost control, and lake analytics patterns.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-athena',
          title: 'Getting Started with Athena',
          description: 'Why Athena after the lake — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithAthena,
        },
        {
          id: 'what-is-athena',
          title: 'What Is Athena?',
          description: 'Serverless SQL on S3 — pay for data scanned, not idle clusters.',
          readTime: '10 min',
          component: WhatIsAthena,
        },
        {
          id: 'databases-and-tables',
          title: 'Databases & Tables',
          description: 'Logical metadata over files — external tables in plain English.',
          readTime: '11 min',
          component: DatabasesAndTables,
        },
        {
          id: 'first-sql-query',
          title: 'Your First SQL Query',
          description: 'Run SELECT in the console and read the results path.',
          readTime: '11 min',
          component: FirstSqlQuery,
        },
        {
          id: 'file-formats-csv-json-parquet-orc',
          title: 'CSV, JSON, Parquet & ORC',
          description: 'Pick formats that make analytics fast and cheap.',
          readTime: '12 min',
          component: FileFormatsCsvJsonParquetOrc,
        },
        {
          id: 'query-results-location',
          title: 'Query Results Location',
          description: 'Where Athena writes outputs — and why S3 is required.',
          readTime: '10 min',
          component: QueryResultsLocation,
        },
        {
          id: 'athena-vs-warehouse-teaser',
          title: 'Athena vs Warehouse (Teaser)',
          description: 'Ad-hoc lake SQL vs Redshift — when DE uses each.',
          readTime: '10 min',
          component: AthenaVsWarehouseTeaser,
        },
        {
          id: 'putting-it-together-athena-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm lake-SQL basics before catalog, partitions, and cost.',
          readTime: '9 min',
          component: PuttingItTogetherAthenaBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'glue-data-catalog',
          title: 'Glue Data Catalog',
          description: 'Athena’s metastore — shared databases and tables with Glue.',
          readTime: '12 min',
          component: GlueDataCatalog,
        },
        {
          id: 'creating-tables-ddl',
          title: 'Creating Tables (DDL)',
          description: 'CREATE EXTERNAL TABLE for CSV and Parquet with LOCATION.',
          readTime: '12 min',
          component: CreatingTablesDdl,
        },
        {
          id: 'external-tables-and-partitions',
          title: 'External Tables & Partitions',
          description: 'Hive-style partitions and partition projection overview.',
          readTime: '13 min',
          component: ExternalTablesAndPartitions,
        },
        {
          id: 'ctas-and-views',
          title: 'CTAS & Views',
          description: 'Convert to Parquet with CTAS; wrap logic in views.',
          readTime: '11 min',
          component: CtasAndViews,
        },
        {
          id: 'workgroups',
          title: 'Workgroups',
          description: 'Isolate teams, result buckets, and scan limits.',
          readTime: '11 min',
          component: Workgroups,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'partitioning-and-parquet-optimization',
          title: 'Partitioning & Parquet Optimization',
          description: 'File layout, compression, and columnar tuning for lakes.',
          readTime: '13 min',
          component: PartitioningAndParquetOptimization,
        },
        {
          id: 'predicate-pushdown-and-select-star',
          title: 'Pushdown, Pruning & SELECT *',
          description: 'Scan less data — filters, partitions, and column projection.',
          readTime: '12 min',
          component: PredicatePushdownAndSelectStar,
        },
        {
          id: 'federated-query-unload-iceberg',
          title: 'Federated Query, UNLOAD & Iceberg',
          description: 'Query beyond S3, export results, and Iceberg overview.',
          readTime: '13 min',
          component: FederatedQueryUnloadIceberg,
        },
        {
          id: 'athena-with-lambda-and-glue',
          title: 'Athena with Lambda & Glue',
          description: 'Automate queries and hand off heavy ETL to Glue.',
          readTime: '12 min',
          component: AthenaWithLambdaAndGlue,
        },
        {
          id: 'cost-optimization-data-scanned',
          title: 'Cost Optimization (Data Scanned)',
          description: 'Practical checklist to cut bytes scanned and bill shock.',
          readTime: '12 min',
          component: CostOptimizationDataScanned,
        },
        {
          id: 'athena-in-analytics-workflows',
          title: 'Athena in Analytics Workflows',
          description: 'Explore, validate ETL, and light BI on the lake.',
          readTime: '11 min',
          component: AthenaInAnalyticsWorkflows,
        },
        {
          id: 'putting-it-together-athena',
          title: 'Putting It All Together',
          description: 'Athena checkpoint, interview quick checks, and what’s next (Redshift).',
          readTime: '10 min',
          component: PuttingItTogetherAthena,
        },
      ],
    },
  ],
}
