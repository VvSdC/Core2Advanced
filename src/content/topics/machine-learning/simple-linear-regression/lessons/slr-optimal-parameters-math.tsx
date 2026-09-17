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

export function SlrOptimalParametersMath() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Please do not panic at the word ‘derivative’">
        This lesson looks mathematical, but the story is everyday: we want the bottom of the cost
        valley. At the bottom, the ground is flat. “Flat” in math-speak means “slope = 0.” We write
        that condition, solve two school-level equations, and get θ₀ and θ₁. You can follow the
        worked numbers even if calculus feels rusty — focus on the story first, then the arithmetic.
      </Callout>

      <Callout variant="info" title="Already derived">
        The previous lesson showed how ∂J/∂θ₀ and ∂J/∂θ₁ come from the cost. Here we{' '}
        <strong className="text-white">use</strong> those results: set them to zero and solve.
      </Callout>

      <Definition term="Finding the best line with math">
        <p>
          The best θ₀ and θ₁ are the ones that make the cost J as small as possible. For our
          squared-error cost, we can find them exactly: measure how J changes when we nudge each
          parameter (that change-rate is a derivative), set those change-rates to{' '}
          <strong className="text-white">zero</strong>, and solve.
        </p>
      </Definition>

      <LessonSection title="The valley story (read this twice)">
        <p className="text-slate-300">
          Remember the bowl from the cost lesson. Height = how wrong the line is. We want the lowest
          point.
        </p>
        <ContentStep number={1} title="On a hillside, the ground tilts">
          <p className="text-slate-300">
            If you take a tiny step and the cost goes up or down, the ground has a slope. That slope
            is what ∂J/∂θ means: “how fast does cost change if I change this parameter a little?”
          </p>
        </ContentStep>
        <ContentStep number={2} title="At the bottom, the ground is flat">
          <p className="text-slate-300">
            No tilt left, no tilt right. So both slopes are zero: ∂J/∂θ₀ = 0 and ∂J/∂θ₁ = 0. Those
            two equations are enough to solve for two unknowns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Why bother?">
          <p className="text-slate-300">
            Guessing lines forever is endless. Flat-ground equations give a direct answer for this
            model. Later, gradient descent will <em>walk</em> to the same place without solving
            algebra — same valley, different route.
          </p>
        </ContentStep>
        <Flowchart
          title="Optimization logic in plain order"
          chart={`flowchart TB
  A[Want lowest cost] --> B[Cost bowl has one bottom]
  B --> C[At bottom: slopes are zero]
  C --> D[Write slope formulas]
  D --> E[Set them equal to 0]
  E --> F[Solve for θ₀ and θ₁]`}
        />
        <Callout variant="tip" title="If symbols blur">
          Skip ahead to the <strong className="text-white">worked example</strong> section, do the
          arithmetic with the table, then come back. Many beginners understand faster with numbers
          first.
        </Callout>
      </LessonSection>

      <LessonSection title="Start from the cost (same as last lesson)">
        <p className="text-slate-300">
          Prediction rule and cost — nothing new, just restating so the next steps have a clear
          starting point:
        </p>
        <div className="mt-3 space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white md:text-base">
          <p>ŷ = θ₀ + θ₁ · x</p>
          <p>J = (1 / 2m) · Σ (ŷ − y)²</p>
        </div>
        <p className="mt-3 text-slate-300">
          The 1/2 is only there so a later derivative looks cleaner. Mentally you can still think
          “average of squared mistakes.”
        </p>
      </LessonSection>

      <LessonSection title="Step 1 — how cost changes if we nudge θ₀">
        <p className="text-slate-300">
          From the derivation lesson (chain rule on the squared error):
        </p>
        <div className="mt-3 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm leading-relaxed text-slate-200">
          <p className="text-white">∂J/∂θ₀ = (1/m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾)</p>
          <p className="text-slate-400"># average of (prediction − actual) across all rows</p>
        </div>
        <p className="mt-3 text-slate-300">
          At the best line this slope is zero. So we require:
        </p>
        <div className="mt-3 rounded-xl border border-machine-learning-500/30 bg-machine-learning-500/10 p-4 font-mono text-sm text-white">
          Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) = 0
        </div>
        <p className="mt-3 text-slate-300">
          Expand the sum — this is equation #1 for the best line:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          m · θ₀ + θ₁ · Σ x⁽ⁱ⁾ = Σ y⁽ⁱ⁾
        </div>
        <Callout variant="tip" title="Intuition">
          Average residual is zero: the line is centered so over- and under-predictions balance in
          the raw-error sense.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 2 — how cost changes if we nudge θ₁">
        <p className="text-slate-300">
          Same question for slope: “If I make the line a bit steeper, how does cost change?”
        </p>
        <div className="mt-1 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm leading-relaxed text-slate-200">
          <p className="text-white">∂J/∂θ₁ = (1/m) · Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾</p>
          <p className="text-slate-400"># average of (prediction − actual) × x</p>
        </div>
        <p className="mt-3 text-slate-300">Set equal to zero for the best line:</p>
        <div className="mt-3 rounded-xl border border-machine-learning-500/30 bg-machine-learning-500/10 p-4 font-mono text-sm text-white">
          Σᵢ (θ₀ + θ₁ · x⁽ⁱ⁾ − y⁽ⁱ⁾) · x⁽ⁱ⁾ = 0
        </div>
        <p className="mt-3 text-slate-300">
          Expand — equation #2:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          θ₀ · Σ x⁽ⁱ⁾ + θ₁ · Σ (x⁽ⁱ⁾)² = Σ (x⁽ⁱ⁾ · y⁽ⁱ⁾)
        </div>
      </LessonSection>

      <LessonSection title="Step 3 — ready-to-use formulas (OLS)">
        <p className="text-slate-300">
          Solving those two equations gives formulas you can use with a calculator. People call this{' '}
          <strong className="text-white">Ordinary Least Squares (OLS)</strong> — “least squares”
          just means “smallest squared mistakes.”
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

      <LessonSection title="Worked example — numbers only (this is the confidence builder)">
        <p className="text-slate-300">
          Four training points. We will fill a small table, plug into the formulas, and read off
          θ₀ and θ₁. If the derivative section felt loud, start here.
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
          <ScatterPlot
            title="The least-squares line ŷ = 0.5 + 2.3x on the four points"
            points={[
              { x: 1, y: 3 },
              { x: 2, y: 5 },
              { x: 3, y: 7 },
              { x: 4, y: 10 },
            ]}
            line={{ slope: 2.3, intercept: 0.5 }}
            showResiduals
            xLabel="x"
            yLabel="y"
            caption="The red dashed residuals are tiny — that is what 'least squares' delivers. No other straight line makes the total squared gap smaller than J = 0.0375."
          />
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
