import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ClusteringMetrics() {
  return (
    <LessonArticle>
      <Definition term="Clustering metrics">
        <p>
          There is no held-out “accuracy” when labels do not exist. You either score the
          geometry of the partition (internal) or compare it to a rare external ground truth
          (ARI, NMI). Always look at a plot too — a number cannot see a crescent.
        </p>
      </Definition>

      <LessonSection title="Internal scores — no labels required">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Asks</th>
                <th className="px-4 py-3">Range</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Inertia / WCSS', 'How tight are the k-means spheres?', '≥ 0, lower better; always falls with k'],
                ['Silhouette s(i)', 'Closer to own cluster than to the next?', '−1 to 1; mean over points'],
                ['Davies–Bouldin', 'Cluster scatter vs separation of centroids', '≥ 0, lower better'],
                ['Calinski–Harabasz', 'Between-cluster / within-cluster variance', 'higher better'],
              ].map(([m, q, r]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{q}</td>
                  <td className="px-4 py-3 text-slate-400">{r}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>a(i) = mean distance from i to others in its cluster</div>
          <div>b(i) = mean distance from i to the nearest other cluster</div>
          <div>s(i) = (b(i) − a(i)) / max(a(i), b(i))</div>
        </div>
        <Callout variant="tip" title="Silhouette loves spheres">
          A perfect two-moons DBSCAN can score a mediocre silhouette because points on the inner
          bend are closer to the other moon than to the far end of their own. Internal metrics
          assume convex-ish blobs. Do not use them to reject DBSCAN on moons.
        </Callout>
      </LessonSection>

      <LessonSection title="External scores — when you secretly have labels">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>ARI  — adjusted Rand index. Pairwise agreement vs chance. 0 ≈ random, 1 = identical.</div>
          <div>NMI  — normalised mutual information between cluster id and true label.</div>
          <div>Purity — each cluster majority-voted against the true label (optimistic if k is large).</div>
        </div>
        <p className="mt-3 text-slate-300">
          These are for research and for “did we recover the known species?” They are not
          available in a genuine unsupervised deployment.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Silhouette of a point">
          <p>Point i: a = 1, nearest-other b = 4. s(i)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>s = (4 − 1) / 4 = 0.75  (comfortably in the right cluster)</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Negative silhouette">
          <p>a = 5, b = 2. What does s = −0.6 mean?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>i is closer to another cluster than to its own. Mis-assigned, or k is wrong, or the shape is not a sphere.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Elbow vs silhouette">
          <p>Inertia elbow at k = 3, mean silhouette peaks at k = 2. What do you do?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Plot both partitions. The business may need 3 segments even if 2 is tighter geometry.</div>
            <div>Neither number is a judge — they are clues.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — ARI of a permutation">
          <p>Cluster ids are a relabelling of the true labels (0↔1). ARI?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>1. ARI ignores the names of clusters. Only pairwise co-membership matters.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Purity cheat">
          <p>You set k = m (one cluster per point). Purity?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>1.0 — each cluster is pure. Useless. Pair purity with a penalty on k, or use ARI / NMI.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — silhouette for a 1-D two-blob set">
        <Example
          title="Mean silhouette after a perfect 2-split"
          output={`mean silhouette = 0.82`}
        >{`import numpy as np

x = np.array([1.0, 1.5, 2.0, 8.0, 8.5, 9.0])
lab = np.array([0, 0, 0, 1, 1, 1])

def sil(i):
    own = x[lab == lab[i]]
    a = np.mean(np.abs(own - x[i])) if own.size > 1 else 0
    other = [np.mean(np.abs(x[lab == c] - x[i])) for c in set(lab) if c != lab[i]]
    b = min(other)
    return (b - a) / max(a, b)

print(f"mean silhouette = {np.mean([sil(i) for i in range(len(x))]):.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Internal metrics score geometry without labels: inertia (k-means only), silhouette, Davies–Bouldin, Calinski–Harabasz.',
          'Silhouette s = (b − a) / max(a, b). Near 1 is well placed; negative means closer to another cluster. It assumes convex blobs.',
          'Inertia always drops with k. Use an elbow plus silhouette plus a plot — never a single number.',
          'ARI and NMI compare a partition to hidden labels and ignore cluster name permutations. Purity is easy to game by raising k.',
          'If the truth is two moons, trust DBSCAN’s picture over a mediocre silhouette.',
        ]}
      />
    </LessonArticle>
  )
}
