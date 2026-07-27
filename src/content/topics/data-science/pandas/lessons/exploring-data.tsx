import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ExploringData() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Before you clean or analyze, you peek at the table: How big is it? What columns exist? Any
        missing cells? Pandas gives you a handful of one-liners for that first look.
      </Callout>

      <Definition term="Exploratory peek">
        <p>
          <strong className="text-white">Exploring</strong> a DataFrame means checking its size, column
          types, sample rows, and summary stats — the same questions you would ask when opening a new
          spreadsheet for the first time.
        </p>
      </Definition>

      <LessonSection title="Size and sample rows">
        <Example
          title="shape, head, and tail"
          output={`(1000, 5)

   name  age  score city
0  Alice   28     88  NYC
1    Bob   34     92   LA
2  Carol   22     79  NYC
3  Dave   NaN     85  NYC
4  Eve     31     90   LA

    name  age  score city
995  ...  ...    ...  ...
996  ...  ...    ...  ...
997  ...  ...    ...  ...
998  ...  ...    ...  ...
999  ...  ...    ...  ...`}
        >{`import pandas as pd

df = pd.read_csv("data/students.csv")
print(df.shape)       # (rows, columns)
print(df.head())      # first 5 rows
print(df.tail())      # last 5 rows`}</Example>

        <Callout variant="tip">
          <code className="font-mono text-xs">head(10)</code> shows 10 rows — handy when five is not
          enough to spot a pattern.
        </Callout>
      </LessonSection>

      <LessonSection title="Column types and memory">
        <Example
          title="info() — dtypes and non-null counts"
          output={`RangeIndex: 1000 entries, 0 to 999
Data columns (total 5 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   name    1000 non-null    object
 1   age     980 non-null     float64
 2   score   1000 non-null    int64
 3   city    995 non-null     object
dtypes: float64(1), int64(1), object(2)
memory usage: 39.1+ KB`}
        >{`df.info()`}</Example>

        <p className="text-slate-300">
          Scan the <strong className="text-white">Non-Null Count</strong> column. If it is less than
          the row count, that column has missing values.
        </p>
      </LessonSection>

      <LessonSection title="Summary statistics">
        <Example
          title="describe() — numeric overview"
          output={`              age       score
count  980.000000  1000.000000
mean    27.450000    86.320000
std      5.210000     8.140000
min     18.000000    55.000000
25%     23.000000    81.000000
50%     27.000000    87.000000
75%     31.000000    92.000000
max     45.000000   100.000000`}
        >{`print(df.describe())`}</Example>

        <Callout variant="insight">
          <code className="font-mono text-xs">describe(include="object")</code> summarizes text
          columns — unique counts and most common values.
        </Callout>
      </LessonSection>

      <LessonSection title="Finding missing values">
        <Example
          title="isna, isnull, and sum"
          output={`name     0
age     20
score    0
city     5
dtype: int64

20`}
        >{`# Missing count per column
print(df.isna().sum())    # isnull() is identical

# Total missing cells in the whole table
print(df.isna().sum().sum())`}</Example>

        <p className="text-slate-300">
          <code className="font-mono text-xs">isna()</code> returns True where a cell is missing (NaN).
          Summing booleans counts the True values — a quick missing-value report.
        </p>
      </LessonSection>

      <LessonSection title="Quick insights checklist">
        <div className="space-y-2 text-sm text-slate-300">
          <p>
            After loading, run through this mental checklist: How many rows and columns (
            <code className="font-mono text-xs">shape</code>)? Do sample rows look sensible (
            <code className="font-mono text-xs">head</code>)? Are types correct (
            <code className="font-mono text-xs">info</code>)? Any outliers in numbers (
            <code className="font-mono text-xs">describe</code>)? How much is missing (
            <code className="font-mono text-xs">isna().sum()</code>)?
          </p>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'shape gives (rows, columns); head() and tail() show sample rows.',
          'info() shows dtypes and non-null counts; describe() summarizes numeric columns.',
          'isna().sum() counts missing values per column — run this early on every new dataset.',
        ]}
      />
    </LessonArticle>
  )
}
