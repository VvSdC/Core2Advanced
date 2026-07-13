import {
  Callout,
  ContentStep,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function OpenSourceEmbeddings() {
  return (
    <LessonArticle>
      <Definition term="Open-source embeddings">
        <p>
          <strong className="text-white">Open-source embeddings</strong> are like hosting your own translation service
          instead of hiring one. You download a model, run it on your own computer or server, and convert text to
          vectors locally. No API calls, no per-token fees, and your data never leaves your machine.
        </p>
        <p className="mt-3">
          The trade-off: you are responsible for everything the API provider would handle — hardware, software updates,
          speed optimisation, and troubleshooting. But for privacy-sensitive or high-volume workloads, hosting your own
          often saves significant money.
        </p>
      </Definition>

      <LessonSection title="The sentence-transformers library — your local embedding engine">
        <p>
          The <strong className="text-white">sentence-transformers</strong> library (from Hugging Face) is the standard
          way to run open-source embeddings. It wraps everything you need into a few lines of code:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Conceptual usage</div>
          <div className="mt-2">from sentence_transformers import SentenceTransformer</div>
          <div>model = SentenceTransformer("BAAI/bge-large-en-v1.5")</div>
          <div>vector = model.encode("Refunds are available within 30 days.")</div>
          <div className="mt-2 text-genai-400">→ [0.031, -0.022, 0.108, ...] (1024 numbers, computed locally)</div>
        </div>
        <p className="mt-3">
          One download, one load, unlimited embeddings. Run on CPU for small projects or GPU for speed at scale. No
          internet connection needed after the initial model download.
        </p>
      </LessonSection>

      <LessonSection title="Top open-source models — which to pick">
        <p className="mb-4 text-slate-300">
          Dozens of open-source embedding models exist. These five cover the most common RAG scenarios:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'BGE-large-en-v1.5',
                  '1024',
                  'Best English retrieval quality — the open-source default for production RAG',
                ],
                [
                  'E5-large-v2',
                  '1024',
                  'Microsoft model with query/passage prefixes for asymmetric search',
                ],
                [
                  'all-MiniLM-L6-v2',
                  '384',
                  'Tiny and fast — ideal for prototyping and testing on a laptop',
                ],
                [
                  'multilingual-e5-large',
                  '1024',
                  '100+ languages — when your knowledge base is not English-only',
                ],
                [
                  'nomic-embed-text-v1.5',
                  '768',
                  'Long context (8,192 tokens) — good for longer document chunks',
                ],
              ].map(([model, dims, strength]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{dims}</td>
                  <td className="px-4 py-3 text-slate-400">{strength}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Start with <strong className="text-white">all-MiniLM-L6-v2</strong> while prototyping (runs fast on any
          laptop). Switch to <strong className="text-white">BGE-large-en-v1.5</strong> when you move to production and
          need better retrieval accuracy.
        </Callout>
      </LessonSection>

      <LessonSection title="The E5 prefix convention — telling the model what role text plays">
        <p className="mb-4 text-slate-300">
          E5 models work better when you label text as either a stored document or a search query — the same asymmetric
          idea Cohere's commercial API uses. Think of it as putting a sticky note on each piece of text before feeding
          it to your local translator:
        </p>
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div>Index time:  "passage: Refunds are available within 30 days of purchase."</div>
          <div>Query time:  "query: What is the refund policy?"</div>
        </div>
        <p className="mt-3">
          The prefixes <code className="font-mono text-sm">passage:</code> and{' '}
          <code className="font-mono text-sm">query:</code> tell the model how to encode the text. Documents and
          questions get different treatment, which improves retrieval accuracy. You must use the same prefixes
          consistently — mixing them up is like putting the wrong sticky note on a document.
        </p>
        <p className="mt-3">
          BGE models use a similar convention with a longer query prefix:{' '}
          <code className="font-mono text-sm">Represent this sentence for searching relevant passages:</code> applied
          only at query time.
        </p>
      </LessonSection>

      <LessonSection title="Running locally — what you gain and what you manage">
        <ContentStep number={1} title="Pros — why teams go self-hosted">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <strong className="text-white">Zero per-token cost.</strong> Embed a million documents for the price of
              electricity, not API fees.
            </li>
            <li>
              <strong className="text-white">Data stays local.</strong> No text leaves your network — critical for
              healthcare, legal, finance, and government workloads.
            </li>
            <li>
              <strong className="text-white">No rate limits.</strong> Embed as fast as your hardware allows, any time of
              day.
            </li>
          </ul>
        </ContentStep>
        <ContentStep number={2} title="Cons — what you take on">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <strong className="text-white">Hardware needed.</strong> CPU works for small projects but is slow at
              scale. A GPU (even a single consumer card) makes a dramatic difference.
            </li>
            <li>
              <strong className="text-white">Manual updates.</strong> When a better model releases, you download and
              switch yourself — no automatic upgrades like an API provider offers.
            </li>
            <li>
              <strong className="text-white">Ops overhead.</strong> You manage the server, monitor memory usage, and
              handle crashes. An API provider does all of this for you.
            </li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Sweet spot — when self-hosting makes sense">
          <p>
            A single GPU running BGE-large or E5 can embed millions of document chunks. For mid-size deployments
            (thousands to low millions of chunks), open-source on one GPU is often faster and cheaper than paying
            per-token API fees — especially when you re-index frequently.
          </p>
        </ContentStep>
        <Callout variant="insight">
          Hosting your own is not all-or-nothing. Many teams use commercial APIs during prototyping (fastest setup)
          and migrate to open-source for production once they know their volume, privacy requirements, and quality
          needs.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Open-source embeddings run locally — like hosting your own translation service instead of hiring one.',
          'sentence-transformers is the standard library; BGE-large-en-v1.5 is the top English production choice.',
          'E5 models need query:/passage: prefixes; BGE uses a longer query prefix — match at index and query time.',
          'all-MiniLM-L6-v2 for fast prototyping; BGE-large for production. GPU recommended at scale.',
          'Choose open-source for privacy and cost; commercial APIs for convenience and latest benchmarks.',
        ]}
      />
    </LessonArticle>
  )
}
