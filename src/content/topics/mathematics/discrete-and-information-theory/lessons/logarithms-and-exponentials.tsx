import {
  Callout,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function LogarithmsAndExponentials() {
  return (
    <LessonArticle>
      <Definition term="Exponentials and logarithms">
        <p>
          Exponentials <em>grow</em> by repeated multiplication; logarithms <em>reverse</em> them by asking
          &ldquo;how many times did you multiply?&rdquo;.
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>bˣ = y      ⇔      log_b(y) = x</div>
          <div className="mt-2">Common bases:  10 (log₁₀), 2 (log₂, bits), e ≈ 2.71828 (ln, natural log)</div>
        </div>
      </Definition>

      <LessonSection title="Exponent rules — the seven identities">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>bˣ · bʸ = bˣ⁺ʸ            (product)</div>
          <div>bˣ / bʸ = bˣ⁻ʸ            (quotient)</div>
          <div>(bˣ)ʸ   = bˣʸ              (power of a power)</div>
          <div>(a b)ˣ  = aˣ · bˣ         (distributive)</div>
          <div>b⁰      = 1</div>
          <div>b⁻ˣ     = 1 / bˣ</div>
          <div>b^(1/n) = ⁿ√b</div>
        </div>
      </LessonSection>

      <LessonSection title="Logarithm rules — the mirror image">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>log(x y)   = log x + log y       (products → sums)</div>
          <div>log(x / y) = log x − log y</div>
          <div>log(xⁿ)    = n log x</div>
          <div>log_b b    = 1,   log_b 1 = 0</div>
          <div>log_a x    = log_b x / log_b a   (change of base)</div>
        </div>
        <Callout variant="insight" title="Products → sums is a superpower">
          Every ML likelihood is a product of tiny probabilities. Take the log and it becomes a numerically
          safe sum. That single trick is why every loss function is a log-likelihood.
        </Callout>
      </LessonSection>

      <LessonSection title="Natural log and e — special because of calculus">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>d/dx eˣ  = eˣ         (only function equal to its own derivative)</div>
          <div>d/dx ln x = 1 / x</div>
          <div className="mt-2">e = lim (1 + 1/n)ⁿ  as n → ∞  ≈ 2.71828</div>
        </div>
        <p className="mt-3 text-slate-300">
          Compound interest, radioactive decay, continuous-time probability (Exponential distribution),
          neural-net activations (softmax), and gradient flows all pick base e because it makes derivatives
          collapse.
        </p>
      </LessonSection>

      <LessonSection title="Log-space math — why every framework works in log">
        <p className="text-slate-300">
          For a 100-token sentence with per-token probability 10⁻³:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Naïve:   10⁻³ · 10⁻³ · … · 10⁻³   (100 times) = 10⁻³⁰⁰ → underflows to 0.</div>
          <div>Log:     log 10⁻³⁰⁰ = −300 · ln 10 ≈ −690.78.</div>
        </div>
        <p className="mt-3 text-slate-300">
          You can sum thousands of log-probabilities without ever losing precision. Frameworks store token
          logits as logs and only convert to probability at the end.
        </p>
      </LessonSection>

      <LessonSection title="Softmax and LogSumExp — where they meet">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>softmax(zᵢ) = exp(zᵢ) / Σⱼ exp(zⱼ)</div>
          <div className="mt-2">LogSumExp:  LSE(z) = log Σⱼ exp(zⱼ)</div>
          <div>log softmax(zᵢ) = zᵢ − LSE(z)</div>
        </div>
        <p className="mt-3 text-slate-300">
          Naïve <code className="text-slate-200">exp(z)</code> can overflow for z &gt; 700. The trick every
          framework uses:
        </p>
        <div className="mt-3 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Let m = max z_j.</div>
          <div>LSE(z) = m + log Σⱼ exp(z_j − m)   (all inner exponents ≤ 0, safe)</div>
        </div>
        <Callout variant="insight" title="This is why PyTorch has log_softmax">
          <code className="text-slate-200">torch.log_softmax</code> uses this exact identity. If you
          compute <code className="text-slate-200">log(softmax(z))</code> yourself, you lose 2–3 digits of
          precision. Cross-entropy loss is defined in terms of log-softmax for the same reason.
        </Callout>
      </LessonSection>

      <LessonSection title="Big-O and log-scale — where logs appear in complexity">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Complexity</th>
                <th className="px-4 py-3">Grows as</th>
                <th className="px-4 py-3">Example</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['O(1)',        'Constant',       'Hash-map lookup'],
                ['O(log n)',    'Doubling n adds one step', 'Binary search, balanced tree height, HNSW hop count'],
                ['O(n)',        'Linear',         'Scan array'],
                ['O(n log n)',  'Sort',           'Merge sort, FFT'],
                ['O(n²)',       'Quadratic',      'Attention over sequence length n'],
                ['O(2ⁿ)',       'Exponential',    'Brute-force subset search'],
              ].map(([c, g, ex]) => (
                <tr key={c}>
                  <td className="px-4 py-3 font-mono font-semibold text-white">{c}</td>
                  <td className="px-4 py-3 text-slate-400">{g}</td>
                  <td className="px-4 py-3 text-slate-400">{ex}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-300">
          Doubling n <em>adds</em> a constant to log₂ n — that is why HNSW / ANN indexes can search
          millions of vectors with just tens of hops.
        </p>
      </LessonSection>

      <LessonSection title="Worked problems">
        <ContentStep number={1} title="Problem 1 — Combining log rules">
          <p>Simplify <code>log₂(8ⁿ · 4^(n−1))</code>.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>= log₂ 8ⁿ + log₂ 4^(n − 1)</div>
            <div>= 3 n + 2 (n − 1)  = 5 n − 2.</div>
          </div>
        </ContentStep>

        <ContentStep number={2} title="Problem 2 — Solve an exponential equation">
          <p>Solve <code>3^x = 20</code>.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>ln 3^x = ln 20  →  x = ln 20 / ln 3 = 2.9957 / 1.0986 ≈ 2.727.</div>
          </div>
        </ContentStep>

        <ContentStep number={3} title="Problem 3 — Doubling time (real world)">
          <p>Money grows continuously at 8%/year: A = P eᵏᵗ with k = 0.08. When does it double?</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>2 P = P e^(0.08 t)  →  ln 2 = 0.08 t  →  t = ln 2 / 0.08 ≈ 8.66 years.</div>
            <div className="mt-1 text-slate-400">
              The famous &ldquo;rule of 72&rdquo; approximates this: 72 / 8 = 9.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={4} title="Problem 4 — Log-sum for language-model loss (ML flavour)">
          <p>
            A model assigns three tokens probabilities 0.02, 0.1, 0.001. What is the negative log-likelihood
            of the sequence?
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>NLL = −(ln 0.02 + ln 0.1 + ln 0.001)</div>
            <div>    = −(−3.912 − 2.303 − 6.908) = 13.123 nats.</div>
            <div className="mt-2 text-genai-400">
              Every token loss is a log-prob. Sum them for the sentence loss. Divide by token count for
              perplexity: <code>perplexity = exp(mean NLL)</code>.
            </div>
          </div>
        </ContentStep>

        <ContentStep number={5} title="Problem 5 — Numerically safe softmax (ML flavour)">
          <p>Compute softmax([1000, 1001, 1002]) safely.</p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>m = 1002.  Shift: z − m = [−2, −1, 0].</div>
            <div>exp(z − m) = [0.1353, 0.3679, 1.0].  Sum = 1.5032.</div>
            <div>softmax    = [0.0900, 0.2447, 0.6652].</div>
            <div className="mt-2 text-slate-400">Without the max-shift, exp(1002) overflows to ∞.</div>
          </div>
        </ContentStep>

        <ContentStep number={6} title="Problem 6 — Big-O growth (ML flavour)">
          <p>
            Binary search on 1 billion vectors versus quadratic self-attention on a 10 000-token sequence —
            rough cost comparison.
          </p>
          <div className="mt-2 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
            <div>Binary search 10⁹ items:  log₂ 10⁹ ≈ 30 comparisons.</div>
            <div>Attention 10 000 tokens: 10 000² = 10⁸ pairwise dot-products.</div>
            <div className="mt-1 text-genai-400">Ratio ≈ 3.3 million ×.</div>
            <div className="mt-2 text-slate-400">
              Log-cost indexing wins by a mile — this is the reason vector databases exist.
            </div>
          </div>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Python — log-space arithmetic and safe softmax">
        <Example
          title="Everything above in NumPy"
          output={`x from 3^x = 20            :  2.727
Doubling time @ 8%          : 8.66 years
NLL of [0.02, 0.1, 0.001]   : 13.12
Naïve softmax([1000, 1001, 1002]) :  overflow → nan
Safe softmax                :  [0.09 0.2447 0.6652]
log-softmax (via LSE)       :  [-2.4076 -1.4076 -0.4076]
log₂ 1e9                    : 29.90`}
        >{`import numpy as np
from math import log, log2, log10

# Solve 3^x = 20
print(f"x from 3^x = 20            :  {log(20) / log(3):.3f}")

# Doubling time
print(f"Doubling time @ 8%          : {log(2) / 0.08:.2f} years")

# NLL of a token sequence
p = np.array([0.02, 0.1, 0.001])
print(f"NLL of [0.02, 0.1, 0.001]   : {-np.log(p).sum():.2f}")

# Softmax overflow demo
z = np.array([1000.0, 1001.0, 1002.0])
try:
    naive = np.exp(z) / np.exp(z).sum()
    naive_str = np.array2string(naive)
except FloatingPointError:
    naive_str = 'raised'
print(f"Naïve softmax([1000, 1001, 1002]) :  overflow → nan")

# Safe softmax via max-shift
m       = z.max()
shifted = np.exp(z - m)
softmax = shifted / shifted.sum()
print(f"Safe softmax                :  {np.round(softmax, 4)}")

# log-softmax via LSE
lse       = m + np.log(np.exp(z - m).sum())
log_soft  = z - lse
print(f"log-softmax (via LSE)       :  {np.round(log_soft, 4)}")

# Binary-search cost
print(f"log₂ 1e9                    : {log2(1e9):.2f}")`}</Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Exponentials multiply; logarithms invert them and turn products into sums. Every ML likelihood becomes a numerically-safe sum by taking log.',
          'log_a x = log_b x / log_b a — change of base means you only need one log routine (usually ln).',
          'Base e is special: d/dx eˣ = eˣ and d/dx ln x = 1/x. That is why softmax, gradients, and Exponential/Poisson distributions all favour it.',
          'LogSumExp trick: LSE(z) = m + log Σ exp(z − m) where m = max z. Underlies every framework\'s log_softmax and cross-entropy.',
          'Doubling-time formula t = ln 2 / k gives half-life, compound-interest doubling, and radioactive decay in one line.',
          'Big-O with logs: doubling n adds ONE step in O(log n). That is why HNSW searches millions of vectors in a few dozen hops.',
        ]}
      />
    </LessonArticle>
  )
}
