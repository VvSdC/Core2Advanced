import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DistanceMetrics() {
  return (
    <LessonArticle>
      <Definition term="Distance / similarity">
        <p>
          A <strong className="text-white">distance</strong> d(x, y) says how far apart two points are; a
          <strong className="text-white"> similarity</strong> s(x, y) says how close they are. For a true{' '}
          <strong className="text-white">metric</strong>, d must satisfy four axioms:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li>d(x, y) ≥ 0.</li>
          <li>d(x, y) = 0 iff x = y.</li>
          <li>d(x, y) = d(y, x) (symmetric).</li>
          <li>d(x, z) ≤ d(x, y) + d(y, z) (triangle inequality).</li>
        </ol>
        <p className="mt-3 text-slate-300">
          Anything that skips one is a &ldquo;pseudo-metric&rdquo;, &ldquo;semi-metric&rdquo; or
          &ldquo;divergence&rdquo; (KL is a divergence, not a metric).
        </p>
      </Definition>

      <LessonSection title="The Minkowski family — one formula, three famous cases">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>d_p(x, y) = ( Σᵢ |xᵢ − yᵢ|^p )^(1/p)</div>
        </div>
        <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">p</th>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Formula</th>
                <th className="px-4 py-3">Feel</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['1',  'Manhattan (L1)', 'Σ |xᵢ − yᵢ|',            'Grid distance, robust to outliers'],
                ['2',  'Euclidean (L2)', '√ Σ (xᵢ − yᵢ)²',         'Straight line, geometry-friendly'],
                ['∞',  'Chebyshev (L∞)', 'max_i |xᵢ − yᵢ|',        'Worst-coordinate difference'],
              ].map(([p, name, formula, feel]) => (
                <tr key={p}>
                  <td className="px-4 py-3 font-mono font-semibold text-white">{p}</td>
                  <td className="px-4 py-3 text-white">{name}</td>
                  <td className="px-4 py-3 font-mono text-slate-400">{formula}</td>
                  <td className="px-4 py-3 text-slate-400">{feel}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Which one should I use?">
          Numeric features with different scales → normalise, then Euclidean. Pixel grids or robust
          settings → Manhattan. Bounding-box-style comparisons → Chebyshev.
        </Callout>
      </LessonSection>

      <LessonSection title="Cosine similarity — angles, not magnitudes">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>cos(x, y) = (x · y) / (‖x‖ ‖y‖)         ∈ [−1, 1]</div>
          <div className="mt-2">cosine distance = 1 − cos(x, y)         ∈ [0, 2]</div>
        </div>
        <p className="mt-3 text-slate-300">
          Only <em>direction</em> matters, not vector length. Two documents with the same topic get
          cos ≈ 1 even if one is twice as long as the other. Every dense-vector retrieval system defaults
          to cosine.
        </p>
        <Callout variant="insight" title="Cosine ≈ Euclidean once you normalise">
          For unit vectors ‖x‖ = ‖y‖ = 1, the Euclidean distance and cosine distance are monotonically
          related: ‖x − y‖² = 2 − 2 cos(x, y). That is why FAISS lets you use inner-product search on
          L2-normalised vectors as an efficient cosine index.
        </Callout>
      </LessonSection>

      <LessonSection title="Hamming, Jaccard — set / string similarity">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Hamming(x, y) = number of positions where xᵢ ≠ yᵢ   (equal-length only)</div>
          <div className="mt-2">Jaccard(A, B) = |A ∩ B| / |A ∪ B|          → distance = 1 − Jaccard</div>
        </div>
        <ul className="mt-3 list-disc space-y-1 pl-5 text-slate-300">
          <li>Hamming: bit-vector distance, code-book comparison, error-correction.</li>
          <li>Jaccard: set overlap — MinHash for near-duplicate document detection, deduplication.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Edit distance (Levenshtein) — strings that resize">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Levenshtein(x, y) = min number of insert / delete / replace ops to change x into y.</div>
        </div>
        <p className="mt-3 text-slate-300">
          Computed with a classic O(n·m) DP. Powers fuzzy string matching (search, spelling correction,
          entity linking) and DNA sequence alignment.
        </p>
      </LessonSection>

      <LessonSection title="Mahalanobis — distance that respects the covariance">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>d_M(x, y) = √( (x − y)ᵀ Σ⁻¹ (x − y) )</div>
        </div>
        <p className="mt-3 text-slate-300">
          Whitening baked in — one unit of Mahalanobis distance equals one standard deviation along
          <em> every</em> direction of Σ. Anomaly-detection and Gaussian-based outlier flagging use this
          instead of raw Euclidean because it corrects for correlated features.
        </p>
      </LessonSection>

      <LessonSection title="Cheat sheet — which distance for which data">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Pick</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Dense embeddings (text, image, audio)',    'Cosine (or L2 on normalised vectors)'],
                ['Raw numeric features (scaled)',            'Euclidean'],
                ['Raw numeric with correlated features',     'Mahalanobis'],
                ['Sparse bag-of-words / one-hot',            'Jaccard / cosine (TF-IDF)'],
                ['Binary strings, hash codes',               'Hamming'],
                ['Fuzzy strings (names, code snippets)',     'Levenshtein / token-Jaccard'],
                ['Probability distributions',                'KL, JSD, or Wasserstein'],
                ['Time series with warping',                 'Dynamic time warping (DTW)'],
              ].map(([d, p]) => (
                <tr key={d}>
                  <td className="px-4 py-3 font-semibold text-white">{d}</td>
                  <td className="px-4 py-3 text-slate-400">{p}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Euclidean vs Manhattan">
          <p>x = (0, 0), y = (3, 4). Compute d₁, d₂, d∞.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>L1  = |0 − 3| + |0 − 4| = 7</div>
            <div>L2  = √(9 + 16)        = 5</div>
            <div>L∞  = max(3, 4)        = 4</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Cosine similarity (ML flavour)">
          <p>
            Two document embeddings: a = (1, 0, 2), b = (2, 0, 4). Compute cosine similarity and Euclidean
            distance.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>a · b = 2 + 0 + 8 = 10.</div>
            <div>‖a‖ = √5,   ‖b‖ = √20 = 2 √5.  Product = 10.</div>
            <div>cos = 10 / 10 = 1.0        → same direction, perfectly similar.</div>
            <div>Euclidean = √( 1 + 0 + 4 ) = √5 ≈ 2.236     → non-zero despite same direction.</div>
            <div className="mt-2 text-genai-400">
              Cosine reveals the two vectors are proportional; Euclidean treats magnitude as difference.
              That is the whole reason retrieval defaults to cosine.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Jaccard on two shingle sets">
          <p>
            Doc A shingles = {`{"the cat", "cat sat", "sat on"}`}. Doc B shingles = {`{"cat sat", "sat on",
            "on mat"}`}. Compute Jaccard.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>|A ∩ B| = 2 ({"cat sat"}, {"sat on"}).</div>
            <div>|A ∪ B| = 4 ({"the cat"}, {"cat sat"}, {"sat on"}, {"on mat"}).</div>
            <div>Jaccard = 2 / 4 = 0.5.</div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Hamming distance">
          <p>Compare 8-bit codes 01110011 vs 01001011.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>XOR      = 00111000.  Popcount = 3.</div>
            <div>Hamming  = 3.</div>
            <div className="mt-1 text-slate-400">Hamming is a single XOR + popcount at the hardware level.</div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Levenshtein by hand">
          <p>Levenshtein(&ldquo;kitten&rdquo;, &ldquo;sitting&rdquo;).</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>kitten → sitten (k → s)</div>
            <div>sitten → sittin (e → i)</div>
            <div>sittin → sitting (insert g)</div>
            <div>Distance = 3.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Cosine vs Euclidean equivalence (ML flavour)">
          <p>
            L2-normalise a and b, then show ‖x − y‖² = 2 − 2 · cos(x, y) so cosine ranking equals L2 ranking.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>‖x − y‖² = ‖x‖² + ‖y‖² − 2 x · y</div>
            <div>         = 1 + 1 − 2 cos(x, y) = 2 − 2 cos(x, y).</div>
            <div className="mt-2 text-genai-400">
              Monotonic transformation → L2 nearest-neighbour on unit vectors gives the same top-k as
              cosine. FAISS exploits this to reuse its L2 kernels for cosine search.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — every distance in NumPy / SciPy">
        <Example
          title="One-liners for the whole zoo"
          output={`L1  = 7.0  L2 = 5.0  L∞ = 4.0
cos(a, b)           = 1.0000
Euclidean(a, b)     = 2.2361
Jaccard(A, B)       = 0.5000
Hamming (8-bit)     = 3
Levenshtein         = 3
Mahalanobis         = 2.4495
Cosine ≡ L2 on unit vectors: 0.0000`}
        >{`import numpy as np
from scipy.spatial.distance import cityblock, euclidean, chebyshev, cosine, hamming, cdist
try:
    from Levenshtein import distance as lev
except ImportError:
    def lev(a, b):
        # tiny DP fallback
        m, n = len(a), len(b)
        dp   = np.zeros((m + 1, n + 1), dtype=int)
        dp[:, 0] = np.arange(m + 1)
        dp[0, :] = np.arange(n + 1)
        for i in range(1, m + 1):
            for j in range(1, n + 1):
                dp[i, j] = min(dp[i-1, j] + 1,
                               dp[i, j-1] + 1,
                               dp[i-1, j-1] + (a[i-1] != b[j-1]))
        return int(dp[m, n])

x, y = np.array([0, 0]), np.array([3, 4])
print(f"L1  = {cityblock(x, y)}  L2 = {euclidean(x, y)}  L∞ = {chebyshev(x, y)}")

a, b = np.array([1, 0, 2]), np.array([2, 0, 4])
print(f"cos(a, b)           = {1 - cosine(a, b):.4f}")
print(f"Euclidean(a, b)     = {euclidean(a, b):.4f}")

A = {"the cat", "cat sat", "sat on"}
B = {"cat sat", "sat on", "on mat"}
print(f"Jaccard(A, B)       = {len(A & B) / len(A | B):.4f}")

# Hamming on bit strings
c1 = np.array([0, 1, 1, 1, 0, 0, 1, 1])
c2 = np.array([0, 1, 0, 0, 1, 0, 1, 1])
print(f"Hamming (8-bit)     = {(c1 != c2).sum()}")

# Levenshtein
print(f"Levenshtein         = {lev('kitten', 'sitting')}")

# Mahalanobis
rng   = np.random.default_rng(0)
X     = rng.multivariate_normal([0, 0], [[1, 0.8], [0.8, 1]], size=1000)
cov   = np.cov(X.T)
inv   = np.linalg.inv(cov)
diff  = np.array([2, 2])
maha  = np.sqrt(diff @ inv @ diff)
print(f"Mahalanobis         = {maha:.4f}")

# Cosine ↔ L2 on unit vectors
u, v = a / np.linalg.norm(a), b / np.linalg.norm(b)
l2sq = np.sum((u - v) ** 2)
identity = l2sq - (2 - 2 * (u @ v))
print(f"Cosine ≡ L2 on unit vectors: {identity:.4f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A metric satisfies non-negativity, identity of indiscernibles, symmetry, and triangle inequality. KL, cosine "distance", and JSD each break at least one axiom.',
          'Minkowski family: L1 (Manhattan) is robust, L2 (Euclidean) is the geometric default, L∞ (Chebyshev) captures worst-coordinate gaps.',
          'Cosine ignores magnitude and dominates dense-vector retrieval. On L2-normalised vectors, cosine and Euclidean give the same nearest-neighbour ranking.',
          'Hamming (bits), Jaccard (sets), and Levenshtein (strings) are the discrete siblings — used in dedup, near-duplicate detection, and fuzzy matching.',
          'Mahalanobis whitens the space with Σ⁻¹, so 1 unit = 1 standard deviation along any direction — the right choice for correlated-feature anomaly detection.',
          'Rule of thumb: dense embeddings → cosine; scaled numerics → Euclidean; correlated numerics → Mahalanobis; sparse sets → Jaccard; distributions → KL / JSD / Wasserstein.',
        ]}
      />
    </LessonArticle>
  )
}
