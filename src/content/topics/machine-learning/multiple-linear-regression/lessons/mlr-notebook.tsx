import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function MlrNotebook() {
  return (
    <LessonArticle>
      <Definition term="MLR Notebook — House Price Style">
        <p>
          A practical walkthrough with <strong className="text-white">two features</strong> (
          <code className="font-mono text-xs">size</code>,{' '}
          <code className="font-mono text-xs">bedrooms</code>) predicting{' '}
          <code className="font-mono text-xs">price</code>. Each cell states the goal, shows code, then
          output — same notebook style as simple linear regression.
        </p>
      </Definition>

      <Callout variant="beginner" title="Not SLR">
        Predictions always use both features. We fit ŷ = θ₀ + θ₁·size + θ₂·bedrooms with OLS /
        scikit-learn.
      </Callout>

      <LessonSection title="Project map">
        <Flowchart
          title="Notebook flow"
          chart={`flowchart TB
  A[Load table] --> B[EDA + correlation]
  B --> C[X with 2 features]
  C --> D[Train / test split]
  D --> E[Fit LinearRegression]
  E --> F[Metrics]
  F --> G[OLS matrix check]
  G --> H[Predict new row]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Imports"
          code={`import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("ready")`}
          output={`ready`}
        >
          <p>Same tooling as the SLR real-world notebook — now X will have two columns.</p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Create / read the sample dataset"
          code={`df = pd.DataFrame({
    "size":     [1, 2, 2, 3, 3, 4, 4, 5],   # size units
    "bedrooms": [1, 1, 2, 2, 3, 2, 3, 3],
    "price":    [150, 200, 240, 300, 340, 360, 400, 450],
})
print(df)`}
          output={`   size  bedrooms  price
0     1         1    150
1     2         1    200
2     2         2    240
3     3         2    300
4     3         3    340
5     4         2    360
6     4         3    400
7     5         3    450`}
        >
          <p>
            Eight rows keep outputs readable. In a real project you would{' '}
            <code className="font-mono text-xs">pd.read_csv(...)</code> instead.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Structural EDA"
          code={`print("shape:", df.shape)
print()
print(df.describe().round(2))
print()
print("missing:\\n", df.isna().sum())`}
          output={`shape: (8, 3)

       size  bedrooms   price
count  8.00      8.00    8.00
mean   3.00      2.12  305.00
std    1.31      0.83  102.54
min    1.00      1.00  150.00
25%    2.00      1.75  230.00
50%    3.00      2.00  320.00
75%    4.00      3.00  370.00
max    5.00      3.00  450.00

missing:
 size        0
 bedrooms    0
 price       0
 dtype: int64`}
        >
          <p>Confirm dtypes/ranges and that there are no missing values before modeling.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Relationships — correlation matrix"
          code={`print(df.corr().round(3))`}
          output={`           size  bedrooms  price
size      1.000     0.784  0.979
bedrooms  0.784     1.000  0.893
price     0.979     0.893  1.000`}
        >
          <p>
            Both features correlate with price; they also correlate with each other (0.78). MLR can
            still use both — interpret coefficients as “holding the other feature fixed.”
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Define X (multiple features) and y"
          code={`X = df[["size", "bedrooms"]]  # two columns → MLR
y = df["price"]

print("X shape:", X.shape)
print(X.head())`}
          output={`X shape: (8, 2)
   size  bedrooms
0     1         1
1     2         1
2     2         2
3     3         2
4     3         3`}
        >
          <p>
            Shape <code className="font-mono text-xs">(8, 2)</code> is the key difference from SLR’s{' '}
            <code className="font-mono text-xs">(m, 1)</code>.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Train / test split"
          code={`X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)
print("train:", len(X_train), " test:", len(X_test))
print("test rows:\\n", pd.concat([X_test, y_test], axis=1))`}
          output={`train: 6  test: 2
test rows:
    size  bedrooms  price
1     2         1    200
5     4         2    360`}
        >
          <p>Hold out 25% so metrics reflect generalization, not just memorization.</p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="Fit multiple linear regression"
          code={`model = LinearRegression()
model.fit(X_train, y_train)

print("θ₀ (intercept) =", round(model.intercept_, 2))
print("θ₁ (size)      =", round(model.coef_[0], 2))
print("θ₂ (bedrooms)  =", round(model.coef_[1], 2))
print()
print("ŷ = {:.0f} + {:.0f}·size + {:.0f}·bedrooms".format(
    model.intercept_, model.coef_[0], model.coef_[1]
))`}
          output={`θ₀ (intercept) = 52.0
θ₁ (size)      = 56.0
θ₂ (bedrooms)  = 40.0

ŷ = 52 + 56·size + 40·bedrooms`}
        >
          <p>
            scikit-learn solves the least-squares problem (OLS under the hood for this estimator).
            Each coefficient is the change in predicted price for a +1 change in that feature.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={8}
          title="Evaluate on the test set"
          code={`y_pred = model.predict(X_test)
print("actual:", list(y_test.values))
print("pred:  ", [round(v, 1) for v in y_pred])
print()
print("MAE :", round(mean_absolute_error(y_test, y_pred), 3))
print("RMSE:", round(mean_squared_error(y_test, y_pred) ** 0.5, 3))
print("R²  :", round(r2_score(y_test, y_pred), 4))`}
          output={`actual: [200, 360]
pred:   [204.0, 356.0]

MAE : 4.0
RMSE: 4.0
R²  : 0.9975`}
        >
          <p>Same metrics as SLR — MAE/RMSE in price units, R² for variance explained.</p>
        </NotebookCell>

        <NotebookCell
          cell={9}
          title="OLS by hand — normal equation on all rows"
          code={`# Design matrix with bias column
Xm = np.column_stack([np.ones(len(df)), df["size"], df["bedrooms"]])
y_vec = df["price"].to_numpy(dtype=float)

theta = np.linalg.solve(Xm.T @ Xm, Xm.T @ y_vec)
print("θ from (XᵀX)θ = Xᵀy:", np.round(theta, 4))

# Match sklearn on full data
model_all = LinearRegression().fit(X, y)
print("sklearn full-data:",
      round(model_all.intercept_, 4),
      np.round(model_all.coef_, 4))`}
          output={`θ from (XᵀX)θ = Xᵀy: [50.     56.6667 40.    ]
sklearn full-data: 50.0 [56.6667 40.    ]`}
        >
          <p>
            This is the matrix OLS formula from the theory lessons. Full-data fit matches{' '}
            <code className="font-mono text-xs">LinearRegression</code> exactly here.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={10}
          title="Predict a new house"
          code={`new = pd.DataFrame({"size": [3.5], "bedrooms": [2]})
print("Predicted price:", round(model_all.predict(new)[0], 1))`}
          output={`Predicted price: 328.3`}
        >
          <p>
            Inference needs the <em>same feature columns</em> used in training — both size and
            bedrooms.
          </p>
        </NotebookCell>
      </div>

      <Callout variant="insight" title="Takeaway">
        MLR workflow = SLR workflow + a wider X. Math scales through matrices; engineering scales
        through clear EDA, splits, and metrics.
      </Callout>

      <KeyTakeaways
        items={[
          'Build X with multiple feature columns; y stays a single target.',
          'EDA and correlation help justify including each predictor.',
          'sklearn LinearRegression and the normal equation implement OLS for MLR.',
          'Report MAE/RMSE/R² on holdout data and interpret each θⱼ carefully.',
        ]}
      />
    </LessonArticle>
  )
}
