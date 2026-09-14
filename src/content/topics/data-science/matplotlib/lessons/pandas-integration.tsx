import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PandasIntegrationLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Two doors, same engine">
        If you already use Pandas tables, you can chart without learning every Matplotlib detail first.
        Under the hood, <code className="font-mono text-xs">df.plot()</code> still builds Matplotlib
        figures — Pandas just saves you typing.
      </Callout>

      <Definition term="Pandas plotting">
        <p>
          <strong className="text-white">DataFrame.plot()</strong> is a convenience API: pass column
          names, pick a <code className="font-mono text-xs">kind=</code> (line, bar, hist, scatter,
          …), and Pandas forwards the call to Matplotlib. You get an axes object back, so you can still
          call <code className="font-mono text-xs">set_title</code> or{' '}
          <code className="font-mono text-xs">grid</code> afterward.
        </p>
      </Definition>

      <LessonSection title="Quick charts from a DataFrame">
        <ContentStep number={1} title="Line and bar">
          <p className="text-slate-300">
            Trends over time: <code className="font-mono text-xs">df.plot(x="date", y="sales")</code>.
            Category counts: <code className="font-mono text-xs">df["city"].value_counts().plot(kind="bar")</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="hist and scatter">
          <p className="text-slate-300">
            One numeric column: <code className="font-mono text-xs">df["age"].plot(kind="hist")</code>.
            Two columns:{' '}
            <code className="font-mono text-xs">df.plot(x="hours", y="score", kind="scatter")</code>.
          </p>
        </ContentStep>
        <Example
          title="Line plot from column names"
          output={`[Figure opens: line chart with hours on x-axis and score on y-axis, column name as legend]`}
        >{`import pandas as pd

df = pd.DataFrame({
    "hours": [1, 2, 3, 4, 5],
    "score": [55, 62, 68, 74, 81],
})

ax = df.plot(x="hours", y="score", kind="line", marker="o")
ax.set_title("Study hours vs score")
# Pandas created the figure and axes via Matplotlib`}</Example>
      </LessonSection>

      <LessonSection title="How Pandas wraps Matplotlib">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            When you call <code className="font-mono text-xs">df.plot()</code>, Pandas reads your
            columns, picks default colors, and calls Matplotlib&apos;s{' '}
            <code className="font-mono text-xs">plot</code>, <code className="font-mono text-xs">bar</code>,{' '}
            or <code className="font-mono text-xs">hist</code> functions. The returned object is a
            Matplotlib <code className="font-mono text-xs">Axes</code> — the same type you get from{' '}
            <code className="font-mono text-xs">plt.subplots()</code>.
          </p>
          <p>
            That means anything you learn about titles, legends, and grids on a plain Matplotlib axes
            applies after <code className="font-mono text-xs">df.plot()</code> too.
          </p>
        </div>
        <Flowchart
          title="What happens when you call df.plot()"
          chart={`flowchart LR
  A[DataFrame columns] --> B[df.plot kind=line]
  B --> C[Pandas backend]
  C --> D[Matplotlib Axes]
  D --> E[Figure window or plt.show]`}
        />
      </LessonSection>

      <LessonSection title="When to use .plot() vs plt / ax">
        <ContentStep number={1} title="Reach for df.plot()">
          <p className="text-slate-300">
            Exploratory work: you have a table, you want a fast line, bar, or histogram. Column names
            become labels automatically. Fewer lines of code.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reach for plt or ax directly">
          <p className="text-slate-300">
            Custom layouts (subplots with mixed chart types), fine-grained control (exact tick
            positions, custom patches), or plotting NumPy arrays without a DataFrame.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Best of both">
          <p className="text-slate-300">
            Use <code className="font-mono text-xs">fig, axes = plt.subplots(...)</code>, then pass{' '}
            <code className="font-mono text-xs">ax=axes[0]</code> into{' '}
            <code className="font-mono text-xs">df.plot(...)</code> to place a Pandas chart on one
            panel while drawing something else on another.
          </p>
        </ContentStep>
        <Callout variant="tip">
          Start with <code className="font-mono text-xs">df.plot()</code> during EDA. Switch to explicit
          Matplotlib (or pass <code className="font-mono text-xs">ax=</code>) when the figure layout
          gets complex.
        </Callout>
      </LessonSection>

      <LessonSection title="Same data, two APIs">
        <Example
          title="Pandas .plot vs plt.scatter"
          output={`[Both open similar scatter figures: points for hours vs score]`}
        >{`import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({"hours": [1, 2, 3], "score": [60, 70, 80]})

# Quick path
df.plot(x="hours", y="score", kind="scatter")

# Explicit path — same idea, more control over every argument
plt.scatter(df["hours"], df["score"])
plt.xlabel("hours")
plt.ylabel("score")
plt.show()`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'df.plot() is a fast wrapper: column names in, Matplotlib figure out.',
          'Pandas delegates to Matplotlib — customize the returned axes like any other plot.',
          'Use .plot() for quick EDA; use plt/ax (or ax=) when layout or control gets advanced.',
        ]}
      />
    </LessonArticle>
  )
}
