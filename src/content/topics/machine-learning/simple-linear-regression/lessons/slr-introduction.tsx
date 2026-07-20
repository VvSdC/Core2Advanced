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

export function SlrIntroduction() {
  return (
    <LessonArticle>
      <Definition term="Simple Linear Regression">
        <p>
          <strong className="text-white">Simple linear regression</strong> predicts a numeric target{' '}
          <span className="font-mono text-sm text-machine-learning-400">y</span> from a single numeric
          feature <span className="font-mono text-sm text-machine-learning-400">x</span> using a{' '}
          <strong className="text-white">straight line</strong>:
        </p>
        <p className="mt-3 font-mono text-base text-white">
          ŷ = θ₀ + θ₁ · x
        </p>
        <p className="mt-2 text-slate-300">
          θ₀ is the intercept (where the line crosses the y-axis). θ₁ is the slope (how much ŷ changes
          when x increases by 1).
        </p>
      </Definition>

      <Callout variant="beginner" title="Why start here?">
        Almost every supervised idea — cost functions, gradient descent, train/test thinking — shows up
        first in this tiny model. Master the line; bigger models reuse the same playbook.
      </Callout>

      <LessonSection title="A concrete story">
        <p className="text-slate-300">
          You collect how many hours students studied (<strong className="text-white">x</strong>) and
          their exam scores (<strong className="text-white">y</strong>). You want a line that best
          summarizes the trend so you can estimate a score for a new student.
        </p>
        <Example title="Tiny dataset (preview)">
{`hours (x)   score (y)
1            45
2            52
3            61
4            68
5            74
…`}
        </Example>
        <Flowchart
          title="From data points to a line"
          chart={`flowchart TB
  A[Scatter: hours vs score] --> B[Fit a straight line]
  B --> C["ŷ = θ₀ + θ₁ · hours"]
  C --> D[Predict score for new hours]`}
        />
      </LessonSection>

      <LessonSection title="What “best” line means">
        <ContentStep number={1} title="Predictions vs reality">
          <p className="text-slate-300">
            For each training point, the line gives ŷ. The gap <span className="font-mono text-sm">y − ŷ</span>{' '}
            is the <strong className="text-white">error</strong> (residual).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Prefer small errors overall">
          <p className="text-slate-300">
            We choose θ₀ and θ₁ so total error (usually squared) across all points is as small as
            possible. That idea becomes the <strong className="text-white">cost function</strong> in
            the next lessons.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Simple ≠ weak">
          Many real problems start with one strong predictor. Simple linear regression is also the
          mental scaffold for <strong className="text-white">multiple linear regression</strong>{' '}
          (next sub-topic) and for linear layers in neural nets.
        </Callout>
      </LessonSection>

      <LessonSection title="What you will learn in this sub-topic">
        <ContentStep number={1} title="Equations">
          <p className="text-slate-300">Hypothesis, parameters, and how predictions are computed.</p>
        </ContentStep>
        <ContentStep number={2} title="Cost function">
          <p className="text-slate-300">Mean Squared Error — the number we minimize.</p>
        </ContentStep>
        <ContentStep number={3} title="Convergence algorithm">
          <p className="text-slate-300">Gradient descent — how parameters move toward a better fit.</p>
        </ContentStep>
        <ContentStep number={4} title="Two notebooks">
          <p className="text-slate-300">
            From-scratch code on 10 rows, then a real engineer-style workflow with EDA and scikit-learn.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Simple linear regression fits ŷ = θ₀ + θ₁x for one feature and one numeric target.',
          'θ₀ is intercept; θ₁ is slope — how y changes with x.',
          'We choose parameters to make prediction errors small across the training data.',
          'This model teaches the core loop used throughout supervised learning.',
        ]}
      />
    </LessonArticle>
  )
}
