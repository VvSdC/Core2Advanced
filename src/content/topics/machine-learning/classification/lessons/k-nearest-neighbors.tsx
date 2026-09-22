import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function KNearestNeighbors() {
  return (
    <LessonArticle>
      <Definition term="k-Nearest Neighbours (k-NN)">
        <p>
          An <strong className="text-white">instance-based</strong> algorithm: it stores the
          training set and, at predict time, finds the k closest rows to the query. Classification
          is a majority vote of those neighbours; regression is their mean.
        </p>
        <p className="mt-2 text-slate-300">
          There is no θ to fit. The “model” is the data plus a distance and a k.
        </p>
      </Definition>

      <LessonSection title="Intuition — ask the neighbourhood">
        <p className="text-slate-300">
          A new email looks like these 5 past emails; 4 of them were spam → call it spam. That is
          the whole algorithm. Closeness needs a distance (usually Euclidean after scaling, or
          cosine for text).
        </p>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Small-to-medium m, low-to-moderate n, a distance that actually means “similar.”</li>
          <li>You want a strong non-linear baseline with almost no training time.</li>
          <li>Irregular decision regions — k-NN can draw any shape the data supports.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Avoid it when m is huge (every query scans the set unless you index), when n is large
          (curse of dimensionality — distances concentrate), or when features are on wild
          different scales and you forgot to standardise.
        </p>
      </LessonSection>

      <LessonSection title="How it works">
        <ol className="list-decimal space-y-1 pl-5 text-slate-300">
          <li>Store every training (x, y). Optionally build a KD-tree / ball tree / HNSW index.</li>
          <li>For a query x, compute d(x, xᵢ) for stored rows (or retrieve approx neighbours).</li>
          <li>Take the k smallest distances. Vote (class) or average (regression). Optional: weight by 1/d.</li>
        </ol>
        <Callout variant="insight" title="k is a bias-variance knob">
          k = 1 memorizes — low bias, high variance, noisy boundaries. Large k smooths toward the
          global majority — high bias. Cross-validate k. Odd k avoids binary ties.
        </Callout>
      </LessonSection>

      <LessonSection title="The curse of dimensionality">
        <p className="text-slate-300">
          In high dimension, nearest and farthest points have almost the same distance. “Closest”
          stops meaning anything. Fix: drop / embed features (PCA, a learned embedding), or do
          not use k-NN there.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Vote by hand">
          <p>
            Query at x = 3. Training: (1, A), (2, A), (4, B), (7, B), (8, B). k = 3, Euclidean
            on 1-D. Label?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Distances: 2, 1, 1, 4, 5. Three nearest: (2, A), (4, B), (1, A).</div>
            <div>Vote: A, A, B → A.</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Scale matters">
          <p>Features: age (20–80) and income (₹20k–₹2e6). Unscaled Euclidean. Who wins?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Income dominates every distance. Age is almost ignored.</div>
            <div>Standardise (or min-max) each column before k-NN.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — k = n">
          <p>What does k-NN become if k equals the training size?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>A constant classifier: always the global majority class (or the global mean).</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — 1-NN train accuracy">
          <p>Training accuracy of 1-NN with no duplicate x and Euclidean distance?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>100% — each point&rsquo;s nearest neighbour is itself. Useless as a metric.</div>
            <div>Always evaluate k-NN with CV or a held-out set.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Distance choice (ML flavour)">
          <p>Bag-of-words vectors, mostly zeros. Euclidean or cosine?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Cosine (or Euclidean on L2-normalised vectors). Length of the document should not dominate.</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — a 12-line k-NN">
        <Example
          title="Majority vote on the 1-D toy"
          output={`k=3 label for x=3 → A`}
        >{`import numpy as np
from collections import Counter

X = np.array([1.0, 2.0, 4.0, 7.0, 8.0])
y = np.array(["A", "A", "B", "B", "B"])
x, k = 3.0, 3
nn = np.argsort(np.abs(X - x))[:k]
label = Counter(y[nn]).most_common(1)[0][0]
print(f"k=3 label for x=3 → {label}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'k-NN is lazy: no training of weights, just store the data and vote among the k closest at query time.',
          'k trades bias and variance. Always choose it with CV — 1-NN train accuracy is a lie.',
          'Scale features. Pick a distance that matches the data (Euclidean, cosine, Hamming).',
          'High dimension makes “nearest” meaningless. Reduce features or do not use k-NN.',
          'Prediction cost grows with m unless you add an ANN index. Great baseline, rare production default at scale.',
        ]}
      />
    </LessonArticle>
  )
}
