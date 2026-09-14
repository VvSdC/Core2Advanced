import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SignalProcessingLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why signals matter in ML/AI">
        Audio, sensor streams, and time-series features often arrive noisy. Before speech recognition,
        music generation, or anomaly detection, you frequently clean and analyze signals with{' '}
        <code className="font-mono text-xs">scipy.signal</code>.
      </Callout>

      <Definition term="Digital signal processing (DSP)">
        <p>
          <strong className="text-white">Signal processing</strong> transforms raw samples — filtering
          unwanted frequencies, highlighting patterns, or building spectrograms (time vs frequency
          views). SciPy wraps classic algorithms used in audio ML pipelines.
        </p>
      </Definition>

      <LessonSection title="Core tools in scipy.signal">
        <ContentStep number={1} title="butter — design a filter">
          <p className="text-slate-300">
            <code className="font-mono text-xs">butter(order, cutoff, btype)</code> creates
            Butterworth filter coefficients. Low-pass keeps slow trends; high-pass keeps rapid changes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="lfilter — apply the filter">
          <p className="text-slate-300">
            <code className="font-mono text-xs">lfilter(b, a, x)</code> runs the filter on your 1-D
            signal <code className="font-mono text-xs">x</code>, producing a smoother or sharper
            version depending on design.
          </p>
        </ContentStep>
        <ContentStep number={3} title="spectrogram — time-frequency picture">
          <p className="text-slate-300">
            <code className="font-mono text-xs">spectrogram(x, fs)</code> splits the signal into
            windows and shows which frequencies dominate over time — common for speech and music
            models.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Quick filter example">
        <Example
          title="Low-pass a noisy sine wave"
          output={`raw first 5: [ 0.12 -0.05  0.98  1.05  0.31]
filtered first 5: [ 0.08  0.21  0.45  0.62  0.71]`}
        >{`import numpy as np
from scipy.signal import butter, lfilter

fs = 100  # sample rate (Hz)
t = np.arange(0, 1, 1/fs)
x = np.sin(2 * np.pi * 5 * t) + np.random.normal(0, 0.3, t.shape)

b, a = butter(4, 10, btype="low", fs=fs)
y = lfilter(b, a, x)

print("raw first 5:", x[:5].round(2))
print("filtered first 5:", y[:5].round(2))`}</Example>
      </LessonSection>

      <LessonSection title="Use cases in ML/AI">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Speech preprocessing:</strong> remove hum and hiss before
            feeding mel-spectrograms to ASR or voice-cloning models.
          </p>
          <p>
            <strong className="text-white">Generative audio:</strong> band-limit noise or condition
            on spectral features extracted via spectrograms.
          </p>
          <p>
            <strong className="text-white">Sensor ML:</strong> smooth accelerometer or EEG traces so
            classifiers focus on motion patterns, not high-frequency junk.
          </p>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'scipy.signal provides filters (butter + lfilter) and spectral tools (spectrogram).',
          'Low-pass filters remove high-frequency noise; spectrograms reveal how frequency content changes over time.',
          'Audio and sensor ML pipelines often preprocess signals before feature extraction or modeling.',
        ]}
      />
    </LessonArticle>
  )
}
