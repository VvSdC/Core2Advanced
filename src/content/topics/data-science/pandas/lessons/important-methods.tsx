import {
  Callout,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ImportantMethods() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Your pocket cheat-sheet">
        These methods appear in almost every Pandas project. Each example is short — copy, tweak
        the column name, run.
      </Callout>

      <LessonSection title="Unique values and counts">
        <Example
          title="unique — list of distinct values"
          output={`['NYC' 'LA' 'Chicago']`}
        >
{`df["city"].unique()`}
        </Example>
        <Example
          title="nunique — how many distinct values"
          output={`3`}
        >
{`df["city"].nunique()`}
        </Example>
        <Example
          title="size vs count"
          output={`8        # total elements (Series)
6        # non-NaN values`}
        >
{`df["city"].size      # length including NaN slots in Series
df["city"].count()    # non-missing only`}
        </Example>
        <Example
          title="value_counts — frequency table"
          output={`NYC    4
LA     3
Name: city, dtype: int64`}
        >
{`df["city"].value_counts()`}
        </Example>
      </LessonSection>

      <LessonSection title="Missing values (recap)">
        <Example title="dropna — remove rows with any NaN">
{`df.dropna()                    # any column NaN → drop row
df.dropna(subset=["score"])    # only care about score`}
        </Example>
        <Example title="fillna — replace missing">
{`df["score"].fillna(0)
df["score"].fillna(df["score"].median())`}
        </Example>
      </LessonSection>

      <LessonSection title="Combine tables (pointers)">
        <Example title="merge on a shared key">
{`pd.merge(left, right, on="id", how="left")   # see Merging & Joining lesson`}
        </Example>
        <Example title="join on index">
{`left.set_index("id").join(right.set_index("id"), how="inner")`}
        </Example>
      </LessonSection>

      <LessonSection title="Reshape (pointers)">
        <Example title="crosstab — count pairs">
{`pd.crosstab(df["gender"], df["size"])`}
        </Example>
        <Example title="pivot_table — summary grid">
{`pd.pivot_table(df, index="city", columns="product", values="revenue", aggfunc="sum")`}
        </Example>
      </LessonSection>

      <LessonSection title="Sort (pointer)">
        <Example title="sort_values — order rows">
{`df.sort_values("score", ascending=False)
df.sort_values(["city", "score"], ascending=[True, False])`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'unique / nunique / value_counts describe categories; count vs size matters for NaN.',
          'dropna and fillna handle missing data — pick drop vs impute on purpose.',
          'merge, pivot_table, crosstab, and sort_values have dedicated lessons — bookmark this page.',
        ]}
      />
    </LessonArticle>
  )
}
