import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HyperparametersAndLearningCurves() {
  return (
    <LessonArticle>
      <Definition term="Hyperparameters vs parameters">
        <p>
          Parameters (θ, tree thresholds, centroids) are learned from data by the training
          algorithm. <strong className="text-white">Hyperparameters</strong> are the knobs you
          set before that: λ, k, depth, η, C, min_samples. They pick which hypothesis class
          you will train.
        </p>
      </Definition>

      <LessonSection title="Search — grid, random, smarter">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Idea</th>
                <th className="px-4 py-3">Use when</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Grid search', 'Every combo of listed values', '2–3 knobs, cheap model'],
                ['Random search', 'Sample each knob from a range', 'Many knobs; some do not matter — Bergstra & Bengio'],
                ['Log-scale ranges', 'λ, C, η, γ on log10 grids', 'Almost always for positive scale knobs'],
                ['Bayesian / bandit / Hyperband', 'Spend more budget on promising configs', 'Expensive trainers (boosting, nets)'],
              ].map(([m, idea, w]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{idea}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Why random beats a fat grid">
          If only 2 of 8 hyperparameters actually move the loss, a grid wastes trials on the
          useless 6. Random search explores the two that matter more often, for the same budget.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning curves — more data or a better model?">
        <p className="text-slate-300">
          Plot train and val error against training-set size (or against boosting rounds /
          epochs). The shape tells you which lever to pull:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Both high, gap small</strong> — underfit. Richer
            model, fewer penalties, better features. More data of the same kind will not save you.
          </li>
          <li>
            <strong className="text-white">Train low, val high, gap shrinking with m</strong> —
            overfit that more data will heal. Go get rows, or regularise if you cannot.
          </li>
          <li>
            <strong className="text-white">Val flat while you add data</strong> — you have hit
            the model’s ceiling (or a label-noise floor).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Validation curves — sweep one knob">
        <p className="text-slate-300">
          Fix everything else, vary λ (or depth). Train error rises with λ; val error is U-shaped.
          The bottom of the U is the value you want. That is a 1-D slice of the search; still
          confirm it with CV, not a single split, when m is modest.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Grid size">
          <p>3 values of depth × 4 of min_leaf × 5 of max_features × 5-fold. How many fits?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>3 · 4 · 5 · 5 = 300 training runs. A random search of 40 draws may be enough.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Log scale">
          <p>You grid C ∈ {'{1, 2, 3, 4, 5}'}. Why is this a weak SVM search?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>C is a scale knob. Try 1e-3 … 1e3 on a log10 grid. Linear steps around 1 miss the interesting decades.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Read the learning curve">
          <p>Train error 0.04 at all sizes; val error 0.20 at 1k rows, 0.07 at 20k, still falling. Next move?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Collect more data (or regularise a bit). The gap is variance and m is still helping.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — The other curve">
          <p>Train 0.22, val 0.23 at 1k and at 50k. Next move?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Bias. New rows will not help. Features, a richer model, or a different family.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Early stopping as a hyperparameter">
          <p>You pick the boosting round that minimised the same val set you will report. Problem?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The reported val number is optimistically biased (you peeked). Use a third split, or nested / a final test set.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a 1-D validation curve for Ridge">
        <Example
          title="λ too small overfits, λ too large underfits"
          output={`λ=0.01  train 0.18  val 1.94
λ=1     train 0.41  val 0.72
λ=100   train 2.10  val 2.05`}
        >{`import numpy as np

rng = np.random.default_rng(0)
x = rng.normal(size=24)
y = 0.8 * x + rng.normal(scale=0.6, size=24)
tr, va = np.arange(16), np.arange(16, 24)
Xtr = np.c_[np.ones(16), x[tr]]
Xva = np.c_[np.ones(8), x[va]]

def mse(lmbda):
    I = np.eye(2); I[0, 0] = 0  # do not penalise intercept
    th = np.linalg.solve(Xtr.T @ Xtr + lmbda * I, Xtr.T @ y[tr])
    return np.mean((Xtr @ th - y[tr])**2), np.mean((Xva @ th - y[va])**2)

for lmbda in (0.01, 1.0, 100.0):
    trn, val = mse(lmbda)
    print(f"λ={lmbda:<5} train {trn:.2f}  val {val:.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hyperparameters choose the hypothesis class; parameters are fit inside that class. Tune the first with CV, never on the test set.',
          'Grid search explodes. Random search on log-scale ranges is the default for more than a couple of knobs. Bayesian methods earn their keep when each fit is expensive.',
          'Learning curves (error vs m) tell you whether to gather data or change the model. A small gap at high error is bias; a shrinking gap is variance that more rows will fix.',
          'Validation curves (error vs one knob) are a 1-D slice: train error monotone, val error U-shaped. Pick the bottom with CV.',
          'Early stopping is a hyperparameter. The set you used to stop is no longer an unbiased report — keep a final test set.',
        ]}
      />
    </LessonArticle>
  )
}
