import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function RagArchitecture() {
  return (
    <LessonArticle>
      <LessonSection title="A library has two kinds of work">
        <p className="mb-4 text-slate-300">
          Think of a public library. Before anyone can find a book, librarians spend weeks{' '}
          <strong className="text-white">cataloguing</strong> — sorting books onto shelves, writing index cards,
          and labelling every section. That work happens once, in the background, before the doors open.
        </p>
        <p className="mb-4 text-slate-300">
          When a visitor walks in and asks "Where can I find books about gardening?", a librarian{' '}
          <strong className="text-white">looks up the catalogue</strong>, walks to the right shelf, pulls the
          relevant books, and hands them over. That happens every time someone asks — fast, because the hard
          preparation work was already done.
        </p>
        <p className="mb-4 text-slate-300">
          Every RAG system works the same way. There is an <strong className="text-white">offline phase</strong>{' '}
          (library preparation — run once when documents arrive) and an <strong className="text-white">online phase</strong>{' '}
          (library visit — run every time a user asks a question).
        </p>
        <Callout variant="beginner" title="In simple terms">
          You do not re-catalogue the entire library every time someone asks a question. You catalogued it once.
          RAG works identically: prepare your documents ahead of time, then search them quickly at question time.
        </Callout>
      </LessonSection>

      <Definition term="RAG architecture">
        <p>
          <strong className="text-white">RAG architecture</strong> is the blueprint for how documents flow through
          a RAG system — from raw files to searchable chunks to retrieved evidence to a final answer. It splits
          into two pipelines: <strong className="text-white">indexing</strong> (offline, runs on document upload)
          and <strong className="text-white">querying</strong> (online, runs per user question).
        </p>
      </Definition>

      <LessonSection title="The big picture — two pipelines, one database">
        <Flowchart
          title="RAG system architecture"
          chart={`flowchart TB
  subgraph offline ["Offline — Indexing Pipeline (run once per document)"]
    A[Raw documents] --> B[Chunking]
    B --> C[Embedding]
    C --> D[(Vector Database)]
  end
  subgraph online ["Online — Query Pipeline (run per question)"]
    E[User question] --> F[Embed query]
    F --> G[Retrieve top-k chunks]
    G --> H[Build augmented prompt]
    H --> I[LLM generates answer]
    I --> J([Response to user])
  end
  D -.-> G`}
        />
        <p className="mt-4 text-slate-300">
          The <strong className="text-white">vector database</strong> sits in the middle — it is the catalogue
          the offline phase builds and the online phase searches. Everything else connects to it.
        </p>
      </LessonSection>

      <LessonSection title="Walkthrough: a 50-page employee handbook">
        <p className="mb-4 text-slate-300">
          Let us follow a real document — a 50-page PDF called <em>Acme_Employee_Handbook.pdf</em> — through
          both phases. By the end, you will know exactly what each step produces.
        </p>

        <Callout variant="tip" title="Our scenario">
          Acme Corp uploads their handbook so employees can ask questions like "How many vacation days do I get?"
          or "What is the dress code?" through an internal chatbot.
        </Callout>

        <p className="mb-4 mt-6 font-semibold text-white">Phase 1 — Offline indexing (happens once)</p>

        <ContentStep number={1} title="Document ingestion — loading the raw file">
          <p>
            The system receives the 50-page PDF and extracts its text. It also records{' '}
            <strong className="text-white">metadata</strong> — extra labels like the filename, page numbers, upload
            date, and document type.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> one long string of plain text (~25,000
            words) plus metadata attached to the whole document. The PDF formatting (fonts, images, headers) is
            stripped away — only the words remain.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Chunking — splitting into searchable pieces">
          <p>
            A 50-page document is too large to search precisely or fit into a single prompt. The system cuts it
            into smaller pieces called <strong className="text-white">chunks</strong> — typically 300–500 words
            each, with a small overlap so sentences at chunk boundaries are not lost.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> roughly 80–120 chunks. For example:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-400">
            <li>Chunk 14: "Vacation Policy — Full-time employees receive 15 days of paid vacation per year…" (page 8)</li>
            <li>Chunk 15: "Vacation days accrue monthly and must be requested at least two weeks in advance…" (page 8–9)</li>
            <li>Chunk 31: "Dress Code — Business casual is required in all office locations…" (page 19)</li>
            <li>Chunk 47: "Refund Policy for Company Store — Items may be returned within 30 days…" (page 34)</li>
          </ul>
          <p className="mt-3">
            Each chunk keeps its metadata: source file, page number, section title.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Embedding — turning text into searchable numbers">
          <p>
            Each chunk's text is fed through an <strong className="text-white">embedding model</strong> — a
            specialised AI that converts meaning into a <strong className="text-white">vector</strong> (a fixed-length
            list of numbers, e.g. 1,536 numbers). Chunks about similar topics end up with similar vectors.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> 80–120 vectors — one per chunk. Chunk
            14 (vacation policy) and Chunk 15 (vacation accrual) will have very similar vectors. Chunk 31 (dress
            code) will have a quite different vector.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Storage — saving everything in the vector database">
          <p>
            Each chunk is stored in a <strong className="text-white">vector database</strong> as a record
            containing three things: the original text, the metadata, and the embedding vector. The database is
            optimised for fast similarity search — finding vectors closest to a query vector in milliseconds.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> 80–120 searchable records sitting in
            the database, ready for questions. The offline work is done. The handbook will not be re-processed
            unless it is updated.
          </p>
        </ContentStep>

        <p className="mb-4 mt-8 font-semibold text-white">Phase 2 — Online querying (happens per question)</p>

        <ContentStep number={5} title="Query embedding — understanding the question">
          <p>
            An employee types: <em>"How many vacation days do I get per year?"</em> The system converts this
            question into a vector using the <strong className="text-white">same embedding model</strong> used
            during indexing. This is critical — mixing models would be like searching a catalogue written in
            French with an English index.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> one query vector representing the
            meaning of the question.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Retrieval — finding the best chunks">
          <p>
            The query vector is compared against all stored chunk vectors. The database returns the{' '}
            <strong className="text-white">top-k</strong> most similar chunks — typically the top 3 to 5.{' '}
            <em>k</em> is just the number of chunks you ask for.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> a short list of the most relevant
            passages. For our vacation question, the system likely returns Chunk 14 and Chunk 15 (both about
            vacation policy) and maybe Chunk 22 (about part-time employee benefits, if similarity is close).
          </p>
        </ContentStep>

        <ContentStep number={7} title="Augmentation — building the prompt">
          <p>
            The retrieved chunks are placed into a structured prompt along with instructions and the user's
            original question. The LLM will see the evidence before it sees the question.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> a complete prompt ready to send to
            the LLM. Covered in detail in the next lesson (<em>Augmentation and Generation</em>).
          </p>
        </ContentStep>

        <ContentStep number={8} title="Generation — the LLM writes the answer">
          <p>
            The LLM reads the prompt — instructions, retrieved chunks, and the question — and writes a natural
            language answer grounded in the evidence.
          </p>
          <p className="mt-3">
            <strong className="text-white">What this step produces:</strong> the final response the employee sees:
            <em>"Full-time employees at Acme receive 15 days of paid vacation per year. Vacation days accrue
            monthly and must be requested at least two weeks in advance (Handbook, page 8)."</em>
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Indexing pipeline — the three core steps">
        <p className="mb-4 text-slate-300">
          The offline phase always follows the same pattern, regardless of document type:
        </p>
        <ContentStep number={1} title="Ingest">
          <p>
            Load raw sources — PDFs, Word docs, web pages, database exports — and normalise them to plain text
            with metadata (source name, page, date, author, department).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Chunk">
          <p>
            Split large documents into passages sized for both embedding models and LLM context windows. Chunk
            size and overlap are design choices covered in <em>Chunking Strategies</em>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Embed and store">
          <p>
            Convert each chunk to a vector and save text + metadata + vector in the vector database. Covered in
            <em> Embeddings</em> and <em>Vector Databases</em>.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Query pipeline — the three core steps">
        <p className="mb-4 text-slate-300">
          The online phase also follows a fixed pattern for every question:
        </p>
        <ContentStep number={1} title="Embed the question">
          <p>
            Convert the user's question to a vector using the identical embedding model from indexing.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Retrieve">
          <p>
            Search the vector database for the top-k most similar chunks. The retrieval strategy (semantic only,
            keyword only, or hybrid) is covered in <em>Retrieval Strategies</em>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Augment and generate">
          <p>
            Insert chunks into a prompt template. The LLM reads context + question and produces a grounded answer.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Architecture decisions you make upfront">
        <p className="mb-4 text-slate-300">
          Every RAG system requires choices before it goes live. Each choice affects a different part of the
          pipeline:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Decision</th>
                <th className="px-4 py-3">What it affects</th>
                <th className="px-4 py-3">Plain-language guide</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Embedding model',
                  'Whether similar questions find similar chunks',
                  'Must be the same model at index and query time — no exceptions',
                ],
                [
                  'Chunk size and overlap',
                  'How precise or broad each searchable piece is',
                  'Smaller chunks = more precise but less context per piece',
                ],
                [
                  'Vector database',
                  'Speed, scale, and filtering at search time',
                  'Choose based on how many documents and how fast you need answers',
                ],
                [
                  'Retrieval strategy',
                  'Whether you find chunks by meaning, keywords, or both',
                  'Semantic search for paraphrased questions; keyword search for exact terms',
                ],
                [
                  'k (number of chunks retrieved)',
                  'How much evidence the LLM sees per question',
                  'Too few = missing context; too many = noise and higher cost',
                ],
                [
                  'Prompt template',
                  'How the LLM uses the evidence it receives',
                  'Controls citations, refusal behaviour, and answer format',
                ],
              ].map(([decision, affects, guide]) => (
                <tr key={decision} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{decision}</td>
                  <td className="px-4 py-3 text-slate-400">{affects}</td>
                  <td className="px-4 py-3 text-slate-400">{guide}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="insight">
        RAG never changes the LLM's internal weights (the parameters it learned during training). It only changes{' '}
        <em>what the model reads</em> before answering. If the right chunk never makes it into the prompt, no LLM
        — no matter how powerful — can answer correctly. Retrieval is almost always the bottleneck.
      </Callout>

      <Callout variant="beginner" title="Common confusion">
        "Offline" does not mean the indexing pipeline runs without internet. It means it runs{' '}
        <em>ahead of time</em> — when documents are uploaded or updated — not when a user is waiting for an
        answer. "Online" means it runs in real time, per question.
      </Callout>

      <KeyTakeaways
        items={[
          'RAG has two phases: offline indexing (prepare documents once) and online querying (answer each question).',
          'Indexing: ingest → chunk → embed → store. A 50-page PDF becomes ~80–120 searchable records.',
          'Querying: embed question → retrieve top-k chunks → augment prompt → LLM generates answer.',
          'The vector database is the bridge — built during indexing, searched during querying.',
          'Retrieval quality is the bottleneck. If the wrong chunk is missing from the prompt, the LLM cannot answer correctly.',
          'Each architecture decision (embedding model, chunk size, k, prompt) has its own section in this sub-topic.',
        ]}
      />
    </LessonArticle>
  )
}
