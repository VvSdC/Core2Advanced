import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TopK() {
  return (
    <LessonArticle>
      <Definition term="Top-K Sampling">
        <p>
          <strong className="text-white">Top-k sampling</strong> keeps only the <em>K</em> highest-probability
          tokens, sets all others to zero, renormalises, and samples from the survivors. It throws away the
          long tail of unlikely tokens.
        </p>
      </Definition>

      <LessonSection title="The rule">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Sort all tokens by probability (highest first).</li>
          <li>Keep the top K tokens; discard the rest.</li>
          <li>Renormalise the remaining probabilities so they sum to 1.0.</li>
          <li>Sample one token from the filtered distribution.</li>
        </ol>
        <Callout variant="beginner">
          No formula to memorise — just "keep the top K, throw away the rest, rescale." The walkthrough below
          shows exactly how dummy probabilities change when K = 3.
        </Callout>
      </LessonSection>

      <LessonSection title="How the model behaves">
        <ContentStep number={1} title="Small K (1–10)">
          <p>
            Very restrictive — only the most obvious continuations survive. K=1 is pure greedy (always the top
            token). K=5–10 gives slight variety while blocking bizarre choices.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Large K (40–100)">
          <p>
            Common default in APIs. Allows more diversity but still cuts off the extreme tail (tokens with
            0.001% probability). A good general-purpose setting.
          </p>
        </ContentStep>
        <ContentStep number={3} title="K = 0 or disabled">
          <p>All tokens remain in play (subject to temperature and top-p). Rare tokens can slip through on high temperature.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="See it in action — beginner walkthrough">
        <p>
          Prompt: <code className="font-mono text-sm">"The cat sat on the"</code>. The model assigns these dummy
          probabilities to the next token. We set <strong className="text-white">top_k = 3</strong>.
        </p>

        <ContentStep number={1} title="Step 1 — start with 5 candidate tokens">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Rank</th>
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">Probability</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['1', ' mat', '35%'],
                  ['2', ' floor', '22%'],
                  ['3', ' couch', '18%'],
                  ['4', ' roof', '8%'],
                  ['5', ' chair', '4%'],
                  ['…', 'others', '13%'],
                ].map(([rank, token, prob]) => (
                  <tr key={rank + token} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3">{rank}</td>
                    <td className="px-4 py-3 font-mono">{token}</td>
                    <td className="px-4 py-3 font-mono">{prob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Step 2 — keep only top 3, delete the rest">
          <p>With K = 3, only <code className="font-mono text-sm"> mat</code>, <code className="font-mono text-sm"> floor</code>, and <code className="font-mono text-sm"> couch</code> survive. "roof", "chair", and all others are gone — their probability becomes 0%.</p>
        </ContentStep>

        <ContentStep number={3} title="Step 3 — rescale so the survivors sum to 100%">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Survivors add up to: 35% + 22% + 18% = <strong className="text-white">75%</strong> (not 100% yet)</li>
            <li>Divide each by 0.75 to rescale:</li>
            <li><code className="font-mono text-sm"> mat</code>: 35 ÷ 75 = <strong className="text-white">47%</strong></li>
            <li><code className="font-mono text-sm"> floor</code>: 22 ÷ 75 = <strong className="text-white">29%</strong></li>
            <li><code className="font-mono text-sm"> couch</code>: 18 ÷ 75 = <strong className="text-white">24%</strong></li>
          </ul>
          <p className="mt-3">Now the model randomly picks from just these three. " mat" is still the favourite, but " couch" has a real 24% chance — " roof" has <em>zero</em>.</p>
        </ContentStep>

        <Example
          title="Try it in code"
          output={`Kept: {' mat': 0.47, ' floor': 0.29, ' couch': 0.24}
Sampled: ' mat'`}
        >{`import random

probs = {" mat": 0.35, " floor": 0.22, " couch": 0.18, " roof": 0.08, " chair": 0.04}

def top_k_sample(probs, k):
    top = sorted(probs, key=probs.get, reverse=True)[:k]
    kept = {t: probs[t] for t in top}
    total = sum(kept.values())
    kept = {t: round(v / total, 2) for t, v in kept.items()}
    pick = random.choices(list(kept), weights=list(kept.values()), k=1)[0]
    return kept, pick

kept, sampled = top_k_sample(probs, k=3)
print(f"Kept: {kept}")
print(f"Sampled: {sampled!r}")`}</Example>
      </LessonSection>

      <Callout variant="insight">
        Top-k uses a <strong className="text-white">fixed count</strong> regardless of how confident the model
        is. If the model is 99% sure of one token, top_k=40 still keeps 39 other tokens. That is why top-p was
        invented — covered in the next lesson.
      </Callout>

      <KeyTakeaways
        items={[
          'Top-k keeps only the K highest-probability tokens, then renormalises and samples.',
          'Low K → safe and predictable; high K → more variety.',
          'Fixed K ignores how peaked the distribution is — top-p fixes this.',
          'Typical values: K=40–50 for general use; K=1 for greedy decoding.',
        ]}
      />
    </LessonArticle>
  )
}
