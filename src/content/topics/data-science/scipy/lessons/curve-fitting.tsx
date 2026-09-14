import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CurveFittingLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Sometimes your data follows a curved pattern — decay, saturation, growth — not a straight line.
        SciPy&apos;s <code className="font-mono text-xs">curve_fit</code> finds the best parameters for a
        formula you choose.
      </Callout>

      <Definition term="Nonlinear curve fitting">
        <p>
          <strong className="text-white">curve_fit</strong> from{' '}
          <code className="font-mono text-xs">scipy.optimize</code> adjusts unknown constants in your
          model so predicted values sit close to observed points. It is regression, but for custom
          shapes — not just lines.
        </p>
      </Definition>

      <LessonSection title="When to use curve_fit">
        <ContentStep number={1} title="Exponential decay">
          <p className="text-slate-300">
            Radioactive decay, drug concentration, sensor cooling — values drop quickly at first, then
            level off. Model:{' '}
            <code className="font-mono text-xs">y = a * exp(-b * x) + c</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Logistic growth">
          <p className="text-slate-300">
            Populations, adoption curves, tumor growth — slow start, fast middle, plateau at a cap.
            Model:{' '}
            <code className="font-mono text-xs">y = L / (1 + exp(-k * (x - x0)))</code>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Any custom formula">
          <p className="text-slate-300">
            You write a Python function with parameters; <code className="font-mono text-xs">curve_fit</code>{' '}
            returns the best-fit values and uncertainty estimates.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Basic usage">
        <Example
          title="Fit exponential decay to noisy points"
          output={`fitted a ≈ 4.98
fitted b ≈ 0.31
fitted c ≈ 1.02`}
        >{`import numpy as np
from scipy.optimize import curve_fit

def exp_decay(x, a, b, c):
    return a * np.exp(-b * x) + c

x = np.linspace(0, 10, 30)
y_true = exp_decay(x, 5.0, 0.3, 1.0)
y_noisy = y_true + np.random.normal(0, 0.2, size=x.shape)

params, _ = curve_fit(exp_decay, x, y_noisy, p0=[4, 0.5, 0])
a, b, c = params
print(f"fitted a ≈ {a:.2f}")
print(f"fitted b ≈ {b:.2f}")
print(f"fitted c ≈ {c:.2f}")`}</Example>
      </LessonSection>

      <LessonSection title="curve_fit vs linear regression / polyfit">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Linear regression</strong> (or{' '}
            <code className="font-mono text-xs">np.polyfit(x, y, 1)</code>) fits a straight line —
            fast and interpretable when the trend is linear.
          </p>
          <p>
            <strong className="text-white">polyfit</strong> fits polynomials (parabolas, cubics). Good
            for smooth bends, but high degrees can wiggle wildly between points.
          </p>
          <p>
            <strong className="text-white">curve_fit</strong> shines when you have a{' '}
            <em>domain-specific</em> formula (decay, logistic, Michaelis–Menten). You bring the shape;
            SciPy tunes the knobs.
          </p>
        </div>
        <Callout variant="tip">
          Start simple: try a line with <code className="font-mono text-xs">polyfit</code>. If the
          residuals look curved or physical theory suggests a specific shape, switch to{' '}
          <code className="font-mono text-xs">curve_fit</code>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'curve_fit fits custom nonlinear models — exponential decay and logistic growth are common cases.',
          'Provide a Python function, your x/y data, and reasonable starting guesses (p0).',
          'Use polyfit/linear regression for straight lines; curve_fit when the relationship has a known curved form.',
        ]}
      />
    </LessonArticle>
  )
}
