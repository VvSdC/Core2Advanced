import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2005.11401'

export function RetrievalAugmentedGeneration() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Retrieval-Augmented Generation for Knowledge-Intensive NLP Tasks"
        authors="Lewis et al. (Facebook AI Research)"
        year="2020"
        url={PAPER_URL}
      >
        The paper that <strong className="text-white">named and formalised RAG</strong> — retrieve documents,
        condition generation on them, and outperform parametric-only models on knowledge-heavy tasks.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Complete <em>RAG Architecture</em> and <em>Augmentation & Generation</em> in Fundamentals first. This
        paper is the research origin story behind the pipeline you already learned — retriever, context, generator.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Imagine you are a journalist writing a story about a company that went public last month. You have two
          options: write entirely from memory (what you learned in journalism school and old articles you half
          remember), or walk to the newsroom library, pull the latest filings and press releases, and write from
          those. The first approach is fast but goes stale. The second is slower but accurate and updatable.
          That is exactly the trade-off Lewis et al. addressed for language models.
        </p>
        <p>
          A standard language model — like BART or GPT — stores knowledge inside its{' '}
          <strong className="text-white">parameters</strong> (millions of numbers adjusted during training).
          This is called <strong className="text-white">parametric memory</strong>: facts are baked into the
          model weights. If Wikipedia changes tomorrow, the model still believes whatever it learned in 2019.
          Lewis et al. added a second kind of memory: a searchable index of real documents called{' '}
          <strong className="text-white">non-parametric memory</strong>. At question time, the model looks up
          relevant passages and reads them before answering — like opening a filing cabinet instead of guessing
          from memory.
        </p>
        <p>
          They wired these two pieces together into one trainable system and gave it a name:{' '}
          <strong className="text-white">Retrieval-Augmented Generation (RAG)</strong>. A{' '}
          <strong className="text-white">retriever</strong> (Dense Passage Retrieval, or DPR) finds the best
          Wikipedia passages for a question. A <strong className="text-white">generator</strong> (BART, a
          sequence-to-sequence model) reads those passages and writes the answer. Crucially, both parts can be
          trained together so the retriever learns to fetch documents the generator can actually use. This paper
          is why every modern RAG stack — LangChain, LlamaIndex, enterprise chatbots — follows the same
          retrieve → augment → generate pattern.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2020, large language models were impressive at fluent text but unreliable on factual,
          knowledge-heavy questions. Ask BART "Who is the CEO of Stripe?" and it might hallucinate a plausible
          name because it never had a reliable way to check current facts at answer time. Researchers had tried
          two separate approaches, neither of which solved the whole problem.
        </p>
        <p>
          <strong className="text-white">Parametric-only models</strong> (BERT, BART, T5) encoded knowledge
          during pre-training and fine-tuning. Updating a single fact meant expensive retraining. The model
          could not cite sources, and you could not inspect what it "knew." Meanwhile,{' '}
          <strong className="text-white">retrieval-only systems</strong> (BM25 + extractive QA) could find
          relevant passages but struggled to synthesise answers when the answer was spread across multiple
          documents or needed rephrasing.
        </p>
        <p>
          REALM (Guu et al., published earlier in 2020) showed retrieval could be baked into pre-training, but
          production systems needed something simpler: bolt a retriever onto an existing generator at inference
          time, update the document index without retraining, and beat pure generation on open-domain QA. Lewis
          et al. unified retrieval and generation into one framework, compared two fusion strategies
          (RAG-Sequence and RAG-Token), and proved the combined system outperformed both BART alone and
          retrieve-then-extract pipelines on Natural Questions and TriviaQA.
        </p>
      </LessonSection>

      <LessonSection title="Architecture overview">
        <Flowchart
          title="RAG system — retriever + generator"
          chart={`flowchart TB
  subgraph index ["Non-parametric memory (Wikipedia index)"]
    W[(21M passages<br/>pre-encoded by DPR)]
  end
  Q[User question] --> QE[Question encoder]
  QE --> RET[Retrieve top-k passages<br/>by vector similarity]
  W -.-> RET
  RET --> AUG[Augment generator input<br/>question + passages]
  AUG --> GEN[BART generator]
  GEN --> ANS[Generated answer]
  subgraph parametric ["Parametric memory"]
    GEN
    QE
  end`}
        />
        <p className="mt-4 text-slate-300">
          The retriever and generator share training signals. The retriever learns which passages help the
          generator produce correct answers; the generator learns how to read retrieved text. The Wikipedia
          index can be swapped out entirely without touching the generator weights.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Build the document index (offline)">
          <p>
            Lewis et al. used Wikipedia split into <strong className="text-white">21 million passages</strong>.
            Each passage was encoded by DPR's passage encoder into a 768-dimensional vector and stored in an
            index. This happens once — like cataloguing every book in a library before opening to the public.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Concrete example:</strong> the passage "Stripe, Inc. is an Irish-American
            financial services company founded in 2010 by Patrick and John Collison" becomes a fixed vector stored
            in the index. It sits there until someone asks a relevant question.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Retrieve relevant passages (online)">
          <p>
            When a user asks "Who founded Stripe?", the question encoder turns the query into a vector. DPR
            computes similarity (dot product) between the question vector and all passage vectors, returning the
            top-k (typically <strong className="text-white">k = 5 to 10</strong>) most relevant passages.
          </p>
          <p className="mt-2 text-slate-400">
            Unlike keyword search, DPR matches by meaning — so a question about "company founders" can still
            retrieve a passage that says "founded by Patrick and John Collison" even if the word "founder" never
            appears in the passage title.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Condition the generator on retrieved text">
          <p>
            The retrieved passages are prepended to the question and fed into BART, a seq2seq model that reads
            input text and generates output text token by token. BART was pre-trained on denoising tasks and
            fine-tuned for generation. With retrieved context in front of it, BART writes an answer grounded in
            real documents instead of guessing from parametric memory alone.
          </p>
        </ContentStep>

        <ContentStep number={4} title="RAG-Sequence — one document set for the whole answer">
          <p>
            <strong className="text-white">RAG-Sequence</strong> treats retrieval as a single decision before
            generation starts. The model retrieves top-k documents, but then picks <em>one</em> document (or
            marginalises over all k) and uses that same document to generate every token of the answer.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Analogy:</strong> a student picks one textbook chapter before writing
            an essay and sticks with it for the entire essay. Simpler, faster, easier to debug — you can always
            inspect which document was chosen.
          </p>
        </ContentStep>

        <ContentStep number={5} title="RAG-Token — different document per generated word">
          <p>
            <strong className="text-white">RAG-Token</strong> is more flexible. When generating each new token,
            the model can attend to a <em>different</em> retrieved document. The probability of the next word is
            a weighted blend across all k documents, where the weights come from how relevant each document is
            to the current generation state.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Analogy:</strong> a journalist who switches between three source
            documents mid-sentence — pulling a date from one, a name from another. More expressive, but harder
            to train and interpret. In practice, later work (like FiD) showed simpler multi-document fusion often
            works just as well.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Train retriever and generator jointly">
          <p>
            The magic is end-to-end training. The generator's loss (did it produce the correct answer?) flows
            back to update both BART <em>and</em> the DPR retriever. If the retriever fetches useless passages,
            the generator fails, and the retriever gets penalised. Over time, the retriever learns to fetch
            passages that actually help answer questions — not just passages that look superficially similar.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Lewis et al. evaluated RAG on four knowledge-intensive NLP tasks, all using the same Wikipedia index
          as the non-parametric memory source.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Open-domain QA</strong> — Natural Questions (real Google search
            queries) and TriviaQA (trivia questions). The model must generate a short answer string, not just
            pick a span from a given paragraph.
          </li>
          <li>
            <strong className="text-white">Abstractive QA</strong> — MS-MARCO, where answers require
            synthesising information rather than copying a single sentence verbatim.
          </li>
          <li>
            <strong className="text-white">Jeopardy-style question generation</strong> — given an answer, generate
            a matching question (the reverse of normal QA).
          </li>
          <li>
            <strong className="text-white">Fact verification</strong> — FEVER dataset: given a claim, predict
            whether it is Supported, Refuted, or NotEnoughInfo based on retrieved evidence.
          </li>
        </ul>
        <p className="mt-3 text-slate-300">
          They compared RAG against strong baselines: BART without retrieval (parametric-only), DPR +
          extractive BERT (retrieve then extract, no generation), and REALM-style approaches. They also ran
          ablation studies swapping RAG-Sequence for RAG-Token and measuring the effect of index size.
        </p>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <p>
          On <strong className="text-white">Natural Questions</strong>, RAG-Token achieved{' '}
          <strong className="text-white">44.5% exact match</strong> accuracy versus 32.5% for BART-large
          without retrieval — a 12-point jump from simply adding a retriever. On{' '}
          <strong className="text-white">TriviaQA</strong>, RAG-Token hit 56.8% exact match compared to 47.5%
          for parametric-only BART. These are not marginal gains; they represent a fundamentally more reliable
          way to answer factual questions.
        </p>
        <p>
          RAG-generated answers were also judged more <strong className="text-white">specific and factual</strong>{' '}
          than BART alone in human evaluations. When BART did not know an answer, it tended to produce vague or
          hallucinated text. RAG, with real passages in context, produced answers that named actual entities,
          dates, and places found in the retrieved documents.
        </p>
        <p>
          The interpretability benefit was significant: you could inspect which Wikipedia passages the retriever
          selected and see exactly what evidence the model had. When the index was updated with new documents,
          answer quality improved <em>without retraining the generator</em> — proving the value of separable
          non-parametric memory. RAG-Token generally edged out RAG-Sequence, but both beat all non-retrieval
          baselines, establishing retrieval-augmented generation as the new standard for open-domain knowledge
          tasks.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <p>
          RAG-Token's per-token document selection is powerful but expensive to train and hard to deploy. The
          retriever indexes 21 million passages — at scale, vector search latency and index maintenance become
          engineering challenges. RAG also assumes retrieved passages are trustworthy; if the index contains
          outdated or wrong information, the generator will confidently cite it.
        </p>
        <p>
          <strong className="text-white">Fusion-in-Decoder (FiD)</strong>, published months later by Izacard &
          Grave, showed a simpler pattern: retrieve many passages, encode each separately, fuse them all in the
          decoder in one pass. FiD beat RAG on several QA benchmarks with less architectural complexity — and
          became the template for modern "stuff all chunks in the prompt" RAG.
        </p>
        <p>
          Today's production RAG rarely uses RAG-Token's per-token switching. Instead, systems combine DPR-style
          dense retrieval (or descendants like Contriever, BGE, E5) with large instruction-tuned LLMs (GPT-4,
          Claude, Llama) that read multiple retrieved chunks at once. Lewis et al.'s core insight — separate
          parametric and non-parametric memory, train them together, update knowledge via the index — remains the
          foundation of every RAG system built since.
        </p>
      </LessonSection>

      <LessonSection title="Connection to lessons">
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
                [
                  'Introduction to RAG',
                  'This paper explains *why* retrieval was added to generation — parametric memory goes stale and hallucinates',
                ],
                [
                  'RAG Architecture',
                  'The retrieve → augment → generate pipeline in the lesson is the exact system Lewis et al. built and named',
                ],
                [
                  'Augmentation & Generation',
                  'Shows how stuffing retrieved Wikipedia passages into the generator input produces more factual answers',
                ],
                [
                  'Dense Passage Retrieval (DPR paper)',
                  'DPR is the retriever Lewis et al. used — read that paper to understand the search half of RAG',
                ],
                [
                  'Fusion-in-Decoder (FiD paper)',
                  'FiD simplified and improved on RAG-Token — the evolution from research RAG to practical multi-chunk prompts',
                ],
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

      <Callout variant="beginner" title="Key insight for beginners">
        RAG works because it separates <em>what the model memorised during training</em> (parametric memory)
        from <em>what it can look up right now</em> (non-parametric memory in a document index). You can update
        the index anytime — add new PDFs, swap Wikipedia for your company docs — without retraining the
        generator. That updatable knowledge is the whole point.
      </Callout>

      <KeyTakeaways
        items={[
          'RAG combines a DPR retriever (non-parametric memory) with a BART generator (parametric memory) into one trainable system.',
          'RAG-Sequence picks one retrieved document for the entire answer; RAG-Token can switch documents per generated token.',
          'Joint training lets the retriever learn to fetch passages the generator can actually use to answer correctly.',
          'Beat parametric-only BART by 12+ points on Natural Questions — answers were more specific, factual, and inspectable.',
          'Foundation for every modern RAG stack: the index can be hot-swapped to update knowledge without retraining.',
        ]}
      />
    </LessonArticle>
  )
}
