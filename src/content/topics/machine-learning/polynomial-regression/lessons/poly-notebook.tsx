import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function PolyNotebook() {
  return (
    <LessonArticle>
      <Definition term="Polynomial Regression Notebook">
        <p>
          Curved sample data: compare a <strong className="text-white">linear</strong> fit to a{' '}
          <strong className="text-white">degree-2 polynomial</strong>, expand features, run OLS /
          scikit-learn, and read MAE / RMSE / R² — cell by cell with outputs.
        </p>
      </Definition>

      <Callout variant="beginner" title="What you should notice">
        Linear underfits the U-shaped trend; adding x² drops error sharply without needing a new
        optimizer.
      </Callout>

      <LessonSection title="Flow">
        <Flowchart
          title="Notebook steps"
          chart={`flowchart TB
  A[Load x, y] --> B[Scatter — see curve]
  B --> C[Linear baseline metrics]
  C --> D[PolynomialFeatures degree 2]
  D --> E[Fit + compare metrics]
  E --> F[Train/test + predict]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Imports"
          code={`import numpy as np
import pandas as pd
import matplotlib.pyplot as plt

from sklearn.preprocessing import PolynomialFeatures
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

print("ready")`}
          output={`ready`}
        >
          <p>
            <code className="font-mono text-xs">PolynomialFeatures</code> builds Φ;{' '}
            <code className="font-mono text-xs">LinearRegression</code> still does the learning.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Sample curved dataset"
          code={`df = pd.DataFrame({
    "x": [-3, -2, -1, 0, 1, 2, 3, 4],
    "y": [4.0, 2.2, 1.1, 1.0, 1.9, 4.0, 7.0, 11.0],
})
print(df)`}
          output={`   x     y
0 -3   4.0
1 -2   2.2
2 -1   1.1
3  0   1.0
4  1   1.9
5  2   4.0
6  3   7.0
7  4  11.0`}
        >
          <p>Values roughly follow a quadratic bowl — linear regression will struggle; degree 2 should shine.</p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="EDA — scatter plot"
          code={`plt.figure(figsize=(6, 4))
plt.scatter(df["x"], df["y"], color="steelblue")
plt.xlabel("x")
plt.ylabel("y")
plt.title("Curved pattern — candidate for polynomial regression")
plt.grid(True, alpha=0.3)
plt.show()`}
          output={`[scatter: high at both ends, low near x=0 — U-shaped trend]`}
        >
          <p>This is the “when to use polynomial” visual: a bend, not a straight cloud.</p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="Linear baseline (degree 1)"
          code={`X = df[["x"]]
y = df["y"]

lin = LinearRegression().fit(X, y)
y_lin = lin.predict(X)

print("ŷ = {:.3f} + {:.3f}·x".format(lin.intercept_, lin.coef_[0]))
print("MAE :", round(mean_absolute_error(y, y_lin), 3))
print("RMSE:", round(mean_squared_error(y, y_lin) ** 0.5, 3))
print("R²  :", round(r2_score(y, y_lin), 4))`}
          output={`ŷ = 3.533 + 0.983·x
MAE : 1.983
RMSE: 2.303
R²  : 0.489`}
        >
          <p>R² ≈ 0.49 and RMSE ≈ 2.3 — a line is the wrong shape for this data.</p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Expand features — degree 2"
          code={`poly = PolynomialFeatures(degree=2, include_bias=False)
Phi = poly.fit_transform(X)
print("feature names:", poly.get_feature_names_out(["x"]))
print(np.round(Phi, 2))`}
          output={`feature names: ['x' 'x^2']
[[-3.  9.]
 [-2.  4.]
 [-1.  1.]
 [ 0.  0.]
 [ 1.  1.]
 [ 2.  4.]
 [ 3.  9.]
 [ 4. 16.]]`}
        >
          <p>
            Φ now has x and x² (bias handled by{' '}
            <code className="font-mono text-xs">LinearRegression</code>). This is the whole “polynomial”
            trick.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Fit polynomial regression"
          code={`model = LinearRegression().fit(Phi, y)
y_poly = model.predict(Phi)

print("θ₀ =", round(model.intercept_, 4))
print("θ₁ (x)  =", round(model.coef_[0], 4))
print("θ₂ (x²) =", round(model.coef_[1], 4))
print()
print("MAE :", round(mean_absolute_error(y, y_poly), 3))
print("RMSE:", round(mean_squared_error(y, y_poly) ** 0.5, 3))
print("R²  :", round(r2_score(y, y_poly), 4))`}
          output={`θ₀ = 1.0214
θ₁ (x)  = 0.481
θ₂ (x²) = 0.5024

MAE : 0.057
RMSE: 0.073
R²  : 0.9995`}
        >
          <p>Error collapses vs the linear baseline — curvature captured by θ₂.</p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="OLS check — normal equation on Φ"
          code={`Phi_bias = np.column_stack([np.ones(len(df)), df["x"], df["x"] ** 2])
theta = np.linalg.solve(Phi_bias.T @ Phi_bias, Phi_bias.T @ y.to_numpy())
print("θ from (ΦᵀΦ)θ = Φᵀy:", np.round(theta, 4))`}
          output={`θ from (ΦᵀΦ)θ = Φᵀy: [1.0214 0.481  0.5024]`}
        >
          <p>Matches sklearn — same OLS math as multiple linear regression on expanded columns.</p>
        </NotebookCell>

        <NotebookCell
          cell={8}
          title="Train / test evaluation"
          code={`X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.25, random_state=42
)

poly = PolynomialFeatures(degree=2, include_bias=False)
Phi_train = poly.fit_transform(X_train)
Phi_test = poly.transform(X_test)

model = LinearRegression().fit(Phi_train, y_train)
pred = model.predict(Phi_test)

print("test x:", list(X_test["x"]))
print("actual:", list(y_test))
print("pred:  ", [round(v, 3) for v in pred])
print()
print("MAE :", round(mean_absolute_error(y_test, pred), 3))
print("RMSE:", round(mean_squared_error(y_test, pred) ** 0.5, 3))
print("R²  :", round(r2_score(y_test, pred), 4))`}
          output={`test x: [-2, 2]
actual: [2.2, 4.0]
pred:   [2.018, 3.986]

MAE : 0.098
RMSE: 0.129
R²  : 0.9794`}
        >
          <p>Holdout metrics stay strong — degree 2 generalizes on this small curved set.</p>
        </NotebookCell>

        <NotebookCell
          cell={9}
          title="Predict for a new x"
          code={`x_new = pd.DataFrame({"x": [1.5]})
phi_new = poly.transform(x_new)
print("Predicted y at x=1.5:", round(model.predict(phi_new)[0], 3))`}
          output={`Predicted y at x=1.5: 2.863`}
        >
          <p>Always transform new data with the same PolynomialFeatures before predict.</p>
        </NotebookCell>
      </div>

      <Callout variant="insight" title="Takeaway">
        Decide with plots → baseline linear metrics → expand φ → refit → compare MAE/RMSE/R² on
        holdout. That is the practical polynomial regression loop.
      </Callout>

      <KeyTakeaways
        items={[
          'Scatter + poor linear R²/RMSE suggest trying polynomial features.',
          'PolynomialFeatures + LinearRegression implements degree-k regression.',
          'OLS on Φ matches sklearn coefficients.',
          'Report MAE/RMSE/R² for linear vs poly (and by degree) on test data.',
        ]}
      />
    </LessonArticle>
  )
}
