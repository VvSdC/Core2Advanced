import {
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ChromaDb() {
  return (
    <LessonArticle>
      <LessonSection title="What is ChromaDB?">
        <p>
          <strong className="text-white">Chroma</strong> is an open-source embedding database designed for
          developer-friendly local RAG. It handles storage, metadata filtering, and persistence — unlike raw FAISS.
        </p>
      </LessonSection>

      <LessonSection title="Basic → Advanced">
        <div className="space-y-4">
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 1 — In-memory client</p>
            <p className="mt-2 text-sm text-slate-400">Ephemeral storage. Create a collection, add documents, query. Perfect for notebooks and quick tests.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 2 — Persistent client</p>
            <p className="mt-2 text-sm text-slate-400">Data saved to disk between runs. Collections survive restarts. Good for local development.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 3 — Metadata filtering</p>
            <p className="mt-2 text-sm text-slate-400">Filter by source, date, tags during search. where={'{"source": "handbook.pdf"}'}.</p>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
            <p className="text-sm font-semibold text-white">Level 4 — Chroma server</p>
            <p className="mt-2 text-sm text-slate-400">Run as a Docker service. Multiple apps connect via HTTP. Small-team production deployments.</p>
          </div>
        </div>
      </LessonSection>

      <LessonSection title="Strengths & limitations">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Strengths</th>
                <th className="px-4 py-3">Limitations</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">Zero-config local setup; built-in metadata; LangChain native support</td>
                <td className="px-4 py-3 text-slate-400">Not built for billions of vectors; limited enterprise features</td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Chroma = developer-friendly local vector DB with persistence and metadata filtering.',
          'Progression: in-memory → persistent → filtered search → server mode.',
          'Best stepping stone from FAISS prototyping to a real database.',
          'Native LangChain integration — popular in tutorials and MVPs.',
        ]}
      />
    </LessonArticle>
  )
}
