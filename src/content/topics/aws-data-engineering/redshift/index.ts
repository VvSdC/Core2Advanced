import type { SubTopic } from '../../../types'
import { CopyAndUnload } from './lessons/copy-and-unload'
import { DataSharingAndFederated } from './lessons/data-sharing-and-federated'
import { DistributionStyles } from './lessons/distribution-styles'
import { GettingStartedWithRedshift } from './lessons/getting-started-with-redshift'
import { LeaderAndComputeNodes } from './lessons/leader-and-compute-nodes'
import { LoadingBestPractices } from './lessons/loading-best-practices'
import { OltpVsOlap } from './lessons/oltp-vs-olap'
import { PuttingItTogetherRedshift } from './lessons/putting-it-together-redshift'
import { PuttingItTogetherRedshiftBeginner } from './lessons/putting-it-together-redshift-beginner'
import { Ra3AndManagedStorage } from './lessons/ra3-and-managed-storage'
import { RedshiftServerless } from './lessons/redshift-serverless'
import { RedshiftVsAthena } from './lessons/redshift-vs-athena'
import { RedshiftVsRds } from './lessons/redshift-vs-rds'
import { RedshiftVsS3 } from './lessons/redshift-vs-s3'
import { RedshiftWithGlueAthenaS3 } from './lessons/redshift-with-glue-athena-s3'
import { SortKeys } from './lessons/sort-keys'
import { SpectrumExternalTables } from './lessons/spectrum-external-tables'
import { VacuumAnalyzeEncoding } from './lessons/vacuum-analyze-encoding'
import { WhatIsRedshift } from './lessons/what-is-redshift'
import { WlmConcurrencyMvs } from './lessons/wlm-concurrency-mvs'

export const redshiftSubTopic: SubTopic = {
  id: 'redshift',
  title: 'Amazon Redshift',
  description:
    'Cloud data warehouse — nodes, distribution, COPY/UNLOAD, Spectrum, and lake + warehouse patterns.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-redshift',
          title: 'Getting Started with Redshift',
          description: 'Why a warehouse after Athena — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithRedshift,
        },
        {
          id: 'what-is-redshift',
          title: 'What Is Redshift?',
          description: 'Columnar MPP data warehouse on AWS — the big idea.',
          readTime: '10 min',
          component: WhatIsRedshift,
        },
        {
          id: 'oltp-vs-olap',
          title: 'OLTP vs OLAP',
          description: 'Transactions vs analytics — why warehouses exist.',
          readTime: '10 min',
          component: OltpVsOlap,
        },
        {
          id: 'redshift-vs-rds',
          title: 'Redshift vs RDS',
          description: 'Warehouse vs operational relational database for DE.',
          readTime: '10 min',
          component: RedshiftVsRds,
        },
        {
          id: 'redshift-vs-athena',
          title: 'Redshift vs Athena',
          description: 'Provisioned warehouse SQL vs serverless lake SQL.',
          readTime: '11 min',
          component: RedshiftVsAthena,
        },
        {
          id: 'redshift-vs-s3',
          title: 'Redshift vs S3',
          description: 'Lake storage vs warehouse serving — how they work together.',
          readTime: '10 min',
          component: RedshiftVsS3,
        },
        {
          id: 'putting-it-together-redshift-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm warehouse basics before nodes, dist keys, and COPY.',
          readTime: '9 min',
          component: PuttingItTogetherRedshiftBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'leader-and-compute-nodes',
          title: 'Leader & Compute Nodes',
          description: 'How a query travels from client to slices and back.',
          readTime: '12 min',
          component: LeaderAndComputeNodes,
        },
        {
          id: 'ra3-and-managed-storage',
          title: 'RA3 & Managed Storage',
          description: 'Scale compute independently from warehouse storage.',
          readTime: '11 min',
          component: Ra3AndManagedStorage,
        },
        {
          id: 'redshift-serverless',
          title: 'Redshift Serverless',
          description: 'On-demand warehouse capacity without managing clusters.',
          readTime: '11 min',
          component: RedshiftServerless,
        },
        {
          id: 'distribution-styles',
          title: 'Distribution Styles',
          description: 'EVEN, KEY, ALL, AUTO — place rows for efficient joins.',
          readTime: '13 min',
          component: DistributionStyles,
        },
        {
          id: 'sort-keys',
          title: 'Sort Keys',
          description: 'Compound vs interleaved — and automatic table optimization.',
          readTime: '12 min',
          component: SortKeys,
        },
        {
          id: 'copy-and-unload',
          title: 'COPY & UNLOAD',
          description: 'Bulk load from S3 and export results back to the lake.',
          readTime: '13 min',
          component: CopyAndUnload,
        },
        {
          id: 'loading-best-practices',
          title: 'Loading Best Practices',
          description: 'File sizing, manifests, COPY options, and IAM roles.',
          readTime: '12 min',
          component: LoadingBestPractices,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'spectrum-external-tables',
          title: 'Spectrum & External Tables',
          description: 'Query the lake from Redshift via Glue Catalog.',
          readTime: '13 min',
          component: SpectrumExternalTables,
        },
        {
          id: 'wlm-concurrency-mvs',
          title: 'WLM, Concurrency & Materialized Views',
          description: 'Workload queues, scaling, MVs, and query monitoring rules.',
          readTime: '13 min',
          component: WlmConcurrencyMvs,
        },
        {
          id: 'vacuum-analyze-encoding',
          title: 'VACUUM, ANALYZE & Encoding',
          description: 'Keep tables healthy — cleanup, stats, and compression.',
          readTime: '12 min',
          component: VacuumAnalyzeEncoding,
        },
        {
          id: 'data-sharing-and-federated',
          title: 'Data Sharing & Federated Query',
          description: 'Share live data across clusters and query beyond Redshift.',
          readTime: '12 min',
          component: DataSharingAndFederated,
        },
        {
          id: 'redshift-with-glue-athena-s3',
          title: 'Redshift with Glue, Athena & S3',
          description: 'End-to-end lake + warehouse patterns for DE platforms.',
          readTime: '12 min',
          component: RedshiftWithGlueAthenaS3,
        },
        {
          id: 'putting-it-together-redshift',
          title: 'Putting It All Together',
          description: 'Redshift checkpoint, interview quick checks, and what’s next (RDS).',
          readTime: '10 min',
          component: PuttingItTogetherRedshift,
        },
      ],
    },
  ],
}
