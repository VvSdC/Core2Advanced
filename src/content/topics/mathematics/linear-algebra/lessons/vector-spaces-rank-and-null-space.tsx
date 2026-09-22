import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VectorSpacesRankAndNullSpace() {
  return (
    <LessonArticle>
      <Definition term="Vector space and its four fundamental subspaces">
        <p>
          A <strong className="text-white">vector space</strong> is any set of vectors that is closed under
          two operations: addition and scalar multiplication. The main examples in ML are ℝⁿ (n-dimensional
          real space) and its <em>subspaces</em> — the flat surfaces (lines, planes, hyperplanes) that pass
          through the origin.
        </p>
        <p className="mt-3">
          For every matrix A there are four important subspaces that describe everything the matrix does:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Column space</strong> — all vectors you can reach as Ax (the &ldquo;image&rdquo; of A).</li>
          <li><strong className="text-white">Row space</strong> — all combinations of A&rsquo;s rows.</li>
          <li><strong className="text-white">Null space</strong> — all x such that Ax = 0.</li>
          <li><strong className="text-white">Left null space</strong> — all y such that yA = 0.</li>
        </ul>
      </Definition>

      <LessonSection title="Span and linear independence">
        <ContentStep number={1} title="Span — everything you can build">
          <p>
            The <strong className="text-white">span</strong> of a set of vectors is the collection of all
            linear combinations of them. Span of one non-zero vector = a line through the origin. Span of two
            non-parallel vectors = a plane. Span of three &ldquo;independent&rdquo; vectors in ℝ³ = the whole space.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Linear independence — no redundancy">
          <p>
            Vectors are <strong className="text-white">linearly independent</strong> if none of them can be
            written as a combination of the others. Equivalently:{' '}
            <code className="text-slate-200">c₁v₁ + c₂v₂ + … + cₖvₖ = 0</code> forces all cᵢ = 0.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>v₁ = (1, 0), v₂ = (0, 1) → independent (they point along different axes).</div>
            <div>v₁ = (1, 2), v₂ = (2, 4) → dependent (v₂ = 2·v₁, no new direction).</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Basis and dimension">
          <p>
            A <strong className="text-white">basis</strong> for a subspace is a linearly independent set that
            spans it — the smallest possible &ldquo;starter kit&rdquo;. The number of vectors in any basis is the
            <strong className="text-white"> dimension</strong> of the subspace.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Standard basis of ℝ² : {`{ (1, 0), (0, 1) }`}</div>
            <div>Standard basis of ℝ³ : {`{ (1, 0, 0), (0, 1, 0), (0, 0, 1) }`}</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Rank — how much independent information A really has">
        <Definition term="Rank">
          <p>
            The <strong className="text-white">rank</strong> of A is the number of linearly independent
            columns (equivalently, rows) of A. It is the dimension of the column space (= dimension of the
            row space — they always match).
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Full rank</strong> — rank equals min(m, n). No redundancy.</li>
            <li><strong className="text-white">Rank-deficient</strong> — some column is a combination of the others; the matrix collapses part of the input space.</li>
          </ul>
        </Definition>
        <Callout variant="insight" title="Rank tells you three things at once">
          <ul className="list-disc space-y-1 pl-5">
            <li>The dimension of the column space (what outputs are reachable).</li>
            <li>The number of pivots after row-reduction.</li>
            <li>Whether A is invertible — a square A is invertible iff rank(A) = n.</li>
          </ul>
        </Callout>
      </LessonSection>

      <LessonSection title="Null space — what A destroys">
        <p>
          The <strong className="text-white">null space</strong> N(A) is the set of all x with Ax = 0. It is
          always a subspace (contains 0, closed under addition and scalar multiplication). Its dimension is
          called the <strong className="text-white">nullity</strong>.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Rank-Nullity Theorem (n columns):</div>
          <div className="mt-2">rank(A) + nullity(A) = n</div>
        </div>
        <p className="mt-3 text-slate-300">
          Reading: every dimension of the input space either <em>survives</em> in the output (contributes to
          rank) or <em>gets sent to zero</em> (contributes to nullity). It cannot do both.
        </p>
      </LessonSection>

      <LessonSection title="Why this matters in ML">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Perfectly correlated features</strong> make X rank-deficient. XᵀX
            becomes singular; OLS blows up. Detection: <code>np.linalg.matrix_rank(X)</code> &lt; number of
            columns.
          </li>
          <li>
            <strong className="text-white">Redundant one-hot columns</strong> (the &ldquo;dummy variable trap&rdquo;) drop
            rank by one. Fix: drop one category or add a regulariser.
          </li>
          <li>
            <strong className="text-white">PCA</strong> is exactly finding an orthonormal basis for a
            data-adapted subspace and choosing the top-k directions.
          </li>
          <li>
            <strong className="text-white">Compression, embeddings, low-rank adapters (LoRA)</strong> all
            work because real high-dimensional data usually lives close to a much lower-rank subspace.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Independent or dependent?">
          <p>Are v₁ = (1, 2, 3), v₂ = (2, 4, 6), v₃ = (1, 1, 0) linearly independent?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>v₂ = 2 · v₁ — v₂ is redundant.</div>
            <div className="mt-2 text-genai-400">Dependent. Span dimension is 2, not 3.</div>
            <div className="mt-1">A basis for the span: {`{ v₁, v₃ }`}.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Rank by row reduction">
          <p>Find the rank of A.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 1  2  1 ⎤     R2 ← R2 − 2R1        ⎡ 1  2  1 ⎤</div>
            <div>    ⎢ 2  4  3 ⎥     R3 ← R3 − 3R1   →   ⎢ 0  0  1 ⎥</div>
            <div>    ⎣ 3  6  4 ⎦                          ⎣ 0  0  1 ⎦</div>
            <div className="mt-2">R3 ← R3 − R2:</div>
            <div>⎡ 1  2  1 ⎤</div>
            <div>⎢ 0  0  1 ⎥</div>
            <div>⎣ 0  0  0 ⎦</div>
            <div className="mt-2 text-genai-400">Two non-zero rows → rank(A) = 2. A is rank-deficient (columns 1 and 2 are proportional).</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Compute the null space">
          <p>Find N(A) for A = ⎡ 1  2  3 ⎤.</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 2  4  6 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Row-reduce → ⎡ 1  2  3 ⎤   (R2 becomes zero)</div>
            <div>              ⎣ 0  0  0 ⎦</div>
            <div className="mt-2">One equation: x + 2y + 3z = 0. Two free variables (y = s, z = t):</div>
            <div className="mt-1">x = −2s − 3t</div>
            <div className="mt-2">Solutions: (−2s − 3t, s, t) = s·(−2, 1, 0) + t·(−3, 0, 1)</div>
            <div className="mt-2 text-genai-400">Null space = span of {`{ (−2, 1, 0), (−3, 0, 1) }`}. dim N(A) = 2.</div>
            <div className="mt-1 text-slate-400">Check rank-nullity: rank(A) = 1, nullity = 2, columns = 3 → 1 + 2 = 3 ✓.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Basis for the column space">
          <p>Find a basis for the column space of the same A.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>After row reduction the only pivot was in column 1. So a basis for Col(A) is the</div>
            <div>corresponding original column: {`{ (1, 2) }`}.</div>
            <div className="mt-2 text-genai-400">Col(A) is 1-dimensional — a single line inside ℝ².</div>
            <div className="mt-1 text-slate-400">Geometrically A crushes 3D input onto a 1D output line.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Rank of a design matrix (ML flavour)">
          <p>
            You added three features to a regression: <em>height (cm)</em>, <em>height (inches)</em>, and
            <em> height²</em>. Do they contribute independent information?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Column 2 = column 1 × (1 / 2.54)  → dependent on column 1.</div>
            <div>Column 3 is height² → NOT a linear combination of column 1 → independent.</div>
            <div className="mt-2 text-genai-400">Rank contribution: only 2 of the 3 columns are independent.</div>
            <div className="mt-1 text-slate-400">
              Drop the duplicated unit column. Keep height + height² for a proper polynomial fit.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Detect the dummy-variable trap">
          <p>
            You one-hot-encoded a 3-category feature into columns C₁, C₂, C₃ (exactly one is 1 per row) and
            also kept an intercept column of all 1s. Is the design matrix full-rank?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Intercept = C₁ + C₂ + C₃  (every row: exactly one 1 plus two 0s → sums to 1).</div>
            <div className="mt-2 text-red-400">Rank drops by 1 — matrix is singular. OLS will fail or give unstable coefficients.</div>
            <div className="mt-1 text-genai-400">Fix: drop one dummy column (say C₃) OR drop the intercept.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="Rank, null space, and independence with NumPy / SciPy"
          output={`rank(A)     = 2
column-space basis (cols 0, 2 as pivots)
[[1 1]
 [2 3]
 [3 4]]
null-space basis (columns of N):
[[-2. -3.]
 [ 1.  0.]
 [ 0.  1.]]
rank + nullity = 1 + 2 = 3 (= n_cols) ✓
Dummy-trap matrix rank = 3 (out of 4 cols) → singular`}
        >{`import numpy as np
from scipy.linalg import null_space

A = np.array([[1, 2, 1],
              [2, 4, 3],
              [3, 6, 4]], dtype=float)
print("rank(A)     =", np.linalg.matrix_rank(A))

# Column-space basis — take pivot columns
_, _, _ = np.linalg.qr(A)  # QR is one way; SVD is more robust
# For a small A we can just pick columns 0 and 2 (identified by row-reduction).
print("column-space basis (cols 0, 2 as pivots)")
print(A[:, [0, 2]].astype(int))

# Null-space basis
B = np.array([[1, 2, 3],
              [2, 4, 6]], dtype=float)
N = null_space(B)  # columns are basis vectors of N(B)
# Scale so leading nonzero is +1 for readability
N = N / N[np.argmax(np.abs(N), axis=0), np.arange(N.shape[1])]
print("null-space basis (columns of N):")
print(np.round(N, 2))

print(f"rank + nullity = {np.linalg.matrix_rank(B)} + {N.shape[1]} = {np.linalg.matrix_rank(B) + N.shape[1]} (= n_cols) ✓")

# Dummy-variable trap
X = np.column_stack([np.ones(5),      # intercept
                     [1, 0, 0, 1, 0], # C1
                     [0, 1, 0, 0, 1], # C2
                     [0, 0, 1, 0, 0]])# C3
print("Dummy-trap matrix rank =", np.linalg.matrix_rank(X), "(out of", X.shape[1], "cols) → singular")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Span = everything you can build; independent = no redundancy; basis = smallest independent spanning set; dimension = size of any basis.',
          'Rank of A = number of linearly independent columns (or rows — they match). It equals the number of pivots after row reduction.',
          'Null space = all x that A sends to zero. Rank-Nullity: rank(A) + nullity(A) = number of columns.',
          'In ML, low rank in X means duplicated features (unit conversions, one-hot + intercept) — the classic cause of singular XᵀX and unstable regression.',
          'PCA, LoRA, and every compression scheme is really "keep the top-k directions of variance and let the rest collapse into the null space" — the same idea, at scale.',
        ]}
      />
    </LessonArticle>
  )
}
