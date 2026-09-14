import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SubplotsNotebook() {
  return (
    <LessonArticle>
      <Definition term="Hands-on subplots">
        <p>
          We build a 1×2 comparison (line vs scatter on the same study data), then a 2×2 grid mixing
          plot types — each output describes the combined figure.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Subplots share one Figure window. Run each cell locally to see all panels appear together
        instead of as separate pop-ups.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Data for side-by-side panels"
          code={`import matplotlib.pyplot as plt
import numpy as np

hours = np.array([1, 2, 3, 4, 5, 6])
scores = np.array([55, 62, 68, 74, 81, 88])
months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"]
visits = [900, 1020, 1100, 1250, 1380, 1500]

print("hours:", hours, "scores:", scores)
print("months:", months, "visits:", visits)`}
          output={`hours: [1 2 3 4 5 6] scores: [55 62 68 74 81 88]
months: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] visits: [900, 1020, 1100, 1250, 1380, 1500]`}
        />

        <NotebookCell
          cell={2}
          title="1×2 grid — line vs scatter"
          code={`fig, axes = plt.subplots(1, 2, figsize=(10, 4))

axes[0].plot(months, visits, marker="o", color="#4C72B0")
axes[0].set_title("Line: site visits by month")
axes[0].set_ylabel("Visits")

axes[1].scatter(hours, scores, color="#C44E52")
axes[1].set_title("Scatter: score vs hours")
axes[1].set_xlabel("Hours studied")
axes[1].set_ylabel("Score")

fig.suptitle("Two views — trend vs relationship", fontsize=12)
fig.tight_layout()
plt.show()`}
          output={`[Figure opens: one window, two panels side by side
  Left: blue line climbing from ~900 (Jan) to ~1500 (Jun)
  Right: red dots rising from (1, 55) to (6, 88)
  Suptitle centered above both panels]`}
        >
          <p>
            Same Figure, two Axes — readers compare a time trend with a correlation in one screenshot.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="2×2 grid — four plot types"
          code={`np.random.seed(2)
products = ["Books", "Apps", "Tutors"]
units = [42, 28, 35]
noise = np.random.normal(75, 6, 80)

fig, axes = plt.subplots(2, 2, figsize=(10, 8))

axes[0, 0].plot(hours, scores, marker="o")
axes[0, 0].set_title("Line")

axes[0, 1].scatter(hours, scores)
axes[0, 1].set_title("Scatter")

axes[1, 0].bar(products, units)
axes[1, 0].set_title("Bar")

axes[1, 1].hist(noise, bins=12, edgecolor="white")
axes[1, 1].set_title("Histogram")

fig.suptitle("2×2 plot type comparison", fontsize=12)
fig.tight_layout()
plt.show()`}
          output={`[Figure opens: four equal panels in a 2×2 grid
  Top row: line and scatter of hours vs scores (upward patterns)
  Bottom-left: three bars — Books tallest, Apps shortest
  Bottom-right: bell-shaped histogram centered near 75
  Suptitle above the grid; tight_layout prevents overlap]`}
        >
          <p>
            Index with <code className="font-mono text-xs">axes[row, col]</code> — (0,0) top-left,
            (1,1) bottom-right.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Flatten axes for a loop (optional pattern)"
          code={`fig, axes = plt.subplots(2, 2, figsize=(8, 6))
titles = ["Line", "Scatter", "Bar", "Hist"]
for ax, title in zip(axes.flat, titles):
    ax.set_title(title)
    ax.text(0.5, 0.5, title, ha="center", va="center", transform=ax.transAxes)
fig.tight_layout()
plt.show()`}
          output={`[Figure opens: 2×2 grid with centered text labels "Line", "Scatter", "Bar", "Hist"
  Demonstrates axes.flat — useful when panels share similar setup code]`}
        >
          <p>
            Loops over <code className="font-mono text-xs">axes.flat</code> keep repetitive styling
            DRY when you have many similar panels.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'plt.subplots(1, 2) for side-by-side; plt.subplots(2, 2) for a four-panel dashboard.',
          'Set titles per Axes; use fig.suptitle for a headline above the whole grid.',
          'tight_layout() before show(); use axes[row, col] or axes.flat to target each panel.',
        ]}
      />
    </LessonArticle>
  )
}
