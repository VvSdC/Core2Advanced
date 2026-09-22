import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LlnAndClt() {
  return (
    <LessonArticle>
      <Definition term="Law of Large Numbers (LLN)">
        <p>
          If X₁, X₂, … are i.i.d. with mean μ, the sample mean{' '}
          <code className="text-slate-200">X̄_n = (X₁ + … + Xₙ) / n</code> converges to μ as n → ∞.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Weak LLN:    X̄_n → μ    in probability</div>
          <div>Strong LLN:  X̄_n → μ    almost surely</div>
        </div>
        <p className="mt-3 text-slate-300">
          Intuition: averaging cancels noise. Enough samples and the sample mean lands on the true mean.
          This is the only reason Monte Carlo simulation works — and the only reason a test set is
          informative.
        </p>
      </Definition>

      <LessonSection title="Why LLN is not enough — we need the shape">
        <p className="text-slate-300">
          LLN says the average converges — but tells you nothing about <em>how fast</em> or <em>with what
          spread</em>. For confidence intervals, hypothesis tests, and error bars you need the distribution
          of X̄_n. That is what the CLT gives you.
        </p>
      </LessonSection>

      <LessonSection title="Central Limit Theorem — the reason Normal is everywhere">
        <Definition term="Central Limit Theorem">
          <p>
            Let X₁, …, Xₙ be i.i.d. with finite mean μ and finite variance σ². As n → ∞:
          </p>
          <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>√n · (X̄_n − μ) / σ    →    Normal(0, 1)</div>
            <div className="mt-2">Equivalently: X̄_n ≈ Normal(μ, σ² / n)   for large n.</div>
          </div>
        </Definition>
        <p className="mt-3 text-slate-300">
          Regardless of what shape the individual Xᵢ have (uniform, exponential, bimodal, whatever — as
          long as variance is finite), their <em>average</em> looks Gaussian for large n.
        </p>
        <Callout variant="insight" title="Rule of thumb">
          n ≥ 30 is often &ldquo;normal enough&rdquo; for symmetric distributions. Heavy-tailed or skewed
          Xᵢ can need n = 100–1000. Distributions without finite variance (Cauchy) never satisfy the CLT.
        </Callout>
      </LessonSection>

      <LessonSection title="Standard error — the practical output of CLT">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>SE(X̄_n) = σ / √n</div>
        </div>
        <p className="mt-3 text-slate-300">
          The wobble of your estimate falls as 1/√n. That is why doubling n only shrinks error by √2, and
          why halving the error costs 4× the data. It is the same 1/√B scaling as mini-batch gradients.
        </p>
      </LessonSection>

      <LessonSection title="Confidence interval (preview)">
        <p className="text-slate-300">
          Combine CLT + standard error to get a 95% CI on the true mean:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>X̄_n ± 1.96 · σ / √n         (σ known)</div>
          <div>X̄_n ± t_{`{α/2, n−1}`} · s / √n    (σ unknown, s = sample SD → t-distribution)</div>
        </div>
        <p className="mt-3 text-slate-300">
          We come back to this in the &ldquo;Hypothesis testing &amp; confidence intervals&rdquo; lesson —
          it is the exact same normal tail used in A/B testing p-values.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Dice mean converges">
          <p>Roll a fair die n times. Give the mean and SE of X̄_n for n = 100 and n = 10 000.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>μ = 3.5,   σ² = 35/12 ≈ 2.917,   σ ≈ 1.708.</div>
            <div>SE(100)   = 1.708 / 10   ≈ 0.1708</div>
            <div>SE(10000) = 1.708 / 100  ≈ 0.0171</div>
            <div className="mt-2 text-slate-400">Ten thousand rolls squeezes the sample mean to about ±0.05 with 95% confidence.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Poll accuracy">
          <p>
            You survey 1000 people about a yes/no policy. If the true &ldquo;yes&rdquo; rate is p = 0.55, what
            is the margin of error (95%) on your sample mean?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>σ² = p(1 − p) = 0.2475,   σ = 0.4975.</div>
            <div>SE = 0.4975 / √1000 ≈ 0.01573.</div>
            <div>95% ME = 1.96 · SE ≈ ±3.1%.</div>
            <div className="mt-2 text-genai-400">Every newspaper poll has this exact structure.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — CLT from a non-normal population">
          <p>
            Wait times ~ Exponential(rate = 1) so μ = 1, σ = 1. Take n = 400 samples. What is P(X̄_n &gt; 1.05)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>By CLT: X̄_n ≈ Normal(1, 1/400).  SE = 1/20 = 0.05.</div>
            <div>z = (1.05 − 1) / 0.05 = 1.</div>
            <div>P(X̄ &gt; 1.05) = 1 − Φ(1) ≈ 0.1587.</div>
            <div className="mt-2 text-slate-400">
              Even though Exponential is heavy-skewed, the mean of 400 samples is very close to normal.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Sample size for target error">
          <p>
            You need a 95% CI for a mean with margin ±0.5, and you know σ = 5. How many samples?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>1.96 · 5 / √n ≤ 0.5   →   √n ≥ 19.6   →   n ≥ 384.16.</div>
            <div>n = 385 samples.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — A/B test accuracy (ML flavour)">
          <p>
            Your model&rsquo;s baseline accuracy is 80% on n_test = 2000 held-out examples. What is a
            reasonable 95% CI?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each example is Bernoulli(p ≈ 0.8).  σ² = 0.16,   σ = 0.4.</div>
            <div>SE = 0.4 / √2000 ≈ 0.00894.</div>
            <div>95% CI ≈ 0.80 ± 1.96 · 0.00894 = [0.7825, 0.8175].</div>
            <div className="mt-2 text-genai-400">
              A candidate model at 81% is not clearly better — it is inside the CI. This is why single-run
              accuracy comparisons deceive you.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — When CLT breaks (ML flavour)">
          <p>Two settings where CLT does NOT apply. Recognise them.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>1. Cauchy-distributed noise → variance is infinite, CLT does not apply.</div>
            <div>2. Time-series data with strong autocorrelation → samples are NOT independent.</div>
            <div className="mt-2 text-slate-400">
              In (2) the &ldquo;effective&rdquo; sample size is much smaller than n, so quoted standard
              errors are too small. Fix: block bootstrap or Newey–West corrections.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — watch LLN and CLT in action">
        <Example
          title="Simulation makes both theorems visible"
          output={`LLN — sample mean of fair die
   n=10       mean = 3.500
   n=100      mean = 3.500
   n=1000     mean = 3.481
   n=100000   mean = 3.499
CLT — mean of 30 Uniform(0, 1) samples over 10000 experiments
   empirical mean of X̄ = 0.4996  ≈ μ = 0.5
   empirical  SD  of X̄ = 0.0527  ≈ σ/√n = 0.0527
95% CI for model accuracy: [0.7825, 0.8175]
Required n for margin 0.5 with σ=5: 385`}
        >{`import numpy as np

rng = np.random.default_rng(0)

# ---- LLN: sample mean of a fair die stabilises to 3.5 ----
print("LLN — sample mean of fair die")
for n in [10, 100, 1000, 100_000]:
    print(f"   n={n:<9} mean = {rng.integers(1, 7, n).mean():.3f}")

# ---- CLT: distribution of X̄ from 30 Uniform(0,1) draws ----
n, R = 30, 10_000
X_bars = rng.uniform(0, 1, size=(R, n)).mean(axis=1)
theory_se = (1 / 12) ** 0.5 / n ** 0.5
print(f"CLT — mean of {n} Uniform(0, 1) samples over {R} experiments")
print(f"   empirical mean of X̄ = {X_bars.mean():.4f}  ≈ μ = 0.5")
print(f"   empirical  SD  of X̄ = {X_bars.std():.4f}  ≈ σ/√n = {theory_se:.4f}")

# ---- Accuracy CI ----
p, n = 0.80, 2000
se = (p * (1 - p) / n) ** 0.5
lo, hi = p - 1.96 * se, p + 1.96 * se
print(f"95% CI for model accuracy: [{lo:.4f}, {hi:.4f}]")

# ---- Required sample size ----
sigma, margin = 5, 0.5
n_req = (1.96 * sigma / margin) ** 2
print(f"Required n for margin {margin} with σ={sigma}: {int(np.ceil(n_req))}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLN: sample mean X̄_n converges to the true mean μ as n → ∞. This is why Monte Carlo, mini-batch training, and holdout evaluation all work.',
          'CLT: for large n, X̄_n is approximately Normal(μ, σ²/n) — regardless of the underlying distribution (provided variance is finite).',
          'Standard error = σ/√n. Halving the error costs 4× the data — the same square-root scaling as batch-size noise.',
          'Rule of thumb: n ≥ 30 is often enough for CLT to bite on symmetric distributions; skew and heavy tails need more.',
          'CLT fails when variance is infinite (Cauchy) or when observations are not independent (autocorrelated time series). Use block bootstrap or robust estimators there.',
          'Every confidence interval, every A/B-test p-value, every "model A is better than model B" claim you will ever quote leans on the CLT.',
        ]}
      />
    </LessonArticle>
  )
}
