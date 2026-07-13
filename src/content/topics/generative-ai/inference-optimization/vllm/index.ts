import type { SubTopic } from '../../../../types'

import { ComparingInferenceEngines } from './lessons/comparing-inference-engines'
import { ContinuousBatching } from './lessons/continuous-batching'
import { DeploymentPatterns } from './lessons/deployment-patterns'
import { DisaggregatedServing } from './lessons/disaggregated-serving'
import { EngineArgumentsAndConfig } from './lessons/engine-arguments-and-config'
import { GpusAndMemoryBasics } from './lessons/gpus-and-memory-basics'
import { InstallationAndHardware } from './lessons/installation-and-hardware'
import { IntroductionToVllm } from './lessons/introduction-to-vllm'
import { KvCacheExplained } from './lessons/kv-cache-explained'
import { LlmInferenceBasics } from './lessons/llm-inference-basics'
import { MonitoringAndBenchmarking } from './lessons/monitoring-and-benchmarking'
import { MultiLoraServing } from './lessons/multi-lora-serving'
import { OfflineInference } from './lessons/offline-inference'
import { OpenaiCompatibleServer } from './lessons/openai-compatible-server'
import { PagedAttention } from './lessons/pagedattention'
import { PrefixCachingAndChunkedPrefill } from './lessons/prefix-caching-and-chunked-prefill'
import { PuttingItTogetherVllm } from './lessons/putting-it-together-vllm'
import { QuantizationWithVllm } from './lessons/quantization-with-vllm'
import { SchedulerAndRequestLifecycle } from './lessons/scheduler-and-request-lifecycle'
import { SpeculativeDecoding } from './lessons/speculative-decoding'
import { TensorAndPipelineParallelism } from './lessons/tensor-and-pipeline-parallelism'
import { ThroughputVsLatency } from './lessons/throughput-vs-latency'
import { TrainingVsInference } from './lessons/training-vs-inference'
import { VllmArchitectureOverview } from './lessons/vllm-architecture-overview'
import { WhyInferenceOptimization } from './lessons/why-inference-optimization'

const foundationsLessons = [
  { id: 'why-inference-optimization', title: 'Why Inference Optimization?', description: 'From API apps to self-hosted GPUs — why naive serving fails and what vLLM fixes.', readTime: '10 min', component: WhyInferenceOptimization },
  { id: 'training-vs-inference', title: 'Training vs Inference', description: 'Forward-only serving vs backward-pass training — different engineering constraints.', readTime: '12 min', component: TrainingVsInference },
  { id: 'llm-inference-basics', title: 'LLM Inference Basics', description: 'Prefill vs decode, autoregressive loop, and why decode is the bottleneck.', readTime: '14 min', component: LlmInferenceBasics },
  { id: 'gpus-and-memory-basics', title: 'GPUs & Memory Basics', description: 'VRAM, model weights, KV cache, OOM — GPU concepts from zero.', readTime: '14 min', component: GpusAndMemoryBasics },
  { id: 'introduction-to-vllm', title: 'Introduction to vLLM', description: 'What vLLM is, PagedAttention origin, vs HuggingFace and Ollama.', readTime: '12 min', component: IntroductionToVllm },
]

const architectureLessons = [
  { id: 'kv-cache-explained', title: 'KV Cache Explained', description: 'Why past tokens need memory, how KV cache works, and why it dominates VRAM.', readTime: '14 min', component: KvCacheExplained },
  { id: 'pagedattention', title: 'PagedAttention', description: 'OS-style memory paging for KV cache — the core vLLM innovation.', readTime: '14 min', component: PagedAttention },
  { id: 'continuous-batching', title: 'Continuous Batching', description: 'Iteration-level scheduling — add and remove requests mid-flight.', readTime: '12 min', component: ContinuousBatching },
  { id: 'vllm-architecture-overview', title: 'vLLM Architecture', description: 'API server → engine → scheduler → executor → workers — full system map.', readTime: '14 min', component: VllmArchitectureOverview },
  { id: 'scheduler-and-request-lifecycle', title: 'Scheduler & Request Lifecycle', description: 'Waiting → prefill → decode → finished — what happens under load.', readTime: '12 min', component: SchedulerAndRequestLifecycle },
]

const gettingStartedLessons = [
  { id: 'installation-and-hardware', title: 'Installation & Hardware', description: 'pip install, CUDA, VRAM requirements by model size, common errors.', readTime: '12 min', component: InstallationAndHardware },
  { id: 'offline-inference', title: 'Offline Inference', description: 'LLM class, SamplingParams, and llm.generate() with code examples.', readTime: '12 min', component: OfflineInference },
  { id: 'openai-compatible-server', title: 'OpenAI-Compatible Server', description: 'vllm serve, curl, OpenAI SDK, and LangChain integration.', readTime: '14 min', component: OpenaiCompatibleServer },
  { id: 'engine-arguments-and-config', title: 'Engine Arguments & Config', description: 'tensor-parallel-size, max-model-len, gpu-memory-utilization explained.', readTime: '12 min', component: EngineArgumentsAndConfig },
]

const optimizationLessons = [
  { id: 'quantization-with-vllm', title: 'Quantization', description: 'AWQ, GPTQ, FP8 — fit bigger models on smaller GPUs with quality tradeoffs.', readTime: '14 min', component: QuantizationWithVllm },
  { id: 'tensor-and-pipeline-parallelism', title: 'Tensor & Pipeline Parallelism', description: 'Split models across multiple GPUs — when to use TP vs PP.', readTime: '14 min', component: TensorAndPipelineParallelism },
  { id: 'multi-lora-serving', title: 'Multi-LoRA Serving', description: 'Serve hundreds of LoRA adapters on one base model simultaneously.', readTime: '12 min', component: MultiLoraServing },
  { id: 'prefix-caching-and-chunked-prefill', title: 'Prefix Caching & Chunked Prefill', description: 'Reuse KV for shared system prompts; optimize long prefills.', readTime: '12 min', component: PrefixCachingAndChunkedPrefill },
]

const productionLessons = [
  { id: 'throughput-vs-latency', title: 'Throughput vs Latency', description: 'TTFT, TPOT, max_num_seqs — tuning for your SLA.', readTime: '12 min', component: ThroughputVsLatency },
  { id: 'speculative-decoding', title: 'Speculative Decoding', description: 'Draft model proposes tokens, target model verifies — free speedup.', readTime: '14 min', component: SpeculativeDecoding },
  { id: 'monitoring-and-benchmarking', title: 'Monitoring & Benchmarking', description: 'Metrics, logs, and benchmarking with ShareGPT-style workloads.', readTime: '12 min', component: MonitoringAndBenchmarking },
  { id: 'deployment-patterns', title: 'Deployment Patterns', description: 'Docker, Kubernetes, load balancers, and health checks.', readTime: '14 min', component: DeploymentPatterns },
]

const masteryLessons = [
  { id: 'disaggregated-serving', title: 'Disaggregated Serving', description: 'Separate prefill and decode nodes — the vLLM V1 direction.', readTime: '14 min', component: DisaggregatedServing },
  { id: 'comparing-inference-engines', title: 'Comparing Inference Engines', description: 'vLLM vs TGI vs TensorRT-LLM vs Ollama vs llama.cpp — pick the right tool.', readTime: '12 min', component: ComparingInferenceEngines },
  { id: 'putting-it-together-vllm', title: 'Putting It Together', description: 'Mastery checklist, config decision tree, and production readiness.', readTime: '12 min', component: PuttingItTogetherVllm },
]

export const vllmSubTopic: SubTopic = {
  id: 'vllm',
  title: 'vLLM',
  description:
    'High-throughput LLM serving from absolute zero to production mastery — PagedAttention, continuous batching, quantization, parallelism, and deployment.',
  lessonTracks: [
    {
      id: 'foundations',
      title: 'Foundations',
      sections: [{ id: 'foundations-lessons', title: 'Lessons', lessons: foundationsLessons }],
    },
    {
      id: 'architecture',
      title: 'Architecture',
      sections: [{ id: 'architecture-lessons', title: 'Lessons', lessons: architectureLessons }],
    },
    {
      id: 'getting-started',
      title: 'Getting Started',
      sections: [{ id: 'getting-started-lessons', title: 'Lessons', lessons: gettingStartedLessons }],
    },
    {
      id: 'optimization',
      title: 'Optimization',
      sections: [{ id: 'optimization-lessons', title: 'Lessons', lessons: optimizationLessons }],
    },
    {
      id: 'production',
      title: 'Production',
      sections: [{ id: 'production-lessons', title: 'Lessons', lessons: productionLessons }],
    },
    {
      id: 'mastery',
      title: 'Mastery',
      sections: [{ id: 'mastery-lessons', title: 'Lessons', lessons: masteryLessons }],
    },
  ],
}
