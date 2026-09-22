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

export function ScalingAndTransforms() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Numbers on different yardsticks">
        Age in years and income in rupees should not fight inside a distance-based or
        coefficient-based model without scaling. Skewed money columns often need a log before that.
        Trees mostly shrug — they split on thresholds, not distances.
      </Callout>

      <Definition term="Scaling">
        <p>
          Scaling rescales numeric features so their magnitudes are comparable (e.g. mean 0, variance
          1). It does not change rank order. <strong className="text-white">Fit the scaler on
          train</strong>; apply the same center/scale to every future row.
        </p>
      </Definition>

      <LessonSection title="Who needs scaling?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model family</th>
                <th className="px-4 py-3">Scale?</th>
                <th className="px-4 py-3">Why</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['kNN, SVM (RBF), k-means', 'Yes', 'Distances dominate'],
                ['Linear / logistic + regularisation', 'Yes (usually)', 'Penalty treats big-unit columns as “large coeffs”'],
                ['Neural nets (tabular)', 'Yes', 'Optimisers like comparable scales'],
                ['Decision trees, RF, boosting', 'Usually no', 'Splits are scale-invariant'],
                ['Naive Bayes (Gaussian)', 'Not critical', 'Fits its own per-feature variance'],
              ].map(([m, s, w]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-emerald-400/90">{s}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Scale or not"
          chart={`flowchart TD
  A[Model type?] -->|Tree / boosting| B[Skip scaling]
  A -->|Linear / kNN / SVM / NN| C[Scale numerics]
  C --> D[Fit scaler on train]
  D --> E[Transform all splits]`}
        />
      </LessonSection>

      <LessonSection title="Common scalers — pick with intent">
        <ContentStep number={1} title="StandardScaler (z-score)">
          <p>
            <code className="text-slate-200">(x − μ) / σ</code>. Default for many linear models.
            Sensitive to extreme outliers — winsorise or log first if tails are wild.
          </p>
        </ContentStep>
        <ContentStep number={2} title="MinMaxScaler">
          <p>
            Maps train range to [0, 1]. Compresses everything into a box; a more extreme test value
            will fall outside [0, 1] — that is OK if you allow it, or clip.
          </p>
        </ContentStep>
        <ContentStep number={3} title="RobustScaler">
          <p>
            Uses median and IQR. Better when outliers remain after cleaning.
          </p>
        </ContentStep>
        <ContentStep number={4} title="MaxAbsScaler">
          <p>Good for sparse data already centered near 0 (e.g. some text / count features).</p>
        </ContentStep>
        <Callout variant="tip" title="Never scale the target for trees; for linear regression…">
          Scaling y is optional. If you standardize y, remember to invert predictions before
          reporting rupees. Logging y is a transform of the target — invert with expm1 when you
          logged with log1p.
        </Callout>
      </LessonSection>

      <LessonSection title="Shape transforms — fix skew before (or instead of) worrying about μ">
        <ContentStep number={1} title="log1p">
          <p>
            <code className="text-slate-200">log(1 + x)</code> for nonnegative right-skewed columns
            (spend, dwell time, counts). Prefer log1p over log so zeros survive.
          </p>
        </ContentStep>
        <ContentStep number={2} title="sqrt / cbrt">
          <p>Milder than log; sometimes enough for count data.</p>
        </ContentStep>
        <ContentStep number={3} title="Box–Cox / Yeo–Johnson">
          <p>
            Power transforms that estimate a parameter on train. Yeo–Johnson allows zeros and
            negatives. Still: fit on train only; nest inside the pipeline.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Quantile / rank transforms">
          <p>
            Map to a uniform or Gaussian marginal. Strong medicine — can help linear models, can
            destroy interpretable units. Use when EDA shows pathological shapes and you care about
            predictive score more than coefficient stories.
          </p>
        </ContentStep>
        <Callout variant="beginner" title="log1p on the target">
          If you train on <code className="text-slate-200">log1p(price)</code>, a prediction of 15.2
          is not rupees — report <code className="text-slate-200">expm1(15.2)</code>. Evaluate
          business metrics on the original scale.
        </Callout>
      </LessonSection>

      <LessonSection title="Order of operations">
        <p className="text-slate-300">
          A robust recipe for linear models: fix sentinels → impute → (optional winsorise) → log1p
          skewed columns → scale. Trees: often stop after impute (and indicators). Putting the
          scaler before a one-hot block is fine; do not scale one-hot 0/1 columns unless you have a
          reason (usually leave them).
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — kNN without scaling">
          <p>Features: age ~ 30 and income ~ 500000. What does kNN effectively use?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Mostly income — distances are dominated by the huge unit. Scale both.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Fit μ, σ">
          <p>Train x: 10, 20, 30. Test x: 50. StandardScaler value for the test row?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>μ=20, σ≈8.16 → (50−20)/8.16 ≈ 3.67 (using sample std as sklearn does with ddof=0: σ≈8.165).</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Tree">
          <p>Random forest on raw sqft and price as features for churn. Scale?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Optional / skip. Splits do not care about units.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Invert log">
          <p>Model predicts log1p(y) = 2.0. What is y on the original scale?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>expm1(2.0) ≈ 6.39</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — MinMax leak">
          <p>You fit MinMax on the full dataset then split. Name the bug.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Test min/max leaked into train scaling. Fit MinMax on train only.</div>
          </div>
        </ContentStep>
        <ContentStep number={6} title="Problem 6 — log of negatives">
          <p>profit can be −500. Can you log1p(profit)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — log1p needs x &gt; −1 and is meant for nonnegative. Use Yeo–Johnson, sign*log1p(abs), or shift with care.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — log1p then StandardScaler">
        <Example
          title="Train-fitted transform chain"
          output={`train scaled spend: roughly mean 0
test scaled spend (raw 900 → log1p then z): one value`}
        >{`import numpy as np
import pandas as pd
from sklearn.preprocessing import StandardScaler

train = pd.DataFrame({"spend": [40.0, 80.0, 120.0, 400.0]})
test = pd.DataFrame({"spend": [90.0, 900.0]})

train_l = np.log1p(train[["spend"]])
test_l = np.log1p(test[["spend"]])
scaler = StandardScaler()
train_s = scaler.fit_transform(train_l)
test_s = scaler.transform(test_l)
print("train mean after scale:", train_s.mean().round(3))
print("test scaled:", test_s.round(3).ravel())`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scale when the model uses distances or regularised coefficients; trees usually skip it.',
          'Fit μ/σ, min/max, or IQR on train only — then transform everything else.',
          'log1p is the workhorse for nonnegative right-skew; invert with expm1 for reporting.',
          'RobustScaler helps when outliers remain; Yeo–Johnson helps when values can be ≤ 0.',
          'Typical linear recipe: impute → winsorise/log → scale. Do not mindlessly scale one-hots.',
          'If you transform y, evaluate and report on the original scale after inverting.',
        ]}
      />
    </LessonArticle>
  )
}
