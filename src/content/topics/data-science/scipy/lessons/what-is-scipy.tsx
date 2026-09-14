import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsScipy() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You have temperature readings every hour and need to estimate values at missing times, find
        the best curve through noisy data, or compute the area under a probability bell curve. SciPy
        is the toolbox that does that math for you — quickly and reliably.
      </Callout>

      <Definition term="What is SciPy?">
        <p>
          <strong className="text-white">SciPy</strong> (Scientific Python) is an open-source library
          for scientific and technical computing. It extends NumPy with modules for optimization,
          interpolation, integration, signal processing, statistics, and more — all operating on NumPy
          arrays.
        </p>
      </Definition>

      <LessonSection title="Built on NumPy">
        <p className="text-slate-300">
          SciPy does not replace NumPy — it uses NumPy arrays as its data format. You create arrays
          with NumPy, then pass them to SciPy functions. If you completed the NumPy track, you already
          know the foundation; SciPy adds the algorithms.
        </p>
        <Callout variant="insight">
          Think of NumPy as the engine (fast arrays and math). SciPy is the specialist toolkit bolted
          onto that engine — curve fitting, gap filling, area under curves, filtering noisy signals.
        </Callout>
      </LessonSection>

      <LessonSection title="Why it matters in data science and AI">
        <ContentStep number={1} title="Preprocessing before modeling">
          <p className="text-slate-300">
            Real data has gaps, uneven sampling, and noise. Interpolation and signal filtering clean
            data before it reaches a machine learning model.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fitting and tuning">
          <p className="text-slate-300">
            Optimization finds best-fit parameters — logistic growth curves, decay rates, or
            hyperparameter-style tuning when you minimize a loss function.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Simulation and probability">
          <p className="text-slate-300">
            Integration computes areas under probability densities, expected values, and solutions to
            differential equations used in physics-inspired models.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key modules for data science">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Module</th>
                <th className="px-4 py-3">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['scipy.optimize', 'Find minimums, fit curves, solve least-squares problems'],
                ['scipy.interpolate', 'Fill gaps, resample time series, smooth uneven data'],
                ['scipy.integrate', 'Area under curves, double integrals, ODE solvers'],
                ['scipy.signal', 'Filter noise, detect peaks, convolve signals'],
                ['scipy.stats', 'Distributions, hypothesis tests (used alongside sklearn)'],
              ].map(([mod, desc]) => (
                <tr key={mod} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{mod}</td>
                  <td className="px-4 py-3">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          You do not need every module on day one. Start with optimize and interpolate — they show up
          constantly in real data work.
        </Callout>
      </LessonSection>

      <LessonSection title="Where SciPy sits in your stack">
        <Flowchart
          title="NumPy → SciPy → Pandas / sklearn"
          chart={`flowchart LR
  A[NumPy arrays] --> B[SciPy algorithms]
  B --> C[Pandas tables]
  B --> D[sklearn models]
  C --> D`}
        />
        <p className="mt-4 text-slate-300">
          NumPy holds the numbers. SciPy runs the math. Pandas organizes tables. sklearn trains
          models. Most pipelines touch two or three of these in sequence.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SciPy = scientific computing on NumPy arrays — optimization, interpolation, integration, signals, stats.',
          'Essential for preprocessing, curve fitting, probability, and simulation in data science and AI workflows.',
          'NumPy stores data; SciPy runs algorithms; Pandas and sklearn consume the results.',
        ]}
      />
    </LessonArticle>
  )
}
