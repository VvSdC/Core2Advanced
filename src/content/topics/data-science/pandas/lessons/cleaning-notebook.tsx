import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function CleaningNotebook() {
  return (
    <LessonArticle>
      <Definition term="End-to-end cleaning practice">
        <p>
          This notebook starts with a messy table — missing values and duplicate emails — then walks
          through drop, fill, and dedup steps you would use on real data.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        We invent problems on purpose so you can see each cleaning tool in action. Run cells in order.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a messy customer table"
          code={`import pandas as pd

customers = pd.DataFrame({
    "email": ["a@x.com", "b@x.com", "a@x.com", "c@x.com", "d@x.com"],
    "age": [28, None, 28, 35, 42],
    "city": ["NYC", "LA", "NYC", None, "NYC"],
    "spend": [120, 85, 120, 200, 55],
})
print(customers)
print(customers.isna().sum())`}
          output={`       email   age city  spend
0  a@x.com  28.0  NYC    120
1  b@x.com   NaN   LA     85
2  a@x.com  28.0  NYC    120
3  c@x.com  35.0  NaN    200
4  d@x.com  42.0  NYC     55

email    0
age      1
city     1
spend    0
dtype: int64`}
        >
          <p>
            Row 2 duplicates row 0 (same email and spend). Age and city each have one missing value.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Drop rows missing age (required for our report)"
          code={`step1 = customers.dropna(subset=["age"])
print(step1)`}
          output={`       email   age city  spend
0  a@x.com  28.0  NYC    120
2  a@x.com  28.0  NYC    120
3  c@x.com  35.0  NaN    200
4  d@x.com  42.0  NYC     55`}
        >
          <p>
            We dropped the row where age was NaN. City can still be missing — we handle that next.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Fill missing city with the mode"
          code={`mode_city = step1["city"].mode()[0]
step2 = step1.fillna({"city": mode_city})
print(step2)`}
          output={`       email   age city  spend
0  a@x.com  28.0  NYC    120
2  a@x.com  28.0  NYC    120
3  c@x.com  35.0  NYC    200
4  d@x.com  42.0  NYC     55`}
        >
          <p>
            NYC appears most often, so we use it as a simple stand-in for the one blank city.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Remove duplicate emails"
          code={`clean = step2.drop_duplicates(subset=["email"], keep="first")
print(clean)
print("rows before:", len(step2), "rows after:", len(clean))`}
          output={`       email   age city  spend
0  a@x.com  28.0  NYC    120
3  c@x.com  35.0  NYC    200
4  d@x.com  42.0  NYC     55
rows before: 4 rows after: 3`}
        />

        <NotebookCell
          cell={5}
          title="Verify — no missing values, no duplicate emails"
          code={`print(clean.isna().sum())
print(clean.duplicated(subset=["email"]).sum())`}
          output={`email    0
age      0
city     0
spend    0
dtype: int64
0`}
        >
          <p>
            Zero missing cells and zero duplicate emails — the table is ready for analysis.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Start with isna().sum() to see what is broken before you fix it.',
          'dropna(subset=[...]) removes rows missing critical fields; fillna handles the rest.',
          'drop_duplicates(subset=["email"]) keeps one row per unique key — verify with duplicated().sum().',
        ]}
      />
    </LessonArticle>
  )
}
