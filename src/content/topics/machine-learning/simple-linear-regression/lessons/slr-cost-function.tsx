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

export function SlrCostFunction() {
  return (
    <LessonArticle>
      <Definition term="Cost Function">
        <p>
          A <strong className="text-white">cost function</strong> J(θ) measures how bad the current
          parameters are. For regression we usually use{' '}
          <strong className="text-white">Mean Squared Error (MSE)</strong>: average of squared
          differences between predictions and true labels.
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          J(θ₀, θ₁) = (1 / 2m) · Σ (hθ(x⁽ⁱ⁾) − y⁽ⁱ⁾)²
        </p>
        <p className="mt-2 text-slate-300">
          m = number of training examples. The 1/2 is a convenience so derivatives look cleaner.
        </p>
      </Definition>

      <LessonSection title="Why square the errors?">
        <ContentStep number={1} title="Punish big mistakes more">
          <p className="text-slate-300">
            An error of 10 costs 100 after squaring; an error of 2 costs 4. Large misses dominate —
            which is often what we want.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Positive & negative cancel without squares">
          <p className="text-slate-300">
            Raw errors can cancel (+5 and −5 → 0). Squared errors are always ≥ 0, so they accumulate.
          </p>
        </ContentStep>
        <Flowchart
          title="From parameters to a single cost number"
          chart={`flowchart TB
  A["Pick θ₀, θ₁"] --> B[Predict ŷ for every example]
  B --> C[Error = ŷ − y]
  C --> D[Square errors]
  D --> E[Average → Jθ]
  E --> F{Small J?}
  F -- No --> G[Try better θ]
  F -- Yes --> H[Good fit]`}
        />
      </LessonSection>

      <LessonSection title="Tiny numeric walkthrough">
        <p className="text-slate-300">
          Three points, and a guess θ₀ = 0, θ₁ = 1 (line ŷ = x):
        </p>
        <Example
          title="Compute MSE by hand"
          output={`errors squared: 0, 1, 4
sum = 5
J = (1/(2*3)) * 5 ≈ 0.833`}
        >
{`# x: 1, 2, 3
# y: 1, 3, 5
# θ₀=0, θ₁=1  → ŷ = 1, 2, 3

errors: (1-1)=0, (2-3)=-1, (3-5)=-2
squared: 0, 1, 4
J = (0+1+4) / (2*3) = 5/6 ≈ 0.833`}
        </Example>
        <Callout variant="tip" title="Better parameters → lower J">
          If we used θ₀ = −1, θ₁ = 2 → ŷ = 1, 3, 5 exactly → J = 0. Perfect fit on this toy set.
        </Callout>
      </LessonSection>

      <LessonSection title="The cost surface intuition">
        <p className="text-slate-300">
          Imagine a 3D bowl: axes θ₀, θ₁, and height = J. Training walks downhill toward the bottom of
          the bowl — the parameters with lowest cost.
        </p>
        <Flowchart
          title="Goal of training"
          chart={`flowchart TB
  A[Any starting θ₀, θ₁] --> B[Compute J]
  B --> C[Move θ to reduce J]
  C --> D{Converged?}
  D -- No --> B
  D -- Yes --> E[Final line]`}
        />
        <Callout variant="beginner">
          For linear regression with MSE, the bowl is convex — one global minimum. That is why this
          problem is a friendly first encounter with optimization.
        </Callout>
        <Callout variant="info" title="Next: solve for θ exactly">
          The next lesson shows the mathematical approach — differentiate J, set ∂J/∂θ₀ = ∂J/∂θ₁ = 0,
          derive the normal equations, and work a full numeric example to get optimal θ₀ and θ₁.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Cost J(θ) scores how wrong the current line is on the training set.',
          'MSE averages squared residuals; lower is better.',
          'Squaring emphasizes large errors and avoids positive/negative cancellation.',
          'Training = search for θ₀, θ₁ that minimize J.',
        ]}
      />
    </LessonArticle>
  )
}
