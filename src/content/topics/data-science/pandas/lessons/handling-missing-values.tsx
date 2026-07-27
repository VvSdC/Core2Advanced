import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HandlingMissingValues() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        Real tables have blank cells — someone skipped a survey question, a sensor failed, a row was
        partially imported. Pandas marks these as <strong className="text-white">NaN</strong> (Not a
        Number). You either drop those rows/columns or fill in reasonable guesses.
      </Callout>

      <Definition term="Missing data (NaN)">
        <p>
          <strong className="text-white">NaN</strong> means “value unknown.” It is not zero and not an
          empty string. Pandas treats NaN specially in math — for example, the mean skips missing cells
          by default.
        </p>
      </Definition>

      <LessonSection title="dropna — remove missing rows or columns">
        <Example
          title="Drop any row that has at least one NaN"
          output={`    name   age  score
0  Alice  28.0     88
2  Carol  22.0     79
4    Eve  31.0     90`}
        >{`import pandas as pd

df = pd.read_csv("data/students.csv")
clean = df.dropna()
print(clean)`}</Example>

        <Example
          title="Drop only if specific columns are missing"
          output={`    name   age  score city
0  Alice  28.0     88  NYC
1    Bob  34.0     92   LA
2  Carol  22.0     79  NYC
4    Eve  31.0     90  NaN`}
        >{`# Keep rows even if city is missing, but drop if age is missing
clean = df.dropna(subset=["age"])
print(clean)`}</Example>

        <Example
          title="Drop columns that are mostly empty"
          output={`    name   age  score city
0  Alice  28.0     88  NYC
...`}
        >{`clean = df.dropna(axis=1, thresh=len(df) - 50)  # keep cols with ≤50 missing
print(clean.head())`}</Example>
      </LessonSection>

      <LessonSection title="fillna — replace missing values">
        <Example
          title="Fill with a constant"
          output={`    name   age  score city
0  Alice  28.0     88  NYC
1    Bob  34.0     92   LA
2  Carol  22.0     79  NYC
3   Dave   0.0     85  NYC
4    Eve  31.0     90  Unknown`}
        >{`filled = df.fillna({"age": 0, "city": "Unknown"})
print(filled)`}</Example>

        <Example
          title="Impute with mean, median, or mode"
          output={`age mean filled: 28.75
age median filled: 29.5
city mode filled: NYC`}
        >{`age_mean = df["age"].fillna(df["age"].mean())
age_median = df["age"].fillna(df["age"].median())
city_mode = df["city"].fillna(df["city"].mode()[0])

print("age mean filled:", age_mean.mean())
print("age median filled:", age_median.median())
print("city mode filled:", city_mode.mode()[0])`}</Example>

        <Callout variant="tip">
          Use <strong className="text-white">median</strong> for skewed numeric data (incomes, prices).
          Use <strong className="text-white">mode</strong> for categories. Mean works when values are
          roughly symmetric and outliers are rare.
        </Callout>
      </LessonSection>

      <LessonSection title="When to drop vs fill">
        <div className="space-y-3 text-sm text-slate-300">
          <p>
            <strong className="text-white">Drop</strong> when missing values are few, random, and you
            have plenty of rows left — or when the column is mostly empty and not useful.
          </p>
          <p>
            <strong className="text-white">Fill</strong> when losing rows would bias your analysis
            (for example, older customers skipped optional fields) or when you need every row for a
            model.
          </p>
          <p>
            Always check <code className="font-mono text-xs">df.isna().sum()</code> first so you know
            how much is missing and where.
          </p>
        </div>
      </LessonSection>

      <LessonSection title="Advanced note (optional)">
        <Callout variant="insight">
          Beyond mean/median/mode, some teams use{' '}
          <strong className="text-white">predictive imputation</strong> — a model guesses missing values
          from other columns. That is powerful but easier to get wrong; learn drop/fill first, then
          explore advanced methods when you need them.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'dropna() removes rows (or columns) with NaN; subset= targets specific columns.',
          'fillna() replaces NaN with constants or with mean/median/mode imputation.',
          'Drop when missing is rare and random; fill when you cannot afford to lose rows.',
        ]}
      />
    </LessonArticle>
  )
}
