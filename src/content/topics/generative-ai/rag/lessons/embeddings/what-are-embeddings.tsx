import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhatAreEmbeddings() {
  return (
    <LessonArticle>
      <Definition term="Embedding">
        <p>
          An <strong className="text-white">embedding</strong> is a fixed-length list of numbers (a vector) that
          represents the <em>meaning</em> of a piece of text. Similar meanings produce vectors that are close
          together in mathematical space — measured by cosine similarity or dot product.
        </p>
      </Definition>

      <LessonSection title="How text becomes a vector">
        <Flowchart
          title="Inside an embedding model"
          chart={`flowchart LR
  A[Raw text] --> B[Tokeniser splits into tokens]
  B --> C[Neural network processes tokens]
  C --> D[Pooling — combine token vectors]
  D --> E[Final embedding vector e.g. 1536 floats]`}
        />
        <ContentStep number={1} title="Tokenisation">
          <p>
            Text is split into <strong className="text-white">tokens</strong> — sub-word units, not necessarily
            whole words. <code className="font-mono text-sm">"unhappiness"</code> might become{' '}
            <code className="font-mono text-sm">["un", "happiness"]</code>. Different casing, punctuation, and
            spacing all affect tokens.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Neural encoding">
          <p>
            A transformer model (BERT-family or similar) processes all tokens together, building contextual
            representations — each token's vector depends on every other token in the input.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pooling">
          <p>
            Token-level vectors are combined into one <strong className="text-white">sentence-level vector</strong>{' '}
            via mean pooling, CLS token, or last-token pooling. This single vector is the embedding you store and
            search against.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How embeddings enable RAG">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>At <strong className="text-white">index time</strong>, every chunk is embedded and stored in the vector database.</li>
          <li>At <strong className="text-white">query time</strong>, the question is embedded with the same model.</li>
          <li>Cosine similarity ranks stored chunks by relevance; top-k are returned to the prompt.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Cosine similarity — intuition">
        <p>
          Cosine similarity measures the <strong className="text-white">angle</strong> between two vectors, from
          −1 (opposite direction) to 1 (identical direction). It ignores vector magnitude — only direction matters.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Illustrative similarity scores</div>
          <div className="mt-2">"refund policy" ↔ "return money" → 0.89</div>
          <div>"refund policy" ↔ "weather forecast" → 0.12</div>
          <div>"refund policy" ↔ "refund policy" → 1.00</div>
          <div>"abc" ↔ "ABC" → ~0.97 (similar, not identical)</div>
        </div>
        <p className="mt-4">
          Scores above ~0.7 usually indicate strong semantic match. Below ~0.3 means unrelated. Exact thresholds
          depend on the embedding model — always calibrate on your own data.
        </p>
      </LessonSection>

      <LessonSection title="Golden rules">
        <Callout variant="insight">
          <strong className="text-white">Use the same embedding model</strong> for indexing and querying. Mixing
          models breaks similarity — like comparing distances measured in different units on different maps.
        </Callout>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Re-embed everything if you change embedding models — no shortcut.</li>
          <li>Embedding quality directly determines retrieval quality — garbage embeddings → garbage RAG.</li>
          <li>Higher dimensions capture more nuance but cost more storage and compute per vector.</li>
          <li>Never embed text longer than the model's token limit — chunk first, then embed.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Embeddings: tokenise → neural encode → pool → fixed-size vector.',
          'Cosine similarity scores relevance; ~0.7+ is strong, ~0.3- is unrelated.',
          'Same model at index and query time — non-negotiable.',
          'See Popular Questions at the end of this section for abc/ABC, negation, and more.',
        ]}
      />
    </LessonArticle>
  )
}
