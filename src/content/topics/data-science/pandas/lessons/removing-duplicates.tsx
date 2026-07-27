import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RemovingDuplicates() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        The same customer gets imported twice, or a survey row is accidentally duplicated. Before
        you count or average, you find and remove duplicate rows so each record appears once.
      </Callout>

      <Definition term="Duplicate rows">
        <p>
          Two rows are <strong className="text-white">duplicates</strong> when every value matches (or
          when key columns match, if you choose a subset). Pandas can flag them with{' '}
          <code className="font-mono text-xs">duplicated()</code> and remove them with{' '}
          <code className="font-mono text-xs">drop_duplicates()</code>.
        </p>
      </Definition>

      <LessonSection title="Spot duplicates">
        <Example
          title="duplicated() — True where a row repeats"
          output={`0    False
1    False
2     True
3    False
4     True
dtype: bool

2`}
        >{`import pandas as pd

df = pd.read_csv("data/customers.csv")
print(df.duplicated())
print(df.duplicated().sum())   # how many duplicate rows (after first copy)`}</Example>
      </LessonSection>

      <LessonSection title="Remove duplicates">
        <Example
          title="drop_duplicates() — keep first occurrence"
          output={`   email     city  signup_date
0  a@x.com      NYC   2024-01-05
1  b@x.com       LA   2024-01-12
3  d@x.com      NYC   2024-02-01`}
        >{`clean = df.drop_duplicates()
print(clean)`}</Example>

        <Example
          title="subset= — only compare certain columns"
          output={`   email     city  signup_date
0  a@x.com      NYC   2024-01-05
1  b@x.com       LA   2024-01-12
3  d@x.com      NYC   2024-02-01`}
        >{`# Same email twice = duplicate, even if city differs
clean = df.drop_duplicates(subset=["email"])
print(clean)`}</Example>

        <Example
          title="keep= — which copy to retain"
          output={`   email     city  signup_date
2  a@x.com      NYC   2024-01-06
4  c@x.com       LA   2024-01-20`}
        >{`last = df.drop_duplicates(subset=["email"], keep="last")
print(last)

# keep=False removes ALL rows that appear more than once
strict = df.drop_duplicates(subset=["email"], keep=False)
print(strict)`}</Example>
      </LessonSection>

      <LessonSection title="Fix types before deduping">
        <p className="text-slate-300">
          Duplicates often hide behind bad types — dates stored as text, numbers as strings. Fix types
          first so Pandas compares values correctly.
        </p>

        <Example
          title="astype and to_datetime"
          output={`signup_date
0   2024-01-05
1   2024-01-12
Name: signup_date, dtype: datetime64[ns]

float64`}
        >{`df["signup_date"] = pd.to_datetime(df["signup_date"])
df["amount"] = df["amount"].astype(float)

print(df["signup_date"].head(2))
print(df["amount"].dtype)`}</Example>

        <Callout variant="tip">
          Run <code className="font-mono text-xs">df.dtypes</code> after loading. Text columns that
          should be numbers or dates are a common source of “hidden” duplicates and bad comparisons.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'duplicated() flags repeat rows; drop_duplicates() removes them.',
          'subset= checks only key columns; keep="first" / "last" / False controls which rows stay.',
          'Fix types with astype and to_datetime before deduping so values compare fairly.',
        ]}
      />
    </LessonArticle>
  )
}
