import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function PlotTypesNotebook() {
  return (
    <LessonArticle>
      <Definition term="Hands-on plot types">
        <p>
          One small dataset, six chart types — line, scatter, bar, histogram, box plot, and pie. Each
          cell describes what the figure should look like when you run it locally.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        We reuse toy “study score” data so you can focus on plot shape, not data cleaning. Run cells
        in order in Jupyter or Colab to see each figure open.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Shared toy data"
          code={`import matplotlib.pyplot as plt
import numpy as np

hours = np.array([1, 2, 3, 4, 5, 6])
scores = np.array([55, 62, 68, 74, 81, 88])
sections = ["A", "A", "B", "B", "A", "B"]
products = ["Books", "Apps", "Tutors"]
units = [42, 28, 35]

print("hours:", hours)
print("scores:", scores)
print("products:", products, "units:", units)`}
          output={`hours: [1 2 3 4 5 6]
scores: [55 62 68 74 81 88]
products: ['Books', 'Apps', 'Tutors'] units: [42, 28, 35]`}
        />

        <NotebookCell
          cell={2}
          title="Line plot — score trend over hours"
          code={`plt.plot(hours, scores, marker="o")
plt.title("Line: score vs hours")
plt.xlabel("Hours")
plt.ylabel("Score")
plt.show()`}
          output={`[Figure opens: blue line rising left to right, circles at each hour
  scores climb from ~55 to ~88 — clear upward trend]`}
        />

        <NotebookCell
          cell={3}
          title="Scatter — same data as dots"
          code={`plt.scatter(hours, scores)
plt.title("Scatter: score vs hours")
plt.xlabel("Hours")
plt.ylabel("Score")
plt.show()`}
          output={`[Figure opens: six dots in an up-right pattern, no connecting line
  same relationship as line plot, emphasis on individual points]`}
        />

        <NotebookCell
          cell={4}
          title="Bar chart — units by product"
          code={`plt.bar(products, units, color=["#4C72B0", "#55A868", "#C44E52"])
plt.title("Bar: units by product")
plt.ylabel("Units sold")
plt.show()`}
          output={`[Figure opens: three bars — Books tallest (~42), Tutors middle (~35), Apps shortest (~28)]`}
        />

        <NotebookCell
          cell={5}
          title="Histogram — distribution of scores"
          code={`plt.hist(scores, bins=5, edgecolor="white")
plt.title("Histogram: score distribution")
plt.xlabel("Score")
plt.ylabel("Count")
plt.show()`}
          output={`[Figure opens: bars over score ranges — values cluster between 60 and 90
  with only six points, bins are wide; still shows spread]`}
        />

        <NotebookCell
          cell={6}
          title="Box plot — scores by section"
          code={`a_scores = scores[[0, 1, 4]]
b_scores = scores[[2, 3, 5]]
plt.boxplot([a_scores, b_scores], labels=["A", "B"])
plt.title("Box: scores by section")
plt.ylabel("Score")
plt.show()`}
          output={`[Figure opens: two boxes — Section A median near 68, Section B near 74
  small sample so whiskers are short; B slightly higher overall]`}
        />

        <NotebookCell
          cell={7}
          title="Pie chart — share of study resources"
          code={`plt.pie(units, labels=products, autopct="%1.0f%%", startangle=90)
plt.title("Pie: resource share (units sold)")
plt.show()`}
          output={`[Figure opens: three wedges — Books largest slice (~40%), Apps smallest (~27%), Tutors middle (~33%)]`}
        >
          <p>
            Same units as the bar chart — pie emphasizes proportion; bar makes exact comparison
            easier.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Line and scatter suit the same (x, y) pairs — line for ordered trends, scatter for relationships.',
          'Bar compares categories; histogram shows numeric spread; box compares groups; pie shows fractions.',
          'Pick the plot that answers your question — then title and label every axis.',
        ]}
      />
    </LessonArticle>
  )
}
