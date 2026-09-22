import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ScalingAndTransforms() {
  return (
    <LessonArticle>
      <Definition term="Numeric transforms">
        <p>
          Change the units or the shape of a number so the algorithm’s assumptions match the
          column: comparable ranges (scaling) or less-skewed tails (logs). This is for the
          model, not for the human — you can always invert a log to report rupees.
        </p>
      </Definition>

      <LessonSection title="Scaling — who actually needs it">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Needs scaled numerics</th>
                <th className="px-4 py-3">Mostly invariant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['k-NN, k-means, SVM (RBF), PCA, GD-trained nets', 'Trees, forests, boosting (split on order)'],
                ['Ridge / Lasso (penalty treats units as importance)', 'Count features you want as counts (sometimes)'],
                ['Distance-based anything', 'Monotone transforms still change trees a little via binning, but scale itself does not'],
              ].map(([need, inv]) => (
                <tr key={need}>
                  <td className="px-4 py-3 text-slate-300">{need}</td>
                  <td className="px-4 py-3 text-slate-400">{inv}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Standardise:  (x − μ_train) / σ_train     zero mean, unit variance</div>
          <div>Min-max:      (x − min) / (max − min)      to [0, 1]; fragile to tails</div>
          <div>Robust:       (x − median) / IQR           quieter on outliers</div>
        </div>
      </LessonSection>

      <LessonSection title="Shape transforms — make a line less wrong">
        <p className="text-slate-300">
          Right-skewed money and counts: log1p(x) = log(1 + x) (safe at 0). Multiplicative
          effects become additive — the residual U from EDA often flattens. Box–Cox / Yeo–Johnson
          pick a power; you still fit λ on train.
        </p>
        <Callout variant="beginner" title="log1p on the target">
          Predicting log(price) then exponentiating is a different model (geometric errors).
          Report RMSE on the rupee scale if that is the business unit — the metrics lesson
          already warned about this.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Who wins without scaling?">
          <p>k-NN on age (20–80) and income (20 000–2 000 000). What happens?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Income owns every distance. Standardise both, or k-NN is an income-only model.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Ridge units">
          <p>You Ridge-penalise raw θ. x₁ is rupees, x₂ is rooms. Who gets crushed?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Rooms — θ₂ is large. Scale first so λ is fair. (You already saw this in regularisation.)</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — log1p">
          <p>counts = 0, 1, 99. log1p?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>0, 0.693, 4.605. log(0) would have been −∞.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Min-max trap">
          <p>Train max spend = 8 000. Test has 90 000. Min-max to [0, 1] using train max?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Test maps to 11.25 — off the train interval. Robust scale or clip-then-scale.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Trees and logs">
          <p>Must you log income before XGBoost?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Not for scale. Sometimes yes for a nicer leaf mean if you predict log y, or if you later blend with a linear model.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — fit scaler on train">
        <Example
          title="Standardise and log1p"
          output={`train z-age μ,σ used: 31.0  7.8
test z-age: [-1.15  0.51]
log1p counts: [0.    0.693 4.605]`}
        >{`import numpy as np

age_tr = np.array([22.0, 30.0, 41.0])
age_te = np.array([22.0, 35.0])
mu, sig = age_tr.mean(), age_tr.std(ddof=0)
print(f"train z-age μ,σ used: {mu:.1f}  {sig:.1f}")
print("test z-age:", np.round((age_te - mu) / sig, 2))
print("log1p counts:", np.round(np.log1p([0, 1, 99]), 3))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scale when the algorithm uses distances, penalties, or gradient steps that treat raw units as importance. Trees mostly do not care.',
          'Standardise is the default. Min-max is fragile to tails. Robust uses median/IQR.',
          'Fit μ, σ, min, max, λ_BoxCox on train only. Apply the same numbers at serving time.',
          'log1p flattens positive skew and turns 0 into 0. Use it on money and counts before linear models and k-means.',
          'If the business metric is in rupees, evaluate in rupees even if you trained on log y.',
        ]}
      />
    </LessonArticle>
  )
}
