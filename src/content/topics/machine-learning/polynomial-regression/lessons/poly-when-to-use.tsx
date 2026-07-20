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

export function PolyWhenToUse() {
  return (
    <LessonArticle>
      <Definition term="When to Use Polynomial Regression">
        <p>
          Choose polynomial regression when the link between inputs and the target is{' '}
          <strong className="text-white">smooth but curved</strong> — a straight line systematically
          underfits, yet you still want an interpretable parametric model before jumping to trees or
          neural nets.
        </p>
      </Definition>

      <LessonSection title="Decision checklist">
        <Flowchart
          title="Is polynomial regression a good fit?"
          chart={`flowchart TB
  A[Plot y vs x] --> B{Clear curve / U-shape / bend?}
  B -- No --> C[Stay with linear / MLR]
  B -- Yes --> D[Fit linear baseline]
  D --> E{Residuals still curved?}
  E -- No --> C
  E -- Yes --> F[Try degree 2, then 3]
  F --> G{Val metrics improve without wild wiggles?}
  G -- Yes --> H[Use polynomial features]
  G -- No --> I[More data / other model family]`}
        />
        <ContentStep number={1} title="Scatter plot shows a bend">
          <p className="text-slate-300">
            Classic signs: U-shape, inverted U, accelerating growth, diminishing returns. A line cuts
            through the cloud with patterned leftovers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Linear residuals are not random">
          <p className="text-slate-300">
            After fitting SLR/MLR, plot residuals vs x. A smile or frown pattern means the model
            missed curvature — polynomial terms often fix that.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Domain suggests powers or interactions of one input">
          <p className="text-slate-300">
            Physics/engineering formulas with x², dose–response curves, or “returns diminish after a
            point” stories are natural polynomial candidates.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Good use cases vs poor fits">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lean toward polynomial</th>
                <th className="px-4 py-3">Probably not</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Smooth curve with one (or few) numeric drivers', 'Jagged / discontinuous patterns'],
                ['Clear quadratic trend in EDA', 'Need hard feature interactions across many vars'],
                ['Small–medium tabular data, want closed form', 'Huge feature spaces (prefer other models)'],
                ['You can validate degree on holdout data', 'Degree chasing on tiny samples'],
              ].map(([yes, no]) => (
                <tr key={yes} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-emerald-300/90">{yes}</td>
                  <td className="px-4 py-3 text-slate-400">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="Everyday stories">
{`Fuel efficiency vs speed          → often U-shaped → try degree 2
Crop yield vs fertilizer          → rises then flattens/falls
House price vs size alone         → sometimes mild curve; compare linear vs quadratic
Spam probability vs word count    → usually classification — not this tool`}
        </Example>
        <Callout variant="tip" title="Start simple">
          Always fit a linear baseline first. Only add x² / x³ if validation error drops for a clear
          reason — not because a high degree can memorize the training set.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use polynomial regression when scatter/residuals show smooth curvature.',
          'Confirm with a linear baseline and residual plots before raising degree.',
          'Domain stories with diminishing returns or U-shapes are strong signals.',
          'Validate degree on holdout data — higher k is not automatically better.',
        ]}
      />
    </LessonArticle>
  )
}
