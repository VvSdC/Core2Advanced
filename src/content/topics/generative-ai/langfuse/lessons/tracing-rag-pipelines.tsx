import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TracingRagPipelines() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete <em>RAG with LangChain</em> and the <em>Langfuse Data Model</em> lesson. This lesson instruments
        the pipeline you already know how to build.
      </Callout>

      <LessonSection title="Trace the full RAG pipeline — three spans minimum">
        <p className="text-slate-300">
          A RAG answer can fail at embed, retrieval, or generation. If you only trace the final LLM call, you cannot
          tell whether bad chunks or a bad prompt caused the wrong answer. Instrument each stage separately.
        </p>
        <Flowchart
          title="RAG trace structure"
          chart={`flowchart TB
  T[Trace: rag_query]
  T --> E[Span: embed_query]
  T --> R[Span: vector_retrieval]
  T --> G[Generation: answer_with_context]
  R -.->|log chunk_ids| R`}
        />
      </LessonSection>

      <Definition term="Why separate spans matter for RAG eval">
        <p>
          When a faithfulness score fails, you need to know: did retrieval return irrelevant chunks, or did the model
          ignore good chunks? Separate spans let you attach eval scores per step and filter traces where{' '}
          <code className="font-mono text-sm">retrieval</code> returned zero results or wrong{' '}
          <code className="font-mono text-sm">chunk_ids</code>.
        </p>
      </Definition>

      <LessonSection title="Manual RAG instrumentation in Python">
        <ContentStep number={1} title="Embed span">
          <Example
            title="Log query embedding"
          >{`from langfuse import observe

@observe(name="embed_query")
def embed_query(query: str) -> list[float]:
    vector = embeddings.embed_query(query)
    return vector`}</Example>
        </ContentStep>

        <ContentStep number={2} title="Retrieval span — log chunk ids">
          <Example
            title="Return chunks and log which ones were retrieved"
            caption="chunk_ids in the output are critical for debugging — you can see exactly which documents influenced the answer."
          >{`@observe(name="vector_retrieval")
def retrieve_chunks(query: str, k: int = 5) -> list[dict]:
    docs = vectorstore.similarity_search(query, k=k)
    chunk_ids = [doc.metadata.get("chunk_id", doc.metadata.get("source")) for doc in docs]
    # Langfuse captures return value as span output — include chunk_ids explicitly
    return {
        "chunk_ids": chunk_ids,
        "chunks": [doc.page_content for doc in docs],
    }`}</Example>
        </ContentStep>

        <ContentStep number={3} title="Generation span">
          <Example
            title="LLM answer with retrieved context"
          >{`@observe(as_type="generation", name="rag_answer")
def generate_answer(query: str, context: str) -> str:
    prompt = f"Context:\\n{context}\\n\\nQuestion: {query}"
    response = llm.invoke(prompt)
    return response.content`}</Example>
        </ContentStep>

        <ContentStep number={4} title="Wire them together">
          <Example
            title="Top-level handler creates one trace with three children"
          >{`@observe(name="rag_query")
def answer_with_rag(user_query: str) -> str:
    embed_query(user_query)  # child span
    retrieval = retrieve_chunks(user_query)  # child span — check chunk_ids here
    context = "\\n\\n".join(retrieval["chunks"])
    return generate_answer(user_query, context)  # child generation`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Debugging RAG eval failures with traces">
        <div className="mt-2 space-y-3">
          {[
            ['Retrieval returned wrong chunks', 'Open vector_retrieval span → check chunk_ids and chunk text. Fix k, reranker, or embedding model.'],
            ['Retrieval returned nothing', 'Span output shows empty chunk_ids. Check index, filters, or query embedding.'],
            ['Good chunks, bad answer', 'Retrieval span looks fine; generation span shows model ignored context. Fix prompt or lower temperature.'],
            ['Eval score dropped after deploy', 'Compare traces before/after — filter by metadata version tag to spot retrieval vs generation regression.'],
          ].map(([problem, fix]) => (
            <div key={problem} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{problem}</p>
              <p className="mt-1 text-sm text-slate-400">{fix}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title="Automatic tracing with LangChain CallbackHandler">
        <p className="text-slate-300">
          If your RAG pipeline is built with LangChain LCEL chains, you do not need to manually wrap every step.
          Langfuse provides a callback handler that auto-traces chains, retrievers, and LLM calls.
        </p>
        <Example
          title="LangChain RAG chain with Langfuse callbacks"
        >{`from langfuse import get_client, observe, propagate_attributes
from langfuse.langchain import CallbackHandler

langfuse = get_client()

@observe(name="rag_chain_invoke")
def run_rag_chain(question: str, session_id: str):
    handler = CallbackHandler()

    with propagate_attributes(session_id=session_id):
        result = rag_chain.invoke(
            {"question": question},
            config={"callbacks": [handler]},
        )
    return result

# CallbackHandler creates nested spans for retriever + LLM automatically`}</Example>
        <Callout variant="tip">
          Use manual spans when you need custom fields like <code className="font-mono text-sm">chunk_ids</code>.
          Use <code className="font-mono text-sm">CallbackHandler</code> for faster setup on standard LangChain
          pipelines — you can add both.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Instrument embed, retrieval, and generation as separate observations in one trace.',
          'Log chunk_ids in the retrieval span output — essential for debugging wrong answers.',
          'RAG eval failures need step-level visibility: bad retrieval vs bad generation look different in traces.',
          'LangChain CallbackHandler auto-traces chains; add manual spans for custom metadata like chunk_ids.',
        ]}
      />
    </LessonArticle>
  )
}
