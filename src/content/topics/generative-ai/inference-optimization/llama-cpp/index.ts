import type { SubTopic } from '../../../../types'

import { AdvancedWorkflows } from './lessons/advanced-workflows'
import { BenchmarkingAndProfiling } from './lessons/benchmarking-and-profiling'
import { ContextMemoryAndKvCache } from './lessons/context-memory-and-kv-cache'
import { CpuGpuAndLocalInference } from './lessons/cpu-gpu-and-local-inference'
import { EmbeddingAndRerankingModels } from './lessons/embedding-and-reranking-models'
import { FirstRunCli } from './lessons/first-run-cli'
import { GgmlAndBackends } from './lessons/ggml-and-backends'
import { GgufAndModelFiles } from './lessons/gguf-and-model-files'
import { GpuOffloadingAndLayerSplit } from './lessons/gpu-offloading-and-layer-split'
import { InstallationAndBuild } from './lessons/installation-and-build'
import { IntroductionToLlamaCpp } from './lessons/introduction-to-llama-cpp'
import { LlamaCppArchitecture } from './lessons/llama-cpp-architecture'
import { LlamaCppVsVllm } from './lessons/llama-cpp-vs-vllm'
import { LlamaServerBasics } from './lessons/llama-server-basics'
import { LocalLlmInferenceBasics } from './lessons/local-llm-inference-basics'
import { MultimodalAndVision } from './lessons/multimodal-and-vision'
import { OllamaVsLlamaCpp } from './lessons/ollama-vs-llama-cpp'
import { OpenaiApiAndIntegrations } from './lessons/openai-api-and-integrations'
import { PerformanceTuning } from './lessons/performance-tuning'
import { ProductionDeployment } from './lessons/production-deployment'
import { PuttingItTogetherLlamaCpp } from './lessons/putting-it-together-llama-cpp'
import { QuantizationDeepDive } from './lessons/quantization-deep-dive'
import { SamplingAndDecoding } from './lessons/sampling-and-decoding'
import { WhyLlamaCpp } from './lessons/why-llama-cpp'

const foundationsLessons = [
  { id: 'why-llama-cpp', title: 'Why llama.cpp?', description: 'Privacy, offline use, no datacenter GPU — when local inference wins over cloud APIs.', readTime: '10 min', component: WhyLlamaCpp },
  { id: 'cpu-gpu-and-local-inference', title: 'CPU, GPU & Local Inference', description: 'RAM vs VRAM, Apple Silicon, NVIDIA, AMD — hardware for running models on your machine.', readTime: '12 min', component: CpuGpuAndLocalInference },
  { id: 'local-llm-inference-basics', title: 'Local LLM Inference Basics', description: 'Tokens, prefill vs decode, and the autoregressive loop — explained for first-time local users.', readTime: '12 min', component: LocalLlmInferenceBasics },
  { id: 'gguf-and-model-files', title: 'GGUF & Model Files', description: 'What GGUF is, where to download models, and how to read quant names like Q4_K_M.', readTime: '12 min', component: GgufAndModelFiles },
  { id: 'introduction-to-llama-cpp', title: 'Introduction to llama.cpp', description: 'Georgi Gerganov, C/C++ inference, Ollama relationship, vs vLLM positioning.', readTime: '12 min', component: IntroductionToLlamaCpp },
  { id: 'ggml-and-backends', title: 'GGML & Backends', description: 'CPU AVX, CUDA, Metal, Vulkan — how llama.cpp runs on any hardware.', readTime: '12 min', component: GgmlAndBackends },
]

const architectureLessons = [
  { id: 'quantization-deep-dive', title: 'Quantization Deep Dive', description: 'Q4_K_M, Q5_K_M, Q8_0, IQ quants — pick the right size vs quality tradeoff.', readTime: '14 min', component: QuantizationDeepDive },
  { id: 'llama-cpp-architecture', title: 'llama.cpp Architecture', description: 'Repo layout, llama-cli, llama-server, llama-bench — how the inference loop works.', readTime: '12 min', component: LlamaCppArchitecture },
  { id: 'context-memory-and-kv-cache', title: 'Context, Memory & KV Cache', description: 'n_ctx, n_batch, memory estimation, and why context length limits matter.', readTime: '14 min', component: ContextMemoryAndKvCache },
  { id: 'sampling-and-decoding', title: 'Sampling & Decoding', description: 'temperature, top_p, repeat_penalty, grammar (GBNF) — control model output.', readTime: '12 min', component: SamplingAndDecoding },
]

const gettingStartedLessons = [
  { id: 'installation-and-build', title: 'Installation & Build', description: 'Prebuilt binaries, cmake, Homebrew, Windows, Docker — get llama.cpp running.', readTime: '14 min', component: InstallationAndBuild },
  { id: 'first-run-cli', title: 'First Run — CLI', description: 'llama-cli flags, one-shot prompts, and interactive chat mode.', readTime: '12 min', component: FirstRunCli },
  { id: 'llama-server-basics', title: 'llama-server Basics', description: 'HTTP API, chat completions, streaming SSE — turn CLI into a service.', readTime: '12 min', component: LlamaServerBasics },
  { id: 'openai-api-and-integrations', title: 'OpenAI API & Integrations', description: 'OpenAI-compatible endpoints with curl, Python SDK, and LangChain.', readTime: '14 min', component: OpenaiApiAndIntegrations },
]

const optimizationLessons = [
  { id: 'gpu-offloading-and-layer-split', title: 'GPU Offloading & Layer Split', description: '-ngl / --n-gpu-layers — partial CPU+GPU when VRAM is tight.', readTime: '12 min', component: GpuOffloadingAndLayerSplit },
  { id: 'performance-tuning', title: 'Performance Tuning', description: 'Threads, batch, ctx, flash attention, mmap — squeeze max tokens/sec.', readTime: '14 min', component: PerformanceTuning },
  { id: 'embedding-and-reranking-models', title: 'Embeddings & Reranking', description: 'Run embedding GGUF models locally for RAG pipelines.', readTime: '12 min', component: EmbeddingAndRerankingModels },
  { id: 'multimodal-and-vision', title: 'Multimodal & Vision', description: 'LLaVA and image input — vision models with llama.cpp.', readTime: '12 min', component: MultimodalAndVision },
]

const productionLessons = [
  { id: 'ollama-vs-llama-cpp', title: 'Ollama vs llama.cpp', description: 'When Ollama convenience wins vs raw llama.cpp control.', readTime: '12 min', component: OllamaVsLlamaCpp },
  { id: 'production-deployment', title: 'Production Deployment', description: 'systemd, Docker, reverse proxy, health checks, resource limits.', readTime: '14 min', component: ProductionDeployment },
  { id: 'benchmarking-and-profiling', title: 'Benchmarking & Profiling', description: 'llama-bench, pp/tg metrics, comparing quants on your hardware.', readTime: '12 min', component: BenchmarkingAndProfiling },
]

const masteryLessons = [
  { id: 'llama-cpp-vs-vllm', title: 'llama.cpp vs vLLM', description: 'Laptop vs datacenter, single user vs 100 concurrent — pick the right engine.', readTime: '12 min', component: LlamaCppVsVllm },
  { id: 'advanced-workflows', title: 'Advanced Workflows', description: 'convert_hf_to_gguf, LoRA merge, custom quantize, RPC overview.', readTime: '14 min', component: AdvancedWorkflows },
  { id: 'putting-it-together-llama-cpp', title: 'Putting It Together', description: 'Mastery checklist, decision tree, and production readiness recap.', readTime: '12 min', component: PuttingItTogetherLlamaCpp },
]

export const llamaCppSubTopic: SubTopic = {
  id: 'llama-cpp',
  title: 'llama.cpp',
  description:
    'Run LLMs locally on CPU, GPU, or Apple Silicon — GGUF, quantization, llama-server, and production deployment from zero to mastery.',
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
