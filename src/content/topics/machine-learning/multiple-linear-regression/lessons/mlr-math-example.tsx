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

export function MlrMathExample() {
  return (
    <LessonArticle>
      <Definition term="Worked MLR Example">
        <p>
          Four training rows, <strong className="text-white">two features</strong> (x₁, x₂). We build
          X, form XᵀX and Xᵀy, solve the normal equations, and verify predictions are exact for this
          designed dataset.
        </p>
      </Definition>

      <Callout variant="beginner" title="Still multiple features — not SLR">
        Every example uses x₁ <em>and</em> x₂. The true line we planted is ŷ = 1 + 2x₁ + 3x₂ so you can
        see OLS recover θ = [1, 2, 3]ᵀ.
      </Callout>

      <LessonSection title="Sample data">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">i</th>
                <th className="px-4 py-3">x₁</th>
                <th className="px-4 py-3">x₂</th>
                <th className="px-4 py-3">y</th>
                <th className="px-4 py-3">Check: 1+2x₁+3x₂</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1', '1', '1', '6', '1+2+3=6'],
                ['2', '2', '1', '8', '1+4+3=8'],
                ['3', '3', '2', '13', '1+6+6=13'],
                ['4', '4', '2', '15', '1+8+6=15'],
              ].map(([i, a, b, y, check]) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{i}</td>
                  <td className="px-4 py-3 font-mono">{a}</td>
                  <td className="px-4 py-3 font-mono">{b}</td>
                  <td className="px-4 py-3 font-mono text-white">{y}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{check}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Step 1 — design matrix X and label vector y">
        <Example title="Include bias column x₀ = 1">
{`X = | 1  1  1 |      y = |  6 |
    | 1  2  1 |          |  8 |
    | 1  3  2 |          | 13 |
    | 1  4  2 |          | 15 |

# columns: [x₀, x₁, x₂]`}
        </Example>
      </LessonSection>

      <LessonSection title="Step 2 — form XᵀX and Xᵀy">
        <ContentStep number={1} title="XᵀX (3×3)">
          <Example title="Computed products" output={`XᵀX = [[4, 10, 6], [10, 30, 17], [6, 17, 10]]`}>
{`XᵀX = | 4   10   6 |
      | 10  30  17 |
      | 6   17  10 |`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Xᵀy (3×1)">
          <Example title="Feature–label sums" output={`Xᵀy = [42, 121, 70]ᵀ`}>
{`Xᵀy = | 42  |   # Σ y
      | 121 |   # Σ x₁ y
      | 70  |   # Σ x₂ y`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Step 3 — solve XᵀX θ = Xᵀy">
        <Flowchart
          title="Normal equation solve"
          chart={`flowchart TB
  A["XᵀX θ = Xᵀy"] --> B[Solve 3×3 linear system]
  B --> C["θ = [θ₀, θ₁, θ₂]ᵀ"]
  C --> D["θ = [1, 2, 3]ᵀ"]`}
        />
        <Example title="Result" output={`θ₀ = 1\nθ₁ = 2\nθ₂ = 3`}>
{`Solve:
4θ₀ + 10θ₁ + 6θ₂ = 42
10θ₀ + 30θ₁ + 17θ₂ = 121
6θ₀ + 17θ₁ + 10θ₂ = 70

⇒ θ = [1, 2, 3]ᵀ

# Same as θ = (XᵀX)⁻¹ Xᵀ y`}
        </Example>
        <Callout variant="insight">
          OLS recovered the planted weights exactly because y was generated from that linear rule
          with no noise.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 4 — verify predictions and cost">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">x₁</th>
                <th className="px-4 py-3">x₂</th>
                <th className="px-4 py-3">ŷ = 1+2x₁+3x₂</th>
                <th className="px-4 py-3">y</th>
                <th className="px-4 py-3">error</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1', '1', '6', '6', '0'],
                ['2', '1', '8', '8', '0'],
                ['3', '2', '13', '13', '0'],
                ['4', '2', '15', '15', '0'],
              ].map(([a, b, yh, y, e]) => (
                <tr key={a + b} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{a}</td>
                  <td className="px-4 py-3 font-mono">{b}</td>
                  <td className="px-4 py-3 font-mono text-white">{yh}</td>
                  <td className="px-4 py-3 font-mono">{y}</td>
                  <td className="px-4 py-3 font-mono">{e}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Cost at this θ" output={`J = 0`}>
{`J(θ) = (1/(2m)) * Σ error² = 0

# Gradient also zero: Xᵀ(Xθ − y) = 0`}
        </Example>
        <Callout variant="tip" title="With noise">
          Real data rarely gives J = 0. OLS still finds the θ that makes J as small as a linear model
          can on that training set — as in the upcoming notebook.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Build X with a bias column, then compute XᵀX and Xᵀy.',
          'Solve XᵀX θ = Xᵀy (OLS) for the optimal parameter vector.',
          'Example recovered θ = [1, 2, 3] for ŷ = 1 + 2x₁ + 3x₂.',
          'Zero residuals here confirm the calculus condition ∇J = 0.',
        ]}
      />
    </LessonArticle>
  )
}
