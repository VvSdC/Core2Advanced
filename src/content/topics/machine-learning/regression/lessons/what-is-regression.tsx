import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ScatterPlot,
} from '../../../../../components/content'

export function WhatIsRegression() {
  return (
    <LessonArticle>
      <Definition term="Regression">
        <p>
          A <strong className="text-white">regression</strong> algorithm learns a function from input
          features to a <strong className="text-white">numeric</strong> target. Given past examples
          (x, y), it produces a rule ŷ = f(x) that you can use on new x.
        </p>
        <p className="mt-2 text-slate-300">
          The simplest useful rule is a straight line — <strong className="text-white">simple linear
          regression</strong>: one input, one output, ŷ = θ₀ + θ₁x. Everything else in this track
          (many features, curves, regularisation) is a variation on that same idea. Come here
          after EDA and feature engineering: you already know what a row is and how the columns
          were fit on train.
        </p>
      </Definition>

      <LessonSection title="Intuition — the line is a story about the data">
        <p className="text-slate-300">
          You have hours studied and exam scores. More hours tend to mean higher scores. Regression
          turns that feeling into a repeatable rule: &ldquo;every extra hour is worth about 7 marks,
          starting from a base of 38.&rdquo;
        </p>
        <Example title="A tiny class notebook">
{`Student   Hours studied   Exam score
A         1               45
B         2               52
C         3               61
D         4               68
E         5               74`}
        </Example>
        <ScatterPlot
          title="The five students and one straight line"
          points={[
            { x: 1, y: 45 },
            { x: 2, y: 52 },
            { x: 3, y: 61 },
            { x: 4, y: 68 },
            { x: 5, y: 74 },
          ]}
          line={{ intercept: 38.5, slope: 7.2 }}
          xLabel="Hours studied"
          yLabel="Exam score"
          caption="Each dot is a student. The line is the model's rule — close to every point, never perfectly on all of them."
        />
      </LessonSection>

      <LessonSection title="When you should use it">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use regression when</th>
                <th className="px-4 py-3">Do not use it when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['The target is a number (price, score, temperature, demand)', 'The target is a category (spam / not spam, dog / cat)'],
                ['You need an interpretable “+1 feature → +Δŷ” story', 'The relationship is a wild non-linear mess and you only care about accuracy'],
                ['You have a baseline you can beat later with trees or nets', 'The labels are ranks or probabilities you already have as classes'],
                ['You want a fast, cheap, well-understood first model', 'You have almost no data and many noisy features (regularise first, or wait)'],
              ].map(([yes, no]) => (
                <tr key={yes}>
                  <td className="px-4 py-3 text-slate-300">{yes}</td>
                  <td className="px-4 py-3 text-slate-400">{no}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Classification is next door">
          Predicting &ldquo;will they pass?&rdquo; is classification. Predicting &ldquo;what score
          will they get?&rdquo; is regression. Same data, different target type — pick the algorithm
          family that matches the question.
        </Callout>
      </LessonSection>

      <LessonSection title="How the algorithm works — four moving parts">
        <Flowchart
          title="The regression loop"
          chart={`flowchart TB
  A[Collect labeled examples] --> B[Pick a hypothesis family]
  B --> C[Score mistakes with a cost]
  C --> D[Find θ that minimises cost]
  D --> E[Predict ŷ for new x]
  E --> F[Check metrics on held-out data]`}
        />
        <ContentStep number={1} title="Hypothesis">
          <p>
            The shape of the rule. Simple linear: ŷ = θ₀ + θ₁x. Multiple: add more xⱼ. Polynomial:
            add powers of x. θ are the knobs the algorithm turns.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Cost">
          <p>
            How far ŷ is from y, averaged over the training rows. Mean squared error is the default
            — it punishes large misses more than small ones.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Fit">
          <p>
            Either solve a closed form (ordinary least squares) or walk downhill with gradient
            descent. Both aim at the same minimum when the cost is a convex bowl.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Evaluate">
          <p>
            MAE / MSE / RMSE / R² on data the model has not seen. A beautiful training fit that
            fails on new rows is overfitting — the next lessons show how to catch it.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Reading the two parameters">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>ŷ = θ₀ + θ₁ x</div>
          <div className="mt-2">θ₀  intercept — predicted y when x = 0</div>
          <div>θ₁  slope     — how much ŷ changes when x increases by 1</div>
        </div>
        <p className="mt-3 text-slate-300">
          For the five students, a good line is roughly θ₀ ≈ 38.5, θ₁ ≈ 7.2. That is not a claim
          that studying 0 hours scores 38 — the intercept is often outside the data range. Trust
          the slope inside the range you actually observed.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Predict from a fitted line">
          <p>The fitted rule is ŷ = 40 + 6x. What score does the model give a student who studied 4.5 hours?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 40 + 6 · 4.5 = 67.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Residuals">
          <p>Same line. Student C studied 3 hours and scored 61. What is the residual y − ŷ?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 40 + 18 = 58.   residual = 61 − 58 = +3.</div>
            <div className="mt-1 text-slate-400">Positive residual: the student did better than the line predicted.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Regression or classification?">
          <p>Which of these are regression targets: house price, default / no-default, temperature, next-token id?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Regression: house price, temperature.</div>
            <div>Classification: default / no-default, next-token id (a discrete vocabulary index).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Extrapolation risk">
          <p>The training hours range from 1 to 5. Is ŷ = 40 + 6x trustworthy at x = 40?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 40 + 240 = 280 — an exam score that cannot exist.</div>
            <div className="mt-1 text-genai-400">
              Linear models happily extrapolate. Always ask whether new x is inside the training
              support before trusting ŷ.
            </div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Why a line, not connecting the dots?">
          <p>You could interpolate every point with a wiggly curve. Why prefer a straight line here?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The trend is roughly linear and n = 5 is tiny.</div>
            <div>A flexible curve would memorise noise and fail on the next student.</div>
            <div className="mt-1 text-slate-400">Bias (a simple line) is a feature when data is scarce.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Regression predicts a number. Simple linear regression is the one-feature straight-line case: ŷ = θ₀ + θ₁x.',
          'Use it when the target is numeric, you want an interpretable slope, or you need a strong baseline. Use classification when the target is a category.',
          'The loop is always the same: pick a hypothesis family, score mistakes, fit θ, evaluate on held-out data.',
          'θ₀ is the intercept; θ₁ is “+1 in x → +θ₁ in ŷ.” Do not trust the intercept outside the observed range of x.',
          'A residual is y − ŷ. Positive means the model under-predicted. Large systematic residual patterns mean the line is the wrong shape.',
        ]}
      />
    </LessonArticle>
  )
}
