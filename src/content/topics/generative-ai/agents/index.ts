import type { SubTopic } from '../../../types'

import { ChoosingAgentArchitecture } from './lessons/choosing-agent-architecture'
import { CollaborativeMultiAgent } from './lessons/collaborative-multi-agent'
import { HierarchicalMultiAgent } from './lessons/hierarchical-multi-agent'
import { IntroductionToAgents } from './lessons/introduction-to-agents'
import { OrchestratorPattern } from './lessons/orchestrator-pattern'
import { PlanAndExecute } from './lessons/plan-and-execute'
import { PuttingItTogetherAgents } from './lessons/putting-it-together-agents'
import { SequentialMultiAgent } from './lessons/sequential-multi-agent'
import { SupervisorAndRouterPatterns } from './lessons/supervisor-and-router-patterns'

import { AutoGenPaper } from './lessons/papers/autogen-paper'
import { CamelPaper } from './lessons/papers/camel-paper'
import { GenerativeAgentsPaper } from './lessons/papers/generative-agents-paper'
import { MetaGptPaper } from './lessons/papers/metagpt-paper'

const coreLessons = [
  { id: 'introduction-to-agents', title: 'Introduction to Agents', description: 'Agent vs chain vs RAG; architecture landscape overview.', readTime: '8 min', component: IntroductionToAgents },
  { id: 'sequential-multi-agent', title: 'Sequential Multi-Agent', description: 'Fixed pipeline of specialist agents — A → B → C.', readTime: '10 min', component: SequentialMultiAgent },
  { id: 'hierarchical-multi-agent', title: 'Hierarchical Multi-Agent', description: 'Manager delegates to worker agents in a tree.', readTime: '10 min', component: HierarchicalMultiAgent },
  { id: 'orchestrator-pattern', title: 'Orchestrator Pattern', description: 'Central dispatcher routes tasks to expert models and tools.', readTime: '10 min', component: OrchestratorPattern },
  { id: 'supervisor-and-router-patterns', title: 'Supervisor & Router', description: 'Dynamic delegation and intent-based routing between agents.', readTime: '12 min', component: SupervisorAndRouterPatterns },
  { id: 'collaborative-multi-agent', title: 'Collaborative Multi-Agent', description: 'Debate, cooperative, and role-play agent dialogue.', readTime: '10 min', component: CollaborativeMultiAgent },
  { id: 'plan-and-execute', title: 'Plan-and-Execute', description: 'Planner creates steps; executor runs them with tools.', readTime: '10 min', component: PlanAndExecute },
  { id: 'choosing-agent-architecture', title: 'Choosing an Architecture', description: 'Decision flowchart and comparison table for all patterns.', readTime: '8 min', component: ChoosingAgentArchitecture },
  { id: 'putting-it-together-agents', title: 'Putting It Together', description: 'Production supervisor pattern, checklist, and research paper pointers.', readTime: '8 min', component: PuttingItTogetherAgents },
]

const paperLessons = [
  { id: 'generative-agents-paper', title: 'Generative Agents', description: 'Memory, reflection, and planning — believable long-horizon agents.', readTime: '10 min', component: GenerativeAgentsPaper },
  { id: 'autogen-paper', title: 'AutoGen', description: 'Multi-agent conversation framework — assistant + executor pairs.', readTime: '10 min', component: AutoGenPaper },
  { id: 'metagpt-paper', title: 'MetaGPT', description: 'SOP-driven software company as a fixed multi-agent pipeline.', readTime: '10 min', component: MetaGptPaper },
  { id: 'camel-paper', title: 'CAMEL', description: 'Role-playing cooperative agents via inception prompting.', readTime: '10 min', component: CamelPaper },
]

export const agentsSubTopic: SubTopic = {
  id: 'agents',
  title: 'Agents',
  description:
    'Agentic architectures — sequential, hierarchical, orchestrator, supervisor, collaborative, plan-and-execute — with flowcharts, LangGraph mapping, and research papers.',
  lessonSections: [
    { id: 'core-concepts', title: 'Core Concepts', lessons: coreLessons },
    { id: 'research-papers', title: 'Research Papers', lessons: paperLessons },
  ],
}
