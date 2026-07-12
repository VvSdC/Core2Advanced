import {
  Callout,
  ContentStep,
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
        A model that <strong className="text-white">decides when to retrieve</strong>, critiques its own outputs,
        and scores retrieval relevance — adding a reflection layer on top of basic RAG.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        Read <em>RAG Evaluation & Limitations</em> first. Self-RAG addresses many limitations you learned about —
        unnecessary retrieval, ungrounded answers, and poor passage relevance.
      </Callout>

      <LessonSection title="Background — basic RAG retrieves always">
        <p>
          Standard RAG retrieves for every query, even when the model already knows the answer. It also has no
          mechanism to check whether retrieved passages are actually relevant or whether the generated answer is
          supported by them. Self-RAG adds <strong className="text-white">adaptive retrieval</strong> and{' '}
          <strong className="text-white">self-critique</strong>.
        </p>
      </LessonSection>

      <LessonSection title="How Self-RAG works">
        <ContentStep number={1} title="Retrieve on demand">
          <p>
            The model first generates a special <em>retrieval token</em>: retrieve if external knowledge is
            needed, skip if the model can answer from memory. This saves latency and avoids injecting irrelevant
            context.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Generate with critique tokens">
          <p>
            For each candidate passage, the model generates the answer and emits{' '}
            <strong className="text-white">reflection tokens</strong>:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">IsRel</strong> — is this passage relevant to the question?</li>
            <li><strong className="text-white">IsSup</strong> — is the answer supported by this passage?</li>
            <li><strong className="text-white">IsUse</strong> — is this answer useful overall?</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Select the best answer">
          <p>
            Multiple candidate answers are scored using the reflection tokens. The highest-scoring answer is
            returned — the model effectively votes on its own outputs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Outperformed standard RAG and ChatGPT on open-domain QA, reasoning, and fact verification.</li>
          <li>Adaptive retrieval reduced unnecessary lookups — faster and less noisy.</li>
          <li>Self-critique tokens improved faithfulness — answers more grounded in retrieved evidence.</li>
          <li>Showed that RAG quality improves when the model can reflect on its own retrieval and generation.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Retrieval Strategies lessons">
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
                ['Advanced Retrieval Strategies', 'Adaptive retrieval — only search when the model decides it needs to'],
                ['Retrieval Overview', 'IsRel/IsSup/IsUse tokens automate relevance and faithfulness scoring'],
                ['Dense Retrieval', 'Self-critique catches when retrieved chunks do not support the answer'],
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
          'Self-RAG adds adaptive retrieval — the model decides when to search.',
          'Reflection tokens (IsRel, IsSup, IsUse) let the model critique its own outputs.',
          'Multiple candidates are generated and scored — best answer wins.',
          'Points toward the future of RAG: not just retrieve-and-generate, but retrieve-critique-select.',
        ]}
      />
    </LessonArticle>
  )
}
