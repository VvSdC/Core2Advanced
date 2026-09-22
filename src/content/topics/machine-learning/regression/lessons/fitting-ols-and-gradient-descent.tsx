import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ScatterPlot,
  CurvePlot,
} from '../../../../../components/content'

export function FittingOlsAndGradientDescent() {
  return (
    <LessonArticle>
      <Definition term="Fitting a linear model">
        <p>
          Fitting means choosing θ so the hypothesis ŷ = θ₀ + θ₁x is as close as possible to the
          observed y. Two equivalent routes get you there:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Ordinary least squares (OLS)</strong> — set the
            derivatives of the cost to zero and solve. One shot, exact.
          </li>
          <li>
            <strong className="text-white">Gradient descent</strong> — start anywhere and walk
            downhill. Approximate, scales to huge data and non-closed-form models.
          </li>
        </ul>
      </Definition>

      <LessonSection title="Cost — the scorecard for mistakes">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>J(θ₀, θ₁) = (1 / 2m) Σᵢ (ŷᵢ − yᵢ)²</div>
          <div className="mt-1">ŷᵢ = θ₀ + θ₁ xᵢ</div>
        </div>
        <p className="mt-3 text-slate-300">
          The 1/2 is a courtesy so the 2 from differentiating a square cancels. m is the number of
          rows. Squaring does three jobs: positives and negatives do not cancel, large misses hurt
          more, and the resulting bowl is convex — one global minimum.
        </p>
        <ScatterPlot
          title="Residuals are the vertical misses"
          points={[
            { x: 1, y: 1 },
            { x: 2, y: 2.2 },
            { x: 3, y: 2.6 },
            { x: 4, y: 4.5 },
          ]}
          line={{ intercept: 0.1, slope: 1.0 }}
          showResiduals
          xLabel="x"
          yLabel="y"
          caption="Each dashed line is a residual. OLS picks the slope and intercept that make the sum of squared residuals as small as possible."
        />
      </LessonSection>

      <LessonSection title="OLS closed form — set the slope to zero">
        <p className="text-slate-300">
          Differentiate J, set both partials to zero, and solve. For one feature the answer is:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>θ₁ = Σ (xᵢ − x̄)(yᵢ − ȳ)  /  Σ (xᵢ − x̄)²</div>
          <div>θ₀ = ȳ − θ₁ x̄</div>
        </div>
        <p className="mt-3 text-slate-300">
          Slope is covariance of x and y, divided by variance of x. Intercept forces the line
          through the point of means (x̄, ȳ).
        </p>
        <Callout variant="insight" title="Matrix form you will reuse forever">
          With a bias column of ones, X is m × 2 and θ is 2 × 1. The same algebra becomes
          θ = (XᵀX)⁻¹ Xᵀy — the normal equation. Multiple regression is this line with more
          columns.
        </Callout>
      </LessonSection>

      <LessonSection title="Gradient descent — walk the bowl">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>∂J/∂θ₀ = (1/m) Σ (ŷᵢ − yᵢ)</div>
          <div>∂J/∂θ₁ = (1/m) Σ (ŷᵢ − yᵢ) xᵢ</div>
          <div className="mt-2">θⱼ ← θⱼ − α · ∂J/∂θⱼ</div>
        </div>
        <p className="mt-3 text-slate-300">
          α is the learning rate. Too small: crawl. Too large: bounce past the minimum. Feature
          scaling (put x on a similar numeric range) makes the bowl rounder so one α works for
          every θⱼ.
        </p>
        <CurvePlot
          title="Cost vs slope — walking downhill"
          fn={(t1) => 0.4 * (t1 - 2) ** 2 + 0.3}
          domain={[0, 4]}
          path={[
            { x: 0.4, y: 0.4 * (0.4 - 2) ** 2 + 0.3 },
            { x: 1.1, y: 0.4 * (1.1 - 2) ** 2 + 0.3 },
            { x: 1.6, y: 0.4 * (1.6 - 2) ** 2 + 0.3 },
            { x: 1.9, y: 0.4 * (1.9 - 2) ** 2 + 0.3 },
          ]}
          markMin={{ x: 2, y: 0.3 }}
          xLabel="θ₁"
          yLabel="J"
          caption="Each orange step is one gradient update. OLS lands on the green minimum in one solve; GD arrives there after enough steps."
        />
      </LessonSection>

      <LessonSection title="When to pick OLS vs gradient descent">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose OLS when</th>
                <th className="px-4 py-3">Choose gradient descent when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['n (features) is small — inverting XᵀX is cheap', 'n is huge (text, one-hot, embeddings)'],
                ['You want an exact, reproducible solve', 'The loss is not a closed-form quadratic'],
                ['m is moderate and fits in memory', 'You stream mini-batches (SGD)'],
              ].map(([ols, gd]) => (
                <tr key={ols}>
                  <td className="px-4 py-3 text-slate-300">{ols}</td>
                  <td className="px-4 py-3 text-slate-400">{gd}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — OLS by hand">
          <p>Points: (1, 2), (2, 3), (3, 5). Find θ₀, θ₁.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>x̄ = 2,   ȳ = 10/3 ≈ 3.333</div>
            <div>Σ(x − x̄)(y − ȳ) = (−1)(−1.333) + (0)(−0.333) + (1)(1.667) = 3</div>
            <div>Σ(x − x̄)² = 1 + 0 + 1 = 2</div>
            <div>θ₁ = 3 / 2 = 1.5</div>
            <div>θ₀ = 3.333 − 1.5 · 2 = 0.333</div>
            <div className="mt-1">ŷ = 0.333 + 1.5 x</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — One gradient step">
          <p>Same three points. Start at θ₀ = 0, θ₁ = 0, α = 0.1. First update?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 0 for all rows.  errors = −2, −3, −5</div>
            <div>∂J/∂θ₀ = (1/3)(−2 − 3 − 5) = −10/3</div>
            <div>∂J/∂θ₁ = (1/3)(−2·1 − 3·2 − 5·3) = −23/3</div>
            <div>θ₀ ← 0 − 0.1 · (−10/3) = 0.333</div>
            <div>θ₁ ← 0 − 0.1 · (−23/3) = 0.767</div>
            <div className="mt-1 text-slate-400">Already moving toward the OLS solution (0.333, 1.5).</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Why the 1/2 in J">
          <p>If you drop the 1/2, does the OLS solution change?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No. Scaling J by a positive constant does not move the minimiser.</div>
            <div>It only scales the gradient — GD needs a smaller α to compensate.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Singular XᵀX">
          <p>All xᵢ are identical. What happens to the OLS formula for θ₁?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Σ(xᵢ − x̄)² = 0  →  divide by zero. XᵀX is singular.</div>
            <div className="mt-1 text-genai-400">
              You cannot estimate a slope with no variation in x. Regularisation (later) adds λI so
              the inverse exists.
            </div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Feature scale and α">
          <p>x is house size in square feet (1000–4000) and a dummy 0/1 for “renovated”. Why does one α struggle?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The size axis of the bowl is stretched by thousands; the dummy axis is not.</div>
            <div>One α is either too big for size or too small for the dummy.</div>
            <div>Fix: standardise numeric features (zero mean, unit variance) before GD.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — OLS and a few GD steps agree">
        <Example
          title="Closed form vs ten gradient steps"
          output={`OLS θ = [0.3333 1.5   ]
GD  θ after 200 steps, α=0.1: [0.3333 1.5   ]
J(OLS) = 0.0556`}
        >{`import numpy as np

x = np.array([1.0, 2.0, 3.0])
y = np.array([2.0, 3.0, 5.0])
X = np.c_[np.ones(3), x]

theta_ols = np.linalg.inv(X.T @ X) @ X.T @ y
print("OLS θ =", np.round(theta_ols, 4))

theta = np.zeros(2)
alpha, m = 0.1, len(y)
for _ in range(200):
    err = X @ theta - y
    theta -= (alpha / m) * (X.T @ err)
print("GD  θ after 200 steps, α=0.1:", np.round(theta, 4))

j = ((X @ theta_ols - y) ** 2).sum() / (2 * m)
print(f"J(OLS) = {j:.4f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'J = (1/2m) Σ (ŷ − y)² is a convex bowl. The 1/2 is cosmetic; the minimiser does not change if you drop it.',
          'OLS: θ₁ = Cov(x, y) / Var(x), θ₀ = ȳ − θ₁ x̄. Matrix form: θ = (XᵀX)⁻¹ Xᵀy.',
          'Gradient descent: θ ← θ − α ∇J. Same destination when J is convex; the tool you keep when OLS is impossible or too expensive.',
          'Scale features before GD. OLS is invariant to that scaling of the closed form only after you remember to unscale coefficients for interpretation.',
          'No variation in a feature → XᵀX is singular. You cannot estimate that slope; drop the feature or add regularisation.',
        ]}
      />
    </LessonArticle>
  )
}
