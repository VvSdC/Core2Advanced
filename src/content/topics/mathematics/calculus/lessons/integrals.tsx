import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function Integrals() {
  return (
    <LessonArticle>
      <Definition term="Integral">
        <p>
          An <strong className="text-white">integral</strong> is the reverse of a derivative — and, at the
          same time, the exact area under a curve. Both readings are the same object, tied together by the
          Fundamental Theorem of Calculus.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Indefinite (antiderivative):   ∫ f(x) dx = F(x) + C     where F'(x) = f(x)</div>
          <div className="mt-2">Definite (area between a and b): ∫ₐᵇ f(x) dx = F(b) − F(a)</div>
        </div>
      </Definition>

      <LessonSection title="Why ML people should care about integrals">
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Probability</strong> — probabilities are integrals of density functions (P(a &lt; X &lt; b) = ∫ₐᵇ p(x) dx).</li>
          <li><strong className="text-white">Expectations</strong> — E[X] = ∫ x p(x) dx.</li>
          <li><strong className="text-white">Cross-entropy in continuous space</strong> — an integral of −p log q.</li>
          <li><strong className="text-white">Area-under-the-curve (AUC)</strong> — the classification metric is literally an integral.</li>
          <li><strong className="text-white">Diffusion models, ODE solvers</strong> — trained by integrating a learned vector field.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Basic antiderivatives to memorise">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">f(x)</th>
                <th className="px-4 py-3">∫ f(x) dx</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['xⁿ  (n ≠ −1)',      'xⁿ⁺¹ / (n + 1) + C'],
                ['1/x',                'ln |x| + C'],
                ['eˣ',                 'eˣ + C'],
                ['a·eᵏˣ',              '(a/k) eᵏˣ + C'],
                ['cos x',              'sin x + C'],
                ['sin x',              '−cos x + C'],
                ['1 / (1 + x²)',       'arctan x + C'],
                ['e^(−x²/2)',          '√(2π) · Φ(x) + C  (Gaussian CDF, no elementary form)'],
              ].map(([f, F]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-mono text-white">{f}</td>
                  <td className="px-4 py-3 font-mono text-slate-300">{F}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Every integral is a guess-and-check">
          Guess an F(x) whose derivative is f(x). Differentiate to check. That is literally the whole game.
        </Callout>
      </LessonSection>

      <LessonSection title="Two techniques cover 80% of hand integrals">
        <ContentStep number={1} title="Substitution — reverse of the chain rule">
          <p>
            Spot an &ldquo;inner function&rdquo; whose derivative appears elsewhere in the integrand. Let{' '}
            <code>u = inner</code>, then <code>du = inner' dx</code>. Rewrite the whole integral in u.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∫ 2x · e^(x²) dx</div>
            <div className="mt-1">Let u = x². Then du = 2x dx.</div>
            <div>∫ eᵘ du = eᵘ + C = e^(x²) + C.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Integration by parts — reverse of the product rule">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∫ u dv = u v − ∫ v du</div>
            <div className="mt-2">Example: ∫ x eˣ dx</div>
            <div className="mt-1">Let u = x → du = dx;  dv = eˣ dx → v = eˣ.</div>
            <div>∫ x eˣ dx = x eˣ − ∫ eˣ dx = x eˣ − eˣ + C = (x − 1) eˣ + C.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="The Fundamental Theorem of Calculus">
        <p className="text-slate-300">
          Differentiation and integration are inverse operations. Two clean statements:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>1)  d/dx [ ∫ₐˣ f(t) dt ] = f(x)</div>
          <div className="mt-2">2)  ∫ₐᵇ F'(x) dx = F(b) − F(a)</div>
        </div>
        <p className="mt-3 text-slate-300">
          The first says: if you build a running-total function of f, differentiating it gives f back. The
          second is how you actually evaluate every hand integral — find an antiderivative and subtract.
        </p>
      </LessonSection>

      <LessonSection title="When you cannot find a formula — numerical integration">
        <p className="text-slate-300">
          Most integrals in ML (Gaussian CDFs, Bayesian posteriors, ROC curves) have no elementary
          antiderivative. Compute them numerically:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Rectangle / midpoint rule</strong> — sum of rectangles, cheapest.</li>
          <li><strong className="text-white">Trapezoidal rule</strong> — connect samples with straight lines (<code>np.trapezoid</code>).</li>
          <li><strong className="text-white">Simpson&rsquo;s rule</strong> — quadratic fits through triples; O(h⁴) error.</li>
          <li><strong className="text-white">Monte Carlo</strong> — sample x from a distribution and average f(x) · ratio. The only method that scales to high dimensions.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Power rule">
          <p>Evaluate ∫ (3x² − 4x + 5) dx.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>= x³ − 2x² + 5x + C</div>
            <div className="mt-1">Check by differentiating: 3x² − 4x + 5 ✓</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Definite integral">
          <p>Compute ∫₀² (3x² − 4x + 5) dx.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>F(x) = x³ − 2x² + 5x</div>
            <div>F(2) − F(0) = (8 − 8 + 10) − 0 = 10.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Substitution">
          <p>Evaluate ∫ x / (1 + x²) dx.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Let u = 1 + x²  →  du = 2x dx  →  x dx = du/2.</div>
            <div>∫ (1/u) · (du/2) = (1/2) ln|u| + C = (1/2) ln(1 + x²) + C.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Expectation of a uniform (ML flavour)">
          <p>X ~ Uniform(0, 1) has density p(x) = 1 on [0, 1]. Compute E[X²].</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>E[X²] = ∫₀¹ x² · 1 dx = [x³/3]₀¹ = 1/3.</div>
            <div className="mt-1">And Var(X) = E[X²] − (E[X])² = 1/3 − 1/4 = 1/12. ✓</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Probability under a Gaussian (ML flavour)">
          <p>
            For X ~ N(0, 1), find P(−1 &lt; X &lt; 1). The Gaussian PDF has no elementary antiderivative;
            use the CDF Φ or a numerical method.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(−1 &lt; X &lt; 1) = Φ(1) − Φ(−1) = 2 · Φ(1) − 1</div>
            <div className="mt-1">Φ(1) ≈ 0.8413 → P ≈ 0.6827  (the famous "68% within 1σ" rule).</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — AUC as an integral (ML flavour)">
          <p>
            ROC-AUC is the area under the true-positive-rate vs false-positive-rate curve. If your ROC is
            approximated by the point set (0, 0), (0.1, 0.5), (0.5, 0.9), (1, 1), estimate AUC using the
            trapezoidal rule.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Trapezoids between consecutive (fpr, tpr) points:</div>
            <div className="mt-1">A₁ = 0.5·(0 + 0.5)·(0.1 − 0)     = 0.025</div>
            <div>A₂ = 0.5·(0.5 + 0.9)·(0.5 − 0.1) = 0.28</div>
            <div>A₃ = 0.5·(0.9 + 1.0)·(1.0 − 0.5) = 0.475</div>
            <div className="mt-2">AUC ≈ 0.025 + 0.28 + 0.475 = 0.78.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — symbolic, quadrature, and Monte Carlo">
        <Example
          title="Three ways to integrate"
          output={`SymPy indefinite : x**3 - 2*x**2 + 5*x
SymPy definite   : 10
np.trapezoid     : 10.000199999999998
scipy.integrate  : (10.0, 1.1102e-13)
P(-1 < N(0,1) < 1) via CDF          = 0.6826894921370859
Monte Carlo estimate of same        ≈ 0.6829  (n=100000)
Trapezoidal AUC on the 4-point ROC  = 0.78`}
        >{`import numpy as np
import sympy as sp
from scipy import integrate, stats

# ---- Symbolic ----
x = sp.symbols("x")
f = 3*x**2 - 4*x + 5
print("SymPy indefinite :", sp.integrate(f, x))
print("SymPy definite   :", sp.integrate(f, (x, 0, 2)))

# ---- Numerical: trapezoidal ----
xs = np.linspace(0, 2, 1001)
ys = 3*xs**2 - 4*xs + 5
print("np.trapezoid     :", np.trapezoid(ys, xs))

# ---- Numerical: quadrature ----
val, err = integrate.quad(lambda x: 3*x**2 - 4*x + 5, 0, 2)
print("scipy.integrate  :", (val, err))

# ---- Gaussian probability ----
print("P(-1 < N(0,1) < 1) via CDF          =", stats.norm.cdf(1) - stats.norm.cdf(-1))

# ---- Monte Carlo ----
rng = np.random.default_rng(0)
samples = rng.standard_normal(100_000)
mc = ((samples > -1) & (samples < 1)).mean()
print(f"Monte Carlo estimate of same        ≈ {mc:.4f}  (n=100000)")

# ---- AUC via trapezoids ----
fpr = np.array([0.0, 0.1, 0.5, 1.0])
tpr = np.array([0.0, 0.5, 0.9, 1.0])
print("Trapezoidal AUC on the 4-point ROC  =", np.trapezoid(tpr, fpr))`}</Example>
        <Callout variant="tip" title="When to reach for Monte Carlo">
          Below 4 dimensions, quadrature methods (<code>scipy.integrate.quad</code>, <code>dblquad</code>)
          are far more accurate. Above 4 dimensions their cost explodes exponentially — Monte Carlo becomes
          the only option. That is why every modern generative-model likelihood is estimated with samples,
          not summed with a grid.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Integrals are both the reverse of derivatives and the exact area under a curve — the Fundamental Theorem ties them together.',
          'Memorise the antiderivatives of xⁿ, 1/x, eˣ, sin, cos, and 1/(1+x²); most others reduce to these via substitution or parts.',
          'Substitution reverses the chain rule; integration by parts reverses the product rule. Between them they solve 80% of hand integrals.',
          'Probabilities and expectations of continuous random variables are integrals: P(a<X<b) = ∫ p(x) dx, E[X] = ∫ x p(x) dx.',
          'Most ML integrals have no closed form — use trapezoidal/Simpson (small dims), scipy.integrate.quad (up to ~4D), and Monte Carlo (high dimensions).',
          'AUC, KL divergence, evidence lower bounds, and diffusion-model losses are all integrals — approximate them well and you can train them.',
        ]}
      />
    </LessonArticle>
  )
}
