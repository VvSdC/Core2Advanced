import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ExpectationVarianceCovariance() {
  return (
    <LessonArticle>
      <Definition term="Expectation">
        <p>
          The <strong className="text-white">expected value</strong> E[X] is the long-run average of X — the
          probability-weighted mean of every outcome it can take.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Discrete:    E[X] = Σₓ x · p(x)</div>
          <div>Continuous:  E[X] = ∫ x · f(x) dx</div>
          <div>Function:    E[g(X)] = Σ g(x) p(x)   (or ∫ g(x) f(x) dx)</div>
        </div>
        <p className="mt-3 text-slate-300">
          E[X] is not a number a single draw hits — it is where infinitely many draws would balance. Rolling
          a die has E[X] = 3.5 even though no face shows 3.5.
        </p>
      </Definition>

      <LessonSection title="Linearity of expectation — the most useful trick in probability">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>E[a X + b Y + c] = a E[X] + b E[Y] + c</div>
          <div className="mt-1">Holds whether X and Y are independent or not.</div>
        </div>
        <Callout variant="insight" title="Why it matters">
          Almost every combinatorial expectation problem becomes trivial by decomposing X into a sum of
          indicator variables. Loss functions in ML are expectations — linearity is why mini-batch gradients
          are unbiased.
        </Callout>
      </LessonSection>

      <LessonSection title="Variance and standard deviation — how much X wobbles">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Var(X) = E[(X − μ)²] = E[X²] − (E[X])²      (where μ = E[X])</div>
          <div>SD(X)  = √Var(X)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Variance has squared units (m² not m). Standard deviation matches the unit of X and is what people
          quote in reports.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Var(a X + b)       = a² Var(X)</div>
          <div>Var(X + Y)         = Var(X) + Var(Y) + 2 Cov(X, Y)</div>
          <div>Var(X + Y)         = Var(X) + Var(Y)          if X ⟂ Y</div>
        </div>
      </LessonSection>

      <LessonSection title="Covariance and correlation — how X and Y move together">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Cov(X, Y) = E[(X − μ_X)(Y − μ_Y)] = E[X Y] − E[X] E[Y]</div>
          <div>ρ(X, Y)   = Cov(X, Y) / (SD(X) · SD(Y))     ∈ [−1, 1]</div>
        </div>
        <p className="mt-3 text-slate-300">
          <strong className="text-white">Covariance</strong> has weird units (m·s if X is m and Y is s).{' '}
          <strong className="text-white">Correlation</strong> is the unit-free version that lives in
          [−1, 1] — a scale-invariant measure of linear association.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">ρ</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ρ = +1',     'Perfect positive linear relation'],
                ['ρ ≈ +0.7',   'Strong positive'],
                ['ρ = 0',      'No LINEAR relation (may still be non-linear)'],
                ['ρ ≈ −0.7',   'Strong negative'],
                ['ρ = −1',     'Perfect negative linear relation'],
              ].map(([rho, meaning]) => (
                <tr key={rho}>
                  <td className="px-4 py-3 font-mono font-semibold text-white">{rho}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Correlation is not causation">
          Ice-cream sales and drownings are highly correlated — because both spike in summer, not because
          one causes the other. Always look for confounders.
        </Callout>
      </LessonSection>

      <LessonSection title="Covariance matrix — vector version">
        <p className="text-slate-300">
          For a random vector <code className="text-slate-200">x ∈ ℝᵈ</code>, the covariance matrix is:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Σ = E[(x − μ)(x − μ)ᵀ] ∈ ℝ^(d × d)</div>
          <div className="mt-2">Σᵢᵢ = Var(xᵢ),    Σᵢⱼ = Cov(xᵢ, xⱼ)</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Σ is symmetric and positive semi-definite (all eigenvalues ≥ 0).</li>
          <li>PCA diagonalises Σ — eigenvectors become principal components, eigenvalues become explained variance.</li>
          <li>Multivariate normal has PDF entirely defined by (μ, Σ).</li>
          <li>Whitening = transforming x so that Σ becomes the identity matrix.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Fair die">
          <p>Compute E[X], Var(X), SD(X) for a fair six-sided die.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>E[X]  = (1 + 2 + 3 + 4 + 5 + 6) / 6 = 3.5</div>
            <div>E[X²] = (1 + 4 + 9 + 16 + 25 + 36) / 6 = 91/6 ≈ 15.167</div>
            <div>Var   = 91/6 − 3.5² = 15.167 − 12.25 = 2.917</div>
            <div>SD    = √2.917 ≈ 1.708</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Linearity beats brute force">
          <p>
            Roll ten fair dice and let S be their sum. Compute E[S] and Var(S).
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each die: E[X] = 3.5, Var(X) = 35/12.</div>
            <div>Rolls are independent → Var adds.</div>
            <div className="mt-1">E[S]   = 10 · 3.5     = 35.</div>
            <div>Var(S) = 10 · 35/12   ≈ 29.17.  SD(S) ≈ 5.4.</div>
            <div className="mt-2 text-genai-400">
              No PMF-sum computation needed — linearity did it in three lines.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Indicators (ML flavour)">
          <p>
            You draw 5 random tokens from a vocabulary of 1000, uniformly with replacement. What is the
            expected number of distinct tokens?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>For each token t: I_t = 1 if t appears at least once.</div>
            <div>P(t not drawn) = (999/1000)⁵ ≈ 0.99501.</div>
            <div>E[I_t] = 1 − 0.99501 ≈ 0.004988.</div>
            <div className="mt-1">E[distinct] = 1000 · 0.004988 ≈ 4.99.</div>
            <div className="mt-2 text-slate-400">
              Same &ldquo;expected coupon collector&rdquo; identity that appears in dropout, subsampling, and
              stochastic backprop analyses.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Mini-batch variance (ML flavour)">
          <p>
            A gradient estimator uses a mini-batch of size B and each per-sample gradient has variance σ².
            What is Var(mean gradient)? What batch size halves your gradient noise?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Var((1/B) Σ gᵢ) = (1/B²) · B · σ² = σ² / B.</div>
            <div>SD(mean) = σ / √B.</div>
            <div className="mt-2">Halving SD → need B → 4B (variance goes as 1/B, SD as 1/√B).</div>
            <div className="mt-2 text-genai-400">
              This is why doubling batch size only gives a √2 noise reduction — a core scaling law in training.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Correlation between features">
          <p>
            Data table for four points: X = [1, 2, 3, 4], Y = [2, 4, 5, 4]. Compute Cov(X, Y) and ρ.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>μ_X = 2.5,   μ_Y = 3.75</div>
            <div>Σ(xᵢ − μ_X)(yᵢ − μ_Y) = (−1.5)(−1.75) + (−0.5)(0.25) + (0.5)(1.25) + (1.5)(0.25)</div>
            <div>                       = 2.625 − 0.125 + 0.625 + 0.375 = 3.5</div>
            <div>Cov = 3.5 / 4 = 0.875   (population)  or  3.5 / 3 ≈ 1.167 (sample)</div>
            <div className="mt-2">Var(X) = (1.25),  Var(Y) = (1.1875)   (pop)</div>
            <div>ρ = 0.875 / √(1.25 · 1.1875) ≈ 0.719.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Covariance matrix for a 2-D dataset (ML flavour)">
          <p>
            X-column = [1, 3, 5, 7], Y-column = [2, 4, 6, 8]. Compute the 2×2 covariance matrix.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>μ = (4, 5),  centred pairs: (−3, −3), (−1, −1), (1, 1), (3, 3).</div>
            <div>Σ = (1/4) · [[9+1+1+9, 9+1+1+9],</div>
            <div>              [9+1+1+9, 9+1+1+9]] = [[5, 5], [5, 5]]  (population)</div>
            <div className="mt-2">Sample cov = (1/3) · that inner matrix = [[6.67, 6.67], [6.67, 6.67]].</div>
            <div className="mt-2 text-genai-400">
              Σ has rank 1 — X and Y are perfectly correlated. PCA would find one principal component; the
              second eigenvalue is zero.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — moments, covariance, and PCA link">
        <Example
          title="Numeric verification of everything above"
          output={`E[die]   = 3.5,   Var(die)   = 2.9167,  SD = 1.7078
E[sum10] = 35.0,  Var(sum10) = 29.17
Expected distinct tokens ≈ 4.9875
Cov(X, Y) population 0.875   sample 1.1667
ρ                            0.7184
Σ (pop) = [[5. 5.]
           [5. 5.]]
Rank of Σ = 1  (features are perfectly correlated)`}
        >{`import numpy as np

# Fair die
x = np.arange(1, 7)
mu, var = x.mean(), x.var()
print(f"E[die]   = {mu},   Var(die)   = {var:.4f},  SD = {var**0.5:.4f}")

# Sum of ten dice via linearity
print(f"E[sum10] = {10*mu},  Var(sum10) = {10*var:.2f}")

# Distinct tokens
n, k = 1000, 5
print(f"Expected distinct tokens ≈ {n * (1 - (1 - 1/n)**k):.4f}")

# Covariance
X = np.array([1, 2, 3, 4])
Y = np.array([2, 4, 5, 4])
cov_pop  = ((X - X.mean()) * (Y - Y.mean())).mean()
cov_samp = ((X - X.mean()) * (Y - Y.mean())).sum() / (len(X) - 1)
rho      = np.corrcoef(X, Y)[0, 1]
print(f"Cov(X, Y) population {cov_pop:.3f}   sample {cov_samp:.4f}")
print(f"ρ                            {rho:.4f}")

# 2-D covariance matrix
D = np.array([[1, 2], [3, 4], [5, 6], [7, 8]], dtype=float)
D -= D.mean(axis=0)
Sigma = (D.T @ D) / len(D)     # population
print("Σ (pop) =", np.array2string(Sigma).replace('\\n', '\\n           '))
print(f"Rank of Σ = {np.linalg.matrix_rank(Sigma)}  (features are perfectly correlated)")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Expectation = probability-weighted average. Linearity E[aX + bY] = aE[X] + bE[Y] holds even without independence — the workhorse trick.',
          'Variance uses squared units; standard deviation matches X. Var(aX + b) = a²Var(X); Var(X + Y) needs a covariance term unless independent.',
          'Cov(X, Y) = E[XY] − E[X]E[Y] measures signed linear association. Correlation ρ = Cov / (σ_X σ_Y) ∈ [−1, 1] is unit-free.',
          'Zero correlation ≠ independence (only for linear relationships) and correlation ≠ causation (watch for confounders).',
          'Covariance matrix Σ is symmetric PSD, diagonal is variances, off-diagonals are pairwise covariances. PCA diagonalises Σ.',
          'Batch-size math: variance of the mini-batch gradient falls as σ²/B, so noise SD scales as 1/√B — halving noise costs 4× compute.',
        ]}
      />
    </LessonArticle>
  )
}
