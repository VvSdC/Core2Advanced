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
          An <strong className="text-white">embedding</strong> is a list of numbers — called a{' '}
          <strong className="text-white">vector</strong> — that captures the <em>meaning</em> of a piece of text.
          Think of it like <strong className="text-white">GPS coordinates for meaning</strong>: every sentence gets
          a unique point in a high-dimensional map. Sentences with similar meanings land close together; unrelated
          sentences land far apart.
        </p>
        <p className="mt-3">
          A real embedding might look like{' '}
          <code className="font-mono text-sm">[0.021, -0.034, 0.112, 0.008, ...]</code> with hundreds or thousands
          of numbers. You never read these by hand — a computer compares them to find the closest matches.
        </p>
      </Definition>

      <LessonSection title="The GPS analogy — why vectors work">
        <p>
          Imagine every idea in the world has a location on a giant map. "Refund policy" sits near "return money"
          and "money-back guarantee." "Weather forecast" sits on the other side of the map, nowhere near refunds.
        </p>
        <p className="mt-3">
          A GPS coordinate uses two numbers (latitude, longitude). An embedding uses{' '}
          <strong className="text-white">384 to 3,072 numbers</strong> — far more dimensions, so the map can
          distinguish subtle differences. "Refund policy" and "return policy" are neighbours; "refund policy" and
          "refund policies" are close but not identical — like two houses on the same street.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Same map, different spots</div>
          <div className="mt-2">"refund policy"     → [0.12, -0.08, 0.31, ...]</div>
          <div>"return money"      → [0.11, -0.07, 0.29, ...]  ← nearby on the map</div>
          <div>"weather forecast"  → [-0.45, 0.62, -0.18, ...] ← far away</div>
        </div>
        <Callout variant="insight">
          Embeddings do not store the original words. They store a <em>location on a meaning map</em>. That is why
          "car" and "automobile" can match even though they share no letters in common.
        </Callout>
      </LessonSection>

      <LessonSection title="How text becomes a vector">
        <p className="mb-4 text-slate-300">
          Turning a sentence into numbers happens inside an <strong className="text-white">embedding model</strong> —
          a neural network trained on millions of text examples. Here is the pipeline, step by step:
        </p>
        <Flowchart
          title="Inside an embedding model"
          chart={`flowchart LR
  A[Raw text] --> B[Tokeniser splits into tokens]
  B --> C[Neural network reads all tokens together]
  C --> D[Pooling combines token vectors into one]
  D --> E[Final embedding e.g. 1536 numbers]`}
        />
        <ContentStep number={1} title="Tokenisation — chopping text into pieces">
          <p>
            The model does not read whole words at once. It splits text into <strong className="text-white">tokens</strong>{' '}
            — small chunks, often sub-word pieces. The word{' '}
            <code className="font-mono text-sm">"unhappiness"</code> might become{' '}
            <code className="font-mono text-sm">["un", "happiness"]</code>. Capital letters, punctuation, and extra
            spaces all change the tokens, which is why <code className="font-mono text-sm">"abc"</code> and{' '}
            <code className="font-mono text-sm">"ABC"</code> produce slightly different vectors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Neural encoding — reading in context">
          <p>
            A transformer model (the same family that powers ChatGPT) reads <em>all</em> tokens at once. Each token's
            representation is shaped by every other token in the sentence — so "bank" near "river" gets a different
            encoding than "bank" near "account." This is called <strong className="text-white">contextual encoding</strong>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pooling — one vector per sentence">
          <p>
            After processing, you have one vector per token. These are combined into a single{' '}
            <strong className="text-white">sentence-level vector</strong> through pooling — usually averaging all
            token vectors, or taking a special "summary" token. This final vector is what you store in your database
            and search against.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="How embeddings power RAG">
        <p className="mb-4 text-slate-300">
          RAG (Retrieval-Augmented Generation) uses embeddings as its search engine. Without them, finding the right
          document in a large knowledge base would be like finding a needle in a haystack using only keyword matching.
        </p>
        <ContentStep number={1} title="Index time — map your documents">
          <p>
            When you build your knowledge base, every document chunk is passed through the embedding model. Each chunk
            gets its GPS coordinate on the meaning map, and that vector is stored in a{' '}
            <strong className="text-white">vector database</strong> alongside the original text.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Query time — map the user's question">
          <p>
            When a user asks a question, the <em>same</em> embedding model converts their question into a vector.
            This puts their question on the same map as your documents.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Search — find the nearest neighbours">
          <p>
            The vector database finds document chunks whose coordinates are closest to the question's coordinate.
            Those top matches are pulled into the LLM's prompt as context, and the model generates an answer grounded
            in your actual data.
          </p>
        </ContentStep>
        <Callout variant="tip">
          The entire RAG retrieval step boils down to one question: <em>"Which stored chunks live nearest to this
          question on the meaning map?"</em> Embedding quality determines how accurate that neighbourhood search is.
        </Callout>
      </LessonSection>

      <LessonSection title="Cosine similarity — measuring closeness on the map">
        <p>
          To find "nearby" vectors, we measure the <strong className="text-white">angle</strong> between two vectors
          using <strong className="text-white">cosine similarity</strong>. Scores range from −1 (pointing in opposite
          directions) to 1 (pointing the same way). We care about direction, not distance — like asking "are these two
          GPS points in the same neighbourhood?" not "how many miles apart are they?"
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Illustrative similarity scores</div>
          <div className="mt-2">"refund policy" ↔ "return money"        → 0.89  (same neighbourhood)</div>
          <div>"refund policy" ↔ "weather forecast"    → 0.12  (different city)</div>
          <div>"refund policy" ↔ "refund policy"       → 1.00  (same exact spot)</div>
          <div>"abc" ↔ "ABC"                           → ~0.97 (same street, different house number)</div>
        </div>
        <p className="mt-4">
          As a rough guide: scores above <strong className="text-white">~0.7</strong> usually mean a strong semantic
          match. Below <strong className="text-white">~0.3</strong> means unrelated. Exact thresholds vary by model —
          always test on your own data before trusting these numbers in production.
        </p>
      </LessonSection>

      <LessonSection title="Golden rules — mistakes that break RAG">
        <Callout variant="insight">
          <strong className="text-white">Use the same embedding model</strong> for indexing and querying. Mixing models
          is like plotting some cities on a Google Maps grid and others on an old paper atlas — the coordinates look
          like numbers, but they are not comparable.
        </Callout>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Re-embed everything</strong> if you switch models. There is no shortcut or
            conversion formula between different model maps.
          </li>
          <li>
            <strong className="text-white">Embedding quality = retrieval quality.</strong> Bad embeddings mean your
            RAG system retrieves the wrong documents, and no amount of prompt engineering fixes that.
          </li>
          <li>
            <strong className="text-white">More dimensions = more nuance, more cost.</strong> A 3,072-dimension vector
            stores twice as much data as a 1,536-dimension one. Choose based on your accuracy needs and budget.
          </li>
          <li>
            <strong className="text-white">Chunk before you embed.</strong> Models have token limits (often 512–8,192
            tokens). Embedding an entire 50-page PDF as one vector silently drops most of the content.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Embeddings are GPS coordinates for meaning — similar text lands nearby on a high-dimensional map.',
          'Pipeline: tokenise → neural encode → pool → one fixed-size vector per text chunk.',
          'RAG uses cosine similarity to find the nearest document chunks to a user question.',
          'Same model at index and query time is non-negotiable — mixing models breaks search.',
          'See Popular Questions at the end of this section for abc/ABC, negation, and more.',
        ]}
      />
    </LessonArticle>
  )
}
