import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InterpolationLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        A temperature sensor recorded values at 9 AM and 11 AM, but you need an estimate at 10 AM. You
        do not have a reading there — you interpolate: draw a smooth line between known points and read
        off the in-between value.
      </Callout>

      <Definition term="Interpolation in SciPy">
        <p>
          <strong className="text-white">scipy.interpolate</strong> estimates unknown values from known
          ones — fill gaps in a time series, resample data to a new grid, or build smooth curves through
          scattered points.
        </p>
      </Definition>

      <LessonSection title="Three tools you will meet first">
        <ContentStep number={1} title="interp1d — 1-D interpolation">
          <p className="text-slate-300">
            Given x and y arrays, build a function that returns y at any new x. Good for time series
            with missing timestamps or uneven sampling.
          </p>
          <Example title="Linear interpolation between known points">
{`import numpy as np
from scipy.interpolate import interp1d

x_known = np.array([0, 2, 5, 8])
y_known = np.array([10, 14, 22, 30])
f = interp1d(x_known, y_known, kind="linear")

print(f(3.5))   # value at x=3.5
# 18.0`}
          </Example>
        </ContentStep>

        <ContentStep number={2} title="griddata — scattered 2-D points">
          <p className="text-slate-300">
            You have measurements at random (x, y) locations and want values on a regular grid — like
            filling a heatmap from sparse sensor readings.
          </p>
          <Example title="Interpolate scattered points onto a grid">
{`import numpy as np
from scipy.interpolate import griddata

points = np.array([[0, 0], [1, 0], [0, 1], [1, 1]])
values = np.array([1.0, 2.0, 3.0, 4.0])
grid_x, grid_y = np.mgrid[0:1:3j, 0:1:3j]
grid_z = griddata(points, values, (grid_x, grid_y), method="linear")
print(grid_z[0, 0], grid_z[1, 1])
# 1.0 4.0`}
          </Example>
        </ContentStep>

        <ContentStep number={3} title="splrep / splev — smooth splines">
          <p className="text-slate-300">
            <code className="font-mono text-xs">splrep</code> builds a smooth spline representation;{' '}
            <code className="font-mono text-xs">splev</code> evaluates it at new points. Splines curve
            gently through data instead of connecting straight line segments.
          </p>
          <Example title="Smooth spline through noisy points">
{`from scipy.interpolate import splrep, splev

x = np.array([0, 1, 2, 3, 4])
y = np.array([0, 0.9, 0.1, 0.8, 1.0])
tck = splrep(x, y, s=0)
x_new = np.linspace(0, 4, 9)
y_new = splev(x_new, tck)
print(np.round(y_new[:4], 2))
# [0.   0.48 0.9  0.55]`}
          </Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Use cases in data science">
        <ContentStep number={1} title="Preprocessing">
          <p className="text-slate-300">
            Fill NaN-like gaps before training a model, or align two datasets sampled at different
            times onto a common timeline.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Time series resampling">
          <p className="text-slate-300">
            Convert hourly readings to every 15 minutes, or upsample daily sales to weekly estimates
            for charting.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Feature engineering">
          <p className="text-slate-300">
            Derive smooth trend lines or baseline curves that become input features for downstream
            models.
          </p>
        </ContentStep>
        <Callout variant="tip">
          The interpolation notebook fills gaps in a sensor series — a pattern you will reuse often.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'scipy.interpolate estimates values between or beyond known data points.',
          'interp1d for 1-D series, griddata for scattered 2-D points, splrep/splev for smooth curves.',
          'Common in preprocessing and time series resampling before modeling.',
        ]}
      />
    </LessonArticle>
  )
}
