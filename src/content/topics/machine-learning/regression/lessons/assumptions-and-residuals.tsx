import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AssumptionsAndResiduals() {
  return (
    <LessonArticle>
      <Definition term="What OLS actually assumes">
        <p>
          The algebra of θ = (XᵀX)⁻¹ Xᵀy always runs. The <em>story</em> you tell about θ — unbiased,
          lowest-variance linear estimator, trustworthy intervals — needs the Gauss-Markov setup:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Linearity</strong> — E[y | x] really is θᵀx. Wrong shape
            → biased ŷ everywhere the curve bends.
          </li>
          <li>
            <strong className="text-white">Exogeneity</strong> — residuals do not correlate with the
            features (no leftover confounder sitting in the error).
          </li>
          <li>
            <strong className="text-white">No perfect multicollinearity</strong> — columns of X are
            independent.
          </li>
          <li>
            <strong className="text-white">Homoscedasticity</strong> — Var(error) is constant. Fan-shaped
            residuals break OLS standard errors (predictions can still be okay).
          </li>
          <li>
            <strong className="text-white">Independence</strong> — rows are not copies of each other
            (time series, repeated users).
          </li>
        </ol>
        <p className="mt-3 text-slate-300">
          Normal errors are an extra assumption used only for exact t / F tests and CIs. OLS itself
          does not need Gaussian noise — the CLT covers large m.
        </p>
      </Definition>

      <LessonSection title="Residual plots — the cheapest diagnostic you will ever run">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Plot</th>
                <th className="px-4 py-3">Healthy look</th>
                <th className="px-4 py-3">If it looks wrong</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Residual vs ŷ', 'Formless band around 0', 'Curve → add features / polynomial; fan → log y or weighted LS'],
                ['Residual vs each x', 'No pattern', 'Pattern in one x → that feature needs a transform or interaction'],
                ['QQ plot of residuals', 'Points on the diagonal', 'Heavy tails → robust loss (Huber) or be careful with p-values'],
                ['Residual vs time / id', 'No runs of + + + − − −', 'Autocorrelation → lag features or a time-series model'],
              ].map(([plot, good, bad]) => (
                <tr key={plot}>
                  <td className="px-4 py-3 font-semibold text-white">{plot}</td>
                  <td className="px-4 py-3 text-slate-400">{good}</td>
                  <td className="px-4 py-3 text-slate-400">{bad}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Prediction vs explanation">
          If you only care about ŷ on similar new rows, mild assumption violations are often
          tolerable. If you want to say &ldquo;this coefficient is the causal effect of x,&rdquo;
          every assumption matters and OLS is usually not enough.
        </Callout>
      </LessonSection>

      <LessonSection title="Influential points — not every outlier is a villain">
        <p className="text-slate-300">
          A point can have a large residual (it missed) or high leverage (its x is unusual) or both
          (it actually <em>moved</em> the line — Cook&rsquo;s distance). Check those three before
          deleting anything. Sometimes the outlier is the most important row you have.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Name the violation">
          <p>Residuals vs ŷ make a megaphone: tight on the left, wide on the right.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Heteroscedasticity. Predictions may be fine; SEs and p-values are not.</div>
            <div>Try log(y), or weighted least squares, or a model that predicts variance too.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Residual curve">
          <p>Residuals vs x go −, 0, +, 0, −. Linearity holds?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. That is a missing bend — add x² or transform x.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Confounder in the residual">
          <p>You predict wage from years of education. Ability is unobserved and helps both. What is broken?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Exogeneity. Ability sits in the error and correlates with education.</div>
            <div>θ_education absorbs some of ability&rsquo;s effect — biased as a causal number, maybe still useful as a predictor.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Leverage vs residual">
          <p>A house with size 10× the others sits near the fitted line. Outlier?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>High leverage, small residual. It did not miss — it may still have pinned the slope.</div>
            <div>Check Cook&rsquo;s distance: refit without it and see if θ jumps.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Time-series rows (ML flavour)">
          <p>You train on daily demand, randomly shuffled 80/20. Test R² looks great. Production fails next month. Why?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Independence is gone — nearby days leak into both splits.</div>
            <div>Use a time-based split (train past, test future). That is the residual-vs-time plot, enforced as a pipeline rule.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — residual pattern you can see">
        <Example
          title="A linear fit on quadratic data leaves a U in the residuals"
          output={`corr(residual, x)   ≈ 0.00   (mean-zero, uncorrelated — not enough)
max |residual|        8.41
quadratic term needed: residual vs x is U-shaped, not a blob`}
        >{`import numpy as np

rng = np.random.default_rng(0)
x = np.linspace(0, 6, 40)
y = 1 + 0.3 * x + 0.4 * x**2 + rng.normal(0, 0.6, size=x.size)
X = np.c_[np.ones(x.size), x]
theta = np.linalg.lstsq(X, y, rcond=None)[0]
resid = y - X @ theta
print(f"corr(residual, x)   ≈ {np.corrcoef(resid, x)[0, 1]:.2f}   (mean-zero, uncorrelated — not enough)")
print(f"max |residual|        {np.max(np.abs(resid)):.2f}")
print("quadratic term needed: residual vs x is U-shaped, not a blob")`}</Example>
        <Callout variant="tip" title="Correlation of residual with x can be ~0 and still be wrong">
          A U-shape is orthogonal to a straight line. Always plot. A single correlation number
          cannot see a bend.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'OLS always computes a number. Unbiasedness, minimum-variance, and honest p-values need linearity, exogeneity, no collinearity, constant variance, and independent rows.',
          'Normal errors are only for exact small-sample tests. Large m leans on the CLT.',
          'Residual vs ŷ and residual vs x are mandatory. A U means a missing curve; a fan means changing variance; runs in time mean leakage.',
          'High leverage ≠ large residual. Cook’s distance asks “did this row move θ?” before you delete it.',
          'Prediction can survive messy assumptions. Causal stories cannot. Know which job you hired the model for.',
        ]}
      />
    </LessonArticle>
  )
}
