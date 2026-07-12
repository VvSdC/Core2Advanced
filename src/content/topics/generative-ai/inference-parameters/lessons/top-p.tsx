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

export function TopP() {
  return (
    <LessonArticle>
      <Definition term="Top-P (Nucleus) Sampling">
        <p>
          <strong className="text-white">Top-p sampling</strong> (also called <strong className="text-white">nucleus
          sampling</strong>) keeps the <em>smallest</em> set of tokens whose combined probability is at least{' '}
          <em>p</em>. Unlike top-k, the number of kept tokens changes dynamically based on how confident the model is.
        </p>
      </Definition>

      <LessonSection title="The rule">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Sort tokens by probability (highest first).</li>
          <li>Add tokens one by one, tracking the running total (cumulative probability).</li>
          <li>Stop as soon as cumulative ≥ p (e.g. 0.9 means 90%).</li>
          <li>Discard everything else, renormalise the nucleus, and sample.</li>
        </ol>
        <Callout variant="beginner">
          Think of top-p as: <em>"keep adding tokens until we've covered 90% of the probability mass."</em> The
          walkthrough below counts through dummy numbers so you can see the nucleus form.
        </Callout>
        <Flowchart
          title="Top-p = 0.9 at a glance"
          chart={`flowchart TB
  A["Sort: mat=35%, floor=22%, couch=18%, roof=8% …"] --> B["Add mat: running total=35%"]
  B --> C["Add floor: running total=57%"]
  C --> D["Add couch: running total=75%"]
  D --> E["Add roof: running total=83%"]
  E --> F["Add chair: running total=87%"]
  F --> G["Add table: running total=90% → STOP"]
  G --> H["Nucleus = 6 tokens, rescale, sample"]`}
        />
      </LessonSection>

      <LessonSection title="Top-p adapts to confidence">
        <ContentStep number={1} title="When the model is very confident">
          <p>
            If one token has P = 0.95, nucleus with p=0.9 might contain <strong className="text-white">only 1
            token</strong>. Behaviour is nearly greedy — appropriate when the answer is obvious.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When the model is uncertain">
          <p>
            If probability is spread across many tokens (P(top) = 0.15), the nucleus might include{' '}
            <strong className="text-white">30+ tokens</strong> to reach p=0.9. More variety is allowed when the
            model itself is unsure.
          </p>
        </ContentStep>

      </LessonSection>

      <LessonSection title="See it in action — beginner walkthrough">
        <p>
          Same prompt: <code className="font-mono text-sm">"The cat sat on the"</code>. We set{' '}
          <strong className="text-white">top_p = 0.9</strong> (keep tokens until we cover 90% of probability).
        </p>

        <ContentStep number={1} title="Step 1 — sort tokens and add up as you go">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Add this token</th>
                  <th className="px-4 py-3">Its probability</th>
                  <th className="px-4 py-3">Running total</th>
                  <th className="px-4 py-3">Keep?</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  [' mat', '35%', '35%', 'yes'],
                  [' floor', '22%', '57%', 'yes'],
                  [' couch', '18%', '75%', 'yes'],
                  [' roof', '8%', '83%', 'yes'],
                  [' chair', '4%', '87%', 'yes'],
                  [' table', '3%', '90%', 'yes ← stop here'],
                  [' rug', '2%', '92%', 'no — cut off'],
                  [' others', '8%', '100%', 'no'],
                ].map(([token, prob, cum, keep]) => (
                  <tr key={token} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono">{token}</td>
                    <td className="px-4 py-3 font-mono">{prob}</td>
                    <td className="px-4 py-3 font-mono">{cum}</td>
                    <td className="px-4 py-3 text-genai-400">{keep}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">
            We stop after " table" because the running total hit 90%. " rug" and everything after it is thrown
            away — even though " rug" still had a 2% chance on its own.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Step 2 — rescale the nucleus to 100%">
          <p>The 6 kept tokens originally summed to 90%. Rescale each:</p>
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm"> mat</code>: 35% ÷ 90% = <strong className="text-white">39%</strong> (still the favourite)</li>
            <li><code className="font-mono text-sm"> floor</code>: 22% ÷ 90% = <strong className="text-white">24%</strong></li>
            <li><code className="font-mono text-sm"> couch</code>: 18% ÷ 90% = <strong className="text-white">20%</strong></li>
            <li>…and so on for the other three nucleus tokens</li>
          </ul>
        </ContentStep>

        <ContentStep number={3} title="Step 3 — compare with top-k">
          <p>
            Top-k with K=3 kept only 3 tokens no matter what. Top-p with p=0.9 kept <strong className="text-white">6
            tokens</strong> here because probability was spread out. If the model had been 95% sure of " mat"
            alone, top_p=0.9 would have kept <strong className="text-white">just 1 token</strong> — automatically
            acting greedy when confident.
          </p>
        </ContentStep>

        <Example
          title="Try it in code"
          output={`Nucleus (6 tokens): [' mat', ' floor', ' couch', ' roof', ' chair', ' table']
Rescaled P(mat) = 39%`}
        >{`probs = {" mat": 0.35, " floor": 0.22, " couch": 0.18, " roof": 0.08,
         " chair": 0.04, " table": 0.03, " rug": 0.02, " other": 0.08}

def top_p_filter(probs, p):
    running, nucleus = 0.0, []
    for token, prob in sorted(probs.items(), key=lambda x: -x[1]):
        nucleus.append(token)
        running += prob
        if running >= p:
            break
    total = sum(probs[t] for t in nucleus)
    rescaled = {t: round(probs[t] / total, 2) for t in nucleus}
    return nucleus, rescaled

nucleus, rescaled = top_p_filter(probs, p=0.9)
print(f"Nucleus ({len(nucleus)} tokens):", nucleus)
print(f"Rescaled P(mat) = {rescaled[' mat']:.0%}")`}</Example>
      </LessonSection>

      <LessonSection title="How the model behaves">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">top_p value</th>
                <th className="px-4 py-3">Behaviour</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['0.1 – 0.5', 'Very few tokens survive — near-greedy', 'Code, JSON, deterministic tasks'],
                ['0.9 (default)', 'Balanced — adapts to model confidence', 'General chat and writing'],
                ['0.95 – 1.0', 'Large nucleus — high diversity', 'Creative brainstorming'],
              ].map(([val, behaviour, use]) => (
                <tr key={val} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{val}</td>
                  <td className="px-4 py-3">{behaviour}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        Most APIs apply top-p <em>after</em> temperature. OpenAI recommends altering temperature{' '}
        <em>or</em> top-p, not both aggressively at the same time. Typical starting point: temperature=1.0,
        top_p=0.9.
      </Callout>

      <KeyTakeaways
        items={[
          'Top-p keeps the smallest token set whose cumulative probability ≥ p.',
          'Adapts dynamically: 1 token when confident, many when uncertain.',
          'Better than top-k for handling both peaked and flat distributions.',
          'Default top_p=0.9 works well for most tasks; lower for factual/code output.',
        ]}
      />
    </LessonArticle>
  )
}
