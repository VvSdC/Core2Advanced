import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function KvCacheExplained() {
  return (
    <LessonArticle>
      <LessonSection title="A conversation needs memory">
        <p className="text-slate-300">
          When you chat with an LLM, each new word it writes depends on <em>everything</em> that came before —
          your question, its earlier sentences, even the system prompt. Without that context, the model would
          repeat itself or contradict what it just said.
        </p>
        <p className="mt-4 text-slate-300">
          Inside a transformer, that &quot;memory of past tokens&quot; is stored in two matrices called{' '}
          <strong className="text-white">K</strong> (Key) and <strong className="text-white">V</strong> (Value).
          You do not need linear algebra to understand them — think of them as a{' '}
          <strong className="text-white">filing cabinet</strong> the model builds as it reads each token.
        </p>
        <Callout variant="beginner" title="Analogy: sticky notes on a whiteboard">
          Imagine the model writes each token on a whiteboard. For every word, it also sticks two notes in a
          cabinet: a <strong className="text-white">Key</strong> note (&quot;what topic is this word about?&quot;)
          and a <strong className="text-white">Value</strong> note (&quot;what information does this word carry?&quot;).
          When generating the next word, the model opens the cabinet, finds the relevant notes, and uses them to
          decide what to write next. That cabinet is the K/V storage for attention.
        </Callout>
      </LessonSection>

      <Definition term="K and V matrices">
        <p>
          During <strong className="text-white">self-attention</strong>, each token is projected into three
          vectors: <strong className="text-white">Query (Q)</strong>, <strong className="text-white">Key (K)</strong>,
          and <strong className="text-white">Value (V)</strong>. The Query from the <em>current</em> token asks
          &quot;which past tokens should I pay attention to?&quot; by comparing against stored Keys. The
          matching Values supply the actual content to blend in.
        </p>
        <p className="mt-3">
          For inference, only K and V from <em>past</em> tokens need to be kept — the Query is always computed
          fresh for the token being generated right now. Together, K and V are the model&apos;s{' '}
          <strong className="text-white">memory of past tokens</strong>.
        </p>
      </Definition>

      <LessonSection title="Why recomputing everything is wasteful">
        <p className="text-slate-300">
          A naive approach regenerates K and V for <em>every</em> token on <em>every</em> step. If you have
          already produced 500 tokens and are writing token 501, the model would recompute attention over all
          500 previous tokens from scratch — even though tokens 1–500 have not changed.
        </p>
        <Flowchart
          title="Without KV cache — redundant work every step"
          chart={`flowchart TB
  T1[Token 1] --> R1[Compute K,V for tokens 1..1]
  T2[Token 2] --> R2[Compute K,V for tokens 1..2]
  T3[Token 3] --> R3[Compute K,V for tokens 1..3]
  TN[Token N] --> RN[Compute K,V for tokens 1..N]
  RN --> WASTE[Work grows with N every step]`}
        />
        <p className="mt-4 text-slate-300">
          This is like re-reading an entire 500-page book from page 1 every time you want to write one new
          sentence in your diary. The book has not changed — only your new sentence is new. The compute cost
          grows as <strong className="text-white">O(N²)</strong> over sequence length, which makes long
          conversations painfully slow.
        </p>
      </LessonSection>

      <LessonSection title="The KV cache: save once, reuse forever">
        <p className="text-slate-300">
          The fix is simple in concept: after computing K and V for a token,{' '}
          <strong className="text-white">store them in a cache</strong>. On the next step, only the{' '}
          <em>new</em> token needs a forward pass — its K and V are appended to the cache, and attention reads
          from the full cached history.
        </p>
        <Flowchart
          title="With KV cache — only the new token is computed"
          chart={`flowchart LR
  subgraph step1 [Step 1 — prompt token A]
    A[Token A] --> KV1[(KV cache: A)]
  end
  subgraph step2 [Step 2 — generate token B]
    B[Token B] --> KV2[(KV cache: A, B)]
    KV1 --> KV2
  end
  subgraph step3 [Step 3 — generate token C]
    C[Token C] --> KV3[(KV cache: A, B, C)]
    KV2 --> KV3
  end`}
        />
        <Callout variant="tip" title="Two phases of generation">
          <strong className="text-white">Prefill</strong> processes the entire prompt at once (many tokens in
          parallel) and fills the cache. <strong className="text-white">Decode</strong> generates one token at
          a time, appending to the cache each step. The KV cache is what makes decode fast — each step is
          roughly constant time instead of growing with history length.
        </Callout>
      </LessonSection>

      <LessonSection title="The scaling problem: memory grows with length">
        <p className="text-slate-300">
          Caching trades compute for memory. Every token in every active request stores K and V tensors for{' '}
          <em>every attention layer</em> in the model. As conversations get longer and more users connect,
          GPU memory fills up fast.
        </p>
        <ContentStep number={1} title="Memory formula (simplified)">
          <p>
            For a model with <strong className="text-white">L</strong> layers, hidden size{' '}
            <strong className="text-white">H</strong>, and <strong className="text-white">N</strong> tokens in
            the sequence, KV cache size is roughly:
          </p>
          <p className="mt-2 font-mono text-sm text-genai-400">
            2 × L × N × H × bytes_per_element
          </p>
          <p className="mt-2">
            The factor of 2 is for K and V. More layers, longer sequences, and larger models all multiply
            memory use linearly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Why this limits concurrency">
          <p>
            GPU VRAM is fixed (e.g. 80 GB on an A100). KV cache memory is{' '}
            <strong className="text-white">per request</strong>. Ten users each with a 4,000-token conversation
            need ten separate caches. When VRAM is full, you cannot accept more requests — this is the core
            scaling bottleneck that vLLM&apos;s PagedAttention and continuous batching address.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Concrete example: 1,000-token conversation">
        <p className="mb-4 text-slate-300">
          Let us estimate KV cache cost for a single request on{' '}
          <strong className="text-white">Llama-3-8B</strong> (32 layers, hidden size 4,096, FP16):
        </p>
        <Example title="KV cache size calculation">
          {`Model: Llama-3-8B
Layers (L)     = 32
Hidden (H)     = 4,096
Sequence (N)   = 1,000 tokens
Precision      = FP16 (2 bytes)

KV cache = 2 × 32 × 1,000 × 4,096 × 2 bytes
         = 524,288,000 bytes
         ≈ 500 MB per request`}
        </Example>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">On an 80 GB A100 with ~70 GB usable for inference:</div>
          <div className="mt-2 text-slate-300">
            ~140 concurrent 1,000-token conversations <em>if KV cache were the only consumer</em> — in practice
            model weights (~16 GB for 8B FP16) and activations reduce headroom to dozens of concurrent users.
          </div>
          <div className="mt-3 text-slate-400">At 8,000 tokens per conversation:</div>
          <div className="mt-1 text-amber-400">~4 GB KV cache per request → only ~15 concurrent users on the same GPU</div>
        </div>
        <Callout variant="insight" title="The takeaway">
          KV cache is essential for fast inference, but it is also the reason long contexts and high concurrency
          are hard. Every optimization in vLLM — PagedAttention, continuous batching, quantization — ultimately
          helps you fit more K/V data into limited GPU memory.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'K and V matrices are the model\'s memory of past tokens — Keys for lookup, Values for content.',
          'Without a KV cache, every decode step recomputes attention over all past tokens — wasteful and slow.',
          'The KV cache stores past K/V so only the new token is computed each step (prefill + decode).',
          'Memory grows linearly with sequence length × layers × hidden size — the core scaling bottleneck.',
          'A 1,000-token Llama-3-8B conversation uses ~500 MB of KV cache alone; 8,000 tokens uses ~4 GB.',
        ]}
      />
    </LessonArticle>
  )
}
