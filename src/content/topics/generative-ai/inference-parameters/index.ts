import type { SubTopic } from '../../../types'
import { ChoosingInferenceSettings } from './lessons/choosing-inference-settings'
import { IntroductionToInferenceParameters } from './lessons/introduction-to-inference-parameters'
import { MaxTokens } from './lessons/max-tokens'
import { OtherInferenceParameters } from './lessons/other-inference-parameters'
import { StopSequences } from './lessons/stop-sequences'
import { Temperature } from './lessons/temperature'
import { TopK } from './lessons/top-k'
import { TopP } from './lessons/top-p'
import { DistillingKnowledgeSoftmaxTemperature } from './lessons/papers/distilling-knowledge-softmax-temperature'
import { HierarchicalStoryGeneration } from './lessons/papers/hierarchical-story-generation'
import { NeuralTextDegeneration } from './lessons/papers/neural-text-degeneration'
import { SamplingTemperatureLlmPerformance } from './lessons/papers/sampling-temperature-llm-performance'

const coreConceptLessons = [
  {
    id: 'introduction-to-inference-parameters',
    title: 'Introduction to Inference Parameters',
    description: 'How raw logits become a chosen token — the generation pipeline explained.',
    readTime: '6 min',
    component: IntroductionToInferenceParameters,
  },
  {
    id: 'temperature',
    title: 'Temperature',
    description: 'The softmax formula, worked examples, and how T shapes creativity vs predictability.',
    readTime: '12 min',
    component: Temperature,
  },
  {
    id: 'top-k',
    title: 'Top-K Sampling',
    description: 'Keep the K most likely tokens — filtering, renormalisation, and behaviour by K value.',
    readTime: '10 min',
    component: TopK,
  },
  {
    id: 'top-p',
    title: 'Top-P (Nucleus) Sampling',
    description: 'Cumulative probability filtering — adapts to model confidence dynamically.',
    readTime: '12 min',
    component: TopP,
  },
  {
    id: 'max-tokens',
    title: 'max_tokens',
    description: 'Output length limits, context window interaction, and choosing the right ceiling.',
    readTime: '6 min',
    component: MaxTokens,
  },
  {
    id: 'stop-sequences',
    title: 'Stop Sequences',
    description: 'Strings and special tokens that halt generation cleanly.',
    readTime: '8 min',
    component: StopSequences,
  },
  {
    id: 'other-inference-parameters',
    title: 'Other Parameters',
    description: 'frequency_penalty, presence_penalty, seed, logit_bias, and n.',
    readTime: '10 min',
    component: OtherInferenceParameters,
  },
  {
    id: 'choosing-inference-settings',
    title: 'Choosing Settings',
    description: 'How parameters interact, recommended presets per task, and common mistakes.',
    readTime: '8 min',
    component: ChoosingInferenceSettings,
  },
]

const researchPaperLessons = [
  {
    id: 'neural-text-degeneration',
    title: 'Neural Text Degeneration',
    description: 'Top-p — why greedy and beam search fail; nucleus sampling introduced.',
    readTime: '14 min',
    component: NeuralTextDegeneration,
  },
  {
    id: 'hierarchical-story-generation',
    title: 'Hierarchical Story Generation',
    description: 'Top-k — the paper that popularised filtering to the K most likely tokens.',
    readTime: '10 min',
    component: HierarchicalStoryGeneration,
  },
  {
    id: 'distilling-knowledge-softmax-temperature',
    title: 'Distilling Knowledge (Softmax T)',
    description: 'Temperature — the classic softmax temperature formula, from training to inference.',
    readTime: '12 min',
    component: DistillingKnowledgeSoftmaxTemperature,
  },
  {
    id: 'sampling-temperature-llm-performance',
    title: 'Temperature & Task Performance',
    description: 'Empirical study — how T affects correctness on math, code, and creative tasks.',
    readTime: '10 min',
    component: SamplingTemperatureLlmPerformance,
  },
]

export const inferenceParametersSubTopic: SubTopic = {
  id: 'inference-parameters',
  title: 'Inference Parameters',
  description:
    'Temperature, top-p, top-k, max_tokens, stop sequences, and every knob that controls how a model generates text — plus 4 curated papers on decoding and sampling.',
  lessonSections: [
    {
      id: 'core-concepts',
      title: 'Core Concepts',
      lessons: coreConceptLessons,
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      lessons: researchPaperLessons,
    },
  ],
}
