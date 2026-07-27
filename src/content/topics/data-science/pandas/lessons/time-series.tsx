import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function TimeSeriesLesson() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Dates as the index">
        Sales per day, temperatures per hour — time-ordered data is everywhere. Pandas treats dates
        as a first-class index so you can slice by month and compute rolling averages easily.
      </Callout>

      <Definition term="DatetimeIndex">
        <p>
          A <strong className="text-white">DatetimeIndex</strong> labels rows with timestamps. Use{' '}
          <code className="font-mono text-xs">pd.to_datetime</code> to parse strings, then{' '}
          <code className="font-mono text-xs">set_index</code> or{' '}
          <code className="font-mono text-xs">read_csv(..., parse_dates=...)</code> when loading files.
        </p>
      </Definition>

      <LessonSection title="Core moves">
        <ContentStep number={1} title="Parse dates">
          <p className="text-slate-300">
            Turn <code className="font-mono text-xs">&quot;2024-01-15&quot;</code> strings into real
            datetime objects.
          </p>
        </ContentStep>
        <ContentStep number={2} title="resample">
          <p className="text-slate-300">Change frequency — daily → weekly/monthly summaries.</p>
        </ContentStep>
        <ContentStep number={3} title="rolling">
          <p className="text-slate-300">Moving window stats — e.g. 7-day average temperature.</p>
        </ContentStep>
      </LessonSection>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a DatetimeIndex"
          code={`import pandas as pd

dates = pd.to_datetime([
    "2024-01-01", "2024-01-02", "2024-01-03",
    "2024-01-04", "2024-01-05", "2024-01-06", "2024-01-07",
])
sales = pd.Series([10, 12, 8, 15, 11, 9, 14], index=dates, name="units")
print(sales)
print("index type:", type(sales.index))`}
          output={`2024-01-01    10
2024-01-02    12
2024-01-03     8
2024-01-04    15
2024-01-05    11
2024-01-06     9
2024-01-07    14
Name: units, dtype: int64
index type: <class 'pandas.core.indexes.datetimes.DatetimeIndex'>`}
        />

        <NotebookCell
          cell={2}
          title="Slice by date range"
          code={`print(sales["2024-01-03":"2024-01-05"])`}
          output={`2024-01-03     8
2024-01-04    15
2024-01-05    11
Name: units, dtype: int64`}
        />

        <NotebookCell
          cell={3}
          title="resample — weekly total"
          code={`print(sales.resample("W").sum())`}
          output={`2024-01-07    79
Freq: W-SUN, Name: units, dtype: int64`}
        >
          <p>
            <code className="font-mono text-xs">&quot;W&quot;</code> groups into calendar weeks ending
            Sunday. Use <code className="font-mono text-xs">&quot;M&quot;</code> for month ends,{' '}
            <code className="font-mono text-xs">&quot;D&quot;</code> for days.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="rolling mean — smooth noisy daily data"
          code={`print(sales.rolling(window=3).mean())`}
          output={`2024-01-01         NaN
2024-01-02         NaN
2024-01-03   10.000000
2024-01-04   11.666667
2024-01-05   11.333333
2024-01-06   11.666667
2024-01-07   13.333333
Name: units, dtype: float64`}
        >
          <p>
            Each value is the mean of that day plus the previous two. First two rows are NaN until the
            window fills.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="to_datetime on a DataFrame column"
          code={`df = pd.DataFrame({
    "date_str": ["2024-01-01", "2024-01-02", "2024-01-03"],
    "value": [100, 110, 105],
})
df["date"] = pd.to_datetime(df["date_str"])
df = df.set_index("date").drop(columns="date_str")
print(df)`}
          output={`            value
date
2024-01-01    100
2024-01-02    110
2024-01-03    105`}
        />
      </div>

      <KeyTakeaways
        items={[
          'pd.to_datetime parses strings; DatetimeIndex enables date slicing.',
          'resample changes time frequency (daily → weekly/monthly).',
          'rolling(window=n) computes moving averages and other window stats.',
        ]}
      />
    </LessonArticle>
  )
}
