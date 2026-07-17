import type { SubTopic } from '../../../../types'

import { A2aWithFrameworks } from './lessons/a2a-with-frameworks'
import { AgentCardsAndDiscovery } from './lessons/agent-cards-and-discovery'
import { AuthSecurityA2a } from './lessons/auth-security-a2a'
import { BuildingAnA2aAgent } from './lessons/building-an-a2a-agent'
import { ClientDelegationPatterns } from './lessons/client-delegation-patterns'
import { CommonPitfallsA2a } from './lessons/common-pitfalls-a2a'
import { EnterpriseA2aPatterns } from './lessons/enterprise-a2a-patterns'
import { McpVsA2a } from './lessons/mcp-vs-a2a'
import { MessagesPartsAndArtifacts } from './lessons/messages-parts-and-artifacts'
import { MultiAgentOrchestrationA2a } from './lessons/multi-agent-orchestration-a2a'
import { ProtocolLandscapeAcpAndBeyond } from './lessons/protocol-landscape-acp-and-beyond'
import { PuttingItTogetherA2a } from './lessons/putting-it-together-a2a'
import { StreamingAsyncAndLongRunning } from './lessons/streaming-async-and-long-running'
import { TasksAndLifecycle } from './lessons/tasks-and-lifecycle'
import { WhatIsA2a } from './lessons/what-is-a2a'
import { WhyAgentInterop } from './lessons/why-agent-interop'

const foundationsLessons = [
  {
    id: 'what-is-a2a',
    title: 'What Is A2A?',
    description: 'Agent2Agent — how agents discover, delegate, and collaborate across vendors.',
    readTime: '12 min',
    component: WhatIsA2a,
  },
  {
    id: 'mcp-vs-a2a',
    title: 'MCP vs A2A',
    description: 'Tools vs other agents — the critical comparison every builder needs.',
    readTime: '14 min',
    component: McpVsA2a,
  },
  {
    id: 'why-agent-interop',
    title: 'Why Agent Interop Matters',
    description: 'Multi-framework, multi-vendor pain — why a shared agent language wins.',
    readTime: '12 min',
    component: WhyAgentInterop,
  },
  {
    id: 'agent-cards-and-discovery',
    title: 'Agent Cards & Discovery',
    description: 'Publish a machine-readable profile so other agents can find and use you.',
    readTime: '14 min',
    component: AgentCardsAndDiscovery,
  },
]

const coreLessons = [
  {
    id: 'tasks-and-lifecycle',
    title: 'Tasks & Lifecycle',
    description: 'Submitted → working → completed/failed — shared task state between agents.',
    readTime: '14 min',
    component: TasksAndLifecycle,
  },
  {
    id: 'messages-parts-and-artifacts',
    title: 'Messages, Parts & Artifacts',
    description: 'Text, files, and structured payloads — what agents exchange on the wire.',
    readTime: '14 min',
    component: MessagesPartsAndArtifacts,
  },
  {
    id: 'streaming-async-and-long-running',
    title: 'Streaming, Async & Long-Running',
    description: 'Long jobs without blocking — progress updates and async collaboration.',
    readTime: '14 min',
    component: StreamingAsyncAndLongRunning,
  },
  {
    id: 'auth-security-a2a',
    title: 'Auth & Security in A2A',
    description: 'Trust boundaries when agents call agents across teams and clouds.',
    readTime: '14 min',
    component: AuthSecurityA2a,
  },
]

const buildingLessons = [
  {
    id: 'building-an-a2a-agent',
    title: 'Building an A2A Agent',
    description: 'Expose capabilities via Agent Card and handle delegated tasks.',
    readTime: '16 min',
    component: BuildingAnA2aAgent,
  },
  {
    id: 'client-delegation-patterns',
    title: 'Client Delegation Patterns',
    description: 'Hire specialist agents — when to call vs when to do the work yourself.',
    readTime: '14 min',
    component: ClientDelegationPatterns,
  },
  {
    id: 'multi-agent-orchestration-a2a',
    title: 'Multi-Agent Orchestration',
    description: 'Coordinator patterns, fan-out, and composing specialist fleets with A2A.',
    readTime: '14 min',
    component: MultiAgentOrchestrationA2a,
  },
  {
    id: 'a2a-with-frameworks',
    title: 'A2A with Frameworks',
    description: 'Bridge LangGraph / Agents tracks to A2A interoperability.',
    readTime: '14 min',
    component: A2aWithFrameworks,
  },
]

const advancedLessons = [
  {
    id: 'enterprise-a2a-patterns',
    title: 'Enterprise A2A Patterns',
    description: 'Cross-org agents, governance, SLAs, and production mesh layouts.',
    readTime: '14 min',
    component: EnterpriseA2aPatterns,
  },
  {
    id: 'protocol-landscape-acp-and-beyond',
    title: 'Protocol Landscape (ACP & Beyond)',
    description: 'ACP merge context, MCP+A2A layering, and how to read the ecosystem.',
    readTime: '12 min',
    component: ProtocolLandscapeAcpAndBeyond,
  },
  {
    id: 'common-pitfalls-a2a',
    title: 'Common Pitfalls',
    description: 'Stale agent cards, missing task states, auth gaps — debugging guide.',
    readTime: '12 min',
    component: CommonPitfallsA2a,
  },
  {
    id: 'putting-it-together-a2a',
    title: 'Putting It Together',
    description: 'Mastery checklist — learn MCP first, then ship interoperable agent fleets.',
    readTime: '12 min',
    component: PuttingItTogetherA2a,
  },
]

export const a2aSubTopic: SubTopic = {
  id: 'a2a',
  title: 'A2A',
  description:
    'Agent2Agent protocol from absolute zero to enterprise — Agent Cards, tasks, messages, delegation, orchestration, and how A2A complements MCP.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'core',
      title: 'Core Protocol',
      sections: [{ id: 'core-lessons', title: 'Lessons', lessons: coreLessons }],
    },
    {
      id: 'building',
      title: 'Building with A2A',
      sections: [{ id: 'building-lessons', title: 'Lessons', lessons: buildingLessons }],
    },
    {
      id: 'advanced',
      title: 'Advanced & Enterprise',
      sections: [{ id: 'advanced-lessons', title: 'Lessons', lessons: advancedLessons }],
    },
  ],
}
