import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  NotebookCell,
} from '../../../../../components/content'

export function SlrFromScratchNotebook() {
  return (
    <LessonArticle>
      <Definition term="From-Scratch Simple Linear Regression">
        <p>
          This notebook builds simple linear regression <strong className="text-white">by hand</strong>{' '}
          on 10 rows: study hours → exam score. We implement predictions, MSE, and batch gradient
          descent with plain Python — no scikit-learn yet.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to read this notebook">
        Each cell has a short goal, then code (<span className="font-mono text-xs text-machine-learning-400">In [n]</span>),
        then what you would see when you run it (<span className="font-mono text-xs text-emerald-400">Out [n]</span>).
      </Callout>

      <LessonSection title="Dataset — 10 labeled examples">
        <Flowchart
          title="What we are building"
          chart={`flowchart TB
  A[10 rows: hours → score] --> B[Define ŷ = θ₀ + θ₁x]
  B --> C[Cost = MSE]
  C --> D[Gradient descent loop]
  D --> E[Predict for new hours]`}
        />
      </LessonSection>

      <div className="space-y-6">
        <NotebookCell
          cell={1}
          title="Create the tiny dataset"
          code={`hours = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
scores = [45, 52, 61, 68, 74, 82, 88, 95, 100, 108]

print("n =", len(hours))
print("first row: hours =", hours[0], "score =", scores[0])
print("last row:  hours =", hours[-1], "score =", scores[-1])`}
          output={`n = 10
first row: hours = 1 score = 45
last row:  hours = 10 score = 108`}
        >
          <p>
            One feature (<code className="font-mono text-xs">hours</code>) and one label (
            <code className="font-mono text-xs">scores</code>). Ten examples keep the math easy to
            follow while still showing a clear upward trend.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={2}
          title="Hypothesis — predict with current θ"
          code={`def predict(x, theta0, theta1):
    # ŷ = θ₀ + θ₁ · x
    return theta0 + theta1 * x

# Untrained guess: θ₀=0, θ₁=0 → always predicts 0
print([predict(h, 0, 0) for h in hours[:3]])

# A hand-picked line just to see the shape
print([round(predict(h, 40, 7), 1) for h in hours[:3]])`}
          output={`[0, 0, 0]
[47.0, 54.0, 61.0]`}
        >
          <p>
            Before training, parameters are arbitrary. The predict function is the model equation from
            the theory lessons.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={3}
          title="Cost function — Mean Squared Error"
          code={`def mse_cost(x, y, theta0, theta1):
    m = len(x)
    total = 0.0
    for xi, yi in zip(x, y):
        error = predict(xi, theta0, theta1) - yi
        total += error ** 2
    return total / (2 * m)

print("J(0, 0)   =", round(mse_cost(hours, scores, 0, 0), 2))
print("J(40, 7)  =", round(mse_cost(hours, scores, 40, 7), 2))`}
          output={`J(0, 0)   = 3185.35
J(40, 7)  = 1.2`}
        >
          <p>
            Lower cost = better fit on the training rows. A random line (θ=0) is terrible; a rough
            hand-tuned line already looks much better.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={4}
          title="One gradient descent step"
          code={`def gradients(x, y, theta0, theta1):
    m = len(x)
    g0 = g1 = 0.0
    for xi, yi in zip(x, y):
        error = predict(xi, theta0, theta1) - yi
        g0 += error
        g1 += error * xi
    return g0 / m, g1 / m

theta0, theta1 = 0.0, 0.0
alpha = 0.01

g0, g1 = gradients(hours, scores, theta0, theta1)
theta0 = theta0 - alpha * g0
theta1 = theta1 - alpha * g1

print("after 1 step: θ₀ =", round(theta0, 4), " θ₁ =", round(theta1, 4))
print("cost =", round(mse_cost(hours, scores, theta0, theta1), 2))`}
          output={`after 1 step: θ₀ = 0.7730  θ₁ = 4.8220
cost = 1268.82`}
        >
          <p>
            Compute ∂J/∂θ₀ and ∂J/∂θ₁ on all examples, then update both parameters with learning rate
            α = 0.01. Cost already dropped a lot after one step.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={5}
          title="Train until the cost converges"
          code={`theta0, theta1 = 0.0, 0.0
alpha = 0.01
history = []

for epoch in range(1, 2001):
    g0, g1 = gradients(hours, scores, theta0, theta1)
    theta0 -= alpha * g0
    theta1 -= alpha * g1
    if epoch in (1, 10, 100, 500, 1000, 2000):
        J = mse_cost(hours, scores, theta0, theta1)
        history.append((epoch, round(theta0, 4), round(theta1, 4), round(J, 4)))

for epoch, t0, t1, J in history:
    print(f"epoch {epoch:4d} | θ₀={t0:8.4f} | θ₁={t1:7.4f} | J={J:8.4f}")

print()
print("Learned line:  score ≈", round(theta0, 2), "+", round(theta1, 2), "* hours")`}
          output={`epoch    1 | θ₀=  0.7730 | θ₁= 4.8220 | J=1268.8231
epoch   10 | θ₀=  2.5350 | θ₁=12.1059 | J= 145.0708
epoch  100 | θ₀=  8.8760 | θ₁=11.2805 | J=  99.4173
epoch  500 | θ₀= 26.1571 | θ₁= 8.7982 | J=  18.8660
epoch 1000 | θ₀= 34.6837 | θ₁= 7.5735 | J=   2.7010
epoch 2000 | θ₀= 38.7066 | θ₁= 6.9956 | J=   0.4839

Learned line:  score ≈ 38.71 + 7.0 * hours`}
        >
          <p>
            Watch J fall and flatten — that is convergence. After 2000 steps we are close to the
            ordinary-least-squares solution (≈ 39.27 + 6.92 · hours).
          </p>
        </NotebookCell>

        <NotebookCell
          cell={6}
          title="Predict for new students"
          code={`def forecast(hours_studied):
    return theta0 + theta1 * hours_studied

for h in [3, 7, 12]:
    print(f"{h:2d} hours → predicted score {forecast(h):6.1f}")`}
          output={` 3 hours → predicted score   59.7
 7 hours → predicted score   87.7
12 hours → predicted score  122.7`}
        >
          <p>
            Inference uses only the learned parameters — not the training loop. 12 hours is slightly
            outside the training range; treat extrapolation with care in real projects.
          </p>
        </NotebookCell>

        <NotebookCell
          cell={7}
          title="Sanity-check against closed-form OLS"
          code={`m = len(hours)
mean_x = sum(hours) / m
mean_y = sum(scores) / m

num = sum((xi - mean_x) * (yi - mean_y) for xi, yi in zip(hours, scores))
den = sum((xi - mean_x) ** 2 for xi in hours)
ols_theta1 = num / den
ols_theta0 = mean_y - ols_theta1 * mean_x

print("Gradient descent: θ₀ =", round(theta0, 4), " θ₁ =", round(theta1, 4))
print("Closed-form OLS:  θ₀ =", round(ols_theta0, 4), " θ₁ =", round(ols_theta1, 4))`}
          output={`Gradient descent: θ₀ = 38.7066  θ₁ = 6.9956
Closed-form OLS:  θ₀ = 39.2667  θ₁ = 6.9152`}
        >
          <p>
            With more epochs (or a tuned α), GD gets arbitrarily close to OLS. Closed form is fine for
            one feature; gradient descent is the skill that scales to deep models.
          </p>
        </NotebookCell>
      </div>

      <Callout variant="insight" title="What you practiced">
        Dataset → hypothesis → cost → gradients → iterate → predict. That loop is the heart of many
        supervised trainers.
      </Callout>

      <KeyTakeaways
        items={[
          'Implement ŷ = θ₀ + θ₁x, MSE, and batch gradient descent in plain Python.',
          'Cost should drop across epochs when α is chosen well.',
          'After convergence, predictions are a single multiply-and-add.',
          'GD approaches the same line you get from the closed-form OLS solution.',
        ]}
      />
    </LessonArticle>
  )
}
