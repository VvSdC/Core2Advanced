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

export function MlrIntroduction() {
  return (
    <LessonArticle>
      <Definition term="Multiple Linear Regression">
        <p>
          <strong className="text-white">Multiple linear regression (MLR)</strong> predicts a numeric
          target <span className="font-mono text-sm text-machine-learning-400">y</span> from{' '}
          <strong className="text-white">two or more</strong> numeric features using a linear
          combination:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          ŷ = θ₀ + θ₁x₁ + θ₂x₂ + … + θₙxₙ
        </p>
        <p className="mt-2 text-slate-300">
          Same idea as simple linear regression — still a “flat” linear model — but now the prediction
          surface can tilt in several feature directions at once.
        </p>
      </Definition>

      <Callout variant="beginner" title="What stayed the same">
        You still learn parameters by minimizing a cost (usually MSE), still care about train/test
        metrics, and still interpret each θⱼ as “how ŷ changes when that feature increases by 1,
        holding others fixed.”
      </Callout>

      <LessonSection title="A concrete story">
        <p className="text-slate-300">
          House price might depend on <strong className="text-white">size</strong> and{' '}
          <strong className="text-white">bedrooms</strong> together — not size alone. MLR fits one
          intercept and one weight per feature.
        </p>
        <Example title="Mental picture">
{`ŷ = θ₀ + θ₁·(size) + θ₂·(bedrooms)

θ₁ > 0 → larger homes → higher predicted price
θ₂ > 0 → more bedrooms → higher predicted price (given size)`}
        </Example>
        <Flowchart
          title="From several inputs to one number"
          chart={`flowchart TB
  A[Feature x₁] --> D[Linear combination]
  B[Feature x₂] --> D
  C[Feature xₙ] --> D
  E[Intercept θ₀] --> D
  D --> F[Prediction ŷ]`}
        />
      </LessonSection>

      <LessonSection title="What you will learn in this sub-topic">
        <ContentStep number={1} title="SLR vs MLR">
          <p className="text-slate-300">Clear differences in equation, geometry, and when you need MLR.</p>
        </ContentStep>
        <ContentStep number={2} title="Math path">
          <p className="text-slate-300">
            Vector/matrix form, cost, derivatives, OLS normal equation, and a worked numeric example.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Notebook">
          <p className="text-slate-300">
            Sample multi-feature data, step-by-step code, outputs, and scikit-learn / OLS practice.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multiple linear regression uses two or more features in one linear prediction.',
          'Equation: ŷ = θ₀ + θ₁x₁ + … + θₙxₙ.',
          'Core learning loop matches SLR: minimize cost, evaluate, interpret weights.',
          'This track mirrors SLR: intro → math → cost → derivatives/OLS → example → notebook.',
        ]}
      />
    </LessonArticle>
  )
}
