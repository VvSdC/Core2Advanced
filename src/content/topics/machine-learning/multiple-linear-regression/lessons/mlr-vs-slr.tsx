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

export function MlrVsSlr() {
  return (
    <LessonArticle>
      <Definition term="Simple vs Multiple Linear Regression">
        <p>
          <strong className="text-white">Simple</strong> linear regression uses{' '}
          <strong className="text-white">one</strong> feature. <strong className="text-white">Multiple</strong>{' '}
          linear regression uses <strong className="text-white">two or more</strong>. Both are linear in
          the parameters θ; the jump is mainly dimensionality and matrix notation.
        </p>
      </Definition>

      <LessonSection title="Side-by-side">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3"></th>
                <th className="px-4 py-3">Simple (SLR)</th>
                <th className="px-4 py-3">Multiple (MLR)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Features', 'One: x', 'Several: x₁, x₂, …, xₙ'],
                ['Hypothesis', 'ŷ = θ₀ + θ₁x', 'ŷ = θ₀ + θ₁x₁ + … + θₙxₙ'],
                ['Geometry', 'Line in 2D', 'Plane / hyperplane in higher D'],
                ['Parameters', 'θ₀, θ₁', 'θ₀, θ₁, …, θₙ'],
                ['Typical OLS view', 'Slope & intercept formulas', 'θ = (XᵀX)⁻¹Xᵀy'],
                ['Use when', 'One clear predictor', 'Several predictors matter together'],
              ].map(([row, slr, mlr]) => (
                <tr key={row} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{row}</td>
                  <td className="px-4 py-3">{slr}</td>
                  <td className="px-4 py-3">{mlr}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Same learning goals">
        <Flowchart
          title="Shared pipeline"
          chart={`flowchart TB
  A[Labeled data] --> B[Hypothesis]
  B --> C[Cost Jθ]
  C --> D[Minimize J]
  D --> E[OLS and/or gradient descent]
  E --> F[Evaluate MAE / MSE / RMSE]`}
        />
        <ContentStep number={1} title="Cost is still MSE-style">
          <p className="text-slate-300">
            Average squared residual across examples — only predictions use more features.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Derivatives still point downhill">
          <p className="text-slate-300">
            Set ∇J = 0 for the exact optimum, or walk with gradient descent. SLR was the 2-parameter
            special case.
          </p>
        </ContentStep>
        <Example title="When SLR is not enough">
{`Predict exam score from hours studied only     → SLR may be enough
Predict price from size AND bedrooms AND age → need MLR`}
        </Example>
        <Callout variant="tip" title="Interpretation caution">
          In MLR, θⱼ is the effect of xⱼ <em>given the other features in the model</em>. Correlated
          features can make individual weights harder to read — a topic for later (multicollinearity).
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SLR: one feature and a line. MLR: many features and a hyperplane.',
          'Both minimize a squared-error cost and share the same evaluation ideas.',
          'MLR needs vector/matrix notation to stay tidy as n grows.',
          'Choose MLR when one predictor cannot capture the pattern alone.',
        ]}
      />
    </LessonArticle>
  )
}
