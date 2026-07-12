import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2303.17760'

export function CamelPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="CAMEL: Communicative Agents for Mind Exploration of Large Language Model Society"
        authors="Li et al."
        year="2023"
        url={PAPER_URL}
      >
        Two agents in <strong className="text-white">role-playing conversation</strong> — AI User and AI
        Assistant — autonomously cooperate on tasks via inception prompting.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Collaborative Multi-Agent</em>. CAMEL is the research foundation for role-play
        cooperative agent patterns.
      </Callout>

      <LessonSection title="Role-playing cooperation">
        <Flowchart
          title="CAMEL two-agent loop"
          chart={`flowchart LR
  Task[Task prompt] --> User[AI User — gives instructions]
  User --> Asst[AI Assistant — executes step]
  Asst --> User
  User --> Done[Task complete]`}
        />
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Inception prompting</strong> assigns roles at the start (e.g. "You are
          a Python programmer…"). The AI User breaks the task into steps; the AI Assistant executes each one.
          No human in the loop after the initial task.
        </p>
      </LessonSection>

      <LessonSection title="Connection to agent architectures">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">CAMEL concept</th>
                <th className="px-4 py-3">Maps to</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['AI User + AI Assistant', 'Collaborative Multi-Agent — cooperative variant'],
                ['Inception prompting', 'Role-specific system prompts per agent node'],
                ['Autonomous cooperation', 'Sequential loop without supervisor'],
                ['Task specification', 'Plan-and-Execute — user agent plans, assistant executes'],
              ].map(([concept, maps]) => (
                <tr key={concept} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{concept}</td>
                  <td className="px-4 py-3 text-slate-400">{maps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CAMEL shows two role-playing agents can cooperate autonomously on complex tasks.',
          'Inception prompting = strong role-specific system prompts per LangGraph node.',
          'Foundation for cooperative and debate-style collaborative multi-agent patterns.',
        ]}
      />
    </LessonArticle>
  )
}
