import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2310.08560'

export function MemGptPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="MemGPT: Towards LLMs as Operating Systems"
        authors="Packer et al. (UC Berkeley)"
        year="2023"
        url={PAPER_URL}
      >
        Manages <strong className="text-white">long-term and working memory</strong> like an OS manages RAM and
        disk — directly relevant to LangGraph checkpointing and persistent state.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        <em>Persistence & Checkpointing</em> lesson. MemGPT is the research vision; LangGraph checkpointers are
        the production implementation.
      </Callout>

      <LessonSection title="Two-tier memory">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Main context (RAM)</strong> — fits in LLM window; actively used.</li>
          <li><strong className="text-white">Archival storage (disk)</strong> — unlimited history; retrieved on demand.</li>
          <li><strong className="text-white">Memory management</strong> — agent decides what to page in/out via function calls.</li>
        </ul>
      </LessonSection>

      <LessonSection title="LangGraph parallel">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">MemGPT</th>
                <th className="px-4 py-3">LangGraph</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Archival memory', 'PostgresSaver checkpoints + vector store'],
                ['Working context', 'messages in current state'],
                ['Page in/out', 'Node that retrieves/archives messages'],
                ['Persistent sessions', 'thread_id across invocations'],
              ].map(([mem, lg]) => (
                <tr key={mem} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{mem}</td>
                  <td className="px-4 py-3 font-semibold text-white">{lg}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MemGPT: OS-style memory management for LLMs — working + archival tiers.',
          'LangGraph checkpointers + thread_id implement persistent agent sessions.',
          'Inspiration for long-running agents that exceed context window limits.',
        ]}
      />
    </LessonArticle>
  )
}
