import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  NotebookCell,
} from '../../../../../components/content'

export function MlPipelineNotebook() {
  return (
    <LessonArticle>
      <Definition term="End-to-end toy pipeline">
        <p>
          A small monthly metric table with gaps gets cleaned in Pandas, gaps filled via SciPy
          interpolation, a trend fit with <code className="font-mono text-xs">curve_fit</code>, and a
          text summary standing in for a chart.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        This mirrors real projects: wrangle → fix numeric holes → model a trend → describe results.
        All three libraries appear in one flow.
      </Callout>

      <div className="mt-6 space-y-6">
        <NotebookCell
          cell={1}
          title="Build a Pandas table with missing months"
          code={`import numpy as np
import pandas as pd
from scipy import interpolate
from scipy.optimize import curve_fit

df = pd.DataFrame({
    "month": [1, 2, 3, 4, 5, 6],
    "users": [120, np.nan, 145, 160, np.nan, 195],
})
print(df)`}
          output={`   month  users
0      1  120.0
1      2    NaN
2      3  145.0
3      4  160.0
4      5    NaN
5      6  195.0`}
        >
          <p>
            Months 2 and 5 are missing — common when a report failed or a sensor dropped data.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Interpolate missing values with SciPy"
          code={`known = df.dropna()
f = interpolate.interp1d(
    known["month"], known["users"], kind="linear", fill_value="extrapolate"
)
df["users_filled"] = df["month"].apply(lambda m: float(f(m)))
print(df[["month", "users", "users_filled"]])`}
          output={`   month  users  users_filled
0      1  120.0         120.0
1      2    NaN         132.5
2      3  145.0         145.0
3      4  160.0         160.0
4      5    NaN         177.5
5      6  195.0         195.0`}
        >
          <p>
            Linear interpolation draws straight lines between known points — simple and fast for
            smooth growth data.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Fit a linear trend with curve_fit"
          code={`def line(x, slope, intercept):
    return slope * x + intercept

x = df["month"].to_numpy(dtype=float)
y = df["users_filled"].to_numpy()

params, _ = curve_fit(line, x, y)
slope, intercept = params
print(f"trend: users ≈ {slope:.1f} * month + {intercept:.1f}")`}
          output={`trend: users ≈ 14.6 * month + 108.2`}
        >
          <p>
            Roughly 14–15 new users per month on top of a base near 108 — a headline number for
            stakeholders.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Predict month 7 and summarize"
          code={`month_7_pred = line(7, slope, intercept)
growth_pct = (df["users_filled"].iloc[-1] - df["users_filled"].iloc[0]) / df["users_filled"].iloc[0] * 100

print(f"predicted month 7 users: {month_7_pred:.0f}")
print(f"growth month 1→6: {growth_pct:.1f}%")
print("chart description: line plot would show filled points, dashed trend line rising steadily")`}
          output={`predicted month 7 users: 210
growth month 1→6: 62.5%
chart description: line plot would show filled points, dashed trend line rising steadily`}
        >
          <p>
            Next step in a real notebook: pass{' '}
            <code className="font-mono text-xs">users_filled</code> and engineered features into
            scikit-learn for forecasting or anomaly flags.
          </p>
        </NotebookCell>
      </div>

      <KeyTakeaways
        items={[
          'Pandas holds the table; SciPy interpolate fills numeric gaps; curve_fit estimates trend parameters.',
          'Convert Series to NumPy arrays when calling SciPy functions.',
          'End-to-end flow: clean → interpolate → fit → summarize (then optionally feed sklearn).',
        ]}
      />
    </LessonArticle>
  )
}
