import type { SubTopic } from '../../../types'

import { CatastrophicForgettingAndRegularization } from './lessons/catastrophic-forgetting-and-regularization'
import { ChatTemplatesAndRoles } from './lessons/chat-templates-and-roles'
import { CommonPitfalls } from './lessons/common-pitfalls'
import { ContinuedPretraining } from './lessons/continued-pretraining'
import { DatasetPreparation } from './lessons/dataset-preparation'
import { DpoAndPreferenceMethods } from './lessons/dpo-and-preference-methods'
import { EvaluatingFineTunedModels } from './lessons/evaluating-fine-tuned-models'
import { FineTuningWithUnsloth } from './lessons/fine-tuning-with-unsloth'
import { FullVsParameterEfficient } from './lessons/full-vs-parameter-efficient'
import { HowModelsLearnDuringFineTuning } from './lessons/how-models-learn-during-fine-tuning'
import { InstructionTuning } from './lessons/instruction-tuning'
import { IntroductionToUnsloth } from './lessons/introduction-to-unsloth'
import { LoraPart1Intuition } from './lessons/lora-part-1-intuition'
import { LoraPart2Mechanics } from './lessons/lora-part-2-mechanics'
import { LoraPart3ConfigPractice } from './lessons/lora-part-3-config-practice'
import { LoraVariantsAndRelated } from './lessons/lora-variants-and-related'
import { MergingAndExportingAdapters } from './lessons/merging-and-exporting-adapters'
import { PeftOverview } from './lessons/peft-overview'
import { PreferenceTuningOverview } from './lessons/preference-tuning-overview'
import { PretrainingVsFineTuningVsRag } from './lessons/pretraining-vs-fine-tuning-vs-rag'
import { PuttingItTogetherFineTuning } from './lessons/putting-it-together-fine-tuning'
import { QloraPart1Basics } from './lessons/qlora-part-1-basics'
import { QloraPart2Nf4AndMemory } from './lessons/qlora-part-2-nf4-and-memory'
import { SupervisedFineTuningSft } from './lessons/supervised-fine-tuning-sft'
import { TrainingHyperparameters } from './lessons/training-hyperparameters'
import { TypesOfFineTuningMap } from './lessons/types-of-fine-tuning-map'
import { UnslothOptimizationTricks } from './lessons/unsloth-optimization-tricks'
import { WhatIsFineTuning } from './lessons/what-is-fine-tuning'
import { WhenToFineTune } from './lessons/when-to-fine-tune'

const foundationsLessons = [
  {
    id: 'what-is-fine-tuning',
    title: 'What Is Fine-Tuning?',
    description: 'Specialize a pretrained model on your data — the big picture from absolute zero.',
    readTime: '12 min',
    component: WhatIsFineTuning,
  },
  {
    id: 'pretraining-vs-fine-tuning-vs-rag',
    title: 'Pretraining vs Fine-Tuning vs RAG',
    description: 'Three ways to specialize an LLM — when each wins, when to combine them.',
    readTime: '14 min',
    component: PretrainingVsFineTuningVsRag,
  },
  {
    id: 'when-to-fine-tune',
    title: 'When to Fine-Tune',
    description: 'Decision tree for style, format, and domain language — vs facts that change daily.',
    readTime: '12 min',
    component: WhenToFineTune,
  },
  {
    id: 'how-models-learn-during-fine-tuning',
    title: 'How Models Learn During Fine-Tuning',
    description: 'Forward pass, loss, backward pass, and learning rate — no linear algebra required.',
    readTime: '14 min',
    component: HowModelsLearnDuringFineTuning,
  },
]

const typesLessons = [
  {
    id: 'supervised-fine-tuning-sft',
    title: 'Supervised Fine-Tuning (SFT)',
    description: 'Train on (input, desired output) pairs — the workhorse of modern LLM specialization.',
    readTime: '14 min',
    component: SupervisedFineTuningSft,
  },
  {
    id: 'instruction-tuning',
    title: 'Instruction Tuning',
    description: 'SFT on instruction→response data — why Instruct models follow directions.',
    readTime: '12 min',
    component: InstructionTuning,
  },
  {
    id: 'chat-templates-and-roles',
    title: 'Chat Templates & Roles',
    description: 'system / user / assistant formatting — wrong template breaks fine-tunes.',
    readTime: '14 min',
    component: ChatTemplatesAndRoles,
  },
  {
    id: 'continued-pretraining',
    title: 'Continued Pretraining',
    description: 'Domain adaptation on raw corpus — legal, medical, or company codebases.',
    readTime: '12 min',
    component: ContinuedPretraining,
  },
  {
    id: 'preference-tuning-overview',
    title: 'Preference Tuning Overview',
    description: 'After SFT: align with human preference — RLHF big picture and where DPO fits.',
    readTime: '14 min',
    component: PreferenceTuningOverview,
  },
  {
    id: 'dpo-and-preference-methods',
    title: 'DPO & Preference Methods',
    description: 'Direct Preference Optimization in plain English — chosen vs rejected pairs.',
    readTime: '14 min',
    component: DpoAndPreferenceMethods,
  },
  {
    id: 'full-vs-parameter-efficient',
    title: 'Full vs Parameter-Efficient',
    description: 'Update all weights or train tiny adapters — VRAM, storage, and forgetting tradeoffs.',
    readTime: '12 min',
    component: FullVsParameterEfficient,
  },
  {
    id: 'types-of-fine-tuning-map',
    title: 'Types of Fine-Tuning — Master Map',
    description: 'Taxonomy of SFT, CPT, preference, full FT, PEFT — pick the right type.',
    readTime: '12 min',
    component: TypesOfFineTuningMap,
  },
]

const algorithmsLessons = [
  {
    id: 'peft-overview',
    title: 'PEFT Overview',
    description: 'Parameter-Efficient Fine-Tuning — freeze the base, train a small plug-in.',
    readTime: '12 min',
    component: PeftOverview,
  },
  {
    id: 'lora-part-1-intuition',
    title: 'LoRA Part 1 — Intuition',
    description: 'Low-Rank Adaptation without math — frozen W plus tiny trainable A and B.',
    readTime: '14 min',
    component: LoraPart1Intuition,
  },
  {
    id: 'lora-part-2-mechanics',
    title: 'LoRA Part 2 — Mechanics',
    description: 'Rank, alpha, target modules, and the update formula explained step by step.',
    readTime: '16 min',
    component: LoraPart2Mechanics,
  },
  {
    id: 'lora-part-3-config-practice',
    title: 'LoRA Part 3 — Config & Practice',
    description: 'r, alpha, which layers to target, learning rates, and LoraConfig recipes.',
    readTime: '14 min',
    component: LoraPart3ConfigPractice,
  },
  {
    id: 'qlora-part-1-basics',
    title: 'QLoRA Part 1 — Basics',
    description: '4-bit base + LoRA adapters — fit larger models on consumer GPUs.',
    readTime: '14 min',
    component: QloraPart1Basics,
  },
  {
    id: 'qlora-part-2-nf4-and-memory',
    title: 'QLoRA Part 2 — NF4 & Memory',
    description: 'NF4, double quantization, paged optimizers, and real VRAM tables.',
    readTime: '16 min',
    component: QloraPart2Nf4AndMemory,
  },
  {
    id: 'lora-variants-and-related',
    title: 'LoRA Variants & Related Methods',
    description: 'DoRA, LoRA+, AdaLoRA, IA³ — when to care, and when to stay with LoRA/QLoRA.',
    readTime: '12 min',
    component: LoraVariantsAndRelated,
  },
  {
    id: 'catastrophic-forgetting-and-regularization',
    title: 'Catastrophic Forgetting',
    description: 'Why models lose old skills — and how to train without destroying the base.',
    readTime: '12 min',
    component: CatastrophicForgettingAndRegularization,
  },
]

const practiceLessons = [
  {
    id: 'dataset-preparation',
    title: 'Dataset Preparation',
    description: 'Collect, clean, split, and format — quality beats quantity for SFT.',
    readTime: '14 min',
    component: DatasetPreparation,
  },
  {
    id: 'training-hyperparameters',
    title: 'Training Hyperparameters',
    description: 'Learning rate, batch size, epochs, packing — beginner recipes that work.',
    readTime: '14 min',
    component: TrainingHyperparameters,
  },
  {
    id: 'evaluating-fine-tuned-models',
    title: 'Evaluating Fine-Tuned Models',
    description: 'Beyond train loss — held-out prompts, metrics, and overfitting signals.',
    readTime: '12 min',
    component: EvaluatingFineTunedModels,
  },
]

const unslothLessons = [
  {
    id: 'introduction-to-unsloth',
    title: 'Introduction to Unsloth',
    description: 'Faster, leaner LLM fine-tuning — how it relates to Transformers, TRL, and PEFT.',
    readTime: '12 min',
    component: IntroductionToUnsloth,
  },
  {
    id: 'fine-tuning-with-unsloth',
    title: 'Fine-Tuning with Unsloth',
    description: 'End-to-end SFT walkthrough — load, attach LoRA, train, save adapters.',
    readTime: '16 min',
    component: FineTuningWithUnsloth,
  },
  {
    id: 'unsloth-optimization-tricks',
    title: 'Unsloth Optimization Tricks',
    description: '4-bit, packing, gradient checkpointing, and common CUDA install pitfalls.',
    readTime: '14 min',
    component: UnslothOptimizationTricks,
  },
]

const masteryLessons = [
  {
    id: 'merging-and-exporting-adapters',
    title: 'Merging & Exporting Adapters',
    description: 'Save LoRA, merge into base, Hub, GGUF, and multi-LoRA serving paths.',
    readTime: '14 min',
    component: MergingAndExportingAdapters,
  },
  {
    id: 'common-pitfalls',
    title: 'Common Pitfalls',
    description: 'Wrong templates, leakage, bad LRs, overtraining — debugging flowchart.',
    readTime: '12 min',
    component: CommonPitfalls,
  },
  {
    id: 'putting-it-together-fine-tuning',
    title: 'Putting It Together',
    description: 'Mastery checklist, decision tree, and production readiness for fine-tunes.',
    readTime: '14 min',
    component: PuttingItTogetherFineTuning,
  },
]

export const fineTuningSubTopic: SubTopic = {
  id: 'fine-tuning',
  title: 'Fine-Tuning',
  description:
    'Specialize LLMs from absolute zero to production — SFT, instruction tuning, LoRA/QLoRA (multi-part), Unsloth, and a bridge into preference alignment (full RLHF/DPO lives in Reinforcement Learning).',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'types',
      title: 'Types of Fine-Tuning',
      sections: [{ id: 'types-lessons', title: 'Lessons', lessons: typesLessons }],
    },
    {
      id: 'algorithms',
      title: 'Algorithms (LoRA & QLoRA)',
      sections: [{ id: 'algorithms-lessons', title: 'Lessons', lessons: algorithmsLessons }],
    },
    {
      id: 'practice',
      title: 'Data & Training Practice',
      sections: [{ id: 'practice-lessons', title: 'Lessons', lessons: practiceLessons }],
    },
    {
      id: 'unsloth',
      title: 'Optimizing with Unsloth',
      sections: [{ id: 'unsloth-lessons', title: 'Lessons', lessons: unslothLessons }],
    },
    {
      id: 'mastery',
      title: 'Mastery',
      sections: [{ id: 'mastery-lessons', title: 'Lessons', lessons: masteryLessons }],
    },
  ],
}
