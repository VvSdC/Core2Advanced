import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SubplotsLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        One chart per question is fine — until you want to compare a trend and a distribution side
        by side. Subplots put multiple panels in one Figure so readers see everything at once.
      </Callout>

      <Definition term="Subplots">
        <p>
          <strong className="text-white">Subplots</strong> are multiple Axes objects inside one
          Figure — arranged in a grid (1 row × 2 columns, 2×2, and so on).{' '}
          <code className="font-mono text-xs">plt.subplots(nrows, ncols)</code> creates the grid and
          returns handles you plot into.
        </p>
      </Definition>

      <LessonSection title="Why use subplots">
        <ContentStep number={1} title="Compare views of the same data">
          <p className="text-slate-300">
            Line trend on the left, histogram of residuals on the right — one glance, two answers.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Dashboard-style layouts">
          <p className="text-slate-300">
            KPI charts for a report: sales by month, by region, and by product in a 2×2 grid.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Consistent sizing for export">
          <p className="text-slate-300">
            One <code className="font-mono text-xs">fig.savefig()</code> captures all panels with
            matching font sizes and dimensions.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Creating a grid with plt.subplots">
        <Example
          title="1×2 grid — line and scatter"
          output={`[Figure opens: two panels side by side in one window
  Left: line of visits Jan–Jun trending up
  Right: scatter of hours vs score trending up-right
  Shared figsize (10, 4) keeps panels aligned]`}
        >{`import matplotlib.pyplot as plt

months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
visits = [1200, 1350, 1480, 1620, 1850, 2100]
hours = [1, 2, 3, 4, 5, 6]
scores = [55, 62, 68, 74, 81, 88]

fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot(months, visits, marker="o")
axes[0].set_title("Monthly visits")
axes[0].set_ylabel("Visits")

axes[1].scatter(hours, scores)
axes[1].set_title("Hours vs score")
axes[1].set_xlabel("Hours")
axes[1].set_ylabel("Score")

fig.tight_layout()
plt.show()`}</Example>
        <p className="mt-3 text-sm text-slate-300">
          <code className="font-mono text-xs">axes</code> is a 1-D array when you have one row —
          use <code className="font-mono text-xs">axes[0]</code> and{' '}
          <code className="font-mono text-xs">axes[1]</code>. For a 2×2 grid, index with{' '}
          <code className="font-mono text-xs">axes[row, col]</code> or flatten the array.
        </p>
      </LessonSection>

      <LessonSection title="2×2 grid — four plot types">
        <Example
          title="Mini dashboard on one Figure"
          output={`[Figure opens: four panels in a 2×2 grid
  Top-left: line (visits), top-right: scatter (hours vs score)
  Bottom-left: bar (products), bottom-right: histogram (random scores)
  tight_layout() reduces label overlap between panels]`}
        >{`import matplotlib.pyplot as plt
import numpy as np

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot([1, 2, 3], [10, 15, 13], marker="o")
axes[0, 0].set_title("Line")

axes[0, 1].scatter([1, 2, 3], [5, 7, 6])
axes[0, 1].set_title("Scatter")

axes[1, 0].bar(["A", "B"], [3, 5])
axes[1, 0].set_title("Bar")

axes[1, 1].hist(np.random.normal(0, 1, 100), bins=15)
axes[1, 1].set_title("Histogram")

fig.tight_layout()
plt.show()`}</Example>
      </LessonSection>

      <Callout variant="tip">
        Call <code className="font-mono text-xs">fig.tight_layout()</code> before{' '}
        <code className="font-mono text-xs">plt.show()</code> to auto-adjust spacing. If titles still
        clip, increase figsize or use subplots_adjust.
      </Callout>

      <KeyTakeaways
        items={[
          'plt.subplots(rows, cols) returns fig and an array of Axes — plot into each panel separately.',
          'Side-by-side subplots help compare related views without switching windows.',
          'Use tight_layout() and sensible figsize so labels and titles stay readable.',
        ]}
      />
    </LessonArticle>
  )
}
