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

export function PolyPerformanceMetrics() {
  return (
    <LessonArticle>
      <Definition term="Metrics for Polynomial Models">
        <p>
          Use the same regression scoreboard — <strong className="text-white">MAE</strong>,{' '}
          <strong className="text-white">MSE</strong>, <strong className="text-white">RMSE</strong>,
          and optionally <strong className="text-white">R²</strong> — but always compare them across{' '}
          <strong className="text-white">degrees</strong> on validation / test data, not only on the
          training set.
        </p>
      </Definition>

      <LessonSection title="Same formulas as linear regression">
        <div className="space-y-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-white">
          <p>MAE = (1/m) Σ |y − ŷ|</p>
          <p>MSE = (1/m) Σ (y − ŷ)²</p>
          <p>RMSE = √MSE</p>
        </div>
        <Callout variant="beginner">
          Polynomial vs linear is a model-class choice. Metrics do not change — your interpretation
          of “did raising degree help?” does.
        </Callout>
      </LessonSection>

      <LessonSection title="How to use metrics to pick a degree">
        <Flowchart
          title="Degree selection loop"
          chart={`flowchart TB
  A[Degree 1 linear] --> B[Record val RMSE / MAE]
  B --> C[Degree 2]
  C --> D[Record val metrics]
  D --> E[Degree 3 …]
  E --> F{Val error still dropping?}
  F -- Yes carefully --> E
  F -- No / train≪val --> G[Stop — pick best val degree]`}
        />
        <ContentStep number={1} title="Watch train vs validation gap">
          <p className="text-slate-300">
            Train RMSE → 0 while val RMSE rises means the polynomial is wiggling through noise
            (overfit). Prefer the degree with best validation score.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Compare against linear baseline">
          <p className="text-slate-300">
            If degree 2 barely beats degree 1 on val data, keep the simpler line — easier to explain
            and often more robust.
          </p>
        </ContentStep>
        <Example title="Reading a comparison table">
{`Model        Train RMSE   Val RMSE
Linear       2.30         2.45
Poly deg 2   0.08         0.15    ← clear win
Poly deg 6   0.01         0.90    ← overfit`}
        </Example>
        <Callout variant="tip" title="RMSE vs MAE">
          Use both. If RMSE ≫ MAE after raising degree, a few wild swings (typical of high-degree
          polynomials near the edges) may be hurting you.
        </Callout>
      </LessonSection>

      <LessonSection title="Extra polynomial-specific checks">
        <ContentStep number={1} title="Plot the fit">
          <p className="text-slate-300">
            Metrics summarize; a plot shows Runge-style oscillations at the ends of the x range.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Extrapolate with care">
          <p className="text-slate-300">
            High-degree polynomials can explode outside the training x range even when in-sample
            RMSE looks great.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MAE, MSE, and RMSE are unchanged — apply them on holdout data by degree.',
          'Pick the degree that wins on validation, not the one that memorizes training.',
          'A large train/val gap signals overfitting from too high a degree.',
          'Always keep a linear baseline in the comparison table.',
        ]}
      />
    </LessonArticle>
  )
}
