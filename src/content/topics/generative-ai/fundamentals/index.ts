import type { SubTopic } from '../../../types'
import { HowLanguageModelsWork } from './lessons/how-language-models-work'
import { LargeLanguageModels } from './lessons/large-language-models'
import { MultimodalModels } from './lessons/multimodal-models'
import { SmallLanguageModels } from './lessons/small-language-models'
import { WhatAreModelParameters } from './lessons/what-are-model-parameters'
import { AttentionIsAllYouNeed } from './lessons/papers/attention-is-all-you-need'
import { ChinchillaScalingLaws } from './lessons/papers/chinchilla-scaling-laws'
import { ClipMultimodalLearning } from './lessons/papers/clip-multimodal-learning'
import { LlamaOpenEfficientModels } from './lessons/papers/llama-open-efficient-models'
import { ScalingLawsForLanguageModels } from './lessons/papers/scaling-laws-for-language-models'

const coreConceptLessons = [
  {
    id: 'how-language-models-work',
    title: 'How Language Models Work',
    description:
      'Next-token prediction, probability distributions, and how models choose what to write — one token at a time.',
    readTime: '12 min',
    component: HowLanguageModelsWork,
  },
  {
    id: 'what-are-model-parameters',
    title: 'What Are Model Parameters?',
    description:
      'What it means when a model has billions or trillions of parameters — weights, memory, and capacity.',
    readTime: '10 min',
    component: WhatAreModelParameters,
  },
  {
    id: 'small-language-models',
    title: 'Small Language Models (SLMs)',
    description: 'Models under 10B parameters — speed, on-device deployment, and task-specific fine-tuning.',
    readTime: '8 min',
    component: SmallLanguageModels,
  },
  {
    id: 'large-language-models',
    title: 'Large Language Models (LLMs)',
    description: 'Foundation models at scale — broad knowledge, reasoning, and the cost of size.',
    readTime: '10 min',
    component: LargeLanguageModels,
  },
  {
    id: 'multimodal-models',
    title: 'Multimodal Models',
    description: 'Models that see and hear — text, images, audio, and video in a single unified system.',
    readTime: '10 min',
    component: MultimodalModels,
  },
]

const researchPaperLessons = [
  {
    id: 'attention-is-all-you-need',
    title: 'Attention Is All You Need',
    description: 'Architecture — the Transformer behind every modern language model.',
    readTime: '14 min',
    component: AttentionIsAllYouNeed,
  },
  {
    id: 'scaling-laws-for-language-models',
    title: 'Scaling Laws (Kaplan et al.)',
    description: 'Parameters — does bigger mean better? The first rigorous scaling study.',
    readTime: '14 min',
    component: ScalingLawsForLanguageModels,
  },
  {
    id: 'chinchilla-scaling-laws',
    title: 'Chinchilla Scaling Laws',
    description: 'Parameters + data — more params alone is not enough; the ~20 tokens/param rule.',
    readTime: '14 min',
    component: ChinchillaScalingLaws,
  },
  {
    id: 'clip-multimodal-learning',
    title: 'CLIP',
    description: 'Multimodal — learning vision and language in a shared embedding space.',
    readTime: '12 min',
    component: ClipMultimodalLearning,
  },
  {
    id: 'llama-open-efficient-models',
    title: 'LLaMA: Open & Efficient Models',
    description: 'SLMs — a 13B model matched GPT-3 (175B); open weights and Chinchilla in practice.',
    readTime: '14 min',
    component: LlamaOpenEfficientModels,
  },
]

export const fundamentalsSubTopic: SubTopic = {
  id: 'fundamentals',
  title: 'Fundamentals',
  description:
    'How language models work, what parameters mean, and the SLM/LLM/multimodal landscape — plus 5 curated papers on architecture and scaling.',
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
