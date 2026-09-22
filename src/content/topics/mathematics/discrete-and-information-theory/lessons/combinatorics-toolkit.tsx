import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CombinatoricsToolkit() {
  return (
    <LessonArticle>
      <Definition term="Combinatorics">
        <p>
          The art of counting arrangements without listing them. Four rules unlock 90% of practical
          problems.
        </p>
      </Definition>

      <LessonSection title="Rule 1 — Multiplication (sequential choices)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Total arrangements = choice₁ · choice₂ · choice₃ · …</div>
        </div>
        <p className="mt-3 text-slate-300">
          Any time you make independent successive decisions, multiply. This is the counting version of the
          probability chain rule.
        </p>
      </LessonSection>

      <LessonSection title="Rule 2 — Permutations (order matters)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(n, k) = n! / (n − k)!     — pick k items from n, arrange them.</div>
          <div>P(n, n) = n!                 — total orderings of n items.</div>
        </div>
        <p className="mt-3 text-slate-300">
          Rearrange songs in a playlist, order search results, permute rows for backtesting — all P(n, k).
        </p>
      </LessonSection>

      <LessonSection title="Rule 3 — Combinations (order does not)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>C(n, k) = n! / (k! · (n − k)!)</div>
          <div className="mt-2">C(n, k) = C(n, n − k)     — pick k to keep = pick n − k to drop.</div>
          <div>Pascal:  C(n, k) = C(n − 1, k − 1) + C(n − 1, k)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Any &ldquo;choose a subset&rdquo; question is C(n, k): teams from candidates, features from a
          pool, samples for cross-validation folds.
        </p>
      </LessonSection>

      <LessonSection title="Rule 4 — Stars & bars (indistinguishable items into bins)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Distribute n identical balls into k labelled boxes:</div>
          <div className="mt-2">Ways = C(n + k − 1, k − 1)</div>
        </div>
        <Callout variant="beginner" title="Why the name?">
          Think of n stars and k − 1 bars mixed in a line: ★★|★|★★★ splits the stars into k groups. The
          count of such arrangements is C(n + k − 1, k − 1).
        </Callout>
      </LessonSection>

      <LessonSection title="Pigeonhole principle — the shortest proof in math">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>If you put n items into k pigeonholes with n &gt; k, at least one hole has ≥ 2 items.</div>
          <div className="mt-2">Generalised: at least ⌈n / k⌉ items in some hole.</div>
        </div>
        <p className="mt-3 text-slate-300">
          Ridiculously simple and stupidly powerful — used to prove birthday collisions, hash-bucket
          bounds, and lower-bound compression ratios.
        </p>
      </LessonSection>

      <LessonSection title="With / without repetition and order — the 2 × 2 grid">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Setting</th>
                <th className="px-4 py-3">Order matters?</th>
                <th className="px-4 py-3">Repetition allowed?</th>
                <th className="px-4 py-3">Count</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Permutation (no rep.)',     'yes',    'no',     'n! / (n − k)!'],
                ['Sequence with repetition',  'yes',    'yes',    'nᵏ'],
                ['Combination',               'no',     'no',     'C(n, k)'],
                ['Stars & bars',              'no',     'yes',    'C(n + k − 1, k − 1)'],
              ].map(([setting, order, rep, count]) => (
                <tr key={setting}>
                  <td className="px-4 py-3 font-semibold text-white">{setting}</td>
                  <td className="px-4 py-3 text-slate-400">{order}</td>
                  <td className="px-4 py-3 text-slate-400">{rep}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Password strength">
          <p>Passwords of length 8 from lowercase letters. How many? What if all distinct?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>With repetition: 26⁸ ≈ 2.09 × 10¹¹.</div>
            <div>All distinct:    P(26, 8) = 26 · 25 · … · 19 = 62 990 928 000.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Committee (combinations)">
          <p>
            From 12 candidates, pick a team of 4. If exactly one must be a specific mentor (already
            chosen), how many teams remain?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Fix mentor → pick 3 more from remaining 11: C(11, 3) = 165.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Stars &amp; bars">
          <p>How many ways can 8 identical training runs be scheduled across 3 GPUs?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>C(8 + 3 − 1, 3 − 1) = C(10, 2) = 45 ways.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Pigeonhole in ML (ML flavour)">
          <p>You hash 1000 documents into 100 buckets. Guarantee about collisions?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Some bucket contains at least ⌈1000 / 100⌉ = 10 documents.</div>
            <div className="mt-1 text-genai-400">
              This is why hash-bucketed indexes eventually rebalance — the pigeonhole bound is worst case,
              but the average bucket size drives ANN retrieval latency.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Restricted permutations (letters)">
          <p>
            How many rearrangements of &ldquo;MISSISSIPPI&rdquo; are there?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>11 letters total: M=1, I=4, S=4, P=2.</div>
            <div>11! / (1! · 4! · 4! · 2!) = 39 916 800 / 1152 = 34 650.</div>
            <div className="mt-2 text-slate-400">
              Multinomial coefficient — the go-to for &ldquo;how many arrangements when some items
              repeat&rdquo;.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Cross-validation folds (ML flavour)">
          <p>You do 5-fold cross-validation on 100 samples. How many ways to draw the first fold?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>C(100, 20) ≈ 5.36 × 10²⁰.</div>
            <div className="mt-1 text-slate-400">
              Framework CV implementations pick ONE specific split (seeded). Understanding how large the
              space is explains why CV scores wobble across seeds.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — factorials, combinations, and multinomial">
        <Example
          title="One-line answers to every problem above"
          output={`26 ** 8            = 208827064576
P(26, 8)           = 62990928000
C(11, 3)           = 165
Stars & bars C(10, 2) = 45
MISSISSIPPI perms      = 34650
C(100, 20)             = 535983370403809682970`}
        >{`from math import comb, perm, factorial
from math import prod

# Password counts
print(f"26 ** 8            = {26 ** 8}")
print(f"P(26, 8)           = {perm(26, 8)}")

# Team selection
print(f"C(11, 3)           = {comb(11, 3)}")

# Stars & bars
print(f"Stars & bars C(10, 2) = {comb(10, 2)}")

# Multinomial for MISSISSIPPI
letters = {'M': 1, 'I': 4, 'S': 4, 'P': 2}
n       = sum(letters.values())
den     = prod(factorial(k) for k in letters.values())
print(f"MISSISSIPPI perms      = {factorial(n) // den}")

# Cross-validation
print(f"C(100, 20)             = {comb(100, 20)}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multiplication rule for sequential choices, then P(n, k) for ordered picks and C(n, k) for unordered — 90% of problems reduce to those.',
          'The 2 × 2 grid (order × repetition) gives you n!/(n−k)!, nᵏ, C(n, k), and C(n+k−1, k−1). Identify which row before writing math.',
          'Stars & bars distributes n identical items into k labelled bins — the go-to for scheduling runs across workers or partitioning budgets.',
          'Multinomial n! / (k₁! k₂! …) counts arrangements when items repeat — MISSISSIPPI, gene sequences, or bag-of-words permutations.',
          'Pigeonhole gives a floor on collisions: n items into k holes forces at least ⌈n/k⌉ in some hole. Cheap proof for hash-bucket and birthday bounds.',
          'Cross-validation, feature subset search, and beam search live in combinatorially huge spaces — that is why heuristic sampling matters.',
        ]}
      />
    </LessonArticle>
  )
}
