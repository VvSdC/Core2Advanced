import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TsneAndUmap() {
  return (
    <LessonArticle>
      <Definition term="t-SNE and UMAP">
        <p>
          Two <strong className="text-white">non-linear embeddings</strong> that try to put
          similar high-dimensional points near each other on a 2-D (or 3-D) map. Unlike PCA they
          do not preserve global axes or variances — they preserve a notion of neighbourhood.
        </p>
        <p className="mt-2 text-slate-300">
          Use them to <em>look</em> at data. Do not use the 2-D coordinates as features for a
          serious model, and do not read cluster areas or empty space as if they were PCA scores.
        </p>
      </Definition>

      <LessonSection title="t-SNE — match neighbour probabilities">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>High-D:  p_{'{j|i}'} ∝ exp(−‖xᵢ − xⱼ‖² / 2σᵢ²)     (σᵢ set by perplexity)</div>
          <div>Low-D:   q_{'{ij}'}  ∝ (1 + ‖yᵢ − yⱼ‖²)⁻¹          (Student-t, heavy tails)</div>
          <div>Minimise KL(P ‖ Q) over the y’s with gradient descent</div>
        </div>
        <p className="mt-3 text-slate-300">
          Perplexity is the effective number of neighbours (typical 5–50). The Student-t in
          low-D lets moderately far points push farther apart — that is why t-SNE makes tight,
          pretty blobs and exaggerates gaps.
        </p>
      </LessonSection>

      <LessonSection title="UMAP — a fuzzy graph, then a layout">
        <p className="text-slate-300">
          UMAP builds a weighted k-neighbour graph in high-D (local Riemannian / fuzzy simplicial
          set), then finds a low-D layout that preserves that graph. In practice: faster than
          t-SNE, more stable across runs, and it keeps a bit more global structure so distant
          groups stay distant more often.
        </p>
        <Callout variant="tip" title="Knobs that actually change the picture">
          t-SNE: perplexity, learning rate, n_iter. UMAP: n_neighbors (local vs global),
          min_dist (how tight the clumps are). Always try two settings before you tell a story.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use which">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3" />
                <th className="px-4 py-3">PCA</th>
                <th className="px-4 py-3">t-SNE</th>
                <th className="px-4 py-3">UMAP</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Preserves', 'Global variance, linear axes', 'Local neighbourhoods', 'Local graph + some global'],
                ['Speed', 'Fastest', 'Slowest', 'Faster than t-SNE'],
                ['New points', 'Apply Vᵀ', 'Not naturally (parametric variants exist)', 'Can transform new points'],
                ['Use as features', 'Yes, often', 'Almost never', 'Rarely — prefer original / PCA'],
                ['Pretty clusters', 'Only if they are linear', 'Very', 'Very'],
              ].map(([row, a, b, c]) => (
                <tr key={row}>
                  <td className="px-4 py-3 font-semibold text-white">{row}</td>
                  <td className="px-4 py-3 text-slate-400">{a}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                  <td className="px-4 py-3 text-slate-400">{c}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Lies the plot will tell you">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Blob size is not cluster size. Density is not prevalence.</li>
          <li>Distance between blobs is not a reliable “how different are these groups.”</li>
          <li>A different random seed can rearrange the map. Repeat the run.</li>
          <li>Colouring by a known label after the fact is fine. Fitting t-SNE on labels is cheating.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Perplexity">
          <p>m = 200. You set perplexity = 200. What did you ask t-SNE to do?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Each point treats almost everyone as a neighbour. Local structure washes out.</div>
            <div>Stay well below m (often 5–50). Perplexity &gt; m is meaningless.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Two nearby Gaussians">
          <p>t-SNE of two overlapping 50-D Gaussians often shows two clean islands. Are they separable?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Not necessarily. The t-tail and the KL push even modest gaps into oceans.</div>
            <div>Confirm with a classifier or a silhouette in the original space, not with the picture.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Swiss roll">
          <p>PCA vs UMAP on a Swiss roll. What should you see?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>PCA: a flattened sideways view, colours mixed. UMAP / t-SNE: the roll unrolled along the manifold (if n_neighbors is right).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Pipeline sin">
          <p>You 2-D t-SNE the whole dataset, then train k-NN on those two coordinates, then report accuracy. Why is this wrong?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>t-SNE used every point, including the “test” ones, to place the map (transductive leakage).</div>
            <div>The 2-D features are also a distorted geometry. Embed on train only, or don’t classify in t-SNE space.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — n_neighbors (ML flavour)">
          <p>UMAP n_neighbors = 5 vs 50 on a dataset with both tiny groups and a global axis.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>5: tiny groups pop; the global axis may shatter. 50: the axis is clearer; micro-clusters blur.</div>
            <div>Report both pictures if the story depends on it.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — t-SNE neighbour kernel on three points">
        <Example
          title="A 1-D sketch of p_{j|i}"
          output={`pairwise high-D affinities (row-normalised, σ=1):
[[0.    0.731 0.269]
 [0.5    0.     0.5  ]
 [0.269  0.731  0.   ]]`}
        >{`import numpy as np

x = np.array([0.0, 1.0, 2.0])
d2 = (x[:, None] - x[None, :]) ** 2
np.fill_diagonal(d2, np.inf)
p = np.exp(-d2 / 2)
p = p / p.sum(axis=1, keepdims=True)
print("pairwise high-D affinities (row-normalised, σ=1):")
print(np.round(p, 3))`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          't-SNE matches high-D neighbour probabilities to a heavy-tailed low-D map by minimising KL(P ‖ Q). Perplexity ≈ how many neighbours count.',
          'UMAP layouts a fuzzy k-neighbour graph. Faster, more stable, slightly more global structure, and it can embed new points.',
          'Both are visualisation tools. Blob size, gap size, and empty space are not PCA-style facts.',
          'Do not train a model on t-SNE / UMAP coordinates computed on the full dataset — that leaks the test set into the map.',
          'Start with PCA for a linear, reproducible baseline picture; reach for UMAP (or t-SNE) when the structure is a manifold, not a plane.',
        ]}
      />
    </LessonArticle>
  )
}
