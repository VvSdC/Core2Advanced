import type { SubTopic } from '../../../types'
import { CfnBestPracticesDe } from './lessons/cfn-best-practices-de'
import { ConditionsAndMappings } from './lessons/conditions-and-mappings'
import { CreateStackMentalModel } from './lessons/create-stack-mental-model'
import { CrossStackExportsImports } from './lessons/cross-stack-exports-imports'
import { DeployingDeInfrastructure } from './lessons/deploying-de-infrastructure'
import { DynamicReferencesSecretsSsm } from './lessons/dynamic-references-secrets-ssm'
import { GettingStartedWithCloudformation } from './lessons/getting-started-with-cloudformation'
import { IacForDataPlatforms } from './lessons/iac-for-data-platforms'
import { IntrinsicFunctions } from './lessons/intrinsic-functions'
import { NestedStacks } from './lessons/nested-stacks'
import { PuttingItTogetherCloudformation } from './lessons/putting-it-together-cloudformation'
import { PuttingItTogetherCloudformationBeginner } from './lessons/putting-it-together-cloudformation-beginner'
import { RegistryAndCustomResources } from './lessons/registry-and-custom-resources'
import { ResourcesParametersOutputs } from './lessons/resources-parameters-outputs'
import { StackLifecycle } from './lessons/stack-lifecycle'
import { Stacksets } from './lessons/stacksets'
import { TemplatesAndYaml } from './lessons/templates-and-yaml'
import { TroubleshootingStacks } from './lessons/troubleshooting-stacks'
import { WhatIsCloudformation } from './lessons/what-is-cloudformation'
import { WhatIsIac } from './lessons/what-is-iac'

export const cloudFormationSubTopic: SubTopic = {
  id: 'cloudformation',
  title: 'CloudFormation',
  description:
    'Infrastructure as Code — templates, stacks, nested modules, and repeatable DE platforms.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-cloudformation',
          title: 'Getting Started with CloudFormation',
          description: 'Why IaC after EventBridge — repeatable lake platforms.',
          readTime: '11 min',
          component: GettingStartedWithCloudformation,
        },
        {
          id: 'what-is-iac',
          title: 'What Is Infrastructure as Code?',
          description: 'Define AWS in files — stop relying on Console clicks alone.',
          readTime: '10 min',
          component: WhatIsIac,
        },
        {
          id: 'what-is-cloudformation',
          title: 'What Is CloudFormation?',
          description: 'AWS native IaC — templates become stacks of real resources.',
          readTime: '10 min',
          component: WhatIsCloudformation,
        },
        {
          id: 'templates-and-yaml',
          title: 'Templates & YAML',
          description: 'Template anatomy and a first S3 bucket resource.',
          readTime: '12 min',
          component: TemplatesAndYaml,
        },
        {
          id: 'resources-parameters-outputs',
          title: 'Resources, Parameters & Outputs',
          description: 'The three sections that make templates reusable.',
          readTime: '11 min',
          component: ResourcesParametersOutputs,
        },
        {
          id: 'create-stack-mental-model',
          title: 'Create Stack Mental Model',
          description: 'How a template becomes live infrastructure in an account.',
          readTime: '11 min',
          component: CreateStackMentalModel,
        },
        {
          id: 'iac-for-data-platforms',
          title: 'IaC for Data Platforms',
          description: 'What a DE platform template usually includes.',
          readTime: '12 min',
          component: IacForDataPlatforms,
        },
        {
          id: 'putting-it-together-cloudformation-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm IaC basics before intrinsics and nested stacks.',
          readTime: '9 min',
          component: PuttingItTogetherCloudformationBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'conditions-and-mappings',
          title: 'Conditions & Mappings',
          description: 'Environment branching and lookup tables in templates.',
          readTime: '12 min',
          component: ConditionsAndMappings,
        },
        {
          id: 'intrinsic-functions',
          title: 'Intrinsic Functions',
          description: 'Ref, GetAtt, Sub, Join, If, Select, FindInMap — wire resources together.',
          readTime: '13 min',
          component: IntrinsicFunctions,
        },
        {
          id: 'stack-lifecycle',
          title: 'Stack Lifecycle',
          description: 'Create, update, delete, change sets, rollback, and drift.',
          readTime: '13 min',
          component: StackLifecycle,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'nested-stacks',
          title: 'Nested Stacks',
          description: 'Modular templates for network, data, and compute layers.',
          readTime: '12 min',
          component: NestedStacks,
        },
        {
          id: 'stacksets',
          title: 'StackSets',
          description: 'Deploy the same stack across accounts and Regions.',
          readTime: '12 min',
          component: Stacksets,
        },
        {
          id: 'cross-stack-exports-imports',
          title: 'Cross-Stack Exports & Imports',
          description: 'Share VPC IDs, bucket ARNs, and role names between stacks.',
          readTime: '11 min',
          component: CrossStackExportsImports,
        },
        {
          id: 'dynamic-references-secrets-ssm',
          title: 'Dynamic References, Secrets & SSM',
          description: 'Pull secrets and parameters at deploy time — never hard-code.',
          readTime: '12 min',
          component: DynamicReferencesSecretsSsm,
        },
        {
          id: 'registry-and-custom-resources',
          title: 'Registry & Custom Resources',
          description: 'Extend CloudFormation when a native resource is missing.',
          readTime: '11 min',
          component: RegistryAndCustomResources,
        },
        {
          id: 'deploying-de-infrastructure',
          title: 'Deploying DE Infrastructure',
          description: 'Layered stacks: network → data → compute → observability.',
          readTime: '13 min',
          component: DeployingDeInfrastructure,
        },
        {
          id: 'cfn-best-practices-de',
          title: 'CloudFormation Best Practices for DE',
          description: 'Tagging, parameters, least-privilege IAM, and secret hygiene.',
          readTime: '11 min',
          component: CfnBestPracticesDe,
        },
        {
          id: 'troubleshooting-stacks',
          title: 'Troubleshooting Stacks',
          description: 'Rollback, Events tab, and drift — fix failed deploys calmly.',
          readTime: '11 min',
          component: TroubleshootingStacks,
        },
        {
          id: 'putting-it-together-cloudformation',
          title: 'Putting It All Together',
          description: 'CloudFormation checkpoint, interview quick checks, and what’s next (DynamoDB).',
          readTime: '10 min',
          component: PuttingItTogetherCloudformation,
        },
      ],
    },
  ],
}
