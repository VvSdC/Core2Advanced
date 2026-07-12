import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2210.03629'

export function ReactLangchainAgents() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ReAct: Synergizing Reasoning and Acting in Language Models"
        authors="Yao et al. (Princeton / Google)"
        year="2022"
        url={PAPER_URL}
      >
        The research behind <strong className="text-white">LangChain's ReAct agents</strong> — interleaved
        reasoning and tool use in a Thought → Action → Observation loop.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete the <em>ReAct Agents</em> lesson first. This paper explains the pattern that{' '}
        <code className="font-mono text-sm">create_react_agent</code> and <code className="font-mono text-sm">AgentExecutor</code>{' '}
        implement in code.
      </Callout>

      <LessonSection title="Why LangChain adopted ReAct">
        <p>
          Before ReAct, agent frameworks used either pure reasoning (chain-of-thought) or pure action (tool
          calling) — but not both in the same loop. ReAct showed that interleaving{' '}
          <strong className="text-white">thoughts and actions</strong> in a single trajectory dramatically
          improves accuracy on tasks requiring external information. LangChain built{' '}
          <code className="font-mono text-sm">create_react_agent</code> directly on this pattern.
        </p>
      </LessonSection>

      <LessonSection title="The ReAct loop in LangChain">
        <Flowchart
          title="Paper concept → LangChain implementation"
          chart={`flowchart TB
  subgraph paper ["ReAct Paper"]
    T1[Thought] --> A1[Action]
    A1 --> O1[Observation]
    O1 --> T1
  end
  subgraph lc ["LangChain Code"]
    T2["Agent generates Thought"] --> A2["AgentExecutor parses Action"]
    A2 --> O2["Tool runs → Observation injected"]
    O2 --> T2
  end`}
        />
      </LessonSection>

      <LessonSection title="Key results relevant to LangChain">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>ReAct outperformed CoT-only and action-only baselines on HotpotQA and AlfWorld.</li>
          <li>Human-interpretable trajectories — verbose=True in AgentExecutor shows the same steps.</li>
          <li>Grounding via tool observations reduces hallucination — why agents use search and calculators.</li>
          <li>The strict output format (Thought/Action/Observation) is why handle_parsing_errors matters.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to LangChain lessons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ReAct Agents', 'create_react_agent implements this exact Thought → Action → Observation loop'],
                ['Tools', 'Actions in the paper map to @tool functions in LangChain'],
                ['Prompt Templates', 'The ReAct prompt format is pulled from LangChain Hub (hwchase17/react)'],
                ['Putting It Together', 'ReAct is the recommended pattern for tasks needing live data or APIs'],
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

      <KeyTakeaways
        items={[
          'ReAct interleaves reasoning (Thought) and tool use (Action → Observation) in a loop.',
          'LangChain create_react_agent + AgentExecutor is a direct implementation of this paper.',
          'Strict output format requires handle_parsing_errors in production.',
          'Use for tasks needing live data — skip for knowledge already in the model.',
        ]}
      />
    </LessonArticle>
  )
}
