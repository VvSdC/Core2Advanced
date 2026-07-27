import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SortingData() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Sort a spreadsheet by score (highest first), then by name (A–Z). Pandas does the same with{' '}
        <code className="font-mono text-xs">sort_values</code> and{' '}
        <code className="font-mono text-xs">sort_index</code>.
      </Callout>

      <Definition term="sort_values vs sort_index">
        <p>
          <strong className="text-white">sort_values</strong> orders rows by one or more column
          values. <strong className="text-white">sort_index</strong> orders by row labels (the index)
          or column names.
        </p>
      </Definition>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample table"
          code={`import pandas as pd

df = pd.DataFrame({
    "name": ["Cara", "Ana", "Ben", "Ana"],
    "score": [88, 92, 75, 85],
    "city": ["LA", "NYC", "LA", "NYC"],
})
print(df)`}
          output={`   name  score city
0  Cara     88   LA
1   Ana     92  NYC
2   Ben     75   LA
3   Ana     85  NYC`}
        />

        <NotebookCell
          cell={2}
          title="sort_values — one column, descending"
          code={`print(df.sort_values("score", ascending=False))`}
          output={`   name  score city
1   Ana     92  NYC
0  Cara     88   LA
3   Ana     85  NYC
2   Ben     75   LA`}
        />

        <NotebookCell
          cell={3}
          title="Sort by multiple columns"
          code={`print(df.sort_values(["city", "score"], ascending=[True, False]))`}
          output={`   name  score city
0  Cara     88   LA
2   Ben     75   LA
1   Ana     92  NYC
3   Ana     85  NYC`}
        >
          <p>
            First sort by city (A→Z), then within each city sort score high→low (
            <code className="font-mono text-xs">ascending=[True, False]</code>).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="sort_index — order by row labels"
          code={`shuffled = df.sample(frac=1, random_state=0)
print("before:", shuffled.index.tolist())
print(shuffled.sort_index())`}
          output={`before: [2, 0, 3, 1]
   name  score city
0  Cara     88   LA
1   Ana     92  NYC
2   Ben     75   LA
3   Ana     85  NYC`}
        />

        <NotebookCell
          cell={5}
          title="Reindex rows and reorder columns"
          code={`print(df.reindex([2, 0, 1, 3]))
print()
print(df[["city", "name", "score"]])  # column order`}
          output={`   name  score city
2   Ben     75   LA
0  Cara     88   LA
1   Ana     92  NYC
3   Ana     85  NYC

  city  name  score
0   LA  Cara     88
1  NYC   Ana     92
2   LA   Ben     75
3  NYC   Ana     85`}
        >
          <p>
            <code className="font-mono text-xs">reindex</code> picks a new row order (adds NaN rows
            for missing labels). Select columns in a list to reorder them.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'sort_values orders by column(s); ascending=False for descending.',
          'Pass a list to by= for tie-breaker columns.',
          'reindex and column lists let you reorder rows and columns explicitly.',
        ]}
      />
    </LessonArticle>
  )
}
