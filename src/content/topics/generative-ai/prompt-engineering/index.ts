import type { SubTopic } from '../../../types'
import { ChainOfThoughtTechnique } from './lessons/chain-of-thought-technique'
import { ChoosingTheRightTechnique } from './lessons/choosing-the-right-technique'
import { FewShotPrompting } from './lessons/few-shot-prompting'
import { GettingTheBestResults } from './lessons/getting-the-best-results'
import { IntroductionToPromptEngineering } from './lessons/introduction-to-prompt-engineering'
import { StructuredOutputPrompting } from './lessons/structured-output-prompting'
import { SystemAndRolePrompting } from './lessons/system-and-role-prompting'
import { ZeroShotPrompting } from './lessons/zero-shot-prompting'
import { ChainOfThoughtPrompting } from './lessons/papers/chain-of-thought-prompting'
import { Gpt3FewShotLearners } from './lessons/papers/gpt3-few-shot-learners'
import { InstructGptRLHF } from './lessons/papers/instructgpt-rlhf'
import { ReactReasoningAndActing } from './lessons/papers/react-reasoning-and-acting'
import { SelfConsistencyPrompting } from './lessons/papers/self-consistency-prompting'
import { ZeroShotReasoners } from './lessons/papers/zero-shot-reasoners'

const techniqueLessons = [
  {
    id: 'introduction-to-prompt-engineering',
    title: 'Introduction to Prompt Engineering',
    description: 'What prompting is, why it matters, and the techniques you will learn in this sub-topic.',
    readTime: '6 min',
    component: IntroductionToPromptEngineering,
  },
  {
    id: 'zero-shot-prompting',
    title: 'Zero-Shot Prompting',
    description: 'Instruction-only prompts — when to use them and how to write them well.',
    readTime: '8 min',
    component: ZeroShotPrompting,
  },
  {
    id: 'few-shot-prompting',
    title: 'Few-Shot Prompting',
    description: 'Teaching by example — classification, extraction, and format-sensitive tasks.',
    readTime: '8 min',
    component: FewShotPrompting,
  },
  {
    id: 'chain-of-thought-technique',
    title: 'Chain-of-Thought Prompting',
    description: 'Step-by-step reasoning for math, logic, and multi-step problems.',
    readTime: '10 min',
    component: ChainOfThoughtTechnique,
  },
  {
    id: 'system-and-role-prompting',
    title: 'System & Role Prompting',
    description: 'Persona, tone, and constraints — the system prompt behind every chatbot.',
    readTime: '8 min',
    component: SystemAndRolePrompting,
  },
  {
    id: 'structured-output-prompting',
    title: 'Structured Output Prompting',
    description: 'JSON, schemas, and machine-readable responses for pipelines and APIs.',
    readTime: '8 min',
    component: StructuredOutputPrompting,
  },
  {
    id: 'choosing-the-right-technique',
    title: 'Choosing the Right Technique',
    description: 'Decision guide — which technique to use, when to combine them, and token trade-offs.',
    readTime: '8 min',
    component: ChoosingTheRightTechnique,
  },
  {
    id: 'getting-the-best-results',
    title: 'Getting the Best Results',
    description: 'Prompt templates, temperature settings, iteration workflow, and model selection.',
    readTime: '10 min',
    component: GettingTheBestResults,
  },
]

const researchPaperLessons = [
  {
    id: 'gpt3-few-shot-learners',
    title: 'GPT-3: Few-Shot Learners',
    description: 'Foundation — zero-shot, one-shot, and few-shot prompting defined.',
    readTime: '14 min',
    component: Gpt3FewShotLearners,
  },
  {
    id: 'chain-of-thought-prompting',
    title: 'Chain-of-Thought Prompting',
    description: 'Few-shot reasoning — intermediate steps unlock multi-step math and logic.',
    readTime: '12 min',
    component: ChainOfThoughtPrompting,
  },
  {
    id: 'zero-shot-reasoners',
    title: 'Zero-Shot Reasoners',
    description: '"Let\'s think step by step" — CoT without examples.',
    readTime: '8 min',
    component: ZeroShotReasoners,
  },
  {
    id: 'self-consistency-prompting',
    title: 'Self-Consistency',
    description: 'Majority voting across multiple CoT runs for higher accuracy.',
    readTime: '8 min',
    component: SelfConsistencyPrompting,
  },
  {
    id: 'react-reasoning-and-acting',
    title: 'ReAct',
    description: 'Reasoning + tool use — the prompting pattern behind AI agents.',
    readTime: '10 min',
    component: ReactReasoningAndActing,
  },
  {
    id: 'instructgpt-rlhf',
    title: 'InstructGPT & RLHF',
    description: 'Why instruction-tuned models follow system prompts and user instructions.',
    readTime: '14 min',
    component: InstructGptRLHF,
  },
]

export const promptEngineeringSubTopic: SubTopic = {
  id: 'prompt-engineering',
  title: 'Prompt Engineering',
  description:
    'Each prompting technique in detail — when to use it, how to write it, and the research papers behind it.',
  lessonSections: [
    {
      id: 'techniques',
      title: 'Techniques',
      lessons: techniqueLessons,
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      lessons: researchPaperLessons,
    },
  ],
}
