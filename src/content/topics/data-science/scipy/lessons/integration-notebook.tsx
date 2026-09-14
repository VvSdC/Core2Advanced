import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function IntegrationNotebook() {
  return (
    <LessonArticle>
      <Definition term="Numerical integration in SciPy">
        <p>
          SciPy&apos;s <code className="font-mono text-xs">integrate</code> module estimates areas under curves
          when you cannot (or do not want to) solve an integral by hand. That is common in probability,
          physics, and data science.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell builds on the last. We integrate a Gaussian-shaped curve and check that the total area
        is about 1 — the same idea behind a normal distribution.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Define a Gaussian pdf-ish function"
          code={`import numpy as np
from scipy import integrate

def gaussian_pdf(x, mu=0, sigma=1):
    """Unnormalized bell curve — shape of a normal distribution."""
    return (1 / (sigma * np.sqrt(2 * np.pi))) * np.exp(-0.5 * ((x - mu) / sigma) ** 2)

# Peek at a few values
xs = np.linspace(-3, 3, 5)
print("x:", xs)
print("f(x):", gaussian_pdf(xs))`}
          output={`x: [-3. -1.5  0.  1.5  3.]
f(x): [0.00443185 0.12951776 0.39894228 0.12951776 0.00443185]`}
        >
          <p>
            The function peaks at x = 0 and drops toward zero on both sides — the classic bell shape.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Integrate over the full real line with quad"
          code={`area, error = integrate.quad(gaussian_pdf, -np.inf, np.inf)
print(f"area ≈ {area:.6f}")
print(f"estimated error ≈ {error:.2e}")`}
          output={`area ≈ 1.000000
estimated error ≈ 1.49e-08`}
        >
          <p>
            A standard normal pdf integrates to 1 — total probability is 100%.{' '}
            <code className="font-mono text-xs">quad</code> returns the value and a rough error estimate.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Definite integral of exp(-x²) on [0, 2]"
          code={`def simple_bell(x):
    return np.exp(-x ** 2)

half_area, err = integrate.quad(simple_bell, 0, 2)
print(f"∫₀² exp(-x²) dx ≈ {half_area:.6f}")`}
          output={`∫₀² exp(-x²) dx ≈ 0.882081`}
        >
          <p>
            You do not need a fancy pdf — any smooth function works.{' '}
            <code className="font-mono text-xs">quad</code> handles the numeric work.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Optional: odeint for changing systems"
          code={`from scipy.integrate import odeint

def decay(y, t, k=0.3):
    """dy/dt = -k*y  (exponential decay)"""
    return -k * y

t = np.linspace(0, 10, 6)
y0 = 100.0
solution = odeint(decay, y0, t)
print("t:", t)
print("y(t):", solution.flatten().round(2))`}
          output={`t: [ 0.  2.  4.  6.  8. 10.]
y(t): [100.    54.88  30.12  16.53   9.07   4.98]`}
        >
          <p>
            <code className="font-mono text-xs">odeint</code> solves ordinary differential equations —
            useful for modeling growth, decay, or simple dynamical systems over time.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'integrate.quad(func, a, b) estimates ∫ₐᵇ f(x) dx numerically.',
          'Integrating a standard normal pdf from -∞ to ∞ should land near 1.',
          'odeint solves ODEs — a related tool when your question is “how does y change over time?”',
        ]}
      />
    </LessonArticle>
  )
}
