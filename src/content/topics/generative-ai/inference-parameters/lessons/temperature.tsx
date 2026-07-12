import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Temperature() {
  return (
    <LessonArticle>
      <Definition term="Temperature">
        <p>
          <strong className="text-white">Temperature</strong> (T) rescales the model's raw scores (logits) before
          converting them to probabilities. It controls the trade-off between{' '}
          <strong className="text-white">safe, predictable</strong> outputs and{' '}
          <strong className="text-white">creative, varied</strong> ones.
        </p>
      </Definition>

      <LessonSection title="The formula">
        <p>
          Given raw logits <code className="font-mono text-sm">zᵢ</code> for each token <em>i</em>, temperature
          modifies the softmax:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          P(token i) = exp(zᵢ / T) / Σⱼ exp(zⱼ / T)
        </div>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">T = 1.0</strong> — use the model's raw probabilities unchanged.</li>
          <li><strong className="text-white">T &lt; 1</strong> (e.g. 0.2) — amplify differences; high-probability tokens dominate even more.</li>
          <li><strong className="text-white">T &gt; 1</strong> (e.g. 1.5) — shrink differences; unlikely tokens get a better chance.</li>
          <li><strong className="text-white">T → 0</strong> — effectively greedy: always pick the single highest-probability token.</li>
        </ul>
        <Callout variant="beginner">
          You do not need to memorise this formula. The walkthrough below uses dummy numbers so you can see
          exactly what temperature does to real next-token probabilities.
        </Callout>
      </LessonSection>

      <LessonSection title="How the model behaves">
        <ContentStep number={1} title="Low temperature (0.0 – 0.3)">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Almost always picks the most likely token — deterministic or near-deterministic.</li>
            <li>Repetitive if you generate multiple times with the same prompt.</li>
            <li>Best for: code, JSON, factual Q&A, math, extraction.</li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Medium temperature (0.5 – 0.8)">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Balanced — likely tokens preferred but some variation.</li>
            <li>Good default for general assistant chat.</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="High temperature (1.0 – 2.0)">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>Surprising word choices; more creative but less reliable.</li>
            <li>Higher hallucination and grammar errors.</li>
            <li>Best for: brainstorming, creative writing, poetry.</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="See it in action — beginner walkthrough">
        <p>
          Prompt: <code className="font-mono text-sm">"The sky is"</code>. The model considers three possible
          next tokens. Here is what temperature does to their chances, step by step.
        </p>

        <ContentStep number={1} title="Step 1 — the model's raw scores (before temperature)">
          <p>Think of logits as confidence points — higher means more likely:</p>
          <div className="mt-2 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Next token</th>
                  <th className="px-4 py-3">Raw score (logit)</th>
                  <th className="px-4 py-3">At T = 1.0 (normal)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  [' blue', '3.0', '67% chance'],
                  [' clear', '1.0', '24% chance'],
                  [' green', '0.0', '9% chance'],
                ].map(([token, logit, prob]) => (
                  <tr key={token} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono">{token}</td>
                    <td className="px-4 py-3 font-mono">{logit}</td>
                    <td className="px-4 py-3">{prob}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3">At default temperature, <strong className="text-white">" blue"</strong> is the favourite but <strong className="text-white">" green"</strong> still has a 9% shot.</p>
        </ContentStep>

        <ContentStep number={2} title="Step 2 — apply T = 0.2 (low temperature)">
          <p>Divide each score by 0.2 — this <em>amplifies</em> the gaps between tokens:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm"> blue</code>: 3.0 ÷ 0.2 = <strong className="text-white">15</strong> (was already highest — now dominates)</li>
            <li><code className="font-mono text-sm"> clear</code>: 1.0 ÷ 0.2 = <strong className="text-white">5</strong></li>
            <li><code className="font-mono text-sm"> green</code>: 0.0 ÷ 0.2 = <strong className="text-white">0</strong></li>
          </ul>
          <p className="mt-3">Convert back to probabilities → <strong className="text-white">" blue" = 96%</strong>, " clear" = 3%, " green" = 1%.</p>
          <Callout variant="insight">
            Low temperature made the leader almost certain. The model will pick " blue" nearly every time — good
            for factual answers, bad if you want variety.
          </Callout>
        </ContentStep>

        <ContentStep number={3} title="Step 3 — apply T = 1.5 (high temperature)">
          <p>Divide each score by 1.5 — this <em>shrinks</em> the gaps, giving underdogs a better chance:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><code className="font-mono text-sm"> blue</code>: 3.0 ÷ 1.5 = 2.0</li>
            <li><code className="font-mono text-sm"> clear</code>: 1.0 ÷ 1.5 = 0.67</li>
            <li><code className="font-mono text-sm"> green</code>: 0.0 ÷ 1.5 = 0.0</li>
          </ul>
          <p className="mt-3">Convert back to probabilities → <strong className="text-white">" blue" = 48%</strong>, " clear" = 30%, " green" = 22%.</p>
          <p className="mt-2">
            " green" jumped from 9% to 22% — almost three times more likely. The model will sometimes surprise
            you with unexpected words.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Side-by-side — what you should remember">
          <div className="overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Token</th>
                  <th className="px-4 py-3">T = 0.2 (focused)</th>
                  <th className="px-4 py-3">T = 1.0 (default)</th>
                  <th className="px-4 py-3">T = 1.5 (creative)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  [' blue', '96%', '67%', '48%'],
                  [' clear', '3%', '24%', '30%'],
                  [' green', '1%', '9%', '22%'],
                ].map(([token, low, mid, high]) => (
                  <tr key={token} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono">{token}</td>
                    <td className="px-4 py-3 font-mono text-genai-400">{low}</td>
                    <td className="px-4 py-3 font-mono">{mid}</td>
                    <td className="px-4 py-3 font-mono text-amber-400">{high}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-slate-300">
            The mental model: <strong className="text-white">low T squishes probability toward the winner</strong>;
            <strong className="text-white"> high T flattens the field</strong>. That is all the formula is doing.
          </p>
        </ContentStep>

        <Example
          title="Verify with code (optional)"
          output={`T=0.2 → blue=96%, clear=3%, green=1%
T=1.0 → blue=67%, clear=24%, green=9%
T=1.5 → blue=48%, clear=30%, green=22%`}
        >{`import math

logits = {" blue": 3.0, " clear": 1.0, " green": 0.0}

def probs_at_temperature(logits, T):
    scaled = {t: v / T for t, v in logits.items()}
    exp = {t: math.exp(v) for t, v in scaled.items()}
    total = sum(exp.values())
    return {t: round(100 * v / total) for t, v in exp.items()}

for T in [0.2, 1.0, 1.5]:
    p = probs_at_temperature(logits, T)
    parts = ", ".join(f"{k.strip()}={v}%" for k, v in p.items())
    print(f"T={T} → {parts}")`}</Example>
      </LessonSection>

      <Callout variant="insight">
        Temperature is applied <em>before</em> top-k and top-p filtering. In practice, low temperature + top-p
        0.9 is a common combination for factual tasks.
      </Callout>

      <KeyTakeaways
        items={[
          'Temperature scales logits: low T → peaked (greedy), high T → flat (creative).',
          'Formula: P(i) = exp(zᵢ/T) / Σ exp(zⱼ/T). T→0 means always pick the top token.',
          'Use 0–0.3 for facts/code; 0.7–1.0 for creative tasks.',
          'Applied at every token — small changes compound across the full response.',
        ]}
      />
    </LessonArticle>
  )
}
