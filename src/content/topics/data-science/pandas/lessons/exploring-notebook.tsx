import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function ExploringNotebook() {
  return (
    <LessonArticle>
      <Definition term="Explore before you transform">
        <p>
          This notebook builds a small table from scratch — no CSV file needed — then runs the same
          explore commands you would use on real data.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell: goal in English → code → output. Try the same lines in Jupyter or Colab. We use{' '}
        <code className="font-mono text-xs">import pandas as pd</code> in cell 1.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Import Pandas and build a toy DataFrame"
          code={`import pandas as pd

data = {
    "name": ["Alice", "Bob", "Carol", "Dave", "Eve"],
    "age": [28, 34, 22, None, 31],
    "score": [88, 92, 79, 85, 90],
    "city": ["NYC", "LA", "NYC", "NYC", None],
}
df = pd.DataFrame(data)
print(df)`}
          output={`    name   age  score city
0  Alice  28.0     88  NYC
1    Bob  34.0     92   LA
2  Carol  22.0     79  NYC
3   Dave   NaN     85  NYC
4    Eve  31.0     90  NaN`}
        >
          <p>
            <code className="font-mono text-xs">None</code> in a numeric column becomes{' '}
            <code className="font-mono text-xs">NaN</code> — Pandas’s way of marking missing values.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Check size and first rows"
          code={`print("shape:", df.shape)
print(df.head(3))`}
          output={`shape: (5, 4)
    name   age  score city
0  Alice  28.0     88  NYC
1    Bob  34.0     92   LA
2  Carol  22.0     79  NYC`}
        />

        <NotebookCell
          cell={3}
          title="Column types and non-null counts"
          code={`df.info()`}
          output={`RangeIndex: 5 entries, 0 to 4
Data columns (total 4 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   name    5 non-null       object
 1   age     4 non-null       float64
 2   score   5 non-null       int64
 3   city    4 non-null       object`}
        >
          <p>
            Age has 4 non-null out of 5 rows — one missing. City has one missing too.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Numeric summary"
          code={`print(df.describe())`}
          output={`             age      score
count   4.000000   5.000000
mean   28.750000  86.800000
std     4.991662   4.764396
min    22.000000  79.000000
25%    27.250000  85.000000
50%    29.500000  88.000000
75%    32.250000  90.000000
max    34.000000  92.000000`}
        />

        <NotebookCell
          cell={5}
          title="Count missing values per column"
          code={`print(df.isna().sum())
print("total missing:", df.isna().sum().sum())`}
          output={`name    0
age     1
score   0
city    1
dtype: int64
total missing: 2`}
        />
      </div>

      <KeyTakeaways
        items={[
          'Build a DataFrame from a dict of lists when you want to practice without a file.',
          'shape, head, info, and describe answer “how big, what types, what values?” in seconds.',
          'isna().sum() tells you exactly where missing data lives before you clean it.',
        ]}
      />
    </LessonArticle>
  )
}
