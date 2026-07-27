import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function PandasPlotting() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Plots from your table">
        Pandas can draw charts straight from a DataFrame with{' '}
        <code className="font-mono text-xs">.plot()</code>. On this site we show the code and describe
        the figure in the output — run the same lines locally to see the chart open.
      </Callout>

      <Definition term="df.plot()">
        <p>
          <strong className="text-white">.plot()</strong> is a quick wrapper around Matplotlib. Pass{' '}
          <code className="font-mono text-xs">kind=</code> for line, bar, hist, box, scatter, and
          more. It uses column names for labels when possible.
        </p>
      </Definition>

      <LessonSection title="Built-in plot kinds">
        <ContentStep number={1} title="Line / bar">
          <p className="text-slate-300">Trends over time or category comparisons.</p>
        </ContentStep>
        <ContentStep number={2} title="hist / box">
          <p className="text-slate-300">Distribution of one numeric column (spread, outliers).</p>
        </ContentStep>
        <ContentStep number={3} title="scatter">
          <p className="text-slate-300">Relationship between two numeric columns.</p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample data"
          code={`import pandas as pd

df = pd.DataFrame({
    "hours": [1, 2, 3, 4, 5, 6],
    "score": [55, 62, 68, 74, 81, 88],
    "section": ["A", "A", "B", "B", "A", "B"],
})
print(df)`}
          output={`   hours  score section
0      1     55       A
1      2     62       A
2      3     68       B
3      4     74       B
4      5     81       A
5      6     88       B`}
        />

        <NotebookCell
          cell={2}
          title="Line plot — score vs hours"
          code={`ax = df.plot(x="hours", y="score", kind="line", marker="o")
ax.set_title("Study hours vs score")
# → opens a figure: upward line with markers`}
          output={`[Figure opens: line chart, hours on x-axis, score on y-axis]`}
        />

        <NotebookCell
          cell={3}
          title="Histogram — score distribution"
          code={`df["score"].plot(kind="hist", bins=5, title="Score distribution")
# → opens a figure: bars showing how scores cluster`}
          output={`[Figure opens: histogram of score column]`}
        />

        <NotebookCell
          cell={4}
          title="Box plot — spread and outliers"
          code={`df.plot(y="score", kind="box")
# → opens a figure: box showing median, quartiles, whiskers`}
          output={`[Figure opens: box plot for score]`}
        />

        <NotebookCell
          cell={5}
          title="Scatter — two numeric columns"
          code={`df.plot(x="hours", y="score", kind="scatter")
# → opens a figure: points trending up-right`}
          output={`[Figure opens: scatter plot hours vs score]`}
        />

        <NotebookCell
          cell={6}
          title="Matplotlib — same data, more control"
          code={`import matplotlib.pyplot as plt

plt.scatter(df["hours"], df["score"])
plt.xlabel("hours")
plt.ylabel("score")
plt.title("Matplotlib scatter")
plt.show()
# → opens a figure (Pandas .plot uses Matplotlib under the hood)`}
          output={`[Figure opens: Matplotlib scatter]`}
        />

        <NotebookCell
          cell={7}
          title="Seaborn — statistical styling (optional)"
          code={`import seaborn as sns

sns.scatterplot(data=df, x="hours", y="score", hue="section")
# → opens a figure: scatter with A/B sections in different colors`}
          output={`[Figure opens: Seaborn scatter colored by section]`}
        >
          <p>
            Seaborn expects a DataFrame and column names — nice defaults for colors and legends. Install
            with <code className="font-mono text-xs">pip install seaborn</code> if needed.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'df.plot(kind=...) is the fastest path from table to chart.',
          'hist and box explore one column; scatter compares two.',
          'Matplotlib and Seaborn add control; Pandas .plot delegates to Matplotlib.',
        ]}
      />
    </LessonArticle>
  )
}
