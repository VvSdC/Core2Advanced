import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function SummariesAndCorrelations() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Ask the table questions">
        Before modeling or charting, summarize: What are typical values? How spread out are they?
        Do two columns move together? Pandas answers with{' '}
        <code className="font-mono text-xs">describe</code>,{' '}
        <code className="font-mono text-xs">corr</code>, and{' '}
        <code className="font-mono text-xs">value_counts</code>.
      </Callout>

      <Definition term="describe, corr, value_counts">
        <p>
          <strong className="text-white">describe</strong> prints count, mean, std, min, quartiles,
          max for numeric columns. <strong className="text-white">corr</strong> measures linear
          relationships between numeric columns (-1 to 1).{' '}
          <strong className="text-white">value_counts</strong> counts how often each category appears.
        </p>
      </Definition>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Sample dataset"
          code={`import pandas as pd

df = pd.DataFrame({
    "hours": [1, 2, 3, 4, 5, 6, 7, 8],
    "score": [52, 58, 65, 70, 78, 82, 88, 91],
    "section": ["A", "A", "B", "B", "A", "B", "A", "B"],
})
print(df.head())`}
          output={`   hours  score section
0      1     52       A
1      2     58       A
2      3     65       B
3      4     70       B
4      5     78       A`}
        />

        <NotebookCell
          cell={2}
          title="describe — numeric recap"
          code={`print(df.describe())`}
          output={`          hours      score
count  8.000000   8.000000
mean   4.500000  73.000000
std    2.449490  13.038405
min    1.000000  52.000000
25%    2.750000  62.750000
50%    4.500000  74.000000
75%    6.250000  84.250000
max    8.000000  91.000000`}
        />

        <NotebookCell
          cell={3}
          title="Manual stats — mean, median, std"
          code={`print("score mean  :", df["score"].mean())
print("score median:", df["score"].median())
print("score std   :", df["score"].std())`}
          output={`score mean  : 73.0
score median: 74.0
score std   : 13.038405...`}
        >
          <p>
            Mean is the average. Median is the middle value (robust to outliers). Std measures spread
            around the mean.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="corr — do hours and score move together?"
          code={`print(df[["hours", "score"]].corr())`}
          output={`          hours     score
hours  1.000000  0.988294
score  0.988294  1.000000`}
        >
          <p>
            Values near 1 mean strong positive link — more hours tends to mean higher scores here.
            Diagonal is always 1 (column vs itself).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="value_counts — category insights"
          code={`print(df["section"].value_counts())
print()
print(df["section"].value_counts(normalize=True))`}
          output={`section
A    4
B    4
Name: count, dtype: int64

section
A    0.5
B    0.5
Name: proportion, dtype: float64`}
        />
      </div>

      <KeyTakeaways
        items={[
          'describe gives a fast numeric overview; mean/median/std answer specific questions.',
          'corr highlights relationships between numeric columns.',
          'value_counts summarizes categories — add normalize=True for proportions.',
        ]}
      />
    </LessonArticle>
  )
}
