import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function SeriesDataframeNotebook() {
  return (
    <LessonArticle>
      <Definition term="Series + DataFrame — hands-on">
        <p>
          This notebook ties together the two core Pandas objects. Each cell: goal in English → code
          → output. Run the same lines in Jupyter or Colab after{' '}
          <code className="font-mono text-xs">import pandas as pd</code>.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        If a cell fails, check that previous cells ran (especially the import). Names like{' '}
        <code className="font-mono text-xs">scores</code> and{' '}
        <code className="font-mono text-xs">df</code> are reused on purpose — that is how real
        notebooks grow.
      </Callout>

      <Callout variant="tip" title="Where you are in the path">
        You know <em>what</em> Series and DataFrame mean. Now you build them, inspect labels, and
        do simple math — the habits every later lesson reuses.
      </Callout>

      <LessonSection title="Flow">
        <Flowchart
          title="First Pandas session"
          chart={`flowchart TB
  A[import pandas as pd] --> B[Create Series]
  B --> C[Create DataFrame]
  C --> D[Inspect index / columns / values]
  D --> E[Simple math]
  E --> F[Rename columns]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Import Pandas"
          code={`import pandas as pd
print(pd.__version__)`}
          output={`2.x.x   # your version may differ`}
        >
          <p>
            The community nickname is <code className="font-mono text-xs">pd</code>. Almost every
            tutorial uses it.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Create a Series from a list"
          code={`scores = pd.Series([88, 92, 79, 95])
print(scores)
print(type(scores))`}
          output={`0    88
1    92
2    79
3    95
dtype: int64
<class 'pandas.core.series.Series'>`}
        >
          <p>
            Default index is 0, 1, 2… — like row numbers in a spreadsheet column.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Series with custom index"
          code={`temps = pd.Series([18.5, 20.1, 19.3], index=["morning", "noon", "evening"])
print(temps)
print(temps["noon"])`}
          output={`morning    18.5
noon       20.1
evening    19.3
dtype: float64
20.1`}
        >
          <p>
            Labels can be words, dates, or IDs — not only integers.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Create a DataFrame from a dict"
          code={`df = pd.DataFrame({
    "name": ["Ana", "Ben", "Cara"],
    "score": [88, 92, 79],
    "city": ["Delhi", "Mumbai", "Delhi"],
})
print(df)
print(type(df))`}
          output={`   name  score      city
0   Ana     88     Delhi
1   Ben     92    Mumbai
2  Cara     79     Delhi
<class 'pandas.core.frame.DataFrame'>`}
        >
          <p>
            Each key in the dict becomes a column; lists must be the same length.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Inspect index, columns, and values"
          code={`print("index  :", df.index.tolist())
print("columns:", df.columns.tolist())
print("values :")
print(df.values)`}
          output={`index  : [0, 1, 2]
columns: ['name', 'score', 'city']
values :
[['Ana' 88 'Delhi']
 ['Ben' 92 'Mumbai']
 ['Cara' 79 'Delhi']]`}
        >
          <p>
            <code className="font-mono text-xs">index</code> = row labels,{' '}
            <code className="font-mono text-xs">columns</code> = field names,{' '}
            <code className="font-mono text-xs">values</code> = raw 2-D array under the hood.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Simple math on a column"
          code={`print(df["score"] + 5)
print(df["score"].mean())`}
          output={`0    93
1    97
2    84
Name: score, dtype: int64
86.33333333333333`}
        >
          <p>
            Column access returns a Series — vectorized <code className="font-mono text-xs">+ 5</code>{' '}
            and <code className="font-mono text-xs">mean()</code> work like NumPy.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="Rename columns"
          code={`df = df.rename(columns={"score": "exam_score", "city": "location"})
print(df.columns.tolist())
print(df.head())`}
          output={`['name', 'exam_score', 'location']
   name  exam_score location
0   Ana          88    Delhi
1   Ben          92   Mumbai
2  Cara          79    Delhi`}
        >
          <p>
            Pass a dict mapping old names → new names. The table data stays the same; only headers
            change.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Series = one labeled column; DataFrame = full table from a dict of columns.',
          'Inspect with .index, .columns, .values, and column access df["col"].',
          'Math on columns is vectorized; rename with df.rename(columns={...}).',
        ]}
      />
    </LessonArticle>
  )
}
