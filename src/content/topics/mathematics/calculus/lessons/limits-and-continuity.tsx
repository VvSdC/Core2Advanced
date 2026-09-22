import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LimitsAndContinuity() {
  return (
    <LessonArticle>
      <Definition term="Limit">
        <p>
          A <strong className="text-white">limit</strong> answers one question:{' '}
          <em>as x gets closer and closer to some value a, what value does f(x) approach?</em> We do not care
          what f(a) is (it may not even be defined). We only care about the value f is <em>heading toward</em>.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>lim  f(x) = L    means f(x) can be made as close to L as you want,</div>
          <div>x → a            by choosing x close enough to a (but not equal to a).</div>
        </div>
      </Definition>

      <LessonSection title="Why limits exist at all">
        <p className="text-slate-300">
          Some functions have holes, jumps, or asymptotes. Limits let us reason about the surrounding
          behaviour without touching the problem point. This is exactly what a derivative needs — the slope
          at a single point is defined as the <em>limit</em> of the slope of shrinking secants.
        </p>
        <Callout variant="insight" title="ML connection">
          Gradient descent, softmax stability, the definition of a derivative in the first place — all of
          them are limits in disguise. If you understand limits you already understand why ML uses tricks
          like <code>log(1 + exp(x))</code> instead of <code>exp(x) / (1 + exp(x))</code>: the second one
          overflows in the limit.
        </Callout>
      </LessonSection>

      <LessonSection title="How to actually evaluate a limit">
        <ContentStep number={1} title="Try plugging in">
          <p>
            If f is a polynomial, sum of them, or a &ldquo;nice&rdquo; combination — just substitute:
            <code className="text-slate-200"> lim x→2 (3x² − 1) = 3·4 − 1 = 11</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="If you get 0/0 — factor, cancel, retry">
          <p>
            <code className="text-slate-200">lim x→2 (x² − 4)/(x − 2)</code>. Direct substitution gives 0/0.
            Factor: <code>x² − 4 = (x − 2)(x + 2)</code>. Cancel: <code>x + 2</code>. Plug in 2: <strong>4</strong>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="If you get ∞/∞ or 0/0 with hard functions — L'Hôpital's rule">
          <p>
            When the limit is <em>indeterminate</em> (0/0 or ∞/∞) and the pieces are differentiable:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>lim  f(x)/g(x)  =  lim  f'(x)/g'(x)</div>
            <div>x→a               x→a</div>
          </div>
          <p className="mt-2 text-slate-300">Repeat until you get a number. If it never does, the limit likely does not exist.</p>
        </ContentStep>
        <ContentStep number={4} title="One-sided limits">
          <p>
            <code className="text-slate-200">lim x→a⁻</code> (from the left) and{' '}
            <code className="text-slate-200">lim x→a⁺</code> (from the right). The two-sided limit exists only
            when both are equal.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Continuity in one line">
        <p className="text-slate-300">
          f is <strong className="text-white">continuous at a</strong> if three things all agree:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li>f(a) is defined,</li>
          <li>the limit as x → a exists,</li>
          <li>the limit equals f(a).</li>
        </ol>
        <p className="mt-3 text-slate-300">
          Break any of the three and you get a &ldquo;discontinuity&rdquo; — a removable hole, a jump, or an
          infinite spike.
        </p>
      </LessonSection>

      <LessonSection title="Limits you must know by heart">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Limit</th>
                <th className="px-4 py-3">Value</th>
                <th className="px-4 py-3">Where it appears in ML</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['lim x→0  sin(x)/x',                          '1',           'Small-angle approximation'],
                ['lim x→0  (1 − cos x)/x',                    '0',           'Rare but shows up in stability proofs'],
                ['lim n→∞  (1 + 1/n)ⁿ',                       'e',           'Continuous compounding, exp(x) definition'],
                ['lim x→∞  (1 + a/x)ˣ',                       'eᵃ',          'Softmax scaling, learning-rate schedules'],
                ['lim x→∞  ln(x)/x',                          '0',           'ln grows slower than x — proves things converge'],
                ['lim x→∞  eˣ/xⁿ',                            '∞',           'exp beats any polynomial → softmax dominance'],
              ].map(([lim, v, ml]) => (
                <tr key={lim}>
                  <td className="px-4 py-3 font-mono text-white">{lim}</td>
                  <td className="px-4 py-3 font-mono">{v}</td>
                  <td className="px-4 py-3 text-slate-400">{ml}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Plug and play">
          <p>Evaluate lim x→3 (2x² − 5x + 1).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Polynomial → substitute:  2·9 − 5·3 + 1 = 18 − 15 + 1 = 4.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Factor and cancel">
          <p>Evaluate lim x→1 (x² − 1)/(x − 1).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Direct: 0/0 (indeterminate). Factor:</div>
            <div className="mt-1">(x² − 1) = (x − 1)(x + 1)</div>
            <div>(x² − 1)/(x − 1) = x + 1  (for x ≠ 1)</div>
            <div className="mt-1">lim x→1 (x + 1) = 2</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — L'Hôpital">
          <p>Evaluate lim x→0 (eˣ − 1)/x.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Direct: 0/0.</div>
            <div>Differentiate numerator and denominator:</div>
            <div className="mt-1">d/dx (eˣ − 1) = eˣ,   d/dx (x) = 1</div>
            <div>lim x→0  eˣ / 1 = e⁰ = 1</div>
            <div className="mt-2 text-slate-400">This is why the Taylor expansion of eˣ starts with 1 + x.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — One-sided limits and a jump">
          <p>f(x) = 1 for x &lt; 0, and f(x) = 2 for x ≥ 0. Does lim x→0 f(x) exist?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>lim x→0⁻ = 1,   lim x→0⁺ = 2   →  they disagree.</div>
            <div className="mt-1 text-red-400">Two-sided limit does not exist. f has a jump at 0.</div>
            <div className="mt-1 text-slate-400">
              This is the ReLU derivative story at x = 0 — the left-slope (0) and right-slope (1) disagree.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Sigmoid limits (ML flavour)">
          <p>Compute lim x→∞ σ(x) and lim x→−∞ σ(x), where σ(x) = 1/(1 + e^(−x)).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>As x → +∞: e^(−x) → 0, so σ(x) → 1/(1 + 0) = 1.</div>
            <div>As x → −∞: e^(−x) → +∞, so σ(x) → 1/(1 + ∞) = 0.</div>
            <div className="mt-2 text-genai-400">σ is bounded between 0 and 1 with those limits — why it maps to probabilities.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Softplus vs ReLU (numerical stability)">
          <p>Softplus is s(x) = ln(1 + eˣ). Show lim x→∞ (s(x) − x) = 0 and lim x→−∞ s(x) = 0.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>As x → +∞:  s(x) = ln(eˣ (1 + e^(−x))) = x + ln(1 + e^(−x))  →  x + 0 = x.</div>
            <div>  So s(x) − x → 0.</div>
            <div className="mt-2">As x → −∞:  eˣ → 0  →  s(x) = ln(1 + 0) = 0.</div>
            <div className="mt-2 text-slate-400">
              Softplus is a smooth ReLU: it matches ReLU at ±∞. The extra ln(1 + e^(−|x|)) trick is what
              stable implementations use to avoid overflow.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — numerical limits with SymPy and NumPy">
        <Example
          title="Symbolic and numeric evaluation"
          output={`sin(x)/x  as x→0  = 1
(e^x - 1)/x as x→0 = 1
(1 + 1/n)^n as n→∞ = E
sigmoid(+50) ≈ 1.0
sigmoid(-50) ≈ 1.9287498479639178e-22
softplus(50)  ≈ 50.0 (matches x)
softplus(-50) ≈ 1.9287498479639178e-22 (matches 0)`}
        >{`import sympy as sp
import numpy as np

x, n = sp.symbols("x n")

print("sin(x)/x  as x→0  =", sp.limit(sp.sin(x)/x, x, 0))
print("(e^x - 1)/x as x→0 =", sp.limit((sp.exp(x) - 1)/x, x, 0))
print("(1 + 1/n)^n as n→∞ =", sp.limit((1 + 1/n)**n, n, sp.oo))

# ML: sigmoid limits
def sigmoid(x):     return 1 / (1 + np.exp(-x))
def softplus(x):    return np.log1p(np.exp(-abs(x))) + np.maximum(x, 0)  # stable form

print("sigmoid(+50) ≈", sigmoid(50))
print("sigmoid(-50) ≈", sigmoid(-50))
print("softplus(50)  ≈", softplus(50), "(matches x)")
print("softplus(-50) ≈", softplus(-50), "(matches 0)")`}</Example>
        <Callout variant="tip" title="The naive softplus overflows">
          A direct <code>log(1 + exp(x))</code> overflows once x &gt; ~700 (float64). The stable form
          <code>max(x, 0) + log1p(exp(−|x|))</code> uses the limit result above — subtract off the growing
          part before exponentiating. Every mature framework does this.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A limit describes where a function is heading, not what it is at the point — needed to define derivatives, handle 0/0, and reason about asymptotes.',
          'Solving strategy: substitute → factor & cancel → L\'Hôpital\'s rule for 0/0 or ∞/∞ → last resort, expand as a series.',
          'A two-sided limit exists only when both one-sided limits agree; a mismatch is exactly the "jump" at ReLU\'s 0.',
          'Continuity = three-in-one: f(a) defined, limit exists, limit equals f(a). Break any and you get a hole, jump, or spike.',
          'Six ML-adjacent limits are worth memorising — they explain small-angle approximations, e as a limit, sigmoid ranges, and why exp beats any polynomial.',
          'Use limits to reason about numerical stability — the softplus trick and the log-sum-exp trick both come straight from limit analysis.',
        ]}
      />
    </LessonArticle>
  )
}
