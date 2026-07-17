import type { SubTopic } from '../../../../types'

import { ApiBank } from './lessons/api-bank'
import { Bfcl } from './lessons/bfcl'
import { ChoosingAToolCallingSuite } from './lessons/choosing-a-tool-calling-suite'
import { GorillaApibench } from './lessons/gorilla-apibench'
import { Metatool } from './lessons/metatool'
import { PuttingItTogetherToolCalling } from './lessons/putting-it-together-tool-calling'
import { SchemaAstVsExecutionEvals } from './lessons/schema-ast-vs-execution-evals'
import { SingleParallelMultiturnToolUse } from './lessons/single-parallel-multiturn-tool-use'
import { StableToolbench } from './lessons/stable-toolbench'
import { TEval } from './lessons/t-eval'
import { TauBench } from './lessons/tau-bench'
import { Toolalpaca } from './lessons/toolalpaca'
import { Toolbench } from './lessons/toolbench'
import { Toolqa } from './lessons/toolqa'
import { Top10ToolCallingBenchmarksMap } from './lessons/top-10-tool-calling-benchmarks-map'
import { WhatIsToolCallingBenchmarking } from './lessons/what-is-tool-calling-benchmarking'

const foundationsLessons = [
  {
    id: 'what-is-tool-calling-benchmarking',
    title: 'What Is Tool-Calling Benchmarking?',
    description: 'Function calling / tool use evals — how they differ from helpfulness and safety suites.',
    readTime: '12 min',
    component: WhatIsToolCallingBenchmarking,
  },
  {
    id: 'schema-ast-vs-execution-evals',
    title: 'Schema, AST vs Execution Evals',
    description: 'JSON correctness, AST matching, and real tool execution — what each scoring style catches.',
    readTime: '14 min',
    component: SchemaAstVsExecutionEvals,
  },
  {
    id: 'single-parallel-multiturn-tool-use',
    title: 'Single, Parallel & Multi-Turn Tool Use',
    description: 'One call, many parallel calls, sequential agent loops, and knowing when to abstain.',
    readTime: '14 min',
    component: SingleParallelMultiturnToolUse,
  },
]

const top10Lessons = [
  {
    id: 'bfcl',
    title: 'BFCL (Berkeley Function Calling Leaderboard)',
    description: 'De facto standard — AST, live APIs, multi-turn agentic settings, and abstention.',
    readTime: '14 min',
    component: Bfcl,
  },
  {
    id: 'toolbench',
    title: 'ToolBench',
    description: 'Large-scale real-world API tool use from the ToolLLM lineage.',
    readTime: '12 min',
    component: Toolbench,
  },
  {
    id: 'api-bank',
    title: 'API-Bank',
    description: 'Decompose tool use into planning, retrieval, and calling — where agents fail.',
    readTime: '12 min',
    component: ApiBank,
  },
  {
    id: 'gorilla-apibench',
    title: 'Gorilla APIBench',
    description: 'Call the right API from documentation — the Gorilla project eval.',
    readTime: '12 min',
    component: GorillaApibench,
  },
  {
    id: 'toolalpaca',
    title: 'ToolAlpaca',
    description: 'Lightweight tool-use imitation and generalization across unseen tools.',
    readTime: '12 min',
    component: Toolalpaca,
  },
  {
    id: 't-eval',
    title: 'T-Eval',
    description: 'Step-wise evaluation of tool-augmented agents — fine-grained failure modes.',
    readTime: '12 min',
    component: TEval,
  },
  {
    id: 'metatool',
    title: 'MetaTool',
    description: 'Whether to use a tool and which tool — decisioning before argument filling.',
    readTime: '12 min',
    component: Metatool,
  },
  {
    id: 'toolqa',
    title: 'ToolQA',
    description: 'Answer questions that require external operations — tools as a means to QA.',
    readTime: '12 min',
    component: Toolqa,
  },
  {
    id: 'stable-toolbench',
    title: 'StableToolBench',
    description: 'More stable ToolBench-style evaluation — reduce API flakiness in scores.',
    readTime: '12 min',
    component: StableToolbench,
  },
  {
    id: 'tau-bench',
    title: 'τ-bench (Tau-Bench)',
    description: 'Realistic domain agents (e.g. retail/airline) — multi-turn tool use that matters.',
    readTime: '14 min',
    component: TauBench,
  },
]

const synthesisLessons = [
  {
    id: 'top-10-tool-calling-benchmarks-map',
    title: 'Top 10 Tool-Calling Benchmarks Map',
    description: 'Master map of the ten most-used suites — schema, API-scale, agentic, and QA axes.',
    readTime: '12 min',
    component: Top10ToolCallingBenchmarksMap,
  },
  {
    id: 'choosing-a-tool-calling-suite',
    title: 'Choosing a Tool-Calling Suite',
    description: 'Pick BFCL + τ-bench + ToolBench/StableToolBench for your product shape.',
    readTime: '12 min',
    component: ChoosingAToolCallingSuite,
  },
  {
    id: 'putting-it-together-tool-calling',
    title: 'Putting It Together',
    description: 'Checklist: evaluate tools, then wire agents — connect to Agents / LangGraph tracks.',
    readTime: '12 min',
    component: PuttingItTogetherToolCalling,
  },
]

export const toolCallingSubTopic: SubTopic = {
  id: 'tool-calling',
  title: 'Tool Calling',
  description:
    'Top tool-calling / function-calling benchmarks from zero — BFCL, ToolBench, API-Bank, Gorilla, ToolAlpaca, T-Eval, MetaTool, ToolQA, StableToolBench, and τ-bench.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'top-10-benchmarks',
      title: 'Top 10 Tool-Calling Benchmarks',
      sections: [{ id: 'top-10-lessons', title: 'Lessons', lessons: top10Lessons }],
    },
    {
      id: 'synthesis',
      title: 'Choosing & Interpreting',
      sections: [{ id: 'synthesis-lessons', title: 'Lessons', lessons: synthesisLessons }],
    },
  ],
}
