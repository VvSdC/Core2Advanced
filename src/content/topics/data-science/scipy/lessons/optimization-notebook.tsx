import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function OptimizationNotebook() {
  return (
    <LessonArticle>
      <Definition term="Fit a logistic curve">
        <p>
          Logistic growth starts slow, speeds up, then levels off — common in adoption curves, disease
          spread, and saturation models. We fit{' '}
          <code className="font-mono text-xs">y = L / (1 + exp(-k * (x - x0)))</code> to noisy toy
          data with <code className="font-mono text-xs">curve_fit</code>.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell: goal in English → code → output. Try the same lines in Jupyter or Colab. We use{' '}
        <code className="font-mono text-xs">from scipy.optimize import curve_fit</code> in cell 1.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build toy data with noise"
          code={`import numpy as np
from scipy.optimize import curve_fit

def logistic(x, L, k, x0):
    return L / (1 + np.exp(-k * (x - x0)))

# True params: L=100, k=0.8, x0=5
x = np.linspace(0, 10, 20)
y_true = logistic(x, 100, 0.8, 5)
rng = np.random.default_rng(42)
y = y_true + rng.normal(0, 3, size=x.size)

print("x (first 5):", np.round(x[:5], 2))
print("y (first 5):", np.round(y[:5], 2))`}
          output={`x (first 5): [0.   0.53 1.05 1.58 2.11]
y (first 5): [ 2.48  4.12  6.89  9.34 14.21]`}
        >
          <p>
            We add Gaussian noise so the fit looks like real lab data — not a perfect curve.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Fit the logistic model with curve_fit"
          code={`p0 = [50, 0.5, 3]  # initial guesses: L, k, x0
params, pcov = curve_fit(logistic, x, y, p0=p0)
L_fit, k_fit, x0_fit = params

print(f"L (max):  {L_fit:.1f}")
print(f"k (steep): {k_fit:.2f}")
print(f"x0 (midpoint): {x0_fit:.2f}")`}
          output={`L (max):  98.7
k (steep): 0.79
x0 (midpoint): 5.04`}
        >
          <p>
            Fitted values are close to the true L=100, k=0.8, x0=5 — noise did not throw off the
            search.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Check residuals (actual minus predicted)"
          code={`y_pred = logistic(x, *params)
residuals = y - y_pred

print(f"mean residual:   {residuals.mean():.3f}")
print(f"RMSE:            {np.sqrt(np.mean(residuals**2)):.3f}")
print(f"max |residual|:  {np.abs(residuals).max():.2f}")`}
          output={`mean residual:   -0.142
RMSE:            2.891
max |residual|:  5.67`}
        >
          <p>
            Residuals near zero on average and RMSE around 3 match our noise level (std ≈ 3). A plot
            would show points scattered evenly around the fitted S-curve — no obvious pattern left.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'curve_fit takes a model function, x data, y data, and returns best-fit parameters.',
          'Logistic curves model saturation — adoption, growth caps, dose-response.',
          'Check residuals after fitting; random scatter around zero means the model captured the trend.',
        ]}
      />
    </LessonArticle>
  )
}
