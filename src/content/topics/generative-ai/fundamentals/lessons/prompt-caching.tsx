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

export function PromptCaching() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="The wasteful habit prompt caching fixes">
        Most real apps send the <em>same</em> long chunk of text at the start of every request — a big
        system prompt, tool instructions, few-shot examples, or a document. From the last lesson you
        know the model must <strong className="text-white">prefill</strong> (read and process) every
        one of those tokens before it can answer. Sending the same 5,000-token preamble on 1,000
        requests means processing it 1,000 times. Prompt caching lets the model process it{' '}
        <strong className="text-white">once</strong> and reuse that work — cutting cost and the
        pause-before-answering dramatically.
      </Callout>

      <Definition term="Prompt caching">
        <p>
          <strong className="text-white">Prompt caching</strong> stores the results of prefill (the
          Keys and Values — the KV cache) for a chunk of prompt so that later requests which start
          with the <strong className="text-white">exact same text</strong> can skip recomputing it.
          The model reuses the saved KV state and only processes the new part of the prompt.
        </p>
        <p className="mt-2">
          The payoff is real: providers report <strong className="text-white">up to ~90% cheaper</strong>{' '}
          input tokens on a cache hit and <strong className="text-white">up to ~80% faster
          time-to-first-token</strong>, with no change to the model's output.
        </p>
      </Definition>

      <LessonSection title="From the KV cache to prompt caching">
        <p className="text-slate-300">
          These sound similar but operate at different scopes. Keep them straight:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Term</th>
                <th className="px-4 py-3">Scope</th>
                <th className="px-4 py-3">Lives for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['KV cache', 'Reuse within one request — decode reuses the prompt & earlier tokens', 'One generation, then discarded'],
                ['Prompt caching', 'Reuse across many requests — a shared prefix survives between calls', 'Seconds to hours (a TTL)'],
              ].map(([term, scope, life]) => (
                <tr key={term} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{term}</td>
                  <td className="px-4 py-3 text-slate-400">{scope}</td>
                  <td className="px-4 py-3 text-slate-400">{life}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Prompt caching is simply the KV cache <em>kept alive between requests</em>. Normally the
          server throws the prefill KV state away once your answer finishes. Prompt caching says:
          &ldquo;this prefix will show up again soon — hold onto its Keys and Values.&rdquo;
        </Callout>
        <Flowchart
          title="Same preamble, with and without caching"
          chart={`flowchart TB
  subgraph No["Without prompt caching"]
    A1["Request 1: prefill 5,000 preamble tokens + question"] --> A2["Answer"]
    A3["Request 2: prefill 5,000 preamble tokens AGAIN + question"] --> A4["Answer"]
  end
  subgraph Yes["With prompt caching"]
    B1["Request 1: prefill 5,000 tokens, SAVE their KV"] --> B2["Answer"]
    B3["Request 2: reuse saved KV, prefill only the new question"] --> B4["Answer (faster, cheaper)"]
  end`}
        />
      </LessonSection>

      <LessonSection title="Why it only works on a shared prefix">
        <p className="text-slate-300">
          A token's Key and Value depend on <em>every token before it</em> (that is what attention
          does). So a cached token is only valid if the entire text in front of it is byte-for-byte
          identical. This is why caching always works on a <strong className="text-white">prefix</strong> —
          a run of tokens from the very start of the prompt — and never on a chunk from the middle.
        </p>
        <ContentStep number={1} title="Match from the front, stop at the first difference">
          <p className="text-slate-300">
            The server compares your prompt against what it has cached, token by token from the
            start. The moment a token differs, everything from there on must be recomputed.
          </p>
        </ContentStep>
        <ContentStep number={2} title="One early change destroys the whole cache">
          <p className="text-slate-300">
            Put a timestamp, a random ID, or the user's name at the very top of the prompt and you
            change token #1 — so nothing after it can be reused. Caching silently does nothing.
          </p>
        </ContentStep>
        <Example
          title="Prefix matching, token by token"
          output={`Cached prefix : [ SYSTEM ][ TOOLS ][ EXAMPLES ] question A
New request A : [ SYSTEM ][ TOOLS ][ EXAMPLES ] question A   -> full hit, reuse all 3 blocks
New request B : [ SYSTEM ][ TOOLS ][ EXAMPLES ] question B   -> hit on 3 blocks, only 'question B' is new
New request C : [ SYSTEM* ][ TOOLS ][ EXAMPLES ] question A  -> SYSTEM changed at the top -> MISS on everything`}
          caption="Requests A and B reuse the shared prefix. Request C edits the system block at the very front, so the match breaks immediately and nothing is reused."
        >{`# The rule in one line:
# cache is reused up to the FIRST token that differs from what was cached.

def reusable_prefix(cached_tokens, new_tokens):
    reused = 0
    for c, n in zip(cached_tokens, new_tokens):
        if c != n:
            break          # first difference -> stop
        reused += 1
    return reused          # everything after this must be recomputed`}</Example>
      </LessonSection>

      <LessonSection title="The one rule that makes caching pay off: static first, dynamic last">
        <p className="text-slate-300">
          Because only a matching <em>prefix</em> is reused, the single most important thing you do is
          <strong className="text-white"> order your prompt so the stable parts come first and the
          changing parts come last</strong>.
        </p>
        <Example
          title="Bad vs good prompt layout"
          output={`BAD  (variable content at the top -> prefix changes every call -> ~0% cache hits):
  [ "Today is 2026-09-17 14:03, user=alice" ]   <- changes every request
  [ big system prompt ]
  [ tool schemas ]
  [ user question ]

GOOD (variable content at the bottom -> long stable prefix -> high cache hits):
  [ big system prompt ]        \\
  [ tool schemas ]              }  identical every call -> cached
  [ few-shot examples ]        /
  [ user question + timestamp + user id ]   <- the only part that changes`}
          caption="Same information, reordered. The 'good' layout keeps a large identical prefix so every request after the first reads it from cache."
        >{`# Rule of thumb for prompt assembly:
#   1. system instructions        (never changes)
#   2. tool / function schemas    (rarely changes)
#   3. few-shot examples          (rarely changes)
#   4. long shared context / docs (changes per document, not per request)
#   5. the user's actual query    (changes every request)  <- keep LAST`}</Example>
        <Callout variant="tip">
          If you must include a timestamp or request ID, put it at the <em>end</em> of the prompt
          (next to the user query), never at the beginning.
        </Callout>
      </LessonSection>

      <LessonSection title="Cache hits, misses, and TTL">
        <ContentStep number={1} title="First call writes, later calls read">
          <p className="text-slate-300">
            The first request with a new prefix is a <strong className="text-white">cache write</strong>{' '}
            (the model does the full prefill and stores the KV). Every later request that matches is a{' '}
            <strong className="text-white">cache read</strong> (it reuses the stored KV). Providers bill
            these two differently — reads are cheap, writes can cost a small premium.
          </p>
        </ContentStep>
        <ContentStep number={2} title="TTL is a sliding window">
          <p className="text-slate-300">
            A cache entry has a <strong className="text-white">Time To Live</strong> (e.g. 5 minutes).
            Crucially, each hit <em>refreshes</em> the timer for free — so a prefix that is used every
            few minutes stays warm indefinitely. If no request hits it within the TTL, it expires and
            the next call pays the write again.
          </p>
        </ContentStep>
        <ContentStep number={3} title="There is a minimum size">
          <p className="text-slate-300">
            Caching only kicks in above a minimum prefix length (commonly{' '}
            <strong className="text-white">1,024 tokens</strong>, and up to 2,048–4,096 on some
            models). Below that, caching silently does nothing — so short prompts get no benefit.
          </p>
        </ContentStep>
        <Flowchart
          title="Lifecycle of a cached prefix"
          chart={`flowchart TB
  A["Request arrives"] --> B{"Prefix already cached and within TTL?"}
  B -- No --> C["Cache MISS: full prefill, store KV (a write)"]
  B -- Yes --> D["Cache HIT: reuse KV, refresh TTL (a read)"]
  C --> E["Generate answer"]
  D --> E
  E --> F{"Used again before TTL expires?"}
  F -- Yes --> D
  F -- No --> G["Entry evicted / expires"]`}
        />
      </LessonSection>

      <LessonSection title="Two ways to turn it on: automatic vs explicit">
        <p className="text-slate-300">
          Providers expose caching in one of two styles (some support both):
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Style</th>
                <th className="px-4 py-3">You do</th>
                <th className="px-4 py-3">Examples</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Automatic (implicit)', 'Nothing — just structure the prompt well. The server detects repeated prefixes.', 'OpenAI (gpt-4o+), Gemini implicit, most self-hosted stacks'],
                ['Explicit (manual)', 'Mark where the cacheable prefix ends (a "breakpoint"), and optionally set a TTL.', 'Anthropic cache_control, Gemini CachedContent, OpenAI GPT-5.6+ breakpoints'],
              ].map(([style, you, ex]) => (
                <tr key={style} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{style}</td>
                  <td className="px-4 py-3 text-slate-400">{you}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          Even with <strong className="text-white">automatic</strong> caching you are not off the
          hook — it only helps if your prefix is stable and long enough. Explicit caching gives you
          control over <em>where</em> the reusable boundary is and <em>how long</em> to keep it.
        </Callout>
      </LessonSection>

      <LessonSection title="Implementing it — OpenAI (automatic)">
        <p className="text-slate-300">
          OpenAI caches automatically for any prompt ≥ 1,024 tokens on <code className="font-mono text-sm">gpt-4o</code>{' '}
          and newer — no code change. Your job is purely to keep the prefix stable and put changing
          content last. A <code className="font-mono text-sm">prompt_cache_key</code> helps route
          related requests to the same server so they share its cache.
        </p>
        <Example
          title="Automatic caching + reading the hit count"
          output={`answer streamed...
cached_tokens: 4992   # <- these were reused from cache (billed at ~0.1x)
input_tokens:  5040   # total input; only ~48 tokens were actually new`}
        >{`from openai import OpenAI
client = OpenAI()

# Long, STABLE preamble (must be >= 1024 tokens to be eligible).
SYSTEM = load_system_prompt() + load_tool_docs() + few_shot_examples()

resp = client.responses.create(
    model="gpt-5.2",
    instructions=SYSTEM,             # stable prefix -> cached automatically
    input=user_question,             # the only changing part -> goes last
    prompt_cache_key="support-bot-v3",  # sticky routing for better hit rate
)

u = resp.usage
print("cached_tokens:", u.input_tokens_details.cached_tokens)
print("input_tokens: ", u.input_tokens)`}</Example>
        <Callout variant="tip">
          Always log <code className="font-mono text-sm">cached_tokens</code>. Caching is invisible
          otherwise — a request can look fine while missing the cache on every single call because of
          one unstable token near the top.
        </Callout>
      </LessonSection>

      <LessonSection title="Implementing it — Anthropic (explicit breakpoints)">
        <p className="text-slate-300">
          Anthropic caching is explicit: you attach{' '}
          <code className="font-mono text-sm">cache_control: {'{'}"type": "ephemeral"{'}'}</code> to the
          block where your reusable prefix ends. Everything before that breakpoint — across{' '}
          <code className="font-mono text-sm">tools</code>, then <code className="font-mono text-sm">system</code>,
          then <code className="font-mono text-sm">messages</code> (in that order) — becomes the cached
          prefix.
        </p>
        <Example
          title="Caching a large knowledge base in the system prompt"
          output={`# First call (cache write):
cache_creation_input_tokens: 8210
cache_read_input_tokens:     0

# Later calls within the TTL (cache read):
cache_creation_input_tokens: 0
cache_read_input_tokens:     8210   # reused, billed at ~0.1x`}
        >{`import anthropic
client = anthropic.Anthropic()

resp = client.messages.create(
    model="claude-opus-4-8",
    max_tokens=1024,
    system=[
        {"type": "text", "text": STATIC_INSTRUCTIONS},
        {
            "type": "text",
            "text": LONG_KNOWLEDGE_BASE,             # big, reused every call
            "cache_control": {"type": "ephemeral"},  # <- breakpoint (5-min TTL)
        },
    ],
    # The user turn comes AFTER the breakpoint, so it never breaks the prefix.
    messages=[{"role": "user", "content": user_question}],
)

print(resp.usage.cache_creation_input_tokens)  # tokens written on the first call
print(resp.usage.cache_read_input_tokens)      # tokens reused on later calls`}</Example>
        <p className="mt-4 text-slate-300">
          Pricing is three simple multipliers on the model's base input rate. This is what makes the
          break-even math easy:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Token type</th>
                <th className="px-4 py-3">Cost vs base input</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['5-minute cache write', '1.25×', 'First time a prefix is stored'],
                ['1-hour cache write ("ttl":"1h")', '2×', 'Storing with the longer TTL'],
                ['Cache read / refresh', '0.1× (90% off)', 'Every later call that hits'],
                ['Uncached input', '1×', 'Everything after the last breakpoint'],
              ].map(([t, c, w]) => (
                <tr key={t} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{t}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info" title="Practical Anthropic notes">
          <ul className="list-disc space-y-1 pl-5">
            <li>Up to <strong className="text-white">4</strong> breakpoints per request — cache several layers (tools, system, docs) independently.</li>
            <li>Minimum cacheable prefix depends on the model (e.g. 1,024 tokens on Sonnet 5 / Opus 4.8; below it, nothing is cached).</li>
            <li>For <code className="font-mono text-sm">"ttl":"1h"</code>, put longer-TTL breakpoints <em>before</em> shorter ones in the prompt.</li>
          </ul>
        </Callout>
      </LessonSection>

      <LessonSection title="Implementing it — Google Gemini (explicit context caching)">
        <p className="text-slate-300">
          Gemini also supports both. <strong className="text-white">Implicit</strong> caching is on by
          default (place big shared content first). <strong className="text-white">Explicit</strong>{' '}
          caching creates a reusable <code className="font-mono text-sm">CachedContent</code> object you
          reference by name — handy for a large document you will ask many questions about.
        </p>
        <Example
          title="Create a cache once, ask it many questions"
          output={`cached_content_token_count: 42311   # the doc, stored once and reused`}
        >{`from google import genai
from google.genai import types

client = genai.Client()

# Store the big context once, with a 1-hour TTL.
cache = client.caches.create(
    model="gemini-2.5-pro",
    config=types.CreateCachedContentConfig(
        system_instruction="You are a contract analyst.",
        contents=[long_contract_pdf_text],   # the large, reused context
        ttl="3600s",
    ),
)

# Each question reuses the cached document (billed ~90% cheaper on 2.5+).
resp = client.models.generate_content(
    model="gemini-2.5-pro",
    contents="List every termination clause in section 7.",
    config=types.GenerateContentConfig(cached_content=cache.name),
)
print(resp.usage_metadata.cached_content_token_count)`}</Example>
      </LessonSection>

      <LessonSection title="Implementing it — self-hosted (vLLM Automatic Prefix Caching)">
        <p className="text-slate-300">
          If you serve open-weight models yourself, you get the same benefit for free. vLLM's{' '}
          <strong className="text-white">Automatic Prefix Caching (APC)</strong> reuses KV blocks across
          requests whenever they share a prefix. Turn it on with a single flag.
        </p>
        <Example
          title="Enable APC in vLLM"
          output={`# Second query shares the long table prefix -> its KV blocks are reused,
# so only the differing question tokens are prefilled. Big TTFT win.`}
        >{`from vllm import LLM, SamplingParams

llm = LLM(
    model="meta-llama/Llama-3.1-8B-Instruct",
    enable_prefix_caching=True,   # <- turn on APC
)

# Or when serving an OpenAI-compatible endpoint:
#   vllm serve meta-llama/Llama-3.1-8B-Instruct --enable-prefix-caching

shared = LONG_SYSTEM_PROMPT      # identical across the batch
llm.generate([shared + q for q in questions], SamplingParams(max_tokens=128))`}</Example>
        <ContentStep number={1} title="How it decides what to reuse (block hashing)">
          <p className="text-slate-300">
            vLLM splits the sequence into fixed-size <strong className="text-white">blocks</strong> of
            tokens. Each block gets a hash built from <em>its</em> tokens plus the hash of the block
            before it (the parent). Two requests produce the same block hashes only if their tokens
            match from the start — so identical hashes mean &ldquo;this KV block is already computed,
            reuse it.&rdquo; Unused blocks are evicted LRU-style when GPU memory is needed.
          </p>
        </ContentStep>
        <Callout variant="insight">
          This is the same prefix idea as the hosted APIs, just visible at the block level: the chain
          of parent hashes is exactly what enforces &ldquo;the whole prefix must match.&rdquo;
        </Callout>
      </LessonSection>

      <LessonSection title="What to cache (and what not to)">
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4">
            <p className="text-sm font-semibold text-emerald-400">Great candidates (big + stable)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Long system prompts / role instructions</li>
              <li>Tool &amp; function-calling schemas</li>
              <li>Few-shot examples</li>
              <li>A large document you ask many questions about (RAG context, a codebase, a contract)</li>
              <li>The stable earlier turns of a long chat</li>
            </ul>
          </div>
          <div className="rounded-xl border border-python-500/30 bg-python-500/5 p-4">
            <p className="text-sm font-semibold text-python-400">Poor candidates (small or volatile)</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Short prompts under the minimum token threshold</li>
              <li>Content with a timestamp / request ID / user name near the top</li>
              <li>Prefixes used only once (a write with no reads is a net cost)</li>
              <li>Anything that changes every request (put it last instead)</li>
            </ul>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="The cost & latency math (worked example)">
        <p className="text-slate-300">
          Caching is only a win if the prefix is <em>read</em> enough times to earn back the write
          premium. Here is the break-even using Anthropic's multipliers.
        </p>
        <Example
          title="Is caching worth it for N requests?"
          output={`Prefix = 8000 tokens, reused across 100 requests in a burst (5-min TTL).

Without caching: 100 x 8000 x 1.0  = 800,000 base-token-units
With caching:    1 write (1.25x) + 99 reads (0.1x)
               = 8000x1.25 + 99x8000x0.1
               = 10,000 + 79,200
               = 89,200 base-token-units
Savings on the prefix: ~89%
Break-even: caching wins after just 1 cache read.`}
        >{`def cost_units(prefix_tokens, n_requests, write_mult, read_mult):
    # first request writes, the rest read
    write = prefix_tokens * write_mult
    reads = (n_requests - 1) * prefix_tokens * read_mult
    return write + reads

prefix = 8000
n = 100

no_cache = n * prefix * 1.0
cached   = cost_units(prefix, n, write_mult=1.25, read_mult=0.1)

print("without caching:", int(no_cache))
print("with caching:   ", int(cached))
print("savings:        ", f"{100 * (1 - cached / no_cache):.0f}%")`}</Example>
        <Callout variant="tip" title="Choosing the TTL">
          Match the TTL to how often requests arrive. If calls reliably come <strong className="text-white">less than 5 minutes</strong>{' '}
          apart, the default TTL is cheapest (each hit refreshes it for free). If gaps are longer but
          under an hour, pay the one-time 2× write for the 1-hour TTL — it beats paying the 1.25× write
          on every call and never getting a read.
        </Callout>
      </LessonSection>

      <LessonSection title="Advanced patterns">
        <ContentStep number={1} title="Multi-turn chat: cache the growing history">
          <p className="text-slate-300">
            In a conversation, turns 1…N are a stable prefix for turn N+1. Move the cache breakpoint to
            the end of the latest completed turn each round, so the whole conversation so far is reused
            and only the newest user message is prefilled fresh. This keeps long chats fast and cheap.
          </p>
        </ContentStep>
        <ContentStep number={2} title="RAG: cache the big context, vary the query">
          <p className="text-slate-300">
            When you ask several questions about the same retrieved documents, cache the documents (the
            large, shared part) and keep only the question at the end. One expensive write, many cheap
            reads — ideal for &ldquo;chat with this PDF/codebase&rdquo; features.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Cache-aware routing (stickiness)">
          <p className="text-slate-300">
            A cache lives on a specific server. If your load balancer sends the next request to a
            different replica, you miss even with an identical prefix. Providers use a key (e.g.{' '}
            <code className="font-mono text-sm">prompt_cache_key</code>) to route matching prompts to
            the same machine; self-hosted setups do &ldquo;prefix-aware&rdquo; routing. This alone can
            lift hit rates dramatically (e.g. 60% → 87%).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Layered breakpoints">
          <p className="text-slate-300">
            Cache in tiers: a rarely-changing system prompt as one layer, per-document context as
            another. If the document changes but the system prompt does not, you still reuse the first
            layer instead of losing everything.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Pitfalls & gotchas">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">One byte kills the prefix.</strong> A changed word, an extra
            space, a reordered tool, a JSON key in a different order — any of these near the top resets
            the cache to a miss.
          </li>
          <li>
            <strong className="text-white">Silent no-ops below the minimum.</strong> Under ~1,024
            tokens nothing is cached and no error is raised. Verify with the usage fields.
          </li>
          <li>
            <strong className="text-white">Writes cost more than nothing.</strong> A prefix cached once
            and never reused is <em>more</em> expensive than not caching. Only cache what repeats.
          </li>
          <li>
            <strong className="text-white">TTL expiry between bursts.</strong> Traffic that arrives just
            outside the TTL pays the write every time. Consider a longer TTL or a keep-warm ping.
          </li>
          <li>
            <strong className="text-white">Isolation.</strong> Caches are scoped to your
            organization/project and are not shared across tenants — but on self-hosted multi-tenant
            servers, choose a cryptographically-secure block hash to avoid collision risks.
          </li>
          <li>
            <strong className="text-white">Measure it.</strong> Track hit rate (cached vs total input
            tokens) as a first-class metric; it is the only way to know caching is actually working.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prompt caching = the prefill KV cache kept alive between requests, so a repeated prompt prefix is processed once and reused (up to ~90% cheaper input, ~80% faster first token).',
          'Only an exact prefix from the start of the prompt can be reused — so put stable content (system prompt, tools, examples, docs) first and changing content (the user query, timestamps, IDs) last.',
          'A cache entry has a TTL that each hit refreshes for free, and a minimum size (~1,024 tokens) below which caching does nothing.',
          'Automatic caching (OpenAI, Gemini implicit, vLLM APC) needs no code — just good prompt ordering; explicit caching (Anthropic cache_control, Gemini CachedContent) lets you mark the breakpoint and TTL.',
          'Cache reads are cheap (~0.1×) and writes carry a small premium (1.25×–2×), so caching pays off after roughly one reuse — cache things that repeat, never one-offs.',
          'Advanced wins: cache growing chat history, cache big RAG context while varying the query, use sticky routing so hits land on the same server, and always monitor the hit rate.',
        ]}
      />
    </LessonArticle>
  )
}
