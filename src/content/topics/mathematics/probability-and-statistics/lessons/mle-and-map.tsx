import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MleAndMap() {
  return (
    <LessonArticle>
      <Definition term="Parameter estimation">
        <p>
          You have data <code className="text-slate-200">D = {'{x₁, …, xₙ}'}</code> and a model{' '}
          <code className="text-slate-200">p(x | θ)</code> with unknown parameter θ. Two schools of thought
          on picking θ:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">MLE</strong> — pick θ that makes the observed data most likely.</li>
          <li><strong className="text-white">MAP</strong> — pick θ that is most likely given the data (combines a prior belief with the data).</li>
        </ul>
      </Definition>

      <LessonSection title="Maximum Likelihood Estimation — pure data-driven">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Likelihood:     L(θ) = ∏ᵢ p(xᵢ | θ)</div>
          <div>Log-likelihood: ℓ(θ) = Σᵢ log p(xᵢ | θ)</div>
          <div className="mt-2">θ̂_MLE = argmax_θ  ℓ(θ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Working in log-space converts a product of tiny probabilities into a sum — avoiding numerical
          underflow and turning most maximisations into clean algebra.
        </p>
        <Callout variant="insight" title="Every ML loss is a negative log-likelihood in disguise">
          MSE = NLL under Gaussian noise. Cross-entropy = NLL under categorical output. Poisson loss = NLL
          for count regression. Minimising loss ↔ maximising likelihood.
        </Callout>
      </LessonSection>

      <LessonSection title="MLE recipe — four steps">
        <ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-300">
          <li>Write the likelihood L(θ) = ∏ p(xᵢ | θ).</li>
          <li>Take the log to get ℓ(θ).</li>
          <li>Differentiate: dℓ/dθ = 0. (Or ∇_θ ℓ = 0 for multi-parameter.)</li>
          <li>Solve — and verify with the second-derivative test that it is a maximum.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Maximum a Posteriori — MLE + a prior">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Bayes:   p(θ | D) ∝ p(D | θ) · p(θ)</div>
          <div className="mt-2">θ̂_MAP = argmax_θ  [ℓ(θ) + log p(θ)]</div>
        </div>
        <p className="mt-3 text-slate-300">
          The prior <code className="text-slate-200">p(θ)</code> is an extra term you add to the objective —
          it acts exactly like <strong className="text-white">regularisation</strong>.
        </p>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Prior on θ</th>
                <th className="px-4 py-3">Extra term in objective</th>
                <th className="px-4 py-3">ML name</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Normal(0, σ²)',   '−‖θ‖² / (2σ²)',                'L2 regularisation (Ridge)'],
                ['Laplace(0, b)',   '−‖θ‖₁ / b',                     'L1 regularisation (Lasso)'],
                ['Beta(α, β)',      'Add α − 1 heads, β − 1 tails',  'Additive / Laplace smoothing'],
                ['Dirichlet(α)',    'Add α_k − 1 to each class count','Add-one smoothing (α = 2)'],
              ].map(([prior, term, name]) => (
                <tr key={prior}>
                  <td className="px-4 py-3 font-semibold text-white">{prior}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{term}</td>
                  <td className="px-4 py-3 text-slate-400">{name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Same equation, two names">
          Ridge regression, Bayesian linear regression with a Gaussian prior, and MAP estimation on Normal
          data are literally the same optimisation.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — MLE for a coin">
          <p>You observe 7 heads in 10 flips. What is the MLE of p?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>L(p) = p⁷ (1 − p)³.</div>
            <div>ℓ(p) = 7 log p + 3 log(1 − p).</div>
            <div>dℓ/dp = 7/p − 3/(1 − p) = 0  →  7(1 − p) = 3p  →  p̂ = 7/10 = 0.7.</div>
            <div className="mt-2 text-slate-400">MLE = empirical frequency — the standard result for Bernoulli.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — MAP for a coin with a Beta prior">
          <p>
            Same data (7 heads in 10). Prior: Beta(α = 2, β = 2) — a mild belief the coin is fair.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Beta prior adds (α − 1, β − 1) &ldquo;pseudo-counts&rdquo;.</div>
            <div>p̂_MAP = (7 + α − 1) / (10 + α + β − 2)</div>
            <div>       = (7 + 1) / (10 + 2) = 8/12 ≈ 0.667.</div>
            <div className="mt-2 text-genai-400">The prior pulls the estimate toward 0.5 — light smoothing.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — MLE for a Gaussian">
          <p>Given x₁, …, xₙ ~ Normal(μ, σ²), derive the MLE of μ and σ².</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ℓ(μ, σ²) = − (n/2) log(2π σ²) − (1 / (2σ²)) Σ (xᵢ − μ)².</div>
            <div className="mt-2">∂ℓ/∂μ  = (1/σ²) Σ (xᵢ − μ) = 0  →  μ̂ = x̄.</div>
            <div>∂ℓ/∂σ² = −n / (2σ²) + Σ(xᵢ − μ)² / (2σ⁴) = 0  →  σ̂² = (1/n) Σ (xᵢ − x̄)².</div>
            <div className="mt-2 text-slate-400">MLE of variance is biased low (divides by n, not n − 1).</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Linear regression as MLE (ML flavour)">
          <p>Assume y_i = xᵢᵀβ + ε with ε ~ Normal(0, σ²). Show MLE(β) = OLS.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ℓ(β) = C − (1 / (2σ²)) Σ (yᵢ − xᵢᵀβ)².</div>
            <div>argmax ℓ = argmin Σ (yᵢ − xᵢᵀβ)² = OLS.</div>
            <div className="mt-2 text-genai-400">MLE recovers least-squares.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Ridge = MAP with Gaussian prior (ML flavour)">
          <p>
            Add a prior β ~ Normal(0, τ² I). Show the MAP estimate is Ridge regression.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>log p(β) = C − ‖β‖² / (2τ²).</div>
            <div>−log posterior ∝ (1/(2σ²)) ‖y − Xβ‖² + (1/(2τ²)) ‖β‖².</div>
            <div>Let λ = σ² / τ². Objective: ‖y − Xβ‖² + λ ‖β‖².</div>
            <div className="mt-2 text-genai-400">
              Exactly Ridge regression. Tight prior (small τ²) ↔ big λ ↔ heavy regularisation.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Logistic regression cross-entropy (ML flavour)">
          <p>
            Show that training logistic regression by cross-entropy is MLE of a Bernoulli model.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Model: p(y = 1 | x) = σ(xᵀβ),  p(y = 0 | x) = 1 − σ(xᵀβ).</div>
            <div className="mt-2">ℓ(β) = Σᵢ [ yᵢ log σ(xᵢᵀβ) + (1 − yᵢ) log(1 − σ(xᵢᵀβ)) ].</div>
            <div className="mt-2">Negative of ℓ is exactly binary cross-entropy.</div>
            <div className="mt-2 text-slate-400">
              Multiclass softmax + cross-entropy generalises this to categorical output.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — MLE and MAP side-by-side">
        <Example
          title="Coin flips: MLE vs three priors"
          output={`MLE p̂            = 0.7000
MAP p̂ Beta(2, 2) = 0.6667
MAP p̂ Beta(5, 5) = 0.6154
MAP p̂ Beta(50, 50) = 0.5250
Gaussian MLE : μ̂ = 5.0333  σ̂² = 4.0311  (bias / n)
Sample var  : s²                       = 4.4790  (unbiased / n-1)`}
        >{`import numpy as np

# Coin flips
heads, tosses = 7, 10
mle = heads / tosses
print(f"MLE p̂            = {mle:.4f}")

for a, b in [(2, 2), (5, 5), (50, 50)]:
    map_ = (heads + a - 1) / (tosses + a + b - 2)
    print(f"MAP p̂ Beta({a}, {b}) = {map_:.4f}")

# Gaussian MLE vs unbiased sample variance
rng = np.random.default_rng(0)
x   = rng.normal(loc=5, scale=2, size=30)
mu_hat  = x.mean()
sig2_ml = ((x - mu_hat) ** 2).mean()          # / n
sig2_u  = ((x - mu_hat) ** 2).sum() / (len(x) - 1)  # / (n-1)
print(f"Gaussian MLE : μ̂ = {mu_hat:.4f}  σ̂² = {sig2_ml:.4f}  (bias / n)")
print(f"Sample var  : s²                       = {sig2_u:.4f}  (unbiased / n-1)")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MLE picks θ that maximises the (log) likelihood of the observed data. Work in log-space to avoid underflow and get clean algebra.',
          'Every ML loss is a negative log-likelihood: MSE ↔ Gaussian, cross-entropy ↔ categorical, Poisson loss ↔ count regression.',
          'MAP = MLE + log-prior. The prior is exactly what regularisation encodes: Gaussian prior → L2 (Ridge), Laplace prior → L1 (Lasso).',
          'MLE of a Bernoulli is empirical frequency; MLE of Gaussian mean is the sample mean; MLE of variance is biased (divides by n, not n-1).',
          'OLS = MLE for Gaussian noise linear model. Ridge = MAP with Gaussian prior on weights. Logistic regression = MLE of a Bernoulli with sigmoid link.',
          'A Beta(2, 2) prior on a coin flip acts as add-one smoothing — the same trick used in every probabilistic language model to avoid zero probabilities.',
        ]}
      />
    </LessonArticle>
  )
}
