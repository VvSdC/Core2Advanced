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

export function LocalLlmInferenceBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="No jargon without a definition">
        This lesson explains what happens when you type a prompt into llama.cpp and watch words appear. Every
        technical term is defined the first time we use it.
      </Callout>

      <Definition term="Token">
        <p>
          A <strong className="text-white">token</strong> is a small chunk of text the model reads and writes —
          often a word piece, not always a whole word. The sentence &quot;Hello world&quot; might become three tokens:
          <code className="font-mono text-sm"> &quot;Hello&quot;</code>,{' '}
          <code className="font-mono text-sm"> &quot; world&quot;</code>, and sometimes punctuation as its own
          token. Models have a fixed <strong className="text-white">vocabulary</strong> (a numbered list of all
          allowed tokens).
        </p>
      </Definition>

      <Definition term="Inference">
        <p>
          <strong className="text-white">Inference</strong> is using a trained model to produce output — as opposed
          to <em>training</em>, which teaches the model by showing it millions of examples. When you chat locally,
          you are doing inference: the weights are frozen; only your prompt and the growing answer change.
        </p>
      </Definition>

      <LessonSection title="The big picture — one token at a time">
        <p className="text-slate-300">
          Language models do not write a full paragraph in one shot. They predict the{' '}
          <strong className="text-white">next token</strong>, append it, predict the next, and repeat. This is called{' '}
          <strong className="text-white">autoregressive</strong> generation — each new word depends on everything
          before it, like finishing a sentence one syllable at a time without skipping ahead.
        </p>

        <Flowchart
          title="Local chat flow (simplified)"
          chart={`flowchart LR
  U[You type prompt] --> T[Tokenizer → token IDs]
  T --> P[Prefill phase]
  P --> D[Decode loop]
  D --> O[Detokenizer → text on screen]
  O --> U2[You see streamed words]`}
        />

        <p className="mt-4 text-slate-300">
          On your laptop, llama.cpp runs this loop in C++ — no Python interpreter in the hot path. That is why it
          feels responsive even on modest hardware.
        </p>
      </LessonSection>

      <LessonSection title="Phase 1 — Prefill (read your prompt)">
        <Definition term="Prefill">
          <p>
            <strong className="text-white">Prefill</strong> (also called prompt processing) is when the model reads
            your entire prompt at once. All prompt tokens are processed in parallel through the transformer layers.
            The model builds an internal memory of your prompt called the{' '}
            <strong className="text-white">KV cache</strong> (Key-Value cache — stored attention results so it does
            not recompute the past every step).
          </p>
        </Definition>

        <ContentStep number={1} title="What you feel as a user">
          <p className="text-slate-300">
            Prefill is the pause <em>before</em> the first word appears. A short prompt → barely noticeable. Paste
            a 20-page document → several seconds of silence while the model digests it. This delay is{' '}
            <strong className="text-white">time to first token (TTFT)</strong>.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Why it matters locally">
          <p className="text-slate-300">
            On CPU-only inference, prefill is slowest when the prompt is long. On Metal or CUDA, prefill speeds up
            dramatically. Either way, it happens once per message (unless you use advanced caching in later lessons).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Phase 2 — Decode (generate the answer)">
        <Definition term="Decode">
          <p>
            <strong className="text-white">Decode</strong> (generation) produces output tokens{' '}
            <strong className="text-white">one at a time</strong>. After prefill, the model outputs token 1, adds it
            to the sequence, outputs token 2, and so on until it hits a stop condition (end-of-sequence token or
            your <code className="font-mono text-sm">max_tokens</code> limit).
          </p>
        </Definition>

        <Flowchart
          title="Autoregressive decode loop"
          chart={`flowchart TB
  A[Current text in KV cache] --> B[Forward pass — predict next token]
  B --> C[Pick one token from probabilities]
  C --> D[Append to output]
  D --> E{Stop?}
  E -- no --> A
  E -- yes --> F[Done]`}
        />

        <ContentStep number={1} title="Sampling">
          <p className="text-slate-300">
            The model outputs a score for every token in the vocabulary.{' '}
            <strong className="text-white">Sampling</strong> picks one — controlled by temperature and top-p (from
            Fundamentals → Inference Parameters). Low temperature → safer, repetitive answers. High temperature →
            more creative, sometimes chaotic.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Streaming">
          <p className="text-slate-300">
            llama.cpp can print each token as it is decoded, so you see words appear progressively.{' '}
            <strong className="text-white">Tokens per second</strong> during decode is the main speed number users
            quote for local models (e.g. &quot;25 t/s on my M2&quot;).
          </p>
        </ContentStep>

        <Example
          title="Pseudocode — what llama.cpp does internally"
          output={`"The capital of France is Paris."`}
          caption="Real code is C++ and highly optimized; the logic is the same."
        >{`tokens = tokenize("The capital of France is")
kv_cache = prefill(model, tokens)

while not done:
    logits = decode_one_step(model, kv_cache)
    next_token = sample(logits, temperature=0.7)
    tokens.append(next_token)
    kv_cache.update(next_token)
    if next_token == EOS or len(tokens) >= max_tokens:
        done = True

print(detokenize(tokens))`}</Example>
      </LessonSection>

      <LessonSection title="Prefill vs decode — comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Phase</th>
                <th className="px-4 py-3">Processes</th>
                <th className="px-4 py-3">User-visible effect</th>
                <th className="px-4 py-3">Bottleneck on laptop</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prefill', 'All prompt tokens at once', 'Delay before first word (TTFT)', 'Compute — worse on CPU'],
                ['Decode', 'One new token per step', 'Streaming speed (tokens/sec)', 'Memory bandwidth — long answers take time'],
              ].map(([phase, processes, effect, bottleneck]) => (
                <tr key={phase} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{phase}</td>
                  <td className="px-4 py-3 text-slate-400">{processes}</td>
                  <td className="px-4 py-3 text-genai-400">{effect}</td>
                  <td className="px-4 py-3 text-slate-400">{bottleneck}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Callout variant="insight">
          A 500-token essay means roughly <strong className="text-white">500 decode steps</strong> — each one a full
          trip through the model. That is why local LLMs feel fast for short replies but slow for long code dumps.
        </Callout>
      </LessonSection>

      <LessonSection title="Memory during local inference">
        <Definition term="KV cache (local view)">
          <p>
            The <strong className="text-white">KV cache</strong> grows with every token in the conversation (prompt +
            answer). Longer chats use more RAM or VRAM. If you run out, inference fails or slows as the OS swaps to
            disk — another reason quantized smaller models are popular on laptops.
          </p>
        </Definition>

        <CodeBlock title="What uses your machine's memory">{`Model weights (GGUF file)  → loaded once; size fixed by model + quantization
KV cache                  → grows with prompt length + generated tokens
Temporary buffers         → small scratch space each forward pass

Total ≈ weights + KV cache + overhead`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Tying it together for llama.cpp users">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <code className="font-mono text-sm">-p &quot;your prompt&quot;</code> triggers tokenize → prefill → decode
          </li>
          <li>
            <code className="font-mono text-sm">-n 256</code> caps decode at 256 new tokens (max generation length)
          </li>
          <li>
            Slow first token? Long prompt — prefill is working
          </li>
          <li>
            Slow streaming? Decode-bound — try GPU offload, smaller model, or fewer output tokens
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Tokens are the model\'s alphabet; inference generates text one token at a time.',
          'Prefill processes your whole prompt once; decode generates each answer token serially.',
          'Autoregressive = each step depends on all previous tokens; no skipping ahead.',
          'TTFT reflects prefill; tokens/sec during streaming reflects decode speed.',
          'KV cache grows with conversation length and lives in your RAM or VRAM.',
        ]}
      />
    </LessonArticle>
  )
}
