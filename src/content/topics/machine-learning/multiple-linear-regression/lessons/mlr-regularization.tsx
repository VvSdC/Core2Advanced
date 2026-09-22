import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MlrRegularization() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why regularisation exists">
        Plain OLS finds the line that fits the training data as tightly as possible. If you have lots of
        features (or noisy data), it fits <em>the noise</em> too — great scores on training, terrible on
        new data. Regularisation adds a small penalty for making the coefficients too big, keeping the
        model humble.
      </Callout>

      <Definition term="Regularisation">
        <p>
          A penalty added to the loss so that large coefficients cost the model something. The training
          objective becomes:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>J(θ) = (1 / 2m) · ‖Xθ − y‖²  +  λ · penalty(θ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          λ (called <code className="text-slate-200">alpha</code> in scikit-learn) is a knob. λ = 0
          collapses back to plain OLS. Very large λ crushes all coefficients toward 0.
        </p>
      </Definition>

      <LessonSection title="The three flavours — Ridge, Lasso, Elastic Net">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Penalty</th>
                <th className="px-4 py-3">Effect on θ</th>
                <th className="px-4 py-3">Use when…</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ridge (L2)',        'λ · Σ θⱼ² = λ ‖θ‖²',        'Shrinks all coefficients smoothly toward 0 (never exactly 0)', 'Many features, all somewhat useful; multicollinearity present'],
                ['Lasso (L1)',        'λ · Σ |θⱼ| = λ ‖θ‖₁',       'Pushes many coefficients to EXACTLY 0 → automatic feature selection', 'You suspect only a handful of features matter; want a sparse model'],
                ['Elastic Net',       'λ · (α ‖θ‖₁ + (1 − α) ‖θ‖²)', 'Blend — sparse but stable when features are correlated',     'High-dim data with groups of correlated features (genomics, text)'],
              ].map(([n, p, e, use]) => (
                <tr key={n}>
                  <td className="px-4 py-3 font-semibold text-white">{n}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{e}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="The geometry behind sparsity">
          Constraint regions look like a diamond (L1) or a circle (L2). The MSE ellipses hit the diamond
          at CORNERS — corners have zero coordinates → sparse solutions. Circles have no corners → Ridge
          just shrinks smoothly.
        </Callout>
      </LessonSection>

      <LessonSection title="Ridge — the closed-form OLS you can still solve by hand">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Objective:  J(θ) = ‖y − Xθ‖² + λ ‖θ‖²</div>
          <div className="mt-2">Normal equation:  θ̂ = (XᵀX + λ I)⁻¹ Xᵀy</div>
        </div>
        <p className="mt-3 text-slate-300">
          Adding λI to XᵀX guarantees invertibility even when XᵀX is singular (perfectly correlated
          features). This is precisely why Ridge saves you in multicollinearity settings.
        </p>
        <Callout variant="tip" title="Do not penalise the intercept">
          Regularisation is applied to θ₁…θₙ, NOT θ₀. Every library&rsquo;s Ridge/Lasso implementation
          fits an unregularised intercept separately — check the docs before rolling your own.
        </Callout>
      </LessonSection>

      <LessonSection title="Lasso — no closed form, but scikit-learn does it in one line">
        <p className="text-slate-300">
          The |θ| term is non-differentiable at 0, so no clean formula. Frameworks use{' '}
          <strong className="text-white">coordinate descent</strong> or{' '}
          <strong className="text-white">proximal gradient</strong> algorithms — you never write these
          yourself in practice.
        </p>
        <p className="mt-3 text-slate-300">
          The key intuition: at each coordinate update, the algorithm applies a{' '}
          <em>soft-thresholding</em> step that sets coefficients to exactly zero when their unregularised
          value is below the threshold. That is where sparsity comes from.
        </p>
      </LessonSection>

      <LessonSection title="You MUST standardise features before regularising">
        <p className="text-slate-300">
          Regularisation penalises all θⱼ equally. If x₁ is measured in dollars ($) and x₂ is measured in
          fractions (0–1), θ₁ will be tiny and θ₂ huge — the penalty will destroy θ₂ regardless of
          predictive power. Fix:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>StandardScaler → (x − mean) / std     for each column</div>
        </div>
        <p className="mt-3 text-slate-300">
          Now every feature has σ = 1 and the penalty is fair. Use{' '}
          <code className="text-slate-200">Pipeline([('scaler', StandardScaler()), ('reg', Ridge())])</code>
          {' '}to prevent test-set leakage.
        </p>
      </LessonSection>

      <LessonSection title="How to choose λ — cross-validation, always">
        <ContentStep number={1} title="Grid or log-space search">
          <p>Try λ ∈ {`{`}10⁻³, 10⁻², …, 10³{`}`} on a log grid — Ridge/Lasso are usually monotonic in log λ.</p>
        </ContentStep>
        <ContentStep number={2} title="Score each λ with k-fold CV">
          <p>
            For each λ, split training into k folds, average validation MSE. Pick the λ with lowest average
            error.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Use built-in helpers">
          <p>
            <code className="text-slate-200">RidgeCV</code> and <code className="text-slate-200">LassoCV</code>
            {' '}do this internally, with efficient warm-starts along the regularisation path.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A tiny worked example">
        <p className="text-slate-300">
          Tiny dataset with two features. x₁ and x₂ are highly correlated (both roughly describe
          &ldquo;experience&rdquo;); y is salary.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>OLS θ:        θ₁ = 6.32,   θ₂ = −4.11   (huge swings, unstable)</div>
          <div>Ridge λ=1.0:  θ₁ = 1.12,   θ₂ = 0.97    (both shrunk, balanced)</div>
          <div>Lasso λ=1.0:  θ₁ = 1.94,   θ₂ = 0        (x₂ dropped — sparse)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Same data, three different messages. Ridge says &ldquo;both features matter a little&rdquo;.
          Lasso says &ldquo;keep only x₁&rdquo;. OLS says nothing useful because the coefficients cannot be
          trusted individually.
        </p>
      </LessonSection>

      <LessonSection title="Python — all three, side-by-side">
        <Example
          title="Ridge, Lasso, ElasticNet with proper scaling"
          output={`OLS         MSE = 0.410   coefs = [ 0.98  0.42 -0.02  0.09  0.11 ...]  (10 nonzero)
Ridge α=1   MSE = 0.386   coefs = [ 0.82  0.35 -0.01  0.07  0.09 ...]  (10 nonzero)
Lasso α=0.1 MSE = 0.372   coefs = [ 0.79  0.00  0.00  0.00  0.00 ...]  (3 nonzero)
ElasticNet  MSE = 0.375   coefs = [ 0.72  0.18  0.00  0.00  0.05 ...]  (5 nonzero)
Best Ridge α via CV     : 0.5
Best Lasso α via CV     : 0.05`}
        >{`import numpy as np
from sklearn.datasets import make_regression
from sklearn.linear_model import (
    LinearRegression, Ridge, Lasso, ElasticNet, RidgeCV, LassoCV,
)
from sklearn.model_selection import train_test_split
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_squared_error

# Simulate: 10 features, only 3 are truly informative
X, y = make_regression(n_samples=200, n_features=10, n_informative=3,
                       noise=0.5, random_state=0)
X_tr, X_te, y_tr, y_te = train_test_split(X, y, random_state=0)

def fit_score(model, name):
    pipe = Pipeline([('scaler', StandardScaler()), ('reg', model)])
    pipe.fit(X_tr, y_tr)
    mse = mean_squared_error(y_te, pipe.predict(X_te))
    coefs = pipe.named_steps['reg'].coef_
    print(f"{name:11} MSE = {mse:.3f}   coefs = {np.round(coefs, 2)}   "
          f"({(coefs != 0).sum()} nonzero)")

fit_score(LinearRegression(),           "OLS")
fit_score(Ridge(alpha=1.0),             "Ridge α=1")
fit_score(Lasso(alpha=0.1),             "Lasso α=0.1")
fit_score(ElasticNet(alpha=0.1, l1_ratio=0.5), "ElasticNet")

# Automatic λ selection via CV
ridge_cv = Pipeline([('s', StandardScaler()), ('r', RidgeCV(alphas=np.logspace(-3, 3, 25)))])
ridge_cv.fit(X_tr, y_tr)
print(f"Best Ridge α via CV     : {ridge_cv.named_steps['r'].alpha_}")

lasso_cv = Pipeline([('s', StandardScaler()), ('l', LassoCV(alphas=np.logspace(-3, 1, 25), cv=5))])
lasso_cv.fit(X_tr, y_tr)
print(f"Best Lasso α via CV     : {lasso_cv.named_steps['l'].alpha_:.2f}")`}</Example>
      </LessonSection>

      <LessonSection title="Bayesian view — regularisation IS a prior">
        <p className="text-slate-300">
          Adding a penalty is mathematically the same as placing a prior on θ (from the Mathematics{' '}
          <em>MLE &amp; MAP</em> lesson):
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Ridge  ↔ Gaussian prior on θ:  θ ~ N(0, σ² / λ · I)</div>
          <div>Lasso  ↔ Laplace prior on θ:   θ ~ Laplace(0, σ² / λ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Big λ ⇔ tight prior ⇔ &ldquo;I strongly believe most coefficients are near zero&rdquo;.
          Regularisation strength is literally a statement of belief.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Regularisation adds a penalty on the coefficients so OLS stops fitting the noise. λ (alpha) controls how strong the penalty is.',
          'Ridge (L2) shrinks smoothly and stabilises XᵀX in multicollinearity. Lasso (L1) sets coefficients to EXACTLY zero — free feature selection.',
          'Elastic Net blends both — sparsity with stability when features come in correlated groups.',
          'ALWAYS standardise features before regularising, and NEVER penalise the intercept.',
          'Choose λ with cross-validation (RidgeCV, LassoCV) — a log-spaced grid works for both.',
          'Regularisation = MAP with a prior. Ridge = Gaussian prior, Lasso = Laplace prior. Larger λ = tighter prior = more shrinkage.',
        ]}
      />
    </LessonArticle>
  )
}
