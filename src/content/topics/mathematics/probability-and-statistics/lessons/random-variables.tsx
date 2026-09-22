import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RandomVariables() {
  return (
    <LessonArticle>
      <Definition term="Random variable">
        <p>
          A <strong className="text-white">random variable</strong> X is a rule that assigns a number to every
          outcome in the sample space. It turns a messy set of outcomes into arithmetic you can compute with.
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Discrete</strong> — X takes at most countably many values (dice roll, coin count, token index).</li>
          <li><strong className="text-white">Continuous</strong> — X can take any value in an interval (height, price, activation output).</li>
        </ul>
      </Definition>

      <LessonSection title="Three functions describe the same random variable">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Function</th>
                <th className="px-4 py-3">Discrete</th>
                <th className="px-4 py-3">Continuous</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Mass / density',      'PMF  p(x) = P(X = x)',                                'PDF  f(x)   — height, not probability'],
                ['Probability of range', 'P(a ≤ X ≤ b) = Σ_{a≤x≤b} p(x)',                       'P(a ≤ X ≤ b) = ∫ₐᵇ f(x) dx'],
                ['CDF',                  'F(x) = P(X ≤ x) = Σ_{y≤x} p(y)',                      'F(x) = ∫_{−∞}^x f(t) dt'],
                ['Normalisation',        'Σ p(x) = 1',                                          '∫ f(x) dx = 1'],
              ].map(([f, d, c]) => (
                <tr key={f}>
                  <td className="px-4 py-3 font-semibold text-white">{f}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{d}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Continuous gotcha">
          For a continuous X, <code className="text-slate-200">P(X = x) = 0</code>. Density f(x) is not a
          probability — it is a probability <em>per unit x</em>. You always integrate density to get
          probability.
        </Callout>
      </LessonSection>

      <LessonSection title="Joint, marginal, and conditional distributions">
        <p className="text-slate-300">
          Two random variables live in a joint distribution p(x, y) or f(x, y). You can extract:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Marginal:      p(x)     = Σ_y  p(x, y)        (or  ∫ f(x, y) dy)</div>
          <div>Conditional:   p(y | x) = p(x, y) / p(x)</div>
          <div>Independence:  p(x, y)  = p(x) · p(y)          for all x, y</div>
        </div>
        <Callout variant="insight" title="Modelling P(y | x) is what supervised learning does">
          A classifier learns the conditional distribution of the label given the input. A generative model
          learns the joint (and can therefore sample new inputs). This is why the second is strictly harder
          — you have to model everything the first can skip.
        </Callout>
      </LessonSection>

      <LessonSection title="Transformations of a random variable">
        <p className="text-slate-300">
          If Y = g(X), how do you get f_Y from f_X? Two rules:
        </p>
        <ContentStep number={1} title="Discrete — sum over pre-images">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>p_Y(y) = Σ_{`{x : g(x) = y}`}  p_X(x)</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Continuous — change of variables with the Jacobian">
          <p className="text-slate-300">
            For a smooth, invertible g (write x = g⁻¹(y)):
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>f_Y(y) = f_X(g⁻¹(y)) · |d g⁻¹/dy|</div>
          </div>
          <p className="mt-2 text-slate-300">
            This is exactly the change-of-variables formula from the Jacobian lesson — normalising flows use
            it as their entire training signal.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Discrete PMF and CDF">
          <p>Let X = the sum of two fair dice. Write the PMF and evaluate F(5) = P(X ≤ 5).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>x :   2   3   4   5   6   7   8   9  10  11  12</div>
            <div>p :  1  2  3  4  5  6  5  4  3  2  1     (over 36)</div>
            <div className="mt-2">F(5) = (1 + 2 + 3 + 4) / 36 = 10/36 ≈ 0.2778.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Continuous density check">
          <p>Given f(x) = c·x for x ∈ [0, 2] and 0 elsewhere, find c and then P(0.5 ≤ X ≤ 1.5).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Normalise: ∫₀² c x dx = c · 2 = 1  →  c = 1/2.</div>
            <div className="mt-2">P(0.5 ≤ X ≤ 1.5) = ∫_{`{0.5}`}^{`{1.5}`} (x / 2) dx = [x²/4]_{`{0.5}`}^{`{1.5}`}</div>
            <div>                = (2.25 − 0.25) / 4 = 0.5.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Discrete CDF gives the PMF back">
          <p>If F is a step function jumping at 1, 2, 3 by 0.2, 0.5, 0.3, list the PMF.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>p(1) = 0.2,   p(2) = 0.5,   p(3) = 0.3.</div>
            <div className="mt-1 text-slate-400">The jump in the CDF at each point is the point&rsquo;s probability.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Sampling via the inverse CDF (ML flavour)">
          <p>
            You want to sample from a distribution with CDF F(x) = 1 − e^(−x) (exponential with rate 1).
            Derive the inverse-transform sampler.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Draw U ~ Uniform(0, 1).  Set X = F⁻¹(U).</div>
            <div className="mt-1">u = 1 − e⁻ˣ  →  x = −ln(1 − u).  Equivalently  x = −ln(u)  (since 1 − U also ~ Uniform).</div>
            <div className="mt-2 text-genai-400">
              This is how every framework&rsquo;s <code>random.exponential</code> works. Change F and you can
              sample any 1-D distribution.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Change of variables (ML flavour)">
          <p>X ~ Uniform(0, 1). Let Y = −ln X. What is the density of Y?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>g(x) = −ln x    →    x = e⁻ʸ,    dx/dy = −e⁻ʸ,   |dx/dy| = e⁻ʸ.</div>
            <div className="mt-2">f_Y(y) = f_X(x) · |dx/dy| = 1 · e⁻ʸ    for y ≥ 0.</div>
            <div className="mt-2 text-genai-400">
              Y follows an Exponential(1) — matching Problem 4 from the opposite direction.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Marginal from a joint (ML flavour)">
          <p>
            Feature X ∈ {`{a, b}`}, label Y ∈ {`{0, 1}`}. Joint counts (out of 100):
            (a, 0)=30, (a, 1)=10, (b, 0)=20, (b, 1)=40. Compute p(x), p(y), and p(y | x = a).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Marginals:  p(a) = 40/100 = 0.40,   p(b) = 0.60</div>
            <div>            p(0) = 50/100 = 0.50,   p(1) = 0.50</div>
            <div className="mt-2">Conditional on X = a:</div>
            <div>            p(0 | a) = 30/40 = 0.75,   p(1 | a) = 10/40 = 0.25.</div>
            <div className="mt-2 text-slate-400">
              A classifier trained on this table would predict Y = 0 when X = a and Y = 1 when X = b.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — PMFs, CDFs, and sampling">
        <Example
          title="Discrete and continuous, all in NumPy / SciPy"
          output={`PMF of dice sum:
2: 0.028  3: 0.056  4: 0.083  5: 0.111
6: 0.139  7: 0.167  8: 0.139  9: 0.111
10: 0.083 11: 0.056 12: 0.028
F(5)                = 0.2778
∫₀.₅¹·⁵ x/2 dx      = 0.5
Inverse-transform sample (5 draws) : [1.02  0.32  0.03  1.61  0.53]
Y = -ln(U): mean 0.9987  var 1.0032  → Exp(1) ✓
Conditional p(y | x = a):  [0.75 0.25]`}
        >{`import numpy as np
from scipy import integrate, stats

# ---- PMF and CDF of dice sum ----
p = {s: sum((s - i - 1 in range(1, 7)) for i in range(1, 7)) / 36 for s in range(2, 13)}
print("PMF of dice sum:")
for row in [range(2, 6), range(6, 10), range(10, 13)]:
    print("  ".join(f"{s}: {p[s]:.3f}" for s in row))
print(f"F(5)                = {sum(p[s] for s in range(2, 6)):.4f}")

# ---- Continuous density ∫ x/2 dx from 0.5 to 1.5 ----
val, _ = integrate.quad(lambda x: x / 2, 0.5, 1.5)
print(f"∫₀.₅¹·⁵ x/2 dx      = {val}")

# ---- Inverse-transform sampling of Exp(1) ----
rng = np.random.default_rng(0)
u   = rng.random(5)
x   = -np.log(u)
print("Inverse-transform sample (5 draws) :", np.round(x, 2))

# Confirm distribution of Y = -ln(U)
u_big = rng.random(50_000)
y_big = -np.log(u_big)
print(f"Y = -ln(U): mean {y_big.mean():.4f}  var {y_big.var():.4f}  → Exp(1) ✓")

# ---- Joint counts to conditional ----
joint = np.array([[30, 10], [20, 40]])   # rows=x∈{a,b}, cols=y∈{0,1}
p_x   = joint.sum(1) / joint.sum()
p_y_given_a = joint[0] / joint[0].sum()
print(f"Conditional p(y | x = a):  {p_y_given_a}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A random variable turns outcomes into numbers; it is discrete (PMF) or continuous (PDF), with a CDF that works for both.',
          'For continuous X, P(X = x) = 0. Density is probability PER UNIT x — integrate to get probabilities.',
          'Joint → marginal (sum/integrate over the other variable) → conditional (divide by the marginal). Independence factors: p(x, y) = p(x)p(y).',
          'Discriminative ML learns P(y | x); generative ML learns the joint P(x, y). The joint is strictly more informative — and harder.',
          'Transformations: discrete = sum over pre-images; continuous = multiply by |dg⁻¹/dy|. This IS the change-of-variables trick behind normalising flows.',
          'Inverse-transform sampling (draw U ~ Uniform, apply F⁻¹) is how every framework simulates a 1-D distribution once you know the CDF.',
        ]}
      />
    </LessonArticle>
  )
}
