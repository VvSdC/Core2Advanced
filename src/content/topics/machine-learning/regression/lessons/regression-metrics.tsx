import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RegressionMetrics() {
  return (
    <LessonArticle>
      <Definition term="Regression metrics">
        <p>
          A single number that answers &ldquo;how far off are the predictions?&rdquo; Pick the one
          whose units and pain match the decision you will make with ŷ.
        </p>
      </Definition>

      <LessonSection title="The core four">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3">Units</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['MAE', 'mean |y − ŷ|', 'same as y', 'You want a typical error; outliers should not dominate'],
                ['MSE', 'mean (y − ŷ)²', 'y²', 'Matches the OLS objective; good for math, awkward to report'],
                ['RMSE', '√MSE', 'same as y', 'Same penalty as MSE, readable units'],
                ['R²', '1 − SS_res / SS_tot', 'unitless', 'You want “fraction of variance explained” vs predicting ȳ'],
              ].map(([name, f, u, when]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{u}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>SS_res = Σ (yᵢ − ŷᵢ)²</div>
          <div>SS_tot = Σ (yᵢ − ȳ)²</div>
          <div>R² = 1 − SS_res / SS_tot</div>
        </div>
        <Callout variant="beginner" title="R² can be negative">
          If your model loses to the trivial predictor &ldquo;always ȳ&rdquo;, R² &lt; 0. That is
          information, not a bug. Training R² for OLS with an intercept is in [0, 1]; test R² is
          not.
        </Callout>
      </LessonSection>

      <LessonSection title="Adjusted R² and extra features">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>R²_adj = 1 − (1 − R²) · (m − 1) / (m − n − 1)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Plain R² never falls when you add a feature — even a random one. Adjusted R² pays a
          degrees-of-freedom tax. Still prefer a held-out RMSE when you can; adjusted R² is a
          training-set consolation prize.
        </p>
      </LessonSection>

      <LessonSection title="MAPE and friends — use with care">
        <p className="text-slate-300">
          MAPE = mean |y − ŷ| / |y|. It looks like a percentage and dies when y is near 0. For
          prices that span orders of magnitude, a log-scale RMSE (or RMSLE) is usually more honest.
        </p>
      </LessonSection>

      <LessonSection title="How to compare models without lying">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Always quote the metric on a held-out set (or CV), never only on train.</li>
          <li>Use the same split, the same preprocessing, the same random seed.</li>
          <li>Report MAE <em>and</em> RMSE — the gap between them is a hint about outlier sensitivity.</li>
          <li>A 1% RMSE win inside the noise of a small test set is not a win. Use a paired test or bootstrap if you will ship on that gap.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Compute all four">
          <p>y = [3, 5, 7], ŷ = [2, 6, 6]. MAE, MSE, RMSE, R²?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>errors = −1, +1, −1.   |e| = 1, 1, 1.   e² = 1, 1, 1.</div>
            <div>MAE  = 1</div>
            <div>MSE  = 1</div>
            <div>RMSE = 1</div>
            <div>ȳ = 5,  SS_tot = 4 + 0 + 4 = 8,  SS_res = 3,  R² = 1 − 3/8 = 0.625</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Outlier effect">
          <p>Add a fourth point y = 100, ŷ = 10. What happens to MAE vs RMSE?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>MAE  = (1+1+1+90) / 4 = 23.25</div>
            <div>RMSE = √((1+1+1+8100) / 4) ≈ 45.01</div>
            <div className="mt-1 text-genai-400">RMSE more than doubles MAE — the signature of a heavy tail of errors.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Negative test R²">
          <p>Test set: y = [10, 12, 11], ŷ = [20, 22, 21]. ȳ_test = 11. R²?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>SS_res = 100 + 100 + 100 = 300</div>
            <div>SS_tot = 1 + 1 + 0 = 2</div>
            <div>R² = 1 − 150 = −149</div>
            <div className="mt-1 text-slate-400">The model is far worse than predicting the test mean. Do not ship it.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Which metric for house prices?">
          <p>Errors of ₹50 000 on a ₹20 lakh house and a ₹2 crore house feel different. What do you report?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>RMSE on log(price) (or MAPE, carefully) so a 10% miss costs the same everywhere.</div>
            <div>Raw RMSE is dominated by expensive houses.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Adjusted R² trap">
          <p>You add 30 random features to m = 40 rows. Train R² jumps from 0.40 to 0.95. Celebrate?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. You are close to interpolating. Adjusted R² and — better — test RMSE will expose it.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — one helper, four numbers">
        <Example
          title="The example from Problem 1"
          output={`MAE  = 1.000
MSE  = 1.000
RMSE = 1.000
R²   = 0.625`}
        >{`import numpy as np

y  = np.array([3.0, 5.0, 7.0])
yh = np.array([2.0, 6.0, 6.0])
e  = y - yh
mae  = np.mean(np.abs(e))
mse  = np.mean(e ** 2)
rmse = np.sqrt(mse)
r2   = 1 - np.sum(e ** 2) / np.sum((y - y.mean()) ** 2)
print(f"MAE  = {mae:.3f}")
print(f"MSE  = {mse:.3f}")
print(f"RMSE = {rmse:.3f}")
print(f"R²   = {r2:.3f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MAE is a typical absolute miss. MSE is the OLS cousin (squared units). RMSE is MSE with readable units. R² is improvement over predicting the mean.',
          'Quote metrics on held-out data. Training R² for OLS with an intercept cannot go negative; test R² can, and should when the model is worse than ȳ.',
          'The RMSE − MAE gap grows when a few huge errors dominate. That is a diagnostic, not a nuisance.',
          'For targets that span orders of magnitude, prefer log-scale RMSE or a careful percentage error. MAPE blows up near y = 0.',
          'Adjusted R² penalises extra features on the training set. A validation RMSE is still the number you make decisions with.',
        ]}
      />
    </LessonArticle>
  )
}
