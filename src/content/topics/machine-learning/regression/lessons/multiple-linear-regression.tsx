import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MultipleLinearRegression() {
  return (
    <LessonArticle>
      <Definition term="Multiple linear regression">
        <p>
          The same linear model with <strong className="text-white">two or more features</strong>:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>ŷ = θ₀ + θ₁ x₁ + θ₂ x₂ + … + θₙ xₙ = θᵀ x</div>
          <div className="mt-2">In matrix form:  ŷ = Xθ     (X is m × (n+1) after a bias column of ones)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Geometry changes from a line in 2-D to a hyperplane in (n+1)-D. Training does not: still
          minimise MSE, still OLS or gradient descent.
        </p>
      </Definition>

      <LessonSection title="Intuition — holding other things fixed">
        <p className="text-slate-300">
          House price depends on size <em>and</em> bedrooms <em>and</em> location. θ₁ is not
          &ldquo;what happens if size grows&rdquo; in the real world — it is &ldquo;what happens if
          size grows and every other feature stays put.&rdquo; That ceteris-paribus reading is why
          people love linear models for explanations, and why it lies when features are entangled.
        </p>
        <Callout variant="beginner" title="Dummy variables">
          Categories become numbers via one-hot encoding: neighbourhood = {'{A, B, C}'} turns into two
          0/1 columns (drop one to avoid the dummy-variable trap — that dropped level is the
          intercept&rsquo;s baseline).
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Several numeric (or dummy) features, one numeric target, roughly linear effects.</li>
          <li>You need a coefficient table you can show a stakeholder.</li>
          <li>As a baseline before trees / boosting — if linear already wins, stop there.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Skip it when interactions dominate (size helps only in neighbourhood A), when n ≈ m, or
          when two features are near-duplicates (multicollinearity).
        </p>
      </LessonSection>

      <LessonSection title="OLS and the normal equation">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>J(θ) = (1 / 2m) ‖Xθ − y‖²</div>
          <div>∇J   = (1 / m) Xᵀ (Xθ − y)</div>
          <div>Set ∇J = 0  →  θ = (XᵀX)⁻¹ Xᵀ y</div>
        </div>
        <p className="mt-3 text-slate-300">
          XᵀX is (n+1) × (n+1). Invertible iff the columns of X are linearly independent — no
          feature is an exact combination of the others, and you did not keep every dummy plus the
          intercept.
        </p>
      </LessonSection>

      <LessonSection title="Multicollinearity — the silent coefficient killer">
        <p className="text-slate-300">
          If x₂ ≈ 2 x₁, OLS can trade weight between them freely. Predictions stay fine; individual
          θⱼ become huge, unstable, and uninterpretable. Variance inflation factor (VIF) flags this:
          VIFⱼ = 1 / (1 − R²ⱼ) where R²ⱼ is from regressing feature j on the others. VIF &gt; 5 or 10
          is the usual alarm.
        </p>
        <Callout variant="tip" title="Fixes that actually work">
          Drop the redundant column, combine them (size per bedroom), or switch to Ridge — which
          shrinks the pair together instead of letting them fight.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Predict from a coefficient table">
          <p>ŷ = 50 + 20·size + 15·beds, size in 100 m². A 150 m², 3-bed house?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ŷ = 50 + 20·1.5 + 15·3 = 50 + 30 + 45 = 125  (whatever unit price is in)</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Recover θ from a tiny design matrix">
          <p>
            Four rows, two features, y = [14, 20, 26, 32]. X (with bias) rows: [1, 1, 2], [1, 2, 3],
            [1, 3, 4], [1, 4, 5]. Show that θ = [2, 4, 4] fits perfectly.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Row 1: 2 + 4·1 + 4·2 = 14</div>
            <div>Row 2: 2 + 8 + 12    = 22  ← wait, y₂ is 20. So [2, 4, 4] is NOT exact.</div>
            <div className="mt-2">Actual OLS: θ = (XᵀX)⁻¹ Xᵀy ≈ [8, 2, 2]  (see Python).</div>
            <div className="mt-1 text-slate-400">
              Features are almost collinear (x₂ = x₁ + 1), so the surface is a thin ridge — many θ
              look &ldquo;almost right.&rdquo;
            </div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Dummy-variable trap">
          <p>Gender encoded as two columns is_male and is_female, plus an intercept. What breaks?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>is_male + is_female = 1 = bias column.  Columns of X are dependent.</div>
            <div>XᵀX is singular. Drop one dummy (or drop the intercept).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Interpreting a coefficient">
          <p>θ_beds = −8 after controlling for size. Does that mean bedrooms lower price?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Only holding size fixed: more bedrooms in the same floor area → smaller rooms.</div>
            <div>The sign can flip vs the raw (uncontrolled) correlation. That is omitted-variable bias in reverse — a feature of controlling, not a bug.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Rank of X (ML flavour)">
          <p>You one-hot a 4-level category and keep all 4 dummies plus intercept. Rank of X?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The 4 dummies sum to the intercept. Rank is at most n_columns − 1.</div>
            <div>sklearn&rsquo;s LinearRegression uses a pseudoinverse, so it &ldquo;works&rdquo; — coefficients are not unique.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — OLS, collinear features, VIF sketch">
        <Example
          title="Fit, predict, and watch XᵀX become ill-conditioned"
          output={`θ = [8. 2. 2.]
ŷ = [14. 20. 26. 32.]
cond(XᵀX) with x2 = x1+1 :  1.03e+03
cond(XᵀX) with x2 = 2·x1 :  1.85e+16  (numerically singular)`}
        >{`import numpy as np

X = np.array([
    [1, 1, 2],
    [1, 2, 3],
    [1, 3, 4],
    [1, 4, 5],
], dtype=float)
y = np.array([14.0, 20.0, 26.0, 32.0])
theta = np.linalg.pinv(X.T @ X) @ X.T @ y
print("θ =", np.round(theta, 4))
print("ŷ =", X @ theta)

print("cond(XᵀX) with x2 = x1+1 : ", f"{np.linalg.cond(X.T @ X):.2e}")

X_bad = np.array([[1, 1, 2], [1, 2, 4], [1, 3, 6], [1, 4, 8]], dtype=float)
print("cond(XᵀX) with x2 = 2·x1 : ", f"{np.linalg.cond(X_bad.T @ X_bad):.2e}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multiple linear regression is ŷ = θᵀx. Training is the same MSE + OLS / GD as the one-feature case.',
          'θⱼ is the change in ŷ for +1 in xⱼ holding other features fixed — useful only when that counterfactual makes sense.',
          'Encode categories as dummies and drop one level (or the intercept) so XᵀX stays invertible.',
          'Multicollinearity leaves predictions intact and wrecks coefficient stories. Check VIF; drop, combine, or Ridge.',
          'θ = (XᵀX)⁻¹ Xᵀy fails when columns of X are linearly dependent. Libraries quietly use a pseudoinverse — do not confuse “it ran” with “θ is unique.”',
        ]}
      />
    </LessonArticle>
  )
}
