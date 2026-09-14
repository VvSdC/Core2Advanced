import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function BarHistogramBoxPie() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Different questions need different shapes: compare categories (bar), see how values spread
        (histogram), spot outliers (box), or show parts of a whole (pie). Match the chart to the
        question — not the other way around.
      </Callout>

      <Definition term="Four common plot types">
        <p>
          <strong className="text-white">Bar</strong> charts compare discrete categories.{' '}
          <strong className="text-white">Histograms</strong> bin numeric data to show distribution.{' '}
          <strong className="text-white">Box plots</strong> summarize median and spread.{' '}
          <strong className="text-white">Pie charts</strong> show proportions — use sparingly.
        </p>
      </Definition>

      <LessonSection title="Bar chart — categorical comparisons">
        <ContentStep number={1} title="Best for">
          <p className="text-slate-300">
            Sales by region, votes by candidate, average score by section — a few named groups side
            by side.
          </p>
        </ContentStep>
        <Example
          title="Units sold by product"
          output={`[Figure opens: three vertical bars — Widget 120, Gadget 85, Gizmo 95
  x-axis: product names, y-axis: units sold]`}
        >{`import matplotlib.pyplot as plt

products = ["Widget", "Gadget", "Gizmo"]
units = [120, 85, 95]

plt.bar(products, units, color=["#4C72B0", "#55A868", "#C44E52"])
plt.title("Units sold by product")
plt.ylabel("Units")
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Histogram — distribution">
        <ContentStep number={1} title="Best for">
          <p className="text-slate-300">
            Exam scores, response times, pixel brightness — how often values fall in each range.
          </p>
        </ContentStep>
        <Example
          title="Simulated exam scores"
          output={`[Figure opens: bell-shaped bars centered near 75
  x-axis: score bins, y-axis: count, most students in the 70–80 range]`}
        >{`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(0)
scores = np.random.normal(75, 8, 200)

plt.hist(scores, bins=15, edgecolor="white")
plt.title("Exam score distribution")
plt.xlabel("Score")
plt.ylabel("Count")
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Box plot — spread and outliers">
        <ContentStep number={1} title="Best for">
          <p className="text-slate-300">
            Compare distributions across groups — median line, box for middle 50%, whiskers for
            range, dots for outliers.
          </p>
        </ContentStep>
        <Example
          title="Scores in two sections"
          output={`[Figure opens: two boxes side by side — Section A median ~72, Section B ~78
  B sits slightly higher; a few outlier dots above each whisker]`}
        >{`import matplotlib.pyplot as plt
import numpy as np

np.random.seed(1)
section_a = np.random.normal(72, 10, 50)
section_b = np.random.normal(78, 9, 50)

plt.boxplot([section_a, section_b], labels=["Section A", "Section B"])
plt.title("Score spread by section")
plt.ylabel("Score")
plt.show()`}</Example>
      </LessonSection>

      <LessonSection title="Pie chart — proportions (with caution)">
        <ContentStep number={1} title="Best for">
          <p className="text-slate-300">
            A handful of categories that sum to 100% — market share, budget split. Hard to compare
            similar slices; avoid when you have more than five slices or need precise comparisons.
          </p>
        </ContentStep>
        <Example
          title="Traffic sources"
          output={`[Figure opens: four colored slices — Direct 40%, Search 35%, Social 15%, Email 10%
  labels on each wedge with percentages]`}
        >{`import matplotlib.pyplot as plt

sources = ["Direct", "Search", "Social", "Email"]
share = [40, 35, 15, 10]

plt.pie(share, labels=sources, autopct="%1.0f%%", startangle=90)
plt.title("Traffic by source")
plt.show()`}</Example>
        <Callout variant="insight">
          When slices are similar size or you have many categories, a horizontal bar chart is often
          easier to read than a pie chart.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Bar: compare categories. Histogram: shape of one numeric variable. Box: median, spread, outliers by group.',
          'Pie: parts of a whole — only when few categories and proportions matter more than exact comparison.',
          'Prefer bar over pie when values are close or labels would crowd the chart.',
        ]}
      />
    </LessonArticle>
  )
}
