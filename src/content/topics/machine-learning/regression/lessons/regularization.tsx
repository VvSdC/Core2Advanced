import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RegressionRegularization() {
  return (
    <LessonArticle>
      <Definition term="Regularisation">
        <p>
          A penalty on the size of θ, added to the training loss so the model prefers simpler
          weights over a perfect fit to noise:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>J(θ) = (1 / 2m) ‖Xθ − y‖²  +  λ · R(θ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          λ (alpha in scikit-learn) is the knob. λ = 0 is plain OLS. Large λ shrinks every
          coefficient toward 0. Never regularise the intercept — it is just the mean of y.
        </p>
      </Definition>

      <LessonSection title="The three flavours">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Penalty R(θ)</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Ridge (L2)', '‖θ‖² / 2', 'Shrinks all weights, keeps all features', 'Correlated features, want stability'],
                ['Lasso (L1)', '‖θ‖₁', 'Shrinks and can zero out weights', 'Many features, want a sparse model'],
                ['Elastic Net', 'α‖θ‖₁ + (1−α)‖θ‖²/2', 'Mix of both', 'Grouped correlated features + sparsity'],
              ].map(([name, r, does, when]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{r}</td>
                  <td className="px-4 py-3 text-slate-400">{does}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="This is MAP from the probability lessons">
          Ridge = Gaussian prior on θ. Lasso = Laplace prior. The λ you tune is the prior&rsquo;s
          tightness. Same equation, two names.
        </Callout>
      </LessonSection>

      <LessonSection title="Closed form for Ridge">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>θ_ridge = (XᵀX + λ I)⁻¹ Xᵀ y</div>
        </div>
        <p className="mt-3 text-slate-300">
          Adding λI lifts every eigenvalue of XᵀX, so the inverse always exists — even when OLS
          is singular. Lasso has no such one-liner; it is solved by coordinate descent.
        </p>
      </LessonSection>

      <LessonSection title="Intuition — two geometries">
        <p className="text-slate-300">
          OLS wants the point in θ-space closest to the unconstrained minimum. Ridge constrains
          you to a disk (‖θ‖₂ ≤ t). Lasso constrains you to a diamond (‖θ‖₁ ≤ t). The diamond
          has corners on the axes, so the first place the contour hits is often a coordinate
          axis — some θⱼ become exactly zero. That is the geometric reason Lasso selects features.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Ridge vs OLS on a 1-D toy">
          <p>XᵀX = 4, Xᵀy = 8, λ = 1. Compare OLS and Ridge (no intercept, one weight).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>θ_OLS   = 8 / 4     = 2</div>
            <div>θ_ridge = 8 / (4+1) = 1.6</div>
            <div className="mt-1 text-slate-400">Same direction, smaller magnitude. Always, for λ &gt; 0.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Why scale before Ridge / Lasso">
          <p>x₁ is income in rupees, x₂ is rooms (1–5). You apply L2 to raw θ. What goes wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>θ₁ is tiny (rupees are huge); θ₂ is large. The penalty hits rooms, not income.</div>
            <div>Standardise features first so λ treats every column fairly.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Lasso zeros a weight">
          <p>Two features, true effect only from x₁. Lasso returns θ = [3.1, 0]. What did you gain?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A sparse model you can explain. Ridge would have left a small θ₂.</div>
            <div>If x₁ and x₂ are correlated, Lasso may keep the wrong one of the pair — Elastic Net is safer then.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — λ as a validation search">
          <p>You try λ ∈ {`{0.01, 0.1, 1, 10}`}. Train MSE is lowest at 0.01, val MSE lowest at 1. Which do you ship?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>λ = 1. Train MSE is not the selection criterion — that is how you overfit the penalty itself.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Ridge fixes the dummy trap?">
          <p>You kept every dummy plus intercept. Does Ridge make θ unique?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Yes — XᵀX + λI is invertible. Predictions match a dropped-dummy OLS.</div>
            <div>Coefficients are still shared across the redundant columns; do not over-read a single dummy&rsquo;s θ.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — OLS, Ridge, Lasso on the same data">
        <Example
          title="Shrinkage and sparsity on a 6-feature, 20-row set"
          output={`OLS   θ = [ 1.82  0.91 -0.14  0.22  0.07 -0.31]
Ridge θ = [ 1.41  0.72 -0.05  0.11  0.04 -0.12]
Lasso θ = [ 1.55  0.68  0.     0.    0.    0.  ]`}
        >{`import numpy as np

rng = np.random.default_rng(0)
m, n = 20, 6
X = rng.normal(size=(m, n))
true = np.array([2.0, 1.0, 0, 0, 0, 0])
y = X @ true + rng.normal(scale=0.4, size=m)

def fit_ridge(lmbda):
    return np.linalg.solve(X.T @ X + lmbda * np.eye(n), X.T @ y)

def soft(z, t):
    return np.sign(z) * np.maximum(np.abs(z) - t, 0.0)

def fit_lasso(lmbda, steps=400, alpha=0.05):
    theta = np.zeros(n)
    for _ in range(steps):
        grad = (X.T @ (X @ theta - y)) / m
        theta = soft(theta - alpha * grad, alpha * lmbda)
    return theta

print("OLS   θ =", np.round(np.linalg.pinv(X) @ y, 2))
print("Ridge θ =", np.round(fit_ridge(5.0), 2))
print("Lasso θ =", np.round(fit_lasso(0.15), 2))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Regularisation = extra penalty on θ. λ is a validation-tuned knob; never penalise the intercept.',
          'Ridge (L2) shrinks everything, keeps everyone, stabilises correlated features. Closed form: (XᵀX + λI)⁻¹ Xᵀy.',
          'Lasso (L1) can zero weights — automatic feature selection. No closed form; corners of the L1 ball sit on the axes.',
          'Elastic Net mixes them when you want sparsity and groups of correlated features to survive together.',
          'Scale features before regularising, or λ silently punishes the small-unit columns.',
        ]}
      />
    </LessonArticle>
  )
}
