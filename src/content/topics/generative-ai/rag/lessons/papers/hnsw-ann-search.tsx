import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1603.09320'

export function HnswAnnSearch() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Efficient and Robust Approximate Nearest Neighbor Search Using Hierarchical Navigable Small World Graphs"
        authors="Malkov & Yashunin"
        year="2018"
        venue="HNSW"
        url={PAPER_URL}
      >
        Introduced <strong className="text-white">HNSW</strong> — a graph-based approximate nearest-neighbour
        algorithm that makes million- and billion-vector search fast enough for real-time RAG in FAISS, Pinecone,
        Qdrant, Weaviate, and pgvector.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Vector Databases Overview</em> and <em>What Are Embeddings?</em>. You already know that RAG
        stores document vectors and searches for the closest ones at query time. This paper explains the
        algorithm most vector databases use to make that search feel instant instead of scanning every vector.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Your RAG index might contain millions of chunk embeddings — each a list of hundreds of numbers. When a
          user asks a question, you embed their query and need the <em>nearest</em> stored vectors (highest
          cosine similarity or smallest distance). The naive approach compares the query to{' '}
          <strong className="text-white">every single vector</strong>. With 10 million chunks, that is 10
          million distance calculations per search — too slow for interactive chat.
        </p>
        <p>
          HNSW is a clever shortcut. Imagine a city with only local streets: to find the nearest hospital you
          might wander block by block for hours. Now add express elevators to sparse <em>highway layers</em> on
          top — few long jumps between distant neighbourhoods. You ride the highway layer to get close, drop to
          a denser layer, refine, repeat until the bottom layer where every vector is connected to nearby
          neighbours. You never visit the whole city — only a logarithmic number of hops.
        </p>
        <p>
          The trade-off is <strong className="text-white">approximate</strong> search (ANN): you might miss the
          absolute closest vector in rare cases, but you gain 100× or more speed with ~98–99% recall in typical
          settings. For RAG, that trade is almost always worth it — users cannot tell if the 3rd-best chunk was
          0.001 similarity points worse than the true #3. This paper is why Pinecone queries feel instant and why
          pgvector's HNSW index exists.
        </p>
        <p>
          You will not implement HNSW yourself; you will choose <code className="font-mono text-sm">ef_search</code>{' '}
          and <code className="font-mono text-sm">M</code> parameters in your database. Understanding the
          layered graph picture tells you what those knobs actually do when latency or recall looks wrong in
          production.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          Before HNSW became dominant, vector search at scale relied on several families of algorithms — each
          with pain points:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Brute force (Flat index)</strong> — exact, simple, O(n) per query.
            Fine for thousands of vectors; breaks at millions.
          </li>
          <li>
            <strong className="text-white">Tree methods (kd-trees, etc.)</strong> — struggle in high dimensions
            (the "curse of dimensionality"). Embedding vectors often have 384–1536 dimensions where tree splits
            stop helping.
          </li>
          <li>
            <strong className="text-white">LSH (Locality-Sensitive Hashing)</strong> — fast but recall can be
            uneven; tuning hash tables is fiddly.
          </li>
          <li>
            <strong className="text-white">Earlier NSW graphs</strong> — navigable small-world graphs could
            search in O(log n) hops but were sensitive to graph quality and hard to build incrementally at scale.
          </li>
        </ul>
        <p className="mt-3">
          Malkov and Yashunin combined <em>small-world graph</em> ideas with a <em>hierarchy of layers</em> —
          Hierarchical NSW (HNSW) — delivering robust recall, fast queries, and practical index construction.
          It became the default ANN graph index in modern vector stores.
        </p>
      </LessonSection>

      <LessonSection title="HNSW layered graph — overview">
        <Flowchart
          title="Query traversal from top layer to bottom layer"
          chart={`flowchart TB
  A[Query vector] --> B[Enter at top layer - sparse long links]
  B --> C[Greedy walk: move to nearest neighbour]
  C --> D{Closer neighbour exists?}
  D -->|Yes| C
  D -->|No| E[Drop to next denser layer]
  E --> F{On bottom layer?}
  F -->|No| C
  F -->|Yes| G[Collect ef_search candidate neighbours]
  G --> H[Return top-k nearest to query]
  I[Index build: each vector assigned random max layer] --> B
  J[Bottom layer: dense NSW graph] --> G`}
        />
        <p className="mt-4 text-slate-300">
          Search is <strong className="text-white">greedy</strong> at each layer: always step to the neighbour
          closest to the query until no improvement, then descend. The hierarchy guarantees long jumps early and
          fine search late.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Assign each vector to a random maximum layer">
          <p>
            When <em>building</em> the index, every vector gets a random level drawn from an exponential
            distribution — most vectors appear only in the bottom layer; a few reach higher layers like tall
            buildings with express floors. Layer 0 contains all vectors; upper layers are sparse subsets. A
            vector appears in every layer from its assigned max down to 0.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Connect neighbours within each layer">
          <p>
            On each layer, each vector links to up to <strong className="text-white">M</strong> nearest
            neighbours (a build-time parameter, often 16–48). Upper layers have longer "skip" edges across the
            space; layer 0 forms a dense navigable small-world graph where local neighbourhoods are well
            connected. Good neighbour links are what make greedy walks succeed.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Start search at the top layer entry point">
          <p>
            Query time: embed the user question, enter the graph at the top-layer entry point (often the highest
            node or a fixed start). Compare distances to connected neighbours and{' '}
            <strong className="text-white">move to the closest</strong>. Repeat until no neighbour is closer —
            you have found a local minimum on this layer.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Descend layer by layer">
          <p>
            Drop to the next lower layer using the same position as the exit point. Run greedy search again. Each
            descent refines location. When you reach <strong className="text-white">layer 0</strong>, you are in
            the dense graph where fine-grained neighbours live. Total hops scale roughly{' '}
            <strong className="text-white">O(log n)</strong> rather than O(n).
          </p>
        </ContentStep>

        <ContentStep number={5} title="Expand candidates with ef_search">
          <p>
            On the bottom layer, HNSW does not stop at one nearest node. It maintains a priority queue of up to{' '}
            <strong className="text-white">ef_search</strong> candidates (the "exploration frontier"). It
            explores neighbours of those candidates to improve recall. Higher{' '}
            <code className="font-mono text-sm">ef_search</code> = examine more nodes = better recall, slower
            queries. Typical production values: 100–200 for balanced RAG; raise if users miss obvious documents.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Return top-k vectors to the RAG retriever">
          <p>
            From the final candidate set, return the k vectors with smallest distance to the query. Those chunk
            IDs flow to reranking (optional) and then into the LLM prompt. HNSW only solves{' '}
            <em>fast neighbour search</em> — embedding quality and chunking still determine whether the true
            answer is among those k.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Recall vs speed</strong> — how often the true nearest neighbour
            appears in top-k compared to brute force, across varying dataset sizes and dimensions.
          </li>
          <li>
            <strong className="text-white">Scalability</strong> — millions of vectors in 128–784 dimensional
            spaces typical of embeddings at the time.
          </li>
          <li>
            <strong className="text-white">Build parameters</strong> — effect of M (max neighbours) and{' '}
            ef_construction (build-time search width) on graph quality and index build time.
          </li>
          <li>
            <strong className="text-white">Query parameters</strong> — ef_search sweeps showing the accuracy–latency
            knee of the curve.
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — compared against prior NSW, SWING, and other ANN
            methods on standard ANN benchmarks (e.g. SIFT, GIST image descriptors — methodology transfers to text
            embeddings).
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Orders-of-magnitude faster than brute force</strong> — at millions of
            points, HNSW answered queries in milliseconds where flat search took hundreds of milliseconds to
            seconds, with recall@10 often above 95–99% when ef_search was tuned reasonably.
          </li>
          <li>
            <strong className="text-white">O(log n) navigation</strong> — hierarchical layers reduced the number
            of distance computations from linear in dataset size to logarithmic in practice — the core reason
            real-time RAG over large corpora is feasible.
          </li>
          <li>
            <strong className="text-white">Robust across datasets</strong> — beat or matched strong ANN baselines
            on diverse benchmarks; less brittle than single-layer NSW graphs that could get trapped in bad local
            minima without hierarchy.
          </li>
          <li>
            <strong className="text-white">Tunable recall–latency trade-off</strong> — doubling ef_search might
            add a few milliseconds but recover another 1–2% of missed neighbours — a knob you can turn without
            rebuilding the index.
          </li>
          <li>
            <strong className="text-white">Wide adoption</strong> — FAISS IndexHNSWFlat, Pinecone pods, Qdrant
            default index, Weaviate, pgvector HNSW extension all implement variants of this paper's algorithm.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Approximate, not exact</strong> — rare queries can miss the true
            nearest neighbour; critical if your metric is legal discovery or fraud at 100% recall.
          </li>
          <li>
            <strong className="text-white">Index build cost</strong> — constructing a high-quality graph on
            hundreds of millions of vectors takes time and RAM; updates may require rebuilds or incremental
            insert policies depending on the database.
          </li>
          <li>
            <strong className="text-white">Memory footprint</strong> — graphs store edges per vector; M and
            dimensionality drive RAM. Billion-scale often pairs HNSW with compression (see FAISS IVF+PQ paper).
          </li>
          <li>
            <strong className="text-white">High-dimensional quirks</strong> — all ANN methods struggle as
            dimensions grow; very large embedding models may need higher ef_search.
          </li>
          <li>
            <strong className="text-white">What came after</strong> — DiskANN for SSD-scale indexes, learned
            indexes, and hybrid IVF+HNSW composites in FAISS. HNSW remains the default mental model for graph ANN
            in RAG stacks.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Connection</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Vector Databases Overview',
                  'HNSW is the graph index behind "instant" similarity search in most managed vector DBs',
                ],
                [
                  'FAISS',
                  'IndexHNSWFlat implements this algorithm; Level-3 FAISS lessons map directly to M and ef_search',
                ],
                [
                  'What Are Embeddings?',
                  'Embeddings produce vectors; HNSW is how you query millions of them without brute force',
                ],
                [
                  'FAISS Billion-Scale paper',
                  'At billion-vector scale, teams combine HNSW-style graphs with IVF and PQ compression',
                ],
                [
                  'Dense Passage Retrieval',
                  'DPR defined offline indexing + online search; HNSW is the search accelerator inside the index',
                ],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner" title="Key insight for beginners">
        HNSW is why vector search feels instant with millions of documents. You trade ~1–2% recall for 100×
        speed — and that trade-off is almost always correct for RAG. If answers miss obvious docs, raise{' '}
        <code className="font-mono text-sm">ef_search</code> before retraining embeddings.
      </Callout>

      <KeyTakeaways
        items={[
          'HNSW builds a hierarchy of sparse-to-dense graphs so queries take O(log n) greedy hops instead of scanning every vector.',
          'Top layers = long jumps; bottom layer = fine local search. ef_search controls how many candidates are explored for recall.',
          'Approximate search trades tiny accuracy loss for massive speed — standard for production RAG retrieval.',
          'Powers FAISS IndexHNSWFlat, Pinecone, Qdrant, Weaviate, pgvector HNSW — you configure M and ef_search, not the graph math.',
          'Pair with compression (IVF, PQ) when RAM or billion-scale storage becomes the bottleneck.',
        ]}
      />
    </LessonArticle>
  )
}
