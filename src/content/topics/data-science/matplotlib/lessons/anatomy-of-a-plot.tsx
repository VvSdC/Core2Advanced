import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AnatomyOfAPlot() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        A chart is not one blob — it has layers: the window, the drawing area, the axes numbers, the
        title, and the legend. Knowing the names helps you fix “wrong labels” or “tiny subplot” bugs
        in one line instead of guessing.
      </Callout>

      <Definition term="Figure and Axes">
        <p>
          A <strong className="text-white">Figure</strong> is the top-level container — the whole
          image or window. An <strong className="text-white">Axes</strong> (one “plot panel”) lives
          inside it and holds the actual data artists: lines, bars, scatter points. One Figure can
          contain many Axes (subplots).
        </p>
      </Definition>

      <LessonSection title="The main pieces">
        <ContentStep number={1} title="Figure">
          <p className="text-slate-300">
            Created by <code className="font-mono text-xs">plt.figure()</code> or{' '}
            <code className="font-mono text-xs">fig, ax = plt.subplots()</code>. Controls overall
            size (figsize) and what gets saved with <code className="font-mono text-xs">fig.savefig()</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Axes">
          <p className="text-slate-300">
            The rectangle where data draws. Methods like <code className="font-mono text-xs">ax.plot()</code>,{' '}
            <code className="font-mono text-xs">ax.set_title()</code>, and{' '}
            <code className="font-mono text-xs">ax.legend()</code> target one panel. Variable name{' '}
            <code className="font-mono text-xs">ax</code> is convention, short for Axes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Axis (x and y)">
          <p className="text-slate-300">
            Not the same as Axes! The <strong className="text-white">x-axis</strong> and{' '}
            <strong className="text-white">y-axis</strong> are the number lines with tick marks.
            <code className="font-mono text-xs"> ax.set_xlabel()</code> and{' '}
            <code className="font-mono text-xs">ax.set_ylabel()</code> name what those numbers mean.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Title, labels, legend">
          <p className="text-slate-300">
            <strong className="text-white">Title</strong> — headline for the whole panel.{' '}
            <strong className="text-white">xlabel / ylabel</strong> — units or column names.{' '}
            <strong className="text-white">Legend</strong> — maps colors or markers to series names
            when you plot more than one line or group.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How the hierarchy fits together">
        <Flowchart
          title="Figure → Axes → artists"
          chart={`flowchart TB
  F[Figure — entire canvas]
  F --> A1[Axes 1 — one panel]
  F --> A2[Axes 2 — optional second panel]
  A1 --> L[Line / scatter / bar artists]
  A1 --> T[Title & axis labels]
  A1 --> LG[Legend]
  A1 --> X[x-axis ticks]
  A1 --> Y[y-axis ticks]`}
        />
        <p className="mt-4 text-slate-300">
          Everything you see is an “artist” attached to an Axes (or the Figure for suptitles). pyplot
          shortcuts like <code className="font-mono text-xs">plt.plot()</code> pick the “current” Axes
          automatically — fine for one plot; explicit <code className="font-mono text-xs">ax</code>{' '}
          objects scale better for subplots.
        </p>
      </LessonSection>

      <LessonSection title="pyplot vs explicit Axes">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">plt.plot(x, y)</strong> — quick and familiar. Matplotlib
            creates a Figure and Axes if none exist.
          </p>
          <p>
            <strong className="text-white">fig, ax = plt.subplots()</strong> then{' '}
            <strong className="text-white">ax.plot(x, y)</strong> — recommended when you need
            subplots or tight control over one panel.
          </p>
        </div>
        <Callout variant="tip">
          If your legend overlaps the data, you are probably editing the right Axes — use{' '}
          <code className="font-mono text-xs">ax.legend(loc=&quot;best&quot;)</code> or move it
          outside with bbox settings later in the customization lessons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Figure = whole canvas; Axes = one plot panel; Axis = the x or y number line.',
          'Title, xlabel, ylabel, and legend make a chart readable — always add them for others.',
          'Prefer fig, ax = plt.subplots() when you will have multiple panels or fine-grained control.',
        ]}
      />
    </LessonArticle>
  )
}
