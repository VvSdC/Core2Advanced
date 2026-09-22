import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PartialDerivatives() {
  return (
    <LessonArticle>
      <Definition term="Partial derivative">
        <p>
          Most ML loss functions depend on many parameters at once — a regression cost <em>J(θ₀, θ₁)</em>, a
          neural network with millions of weights. A <strong className="text-white">partial derivative</strong>{' '}
          measures how the function changes when you <strong className="text-white">move just one variable</strong>{' '}
          and freeze all the others.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>∂f/∂x  is the derivative of f w.r.t. x,  treating every other variable as a constant.</div>
        </div>
      </Definition>

      <LessonSection title="The mental move">
        <p className="text-slate-300">
          Reading <em>∂/∂x</em> means: pretend every other letter is a number. Now do ordinary
          differentiation. This one instruction is the entire rulebook — every rule from the previous
          lesson still applies, just with everything except x treated as a constant.
        </p>
        <Callout variant="beginner" title="One quick example">
          <div className="mt-1 font-mono">
            f(x, y) = 3x²y + y³
          </div>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            <li>∂f/∂x: y is a constant → d/dx (3x² · y) + d/dx (y³) = 6x y + 0 = 6xy.</li>
            <li>∂f/∂y: x is a constant → d/dy (3x² · y) + d/dy (y³) = 3x² + 3y².</li>
          </ul>
        </Callout>
      </LessonSection>

      <LessonSection title="Notation and higher-order partials">
        <p className="text-slate-300">
          Common ways to write the same partial:
        </p>
        <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>∂f/∂x     f_x     fₓ     ∂ₓf</div>
          <div className="mt-2">Second partials:  ∂²f/∂x²,  ∂²f/(∂x ∂y),  fₓₓ,  f_{`{xy}`}</div>
        </div>
        <Callout variant="insight" title="Clairaut's theorem — order does not matter">
          For any &ldquo;well-behaved&rdquo; function (all real ML loss functions),{' '}
          <code className="text-slate-200">∂²f/(∂x ∂y) = ∂²f/(∂y ∂x)</code>. This is why the Hessian matrix
          is always symmetric.
        </Callout>
      </LessonSection>

      <LessonSection title="The gradient — all partials packed into one vector">
        <p className="text-slate-300">
          Pack every partial derivative into a column vector and you get the{' '}
          <strong className="text-white">gradient</strong> ∇f:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>∇f(x, y, z) = ( ∂f/∂x,  ∂f/∂y,  ∂f/∂z )</div>
        </div>
        <p className="mt-3 text-slate-300">
          Facts you will use every day:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Direction</strong> — ∇f points in the direction of steepest ascent.</li>
          <li><strong className="text-white">Magnitude</strong> — ‖∇f‖ is how steep that ascent is.</li>
          <li><strong className="text-white">Gradient descent</strong> — step in the direction of <em>−∇f</em> to decrease.</li>
          <li><strong className="text-white">Zero gradient</strong> — the necessary (not sufficient) condition for a minimum or maximum.</li>
        </ul>
      </LessonSection>

      <LessonSection title="The Hessian — the matrix of second partials">
        <p className="text-slate-300">
          The <strong className="text-white">Hessian</strong> H(f) collects every second partial derivative
          into a symmetric matrix. It measures curvature — how the gradient itself changes as you move.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H(f) = ⎡ ∂²f/∂x²      ∂²f/(∂x ∂y) ⎤</div>
          <div>       ⎣ ∂²f/(∂y ∂x)  ∂²f/∂y²     ⎦</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">∇f = 0 and H is positive-definite</strong> → local minimum (bowl in every direction).</li>
          <li><strong className="text-white">∇f = 0 and H is negative-definite</strong> → local maximum.</li>
          <li><strong className="text-white">∇f = 0 and H has mixed-sign eigenvalues</strong> → saddle point (up one way, down another).</li>
        </ul>
        <Callout variant="tip" title="Newton's method peeks at the Hessian">
          Second-order methods (Newton, Quasi-Newton, natural gradient) use the Hessian to jump straight to
          the minimum rather than taking small gradient steps. Plain SGD ignores it entirely.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Basic partials">
          <p>f(x, y) = x²y + xy² + 3y. Find ∂f/∂x and ∂f/∂y.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂f/∂x: treat y as constant  →  2xy + y² + 0 = 2xy + y²</div>
            <div>∂f/∂y: treat x as constant  →  x² + 2xy + 3</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Gradient at a point">
          <p>f(x, y) = x² + 3y² − xy. Compute ∇f at (1, 2).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂f/∂x = 2x − y   →  2·1 − 2 = 0</div>
            <div>∂f/∂y = 6y − x   →  6·2 − 1 = 11</div>
            <div className="mt-2">∇f(1, 2) = (0, 11)</div>
            <div className="mt-1 text-slate-400">At (1, 2), f is flat in x but climbing fast in y.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Hessian and classification of a critical point">
          <p>Find and classify the critical points of f(x, y) = x² + y² − 2x − 4y + 6.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∇f = (2x − 2, 2y − 4).  Set to 0: x = 1, y = 2.</div>
            <div className="mt-2">H = ⎡ 2  0 ⎤   (constant, both eigenvalues 2 &gt; 0)</div>
            <div>    ⎣ 0  2 ⎦</div>
            <div className="mt-2 text-genai-400">Local minimum at (1, 2); f(1, 2) = 1 + 4 − 2 − 8 + 6 = 1.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Saddle point">
          <p>Find and classify the critical point of f(x, y) = x² − y².</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∇f = (2x, −2y). Zero at (0, 0).</div>
            <div className="mt-2">H = ⎡ 2   0 ⎤  eigenvalues +2 and −2 (mixed sign).</div>
            <div>    ⎣ 0  −2 ⎦</div>
            <div className="mt-2 text-genai-400">
              (0, 0) is a saddle — minimum along x, maximum along y. Very common in deep-net loss surfaces.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — SLR cost function partials (ML flavour)">
          <p>
            J(θ₀, θ₁) = (1/(2m)) Σᵢ (θ₀ + θ₁ xᵢ − yᵢ)². Derive ∂J/∂θ₀ and ∂J/∂θ₁.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Let  eᵢ = θ₀ + θ₁ xᵢ − yᵢ.</div>
            <div className="mt-2">∂J/∂θ₀ = (1/m) Σᵢ eᵢ · 1   = (1/m) Σᵢ (θ₀ + θ₁ xᵢ − yᵢ)</div>
            <div>∂J/∂θ₁ = (1/m) Σᵢ eᵢ · xᵢ  = (1/m) Σᵢ xᵢ (θ₀ + θ₁ xᵢ − yᵢ)</div>
            <div className="mt-2 text-slate-400">
              These are exactly the two gradient-descent update rules used in the SLR track — same math,
              tighter language.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — MLE for the mean of a Gaussian (ML flavour)">
          <p>
            Log-likelihood for n samples: L(μ) = −(1/(2σ²)) Σᵢ (xᵢ − μ)². Show ∂L/∂μ = 0 gives μ̂ = x̄.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂L/∂μ = (1/σ²) Σᵢ (xᵢ − μ)</div>
            <div className="mt-1">Set to zero: Σᵢ (xᵢ − μ) = 0 → μ̂ = (1/n) Σᵢ xᵢ = x̄.</div>
            <div className="mt-2 text-genai-400">The sample mean is the maximum-likelihood estimator of a Gaussian&rsquo;s μ.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — symbolic and NumPy gradients">
        <Example
          title="Compute partials, gradient, and Hessian"
          output={`∂f/∂x  = 2*x - y
∂f/∂y  = -x + 6*y
Gradient at (1, 2)  = (0, 11)
Hessian at (1, 2)   =
[[ 2 -1]
 [-1  6]]
Numeric ∇ at (1, 2) ≈ (0.0000, 11.0000)`}
        >{`import sympy as sp
import numpy as np

x, y = sp.symbols("x y")
f = x**2 + 3*y**2 - x*y

fx = sp.diff(f, x)
fy = sp.diff(f, y)
print("∂f/∂x  =", fx)
print("∂f/∂y  =", fy)

grad_at = (fx.subs({x: 1, y: 2}), fy.subs({x: 1, y: 2}))
print("Gradient at (1, 2)  =", grad_at)

H = sp.hessian(f, (x, y))
print("Hessian at (1, 2)   =")
print(np.array(H.subs({x: 1, y: 2})).astype(int))

# ---- numeric gradient (central differences) ----
def f_num(p): return p[0]**2 + 3*p[1]**2 - p[0]*p[1]
def num_grad(f, p, h=1e-5):
    p = np.asarray(p, float)
    g = np.zeros_like(p)
    for i in range(len(p)):
        e = np.zeros_like(p); e[i] = h
        g[i] = (f(p + e) - f(p - e)) / (2 * h)
    return g

print(f"Numeric ∇ at (1, 2) ≈ ({num_grad(f_num, [1, 2])[0]:.4f}, {num_grad(f_num, [1, 2])[1]:.4f})")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A partial derivative freezes every variable except one and differentiates normally — everything from the derivative-rules lesson still applies.',
          'The gradient ∇f is the vector of all partials — it points in the direction of steepest ascent; gradient descent walks −∇f.',
          'Clairaut\'s theorem: for well-behaved functions ∂²f/(∂x ∂y) = ∂²f/(∂y ∂x). That is why the Hessian is symmetric.',
          'The Hessian H(f) collects all second partials. At a critical point: positive-definite H = min, negative-definite = max, mixed-sign = saddle.',
          'The SLR cost function\'s two gradient-descent updates are just its two partials — same for logistic regression and every deep-learning loss.',
          'Use SymPy for symbolic derivations, autodiff (PyTorch / JAX) for training, and central-difference numeric gradients only as a debugging check.',
        ]}
      />
    </LessonArticle>
  )
}
