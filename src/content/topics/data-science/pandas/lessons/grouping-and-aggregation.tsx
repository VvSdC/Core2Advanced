import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function GroupingAndAggregation() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        “What is the average score per department?” That question splits your table into groups and
        summarizes each one. Pandas calls this split-apply-combine — and{' '}
        <code className="font-mono text-xs">groupby</code> is the main tool.
      </Callout>

      <Definition term="groupby — split, apply, combine">
        <p>
          <strong className="text-white">groupby</strong> splits a DataFrame into groups (by a column
          or rule), runs a function on each group (mean, sum, count…), then combines the results
          into a new table or Series.
        </p>
      </Definition>

      <LessonSection title="Split → apply → combine">
        <ContentStep number={1} title="Split">
          <p className="text-slate-300">
            Pick a column like <code className="font-mono text-xs">city</code>. Pandas creates one
            group per unique city.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Apply">
          <p className="text-slate-300">
            Run an aggregation — mean, sum, count — on each group’s columns.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Combine">
          <p className="text-slate-300">
            Pandas stacks the group results back into a tidy output (often with the group name as
            the index).
          </p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample sales table"
          code={`import pandas as pd

sales = pd.DataFrame({
    "city": ["NYC", "NYC", "LA", "LA", "NYC"],
    "product": ["A", "B", "A", "B", "A"],
    "units": [10, 5, 8, 12, 3],
    "revenue": [100, 50, 80, 120, 30],
})
print(sales)`}
          output={`  city product  units  revenue
0  NYC       A     10      100
1  NYC       B      5       50
2   LA       A      8       80
3   LA       B     12      120
4  NYC       A      3       30`}
        />

        <NotebookCell
          cell={2}
          title="Group by city — mean revenue"
          code={`print(sales.groupby("city")["revenue"].mean())`}
          output={`city
LA     100.0
NYC     60.0
Name: revenue, dtype: float64`}
        />

        <NotebookCell
          cell={3}
          title="agg — multiple summaries at once"
          code={`print(sales.groupby("city").agg({
    "units": ["sum", "mean"],
    "revenue": ["sum", "max"],
}))`}
          output={`     units       revenue
       sum  mean     sum  max
city
LA      20  10.0     200  120
NYC     18   6.0     180  100`}
        >
          <p>
            <code className="font-mono text-xs">agg</code> lets you pick different functions per
            column. Pass a list for multiple stats on the same column.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="count vs size"
          code={`g = sales.groupby("city")
print("count (non-NaN per column):")
print(g.count())
print()
print("size (rows per group, includes NaN rows):")
print(g.size())`}
          output={`count (non-NaN per column):
     product  units  revenue
city
LA         2      2        2
NYC        3      3        3

size (rows per group, includes NaN rows):
city
LA     2
NYC    3
dtype: int64`}
        >
          <p>
            <code className="font-mono text-xs">count</code> counts non-missing values per column.{' '}
            <code className="font-mono text-xs">size</code> counts rows in each group — useful when
            you only care about how many records exist.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Custom aggregation"
          code={`def revenue_range(s):
    return s.max() - s.min()

print(sales.groupby("city")["revenue"].agg(["mean", revenue_range]))`}
          output={`       mean  revenue_range
city
LA     100.0           40.0
NYC     60.0           70.0`}
        />
      </div>

      <LessonSection title="Quick reference">
        <Example title="Common aggregations">
{`df.groupby("category")["price"].sum()
df.groupby("category").mean(numeric_only=True)
df.groupby("category").agg({"price": "mean", "qty": "sum"})`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'groupby splits data, applies a function, and combines results.',
          'Use agg for mean, sum, count, or custom functions in one call.',
          'count counts non-NaN values; size counts rows per group.',
        ]}
      />
    </LessonArticle>
  )
}
