import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function InterpolationNotebook() {
  return (
    <LessonArticle>
      <Definition term="Fill gaps in a sensor series">
        <p>
          A temperature sensor logged readings every hour, but three timestamps failed. We keep only
          valid points (simulating removed/NaN entries), then use{' '}
          <code className="font-mono text-xs">interp1d</code> to estimate the missing values.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell: goal in English → code → output. We build the series with{' '}
        <code className="font-mono text-xs">None</code> for missing slots, then interpolate over the
        valid points only.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sensor readings with missing hours"
          code={`import numpy as np
from scipy.interpolate import interp1d

hours = np.array([0, 1, 2, 3, 4, 5, 6, 7])
# None = reading failed (like NaN in a real export)
readings = [22.1, 22.4, None, 23.0, None, 23.8, 24.1, None]

print("Before (hours -> temp):")
for h, r in zip(hours, readings):
    label = "MISSING" if r is None else f"{r:.1f} C"
    print(f"  hour {h}: {label}")`}
          output={`Before (hours -> temp):
  hour 0: 22.1 C
  hour 1: 22.4 C
  hour 2: MISSING
  hour 3: 23.0 C
  hour 4: MISSING
  hour 5: 23.8 C
  hour 6: 24.1 C
  hour 7: MISSING`}
        >
          <p>
            Hours 2, 4, and 7 have no reading — the sensor dropped those samples.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Keep valid points and build interp1d"
          code={`valid_hours = []
valid_temps = []
for h, r in zip(hours, readings):
    if r is not None:
        valid_hours.append(h)
        valid_temps.append(r)

valid_hours = np.array(valid_hours)
valid_temps = np.array(valid_temps)
f = interp1d(valid_hours, valid_temps, kind="linear")

print("Known points:", list(zip(valid_hours, valid_temps)))
print("interp at hour 2:", float(f(2)))
print("interp at hour 4:", float(f(4)))
print("interp at hour 7:", float(f(7)))`}
          output={`Known points: [(0, 22.1), (1, 22.4), (3, 23.0), (5, 23.8), (6, 24.1)]
interp at hour 2: 22.7
interp at hour 4: 23.4
interp at hour 7: 24.1`}
        >
          <p>
            Linear interpolation draws straight lines between neighbors — hour 2 sits halfway between
            22.4 (hour 1) and 23.0 (hour 3).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Build a complete filled series"
          code={`filled = []
for h in hours:
    if readings[h] is None:
        filled.append(float(f(h)))
    else:
        filled.append(readings[h])

print("After (hours -> temp):")
for h, t in zip(hours, filled):
    tag = " (filled)" if readings[h] is None else ""
    print(f"  hour {h}: {t:.1f} C{tag}")`}
          output={`After (hours -> temp):
  hour 0: 22.1 C
  hour 1: 22.4 C
  hour 2: 22.7 C (filled)
  hour 3: 23.0 C
  hour 4: 23.4 C (filled)
  hour 5: 23.8 C
  hour 6: 24.1 C
  hour 7: 24.1 C (filled)`}
        >
          <p>
            Hour 7 is extrapolated from the last two known points (23.8 at hour 5, 24.1 at hour 6).
            Extrapolation beyond your data is less trustworthy — flag filled edge values in production
            pipelines.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Extract valid (x, y) pairs first, then pass them to interp1d.',
          'Linear interpolation is fast and intuitive; splines give smoother curves when noise is low.',
          'Interpolation fills gaps; extrapolation at the edges needs extra caution.',
        ]}
      />
    </LessonArticle>
  )
}
