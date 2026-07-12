import type { SubTopic } from '../../../types'
import { EdgesAndRouting } from './lessons/edges-and-routing'
import { HumanInTheLoop } from './lessons/human-in-the-loop'
import { IntroductionToLanggraph } from './lessons/introduction-to-langgraph'
import { PersistenceAndCheckpointing } from './lessons/persistence-and-checkpointing'
import { PuttingItTogetherLanggraph } from './lessons/putting-it-together-langgraph'
import { ReactAgentInLanggraph } from './lessons/react-agent-in-langgraph'
import { StateGraphsAndNodes } from './lessons/state-graphs-and-nodes'
import { StateReducersAndChannels } from './lessons/state-reducers-and-channels'
import { MemGptPaper } from './lessons/papers/memgpt-paper'
import { PlanAndSolvePaper } from './lessons/papers/plan-and-solve-paper'
import { ReactLanggraphPaper } from './lessons/papers/react-langgraph-paper'
import { ReflexionPaper } from './lessons/papers/reflexion-paper'

const coreLessons = [
  { id: 'introduction-to-langgraph', title: 'Introduction to LangGraph', description: 'Stateful agent graphs vs LangChain AgentExecutor.', readTime: '8 min', component: IntroductionToLanggraph },
  { id: 'state-graphs-and-nodes', title: 'StateGraphs & Nodes', description: 'TypedDict state, node functions, compile and invoke.', readTime: '12 min', component: StateGraphsAndNodes },
  { id: 'edges-and-routing', title: 'Edges & Routing', description: 'Normal and conditional edges — the ReAct loop pattern.', readTime: '10 min', component: EdgesAndRouting },
  { id: 'state-reducers-and-channels', title: 'State & Reducers', description: 'add_messages, custom reducers, and state channels.', readTime: '10 min', component: StateReducersAndChannels },
  { id: 'human-in-the-loop', title: 'Human-in-the-Loop', description: 'interrupt_before, approval flows, and editing state at pause.', readTime: '10 min', component: HumanInTheLoop },
  { id: 'persistence-and-checkpointing', title: 'Persistence & Checkpointing', description: 'MemorySaver, SQLite, Postgres, and thread_id sessions.', readTime: '10 min', component: PersistenceAndCheckpointing },
  { id: 'react-agent-in-langgraph', title: 'ReAct Agent in LangGraph', description: 'ToolNode, tools_condition, and create_react_agent in code.', readTime: '12 min', component: ReactAgentInLanggraph },
  { id: 'putting-it-together-langgraph', title: 'Putting It Together', description: 'When to use LangGraph, production checklist, path to multi-agent.', readTime: '8 min', component: PuttingItTogetherLanggraph },
]

const paperLessons = [
  { id: 'react-langgraph-paper', title: 'ReAct', description: 'Agent loop theory — mapped to LangGraph nodes and edges.', readTime: '10 min', component: ReactLanggraphPaper },
  { id: 'reflexion-paper', title: 'Reflexion', description: 'Verbal reinforcement learning — reflection node on failure.', readTime: '10 min', component: ReflexionPaper },
  { id: 'memgpt-paper', title: 'MemGPT', description: 'OS-style memory — inspiration for checkpointing and long sessions.', readTime: '10 min', component: MemGptPaper },
  { id: 'plan-and-solve-paper', title: 'Plan-and-Solve', description: 'Planner → executor — two-node graph pattern.', readTime: '8 min', component: PlanAndSolvePaper },
]

export const langgraphSubTopic: SubTopic = {
  id: 'langgraph',
  title: 'LangGraph',
  description:
    'Build production agent workflows as stateful graphs — nodes, edges, checkpointing, human-in-the-loop, and ReAct agents in code.',
  lessonSections: [
    { id: 'core-concepts', title: 'Core Concepts', lessons: coreLessons },
    { id: 'research-papers', title: 'Research Papers', lessons: paperLessons },
  ],
}
