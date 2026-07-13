import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function VllmArchitectureOverview() {
  return (
    <LessonArticle>
      <LessonSection title="vLLM is more than a model wrapper">
        <p className="text-slate-300">
          Running <code className="text-genai-400">model.generate()</code> in a Python script processes one
          request at a time on one GPU. <strong className="text-white">vLLM</strong> is a full{' '}
          <strong className="text-white">serving system</strong> — it accepts hundreds of concurrent HTTP
          requests, schedules them across GPUs, manages KV cache memory, and streams tokens back to clients.
        </p>
        <Callout variant="beginner" title="Analogy: a restaurant, not a home kitchen">
          A home kitchen (naive script) cooks one order at a time. A restaurant (vLLM) has a host stand
          (API server), a head chef who coordinates orders (scheduler), multiple cooking stations (workers),
          and a shared pantry (GPU memory pool). Orders arrive continuously and are served as soon as they are
          ready — not in fixed groups.
        </Callout>
      </LessonSection>

      <LessonSection title="Full system diagram — client to GPU">
        <Flowchart
          title="vLLM system architecture"
          chart={`flowchart TB
  CLIENT[Client / Application] -->|HTTP or OpenAI API| API[API Server — vllm serve]
  API --> ENGINE[LLMEngine]
  ENGINE --> SCHED[Scheduler]
  SCHED --> EXEC[Executor]
  EXEC --> W1[Worker — GPU 0]
  EXEC --> W2[Worker — GPU 1]
  EXEC --> WN[Worker — GPU N]
  W1 --> MODEL1[Model weights + PagedAttention kernels]
  W2 --> MODEL2[Model weights + PagedAttention kernels]
  SCHED <-->|block tables, batch plan| W1
  SCHED <-->|block tables, batch plan| W2
  W1 -->|sampled tokens| ENGINE
  ENGINE -->|stream tokens| API
  API -->|SSE / JSON response| CLIENT`}
        />
        <p className="mt-4 text-slate-300">
          Data flows <strong className="text-white">down</strong> as requests and <strong className="text-white">up</strong>{' '}
          as generated tokens. The scheduler and workers communicate every iteration to rebuild batches and
          update KV cache block tables.
        </p>
      </LessonSection>

      <Definition term="LLMEngine">
        <p>
          The <strong className="text-white">LLMEngine</strong> is the central orchestrator. It owns the
          request queue, calls the scheduler each iteration, dispatches work to the executor, collects output
          tokens, and applies stopping criteria (EOS token, max_tokens). In <code className="text-genai-400">vllm serve</code>,
          one engine instance runs per process (or per data-parallel replica).
        </p>
      </Definition>

      <LessonSection title="Core components and their roles">
        <ContentStep number={1} title="API Server — the front door">
          <p>
            Exposes an <strong className="text-white">OpenAI-compatible REST API</strong> (
            <code className="text-genai-400">/v1/completions</code>,{' '}
            <code className="text-genai-400">/v1/chat/completions</code>). Handles authentication, request
            parsing, response formatting, and <strong className="text-white">token streaming</strong> via
            Server-Sent Events. The API server is stateless — all generation state lives in the engine.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Scheduler — the brain">
          <p>
            Decides <em>which</em> requests run on each GPU iteration. Implements continuous batching:
            admits waiting requests, evicts finished ones, balances prefill vs decode, and enforces memory
            limits (<code className="text-genai-400">max_num_seqs</code>,{' '}
            <code className="text-genai-400">max_num_batched_tokens</code>). Outputs a{' '}
            <strong className="text-white">batch plan</strong> — which sequences participate and their block
            table pointers.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Executor — dispatches to workers">
          <p>
            The <strong className="text-white">Executor</strong> abstracts single-GPU vs multi-GPU execution.
            It sends the scheduler&apos;s batch plan to one or more workers and collects results. For tensor
            parallel models, the executor coordinates all GPU workers in a single forward pass. For pipeline
            parallel, it pipelines micro-batches across stages.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Worker — does the actual compute">
          <p>
            Each <strong className="text-white">Worker</strong> owns a GPU (or a shard of a model on a GPU).
            It loads model weights, runs the forward pass with{' '}
            <strong className="text-white">PagedAttention kernels</strong>, samples the next token, and returns
            logits. Workers are stateless between iterations — all per-request state (KV cache block tables)
            is managed by the scheduler and passed in each step.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How components connect — one decode iteration">
        <Flowchart
          title="Single decode iteration flow"
          chart={`flowchart LR
  A[1. Request arrives at API] --> B[2. Engine adds to waiting queue]
  B --> C[3. Scheduler builds batch]
  C --> D[4. Executor sends to workers]
  D --> E[5. Workers run forward pass]
  E --> F[6. Sample next token per sequence]
  F --> G[7. Engine checks stop conditions]
  G --> H{Finished?}
  H -->|No| C
  H -->|Yes| I[8. Stream token to client]
  I --> J[9. Free KV pages, notify scheduler]`}
        />
        <p className="mt-4 text-slate-300">
          Steps 3–7 repeat in a tight loop — typically completing in 10–50 ms per iteration depending on
          model size and batch contents. The API server streams tokens to the client as soon as step 8 produces
          them, so users see text appear word by word without waiting for the full response.
        </p>
      </LessonSection>

      <LessonSection title="Deployment topologies">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="space-y-4">
            <div>
              <div className="font-semibold text-white">Single GPU</div>
              <div className="mt-1 text-slate-400">
                1 API process → 1 Engine → 1 Executor → 1 Worker. Simplest setup for models that fit on one
                card (e.g. Llama-3-8B on A100).
              </div>
            </div>
            <div>
              <div className="font-semibold text-white">Tensor Parallel (TP)</div>
              <div className="mt-1 text-slate-400">
                Model shards across N GPUs. 1 Executor coordinates N Workers — each holds 1/N of weights.
                Required for 70B+ models.
              </div>
            </div>
            <div>
              <div className="font-semibold text-white">Data Parallel (DP)</div>
              <div className="mt-1 text-slate-400">
                N independent replicas, each with full model copy. Load balancer distributes requests across
                replicas. Throughput scales linearly with replica count.
              </div>
            </div>
          </div>
        </div>
        <Callout variant="tip" title="vLLM V1 engine">
          Recent vLLM versions introduced a redesigned V1 engine with a cleaner scheduler–worker separation
          and improved prefix caching. The component names and roles described here apply to both V0 and V1 —
          the mental model is the same even as internals evolve.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'vLLM is a full serving stack: API server → LLMEngine → Scheduler → Executor → Worker(s) → model.',
          'LLMEngine orchestrates the request lifecycle and token streaming.',
          'Scheduler implements continuous batching and manages KV cache block tables.',
          'Executor dispatches batch plans to workers; workers run PagedAttention forward passes on GPU.',
          'Components connect in a tight per-iteration loop — schedule, execute, sample, stream, repeat.',
        ]}
      />
    </LessonArticle>
  )
}
