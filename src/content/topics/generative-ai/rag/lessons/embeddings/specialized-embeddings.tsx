import {
  Callout,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SpecializedEmbeddings() {
  return (
    <LessonArticle>
      <LessonSection title="Multimodal embeddings">
        <p>
          <strong className="text-white">Multimodal embeddings</strong> map text, images, and sometimes audio into
          the same vector space. A text query can retrieve relevant images — or vice versa.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">CLIP</strong> (OpenAI) — image ↔ text; foundation for visual search RAG.</li>
          <li><strong className="text-white">Cohere Embed v3</strong> — image + text in one model.</li>
          <li>Use case: search product catalogues by photo, retrieve diagrams from text questions.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Code embeddings">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">voyage-code-3</strong> — optimised for code retrieval and doc search.</li>
          <li><strong className="text-white">CodeBERT / GraphCodeBERT</strong> — understand syntax and structure.</li>
          <li>Use case: RAG over codebases — "where is authentication handled?" retrieves the right function.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Domain-specific embeddings">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Model / approach</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Legal', 'Legal-BERT, fine-tuned E5 on case law'],
                ['Medical', 'PubMedBERT, BioClinicalBERT'],
                ['Finance', 'Fine-tuned models on earnings reports, SEC filings'],
                ['Scientific', 'SciBERT, SPECTER (paper abstracts)'],
              ].map(([domain, model]) => (
                <tr key={domain} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{domain}</td>
                  <td className="px-4 py-3 text-slate-400">{model}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Choosing the right embedding">
        <Callout variant="tip">
          Start with a general model (OpenAI v3-small or BGE-large). Only switch to domain-specific or multimodal
          embeddings if retrieval benchmarks on <em>your</em> data show clear improvement.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multimodal embeddings (CLIP) enable text-to-image and image-to-text retrieval.',
          'Code embeddings understand syntax — essential for codebase RAG.',
          'Domain-specific models (legal, medical) outperform general models on specialised corpora.',
          'Default to general-purpose; specialise only when benchmarks justify it.',
        ]}
      />
    </LessonArticle>
  )
}
