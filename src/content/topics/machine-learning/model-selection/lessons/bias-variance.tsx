import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function BiasVariance() {
  return (
    <LessonArticle>
      <Definition term="Bias–variance decomposition">
        <p>
          For squared error, the expected test loss of a model trained on a random sample splits
          into three pieces:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>E[(y − ŷ)²] = Bias² + Variance + Irreducible noise</div>
          <div className="mt-2">Bias     = E[ŷ] − f(x)     (systematic miss if you retrained forever)</div>
          <div>Variance = E[(ŷ − E[ŷ])²]     (how much ŷ jumps when the training set jumps)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Underfitting is mostly bias: the hypothesis cannot represent f. Overfitting is mostly
          variance: the hypothesis can represent yesterday’s noise. Irreducible noise is the
          leftover even with the true f (labels are noisy, x is incomplete).
        </p>
      </Definition>

      <LessonSection title="Intuition — aim vs shake">
        <p className="text-slate-300">
          A shallow tree always predicts “about the mean of this coarse region” — stable, often
          wrong on the bend (bias). A depth-20 tree on 40 rows hits every training point and
          redraws the boundary if you swap two rows (variance). Regularisation, more data, and
          ensembles are ways to damp the shake without forcing a stupid aim.
        </p>
        <Callout variant="insight" title="How the algorithms you already know sit on the trade-off">
          High bias: linear / logistic with few features, k-NN with huge k, a stump. High
          variance: unregularised high-degree polynomials, 1-NN, a full tree. Forests cut
          variance by averaging. Boosting cuts bias by adding complexity, then needs shrink /
          stop to hold variance down.
        </Callout>
      </LessonSection>

      <LessonSection title="Levers that actually move the two terms">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lever</th>
                <th className="px-4 py-3">Bias</th>
                <th className="px-4 py-3">Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Richer hypothesis (degree, depth, hidden units)', '↓', '↑'],
                ['More regularisation / larger k in k-NN', '↑', '↓'],
                ['More i.i.d. training rows', '≈', '↓'],
                ['Bagging / random forests', '≈', '↓'],
                ['Boosting (until you stop)', '↓', '↑ if you go too far'],
              ].map(([lever, b, v]) => (
                <tr key={lever}>
                  <td className="px-4 py-3 font-semibold text-white">{lever}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                  <td className="px-4 py-3 text-slate-400">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Name the term">
          <p>True f(x) = 2x. You fit ŷ = 0. You retrain on many samples; ŷ is always 0. Bias² vs variance at x = 3, noise-free?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>E[ŷ] = 0, f = 6. Bias² = 36. Variance = 0. A perfectly stable, perfectly wrong model.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Interpolation">
          <p>m = 10, a degree-9 polynomial through every point, labels have noise σ² = 1. What dominates test MSE?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Variance (and some noise). The interpolator wiggles to hit εᵢ. Bias on the training x’s is ~0.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Double the data">
          <p>Same model class. You 4× the i.i.d. sample. Which term drops like 1/m for many estimators?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Variance (think SE = σ/√m for a mean). Bias of an under-specified model barely moves.</div>
            <div>That is why “just get more data” does not fix a line on a U-shaped cloud.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Diagnose from curves">
          <p>Train error 0.02, val error 0.18. Bias or variance?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Variance / overfit. Shrink, prune, add data, or simplify.</div>
            <div>Both errors 0.17 and stuck: bias / underfit. Enrich the hypothesis.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Forest (ML flavour)">
          <p>One depth-20 tree vs 200 bagged depth-20 trees. What happened to bias and variance?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Bias stays similar (each tree is still deep). Variance falls if the trees are not perfectly correlated.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a tiny bias–variance sketch">
        <Example
          title="Constant model vs interpolating 1-NN on y = x + noise"
          output={`constant ŷ=mean   bias²≈0.67  var≈0.04
1-NN              bias²≈0.00  var≈1.05`}
        >{`import numpy as np

rng = np.random.default_rng(0)
x_test = np.array([0.5])
f = x_test  # true mean
preds_const, preds_nn = [], []
for _ in range(80):
    x = rng.uniform(0, 1, size=8)
    y = x + rng.normal(0, 1.0, size=8)
    preds_const.append(y.mean())
    preds_nn.append(y[np.argmin(np.abs(x - x_test))])

def bv(preds):
    preds = np.asarray(preds)
    return (preds.mean() - f[0])**2, preds.var()

b1, v1 = bv(preds_const)
b2, v2 = bv(preds_nn)
print(f"constant ŷ=mean   bias²≈{b1:.2f}  var≈{v1:.2f}")
print(f"1-NN              bias²≈{b2:.2f}  var≈{v2:.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Test MSE ≈ Bias² + Variance + noise. Bias is a systematic miss; variance is sensitivity to which training sample you drew.',
          'Underfit = high bias (both train and val errors high). Overfit = high variance (train low, val high).',
          'Richer models lower bias and raise variance. Regularisation, more data, and bagging lower variance. Boosting lowers bias until you overshoot.',
          'More data will not fix a hypothesis that cannot represent f. A richer hypothesis on tiny m will chase noise.',
          'Read the train vs val gap before you reach for a fancier algorithm — the gap tells you which term to attack.',
        ]}
      />
    </LessonArticle>
  )
}
