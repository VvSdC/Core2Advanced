import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DataFrameLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Spreadsheet in code">
        If you have used Excel or Google Sheets, you already know a DataFrame: rows of records,
        columns of fields, headers on top. Pandas gives that same mental model in Python.
      </Callout>

      <Definition term="Pandas DataFrame">
        <p>
          A <strong className="text-white">DataFrame</strong> is a two-dimensional labeled table. Each{' '}
          <strong className="text-white">column</strong> is a Series sharing the same row{' '}
          <strong className="text-white">index</strong>. Each row is one record — a student, a sale,
          a sensor reading at a moment in time.
        </p>
      </Definition>

      <LessonSection title="Create from a dictionary">
        <p className="text-slate-300">
          Keys become column names; lists (or Series) become column values. This is the quickest way
          to build a small table in tutorials and tests.
        </p>
        <Example
          title="Dict → DataFrame"
          output={`   name  score      city
0   Ana     88     Delhi
1   Ben     92    Mumbai
2  Cara     79     Delhi`}
        >
{`import pandas as pd

df = pd.DataFrame({
    "name": ["Ana", "Ben", "Cara"],
    "score": [88, 92, 79],
    "city": ["Delhi", "Mumbai", "Delhi"],
})
print(df)`}
        </Example>
      </LessonSection>

      <LessonSection title="Rows, columns, and index">
        <ContentStep number={1} title="Columns">
          <p className="text-slate-300">
            Named fields — access one with <code className="font-mono text-xs">df["score"]</code> or{' '}
            <code className="font-mono text-xs">df.score</code> (returns a Series).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Index (rows)">
          <p className="text-slate-300">
            Row labels, often 0…n-1 by default. Later you will use dates or IDs as the index for
            time series.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Values">
          <p className="text-slate-300">
            The underlying 2-D data as a NumPy array:{' '}
            <code className="font-mono text-xs">df.values</code> (or{' '}
            <code className="font-mono text-xs">df.to_numpy()</code>).
          </p>
        </ContentStep>
        <Example title="Inspect structure">
{`print(df.columns)   # Index(['name', 'score', 'city'], ...)
print(df.index)     # RangeIndex(start=0, stop=3, step=1)
print(df.shape)     # (3, 3) — rows, columns`}
        </Example>
      </LessonSection>

      <LessonSection title="Loading from files (overview)">
        <p className="text-slate-300">
          In practice you rarely hand-build tables. Pandas reads files directly into a DataFrame:
        </p>
        <Example title="Common readers — details in later lessons">
{`pd.read_csv("data.csv")
pd.read_excel("report.xlsx")
pd.read_json("api_response.json")
pd.read_sql("SELECT * FROM users", connection)`}
        </Example>
        <Callout variant="tip">
          The next sections of this track cover reading, previewing, and exploring loaded data step
          by step. For now, know that every format lands in the same DataFrame object.
        </Callout>
      </LessonSection>

      <LessonSection title="Basic operations">
        <Example title="Column access, shape, dtypes">
{`print(df["score"])       # Series — one column
print(df[["name", "score"]])  # DataFrame — two columns
print(df.shape)          # (3, 3)
print(df.dtypes)
# name     object
# score     int64
# city     object`}
        </Example>
        <Example title="Quick preview helpers">
{`df.head(2)    # first 2 rows
df.tail(1)    # last row
df.info()     # columns, non-null counts, dtypes
df.describe() # numeric summary — count, mean, min, max`}
        </Example>
        <Callout variant="insight">
          <code className="font-mono text-xs">head</code>, <code className="font-mono text-xs">info</code>, and{' '}
          <code className="font-mono text-xs">describe</code> are the “first five minutes with a new
          dataset” trio — use them constantly.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DataFrame = 2-D labeled table; columns are Series; rows share an index.',
          'Build from a dict of columns; inspect with columns, index, shape, dtypes.',
          'Load CSV/Excel/JSON/SQL with read_* functions — same object, many sources.',
        ]}
      />
    </LessonArticle>
  )
}
