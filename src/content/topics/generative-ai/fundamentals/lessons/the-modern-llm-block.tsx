import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TheModernLlmBlock() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        <em>The Transformer Architecture</em> and <em>Self-Attention, Step by Step</em>. That lesson taught the
        original 2017 Transformer. This one shows how modern open-weight LLMs (LLaMA, Mistral, Qwen, Gemma) tweak
        that block for better quality and much faster inference.
      </Callout>

      <Definition term="The modern LLM block">
        <p>
          Every modern open-weight LLM is a stack of near-identical blocks. Almost all of them use a small,
          shared set of upgrades over the original Transformer:{' '}
          <strong className="text-white">RMSNorm</strong> instead of LayerNorm,{' '}
          <strong className="text-white">Rotary Position Embeddings (RoPE)</strong> instead of learned
          positional encodings, <strong className="text-white">SwiGLU</strong> feed-forward layers instead of
          ReLU, <strong className="text-white">Grouped-Query Attention (GQA)</strong> for cheap KV cache, and{' '}
          <strong className="text-white">pre-normalisation</strong> for stable training. This lesson explains
          each one in plain terms — the &ldquo;LLaMA-style&rdquo; block that most of the open world runs today.
        </p>
      </Definition>

      <LessonSection title="One picture of the LLaMA-style block">
        <Flowchart
          title="A single decoder block, LLaMA-style"
          chart={`flowchart TB
  X[Hidden state x] --> N1[RMSNorm]
  N1 --> ATTN["Grouped-Query Self-Attention (with RoPE on Q, K)"]
  ATTN --> ADD1((+))
  X --> ADD1
  ADD1 --> N2[RMSNorm]
  N2 --> FFN[SwiGLU Feed-Forward]
  FFN --> ADD2((+))
  ADD1 --> ADD2
  ADD2 --> OUT[Hidden state x']`}
        />
        <p className="mt-3 text-slate-300">
          Same shape as the original Transformer block — attention, then feed-forward, with residuals. What
          changed is the details of each piece and where the norms sit.
        </p>
      </LessonSection>

      <LessonSection title="1 · Pre-normalisation — norm BEFORE the sublayer">
        <p className="text-slate-300">
          Original Transformer: <code className="text-slate-200">x → attn → add → norm</code> (post-norm).
          Modern LLMs: <code className="text-slate-200">x → norm → attn → add</code> (pre-norm). The residual
          path stays unnormalised end-to-end, which keeps the gradient signal healthy through hundreds of
          blocks. Post-norm networks blow up or stall as you stack them deep; pre-norm networks train stably.
        </p>
      </LessonSection>

      <LessonSection title="2 · RMSNorm — a leaner LayerNorm">
        <p className="text-slate-300">
          LayerNorm computes both a mean and a variance per token, then re-centres and re-scales. RMSNorm skips
          the mean and only rescales by the root-mean-square. Same normalising effect in practice, ~10–15%
          faster per block, and one fewer parameter set per norm.
        </p>
        <Example title="LayerNorm vs RMSNorm">{`# LayerNorm  (original Transformer)
x_norm = (x - x.mean()) / sqrt(x.var() + eps)
out    = gamma * x_norm + beta

# RMSNorm   (LLaMA, Mistral, Qwen, Gemma)
x_norm = x / sqrt((x**2).mean() + eps)
out    = gamma * x_norm      # no mean, no beta`}</Example>
      </LessonSection>

      <LessonSection title="3 · RoPE — rotate the query and key by position">
        <p className="text-slate-300">
          The original Transformer added a fixed sinusoidal vector to every token embedding to encode its
          position. That is <em>additive</em>. RoPE (Rotary Position Embeddings) instead <em>rotates</em> the
          Q and K vectors by an angle that depends on the token&rsquo;s position — inside the attention
          computation itself.
        </p>
        <ContentStep number={1} title="Why rotation is the right idea">
          <p className="text-slate-300">
            Attention scores are dot products <code className="text-slate-200">Qᵢ · Kⱼ</code>. If you rotate
            both Q at position <em>i</em> and K at position <em>j</em> by angles proportional to their
            positions, the dot product only depends on the <strong className="text-white">difference</strong>{' '}
            i − j. So the model naturally attends by <em>relative</em> position — the property you actually
            want.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Practical wins">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Length extrapolation</strong> — you can extend context length after training by rescaling the RoPE base (this is how models go from 4K to 32K to 128K).</li>
            <li><strong className="text-white">No extra parameters</strong> — RoPE is a fixed rotation, not a learned table.</li>
            <li><strong className="text-white">Cheap</strong> — a few multiplies per token, applied inside attention.</li>
          </ul>
        </ContentStep>
        <Callout variant="insight" title="Why every &ldquo;longer context&rdquo; announcement is really about RoPE">
          Almost every context-length upgrade you have seen (LLaMA-2 4K → 32K, Yarn, Longrope, dynamic NTK
          scaling) is a re-tuning of RoPE&rsquo;s rotation frequencies. Position encoding used to be an
          afterthought; RoPE made it a control surface.
        </Callout>
      </LessonSection>

      <LessonSection title="4 · SwiGLU — a gated feed-forward layer">
        <p className="text-slate-300">
          The original FFN is <code className="text-slate-200">Linear → ReLU → Linear</code>. SwiGLU splits the
          up-projection into two branches and gates one by the other with a smooth SiLU activation:
        </p>
        <Example title="SwiGLU in one line">{`# original
h = W2 @ relu(W1 @ x)

# SwiGLU  (LLaMA, Mistral, Qwen, Gemma)
h = W_down @ ( silu(W_gate @ x) * (W_up @ x) )`}</Example>
        <p className="mt-3 text-slate-300">
          Two projections up, one down. Same or slightly fewer parameters as the original for equivalent
          quality; consistently better per-parameter performance in ablations. This is the standard modern FFN.
        </p>
      </LessonSection>

      <LessonSection title="5 · GQA — the KV-cache trick">
        <p className="text-slate-300">
          Standard <strong className="text-white">Multi-Head Attention (MHA)</strong> gives each of the H heads
          its own Q, K, V. The K/V vectors are what live in the KV cache — and their memory is{' '}
          <code className="text-slate-200">H × context_length × dim × 2 × bytes</code>. For a 70B model at
          32K context that is <em>enormous</em>.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Variant</th>
                <th className="px-4 py-3">Q heads</th>
                <th className="px-4 py-3">K/V heads</th>
                <th className="px-4 py-3">KV cache size</th>
                <th className="px-4 py-3">Quality</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['MHA (original)',       '32', '32',             '1×',      'Highest'],
                ['MQA (Multi-Query)',    '32', '1',              '~1/32×',  'Small drop'],
                ['GQA (Grouped-Query)',  '32', '8 (groups of 4)', '~1/4×',  'Near-MHA'],
              ].map(([v, q, kv, mem, qual]) => (
                <tr key={v}>
                  <td className="px-4 py-3 font-semibold text-white">{v}</td>
                  <td className="px-4 py-3 text-slate-400">{q}</td>
                  <td className="px-4 py-3 text-slate-400">{kv}</td>
                  <td className="px-4 py-3 text-slate-400">{mem}</td>
                  <td className="px-4 py-3 text-slate-400">{qual}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          Multiple query heads <em>share</em> a single K and V head. You keep most of MHA&rsquo;s quality but
          shrink the KV cache by 4–8×, which directly means bigger batches, longer context, and higher
          throughput at inference. GQA is why LLaMA-2 70B and every serious open model since is affordable to
          serve.
        </p>
      </LessonSection>

      <LessonSection title="How a token flows through the whole thing">
        <ContentStep number={1} title="Token → embedding">
          <p className="text-slate-300">Vocab ID looked up in the embedding table. Same as classic Transformer.</p>
        </ContentStep>
        <ContentStep number={2} title="For each block (32× in a 7B model, 80× in a 70B model)">
          <ol className="list-decimal space-y-1 pl-5 text-slate-300">
            <li>RMSNorm the hidden state.</li>
            <li>Project to Q, K, V with GQA head counts. Apply RoPE to Q and K.</li>
            <li>Causal masked attention across the sequence.</li>
            <li>Residual add.</li>
            <li>RMSNorm again.</li>
            <li>SwiGLU feed-forward.</li>
            <li>Residual add. Pass the result to the next block.</li>
          </ol>
        </ContentStep>
        <ContentStep number={3} title="Final RMSNorm → LM head → logits → sample">
          <p className="text-slate-300">
            One RMSNorm at the top, a linear projection to vocab size, softmax with temperature, sample the next
            token. The KV cache from step 2 is what makes the <em>next</em> token fast — see the KV cache
            lesson.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Who uses what — a family tree">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Norm</th>
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">FFN</th>
                <th className="px-4 py-3">Attention</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['LLaMA-1',   'RMSNorm', 'RoPE', 'SwiGLU', 'MHA'],
                ['LLaMA-2',   'RMSNorm', 'RoPE', 'SwiGLU', 'GQA (70B) / MHA (7B/13B)'],
                ['LLaMA-3',   'RMSNorm', 'RoPE', 'SwiGLU', 'GQA'],
                ['Mistral 7B','RMSNorm', 'RoPE', 'SwiGLU', 'GQA + sliding window'],
                ['Qwen 2/3',  'RMSNorm', 'RoPE', 'SwiGLU', 'GQA'],
                ['Gemma',     'RMSNorm', 'RoPE', 'GeGLU',  'GQA'],
              ].map(([m, n, p, f, a]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{n}</td>
                  <td className="px-4 py-3 text-slate-400">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{a}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Convergent design">
          Different labs, different training data, different licences — but the architectural choices have
          converged. If you understand the LLaMA block, you understand most of the modern open-weight world.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The modern open-weight LLM is a stack of near-identical blocks: pre-norm RMSNorm, GQA self-attention with RoPE, and SwiGLU feed-forward.',
          'Pre-normalisation + RMSNorm keeps training stable at 32–80 blocks deep and shaves compute per step.',
          'RoPE encodes position by rotating Q and K, which is what makes today\'s long-context (32K–128K+) upgrades possible.',
          'SwiGLU is a gated feed-forward — same or fewer params than the original ReLU FFN for consistently better quality.',
          'GQA lets many query heads share fewer K/V heads, shrinking the KV cache 4–8× — the reason 70B models are affordable to serve.',
          'LLaMA, Mistral, Qwen, and Gemma have all converged on this same recipe. Learn it once and you can read almost any modern open model paper.',
        ]}
      />
    </LessonArticle>
  )
}
