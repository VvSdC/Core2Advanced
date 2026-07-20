import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function SlrRealWorldNotebook() {
  return (
    <LessonArticle>
      <Definition term="Production-Style Linear Regression Workflow">
        <p>
          Real ML engineers rarely start by coding gradient descent. They{' '}
          <strong className="text-white">load data</strong>,{' '}
          <strong className="text-white">explore</strong> it, check whether a linear relationship
          makes sense, then fit a model with a trusted library (here: scikit-learn) and evaluate
          honestly.
        </p>
      </Definition>

      <Callout variant="beginner" title="Notebook mindset">
        Same cell pattern as before: say what we are doing → run code → read the output. Imagine this
        as a Jupyter notebook you would share in a pull request.
      </Callout>

      <LessonSection title="Project goal">
        <Flowchart
          title="Engineer workflow for simple linear regression"
          chart={`flowchart TB
  A[Read CSV] --> B[Shape / dtypes / missing]
  B --> C[Describe + plots]
  C --> D[Correlation check]
  D --> E[Train / test split]
  E --> F[Fit LinearRegression]
  F --> G[Metrics on holdout]
  G --> H[Interpret slope & intercept]`}
        />
        <p className="mt-4 text-slate-300">
          Dataset: <code className="font-mono text-sm text-machine-learning-400">study_scores.csv</code>{' '}
          with columns <code className="font-mono text-sm">hours</code> and{' '}
          <code className="font-mono text-sm">score</code> (same 10 rows as the from-scratch lesson).
        </p>
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Imports — the usual toolkit"
          code={`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("libraries ready")`}
          output={`libraries ready`}
        >
          <p>
            Pandas for tables, NumPy for arrays, Matplotlib for quick plots, scikit-learn for split +
            model + metrics. This import block is what you will see at the top of most tabular ML
            notebooks.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Read the data"
          code={`df = pd.read_csv("study_scores.csv")
print(df)`}
          output={`   hours  score
0      1     45
1      2     52
2      3     61
3      4     68
4      5     74
5      6     82
6      7     88
7      8     95
8      9    100
9     10    108`}
        >
          <p>
            Always start by looking at the raw table. Confirm column names, row count, and that values
            look plausible (no scores of 10,000, no negative hours).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Quick structural EDA"
          code={`print("shape:", df.shape)
print()
print(df.info())
print()
print("missing values:")
print(df.isna().sum())`}
          output={`shape: (10, 2)

<class 'pandas.core.frame.DataFrame'>
RangeIndex: 10 entries, 0 to 9
Data columns (total 2 columns):
 #   Column  Non-Null Count  Dtype
---  ------  --------------  -----
 0   hours   10 non-null     int64
 1   score   10 non-null     int64
dtypes: int64(2)
memory usage: 288.0 bytes
None

missing values:
hours    0
score    0
dtype: int64`}
        >
          <p>
            Check shape, dtypes, and missing values before modeling. Here both columns are numeric and
            complete — ideal for a first linear regression.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Statistical summary"
          code={`print(df.describe().round(2))`}
          output={`       hours   score
count  10.00   10.00
mean    5.50   77.30
std     3.03   20.96
min     1.00   45.00
25%     3.25   62.75
50%     5.50   78.00
75%     7.75   93.25
max    10.00  108.00`}
        >
          <p>
            <code className="font-mono text-xs">describe()</code> shows center and spread. Hours range
            1–10; scores 45–108. Tiny n=10 is fine for learning — production models need far more rows.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Visualize the relationship"
          code={`plt.figure(figsize=(6, 4))
plt.scatter(df["hours"], df["score"], color="steelblue")
plt.xlabel("Hours studied")
plt.ylabel("Exam score")
plt.title("Hours vs Score")
plt.grid(True, alpha=0.3)
plt.show()`}
          output={`[scatter plot: points rise roughly along a straight line from (1,45) to (10,108)]`}
        >
          <p>
            A scatter plot is the fastest way to ask: “Does a straight line even make sense?” An upward
            linear cloud → green light for simple linear regression. A curve or blob → reconsider.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Quantify the relationship — correlation"
          code={`corr = df["hours"].corr(df["score"])
print("Pearson correlation (hours, score) =", round(corr, 4))

print()
print(df.corr().round(4))`}
          output={`Pearson correlation (hours, score) = 0.9989

       hours   score
hours 1.0000  0.9989
score 0.9989  1.0000`}
        >
          <p>
            Correlation near +1 means a strong positive linear association. That supports using a
            linear model. Remember: correlation ≠ causation — but it is a useful modeling signal.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="Train / test split"
          code={`X = df[["hours"]]   # 2D feature matrix
y = df["score"]     # 1D target

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

print("train size:", len(X_train), " test size:", len(X_test))
print("test hours:")
print(X_test)`}
          output={`train size: 8  test size: 2
test hours:
   hours
8      9
1      2`}
        >
          <p>
            Hold out 20% so we evaluate on rows the model did not fit. With only 10 rows the test set
            is tiny — in real work you want much more data, or cross-validation.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={8}
          title="Fit scikit-learn LinearRegression"
          code={`model = LinearRegression()
model.fit(X_train, y_train)

print("intercept θ₀ =", round(model.intercept_, 4))
print("slope θ₁     =", round(model.coef_[0], 4))
print()
print("Interpreted: score ≈ {:.2f} + {:.2f} * hours".format(
    model.intercept_, model.coef_[0]
))`}
          output={`intercept θ₀ = 39.4569
slope θ₁     = 6.9397

Interpreted: score ≈ 39.46 + 6.94 * hours`}
        >
          <p>
            <code className="font-mono text-xs">fit</code> runs the library&apos;s solver (closed form
            under the hood for this model). Same equation as our from-scratch notebook — different
            tooling.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={9}
          title="Evaluate on the holdout set"
          code={`y_pred = model.predict(X_test)

print("actual:", list(y_test.values))
print("pred:  ", [round(v, 2) for v in y_pred])
print()
print("MAE :", round(mean_absolute_error(y_test, y_pred), 3))
print("RMSE:", round(mean_squared_error(y_test, y_pred) ** 0.5, 3))
print("R²  :", round(r2_score(y_test, y_pred), 4))`}
          output={`actual: [100, 52]
pred:   [101.91, 53.34]

MAE : 1.625
RMSE: 1.65
R²  : 0.9953`}
        >
          <p>
            Report metrics that match the goal: MAE/RMSE in score points, R² for variance explained.
            With a near-linear toy set, scores look great — do not expect this perfection on messy
            real data.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={10}
          title="Plot data + fitted line (communication-ready)"
          code={`# Fit on all rows for a clean illustration plot
model_all = LinearRegression().fit(df[["hours"]], df["score"])
x_line = np.linspace(df["hours"].min(), df["hours"].max(), 50)
y_line = model_all.predict(x_line.reshape(-1, 1))

plt.figure(figsize=(6, 4))
plt.scatter(df["hours"], df["score"], label="data")
plt.plot(x_line, y_line, color="crimson", label="fitted line")
plt.xlabel("Hours studied")
plt.ylabel("Exam score")
plt.legend()
plt.title("Simple Linear Regression Fit")
plt.show()

print("full-data θ₀ =", round(model_all.intercept_, 4),
      " θ₁ =", round(model_all.coef_[0], 4))`}
          output={`[scatter points with a straight crimson regression line through them]
full-data θ₀ = 39.2667  θ₁ = 6.9152`}
        >
          <p>
            Stakeholders understand a chart faster than a table of coefficients. Notice full-data θ
            matches the OLS numbers from the from-scratch lesson.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={11}
          title="Predict for a new student"
          code={`new = pd.DataFrame({"hours": [6.5]})
print("Predicted score for 6.5 hours:",
      round(model_all.predict(new)[0], 1))`}
          output={`Predicted score for 6.5 hours: 84.2`}
        >
          <p>
            Production inference: build a one-row DataFrame with the same column name(s) the model was
            trained on, then call <code className="font-mono text-xs">predict</code>.
          </p>
        </NotebookCell>
      </div>

      <Callout variant="insight" title="From-scratch vs library">
        From-scratch taught you what the optimizer is doing. Libraries keep you productive and less
        error-prone. Strong engineers understand both.
      </Callout>

      <Callout variant="tip" title="Checklist before you ship">
        Missing values handled? Relationship looks linear? Split before fitting? Metrics match the
        business cost of errors? Slope/intercept make domain sense?
      </Callout>

      <KeyTakeaways
        items={[
          'Real workflows: load → EDA → relationship check → split → fit → evaluate → interpret.',
          'Scatter plots and correlation tell you if a linear model is reasonable.',
          'scikit-learn LinearRegression fits the same ŷ = θ₀ + θ₁x equation we derived by hand.',
          'Always score on held-out data and explain coefficients in plain language.',
        ]}
      />
    </LessonArticle>
  )
}
