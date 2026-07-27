import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function MultiIndexLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Labels within labels">
        Sometimes one row label is not enough — e.g. city <em>and</em> year. A{' '}
        <strong className="text-white">MultiIndex</strong> stacks several label levels on rows or
        columns so you can group and slice hierarchically.
      </Callout>

      <Definition term="MultiIndex (hierarchical index)">
        <p>
          A <strong className="text-white">MultiIndex</strong> has two or more index levels. You see
          it after <code className="font-mono text-xs">groupby</code> with multiple keys, or when you
          build one with <code className="font-mono text-xs">pd.MultiIndex.from_tuples</code>.
        </p>
      </Definition>

      <LessonSection title="Tools to know">
        <ContentStep number={1} title="groupby → MultiIndex">
          <p className="text-slate-300">Group on two columns; the result index has both levels.</p>
        </ContentStep>
        <ContentStep number={2} title="xs — cross-section">
          <p className="text-slate-300">Pick one value at a level — e.g. all rows for city=&quot;NYC&quot;.</p>
        </ContentStep>
        <ContentStep number={3} title="stack / unstack">
          <p className="text-slate-300">Move a column level to the index (stack) or back (unstack).</p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample table"
          code={`import pandas as pd

sales = pd.DataFrame({
    "city": ["NYC", "NYC", "LA", "LA"],
    "year": [2023, 2024, 2023, 2024],
    "revenue": [100, 120, 80, 95],
})
print(sales)`}
          output={`  city  year  revenue
0  NYC  2023      100
1  NYC  2024      120
2   LA  2023       80
3   LA  2024       95`}
        />

        <NotebookCell
          cell={2}
          title="groupby creates a MultiIndex"
          code={`grouped = sales.groupby(["city", "year"])["revenue"].sum()
print(grouped)
print()
print(grouped.index)`}
          output={`city  year
LA    2023     80
      2024     95
NYC   2023    100
      2024    120
Name: revenue, dtype: int64

MultiIndex([('LA', 2023),
            ('LA', 2024),
            ('NYC', 2023),
            ('NYC', 2024)],
           names=['city', 'year'])`}
        />

        <NotebookCell
          cell={3}
          title="xs — slice one city"
          code={`print(grouped.xs("NYC", level="city"))`}
          output={`year
2023    100
2024    120
Name: revenue, dtype: int64`}
        />

        <NotebookCell
          cell={4}
          title="unstack — year becomes columns"
          code={`wide = grouped.unstack("year")
print(wide)`}
          output={`year    2023  2024
city
LA        80    95
NYC      100   120`}
        />

        <NotebookCell
          cell={5}
          title="stack — columns back to index levels"
          code={`print(wide.stack())`}
          output={`city  year
LA    2023     80
      2024     95
NYC   2023    100
      2024    120
dtype: int64`}
        />

        <NotebookCell
          cell={6}
          title="MultiIndex on columns (brief)"
          code={`cols = pd.MultiIndex.from_tuples([
    ("sales", "units"),
    ("sales", "revenue"),
    ("costs", "rent"),
])
df = pd.DataFrame([[10, 100, 50], [8, 80, 45]], columns=cols)
print(df)
print(df[("sales", "revenue")])`}
          output={`   sales         costs
   units revenue    rent
0     10     100      50
1      8      80      45
0    100
1     80
Name: (sales, revenue), dtype: int64`}
        />
      </div>

      <KeyTakeaways
        items={[
          'MultiIndex stacks label levels on rows or columns.',
          'groupby on multiple keys returns a MultiIndex; xs picks one level.',
          'unstack moves an index level to columns; stack reverses it.',
        ]}
      />
    </LessonArticle>
  )
}
