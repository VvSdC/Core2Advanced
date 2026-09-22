import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ProbabilityFoundations() {
  return (
    <LessonArticle>
      <Definition term="Probability">
        <p>
          Probability is a number between 0 and 1 that measures how likely something is to happen. Before we
          can compute one, we need three basic ingredients:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Sample space Ω</strong> — every possible outcome of the experiment.</li>
          <li><strong className="text-white">Event A</strong> — any subset of the sample space (a &ldquo;thing that might happen&rdquo;).</li>
          <li><strong className="text-white">Probability function P</strong> — assigns a number in [0, 1] to every event, obeying three rules (Kolmogorov&rsquo;s axioms).</li>
        </ul>
      </Definition>

      <LessonSection title="The three axioms — the whole edifice sits on these">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>1)  P(A)   ≥ 0                      (probabilities are never negative)</div>
          <div>2)  P(Ω)   = 1                       (something in Ω must happen)</div>
          <div>3)  A, B disjoint ⇒ P(A ∪ B) = P(A) + P(B)   (add for exclusive events)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Everything you have ever seen in probability — Bayes, CLT, MLE, KL divergence — is a consequence of
          these three lines.
        </p>
      </LessonSection>

      <LessonSection title="Consequences you can just quote">
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Complement</strong> — P(Aᶜ) = 1 − P(A).</li>
          <li><strong className="text-white">Empty set</strong> — P(∅) = 0.</li>
          <li><strong className="text-white">Monotonicity</strong> — A ⊆ B ⇒ P(A) ≤ P(B).</li>
          <li>
            <strong className="text-white">Inclusion–exclusion</strong> —{' '}
            <code className="text-slate-200">P(A ∪ B) = P(A) + P(B) − P(A ∩ B)</code>. For three events:
            add singles, subtract pairs, add triples.
          </li>
          <li><strong className="text-white">Bounds</strong> — P(A ∩ B) ≤ min(P(A), P(B));  max ≤ P(A ∪ B) ≤ P(A) + P(B).</li>
        </ul>
      </LessonSection>

      <LessonSection title="Counting when outcomes are equally likely">
        <p className="text-slate-300">
          When every outcome in Ω is equally likely (fair coin, well-shuffled deck):
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(A) = |A| / |Ω|     ← number of favourable / number of total outcomes</div>
        </div>
        <p className="mt-3 text-slate-300">
          So the real work becomes <em>counting</em> — using three tools:
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Tool</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3">Reads as</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Multiplication rule',        '|A × B| = |A| · |B|',           'k choices × m choices'],
                ['Permutations (order matters)', 'P(n, k) = n! / (n − k)!',      'pick k in order'],
                ['Combinations (order does not)', 'C(n, k) = n! / (k! (n − k)!)', 'pick k, ignore order'],
              ].map(([tool, f, r]) => (
                <tr key={tool}>
                  <td className="px-4 py-3 font-semibold text-white">{tool}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Independence — the &ldquo;multiply the probabilities&rdquo; rule">
        <Definition term="Independent events">
          <p>
            Two events A and B are <strong className="text-white">independent</strong> if knowing one
            happened tells you nothing about the other:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(A ∩ B) = P(A) · P(B)</div>
          </div>
          <p className="mt-2 text-slate-300">
            Do not confuse with &ldquo;disjoint&rdquo;. Disjoint means both cannot happen; independent means
            one happening does not change the other&rsquo;s probability. Two disjoint non-null events are
            never independent — one occurring rules the other out completely.
          </p>
        </Definition>
        <Callout variant="insight" title="ML link">
          The i.i.d. assumption in every ML dataset (&ldquo;independent, identically distributed&rdquo;) is
          exactly this axiom repeated n times. When it breaks (leaked labels, autocorrelated time series),
          everything downstream — train/test splits, cross-validation, test-set metrics — becomes wrong.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Two fair dice">
          <p>Roll two fair six-sided dice. What is P(sum = 7)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|Ω| = 6 · 6 = 36 outcomes.</div>
            <div>Favourable: (1, 6) (2, 5) (3, 4) (4, 3) (5, 2) (6, 1) → 6 outcomes.</div>
            <div className="mt-1">P = 6 / 36 = 1/6 ≈ 0.1667.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Inclusion–exclusion">
          <p>
            In a class, 60% study Math, 45% study Physics, and 30% study both. What is the probability a
            random student studies at least one?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(M ∪ P) = P(M) + P(P) − P(M ∩ P) = 0.60 + 0.45 − 0.30 = 0.75.</div>
            <div className="mt-1">And P(neither) = 1 − 0.75 = 0.25.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Permutations vs combinations">
          <p>
            (a) How many 4-letter passwords use distinct letters from A–Z? (b) In how many ways can 3
            classmates be picked from 20 to form a study group?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>(a) Order matters (ABCD ≠ DCBA):  P(26, 4) = 26 · 25 · 24 · 23 = 358,800.</div>
            <div>(b) Order does not matter:         C(20, 3) = 20! / (3! · 17!) = 1140.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Birthday problem (surprising)">
          <p>What is the probability that in a group of 23 people, at least two share a birthday?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Easier via the complement: P(all different) = (365/365) · (364/365) · … · (343/365).</div>
            <div>= ∏(k=0..22) (365 − k)/365 ≈ 0.4927.</div>
            <div className="mt-1">P(at least one match) = 1 − 0.4927 ≈ 0.5073.</div>
            <div className="mt-2 text-genai-400">More than 50% at just 23 people — famously counterintuitive.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Independence check">
          <p>
            Roll one die. A = &ldquo;even&rdquo; = {`{2, 4, 6}`}. B = &ldquo;≤ 3&rdquo; = {`{1, 2, 3}`}. Are
            A and B independent?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(A) = 3/6 = 1/2,   P(B) = 3/6 = 1/2,   P(A) P(B) = 1/4.</div>
            <div>A ∩ B = {`{2}`} → P(A ∩ B) = 1/6.</div>
            <div className="mt-2 text-red-400">1/6 ≠ 1/4 → NOT independent.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — i.i.d. sanity check (ML flavour)">
          <p>
            You train a spam filter on emails from user X, but the test set also contains emails from user X.
            Why is the reported accuracy suspect?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Train and test samples share the same source → not independent.</div>
            <div>The model memorises user-X phrasing rather than generalisable spam signals.</div>
            <div className="mt-1 text-genai-400">
              Fix: group-based split (all of user X in train OR test, never both).
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — simulation as a sanity check">
        <Example
          title="Every calculation, double-checked"
          output={`P(sum = 7)      analytic = 0.1667,   MC = 0.1657
P(M ∪ P)                        0.75  (analytic)
Birthday clash  analytic = 0.5073,   MC = 0.5074  (n=100000)
Independent?  Empirical P(A)P(B) = 0.2510   P(A ∩ B) = 0.1665  → NOT indep
Combinations  C(20, 3) = 1140
Permutations  P(26, 4) = 358800`}
        >{`import numpy as np
from math import comb, perm, prod

rng = np.random.default_rng(0)
N   = 100_000

# ---- P(sum = 7) ----
d1, d2 = rng.integers(1, 7, N), rng.integers(1, 7, N)
p7_mc = np.mean(d1 + d2 == 7)
print(f"P(sum = 7)      analytic = {1/6:.4f},   MC = {p7_mc:.4f}")

# ---- Inclusion–exclusion (analytic only) ----
p_m_or_p = 0.60 + 0.45 - 0.30
print(f"P(M ∪ P)                        {p_m_or_p}  (analytic)")

# ---- Birthday problem ----
p_diff = prod((365 - k) / 365 for k in range(23))
sim = 0
for _ in range(N):
    bs = rng.integers(0, 365, 23)
    sim += len(np.unique(bs)) < 23
print(f"Birthday clash  analytic = {1 - p_diff:.4f},   MC = {sim / N:.4f}  (n=100000)")

# ---- Independence check ----
rolls = rng.integers(1, 7, N)
A = (rolls % 2 == 0)
B = (rolls <= 3)
print(f"Independent?  Empirical P(A)P(B) = {A.mean() * B.mean():.4f}   P(A ∩ B) = {(A & B).mean():.4f}  → NOT indep")

# ---- Counting ----
print("Combinations  C(20, 3) =", comb(20, 3))
print("Permutations  P(26, 4) =", perm(26, 4))`}</Example>
        <Callout variant="tip" title="Simulate first, prove later">
          Monte Carlo agrees with analytic answers to ~2 decimal places at 100k trials. If your derivation
          disagrees with a large simulation, your derivation is wrong.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Probability sits on three axioms: non-negativity, P(Ω) = 1, and additivity for disjoint events. Everything else is derived.',
          'For equally-likely outcomes P(A) = |A| / |Ω| — reduce the problem to counting with the multiplication rule, permutations, and combinations.',
          'Inclusion–exclusion for unions: P(A ∪ B) = P(A) + P(B) − P(A ∩ B). Complements often simplify: P(≥1 match) = 1 − P(none).',
          'Independence means P(A ∩ B) = P(A)P(B) — different from "disjoint" (which is actually strong dependence).',
          'ML depends on the i.i.d. assumption. When it breaks (leaked users, correlated time steps), train/test splits become dishonest.',
          'Simulate every probability question with 100k Monte Carlo trials — a two-decimal-place mismatch with analytic answers usually means the analytic derivation is wrong.',
        ]}
      />
    </LessonArticle>
  )
}
