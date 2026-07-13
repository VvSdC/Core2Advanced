import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2310.11511'

export function SelfRag() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Self-RAG: Learning to Retrieve, Generate, and Critique through Self-Reflection"
        authors="Asai et al. (University of Washington)"
        year="2023"
        url={PAPER_URL}
      >
        A model that <strong className="text-white">decides when to retrieve</strong>, critiques its own outputs
        with reflection tokens, and selects the best answer from multiple candidates — adding a reflection layer
        on top of basic RAG.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Evaluation & Limitations</em> and the original <em>RAG paper</em> first. Self-RAG addresses
        many weaknesses of naive RAG — unnecessary retrieval, ungrounded answers, and poor passage relevance —
        by teaching the language model to think about its own retrieval and generation decisions.
      </Callout>

      <LessonSection title="What this paper means in plain English">
        <p>
          Basic RAG follows a fixed recipe for every question: search your document index, stuff the top chunks
          into a prompt, generate an answer. It does not ask whether search was actually needed. If you ask "what
          is 2 + 2?", a naive RAG system still queries the vector database, might inject irrelevant chunks about
          arithmetic history, and sometimes hallucinates an answer influenced by noise. It also has no built-in
          way to check whether retrieved passages are truly relevant, or whether the answer it writes is actually
          supported by those passages.
        </p>
        <p>
          Self-RAG fixes this by training a language model to <em>reflect on its own behaviour</em> using special
          tokens it learns during training. Before generating, the model can emit a <strong className="text-white">retrieval token</strong> that means "I need to look this up" or "I can answer from what I already know."
          After retrieving, it generates multiple candidate answers and scores each one with{' '}
          <strong className="text-white">reflection tokens</strong>: Is this passage relevant? Is the answer
          supported by the passage? Is the overall answer useful? It then picks the highest-scoring candidate —
          like a student who checks their work before handing in the assignment.
        </p>
        <p>
          The key innovation is that retrieval decisions and quality critiques are not bolted on as separate
          classifier models or prompt engineering hacks. They are baked into the language model itself as
          learnable output tokens, generated in the same autoregressive stream as the answer text. The model
          learns <em>when</em> to retrieve, <em>what</em> to say, and <em>how good</em> its output is — all in
          one unified framework.
        </p>
        <p>
          You will not deploy Self-RAG verbatim in most projects today (it requires fine-tuning a specific model
          architecture), but the ideas are already shaping production RAG: adaptive retrieval routing, LLM-as-judge
          faithfulness checks, and generating multiple candidates then selecting the best. Self-RAG is a preview
          of what RAG looks like when the model can think about retrieval, not just execute it blindly.
        </p>
      </LessonSection>

      <LessonSection title="The problem before this paper">
        <p>
          By 2023, RAG had become the default architecture for knowledge-intensive LLM applications. But
          practitioners kept hitting the same failure modes, and existing fixes were fragmented.
        </p>
        <p>
          <strong className="text-white">Always-on retrieval wastes resources and adds noise.</strong> Every query
          triggered a vector search — even factual questions the model could answer from parametric memory, or
          creative tasks where external documents were irrelevant. Unnecessary retrieval added latency, cost, and
          sometimes <em>hurt</em> answer quality by injecting distracting context (the "lost in the middle" problem).
        </p>
        <p>
          <strong className="text-white">No built-in relevance filtering.</strong> Standard RAG assumes the
          retriever returns useful passages. In practice, retrievers return partially relevant or tangentially
          related chunks. The generator has no mechanism to say "this passage does not actually help" — it
          uses whatever it receives.
        </p>
        <p>
          <strong className="text-white">No built-in faithfulness checking.</strong> The generator can freely
          hallucinate details not present in retrieved context. Post-hoc evaluation frameworks like RAGAS could
          <em>measure</em> faithfulness, but standard RAG pipelines had no mechanism to <em>prevent</em> or{' '}
          <em>select against</em> ungrounded answers at generation time.
        </p>
        <p>
          Previous work addressed pieces of this puzzle separately: retrieval routing with classifiers, rerankers
          for relevance, and external critic models for faithfulness. Self-RAG unified all three into a single
          model that learns to retrieve, generate, and critique through self-reflection tokens.
        </p>
      </LessonSection>

      <LessonSection title="Self-RAG decision flow">
        <Flowchart
          title="Retrieve, generate, critique, select"
          chart={`flowchart TB
  A[User question] --> B{Retrieval token?}
  B -->|Retrieve| C[Search document index]
  B -->|No retrieval| D[Generate from parametric memory]
  C --> E[Retrieve top passages]
  E --> F[Generate multiple candidate answers]
  D --> F
  F --> G[Emit reflection tokens per candidate]
  G --> H[IsRel: passage relevant?]
  G --> I[IsSup: answer supported?]
  G --> J[IsUse: answer useful?]
  H --> K[Score and rank candidates]
  I --> K
  J --> K
  K --> L[Return best-scoring answer]`}
        />
      </LessonSection>

      <LessonSection title="How it works — step by step">
        <ContentStep number={1} title="Train a base LM to emit special control tokens">
          <p>
            The researchers start from a pretrained language model (Llama-2 in their experiments) and extend its
            vocabulary with special tokens for retrieval decisions and quality critiques. During training, the
            model learns to produce these tokens at appropriate points in its output stream — they are not
            hard-coded rules but learned behaviours from demonstration data.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Adaptive retrieval: decide whether to search">
          <p>
            Given a question, the model first generates a <strong className="text-white">retrieval token</strong>.
            Two variants: <code className="font-mono text-sm">[Retrieve]</code> means "I need external
            documents" and <code className="font-mono text-sm">[No Retrieve]</code> means "I can answer without
            searching." This is adaptive retrieval — the model skips the vector database when it judges external
            knowledge unnecessary.
          </p>
          <p className="mt-2">
            Training data for this decision comes from a critic model (GPT-4) that labels whether retrieval would
            help for each (question, answer) pair. The LM learns to mimic these decisions.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Retrieve passages when needed">
          <p>
            If the model emits <code className="font-mono text-sm">[Retrieve]</code>, a standard retriever
            (Contriever in the paper) fetches the top-k passages from the corpus. If it emits{' '}
            <code className="font-mono text-sm">[No Retrieve]</code>, the model proceeds directly to generation
            using only its internal knowledge — saving retrieval latency and avoiding irrelevant context.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Generate multiple candidate answers">
          <p>
            For each retrieved passage (or for the no-retrieval path), the model generates a candidate answer.
            The paper generates several candidates by sampling different completions or conditioning on different
            retrieved passages. Multiple candidates give the selection step something to choose among — a
            single greedy generation might be mediocre, but one of several samples is often better.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Critique with reflection tokens">
          <p>
            For each candidate, the model emits <strong className="text-white">reflection tokens</strong> that
            score quality along three dimensions:
          </p>
          <ul className="mt-2 list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <strong className="text-white">IsRel</strong> (relevance) — is the retrieved passage actually
              relevant to the question? Values: Relevant / Irrelevant.
            </li>
            <li>
              <strong className="text-white">IsSup</strong> (support / faithfulness) — is the generated answer
              fully supported, partially supported, or unsupported by the passage? Values: Fully supported /
              Partially supported / No support.
            </li>
            <li>
              <strong className="text-white">IsUse</strong> (utility) — is the overall answer useful for the
              question? Values: Useful / Not useful (scaled to 1–5 in training).
            </li>
          </ul>
          <p className="mt-2">
            These tokens are generated by the same model in the same forward pass — not by a separate classifier
            or external API call.
          </p>
        </ContentStep>

        <ContentStep number={6} title="Score candidates and select the best">
          <p>
            Each candidate receives a composite score based on its reflection tokens. The paper uses a segment-wise
            scoring function: multiply the probability of positive critique tokens (high relevance, full support,
            high utility) across the candidate. The candidate with the highest score is returned to the user.
            This is inference-time search over the model's own outputs — generate many, critique all, pick the winner.
          </p>
        </ContentStep>

        <ContentStep number={7} title="Training data creation with GPT-4 as teacher">
          <p>
            Creating training data is a major part of the paper. GPT-4 generates reflection token labels for
            thousands of (question, passage, answer) triples: whether retrieval was needed, whether passages are
            relevant, whether answers are supported, and utility scores. The Self-RAG model is then fine-tuned on
            this GPT-4-annotated data to learn the retrieval, generation, and critique behaviours jointly.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What the researchers tested">
        <p>
          Asai et al. evaluated Self-RAG across six tasks spanning factual QA, reasoning, and verification,
          comparing against strong baselines including standard RAG, retrieval-always Llama-2, and ChatGPT.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Open-domain QA</strong> — PopQA, TriviaQA-unfiltered, ARC-Challenge,
            PubHealth. Tests factual accuracy with and without retrieval.
          </li>
          <li>
            <strong className="text-white">Reasoning</strong> — PubHealth (health fact-checking). Tests whether
            adaptive retrieval and self-critique help on nuanced claims.
          </li>
          <li>
            <strong className="text-white">Baselines</strong> — Llama-2 without retrieval, Llama-2 with always-on
            retrieval (Contriever top-5), ChatGPT (gpt-3.5-turbo), and models with external rerankers or
            retrieval classifiers.
          </li>
          <li>
            <strong className="text-white">Metrics</strong> — accuracy, exact match, and human-evaluated
            factuality / citation quality. They also measured retrieval frequency (how often the model chose to
            retrieve vs skip).
          </li>
          <li>
            <strong className="text-white">Ablations</strong> — removed adaptive retrieval (always retrieve),
            removed reflection tokens (no critique), removed candidate selection (single greedy generation).
            Each ablation quantified the contribution of each Self-RAG component.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Key results — what they found">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Outperformed standard RAG and ChatGPT.</strong> Self-RAG (Llama-2
            based) beat always-retrieve RAG and gpt-3.5-turbo on most benchmarks, especially on factuality and
            citation accuracy.
          </li>
          <li>
            <strong className="text-white">Adaptive retrieval reduced unnecessary lookups.</strong> The model
            learned to skip retrieval for questions it could answer from memory, cutting retrieval calls
            significantly and reducing noise from irrelevant passages.
          </li>
          <li>
            <strong className="text-white">Reflection tokens improved faithfulness.</strong> Answers selected via
            IsSup/IsRel/IsUse scoring were more grounded in retrieved evidence than single-pass generation.
            Hallucination rates dropped compared to always-retrieve baselines.
          </li>
          <li>
            <strong className="text-white">Multi-candidate selection matters.</strong> Ablations showed that
            generating multiple candidates and scoring them with reflection tokens contributed substantially to
            final quality — neither generation nor critique alone was sufficient.
          </li>
          <li>
            <strong className="text-white">Each component is necessary.</strong> Removing adaptive retrieval,
            reflection tokens, or candidate selection each degraded performance, confirming that the full
            retrieve-critique-select loop is greater than the sum of its parts.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Limitations and what came after">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Requires model fine-tuning.</strong> Self-RAG is not a plug-and-play
            prompt technique. You need to fine-tune a language model with special tokens and GPT-4-generated
            training data. Most teams cannot easily replicate the full training pipeline.
          </li>
          <li>
            <strong className="text-white">Multiple LLM calls at inference.</strong> Generating several
            candidates, each with critique tokens, is slower and more expensive than single-pass RAG — even
            when retrieval is skipped.
          </li>
          <li>
            <strong className="text-white">Critic quality depends on training data.</strong> Reflection tokens
            are learned from GPT-4 labels. If the teacher critic is wrong, the student model learns wrong
            critique behaviour.
          </li>
          <li>
            <strong className="text-white">Retriever is still external.</strong> Self-RAG improves how the LM uses
            retrieved passages but does not fix a bad retriever. Garbage in still means garbage out — just with
            better detection via IsRel.
          </li>
          <li>
            <strong className="text-white">What came after.</strong> Follow-up work includes Corrective RAG
            (CRAG — using web search when retrieval confidence is low), FLARE (active retrieval during
            generation), and commercial systems that implement pieces of Self-RAG as orchestration logic:
            retrieval routers, faithfulness checks, and answer reranking without full model fine-tuning.
            The reflection-token idea also influenced agentic RAG patterns where models explicitly plan,
            retrieve, verify, and revise.
          </li>
        </ul>
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
                  'RAG Evaluation & Limitations',
                  'Self-RAG directly addresses the limitations taught there — unnecessary retrieval, ungrounded answers, irrelevant context',
                ],
                [
                  'Advanced Retrieval Strategies',
                  'Adaptive retrieval (retrieve only when needed) is the production pattern Self-RAG pioneered at the model level',
                ],
                [
                  'Retrieval Overview',
                  'IsRel/IsSup/IsUse tokens automate the relevance and faithfulness checks you learned to do manually or with RAGAS',
                ],
                [
                  'Dense Retrieval',
                  'Self-critique catches when retrieved chunks look relevant in embedding space but do not actually support the answer',
                ],
                [
                  'Generation & Faithfulness Metrics',
                  'Self-RAG builds faithfulness checking into generation itself, rather than only measuring it after the fact',
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
        Good RAG is not just "retrieve and generate." It is "decide whether to retrieve, generate several options,
        check if each one is actually supported by what you found, and pick the best." Self-RAG shows what that
        looks like when the model itself learns to reflect — you can approximate pieces of it today with routing
        logic and LLM-as-judge checks.
      </Callout>

      <KeyTakeaways
        items={[
          'Self-RAG adds adaptive retrieval — the model emits a token to search or skip before generating.',
          'Reflection tokens (IsRel, IsSup, IsUse) let the model critique relevance, faithfulness, and utility of its own outputs.',
          'Multiple candidates are generated and scored — the highest-scoring answer wins at inference time.',
          'Outperformed standard always-retrieve RAG and ChatGPT on factuality benchmarks.',
          'Requires fine-tuning with special tokens — but the retrieve-critique-select pattern applies to any RAG system.',
        ]}
      />
    </LessonArticle>
  )
}
