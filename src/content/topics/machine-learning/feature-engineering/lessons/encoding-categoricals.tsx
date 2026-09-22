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

export function EncodingCategoricals() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Names are not numbers — until you encode them">
        Models need numbers. Encoding maps category levels (city, plan, browser) to numeric columns
        without pretending &ldquo;Delhi = 3 × Hyderabad.&rdquo; High cardinality and unseen levels are
        the advanced traps.
      </Callout>

      <Definition term="Categorical encoding">
        <p>
          A deterministic map from a categorical column to one or more numeric features, fitted on
          train (vocabulary, frequencies, or target stats), then applied to new rows with an explicit{' '}
          <strong className="text-white">unseen-level policy</strong>.
        </p>
      </Definition>

      <LessonSection title="The encoding menu">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Best when</th>
                <th className="px-4 py-3">Caveat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['One-hot / dummy', 'Low cardinality (≲20–50)', 'Explodes width; drop one level for linear IDs'],
                ['Ordinal codes', 'True order (S < M < L)', 'Fake order hurts linear models'],
                ['Frequency / count', 'Many levels; trees OK', 'Collides different rare levels with same count'],
                ['Target encoding (smoothed)', 'High cardinality + enough data', 'Leakage if fit on full labels naively'],
                ['Hashing trick', 'Huge / streaming categories', 'Collisions; harder to interpret'],
                ['Embeddings (advanced)', 'Deep models / rich cats', 'Needs more data and training setup'],
              ].map(([m, b, c]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Pick an encoder"
          chart={`flowchart TD
  A[Cardinality?] -->|Low| B[One-hot]
  A -->|Ordered levels| C[Ordinal]
  A -->|High| D{Enough rows per level?}
  D -->|Yes| E[Smoothed target encode / freq]
  D -->|No| F[Group rare → other, then encode]
  B --> G[Unseen → zeros or other]
  E --> G
  F --> G`}
        />
      </LessonSection>

      <LessonSection title="One-hot — the beginner workhorse">
        <p className="text-slate-300">
          Each level becomes a 0/1 column. For linear models with an intercept, drop one level to
          avoid perfect collinearity. Trees can keep all dummies. Fit the category list on train;
          unknown levels at serve time → all zeros (or map to{' '}
          <code className="text-slate-200">__other__</code> if you reserved that column).
        </p>
        <Callout variant="tip" title="Unseen levels">
          Production will invent a new browser string. Your encoder must not throw. sklearn&rsquo;s{' '}
          <code className="text-slate-200">handle_unknown=&quot;ignore&quot;</code> is the usual one-hot fix.
        </Callout>
      </LessonSection>

      <LessonSection title="Ordinal — only when order is real">
        <p className="text-slate-300">
          Map low→0, medium→1, high→2 only if the gaps are meaningful for your model. Education
          levels often are; zip codes coded as integers are not ordinal in the geographic sense —
          they are IDs.
        </p>
      </LessonSection>

      <LessonSection title="Target encoding without leaking">
        <p className="text-slate-300">
          Replace each level with the mean target (e.g. churn rate) for that level. Raw means overfit
          rare levels and leak if you use the row&rsquo;s own label.
        </p>
        <ContentStep number={1} title="Smoothing">
          <p>
            Blend level mean with the global mean: rare levels shrink toward the prior. Classic
            formula uses a weight that grows with level count.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Out-of-fold (OOF) encoding">
          <p>
            Inside CV, encode each fold using statistics from the other folds only. Fitting target
            means on the full training labels then training on the same rows overstates skill.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Production map">
          <p>
            After model selection, fit the encoding map on all training data (still excluding test),
            freeze it, apply to live rows. Unseen → global mean.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Target encoding is powerful and sharp">
          It is often the best high-cardinality tool for GBMs — and the fastest way to leak if you
          skip OOF / smoothing. Treat it like a model hyperparameter nested in CV.
        </Callout>
      </LessonSection>

      <LessonSection title="Rare levels and hashing">
        <p className="text-slate-300">
          Group levels with count &lt; K into <code className="text-slate-200">other</code> using
          train counts only. Hashing maps any string to one of 2ⁿ buckets — fixed width, collisions
          allowed — useful for huge ID spaces when interpretability is secondary.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Fake ordinal">
          <p>Color encoded red=1, blue=2, green=3 for linear regression. OK?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — invents order. One-hot instead.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Unseen city">
          <p>One-hot trained on HYD, BLR. Live row DEL. With handle_unknown=ignore, features?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>All city dummies 0 (no DEL column). Model uses other features + intercept.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Rare level mean">
          <p>City Tiny has 3 rows, all churned (rate 1.0). Global churn 0.1. Raw target encode?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Overconfident 1.0. Smooth toward 0.1 or bucket Tiny into other.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Leakage">
          <p>You compute churn rate per city on the full train frame including each row, then fit a model on those encodings. Issue?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each row’s label leaked into its own feature. Use OOF encoding or careful holdout.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Trees and one-hot">
          <p>8000 ZIP codes one-hot into XGBoost. Good idea?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Painful width. Prefer target/freq encode, hashing, or embeddings — or group ZIPs.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — Drop first">
          <p>Why drop one dummy column for logistic regression with intercept?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Avoid perfect multicollinearity (dummy variable trap). Trees can keep all.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — one-hot + frequency encode">
        <Example
          title="Train vocabulary; unknown → other; frequency from train"
          output={`one-hot columns follow train levels + other
freq map: {'basic': 2, 'plus': 1, 'other': 0}`}
        >{`import pandas as pd
from sklearn.preprocessing import OneHotEncoder

train = pd.DataFrame({"plan": ["basic", "basic", "plus"]})
test = pd.DataFrame({"plan": ["basic", "enterprise"]})

# rare / unseen → other
vc = train["plan"].value_counts()
keep = set(vc[vc >= 2].index)  # keep levels with count>=2
train_p = train["plan"].where(train["plan"].isin(keep), "other")
test_p = test["plan"].where(test["plan"].isin(keep), "other")

oh = OneHotEncoder(handle_unknown="ignore", sparse_output=False)
Xtr = oh.fit_transform(train_p.to_frame())
Xte = oh.transform(test_p.to_frame())
print("train OH shape:", Xtr.shape, "test:", Xte.shape)

freq = train_p.value_counts().to_dict()
print("freq map:", {k: int(freq.get(k, 0)) for k in ["basic", "plus", "other"]})`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'One-hot for low cardinality; ordinal only when order is real; never ordinal-code nominal IDs.',
          'Fit the vocabulary on train; define unseen → other / ignore / hash.',
          'High cardinality: frequency, smoothed target encoding, or hashing — not a giant one-hot.',
          'Target encoding needs smoothing and out-of-fold fitting or it leaks and overfits rares.',
          'Group rare levels using train counts before encoding.',
          'Linear models: watch the dummy trap. Trees: tolerate dummies but hate 8000 ZIP columns.',
        ]}
      />
    </LessonArticle>
  )
}
