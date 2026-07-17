import type { SubTopic } from '../../../../types'

import { AsleepAtTheKeyboard } from './lessons/asleep-at-the-keyboard'
import { Baxbench } from './lessons/baxbench'
import { ChoosingASecureCodeSuite } from './lessons/choosing-a-secure-code-suite'
import { CodeguardPlus } from './lessons/codeguard-plus'
import { Codelmsec } from './lessons/codelmsec'
import { CweStaticAnalysisAndOracles } from './lessons/cwe-static-analysis-and-oracles'
import { Cweval } from './lessons/cweval'
import { Cyberseceval } from './lessons/cyberseceval'
import { InstructVsAutocompleteSecurity } from './lessons/instruct-vs-autocomplete-security'
import { Llmseceval } from './lessons/llmseceval'
import { PuttingItTogetherSecureCodeGeneration } from './lessons/putting-it-together-secure-code-generation'
import { Redcode } from './lessons/redcode'
import { Seccodeplt } from './lessons/seccodeplt'
import { Securityeval } from './lessons/securityeval'
import { Top10SecureCodeBenchmarksMap } from './lessons/top-10-secure-code-benchmarks-map'
import { WhatIsSecureCodeGeneration } from './lessons/what-is-secure-code-generation'

const foundationsLessons = [
  {
    id: 'what-is-secure-code-generation',
    title: 'What Is Secure Code Generation?',
    description: 'Passing HumanEval ≠ secure code — CWEs, copilots, and how this track differs from chat safety.',
    readTime: '12 min',
    component: WhatIsSecureCodeGeneration,
  },
  {
    id: 'instruct-vs-autocomplete-security',
    title: 'Instruct vs Autocomplete Security',
    description: 'NL codegen vs IDE continuation — two ways models introduce insecure patterns.',
    readTime: '14 min',
    component: InstructVsAutocompleteSecurity,
  },
  {
    id: 'cwe-static-analysis-and-oracles',
    title: 'CWE, Static Analysis & Oracles',
    description: 'How benchmarks detect insecure code — analyzers, tests, and dynamic oracles.',
    readTime: '14 min',
    component: CweStaticAnalysisAndOracles,
  },
]

const top10Lessons = [
  {
    id: 'cyberseceval',
    title: 'CyberSecEval (Purple Llama)',
    description: 'Meta’s large suite for insecure code generation and related cyber-assist risks.',
    readTime: '14 min',
    component: Cyberseceval,
  },
  {
    id: 'securityeval',
    title: 'SecurityEval',
    description: 'Curated CWE-focused prompts for measuring vulnerable code generation.',
    readTime: '12 min',
    component: Securityeval,
  },
  {
    id: 'asleep-at-the-keyboard',
    title: 'Asleep at the Keyboard',
    description: 'Seminal Copilot CWE scenarios — diversity of weaknesses, prompts, and domains.',
    readTime: '14 min',
    component: AsleepAtTheKeyboard,
  },
  {
    id: 'codelmsec',
    title: 'CodeLMSec',
    description: 'Black-box evaluation of how often code LMs emit high-risk vulnerabilities.',
    readTime: '12 min',
    component: Codelmsec,
  },
  {
    id: 'llmseceval',
    title: 'LLMSecEval',
    description: 'Natural-language prompts aligned with Top-25 CWE-style security scenarios.',
    readTime: '12 min',
    component: Llmseceval,
  },
  {
    id: 'cweval',
    title: 'CWEval',
    description: 'Same tasks scored for functionality and security — not security alone.',
    readTime: '14 min',
    component: Cweval,
  },
  {
    id: 'baxbench',
    title: 'BaxBench',
    description: 'Secure and correct multi-file backend generation — closer to real apps.',
    readTime: '14 min',
    component: Baxbench,
  },
  {
    id: 'seccodeplt',
    title: 'SecCodePLT',
    description: 'Security-oriented code platform / benchmark for vulnerability-prone generation.',
    readTime: '12 min',
    component: Seccodeplt,
  },
  {
    id: 'codeguard-plus',
    title: 'CodeGuard+',
    description: 'Code security evaluation suite for generated programs and common weakness patterns.',
    readTime: '12 min',
    component: CodeguardPlus,
  },
  {
    id: 'redcode',
    title: 'RedCode',
    description: 'Malicious / abusive code generation risk — contrast with insecure-but-benign bugs.',
    readTime: '12 min',
    component: Redcode,
  },
]

const synthesisLessons = [
  {
    id: 'top-10-secure-code-benchmarks-map',
    title: 'Top 10 Secure Code Benchmarks Map',
    description: 'Master map of the ten suites — autocomplete vs instruct, CWE, correctness+security, backends.',
    readTime: '12 min',
    component: Top10SecureCodeBenchmarksMap,
  },
  {
    id: 'choosing-a-secure-code-suite',
    title: 'Choosing a Secure Code Suite',
    description: 'Pick CyberSecEval + CWE scenarios + CWEval/BaxBench for your product shape.',
    readTime: '12 min',
    component: ChoosingASecureCodeSuite,
  },
  {
    id: 'putting-it-together-secure-code-generation',
    title: 'Putting It Together',
    description: 'Checklist: pair with Helpfulness code and Secure Text Generation — ship copilots carefully.',
    readTime: '12 min',
    component: PuttingItTogetherSecureCodeGeneration,
  },
]

export const secureCodeGenerationSubTopic: SubTopic = {
  id: 'secure-code-generation',
  title: 'Secure Code Generation',
  description:
    'Top secure code generation benchmarks from zero — CyberSecEval, SecurityEval, Asleep at the Keyboard, CodeLMSec, LLMSecEval, CWEval, BaxBench, SecCodePLT, CodeGuard+, and RedCode.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'top-10-benchmarks',
      title: 'Top 10 Secure Code Benchmarks',
      sections: [{ id: 'top-10-lessons', title: 'Lessons', lessons: top10Lessons }],
    },
    {
      id: 'synthesis',
      title: 'Choosing & Interpreting',
      sections: [{ id: 'synthesis-lessons', title: 'Lessons', lessons: synthesisLessons }],
    },
  ],
}
