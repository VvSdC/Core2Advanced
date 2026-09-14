import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OptimizationLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You have a formula with unknown knobs — how steep is the growth? where does it start? You tweak
        the knobs until the curve hugs your data points. That is optimization: find the settings that
        make an error as small as possible.
      </Callout>

      <Definition term="Optimization in SciPy">
        <p>
          <strong className="text-white">scipy.optimize</strong> finds values that minimize (or
          maximize) a function — fit a curve to data, tune parameters, or solve least-squares problems
          where you want the smallest total squared error.
        </p>
      </Definition>

      <LessonSection title="Three tools you will meet first">
        <ContentStep number={1} title="minimize — general purpose">
          <p className="text-slate-300">
            Give it a function and a starting guess; it searches for the input that produces the
            lowest output. Think of it as “find the best hyperparameter” without building a full ML
            framework.
          </p>
          <Example title="Find the minimum of a simple parabola">
{`from scipy.optimize import minimize

result = minimize(lambda x: (x[0] - 3) ** 2 + 1, x0=[0.0])
print(result.x, result.fun)
# [3.] 1.0`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="curve_fit — fit a model to data">
          <p className="text-slate-300">
            You define a function with parameters (like slope and intercept), pass x and y arrays, and
            get back the best-fit parameter values plus an estimate of their uncertainty.
          </p>
          <Example title="Fit a straight line">
{`import numpy as np
from scipy.optimize import curve_fit

def line(x, m, b):
    return m * x + b

x = np.array([0, 1, 2, 3])
y = np.array([1.1, 2.9, 5.2, 6.8])
params, _ = curve_fit(line, x, y)
print(f"slope={params[0]:.2f}, intercept={params[1]:.2f}")
# slope=1.93, intercept=1.07`}
          </Example>
        </ContentStep>

        <ContentStep number={3} title="least_squares — when residuals matter">
          <p className="text-slate-300">
            Instead of minimizing one big error number, you minimize the vector of per-point errors.
            Useful for nonlinear models where you care about how far each data point is from the fit.
          </p>
          <Example title="Fit with explicit residuals">
{`from scipy.optimize import least_squares

def residuals(params, x, y):
    m, b = params
    return y - (m * x + b)

x = np.array([0.0, 1.0, 2.0, 3.0])
y = np.array([1.1, 2.9, 5.2, 6.8])
result = least_squares(residuals, x0=[1.0, 0.0], args=(x, y))
print(result.x)
# [1.93 1.07]`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Use cases in data science and ML">
        <ContentStep number={1} title="Model fitting">
          <p className="text-slate-300">
            Fit logistic growth, exponential decay, or custom physics models to experimental data before
            building a predictive pipeline.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Hyperparameter-style tuning">
          <p className="text-slate-300">
            Wrap your validation error in a function and call minimize — a lightweight way to search
            for good settings without a full AutoML tool.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Calibration">
          <p className="text-slate-300">
            Adjust sensor scaling factors or baseline offsets so measured values match known reference
            points.
          </p>
        </ContentStep>
        <Callout variant="tip">
          The optimization notebook lesson walks through fitting a logistic curve step by step with
          realistic output.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'scipy.optimize finds best-fit parameters — minimize for general search, curve_fit for model fitting.',
          'least_squares minimizes per-point errors, useful for nonlinear fits.',
          'Same intuition as ML training: define an error, search for parameters that make it small.',
        ]}
      />
    </LessonArticle>
  )
}
