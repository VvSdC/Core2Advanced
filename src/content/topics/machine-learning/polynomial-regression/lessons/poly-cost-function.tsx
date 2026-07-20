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

export function PolyCostFunction() {
  return (
    <LessonArticle>
      <Definition term="Cost for Polynomial Regression">
        <p>
          Same MSE cost as linear / multiple regression — only the prediction uses polynomial
          features:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          J(θ) = (1 / 2m) · Σᵢ (θᵀ φ(x⁽ⁱ⁾) − y⁽ⁱ⁾)² = (1 / 2m) · ‖Φθ − y‖²
        </p>
      </Definition>

      <LessonSection title="Nothing new in the loss">
        <Flowchart
          title="Cost path"
          chart={`flowchart TB
  A[θ] --> B["ŷ = Φθ"]
  B --> C[Residuals]
  C --> D[Square + average]
  D --> E[Jθ]`}
        />
        <ContentStep number={1} title="Why reuse MSE?">
          <p className="text-slate-300">
            We still want small average squared mistakes. Expanding features does not change that
            goal.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Where degree shows up">
          <p className="text-slate-300">
            Degree changes Φ (more columns), which changes the hypothesis class — not the formula for
            J.
          </p>
        </ContentStep>
        <Example title="Same number, richer ŷ">
{`errors = ŷ - y          # ŷ from θ₀+θ₁x+θ₂x²+…
J = mean(errors²) / 2   # identical recipe to SLR/MLR`}
        </Example>
        <Callout variant="info" title="Next">
          Set ∇J = 0 on the expanded features to get OLS: θ = (ΦᵀΦ)⁻¹ Φᵀ y.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Polynomial regression uses the same MSE cost as linear models.',
          'Matrix form: J(θ) = (1/2m)·‖Φθ − y‖².',
          'Degree affects Φ, not the definition of J.',
          'Minimizing J yields the best θ for that chosen degree.',
        ]}
      />
    </LessonArticle>
  )
}
