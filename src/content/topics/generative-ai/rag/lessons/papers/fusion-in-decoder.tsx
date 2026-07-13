import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2007.01282'

export function FusionInDecoder() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Leveraging Passage Retrieval with Generative Models for Open Domain QA"
        authors="Izacard & Grave (Facebook AI / Inria)"
        year="2020"
        venue="FiD"
        url={PAPER_URL}
      >
        <strong className="text-white">Fusion-in-Decoder (FiD)</strong> — encode each retrieved passage
        separately, then let the decoder read all of them at once when generating the answer.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Architecture</em> and the <em>RAG (Lewis et al.)</em> paper. FiD simplifies how retrieved
        context reaches the generator — and it is the direct ancestor of the "stuff chunks in the prompt" pattern
        you will actually build in production.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Lewis et al.'s RAG paper offered a sophisticated option called RAG-Token: the model could switch to a
          different source document for every single word it writes. Powerful, but complicated — like a journalist
          who changes their citation mid-sentence. FiD asks a much simpler question: what if we grab several good
          sources upfront and let the writer read them all at once?
        </p>
        <p>
          FiD retrieves multiple passages (10, 50, even 100), encodes each one separately together with the
          question, and then lets the decoder — the text-generating half of a T5 model — attend to{' '}
          <em>all</em> encoded passages simultaneously when writing the answer. One search, one writing pass. No
          per-token document switching. No complex marginalisation over document choices.
        </p>
        <p>
          This is exactly how most modern RAG applications work today: retrieve several chunks from your vector
          database, put them all in the LLM's context window, and ask it to synthesise an answer. FiD proved this
          simpler pattern not only works but actually <em>beats</em> the more complex RAG-Token approach on
          open-domain QA benchmarks. If you have ever stuffed five retrieved paragraphs into a ChatGPT prompt,
          you were doing FiD whether you knew it or not.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By mid-2020, RAG (Lewis et al.) had shown that retrieval + generation beats parametric-only models.
          But RAG's two variants came with trade-offs. <strong className="text-white">RAG-Sequence</strong> picked
          one document for the entire answer — simple but limited when the answer required evidence from multiple
          sources. <strong className="text-white">RAG-Token</strong> could use different documents per token —
          more flexible but significantly harder to train, slower at inference, and difficult to debug.
        </p>
        <p>
          There was also a practical bottleneck: how do you feed many long retrieved passages into a Transformer
          encoder without blowing up memory? A naive approach — concatenate all passages into one giant input —
          creates an attention matrix that grows quadratically with length. For 100 passages of 250 tokens each,
          that is computationally prohibitive.
        </p>
        <p>
          Izacard and Grave observed that you do not need the encoder to attend across all passages at once.
          Instead, encode each passage independently (cheap, parallelisable), then let only the decoder cross-attend
          to all encoded representations simultaneously. This "fusion-in-decoder" design scales to many more
          passages than RAG while remaining simpler to implement and train.
        </p>
      </LessonSection>

      <LessonSection title="Architecture overview">
        <Flowchart
          title="Fusion-in-Decoder (FiD) architecture"
          chart={`flowchart TB
  Q[User question] --> DPR[DPR retriever]
  DPR --> P1[Passage 1]
  DPR --> P2[Passage 2]
  DPR --> PK[Passage k ...]
  Q --> E1[T5 encoder: question + passage 1]
  P1 --> E1
  Q --> E2[T5 encoder: question + passage 2]
  P2 --> E2
  Q --> EK[T5 encoder: question + passage k]
  PK --> EK
  E1 --> H1[Hidden states 1]
  E2 --> H2[Hidden states 2]
  EK --> HK[Hidden states k]
  H1 --> DEC[T5 decoder cross-attends<br/>to ALL hidden states]
  H2 --> DEC
  HK --> DEC
  DEC --> ANS[Generated answer]`}
        />
        <p className="mt-4 text-slate-300">
          Each passage gets its own encoder pass (parallelisable). Only the decoder fuses information across all
          passages — hence "fusion-in-decoder." This avoids the quadratic attention cost of concatenating everything
          in the encoder.
        </p>
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Retrieve top-k passages with DPR">
          <p>
            FiD uses the same Dense Passage Retrieval (DPR) system as RAG. The question is encoded, compared
            against a Wikipedia index, and the top-k most similar passages are returned. Izacard and Grave
            experimented with k from 10 to 100 — far more passages than RAG typically used.
          </p>
          <p className="mt-2 text-slate-400">
            <strong className="text-white">Concrete example:</strong> for "What is the capital of Australia?" DPR
            might return passages about Canberra, Australian geography, the Federation of Australia, and related
            topics — some useful, some noise. FiD's job is to read all of them and extract the answer.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Encode each passage separately with T5">
          <p>
            For each retrieved passage, FiD concatenates the question and passage into one input string:
            <em> "question: What is the capital of Australia? context: Canberra is the capital city of
            Australia..."</em>. Each question-passage pair is fed independently through T5's encoder, producing
            a separate set of hidden states (token representations).
          </p>
          <p className="mt-2 text-slate-400">
            Because each encoding is independent, you can run them in parallel on multiple GPUs. Encoding 100
            passages separately is much cheaper than encoding one 25,000-token concatenated input.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Decoder cross-attends to all encoded passages">
          <p>
            T5's decoder generates the answer token by token. At each step, it{' '}
            <strong className="text-white">cross-attends</strong> to the hidden states from{' '}
            <em>every</em> encoded passage simultaneously — not just one. This is the "fusion" step: the decoder
            pulls relevant information from passage 3's mention of "Canberra" even while ignoring passage 7's
            irrelevant content about Sydney's economy.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Generate the answer in one pass">
          <p>
            The decoder writes the full answer — "Canberra" — in a single generation pass. No per-token document
            switching, no marginalisation over document latents. The model was fine-tuned end-to-end on QA
            datasets so it learns which passages to trust and how to combine evidence from multiple sources.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Scale k — more passages help">
          <p>
            A key FiD finding: increasing k (more retrieved passages) consistently improved accuracy, up to the
            point where memory limits kicked in. More context helps when the decoder can fuse it properly. This
            validated the intuition behind modern RAG: retrieve generously, let the generator sort out what matters.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Izacard and Grave evaluated FiD on standard open-domain QA benchmarks, comparing against RAG, DPR +
          extractive models, and other retrieval-augmented baselines.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Natural Questions</strong> — real Google search queries with short
            answer strings. The primary benchmark for open-domain QA.
          </li>
          <li>
            <strong className="text-white">TriviaQA</strong> — trivia questions requiring factual knowledge
            across diverse topics.
          </li>
          <li>
            <strong className="text-white">Scaling experiments</strong> — varying k (number of retrieved
            passages) from 10 to 100 to measure how fusion quality changes with more context.
          </li>
          <li>
            <strong className="text-white">Comparison to RAG-Sequence and RAG-Token</strong> — same retriever
            (DPR), same Wikipedia index, different fusion strategies in the generator.
          </li>
          <li>
            <strong className="text-white">Model size ablations</strong> — FiD with T5-base, T5-large, and
            T5-3B to show the pattern scales with model capacity.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <p>
          FiD with T5-large achieved <strong className="text-white">51.4% exact match</strong> on Natural
          Questions and <strong className="text-white">67.6%</strong> on TriviaQA — outperforming both
          RAG-Sequence and RAG-Token despite a simpler architecture. On Natural Questions, this was a 7-point
          improvement over RAG-Token (44.5%), the more complex per-token variant.
        </p>
        <p>
          Scaling k from 10 to 100 passages improved results consistently. With 100 passages, FiD-T5-large set
          new state-of-the-art on both benchmarks at the time. The decoder successfully learned to filter noise
          from irrelevant passages while combining evidence from multiple useful ones — exactly the behaviour you
          want in a production RAG system.
        </p>
        <p>
          FiD-T5-3B pushed even further, reaching <strong className="text-white">54.7%</strong> on Natural
          Questions. The pattern was clear: retrieve many, fuse in the decoder, scale the generator. This became
          the template for virtually every subsequent open-domain QA system and directly maps to how developers
          build RAG today — retrieve chunks, put them in the prompt, let the LLM synthesise.
        </p>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <p>
          FiD still requires encoding k passages per query, which adds latency compared to single-pass generation.
          With k=100, that is 100 encoder forward passes before the decoder writes a single token. Memory usage
          grows linearly with k in the decoder's cross-attention layers. For very large k or very long passages,
          you hit GPU memory walls.
        </p>
        <p>
          FiD was designed for seq2seq models (T5) with explicit encoder-decoder cross-attention. Modern
          decoder-only LLMs (GPT-4, Llama, Claude) do not have a separate encoder — they fuse retrieved passages
          by simply concatenating them in the prompt. The principle is identical (multi-document fusion at
          generation time), but the mechanism is prompt stuffing rather than cross-attention.
        </p>
        <p>
          Later work built on FiD's ideas: Atlas (Izacard et al., 2022) combined FiD with retrieval pre-training;
          REPLUG (Shi et al., 2023) adapted the fusion idea for decoder-only LLMs. But the core insight — retrieve
          once, read everything together, keep it simple — remains the dominant RAG pattern in 2024 and beyond.
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
                  'RAG Architecture',
                  'FiD is the practical pattern behind the online query pipeline — retrieve many chunks, feed all to the generator',
                ],
                [
                  'Augmentation & Generation',
                  'Putting multiple retrieved passages in the context block is exactly what FiD demonstrated works best',
                ],
                [
                  'RAG (Lewis et al. paper)',
                  'FiD simplified and outperformed RAG-Token — the evolution from complex research RAG to practical multi-chunk fusion',
                ],
                [
                  'Dense Passage Retrieval (DPR paper)',
                  'FiD uses DPR as its retriever — same search engine, better way to feed results to the generator',
                ],
                [
                  'Chunking',
                  'FiD\'s per-passage encoding validates why chunking matters — each chunk is encoded and fused independently',
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
        You do not need fancy per-word document switching. Retrieve your best chunks once, put them all in the
        prompt, and let the LLM read everything together. FiD proved this simpler pattern beats the complex
        alternative — and it is exactly what you will build in production RAG.
      </Callout>

      <KeyTakeaways
        items={[
          'FiD encodes each retrieved passage separately, then fuses all of them in the T5 decoder via cross-attention.',
          'Simpler than RAG-Token (no per-token document switching) yet outperformed it by 7+ points on Natural Questions.',
          'Scaling k from 10 to 100 passages consistently improved accuracy — more context helps when fused properly.',
          'Direct ancestor of modern multi-chunk RAG: retrieve many, stuff in prompt, let the LLM synthesise.',
          'Uses DPR for retrieval and T5 for generation — the same building blocks as RAG, with a better fusion strategy.',
        ]}
      />
    </LessonArticle>
  )
}
