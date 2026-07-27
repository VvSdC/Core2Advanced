import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function ReshapingData() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Why reshape?">
        Real data arrives in the wrong shape for charts or reports. Reshaping turns wide tables
        into long ones (or back) so you can group, plot, or export cleanly.
      </Callout>

      <Definition term="pivot_table, melt, crosstab">
        <p>
          <strong className="text-white">pivot_table</strong> summarizes values into a grid (rows ×
          columns). <strong className="text-white">melt</strong> does the opposite — wide → long.{' '}
          <strong className="text-white">crosstab</strong> counts how often pairs of categories appear
          together.
        </p>
      </Definition>

      <LessonSection title="When to use each">
        <ContentStep number={1} title="pivot_table">
          <p className="text-slate-300">
            You want a summary grid — e.g. average score by city and product.
          </p>
        </ContentStep>
        <ContentStep number={2} title="melt">
          <p className="text-slate-300">
            Columns should become rows — e.g. Jan/Feb/Mar columns → one “month” column and one “value”
            column.
          </p>
        </ContentStep>
        <ContentStep number={3} title="crosstab">
          <p className="text-slate-300">
            You need a frequency table — how many rows fall in each (row category, column category)
            pair.
          </p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample long-format sales"
          code={`import pandas as pd

sales = pd.DataFrame({
    "city": ["NYC", "NYC", "LA", "LA"],
    "product": ["A", "B", "A", "B"],
    "revenue": [100, 50, 80, 120],
})
print(sales)`}
          output={`  city product  revenue
0  NYC       A      100
1  NYC       B       50
2   LA       A       80
3   LA       B      120`}
        />

        <NotebookCell
          cell={2}
          title="pivot_table — city × product grid"
          code={`print(pd.pivot_table(
    sales,
    index="city",
    columns="product",
    values="revenue",
    aggfunc="sum",
))`}
          output={`product    A    B
city
LA        80  120
NYC      100   50`}
        />

        <NotebookCell
          cell={3}
          title="melt — wide to long"
          code={`wide = pd.DataFrame({
    "name": ["Ana", "Ben"],
    "Jan": [10, 20],
    "Feb": [12, 18],
})
print("wide:")
print(wide)
print()
long = pd.melt(wide, id_vars="name", var_name="month", value_name="sales")
print("long:")
print(long)`}
          output={`wide:
  name  Jan  Feb
0  Ana   10   12
1  Ben   20   18

long:
  name month  sales
0  Ana   Jan     10
1  Ben   Jan     20
2  Ana   Feb     12
3  Ben   Feb     18`}
        >
          <p>
            <code className="font-mono text-xs">id_vars</code> stays fixed; other columns melt into{' '}
            <code className="font-mono text-xs">month</code> and <code className="font-mono text-xs">sales</code>.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="crosstab — count pairs"
          code={`survey = pd.DataFrame({
    "gender": ["F", "F", "M", "M", "F"],
    "size": ["S", "M", "M", "L", "S"],
})
print(pd.crosstab(survey["gender"], survey["size"]))`}
          output={`size  L  M  S
gender
F       0  1  2
M       1  1  0`}
        />
      </div>

      <KeyTakeaways
        items={[
          'pivot_table builds summary grids; melt flattens wide tables to long.',
          'crosstab counts category pairs — great for quick frequency tables.',
          'Pick the tool that matches your target shape: grid, long, or counts.',
        ]}
      />
    </LessonArticle>
  )
}
