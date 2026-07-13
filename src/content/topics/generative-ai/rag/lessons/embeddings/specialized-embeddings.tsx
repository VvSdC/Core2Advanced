import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SpecializedEmbeddings() {
  return (
    <LessonArticle>
      <Definition term="Specialized embeddings">
        <p>
          General-purpose embedding models handle everyday text well — help articles, wikis, customer support FAQs.
          But some content types need a <strong className="text-white">specialist</strong>. A general model reading
          legal contracts, medical records, or Python code is like a general practitioner performing brain surgery —
          they understand language, but not the domain's specific patterns and vocabulary.
        </p>
        <p className="mt-3">
          <strong className="text-white">Specialized embeddings</strong> are models trained (or fine-tuned) on a
          particular type of content. They understand the jargon, structure, and relationships unique to that domain.
        </p>
      </Definition>

      <LessonSection title="When general models fail — real examples">
        <p className="mb-4 text-slate-300">
          Before reaching for a specialized model, recognise the situations where a general model struggles:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">You search for</th>
                <th className="px-4 py-3">General model struggles because</th>
                <th className="px-4 py-3">Specialized model helps because</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  '"Where is auth handled?" in a codebase',
                  'Treats code like prose — misses function names, imports, and syntax patterns',
                  'Code embeddings understand structure: functions, classes, variable scopes',
                ],
                [
                  '"Show me the circuit diagram for the power supply"',
                  'Can only search text — cannot see or match images',
                  'Multimodal embeddings put text and images on the same meaning map',
                ],
                [
                  '"Cases involving breach of fiduciary duty"',
                  'Knows "breach" and "duty" separately but misses legal phrase meaning',
                  'Legal-BERT trained on case law understands compound legal terms',
                ],
                [
                  '"Drug interactions with metformin in diabetic patients"',
                  'Treats medical terms as regular words — misses clinical relationships',
                  'PubMedBERT trained on medical literature understands drug-patient-context links',
                ],
              ].map(([search, struggle, help]) => (
                <tr key={search} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{search}</td>
                  <td className="px-4 py-3 text-slate-400">{struggle}</td>
                  <td className="px-4 py-3 text-slate-400">{help}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          The pattern is always the same: when your content has a vocabulary and structure that general English models
          were not trained on, a specialist model that <em>has</em> seen that content performs better.
        </Callout>
      </LessonSection>

      <LessonSection title="Multimodal embeddings — text and images on one map">
        <p>
          Most embeddings only handle text. <strong className="text-white">Multimodal embeddings</strong> place text,
          images, and sometimes audio on the <em>same</em> meaning map. A text question can find a relevant image, and
          an image can find a relevant text description.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">CLIP</strong> (OpenAI) — the foundation for visual search. Embed a product
            photo and a text description into the same space. Ask "red running shoes with white sole" and retrieve
            matching product images.
          </li>
          <li>
            <strong className="text-white">Cohere Embed v3</strong> — handles both images and text in one model,
            available as a commercial API.
          </li>
          <li>
            <strong className="text-white">Use cases:</strong> product catalogues searched by photo, engineering
            diagrams retrieved from text questions, medical imaging paired with clinical notes.
          </li>
        </ul>
        <p className="mt-3">
          Think of multimodal embeddings as a map where photographs and sentences about the same thing share the same
          neighbourhood — even though one is pixels and the other is words.
        </p>
      </LessonSection>

      <LessonSection title="Code embeddings — understanding syntax, not just words">
        <p>
          Source code is not prose. A function named <code className="font-mono text-sm">authenticate_user</code> has
          a specific relationship to imports, parameters, and return types that general models miss.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">voyage-code-3</strong> — commercial model optimised for retrieving code
            snippets and documentation from natural language questions.
          </li>
          <li>
            <strong className="text-white">CodeBERT / GraphCodeBERT</strong> — open-source models that understand code
            syntax, data flow, and structure (not just token sequences).
          </li>
          <li>
            <strong className="text-white">Use case:</strong> RAG over a codebase. A developer asks "where is user
            authentication handled?" and the system retrieves the actual auth middleware function — not a README
            paragraph that happens to mention "authentication."
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Domain-specific embeddings — trained on your industry's language">
        <p className="mb-4 text-slate-300">
          These models are pre-trained or fine-tuned on corpora from a specific field. They understand jargon that
          would confuse a general model:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Model / approach</th>
                <th className="px-4 py-3">Why it beats general models</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Legal',
                  'Legal-BERT, fine-tuned E5 on case law',
                  'Understands "force majeure," "estoppel," and citation formats',
                ],
                [
                  'Medical',
                  'PubMedBERT, BioClinicalBERT',
                  'Links drug names to conditions, understands clinical shorthand',
                ],
                [
                  'Finance',
                  'Fine-tuned models on earnings reports, SEC filings',
                  'Parses financial tables, ticker symbols, and regulatory language',
                ],
                [
                  'Scientific',
                  'SciBERT, SPECTER (paper abstracts)',
                  'Handles chemical formulas, gene names, and academic citation patterns',
                ],
              ].map(([domain, model, why]) => (
                <tr key={domain} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{domain}</td>
                  <td className="px-4 py-3 text-slate-400">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Choosing the right embedding — start general, specialise only when needed">
        <Callout variant="tip">
          <strong className="text-white">Default to a general model</strong> (OpenAI text-embedding-3-small or
          BGE-large-en-v1.5). Build your RAG pipeline, run retrieval tests on your actual data, and measure
          accuracy. Only switch to a specialised model if your benchmarks show a clear, repeatable improvement —
          typically 10%+ better recall on your specific queries.
        </Callout>
        <p className="mt-4 text-slate-300">
          Specialised models come with trade-offs: smaller community support, fewer integration examples, sometimes
          older architectures, and the risk of overfitting to a narrow domain. A general model that achieves 85%
          retrieval accuracy on your legal corpus may be good enough — especially if you add hybrid search (BM25) to
          catch the cases where dense retrieval falls short.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Text-only Q&A?</strong> General model. No specialisation needed.
          </li>
          <li>
            <strong className="text-white">Images in your knowledge base?</strong> Multimodal (CLIP or Cohere Embed v3).
          </li>
          <li>
            <strong className="text-white">Searching a codebase?</strong> Code embeddings (voyage-code-3 or CodeBERT).
          </li>
          <li>
            <strong className="text-white">Dense legal/medical/scientific jargon?</strong> Domain-specific model —
            but benchmark against general + hybrid first.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'General models fail on code syntax, images, and domain jargon — that is when specialists help.',
          'Multimodal embeddings (CLIP) put text and images on the same map for visual search RAG.',
          'Code embeddings understand functions, imports, and structure — not just words in code.',
          'Domain-specific models (legal, medical, scientific) outperform general models on specialised corpora.',
          'Start with a general model; switch to specialised only when your benchmarks justify it.',
        ]}
      />
    </LessonArticle>
  )
}
