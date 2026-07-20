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

export function PolyVsLinear() {
  return (
    <LessonArticle>
      <Definition term="Polynomial vs Linear Regression">
        <p>
          <strong className="text-white">Linear regression</strong> (simple or multiple) fits a
          hyperplane in the original features.{' '}
          <strong className="text-white">Polynomial regression</strong> fits a curve (or curved
          surface) in those originals by training a linear model on{' '}
          <strong className="text-white">polynomial feature expansions</strong>.
        </p>
      </Definition>

      <LessonSection title="Side-by-side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Linear (SLR / MLR)</th>
                <th className="px-4 py-3">Polynomial</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Shape in x-space', 'Straight line / flat plane', 'Curve / wavy surface'],
                ['Features used', 'Raw x₁…xₙ', 'x, x², … and maybe interactions'],
                ['Linearity in θ', 'Yes', 'Yes (after expansion)'],
                ['Cost / OLS', 'MSE + normal equations', 'Identical on expanded X'],
                ['Main extra knob', 'Which features to include', 'Polynomial degree k'],
                ['Overfit risk', 'Moderate', 'Grows fast with k'],
              ].map(([row, lin, poly]) => (
                <tr key={row} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{row}</td>
                  <td className="px-4 py-3">{lin}</td>
                  <td className="px-4 py-3">{poly}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="The key insight">
        <Flowchart
          title="Same learner, richer features"
          chart={`flowchart TB
  A[Original x] --> B{Model type}
  B -- Linear --> C["X = [1, x]"]
  B -- Polynomial deg 2 --> D["Φ = [1, x, x²]"]
  C --> E[Fit θ with OLS]
  D --> E
  E --> F[Predictions]`}
        />
        <ContentStep number={1} title="Not a new optimizer">
          <p className="text-slate-300">
            You are not inventing a separate “polynomial gradient descent.” You expand columns, then
            call the same LinearRegression / normal equation as MLR.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Nonlinear look, linear math">
          <p className="text-slate-300">
            Plot ŷ against x and you see a curve. Plot ŷ against the expanded features and the model
            is still a hyperplane in that higher-dimensional space.
          </p>
        </ContentStep>
        <Example title="Equations at a glance">
{`Linear (simple):     ŷ = θ₀ + θ₁ x
Polynomial (deg 2):  ŷ = θ₀ + θ₁ x + θ₂ x²
Polynomial (deg 3):  ŷ = θ₀ + θ₁ x + θ₂ x² + θ₃ x³`}
        </Example>
        <Callout variant="insight" title="With multiple original inputs">
          Degree 2 on (x₁, x₂) can include x₁², x₂², and x₁x₂. That is still linear regression on
          those engineered columns — a bridge between MLR and feature engineering.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Linear regression is straight in the original features; polynomial is curved there.',
          'Polynomial regression = linear regression on polynomial (and interaction) features.',
          'Training math (MSE, OLS, GD) is the same as MLR on the expanded matrix.',
          'Degree is the main new hyperparameter — watch overfitting as k grows.',
        ]}
      />
    </LessonArticle>
  )
}
