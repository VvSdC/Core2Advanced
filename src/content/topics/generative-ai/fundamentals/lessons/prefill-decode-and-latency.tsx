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

export function PrefillDecodeAndLatency() {
  return (
    <LessonArticle>
      <Definition term="Prefill & Decode">
        <p>
          When you send a prompt, an LLM answers in two distinct phases:{' '}
          <strong className="text-white">prefill</strong> (read and understand the whole prompt at once) and{' '}
          <strong className="text-white">decode</strong> (write the answer one token at a time). The short pause you feel
          before text starts streaming is the model finishing prefill.
        </p>
        <p>
          Both phases are powered by the <strong className="text-white">KV cache</strong> from the previous lesson —
          prefill fills it, decode reuses it.
        </p>
      </Definition>

      <Callout variant="beginner">
        Think of a student answering an exam question. First they <em>read the whole question</em> and gather their
        thoughts (prefill — one upfront effort). Then they <em>write the answer word by word</em> (decode — steady, one
        piece at a time). The pause before writing is them reading; the smooth flow afterwards is them writing.
      </Callout>

      <LessonSection title="Phase 1 — Prefill: reading the prompt all at once">
        <p>Prefill is a single, heavy step that processes your entire prompt in parallel:</p>
        <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            All of the prompt's tokens go through the Transformer blocks{' '}
            <strong className="text-white">at the same time</strong> — GPUs love this, so it's efficient per token.
          </li>
          <li>
            <strong className="text-white">Causal masking</strong> means each token may attend to itself and{' '}
            <em>earlier</em> tokens, but never future ones.
          </li>
          <li>
            For every token, the model computes and stores its <strong className="text-white">Key and Value</strong>{' '}
            vectors — this is the KV cache that decode will reuse.
          </li>
          <li>
            The <strong className="text-white">final token position</strong> can see information from the entire prompt,
            and its output gives the scores used to pick the <strong className="text-white">first new token</strong>.
          </li>
        </ul>
        <Callout variant="insight">
          Prefill is why a longer prompt makes you wait longer before the answer starts — there's simply more prompt to
          process before that first token can appear.
        </Callout>
      </LessonSection>

      <LessonSection title="Phase 2 — Decode: writing the answer, one token at a time">
        <p>
          Once the first token is chosen, the model enters decode. It takes the token it just generated, runs only{' '}
          <em>that</em> token through the network, and predicts the next one — <strong className="text-white">reusing the
          cached Keys and Values</strong> of every earlier token instead of recomputing them.
        </p>
        <p>
          This repeats one token at a time until the model emits a stop signal or hits the length limit. Because each new
          token is generated from all the tokens before it, this is called{' '}
          <strong className="text-white">autoregressive generation</strong>: every new token depends on the prompt plus
          everything generated so far.
        </p>
        <Flowchart
          title="Prefill once, then decode in a loop"
          chart={`flowchart TB
  A["Prompt tokens"] --> B["PREFILL: process all in parallel (causal mask), fill KV cache"]
  B --> C["Pick first new token"]
  C --> D["DECODE: run only the new token, reuse KV cache"]
  D --> E["Pick next token, append to KV cache"]
  E --> F{"Stop token or max length?"}
  F -- no --> D
  F -- yes --> G([Answer complete])`}
        />
        <Callout variant="info">
          Key contrast: <strong className="text-white">prefill</strong> handles many tokens in one parallel pass;{' '}
          <strong className="text-white">decode</strong> handles exactly one token per step. That's why the first token is
          the slow part and the rest stream quickly.
        </Callout>
      </LessonSection>

      <LessonSection title="A worked example">
        <p>
          Prompt: <code className="font-mono text-sm">"Translate to French: good morning"</code>. Suppose it becomes 6
          tokens, and the answer is <code className="font-mono text-sm">"Bonjour"</code> (2 tokens).
        </p>

        <ContentStep number={1} title="Prefill (one parallel pass over 6 prompt tokens)">
          <Example
            title="Prefill processes the whole prompt at once"
            output={`Processing 6 prompt tokens in parallel...
  stored K,V for: 'Translate', ' to', ' French', ':', ' good', ' morning'
Final position sees the whole prompt -> scores for the first token
First token chosen: 'Bon'`}
          >{`prompt_tokens = ["Translate", " to", " French", ":", " good", " morning"]

# All 6 tokens go through the model together (causal masking:
# each token only attends to itself + earlier tokens).
print(f"Processing {len(prompt_tokens)} prompt tokens in parallel...")
kv_cache = [f"K,V({t.strip()})" for t in prompt_tokens]   # cache is filled
print("  stored K,V for:", ", ".join(repr(t) for t in prompt_tokens))
print("Final position sees the whole prompt -> scores for the first token")
print("First token chosen: 'Bon'")`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Decode (one token per step, reusing the cache)">
          <Example
            title="Decode generates 'Bon' -> 'jour' -> stop"
            output={`Step 1: input 'Bon'  | reuse 6 cached K,V | predict 'jour'
Step 2: input 'jour' | reuse 7 cached K,V | predict <end>
Final answer: Bonjour`}
          >{`cache_size = 6          # from prefill
generated = ["Bon"]     # first token came from prefill

steps = [("Bon", "jour"), ("jour", "<end>")]
for i, (inp, nxt) in enumerate(steps, start=1):
    print(f"Step {i}: input {inp!r:6} | reuse {cache_size} cached K,V | predict {nxt!r}")
    cache_size += 1     # the new token's K,V is appended to the cache
    if nxt != "<end>":
        generated.append(nxt)

print("Final answer:", "".join(generated))`}</Example>
          <Callout variant="insight">
            Notice decode never recomputes the prompt's Keys and Values — it just appends each new token's K,V to the
            cache and moves on. That reuse is exactly what the KV cache buys you.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Two metrics that describe the feel of speed">
        <p>
          These two phases map cleanly onto the two numbers people use to measure LLM responsiveness:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">What it measures</th>
                <th className="px-4 py-3">Driven mostly by</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['TTFT — Time To First Token', 'The wait from sending your request until the first token arrives', 'Prefill + queueing + network'],
                ['TPOT — Time Per Output Token', 'The average gap between output tokens after the first', 'Decode (one token per step)'],
              ].map(([metric, measures, driver]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{measures}</td>
                  <td className="px-4 py-3 text-slate-400">{driver}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="info">
          <strong className="text-white">TTFT</strong> includes more than compute: time spent queueing on a busy server
          and network latency both count, because it's measured from the moment <em>you</em> send the request.{' '}
          <strong className="text-white">TPOT</strong> is purely the steady streaming rhythm of decode.
        </Callout>

        <Example
          title="Estimating total response time from TTFT and TPOT"
          output={`TTFT: 0.40 s  (prefill + queue + network)
TPOT: 0.025 s per token
Output length: 200 tokens

Total time = 0.40 + 0.025 * (200 - 1)
           = 5.375 s
Perceived speed: ~40 tokens/sec after the first token`}
          caption="The first token uses TTFT; every token after that uses TPOT. Long answers are dominated by TPOT."
        >{`ttft = 0.40          # seconds until first token
tpot = 0.025         # seconds per output token thereafter
output_tokens = 200

total = ttft + tpot * (output_tokens - 1)
tps = 1 / tpot

print(f"TTFT: {ttft:.2f} s  (prefill + queue + network)")
print(f"TPOT: {tpot:.3f} s per token")
print(f"Output length: {output_tokens} tokens\\n")
print(f"Total time = {ttft:.2f} + {tpot} * ({output_tokens} - 1)")
print(f"           = {total:.3f} s")
print(f"Perceived speed: ~{tps:.0f} tokens/sec after the first token")`}</Example>
        <Callout variant="tip">
          Streaming the response makes apps feel fast by hiding TPOT — users start reading after TTFT instead of waiting
          for the whole answer. Optimising TTFT (faster prefill, less queueing) is what removes the "pause before it
          starts talking".
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Answering happens in two phases: prefill (process the whole prompt in parallel, fill the KV cache) then decode (generate one token at a time, reusing the cache).',
          'Causal masking during prefill lets each token attend to itself and earlier tokens; the final position uses the whole prompt to pick the first new token.',
          'Decode is autoregressive: each new token depends on the prompt plus all tokens generated so far, and reuses cached K,V instead of recomputing them.',
          'TTFT (Time To First Token) reflects prefill + queueing + network — the pause before the answer starts.',
          'TPOT (Time Per Output Token) reflects decode — the steady streaming speed; total time ≈ TTFT + TPOT × (tokens − 1).',
        ]}
      />
    </LessonArticle>
  )
}
