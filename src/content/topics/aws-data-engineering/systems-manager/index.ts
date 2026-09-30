import type { SubTopic } from '../../../types'
import { AutomationRunbooks } from './lessons/automation-runbooks'
import { GettingStartedWithSystemsManager } from './lessons/getting-started-with-systems-manager'
import { HybridAndMultiAccountOperations } from './lessons/hybrid-and-multi-account-operations'
import { InventoryAndFleetManager } from './lessons/inventory-and-fleet-manager'
import { MaintenanceWindowsAndChangeCalendar } from './lessons/maintenance-windows-and-change-calendar'
import { OperatingEtlHostsAndEmr } from './lessons/operating-etl-hosts-and-emr'
import { PatchManager } from './lessons/patch-manager'
import { PortForwardingToDatabases } from './lessons/port-forwarding-to-databases'
import { PuttingItTogetherSystemsManager } from './lessons/putting-it-together-systems-manager'
import { PuttingItTogetherSystemsManagerBeginner } from './lessons/putting-it-together-systems-manager-beginner'
import { RunCommand } from './lessons/run-command'
import { SessionManager } from './lessons/session-manager'
import { SsmAgentAndManagedNodes } from './lessons/ssm-agent-and-managed-nodes'
import { StateManagerAndAssociations } from './lessons/state-manager-and-associations'
import { SystemsManagerForDataEngineering } from './lessons/systems-manager-for-data-engineering'
import { SystemsManagerSecurityAndIam } from './lessons/systems-manager-security-and-iam'
import { SystemsManagerVsAlternatives } from './lessons/systems-manager-vs-alternatives'
import { WhatIsSystemsManager } from './lessons/what-is-systems-manager'

export const systemsManagerSubTopic: SubTopic = {
  id: 'systems-manager',
  title: 'Systems Manager',
  description:
    'Operate the servers behind your pipelines — Session Manager, Run Command, patching, automation runbooks, and bastion-free database access.',
  lessonSections: [
    {
      id: 'beginner',
      title: 'Beginner',
      lessons: [
        {
          id: 'getting-started-with-systems-manager',
          title: 'Getting Started with Systems Manager',
          description: 'Why Systems Manager after CloudTrail — roadmap and vocabulary.',
          readTime: '11 min',
          component: GettingStartedWithSystemsManager,
        },
        {
          id: 'what-is-systems-manager',
          title: 'What Is Systems Manager?',
          description: 'One console for node access, commands, patching, and config.',
          readTime: '10 min',
          component: WhatIsSystemsManager,
        },
        {
          id: 'ssm-agent-and-managed-nodes',
          title: 'SSM Agent & Managed Nodes',
          description: 'The agent, the instance profile, and why a node shows up — or does not.',
          readTime: '11 min',
          component: SsmAgentAndManagedNodes,
        },
        {
          id: 'session-manager',
          title: 'Session Manager',
          description: 'Shell access with no SSH keys, no open port 22, and no bastion.',
          readTime: '11 min',
          component: SessionManager,
        },
        {
          id: 'run-command',
          title: 'Run Command',
          description: 'Run a script on one node or a hundred — documents, targets, and output.',
          readTime: '11 min',
          component: RunCommand,
        },
        {
          id: 'systems-manager-for-data-engineering',
          title: 'Systems Manager for Data Engineering',
          description: 'ETL hosts, EMR nodes, database tunnels, and config — where DEs use it.',
          readTime: '11 min',
          component: SystemsManagerForDataEngineering,
        },
        {
          id: 'putting-it-together-systems-manager-beginner',
          title: 'Beginner Checkpoint',
          description: 'Confirm node access basics before patching, automation, and tunnels.',
          readTime: '9 min',
          component: PuttingItTogetherSystemsManagerBeginner,
        },
      ],
    },
    {
      id: 'intermediate',
      title: 'Intermediate',
      lessons: [
        {
          id: 'patch-manager',
          title: 'Patch Manager',
          description: 'Patch baselines, patch groups, and scanning vs installing.',
          readTime: '11 min',
          component: PatchManager,
        },
        {
          id: 'state-manager-and-associations',
          title: 'State Manager & Associations',
          description: 'Keep nodes in a desired state — agents installed, configs applied.',
          readTime: '11 min',
          component: StateManagerAndAssociations,
        },
        {
          id: 'automation-runbooks',
          title: 'Automation Runbooks',
          description: 'Multi-step operational workflows — AWS-owned and custom runbooks.',
          readTime: '12 min',
          component: AutomationRunbooks,
        },
        {
          id: 'inventory-and-fleet-manager',
          title: 'Inventory & Fleet Manager',
          description: 'What is installed where, and managing nodes from the console.',
          readTime: '10 min',
          component: InventoryAndFleetManager,
        },
      ],
    },
    {
      id: 'advanced',
      title: 'Advanced',
      lessons: [
        {
          id: 'port-forwarding-to-databases',
          title: 'Port Forwarding to Databases',
          description: 'Reach private RDS and Redshift from your laptop without a bastion.',
          readTime: '12 min',
          component: PortForwardingToDatabases,
        },
        {
          id: 'operating-etl-hosts-and-emr',
          title: 'Operating ETL Hosts & EMR',
          description: 'Run, debug, and patch EC2 ETL workers and EMR clusters with SSM.',
          readTime: '12 min',
          component: OperatingEtlHostsAndEmr,
        },
        {
          id: 'maintenance-windows-and-change-calendar',
          title: 'Maintenance Windows & Change Calendar',
          description: 'Schedule risky work safely and block changes during critical loads.',
          readTime: '11 min',
          component: MaintenanceWindowsAndChangeCalendar,
        },
        {
          id: 'hybrid-and-multi-account-operations',
          title: 'Hybrid & Multi-Account Operations',
          description: 'On-prem servers, Quick Setup, and running operations across accounts.',
          readTime: '12 min',
          component: HybridAndMultiAccountOperations,
        },
        {
          id: 'systems-manager-security-and-iam',
          title: 'Security, IAM & Session Logging',
          description: 'Least-privilege sessions, VPC endpoints, and auditable command history.',
          readTime: '12 min',
          component: SystemsManagerSecurityAndIam,
        },
        {
          id: 'systems-manager-vs-alternatives',
          title: 'Systems Manager vs Alternatives',
          description: 'SSH bastions, EC2 Instance Connect, and config tools like Ansible.',
          readTime: '11 min',
          component: SystemsManagerVsAlternatives,
        },
        {
          id: 'putting-it-together-systems-manager',
          title: 'Putting It All Together',
          description: 'Systems Manager checkpoint, interview quick checks, and what’s next (API Gateway).',
          readTime: '10 min',
          component: PuttingItTogetherSystemsManager,
        },
      ],
    },
  ],
}
