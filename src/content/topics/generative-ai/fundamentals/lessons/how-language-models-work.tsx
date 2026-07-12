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

export function HowLanguageModelsWork() {
  return (
    <LessonArticle>
      <Definition term="Language Model">
        <p>
          A <strong className="text-white">language model</strong> is a program that reads a sequence of text and
          predicts what token should come next. It does this by assigning a <strong className="text-white">probability</strong>{' '}
          to every possible next token, then picking one according to a sampling strategy.
        </p>
        <p>
          Repeat this one token at a time and you get full sentences, paragraphs, or code — the model never plans
          the whole answer upfront; it builds it left to right.
        </p>
      </Definition>

      <LessonSection title="Tokens — the model's alphabet">
        <p>
          Models do not read characters or whole words directly. They break text into <strong className="text-white">tokens</strong> —
          chunks that might be a word, part of a word, or punctuation.
        </p>
        <Example
          title="Tokenization example"
          output={`['The', ' cat', ' sat', ' on', ' the']`}
        >{`text = "The cat sat on the"
tokens = ["The", " cat", " sat", " on", " the"]
print(tokens)`}</Example>
        <Callout variant="beginner">
          Think of tokens as the model's vocabulary units. "hello" might be one token; "unhappiness" might split into
          "un" + "happiness".
        </Callout>
      </LessonSection>

      <LessonSection title="Next-token prediction">
        <p>
          At every step the model sees all tokens so far and outputs a probability for <em>every</em> token in its
          vocabulary (often 50,000–100,000 options). Probabilities always sum to 1.0.
        </p>

        <ContentStep number={1} title="A concrete probability table">
          <p>Suppose the input is <code className="font-mono text-sm">"The cat sat on the"</code>. The model might output:</p>
          <div className="mt-3 overflow-x-auto rounded-xl border border-surface-600">
            <table className="w-full text-sm text-slate-300">
              <thead>
                <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                  <th className="px-4 py-3">Next token</th>
                  <th className="px-4 py-3">Probability</th>
                  <th className="px-4 py-3">Meaning</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-surface-600">
                {[
                  [' mat', '0.35', 'Most likely — cats sit on mats'],
                  [' floor', '0.22', 'Also very plausible'],
                  [' couch', '0.18', 'Common in training data'],
                  [' roof', '0.08', 'Unusual but possible'],
                  [' moon', '0.001', 'Very unlikely given context'],
                  [' … (all others)', '0.161', 'Remaining ~96k tokens share the rest'],
                ].map(([token, prob, meaning]) => (
                  <tr key={token} className="hover:bg-surface-800/50">
                    <td className="px-4 py-3 font-mono">{token}</td>
                    <td className="px-4 py-3 font-semibold text-white">{prob}</td>
                    <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Example
            title="Simulated next-token distribution"
            output={`Next token probabilities (top 5):
  ' mat'     → 0.3500
  ' floor'   → 0.2200
  ' couch'   → 0.1800
  ' roof'    → 0.0800
  ' chair'   → 0.0400
Sum of all probabilities = 1.0000`}
          >{`# Simplified illustration — real models output ~50k–100k values
probs = {
    " mat":    0.35,
    " floor":  0.22,
    " couch":  0.18,
    " roof":   0.08,
    " chair":  0.04,
    # ... tens of thousands more, summing to 1.0
}

print("Next token probabilities (top 5):")
for token, p in sorted(probs.items(), key=lambda x: -x[1]):
    print(f"  {token!r:10} → {p:.4f}")
print(f"Sum of all probabilities = {sum(probs.values()) + 0.11:.4f}")`}</Example>
        </ContentStep>

        <ContentStep number={2} title="How the model chooses a token">
          <p>
            Getting probabilities is only half the story — the model must <em>pick</em> one token to continue.
            Different strategies produce very different outputs:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Greedy</strong> — always pick the highest-probability token. Deterministic but repetitive.</li>
            <li><strong className="text-white">Top-k sampling</strong> — pick randomly from the k most likely tokens (e.g. top 40).</li>
            <li><strong className="text-white">Temperature</strong> — scale probabilities before sampling. Low temperature (0.1) → more conservative; high (1.5) → more creative/random.</li>
          </ul>
          <Flowchart
            title="Token generation loop"
            chart={`flowchart TB
  A([Input tokens so far]) --> B[Model computes probabilities for all tokens]
  B --> C{Sampling strategy}
  C -- Greedy --> D[Pick highest probability token]
  C -- Top-k / Temperature --> E[Resample from adjusted distribution]
  D --> F[Append token to sequence]
  E --> F
  F --> G{Stop token or max length?}
  G -- no --> A
  G -- yes --> H([Return full text])`}
          />
          <Example
            title="Greedy vs temperature sampling"
            output={`Greedy pick:        ' mat'     (p = 0.35)
Low temp (0.2) pick:  ' mat'     (still likely mat)
High temp (1.5) pick: ' roof'    (unlikely tokens get a chance)`}
          >{`import random

probs = {" mat": 0.35, " floor": 0.22, " couch": 0.18, " roof": 0.08, " chair": 0.04}

# Greedy — always highest
greedy = max(probs, key=probs.get)

# Temperature sampling (simplified)
def sample(probs, temperature):
    scaled = {t: p ** (1 / temperature) for t, p in probs.items()}
    total = sum(scaled.values())
    scaled = {t: v / total for t, v in scaled.items()}
    return random.choices(list(scaled), weights=list(scaled.values()), k=1)[0]

random.seed(42)
low_temp = sample(probs, 0.2)
random.seed(7)
high_temp = sample(probs, 1.5)

print(f"Greedy pick:        {greedy!r}     (p = {probs[greedy]})")
print(f"Low temp (0.2) pick:  {low_temp!r}")
print(f"High temp (1.5) pick: {high_temp!r}")`}</Example>
        </ContentStep>

        <ContentStep number={3} title="Building a full response, one token at a time">
          <p>After picking a token, it gets appended to the input and the whole process repeats:</p>
          <Flowchart
            title="Generating 'The cat sat on the mat.'"
            chart={`flowchart TB
  A["Input: 'The cat sat on the'"] --> B["Probs: mat=0.35, floor=0.22 …"]
  B --> C["Pick: ' mat'"]
  C --> D["Input: 'The cat sat on the mat'"]
  D --> E["Probs: .=0.62, and=0.08 …"]
  E --> F["Pick: '.'"]
  F --> G["Done — full sentence generated"]`}
          />
          <Callout variant="insight">
            This is why models sometimes "change their mind" mid-sentence — each token is a fresh decision based only
            on what came before. There is no hidden plan for the ending.
          </Callout>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Where do the probabilities come from?">
        <p>
          During <strong className="text-white">training</strong>, the model reads billions of text examples and
          adjusts its internal numbers (parameters) so that probable next tokens match what actually appeared in the
          data. After training, those learned patterns produce the probability distributions you see at inference time.
        </p>
        <Callout variant="info">
          The model does not look up answers in a database. It <em>generalises</em> statistical patterns — grammar,
          facts, style — from the text it was trained on.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Language models predict one token at a time, assigning a probability to every option.',
          'Probabilities always sum to 1.0 — higher means more likely given the context.',
          'Greedy picks the top token; temperature and top-k add randomness and creativity.',
          'Full responses are built iteratively — append token, re-run, repeat until done.',
        ]}
      />
    </LessonArticle>
  )
}
