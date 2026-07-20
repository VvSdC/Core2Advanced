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

export function PolyDerivativesAndOls() {
  return (
    <LessonArticle>
      <Definition term="OLS for Polynomial Features">
        <p>
          Differentiate J with respect to θ, set the gradient to zero, and solve. With design matrix
          Φ of polynomial features:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          θ = (ΦᵀΦ)⁻¹ Φᵀ y
        </p>
        <p className="mt-2 text-slate-300">
          Identical to MLR OLS — Φ plays the role of X.
        </p>
      </Definition>

      <LessonSection title="Gradient and normal equation">
        <ContentStep number={1} title="Gradient">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
            ∇J(θ) = (1/m) · Φᵀ (Φθ − y)
          </div>
        </ContentStep>
        <ContentStep number={2} title="Set ∇J = 0">
          <Example title="Normal equations">
{`Φᵀ (Φθ − y) = 0
ΦᵀΦ θ = Φᵀ y
θ = (ΦᵀΦ)⁻¹ Φᵀ y   # if ΦᵀΦ invertible`}
          </Example>
        </ContentStep>
        <Flowchart
          title="Math path"
          chart={`flowchart TB
  A[Build Φ from degree k] --> B[Form ΦᵀΦ and Φᵀy]
  B --> C[Solve for θ]
  C --> D[Curved predictions vs x]`}
        />
        <Callout variant="beginner">
          Why differentiate? Same story as SLR/MLR: at the MSE minimum the slope in every θ direction
          is zero. Polynomial features do not change that logic.
        </Callout>
        <Callout variant="tip" title="Numerical note">
          High degree → columns like xᵏ can be huge or tiny. Scaling x (e.g. standardization) before
          expanding often makes ΦᵀΦ better conditioned.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          '∇J = (1/m) Φᵀ(Φθ − y); set to zero for the optimum.',
          'OLS solution: θ = (ΦᵀΦ)⁻¹ Φᵀ y.',
          'This is MLR on polynomial columns — not a separate algorithm.',
          'Scale features when using higher degrees to keep Φ stable.',
        ]}
      />
    </LessonArticle>
  )
}
