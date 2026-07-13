import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhyInferenceOptimization() {
  return (
    <LessonArticle>
      <LessonSection title="You trained a model — now what?">
        <p className="text-slate-300">
          Most Generative AI content teaches you to <em>use</em> models via APIs (OpenAI, Anthropic) or to{' '}
          <em>build apps</em> with LangChain. That is the application layer. But when you deploy your own open-weight
          model (Llama, Mistral, Qwen) on your own GPU, a new problem appears:{' '}
          <strong className="text-white">inference is slow and expensive</strong>.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Naive serving (one request at a time, HuggingFace generate())</div>
          <div className="mt-2 text-slate-300">Llama-3-8B on one A100 → ~15 tokens/sec → 1 user at a time</div>
          <div className="mt-3 text-slate-400">Optimized serving (vLLM with continuous batching)</div>
          <div className="mt-1 text-genai-400">Same GPU → 2,000+ tokens/sec aggregate → dozens of concurrent users</div>
        </div>
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Inference optimization</strong> is the field of making LLM serving fast,
          cheap, and scalable. This section of the curriculum covers production inference engines — starting with{' '}
          <strong className="text-white">vLLM</strong>, the most widely used open-source LLM server.
        </p>
      </LessonSection>

      <LessonSection title="Why this matters even if you use OpenAI today">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Cost</strong> — self-hosting with vLLM can be 5–10× cheaper at scale than API pricing.</li>
          <li><strong className="text-white">Privacy</strong> — data never leaves your VPC; required for healthcare, finance, defense.</li>
          <li><strong className="text-white">Control</strong> — fine-tuned models, custom quantizations, no rate limits.</li>
          <li><strong className="text-white">Understanding</strong> — even API users benefit from knowing KV cache, batching, and throughput limits.</li>
        </ul>
      </LessonSection>

      <LessonSection title="The learning path in this sub-topic">
        <Flowchart
          title="Zero to vLLM mastery"
          chart={`flowchart TB
  F[Foundations — what is inference?] --> A[Architecture — PagedAttention, batching]
  A --> G[Getting Started — install and first server]
  G --> O[Optimization — quant, parallel, LoRA]
  O --> P[Production — tuning, deploy, monitor]
  P --> M[Mastery — disaggregated serving, engine comparison]`}
        />
        <p className="mt-4 text-slate-300">
          Read lessons in order. Each builds on the previous. By the end you will understand how vLLM achieves
          high throughput, how to configure it for your hardware, and how to deploy it in production.
        </p>
      </LessonSection>

      <Callout variant="beginner" title="Prerequisites">
        Complete <em>Fundamentals → How Language Models Work</em> and <em>Inference Parameters</em>. Basic Python
        and command-line comfort helps. No CUDA programming required — but GPU concepts are explained from scratch.
      </Callout>

      <KeyTakeaways
        items={[
          'Inference optimization = serving LLMs fast, cheap, and at scale on your own hardware.',
          'Naive HuggingFace serving wastes GPU; engines like vLLM unlock 10–100× throughput.',
          'This track goes from zero GPU knowledge to production vLLM deployment.',
          'Start with Foundations — do not skip to installation if KV cache is new to you.',
        ]}
      />
    </LessonArticle>
  )
}
