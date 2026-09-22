import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TaylorSeriesAndConvexOptimisation() {
  return (
    <LessonArticle>
      <Definition term="Taylor series">
        <p>
          Near a chosen point <em>a</em>, a &ldquo;smooth&rdquo; function is nearly a polynomial. The{' '}
          <strong className="text-white">Taylor series</strong> writes that polynomial explicitly:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>f(x) ≈ f(a) + f'(a)(x − a) + (1/2) f''(a)(x − a)² + (1/6) f'''(a)(x − a)³ + …</div>
        </div>
        <p className="mt-3 text-slate-300">
          Keep the first term = a constant approximation; two terms = the tangent line; three terms = the
          best-fit parabola. Every extra term adds curvature detail.
        </p>
      </Definition>

      <LessonSection title="Taylor expansions everyone in ML has met">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Function</th>
                <th className="px-4 py-3">Taylor around 0</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['eˣ',           '1 + x + x²/2 + x³/6 + x⁴/24 + …'],
                ['ln(1 + x)',    'x − x²/2 + x³/3 − x⁴/4 + …    (|x| < 1)'],
                ['sin x',        'x − x³/6 + x⁵/120 − …'],
                ['cos x',        '1 − x²/2 + x⁴/24 − …'],
                ['σ(x)',         '0.5 + 0.25 x − x³/48 + …       (near 0)'],
                ['(1 + x)ᵏ',     '1 + k x + k(k−1) x²/2 + …      (binomial expansion)'],
              ].map(([f, t]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-mono text-white">{f}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{t}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="First-order Taylor = gradient descent">
          Approximate f(w + Δw) ≈ f(w) + ∇f(w)ᵀ Δw. To reduce f, pick Δw = −η ∇f(w). That is gradient descent
          — it is the correct step when we only trust the linear approximation.
        </Callout>
        <Callout variant="insight" title="Second-order Taylor = Newton's method">
          Add the Hessian term: f(w + Δw) ≈ f(w) + ∇fᵀ Δw + ½ Δwᵀ H Δw. Minimising over Δw gives{' '}
          <code className="text-slate-200">Δw = −H⁻¹ ∇f</code>. Newton jumps straight to the minimum of the
          parabolic approximation — one step for a quadratic, few steps for a smooth function.
        </Callout>
      </LessonSection>

      <LessonSection title="Convex functions — the &ldquo;easy&rdquo; optimisation landscape">
        <Definition term="Convexity">
          <p>
            A function f is <strong className="text-white">convex</strong> if the line segment between any
            two points on its graph lies on or above the graph. Formally:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f(t x + (1 − t) y) ≤ t f(x) + (1 − t) f(y)     for all t ∈ [0, 1]</div>
          </div>
          <p className="mt-2 text-slate-300">
            In one dimension: bowl-shaped. In many dimensions: no local minima anywhere except the global
            one.
          </p>
        </Definition>
        <p className="mt-3 text-slate-300">Equivalent tests, from easiest to hardest to check:</p>
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Second derivative test (1D)</strong> — f''(x) ≥ 0 everywhere.</li>
          <li><strong className="text-white">Hessian test (multi-D)</strong> — H(x) is positive semi-definite everywhere (all eigenvalues ≥ 0).</li>
          <li><strong className="text-white">Chord test</strong> — the definition above.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Why ML loves convexity">
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Every local minimum is global</strong> — no saddles, no bad basins.</li>
          <li><strong className="text-white">Gradient descent converges</strong> from any starting point with a small enough step.</li>
          <li><strong className="text-white">Fast convergence rates</strong> — O(1/k) for smooth convex, O(1/k²) with acceleration, exponential with strong convexity.</li>
          <li><strong className="text-white">Duality</strong> — many convex problems have closed-form Lagrangian solutions (SVMs, LP).</li>
        </ul>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">ML model</th>
                <th className="px-4 py-3">Convex loss?</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Linear / ridge regression',     'Yes',       'Closed form + unique solution'],
                ['Logistic regression',           'Yes',       'Any solver converges to the same weights'],
                ['SVM (soft margin)',             'Yes',       'Global optimum with an off-the-shelf QP'],
                ['Lasso (L1)',                    'Yes (non-smooth)', 'Coordinate descent / proximal gradient'],
                ['Deep neural network',           'NO',        'Local minima, saddles, bad init — the drama of DL'],
                ['K-means',                       'NO',        'Depends heavily on initialisation'],
              ].map(([m, c, w]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Taylor series of e^x around 0">
          <p>Write the first four terms and estimate e^0.1.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>eˣ ≈ 1 + x + x²/2 + x³/6</div>
            <div className="mt-2">e^0.1 ≈ 1 + 0.1 + 0.005 + 0.000167 = 1.105167</div>
            <div>True e^0.1 ≈ 1.105171   →  error ≈ 4 × 10⁻⁶.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Numerical stability with log(1+x)">
          <p>
            Explain why <code>log(1 + x)</code> for very small x is more accurate than{' '}
            <code>log(1 + x)</code> computed directly.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Taylor: ln(1 + x) ≈ x − x²/2 + x³/3 − …</div>
            <div className="mt-1">For x = 1e−16, 1 + x in float64 rounds to 1 — log gives 0 (catastrophic).</div>
            <div>But log1p(x) uses the series directly → returns ~1e−16.</div>
            <div className="mt-2 text-slate-400">
              This is why every framework has <code>log1p</code>, <code>expm1</code>, and{' '}
              <code>softplus</code> as stable primitives.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Newton's method for √a">
          <p>Use Newton's method to solve x² − a = 0 and derive the classic Babylonian square-root iteration.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f(x) = x² − a,  f'(x) = 2x.</div>
            <div>Newton:  x ← x − f(x)/f'(x) = x − (x² − a)/(2x) = (x + a/x) / 2.</div>
            <div className="mt-2">Try a = 2, x₀ = 1:  x₁ = (1 + 2)/2 = 1.5</div>
            <div>x₂ = (1.5 + 2/1.5)/2 = 1.416666…</div>
            <div>x₃ = 1.414215…   (√2 to 5 dp in 3 steps)</div>
            <div className="mt-2 text-genai-400">Newton converges quadratically — the number of correct digits roughly doubles per step.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Show f(x) = x² is convex">
          <p>Two proofs, second derivative and the chord test.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f''(x) = 2 &gt; 0 everywhere ⇒ convex ✓.</div>
            <div className="mt-2">Chord test: f(tx + (1 − t)y) − t f(x) − (1 − t) f(y)</div>
            <div>    = (tx + (1 − t)y)² − t x² − (1 − t) y²</div>
            <div>    = − t(1 − t)(x − y)²   ≤ 0.</div>
            <div className="mt-1">So f(tx + (1 − t)y) ≤ t f(x) + (1 − t) f(y) ✓.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Logistic loss is convex (ML flavour)">
          <p>Show L(z) = ln(1 + e⁻ᶻ) is convex.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>L'(z) = −e⁻ᶻ / (1 + e⁻ᶻ) = −(1 − σ(z))</div>
            <div>L''(z) = σ(z)(1 − σ(z))   ∈ (0, 0.25]   ⇒  strictly positive ⇒ L is strictly convex.</div>
            <div className="mt-2 text-genai-400">
              This is why logistic regression has a unique global minimum — any solver converges to the same
              answer.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — A neural-net loss is NOT convex (ML flavour)">
          <p>
            f(w) = (w² − 1)² has no linear parameters, but it stands in for a small non-convex loss. Find
            all critical points and classify them.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f'(w) = 2 (w² − 1) · 2w = 4 w (w² − 1).</div>
            <div>Zero at w = −1, 0, +1.</div>
            <div className="mt-2">f''(w) = 4(3w² − 1).</div>
            <div>w = ±1 : f'' = 8 &gt; 0 → local minima  (both f = 0).</div>
            <div>w = 0  : f'' = −4 &lt; 0 → local maximum (f = 1).</div>
            <div className="mt-2 text-genai-400">
              Two equally good minima — which one you find depends on initialisation. This tiny function
              already illustrates why deep nets have symmetry and multiple basins.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — Taylor, Newton, and a convex vs non-convex demo">
        <Example
          title="One-file toolbox"
          output={`Taylor(e^x) around 0 to 4th order: 1 + x + x**2/2 + x**3/6 + x**4/24
e^0.1 estimate = 1.10517092
True e^0.1     = 1.1051709180756477
log(1 + 1e-16) NAIVE = 0.0
log1p(1e-16)        = 1e-16
Newton sqrt(2) iterations: [1.0, 1.5, 1.4166666666666665, 1.4142156862745097, 1.4142135623746899]
Logistic loss L''(z) at z=[-2, -1, 0, 1, 2] = [0.105 0.197 0.25  0.197 0.105]  (all > 0 → convex)
Non-convex minima found: [-1.0000, 1.0000] from starts [-2.0, 2.0]`}
        >{`import sympy as sp
import numpy as np

# ---- Taylor series ----
x = sp.symbols("x")
T = sp.series(sp.exp(x), x, 0, 5).removeO()
print("Taylor(e^x) around 0 to 4th order:", T)
print(f"e^0.1 estimate = {float(T.subs(x, 0.1)):.8f}")
print("True e^0.1     =", np.exp(0.1))

# ---- Stable log1p ----
print("log(1 + 1e-16) NAIVE =", np.log(1 + 1e-16))
print("log1p(1e-16)        =", np.log1p(1e-16))

# ---- Newton's method for sqrt ----
def newton_sqrt(a, x0=1.0, steps=4):
    xs = [x0]
    for _ in range(steps):
        xs.append((xs[-1] + a / xs[-1]) / 2)
    return xs
print("Newton sqrt(2) iterations:", newton_sqrt(2))

# ---- Convex vs non-convex ----
def sigma(z): return 1 / (1 + np.exp(-z))
zs = np.array([-2, -1, 0, 1, 2], float)
L_dd = sigma(zs) * (1 - sigma(zs))
print("Logistic loss L''(z) at z=[-2, -1, 0, 1, 2] =", np.round(L_dd, 3), " (all > 0 → convex)")

# non-convex: (w^2 - 1)^2 has two minima; gradient descent from different starts finds different ones
def f(w):  return (w**2 - 1)**2
def fp(w): return 4 * w * (w**2 - 1)

def gd(start, lr=0.05, steps=200):
    w = start
    for _ in range(steps):
        w -= lr * fp(w)
    return w

starts = [-2.0, 2.0]
found = [round(gd(s), 4) for s in starts]
print(f"Non-convex minima found: {found} from starts {starts}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Taylor series approximates a smooth function near a point with a polynomial: constant → tangent → parabola → higher-order details.',
          'First-order Taylor gives gradient descent (Δw = −η∇f); second-order gives Newton\'s method (Δw = −H⁻¹∇f).',
          'log1p, expm1, softplus, and log-sum-exp are Taylor-motivated tricks that keep numerical evaluation stable near 0 or ±∞.',
          'A function is convex if any chord lies above the graph — equivalently f\'\' ≥ 0 (1D) or Hessian PSD (multi-D). Every local minimum is global.',
          'Linear / logistic / ridge / lasso / SVM losses are convex — any solver converges to the same weights. Deep nets and K-means are not — initialisation and randomness matter.',
          'Non-convex does not mean unsolvable — SGD, momentum, restarts, and good inits routinely find great minima. But the guarantees are weaker.',
        ]}
      />
    </LessonArticle>
  )
}
