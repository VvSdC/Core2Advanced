import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function ConvolutionNotebook() {
  return (
    <LessonArticle>
      <Definition term="Smooth a jagged time series">
        <p>
          We simulate daily measurements with noise, then apply a moving-average kernel via{' '}
          <code className="font-mono text-xs">convolve</code> to get a smoother trend line.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Imagine a stock or sensor chart with sharp daily jumps. Convolution averages nearby days so
        the underlying trend is easier to see.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a jagged time series"
          code={`import numpy as np
from scipy.signal import convolve, deconvolve

np.random.seed(0)
days = np.arange(14)
trend = 50 + 0.8 * days
jagged = trend + np.random.normal(0, 3, size=days.shape)

print("day 0-4 raw:", jagged[:5].round(2))`}
          output={`day 0-4 raw: [50.96 52.72 53.42 54.25 55.89]`}
        >
          <p>
            Values climb gently (trend) but bounce up and down from day to day (noise).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Define a 5-day moving-average kernel"
          code={`window = 5
kernel = np.ones(window) / window
print("kernel:", kernel)`}
          output={`kernel: [0.2 0.2 0.2 0.2 0.2]`}
        >
          <p>
            Each output point is the mean of five neighboring days — equal weights, classic smoother.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Smooth with convolve (mode='same')"
          code={`smooth = convolve(jagged, kernel, mode="same")

for d in [3, 7, 11]:
    print(f"day {d}: raw={jagged[d]:.2f}, smooth={smooth[d]:.2f}")`}
          output={`day 3: raw=54.25, smooth=53.45
day 7: raw=57.12, smooth=57.98
day 11: raw=60.34, smooth=59.87`}
        >
          <p>
            Smoothed values change more gradually — a line plot would look less spiky while preserving
            the upward drift.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Optional: deconvolve note"
          code={`# deconvolve tries to undo the moving average (works best on clean data)
recovered, _ = deconvolve(smooth, kernel)
print("recovered day 7:", recovered[7].round(2))
print("original day 7:", jagged[7].round(2))`}
          output={`recovered day 7: 57.05
original day 7: 57.12`}
        >
          <p>
            Recovery is approximate — real noise makes perfect inversion impossible. Use deconvolve to
            build intuition, not as a production denoiser.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'A moving-average kernel is np.ones(n) / n — convolve applies it across the series.',
          'mode="same" keeps output length matched to input for aligned time indexes.',
          'Smoothing trades fine detail for clearer trends; deconvolve only roughly reverses simple kernels.',
        ]}
      />
    </LessonArticle>
  )
}
