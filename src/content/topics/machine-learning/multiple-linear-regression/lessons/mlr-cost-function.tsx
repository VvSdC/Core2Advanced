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

export function MlrCostFunction() {
  return (
    <LessonArticle>
      <Definition term="MLR Cost Function">
        <p>
          Same squared-error idea as SLR. With predictions hθ(x⁽ⁱ⁾) for each of m examples:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          J(θ) = (1 / 2m) · Σᵢ₌₁ᵐ (hθ(x⁽ⁱ⁾) − y⁽ⁱ⁾)²
        </p>
        <p className="mt-2 text-slate-300">
          In matrix form:{' '}
          <span className="font-mono text-sm text-white">J(θ) = (1 / 2m) · ‖Xθ − y‖²</span>
        </p>
      </Definition>

      <LessonSection title="What changed from SLR?">
        <ContentStep number={1} title="Hypothesis inside the sum">
          <p className="text-slate-300">
            hθ now uses many features, but the outer cost — average of squares — is unchanged.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Parameter space is bigger">
          <p className="text-slate-300">
            J is a function of a whole vector θ. The “bowl” lives in higher dimensions; for MSE it is
            still convex when X has full column rank.
          </p>
        </ContentStep>
        <Flowchart
          title="Cost pipeline"
          chart={`flowchart TB
  A[θ vector] --> B["ŷ = Xθ"]
  B --> C[Residuals ŷ − y]
  C --> D[Square and average]
  D --> E[Scalar cost Jθ]`}
        />
        <Example title="Tiny numeric feel">
{`If three examples have errors 1, -2, 0:
Σ error² = 1 + 4 + 0 = 5
J = 5 / (2·3) ≈ 0.833

# Same arithmetic as SLR — only how ŷ was formed differs.`}
        </Example>
        <Callout variant="info" title="Next">
          We differentiate J with respect to every θⱼ (the gradient), set it to zero, and obtain the
          OLS normal equation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MLR cost is still mean squared error over training examples.',
          'Matrix form: J(θ) = (1/2m)·‖Xθ − y‖².',
          'Only the hypothesis inside changes; the loss idea matches SLR.',
          'Minimizing J finds the best linear weights for the given features.',
        ]}
      />
    </LessonArticle>
  )
}
