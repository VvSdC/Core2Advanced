import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function VectorsAndDotProduct() {
  return (
    <LessonArticle>
      <Definition term="Vector">
        <p>
          A <strong className="text-white">vector</strong> is an ordered list of numbers. In 2D it is a pair
          <em> (x, y)</em>; in 3D a triple <em>(x, y, z)</em>; in machine learning it is often hundreds or
          thousands of numbers describing a single item (an image, a word, a user).
        </p>
        <p className="mt-3">
          You can think of a vector two ways: as an <strong className="text-white">arrow</strong> from the
          origin to a point, or as a <strong className="text-white">list of features</strong>. Both are
          correct. The arrow view builds geometric intuition; the list view is what a computer stores.
        </p>
      </Definition>

      <LessonSection title="The three operations you must own">
        <ContentStep number={1} title="Addition and subtraction — element-wise">
          <p>
            Add two vectors of the same length by adding matching entries. Geometrically, addition places one
            arrow at the tip of the other.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>a = (2, 3),  b = (1, 4)</div>
            <div className="mt-1">a + b = (2 + 1, 3 + 4) = (3, 7)</div>
            <div>a − b = (2 − 1, 3 − 4) = (1, −1)</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Scalar multiplication — stretch or shrink">
          <p>
            Multiplying every entry by the same number stretches (|k| &gt; 1), shrinks (|k| &lt; 1), or flips
            the direction (k &lt; 0). The vector stays on the same line through the origin.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>a = (2, 3)</div>
            <div className="mt-1">3a = (6, 9)   → three times as long</div>
            <div>−a  = (−2, −3) → same length, opposite direction</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="The dot product — the workhorse of ML">
          <p>
            Multiply matching entries and sum. The output is a <em>single number</em>, not a vector.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>a · b = a₁·b₁ + a₂·b₂ + … + aₙ·bₙ</div>
            <div className="mt-2">a = (2, 3),  b = (1, 4)</div>
            <div>a · b = 2·1 + 3·4 = 2 + 12 = 14</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Length and angle from the dot product">
        <p>
          Two important formulas the dot product hands us for free:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Length (norm):   ‖a‖ = √(a · a)</div>
          <div>Angle:            cos(θ) = (a · b) / (‖a‖ ‖b‖)</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>a · b &gt; 0 → angle is acute (arrows roughly agree).</li>
          <li>a · b = 0 → arrows are perpendicular (<em>orthogonal</em>).</li>
          <li>a · b &lt; 0 → angle is obtuse (arrows roughly disagree).</li>
        </ul>
        <Callout variant="insight" title="Why ML lives on the dot product">
          Cosine similarity between embeddings, weighted sums in a neuron, attention scores in a transformer,
          projections in PCA — all are dot products under different names.
        </Callout>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Basic operations">
          <p>Given a = (3, −1, 4), b = (2, 5, −2), compute 2a − b, a · b, and ‖a‖.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>2a = (6, −2, 8)</div>
            <div>2a − b = (6 − 2, −2 − 5, 8 − (−2)) = (4, −7, 10)</div>
            <div className="mt-2">a · b = 3·2 + (−1)·5 + 4·(−2) = 6 − 5 − 8 = −7</div>
            <div className="mt-2">‖a‖ = √(9 + 1 + 16) = √26 ≈ 5.10</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Are these vectors orthogonal?">
          <p>Test whether u = (1, 2, −1) and v = (3, −1, 1) are perpendicular.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>u · v = 1·3 + 2·(−1) + (−1)·1 = 3 − 2 − 1 = 0</div>
            <div className="mt-2 text-genai-400">Dot product is 0 → yes, they are orthogonal.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Angle between vectors (ML flavour)">
          <p>
            Two user preference vectors: Alice = (5, 3, 0), Bob = (4, 4, 1). How similar are they? Compute
            cosine similarity.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>a · b   = 5·4 + 3·4 + 0·1 = 20 + 12 + 0 = 32</div>
            <div>‖a‖    = √(25 + 9 + 0) = √34 ≈ 5.831</div>
            <div>‖b‖    = √(16 + 16 + 1) = √33 ≈ 5.745</div>
            <div className="mt-2">cos(θ) = 32 / (5.831 × 5.745) = 32 / 33.502 ≈ 0.955</div>
            <div className="mt-2 text-genai-400">
              cos(θ) ≈ 0.955 → very similar preferences (θ ≈ 17°).
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Projection onto a direction">
          <p>
            Find the projection of v = (3, 4) onto u = (1, 0). Geometrically this is v&rsquo;s &ldquo;shadow&rdquo;
            on the x-axis.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>proj_u(v) = ( (v · u) / (u · u) ) · u</div>
            <div>v · u = 3·1 + 4·0 = 3</div>
            <div>u · u = 1·1 + 0·0 = 1</div>
            <div className="mt-2">proj_u(v) = (3 / 1) · (1, 0) = (3, 0)</div>
            <div className="mt-2 text-slate-400">Exactly what you would draw — the x-component of v.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Unit vector">
          <p>Normalise v = (4, 0, 3) so it has length 1.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>‖v‖ = √(16 + 0 + 9) = √25 = 5</div>
            <div>v̂  = v / ‖v‖ = (4/5, 0, 3/5) = (0.8, 0, 0.6)</div>
            <div className="mt-2">Check: ‖v̂‖ = √(0.64 + 0 + 0.36) = √1 = 1 ✓</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python implementation">
        <Example
          title="Every operation in one page"
          output={`a + b     = [3 7]
a - b     = [1 -1]
3a        = [6 9]
dot       = 14
norm(a)   = 3.605551275463989
cos(theta)= 0.985221833209785
angle deg = 9.86
orthogonal? True
projection= [3. 0.]
unit v    = [0.8 0.  0.6]`}
        >{`import numpy as np

a = np.array([2, 3])
b = np.array([1, 4])

print("a + b     =", a + b)
print("a - b     =", a - b)
print("3a        =", 3 * a)
print("dot       =", np.dot(a, b))               # or  a @ b
print("norm(a)   =", np.linalg.norm(a))
print("cos(theta)=", np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b)))
print(f"angle deg = {np.degrees(np.arccos(_)):.2f}")

u = np.array([1, 2, -1])
v = np.array([3, -1, 1])
print("orthogonal?", np.isclose(np.dot(u, v), 0))

# projection of v onto u
v2, u2 = np.array([3, 4]), np.array([1, 0])
proj = (v2 @ u2) / (u2 @ u2) * u2
print("projection=", proj)

# unit vector
w = np.array([4, 0, 3])
print("unit v    =", w / np.linalg.norm(w))`}</Example>
        <Callout variant="tip" title="In real ML code">
          Never write your own dot product for large vectors — call <code>a @ b</code> or{' '}
          <code>np.dot(a, b)</code>. NumPy calls an optimised BLAS routine that is 100–1000× faster than a
          Python loop.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A vector is an ordered list of numbers — think arrow (geometry) or feature list (data).',
          'Three operations are enough: element-wise add/subtract, scalar multiply, and the dot product (sum of products → one number).',
          'Length is √(a · a); angle is cos θ = (a · b) / (‖a‖ ‖b‖). Zero dot product = perpendicular.',
          'The dot product is the same math behind cosine similarity, neuron activations, attention scores, and projections in PCA.',
          'Use NumPy in real code: a @ b and np.linalg.norm(a) — vectorised BLAS calls, not Python loops.',
        ]}
      />
    </LessonArticle>
  )
}
