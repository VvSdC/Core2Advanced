import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function NumericalIntegrationLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You know the shape of a bell curve but forgot the calculus to find the area between -1 and 1.
        Numerical integration estimates that area by slicing the curve into thin rectangles and adding
        them up — SciPy does it in one function call.
      </Callout>

      <Definition term="Numerical integration in SciPy">
        <p>
          <strong className="text-white">scipy.integrate</strong> computes definite integrals (area under
          a curve), double integrals, and solves ordinary differential equations (ODEs) — systems that
          describe how a quantity changes over time.
        </p>
      </Definition>

      <LessonSection title="Three tools you will meet first">
        <ContentStep number={1} title="quad — 1-D definite integral">
          <p className="text-slate-300">
            Integrate a function from a lower bound to an upper bound. Returns the area and an estimated
            numerical error — handy for probability (area under a PDF).
          </p>
          <Example title="Area under a standard normal from -1 to 1">
{`import numpy as np
from scipy.integrate import quad

pdf = lambda x: np.exp(-x**2 / 2) / np.sqrt(2 * np.pi)
area, err = quad(pdf, -1, 1)
print(f"area: {area:.4f}, error estimate: {err:.2e}")
# area: 0.6827, error estimate: 7.58e-15`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="dblquad — double integrals">
          <p className="text-slate-300">
            Integrate over two variables — useful in physics, joint probability, and volume calculations
            where the integrand depends on both x and y.
          </p>
          <Example title="Integrate x * y over the unit square">
{`from scipy.integrate import dblquad

result, err = dblquad(lambda y, x: x * y, 0, 1, lambda x: 0, lambda x: 1)
print(f"result: {result:.4f}, error: {err:.2e}")
# result: 0.2500, error: 2.78e-15`}
          </Example>
        </ContentStep>

        <ContentStep number={3} title="odeint — solve ODEs">
          <p className="text-slate-300">
            Model how a system evolves — population growth, chemical concentration, or any rate-of-change
            equation. Give initial conditions and a time grid; get back the trajectory.
          </p>
          <Example title="Exponential decay: dy/dt = -0.5 * y">
{`import numpy as np
from scipy.integrate import odeint

def dydt(y, t):
    return -0.5 * y

t = np.linspace(0, 5, 6)
y0 = 100.0
solution = odeint(dydt, y0, t)
print(np.round(solution.flatten(), 2))
# [100.   77.88 60.65 47.24 36.79 28.65]`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Use cases in data science and modeling">
        <ContentStep number={1} title="Probability">
          <p className="text-slate-300">
            Compute the probability that a random variable falls in a range by integrating its PDF —
            no symbolic calculus required.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Expected values">
          <p className="text-slate-300">
            Integrate x times f(x) to estimate expected cost, revenue, or risk when a closed-form
            formula is unavailable.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dynamical models">
          <p className="text-slate-300">
            Simulate compartment models (SIR epidemiology), pharmacokinetics, or any system where the
            rate of change depends on the current state.
          </p>
        </ContentStep>
        <Callout variant="insight">
          quad and odeint cover most beginner needs. When you see a custom loss defined as an integral
          in research papers, quad is often what implements it in code.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'scipy.integrate computes areas under curves and solves ODEs numerically.',
          'quad for 1-D integrals (probability), dblquad for 2-D, odeint for time-evolving systems.',
          'Essential for probability calculations and dynamical models in scientific computing.',
        ]}
      />
    </LessonArticle>
  )
}
