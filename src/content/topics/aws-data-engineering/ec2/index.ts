import type { SubTopic } from '../../../types'
import { AmiAndLaunch } from './lessons/ami-and-launch'
import { AutoScalingAndLaunchTemplates } from './lessons/auto-scaling-and-launch-templates'
import { EbsBasics } from './lessons/ebs-basics'
import { EbsVolumeTypes } from './lessons/ebs-volume-types'
import { Ec2Monitoring } from './lessons/ec2-monitoring'
import { Ec2PricingOptimization } from './lessons/ec2-pricing-optimization'
import { Ec2VsLambdaVsGlue } from './lessons/ec2-vs-lambda-vs-glue'
import { EniAndSecurityGroups } from './lessons/eni-and-security-groups'
import { GettingStartedWithEc2 } from './lessons/getting-started-with-ec2'
import { InstanceFamilies } from './lessons/instance-families'
import { InstanceTypesAndPricingModels } from './lessons/instance-types-and-pricing-models'
import { NetworkingBasicsEc2 } from './lessons/networking-basics-ec2'
import { PlacementDedicatedHibernate } from './lessons/placement-dedicated-hibernate'
import { PuttingItTogetherEc2 } from './lessons/putting-it-together-ec2'
import { PuttingItTogetherEc2Beginner } from './lessons/putting-it-together-ec2-beginner'
import { PythonEtlAndAirflowOnEc2 } from './lessons/python-etl-and-airflow-on-ec2'
import { SnapshotsAndEncryption } from './lessons/snapshots-and-encryption'
import { SshAndAccess } from './lessons/ssh-and-access'
import { UserDataAndMetadata } from './lessons/user-data-and-metadata'
import { WhatIsEc2 } from './lessons/what-is-ec2'

export const ec2SubTopic: SubTopic = {
  id: 'ec2',
  title: 'EC2',
  description:
    'Virtual servers for data workloads — launch, storage, networking, Auto Scaling, and EC2 vs Lambda/Glue.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-ec2',
          title: 'Getting Started with EC2',
          description: 'Why EC2 after IAM — roadmap and starter vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithEc2,
        },
        {
          id: 'what-is-ec2',
          title: 'What Is EC2?',
          description: 'Virtual servers in the cloud — Linux/Windows and when DE uses them.',
          readTime: '10 min',
          component: WhatIsEc2,
        },
        {
          id: 'instance-types-and-pricing-models',
          title: 'Instance Types & Pricing Models',
          description: 'Families teaser plus On-Demand, Reserved, and Spot for batch work.',
          readTime: '12 min',
          component: InstanceTypesAndPricingModels,
        },
        {
          id: 'ami-and-launch',
          title: 'AMI & Launching an Instance',
          description: 'Images, the launch mental model, and key pairs for first access.',
          readTime: '12 min',
          component: AmiAndLaunch,
        },
        {
          id: 'networking-basics-ec2',
          title: 'Networking Basics',
          description: 'Public, private, and Elastic IPs — and why lakes stay private.',
          readTime: '11 min',
          component: NetworkingBasicsEc2,
        },
        {
          id: 'user-data-and-metadata',
          title: 'User Data & Metadata',
          description: 'Bootstrap scripts on first boot and safe use of instance metadata.',
          readTime: '11 min',
          component: UserDataAndMetadata,
        },
        {
          id: 'ssh-and-access',
          title: 'SSH & Access',
          description: 'Key-based SSH, Windows RDP mention, and Session Manager teaser.',
          readTime: '10 min',
          component: SshAndAccess,
        },
        {
          id: 'putting-it-together-ec2-beginner',
          title: 'Beginner Checkpoint',
          description: 'Sandbox launch checklist before storage, SGs, and Auto Scaling.',
          readTime: '9 min',
          component: PuttingItTogetherEc2Beginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'instance-families',
          title: 'Instance Families',
          description: 'General, compute, memory, storage, and accelerated — pick for the job.',
          readTime: '12 min',
          component: InstanceFamilies,
        },
        {
          id: 'ebs-basics',
          title: 'EBS Basics',
          description: 'Network disks vs instance store — persistence for DE workloads.',
          readTime: '11 min',
          component: EbsBasics,
        },
        {
          id: 'ebs-volume-types',
          title: 'EBS Volume Types',
          description: 'gp3, io2, and choosing throughput vs IOPS.',
          readTime: '11 min',
          component: EbsVolumeTypes,
        },
        {
          id: 'snapshots-and-encryption',
          title: 'Snapshots & Encryption',
          description: 'Backup with snapshots and encrypt volumes with KMS.',
          readTime: '11 min',
          component: SnapshotsAndEncryption,
        },
        {
          id: 'eni-and-security-groups',
          title: 'ENI & Security Groups',
          description: 'Network interfaces and stateful firewalls for instance traffic.',
          readTime: '13 min',
          component: EniAndSecurityGroups,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'auto-scaling-and-launch-templates',
          title: 'Auto Scaling & Launch Templates',
          description: 'Scale ETL worker fleets with ASGs and reusable launch templates.',
          readTime: '13 min',
          component: AutoScalingAndLaunchTemplates,
        },
        {
          id: 'placement-dedicated-hibernate',
          title: 'Placement, Dedicated & Hibernate',
          description: 'Placement groups, dedicated tenancy options, and hibernate basics.',
          readTime: '11 min',
          component: PlacementDedicatedHibernate,
        },
        {
          id: 'ec2-monitoring',
          title: 'EC2 Monitoring & Ops',
          description: 'CloudWatch Agent and Systems Manager for healthy fleets.',
          readTime: '12 min',
          component: Ec2Monitoring,
        },
        {
          id: 'ec2-pricing-optimization',
          title: 'EC2 Pricing Optimization',
          description: 'Right-size, Spot for batch, and stop vs terminate habits.',
          readTime: '11 min',
          component: Ec2PricingOptimization,
        },
        {
          id: 'python-etl-and-airflow-on-ec2',
          title: 'Python ETL & Airflow on EC2',
          description: 'Run custom ETL and Airflow with an instance IAM role.',
          readTime: '14 min',
          component: PythonEtlAndAirflowOnEc2,
        },
        {
          id: 'ec2-vs-lambda-vs-glue',
          title: 'EC2 vs Lambda vs Glue',
          description: 'Choose the right compute for control, cost shape, and scale.',
          readTime: '12 min',
          component: Ec2VsLambdaVsGlue,
        },
        {
          id: 'putting-it-together-ec2',
          title: 'Putting It All Together',
          description: 'EC2 checkpoint, interview quick checks, and what’s next (S3).',
          readTime: '10 min',
          component: PuttingItTogetherEc2,
        },
      ],
    },
  ],
}
