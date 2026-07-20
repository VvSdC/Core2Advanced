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

export function MlrEquations() {
  return (
    <LessonArticle>
      <Definition term="MLR Hypothesis">
        <p>
          With n features, the prediction is:
        </p>
        <p className="mt-3 font-mono text-sm text-white md:text-base">
          hθ(x) = θ₀ + θ₁x₁ + θ₂x₂ + … + θₙxₙ
        </p>
        <p className="mt-2 text-slate-300">
          If we set x₀ = 1 for every example, this is the compact dot product{' '}
          <span className="font-mono text-sm text-white">hθ(x) = θᵀx</span>.
        </p>
      </Definition>

      <LessonSection title="Parameters and features">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symbol</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['x₁ … xₙ', 'Input features for one example'],
                ['x₀ = 1', 'Dummy feature so θ₀ fits in the vector'],
                ['θ₀', 'Intercept / bias'],
                ['θⱼ (j ≥ 1)', 'Weight for feature xⱼ'],
                ['θ', 'Parameter vector [θ₀, θ₁, …, θₙ]ᵀ'],
                ['X', 'Design matrix — rows are examples, columns are features (incl. x₀)'],
                ['y', 'Vector of labels'],
                ['ŷ = Xθ', 'All training predictions in one matrix multiply'],
              ].map(([sym, meaning]) => (
                <tr key={sym} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-machine-learning-400">{sym}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Matrix view">
        <ContentStep number={1} title="One example">
          <Example title="Dot product">
{`x = [1, x₁, x₂]ᵀ      # include bias 1
θ = [θ₀, θ₁, θ₂]ᵀ
ŷ = θᵀ x = θ₀ + θ₁x₁ + θ₂x₂`}
          </Example>
        </ContentStep>
        <ContentStep number={2} title="Whole dataset">
          <p className="text-slate-300">
            Stack examples as rows of <span className="font-mono text-sm">X</span> (m × (n+1)). Then:
          </p>
          <p className="mt-2 font-mono text-white">ŷ = Xθ</p>
          <Flowchart
            title="Shapes"
            chart={`flowchart TB
  A["X: m × (n+1)"] --> C["ŷ: m × 1"]
  B["θ: (n+1) × 1"] --> C
  D["y: m × 1"] --> E[Compare to ŷ]`}
          />
        </ContentStep>
        <Callout variant="beginner">
          Writing everything with matrices is not a new model — it is the neat way to handle many
          features without writing n separate update lines.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MLR hypothesis: ŷ = θ₀ + θ₁x₁ + … + θₙxₙ.',
          'With x₀ = 1, prediction is the dot product θᵀx.',
          'For m examples: ŷ = Xθ with design matrix X.',
          'Matrix form keeps formulas identical as feature count grows.',
        ]}
      />
    </LessonArticle>
  )
}
