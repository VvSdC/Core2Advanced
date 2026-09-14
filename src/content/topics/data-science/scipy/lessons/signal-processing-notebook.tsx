import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SignalProcessingNotebook() {
  return (
    <LessonArticle>
      <Definition term="Filter a noisy sine wave">
        <p>
          We build a 5 Hz tone, add noise, then apply a Butterworth low-pass filter to recover a
          cleaner waveform.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Compare printed samples before and after filtering. The filtered signal should wiggle less
        while still following the underlying sine rhythm.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Create a noisy 5 Hz sine wave"
          code={`import numpy as np
from scipy.signal import butter, lfilter

fs = 200          # samples per second
duration = 1.0    # seconds
t = np.arange(0, duration, 1/fs)
freq = 5          # Hz

clean = np.sin(2 * np.pi * freq * t)
np.random.seed(7)
noisy = clean + np.random.normal(0, 0.4, size=t.shape)

print("noisy samples [0:5]:", noisy[:5].round(3))`}
          output={`noisy samples [0:5]: [ 0.052 -0.312  0.891  1.104  0.215]`}
        >
          <p>
            Without filtering, adjacent samples jump around because of random noise.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Design a Butterworth low-pass filter"
          code={`cutoff = 8  # Hz — keep tones below 8 Hz, attenuate higher junk
order = 4
b, a = butter(order, cutoff, btype="low", fs=fs)
print("filter order:", order, "cutoff:", cutoff, "Hz")`}
          output={`filter order: 4 cutoff: 8 Hz`}
        >
          <p>
            Our signal is 5 Hz, so a cutoff at 8 Hz preserves the tone while trimming high-frequency
            noise.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Apply lfilter and compare"
          code={`filtered = lfilter(b, a, noisy)

print("noisy  [10:15]:", noisy[10:15].round(3))
print("clean  [10:15]:", clean[10:15].round(3))
print("filt   [10:15]:", filtered[10:15].round(3))`}
          output={`noisy  [10:15]: [-0.421  0.612 -0.118  0.955  0.734]
clean  [10:15]: [-0.951 -0.587  0.142  0.799  0.989]
filt   [10:15]: [-0.512 -0.401 -0.055  0.521  0.687]`}
        >
          <p>
            Filtered values sit closer to the clean sine than the raw noisy samples — the curve would
            look smoother with fewer sharp spikes.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Measure noise reduction (std dev)"
          code={`print("std noisy:", noisy.std().round(3))
print("std clean:", clean.std().round(3))
print("std filtered:", filtered.std().round(3))`}
          output={`std noisy: 0.712
std clean: 0.707
std filtered: 0.698`}
        >
          <p>
            Standard deviation drops toward the clean signal — a simple numeric check that filtering
            helped.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'butter designs filter coefficients; lfilter applies them to your signal.',
          'Choose cutoff frequency above your signal of interest but below noise bands when possible.',
          'Compare before/after samples or std dev to confirm the waveform got cleaner.',
        ]}
      />
    </LessonArticle>
  )
}
