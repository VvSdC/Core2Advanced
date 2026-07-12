import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2303.17580'

export function HuggingGpt() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="HuggingGPT: Solving AI Tasks with ChatGPT and its Friends in Hugging Face"
        authors="Shen et al. (Microsoft Research)"
        year="2023"
        url={PAPER_URL}
      >
        An LLM as <strong className="text-white">orchestrator</strong> — planning which models and tools to call
        for complex multi-step tasks. The architectural vision behind LangChain's chain composition.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Chains & LCEL</em> and <em>Putting It Together</em> first. HuggingGPT is the research version
        of what LCEL chains and agents do in code — an LLM coordinating multiple tools and models.
      </Callout>

      <LessonSection title="Background — one model is not enough">
        <p>
          No single model excels at everything — image generation, speech recognition, text summarisation, and
          code execution each need specialised models. HuggingGPT proposed using an LLM (ChatGPT) as a{' '}
          <strong className="text-white">controller</strong> that plans, dispatches tasks to expert models, and
          synthesises results.
        </p>
      </LessonSection>

      <LessonSection title="The four-stage pipeline">
        <Flowchart
          title="HuggingGPT controller loop"
          chart={`flowchart TB
  A[User request] --> B[Task Planning — LLM breaks into subtasks]
  B --> C[Model Selection — pick expert model per subtask]
  C --> D[Task Execution — run each model/tool]
  D --> E[Response Generation — LLM summarises all results]
  E --> F([Final answer])`}
        />
        <ContentStep number={1} title="Task planning">
          <p>
            The LLM decomposes "describe this image and translate to French" into: (1) image captioning, (2) translation.
            LangChain's <code className="font-mono text-sm">RunnableParallel</code> and agent planners do the same.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Model selection">
          <p>
            For each subtask, the LLM selects the best model from a registry (Hugging Face hub). In LangChain,
            this maps to choosing the right tool or chain branch.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Successfully orchestrated multimodal tasks across vision, language, and speech models.</li>
          <li>LLM-as-controller handled tasks no single model could solve alone.</li>
          <li>Demonstrated that planning + dispatch + synthesis is a general pattern for AI systems.</li>
        </ul>
      </LessonSection>

      <LessonSection title="HuggingGPT vs LangChain">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">HuggingGPT stage</th>
                <th className="px-4 py-3">LangChain equivalent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Task planning', 'Agent planner / LangGraph state machine'],
                ['Model selection', 'Tool selection in ReAct agent'],
                ['Task execution', 'Tool invocation via AgentExecutor'],
                ['Response generation', 'Final chain step or agent Final Answer'],
              ].map(([stage, lc]) => (
                <tr key={stage} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{stage}</td>
                  <td className="px-4 py-3 text-slate-400">{lc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'HuggingGPT uses an LLM as controller to plan, select, execute, and synthesise across expert models.',
          'Maps directly to LangChain chains (LCEL), agents, and LangGraph orchestration.',
          'Shows that complex AI tasks need decomposition — not a single monolithic model call.',
          'Foundation for multi-tool agent architectures in production.',
        ]}
      />
    </LessonArticle>
  )
}
