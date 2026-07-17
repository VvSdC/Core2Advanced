import type { SubTopic } from '../../../../types'

import { Advbench } from './lessons/advbench'
import { AirBench } from './lessons/air-bench'
import { BbqBias } from './lessons/bbq-bias'
import { ChoosingASafetySuite } from './lessons/choosing-a-safety-suite'
import { CompletionVsChatSafetyEvals } from './lessons/completion-vs-chat-safety-evals'
import { DoNotAnswer } from './lessons/do-not-answer'
import { Harmbench } from './lessons/harmbench'
import { JailbreakBench } from './lessons/jailbreak-bench'
import { PuttingItTogetherSecureTextGeneration } from './lessons/putting-it-together-secure-text-generation'
import { RealToxicityPrompts } from './lessons/real-toxicity-prompts'
import { SafetyMetricsAsrRefusal } from './lessons/safety-metrics-asr-refusal'
import { Safetybench } from './lessons/safetybench'
import { Top10SafetyBenchmarksMap } from './lessons/top-10-safety-benchmarks-map'
import { Truthfulqa } from './lessons/truthfulqa'
import { WhatIsSecureTextGeneration } from './lessons/what-is-secure-text-generation'
import { Xstest } from './lessons/xstest'

const foundationsLessons = [
  {
    id: 'what-is-secure-text-generation',
    title: 'What Is Secure Text Generation?',
    description: 'Safe refusals vs over-refusal — how safety benchmarks differ from helpfulness.',
    readTime: '12 min',
    component: WhatIsSecureTextGeneration,
  },
  {
    id: 'completion-vs-chat-safety-evals',
    title: 'Completion vs Chat Safety Evals',
    description: 'Toxic continuations vs multi-turn chat refusals — when each evaluation style is used.',
    readTime: '14 min',
    component: CompletionVsChatSafetyEvals,
  },
  {
    id: 'safety-metrics-asr-refusal',
    title: 'Safety Metrics: ASR & Refusal',
    description: 'Attack success rate, refusal rate, over-refusal, and judge classifiers explained.',
    readTime: '14 min',
    component: SafetyMetricsAsrRefusal,
  },
]

const top10Lessons = [
  {
    id: 'air-bench',
    title: 'Stanford AIR-Bench',
    description: 'Policy- and regulation-aligned AI risk categories — what AIR-Bench actually scores.',
    readTime: '14 min',
    component: AirBench,
  },
  {
    id: 'harmbench',
    title: 'HarmBench',
    description: 'Standardized red-teaming and robust refusal — a de facto safety audit framework.',
    readTime: '14 min',
    component: Harmbench,
  },
  {
    id: 'advbench',
    title: 'AdvBench',
    description: 'Adversarial harmful instructions and jailbreak-style attack evaluation.',
    readTime: '12 min',
    component: Advbench,
  },
  {
    id: 'real-toxicity-prompts',
    title: 'RealToxicityPrompts',
    description: 'Completion-based toxicity — does the model continue web prompts into toxic text?',
    readTime: '12 min',
    component: RealToxicityPrompts,
  },
  {
    id: 'truthfulqa',
    title: 'TruthfulQA',
    description: 'Avoid mimicking common human falsehoods — truthfulness under misconception pressure.',
    readTime: '14 min',
    component: Truthfulqa,
  },
  {
    id: 'bbq-bias',
    title: 'BBQ (Bias Benchmark for QA)',
    description: 'Demographic bias in question answering — when context is ambiguous or underspecified.',
    readTime: '12 min',
    component: BbqBias,
  },
  {
    id: 'xstest',
    title: 'XSTest',
    description: 'Exaggerated safety — catching over-refusal of benign prompts that sound risky.',
    readTime: '12 min',
    component: Xstest,
  },
  {
    id: 'safetybench',
    title: 'SafetyBench',
    description: 'Multi-category safety knowledge and judgment across common risk types.',
    readTime: '12 min',
    component: Safetybench,
  },
  {
    id: 'jailbreak-bench',
    title: 'JailbreakBench',
    description: 'Standardized jailbreak attack success — how often defenses fail under attack.',
    readTime: '12 min',
    component: JailbreakBench,
  },
  {
    id: 'do-not-answer',
    title: 'Do-Not-Answer',
    description: 'Questions that should not receive harmful answers — chat-style refusal quality.',
    readTime: '12 min',
    component: DoNotAnswer,
  },
]

const synthesisLessons = [
  {
    id: 'top-10-safety-benchmarks-map',
    title: 'Top 10 Safety Benchmarks Map',
    description: 'Master map of the ten most-used safety suites — axes, completion vs chat, and roles.',
    readTime: '12 min',
    component: Top10SafetyBenchmarksMap,
  },
  {
    id: 'choosing-a-safety-suite',
    title: 'Choosing a Safety Suite',
    description: 'Pick a minimal, honest safety eval stack for your product risk profile.',
    readTime: '12 min',
    component: ChoosingASafetySuite,
  },
  {
    id: 'putting-it-together-secure-text-generation',
    title: 'Putting It Together',
    description: 'Checklist: pair safety with helpfulness, interpret ASR/refusal, ship carefully.',
    readTime: '12 min',
    component: PuttingItTogetherSecureTextGeneration,
  },
]

export const secureTextGenerationSubTopic: SubTopic = {
  id: 'secure-text-generation',
  title: 'Secure Text Generation',
  description:
    'Safety and secure generation benchmarks from zero — AIR-Bench, HarmBench, AdvBench, RealToxicityPrompts, TruthfulQA, BBQ, XSTest, SafetyBench, JailbreakBench, and Do-Not-Answer.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'top-10-benchmarks',
      title: 'Top 10 Safety Benchmarks',
      sections: [{ id: 'top-10-lessons', title: 'Lessons', lessons: top10Lessons }],
    },
    {
      id: 'synthesis',
      title: 'Choosing & Interpreting',
      sections: [{ id: 'synthesis-lessons', title: 'Lessons', lessons: synthesisLessons }],
    },
  ],
}
