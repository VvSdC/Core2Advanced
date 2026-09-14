import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function AnatomyNotebook() {
  return (
    <LessonArticle>
      <Definition term="Hands-on plot anatomy">
        <p>
          We build one simple line chart with title, axis labels, and a legend — then describe what
          the figure looks like so you know what to expect when you run it locally.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        On this site we show code and a text description of the figure. Run the same cells in
        Jupyter or Colab to see the chart pop up on your screen.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample data — two study sessions"
          code={`import matplotlib.pyplot as plt
import numpy as np

hours = np.array([1, 2, 3, 4, 5])
score_a = np.array([55, 62, 68, 74, 81])
score_b = np.array([50, 58, 65, 70, 78])

print("hours:", hours)
print("score_a:", score_a)
print("score_b:", score_b)`}
          output={`hours: [1 2 3 4 5]
score_a: [55 62 68 74 81]
score_b: [50 58 65 70 78]`}
        >
          <p>
            Two upward trends — same study hours on the x-axis, different score paths for group A and
            B.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Create Figure and Axes, draw both lines"
          code={`fig, ax = plt.subplots(figsize=(6, 4))

ax.plot(hours, score_a, marker="o", label="Group A")
ax.plot(hours, score_b, marker="s", label="Group B")

ax.set_title("Study hours vs test score")
ax.set_xlabel("Hours studied")
ax.set_ylabel("Score")
ax.legend()
plt.show()`}
          output={`[Figure opens: 6×4 inch panel titled "Study hours vs test score"
  x-axis: Hours studied (1–5)
  y-axis: Score (about 50–81)
  Blue line with circles (Group A) above orange squares (Group B)
  Legend in upper-left maps markers to group names]`}
        >
          <p>
            Every labeled piece from the anatomy lesson appears here: Figure, Axes, title, x/y labels,
            two line artists, and a legend.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Same plot with pyplot shortcuts"
          code={`plt.figure(figsize=(6, 4))
plt.plot(hours, score_a, marker="o", label="Group A")
plt.plot(hours, score_b, marker="s", label="Group B")
plt.title("Study hours vs test score")
plt.xlabel("Hours studied")
plt.ylabel("Score")
plt.legend()
plt.show()`}
          output={`[Figure opens: identical layout to cell 2 — pyplot targets the current Axes automatically]`}
        >
          <p>
            pyplot is shorter for one panel. For subplots later, switch back to{' '}
            <code className="font-mono text-xs">fig, ax = plt.subplots()</code>.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'fig, ax = plt.subplots() gives you explicit control over one plot panel.',
          'set_title, set_xlabel, set_ylabel, and legend() make the chart self-explanatory.',
          'label= on each plot line feeds the legend — always add labels when comparing series.',
        ]}
      />
    </LessonArticle>
  )
}
