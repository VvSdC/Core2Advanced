import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SetsAndBooleanLogic() {
  return (
    <LessonArticle>
      <Definition term="Set">
        <p>
          A <strong className="text-white">set</strong> is an unordered collection of distinct elements.
          Order does not matter and repetitions collapse: {`{1, 2, 2, 3} = {1, 2, 3} = {3, 1, 2}`}.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Membership</strong> — x ∈ A means &ldquo;x is in A&rdquo;.</li>
          <li><strong className="text-white">Cardinality</strong> — |A| is the number of elements in A.</li>
          <li><strong className="text-white">Empty set</strong> — ∅ has no elements, |∅| = 0.</li>
          <li><strong className="text-white">Subset</strong> — A ⊆ B if every element of A is also in B.</li>
        </ul>
      </Definition>

      <LessonSection title="The five set operations">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Operation</th>
                <th className="px-4 py-3">Notation</th>
                <th className="px-4 py-3">Meaning</th>
                <th className="px-4 py-3">Boolean twin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Union',         'A ∪ B',        'x ∈ A OR x ∈ B',                'a ∨ b'],
                ['Intersection',  'A ∩ B',        'x ∈ A AND x ∈ B',               'a ∧ b'],
                ['Difference',    'A \\ B',       'x ∈ A but x ∉ B',               'a ∧ ¬b'],
                ['Complement',    'Aᶜ or Ā',      'x ∉ A (within universe U)',     '¬a'],
                ['Symmetric diff','A △ B',        'in exactly one of A, B',        'a ⊕ b (XOR)'],
              ].map(([op, notation, meaning, boolean]) => (
                <tr key={op}>
                  <td className="px-4 py-3 font-semibold text-white">{op}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{notation}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{boolean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Sets and Boolean logic are the same math">
          A set is a Boolean function that returns 1 for its members and 0 otherwise. Every set identity has
          a Boolean-algebra twin, and both are the foundation of query languages (SQL WHERE, Elasticsearch,
          vector-store metadata filters).
        </Callout>
      </LessonSection>

      <LessonSection title="Set-algebra laws — you will use these constantly">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Law</th>
                <th className="px-4 py-3">Statement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Commutative',   'A ∪ B = B ∪ A,   A ∩ B = B ∩ A'],
                ['Associative',   '(A ∪ B) ∪ C = A ∪ (B ∪ C)'],
                ['Distributive',  'A ∩ (B ∪ C) = (A ∩ B) ∪ (A ∩ C)'],
                ['Identity',      'A ∪ ∅ = A,       A ∩ U = A'],
                ['Complement',    'A ∪ Aᶜ = U,      A ∩ Aᶜ = ∅'],
                ['De Morgan',     '(A ∪ B)ᶜ = Aᶜ ∩ Bᶜ,   (A ∩ B)ᶜ = Aᶜ ∪ Bᶜ'],
                ['Absorption',    'A ∪ (A ∩ B) = A,  A ∩ (A ∪ B) = A'],
                ['Idempotent',    'A ∪ A = A,        A ∩ A = A'],
              ].map(([law, stmt]) => (
                <tr key={law}>
                  <td className="px-4 py-3 font-semibold text-white">{law}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{stmt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Cartesian product & power set">
        <ContentStep number={1} title="Cartesian product A × B">
          <p>All ordered pairs (a, b) with a ∈ A and b ∈ B.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|A × B| = |A| · |B|</div>
            <div>{'{1, 2} × {x, y} = {(1, x), (1, y), (2, x), (2, y)}'}</div>
          </div>
          <p className="mt-2 text-slate-300">
            Every relational-database join, every feature grid, every image pixel grid is a Cartesian
            product.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Power set P(A)">
          <p>The set of ALL subsets of A (including ∅ and A itself).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|P(A)| = 2^|A|</div>
            <div>{'P({a, b}) = { ∅, {a}, {b}, {a, b} }   → 4 subsets'}</div>
          </div>
          <p className="mt-2 text-slate-300">
            Each subset corresponds to a length-|A| binary string — pick or skip each element. That is why
            &ldquo;all feature subsets&rdquo; is exponential in feature count.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Inclusion–exclusion — the counting workhorse">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>|A ∪ B|         = |A| + |B| − |A ∩ B|</div>
          <div>|A ∪ B ∪ C|     = |A| + |B| + |C|</div>
          <div>                − |A ∩ B| − |A ∩ C| − |B ∩ C|</div>
          <div>                + |A ∩ B ∩ C|</div>
        </div>
        <p className="mt-3 text-slate-300">
          Add singles, subtract pairs, add triples, subtract quadruples… — alternating signs cancel the
          double-counting.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — De Morgan simplification">
          <p>Simplify: <code>(A ∪ B)ᶜ ∩ (A ∪ Bᶜ)</code>.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>De Morgan: (A ∪ B)ᶜ = Aᶜ ∩ Bᶜ.</div>
            <div>= (Aᶜ ∩ Bᶜ) ∩ (A ∪ Bᶜ)</div>
            <div>Distribute Aᶜ ∩ Bᶜ over (A ∪ Bᶜ):</div>
            <div>= (Aᶜ ∩ Bᶜ ∩ A) ∪ (Aᶜ ∩ Bᶜ ∩ Bᶜ)</div>
            <div>= ∅ ∪ (Aᶜ ∩ Bᶜ)  = Aᶜ ∩ Bᶜ.</div>
            <div className="mt-2 text-slate-400">Interpretation: the set of elements in neither A nor B.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Inclusion–exclusion count">
          <p>
            In a survey of 100 people: 60 like tea, 45 like coffee, 30 like juice; 25 like tea &amp; coffee,
            10 tea &amp; juice, 15 coffee &amp; juice; 5 like all three. How many like at least one?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|T ∪ C ∪ J| = 60 + 45 + 30 − 25 − 10 − 15 + 5 = 90.</div>
            <div>Like none: 100 − 90 = 10.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Power set size">
          <p>How many feature subsets exist for a dataset with 10 features?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|P(features)| = 2¹⁰ = 1024 subsets.</div>
            <div className="mt-1 text-genai-400">
              This is why brute-force feature selection is exponential in feature count — for 30 features
              you already have ~10⁹ subsets.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Vector-DB metadata filter (ML flavour)">
          <p>
            You retrieve documents where <code>lang == &ldquo;en&rdquo; AND (topic == &ldquo;ml&rdquo; OR
            topic == &ldquo;math&rdquo;) AND NOT deprecated</code>. Express as set operations, then apply
            De Morgan.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Filter = LANG_EN ∩ (TOPIC_ML ∪ TOPIC_MATH) ∩ DEPRECATEDᶜ.</div>
            <div className="mt-2">By distributive law:</div>
            <div>= (LANG_EN ∩ TOPIC_ML ∩ DEPRECATEDᶜ) ∪ (LANG_EN ∩ TOPIC_MATH ∩ DEPRECATEDᶜ).</div>
            <div className="mt-2 text-slate-400">
              Query planners internally rewrite filters this way to fan out cheap-index lookups in
              parallel.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Cartesian product for join">
          <p>
            Table Users has 1000 rows; table Products has 500 rows. How many rows does the unfiltered
            cross join U × P produce?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|U × P| = 1000 · 500 = 500 000 rows.</div>
            <div className="mt-1 text-slate-400">
              Every SQL JOIN starts from this Cartesian product and then filters on the ON condition — the
              filter is what saves you from combinatorial explosion.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Boolean formula (ML flavour)">
          <p>
            An intrusion detector fires when <code>(fail_count &gt; 5) ∧ ¬(admin_ip)</code>. What is the
            negation of the alert rule?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>¬(A ∧ ¬B) = ¬A ∨ B     (by De Morgan)</div>
            <div>&ldquo;No alert&rdquo; means: fail_count ≤ 5   OR   admin_ip.</div>
            <div className="mt-2 text-slate-400">
              Cleanly explains why a whitelist (admin_ip) always suppresses the rule even when the counter
              is high.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — sets in one screen">
        <Example
          title="Every operation, plus inclusion–exclusion verified"
          output={`A ∪ B          = {1, 2, 3, 4, 5}
A ∩ B          = {3}
A \\ B         = {1, 2}
A △ B          = {1, 2, 4, 5}
|A × B|        = 6
|P(A)|         = 8
At least one drink = 90
Feature subsets(10) = 1024`}
        >{`from itertools import chain, combinations

A, B = {1, 2, 3}, {3, 4, 5}
U    = {1, 2, 3, 4, 5}

print(f"A ∪ B          = {A | B}")
print(f"A ∩ B          = {A & B}")
print(f"A \\\\ B         = {A - B}")
print(f"A △ B          = {A ^ B}")

# Cartesian product
print(f"|A × B|        = {len(A) * len(B)}")

# Power set
def powerset(S):
    return chain.from_iterable(combinations(S, r) for r in range(len(S) + 1))

print(f"|P(A)|         = {sum(1 for _ in powerset(A))}")

# Inclusion–exclusion
T, C, J     = 60, 45, 30
TC, TJ, CJ  = 25, 10, 15
TCJ         = 5
union       = T + C + J - TC - TJ - CJ + TCJ
print(f"At least one drink = {union}")

# Feature subsets
print(f"Feature subsets(10) = {2 ** 10}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A set is an unordered collection of distinct elements; its 5 core operations (∪, ∩, \\, complement, △) map one-to-one onto Boolean OR/AND/AND-NOT/NOT/XOR.',
          'The classic laws — commutative, associative, distributive, identity, complement, De Morgan, absorption, idempotent — are all you need to simplify any set/Boolean expression.',
          'De Morgan\'s law is the reason "NOT (A OR B)" flips to "NOT A AND NOT B" in every query language, guardrail rule, and index filter.',
          '|A × B| = |A| · |B|; |P(A)| = 2^|A|. Feature subset enumeration and unconstrained SQL cross joins are exponential — real systems always add filters.',
          'Inclusion–exclusion: add singles, subtract pairs, add triples… — the standard fix for double-counting in unions of overlapping sets.',
          'Vector-store metadata filters, database queries, and permission checks in AI systems are all Boolean-algebra expressions — simplifying them saves compute.',
        ]}
      />
    </LessonArticle>
  )
}
