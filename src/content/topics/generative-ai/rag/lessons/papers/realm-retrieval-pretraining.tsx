import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2002.08909'

export function RealmRetrievalPretraining() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="REALM: Retrieval-Augmented Language Model Pre-Training"
        authors="Guu et al. (Google Research)"
        year="2020"
        url={PAPER_URL}
      >
        Trained a language model to <strong className="text-white">retrieve and read documents during
        pre-training</strong> — not just at inference time — teaching the model to use external knowledge from
        the start.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>Introduction to RAG</em> and the <em>RAG (Lewis et al.)</em> paper in Fundamentals first.
        REALM is the "other half" of the 2020 retrieval story — it asks what happens when you teach retrieval
        during training, not just at query time.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Most RAG systems today work like a student who crams for years from textbooks, then — only on exam day —
          is finally allowed to open a reference book. Lewis et al.'s RAG bolts retrieval onto a pre-trained model
          at inference time: the model never practised searching during its education. REALM flips this: what if
          the model learned to use a library <em>from day one</em> of pre-training?
        </p>
        <p>
          During REALM's training, the model reads a sentence with important words hidden (masked). Instead of
          guessing from memory, it must search a Wikipedia index, pull relevant articles, read them, and then
          predict the missing words. Over millions of rounds, both the searcher (retriever) and the reader
          (language model) improve together. The retriever learns which documents help prediction; the language
          model learns how to extract useful information from retrieved text.
        </p>
        <p>
          Think of it like raising a child with weekly library trips from age five, versus one who only discovers
          libraries in college. The skill becomes instinctive. REALM proved that retrieval is not just a bolt-on
          feature — it can be a core ability baked into the model during pre-training. While production systems
          mostly use inference-time RAG (simpler to deploy and update), REALM shaped how researchers think about
          retrieval-aware language models and influenced later work on training retrievers end-to-end.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By early 2020, BERT and its variants dominated NLP by learning language patterns from massive text
          corpora. But BERT's knowledge lived entirely in its parameters. It could not look up fresh information,
          and it struggled on questions requiring facts not seen during pre-training. Researchers knew external
          knowledge helped — open-domain QA systems already used BM25 to fetch Wikipedia passages — but retrieval
          was always a separate, hand-engineered step bolted on after pre-training.
        </p>
        <p>
          Lewis et al.'s RAG (published later the same year) showed retrieval + generation works at inference
          time, but the retriever and generator were fine-tuned together on downstream tasks — not during the
          model's foundational language learning phase. The open question was: can you teach a model to retrieve
          as a <em>skill</em> during pre-training itself, the same way it learns grammar and semantics?
        </p>
        <p>
          REALM answered yes. Guu et al. integrated a differentiable retriever directly into the masked
          language modelling objective — the same pre-training task BERT uses. The model had to retrieve Wikipedia
          documents to fill in masked tokens, creating a feedback loop where better retrieval improved language
          modelling, and better language modelling improved retrieval. This was the first large-scale demonstration
          that retrieval and language understanding could be co-trained from scratch.
        </p>
      </LessonSection>

      <LessonSection title="Architecture overview">
        <Flowchart
          title="REALM pre-training loop"
          chart={`flowchart TB
  subgraph input ["Masked input text"]
    T["The [MASK] was founded in 2010<br/>by Patrick and John Collison"]
  end
  T --> RET[Differentiable retriever<br/>search Wikipedia index]
  RET --> TOP[Top retrieved passages]
  TOP --> READ[Reader / LM conditions on passages]
  READ --> PRED[Predict masked tokens]
  PRED --> LOSS[Language modelling loss]
  LOSS -->|gradients flow back| RET
  LOSS -->|gradients flow back| READ
  subgraph wiki ["Wikipedia index (millions of passages)"]
    IDX[(Pre-computed passage embeddings<br/>updated periodically)]
  end
  IDX -.-> RET`}
        />
        <p className="mt-4 text-slate-300">
          Unlike inference-time RAG, retrieval happens on every pre-training step. The retriever is not a frozen
          external tool — it is part of the model being trained, and its weights update alongside the language
          model reader.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Start with masked language modelling (MLM)">
          <p>
            REALM uses the same core idea as BERT: hide random words in a sentence and train the model to predict
            them. But instead of relying only on surrounding context and parametric memory, the model is
            encouraged to retrieve external documents that contain the answer.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Concrete example:</strong> given "Stripe was founded in [MASK] by the
            Collison brothers," the model needs to predict "2010." Surrounding words give hints, but the exact
            year likely requires looking up a Wikipedia article about Stripe.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Salient span masking — mask what matters">
          <p>
            REALM does not mask random words. It uses <strong className="text-white">salient span masking</strong>:
            it hides named entities, dates, numbers, and other fact-heavy spans — the kinds of tokens that
            genuinely benefit from retrieval. Masking function words like "the" or "is" would not teach the
            retriever anything useful.
          </p>
          <p className="mt-2 text-slate-400">
            This forces the model to actually use retrieved documents rather than coasting on parametric memory
            for easy predictions. It is the difference between hiding the answer on a flashcard versus hiding
            the word "the."
          </p>
        </ContentStep>

        <ContentStep number={3} title="Retrieve Wikipedia passages">
          <p>
            A <strong className="text-white">differentiable retriever</strong> embeds the masked input and
            searches a Wikipedia index of millions of passages using maximum inner product search (MIPS) — finding
            the passage vector most similar to the query vector via dot product. The top passages are fed to the
            reader. Because retrieval is differentiable, gradients from wrong predictions flow back to improve the
            retriever's embeddings.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Read retrieved documents and predict">
          <p>
            The reader (a Transformer language model) conditions on both the masked input text and the retrieved
            Wikipedia passages, then predicts the masked tokens. If the retriever fetched the right Stripe
            article, prediction is easy. If it fetched an irrelevant page about fishing, prediction fails and the
            retriever gets penalised.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Joint optimisation over millions of steps">
          <p>
            This retrieve → read → predict loop runs across the entire pre-training corpus for hundreds of
            thousands of steps. The retriever gradually learns to fetch documents that help language modelling,
            and the reader learns to extract relevant facts from noisy retrieved text. Retrieval quality measurably
            improves throughout training — the model literally gets better at searching over time.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Periodic index refresh">
          <p>
            As the retriever's embeddings change during training, the Wikipedia index (pre-computed passage
            vectors) becomes stale. REALM periodically <strong className="text-white">re-embeds and re-indexes</strong>{' '}
            all passages — an expensive but necessary step. This is one reason inference-time RAG (with a
            separately trained, stable retriever) became more popular in production.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Guu et al. evaluated REALM on open-domain question answering — the same setting as RAG and DPR —
          where the model must answer questions using a large Wikipedia corpus with no document provided upfront.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Open-domain QA</strong> — Natural Questions, WebQuestions, and CuratedTREC.
            REALM was evaluated in a zero-shot setting: pre-train with retrieval, then answer questions without
            task-specific fine-tuning on QA labels.
          </li>
          <li>
            <strong className="text-white">Retrieval quality over training</strong> — they tracked whether the
            retriever found passages containing the correct answer as pre-training progressed, measuring the
            feedback loop between retrieval and language modelling.
          </li>
          <li>
            <strong className="text-white">Comparison to BERT</strong> — same model size and data, but BERT has
            no retrieval component. This isolates the value of retrieval-augmented pre-training.
          </li>
          <li>
            <strong className="text-white">Ablations on masking strategy</strong> — random masking vs salient span
            masking, to prove that masking important facts (not filler words) drives retrieval learning.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <p>
          On <strong className="text-white">Natural Questions</strong>, REALM achieved strong open-domain QA
          performance without any task-specific fine-tuning on QA data — matching or exceeding BERT-based models
          that were explicitly fine-tuned for QA. This was remarkable: the model learned to answer questions as a
          side effect of learning to retrieve during pre-training.
        </p>
        <p>
          Retrieval quality improved steadily throughout pre-training. Early in training, the retriever often
          fetched irrelevant passages. By the end, it consistently retrieved Wikipedia articles containing the
          correct answer for masked spans. This proved the feedback loop works — the retriever and reader genuinely
          co-evolve rather than the retriever being a static add-on.
        </p>
        <p>
          Salient span masking was critical: models trained with random masking did not learn to retrieve
          effectively because most masked tokens were predictable from local context. Masking names, dates, and
          entities forced genuine dependence on external knowledge. REALM established that retrieval can be a
          first-class citizen in pre-training, not just an inference-time hack — even though the simpler
          inference-time RAG pattern won in production deployments.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <p>
          REALM's pre-training is enormously expensive. Re-indexing millions of Wikipedia passages every few
          thousand training steps adds massive compute cost. The retriever and reader are tightly coupled — you
          cannot easily swap in a new document index or update knowledge without retraining, unlike inference-time
          RAG where you just re-embed your documents.
        </p>
        <p>
          Lewis et al.'s RAG took the more practical path: use a pre-trained retriever (DPR) and generator (BART),
          fine-tune them together on downstream tasks, and update knowledge by swapping the index at inference
          time. This "inference-time RAG" pattern became the industry standard (LangChain, LlamaIndex, etc.)
          because it is simpler to deploy and maintain.
        </p>
        <p>
          REALM's ideas lived on in later research: RETRO (Borgeaud et al., 2022) retrieved at scale during
          pre-training for large language models; Atlas (Izacard et al., 2022) combined retrieval pre-training
          with FiD-style generation. The core lesson — teach models to search, not just memorise — continues to
          influence how we build knowledge-intensive AI systems.
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
                  'REALM shows the alternative history — retrieval baked into pre-training instead of bolted on at query time',
                ],
                [
                  'RAG Architecture',
                  'Compare REALM\'s training-time retrieval loop with the inference-time retrieve → augment → generate pipeline',
                ],
                [
                  'RAG (Lewis et al. paper)',
                  'Direct contrast: RAG retrieves at inference; REALM retrieves during pre-training. Both train retriever + LM jointly',
                ],
                [
                  'Dense Passage Retrieval (DPR paper)',
                  'DPR\'s retriever was used in inference-time RAG; REALM trains its own retriever from scratch during MLM',
                ],
                [
                  'What Are Embeddings?',
                  'REALM\'s retriever embeds queries and passages into the same vector space — the same principle as DPR and SBERT',
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
        REALM teaches us that retrieval does not have to be bolted on at the end — a model can learn to search
        as a core skill during training. In practice you will mostly build inference-time RAG (simpler, cheaper,
        easier to update), but REALM explains <em>why</em> retrieval-aware models matter and what joint
        retriever-reader training looks like.
      </Callout>

      <KeyTakeaways
        items={[
          'REALM integrates retrieval into pre-training via masked language modelling — not just at inference time.',
          'Salient span masking hides names, dates, and facts so the model must retrieve rather than guess from context.',
          'Retriever and language model improve jointly — retrieval quality measurably increases throughout training.',
          'Matched BERT on open-domain QA without task-specific fine-tuning, proving retrieval can be a learned skill.',
          'Inference-time RAG (Lewis et al.) won in production, but REALM shaped how researchers think about retrieval-augmented LMs.',
        ]}
      />
    </LessonArticle>
  )
}
