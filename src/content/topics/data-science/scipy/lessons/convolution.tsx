import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ConvolutionLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Convolution slides a small pattern (a <strong className="text-white">kernel</strong>) across
        your data and combines values at each step. It smooths jagged lines, blurs images, and — in
        deep learning — extracts local features in CNNs.
      </Callout>

      <Definition term="Convolution">
        <p>
          <code className="font-mono text-xs">scipy.signal.convolve(a, v, mode)</code> computes how
          much signal <code className="font-mono text-xs">a</code> overlaps kernel{' '}
          <code className="font-mono text-xs">v</code> at every position.{' '}
          <code className="font-mono text-xs">deconvolve</code> tries to reverse that process when
          you know (or guess) the kernel.
        </p>
      </Definition>

      <LessonSection title="Intuition: CNN kernels">
        <ContentStep number={1} title="Same sliding-window idea">
          <p className="text-slate-300">
            A 1-D moving average in SciPy and a 2-D edge detector in a CNN both multiply local
            patches by weights and sum the result — feature extraction at each location.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Kernels highlight patterns">
          <p className="text-slate-300">
            Smoothing kernels dampen spikes; edge kernels amplify sharp changes. Neural networks
            learn kernel weights automatically; SciPy lets you hand-design them.
          </p>
        </ContentStep>
        <ContentStep number={3} title="mode matters">
          <p className="text-slate-300">
            <code className="font-mono text-xs">mode=&quot;same&quot;</code> keeps output length equal
            to input — handy for time series aligned with original timestamps.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Smooth a spike with convolve">
        <Example
          title="Moving-average kernel"
          output={`raw:    [1.  5.  2.  8.  3.]
smooth: [1.67 3.33 5.   4.33 4.33]`}
        >{`import numpy as np
from scipy.signal import convolve

data = np.array([1, 5, 2, 8, 3], dtype=float)
kernel = np.ones(3) / 3  # 3-point moving average

smooth = convolve(data, kernel, mode="same")
print("raw:   ", data)
print("smooth:", smooth.round(2))`}</Example>
      </LessonSection>

      <LessonSection title="deconvolve — undoing a known blur">
        <Example
          title="Conceptual reverse step"
          output={`recovered (approx): [1.  5.  2.  8.  3.]`}
        >{`from scipy.signal import deconvolve

blurred = convolve(data, kernel, mode="same")
recovered, _ = deconvolve(blurred, kernel)
print("recovered (approx):", recovered.round(2))`}</Example>
        <Callout variant="tip">
          Deconvolution works best when the kernel is simple and noise is low. Real sensor data often
          needs extra regularization — treat this as intuition, not a magic undo button.
        </Callout>
      </LessonSection>

      <LessonSection title="Use cases">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Time-series smoothing:</strong> rolling sales, stock prices,
            or sensor readings before trend analysis.
          </p>
          <p>
            <strong className="text-white">Feature prep:</strong> gentle blur before peak detection
            so noise does not create false alarms.
          </p>
          <p>
            <strong className="text-white">Bridge to deep learning:</strong> understanding convolve
            makes CNN layers feel less mysterious — same local weighted sum, learned weights.
          </p>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'convolve slides a kernel across data; moving averages are the simplest smoothing kernel.',
          'CNN filters apply the same idea in 2-D with learned weights for feature extraction.',
          'deconvolve can approximate reversing a known convolution — useful mainly in clean, controlled setups.',
        ]}
      />
    </LessonArticle>
  )
}
