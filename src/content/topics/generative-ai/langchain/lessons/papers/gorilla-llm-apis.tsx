import {
  Callout,
  ContentStep,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2305.15334'

export function GorillaLlmApis() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Gorilla: Large Language Model Connected with Massive APIs"
        authors="Patil et al. (UC Berkeley)"
        year="2023"
        url={PAPER_URL}
      >
        Fine-tuned an LLM to generate <strong className="text-white">correct API calls</strong> from natural
        language — retrieving the right function and arguments from thousands of available APIs.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Tools</em> and <em>Output Parsers</em> first. Gorilla tackles the hardest part of tool use:
        picking the right API and generating valid arguments from a large catalogue.
      </Callout>

      <LessonSection title="Background — API selection at scale">
        <p>
          LangChain apps often expose 5–10 tools. But cloud platforms offer thousands of APIs. How does a model
          pick the right one and format the call correctly? Gorilla combined{' '}
          <strong className="text-white">retrieval over API documentation</strong> with a fine-tuned LLM to
          generate accurate function calls.
        </p>
      </LessonSection>

      <LessonSection title="How Gorilla works">
        <ContentStep number={1} title="Retriever-Augmented API calls">
          <p>
            API documentation is indexed in a vector store (sound familiar?). At query time, the most relevant
            API docs are retrieved and included in the prompt. The model generates the API call with correct
            endpoint, method, and arguments.
          </p>
        </ContentStep>
        <ContentStep number={2} title="APIBench">
          <p>
            The authors built <strong className="text-white">APIBench</strong> — a benchmark of 1,600+ APIs from
            TorchHub, TensorHub, and Hugging Face. Gorilla achieved 85%+ accuracy on API call generation,
            outperforming GPT-4 on this task.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hallucination reduction">
          <p>
            Standard LLMs hallucinate API endpoints that do not exist. Gorilla's retrieval step grounds calls
            in real documentation — the same RAG pattern from the <em>RAG</em> sub-topic applied to API docs.
          </p>
        </ContentStep>
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
                ['Tools', 'Gorilla shows why tool descriptions must be precise — model picks from docs'],
                ['RAG with LangChain', 'Gorilla uses RAG over API docs — same retriever + prompt pattern'],
                ['Output Parsers', 'API calls need structured output — Pydantic schemas validate arguments'],
                ['ReAct Agents', 'Agents with many tools face the same selection problem Gorilla solves'],
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
          'Gorilla generates correct API calls by retrieving relevant docs from a vector store.',
          'RAG applied to API documentation — same pattern as document Q&A in LangChain.',
          '85%+ accuracy on 1,600+ APIs; reduces hallucinated endpoints.',
          'When exposing many tools in LangChain, use clear descriptions and consider retrieval over tool docs.',
        ]}
      />
    </LessonArticle>
  )
}
