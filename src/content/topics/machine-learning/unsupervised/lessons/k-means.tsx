import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function KMeansLesson() {
  return (
    <LessonArticle>
      <Definition term="k-means">
        <p>
          A clustering algorithm that partitions rows into <strong className="text-white">k
          spheres</strong>. Each cluster has a centroid (the mean of its members). A point belongs
          to the nearest centroid. The algorithm alternates assignment and averaging until the
          centroids stop moving.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Objective:  minimise  Σᵢ ‖xᵢ − μ_{'{c(i)}'}‖²</div>
          <div>c(i) = argmin_j ‖xᵢ − μⱼ‖     (assignment)</div>
          <div>μⱼ    = mean of points currently in cluster j</div>
        </div>
      </Definition>

      <LessonSection title="Intuition — drop k pins, then tidy">
        <p className="text-slate-300">
          You drop k pins on a map of customers. Every customer walks to the nearest pin. Then
          you move each pin to the average location of the people standing there. Repeat. The
          pins settle in the middle of the blobs.
        </p>
        <Flowchart
          title="Lloyd’s algorithm"
          chart={`flowchart TB
  A[Pick k initial centroids] --> B[Assign each point to nearest centroid]
  B --> C[Recompute each centroid as the mean]
  C --> D{Changed?}
  D -- yes --> B
  D -- no --> E[Done]`}
        />
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>You expect compact, roughly spherical blobs of similar size.</li>
          <li>You need a fast, scalable default (it is O(m k n) per iteration).</li>
          <li>You will use the centroids later (segment prototypes, vector quantisation, a first step before a classifier).</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Skip it for rings, crescents, or unequal-density blobs — k-means will cut through the
          wrong places. Skip it if k is unknown and you refuse to look at a diagnostic. Scale
          features first or “income” owns every distance.
        </p>
        <Callout variant="tip" title="k-means++">
          Random init can leave two centroids in one blob and none in another. k-means++ spreads
          the first pins: each new centroid is sampled with probability proportional to squared
          distance from the nearest existing pin. Always use it (sklearn default).
        </Callout>
      </LessonSection>

      <LessonSection title="Choosing k — elbow and silhouette">
        <p className="text-slate-300">
          Inertia (within-cluster sum of squares) always falls as k grows — more pins can only
          help the training fit. Plot inertia vs k and look for an elbow. Silhouette (next
          lesson) asks a better question: is each point closer to its own cluster than to the
          next one? Domain knowledge still wins: “we need 4 marketing segments” is a valid k.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — One assignment + update">
          <p>Points: 1, 2, 8, 10. Centroids μ = 2 and 9. Next centroids?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>1, 2 → cluster 2.   8, 10 → cluster 9.</div>
            <div>μ ← 1.5 and 9.0. Already almost done.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Empty cluster">
          <p>A bad init puts two centroids on top of one blob. What can happen?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>One centroid can steal every point. The other is empty — mean is undefined.</div>
            <div>Libraries re-seed the empty centroid. k-means++ makes this rare.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Why scale">
          <p>Features: age (20–80) and spend (₹1k–₹1e6). Unscaled k-means. Who forms the clusters?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Spend. Age is numerically invisible. Standardise first.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Two moons">
          <p>Data is two interlocking crescents. k = 2. What does k-means draw?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A vertical (or diagonal) cut through both moons. Spheres cannot follow a curve.</div>
            <div>Use DBSCAN or a spectral / kernel method, or embed first.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Mini-batch (ML flavour)">
          <p>m = 10 million rows. Full k-means is too slow. What changes in mini-batch k-means?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each iteration updates centroids from a random subset, like SGD vs batch GD.</div>
            <div>Slightly noisier centroids, far cheaper, the usual production default at scale.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — two steps on the 1-D toy">
        <Example
          title="Assignment then mean"
          output={`init μ = [2. 9.]
after 1 iter μ = [1.5 9. ]
labels        = [0 0 1 1]`}
        >{`import numpy as np

x = np.array([1.0, 2.0, 8.0, 10.0])
mu = np.array([2.0, 9.0])
for _ in range(1):
    d = np.abs(x[:, None] - mu[None, :])
    labels = d.argmin(axis=1)
    mu = np.array([x[labels == j].mean() for j in range(2)])
print("init μ = [2. 9.]")
print("after 1 iter μ =", mu)
print("labels        =", labels)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'k-means minimises within-cluster squared distance to k centroids. Assign, then average, until the pins stop moving.',
          'It assumes compact spherical blobs of similar size. Rings, crescents, and unequal densities need a different algorithm.',
          'Always scale features. Always init with k-means++. k is a hyperparameter — elbow, silhouette, or a business constraint.',
          'Inertia always falls with k. An elbow is a hint, not a proof. Empty clusters are an init failure.',
          'Mini-batch k-means is the same idea on subsets — the scalable default when m is huge.',
        ]}
      />
    </LessonArticle>
  )
}
