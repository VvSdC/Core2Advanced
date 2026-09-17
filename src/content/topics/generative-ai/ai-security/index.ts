import type { SubTopic } from '../../../types'

import { WhatAreAiGuardrails } from './lessons/what-are-ai-guardrails'
import { GuardrailTypesAndPlacement } from './lessons/guardrail-types-and-placement'
import { AgentAndAssistantHooks } from './lessons/agent-and-assistant-hooks'
import { HooksForCodingAssistants } from './lessons/hooks-for-coding-assistants'

const guardrailsLessons = [
  {
    id: 'what-are-ai-guardrails',
    title: 'What Are AI Guardrails?',
    description:
      'Run-time checks around a model — input, output, and tool checkpoints; deterministic vs model-based; block, redact, regenerate, or log.',
    readTime: '12 min',
    component: WhatAreAiGuardrails,
  },
  {
    id: 'guardrail-types-and-placement',
    title: 'Guardrail Types & Placement',
    description:
      'The concrete guardrail categories and the architecture around them — inline vs parallel vs async, streaming traps, and fail-open vs fail-closed.',
    readTime: '14 min',
    component: GuardrailTypesAndPlacement,
  },
]

const hooksLessons = [
  {
    id: 'agent-and-assistant-hooks',
    title: 'Agent & Dev-Assistant Hooks',
    description:
      'Hooks are deterministic control points in an agent loop — the lifecycle events, why agents need them, and how a hook communicates allow/deny.',
    readTime: '14 min',
    component: AgentAndAssistantHooks,
  },
  {
    id: 'hooks-for-coding-assistants',
    title: 'Hooks for Coding Assistants',
    description:
      'Claude Code and GitHub Copilot hooks in practice — block irreversible commands, stop supply-chain attacks, redact PII, and run SAST on every edit.',
    readTime: '16 min',
    component: HooksForCodingAssistants,
  },
]

export const aiSecuritySubTopic: SubTopic = {
  id: 'ai-security',
  title: 'AI Security & Guardrails',
  description:
    'Make LLM and agent systems safe to ship — run-time guardrails and deterministic hooks that gate inputs, outputs, and real-world actions.',
  lessonSections: [
    { id: 'guardrails', title: 'Guardrails', lessons: guardrailsLessons },
    { id: 'dev-assistant-hooks', title: 'AI Dev-Assistant Hooks', lessons: hooksLessons },
  ],
}
