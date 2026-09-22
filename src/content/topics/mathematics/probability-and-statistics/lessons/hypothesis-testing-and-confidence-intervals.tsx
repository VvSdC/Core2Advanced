import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HypothesisTestingAndConfidenceIntervals() {
  return (
    <LessonArticle>
      <Definition term="Hypothesis testing">
        <p>
          A framework for deciding whether observed data is consistent with a &ldquo;boring&rdquo; default
          assumption (the null H₀) or provides evidence for a competing claim (H₁).
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>H₀ (null):       usually &ldquo;no effect / no difference / p = p₀&rdquo;</div>
          <div>H₁ (alternative): the interesting claim (μ ≠ 0, p &gt; 0.5, model B beats model A, …)</div>
        </div>
      </Definition>

      <LessonSection title="The five-step recipe">
        <ol className="mt-1 list-decimal space-y-2 pl-5 text-slate-300">
          <li>State H₀ and H₁ (two-sided or one-sided).</li>
          <li>Pick a significance level α (usually 0.05).</li>
          <li>Compute a <strong className="text-white">test statistic</strong> assuming H₀ is true.</li>
          <li>Get the <strong className="text-white">p-value</strong> — probability of seeing a statistic at least as extreme, under H₀.</li>
          <li>If p &lt; α, <strong className="text-white">reject H₀</strong>; otherwise fail to reject. (We never &ldquo;accept H₀&rdquo;.)</li>
        </ol>
      </LessonSection>

      <LessonSection title="Two mistakes you can make">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Truth →</th>
                <th className="px-4 py-3">H₀ true</th>
                <th className="px-4 py-3">H₀ false</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Reject H₀</td>
                <td className="px-4 py-3 font-mono text-red-400">Type I error (rate = α)</td>
                <td className="px-4 py-3 text-slate-400">Correct → power = 1 − β</td>
              </tr>
              <tr>
                <td className="px-4 py-3 font-semibold text-white">Do not reject</td>
                <td className="px-4 py-3 text-slate-400">Correct → 1 − α</td>
                <td className="px-4 py-3 font-mono text-red-400">Type II error (rate = β)</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Trade-off">
          Lowering α to guard against false positives inflates β (misses true effects). Fixing both
          requires bigger n — this is what &ldquo;power analysis&rdquo; before an experiment is about.
        </Callout>
      </LessonSection>

      <LessonSection title="Which test do I use? A short guide">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Question</th>
                <th className="px-4 py-3">Test</th>
                <th className="px-4 py-3">Test statistic under H₀</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Is a mean equal to μ₀? (σ known)',            'z-test',                 'z = (X̄ − μ₀) / (σ / √n) ~ N(0, 1)'],
                ['Is a mean equal to μ₀? (σ unknown)',          'one-sample t-test',      't = (X̄ − μ₀) / (s / √n) ~ t_{n−1}'],
                ['Do two group means differ?',                  'two-sample t-test',      't = (X̄₁ − X̄₂) / SE'],
                ['Is a proportion equal to p₀?',                'one-proportion z-test',  'z = (p̂ − p₀) / √(p₀(1−p₀)/n)'],
                ['Two proportions equal? (A/B test)',           'two-proportion z-test',  'z = (p̂₁ − p̂₂) / SE_pooled'],
                ['Are categorical distributions independent?',  'χ² test',                'χ² = Σ (Oᵢ − Eᵢ)² / Eᵢ ~ χ²_df'],
                ['Do ≥3 group means differ?',                   'ANOVA (F-test)',         'F = MS_between / MS_within'],
              ].map(([q, t, s]) => (
                <tr key={q}>
                  <td className="px-4 py-3 font-semibold text-white">{q}</td>
                  <td className="px-4 py-3 text-slate-400">{t}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{s}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Confidence intervals — the twin of p-values">
        <p className="text-slate-300">
          A 95% CI is a range that would contain the true parameter in 95% of experiments if you repeated
          them. Building a CI and running a two-sided test are the same operation viewed from different
          angles:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>95% CI = estimate ± 1.96 · SE           (large-n, Gaussian pivot)</div>
          <div className="mt-2">Reject H₀: μ = μ₀ at α = 0.05  ⇔  μ₀ ∉ 95% CI</div>
        </div>
        <Callout variant="tip" title="Report a CI, not just a p-value">
          A CI tells you both direction AND size of the effect. A p-value only tells you whether the effect
          is bigger than noise — not whether it matters practically.
        </Callout>
      </LessonSection>

      <LessonSection title="Multiple testing — the silent killer">
        <p className="text-slate-300">
          Run 20 independent tests at α = 0.05 with all H₀ true and you expect 1 false positive by chance.
          Fixes:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Bonferroni</strong>: use α / m for m tests (very conservative).</li>
          <li><strong className="text-white">Benjamini–Hochberg</strong>: controls FDR — the expected fraction of false discoveries.</li>
          <li><strong className="text-white">Hold-out set</strong>: choose the best model on the val set, but report on a fresh test set.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — One-sample z-test">
          <p>
            n = 25, X̄ = 51, σ = 4 (known). Test H₀: μ = 50 vs H₁: μ ≠ 50 at α = 0.05.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>SE = 4 / √25 = 0.8.</div>
            <div>z = (51 − 50) / 0.8 = 1.25.</div>
            <div>Two-sided p = 2 · (1 − Φ(1.25)) ≈ 2 · 0.1056 = 0.2113.</div>
            <div className="mt-2 text-slate-400">p &gt; 0.05 → fail to reject. 95% CI = 51 ± 1.96 · 0.8 = [49.43, 52.57], contains 50.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Two-proportion A/B test (ML flavour)">
          <p>
            Model A: 480 conversions from 6000 users. Model B: 540 from 6000. Is B genuinely better at α = 0.05?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>p̂_A = 0.0800,  p̂_B = 0.0900.</div>
            <div>p̂_pool = (480 + 540) / 12 000 = 0.0850.</div>
            <div>SE = √(0.0850 · 0.9150 · (1/6000 + 1/6000)) ≈ √(2.593 × 10⁻⁵) ≈ 0.005092.</div>
            <div>z  = (0.0900 − 0.0800) / 0.005092 ≈ 1.964.</div>
            <div>Two-sided p ≈ 0.0496.</div>
            <div className="mt-2 text-genai-400">Just barely significant at α = 0.05. Report the CI too.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Confidence interval for a mean">
          <p>Sample: X̄ = 12, s = 3, n = 16. Give the 95% t-CI.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>SE = 3 / √16 = 0.75.  df = 15.  t₀.₀₂₅, ₁₅ ≈ 2.131.</div>
            <div>CI = 12 ± 2.131 · 0.75 = 12 ± 1.60 → [10.40, 13.60].</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Chi-squared independence">
          <p>
            2 × 2 table: (spam, contains &ldquo;free&rdquo;) vs (ham, contains &ldquo;free&rdquo;). Observed:
            (Spam-Free 140, Spam-NoFree 60), (Ham-Free 60, Ham-NoFree 340). Are the two features independent?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Row totals: 200, 400.   Col totals: 200, 400.  Grand: 600.</div>
            <div>E: Spam-Free = 200·200/600 = 66.67,   Spam-NoFree = 200·400/600 = 133.33</div>
            <div>   Ham-Free  = 400·200/600 = 133.33,  Ham-NoFree  = 400·400/600 = 266.67</div>
            <div className="mt-2">χ² = Σ (O − E)² / E</div>
            <div>   = (140−66.67)² / 66.67 + (60−133.33)² / 133.33 + (60−133.33)² / 133.33 + (340−266.67)² / 266.67</div>
            <div>   ≈ 80.66 + 40.33 + 40.33 + 20.17 = 181.5   (df = 1)</div>
            <div className="mt-2 text-genai-400">Massive χ² → strongly reject independence — &ldquo;free&rdquo; is a very informative feature.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Power / sample size (ML flavour)">
          <p>
            You want to detect a lift from p₀ = 0.05 to p₁ = 0.06 with 80% power at α = 0.05 (one-sided).
            Approximate n per arm.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>n ≈ ( z_α √(2 p̄ q̄) + z_β √(p₀ q₀ + p₁ q₁) )² / (p₁ − p₀)²</div>
            <div>   p̄ = 0.055, q̄ = 0.945, z_α = 1.645, z_β = 0.842</div>
            <div className="mt-1">   ≈ ( 1.645·√(0.1039) + 0.842·√(0.0475 + 0.0564) )² / 0.0001</div>
            <div>   ≈ ( 1.645·0.3223 + 0.842·0.3223 )² / 0.0001</div>
            <div>   ≈ (0.8022)² / 0.0001 ≈ 6435 per arm.</div>
            <div className="mt-2 text-genai-400">Small effects need big samples. Web-scale A/B tests routinely need millions of users.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Multiple testing (ML flavour)">
          <p>
            You compare 20 hyper-parameter configurations to a baseline. At α = 0.05 uncorrected, you find
            two with p ≈ 0.03 and 0.01. Are those meaningful?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Bonferroni threshold = 0.05 / 20 = 0.0025.</div>
            <div>Neither p-value survives → both should be treated as chance.</div>
            <div className="mt-2 text-slate-400">
              Always split your validation into &ldquo;dev&rdquo; (for search) and &ldquo;test&rdquo; (for the
              final claim), or use FDR control on all p-values.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — SciPy runs all of these in one line">
        <Example
          title="Reproducing the worked problems"
          output={`One-sample z-test:  z = 1.2500  p = 0.2113
Two-proportion A/B: z = 1.9636  p = 0.0496
95% t-CI for mean:  [10.401, 13.599]
Chi-squared:        χ² = 181.50  p = 2.33e-41  df = 1
Bonferroni α*      = 0.0025 (m = 20 tests)`}
        >{`from math import sqrt
from scipy import stats

# ---- one-sample z ----
z = (51 - 50) / (4 / sqrt(25))
p = 2 * (1 - stats.norm.cdf(abs(z)))
print(f"One-sample z-test:  z = {z:.4f}  p = {p:.4f}")

# ---- two-proportion z ----
x_a, x_b, n = 480, 540, 6000
p_a, p_b    = x_a / n, x_b / n
p_pool      = (x_a + x_b) / (2 * n)
se          = sqrt(p_pool * (1 - p_pool) * (2 / n))
z           = (p_b - p_a) / se
p           = 2 * (1 - stats.norm.cdf(abs(z)))
print(f"Two-proportion A/B: z = {z:.4f}  p = {p:.4f}")

# ---- t-CI ----
x_bar, s, n = 12, 3, 16
t_crit      = stats.t.ppf(0.975, df=n - 1)
half        = t_crit * s / sqrt(n)
print(f"95% t-CI for mean:  [{x_bar - half:.3f}, {x_bar + half:.3f}]")

# ---- chi-squared ----
import numpy as np
obs = np.array([[140, 60], [60, 340]])
chi2, p, df, _ = stats.chi2_contingency(obs)
print(f"Chi-squared:        χ² = {chi2:.2f}  p = {p:.2e}  df = {df}")

# ---- Bonferroni ----
m = 20
print(f"Bonferroni α*      = {0.05 / m}  (m = {m} tests)")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hypothesis testing: state H₀ and H₁, compute a test statistic assuming H₀, get a p-value, reject if p < α. Never "accept H₀".',
          'Type I (false positive, rate α) and Type II (false negative, rate β) trade off — bigger n is the only way to shrink both.',
          'Test menu: z / t for means, two-proportion z for A/B tests, χ² for contingency tables, ANOVA/F for comparing 3+ groups.',
          'Confidence intervals are the two-sided twin of a test: μ₀ ∉ 95% CI  ⇔  reject H₀ at α = 0.05. Prefer CIs — they show direction and effect size.',
          'Detecting small effects needs huge samples. Run a power calculation BEFORE the experiment, not after.',
          'Multiple testing inflates false positives — control with Bonferroni (strict) or Benjamini–Hochberg (FDR). Always separate a search set from a final test set.',
        ]}
      />
    </LessonArticle>
  )
}
