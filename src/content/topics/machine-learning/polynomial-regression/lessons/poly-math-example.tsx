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

export function PolyMathExample() {
  return (
    <LessonArticle>
      <Definition term="Worked Polynomial Example">
        <p>
          Five points generated from <span className="font-mono text-sm text-white">y = 1 + 2x + 0.5 x²</span>.
          We build Φ for degree 2, solve OLS, and recover θ = [1, 2, 0.5]ᵀ exactly.
        </p>
      </Definition>

      <LessonSection title="Sample data">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">x</th>
                <th className="px-4 py-3">x²</th>
                <th className="px-4 py-3">y = 1+2x+0.5x²</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['0', '0', '1'],
                ['1', '1', '3.5'],
                ['2', '4', '7'],
                ['3', '9', '11.5'],
                ['4', '16', '17'],
              ].map(([x, x2, y]) => (
                <tr key={x} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono">{x}</td>
                  <td className="px-4 py-3 font-mono">{x2}</td>
                  <td className="px-4 py-3 font-mono text-white">{y}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner">
          A straight line through these points cannot hit all of them; a quadratic can — and OLS will
          find it.
        </Callout>
      </LessonSection>

      <LessonSection title="Step 1 — design matrix Φ">
        <Example title="Columns [1, x, x²]">
{`Φ = | 1  0  0  |
    | 1  1  1  |
    | 1  2  4  |
    | 1  3  9  |
    | 1  4  16 |

y = [1, 3.5, 7, 11.5, 17]ᵀ`}
        </Example>
      </LessonSection>

      <LessonSection title="Step 2 — solve ΦᵀΦ θ = Φᵀy">
        <Flowchart
          title="OLS on polynomial features"
          chart={`flowchart TB
  A[Φ and y] --> B[ΦᵀΦ θ = Φᵀ y]
  B --> C["θ = [1, 2, 0.5]ᵀ"]
  C --> D[ŷ matches y exactly]`}
        />
        <Example title="Result" output={`θ₀ = 1\nθ₁ = 2\nθ₂ = 0.5`}>
{`θ = (ΦᵀΦ)⁻¹ Φᵀ y
  = [1, 2, 0.5]ᵀ

Hypothesis recovered:
ŷ = 1 + 2x + 0.5 x²`}
        </Example>
      </LessonSection>

      <LessonSection title="Step 3 — verify">
        <ContentStep number={1} title="Predictions">
          <p className="text-slate-300">
            For x = 3: ŷ = 1 + 2·3 + 0.5·9 = 1 + 6 + 4.5 = 11.5 = y. All five rows match → J = 0.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What a linear-only model would do">
          <p className="text-slate-300">
            Fitting only [1, x] leaves systematic curved residuals. Adding the x² column removes them
            here.
          </p>
        </ContentStep>
        <Callout variant="insight">
          With noisy real data you will not get J = 0, but the same algebra yields the best quadratic
          (in the least-squares sense) for your Φ.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Build Φ with [1, x, x², …] then apply standard OLS.',
          'Example recovers θ = [1, 2, 0.5] for y = 1 + 2x + 0.5x².',
          'Perfect recovery when data are generated from that polynomial.',
          'Linear-only features would underfit this curved pattern.',
        ]}
      />
    </LessonArticle>
  )
}
