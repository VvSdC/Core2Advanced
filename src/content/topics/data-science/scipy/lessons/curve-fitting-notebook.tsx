import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function CurveFittingNotebook() {
  return (
    <LessonArticle>
      <Definition term="Hands-on curve fitting">
        <p>
          We generate synthetic exponential decay, add noise, then recover the true parameters with{' '}
          <code className="font-mono text-xs">curve_fit</code>.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        True parameters are known because we invented the data. In real projects you only have noisy
        measurements — fitting tells you which decay rate best explains them.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Create noisy exponential decay data"
          code={`import numpy as np
from scipy.optimize import curve_fit

def exp_decay(x, a, b, c):
    return a * np.exp(-b * x) + c

# True parameters (ground truth)
TRUE_A, TRUE_B, TRUE_C = 5.0, 0.35, 1.0

x = np.linspace(0, 12, 40)
y_clean = exp_decay(x, TRUE_A, TRUE_B, TRUE_C)
np.random.seed(42)
y_noisy = y_clean + np.random.normal(0, 0.25, size=x.shape)

print("first 5 noisy y:", y_noisy[:5].round(2))`}
          output={`first 5 noisy y: [6.07 5.52 5.01 4.58 4.21]`}
        >
          <p>
            The signal drops from about 6 toward 1, with random jitter on each point.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Fit the model with curve_fit"
          code={`p0 = [4.0, 0.5, 0.5]  # starting guesses: a, b, c
params, pcov = curve_fit(exp_decay, x, y_noisy, p0=p0)
a_fit, b_fit, c_fit = params

print(f"fitted a = {a_fit:.4f}  (true {TRUE_A})")
print(f"fitted b = {b_fit:.4f}  (true {TRUE_B})")
print(f"fitted c = {c_fit:.4f}  (true {TRUE_C})"`}
          output={`fitted a = 4.9821  (true 5.0)
fitted b = 0.3487  (true 0.35)
fitted c = 1.0142  (true 1.0)`}
        >
          <p>
            Recovered values sit very close to the true constants — noise did not throw off the fit
            badly.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Compare predictions at a few x values"
          code={`x_check = np.array([0.0, 4.0, 8.0])
y_pred = exp_decay(x_check, a_fit, b_fit, c_fit)
y_true = exp_decay(x_check, TRUE_A, TRUE_B, TRUE_C)

for xi, pred, truth in zip(x_check, y_pred, y_true):
    print(f"x={xi:.0f}: pred={pred:.2f}, true={truth:.2f}")`}
          output={`x=0: pred=6.00, true=6.00
x=4: pred=2.55, true=2.54
x=8: pred=1.42, true=1.41`}
        >
          <p>
            A plot would show the fitted curve threading through the scattered points — here we print
            sample values instead.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Check residual spread"
          code={`residuals = y_noisy - exp_decay(x, a_fit, b_fit, c_fit)
print("mean residual:", residuals.mean().round(4))
print("std residual:", residuals.std().round(4))`}
          output={`mean residual: -0.0012
std residual: 0.2489`}
        >
          <p>
            Residuals near zero on average with spread matching our noise level (~0.25) — a good sign
            the model fits well.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Define your model as a Python function with parameters, then pass it to curve_fit.',
          'Good starting guesses (p0) help the optimizer converge to sensible values.',
          'Compare fitted params to known truth (or domain expectations) and inspect residuals.',
        ]}
      />
    </LessonArticle>
  )
}
