import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function CustomizationNotebook() {
  return (
    <LessonArticle>
      <Definition term="Hands-on styling">
        <p>
          We build one small dataset, draw a line plot, then layer on colors, markers, a legend, an
          annotation, and grid — the same polish steps from the customization lesson.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell: goal in English → code → output. Run locally to see the figure window; here we
        describe what the chart looks like in the output text.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Data and base plot"
          code={`import matplotlib.pyplot as plt

weeks = [1, 2, 3, 4, 5, 6]
team_a = [10, 14, 13, 18, 20, 24]
team_b = [8, 11, 15, 14, 19, 21]

fig, ax = plt.subplots(figsize=(7, 4))
print("axes ready, weeks:", weeks)`}
          output={`axes ready, weeks: [1, 2, 3, 4, 5, 6]`}
        >
          <p>
            Two series over six weeks — a common “compare teams” shape for practicing styles.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Colors, markers, and line styles"
          code={`ax.plot(
    weeks, team_a,
    color="steelblue", marker="o", linestyle="-", linewidth=2,
    label="Team A",
)
ax.plot(
    weeks, team_b,
    color="darkorange", marker="s", linestyle="--", linewidth=2,
    label="Team B",
)
print("both lines drawn")`}
          output={`both lines drawn
[Figure update: blue solid line with circles; orange dashed line with squares]`}
        >
          <p>
            Contrasting color plus marker shape helps readers tell the series apart even in grayscale
            prints.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Legend and title"
          code={`ax.legend(loc="upper left")
ax.set_title("Weekly tasks completed")
ax.set_xlabel("Week")
ax.set_ylabel("Tasks")
print("labels added")`}
          output={`labels added
[Figure update: legend box top-left; title and axis labels visible]`}
        />

        <NotebookCell
          cell={4}
          title="Annotation at Team A's best week"
          code={`best_week, best_value = 6, 24
ax.annotate(
    "best week",
    xy=(best_week, best_value),
    xytext=(4.5, 26),
    arrowprops=dict(arrowstyle="->", color="gray"),
)
print(f"annotated week {best_week}, value {best_value}")`}
          output={`annotated week 6, value 24
[Figure update: arrow points to the highest blue marker]`}
        >
          <p>
            <code className="font-mono text-xs">xy</code> is the data point;{' '}
            <code className="font-mono text-xs">xytext</code> is where the label sits.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Grid and tight layout"
          code={`ax.grid(True, alpha=0.3)
plt.tight_layout()
plt.show()
print("figure shown")`}
          output={`figure shown
[Figure opens: polished line chart — grid lines, legend, annotation, no clipped labels]`}
        >
          <p>
            Light grid lines make it easier to read values off the y-axis without overpowering the
            data.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Combine color, marker, and linestyle so multiple series stay distinct.',
          'legend, title, and axis labels tell readers what they are looking at.',
          'annotate highlights a point; grid and tight_layout finish the polish.',
        ]}
      />
    </LessonArticle>
  )
}
