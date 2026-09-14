import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MlWorkflowsLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="SciPy in the data stack">
        NumPy holds arrays. Pandas wrangles tables. scikit-learn trains models. SciPy fills the gaps —
        integration, optimization, signal processing, and scientific functions that make raw data
        model-ready.
      </Callout>

      <Definition term="Complementary roles">
        <p>
          Think of SciPy as the <strong className="text-white">numeric lab</strong> between cleaned
          tables and ML algorithms: interpolate missing sensor points, fit a physical decay curve,
          filter noise from audio features, then hand tidy arrays to scikit-learn.
        </p>
      </Definition>

      <LessonSection title="Who does what">
        <ContentStep number={1} title="Pandas — structure and cleaning">
          <p className="text-slate-300">
            Load CSVs, handle missing cells, group by category, merge tables. Output: clean DataFrames
            or Series ready for numeric work.
          </p>
        </ContentStep>
        <ContentStep number={2} title="NumPy — fast array math">
          <p className="text-slate-300">
            Vectorized operations on columns exported from Pandas (
            <code className="font-mono text-xs">df[&quot;col&quot;].to_numpy()</code>). Foundation
            for everything downstream.
          </p>
        </ContentStep>
        <ContentStep number={3} title="SciPy — scientific transforms">
          <p className="text-slate-300">
            <code className="font-mono text-xs">curve_fit</code> for parametric trends,{' '}
            <code className="font-mono text-xs">interpolate</code> for gaps,{' '}
            <code className="font-mono text-xs">signal</code> for filtering — specialized steps
            Pandas does not ship with.
          </p>
        </ContentStep>
        <ContentStep number={4} title="scikit-learn — learning">
          <p className="text-slate-300">
            Classifiers, regressors, clustering, pipelines. Expects numeric matrices — often built
            from SciPy-preprocessed features.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Typical pipeline">
        <Flowchart
          title="Preprocess → optimize/fit → feed ML"
          chart={`flowchart LR
  A[Raw CSV / sensors] --> B[Pandas clean & join]
  B --> C[NumPy arrays]
  C --> D[SciPy interpolate / filter / curve_fit]
  D --> E[Feature matrix]
  E --> F[scikit-learn model]
  F --> G[Predictions & metrics]`}
        />
        <div className="mt-4 space-y-3 text-sm text-slate-300">
          <p>
            Example: sales time series with missing weeks → Pandas fills structure → SciPy interpolates
            gaps and fits a growth curve → sklearn forecasts next quarter from engineered features.
          </p>
          <p>
            Example: audio clips → SciPy band-pass filter + spectrogram stats → sklearn classifier
            for speech vs music.
          </p>
        </div>
      </LessonSection>

      <LessonSection title="Practical tips">
        <Callout variant="tip">
          Keep SciPy steps <strong className="text-white">pure functions</strong> on NumPy arrays
          where possible — easier to test and wrap inside sklearn{' '}
          <code className="font-mono text-xs">Pipeline</code> transformers later.
        </Callout>
        <Callout variant="insight">
          You rarely import all four in one cell for style points — import what the step needs. The
          workflow matters more than a single mega-script.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Pandas cleans and organizes; NumPy computes; SciPy adds scientific ops; sklearn learns patterns.',
          'Common flow: clean → array → SciPy preprocess/fit → feature matrix → ML model.',
          'SciPy shines for interpolation, curve fitting, and signal work before modeling.',
        ]}
      />
    </LessonArticle>
  )
}
