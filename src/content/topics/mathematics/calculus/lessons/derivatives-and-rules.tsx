import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DerivativesAndRules() {
  return (
    <LessonArticle>
      <Definition term="Derivative">
        <p>
          The derivative of a function f at x is the <strong className="text-white">instantaneous rate of
          change</strong> — the slope of the tangent line, or the &ldquo;rise-over-run&rdquo; in the limit as
          the run shrinks to zero.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>f'(x) = lim  ( f(x + h) − f(x) ) / h</div>
          <div>       h→0</div>
        </div>
        <p className="mt-3 text-slate-300">
          Reading: pick a tiny step h, see how much f jumps, divide by h, then let h go to 0. The result is
          how fast f is changing at that exact x. Positive slope = increasing, negative slope = decreasing,
          zero slope = flat.
        </p>
      </Definition>

      <LessonSection title="Why derivatives are the beating heart of ML">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Gradient descent</strong> — the derivative tells you which way to step to decrease the loss.</li>
          <li><strong className="text-white">Backpropagation</strong> — chain-rule multiplication of derivatives through every layer.</li>
          <li><strong className="text-white">Newton&rsquo;s method / Adam / RMSProp</strong> — all use derivatives (and their derivatives) to move faster.</li>
          <li><strong className="text-white">Activation choice</strong> — ReLU vs sigmoid vs tanh differ in the shape of their derivative.</li>
        </ul>
      </LessonSection>

      <LessonSection title="The rules — memorise these six">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Rule</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Constant',       'd/dx c = 0',                          'd/dx 7 = 0'],
                ['Power',          'd/dx xⁿ = n xⁿ⁻¹',                    'd/dx x³ = 3x²'],
                ['Sum',            '(f + g)\' = f\' + g\'',                '(x² + 3x)\' = 2x + 3'],
                ['Constant multiplier', '(c · f)\' = c · f\'',             '(5x²)\' = 10x'],
                ['Product',        '(f · g)\' = f\' g + f g\'',            '(x · eˣ)\' = eˣ + x eˣ'],
                ['Quotient',       '(f / g)\' = (f\' g − f g\') / g²',     '(x / (1 + x))\' = 1 / (1 + x)²'],
              ].map(([n, f, ex]) => (
                <tr key={n}>
                  <td className="px-4 py-3 font-semibold text-white">{n}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{f}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Derivatives of the ML zoo">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Function</th>
                <th className="px-4 py-3">Derivative</th>
                <th className="px-4 py-3">Why we care</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['eˣ',            'eˣ',                                     'Softmax, log-sum-exp'],
                ['aˣ',            'aˣ ln(a)',                               'Rare, but exam-relevant'],
                ['ln(x)',         '1/x',                                     'Cross-entropy loss'],
                ['sin x',         'cos x',                                   'Positional encodings'],
                ['cos x',         '−sin x',                                  'Same'],
                ['σ(x) = 1/(1+e⁻ˣ)', 'σ(x) · (1 − σ(x))',                   'Logistic regression, gates'],
                ['tanh(x)',       '1 − tanh²(x)',                            'Old-school RNNs'],
                ['ReLU(x)',       '1 if x > 0, 0 if x < 0, undefined at 0',  'Deep nets — cheap and works'],
                ['softplus(x)',   'σ(x)',                                    'Smooth ReLU, GLU cousins'],
              ].map(([f, d, w]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-mono text-white">{f}</td>
                  <td className="px-4 py-3 font-mono">{d}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Why σ' = σ(1 − σ) is a big deal">
          Once you compute σ(x) for the forward pass, its derivative is nearly free — no extra exponentials.
          Same trick for softmax: the Jacobian only needs the outputs, not the logits again. This is what
          makes backprop cheap.
        </Callout>
      </LessonSection>

      <LessonSection title="Higher-order derivatives">
        <p className="text-slate-300">
          f' is a function too, so differentiate it and you get f'' (the second derivative). f'' tells you
          about <strong className="text-white">curvature</strong>: positive = curves upward (bowl), negative
          = curves downward (dome). Zero on its own means nothing — check the sign around it.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>f'(x) = 0 and f''(x) &gt; 0 → local minimum.</li>
          <li>f'(x) = 0 and f''(x) &lt; 0 → local maximum.</li>
          <li>f'(x) = 0 and f''(x) = 0 → inconclusive (saddle, inflection, or higher-order minimum).</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Power + sum + constants">
          <p>Differentiate f(x) = 3x⁴ − 2x³ + 5x − 7.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f'(x) = 12x³ − 6x² + 5</div>
            <div className="mt-1">The constant −7 disappears; each power drops by 1 and multiplies by its old exponent.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Product and quotient combined">
          <p>Differentiate g(x) = x eˣ / (1 + x).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Numerator N = x eˣ.  N' = eˣ + x eˣ = eˣ (1 + x).</div>
            <div>Denominator D = 1 + x.  D' = 1.</div>
            <div className="mt-2">g'(x) = ( N' D − N D' ) / D²</div>
            <div>      = ( eˣ (1 + x)² − x eˣ ) / (1 + x)²</div>
            <div>      = eˣ ( (1 + x)² − x ) / (1 + x)²</div>
            <div>      = eˣ (1 + x + x²) / (1 + x)²</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Sigmoid derivative (ML flavour)">
          <p>Prove σ'(x) = σ(x)(1 − σ(x)) where σ(x) = 1/(1 + e⁻ˣ).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Write σ(x) = (1 + e⁻ˣ)⁻¹. Use the chain rule (comes next lesson too):</div>
            <div className="mt-1">σ'(x) = − (1 + e⁻ˣ)⁻² · (−e⁻ˣ) = e⁻ˣ / (1 + e⁻ˣ)²</div>
            <div className="mt-2">Now split:  e⁻ˣ / (1 + e⁻ˣ)² = (1/(1 + e⁻ˣ)) · (e⁻ˣ/(1 + e⁻ˣ))</div>
            <div>                                     = σ(x) · (1 − σ(x)) ✓</div>
            <div className="mt-2 text-slate-400">
              Notice: 1 − σ(x) = 1 − 1/(1 + e⁻ˣ) = e⁻ˣ / (1 + e⁻ˣ).
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Minimum of a parabola">
          <p>Find the minimum of J(θ) = 2θ² − 8θ + 3 using calculus.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>J'(θ) = 4θ − 8. Set to zero: θ* = 2.</div>
            <div>J''(θ) = 4 &gt; 0 → confirmed minimum.</div>
            <div>J(2) = 8 − 16 + 3 = −5.</div>
            <div className="mt-2 text-genai-400">Minimum at θ = 2, value −5.</div>
            <div className="mt-1 text-slate-400">
              This is exactly how the OLS closed form (from SLR) is derived — set the derivative to zero.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Log-loss derivative (ML flavour)">
          <p>
            One data point&rsquo;s binary cross-entropy is L(p) = −(y ln p + (1 − y) ln(1 − p)). What is
            dL/dp?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>dL/dp = −( y/p − (1 − y)/(1 − p) )</div>
            <div>      = (p − y) / ( p (1 − p) )</div>
            <div className="mt-2 text-slate-400">
              The (p − y) factor is why logistic regression&rsquo;s gradient looks like a linear
              regression&rsquo;s: the messy denominator cancels with the σ' = σ(1 − σ) from the sigmoid
              — see the chain-rule lesson.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — When derivatives don't exist">
          <p>Where is f(x) = |x| non-differentiable?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>At x = 0: left slope = −1, right slope = +1. Mismatch → no derivative.</div>
            <div className="mt-1 text-slate-400">
              Same story with ReLU at 0. Frameworks pick a &ldquo;subgradient&rdquo; (often 0 for x = 0) and
              move on. In practice this never matters — real logits are rarely exactly 0.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — symbolic and numerical differentiation">
        <Example
          title="Two ways to differentiate"
          output={`Symbolic f' = 12*x**3 - 6*x**2 + 5
Numerical f'(2)  ≈ 77.0
Symbolic answer  = 77
Sigmoid at 1.0    = 0.7310585786300049
Sigmoid'(1.0)     = 0.19661193324148188
Check σ(1)(1-σ(1))= 0.19661193324148188  ✓`}
        >{`import sympy as sp
import numpy as np

# ---- Symbolic ----
x = sp.symbols("x")
f = 3*x**4 - 2*x**3 + 5*x - 7
fp = sp.diff(f, x)
print("Symbolic f' =", fp)
print("Symbolic answer  =", int(fp.subs(x, 2)))

# ---- Numerical (finite differences) ----
def f_num(x):    return 3*x**4 - 2*x**3 + 5*x - 7
def num_deriv(f, x, h=1e-5):  return (f(x + h) - f(x - h)) / (2 * h)
print(f"Numerical f'(2)  ≈ {num_deriv(f_num, 2):.1f}")

# ---- Sigmoid derivative ----
def sig(z):      return 1 / (1 + np.exp(-z))
def sig_prime(z): return sig(z) * (1 - sig(z))

z = 1.0
print("Sigmoid at 1.0    =", sig(z))
print("Sigmoid'(1.0)     =", sig_prime(z))
print("Check σ(1)(1-σ(1))=", sig(z) * (1 - sig(z)), " ✓")`}</Example>
        <Callout variant="tip" title="Finite differences vs autodiff">
          Central differences (as above) are OK for one-off checks but bad for training: each derivative
          needs 2 function evaluations, and error is O(h²). Modern ML uses{' '}
          <strong className="text-white">automatic differentiation</strong> (PyTorch, JAX, TensorFlow)
          which tracks operations on a graph and applies the rules from this lesson symbolically at
          machine speed.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A derivative is the limit of the rise-over-run: it tells you how fast a function is changing at each point.',
          'Six rules cover almost everything: constant, power, sum, constant multiplier, product, quotient.',
          'Memorise the derivatives of eˣ (itself), ln x (1/x), sigmoid (σ(1−σ)), tanh (1−tanh²), and ReLU (1/0). That is 90% of ML.',
          'f\' = 0 with f\'\' > 0 = minimum; with f\'\' < 0 = maximum. Zero curvature is inconclusive (saddle/inflection).',
          'Non-differentiable points exist (|x| at 0, ReLU at 0). Frameworks pick a subgradient and move on — rarely a practical problem.',
          'For code, use symbolic (SymPy) for proofs and automatic differentiation (PyTorch / JAX) for training. Finite differences are only for spot-checks.',
        ]}
      />
    </LessonArticle>
  )
}
