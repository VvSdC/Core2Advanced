import {
  Callout,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EmbeddingsAndVectorSpace() {
  return (
    <LessonArticle>
      <Definition term="Embedding">
        <p>
          An <strong className="text-white">embedding</strong> is a list of numbers (a{' '}
          <strong className="text-white">vector</strong>) that represents the <em>meaning</em> of a token, word, or
          sentence. Instead of treating words as opaque symbols, the model places each one as a point in a
          high-dimensional space where <strong className="text-white">similar meanings sit close together</strong>.
        </p>
        <p>
          This is how a model turns "words" into "math" — the first thing that happens after tokenization.
        </p>
      </Definition>

      <Callout variant="beginner">
        Imagine a giant map. On a normal map, cities close together are geographically near. On an embedding map, words
        close together are <em>meaningfully</em> near: "dog" sits beside "puppy", far from "invoice". The only
        difference is the map has hundreds of dimensions instead of two.
      </Callout>

      <LessonSection title="From token ID to meaning">
        <p>
          Remember from the tokens lesson: text becomes token IDs like <code className="font-mono text-sm">[40, 1842]</code>.
          But an ID is just a name-tag — ID 1842 is not "bigger" or "more" than ID 40. The model needs meaning, so each
          ID is used to look up a row in a big table called the <strong className="text-white">embedding matrix</strong>.
          That row is the token's vector.
        </p>
        <Flowchart
          title="Token ID becomes a meaning vector"
          chart={`flowchart TB
  A["Token: ' love' (ID 1842)"] --> B["Look up row 1842 in embedding table"]
  B --> C["Vector: [0.12, -0.44, 0.91, ... ] (e.g. 768 numbers)"]
  C --> D["This vector flows into the Transformer"]`}
        />
        <Example
          title="An embedding is just a fixed-length vector"
          output={`'king'   -> [ 0.21, -0.43,  0.88, ... ]  (768 numbers)
'queen'  -> [ 0.19, -0.40,  0.85, ... ]  (very close to king)
'banana' -> [-0.77,  0.62, -0.11, ... ]  (far away)`}
          caption="Real models use 256–4096 dimensions. The point: closeness = similarity of meaning."
        >{`# Each word maps to a fixed-length list of numbers.
# Similar meanings -> similar vectors.
embeddings = {
    "king":   [0.21, -0.43, 0.88],
    "queen":  [0.19, -0.40, 0.85],
    "banana": [-0.77, 0.62, -0.11],
}
for word, vec in embeddings.items():
    print(f"{word:7} -> {vec}")`}</Example>
      </LessonSection>

      <LessonSection title="Measuring closeness: cosine similarity">
        <p>
          To ask "how similar are two meanings?", we measure the <strong className="text-white">angle</strong> between
          their vectors. This is <strong className="text-white">cosine similarity</strong>: 1.0 means "pointing the same
          way" (very similar), 0 means unrelated, −1 means opposite.
        </p>
        <Example
          title="Comparing meanings with cosine similarity"
          output={`king  vs queen : 0.999   (almost the same direction)
king  vs banana: 0.055   (basically unrelated)`}
          caption="Direction encodes meaning; cosine similarity reads that direction."
        >{`import math

def cosine(a, b):
    dot = sum(x * y for x, y in zip(a, b))
    na = math.sqrt(sum(x * x for x in a))
    nb = math.sqrt(sum(y * y for y in b))
    return dot / (na * nb)

king   = [0.21, -0.43, 0.88]
queen  = [0.19, -0.40, 0.85]
banana = [-0.77, 0.62, -0.11]

print(f"king  vs queen : {cosine(king, queen):.3f}")
print(f"king  vs banana: {cosine(king, banana):.3f}")`}</Example>
        <Callout variant="insight">
          This one idea — turn things into vectors, then compare by closeness — is the engine behind{' '}
          <strong className="text-white">semantic search</strong> and <strong className="text-white">RAG</strong>. When
          you later "search your documents by meaning", you are really comparing embeddings with cosine similarity.
        </Callout>
      </LessonSection>

      <LessonSection title="The famous 'king − man + woman ≈ queen'">
        <p>
          Because meaning is stored as directions, you can sometimes do <em>arithmetic</em> on meaning. The classic
          result: take the vector for "king", subtract "man", add "woman", and you land near "queen". The model learned
          that the difference between king and queen is roughly the same direction as the difference between man and
          woman.
        </p>
        <Callout variant="info">
          You won't do this by hand in practice, but it reveals something profound: the geometry of the space{' '}
          <em>encodes relationships</em> — gender, tense, plural, even country-to-capital — as consistent directions.
        </Callout>
      </LessonSection>

      <LessonSection title="Static vs contextual embeddings">
        <p>
          Early methods (Word2Vec, GloVe) gave every word <em>one</em> fixed vector. But "bank" means different things
          in "river bank" and "bank account". Modern Transformers produce{' '}
          <strong className="text-white">contextual embeddings</strong>: the vector for a token is adjusted based on the
          words around it, so "bank" gets a different vector in each sentence.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">One vector per…</th>
                <th className="px-4 py-3">Handles context?</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Static (Word2Vec, GloVe)', 'word (always the same)', 'No — "bank" is always identical'],
                ['Contextual (Transformers)', 'word in its sentence', 'Yes — "bank" shifts by context'],
              ].map(([type, per, ctx]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{per}</td>
                  <td className="px-4 py-3 text-slate-400">{ctx}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Producing those context-aware vectors is exactly the job of <strong className="text-white">attention</strong>,
          which we unpack in the next two lessons. Attention is what lets a token "look at" its neighbours and update its
          own meaning.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'An embedding is a vector of numbers that represents meaning; similar meanings have nearby vectors.',
          'After tokenization, each token ID looks up a row in the embedding matrix to get its starting vector.',
          'Cosine similarity measures closeness by angle — the basis of semantic search and RAG.',
          'Meaning is stored as directions, so relationships (king→queen, country→capital) appear as consistent offsets.',
          'Static embeddings give one vector per word; contextual embeddings (Transformers) adapt the vector to the sentence.',
        ]}
      />
    </LessonArticle>
  )
}
