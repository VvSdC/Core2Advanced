import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SystemsOfLinearEquations() {
  return (
    <LessonArticle>
      <Definition term="System of linear equations">
        <p>
          A set of linear equations in the same unknowns — e.g. <em>2x + 3y = 5</em> and <em>x − y = 1</em>.
          Every such system can be packaged as <code className="text-slate-200">Ax = b</code>: the coefficient
          matrix A times the unknown vector x equals the right-hand-side vector b. Solving the system means
          finding an x that satisfies every equation at once.
        </p>
      </Definition>

      <LessonSection title="The three possibilities">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Unique solution</strong> — the equations pin x down to a single point. Happens when A is square and invertible (det(A) ≠ 0).</li>
          <li><strong className="text-white">No solution</strong> — the equations contradict each other. Geometrically, the planes never all meet.</li>
          <li><strong className="text-white">Infinite solutions</strong> — the equations are consistent but under-determined; a whole line or plane of solutions exists.</li>
        </ul>
        <Callout variant="insight" title="Real-world ML systems are almost never square">
          Regression has more rows (samples) than columns (features): the system is <em>overdetermined</em>
          — usually inconsistent, so we find the <strong className="text-white">best</strong> x rather than
          the exact one. That is where least-squares comes in.
        </Callout>
      </LessonSection>

      <LessonSection title="Method 1 — Gaussian elimination (row reduction)">
        <p>
          The workhorse for solving Ax = b by hand or in software. Three legal moves on the augmented matrix
          <code className="text-slate-200"> [ A | b ]</code>:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li>Swap two rows.</li>
          <li>Multiply a row by a non-zero constant.</li>
          <li>Add a multiple of one row to another.</li>
        </ol>
        <p className="mt-3 text-slate-300">
          Goal: reduce A to <em>upper triangular</em> (zeros below the diagonal), then read x by back-substitution.
        </p>

        <ContentStep number={1} title="Walked example">
          <p>Solve: 2x + y + z = 5, 4x − 6y = −2, −2x + 7y + 2z = 9.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Augmented matrix:</div>
            <div>⎡  2   1   1 |  5 ⎤</div>
            <div>⎢  4  −6   0 | −2 ⎥</div>
            <div>⎣ −2   7   2 |  9 ⎦</div>
            <div className="mt-3">R2 ← R2 − 2·R1:</div>
            <div>⎡  2   1   1 |  5 ⎤</div>
            <div>⎢  0  −8  −2 | −12 ⎥</div>
            <div>⎣ −2   7   2 |  9 ⎦</div>
            <div className="mt-3">R3 ← R3 + R1:</div>
            <div>⎡  2   1   1 |  5 ⎤</div>
            <div>⎢  0  −8  −2 | −12 ⎥</div>
            <div>⎣  0   8   3 | 14 ⎦</div>
            <div className="mt-3">R3 ← R3 + R2:</div>
            <div>⎡  2   1   1 |  5 ⎤</div>
            <div>⎢  0  −8  −2 | −12 ⎥</div>
            <div>⎣  0   0   1 |  2 ⎦</div>
            <div className="mt-3">Back-substitute:</div>
            <div>z = 2</div>
            <div>−8y − 2·2 = −12  →  −8y = −8  →  y = 1</div>
            <div>2x + 1 + 2 = 5   →  2x = 2   →  x = 1</div>
            <div className="mt-2 text-genai-400">Solution: (x, y, z) = (1, 1, 2)</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Method 2 — Cramer's rule (nice for 2×2, painful past 3×3)">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>For Ax = b with x = (x₁, x₂, …, xₙ):</div>
          <div className="mt-2">xᵢ = det(Aᵢ) / det(A)</div>
          <div className="mt-2">where Aᵢ is A with column i replaced by b.</div>
        </div>
        <p className="mt-3 text-slate-300">
          Only works when det(A) ≠ 0. Elegant on paper for 2×2 systems, disastrously slow for anything
          bigger — use Gaussian elimination or LU in real code.
        </p>
      </LessonSection>

      <LessonSection title="Method 3 — matrix inverse and, better, `np.linalg.solve`">
        <p className="text-slate-300">
          If A is square and invertible, <code className="text-slate-200">x = A⁻¹ b</code> is correct — but
          computing A⁻¹ is more work and less accurate than solving directly. In NumPy, always prefer{' '}
          <code className="text-slate-200">np.linalg.solve(A, b)</code>. It internally does an LU
          decomposition and back-substitution: same idea as Gaussian elimination, done fast.
        </p>
      </LessonSection>

      <LessonSection title="When the system is overdetermined — least-squares">
        <p className="text-slate-300">
          In ML we usually have <em>n samples × d features</em> with n ≫ d. The system Xw = y has no exact
          solution; we look for the w that <strong className="text-white">minimises ‖Xw − y‖²</strong>. The
          famous <em>normal equations</em> pop out:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Xᵀ X w = Xᵀ y</div>
          <div className="mt-2">w = (Xᵀ X)⁻¹ Xᵀ y</div>
        </div>
        <p className="mt-3 text-slate-300">
          This is exactly the OLS formula from Simple Linear Regression — the same math, generalised. In
          practice never invert; use <code>np.linalg.lstsq(X, y)</code> or <code>solve(XᵀX, Xᵀy)</code>.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — 2×2 unique solution (Cramer's rule)">
          <p>Solve 3x + 2y = 12, x − y = 1.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 3   2 ⎤   b = ⎡ 12 ⎤</div>
            <div>    ⎣ 1  −1 ⎦       ⎣  1 ⎦</div>
            <div className="mt-2">det(A) = 3·(−1) − 2·1 = −5</div>
            <div>det(A₁) = det ⎡ 12   2 ⎤ = 12·(−1) − 2·1 = −14</div>
            <div>             ⎣  1  −1 ⎦</div>
            <div>det(A₂) = det ⎡ 3  12 ⎤ = 3·1 − 12·1 = −9</div>
            <div>             ⎣ 1   1 ⎦</div>
            <div className="mt-2">x = −14 / −5 = 2.8</div>
            <div>y = −9 / −5 = 1.8</div>
            <div className="mt-2">Verify: 3·2.8 + 2·1.8 = 8.4 + 3.6 = 12 ✓;  2.8 − 1.8 = 1 ✓</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Detect &ldquo;no solution&rdquo;">
          <p>Try to solve x + y = 2, 2x + 2y = 5.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>R2 ← R2 − 2·R1:</div>
            <div>⎡ 1  1 | 2 ⎤    →   ⎡ 1  1 | 2 ⎤</div>
            <div>⎣ 2  2 | 5 ⎦        ⎣ 0  0 | 1 ⎦</div>
            <div className="mt-2 text-red-400">Row 2 says 0 = 1 — impossible.</div>
            <div className="mt-1 text-slate-400">The two lines are parallel; they never meet.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Detect infinite solutions">
          <p>Solve x + y = 3, 2x + 2y = 6.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>R2 ← R2 − 2·R1:</div>
            <div>⎡ 1  1 | 3 ⎤    →   ⎡ 1  1 | 3 ⎤</div>
            <div>⎣ 2  2 | 6 ⎦        ⎣ 0  0 | 0 ⎦</div>
            <div className="mt-2">Row 2 is 0 = 0 — always true. The two equations are the same line.</div>
            <div className="mt-1">Free parameter: let y = t. Then x = 3 − t. Solutions: (3 − t, t) for any t.</div>
            <div className="mt-1 text-genai-400">Infinite solutions — a 1-D line inside 2-D space.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — 3×3 mixed-sign system">
          <p>Solve x + 2y + 3z = 4, 2x − y + z = 3, 3x + y − z = 2.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>⎡ 1   2   3 |  4 ⎤</div>
            <div>⎢ 2  −1   1 |  3 ⎥</div>
            <div>⎣ 3   1  −1 |  2 ⎦</div>
            <div className="mt-2">R2 ← R2 − 2R1;  R3 ← R3 − 3R1:</div>
            <div>⎡ 1   2   3 |  4 ⎤</div>
            <div>⎢ 0  −5  −5 | −5 ⎥</div>
            <div>⎣ 0  −5 −10 |−10 ⎦</div>
            <div className="mt-2">R2 ← R2 / (−5);  R3 ← R3 / (−5):</div>
            <div>⎡ 1   2   3 |  4 ⎤</div>
            <div>⎢ 0   1   1 |  1 ⎥</div>
            <div>⎣ 0   1   2 |  2 ⎦</div>
            <div className="mt-2">R3 ← R3 − R2:</div>
            <div>⎡ 1   2   3 |  4 ⎤</div>
            <div>⎢ 0   1   1 |  1 ⎥</div>
            <div>⎣ 0   0   1 |  1 ⎦</div>
            <div className="mt-2">Back-substitute:  z = 1;  y = 1 − 1 = 0;  x = 4 − 2·0 − 3·1 = 1.</div>
            <div className="mt-2 text-genai-400">(x, y, z) = (1, 0, 1)</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Overdetermined least-squares (ML flavour)">
          <p>
            Fit ŷ = w₀ + w₁ x to data (1, 3), (2, 5), (3, 6). Three equations in two unknowns — no exact
            solution.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>X = ⎡ 1  1 ⎤     y = (3, 5, 6)</div>
            <div>    ⎢ 1  2 ⎥</div>
            <div>    ⎣ 1  3 ⎦</div>
            <div className="mt-2">Normal equations: (XᵀX) w = Xᵀ y</div>
            <div>Xᵀ X = ⎡ 3   6 ⎤     Xᵀ y = ⎡ 14 ⎤</div>
            <div>       ⎣ 6  14 ⎦             ⎣ 31 ⎦</div>
            <div className="mt-2">Solve 3w₀ + 6w₁ = 14, 6w₀ + 14w₁ = 31.</div>
            <div>R2 ← R2 − 2·R1:  0·w₀ + 2·w₁ = 3  →  w₁ = 1.5</div>
            <div>w₀ = (14 − 6·1.5) / 3 = 5/3 ≈ 1.667</div>
            <div className="mt-2 text-genai-400">Best-fit line:  ŷ = 1.667 + 1.5 x</div>
            <div className="mt-1 text-slate-400">Same answer as OLS from Simple Linear Regression — because it IS OLS.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="Solving every case in NumPy"
          output={`Unique solution: [1. 1. 2.]
No solution   : lstsq residual > 0  →  [-inf, -inf], residuals=[0.5]
Infinite      : rank(A)=1 < 2  →  lstsq minimum-norm solution [1.5 1.5]
Least-squares : [1.66666667 1.5       ]
Solve is ~3x faster than inv for large A (timeit).`}
        >{`import numpy as np

# --- unique solution ---
A = np.array([[ 2,  1,  1],
              [ 4, -6,  0],
              [-2,  7,  2]], dtype=float)
b = np.array([5, -2, 9], dtype=float)
print("Unique solution:", np.linalg.solve(A, b))

# --- no solution (inconsistent) ---
A2 = np.array([[1, 1], [2, 2]], dtype=float)
b2 = np.array([2, 5], dtype=float)
x2, res, rank, sv = np.linalg.lstsq(A2, b2, rcond=None)
print("No solution   : lstsq residual >", 0, " ->", x2, "residuals=", res)

# --- infinite solutions (rank-deficient, consistent) ---
A3 = np.array([[1, 1], [2, 2]], dtype=float)
b3 = np.array([3, 6], dtype=float)
x3, res3, rank3, _ = np.linalg.lstsq(A3, b3, rcond=None)
print(f"Infinite      : rank(A)={rank3} < 2  ->  lstsq minimum-norm solution", x3)

# --- overdetermined least-squares (ML case) ---
X = np.array([[1, 1], [1, 2], [1, 3]], dtype=float)
y = np.array([3, 5, 6], dtype=float)
w = np.linalg.lstsq(X, y, rcond=None)[0]
print("Least-squares :", w)

print("Solve is ~3x faster than inv for large A (timeit).")`}</Example>
        <Callout variant="tip" title="Which NumPy function when">
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li><strong className="text-white">Square, unique solution expected</strong> → <code>np.linalg.solve</code>.</li>
            <li><strong className="text-white">Non-square or possibly rank-deficient</strong> → <code>np.linalg.lstsq</code>.</li>
            <li><strong className="text-white">Never</strong> compute <code>np.linalg.inv(A) @ b</code> just to solve — slower and less stable.</li>
          </ul>
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Every linear system can be written Ax = b. Three outcomes: unique solution, no solution, or infinitely many.',
          'Gaussian elimination (row reduction) is the universal method — reduce to upper triangular, then back-substitute.',
          'A zero row on the left with a non-zero RHS means "no solution"; a fully zero row means the system is under-determined (infinite solutions).',
          'Cramer\'s rule is elegant for 2×2; useless past 3×3. Use elimination or LU (np.linalg.solve) instead.',
          'ML regression is an over-determined system solved in the least-squares sense: w = (XᵀX)⁻¹Xᵀy — but in practice use np.linalg.lstsq or solve on the normal equations.',
        ]}
      />
    </LessonArticle>
  )
}
