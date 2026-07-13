import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function LlmInferenceBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Builds on the previous lesson">
        You now know inference is &quot;using a trained model on every user request.&quot; This lesson explains{' '}
        <em>what actually happens</em> inside the GPU when you send a prompt and get a streamed response.
        Revisit <em>Fundamentals → How Language Models Work</em> if next-token prediction is still fuzzy.
      </Callout>

      <Definition term="LLM Inference">
        <p>
          <strong className="text-white">LLM inference</strong> is the process of feeding text into a language
          model and collecting generated tokens back out. The model never sees your full answer upfront — it
          builds the response <strong className="text-white">one token at a time</strong>, left to right, using
          the same next-token mechanism you learned in Fundamentals.
        </p>
      </Definition>

      <LessonSection title="The two phases: prefill and decode">
        <p className="text-slate-300">
          Every inference request splits into two distinct phases. Understanding this split is essential for
          understanding why vLLM, KV cache, and batching matter.
        </p>

        <Definition term="Prefill phase">
          <p>
            The <strong className="text-white">prefill</strong> (also called <em>prompt processing</em>) phase
            reads your entire input prompt — every token — in one parallel pass through the model. The GPU
            processes all prompt tokens at once because their positions are already known.
          </p>
          <p>
            Prefill is <strong className="text-white">compute-bound</strong>: lots of matrix math happening in
            parallel. A long prompt (e.g. 8,000 tokens of RAG context) makes prefill slower, but it happens only
            once per request.
          </p>
        </Definition>

        <Definition term="Decode phase">
          <p>
            The <strong className="text-white">decode</strong> (also called <em>generation</em>) phase produces
            output tokens one at a time. After prefill, the model generates token 1, appends it, generates token
            2, appends it, and so on until it hits a stop condition.
          </p>
          <p>
            Decode is often <strong className="text-white">memory-bandwidth-bound</strong>: each step reads the
            entire model weights from GPU memory to produce a single token. This is why generating 2,000 tokens
            takes much longer than processing a 2,000-token prompt.
          </p>
        </Definition>

        <Flowchart
          title="Prefill then decode"
          chart={`flowchart LR
  A[User prompt tokens] --> B[Prefill — process all at once]
  B --> C[KV cache filled for prompt]
  C --> D[Decode token 1]
  D --> E[Decode token 2]
  E --> F[Decode token 3]
  F --> G[...]
  G --> H[Stop token or max_tokens]`}
        />

        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Phase</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Tokens processed</th>
                <th className="px-4 py-3">Typical bottleneck</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prefill', 'Full prompt', 'All at once (parallel)', 'Compute (FLOPs)'],
                ['Decode', 'One new token per step', 'One at a time (serial)', 'Memory bandwidth'],
              ].map(([phase, input, tokens, bottleneck]) => (
                <tr key={phase} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{phase}</td>
                  <td className="px-4 py-3 text-slate-400">{input}</td>
                  <td className="px-4 py-3 text-slate-400">{tokens}</td>
                  <td className="px-4 py-3 text-slate-400">{bottleneck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The autoregressive generation loop">
        <p className="text-slate-300">
          <strong className="text-white">Autoregressive</strong> means &quot;each step depends on all previous
          steps.&quot; The model cannot skip ahead — token 50 does not exist until tokens 1–49 are generated and
          appended. This is the same loop from <em>How Language Models Work</em>, now running inside a server.
        </p>

        <ContentStep number={1} title="Start with the prompt">
          <p>
            Input: <code className="font-mono text-sm">&quot;The capital of France is&quot;</code>. Prefill processes
            all six tokens and stores intermediate results in the <strong className="text-white">KV cache</strong>{' '}
            (Key-Value cache — temporary memory that avoids recomputing attention for past tokens).
          </p>
        </ContentStep>

        <ContentStep number={2} title="Generate one token">
          <p>
            The model outputs probabilities. Sampling picks <code className="font-mono text-sm">&quot; Paris&quot;</code>.
            That token is appended. KV cache grows by one entry.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Repeat until done">
          <p>
            Next step sees <code className="font-mono text-sm">&quot;...France is Paris&quot;</code> and predicts
            the next token — perhaps <code className="font-mono text-sm">&quot;.&quot;</code> then{' '}
            <code className="font-mono text-sm">&quot;&lt;EOS&gt;&quot;</code> (end-of-sequence). Loop ends.
          </p>
        </ContentStep>

        <Flowchart
          title="Autoregressive loop (decode)"
          chart={`flowchart TB
  A[Current sequence in KV cache] --> B[Forward pass — one new token]
  B --> C[Softmax → probabilities]
  C --> D[Sample / pick token]
  D --> E[Append to output + KV cache]
  E --> F{Stop?}
  F -- no --> A
  F -- yes --> G([Return full text])`}
        />

        <Example
          title="Pseudocode for the decode loop"
          output={`"The capital of France is Paris."`}
          caption="Real servers run this thousands of times per second across batched requests."
        >{`sequence = tokenize("The capital of France is")
kv_cache = prefill(model, sequence)   # one parallel pass

while not done:
    logits = decode_one_token(model, sequence, kv_cache)
    next_token = sample(logits, temperature=0.7)
    sequence.append(next_token)
    kv_cache.update(next_token)
    if next_token == EOS or len(sequence) >= max_tokens:
        done = True

return detokenize(sequence)`}</Example>
      </LessonSection>

      <LessonSection title="Why decode is the bottleneck for long outputs">
        <Callout variant="insight" title="The core problem">
          Prefill cost grows with <em>prompt length</em>. Decode cost grows with <em>output length</em> — and
          decode runs <strong className="text-white">once per output token</strong>, serially. A 500-token answer
          means 500 separate forward passes through the full model.
        </Callout>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Rough intuition — Llama-3-8B on one A100</div>
          <div className="mt-2 text-slate-300">Prefill 2,000-token prompt → ~1–2 seconds (one big parallel step)</div>
          <div className="mt-2 text-slate-300">Decode 500 tokens → ~500 × 15 ms ≈ 7–8 seconds (500 serial steps)</div>
          <div className="mt-3 text-genai-400">
            Time to first token (TTFT) ≈ prefill. Tokens per second during streaming ≈ decode speed.
          </div>
        </div>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Time to first token (TTFT)</strong> — Mostly prefill. Users notice if
            a long RAG prompt takes 3 seconds before any text appears.
          </li>
          <li>
            <strong className="text-white">Inter-token latency</strong> — Time between streamed words during
            decode. Target: 20–50 ms per token for a smooth reading experience.
          </li>
          <li>
            <strong className="text-white">Total latency</strong> — TTFT + (number of output tokens × per-token
            decode time). Long essays and code dumps hurt here.
          </li>
        </ul>

        <p className="mt-4 text-slate-300">
          This is why production systems obsess over decode throughput (tokens/sec) and why vLLM&apos;s continuous
          batching focuses on keeping the GPU busy during decode — the expensive phase.
        </p>
      </LessonSection>

      <LessonSection title="Memory and compute during inference">
        <Definition term="KV cache">
          <p>
            During attention, the model computes <strong className="text-white">Key</strong> and{' '}
            <strong className="text-white">Value</strong> vectors for every token. Recomputing them for token 500
            would waste work — so they are stored in GPU memory as the <strong className="text-white">KV cache</strong>.
            Size grows linearly with total sequence length (prompt + generated tokens) × number of layers × hidden
            size. This is a major memory consumer and a core vLLM optimization target (PagedAttention).
          </p>
        </Definition>

        <ContentStep number={1} title="Model weights (fixed)">
          <p>
            The billions of learned parameters loaded once at startup. Llama-3-8B in FP16 ≈ 16 GB. Quantization
            (INT8, INT4) shrinks this — covered later in the Optimization section.
          </p>
        </ContentStep>

        <ContentStep number={2} title="KV cache (grows per request)">
          <p>
            Allocated per active request. Long conversations and many concurrent users multiply this. Running out
            of KV cache memory is a common reason servers reject new requests even when weight memory fits.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Activations (temporary)">
          <p>
            Intermediate tensors during each forward pass. Usually smaller than KV cache at long sequences but
            spikes during prefill when many prompt tokens are processed in parallel.
          </p>
        </ContentStep>

        <Flowchart
          title="What uses GPU memory during inference"
          chart={`flowchart TB
  VRAM[Total GPU VRAM]
  VRAM --> W[Model weights — fixed size]
  VRAM --> KV[KV cache — grows per token per request]
  VRAM --> A[Activations — temporary per forward pass]
  KV --> B1[Request 1]
  KV --> B2[Request 2]
  KV --> B3[Request N ...]`}
        />

        <CodeBlock title="Simplified memory picture">{`GPU VRAM ≈ weights + (KV cache × concurrent requests) + activations

weights     → loaded once, same for every user
KV cache    → grows with every token in every active chat
activations → scratch space during each forward pass`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Link to Fundamentals">
        <p className="text-slate-300">
          Everything here is the <em>serving</em> view of concepts from{' '}
          <strong className="text-white">Fundamentals → How Language Models Work</strong>:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Next-token prediction → the decode loop, one step at a time</li>
          <li>Tokens and context window → limits on prompt + output length</li>
          <li>Attention → why KV cache exists and why it consumes memory</li>
          <li>Transformer layers → why each decode step runs the full model depth</li>
        </ul>
        <Callout variant="tip">
          <em>Inference Parameters</em> (temperature, top-p, max_tokens) control <em>which</em> token is picked each
          decode step. This lesson covers <em>how fast</em> those steps run and <em>what memory</em> they need.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Inference has two phases: prefill (process full prompt in parallel) and decode (generate one token at a time).',
          'Autoregressive generation loops until EOS or max_tokens — same next-token logic as Fundamentals.',
          'Decode is the bottleneck for long outputs: N output tokens ≈ N serial forward passes.',
          'TTFT is dominated by prefill; streaming speed is dominated by decode throughput.',
          'GPU memory = weights + KV cache (grows per request) + activations; KV cache is why vLLM built PagedAttention.',
        ]}
      />
    </LessonArticle>
  )
}
