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

export function DecisionTreesLesson() {
  return (
    <LessonArticle>
      <Definition term="Decision tree">
        <p>
          A model that asks a sequence of yes/no questions about features and lands in a{' '}
          <strong className="text-white">leaf</strong> with a prediction (majority class, or the
          mean of y). Training is greedy: at each node, pick the split that most reduces impurity
          (classification) or variance (regression).
        </p>
      </Definition>

      <LessonSection title="Intuition — a flowchart you can read">
        <Flowchart
          title="A tiny loan tree"
          chart={`flowchart TD
  A{income > 50k?} -->|yes| B{late_payments = 0?}
  A -->|no| C[Decline]
  B -->|yes| D[Approve]
  B -->|no| E[Review]`}
        />
        <p className="mt-3 text-slate-300">
          Unlike a linear model, a tree can say “income only matters if late_payments is zero.”
          Interactions are free. Axis-aligned splits mean the boundary is a pile of rectangles.
        </p>
      </LessonSection>

      <LessonSection title="How a split is chosen — information gain and Gini">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Gini(S)     = 1 − Σₖ pₖ²</div>
          <div>Entropy(S)  = − Σₖ pₖ log₂ pₖ</div>
          <div>Gain(S, f)  = Impurity(S) − Σ_children (|S_c| / |S|) Impurity(S_c)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Information gain is the mutual information I(Y; split) from the entropy lesson. CART
          (sklearn) uses Gini by default — same idea, slightly cheaper. For regression, impurity
          is variance: a good split makes each child&rsquo;s y values similar.
        </p>
        <Callout variant="beginner" title="Greedy is not globally optimal">
          The best first split plus the best second split is not always the best two-split tree.
          We accept that. Exhaustive search is exponential in depth.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use a single tree">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>You need a model a human can audit (credit, medicine, policy).</li>
          <li>Features are mixed types; you do not want to scale or dummy-encode everything.</li>
          <li>You want a fast, non-linear baseline before you bag or boost it.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          A lone deep tree overfits. That is why almost everyone ships a forest or a booster
          instead. Use max_depth, min_samples_leaf, or cost-complexity pruning (ccp_α) to keep
          one tree honest.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Gini of a node">
          <p>A node has 6 yes and 4 no. Gini?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>p = (0.6, 0.4).  Gini = 1 − 0.36 − 0.16 = 0.48</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Information gain of a split">
          <p>
            Parent as above (0.48 Gini). Left 5 yes / 1 no (6 rows). Right 1 yes / 3 no (4 rows).
            Gain?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Gini_L = 1 − (5/6)² − (1/6)² = 0.278</div>
            <div>Gini_R = 1 − (1/4)² − (3/4)² = 0.375</div>
            <div>Gain = 0.48 − (0.6·0.278 + 0.4·0.375) = 0.48 − 0.317 = 0.163</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Why trees ignore scale">
          <p>You measure income in rupees or in lakhs. Does the first split change?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Thresholds are on the sorted unique values. Monotone rescaling keeps the same order.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Deep tree vs shallow">
          <p>m = 20, you allow depth 20 and min_samples_leaf = 1. Train accuracy?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Usually 100% — one leaf per row if x&rsquo;s are unique. Test accuracy will collapse.</div>
            <div>Cap depth or require more samples per leaf.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Continuous split candidates">
          <p>Feature values [2, 5, 5, 9]. Which thresholds does CART consider?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Midpoints between distinct sorted values: 3.5 and 7. Split is “x ≤ t” vs “x &gt; t”.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — Gini gain from Problem 2">
        <Example
          title="Parent vs children"
          output={`Gini parent 0.480  gain 0.163`}
        >{`import numpy as np

def gini(counts):
    p = counts / counts.sum()
    return 1 - np.sum(p ** 2)

parent = np.array([6, 4])
left, right = np.array([5, 1]), np.array([1, 3])
gain = gini(parent) - (6/10) * gini(left) - (4/10) * gini(right)
print(f"Gini parent {gini(parent):.3f}  gain {gain:.3f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A decision tree is a greedy flowchart: at each node pick the split that most reduces Gini / entropy (or variance).',
          'Information gain is mutual information between the split and the label. CART uses Gini by default.',
          'Trees capture interactions and ignore feature scale. They overfit if you let them grow to one leaf per row.',
          'A single tree is for interpretability and as a building block. Forests and boosting are what you ship for accuracy.',
          'Prune with max_depth, min_samples_leaf, or cost-complexity (ccp_α) — chosen on a validation set.',
        ]}
      />
    </LessonArticle>
  )
}
