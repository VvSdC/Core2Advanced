import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function DbscanLesson() {
  return (
    <LessonArticle>
      <Definition term="DBSCAN">
        <p>
          Density-Based Spatial Clustering of Applications with Noise. A cluster is a{' '}
          <strong className="text-white">dense region</strong> you can walk through with steps of
          size ε, needing at least min_samples neighbours at each core point. Points that never
          sit in a dense neighbourhood are <strong className="text-white">noise</strong> — not
          forced into a cluster.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Core point:     |{'{x : ‖x − xᵢ‖ ≤ ε}'}| ≥ min_samples</div>
          <div>Border point:   not core, but inside some core point’s ε-ball</div>
          <div>Noise:          neither</div>
        </div>
      </Definition>

      <LessonSection title="Intuition — walk the packed streets, ignore the desert">
        <p className="text-slate-300">
          A city at night. From a bright square you can walk to the next bright square if it is
          within ε and each square has enough neighbours. The connected bright region is a
          cluster — any shape. A lone house in the countryside is noise, not a one-point cluster.
        </p>
        <Callout variant="insight" title="k is not a parameter">
          The number of clusters is an output. You set a density (ε, min_samples). That is why
          DBSCAN can find 3 blobs of different sizes and leave the outliers unlabeled, in one
          pass.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Clusters have irregular shapes (moons, rings) and you have a distance that means something.</li>
          <li>You want automatic outlier tagging, not a forced assignment of every row.</li>
          <li>Density is roughly comparable across clusters (one ε works for all).</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Failures: wildly different densities (one ε is too big for the tight blob and too
          small for the loose one), high dimension (distances concentrate), and a badly scaled
          ε. HDBSCAN drops the single-ε requirement by building a hierarchy of densities.
        </p>
      </LessonSection>

      <LessonSection title="Choosing ε — k-distance plot">
        <p className="text-slate-300">
          For each point, record the distance to its min_samples-th neighbour. Sort those
          distances. The elbow is a reasonable ε: smaller, and even the main blob starts
          fragmenting; larger, and separate blobs glue together. min_samples is often 2·n or a
          small constant (4–10) in 2-D.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Label the points">
          <p>
            1-D points: 1, 2, 3, 10. ε = 1.5, min_samples = 3. Who is core / border / noise?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Neighbourhoods of radius 1.5: {'{1,2}'}, {'{1,2,3}'}, {'{2,3}'}, {'{10}'}.</div>
            <div>Only 2 has 3 neighbours → one core. 1 and 3 are border (reach 2). 10 is noise.</div>
            <div>One cluster {'{1, 2, 3}'}, one noise point.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Two moons">
          <p>Why does DBSCAN separate two interlocking moons when k-means cannot?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each moon is internally dense. You can walk the crescent with steps ε.</div>
            <div>The gap between moons is larger than ε, so the walk cannot jump. Shape does not matter.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — ε too large">
          <p>Same data, ε = 8. What happens?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>10 is now within 8 of 3. Everything becomes one cluster. No noise.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Unequal density">
          <p>A tight 100-point ball and a loose 100-point ball, 5× the radius. One ε?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ε that captures the loose ball glues everything including the space between.</div>
            <div>ε that keeps them apart shreds the loose ball into noise. Classic DBSCAN failure. HDBSCAN or two-scale methods.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Border points and prediction (ML flavour)">
          <p>A new point arrives. How do you assign a cluster in production?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>If it falls in some core point’s ε-ball, inherit that cluster. Else noise (or “other”).</div>
            <div>sklearn’s fit_predict is transductive; for new rows, keep the core points and do this lookup.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — core / border / noise on the 1-D toy">
        <Example
          title="ε = 1.5, min_samples = 3"
          output={`core   [2]
border [1, 3]
noise  [10]`}
        >{`import numpy as np

x = np.array([1.0, 2.0, 3.0, 10.0])
eps, m = 1.5, 3
d = np.abs(x[:, None] - x[None, :])
neigh = d <= eps
counts = neigh.sum(axis=1)
core = x[counts >= m]
is_core = counts >= m
border, noise = [], []
for i, xi in enumerate(x):
    if is_core[i]:
        continue
    if np.any(neigh[i] & is_core):
        border.append(xi)
    else:
        noise.append(xi)
print("core  ", core)
print("border", border)
print("noise ", noise)`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'DBSCAN grows clusters from core points (enough neighbours within ε). Border points attach; the rest is noise.',
          'k is an output. Shape can be anything you can walk with steps of size ε.',
          'Pick ε from a k-distance elbow. min_samples is a small density floor, often ~2n in low dimension.',
          'One ε cannot serve two very different densities. That is the main failure; HDBSCAN is the usual upgrade.',
          'Scale the space first. High-dimensional “density” is mostly fiction — reduce dimensions before DBSCAN.',
        ]}
      />
    </LessonArticle>
  )
}
