import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PcaLesson() {
  return (
    <LessonArticle>
      <Definition term="Principal Component Analysis">
        <p>
          A linear map that rotates the data onto axes of <strong className="text-white">maximum
          variance</strong>. The first principal component is the direction in which the cloud is
          longest; the second is the next-longest direction orthogonal to the first; and so on.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Centre X (subtract the column means).</div>
          <div>Covariance Σ = (1 / m) XᵀX     (or the SVD of X)</div>
          <div>Σ v = λ v     →  v = principal direction, λ = variance along it</div>
          <div>Scores:  Z = X Vₖ     (keep the top k eigenvectors)</div>
        </div>
        <p className="mt-3 text-slate-300">
          This is the SVD / eigen lesson from linear algebra, hired as a feature compressor and
          a noise filter. Reconstruction: X̂ = Z Vₖᵀ + mean.
        </p>
      </Definition>

      <LessonSection title="Intuition — tilt the camera to face the cloud">
        <p className="text-slate-300">
          A pancake of points in 3-D is almost 2-D. PCA finds the plane of the pancake. You drop
          the thin axis and keep most of the story. If the pancake is curved into a U, PCA still
          only finds a flat plane — that is when you need a non-linear embedding.
        </p>
        <Callout variant="beginner" title="Always centre (and usually scale)">
          PCA on uncentred data can pick “the mean vector” as PC1. PCA on unscaled features
          picks the column with the biggest units. Standardise unless the units are already
          comparable and meaningful (pixels 0–1, already-normalised embeddings).
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Linear correlations you want to compress (preprocess for k-means, a linear model, visualisation).</li>
          <li>You need an orthogonal, ordered basis and a % variance explained plot.</li>
          <li>Denoising: drop the smallest components, reconstruct.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          PCA is not clustering. It is not magic for non-linear manifolds (a Swiss roll). It
          can hide a rare class in a discarded component. Do not interpret PC1 as “the cause”
          — it is “the direction of most spread.”
        </p>
      </LessonSection>

      <LessonSection title="How many components?">
        <p className="text-slate-300">
          Scree / explained-variance plot: keep components until the cumulative share hits a
          budget (80–95%), or until the elbow. For visualisation, k = 2 or 3 regardless. For a
          downstream model, treat k as a hyperparameter on the validation set.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Rank-1 cloud">
          <p>Four points: (1, 2), (3, 6), (5, 10), (7, 14). Where is PC1?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>y = 2x exactly. After centering, the cloud is a line along (1, 2).</div>
            <div>PC1 ∥ (1, 2) / √5. PC2 has variance 0. One component reconstructs perfectly.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Explained variance">
          <p>Eigenvalues of Σ: 5, 3, 1, 1. Share in the first two PCs?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Total = 10. First two: 8 / 10 = 80%.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Reconstruction error">
          <p>You keep k components. What is the leftover variance?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Σ_{'{j > k}'} λⱼ  — Eckart–Young: the best rank-k approximation in Frobenius error.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Whitening">
          <p>After PCA, you divide each score by √λⱼ. What did you do?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Whitening: the new covariance is I. Useful before a method that assumes isotropic features (k-means, a spherical GMM).</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Leakage (ML flavour)">
          <p>You fit PCA on train+test, then train a classifier on the scores. What is wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Test rows influenced the axes. Fit PCA on train only; apply the same mean and V to test.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — SVD is PCA">
        <Example
          title="Line of slope 2, then a 2-D noisy cloud"
          output={`PC1 direction ≈ [0.447 0.894]   (the (1, 2) line)
explained (toy 2-D): [0.93 0.07]`}
        >{`import numpy as np

X = np.array([[1, 2], [3, 6], [5, 10], [7, 14]], dtype=float)
Xc = X - X.mean(axis=0)
_, _, Vt = np.linalg.svd(Xc, full_matrices=False)
print("PC1 direction ≈", np.round(Vt[0], 3))

rng = np.random.default_rng(0)
Y = rng.multivariate_normal([0, 0], [[4, 1.8], [1.8, 1]], size=200)
Y -= Y.mean(axis=0)
s = np.linalg.svd(Y, compute_uv=False)
print("explained (toy 2-D):", np.round(s**2 / (s**2).sum(), 2))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'PCA finds orthogonal directions of maximum variance via the eigenvectors of the covariance — or equivalently the SVD of the centred data matrix.',
          'Scores Z = X Vₖ compress; X̂ = Z Vₖᵀ + mean reconstructs. Dropped eigenvalues are the reconstruction error (Eckart–Young).',
          'Centre always. Scale when units differ. Fit on train only.',
          'Use it to compress linear structure, denoise, and visualise. It cannot unroll a curved manifold and it is not a clustering algorithm.',
          'Keep k by cumulative variance, an elbow, or validation on the downstream task.',
        ]}
      />
    </LessonArticle>
  )
}
