import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function MatricesAndMultiplication() {
  return (
    <LessonArticle>
      <Definition term="Matrix">
        <p>
          A <strong className="text-white">matrix</strong> is a rectangular grid of numbers with{' '}
          <strong className="text-white">m rows and n columns</strong> — written <em>m × n</em>. Two ways to
          read one:
        </p>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">A table of numbers</strong> — the data view. Row = one item, column = one feature.</li>
          <li><strong className="text-white">A stack of vectors</strong> — either row-vectors or column-vectors, depending on what you want to emphasise.</li>
          <li><strong className="text-white">A linear transformation</strong> — a rule that takes a vector and returns another vector. This view unlocks eigenvalues and SVD later.</li>
        </ul>
      </Definition>

      <LessonSection title="Notation and the operations that just work">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>A = ⎡ 1  2 ⎤</div>
          <div>    ⎣ 3  4 ⎦     shape: 2 × 2</div>
          <div className="mt-2">A[0, 1] = 2   (row 0, column 1)</div>
          <div>Aᵀ  = ⎡ 1  3 ⎤   (transpose — swap rows and columns)</div>
          <div>      ⎣ 2  4 ⎦</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Addition / subtraction</strong> — element-wise, same shape.</li>
          <li><strong className="text-white">Scalar multiply</strong> — every entry × k.</li>
          <li><strong className="text-white">Transpose</strong> — flip across the diagonal.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Matrix multiplication — the one everyone stumbles on">
        <p>
          You <strong className="text-white">cannot</strong> just multiply matrices element-wise. Matrix
          product is a dot product of rows and columns.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>A is m × n     B is n × p    →    A B  is  m × p</div>
          <div className="mt-2">(AB)[i, j] = (row i of A) · (column j of B)</div>
        </div>
        <p className="mt-3 text-slate-300">
          The inner dimensions must match (both are <em>n</em>). If they do not, the product does not exist.
        </p>

        <ContentStep number={1} title="Step-by-step 2×2 example">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 1  2 ⎤       B = ⎡ 5  6 ⎤</div>
            <div>    ⎣ 3  4 ⎦           ⎣ 7  8 ⎦</div>
            <div className="mt-3">(AB)[0,0] = row0·col0 = 1·5 + 2·7 = 5 + 14 = 19</div>
            <div>(AB)[0,1] = row0·col1 = 1·6 + 2·8 = 6 + 16 = 22</div>
            <div>(AB)[1,0] = row1·col0 = 3·5 + 4·7 = 15 + 28 = 43</div>
            <div>(AB)[1,1] = row1·col1 = 3·6 + 4·8 = 18 + 32 = 50</div>
            <div className="mt-3">AB = ⎡ 19  22 ⎤</div>
            <div>     ⎣ 43  50 ⎦</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Order matters — AB ≠ BA (usually)">
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>BA = ⎡ 5·1 + 6·3   5·2 + 6·4 ⎤ = ⎡ 23  34 ⎤</div>
            <div>     ⎣ 7·1 + 8·3   7·2 + 8·4 ⎦   ⎣ 31  46 ⎦</div>
            <div className="mt-2 text-genai-400">AB ≠ BA — matrix multiplication is NOT commutative.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Matrix × vector — the ML shape you will see everywhere">
        <p>
          A matrix times a vector produces a vector. This is what a fully-connected layer is doing:{' '}
          <code className="text-slate-200">Wx = y</code>.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>W = ⎡ 2  1 ⎤     x = ⎡ 4 ⎤     Wx = ⎡ 2·4 + 1·3 ⎤ = ⎡ 11 ⎤</div>
          <div>    ⎣ 0  3 ⎦         ⎣ 3 ⎦          ⎣ 0·4 + 3·3 ⎦   ⎣  9 ⎦</div>
        </div>
        <Callout variant="insight" title="Two views of Wx">
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li><strong className="text-white">Row view</strong> — each output entry is a dot product between a row of W and x. (What a neuron does.)</li>
            <li><strong className="text-white">Column view</strong> — Wx is a linear combination of the columns of W, with coefficients from x. (What PCA reconstructs a point with.)</li>
          </ul>
        </Callout>
      </LessonSection>

      <LessonSection title="Special matrices worth naming">
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">What it looks like</th>
                <th className="px-4 py-3">Why it matters</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Zero',       'All entries 0',                                           'Additive identity: A + 0 = A'],
                ['Identity I', '1s on diagonal, 0s elsewhere',                            'Multiplicative identity: AI = IA = A'],
                ['Diagonal',   'Non-zero only on diagonal',                               'Easy to invert, easy to multiply — the backbone of PCA / SVD'],
                ['Symmetric',  'A = Aᵀ',                                                  'Covariance matrices; guaranteed real eigenvalues'],
                ['Orthogonal', 'Aᵀ A = I  (columns are unit + perpendicular)',            'Rotations and reflections — preserve length and angle'],
                ['Sparse',     'Mostly zeros',                                            'Text (TF-IDF), graphs — special algorithms exploit this'],
              ].map(([n, f, w]) => (
                <tr key={n}>
                  <td className="px-4 py-3 font-semibold text-white">{n}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{f}</td>
                  <td className="px-4 py-3 text-slate-400">{w}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Shape check">
          <p>Which of these products exist? Give the resulting shape.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A: 3×2,  B: 2×4,  C: 4×3</div>
            <div className="mt-2">AB   → (3×2)(2×4) → 3×4  ✓</div>
            <div>BC   → (2×4)(4×3) → 2×3  ✓</div>
            <div>ABC  → (3×2)(2×4)(4×3) → 3×3  ✓</div>
            <div>AC   → (3×2)(4×3) → ✗ inner dims 2 ≠ 4</div>
            <div>BᵀA  → (4×2)(3×2) → ✗ inner dims 2 ≠ 3</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Multiply by hand">
          <p>
            A = ⎡ 1  0  2 ⎤    B = ⎡ 2  1 ⎤
          </p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;⎣ 3  1  −1 ⎦ &nbsp;&nbsp;&nbsp;&nbsp;⎢ 0  1 ⎥</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(2×3)&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;⎣ 3  0 ⎦</p>
          <p>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;(3×2)</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>AB is 2×2.</div>
            <div className="mt-2">(AB)[0,0] = 1·2 + 0·0 + 2·3 = 2 + 0 + 6 = 8</div>
            <div>(AB)[0,1] = 1·1 + 0·1 + 2·0 = 1 + 0 + 0 = 1</div>
            <div>(AB)[1,0] = 3·2 + 1·0 + (−1)·3 = 6 + 0 − 3 = 3</div>
            <div>(AB)[1,1] = 3·1 + 1·1 + (−1)·0 = 3 + 1 + 0 = 4</div>
            <div className="mt-2">AB = ⎡ 8  1 ⎤</div>
            <div>     ⎣ 3  4 ⎦</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — A neuron in matrix form (ML flavour)">
          <p>
            A fully-connected layer has weight matrix W (3 outputs × 4 inputs) and bias b (3 outputs).
            Compute Wx + b for the given inputs.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>W = ⎡ 0.5  −1.0   0.2   0.0 ⎤     x = ⎡ 2 ⎤       b = ⎡  0.1 ⎤</div>
            <div>    ⎢ 1.0   0.0   0.5  −0.5 ⎥         ⎢ 1 ⎥           ⎢ -0.2 ⎥</div>
            <div>    ⎣ 0.0   0.5   1.0   1.0 ⎦         ⎢ 3 ⎥           ⎣  0.3 ⎦</div>
            <div>                                      ⎣ 4 ⎦</div>
            <div className="mt-2">Row 0: 0.5·2 − 1·1 + 0.2·3 + 0·4 = 1 − 1 + 0.6 + 0 = 0.6</div>
            <div>Row 1: 1·2 + 0·1 + 0.5·3 − 0.5·4 = 2 + 0 + 1.5 − 2 = 1.5</div>
            <div>Row 2: 0·2 + 0.5·1 + 1·3 + 1·4 = 0 + 0.5 + 3 + 4 = 7.5</div>
            <div className="mt-2">Wx + b = (0.6, 1.5, 7.5) + (0.1, −0.2, 0.3) = (0.7, 1.3, 7.8)</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Transpose identity">
          <p>Prove (AB)ᵀ = BᵀAᵀ on a small example.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A = ⎡ 1  2 ⎤   B = ⎡ 5  6 ⎤   AB = ⎡ 19  22 ⎤   (AB)ᵀ = ⎡ 19  43 ⎤</div>
            <div>    ⎣ 3  4 ⎦       ⎣ 7  8 ⎦        ⎣ 43  50 ⎦             ⎣ 22  50 ⎦</div>
            <div className="mt-2">Bᵀ = ⎡ 5  7 ⎤     Aᵀ = ⎡ 1  3 ⎤</div>
            <div>     ⎣ 6  8 ⎦          ⎣ 2  4 ⎦</div>
            <div className="mt-2">BᵀAᵀ = ⎡ 5·1 + 7·2   5·3 + 7·4 ⎤ = ⎡ 19  43 ⎤ ✓</div>
            <div>       ⎣ 6·1 + 8·2   6·3 + 8·4 ⎦   ⎣ 22  50 ⎦</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Batch inputs at once">
          <p>
            In ML we usually stack many samples into a matrix X (n samples × d features). Compute predictions
            ŷ = Xw for w = (0.5, −1, 2) on this batch:
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>X = ⎡ 1  2  0 ⎤        w = (0.5, −1, 2)</div>
            <div>    ⎢ 0  1  3 ⎥</div>
            <div>    ⎣ 2  0  1 ⎦</div>
            <div className="mt-2">Row 0: 0.5·1 − 1·2 + 2·0 = 0.5 − 2 + 0 = −1.5</div>
            <div>Row 1: 0.5·0 − 1·1 + 2·3 = 0 − 1 + 6 = 5</div>
            <div>Row 2: 0.5·2 − 1·0 + 2·1 = 1 + 0 + 2 = 3</div>
            <div className="mt-2">ŷ = (−1.5, 5, 3)   — three predictions in one shot.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="All operations with NumPy"
          output={`A shape (2, 2)
A + B =
 [[ 6  8]
 [10 12]]
A @ B =
 [[19 22]
 [43 50]]
B @ A =
 [[23 34]
 [31 46]]
Element-wise A * B =
 [[ 5 12]
 [21 32]]
Aᵀ =
 [[1 3]
 [2 4]]
Wx + b = [0.7 1.3 7.8]
Batch ŷ = [-1.5  5.   3. ]`}
        >{`import numpy as np

A = np.array([[1, 2], [3, 4]])
B = np.array([[5, 6], [7, 8]])

print("A shape", A.shape)
print("A + B =\\n", A + B)
print("A @ B =\\n", A @ B)              # matrix multiply
print("B @ A =\\n", B @ A)              # NOT the same
print("Element-wise A * B =\\n", A * B) # WRONG for matrix mult
print("Aᵀ =\\n", A.T)

# A neuron layer
W = np.array([[0.5, -1.0, 0.2, 0.0],
              [1.0,  0.0, 0.5, -0.5],
              [0.0,  0.5, 1.0,  1.0]])
x = np.array([2, 1, 3, 4])
b = np.array([0.1, -0.2, 0.3])
print("Wx + b =", W @ x + b)

# Batch of samples
X = np.array([[1, 2, 0], [0, 1, 3], [2, 0, 1]])
w = np.array([0.5, -1, 2])
print("Batch ŷ =", X @ w)`}</Example>
        <Callout variant="tip" title="Common bug">
          <code>A * B</code> in NumPy is element-wise multiplication (Hadamard product), NOT matrix
          multiplication. Use <code>A @ B</code> or <code>np.matmul(A, B)</code>. Half of &ldquo;my model does
          nothing&rdquo; bugs come from this one operator confusion.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A matrix is m × n numbers — read as a table, a stack of vectors, or a linear transformation depending on the task.',
          'Matrix multiplication is dot products of rows and columns: (m × n)(n × p) = (m × p). Inner dimensions must match.',
          'Order matters: AB ≠ BA in general. Transpose flips the shape: (AB)ᵀ = BᵀAᵀ.',
          'Matrix × vector is what a fully-connected layer is doing. Matrix × batch matrix (X × W) computes many samples at once.',
          'Learn the special matrices: identity (multiplicative unit), diagonal (fast to invert), symmetric (covariance), orthogonal (rotations).',
          'In NumPy use @ for matrix multiply — never * (which is element-wise). This one operator causes half the shape bugs in ML code.',
        ]}
      />
    </LessonArticle>
  )
}
