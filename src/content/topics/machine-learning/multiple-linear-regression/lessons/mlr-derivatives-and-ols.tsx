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

export function MlrDerivativesAndOls() {
  return (
    <LessonArticle>
      <Definition term="Gradient of J and OLS">
        <p>
          To minimize J(θ), compute the gradient ∇J and set it to{' '}
          <strong className="text-white">zero</strong>. For squared error that yields the{' '}
          <strong className="text-white">normal equation</strong> (Ordinary Least Squares):
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          θ = (XᵀX)⁻¹ Xᵀ y
        </p>
        <p className="mt-2 text-slate-300">
          (When XᵀX is invertible — full column rank, enough independent information in the features.)
        </p>
      </Definition>

      <LessonSection title="Why set the gradient to zero?">
        <p className="text-slate-300">
          Same reason as in SLR: at the bottom of the MSE bowl the surface is flat in every θ
          direction, so every partial derivative is 0.
        </p>
        <Flowchart
          title="From cost to OLS"
          chart={`flowchart TB
  A["Jθ = (1/2m)·‖Xθ − y‖²"] --> B[Compute ∇Jθ]
  B --> C["Set ∇Jθ = 0"]
  C --> D["XᵀX θ = Xᵀ y"]
  D --> E["θ = (XᵀX)⁻¹ Xᵀ y"]`}
        />
      </LessonSection>

      <LessonSection title="Derivative (gradient) of the cost">
        <ContentStep number={1} title="Component-wise (like SLR, many times)">
          <p className="text-slate-300">For each parameter j = 0…n:</p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
            ∂J/∂θⱼ = (1/m) · Σᵢ (hθ(x⁽ⁱ⁾) − y⁽ⁱ⁾) · xⱼ⁽ⁱ⁾
          </div>
          <p className="mt-3 text-slate-300">
            With x₀⁽ⁱ⁾ = 1, the j = 0 case matches the SLR intercept gradient.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Vector form">
          <div className="mt-1 space-y-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
            <p>∇J(θ) = (1/m) · Xᵀ (Xθ − y)</p>
          </div>
          <Callout variant="beginner">
            One matrix expression replaces n+1 separate derivative formulas.
          </Callout>
        </ContentStep>
        <ContentStep number={3} title="Set gradient to zero">
          <Example title="Normal equations">
{`∇J(θ) = 0
⇒ Xᵀ (Xθ − y) = 0
⇒ XᵀX θ = Xᵀ y

If XᵀX is invertible:
θ = (XᵀX)⁻¹ Xᵀ y`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="OLS in words">
        <p className="text-slate-300">
          <strong className="text-white">Ordinary Least Squares</strong> finds the θ that minimizes
          the sum of squared residuals. The normal equation is that solution in closed form —
          generalization of the SLR slope/intercept formulas.
        </p>
        <Callout variant="tip" title="Gradient descent still matters">
          For huge feature counts or streaming data, iterative methods (GD, SGD) approximate the same
          minimum without forming (XᵀX)⁻¹. For small/medium tabular problems, OLS is the default.
        </Callout>
        <Callout variant="insight" title="Link to SLR">
          With one feature (plus bias column), solving XᵀX θ = Xᵀy recovers θ₀ = ȳ − θ₁x̄ and
          θ₁ = Cov(x,y)/Var(x).
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '∂J/∂θⱼ = (1/m) Σ (ŷ − y) xⱼ — same pattern as SLR for every feature.',
          'Vector gradient: ∇J = (1/m) Xᵀ(Xθ − y).',
          'Set ∇J = 0 ⇒ XᵀX θ = Xᵀy ⇒ OLS solution θ = (XᵀX)⁻¹Xᵀy.',
          'OLS is the exact least-squares fit when the normal equations are solvable.',
        ]}
      />
    </LessonArticle>
  )
}
