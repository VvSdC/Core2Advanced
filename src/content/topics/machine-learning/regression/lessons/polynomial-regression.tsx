import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ScatterPlot,
} from '../../../../../components/content'

export function PolynomialRegressionLesson() {
  return (
    <LessonArticle>
      <Definition term="Polynomial regression">
        <p>
          Keep a model that is <strong className="text-white">linear in θ</strong>, but give it
          extra columns that are powers (and maybe products) of the original x:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>ŷ = θ₀ + θ₁ x + θ₂ x² + … + θₖ xᵏ</div>
          <div className="mt-1">Feature map:  φ(x) = (1, x, x², …, xᵏ)     then  ŷ = θᵀ φ(x)</div>
        </div>
        <p className="mt-3 text-slate-300">
          The scatter can bend. The learner does not change — same MSE, same OLS, same gradient
          descent, now on Φ instead of X.
        </p>
      </Definition>

      <LessonSection title="Intuition — a curve is a line in a richer space">
        <p className="text-slate-300">
          If y grows faster and faster with x, a straight line systematically misses: negative
          residuals on the left, positive in the middle, negative on the right. Adding x² lets the
          surface bow. Adding x³ lets it wiggle once more. Each extra degree is one more bend you
          can afford.
        </p>
        <ScatterPlot
          title="A quadratic trend with a linear miss"
          points={[
            { x: 1, y: 2.1 },
            { x: 2, y: 4.8 },
            { x: 3, y: 9.2 },
            { x: 4, y: 16.4 },
            { x: 5, y: 25.1 },
          ]}
          line={{ intercept: -5, slope: 5.5 }}
          showResiduals
          xLabel="x"
          yLabel="y"
          caption="The dashed residuals are not random — they curve. That pattern is the tell that a line is the wrong shape."
        />
        <Flowchart
          title="Expand, then fit the usual linear model"
          chart={`flowchart LR
  A[Raw x] --> B[Add x², x³, …]
  B --> C[Design matrix Φ]
  C --> D[OLS / GD on θ]
  D --> E[Curved ŷ vs x]`}
        />
      </LessonSection>

      <LessonSection title="When to use it — and when the extra bends hurt">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Scatter or residual plot shows a smooth bend, not a jumble.</li>
          <li>Domain says the effect should accelerate or saturate (dose-response, diminishing returns — though saturation is often better as a log or a dedicated curve).</li>
          <li>You want a parametric curve you can write down, not a tree ensemble.</li>
        </ul>
        <Callout variant="tip" title="Degree is a hyperparameter">
          Degree 1 is ordinary linear regression. Degree too high interpolates every point and
          explodes outside the data. Pick k on a validation set, or prefer a low k plus Ridge.
          Orthogonal polynomials or spline bases (piecewise polynomials) are the grown-up version
          of the same idea.
        </Callout>
      </LessonSection>

      <LessonSection title="The overfitting signature">
        <p className="text-slate-300">
          Train MSE always falls as k grows — more columns can only help the training fit. Test MSE
          falls, then rises. The rise is the model chasing noise. That U-shape is the whole
          bias-variance lesson in one plot.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Expand and predict">
          <p>φ(x) = (1, x, x²), θ = [1, 2, 0.5]. What is ŷ at x = 3?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 1 + 2·3 + 0.5·9 = 1 + 6 + 4.5 = 11.5</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Recover a quadratic with OLS">
          <p>Data generated as y = 1 + 2x + 0.5 x² with no noise, x = 0, 1, 2. Recover θ.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>y = [1, 3.5, 7]. Φ rows: [1, 0, 0], [1, 1, 1], [1, 2, 4].</div>
            <div>Three independent rows, three parameters → exact recovery θ = [1, 2, 0.5].</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Why degree 4 on 5 points is dangerous">
          <p>n_params = 5, m = 5. What can OLS do?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A degree-(m−1) polynomial can interpolate m distinct x&rsquo;s exactly.</div>
            <div>Train MSE = 0. The curve will thrash between points and explode outside.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Residual diagnosis">
          <p>Residuals vs x look like a U. Degree-1 model. What do you do first?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Add x² (or transform y / x — log, sqrt — if the U is a known physical shape).</div>
            <div>Do not jump to degree 6. One extra bend is the smallest hypothesis that matches a U.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Interaction vs polynomial (ML flavour)">
          <p>Two features x₁, x₂. Is x₁ x₂ a polynomial term? When do you want it?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Yes — it is a degree-2 interaction. PolynomialFeatures(degree=2) adds squares AND products.</div>
            <div>Use it when the effect of x₁ depends on x₂ (discount only works for large baskets).</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — linear vs quadratic on a bent cloud">
        <Example
          title="Train / test MSE by degree"
          output={`degree 1  train 6.41   test 7.88
degree 2  train 0.94   test 1.21
degree 8  train 0.41   test 9.55`}
        >{`import numpy as np
from numpy.polynomial.polynomial import polyvander

rng = np.random.default_rng(0)
x = np.linspace(0, 4, 40)
y = 1 + 2 * x + 0.5 * x**2 + rng.normal(0, 1.0, size=x.size)
idx = rng.permutation(x.size)
tr, te = idx[:30], idx[30:]

def mse(degree, split):
    Phi = polyvander(x[split], degree)
    theta = np.linalg.lstsq(Phi, y[split], rcond=None)[0]
    return float(np.mean((Phi @ theta - y[split]) ** 2))

for k in (1, 2, 8):
    print(f"degree {k}  train {mse(k, tr):.2f}   test {mse(k, te):.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Polynomial regression is linear regression on φ(x) = (1, x, x², …, xᵏ). Same OLS, curved ŷ vs x.',
          'Use it when residuals show a smooth bend. Degree is a hyperparameter — validate it; do not chase train MSE.',
          'A degree-(m−1) polynomial interpolates m points and overfits. Prefer a low degree, or a low degree plus Ridge.',
          'sklearn PolynomialFeatures also adds interactions xᵢ xⱼ. Those are for “the effect of A depends on B,” not for extra wiggle in one axis.',
          'Splines (piecewise polynomials) are what you reach for when a single global xᵏ oscillates at the edges.',
        ]}
      />
    </LessonArticle>
  )
}
