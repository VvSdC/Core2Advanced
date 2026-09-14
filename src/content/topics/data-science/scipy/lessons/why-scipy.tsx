import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhyScipy() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Take a breath — this is a story, not a lecture">
        Imagine fitting a growth curve to 200 noisy data points. You could write your own gradient
        descent from scratch — or call <code className="font-mono text-xs">curve_fit</code> and get
        trusted results in three lines. SciPy exists so you spend time on the problem, not the math
        implementation.
      </Callout>

      <Definition term="Why reach for SciPy?">
        <p>
          For <strong className="text-white">scientific and numerical tasks</strong> — finding best-fit
          parameters, filling missing samples, computing integrals, filtering signals — SciPy provides
          battle-tested algorithms used by researchers and industry for decades.
        </p>
      </Definition>

      <LessonSection title="Why not reinvent the algorithms?">
        <ContentStep number={1} title="Correctness">
          <p className="text-slate-300">
            Optimization and integration are easy to get subtly wrong (wrong convergence, numerical
            instability). SciPy implementations are reviewed, tested, and documented.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Speed">
          <p className="text-slate-300">
            Under the hood, many routines call compiled Fortran or C libraries (QUADPACK, MINPACK,
            FITPACK). Pure Python loops cannot compete on large datasets.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Interoperability">
          <p className="text-slate-300">
            Because everything expects NumPy arrays, SciPy plugs directly into Pandas columns, sklearn
            pipelines, and matplotlib plots without format conversion.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where SciPy shows up in AI and scientific computing">
        <ContentStep number={1} title="Parameter tuning">
          <p className="text-slate-300">
            Minimize a loss function to find weights, decay constants, or growth parameters — the same
            intuition as training a model, on a smaller scale.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Preprocessing">
          <p className="text-slate-300">
            Interpolate missing sensor readings, resample time series to a regular grid, smooth noisy
            features before feeding them to a classifier.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Differential equations">
          <p className="text-slate-300">
            Model how a system changes over time — epidemic spread, chemical reactions, physical
            simulations — with ODE solvers like <code className="font-mono text-xs">odeint</code>.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Signal filtering">
          <p className="text-slate-300">
            Remove high-frequency noise from audio, EEG, or accelerometer data so downstream models see
            cleaner patterns.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="SciPy complements NumPy and Pandas">
        <p className="text-slate-300">
          Each library has a sweet spot. Together they cover the full data science stack from raw
          numbers to trained models.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Library</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Example task</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['NumPy', 'Fast arrays and vectorized math', 'Store 10,000 temperature readings'],
                ['SciPy', 'Scientific algorithms on arrays', 'Fit a curve, fill gaps, integrate a PDF'],
                ['Pandas', 'Labeled tables', 'Load CSV, group by city, merge tables'],
              ].map(([lib, role, task]) => (
                <tr key={lib} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{lib}</td>
                  <td className="px-4 py-3">{role}</td>
                  <td className="px-4 py-3">{task}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Example title="SciPy on a NumPy array in three lines">
{`import numpy as np
from scipy import integrate

# Area under a standard normal curve from -1 to 1 (~68% of probability mass)
result, error = integrate.quad(lambda x: np.exp(-x**2 / 2) / np.sqrt(2 * np.pi), -1, 1)
print(f"area: {result:.4f}, estimated error: {error:.2e}")
# area: 0.6827, estimated error: 7.58e-15`}
        </Example>
        <Callout variant="insight">
          NumPy is the data layer. SciPy is the algorithm layer. Pandas is the table layer. Most real
          projects use all three.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SciPy saves you from reimplementing tricky math — correctness, speed, and NumPy compatibility built in.',
          'Shows up in AI workflows for tuning, preprocessing, ODEs, and signal filtering.',
          'Complements NumPy (arrays) and Pandas (tables) — not a replacement for either.',
        ]}
      />
    </LessonArticle>
  )
}
