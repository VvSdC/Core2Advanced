import {
  Callout,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function SeriesLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Picture first">
        A <strong className="text-white">Series</strong> is one column from a spreadsheet — scores,
        prices, city names — with a label for each row. If a DataFrame is the whole table, a Series is
        a single named column (or row) pulled out of it.
      </Callout>

      <Definition term="Pandas Series">
        <p>
          A <strong className="text-white">Series</strong> is a one-dimensional labeled array. It
          holds values (numbers, strings, booleans, …) and an <strong className="text-white">index</strong>{' '}
          that names each position — default 0, 1, 2… or custom labels like{' '}
          <code className="font-mono text-xs">"Mon"</code>,{' '}
          <code className="font-mono text-xs">"Tue"</code>.
        </p>
      </Definition>

      <LessonSection title="Create a Series">
        <Example title="From a Python list">
{`import pandas as pd

scores = pd.Series([88, 92, 79, 95])
print(scores)
# 0    88
# 1    92
# 2    79
# 3    95
# dtype: int64`}
        </Example>
        <Example title="Custom index labels">
{`days = pd.Series([72, 68, 75], index=["Mon", "Tue", "Wed"])
print(days["Tue"])   # 68
print(days.index)    # Index(['Mon', 'Tue', 'Wed'], dtype='object')`}
        </Example>
        <NotebookCell
          cell={1}
          title="Quick create and peek"
          code={`import pandas as pd

temps = pd.Series([18.5, 20.1, 19.3], index=["morning", "noon", "evening"])
print(temps)
print(temps.shape)`}
          output={`morning    18.5
noon       20.1
evening    19.3
dtype: float64
(3,)`}
        >
          <p>
            <code className="font-mono text-xs">shape</code> for a Series is just{' '}
            <code className="font-mono text-xs">(length,)</code> — one dimension.
          </p>
        </NotebookCell>
      </LessonSection>

      <LessonSection title="Supported dtypes">
        <p className="text-slate-300">
          Like NumPy, each Series has one <code className="font-mono text-xs">dtype</code> — but
          Pandas is flexible: integers, floats, strings (<code className="font-mono text-xs">object</code>
          ), booleans, datetimes, and more. Check with{' '}
          <code className="font-mono text-xs">s.dtype</code> or{' '}
          <code className="font-mono text-xs">s.dtypes</code> on a DataFrame column.
        </p>
        <Example title="Common dtypes you will see">
{`pd.Series([1, 2, 3]).dtype           # int64
pd.Series([1.0, 2.5]).dtype          # float64
pd.Series(["a", "b"]).dtype          # object (strings)
pd.Series([True, False]).dtype       # bool`}
        </Example>
      </LessonSection>

      <LessonSection title="Indexing and basic operations">
        <p className="mb-4 text-slate-300">
          Pick one value by label, slice a range, or run math on the whole Series at once:
        </p>
        <NotebookCell
          cell={2}
          title="Index by label or position"
          code={`s = pd.Series([10, 20, 30], index=["a", "b", "c"])
print(s["b"])      # label
print(s.iloc[1])   # position → 20`}
          output={`20
20`}
        />
        <Example title="Vectorized math (NumPy-style)">
{`s = pd.Series([10, 20, 30])
print(s + 5)       # add 5 to every value
print(s * 2)       # multiply all
print(s.mean())    # 20.0`}
        </Example>
        <Callout variant="tip">
          Series arithmetic aligns by <em>index</em>, not just position. Same index labels line up;
          missing labels become NaN. You will practice this more with DataFrames.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Series = 1-D labeled array — one column of a table.',
          'Create from lists; optional custom index; check dtype for the value type.',
          'Use label indexing (s["a"]) or position (s.iloc[0]); math and mean work vectorized.',
        ]}
      />
    </LessonArticle>
  )
}
