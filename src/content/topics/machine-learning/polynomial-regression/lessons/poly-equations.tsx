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

export function PolyEquations() {
  return (
    <LessonArticle>
      <Definition term="Polynomial Hypothesis">
        <p>
          For one raw input x and degree k:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          hθ(x) = θ₀ + θ₁x + θ₂x² + … + θₖxᵏ
        </p>
        <p className="mt-2 text-slate-300">
          Define φ(x) = [1, x, x², …, xᵏ]ᵀ. Then{' '}
          <span className="font-mono text-sm text-white">hθ(x) = θᵀ φ(x)</span> — exactly MLR form.
        </p>
      </Definition>

      <LessonSection title="Feature map φ(x)">
        <ContentStep number={1} title="Degree 2 expansion">
          <Example title="One row → three columns">
{`x = 3
φ(x) = [1, 3, 9]     # 1, x, x²
ŷ = θ₀ + 3θ₁ + 9θ₂`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Design matrix Φ for m examples">
          <p className="text-slate-300">
            Stack φ(x⁽ⁱ⁾)ᵀ as rows. Shape is m × (k+1). Then ŷ = Φθ.
          </p>
          <Flowchart
            title="From x to Φ"
            chart={`flowchart TB
  A["x⁽¹⁾ … x⁽ᵐ⁾"] --> B["Build φ: 1, x, x², …"]
  B --> C["Φ matrix m × (k+1)"]
  C --> D["ŷ = Φθ"]`}
          />
        </ContentStep>
        <Callout variant="beginner">
          Naming: people say “polynomial regression,” but under the hood the columns of Φ are just
          extra features for ordinary linear regression.
        </Callout>
      </LessonSection>

      <LessonSection title="Two inputs (preview)">
        <Example title="Degree 2 in x₁, x₂">
{`φ = [1, x₁, x₂, x₁², x₂², x₁x₂]
ŷ = θᵀ φ

# Includes pure powers and the interaction x₁x₂`}
        </Example>
        <Callout variant="tip" title="Feature count grows fast">
          Higher degree + many raw inputs → many columns. That is why we start with degree 2 and
          validate carefully.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Degree-k polynomial: ŷ = θ₀ + θ₁x + … + θₖxᵏ.',
          'φ(x) packs [1, x, …, xᵏ]; hθ(x) = θᵀφ(x).',
          'Φ is the design matrix of expanded features for all rows.',
          'Multiple inputs add powers and interactions inside φ.',
        ]}
      />
    </LessonArticle>
  )
}
