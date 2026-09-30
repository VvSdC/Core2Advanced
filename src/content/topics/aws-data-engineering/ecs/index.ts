import type { SubTopic } from '../../../types'
import { BatchEtlWithFargate } from './lessons/batch-etl-with-fargate'
import { ClustersTasksServices } from './lessons/clusters-tasks-services'
import { ContainersAndDockerBasics } from './lessons/containers-and-docker-basics'
import { CostOptimizationAndFargateSpot } from './lessons/cost-optimization-and-fargate-spot'
import { DeploymentsAndCiCd } from './lessons/deployments-and-ci-cd'
import { EcrAndImages } from './lessons/ecr-and-images'
import { EcsForDataEngineering } from './lessons/ecs-for-data-engineering'
import { EcsVsLambdaGlueEmrEks } from './lessons/ecs-vs-lambda-glue-emr-eks'
import { FargateVsEc2LaunchTypes } from './lessons/fargate-vs-ec2-launch-types'
import { GettingStartedWithEcs } from './lessons/getting-started-with-ecs'
import { IamTaskRolesAndSecrets } from './lessons/iam-task-roles-and-secrets'
import { LoggingMonitoringContainerInsights } from './lessons/logging-monitoring-container-insights'
import { NetworkingAndLoadBalancing } from './lessons/networking-and-load-balancing'
import { PuttingItTogetherEcs } from './lessons/putting-it-together-ecs'
import { PuttingItTogetherEcsBeginner } from './lessons/putting-it-together-ecs-beginner'
import { QueueWorkersAndAutoscaling } from './lessons/queue-workers-and-autoscaling'
import { TaskDefinitions } from './lessons/task-definitions'
import { WhatIsEcs } from './lessons/what-is-ecs'

export const ecsSubTopic: SubTopic = {
  id: 'ecs',
  title: 'Amazon ECS',
  description:
    'Containers for data workloads — Fargate batch ETL, SQS queue workers, task roles, ECR images, autoscaling, and when ECS beats Lambda or Glue.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-ecs',
          title: 'Getting Started with ECS',
          description: 'Why containers after API Gateway — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithEcs,
        },
        {
          id: 'containers-and-docker-basics',
          title: 'Containers & Docker Basics',
          description: 'Images, containers, Dockerfiles, and registries in plain English.',
          readTime: '12 min',
          component: ContainersAndDockerBasics,
        },
        {
          id: 'what-is-ecs',
          title: 'What Is ECS?',
          description: 'AWS’s container orchestrator — run, place, restart, and scale containers.',
          readTime: '10 min',
          component: WhatIsEcs,
        },
        {
          id: 'clusters-tasks-services',
          title: 'Clusters, Tasks & Services',
          description: 'One-off tasks for batch jobs vs long-running services for workers.',
          readTime: '11 min',
          component: ClustersTasksServices,
        },
        {
          id: 'fargate-vs-ec2-launch-types',
          title: 'Fargate vs EC2',
          description: 'Serverless containers vs managing your own container hosts.',
          readTime: '11 min',
          component: FargateVsEc2LaunchTypes,
        },
        {
          id: 'ecs-for-data-engineering',
          title: 'ECS for Data Engineering',
          description: 'Long ETL jobs, custom dependencies, queue workers, and connectors.',
          readTime: '11 min',
          component: EcsForDataEngineering,
        },
        {
          id: 'putting-it-together-ecs-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm container basics before task definitions, ECR, and networking.',
          readTime: '9 min',
          component: PuttingItTogetherEcsBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'task-definitions',
          title: 'Task Definitions',
          description: 'CPU, memory, containers, environment, and revisions.',
          readTime: '12 min',
          component: TaskDefinitions,
        },
        {
          id: 'ecr-and-images',
          title: 'ECR & Images',
          description: 'Push, tag, scan, and lifecycle-clean your pipeline images.',
          readTime: '11 min',
          component: EcrAndImages,
        },
        {
          id: 'networking-and-load-balancing',
          title: 'Networking & Load Balancing',
          description: 'awsvpc mode, private subnets, VPC endpoints, and ALB for services.',
          readTime: '12 min',
          component: NetworkingAndLoadBalancing,
        },
        {
          id: 'iam-task-roles-and-secrets',
          title: 'IAM Task Roles & Secrets',
          description: 'Task role vs execution role, and injecting Secrets Manager values.',
          readTime: '12 min',
          component: IamTaskRolesAndSecrets,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'batch-etl-with-fargate',
          title: 'Batch ETL with Fargate',
          description: 'Scheduled and Step Functions–orchestrated container jobs.',
          readTime: '13 min',
          component: BatchEtlWithFargate,
        },
        {
          id: 'queue-workers-and-autoscaling',
          title: 'Queue Workers & Autoscaling',
          description: 'SQS-driven services that scale on backlog per task.',
          readTime: '12 min',
          component: QueueWorkersAndAutoscaling,
        },
        {
          id: 'logging-monitoring-container-insights',
          title: 'Logging, Monitoring & Container Insights',
          description: 'awslogs, FireLens, Container Insights, and debugging stopped tasks.',
          readTime: '11 min',
          component: LoggingMonitoringContainerInsights,
        },
        {
          id: 'deployments-and-ci-cd',
          title: 'Deployments & CI/CD',
          description: 'Rolling vs blue/green, circuit breakers, and pipelines from Git to ECS.',
          readTime: '12 min',
          component: DeploymentsAndCiCd,
        },
        {
          id: 'cost-optimization-and-fargate-spot',
          title: 'Cost Optimization & Fargate Spot',
          description: 'Right-sizing, Spot capacity providers, Graviton, and idle waste.',
          readTime: '11 min',
          component: CostOptimizationAndFargateSpot,
        },
        {
          id: 'ecs-vs-lambda-glue-emr-eks',
          title: 'ECS vs Lambda, Glue, EMR & EKS',
          description: 'Pick the right compute for each data workload.',
          readTime: '12 min',
          component: EcsVsLambdaGlueEmrEks,
        },
        {
          id: 'putting-it-together-ecs',
          title: 'Putting It All Together',
          description: 'ECS checkpoint, interview quick checks, and a wrap-up of the whole AWS track.',
          readTime: '12 min',
          component: PuttingItTogetherEcs,
        },
      ],
    },
  ],
}
