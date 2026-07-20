import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SlrOptimalParametersMath() {
  return (
    <LessonArticle>
      <Definition term="Finding Optimal Parameters Mathematically">
        <p>
          The best θ₀ and θ₁ are the values that <strong className="text-white">minimize the cost</strong>{' '}
          J(θ₀, θ₁). For simple linear regression with squared error, we can find them exactly by{' '}
          <strong className="text-white">calculus</strong>: take partial derivatives of J, set them to{' '}
          <strong className="text-white">zero</strong>, and solve the resulting equations.
        </p>
      </Definition>

      <Callout variant="beginner" title="Big idea in one sentence">
        At a minimum of a smooth bowl-shaped cost, the slope is flat — so the derivatives are 0. Solving
        those “slope = 0” equations gives the optimal line.
      </Callout>

      <LessonSection title="Why differentiate the cost function?">
        <p className="text-slate-300">
          Think of J as the height of a landscape over the (θ₀, θ₁) plane. Walking downhill means
          following the slope. At the <strong className="text-white">bottom of the bowl</strong>, you
          cannot go lower — the ground is level in every direction.
        </p>
        <Flowchart
          title="Optimization logic"
          chart={`flowchart TB
  A["Goal: make J as small as possible"] --> B["J is smooth and bowl-shaped for MSE"]
  B --> C["At the minimum, slope = 0"]
  C --> D["Compute ∂J/∂θ₀ and ∂J/∂θ₁"]
  D --> E["Set both equal to 0"]
  E --> F["Solve for θ₀ and θ₁"]
  F --> G["Those θ values are optimal"]`}
        />
        <ContentStep number={1} title="Derivative = rate of change">
          <p className="text-slate-300">
            ∂J/∂θ₀ asks: “If I nudge θ₀ a tiny bit, how fast does cost change?” Same for θ₁. If the
            derivative is positive, increasing that parameter raises cost; if negative, increasing it
            lowers cost.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Zero derivative = candidate optimum">
          <p className="text-slate-300">
            Only when <span className="font-mono text-sm text-white">∂J/∂θⱼ = 0</span> is a small nudge
            neither clearly uphill nor downhill — a stationary point. For MSE linear regression that
            stationary point is the <strong className="text-white">unique global minimum</strong>{' '}
            (convex bowl).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why not just try many θ values?">
          <p className="text-slate-300">
            Brute force is endless. Setting derivatives to zero gives a{' '}
            <strong className="text-white">direct algebraic path</strong> to the answer (for this
            model). Gradient descent (next lessons) is the iterative cousin of the same idea.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Critical point checklist">
          First derivative zero → critical point. For our J, the Hessian / bowl shape guarantees it is
          a minimum — we are not stuck on a peak or saddle for this cost.
        </Callout>
      </LessonSection>

      <LessonSection title="Start from the cost function">
        <p className="text-slate-300">Hypothesis and cost (same as earlier lessons):</p>
        <div className="mt-3 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white md:text-base">
          <p>hθ(x) = θ₀ + θ₁ · x</p>
          <p>J(θ₀, θ₁) = (1 / 2m) · Σᵢ₌₁ᵐ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾)²</p>
        </div>
        <p className="mt-3 text-slate-300">
          The factor <span className="font-mono text-sm">1/2</span> cancels neatly when we
          differentiate the square (chain rule brings a 2). The{' '}
          <span className="font-mono text-sm">1/m</span> averages over m examples.
        </p>
      </LessonSection>

      <LessonSection title="Step 1 — differentiate with respect to θ₀">
        <p className="text-slate-300">
          Differentiate inside the sum. Let residual e⁽ⁱ⁾ = θ₀ + θ₁x⁽ⁱ⁾ − y⁽ⁱ⁾. Then:
        </p>
        <div className="mt-3 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm leading-relaxed text-slate-200">
          <p className="text-white">∂J/∂θ₀ = (1/m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾)</p>
          <p className="text-slate-400"># because d(e²)/dθ₀ = 2e · 1, and the 2 cancels the 1/2</p>
        </div>
        <p className="mt-3 text-slate-300">
          Set the derivative to zero (drop the always-positive 1/m — it does not change the root):
        </p>
        <div className="mt-3 rounded-xl border border-machine-learning-500/30 bg-machine-learning-500/10 p-4 font-mono text-sm text-white">
          Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) = 0
        </div>
        <p className="mt-3 text-slate-300">Expand the sum — this is{' '}
          <strong className="text-white">normal equation #1</strong>:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          m · θ₀ + θ₁ · Σ x⁽ⁱ⁾ = Σ y⁽ⁱ⁾
        </div>
        <Callout variant="tip" title="Intuition">
          Average residual is zero: the line is centered so over- and under-predictions balance in
          the raw-error sense.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 2 — differentiate with respect to θ₁">
        <div className="mt-1 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm leading-relaxed text-slate-200">
          <p className="text-white">∂J/∂θ₁ = (1/m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾</p>
          <p className="text-slate-400"># chain rule: d(e²)/dθ₁ = 2e · x</p>
        </div>
        <p className="mt-3 text-slate-300">Set equal to zero:</p>
        <div className="mt-3 rounded-xl border border-machine-learning-500/30 bg-machine-learning-500/10 p-4 font-mono text-sm text-white">
          Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾ = 0
        </div>
        <p className="mt-3 text-slate-300">
          Expand — <strong className="text-white">normal equation #2</strong>:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          θ₀ · Σ x⁽ⁱ⁾ + θ₁ · Σ (x⁽ⁱ⁾)² = Σ (x⁽ⁱ⁾ · y⁽ⁱ⁾)
        </div>
      </LessonSection>

      <LessonSection title="Step 3 — closed-form solution">
        <p className="text-slate-300">
          Two linear equations, two unknowns. Solving them (or using means) yields the famous formulas:
        </p>
        <div className="mt-3 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white md:text-base">
          <p>θ₁ = Σ (x⁽ⁱ⁾ − x̄)(y⁽ⁱ⁾ − ȳ) / Σ (x⁽ⁱ⁾ − x̄)²</p>
          <p>θ₀ = ȳ − θ₁ · x̄</p>
        </div>
        <p className="mt-3 text-slate-300">Equivalent sum form (handy with a calculator):</p>
        <div className="mt-3 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-white sm:text-sm">
          <p>θ₁ = (m · Σxy − Σx · Σy) / (m · Σx² − (Σx)²)</p>
          <p>θ₀ = (Σy − θ₁ · Σx) / m</p>
        </div>
        <Flowchart
          title="Math path vs gradient descent"
          chart={`flowchart TB
  A[Cost Jθ] --> B{How to minimize?}
  B -- Calculus --> C[Set ∂J/∂θ = 0]
  C --> D[Normal equations]
  D --> E[Exact θ₀, θ₁]
  B -- Iteration --> F[Gradient descent]
  F --> G[Approximate θ₀, θ₁]`}
        />
        <Callout variant="info" title="What gradient descent is doing">
          Each GD step moves opposite the gradient. When it converges, the gradient is ≈ 0 — the{' '}
          <em>same</em> condition we solve exactly here. The{' '}
          <strong className="text-white">Convergence Algorithm</strong> lesson walks the same four
          points with gradient descent and shows θ₀=0.5, θ₁=2.3 — matching this OLS result.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked example — sample data">
        <p className="text-slate-300">
          Four training points. We will compute every sum, plug into the formulas, and read off
          optimal θ₀, θ₁.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">i</th>
                <th className="px-4 py-3">x</th>
                <th className="px-4 py-3">y</th>
                <th className="px-4 py-3">x·y</th>
                <th className="px-4 py-3">x²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1', '1', '3', '3', '1'],
                ['2', '2', '5', '10', '4'],
                ['3', '3', '7', '21', '9'],
                ['4', '4', '10', '40', '16'],
                ['Σ', '10', '25', '74', '30'],
              ].map(([i, x, y, xy, x2]) => (
                <tr
                  key={i}
                  className={i === 'Σ' ? 'bg-surface-800/80 font-medium text-white' : 'hover:bg-surface-800/50'}
                >
                  <td className="px-4 py-3 font-mono">{i}</td>
                  <td className="px-4 py-3 font-mono">{x}</td>
                  <td className="px-4 py-3 font-mono">{y}</td>
                  <td className="px-4 py-3 font-mono">{xy}</td>
                  <td className="px-4 py-3 font-mono">{x2}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ContentStep number={1} title="Means">
          <Example title="x̄ and ȳ" output={`x̄ = 2.5\nȳ = 6.25`}>
{`m = 4
x̄ = (1+2+3+4) / 4 = 10/4 = 2.5
ȳ = (3+5+7+10) / 4 = 25/4 = 6.25`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="Slope θ₁ from the mean formula">
          <Example
            title="Numerator and denominator"
            output={`Σ(x−x̄)(y−ȳ) = 11.5
Σ(x−x̄)² = 5
θ₁ = 11.5 / 5 = 2.3`}
          >
{`(x−x̄):  -1.5, -0.5,  0.5,  1.5
(y−ȳ):  -3.25, -1.25, 0.75, 3.75

products: (-1.5)(-3.25)=4.875
          (-0.5)(-1.25)=0.625
          (0.5)(0.75)=0.375
          (1.5)(3.75)=5.625
sum products = 11.5

squared x-devs: 2.25+0.25+0.25+2.25 = 5

θ₁ = 11.5 / 5 = 2.3`}
          </Example>
        </ContentStep>

        <ContentStep number={3} title="Intercept θ₀">
          <Example title="θ₀ = ȳ − θ₁·x̄" output={`θ₀ = 6.25 − 2.3 × 2.5 = 6.25 − 5.75 = 0.5`}>
{`θ₀ = ȳ - θ₁ * x̄
   = 6.25 - 2.3 * 2.5
   = 6.25 - 5.75
   = 0.5`}
          </Example>
        </ContentStep>

        <ContentStep number={4} title="Same answer via the sum formula">
          <Example
            title="Plug Σx, Σy, Σxy, Σx²"
            output={`θ₁ = (4·74 − 10·25) / (4·30 − 10²) = (296 − 250) / (120 − 100) = 46/20 = 2.3
θ₀ = (25 − 2.3·10) / 4 = (25 − 23) / 4 = 0.5`}
          >
{`θ₁ = (m·Σxy - Σx·Σy) / (m·Σx² - (Σx)²)
   = (4*74 - 10*25) / (4*30 - 100)
   = (296 - 250) / (120 - 100)
   = 46 / 20 = 2.3

θ₀ = (Σy - θ₁·Σx) / m
   = (25 - 2.3*10) / 4
   = 2 / 4 = 0.5`}
          </Example>
        </ContentStep>

        <ContentStep number={5} title="Verify — predictions and cost">
          <p className="text-slate-300">
            Optimal line: <span className="font-mono text-sm text-white">ŷ = 0.5 + 2.3 · x</span>
          </p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">x</th>
                  <th className="px-4 py-3">y</th>
                  <th className="px-4 py-3">ŷ = 0.5 + 2.3x</th>
                  <th className="px-4 py-3">error</th>
                  <th className="px-4 py-3">error²</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  ['1', '3', '2.8', '0.2', '0.04'],
                  ['2', '5', '5.1', '−0.1', '0.01'],
                  ['3', '7', '7.4', '−0.4', '0.16'],
                  ['4', '10', '9.7', '0.3', '0.09'],
                  ['', '', '', 'Σ', '0.30'],
                ].map(([x, y, yh, e, e2], idx) => (
                  <tr key={idx} className={x === '' ? 'bg-surface-800/80 font-medium text-white' : ''}>
                    <td className="px-4 py-3 font-mono">{x}</td>
                    <td className="px-4 py-3 font-mono">{y}</td>
                    <td className="px-4 py-3 font-mono">{yh}</td>
                    <td className="px-4 py-3 font-mono">{e}</td>
                    <td className="px-4 py-3 font-mono">{e2}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Example title="Training cost at this θ" output={`J = (1/(2·4)) · 0.30 = 0.0375`}>
{`J(0.5, 2.3) = (1 / (2m)) * Σ error²
             = (1 / 8) * 0.30
             = 0.0375`}
          </Example>
          <Callout variant="beginner">
            Any other (θ₀, θ₁) gives a higher J. These values are exactly where ∂J/∂θ₀ = ∂J/∂θ₁ = 0.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Check the “derivative = 0” condition numerically">
        <p className="text-slate-300">
          Plug θ₀ = 0.5, θ₁ = 2.3 back into the gradient formulas — both should be ~0:
        </p>
        <Example
          title="Gradients at the optimum"
          output={`∂J/∂θ₀ ∝ Σ(ŷ − y) = −0.2 + 0.1 + 0.4 + (−0.3) = 0
∂J/∂θ₁ ∝ Σ(ŷ − y)·x = (−0.2)(1)+(0.1)(2)+(0.4)(3)+(−0.3)(4) = 0`}
        >
{`ŷ − y :  -0.2,  0.1,  0.4,  -0.3

Σ (ŷ − y) = -0.2 + 0.1 + 0.4 - 0.3 = 0

Σ (ŷ − y) · x
  = (-0.2)(1) + (0.1)(2) + (0.4)(3) + (-0.3)(4)
  = -0.2 + 0.2 + 1.2 - 1.2
  = 0`}
        </Example>
        <Callout variant="insight" title="You have arrived">
          Zero gradients confirm the calculus condition. The line ŷ = 0.5 + 2.3x is the exact
          least-squares fit for this sample.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Optimal parameters minimize J — for a smooth bowl, that is where ∂J/∂θ₀ = ∂J/∂θ₁ = 0.',
          'Differentiating MSE cost produces the two normal equations for θ₀ and θ₁.',
          'Closed form: θ₁ from covariance/variance of x,y; θ₀ = ȳ − θ₁x̄.',
          'Worked sample (x=1..4, y=3,5,7,10) → θ₀=0.5, θ₁=2.3, with gradients exactly 0.',
        ]}
      />
    </LessonArticle>
  )
}
