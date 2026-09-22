import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SingularValueDecomposition() {
  return (
    <LessonArticle>
      <Definition term="Singular Value Decomposition (SVD)">
        <p>
          The SVD factors any m × n matrix — square or not, symmetric or not — into three pieces:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>A = U Σ Vᵀ</div>
          <div className="mt-2">U : m × m orthogonal   (left singular vectors)</div>
          <div>Σ : m × n diagonal-ish   (singular values σ₁ ≥ σ₂ ≥ … ≥ 0)</div>
          <div>V : n × n orthogonal   (right singular vectors)</div>
        </div>
        <p className="mt-3 text-slate-300">
          SVD is the &ldquo;universal&rdquo; matrix decomposition. Eigen-decomposition only works for square
          matrices (and only diagonalises the friendly ones). SVD works on <em>every</em> matrix and is
          numerically stable.
        </p>
      </Definition>

      <LessonSection title="The picture — every matrix is a rotation, a scaling, and another rotation">
        <p className="text-slate-300">
          Read A = U Σ Vᵀ right-to-left. Applying A to a vector x:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Vᵀ</strong> — rotate x into a new coordinate frame (the input principal axes).</li>
          <li><strong className="text-white">Σ</strong> — scale each axis by its singular value σᵢ.</li>
          <li><strong className="text-white">U</strong> — rotate the result into the output frame (the output principal axes).</li>
        </ol>
        <Callout variant="insight" title="What σ₁ tells you">
          The biggest singular value σ₁ is the maximum stretch A can do; the direction of that stretch is
          v₁ (input side) and u₁ (output side). Small σ&rsquo;s = directions A almost annihilates.
        </Callout>
      </LessonSection>

      <LessonSection title="How SVD is built (the algebra)">
        <p className="text-slate-300">
          SVD is the eigen-decomposition of the symmetric matrices AᵀA and AAᵀ:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Right singular vectors V   : eigenvectors of AᵀA</div>
          <div>Left singular vectors U    : eigenvectors of AAᵀ</div>
          <div>Singular values σᵢ         : √(eigenvalues of AᵀA) — always ≥ 0</div>
        </div>
        <p className="mt-3 text-slate-300">
          This is why SVD exists for every matrix — AᵀA and AAᵀ are always symmetric positive semi-definite,
          hence always diagonalisable with real, non-negative eigenvalues.
        </p>
      </LessonSection>

      <LessonSection title="A tiny 2 × 2 example, all the way through">
        <ContentStep number={1} title="Given">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 3  0 ⎤</div>
            <div>    ⎣ 4  5 ⎦</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Compute AᵀA and its eigenpairs">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>AᵀA = ⎡ 25  20 ⎤</div>
            <div>      ⎣ 20  25 ⎦</div>
            <div className="mt-2">det(AᵀA − λI) = (25 − λ)² − 400 = 0</div>
            <div>25 − λ = ±20  →  λ = 45  or  λ = 5</div>
            <div className="mt-2">σ₁ = √45 ≈ 6.708,   σ₂ = √5 ≈ 2.236</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Right singular vectors V (eigenvectors of AᵀA)">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>λ = 45:  (AᵀA − 45I) v = 0  →  ⎡ −20  20 ⎤ v = 0  →  v₁ = (1, 1)/√2</div>
            <div>                                ⎣  20 −20 ⎦</div>
            <div className="mt-2">λ = 5:   v₂ = (1, −1)/√2 (orthogonal to v₁)</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Left singular vectors U from A v = σ u">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>u₁ = A v₁ / σ₁ = ⎡ 3·(1/√2) + 0·(1/√2) ⎤ / 6.708 ≈ (0.316, 0.949)</div>
            <div>                 ⎣ 4·(1/√2) + 5·(1/√2) ⎦</div>
            <div className="mt-2">u₂ = A v₂ / σ₂ ≈ (0.949, −0.316)</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Put it together">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>U ≈ ⎡ 0.316   0.949 ⎤    Σ = ⎡ 6.708   0    ⎤    V = (1/√2) ⎡ 1   1 ⎤</div>
            <div>    ⎣ 0.949  −0.316 ⎦        ⎣   0   2.236 ⎦                 ⎣ 1  −1 ⎦</div>
            <div className="mt-2 text-genai-400">A = U Σ Vᵀ (verify numerically below)</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Rank, condition number, pseudoinverse — all from Σ">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Rank of A</strong> = number of non-zero singular values. A tiny σ
            is a &ldquo;numerical zero&rdquo; — the matrix is almost rank-deficient.
          </li>
          <li>
            <strong className="text-white">Condition number</strong> κ(A) = σ_max / σ_min. Large κ means the
            matrix is nearly singular; small changes in b cause large changes in the solution of Ax = b. This
            is the real diagnostic when regression is unstable.
          </li>
          <li>
            <strong className="text-white">Pseudoinverse</strong> A⁺ = V Σ⁺ Uᵀ where Σ⁺ inverts the non-zero
            singular values. This is what <code>np.linalg.lstsq</code> is computing to solve least-squares
            problems safely — even when XᵀX is singular.
          </li>
          <li>
            <strong className="text-white">Frobenius / spectral norm</strong>: ‖A‖_F² = Σᵢ σᵢ², ‖A‖₂ = σ₁.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Low-rank approximation — the Eckart-Young theorem">
        <p className="text-slate-300">
          Keep only the top k singular values (zero out the rest). Reconstruct with Uₖ Σₖ Vₖᵀ. The result
          is the <strong className="text-white">best rank-k approximation of A</strong> under the Frobenius
          norm — provably. This one theorem powers:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">PCA</strong> — top-k singular directions of the centered data.</li>
          <li><strong className="text-white">Image compression</strong> — 100 singular values often reconstruct a photo indistinguishably.</li>
          <li><strong className="text-white">LSA / topic modelling</strong> — SVD on a term-document matrix.</li>
          <li><strong className="text-white">Recommender systems</strong> — matrix factorisation of user × item ratings.</li>
          <li><strong className="text-white">LoRA</strong> — approximate ΔW ≈ B A with tiny rank r; only 2·r·d parameters instead of d².</li>
        </ul>
        <Callout variant="insight" title="One formula, half of applied ML">
          Every time you compress, denoise, or embed high-dimensional data, you are truncating an SVD in
          disguise.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Singular values of a diagonal matrix">
          <p>Find the SVD of D = diag(3, −2, 1).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Singular values are absolute values, sorted descending: σ = (3, 2, 1).</div>
            <div className="mt-1">V = I (up to sign). To flip the negative diagonal entry, put a −1 in the corresponding column of U:</div>
            <div className="mt-2">U = diag(1, −1, 1),   Σ = diag(3, 2, 1),   V = I.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Rank from Σ">
          <p>A has singular values (7.2, 3.1, 0.001, 0.0). What is its rank in exact and numerical senses?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Exact rank    : 3   (three non-zero singular values)</div>
            <div>Numerical rank: 2   (0.001 is below any reasonable tolerance)</div>
            <div className="mt-1 text-slate-400">Threshold rule used by NumPy: tol = max(m, n) · σ_max · eps.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Condition number and stability">
          <p>Two design matrices have σ = (100, 10, 1) and σ = (100, 100, 0.01). Which regression is safer?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>κ₁ = 100 / 1     = 100         → healthy</div>
            <div>κ₂ = 100 / 0.01  = 10,000       → nearly singular; small noise in y → huge swing in w</div>
            <div className="mt-2 text-genai-400">Prefer the first. For the second, add regularisation (Ridge) to stabilise.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Pseudoinverse of a wide matrix">
          <p>
            A = ⎡ 1  0  1 ⎤ is 2 × 3 (more columns than rows). Compute A⁺ and use it to find the
            minimum-norm solution to Ax = (2, 1).
          </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 0  1  1 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>AAᵀ = ⎡ 2  1 ⎤,  inverse = (1/3) ⎡  2  −1 ⎤</div>
            <div>      ⎣ 1  2 ⎦                    ⎣ −1   2 ⎦</div>
            <div className="mt-2">A⁺ = Aᵀ (AAᵀ)⁻¹ = (1/3) ⎡  2  −1 ⎤</div>
            <div>                          ⎢ −1   2 ⎥</div>
            <div>                          ⎣  1   1 ⎦</div>
            <div className="mt-2">x* = A⁺ b = (1/3) · ⎡ 2·2 + (−1)·1 ⎤ = (1/3) · (3, 0, 3) = (1, 0, 1)</div>
            <div>                    ⎢ −1·2 + 2·1  ⎥</div>
            <div>                    ⎣  1·2 + 1·1  ⎦</div>
            <div className="mt-2">Verify: A · (1, 0, 1) = (1 + 0 + 1, 0 + 0 + 1) = (2, 1) ✓</div>
            <div className="mt-1 text-slate-400">Of the infinite solutions to Ax = b, this is the shortest one — the least-norm answer.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Best rank-1 approximation">
          <p>
            Approximate A = ⎡ 3  0 ⎤ (from the walkthrough) by a rank-1 matrix.
          </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 4  5 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Keep only σ₁ ≈ 6.708 with u₁ ≈ (0.316, 0.949), v₁ = (1, 1)/√2.</div>
            <div className="mt-2">A₁ = σ₁ u₁ v₁ᵀ ≈ 6.708 · ⎡ 0.316·(1/√2)   0.316·(1/√2) ⎤</div>
            <div>                              ⎣ 0.949·(1/√2)   0.949·(1/√2) ⎦</div>
            <div className="mt-2">    ≈ ⎡ 1.50  1.50 ⎤</div>
            <div>      ⎣ 4.50  4.50 ⎦</div>
            <div className="mt-2 text-slate-400">
              Reconstruction error ‖A − A₁‖_F = σ₂ ≈ 2.236. Not great here (small matrix, only 2 singular
              values) — but for high-dimensional data most information lives in the top few components.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — PCA via SVD (ML flavour)">
          <p>
            Given centred data X (n × d), you can compute PCA <em>either</em> from eigendecomposition of
            XᵀX / (n − 1) <em>or</em> from the SVD of X directly:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>X = U Σ Vᵀ</div>
            <div className="mt-2">Principal components = columns of V</div>
            <div>Explained variance for PC_i = σᵢ² / (n − 1)</div>
            <div>Projection of data onto k PCs = U Σ (first k columns)</div>
            <div className="mt-2 text-slate-400">
              SVD is preferred numerically — no need to form XᵀX (which can lose precision for
              well-conditioned but tall matrices).
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="SVD, low-rank approximation, and PCA"
          output={`Singular values: [6.7082 2.2361]
Reconstruction A - USVᵀ max error: 8.88e-16
Rank-1 approximation:
[[1.5 1.5]
 [4.5 4.5]]
Frobenius error: 2.23606797749979 (= σ₂ ✓)
Condition number: 3.0
PCA components (rows):
[[ 0.70710678  0.70710678]
 [ 0.70710678 -0.70710678]]
Explained variance ratio: [0.9 0.1]`}
        >{`import numpy as np

A = np.array([[3, 0], [4, 5]], dtype=float)
U, s, Vt = np.linalg.svd(A)
print("Singular values:", np.round(s, 4))

# Reconstruction
recon = U @ np.diag(s) @ Vt
print("Reconstruction A - USVᵀ max error:", np.max(np.abs(A - recon)))

# Best rank-1 approximation
k = 1
A_k = U[:, :k] @ np.diag(s[:k]) @ Vt[:k, :]
print("Rank-1 approximation:")
print(np.round(A_k, 3))
print("Frobenius error:", np.linalg.norm(A - A_k, ord='fro'), "(= σ₂ ✓)")

# Condition number = σ_max / σ_min
print("Condition number:", np.linalg.cond(A))

# PCA via SVD on centred data
X = np.array([[2, 0], [0, 2], [-2, 0], [0, -2], [1, 1], [-1, -1]], dtype=float)
X = X - X.mean(axis=0)
U2, s2, Vt2 = np.linalg.svd(X, full_matrices=False)
print("PCA components (rows):")
print(np.round(Vt2, 6))
explained = s2**2 / (len(X) - 1)
print("Explained variance ratio:", np.round(explained / explained.sum(), 2))`}</Example>
        <Callout variant="tip" title="When to use what">
          <ul className="list-disc space-y-1 pl-5">
            <li><strong className="text-white">Rank / condition number / pseudoinverse</strong> → SVD every time.</li>
            <li><strong className="text-white">PCA</strong> → SVD of centred data (more stable than eigendecomposition of XᵀX).</li>
            <li><strong className="text-white">Symmetric matrix eigenvectors (kernels, Hessians)</strong> → eigh, not SVD.</li>
            <li><strong className="text-white">Very large matrices</strong> → randomised SVD (<code>sklearn.utils.extmath.randomized_svd</code>) — O(m n k) instead of O(m n²).</li>
          </ul>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SVD factors any m × n matrix as A = U Σ Vᵀ: a rotation, an axis-wise scaling, another rotation. It always exists and is numerically stable.',
          'Singular values σᵢ = √(eigenvalues of AᵀA). Sorted descending; σ₁ is the max stretch, small σᵢ = directions A almost destroys.',
          'From Σ you read rank, condition number (σ_max / σ_min), the pseudoinverse (safe least-squares), and matrix norms.',
          'Eckart-Young: keeping the top-k singular values gives the best rank-k approximation under the Frobenius norm.',
          'This one theorem powers PCA, LSA, recommenders, image compression, and low-rank fine-tuning (LoRA).',
          'In NumPy: np.linalg.svd for exact SVD; sklearn.utils.extmath.randomized_svd for large matrices; use SVD-based PCA rather than eigendecomposition of XᵀX for numerical stability.',
        ]}
      />
    </LessonArticle>
  )
}
