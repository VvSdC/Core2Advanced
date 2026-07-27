import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FilteringRows() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Everyday idea">
        “Show me only orders over $100 from NYC.” That is row filtering. In Pandas you write a
        condition, get a True/False mask for each row, and keep the rows where the mask is True.
      </Callout>

      <Definition term="Boolean mask on a DataFrame">
        <p>
          Compare a column to a value — like <code className="font-mono text-xs">df["amount"] &gt; 100</code>{' '}
          — to get a Series of True/False values. Pass that mask inside{' '}
          <code className="font-mono text-xs">df[...]</code> to filter rows.
        </p>
      </Definition>

      <LessonSection title="Simple filters">
        <Example
          title="Keep rows where a column meets a condition"
          output={`    product  amount region
1  Widget B     150    NYC
3  Widget D     220    NYC
4  Widget E     175     LA`}
        >{`import pandas as pd

df = pd.read_csv("data/sales.csv")
high = df[df["amount"] > 100]
print(high)`}</Example>

        <Example
          title="Filter on text columns"
          output={`    product  amount region
0  Widget A      45    NYC
1  Widget B     150    NYC
3  Widget D     220    NYC`}
        >{`nyc = df[df["region"] == "NYC"]
print(nyc)`}</Example>
      </LessonSection>

      <LessonSection title="Multiple conditions">
        <Callout variant="tip">
          Use <code className="font-mono text-xs">&amp;</code> for AND and{' '}
          <code className="font-mono text-xs">|</code> for OR. Wrap each condition in parentheses.
          Do not use Python <code className="font-mono text-xs">and</code> /{' '}
          <code className="font-mono text-xs">or</code> — they do not work on Series.
        </Callout>

        <Example
          title="AND — both conditions must be True"
          output={`    product  amount region
1  Widget B     150    NYC
3  Widget D     220    NYC`}
        >{`result = df[(df["region"] == "NYC") & (df["amount"] > 100)]
print(result)`}</Example>

        <Example
          title="OR — either condition is enough"
          output={`    product  amount region
1  Widget B     150    NYC
2  Widget C      30     LA
3  Widget D     220    NYC
4  Widget E     175     LA`}
        >{`result = df[(df["region"] == "NYC") | (df["amount"] > 150)]
print(result)`}</Example>

        <Example
          title="isin — match several values at once"
          output={`    product  amount region
0  Widget A      45    NYC
2  Widget C      30     LA
4  Widget E     175     LA`}
        >{`result = df[df["region"].isin(["LA", "Chicago"])]
print(result)`}</Example>
      </LessonSection>

      <LessonSection title="query() — readable string filters">
        <Example
          title="Same filter, different syntax"
          output={`    product  amount region
1  Widget B     150    NYC
3  Widget D     220    NYC`}
        >{`result = df.query('region == "NYC" and amount > 100')
print(result)`}</Example>

        <p className="text-slate-300">
          <code className="font-mono text-xs">query()</code> is optional but nice for long chains of
          conditions. Column names with spaces need backticks inside the string.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'df[df["col"] > value] keeps rows where the condition is True.',
          'Combine conditions with & (and) and | (or); always use parentheses around each test.',
          'query() offers an alternative string syntax for the same row filters.',
        ]}
      />
    </LessonArticle>
  )
}
