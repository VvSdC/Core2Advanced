import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CommonDistributions() {
  return (
    <LessonArticle>
      <Definition term="Distribution family">
        <p>
          Most real-world random variables cluster around a handful of &ldquo;named&rdquo; distributions.
          Recognising which one to use is 80% of applied probability. Below are the seven you will meet
          every week in ML.
        </p>
      </Definition>

      <LessonSection title="Cheat sheet — pick one before you compute anything">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Family</th>
                <th className="px-4 py-3">Models</th>
                <th className="px-4 py-3">Support</th>
                <th className="px-4 py-3">Mean / Variance</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bernoulli(p)',        'A single yes/no trial',                     '{0, 1}',            'p / p(1−p)'],
                ['Binomial(n, p)',      'Number of successes in n i.i.d. Bernoulli', '{0, …, n}',         'np / np(1−p)'],
                ['Poisson(λ)',          'Rare events per interval',                  '{0, 1, 2, …}',      'λ / λ'],
                ['Uniform(a, b)',       'Anything equally likely in [a, b]',         '[a, b]',            '(a+b)/2 / (b−a)²/12'],
                ['Exponential(λ)',      'Waiting time between Poisson events',       '[0, ∞)',            '1/λ / 1/λ²'],
                ['Normal(μ, σ²)',       'Sums / averages of noise (CLT)',            '(−∞, ∞)',           'μ / σ²'],
                ['Categorical(π)',      'One draw over K classes (softmax output)',  '{1, …, K}',         '— / —'],
              ].map(([name, models, support, ms]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-slate-400">{models}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{support}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{ms}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Bernoulli and Binomial — the yes/no family">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Bernoulli:  p(1) = p,   p(0) = 1 − p</div>
          <div>Binomial:   P(X = k) = C(n, k) · pᵏ · (1 − p)ⁿ⁻ᵏ</div>
        </div>
        <p className="mt-3 text-slate-300">
          Binomial = sum of n independent Bernoullis. Any single click/no-click, spam/not-spam, pass/fail
          outcome is Bernoulli; the count of them over a batch is Binomial.
        </p>
      </LessonSection>

      <LessonSection title="Poisson — the rare-event family">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(X = k) = e⁻ᵏ λᵏ / k!         (Poisson with rate λ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Bridge to Binomial: as n → ∞ with np = λ held fixed, Binomial(n, p) → Poisson(λ). Use Poisson when
          n is huge and p is tiny (server requests per second, typos per page, mutations per genome).
        </p>
      </LessonSection>

      <LessonSection title="Uniform and Exponential — flat vs memoryless">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Uniform(a, b):    f(x) = 1 / (b − a)   on [a, b]</div>
          <div>Exponential(λ):   f(x) = λ e⁻ᵏˣ        on [0, ∞)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Exponential has the memoryless property{' '}
          <code className="text-slate-200">P(X &gt; s + t | X &gt; s) = P(X &gt; t)</code> — the only continuous
          distribution that does. Waiting-time modelling in queueing and reliability engineering hinges on
          this.
        </p>
      </LessonSection>

      <LessonSection title="Normal (Gaussian) — the CLT magnet">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>f(x) = (1 / √(2π σ²)) · exp(−(x − μ)² / (2 σ²))</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>68% within μ ± σ, 95% within μ ± 2σ, 99.7% within μ ± 3σ.</li>
          <li>Standardising with z = (x − μ) / σ gives z ~ Normal(0, 1).</li>
          <li>Sum of independent normals is normal — a rare closure property.</li>
          <li>By the CLT (next lesson), averages of anything with finite variance drift toward this shape.</li>
        </ul>
        <Callout variant="insight" title="ML link">
          Weight initialisation (Xavier/He), noise in diffusion models, natural-language likelihoods in
          regression, Bayesian priors, dropout — everywhere.
        </Callout>
      </LessonSection>

      <LessonSection title="Categorical — softmax outputs">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(X = k) = π_k     with  Σ π_k = 1,  π_k ≥ 0</div>
        </div>
        <p className="mt-3 text-slate-300">
          Every classifier ends in a categorical distribution over K classes. Training with cross-entropy is
          fitting a parameterised categorical to observed labels via MLE.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Binomial coin flips">
          <p>Flip a fair coin 10 times. What is P(exactly 6 heads)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(X = 6) = C(10, 6) · 0.5⁶ · 0.5⁴ = 210 · (1/1024)  ≈ 0.2051.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Poisson approximation">
          <p>
            A server averages 5 requests/sec. What is the probability of receiving exactly 3 in the next
            second? Also compute P(0).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(X = 3) = e⁻⁵ · 5³ / 3!  = e⁻⁵ · 125 / 6 ≈ 0.1404.</div>
            <div>P(X = 0) = e⁻⁵           ≈ 0.0067.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Exponential waiting time">
          <p>
            Bus arrivals follow Poisson(4/hr), so gap between buses ~ Exponential(4/hr). What is the
            probability you wait more than 30 minutes?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(X &gt; 0.5 hr) = e⁻⁽⁴·⁰·⁵⁾ = e⁻² ≈ 0.1353.</div>
            <div className="mt-1">Memoryless: after waiting 20 min, additional 30-min wait still has probability e⁻² ≈ 0.1353.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Normal 68-95-99.7">
          <p>Test scores ~ Normal(70, σ = 10). What fraction of students score between 60 and 90?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>60 = μ − 1σ,   90 = μ + 2σ.</div>
            <div>P = Φ(2) − Φ(−1) ≈ 0.9772 − 0.1587 = 0.8185.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Poisson approximates Binomial (ML flavour)">
          <p>
            A model predicts 1000 samples/day. If each has a 0.3% chance of being an adversarial input,
            approximate P(≥ 5 attacks in a day).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>n = 1000,  p = 0.003 → np = 3, use Poisson(3).</div>
            <div>P(X ≥ 5) = 1 − Σ_{`{k=0..4}`} e⁻³ 3ᵏ / k!  ≈ 1 − 0.8153 ≈ 0.1847.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Categorical MLE (ML flavour)">
          <p>
            You observe token counts across a corpus: {`{cat: 40, dog: 10, sat: 25, ran: 25}`}. Fit a
            categorical distribution by maximum likelihood.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>MLE is the empirical frequency:</div>
            <div>π = (40/100, 10/100, 25/100, 25/100) = (0.40, 0.10, 0.25, 0.25).</div>
            <div className="mt-2 text-slate-400">
              Add-one (Laplace) smoothing avoids zeros for unseen tokens — the first line of every
              probabilistic language model.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — SciPy has every family">
        <Example
          title="Six computations, one library"
          output={`P(X = 6 | Bin(10, 0.5))     = 0.2051
P(X = 3 | Poisson(5))       = 0.1404
P(bus wait > 30m)           = 0.1353
Normal(60 ≤ X ≤ 90)         = 0.8186
P(≥ 5 attacks | Poisson(3)) = 0.1847
MLE categorical            = [0.4  0.1  0.25 0.25]`}
        >{`import numpy as np
from scipy import stats

# Binomial
print(f"P(X = 6 | Bin(10, 0.5))     = {stats.binom.pmf(6, 10, 0.5):.4f}")

# Poisson
print(f"P(X = 3 | Poisson(5))       = {stats.poisson.pmf(3, 5):.4f}")

# Exponential (rate 4 → scale = 1/4)
print(f"P(bus wait > 30m)           = {1 - stats.expon.cdf(0.5, scale=1/4):.4f}")

# Normal
print(f"Normal(60 ≤ X ≤ 90)         = "
      f"{stats.norm.cdf(90, 70, 10) - stats.norm.cdf(60, 70, 10):.4f}")

# Poisson tail
print(f"P(≥ 5 attacks | Poisson(3)) = {1 - stats.poisson.cdf(4, 3):.4f}")

# Categorical MLE
counts = np.array([40, 10, 25, 25])
pi     = counts / counts.sum()
print(f"MLE categorical            = {pi}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Bernoulli/Binomial handles yes-no counts; Poisson counts rare events; Exponential is the memoryless waiting time between Poisson events.',
          'Normal is the CLT magnet: 68/95/99.7 for ±1σ / ±2σ / ±3σ. Any sum or average of finite-variance variables tends to it.',
          'Categorical is what every softmax classifier outputs. MLE for it is just empirical frequency — a Laplace prior gives smoothing.',
          'Binomial → Poisson when n → ∞, p → 0, np = λ (rare events at scale).',
          'Recognising the right family before writing math cuts problem-solving time in half — the mean, variance, and PMF/PDF then come for free from SciPy.',
        ]}
      />
    </LessonArticle>
  )
}
