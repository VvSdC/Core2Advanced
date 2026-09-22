import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function HierarchicalClustering() {
  return (
    <LessonArticle>
      <Definition term="Hierarchical clustering">
        <p>
          Build a <strong className="text-white">tree of clusters</strong> (a dendrogram) instead
          of a single k. Agglomerative (the usual one) starts with every point as its own cluster
          and merges the two closest clusters until one remains. Divisive does the reverse.
        </p>
        <p className="mt-2 text-slate-300">
          Cut the tree at a height to get any k you want — or read the tree as the product
          (taxonomy of documents, gene families, customer nested segments).
        </p>
      </Definition>

      <LessonSection title="Intuition — keep gluing the nearest pair">
        <p className="text-slate-300">
          Five towns on a map. Glue the two closest. Treat that pair as a new “town” whose
          location is defined by a linkage rule. Repeat. The dendrogram is the history of those
          gluings — short branches are tight groups, long branches are late, loose merges.
        </p>
      </LessonSection>

      <LessonSection title="Linkage — how far is cluster A from cluster B?">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Linkage</th>
                <th className="px-4 py-3">Distance</th>
                <th className="px-4 py-3">Shape it prefers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Single', 'min distance between a point in A and a point in B', 'Chains, can trail (chaining)'],
                ['Complete', 'max pairwise distance', 'Compact balls, sensitive to outliers'],
                ['Average', 'mean pairwise distance', 'A compromise'],
                ['Ward', 'rise in total within-cluster variance if you merge', 'Same objective flavour as k-means'],
              ].map(([name, d, shape]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-slate-400">{d}</td>
                  <td className="px-4 py-3 text-slate-400">{shape}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Ward is the default for Euclidean blobs">
          If you would have tried k-means, Ward hierarchical often finds a similar partition and
          gives you the tree for free. Single linkage is the one that can follow a thin crescent
          — and the one that chains through noise.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>m is small-to-medium (naive agglomerative is O(m² log m) to O(m³)).</li>
          <li>You want to see nested structure, not just one k.</li>
          <li>You need a dendrogram a human can cut after looking at it.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Do not run classic agglomerative on a million rows. Use k-means, mini-batch, or a
          scalable HDBSCAN-style method. Scale features; the distance is the whole model.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — First merge">
          <p>Points on a line: 1, 2, 6, 9. Single linkage. First merge?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Closest pair is 1 and 2 (distance 1). First cluster: {'{1, 2}'}.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Single vs complete next">
          <p>After {'{1, 2}'}, remaining 6 and 9. Distances to the pair?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Single to 6: min(5, 4) = 4.  Complete to 6: max(5, 4) = 5.</div>
            <div>Single to 9: min(8, 7) = 7.  Complete to 9: max(8, 7) = 8.</div>
            <div>Both linkages merge 6 next; they disagree later on noisier maps.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Cutting the tree">
          <p>The dendrogram’s last three merge heights are 1.0, 2.5, 10.0. Where do you cut for 2 clusters?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Anywhere in (2.5, 10). The huge last jump is the tell: two real groups, then a forced merge.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Chaining">
          <p>A line of equally spaced points plus one far outlier. Single linkage looks like?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>It zips the line into one long chain, then attaches the outlier last.</div>
            <div>Complete / Ward would have kept compact groups and isolated the outlier earlier.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Cophenetic correlation (ML flavour)">
          <p>What does a cophenetic correlation near 1 mean?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>The dendrogram heights faithfully replay the original pairwise distances.</div>
            <div>A low value means the tree is a bad summary — try another linkage or another algorithm.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — agglomerative steps on four points">
        <Example
          title="Single-linkage merge order"
          output={`merge ['1', '2'] at 1.0
merge ['6', '9'] at 3.0
merge ['1', '2', '6', '9'] at 4.0`}
        >{`import numpy as np
from itertools import combinations

pts = {"1": 1.0, "2": 2.0, "6": 6.0, "9": 9.0}

def single(A, B):
    return min(abs(pts[a] - pts[b]) for a in A for b in B)

clusters = [{p} for p in pts]
history = []
while len(clusters) > 1:
    pair, best = None, np.inf
    for i, j in combinations(range(len(clusters)), 2):
        d = single(clusters[i], clusters[j])
        if d < best:
            best, pair = d, (i, j)
    i, j = pair
    merged = clusters[i] | clusters[j]
    history.append((sorted(merged), best))
    clusters = [c for k, c in enumerate(clusters) if k not in (i, j)] + [merged]

for members, height in history:
    print(f"merge {members} at {height}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Agglomerative clustering starts with m singletons and merges the closest pair until one cluster remains. The record is a dendrogram.',
          'Linkage defines “closest”: single (min), complete (max), average, Ward (variance). Ward ≈ k-means flavour; single can chain.',
          'Cut the tree where a merge height jumps. That cut is your k — chosen after seeing the structure, not before.',
          'O(m²) memory for the distance matrix. Fine for hundreds or a few thousand rows; not a million-row default.',
          'Cophenetic correlation asks whether the tree still looks like the original distances. If it does not, change linkage or algorithm.',
        ]}
      />
    </LessonArticle>
  )
}
