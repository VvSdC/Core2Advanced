import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChainRuleAndBackpropagation() {
  return (
    <LessonArticle>
      <Definition term="The chain rule">
        <p>
          When one function feeds another, their derivatives <strong className="text-white">multiply</strong>.
          If <code className="text-slate-200">y = f(u)</code> and <code className="text-slate-200">u = g(x)</code>,
          then:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>dy/dx = (dy/du) · (du/dx)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Read left-to-right: how y responds to u, times how u responds to x. Extend to any depth by
          multiplying more terms — this is what <strong className="text-white">backpropagation</strong> is
          doing at every layer of a neural network.
        </p>
      </Definition>

      <LessonSection title="Single-variable chain rule — the mechanic">
        <ContentStep number={1} title="Recipe">
          <ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-300">
            <li>Spot the outer function and the inner function.</li>
            <li>Differentiate the outer, leaving the inner alone.</li>
            <li>Multiply by the derivative of the inner.</li>
          </ol>
        </ContentStep>
        <ContentStep number={2} title="Worked micro-example">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>y = sin(3x² + 1)</div>
            <div className="mt-2">Outer: sin(·)      derivative: cos(·)</div>
            <div>Inner: 3x² + 1     derivative: 6x</div>
            <div className="mt-2">dy/dx = cos(3x² + 1) · 6x = 6x · cos(3x² + 1)</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Multivariable chain rule">
        <p className="text-slate-300">
          When the intermediate has several arguments (as it does in every neural net), sum over all
          paths from the output back to the variable you care about:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>If  L = f(u, v),  and  u = u(x),  v = v(x),  then</div>
          <div className="mt-2">dL/dx = (∂f/∂u)(du/dx) + (∂f/∂v)(dv/dx)</div>
        </div>
        <Callout variant="insight" title="This is the entire idea of backprop">
          Every neuron output contributes to the loss through some path. The total derivative is the sum of
          each path&rsquo;s product of local derivatives. Backprop computes that sum efficiently by walking
          the computation graph backwards — no path is ever recomputed.
        </Callout>
      </LessonSection>

      <LessonSection title="The forward pass and the backward pass">
        <p className="text-slate-300">
          Every framework (PyTorch, JAX, TensorFlow) is doing exactly this bookkeeping for you:
        </p>
        <ContentStep number={1} title="Forward — evaluate the composition">
          <p>Compute every intermediate value and cache it. These caches are what backward needs.</p>
        </ContentStep>
        <ContentStep number={2} title="Backward — apply the chain rule right-to-left">
          <p>
            Start with dL/dL = 1 at the output. For each operation in reverse order, multiply the incoming
            derivative by the local Jacobian, then pass the result to the next operation. Every parameter
            receives its full derivative once — never twice.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why it is so fast">
          <p className="text-slate-300">
            One forward pass builds all the caches; one backward pass computes every parameter&rsquo;s
            derivative. Total cost ≈ 2–3× the forward pass, no matter how many parameters. Finite differences
            would be O(number of parameters) — millions of times slower.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A tiny hand-worked neural net">
        <p className="text-slate-300">
          One neuron: <code className="text-slate-200">z = w x + b</code>, <code>a = σ(z)</code>,{' '}
          <code>L = (a − y)²</code>. Compute ∂L/∂w and ∂L/∂b at{' '}
          <code>x = 2, y = 0, w = 1, b = 0</code>.
        </p>
        <ContentStep number={1} title="Forward — cache every intermediate">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>z = 1·2 + 0 = 2</div>
            <div>a = σ(2) = 1 / (1 + e⁻²) ≈ 0.8808</div>
            <div>L = (0.8808 − 0)² = 0.7758</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Backward — multiply local derivatives">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>dL/da = 2 (a − y)             = 2 · 0.8808   = 1.7616</div>
            <div>da/dz = σ(z) (1 − σ(z))       = 0.8808 · 0.1192 ≈ 0.1050</div>
            <div>dz/dw = x                      = 2</div>
            <div>dz/db = 1</div>
            <div className="mt-2">Chain them:</div>
            <div>∂L/∂w = (dL/da) · (da/dz) · (dz/dw) = 1.7616 · 0.1050 · 2 ≈ 0.3700</div>
            <div>∂L/∂b = (dL/da) · (da/dz) · (dz/db) = 1.7616 · 0.1050 · 1 ≈ 0.1850</div>
            <div className="mt-2 text-genai-400">Update: w ← w − η · 0.37;  b ← b − η · 0.185</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Two-layer chain">
          <p>Differentiate y = (2x + 1)⁵.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Outer: u⁵ → 5u⁴</div>
            <div>Inner: 2x + 1 → 2</div>
            <div className="mt-2">dy/dx = 5 (2x + 1)⁴ · 2 = 10 (2x + 1)⁴</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Three-layer chain">
          <p>Differentiate y = sin(e^(x²)).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Outer: sin(·)   → cos(·)</div>
            <div>Middle: e^(·)   → e^(·)</div>
            <div>Inner: x²       → 2x</div>
            <div className="mt-2">dy/dx = cos(e^(x²)) · e^(x²) · 2x</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Logistic regression gradient (ML flavour)">
          <p>
            L = −(y ln p + (1 − y) ln(1 − p)) with p = σ(z), z = wx + b. Show ∂L/∂w = (p − y) x.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>dL/dp = (p − y) / ( p (1 − p) )       (from previous lesson)</div>
            <div>dp/dz = p (1 − p)                      (sigmoid derivative)</div>
            <div>dz/dw = x</div>
            <div className="mt-2">dL/dw = [(p − y) / (p (1 − p))] · [p (1 − p)] · x</div>
            <div>       = (p − y) · x</div>
            <div className="mt-2 text-genai-400">
              The messy denominator cancels perfectly. This is why logistic regression&rsquo;s update rule is
              &ldquo;prediction minus target times feature&rdquo; — the same shape as linear regression.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Softmax + cross-entropy gradient (ML flavour)">
          <p>
            For a K-class classifier with softmax outputs pᵢ = e^(zᵢ) / Σⱼ e^(zⱼ) and one-hot target y, the
            cross-entropy loss L = −Σᵢ yᵢ ln pᵢ has the beautiful gradient dL/dzᵢ = pᵢ − yᵢ. Sketch the
            proof.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>L = − Σᵢ yᵢ (zᵢ − ln Σⱼ e^(zⱼ))</div>
            <div>Take ∂L/∂zₖ using the fact that ∂/∂zₖ ln Σⱼ e^(zⱼ) = e^(zₖ) / Σⱼ e^(zⱼ) = pₖ:</div>
            <div className="mt-1">∂L/∂zₖ = − yₖ + (Σᵢ yᵢ) pₖ</div>
            <div>Since y is one-hot, Σᵢ yᵢ = 1:</div>
            <div className="mt-1">∂L/∂zₖ = pₖ − yₖ.</div>
            <div className="mt-2 text-genai-400">
              This one identity is why softmax + cross-entropy is the default classification head — the
              gradient is trivially predicted-minus-true.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Multivariable chain">
          <p>
            L = u² + v² with u = x + y and v = x − y. Compute ∂L/∂x using the multivariable chain rule.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>∂L/∂u = 2u;   ∂L/∂v = 2v</div>
            <div>∂u/∂x = 1;    ∂v/∂x = 1</div>
            <div className="mt-2">∂L/∂x = 2u · 1 + 2v · 1 = 2 (x + y) + 2 (x − y) = 4x.</div>
            <div className="mt-1 text-slate-400">Sanity check: L = u² + v² = 2x² + 2y²; ∂/∂x gives 4x ✓.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Diagnose exploding / vanishing gradients">
          <p>
            A deep net with sigmoid activations has ∂aₖ/∂zₖ ≤ 0.25 at every layer. What happens to the
            gradient magnitude after 30 layers?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>By the chain rule, the gradient at layer 0 multiplies 30 &ldquo;≤ 0.25&rdquo; factors.</div>
            <div className="mt-1">(0.25)³⁰ ≈ 8.7 × 10⁻¹⁹  →  effectively zero.</div>
            <div className="mt-2 text-red-400">Vanishing gradient. First layers get essentially no learning signal.</div>
            <div className="mt-1 text-slate-400">
              Fixes: ReLU (derivative = 1 for x &gt; 0), residual connections, batch normalisation, or a
              careful init that keeps the product close to 1 per layer.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — chain rule by hand and by autodiff">
        <Example
          title="Manual backprop vs PyTorch autograd — same numbers"
          output={`Forward:
  z = 2.0, a = 0.8807970779778823, L = 0.7758030421058931
Manual backward:
  dL/dw = 0.3701097889385687
  dL/db = 0.18505489446928433
PyTorch autograd:
  dL/dw = 0.3701097369194031
  dL/db = 0.18505486845970154`}
        >{`import math
import torch

# ---- MANUAL: forward + chain-rule backward ----
x, y = 2.0, 0.0
w, b = 1.0, 0.0

# forward — cache everything
z = w * x + b
a = 1 / (1 + math.exp(-z))
L = (a - y) ** 2
print(f"Forward:\\n  z = {z}, a = {a}, L = {L}")

# backward — chain the local derivatives
dL_da = 2 * (a - y)
da_dz = a * (1 - a)
dz_dw = x
dz_db = 1

dL_dw = dL_da * da_dz * dz_dw
dL_db = dL_da * da_dz * dz_db
print(f"Manual backward:\\n  dL/dw = {dL_dw}\\n  dL/db = {dL_db}")

# ---- PYTORCH: same math, one line of backward() ----
w_t = torch.tensor([1.0], requires_grad=True)
b_t = torch.tensor([0.0], requires_grad=True)
x_t = torch.tensor([2.0])
y_t = torch.tensor([0.0])

z_t = w_t * x_t + b_t
a_t = torch.sigmoid(z_t)
L_t = (a_t - y_t) ** 2
L_t.backward()

print(f"PyTorch autograd:\\n  dL/dw = {w_t.grad.item()}\\n  dL/db = {b_t.grad.item()}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Chain rule: composed functions multiply their derivatives — dy/dx = (dy/du)(du/dx). Extend to any depth by multiplying more factors.',
          'Multivariable form: sum contributions across all paths — this IS backpropagation.',
          'Backprop is one forward pass to cache intermediates, one backward pass right-to-left applying the chain rule; cost ≈ 2–3× the forward pass regardless of parameter count.',
          'The (p − y) shape of gradients for logistic regression and softmax + cross-entropy comes from a beautiful cancellation between the sigmoid/softmax derivative and the log-loss derivative.',
          'Chained small derivatives cause vanishing gradients (deep sigmoids → 0.25³⁰ ≈ 0). Fixes: ReLU, residuals, batchnorm, careful init.',
          'Autograd libraries (PyTorch, JAX) build a computation graph and apply exactly these chain-rule steps automatically — you almost never derive by hand in production.',
        ]}
      />
    </LessonArticle>
  )
}
