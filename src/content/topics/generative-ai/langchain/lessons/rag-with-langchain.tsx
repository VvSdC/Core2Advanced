import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function RagWithLangchain() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        Complete the <em>RAG</em> sub-topic first (conceptual). This lesson implements that entire pipeline in
        LangChain — loaders, splitters, embeddings, vector stores, retrievers, and the RAG chain.
      </Callout>

      <LessonSection title="The full RAG pipeline in code">
        <Flowchart
          title="LangChain RAG components"
          chart={`flowchart TB
  A[Document Loader] --> B[Text Splitter]
  B --> C[Embedding Model]
  C --> D[Vector Store]
  D --> E[Retriever]
  F[User question] --> G[RAG Chain]
  E --> G
  G --> H[LLM Answer]`}
        />
      </LessonSection>

      <LessonSection title="Step 1 — Load and split documents">
        <ContentStep number={1} title="Document loaders">
          <Example
            title="Load a PDF into Document objects"
          >{`from langchain_community.document_loaders import PyPDFLoader

loader = PyPDFLoader("handbook.pdf")
documents = loader.load()
# Each Document has .page_content (text) and .metadata (source, page)`}</Example>
        </ContentStep>
        <ContentStep number={2} title="Text splitter">
          <Example
            title="Chunk documents for retrieval"
          >{`from langchain_text_splitters import RecursiveCharacterTextSplitter

splitter = RecursiveCharacterTextSplitter(
    chunk_size=500,
    chunk_overlap=50,
)
chunks = splitter.split_documents(documents)
print(f"Created {len(chunks)} chunks")`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Step 2 — Embed and store">
        <Example
          title="Create a vector store from chunks"
        >{`from langchain_openai import OpenAIEmbeddings
from langchain_community.vectorstores import FAISS

embeddings = OpenAIEmbeddings(model="text-embedding-3-small")
vectorstore = FAISS.from_documents(chunks, embeddings)

# Save for later (avoid re-embedding)
vectorstore.save_local("faiss_index")

# Load existing index
vectorstore = FAISS.load_local("faiss_index", embeddings, allow_dangerous_deserialization=True)`}</Example>
      </LessonSection>

      <LessonSection title="Step 3 — Create a retriever">
        <Example
          title="Retriever with search configuration"
        >{`retriever = vectorstore.as_retriever(
    search_type="similarity",
    search_kwargs={"k": 5},   # top-5 chunks
)

# Test retrieval
docs = retriever.invoke("What is the refund policy?")
for doc in docs:
    print(doc.page_content[:100])`}</Example>
      </LessonSection>

      <LessonSection title="Step 4 — Build the RAG chain">
        <ContentStep number={1} title="Format docs and wire the chain">
          <Example
            title="Complete RAG chain with LCEL"
            output="Refunds are available within 30 days of purchase. Contact support@company.com to initiate."
          >{`from langchain_core.prompts import ChatPromptTemplate
from langchain_core.runnables import RunnablePassthrough
from langchain_core.output_parsers import StrOutputParser
from langchain_openai import ChatOpenAI

def format_docs(docs):
    return "\\n\\n".join(
        f"[Source: {d.metadata.get('source', 'unknown')}]\\n{d.page_content}"
        for d in docs
    )

prompt = ChatPromptTemplate.from_messages([
    ("system", "Answer using ONLY the context below. Say 'I don't know' if not found."),
    ("human", "Context:\\n{context}\\n\\nQuestion: {question}"),
])

llm = ChatOpenAI(model="gpt-4o-mini", temperature=0)

rag_chain = (
    {
        "context": retriever | format_docs,
        "question": RunnablePassthrough(),
    }
    | prompt
    | llm
    | StrOutputParser()
)

answer = rag_chain.invoke("What is the refund policy?")
print(answer)`}</Example>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Variations">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">MMR retriever</strong> — <code className="font-mono text-sm">search_type="mmr"</code> for diverse chunks.</li>
          <li><strong className="text-white">Metadata filtering</strong> — <code className="font-mono text-sm">search_kwargs={'{"filter": {"source": "handbook.pdf"}}'}</code>.</li>
          <li><strong className="text-white">Conversational RAG</strong> — add memory so follow-up questions work.</li>
          <li><strong className="text-white">Multi-query retriever</strong> — LLM generates multiple search queries for better recall.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Load → split → embed → store → retrieve → augment prompt → generate.',
          'FAISS for prototyping; Pinecone/Chroma/pgvector for production.',
          'RunnablePassthrough passes the question; retriever | format_docs builds context.',
          'Set temperature=0 for factual RAG answers.',
        ]}
      />
    </LessonArticle>
  )
}
