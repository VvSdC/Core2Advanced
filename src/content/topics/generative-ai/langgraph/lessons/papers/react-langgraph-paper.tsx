import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2210.03629'

export function ReactLanggraphPaper() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ReAct: Synergizing Reasoning and Acting in Language Models"
        authors="Yao et al. (Princeton / Google)"
        year="2022"
        url={PAPER_URL}
      >
        The <strong className="text-white">agent loop</strong> that LangGraph implements as an explicit graph —
        Thought → Action → Observation until done.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        <em>ReAct Agent in LangGraph</em> lesson. This paper is the theory; LangGraph is the implementation.
      </Callout>

      <LessonSection title="Mapped to LangGraph">
        <Flowchart
          title="ReAct paper → LangGraph nodes"
          chart={`flowchart TB
  T[Thought — agent node LLM] --> A[Action — tool_calls in AIMessage]
  A --> O[Observation — ToolNode result]
  O --> T`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">agent node</strong> = Thought + Action selection</li>
          <li><strong className="text-white">tools_condition</strong> = decide if Action is needed</li>
          <li><strong className="text-white">ToolNode</strong> = execute Action, produce Observation</li>
          <li><strong className="text-white">add_messages reducer</strong> = accumulate full trajectory in state</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ReAct interleaves reasoning and tool use — the default LangGraph agent cycle.',
          'LangGraph makes each ReAct step an explicit node with inspectable state.',
          'tools_condition + ToolNode replace string parsing from AgentExecutor.',
        ]}
      />
    </LessonArticle>
  )
}
