import {
  Callout,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogether() {
  return (
    <LessonArticle>
      <LessonSection title="Choosing the right LangChain pattern">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Pattern</th>
                <th className="px-4 py-3">Key components</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Simple Q&A', 'prompt | llm', 'ChatPromptTemplate, ChatOpenAI'],
                ['Structured extraction', 'prompt | llm | parser', 'PydanticOutputParser'],
                ['Chatbot with history', 'prompt | llm + Memory', 'ConversationBufferWindowMemory'],
                ['Document Q&A', 'RAG chain', 'Loader, Splitter, Embeddings, VectorStore, Retriever'],
                ['Research assistant', 'ReAct agent', 'Tools, AgentExecutor, search + calculator'],
                ['Multi-step workflow', 'LangGraph', 'State graph, conditional edges, human approval'],
              ].map(([task, pattern, components]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{task}</td>
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{pattern}</td>
                  <td className="px-4 py-3 text-slate-400">{components}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recommended presets">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use case</th>
                <th className="px-4 py-3">temperature</th>
                <th className="px-4 py-3">top_p</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAG Q&A', '0', '1.0', 'Factual — minimise hallucination'],
                ['Agent (ReAct)', '0', '1.0', 'Deterministic tool selection'],
                ['Chatbot', '0.5–0.7', '0.9', 'Natural but not random'],
                ['Creative writing', '0.8–1.2', '0.9', 'More varied output'],
                ['JSON extraction', '0', '1.0', 'Structured — no creativity needed'],
              ].map(([use, temp, topP, notes]) => (
                <tr key={use} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{use}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{temp}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{topP}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Architecture decision flow">
        <Flowchart
          title="Which LangChain pattern do I need?"
          chart={`flowchart TB
  A[What are you building?] --> B{Needs external data?}
  B -- yes --> C{Static docs or live APIs?}
  C -- static docs --> D[RAG Chain]
  C -- live APIs --> E[ReAct Agent with Tools]
  B -- no --> F{Multi-turn conversation?}
  F -- yes --> G[Chain + Memory]
  F -- no --> H{Structured output?}
  H -- yes --> I[Chain + Output Parser]
  H -- no --> J[Simple prompt | llm chain]`}
        />
      </LessonSection>

      <LessonSection title="Common mistakes">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Skipping RAG fundamentals</strong> — tune chunking before blaming the model.</li>
          <li><strong className="text-white">High temperature on agents</strong> — causes wrong tool selection and infinite loops.</li>
          <li><strong className="text-white">Unbounded agent iterations</strong> — always set max_iterations.</li>
          <li><strong className="text-white">Vague tool descriptions</strong> — the model picks tools based on docstrings.</li>
          <li><strong className="text-white">No observability</strong> — use LangSmith to trace chains and debug failures.</li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        You now have the full Generative AI stack: model fundamentals → inference settings → prompting → RAG →
        LangChain implementation. Start with the simplest pattern that works, then add complexity only when needed.
      </Callout>

      <KeyTakeaways
        items={[
          'Simple Q&A = prompt | llm; RAG = loader + splitter + vectorstore + retriever chain; Agents = tools + ReAct.',
          'temperature=0 for RAG, agents, and extraction; 0.7+ only for creative tasks.',
          'Use the decision flowchart to pick the right pattern before writing code.',
          'LangSmith for tracing; LangGraph for complex agent workflows.',
        ]}
      />
    </LessonArticle>
  )
}
