import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/1702.08734'

export function FaissBillionScale() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Billion-scale Similarity Search with GPUs"
        authors="Johnson, Douze & Jégou (Facebook AI Research)"
        year="2017"
        venue="FAISS"
        url={PAPER_URL}
      >
        The research behind <strong className="text-white">FAISS</strong> — GPU-accelerated similarity search
        combining IVF clustering, Product Quantization, and inverted indexes to query up to a billion vectors on
        one machine.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read the <em>FAISS</em> and <em>HNSW</em> lessons. HNSW explains fast graph search; this paper explains
        how Facebook AI Research made vector search work when you have so many embeddings that raw storage and
        brute-force math stop fitting on one server.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Suppose every document chunk in your company becomes a vector of 768 floating-point numbers — about 3 KB
          each. One million chunks ≈ 3 GB. One <strong className="text-white">billion</strong> chunks ≈{' '}
          <strong className="text-white">3 terabytes</strong> of RAM just to hold the vectors — before indexes,
          metadata, or GPUs. Exact nearest-neighbour search also multiplies compute: every query touches every
          vector unless you have a shortcut.
        </p>
        <p>
          This paper's answer is <strong className="text-white">FAISS</strong> (Facebook AI Similarity Search): a
          toolkit that combines three ideas. <em>IVF</em> (Inverted File) clusters vectors into groups and
          searches only the clusters closest to the query — like checking only the library shelves nearest your
          topic. <em>Product Quantization (PQ)</em> compresses each vector from thousands of bytes to ~96 bytes
          by replacing sub-vectors with small codebook indices — like ZIP for embeddings. <em>GPU
          acceleration</em> runs thousands of distance comparisons in parallel on graphics hardware.
        </p>
        <p>
          Together, these tricks let a single GPU machine search <strong className="text-white">one billion
          vectors in under 50 milliseconds</strong> with high recall — the milestone that made web-scale
          similarity search believable for industry. The open-source FAISS library is still the default tool
          researchers and many production teams use to prototype RAG indexes before moving to managed vector
          databases.
        </p>
        <p>
          You do not need to derive the linear algebra. You need to know why your FAISS index type string looks
          like <code className="font-mono text-sm">IVF4096,PQ64</code> and why Pinecone quotes compression —
          this paper is the origin story of those design patterns.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2017, embeddings were powering image search, recommendation, and early QA retrieval — but scale hit
          hard walls:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">RAM exhaustion</strong> — storing billions of full-precision vectors
            exceeded practical server memory.
          </li>
          <li>
            <strong className="text-white">CPU throughput</strong> — even with ANN graphs, distance computations
            on billions of points were slow on CPUs alone.
          </li>
          <li>
            <strong className="text-white">Fragmented tools</strong> — research codebases each implemented one
            trick (PQ or IVF) without a unified, fast, open library.
          </li>
          <li>
            <strong className="text-white">Unproven billion-scale claims</strong> — few reproducible demos showed
            sub-100ms search at 10⁹ scale on hardware a normal lab could afford.
          </li>
        </ul>
        <p className="mt-3">
          Johnson, Douze, and Jégou integrated clustering, compression, and GPU kernels into FAISS and
          demonstrated billion-vector search with documented recall–speed trade-offs — setting the engineering
          template vector databases still follow.
        </p>
      </LessonSection>

      <LessonSection title="FAISS composite index — overview">
        <Flowchart
          title="IVF + Product Quantization + GPU search pipeline"
          chart={`flowchart TB
  A[Billion raw embedding vectors] --> B[Train IVF: k-means into nlist clusters]
  B --> C[Assign each vector to nearest cluster centroid]
  C --> D[Product Quantization: compress vectors to short codes]
  D --> E[Inverted lists: cluster ID -> compressed vectors]
  F[Query vector] --> G[Find nprobe nearest clusters to query]
  G --> H[Scan only those inverted lists on GPU]
  H --> I[Approximate distances on PQ codes]
  I --> J[Refine top candidates with full precision optional]
  J --> K[Return top-k chunk IDs to RAG]`}
        />
        <p className="mt-4 text-slate-300">
          Modern deployments often add <strong className="text-white">HNSW</strong> on top of or inside IVF cells
          (composite indexes). This paper's IVF+PQ core is still the compression and clustering backbone at
          billion scale.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="IVF — cluster vectors into Voronoi cells">
          <p>
            <strong className="text-white">Inverted File Index (IVF)</strong> runs k-means on a sample of vectors
            to find <code className="font-mono text-sm">nlist</code> cluster centroids (e.g. 4096 or 65536). Each
            stored vector is assigned to its nearest centroid. Instead of one giant list of a billion vectors,
            you have 4096 inverted lists — buckets of vectors that live near each centroid. At query time you
            only open the <code className="font-mono text-sm">nprobe</code> buckets closest to the query (e.g.
            8–64), ignoring the rest. That prunes most of the search space.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Product Quantization — compress each vector">
          <p>
            <strong className="text-white">Product Quantization (PQ)</strong> splits a 768-dimensional vector
            into sub-vectors (e.g. 96 sub-vectors of 8 dims). For each sub-space, a small{' '}
            <em>codebook</em> of 256 prototype vectors is learned. Each sub-vector is replaced by the index of
            its nearest prototype — 1 byte per sub-vector. Result:{' '}
            <strong className="text-white">768 floats (~3 KB) → 96 bytes</strong> — roughly a 32× compression.
            Distances are approximated using precomputed tables between codebooks and the query, making scans
            extremely fast.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Store inverted lists of compressed codes">
          <p>
            Each IVF cluster holds PQ-compressed vectors plus optional IDs pointing back to your document chunks.
            RAM drops from terabytes to tens of gigabytes for billion-scale collections — making single-machine
            indexes feasible. The trade-off: compressed distances are approximate; rare mis-rankings happen.
          </p>
        </ContentStep>

        <ContentStep number={4} title="GPU-accelerated batch distance computation">
          <p>
            FAISS implements heavily optimised CUDA kernels. GPUs excel at the same floating-point operation on
            thousands of vectors simultaneously. A query compares against all candidates in the selected IVF
            lists in parallel — turning what would be seconds on CPU into milliseconds on GPU for large batches.
            The paper demonstrated <strong className="text-white">sub-50ms latency</strong> for billion-vector
            search with tuned nprobe and PQ settings.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Optional re-ranking with full vectors">
          <p>
            A common pattern: PQ retrieves top 100–1000 candidates quickly, then{' '}
            <strong className="text-white">re-rank</strong> the shortlist with exact or higher-precision
            distances on full vectors kept in a smaller cache. RAG pipelines mirror this with cross-encoder
            rerankers after fast bi-encoder retrieval — same two-stage philosophy.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Open-source FAISS library">
          <p>
            The authors released FAISS as a C++ library with Python bindings. Index types are composable strings
            like <code className="font-mono text-sm">IndexIVFPQ</code>,{' '}
            <code className="font-mono text-sm">IndexHNSWFlat</code>, and GPU variants. Most RAG tutorials that
            say "build a FAISS index" trace directly to this paper's API design.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Scale</strong> — up to <strong className="text-white">1 billion
            vectors</strong> on a single machine with GPUs, reporting latency and recall@1 / recall@10.
          </li>
          <li>
            <strong className="text-white">Compression ratios</strong> — PQ variants (PQ32, PQ64, etc.) vs memory
            and accuracy.
          </li>
          <li>
            <strong className="text-white">IVF parameters</strong> — nlist (number of clusters) and nprobe
            (how many clusters to visit) sweeps showing the recall–QPS curve.
          </li>
          <li>
            <strong className="text-white">CPU vs GPU</strong> — throughput improvements on batch query workloads
            typical of recommendation systems (and later RAG batch evaluation).
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — compared against earlier PQ implementations and
            exact search on subsets to quantify approximation error.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">First reproducible billion-vector GPU search under ~50ms</strong> —
            with IVF+PQ and tuned nprobe, FAISS achieved interactive query times on 10⁹ vectors on hardware
            available in 2017 — previously thought to require clusters of machines.
          </li>
          <li>
            <strong className="text-white">32× memory reduction from PQ</strong> — a billion 768-dim float vectors
            shrank from ~3 TB to on the order of <strong className="text-white">96 GB</strong> of codes
            (plus index overhead) — the difference between impossible and rackable.
          </li>
          <li>
            <strong className="text-white">High recall with modest nprobe</strong> — visiting only a fraction of
            IVF clusters (e.g. 8–32 of 4096) recovered most true nearest neighbours because queries tend to land
            near correct centroids in embedding space.
          </li>
          <li>
            <strong className="text-white">GPU batch throughput</strong> — orders of magnitude more queries per
            second than CPU-only loops when serving many concurrent users — relevant for RAG APIs under load.
          </li>
          <li>
            <strong className="text-white">Open-source impact</strong> — FAISS became the standard research and
            prototyping tool; commercial vector DBs reimplemented the same IVF/PQ/HNSW ideas with managed ops.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Approximation stack</strong> — IVF misses vectors in unvisited
            clusters; PQ distorts distances. Stacked errors require tuning and optional exact rerank.
          </li>
          <li>
            <strong className="text-white">Training overhead</strong> — k-means and PQ codebooks must be trained
            on representative data; bad training data hurts cluster quality.
          </li>
          <li>
            <strong className="text-white">Update friction</strong> — adding many new vectors may need
            re-clustering or maintenance policies; managed DBs hide this but the underlying issue remains.
          </li>
          <li>
            <strong className="text-white">GPU dependency for peak perf</strong> — CPU FAISS works but billion-scale
            latency targets assumed CUDA GPUs.
          </li>
          <li>
            <strong className="text-white">What came after</strong> — HNSW integration (separate paper), DiskANN
            for SSD-only indexes, ScaNN (Google), and cloud vector services. FAISS itself gained HNSW, scalar
            quantisation, and raft integrations. The IVF+PQ mental model still explains their compression sliders.
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
                  'FAISS',
                  'This is the original paper behind the FAISS library — IndexIVFPQ and GPU indexes implement these ideas directly',
                ],
                [
                  'HNSW',
                  'FAISS composes IVF + PQ + HNSW for maximum scale; read both papers to understand full index type menus',
                ],
                [
                  'Vector Databases Overview',
                  'PQ compression explains why storing millions of chunks is affordable and why recall has tunable knobs',
                ],
                [
                  'Dense Passage Retrieval',
                  'DPR made dense retrieval useful; FAISS made dense retrieval fit on one machine at huge scale',
                ],
                [
                  'E5 / Embeddings',
                  'Better embeddings increase quality; FAISS ensures the index side does not become the bottleneck',
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
        FAISS made billion-vector search practical by compressing embeddings ~32× with Product Quantization and
        searching only the most relevant IVF clusters — often on a GPU. Your first RAG prototype will likely use
        FAISS or a database implementing the same tricks; tune nprobe before buying more RAM.
      </Callout>

      <KeyTakeaways
        items={[
          'FAISS combines IVF clustering, Product Quantization, and GPU kernels to search up to a billion vectors on one machine.',
          'PQ compresses ~768-dim vectors from ~3 KB to ~96 bytes (32× smaller) with small distance approximation error.',
          'IVF searches only nprobe nearest clusters — pruning most of the billion-vector space per query.',
          'Demonstrated sub-50ms billion-scale search — foundation for web-scale RAG indexing economics.',
          'Open-source FAISS remains the standard prototyping tool; managed vector DBs reimplement the same composite indexes.',
        ]}
      />
    </LessonArticle>
  )
}
