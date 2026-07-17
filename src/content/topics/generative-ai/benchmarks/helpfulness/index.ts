import type { SubTopic } from '../../../../types'

import { BigBenchHard } from './lessons/big-bench-hard'
import { ChoosingAHelpfulnessSuite } from './lessons/choosing-a-helpfulness-suite'
import { GpqaAndHardKnowledge } from './lessons/gpqa-and-hard-knowledge'
import { Gsm8k } from './lessons/gsm8k'
import { HellaswagArcCommonsense } from './lessons/hellaswag-arc-commonsense'
import { HelpfulnessAndCapabilityAxes } from './lessons/helpfulness-and-capability-axes'
import { HelpfulnessBenchmarksMap } from './lessons/helpfulness-benchmarks-map'
import { HowBenchmarksWork } from './lessons/how-benchmarks-work'
import { Humaneval } from './lessons/humaneval'
import { LimitationsOfHelpfulnessBenchmarks } from './lessons/limitations-of-helpfulness-benchmarks'
import { MathBenchmark } from './lessons/math-benchmark'
import { Mbpp } from './lessons/mbpp'
import { Mmlu } from './lessons/mmlu'
import { PuttingItTogetherBenchmarking } from './lessons/putting-it-together-benchmarking'
import { ReadingLeaderboards } from './lessons/reading-leaderboards'
import { SweBenchOverview } from './lessons/swe-bench-overview'
import { WhatIsLlmBenchmarking } from './lessons/what-is-llm-benchmarking'

const foundationsLessons = [
  {
    id: 'what-is-llm-benchmarking',
    title: 'What Is LLM Benchmarking?',
    description: 'Standardized tests for models — why leaderboards exist and how this track is organized.',
    readTime: '12 min',
    component: WhatIsLlmBenchmarking,
  },
  {
    id: 'how-benchmarks-work',
    title: 'How Benchmarks Work',
    description: 'Questions, scoring (accuracy, pass@k), zero-shot vs few-shot — what a score actually means.',
    readTime: '14 min',
    component: HowBenchmarksWork,
  },
  {
    id: 'helpfulness-and-capability-axes',
    title: 'Helpfulness & Capability Axes',
    description: 'Knowledge, code, math, reasoning — vs safety and chat preference. This track starts with helpfulness.',
    readTime: '12 min',
    component: HelpfulnessAndCapabilityAxes,
  },
  {
    id: 'reading-leaderboards',
    title: 'Reading Leaderboards',
    description: 'Open LLM Leaderboard, Arena Elo — same name ≠ same setup. Compare models fairly.',
    readTime: '12 min',
    component: ReadingLeaderboards,
  },
]

const knowledgeLessons = [
  {
    id: 'mmlu',
    title: 'MMLU',
    description: 'Massive Multitask Language Understanding — multitask multiple-choice knowledge across subjects.',
    readTime: '14 min',
    component: Mmlu,
  },
  {
    id: 'gpqa-and-hard-knowledge',
    title: 'GPQA & Hard Knowledge',
    description: 'Graduate-level Google-proof STEM questions — harder than typical MMLU items.',
    readTime: '12 min',
    component: GpqaAndHardKnowledge,
  },
  {
    id: 'hellaswag-arc-commonsense',
    title: 'HellaSwag, ARC & Commonsense',
    description: 'Commonsense completion and science QA — everyday reasoning, not professional exams.',
    readTime: '14 min',
    component: HellaswagArcCommonsense,
  },
]

const codeLessons = [
  {
    id: 'humaneval',
    title: 'HumanEval',
    description: 'Python function synthesis from docstrings — pass@k and what code scores do (and don’t) mean.',
    readTime: '14 min',
    component: Humaneval,
  },
  {
    id: 'mbpp',
    title: 'MBPP',
    description: 'Mostly Basic Python Problems — beginner coding tasks vs HumanEval interview style.',
    readTime: '12 min',
    component: Mbpp,
  },
  {
    id: 'swe-bench-overview',
    title: 'SWE-bench Overview',
    description: 'Real GitHub issues and patches — repository-level coding beyond single functions.',
    readTime: '14 min',
    component: SweBenchOverview,
  },
]

const mathLessons = [
  {
    id: 'gsm8k',
    title: 'GSM8K',
    description: 'Grade-school math word problems — multi-step arithmetic reasoning in language.',
    readTime: '12 min',
    component: Gsm8k,
  },
  {
    id: 'math-benchmark',
    title: 'MATH Benchmark',
    description: 'Competition-style math — harder than GSM8K; what a high score suggests.',
    readTime: '12 min',
    component: MathBenchmark,
  },
  {
    id: 'big-bench-hard',
    title: 'BIG-bench Hard (BBH)',
    description: 'Challenging multi-task reasoning from BIG-bench — broader than one subject exam.',
    readTime: '12 min',
    component: BigBenchHard,
  },
]

const synthesisLessons = [
  {
    id: 'helpfulness-benchmarks-map',
    title: 'Helpfulness Benchmarks Map',
    description: 'Master map of knowledge, code, math, and reasoning suites — and a minimal starter set.',
    readTime: '12 min',
    component: HelpfulnessBenchmarksMap,
  },
  {
    id: 'choosing-a-helpfulness-suite',
    title: 'Choosing a Helpfulness Suite',
    description: 'Pick MMLU + code + GSM8K (and when to add GPQA, MATH, SWE-bench) for your product.',
    readTime: '12 min',
    component: ChoosingAHelpfulnessSuite,
  },
  {
    id: 'limitations-of-helpfulness-benchmarks',
    title: 'Limitations of Helpfulness Benchmarks',
    description: 'Contamination, leaderboard gaming, and why chat quality ≠ MMLU.',
    readTime: '14 min',
    component: LimitationsOfHelpfulnessBenchmarks,
  },
  {
    id: 'putting-it-together-benchmarking',
    title: 'Putting It Together',
    description: 'Checklist and decision tree — interpret scores, then ship with eyes open.',
    readTime: '12 min',
    component: PuttingItTogetherBenchmarking,
  },
]

export const helpfulnessSubTopic: SubTopic = {
  id: 'helpfulness',
  title: 'Helpfulness',
  description:
    'Understand LLM helpfulness / capability benchmarks from zero — MMLU, HumanEval, MBPP, GSM8K, and more: what each measures, what scores mean, and how to read leaderboards.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'knowledge',
      title: 'Knowledge & Commonsense',
      sections: [{ id: 'knowledge-lessons', title: 'Lessons', lessons: knowledgeLessons }],
    },
    {
      id: 'code',
      title: 'Code Benchmarks',
      sections: [{ id: 'code-lessons', title: 'Lessons', lessons: codeLessons }],
    },
    {
      id: 'math-reasoning',
      title: 'Math & Reasoning',
      sections: [{ id: 'math-lessons', title: 'Lessons', lessons: mathLessons }],
    },
    {
      id: 'synthesis',
      title: 'Choosing & Interpreting',
      sections: [{ id: 'synthesis-lessons', title: 'Lessons', lessons: synthesisLessons }],
    },
  ],
}
