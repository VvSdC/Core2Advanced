import type { SubTopic } from '../../../types'

// Start Here
import { WhatIsGenerativeAI } from './lessons/what-is-generative-ai'
import { WhatIsAToken } from './lessons/what-is-a-token'
import { HowLanguageModelsWork } from './lessons/how-language-models-work'

// Inside the Model
import { NeuralNetworksPrimer } from './lessons/neural-networks-primer'
import { EmbeddingsAndVectorSpace } from './lessons/embeddings-and-vector-space'
import { TheTransformerArchitecture } from './lessons/the-transformer-architecture'
import { SelfAttentionExplained } from './lessons/self-attention-explained'
import { WhatAreModelParameters } from './lessons/what-are-model-parameters'
import { TheModernLlmBlock } from './lessons/the-modern-llm-block'

// The Bigger Picture
import { HowLlmsAreTrained } from './lessons/how-llms-are-trained'
import { ContextWindowsAndKvCache } from './lessons/context-windows-and-kv-cache'
import { PrefillDecodeAndLatency } from './lessons/prefill-decode-and-latency'
import { PromptCaching } from './lessons/prompt-caching'
import { QuantizationConcepts } from './lessons/quantization-concepts'
import { SmallLanguageModels } from './lessons/small-language-models'
import { LargeLanguageModels } from './lessons/large-language-models'
import { MultimodalModels } from './lessons/multimodal-models'

// Research Papers
import { AttentionIsAllYouNeed } from './lessons/papers/attention-is-all-you-need'
import { ChinchillaScalingLaws } from './lessons/papers/chinchilla-scaling-laws'
import { ClipMultimodalLearning } from './lessons/papers/clip-multimodal-learning'
import { LlamaOpenEfficientModels } from './lessons/papers/llama-open-efficient-models'
import { ScalingLawsForLanguageModels } from './lessons/papers/scaling-laws-for-language-models'

const startHereLessons = [
  {
    id: 'what-is-generative-ai',
    title: 'What Is Generative AI?',
    description:
      'Generative vs discriminative AI, what "generate" means, the modalities, and the one prediction loop everything is built on. Start here — no ML background needed.',
    readTime: '10 min',
    component: WhatIsGenerativeAI,
  },
  {
    id: 'what-is-a-token',
    title: 'Tokens & Tokenization',
    description:
      'What a token really is, why models see subwords instead of letters or words, how BPE builds the vocabulary, and why tokens drive cost, context, and speed.',
    readTime: '12 min',
    component: WhatIsAToken,
  },
  {
    id: 'how-language-models-work',
    title: 'How Language Models Work',
    description:
      'Next-token prediction, probability distributions, and how models choose what to write — one token at a time.',
    readTime: '12 min',
    component: HowLanguageModelsWork,
  },
]

const insideTheModelLessons = [
  {
    id: 'neural-networks-primer',
    title: 'Neural Networks: A Primer',
    description:
      'Neurons, weights, biases, activations, layers, and the predict-measure-nudge training loop — the minimum machinery you need, explained without calculus.',
    readTime: '10 min',
    component: NeuralNetworksPrimer,
  },
  {
    id: 'embeddings-and-vector-space',
    title: 'Embeddings & Vector Space',
    description:
      'How words become vectors of meaning, cosine similarity, "king − man + woman ≈ queen", and static vs contextual embeddings — the bridge from text to math.',
    readTime: '11 min',
    component: EmbeddingsAndVectorSpace,
  },
  {
    id: 'the-transformer-architecture',
    title: 'The Transformer Architecture',
    description:
      'The full map of a decoder-only LLM: embeddings, positional encoding, the attention + feed-forward block, residuals, layer norm, and the output head.',
    readTime: '14 min',
    component: TheTransformerArchitecture,
  },
  {
    id: 'self-attention-explained',
    title: 'Self-Attention, Step by Step',
    description:
      'Query, Key, Value explained with the library analogy; the four steps of attention worked by hand; multi-head attention and causal masking.',
    readTime: '14 min',
    component: SelfAttentionExplained,
  },
  {
    id: 'what-are-model-parameters',
    title: 'Model Parameters, Weights & Memory',
    description:
      'What it means when a model has billions or trillions of parameters — weights, capacity, and how parameter count maps to memory.',
    readTime: '10 min',
    component: WhatAreModelParameters,
  },
  {
    id: 'the-modern-llm-block',
    title: 'The Modern LLM Block (LLaMA-style)',
    description:
      'How today\'s open-weight models (LLaMA, Mistral, Qwen, Gemma) upgrade the original Transformer — pre-norm RMSNorm, RoPE, SwiGLU, and Grouped-Query Attention — with a family tree showing who uses what.',
    readTime: '14 min',
    component: TheModernLlmBlock,
  },
]

const biggerPictureLessons = [
  {
    id: 'how-llms-are-trained',
    title: 'How LLMs Are Trained',
    description:
      'Pretraining (predict the next token at scale) then post-training (SFT + RLHF) — how a raw autocomplete becomes a helpful assistant, and why a knowledge cutoff exists.',
    readTime: '13 min',
    component: HowLlmsAreTrained,
  },
  {
    id: 'context-windows-and-kv-cache',
    title: 'Context Windows & the KV Cache',
    description:
      'The model\'s working memory in tokens, the quadratic cost of long context, "lost in the middle", and how the KV cache makes generation fast.',
    readTime: '12 min',
    component: ContextWindowsAndKvCache,
  },
  {
    id: 'prefill-decode-and-latency',
    title: 'Why LLMs Pause: Prefill, Decode & Latency',
    description:
      'The two phases behind every answer — prefill (parallel prompt processing) and decode (autoregressive, cache-reusing generation) — plus the TTFT and TPOT metrics that describe response speed.',
    readTime: '12 min',
    component: PrefillDecodeAndLatency,
  },
  {
    id: 'prompt-caching',
    title: 'Prompt Caching: Basics to Advanced',
    description:
      'Reuse the prefill KV cache across requests — why a shared prefix is the whole trick, how to structure prompts for it, and how to implement it with OpenAI, Anthropic, Gemini, and self-hosted vLLM, plus cost math, advanced patterns, and pitfalls.',
    readTime: '16 min',
    component: PromptCaching,
  },
  {
    id: 'quantization-concepts',
    title: 'Quantization: Concepts, Use Cases & Tradeoffs',
    description:
      'Storing model weights in fewer bits (INT8, INT4) — the memory math, the scale + block idea, PTQ vs QAT, weight-only vs W+A, popular schemes (GPTQ, AWQ, GGUF, NF4, FP8), quality tradeoffs, and a decision flowchart for what to use where.',
    readTime: '15 min',
    component: QuantizationConcepts,
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
    'Start from zero: tokens, how LLMs predict, neural networks, embeddings, the Transformer and attention, parameters, training, and context windows — a sequential path that assumes no ML background, plus 5 curated papers.',
  lessonSections: [
    {
      id: 'start-here',
      title: 'Start Here',
      lessons: startHereLessons,
    },
    {
      id: 'inside-the-model',
      title: 'Inside the Model',
      lessons: insideTheModelLessons,
    },
    {
      id: 'the-bigger-picture',
      title: 'The Bigger Picture',
      lessons: biggerPictureLessons,
    },
    {
      id: 'research-papers',
      title: 'Research Papers',
      lessons: researchPaperLessons,
    },
  ],
}
