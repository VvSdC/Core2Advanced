import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EigenvaluesAndEigenvectors() {
  return (
    <LessonArticle>
      <Definition term="Eigenvalue and eigenvector">
        <p>
          Almost every matrix scrambles vectors — direction changes, length changes, everything moves. But
          for a few special directions, A only <strong className="text-white">stretches or shrinks</strong>{' '}
          the vector without turning it. Those directions are <strong className="text-white">eigenvectors</strong>,
          and the stretch factor is the <strong className="text-white">eigenvalue</strong>.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>A v = λ v      (v ≠ 0)</div>
          <div className="mt-2">v is the eigenvector,  λ is the eigenvalue.</div>
        </div>
      </Definition>

      <LessonSection title="The picture">
        <p className="text-slate-300">
          Draw any vector v. Apply A. Usually you get a different-direction vector Av. But for eigenvectors,
          Av lies on the same line as v — just longer (|λ| &gt; 1), shorter (|λ| &lt; 1), flipped (λ &lt; 0),
          or unchanged (λ = 1). The eigenvectors are A&rsquo;s <em>invariant directions</em>.
        </p>
        <Callout variant="insight" title="Why ML cares">
          <ul className="list-disc space-y-1 pl-5">
            <li>PCA finds the eigenvectors of the covariance matrix — the directions of maximum variance.</li>
            <li>Spectral clustering embeds points using eigenvectors of the graph Laplacian.</li>
            <li>PageRank is the leading eigenvector of the link matrix.</li>
            <li>Stability of iterative methods (power iteration, gradient descent momentum) depends on eigenvalues.</li>
          </ul>
        </Callout>
      </LessonSection>

      <LessonSection title="How to find them — the characteristic equation">
        <ContentStep number={1} title="Step 1 — set up A − λI">
          <p>
            Ax = λx rewrites to (A − λI) x = 0. For a non-zero x to exist, A − λI must be singular. That is:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det(A − λI) = 0     ← the characteristic equation</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Step 2 — solve for λ">
          <p>Roots of the characteristic polynomial are the eigenvalues. An n×n matrix has n of them (counting multiplicity, sometimes complex).</p>
        </ContentStep>
        <ContentStep number={3} title="Step 3 — for each λ, solve (A − λI) v = 0">
          <p>The non-zero solutions v form the <em>eigenspace</em> for λ — the null space of A − λI.</p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="A full 2×2 walk-through">
        <ContentStep number={1} title="Set up">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 4  1 ⎤</div>
            <div>    ⎣ 2  3 ⎦</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Characteristic equation">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A − λI = ⎡ 4−λ   1  ⎤</div>
            <div>         ⎣  2   3−λ ⎦</div>
            <div className="mt-2">det = (4 − λ)(3 − λ) − 2·1 = λ² − 7λ + 12 − 2 = λ² − 7λ + 10</div>
            <div className="mt-2">λ² − 7λ + 10 = 0  →  (λ − 5)(λ − 2) = 0</div>
            <div className="mt-2 text-genai-400">Eigenvalues: λ₁ = 5, λ₂ = 2</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Eigenvector for λ = 5">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>(A − 5I) v = 0  →  ⎡ −1   1 ⎤ ⎡ x ⎤ = 0</div>
            <div>                    ⎣  2  −2 ⎦ ⎣ y ⎦</div>
            <div className="mt-2">Both rows say: −x + y = 0  ⇒  y = x.</div>
            <div>Pick x = 1 → v₁ = (1, 1). Any scalar multiple works.</div>
            <div className="mt-2">Verify: A v₁ = ⎡ 4·1 + 1·1 ⎤ = ⎡ 5 ⎤ = 5 · (1, 1) ✓</div>
            <div>                 ⎣ 2·1 + 3·1 ⎦   ⎣ 5 ⎦</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Eigenvector for λ = 2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>(A − 2I) v = 0  →  ⎡ 2   1 ⎤ ⎡ x ⎤ = 0</div>
            <div>                    ⎣ 2   1 ⎦ ⎣ y ⎦</div>
            <div className="mt-2">2x + y = 0  ⇒  y = −2x.</div>
            <div>Pick x = 1 → v₂ = (1, −2).</div>
            <div className="mt-2">Verify: A v₂ = ⎡ 4·1 + 1·(−2) ⎤ = ⎡  2 ⎤ = 2 · (1, −2) ✓</div>
            <div>                 ⎣ 2·1 + 3·(−2) ⎦   ⎣ −4 ⎦</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Diagonalisation — the payoff">
        <p>
          When A has n linearly independent eigenvectors, they form a matrix P whose columns are the
          eigenvectors, and A can be written as:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>A = P D P⁻¹     where D = diag(λ₁, λ₂, …, λₙ)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Consequence: powers of A become powers of a diagonal — trivial to compute:
        </p>
        <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Aᵏ = P Dᵏ P⁻¹   where Dᵏ = diag(λ₁ᵏ, …, λₙᵏ)</div>
        </div>
        <Callout variant="insight" title="Symmetric matrices are the friendliest">
          If A is symmetric (A = Aᵀ) — like every covariance matrix — its eigenvalues are real and its
          eigenvectors are orthogonal. Then <code className="text-slate-200">A = Q Λ Qᵀ</code> with Q
          orthogonal (Qᵀ = Q⁻¹). That is the algebra that makes PCA work.
        </Callout>
      </LessonSection>

      <LessonSection title="Useful identities">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Fact</th>
                <th className="px-4 py-3">Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Sum of eigenvalues',                'λ₁ + λ₂ + … + λₙ = trace(A)'],
                ['Product of eigenvalues',            'λ₁ · λ₂ · … · λₙ = det(A)'],
                ['A is invertible',                   'iff every λᵢ ≠ 0'],
                ['Symmetric matrix',                  'eigenvalues are real, eigenvectors orthogonal'],
                ['Positive-definite',                 'every λᵢ > 0 (covariance matrices)'],
                ['Similar matrices B = P⁻¹AP',        'share eigenvalues with A'],
              ].map(([k, v]) => (
                <tr key={k}>
                  <td className="px-4 py-3 font-semibold text-white">{k}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — diagonal matrix">
          <p>Find the eigenvalues and eigenvectors of D = diag(3, −1, 5).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Eigenvalues are the diagonal entries: 3, −1, 5.</div>
            <div className="mt-1">Eigenvectors are the standard basis vectors: (1,0,0), (0,1,0), (0,0,1).</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Trace / det check">
          <p>For A = ⎡ 4  1 ⎤ we found λ = 5 and 2. Verify the trace and determinant identities.</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 2  3 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>trace(A) = 4 + 3 = 7      ✓ = 5 + 2</div>
            <div>det(A)   = 4·3 − 1·2 = 10  ✓ = 5 · 2</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Symmetric matrix (covariance flavour)">
          <p>Diagonalise C = ⎡ 2  1 ⎤.</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 1  2 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det(C − λI) = (2 − λ)² − 1 = λ² − 4λ + 3 = 0  →  λ = 3, 1</div>
            <div className="mt-2">For λ = 3:  ⎡ −1  1 ⎤ v = 0  →  v = (1, 1) → normalise → (1/√2, 1/√2)</div>
            <div>            ⎣  1 −1 ⎦</div>
            <div className="mt-2">For λ = 1:  ⎡ 1  1 ⎤ v = 0  →  v = (1, −1) → normalise → (1/√2, −1/√2)</div>
            <div>            ⎣ 1  1 ⎦</div>
            <div className="mt-2 text-genai-400">Q = (1/√2) · ⎡ 1   1 ⎤,  Λ = diag(3, 1),  C = Q Λ Qᵀ.</div>
            <div>              ⎣ 1  −1 ⎦</div>
            <div className="mt-1 text-slate-400">
              Eigenvectors are orthogonal ✓ — because C is symmetric.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Powers via diagonalisation">
          <p>Using A = P D P⁻¹ from the 2×2 walkthrough (λ = 5, 2), compute A¹⁰⁰ x for x = (1, 0).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P = ⎡ 1   1 ⎤   P⁻¹ = (1/−3) · ⎡ −2  −1 ⎤ = ⎡ 2/3   1/3 ⎤</div>
            <div>    ⎣ 1  −2 ⎦                  ⎣ −1   1 ⎦    ⎣ 1/3  −1/3 ⎦</div>
            <div className="mt-2">P⁻¹ x = ⎡ 2/3 ⎤</div>
            <div>        ⎣ 1/3 ⎦</div>
            <div className="mt-2">D¹⁰⁰ P⁻¹ x = ⎡ 5¹⁰⁰ · 2/3 ⎤</div>
            <div>              ⎣ 2¹⁰⁰ · 1/3 ⎦</div>
            <div className="mt-2">A¹⁰⁰ x = P D¹⁰⁰ P⁻¹ x = 5¹⁰⁰·(2/3)·(1,1) + 2¹⁰⁰·(1/3)·(1,−2)</div>
            <div className="mt-2 text-slate-400">
              For large k, the λ = 5 term dominates → A¹⁰⁰ x aligns with the eigenvector (1, 1). This is the
              intuition behind <em>power iteration</em> for finding the top eigenvector.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Complex eigenvalues (rotation matrix)">
          <p>What are the eigenvalues of the 90° rotation R = ⎡ 0 −1 ⎤ ?</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 1  0 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det(R − λI) = (−λ)(−λ) − (−1)(1) = λ² + 1 = 0  →  λ = ±i.</div>
            <div className="mt-2 text-slate-400">
              No real eigenvectors — a rotation has no invariant real direction (every vector gets rotated).
              This is why non-symmetric matrices can have complex eigenvalues.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — PCA in one shot (ML flavour)">
          <p>
            Given data matrix X (centered), covariance C = (1/n) XᵀX. Find the direction of maximum variance
            for
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>C = ⎡ 4  2 ⎤</div>
            <div>    ⎣ 2  1 ⎦</div>
            <div className="mt-2">det(C − λI) = (4−λ)(1−λ) − 4 = λ² − 5λ + 0 = 0  →  λ = 5, 0</div>
            <div className="mt-2">λ = 5: (C − 5I) v = 0  →  ⎡ −1  2 ⎤ v = 0 → v = (2, 1) → normalise (2/√5, 1/√5)</div>
            <div>                          ⎣  2 −4 ⎦</div>
            <div className="mt-2 text-genai-400">
              Principal component 1 = (0.894, 0.447). Captures 5 / (5 + 0) = 100% of variance.
            </div>
            <div className="mt-1 text-slate-400">
              λ = 0 means the second direction has zero variance — features are perfectly collinear.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="Eigenvalues and PCA in NumPy"
          output={`Eigenvalues: [5. 2.]
Eigenvectors (columns):
[[ 0.70710678 -0.4472136 ]
 [ 0.70710678  0.89442719]]
A v1 = [3.5355 3.5355]
5 v1 = [3.5355 3.5355]   ✓
Reconstruction A - P D P⁻¹ max error: 4.44e-16
PCA top direction: [0.89442719 0.4472136 ]
Explained variance ratio: [1. 0.]`}
        >{`import numpy as np

A = np.array([[4, 1], [2, 3]], dtype=float)
w, V = np.linalg.eig(A)
print("Eigenvalues:", np.round(w, 6))
print("Eigenvectors (columns):")
print(V)

# Verify A v = λ v for the first pair
print("A v1 =", np.round(A @ V[:, 0], 4))
print("5 v1 =", np.round(w[0] * V[:, 0], 4), "  ✓")

# Reconstruction A = P D P^-1
D = np.diag(w)
P = V
recon = P @ D @ np.linalg.inv(P)
print("Reconstruction A - P D P⁻¹ max error:", np.max(np.abs(A - recon)))

# Symmetric / covariance — use eigh for real symmetric
C = np.array([[4, 2], [2, 1]], dtype=float)
lam, Q = np.linalg.eigh(C)      # returns ascending, so flip
lam, Q = lam[::-1], Q[:, ::-1]
print("PCA top direction:", Q[:, 0])
print("Explained variance ratio:", lam / lam.sum())`}</Example>
        <Callout variant="tip" title="Use eigh, not eig, for symmetric matrices">
          <code>np.linalg.eigh</code> is faster and guaranteed to return real eigenvalues and orthonormal
          eigenvectors — perfect for covariance matrices, kernels, Hessians, and graph Laplacians. Use
          <code>eig</code> only for non-symmetric matrices where complex eigenvalues are allowed.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Ax = λx: an eigenvector is a direction A only stretches; the eigenvalue λ is the stretch factor.',
          'Find λ by solving det(A − λI) = 0 (the characteristic equation); find each eigenvector as the null space of A − λI.',
          'Sum of eigenvalues = trace(A); product = det(A). A is invertible iff no eigenvalue is 0.',
          'Diagonalisation A = P D P⁻¹ lets you compute A^k and matrix functions trivially; symmetric matrices always diagonalise with an orthogonal Q.',
          'ML links: PCA = eigenvectors of covariance; spectral clustering = eigenvectors of the graph Laplacian; PageRank = leading eigenvector; convergence of gradient descent depends on eigenvalues of the Hessian.',
          'In NumPy use eigh for symmetric matrices (PCA, kernels) — faster, real values, orthonormal vectors — and eig only for non-symmetric ones.',
        ]}
      />
    </LessonArticle>
  )
}
