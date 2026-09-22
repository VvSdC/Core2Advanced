import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DeterminantsAndInverses() {
  return (
    <LessonArticle>
      <Definition term="Determinant and inverse">
        <p>
          The <strong className="text-white">determinant</strong> of a square matrix A, written{' '}
          <code className="text-slate-200">det(A)</code> or <code className="text-slate-200">|A|</code>, is a
          single number that tells you two things at once:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li>How much A stretches or shrinks area/volume (its magnitude).</li>
          <li>Whether A is <strong className="text-white">invertible</strong> — det = 0 means it is not.</li>
        </ul>
        <p className="mt-3">
          The <strong className="text-white">inverse</strong> A⁻¹ is the matrix that undoes A:{' '}
          <code className="text-slate-200">A A⁻¹ = A⁻¹ A = I</code>. Only square matrices with non-zero
          determinant have an inverse.
        </p>
      </Definition>

      <LessonSection title="Determinant — three quick formulas">
        <ContentStep number={1} title="2 × 2 matrix">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ a  b ⎤     det(A) = ad − bc</div>
            <div>    ⎣ c  d ⎦</div>
            <div className="mt-3">A = ⎡ 3  1 ⎤  →  det = 3·4 − 1·2 = 12 − 2 = 10</div>
            <div>    ⎣ 2  4 ⎦</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="3 × 3 matrix — cofactor expansion along row 0">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det = a·(ei − fh) − b·(di − fg) + c·(dh − eg)</div>
            <div className="mt-2">where A = ⎡ a  b  c ⎤</div>
            <div>            ⎢ d  e  f ⎥</div>
            <div>            ⎣ g  h  i ⎦</div>
            <div className="mt-3">Example:  ⎡ 1  2  3 ⎤</div>
            <div>          ⎢ 0  1  4 ⎥</div>
            <div>          ⎣ 5  6  0 ⎦</div>
            <div className="mt-2">det = 1·(1·0 − 4·6) − 2·(0·0 − 4·5) + 3·(0·6 − 1·5)</div>
            <div>    = 1·(0 − 24) − 2·(0 − 20) + 3·(0 − 5)</div>
            <div>    = −24 + 40 − 15 = 1</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Triangular / diagonal matrix — the freebie">
          <p>
            If A is upper or lower triangular (all entries below or above the diagonal are 0), the
            determinant is just the product of the diagonal.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 2  1  3 ⎤   det = 2 · 5 · 7 = 70</div>
            <div>    ⎢ 0  5  4 ⎥</div>
            <div>    ⎣ 0  0  7 ⎦</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Geometric meaning — what determinant is really telling you">
        <ul className="mt-1 list-disc space-y-1 pl-5 text-slate-300">
          <li>
            <strong className="text-white">|det(A)|</strong> = the factor by which A scales areas (2D) or
            volumes (3D). A parallelogram of area 1 becomes a parallelogram of area |det(A)|.
          </li>
          <li>
            <strong className="text-white">sign(det(A))</strong> = whether A flips orientation. Negative
            means A includes a reflection.
          </li>
          <li>
            <strong className="text-white">det(A) = 0</strong> = A collapses space onto a lower dimension
            (line, plane, or a point). There is no way to reverse that flattening — hence no inverse.
          </li>
        </ul>
        <Callout variant="insight" title="One-line memory">
          Determinant = the volume-scaling factor of the transformation. Zero = squashed = not invertible.
        </Callout>
      </LessonSection>

      <LessonSection title="Properties you will use">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Property</th>
                <th className="px-4 py-3">Formula</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Transpose',           'det(Aᵀ) = det(A)'],
                ['Product',             'det(AB) = det(A) · det(B)'],
                ['Scalar multiply',     'det(kA) = kⁿ · det(A)  (A is n × n)'],
                ['Inverse',             'det(A⁻¹) = 1 / det(A)'],
                ['Identity',            'det(I) = 1'],
                ['Row swap',            'flips sign of det'],
                ['Row scale by k',      'multiplies det by k'],
                ['Add multiple of row', 'does not change det'],
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

      <LessonSection title="Matrix inverse — three routes to A⁻¹">
        <ContentStep number={1} title="2 × 2 — the shortcut everyone remembers">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ a  b ⎤       A⁻¹ = 1/det(A) · ⎡  d  −b ⎤</div>
            <div>    ⎣ c  d ⎦                        ⎣ −c   a ⎦</div>
            <div className="mt-3">Swap a↔d, negate b and c, divide by det.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Any size — the cofactor / adjugate formula">
          <p>
            <code className="text-slate-200">A⁻¹ = (1 / det(A)) · adj(A)</code> where <em>adj(A)</em> is the
            transpose of the cofactor matrix. Correct but painful — use Python for n ≥ 3.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Any size — Gauss-Jordan (the practical one)">
          <p>
            Write <code className="text-slate-200">[ A | I ]</code>, do row operations until the left half
            becomes I. The right half is A⁻¹. This is what NumPy&rsquo;s LU-solver is doing internally.
          </p>
        </ContentStep>

        <Callout variant="tip" title="Actual best practice">
          In real code you almost never compute A⁻¹ explicitly. If you have <code>Ax = b</code> and want{' '}
          <code>x</code>, you solve the system directly (<code>np.linalg.solve(A, b)</code>) rather than
          building A⁻¹ first — it is faster and much more numerically stable.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — 2×2 determinant and inverse">
          <p>
            Given A = ⎡ 4  7 ⎤, find det(A) and A⁻¹, then verify AA⁻¹ = I.
          </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 2  6 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det(A) = 4·6 − 7·2 = 24 − 14 = 10</div>
            <div className="mt-2">A⁻¹ = 1/10 · ⎡  6  −7 ⎤ = ⎡  0.6  −0.7 ⎤</div>
            <div>              ⎣ −2   4 ⎦   ⎣ −0.2   0.4 ⎦</div>
            <div className="mt-3">Check AA⁻¹:</div>
            <div>(AA⁻¹)[0,0] = 4·0.6 + 7·(−0.2) = 2.4 − 1.4 = 1.0 ✓</div>
            <div>(AA⁻¹)[0,1] = 4·(−0.7) + 7·0.4 = −2.8 + 2.8 = 0 ✓</div>
            <div>(AA⁻¹)[1,0] = 2·0.6 + 6·(−0.2) = 1.2 − 1.2 = 0 ✓</div>
            <div>(AA⁻¹)[1,1] = 2·(−0.7) + 6·0.4 = −1.4 + 2.4 = 1.0 ✓</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Singular matrix (no inverse)">
          <p>Show that B = ⎡ 2  4 ⎤ has no inverse.</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 1  2 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>det(B) = 2·2 − 4·1 = 4 − 4 = 0  →  B is singular, no inverse.</div>
            <div className="mt-2 text-slate-400">Geometric reason: row 1 is exactly 2 × row 2, so B squashes 2D to a line.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Linear regression normal equations (ML flavour)">
          <p>
            Given X = ⎡ 1  1 ⎤, y = (3, 5, 6), find the coefficients w = (Xᵀ X)⁻¹ Xᵀ y.
          </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎢ 1  2 ⎥</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 1  3 ⎦</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Xᵀ X = ⎡ 3   6 ⎤     Xᵀ y = ⎡ 14 ⎤</div>
            <div>       ⎣ 6  14 ⎦             ⎣ 31 ⎦</div>
            <div className="mt-2">det(XᵀX) = 3·14 − 6·6 = 42 − 36 = 6</div>
            <div>(XᵀX)⁻¹ = 1/6 · ⎡ 14  −6 ⎤ = ⎡  14/6  −1 ⎤</div>
            <div>              ⎣ −6   3 ⎦   ⎣  −1   1/2 ⎦</div>
            <div className="mt-2">w = (XᵀX)⁻¹ Xᵀ y</div>
            <div>  = ⎡ 14/6·14 + (−1)·31 ⎤</div>
            <div>    ⎣  (−1)·14 + (1/2)·31 ⎦</div>
            <div>  = ⎡ 32.667 − 31 ⎤ = ⎡ 1.667 ⎤   →   ŷ = 1.667 + 1.5 · x</div>
            <div>    ⎣ −14 + 15.5 ⎦    ⎣ 1.500 ⎦</div>
            <div className="mt-2 text-slate-400">This is exactly the OLS formula from Simple Linear Regression, written in matrix form.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Determinant tells you about collinearity">
          <p>
            Are the three points P1 = (1, 2), P2 = (3, 5), P3 = (5, 8) collinear?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Form the matrix ⎡ x1  y1  1 ⎤ = ⎡ 1  2  1 ⎤</div>
            <div>                ⎢ x2  y2  1 ⎥   ⎢ 3  5  1 ⎥</div>
            <div>                ⎣ x3  y3  1 ⎦   ⎣ 5  8  1 ⎦</div>
            <div className="mt-2">det = 1·(5·1 − 1·8) − 2·(3·1 − 1·5) + 1·(3·8 − 5·5)</div>
            <div>    = 1·(−3) − 2·(−2) + 1·(−1) = −3 + 4 − 1 = 0</div>
            <div className="mt-2 text-genai-400">det = 0 → the three points lie on a straight line.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Solve a 2×2 system via inverse">
          <p>Solve 4x + 7y = 15, 2x + 6y = 12.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Write A z = b where A = ⎡ 4  7 ⎤,  b = (15, 12)</div>
            <div>                        ⎣ 2  6 ⎦</div>
            <div className="mt-2">A⁻¹ = ⎡  0.6  −0.7 ⎤   (from Problem 1)</div>
            <div>      ⎣ −0.2   0.4 ⎦</div>
            <div className="mt-2">z = A⁻¹ b = ⎡ 0.6·15 + (−0.7)·12 ⎤ = ⎡ 9.0 − 8.4 ⎤ = ⎡ 0.6 ⎤</div>
            <div>           ⎣ −0.2·15 + 0.4·12 ⎦  ⎣ −3.0 + 4.8 ⎦   ⎣ 1.8 ⎦</div>
            <div className="mt-2">x = 0.6, y = 1.8</div>
            <div>Verify: 4·0.6 + 7·1.8 = 2.4 + 12.6 = 15 ✓</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="Determinants and inverses in NumPy"
          output={`det(A) = 9.999999999999998
A^-1 =
 [[ 0.6 -0.7]
 [-0.2  0.4]]
A @ A^-1 =
 [[ 1.  0.]
 [ 0.  1.]]
det(singular) = 0.0
np.linalg.inv raised LinAlgError: Singular matrix
OLS weights via solve: [1.66666667 1.5       ]
Collinear? True`}
        >{`import numpy as np

A = np.array([[4, 7], [2, 6]])
print("det(A) =", np.linalg.det(A))
Ainv = np.linalg.inv(A)
print("A^-1 =\\n", Ainv)
print("A @ A^-1 =\\n", np.round(A @ Ainv, 10))

# Singular matrix
B = np.array([[2, 4], [1, 2]])
print("det(singular) =", np.linalg.det(B))
try:
    np.linalg.inv(B)
except np.linalg.LinAlgError as e:
    print("np.linalg.inv raised LinAlgError:", e)

# OLS the RIGHT way — solve, don't invert
X = np.array([[1, 1], [1, 2], [1, 3]])
y = np.array([3, 5, 6])
w = np.linalg.solve(X.T @ X, X.T @ y)
print("OLS weights via solve:", w)

# Collinearity test
pts = np.array([[1, 2, 1], [3, 5, 1], [5, 8, 1]])
print("Collinear?", np.isclose(np.linalg.det(pts), 0))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The determinant is one number that measures how much a matrix scales area/volume; det = 0 means the matrix squashes space and has no inverse.',
          'For 2×2: det = ad − bc; for triangular matrices det is the product of the diagonal. Prefer NumPy for anything larger.',
          'A⁻¹ exists only when det(A) ≠ 0. It undoes A: A A⁻¹ = A⁻¹ A = I.',
          'The OLS normal equations w = (XᵀX)⁻¹ Xᵀy come straight from this — but in practice use np.linalg.solve, not inv, for speed and numerical stability.',
          'Determinants also detect collinearity of points and linear dependence of rows/columns — both are the "det = 0" story in different clothes.',
        ]}
      />
    </LessonArticle>
  )
}
