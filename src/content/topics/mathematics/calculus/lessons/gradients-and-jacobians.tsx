import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GradientsAndJacobians() {
  return (
    <LessonArticle>
      <Definition term="Gradient, Jacobian, and directional derivative">
        <p>
          Three closely related objects, one big idea: <em>how does a function respond to a small change in
          its inputs?</em>
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Gradient ∇f</strong> — for a scalar function f : ℝⁿ → ℝ, a
            column vector of all n partial derivatives.
          </li>
          <li>
            <strong className="text-white">Jacobian J(f)</strong> — for a vector function f : ℝⁿ → ℝᵐ, an
            m × n matrix collecting all m·n partials. Row i is the gradient of the i-th output.
          </li>
          <li>
            <strong className="text-white">Directional derivative</strong> — the slope of f in an arbitrary
            unit direction u. Turns out to just be ∇f · u.
          </li>
        </ul>
      </Definition>

      <LessonSection title="Gradient — the pointer for scalar-valued functions">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>f : ℝⁿ → ℝ         ∇f = ( ∂f/∂x₁,  ∂f/∂x₂,  …,  ∂f/∂xₙ )</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Direction</strong> — ∇f points where f grows fastest.</li>
          <li><strong className="text-white">Magnitude</strong> — ‖∇f‖ is that maximum rate.</li>
          <li><strong className="text-white">Level curves</strong> — ∇f is perpendicular to the contour f = c passing through the point.</li>
          <li><strong className="text-white">Gradient descent</strong> — walk in direction <em>−∇f</em> with a small step.</li>
        </ul>
        <Callout variant="insight" title="Why steepest ascent">
          Directional derivative in direction u (unit vector) is ∇f · u = ‖∇f‖ cos θ. It is largest when
          θ = 0, i.e. when u points along ∇f. That&rsquo;s the whole proof.
        </Callout>
      </LessonSection>

      <LessonSection title="Jacobian — the pointer for vector-valued functions">
        <p className="text-slate-300">
          When the function returns a vector (a neural-net layer, a coordinate transformation, an activation
          on a batch), each output component has its own gradient. Stack them as rows:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>f : ℝⁿ → ℝᵐ,     f(x) = ( f₁(x), …, fₘ(x) )</div>
          <div className="mt-2">J(f) = ⎡ ∂f₁/∂x₁  …  ∂f₁/∂xₙ ⎤</div>
          <div>       ⎢    ⋮      ⋱     ⋮   ⎥</div>
          <div>       ⎣ ∂fₘ/∂x₁  …  ∂fₘ/∂xₙ ⎦</div>
        </div>
        <p className="mt-3 text-slate-300">
          When m = 1 the Jacobian is a row vector — the transpose of the gradient. When m = n it is square,
          and its determinant is the local volume-scaling factor (used in change-of-variables for probability
          densities — see the normalising-flows story in generative models).
        </p>
      </LessonSection>

      <LessonSection title="Chain rule in Jacobian form">
        <p className="text-slate-300">
          For composed vector functions <code className="text-slate-200">z = g(f(x))</code>:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>J(z) = J(g)|_{`{f(x)}`} · J(f)|_x</div>
        </div>
        <p className="mt-3 text-slate-300">
          Just matrix multiplication. Backprop is: multiply Jacobians in the correct order and cache the
          intermediates. In practice frameworks never build the full Jacobian — they compute{' '}
          <em>Jacobian-vector products</em> (forward mode) or <em>vector-Jacobian products</em> (reverse
          mode, the fast one for scalar losses).
        </p>
      </LessonSection>

      <LessonSection title="Common Jacobians in ML">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Function</th>
                <th className="px-4 py-3">Jacobian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['y = A x  (linear layer)',                                'J = A'],
                ['y = x  ⊙  m  (element-wise multiply / mask)',            'J = diag(m)'],
                ['y = σ(z)  (element-wise activation)',                    'J = diag(σ\'(z))'],
                ['p = softmax(z)',                                          'J = diag(p) − p pᵀ'],
                ['y = x / ‖x‖  (L2 normalise)',                            '(I − ŷ ŷᵀ) / ‖x‖  where ŷ = x/‖x‖'],
                ['y = flatten / reshape',                                   'permutation matrix (data reorder)'],
              ].map(([f, j]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-mono text-white">{f}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{j}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Gradient of a quadratic">
          <p>f(x, y, z) = 2x² + 3y² + z² − xy + 4y. Compute ∇f at (1, 2, −1).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂f/∂x = 4x − y     = 4·1 − 2   = 2</div>
            <div>∂f/∂y = 6y − x + 4 = 6·2 − 1 + 4 = 15</div>
            <div>∂f/∂z = 2z         = 2·(−1)   = −2</div>
            <div className="mt-2">∇f(1, 2, −1) = (2, 15, −2)</div>
            <div className="mt-1 text-slate-400">‖∇f‖ = √(4 + 225 + 4) = √233 ≈ 15.26 → f is climbing fast, mostly in the y direction.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Directional derivative">
          <p>For the same f, what is the slope at (1, 2, −1) in the direction u = (1, 2, 2)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Normalise:  ‖u‖ = √(1 + 4 + 4) = 3  →  û = (1/3, 2/3, 2/3)</div>
            <div className="mt-2">D_û f = ∇f · û = 2·(1/3) + 15·(2/3) + (−2)·(2/3)</div>
            <div>       = 2/3 + 30/3 − 4/3 = 28/3 ≈ 9.33</div>
            <div className="mt-1 text-slate-400">Positive and large — you are heading uphill along u.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Jacobian of a linear layer (ML flavour)">
          <p>y = Wx + b where W is 3×2. Compute J = ∂y/∂x and ∂y/∂b.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂yᵢ/∂xⱼ = Wᵢⱼ  →  J(y w.r.t. x) = W  (shape 3×2).</div>
            <div>∂yᵢ/∂bₖ = δᵢₖ  →  J(y w.r.t. b) = I₃  (identity).</div>
            <div className="mt-2 text-slate-400">
              This is why the &ldquo;send gradient back through a linear layer&rdquo; step is a single{' '}
              <code>gradient @ W.T</code> — the Jacobian is just W.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Softmax Jacobian (ML flavour)">
          <p>Verify J(softmax)_{`{ij}`} = pᵢ (δᵢⱼ − pⱼ) at z = (1, 2, 3).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>p = softmax(1, 2, 3) ≈ (0.0900, 0.2447, 0.6652)</div>
            <div className="mt-2">Diagonal:   J_ii = p_i (1 − p_i)</div>
            <div>Off-diag:   J_ij = −p_i p_j</div>
            <div className="mt-2">In matrix form: J = diag(p) − p pᵀ.</div>
            <div className="mt-2">J ≈ ⎡  0.0819  −0.0220  −0.0598 ⎤</div>
            <div>    ⎢ −0.0220   0.1848  −0.1628 ⎥</div>
            <div>    ⎣ −0.0598  −0.1628   0.2226 ⎦</div>
            <div className="mt-2 text-slate-400">
              Row sums are zero — softmax preserves probability, so a uniform increase in every zᵢ leaves p
              unchanged.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Steepest-descent step (ML flavour)">
          <p>
            J(w) = ½ ‖X w − y‖². Show ∇_w J = Xᵀ (X w − y) and use it to write one gradient-descent step.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Let r = X w − y (the residual).  J = ½ rᵀ r.</div>
            <div>dJ/dr = r;  dr/dw = X → J&rsquo;s Jacobian w.r.t. w is Xᵀ (transpose because r is a column).</div>
            <div className="mt-2">∇_w J = Xᵀ r = Xᵀ (X w − y).</div>
            <div className="mt-2">Update:  w ← w − η · Xᵀ (X w − y).</div>
            <div className="mt-1 text-slate-400">Exactly the batch-gradient-descent rule from the SLR track.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Volume change under a Jacobian (probability flavour)">
          <p>
            For a 2D change of variables x = 2u, y = 3v, what is |det J|? What does it imply for a
            probability density p_X(x, y) transported to p_U(u, v)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>J = ⎡ 2  0 ⎤   → det J = 6.</div>
            <div>    ⎣ 0  3 ⎦</div>
            <div className="mt-2">p_U(u, v) = p_X(2u, 3v) · |det J| = 6 · p_X(2u, 3v).</div>
            <div className="mt-1 text-slate-400">
              This is the change-of-variables formula for densities — the basis of normalising flows and
              why we need the log-det-Jacobian in flow-based generative models.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — gradients and Jacobians">
        <Example
          title="Symbolic Jacobian and PyTorch autograd"
          output={`Symbolic gradient at (1, 2, -1): [2, 15, -2]
Directional derivative along (1,2,2)/3: 28/3 ≈ 9.333
Softmax Jacobian at (1, 2, 3):
[[ 0.0819 -0.022  -0.0598]
 [-0.022   0.1848 -0.1628]
 [-0.0598 -0.1628  0.2226]]
Row sums (should be ~0): [-0. -0.  0.]`}
        >{`import sympy as sp
import numpy as np
import torch

# ---- Gradient ----
x, y, z = sp.symbols("x y z")
f = 2*x**2 + 3*y**2 + z**2 - x*y + 4*y
grad = [sp.diff(f, v).subs({x: 1, y: 2, z: -1}) for v in (x, y, z)]
print("Symbolic gradient at (1, 2, -1):", grad)

u_hat = sp.Rational(1, 3), sp.Rational(2, 3), sp.Rational(2, 3)
d_dir = sum(g * uu for g, uu in zip(grad, u_hat))
print("Directional derivative along (1,2,2)/3:", d_dir, f"≈ {float(d_dir):.3f}")

# ---- Softmax Jacobian ----
z_arr = np.array([1., 2., 3.])
p = np.exp(z_arr) / np.exp(z_arr).sum()
J = np.diag(p) - np.outer(p, p)
print("Softmax Jacobian at (1, 2, 3):")
print(np.round(J, 4))
print("Row sums (should be ~0):", np.round(J.sum(axis=1), 4))

# ---- Autograd Jacobian ----
zt = torch.tensor([1., 2., 3.], requires_grad=True)
J_t = torch.autograd.functional.jacobian(lambda z: torch.softmax(z, dim=0), zt)
assert np.allclose(J_t.numpy(), J, atol=1e-6)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Gradient = vector of all partials of a scalar function; points in the direction of steepest ascent, magnitude ‖∇f‖ is the max slope.',
          'Directional derivative in direction u (unit) = ∇f · u. That is the proof of "gradient = steepest".',
          'Jacobian = m × n matrix of partials for a vector-valued function. Row i is the gradient of output i. Chain rule = matrix multiplication of Jacobians.',
          'Memorise the ML Jacobians: Wx→W, element-wise activation→diag(σ\'), softmax→diag(p)−ppᵀ, L2-normalise→(I − ŷŷᵀ)/‖x‖.',
          'For steepest descent on ½‖Xw−y‖² the gradient is Xᵀ(Xw − y) — exactly the SLR update.',
          '|det J| is the local volume factor — used in change-of-variables and normalising flows. In practice, autograd computes Jacobian-vector products, not full Jacobians.',
        ]}
      />
    </LessonArticle>
  )
}
