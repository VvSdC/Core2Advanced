import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function NaiveBayesLesson() {
  return (
    <LessonArticle>
      <Definition term="Naive Bayes">
        <p>
          A <strong className="text-white">probabilistic classifier</strong> that applies Bayes&rsquo;
          theorem with one brutal assumption: features are independent given the class.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(y | x) ∝ P(y) · Πⱼ P(xⱼ | y)</div>
          <div>ŷ = argmax_y  [ log P(y) + Σⱼ log P(xⱼ | y) ]</div>
        </div>
        <p className="mt-3 text-slate-300">
          “Naive” is the product. Features in text are not independent (“New” and “York”). The
          model still works astonishingly well as a baseline because the ranking of classes often
          survives a wrong independence assumption.
        </p>
      </Definition>

      <LessonSection title="Intuition — multiply the clues">
        <p className="text-slate-300">
          Start from the base rate of spam. Each word is a clue that multiplies (or shrinks) that
          belief. “free” is common in spam; “meeting” is common in ham. Naive Bayes multiplies
          those likelihoods and picks the class with the bigger posterior.
        </p>
        <Callout variant="insight" title="This is the Bayes lesson, productionised">
          Same formula as the medical-test problem. The “test” is now every feature, assumed
          independent so you never have to estimate a full joint P(x | y).
        </Callout>
      </LessonSection>

      <LessonSection title="The three common likelihoods">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Flavour</th>
                <th className="px-4 py-3">P(xⱼ | y)</th>
                <th className="px-4 py-3">Data</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Bernoulli NB', 'P(word present | class)', 'Binary bag-of-words, short text'],
                ['Multinomial NB', 'P(count | class) via word frequencies', 'TF / count vectors, longer text'],
                ['Gaussian NB', 'Normal(μ_{j,y}, σ²_{j,y})', 'Continuous features'],
              ].map(([name, p, data]) => (
                <tr key={name}>
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-slate-400">{p}</td>
                  <td className="px-4 py-3 text-slate-400">{data}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="When to use it">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>Text classification, spam, language ID — high-n, sparse, discrete features.</li>
          <li>You need a model that trains in one pass over counts (minutes, not hours).</li>
          <li>You want a surprisingly strong baseline before a linear SVM or a transformer.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Skip it when features are strongly dependent <em>and</em> you need calibrated
          probabilities (the product over-counts repeated evidence). Also skip Gaussian NB on
          wildly non-normal continuous data without transforming.
        </p>
      </LessonSection>

      <LessonSection title="Laplace smoothing — never multiply by zero">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>P(word | class) = (count + α) / (total_in_class + α V)</div>
        </div>
        <p className="mt-3 text-slate-300">
          α = 1 is add-one. Without it, one unseen word in a class zeros that class&rsquo;s
          posterior. This is the same additive-smoothing MAP you saw with a Dirichlet / Beta prior.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Spam posterior by hand">
          <p>
            P(spam) = 0.3. Word “free”: P(free | spam) = 0.7, P(free | ham) = 0.05. Email contains
            only that word as the feature. P(spam | free)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(free) = 0.7·0.3 + 0.05·0.7 = 0.245</div>
            <div>P(spam | free) = 0.21 / 0.245 ≈ 0.857</div>
          </div>
        </ContentStep>
        <ContentStep number={2} title="Problem 2 — Zero without smoothing">
          <p>A ham email contains “bitcoin”, never seen in ham. What happens to P(ham | email)?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>P(bitcoin | ham) = 0 → whole product for ham is 0 → posterior 0.</div>
            <div>Add-one: P = (0+1) / (N_ham + V) &gt; 0. The class can still win on other words.</div>
          </div>
        </ContentStep>
        <ContentStep number={3} title="Problem 3 — Why log space">
          <p>A 400-word email, each P(w | y) ≈ 0.01. What is Π P(w | y) in float64?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>0.01⁴⁰⁰ = 10⁻⁸⁰⁰ — underflows to 0.</div>
            <div>Sum log P(w | y) instead. Same argmax, no underflow.</div>
          </div>
        </ContentStep>
        <ContentStep number={4} title="Problem 4 — Dependent features">
          <p>“New” and “York” almost always co-occur. How does NB treat them?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>As two independent clues — it double-counts the city signal.</div>
            <div>Posteriors become over-confident. The predicted class can still be right.</div>
          </div>
        </ContentStep>
        <ContentStep number={5} title="Problem 5 — Multinomial counts (ML flavour)">
          <p>
            Class sports has 100 tokens; “goal” appears 8 times. V = 50, α = 1. Smoothed
            P(goal | sports)?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>(8 + 1) / (100 + 1·50) = 9 / 150 = 0.06</div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — Bernoulli NB on a tiny vocabulary">
        <Example
          title="Two words, two classes"
          output={`log P(spam | [free, !meeting]) > log P(ham | …)  → spam
smoothed P(free | ham) = 0.167`}
        >{`import numpy as np

# rows: [has_free, has_meeting], labels 1=spam
X = np.array([[1, 0], [1, 0], [1, 1], [0, 1], [0, 1], [0, 1]])
y = np.array([1, 1, 1, 0, 0, 0])
alpha, V = 1.0, 2

def log_likelihood(label, x):
    mask = y == label
    prior = np.log(mask.mean())
    # Bernoulli with Laplace
    p = (X[mask].sum(0) + alpha) / (mask.sum() + 2 * alpha)
    return prior + np.sum(x * np.log(p) + (1 - x) * np.log(1 - p))

x = np.array([1, 0])  # "free", no "meeting"
print("log P(spam | [free, !meeting]) > log P(ham | …)  →",
      "spam" if log_likelihood(1, x) > log_likelihood(0, x) else "ham")
p_free_ham = (X[y == 0, 0].sum() + alpha) / ((y == 0).sum() + 2 * alpha)
print(f"smoothed P(free | ham) = {p_free_ham:.3f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Naive Bayes: ŷ = argmax_y P(y) Π P(xⱼ | y). The product is the naive independence assumption.',
          'Bernoulli / Multinomial for text; Gaussian for continuous features. Train is just counting (plus a mean/variance).',
          'Laplace / Dirichlet smoothing stops unseen features from zeroing a class. Always use it.',
          'Work in log space. Dependent features make probabilities over-confident; class rankings often remain useful.',
          'Best as a fast text baseline. Beat it with a linear SVM or a neural model when you need accuracy and calibration.',
        ]}
      />
    </LessonArticle>
  )
}
