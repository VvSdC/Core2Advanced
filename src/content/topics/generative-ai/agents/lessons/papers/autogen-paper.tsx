import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2308.08155'

export function AutoGenPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="AutoGen: Enabling Next-Gen LLM Applications via Multi-Agent Conversation"
        authors="Wu et al. (Microsoft)"
        year="2023"
        url={PAPER_URL}
      >
        A framework for <strong className="text-white">multi-agent conversation</strong> — configurable agents
        that chat with each other and humans to solve tasks.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>Sequential Multi-Agent</em> and <em>Collaborative Multi-Agent</em>. AutoGen is the
        canonical framework for conversational multi-agent patterns.
      </Callout>

      <LessonSection title="AutoGen conversation patterns">
        <Flowchart
          title="Two-agent chat"
          chart={`flowchart LR
  User --> A1[Assistant Agent]
  A1 --> A2[User Proxy / Executor]
  A2 --> Code[Run code / tools]
  Code --> A2
  A2 --> A1
  A1 --> User`}
        />
        <p className="mt-4 text-slate-300">
          AutoGen pairs an <strong className="text-white">assistant</strong> (plans and writes code) with a{' '}
          <strong className="text-white">user proxy</strong> (executes code, returns results). The conversation
          continues until the task is done — a sequential multi-agent pattern.
        </p>
      </LessonSection>

      <LessonSection title="Connection to lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">AutoGen pattern</th>
                <th className="px-4 py-3">Our lesson</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Two-agent chat', 'Sequential Multi-Agent'],
                ['Group chat', 'Collaborative Multi-Agent'],
                ['Nested chats', 'Hierarchical Multi-Agent'],
                ['Human-in-the-loop', 'LangGraph human-in-the-loop lesson'],
              ].map(([pattern, lesson]) => (
                <tr key={pattern} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{pattern}</td>
                  <td className="px-4 py-3 text-slate-400">{lesson}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'AutoGen formalises multi-agent conversation as the core abstraction.',
          'Assistant + executor pair maps to sequential multi-agent in LangGraph.',
          'Group chat and nested chats extend to collaborative and hierarchical patterns.',
        ]}
      />
    </LessonArticle>
  )
}
