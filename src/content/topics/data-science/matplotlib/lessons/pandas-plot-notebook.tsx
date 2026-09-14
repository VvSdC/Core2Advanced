import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function PandasPlotNotebook() {
  return (
    <LessonArticle>
      <Definition term="Plot straight from a table">
        <p>
          Build a small DataFrame, then try line, bar, and histogram plots with{' '}
          <code className="font-mono text-xs">.plot()</code>. The last cell shows how to pass{' '}
          <code className="font-mono text-xs">ax=</code> from <code className="font-mono text-xs">subplots</code>{' '}
          for a multi-panel layout.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Pandas creates Matplotlib figures for you. Run each cell locally to see charts; here we
        describe each figure in the output text.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a sample DataFrame"
          code={`import pandas as pd
import matplotlib.pyplot as plt

df = pd.DataFrame({
    "month": ["Jan", "Feb", "Mar", "Apr", "May"],
    "revenue": [12, 15, 14, 18, 22],
    "cost": [8, 9, 10, 11, 12],
})
print(df)`}
          output={`  month  revenue  cost
0   Jan       12     8
1   Feb       15     9
2   Mar       14    10
3   Apr       18    11
4   May       22    12`}
        />

        <NotebookCell
          cell={2}
          title="Line plot — revenue over months"
          code={`ax = df.plot(x="month", y="revenue", kind="line", marker="o")
ax.set_title("Revenue by month")
ax.set_ylabel("Revenue (k)")
plt.show()
print("line plot done")`}
          output={`line plot done
[Figure opens: line with circle markers, months on x-axis, upward trend toward May]`}
        >
          <p>
            Column names become axis labels and legend entries — no manual{' '}
            <code className="font-mono text-xs">plt.plot</code> calls needed for a quick trend check.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Bar plot — compare revenue and cost"
          code={`df.plot(x="month", y=["revenue", "cost"], kind="bar")
plt.title("Revenue vs cost")
plt.ylabel("Amount (k)")
plt.tight_layout()
plt.show()
print("bar plot done")`}
          output={`bar plot done
[Figure opens: grouped bars per month — taller revenue bars, shorter cost bars]`}
        />

        <NotebookCell
          cell={4}
          title="Histogram — revenue distribution"
          code={`df["revenue"].plot(kind="hist", bins=4, title="Revenue spread")
plt.xlabel("Revenue (k)")
plt.show()
print("histogram done")`}
          output={`histogram done
[Figure opens: four bins showing how revenue values cluster between 12 and 22]`}
        >
          <p>
            A single Series also has <code className="font-mono text-xs">.plot()</code> — handy for
            one-column distributions.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Subplots with ax= — line on top, bar below"
          code={`fig, axes = plt.subplots(2, 1, figsize=(7, 6))

df.plot(x="month", y="revenue", kind="line", marker="o", ax=axes[0])
axes[0].set_title("Revenue trend")

df.plot(x="month", y="cost", kind="bar", ax=axes[1], legend=False)
axes[1].set_title("Cost by month")

plt.tight_layout()
plt.show()
print("subplot figure done")`}
          output={`subplot figure done
[Figure opens: two stacked panels — line chart on top, bar chart on bottom, shared month labels]`}
        >
          <p>
            Passing <code className="font-mono text-xs">ax=</code> tells Pandas which subplot to draw
            on — combine quick <code className="font-mono text-xs">.plot()</code> calls with Matplotlib
            layout control.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'df.plot(kind=...) covers line, bar, hist, and more from column names.',
          'Plot one Series (df["col"]) or many columns (y=[...]) on the same chart.',
          'Pass ax= from subplots when you need multiple panels in one figure.',
        ]}
      />
    </LessonArticle>
  )
}
