import type { SubTopic } from '../../../types'
import { AccountConsoleFreeTier } from './lessons/account-console-free-tier'
import { AvailabilityDurabilityFaultTolerance } from './lessons/availability-durability-fault-tolerance'
import { AwsGlobalInfrastructure } from './lessons/aws-global-infrastructure'
import { CliSdkBoto3 } from './lessons/cli-sdk-boto3'
import { CloudDeploymentModels } from './lessons/cloud-deployment-models'
import { CloudTrailConfigOverview } from './lessons/cloudtrail-config-overview'
import { CostOptimizationIntro } from './lessons/cost-optimization-intro'
import { GettingStartedWithAwsDe } from './lessons/getting-started-with-aws-de'
import { HaDisasterRecovery } from './lessons/ha-disaster-recovery'
import { IaasPaasSaas } from './lessons/iaas-paas-saas'
import { MultiAzMultiRegion } from './lessons/multi-az-multi-region'
import { OnPremisesVsCloud } from './lessons/on-premises-vs-cloud'
import { PricingTaggingOrganizations } from './lessons/pricing-tagging-organizations'
import { PuttingItTogetherFundamentals } from './lessons/putting-it-together-fundamentals'
import { RtoRpoBackupDr } from './lessons/rto-rpo-backup-dr'
import { ScalabilityElasticityPerformance } from './lessons/scalability-elasticity-performance'
import { ScalingAndState } from './lessons/scaling-and-state'
import { SharedResponsibilityModel } from './lessons/shared-responsibility-model'
import { WellArchitectedFramework } from './lessons/well-architected-framework'
import { WhatIsCloudComputing } from './lessons/what-is-cloud-computing'

export const awsFundamentalsSubTopic: SubTopic = {
  id: 'aws-fundamentals',
  title: 'AWS Fundamentals',
  description:
    'Cloud basics to production mindset — infrastructure, accounts, reliability, cost, and Well-Architected thinking.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-aws-de',
          title: 'Getting Started',
          description: 'Course roadmap, study habits, and starter vocabulary for AWS data engineering.',
          readTime: '12 min',
          component: GettingStartedWithAwsDe,
        },
        {
          id: 'what-is-cloud-computing',
          title: 'What Is Cloud Computing?',
          description: 'Rent capacity instead of owning hardware — the idea behind every AWS service.',
          readTime: '11 min',
          component: WhatIsCloudComputing,
        },
        {
          id: 'on-premises-vs-cloud',
          title: 'On-Premises vs Cloud',
          description: 'CapEx vs OpEx, capacity pain, and honest tradeoffs for data teams.',
          readTime: '12 min',
          component: OnPremisesVsCloud,
        },
        {
          id: 'iaas-paas-saas',
          title: 'IaaS, PaaS & SaaS',
          description: 'Who manages what — and where EC2, Glue, Athena, and SaaS tools fit.',
          readTime: '12 min',
          component: IaasPaasSaas,
        },
        {
          id: 'cloud-deployment-models',
          title: 'Public, Private & Hybrid',
          description: 'Deployment models and hybrid lakes that still talk to on-prem sources.',
          readTime: '10 min',
          component: CloudDeploymentModels,
        },
        {
          id: 'aws-global-infrastructure',
          title: 'AWS Global Infrastructure',
          description: 'Regions, AZs, edge locations, and Local Zones — the map under every design.',
          readTime: '14 min',
          component: AwsGlobalInfrastructure,
        },
        {
          id: 'account-console-free-tier',
          title: 'Account, Console & Free Tier',
          description: 'Account basics, Console navigation, Free Tier caution, and billing alerts.',
          readTime: '12 min',
          component: AccountConsoleFreeTier,
        },
        {
          id: 'cli-sdk-boto3',
          title: 'CLI, SDK & Boto3',
          description: 'Automate AWS from the terminal and Python — when to click vs script.',
          readTime: '13 min',
          component: CliSdkBoto3,
        },
        {
          id: 'shared-responsibility-model',
          title: 'Shared Responsibility Model',
          description: 'AWS secures the cloud; you secure your data, identities, and configs.',
          readTime: '11 min',
          component: SharedResponsibilityModel,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'scalability-elasticity-performance',
          title: 'Scalability, Elasticity & Performance',
          description: 'Grow capacity on demand and keep pipelines fast under load.',
          readTime: '12 min',
          component: ScalabilityElasticityPerformance,
        },
        {
          id: 'availability-durability-fault-tolerance',
          title: 'Availability, Durability & Fault Tolerance',
          description: 'Stay up, keep data safe, and survive component failures.',
          readTime: '12 min',
          component: AvailabilityDurabilityFaultTolerance,
        },
        {
          id: 'ha-disaster-recovery',
          title: 'HA, DR & Reliability',
          description: 'High availability vs disaster recovery — strategies from backup to multi-site.',
          readTime: '13 min',
          component: HaDisasterRecovery,
        },
        {
          id: 'cost-optimization-intro',
          title: 'Cost Optimization Intro',
          description: 'Right-size, shut down idle work, and design with spend as a constraint.',
          readTime: '11 min',
          component: CostOptimizationIntro,
        },
        {
          id: 'well-architected-framework',
          title: 'Well-Architected Framework',
          description: 'Six pillars with data-engineering examples for production quality.',
          readTime: '14 min',
          component: WellArchitectedFramework,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'multi-az-multi-region',
          title: 'Multi-AZ & Multi-Region',
          description: 'HA inside a Region vs DR and global reach across Regions.',
          readTime: '13 min',
          component: MultiAzMultiRegion,
        },
        {
          id: 'rto-rpo-backup-dr',
          title: 'RTO, RPO, Backup & DR',
          description: 'How much downtime and data loss you can afford — and how to plan for it.',
          readTime: '12 min',
          component: RtoRpoBackupDr,
        },
        {
          id: 'scaling-and-state',
          title: 'Scaling & Application State',
          description: 'Horizontal vs vertical scale; keep workers stateless and state in S3/DB.',
          readTime: '12 min',
          component: ScalingAndState,
        },
        {
          id: 'pricing-tagging-organizations',
          title: 'Pricing, Tagging & Organizations',
          description: 'Pricing models, chargeback tags, and multi-account Organizations overview.',
          readTime: '13 min',
          component: PricingTaggingOrganizations,
        },
        {
          id: 'cloudtrail-config-overview',
          title: 'CloudTrail & Config Overview',
          description: 'API audit history vs resource configuration compliance — why both matter.',
          readTime: '11 min',
          component: CloudTrailConfigOverview,
        },
        {
          id: 'putting-it-together-fundamentals',
          title: 'Putting It All Together',
          description: 'Checkpoint map of fundamentals and what to learn next (IAM).',
          readTime: '10 min',
          component: PuttingItTogetherFundamentals,
        },
      ],
    },
  ],
}
