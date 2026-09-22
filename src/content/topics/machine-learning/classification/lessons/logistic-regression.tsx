import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LogisticRegressionLesson() {
  return (
    <LessonArticle>
      <Definition term="Logistic regression">
        <p>
          A <strong className="text-white">linear classifier</strong> that outputs a probability,
          not a hard label. It keeps the linear score z = θᵀx from regression, then squashes it
          through a sigmoid so ŷ ∈ (0, 1):
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>z = θᵀx</div>
          <div>σ(z) = 1 / (1 + e⁻ᶻ)</div>
          <div>P(y = 1 | x) = σ(z)</div>
        </div>
        <p className="mt-3 text-slate-300">
          The decision boundary is still a hyperplane (z = 0 ⇒ P = 0.5). The extra work is
          turning that plane into calibrated-ish probabilities and training with log-loss instead
          of MSE.
        </p>
      </Definition>

      <LessonSection title="Intuition — a line that talks in probabilities">
        <p className="text-slate-300">
          Linear regression on a 0/1 label can predict 1.4 or −0.3. Logistic regression asks a
          better question: &ldquo;how log-odds-ish is this x?&rdquo; and maps that to a number
          you can threshold.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>odds = p / (1 − p)</div>
          <div>log-odds = log(p / (1 − p)) = θᵀx</div>
          <div className="mt-1">+1 in xⱼ multiplies the odds by e^(θⱼ), holding other features fixed.</div>
        </div>
        <Flowchart
          title="Score → probability → class"
          chart={`flowchart LR
  A[Features x] --> B[Linear score z = θᵀx]
  B --> C[Sigmoid σ(z)]
  C --> D[Probability]
  D --> E[Threshold, usually 0.5]`}
        />
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Binary (or one-vs-rest / softmax) labels and a roughly linear decision surface.</li>
          <li>You need probabilities or an odds-ratio story for a stakeholder.</li>
          <li>As the default linear baseline before trees — fast, convex, well understood.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Skip it when classes weave around each other (XOR, concentric rings), when you have
          huge unscaled feature interactions, or when you need a model that can ignore irrelevant
          coordinates without regularisation (trees do that more naturally).
        </p>
      </LessonSection>

      <LessonSection title="How it is trained — Bernoulli MLE">
        <p className="text-slate-300">
          Each label is a coin with success probability σ(θᵀxᵢ). The log-likelihood is
          binary cross-entropy — the same loss as the information-theory lesson:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>ℓ(θ) = Σᵢ [ yᵢ log σ(zᵢ) + (1 − yᵢ) log(1 − σ(zᵢ)) ]</div>
          <div>J(θ) = −ℓ(θ) / m          (+ optional λ‖θ‖² / 2)</div>
          <div className="mt-2">∇J = (1/m) Xᵀ (σ(Xθ) − y)     ← almost the linear-regression gradient</div>
        </div>
        <p className="mt-3 text-slate-300">
          J is convex. There is no closed-form θ. You minimise with gradient descent, L-BFGS, or
          Newton (IRLS). Regularisation is the same Ridge / Lasso story as regression.
        </p>
        <Callout variant="tip" title="Do not use MSE on 0/1 labels">
          Squared error plus a sigmoid is non-convex and saturates: confident wrong answers have
          tiny gradients. Log-loss keeps shouting until the probability of the true class is high.
        </Callout>
      </LessonSection>

      <LessonSection title="Multiclass — softmax">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(y = k | x) = exp(θₖᵀx) / Σⱼ exp(θⱼᵀx)</div>
        </div>
        <p className="mt-3 text-slate-300">
          One weight vector per class. Training is categorical cross-entropy. This is the linear
          cousin of a neural-net last layer.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Sigmoid and a threshold">
          <p>z = 2.0. What is P(y = 1)? What class at threshold 0.5?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>σ(2) = 1 / (1 + e⁻²) ≈ 0.8808  →  class 1</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Odds-ratio reading">
          <p>θ_hours = 0.693 ≈ ln 2. What does +1 hour of study do to the odds of passing?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Odds multiply by e^0.693 ≈ 2. Double the odds, not double the probability.</div>
            <div>If p was 0.5 (odds 1:1), new odds 2:1 → p = 2/3.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — One gradient step">
          <p>One row: x = [1, 2] (bias + feature), y = 1, θ = [0, 0]. Gradient of J?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>z = 0, σ = 0.5, error = 0.5 − 1 = −0.5</div>
            <div>∇J = x · (−0.5) = [−0.5, −1.0]</div>
            <div>A step of α = 1 gives θ ← [0.5, 1.0] — moving to raise P(y = 1).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Imbalanced threshold (ML flavour)">
          <p>Fraud is 1% of rows. Is 0.5 the right cutoff if you want high recall?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Usually no. The model may never exceed 0.5 if it is conservative.</div>
            <div>Pick the threshold on a precision-recall curve for the cost of a miss vs a false alarm.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Linearly inseparable">
          <p>XOR: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→0. Can logistic regression get 100%?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>No — no straight line separates the two classes.</div>
            <div>Add the interaction x₁x₂, or use a tree / kernel SVM / net.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — sigmoid, loss, one Newton-free GD">
        <Example
          title="Fit a 1-D logistic by hand"
          output={`θ ≈ [-3.76  1.45]
P(x=4) ≈ 0.87
log-loss ≈ 0.31`}
        >{`import numpy as np

def sigmoid(z):
    return 1 / (1 + np.exp(-np.clip(z, -30, 30)))

X = np.array([[1, 1], [1, 2], [1, 3], [1, 4], [1, 5], [1, 6]], dtype=float)
y = np.array([0, 0, 0, 1, 1, 1], dtype=float)
theta = np.zeros(2)
for _ in range(400):
    p = sigmoid(X @ theta)
    theta -= 0.5 * (X.T @ (p - y)) / len(y)

p4 = sigmoid(np.array([1.0, 4.0]) @ theta)
loss = -np.mean(y * np.log(sigmoid(X @ theta) + 1e-12) +
                (1 - y) * np.log(1 - sigmoid(X @ theta) + 1e-12))
print("θ ≈", np.round(theta, 2))
print(f"P(x=4) ≈ {p4:.2f}")
print(f"log-loss ≈ {loss:.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Logistic regression is a linear model for P(y = 1 | x) = σ(θᵀx). The decision boundary is the hyperplane θᵀx = 0.',
          'Train with Bernoulli / categorical cross-entropy (MLE), not MSE. The gradient looks like linear regression with σ(z) in place of ŷ.',
          'θⱼ multiplies the odds by e^{θⱼ} per unit xⱼ — that is the interpretable story, not “+θⱼ probability.”',
          'Threshold 0.5 is a default, not a law. Imbalanced or asymmetric costs need a PR-curve threshold.',
          'Use it as the linear baseline. If the classes are not linearly separable, expand features or switch algorithm family.',
        ]}
      />
    </LessonArticle>
  )
}
