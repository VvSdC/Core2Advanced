import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function GradientBoostingLesson() {
  return (
    <LessonArticle>
      <Definition term="Gradient boosting">
        <p>
          An ensemble that builds trees <strong className="text-white">one after another</strong>,
          each fitted to the leftover error of the current model. In the general (Friedman)
          view, each tree is a step in function space along −∇L — the gradient of the loss
          with respect to the current predictions.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>F₀(x) = initial guess (mean of y, or log-odds)</div>
          <div>rᵢ    = − ∂L(yᵢ, F(xᵢ)) / ∂F(xᵢ)     at the current F</div>
          <div>Fit tree h_t to the residuals rᵢ</div>
          <div>F ← F + η · h_t</div>
        </div>
        <p className="mt-3 text-slate-300">
          η (learning rate) is small on purpose. Forests average independent experts; boosting
          writes a team that specialises in what the previous members missed.
        </p>
      </Definition>

      <LessonSection title="Intuition — correct the previous draft">
        <p className="text-slate-300">
          Draft 1 predicts everyone scores 60. Residuals are the missing marks. A small tree
          learns “students with &gt; 4 hours were under-predicted by 8.” Add that, slowly.
          Repeat. Early trees get the main trend; later trees chase leftovers — and eventually
          noise, which is why you stop early or shrink η.
        </p>
        <Callout variant="beginner" title="XGBoost / LightGBM / CatBoost">
          Same family. They add engineering: second-order (Hessian) steps, histogram splits,
          regularisation on leaf weights, handling of categoricals, missing values. The theory
          you need is still “greedy gradient steps in function space.”
        </Callout>
      </LessonSection>

      <LessonSection title="How it works — squared error first, then any loss">
        <p className="text-slate-300">
          For L = ½ (y − F)² the residual is exactly y − F. That is classical boosting. For
          log-loss the residual is y − p, the same error logistic regression uses. One algorithm,
          plug in a loss.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Loss</th>
                <th className="px-4 py-3">Residual r = −∂L/∂F</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Squared error', 'y − F'],
                ['Absolute error', 'sign(y − F)'],
                ['Log-loss (binary)', 'y − σ(F)'],
                ['Huber', 'clipped residual — robust to outliers'],
              ].map(([loss, r]) => (
                <tr key={loss}>
                  <td className="px-4 py-3 font-semibold text-white">{loss}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Tabular data where you want the usual winning accuracy.</li>
          <li>You can tune η, num_trees, max_depth (often 3–8), subsample, and regularisation.</li>
          <li>You have a validation set for early stopping.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Forests are easier to parallelise and harder to overfit. Boosting is sequential and
          hungry for careful stopping. Neither is the first tool for raw images or long text.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — First two boosting steps (squared error)">
          <p>y = [1, 2, 3], F₀ = 2 (the mean). Residuals? After adding η = 0.5 · residual stump that predicts the residual itself?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>r = [−1, 0, +1]</div>
            <div>If h₁ = r exactly (overfit stump): F₁ = 2 + 0.5·r = [1.5, 2.0, 2.5]</div>
            <div>New residuals [−0.5, 0, +0.5] — half the previous error. That is what η does.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Log-loss residual">
          <p>y = 1, current F = 0 so p = 0.5. Residual for boosting?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>r = y − p = 0.5. The next tree is asked to push F up for this row.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Learning rate vs trees">
          <p>η = 1.0, T = 20 deep trees vs η = 0.05, T = 400 shallow trees. Which overfits first?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-slate-200">
            <div>The first. Large η + deep trees fit noise in a few rounds.</div>
            <div>Small η + many shallow trees is the usual recipe — stop when val loss flattens.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Forest vs boost on the same stump">
          <p>You average 100 depth-1 trees (forest of stumps) vs add 100 depth-1 trees (boosted stumps). What differs?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Forest of stumps ≈ a smoother main-effects model (each stump sees a bootstrap).</div>
            <div>Boosted stumps can keep adding the next leftover effect — usually much stronger.</div>
            <div>AdaBoost and gradient boosting with stumps are classic for a reason.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Early stopping (ML flavour)">
          <p>Train loss still falling at round 800; val loss rose from round 220. What do you ship?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The model from round ~220 (or a bit earlier). Later rounds are fitting noise.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — two boosting rounds on a 1-D line">
        <Example
          title="Squared-error boosting with a 1-split tree"
          output={`F0 (mean)     [3. 3. 3. 3.]
F after 2 rounds, η=0.5: [1.5 2.5 3.5 4.5]
true y:                  [1.  2.  4.  5. ]`}
        >{`import numpy as np

x = np.array([1.0, 2.0, 3.0, 4.0])
y = np.array([1.0, 2.0, 4.0, 5.0])
F = np.full_like(y, y.mean())
eta = 0.5

def stump(x, r):
    # best threshold among midpoints, predict mean residual each side
    best, best_t = np.inf, None
    for t in (1.5, 2.5, 3.5):
        left, right = r[x <= t], r[x > t]
        sse = ((left - left.mean())**2).sum() + ((right - right.mean())**2).sum()
        if sse < best:
            best, best_t = sse, t
    mu_l, mu_r = r[x <= best_t].mean(), r[x > best_t].mean()
    return np.where(x <= best_t, mu_l, mu_r)

print("F0 (mean)    ", F)
for _ in range(2):
    F = F + eta * stump(x, y - F)
print("F after 2 rounds, η=0.5:", np.round(F, 2))
print("true y:                 ", y)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Gradient boosting adds trees sequentially. Each tree fits the negative gradient of the loss w.r.t. current predictions.',
          'For squared error those gradients are ordinary residuals. For log-loss they are y − p. One algorithm, many losses.',
          'Shrink with a small η and stop when validation loss rises. More trees with large η overfit; more trees with tiny η plus early stopping is the standard.',
          'XGBoost / LightGBM / CatBoost are this idea plus Hessians, histograms, and regularisation — not a different theory.',
          'Use boosting when you want tabular accuracy and can tune. Use a forest when you want a robust, parallel default.',
        ]}
      />
    </LessonArticle>
  )
}
