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

export function ContextWindowsAndKvCache() {
  return (
    <LessonArticle>
      <Definition term="Context Window">
        <p>
          The <strong className="text-white">context window</strong> is the maximum number of tokens a model can consider
          at once — your prompt <em>plus</em> the answer it is generating. It is the model's "working memory". If a
          conversation grows past the window, the oldest tokens fall out of view.
        </p>
        <p>
          Modern windows range from a few thousand tokens to over a million. But bigger is not free — it costs memory,
          money, and sometimes accuracy.
        </p>
      </Definition>

      <Callout variant="beginner">
        Think of the context window as the model's desk. Everything it needs to answer must fit on the desk right now. It
        has no long-term memory of past chats — each request starts with a clean desk unless you re-place the papers on
        it.
      </Callout>

      <LessonSection title="What counts against the window">
        <p>Everything you send and everything the model writes shares one budget:</p>
        <Flowchart
          title="The context budget"
          chart={`flowchart TB
  A["Context window (e.g. 128,000 tokens)"] --> B["System prompt"]
  A --> C["Conversation history"]
  A --> D["Retrieved documents (RAG)"]
  A --> E["Your current question"]
  A --> F["Room reserved for the answer"]`}
        />
        <Example
          title="Budgeting a 128k window"
          output={`System prompt:        1,200 tokens
Chat history:        18,000 tokens
Retrieved docs:      40,000 tokens
User question:          300 tokens
Used so far:         59,500 tokens
Left for the answer: 68,500 tokens  (fits!)`}
        >{`window = 128_000
used = {
    "system prompt": 1_200,
    "chat history": 18_000,
    "retrieved docs": 40_000,
    "user question": 300,
}
total = sum(used.values())
for k, v in used.items():
    print(f"{k:20} {v:>7,} tokens")
print(f"{'Used so far':20} {total:>7,} tokens")
print(f"{'Left for answer':20} {window - total:>7,} tokens")`}</Example>
      </LessonSection>

      <LessonSection title="Why not just make the window infinite?">
        <p>
          Attention compares every token with every other token. Double the tokens and you roughly{' '}
          <strong className="text-white">quadruple</strong> the attention work (it grows with the square of the length).
          That's why huge contexts are slow and expensive, and why researchers invent tricks to soften the cost.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tokens</th>
                <th className="px-4 py-3">Pairwise comparisons (≈)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1,000', '1 million'],
                ['10,000', '100 million'],
                ['100,000', '10 billion'],
              ].map(([t, c]) => (
                <tr key={t} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-white">{t}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          This quadratic cost is <em>the</em> reason RAG exists. Rather than stuffing an entire 500-page manual into the
          window, retrieve only the handful of relevant chunks. Smaller context = faster, cheaper, and often{' '}
          <strong className="text-white">more accurate</strong>.
        </Callout>
      </LessonSection>

      <LessonSection title="'Lost in the middle': bigger isn't automatically better">
        <p>
          Even when text fits, models attend best to information at the <strong className="text-white">beginning</strong>{' '}
          and <strong className="text-white">end</strong> of the context, and can overlook facts buried in the middle of a
          very long input. So a giant context can still give worse answers than a tight, well-chosen one.
        </p>
        <Callout variant="tip">
          Practical rule: put the most important instructions and evidence near the top or bottom, and keep the context
          focused. More tokens is not the same as more understanding.
        </Callout>
      </LessonSection>

      <LessonSection title="The KV cache: why the first token is slow and the rest are fast">
        <ContentStep number={1} title="The problem">
          <p>
            Generation is token-by-token. Naively, to produce token 500 the model would re-process tokens 1–499 from
            scratch every single step — enormously wasteful.
          </p>
          <Callout variant="beginner">
            Imagine writing a story where, before adding each new word, you re-read the <em>entire</em> story so far from
            the very first word. Adding word 2 means re-reading 1. Adding word 500 means re-reading 499. You'd spend
            almost all your time re-reading, not writing. That's the naive approach — and the KV cache is the fix.
          </Callout>
        </ContentStep>
        <ContentStep number={2} title="The fix">
          <p>
            Recall from attention that each token produces a <strong className="text-white">Key</strong> and{' '}
            <strong className="text-white">Value</strong>. Those don't change once computed, so the model{' '}
            <strong className="text-white">caches</strong> them. Each new token only computes its own Q/K/V and reuses the
            stored K/V of all previous tokens. This is the <strong className="text-white">KV cache</strong>.
          </p>
          <Callout variant="beginner">
            Same story analogy, fixed: instead of re-reading everything, you keep a running page of{' '}
            <em>notes</em> (the cached Keys and Values). To add the next word you only read your notes and jot one new
            line. Writing word 500 now costs about the same as writing word 2.
          </Callout>
        </ContentStep>

        <Example
          title="How much work the cache saves"
          output={`Generating 500 tokens from a 100-token prompt:

Without KV cache: 174,750 token-steps re-processed
With KV cache:        600 token-steps
Speed-up:            ~291x less work`}
          caption="Each new token would otherwise re-process the whole sequence again. The cache turns that repeated work into a single step per token."
        >{`prompt_len = 100
new_tokens = 500

# Without a cache: to make each new token, re-process the
# ENTIRE sequence so far (prompt + everything generated).
without_cache = sum(prompt_len + i for i in range(new_tokens))

# With a cache: the prompt is processed once (prefill),
# then every new token is just ONE step (reuse the cache).
with_cache = prompt_len + new_tokens

print("Generating 500 tokens from a 100-token prompt:\\n")
print(f"Without KV cache: {without_cache:,} token-steps re-processed")
print(f"With KV cache:    {with_cache:,} token-steps")
print(f"Speed-up:         ~{without_cache // with_cache}x less work")`}</Example>

        <Flowchart
          title="Prefill vs decode"
          chart={`flowchart TB
  A["Prefill: process the whole prompt once"] --> B["Store K,V for every prompt token"]
  B --> C["Decode token 1: reuse cached K,V, add new"]
  C --> D["Decode token 2: reuse cache, add new"]
  D --> E["... fast, steady stream of tokens ..."]`}
        />
        <Callout variant="info">
          This is why a long prompt has a slower first response (the "prefill" of the whole prompt) but then streams the
          rest quickly. The KV cache also uses GPU memory that <em>grows</em> with context length — another reason long
          contexts are costly. You'll see this optimised heavily in the Inference Optimization track.
        </Callout>

        <ContentStep number={3} title="The catch: the cache eats memory">
          <p>
            The speed-up isn't free — every cached token stores a Key and a Value in <em>every</em> layer. So the memory
            grows steadily as the conversation gets longer. Here's a concrete estimate for a mid-size model:
          </p>
          <Example
            title="KV cache memory for a 13B model"
            output={`Per token: 819,200 bytes  (~0.8 MB)
  2,000 tokens ->   1.53 GB
 32,000 tokens ->  24.41 GB
128,000 tokens ->  97.66 GB   (on top of the model weights!)`}
            caption="Formula: 2 (K and V) x layers x hidden_size x bytes_per_number x tokens. Numbers are approximate but show why long context is expensive."
          >{`# Rough KV cache size for a 13B-class model.
layers = 40
hidden_size = 5120
bytes_per_number = 2   # 16-bit floats
kv = 2                 # one Key + one Value

bytes_per_token = kv * layers * hidden_size * bytes_per_number
print(f"Per token: {bytes_per_token:,} bytes  (~{bytes_per_token/1e6:.1f} MB)")

for tokens in (2_000, 32_000, 128_000):
    gb = bytes_per_token * tokens / (1024 ** 3)
    print(f"{tokens:>7,} tokens -> {gb:6.2f} GB")`}</Example>
          <Callout variant="insight">
            This is the hidden cost behind "why can't I just use a 1-million-token context for everything?" The model
            <em>can</em> — but the KV cache alone might need hundreds of GB of GPU memory. It's yet another reason to keep
            context lean with RAG instead of dumping everything in.
          </Callout>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The context window is the model\'s working memory in tokens — prompt + answer must fit inside it.',
          'System prompt, history, retrieved docs, question, and the answer all share one token budget.',
          'Attention cost grows with the square of length, so huge contexts are slow and expensive — a key motivation for RAG.',
          'Models can miss facts buried in the middle of long contexts ("lost in the middle"), so keep context focused.',
          'The KV cache stores past tokens\' Keys/Values so each new token is cheap — explaining slow prefill, fast streaming, and growing memory use.',
        ]}
      />
    </LessonArticle>
  )
}
