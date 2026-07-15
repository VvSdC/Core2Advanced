import type { SubTopic } from '../../../types'

import { ChallengesOfRlhf } from './lessons/challenges-of-rlhf'
import { CommonPitfallsRlAlignment } from './lessons/common-pitfalls-rl-alignment'
import { ComparingAlignmentMethods } from './lessons/comparing-alignment-methods'
import { DpoPart1Intuition } from './lessons/dpo-part-1-intuition'
import { DpoPart2Mechanics } from './lessons/dpo-part-2-mechanics'
import { EvaluatingAlignedModels } from './lessons/evaluating-aligned-models'
import { FromSftToAlignmentPipeline } from './lessons/from-sft-to-alignment-pipeline'
import { OnlineVsOfflineRl } from './lessons/online-vs-offline-rl'
import { OrpoKtoIpoAndFriends } from './lessons/orpo-kto-ipo-and-friends'
import { PpoPart1Intuition } from './lessons/ppo-part-1-intuition'
import { PpoPart2Mechanics } from './lessons/ppo-part-2-mechanics'
import { PracticalToolsAndStack } from './lessons/practical-tools-and-stack'
import { PreferenceDataCollection } from './lessons/preference-data-collection'
import { PuttingItTogetherReinforcementLearning } from './lessons/putting-it-together-reinforcement-learning'
import { RewardModeling } from './lessons/reward-modeling'
import { RewardSignalsAndHumanFeedback } from './lessons/reward-signals-and-human-feedback'
import { RlBasicsAbsoluteBeginners } from './lessons/rl-basics-absolute-beginners'
import { RlaifAndConstitutionalAi } from './lessons/rlaif-and-constitutional-ai'
import { RlhfOverviewEndToEnd } from './lessons/rlhf-overview-end-to-end'
import { SafetyAlignmentAndGuardrails } from './lessons/safety-alignment-and-guardrails'
import { WhatIsModelAlignment } from './lessons/what-is-model-alignment'
import { WhyRlForLlms } from './lessons/why-rl-for-llms'

const foundationsLessons = [
  {
    id: 'what-is-model-alignment',
    title: 'What Is Model Alignment?',
    description: 'Helpful, honest, harmless — how alignment steers models after SFT.',
    readTime: '12 min',
    component: WhatIsModelAlignment,
  },
  {
    id: 'why-rl-for-llms',
    title: 'Why RL for LLMs?',
    description: 'Imitation vs preference — why SFT alone cannot teach “prefer A over B”.',
    readTime: '12 min',
    component: WhyRlForLlms,
  },
  {
    id: 'rl-basics-absolute-beginners',
    title: 'RL Basics for Absolute Beginners',
    description: 'Agent, state, action, reward, policy — mapped gently onto chatbots.',
    readTime: '16 min',
    component: RlBasicsAbsoluteBeginners,
  },
  {
    id: 'from-sft-to-alignment-pipeline',
    title: 'From SFT to the Alignment Pipeline',
    description: 'Pretrain → SFT → preference / RL — InstructGPT-style big picture.',
    readTime: '14 min',
    component: FromSftToAlignmentPipeline,
  },
  {
    id: 'reward-signals-and-human-feedback',
    title: 'Reward Signals & Human Feedback',
    description: 'What a “reward” means for text — labels, bias, and sparse feedback.',
    readTime: '14 min',
    component: RewardSignalsAndHumanFeedback,
  },
]

const rlhfLessons = [
  {
    id: 'rlhf-overview-end-to-end',
    title: 'RLHF Overview End-to-End',
    description: 'SFT → reward model → PPO — the classic ChatGPT-era pipeline.',
    readTime: '14 min',
    component: RlhfOverviewEndToEnd,
  },
  {
    id: 'reward-modeling',
    title: 'Reward Modeling',
    description: 'Train a score model from preferred vs rejected answers.',
    readTime: '14 min',
    component: RewardModeling,
  },
  {
    id: 'ppo-part-1-intuition',
    title: 'PPO Part 1 — Intuition',
    description: 'Policy, KL tether to the SFT model, and why pure reward max breaks language.',
    readTime: '14 min',
    component: PpoPart1Intuition,
  },
  {
    id: 'ppo-part-2-mechanics',
    title: 'PPO Part 2 — Mechanics',
    description: 'Sample → score → carefully update — clipping and reference models in plain English.',
    readTime: '16 min',
    component: PpoPart2Mechanics,
  },
  {
    id: 'challenges-of-rlhf',
    title: 'Challenges of RLHF',
    description: 'Cost, instability, reward hacking — and when RLHF still wins.',
    readTime: '12 min',
    component: ChallengesOfRlhf,
  },
]

const preferenceLessons = [
  {
    id: 'preference-data-collection',
    title: 'Preference Data Collection',
    description: 'Chosen vs rejected pairs — guidelines, consistency, good/bad examples.',
    readTime: '14 min',
    component: PreferenceDataCollection,
  },
  {
    id: 'dpo-part-1-intuition',
    title: 'DPO Part 1 — Intuition',
    description: 'Direct Preference Optimization — skip the separate RM + PPO loop.',
    readTime: '14 min',
    component: DpoPart1Intuition,
  },
  {
    id: 'dpo-part-2-mechanics',
    title: 'DPO Part 2 — Mechanics',
    description: 'Reference policy, beta, and what the DPO loss is trying to do — in words.',
    readTime: '16 min',
    component: DpoPart2Mechanics,
  },
  {
    id: 'orpo-kto-ipo-and-friends',
    title: 'ORPO, KTO, IPO & Friends',
    description: 'When you lack pairs, want one-stage training, or need lighter alternatives.',
    readTime: '14 min',
    component: OrpoKtoIpoAndFriends,
  },
  {
    id: 'rlaif-and-constitutional-ai',
    title: 'RLAIF & Constitutional AI',
    description: 'AI feedback at scale and critique→revise with written principles.',
    readTime: '14 min',
    component: RlaifAndConstitutionalAi,
  },
]

const practiceLessons = [
  {
    id: 'comparing-alignment-methods',
    title: 'Comparing Alignment Methods',
    description: 'SFT vs RLHF vs DPO vs ORPO vs RLAIF — cost, data, and when to pick each.',
    readTime: '14 min',
    component: ComparingAlignmentMethods,
  },
  {
    id: 'online-vs-offline-rl',
    title: 'Online vs Offline RL',
    description: 'Fixed preference datasets vs generate→label→update loops.',
    readTime: '12 min',
    component: OnlineVsOfflineRl,
  },
  {
    id: 'evaluating-aligned-models',
    title: 'Evaluating Aligned Models',
    description: 'Win rates, safety axes, LLM-as-judge pitfalls, and eval checklists.',
    readTime: '14 min',
    component: EvaluatingAlignedModels,
  },
  {
    id: 'practical-tools-and-stack',
    title: 'Practical Tools & Stack',
    description: 'TRL trainers, PEFT/LoRA for alignment, and workable open-source recipes.',
    readTime: '14 min',
    component: PracticalToolsAndStack,
  },
]

const masteryLessons = [
  {
    id: 'safety-alignment-and-guardrails',
    title: 'Safety Alignment & Guardrails',
    description: 'Training alignment vs inference guardrails — complementary layers.',
    readTime: '12 min',
    component: SafetyAlignmentAndGuardrails,
  },
  {
    id: 'common-pitfalls-rl-alignment',
    title: 'Common Pitfalls',
    description: 'Weak SFT, noisy pairs, over-optimizing style — debugging flowchart.',
    readTime: '12 min',
    component: CommonPitfallsRlAlignment,
  },
  {
    id: 'putting-it-together-reinforcement-learning',
    title: 'Putting It Together',
    description: 'Mastery checklist and decision tree for RLHF vs DPO in production.',
    readTime: '14 min',
    component: PuttingItTogetherReinforcementLearning,
  },
]

export const reinforcementLearningSubTopic: SubTopic = {
  id: 'reinforcement-learning',
  title: 'Reinforcement Learning',
  description:
    'Align LLMs with human preferences from absolute zero — RL basics, RLHF, PPO, DPO, ORPO/KTO, RLAIF, and practical evaluation.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'rlhf',
      title: 'RLHF',
      sections: [{ id: 'rlhf-lessons', title: 'Lessons', lessons: rlhfLessons }],
    },
    {
      id: 'preference-methods',
      title: 'Preference Methods (DPO & Beyond)',
      sections: [{ id: 'preference-lessons', title: 'Lessons', lessons: preferenceLessons }],
    },
    {
      id: 'practice',
      title: 'Practice & Evaluation',
      sections: [{ id: 'practice-lessons', title: 'Lessons', lessons: practiceLessons }],
    },
    {
      id: 'mastery',
      title: 'Mastery',
      sections: [{ id: 'mastery-lessons', title: 'Lessons', lessons: masteryLessons }],
    },
  ],
}
