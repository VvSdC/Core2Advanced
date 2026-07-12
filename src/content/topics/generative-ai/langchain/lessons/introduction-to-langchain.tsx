import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToLangchain() {
  return (
    <LessonArticle>
      <Definition term="LangChain">
        <p>
          <strong className="text-white">LangChain</strong> is an open-source Python (and JavaScript) framework
          for building applications on top of language models. It provides reusable components — prompt templates,
          model wrappers, chains, retrievers, agents, and memory — so you compose LLM pipelines instead of
          writing raw API calls.
        </p>
      </Definition>

      <LessonSection title="Why LangChain exists">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Raw API calls get messy fast — prompts, parsing, retries, and tool loops spread across hundreds of lines.</li>
          <li>LangChain standardises the building blocks so you swap models or vector stores without rewriting everything.</li>
          <li>LCEL (LangChain Expression Language) lets you pipe components together with the <code className="font-mono text-sm">|</code> operator.</li>
          <li>The ecosystem includes LangSmith (observability), LangGraph (stateful agents), and 100+ integrations.</li>
        </ul>
      </LessonSection>

      <LessonSection title="LangChain component map">
        <Flowchart
          title="How LangChain pieces fit together"
          chart={`flowchart TB
  A[Prompt Templates] --> B[Chains / LCEL]
  C[Chat Models] --> B
  D[Output Parsers] --> B
  E[Memory] --> B
  F[Document Loaders] --> G[Text Splitters]
  G --> H[Embeddings]
  H --> I[Vector Stores]
  I --> J[Retrievers]
  J --> K[RAG Chain]
  B --> K
  L[Tools] --> M[Agents]
  C --> M
  M --> N[Agent Executor]`}
        />
      </LessonSection>

      <Callout variant="beginner" title="Read this after">
        Complete <em>RAG</em> first (conceptual). This sub-topic implements those ideas in code. Also helpful:
        <em> Prompt Engineering</em> and <em>Inference Parameters</em>.
      </Callout>

      <LessonSection title="What you will learn">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Lesson</th>
                <th className="px-4 py-3">Covers</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Prompt Templates', 'Reusable, variable prompts'],
                ['Models & Inference', 'ChatOpenAI, streaming, temperature/top-p'],
                ['Chains & LCEL', 'Pipe operator, RunnableSequence'],
                ['Output Parsers', 'JSON, Pydantic structured output'],
                ['Memory', 'Conversation history across turns'],
                ['RAG with LangChain', 'Full retrieval pipeline in code'],
                ['Tools', 'Defining callable functions for agents'],
                ['ReAct Agents', 'Reasoning + tool-use loops'],
              ].map(([lesson, covers]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{covers}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LangChain is a framework for composing LLM applications from reusable components.',
          'LCEL pipes prompts, models, parsers, and retrievers with the | operator.',
          'Covers the full stack: prompting → chains → RAG → agents.',
          'This sub-topic includes code snippets; the RAG sub-topic was conceptual only.',
        ]}
      />
    </LessonArticle>
  )
}
