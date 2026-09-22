import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RandomForestsLesson() {
  return (
    <LessonArticle>
      <Definition term="Random forest">
        <p>
          An ensemble of decision trees trained on <strong className="text-white">bootstrap
          samples</strong> of the rows, with a <strong className="text-white">random subset of
          features</strong> considered at each split. The forest predicts by majority vote
          (classification) or averaging (regression).
        </p>
        <p className="mt-2 text-slate-300">
          One deep tree has high variance. Many de-correlated deep trees, averaged, keep the low
          bias and cancel the variance. That is bagging plus extra randomness.
        </p>
      </Definition>

      <LessonSection title="Intuition — crowd of slightly different experts">
        <p className="text-slate-300">
          If every tree saw the same data and the same features, they would make the same
          mistakes and averaging would do nothing. Bootstrap rows and random feature subsets
          force the trees to disagree. Disagreement is the point.
        </p>
      </LessonSection>

      <LessonSection title="How it works">
        <ol className="list-decimal space-y-1 pl-5 text-slate-300">
          <li>Draw a bootstrap sample (sample m rows with replacement) — about 63% unique rows.</li>
          <li>Grow an unpruned tree. At each split, consider only √n features (classif.) or n/3 (regress.).</li>
          <li>Repeat T times. Predict by vote / mean.</li>
        </ol>
        <Callout variant="insight" title="Out-of-bag (OOB) error">
          Each row is left out of about 37% of the trees. Predicting those trees on that row
          gives a free validation score — no extra holdout required, though a test set is still
          the honest last word.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Tabular data, mixed types, non-linear effects, you want a strong default.</li>
          <li>You want feature importances (mean impurity decrease, or permutation importance).</li>
          <li>You need something robust to scale, outliers, and a few useless columns.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Gradient boosting often wins on accuracy. A forest is simpler to parallelise, harder
          to overfit, and a better first ensemble. Skip it for sparse 100k-dim text (linear
          models are faster) or for images / sequences (use nets).
        </p>
      </LessonSection>

      <LessonSection title="Why the extra feature sampling matters">
        <p className="text-slate-300">
          If one strong feature exists, every bagged tree splits on it first and they stay
          correlated. Restricting the candidate set lets weaker features define some trees.
          Lower correlation → averaging helps more. That is the “random” in random forest.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Bootstrap unique-row rate">
          <p>Probability a given row is missing from one bootstrap sample of size m?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>(1 − 1/m)^m → 1/e ≈ 0.368. About 37% OOB, 63% in-bag unique.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Vote">
          <p>11 trees vote A,A,B,A,B,B,A,A,B,A,A. Forest prediction?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A: 7,  B: 4  →  A. Soft vote (average of class probabilities) is usually better.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — mtry">
          <p>n = 100 features, classification. How many features does a typical split see?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>√100 = 10. sklearn: max_features = &quot;sqrt&quot;.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — More trees">
          <p>Does raising n_estimators from 200 to 2000 overfit?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Usually no — extra trees just average more. Diminishing returns, extra compute.</div>
            <div>Overfitting in forests comes from very deep trees on noisy labels, not from T being large.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Importance trap (ML flavour)">
          <p>Two identical copies of a strong feature. What happens to impurity importance?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>They split the importance. Each looks weaker than the original one-feature truth.</div>
            <div>Permutation importance on a holdout is more trustworthy; still careful with correlated pairs.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a tiny forest by hand">
        <Example
          title="Three stumps, majority vote"
          output={`forest vote on x=3.0 → A
OOB-style unique-row rate in one bootstrap ≈ 0.63`}
        >{`import numpy as np
from collections import Counter

rng = np.random.default_rng(0)
X = np.array([1.0, 2.0, 4.0, 7.0, 8.0])
y = np.array(["A", "A", "B", "B", "B"])

def stump(sample_idx, x_query):
    # 1-D threshold at the sample mean
    thr = X[sample_idx].mean()
    left = y[sample_idx][X[sample_idx] <= thr]
    right = y[sample_idx][X[sample_idx] > thr]
    pred_left = Counter(left).most_common(1)[0][0] if len(left) else "A"
    pred_right = Counter(right).most_common(1)[0][0] if len(right) else "B"
    return pred_left if x_query <= thr else pred_right

votes = []
for _ in range(3):
    idx = rng.integers(0, len(X), size=len(X))
    votes.append(stump(idx, 3.0))
print("forest vote on x=3.0 →", Counter(votes).most_common(1)[0][0])

idx = rng.integers(0, len(X), size=len(X))
print(f"OOB-style unique-row rate in one bootstrap ≈ {len(np.unique(idx)) / len(X):.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A random forest averages many deep trees. Bootstrap rows + random features at each split de-correlate the trees.',
          'Bagging alone is not enough if one feature dominates every first split — that is why max_features < n.',
          'More trees rarely overfit; they just cost more. Depth and min_samples_leaf still matter on noisy labels.',
          'OOB error is a built-in validation estimate. Still keep a final test set.',
          'Default ensemble for tabular data when you want robustness over squeezing the last 1% (that last 1% is usually boosting).',
        ]}
      />
    </LessonArticle>
  )
}
