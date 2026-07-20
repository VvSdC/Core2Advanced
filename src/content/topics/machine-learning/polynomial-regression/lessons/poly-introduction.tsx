import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PolyIntroduction() {
  return (
    <LessonArticle>
      <Definition term="Polynomial Regression">
        <p>
          <strong className="text-white">Polynomial regression</strong> fits a{' '}
          <strong className="text-white">curved</strong> relationship between features and a numeric
          target by adding powers of the original inputs (x², x³, …) as extra columns, then running
          the same linear-in-parameters model you already know:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          ŷ = θ₀ + θ₁x + θ₂x² + … + θₖxᵏ
        </p>
        <p className="mt-2 text-slate-300">
          It looks nonlinear in x, but it is still <strong className="text-white">linear in θ</strong>{' '}
          — so cost, OLS, and gradient descent all carry over.
        </p>
      </Definition>

      <Callout variant="beginner" title="One-line intuition">
        If a straight line misses a clear bend in the scatter plot, try a polynomial curve — usually
        by expanding features and fitting ordinary linear regression on that expansion.
      </Callout>

      <LessonSection title="What this sub-topic covers">
        <ContentStep number={1} title="When to choose it">
          <p className="text-slate-300">
            Visual and residual clues that a linear model is the wrong shape.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Vs linear regression">
          <p className="text-slate-300">What changes in geometry and features — and what stays identical in training.</p>
        </ContentStep>
        <ContentStep number={3} title="Math → notebook → metrics">
          <p className="text-slate-300">
            Formulas, cost, derivatives/OLS, a worked example, a full notebook, and how to read MAE/MSE/RMSE
            when comparing degrees.
          </p>
        </ContentStep>
        <Flowchart
          title="Big picture"
          chart={`flowchart TB
  A[Raw feature x] --> B[Add x², x³, …]
  B --> C[Design matrix Φ]
  C --> D[Linear model in θ]
  D --> E[OLS or gradient descent]
  E --> F[Curved ŷ vs x]`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Polynomial regression models curves using powers of features.',
          'The model is nonlinear in x but linear in the parameters θ.',
          'Training reuses MSE cost and OLS / gradient descent.',
          'Degree k controls flexibility — and overfitting risk.',
        ]}
      />
    </LessonArticle>
  )
}
