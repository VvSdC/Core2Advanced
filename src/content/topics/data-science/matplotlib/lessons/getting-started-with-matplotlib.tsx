import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GettingStartedWithMatplotlib() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="You are in the right place">
        This Matplotlib track assumes comfort with Python and the NumPy ideas from earlier lessons
        (arrays, indexing, basic math). You do <strong className="text-white">not</strong> need
        design skills or statistics yet. We start with plain English, then add code with outputs you
        can copy.
      </Callout>

      <Definition term="What is Matplotlib?">
        <p>
          <strong className="text-white">Matplotlib</strong> is Python&apos;s main plotting library.
          You give it numbers (often NumPy arrays or Pandas columns), and it draws line charts,
          scatter plots, histograms, and more — the charts you see in notebooks, reports, and ML
          diagnostics.
        </p>
      </Definition>

      <LessonSection title="How to study this track">
        <ContentStep number={1} title="Follow the catalog order">
          <p className="text-slate-300">
            Sub-topics move from “what is Matplotlib?” → plot anatomy → line and scatter → bar,
            histogram, box, pie → subplots → customization → Pandas integration. Skip ahead only
            after you can make a labeled line plot.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Read the English before the code">
          <p className="text-slate-300">
            Every notebook cell starts with a goal in words. Understand the goal, then read the code
            and output. Run the same lines in Jupyter or Colab to see figures open on your machine.
          </p>
        </ContentStep>
        <ContentStep number={3} title="One idea per sitting">
          <p className="text-slate-300">
            If a lesson feels long, stop after two or three cells. Plotting is muscle memory — small,
            repeated practice beats one long cram session.
          </p>
        </ContentStep>
        <Flowchart
          title="Your learning path"
          chart={`flowchart TB
  A[Intro — what is Matplotlib?] --> B[Anatomy of a plot]
  B --> C[Plot types]
  C --> D[Subplots]
  D --> E[Customization]
  E --> F[Pandas integration]`}
        />
      </LessonSection>

      <LessonSection title="Words you will hear (no stress)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Word</th>
                <th className="px-4 py-3">Friendly meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Figure', 'The whole canvas — one window or one saved image file'],
                ['Axes', 'One plotting area inside a Figure (where lines and bars actually draw)'],
                ['pyplot', 'The plt shortcut API — quick plots with plt.plot, plt.show'],
                ['Axis', 'The x or y scale — tick marks and numbers along the bottom or side'],
                ['Artist', 'Any drawable piece — line, bar, text label, legend box'],
              ].map(([word, meaning]) => (
                <tr key={word} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-medium text-white">{word}</td>
                  <td className="px-4 py-3">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Setup (one time)">
{`pip install matplotlib

# then in Python / notebook:
import matplotlib.pyplot as plt`}
        </Callout>
      </LessonSection>

      <LessonSection title="What “basic → advanced” means here">
        <ContentStep number={1} title="Basic">
          <p className="text-slate-300">
            Import pyplot, draw a line or scatter plot, add title and axis labels, call plt.show().
          </p>
        </ContentStep>
        <ContentStep number={2} title="Comfortable">
          <p className="text-slate-300">
            Use bar, histogram, and box plots; arrange subplots in a grid; tune colors and legends.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Advanced (still beginner-friendly)">
          <p className="text-slate-300">
            Combine Matplotlib with Pandas tables, style publication-ready figures, and reuse the
            same layout for model diagnostics.
          </p>
        </ContentStep>
        <Callout variant="insight">
          You are not behind if terms feel new. Every later lesson reuses the same few ideas: data
          in, figure out, labels so others can read it.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Matplotlib = Python’s core plotting library — turn arrays and tables into charts.',
          'Follow the catalog order; read goals before code; practice in small sittings.',
          'Figure, Axes, pyplot, Axis, and Artist are the core vocabulary for this track.',
        ]}
      />
    </LessonArticle>
  )
}
