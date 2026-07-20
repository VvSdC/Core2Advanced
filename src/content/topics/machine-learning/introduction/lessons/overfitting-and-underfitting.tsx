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

export function OverfittingAndUnderfitting() {
  return (
    <LessonArticle>
      <Definition term="Overfitting & Underfitting">
        <p>
          <strong className="text-white">Underfitting</strong> means the model is too simple to
          capture the real pattern — poor on training and new data.{' '}
          <strong className="text-white">Overfitting</strong> means the model is so flexible it
          memorizes training quirks — great on training, weak on new data.
        </p>
      </Definition>

      <LessonSection title="The Goldilocks picture">
        <Flowchart
          title="Three fits to the same data"
          chart={`flowchart TB
  A[Training examples] --> B{Model capacity}
  B -- Too low --> C[Underfit: high bias]
  B -- Too high --> D[Overfit: high variance]
  B -- Balanced --> E[Good fit: generalizes]`}
        />
        <Example title="Curve-fitting intuition">
{`True pattern: a gentle curve.

Underfit:  draw a straight line — misses the bend.
Overfit:   wiggle through every point — including noise.
Good fit:  smooth curve close to the truth.`}
        </Example>
        <Callout variant="beginner">
          Bias ≈ systematic error from a model that is too rigid. Variance ≈ sensitivity to whatever
          sample of training data you happened to get.
        </Callout>
      </LessonSection>

      <LessonSection title="How to spot them">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Symptom</th>
                <th className="px-4 py-3">Likely issue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Train and val both poor', 'Underfitting'],
                ['Train excellent, val poor', 'Overfitting'],
                ['Train and val both good', 'Healthy (check test too)'],
                ['Val good, test suddenly poor', 'Test leakage / unlucky split / drift'],
              ].map(([symptom, issue]) => (
                <tr key={symptom} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3">{symptom}</td>
                  <td className="px-4 py-3 font-medium text-white">{issue}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Fixes that actually help">
        <ContentStep number={1} title="Fight underfitting">
          <p className="text-slate-300">
            Use a richer model, better features, train longer, or reduce excessive regularization. Make
            sure the model family can express the pattern at all.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fight overfitting">
          <p className="text-slate-300">
            Get more data, simplify the model, drop noisy features, use regularization, dropout, early
            stopping, or data augmentation (for images/text).
          </p>
        </ContentStep>
        <Flowchart
          title="A practical tuning loop"
          chart={`flowchart TB
  A[Compare train vs val error] --> B{Gap?}
  B -- Both high --> C[Increase capacity / improve features]
  B -- Train low Val high --> D[Regularize / simplify / more data]
  B -- Both low --> E[Evaluate on test / prepare deploy]`}
        />
        <Callout variant="tip" title="Regularization in one sentence">
          Regularization adds a preference for simpler models so the optimizer does not chase every
          training wiggle.
        </Callout>
      </LessonSection>

      <LessonSection title="More data vs smarter model">
        <p className="text-slate-300">
          Extra clean, representative data is the most reliable cure for overfitting. A smarter
          architecture helps when you are underfitting or when the data is already rich (images,
          language).
        </p>
        <Callout variant="insight">
          Perfect training accuracy is not a trophy — it can be a warning light. Care about the gap
          between train and validation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Underfitting: too simple — weak on train and new data.',
          'Overfitting: too complex — strong on train, weak on new data.',
          'Compare train vs validation metrics to diagnose which problem you have.',
          'Fix underfit with capacity/features; fix overfit with data, simplicity, and regularization.',
        ]}
      />
    </LessonArticle>
  )
}
