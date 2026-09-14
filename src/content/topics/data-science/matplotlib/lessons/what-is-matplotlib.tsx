import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function WhatIsMatplotlib() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        You have sales by month, test scores for students, or model predictions vs truth. A table
        of numbers is hard to scan; a chart shows the pattern in seconds. Matplotlib is the library
        that turns those numbers into pictures in Python.
      </Callout>

      <Definition term="What is Matplotlib?">
        <p>
          <strong className="text-white">Matplotlib</strong> is an open-source visualization library
          for Python. It creates static, animated, and interactive plots — line charts, scatter
          plots, histograms, heatmaps, and more. It is the foundation most other Python charting
          tools (Pandas .plot, Seaborn) build on.
        </p>
      </Definition>

      <LessonSection title="Built on NumPy (and friends with Pandas)">
        <p className="text-slate-300">
          Matplotlib expects numeric data — usually NumPy arrays or Python lists of numbers. You
          create arrays with NumPy, pass x and y to plt.plot or plt.scatter, and Matplotlib handles
          scaling, ticks, and drawing. Pandas sits one layer above: a DataFrame column is often
          backed by a NumPy array, and df.plot() calls Matplotlib for you.
        </p>
        <Callout variant="insight">
          Think of NumPy as the numbers, Matplotlib as the artist, and Pandas as the organizer that
          hands labeled columns to the artist.
        </Callout>
      </LessonSection>

      <LessonSection title="Why it matters in data science and ML">
        <ContentStep number={1} title="Exploratory data analysis (EDA)">
          <p className="text-slate-300">
            Before modeling, you plot distributions, correlations, and trends. Histograms reveal
            skew; scatter plots reveal relationships; box plots flag outliers — all in Matplotlib
            or tools that use it.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Model diagnostics">
          <p className="text-slate-300">
            Training curves, confusion-matrix heatmaps, residual plots, and feature-importance bars
            help you trust (or fix) a model. sklearn and many ML tutorials export figures via
            Matplotlib.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Reports and communication">
          <p className="text-slate-300">
            Stakeholders rarely read raw CSVs. Saved PNG or PDF figures from Matplotlib slide into
            notebooks, slides, and papers with consistent styling.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common plot types at a glance">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Plot</th>
                <th className="px-4 py-3">Typical use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Line', 'Trends over time or ordered x values'],
                ['Scatter', 'Relationship between two numeric variables'],
                ['Bar', 'Compare categories (regions, products, models)'],
                ['Histogram', 'Shape of one variable’s distribution'],
                ['Box', 'Median, spread, and outliers in one view'],
              ].map(([plot, use]) => (
                <tr key={plot} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{plot}</td>
                  <td className="px-4 py-3">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          You do not need every plot type on day one. Start with line and scatter — they cover most
          EDA questions.
        </Callout>
      </LessonSection>

      <LessonSection title="Where Matplotlib sits in your stack">
        <Flowchart
          title="NumPy → Matplotlib → Pandas / ML"
          chart={`flowchart LR
  A[NumPy arrays] --> B[Matplotlib figures]
  C[Pandas DataFrame] --> B
  B --> D[Notebooks & reports]
  B --> E[ML diagnostics]`}
        />
        <p className="mt-4 text-slate-300">
          NumPy holds the numbers. Pandas labels them in tables. Matplotlib draws the picture.
          Your analysis notebook often loops: load → summarize → plot → decide next step.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Matplotlib is the foundation of Python visualization — static and interactive charts from numeric data.',
          'Essential for EDA, model diagnostics, and sharing results in data science and ML workflows.',
          'NumPy supplies arrays; Pandas can delegate plotting to Matplotlib; both feed the same figures.',
        ]}
      />
    </LessonArticle>
  )
}
