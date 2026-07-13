import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function CommercialEmbeddingModels() {
  return (
    <LessonArticle>
      <Definition term="Commercial embedding APIs">
        <p>
          A <strong className="text-white">commercial embedding API</strong> is like hiring a professional
          translation service: you send text in, you get a meaning-vector back. You do not run the model yourself —
          a company (OpenAI, Cohere, Google, etc.) hosts it, maintains it, and charges you per token processed.
        </p>
        <p className="mt-3">
          You make an HTTP request with your text, receive a list of numbers, and store those numbers in your vector
          database. No GPUs to buy, no model files to download, no infrastructure to manage. The trade-off is ongoing
          cost and sending your data to a third-party server.
        </p>
      </Definition>

      <LessonSection title="How a commercial API call works">
        <p className="mb-4 text-slate-300">
          The workflow is the same regardless of provider — like ordering from any translation bureau:
        </p>
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>You sign up and get an API key (your account credentials).</li>
          <li>At index time, you send each document chunk to the API and receive back a vector.</li>
          <li>At query time, you send the user's question to the <em>same</em> API and receive a query vector.</li>
          <li>Your vector database compares the query vector against stored document vectors.</li>
        </ol>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-sm text-slate-200">
          <div className="text-slate-400">Conceptual API call (OpenAI-style)</div>
          <div className="mt-2">POST /v1/embeddings</div>
          <div>input: "Refunds are available within 30 days of purchase."</div>
          <div>model: "text-embedding-3-small"</div>
          <div className="mt-2 text-genai-400">→ response: [0.021, -0.034, 0.112, ...] (1536 numbers)</div>
        </div>
        <Callout variant="tip">
          You pay per token embedded, not per API call. A 500-word document chunk costs more than a 10-word question.
          Batch multiple chunks in one request to reduce overhead.
        </Callout>
      </LessonSection>

      <LessonSection title="OpenAI embeddings — the default starting point">
        <p className="mb-4 text-slate-300">
          OpenAI's embedding models are the most widely used in RAG projects. They are reliable, well-documented, and
          good enough for most use cases out of the box.
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Dimensions</th>
                <th className="px-4 py-3">When to use it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'text-embedding-3-small',
                  '1536 (can shrink to 512)',
                  'Best cost/quality balance — start here for most RAG projects',
                ],
                [
                  'text-embedding-3-large',
                  '3072 (can shrink to 256)',
                  'When retrieval accuracy is critical and storage cost is acceptable',
                ],
                [
                  'text-embedding-ada-002',
                  '1536',
                  'Legacy model — migrate to v3 for better quality and lower price',
                ],
              ].map(([model, dims, notes]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{dims}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3">
          The v3 models support <strong className="text-white">dimension reduction</strong> — like ordering a full
          translation but only keeping the key phrases. You can embed at 1,536 dimensions but store only 512, saving
          roughly two-thirds of your vector database storage with minimal quality loss.
        </p>
      </LessonSection>

      <LessonSection title="Cohere Embed — asymmetric search built in">
        <p className="mb-4 text-slate-300">
          Cohere offers embedding models with a feature most others lack: separate modes for{' '}
          <strong className="text-white">documents</strong> and <strong className="text-white">queries</strong>. This
          matters because a question ("What is the refund policy?") reads differently from a document passage ("Refunds
          are available within 30 days..."). Cohere's models understand that difference.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">embed-english-v3.0</strong> — strong English retrieval with{' '}
            <code className="font-mono text-sm">input_type="search_document"</code> at index time and{' '}
            <code className="font-mono text-sm">input_type="search_query"</code> at query time.
          </li>
          <li>
            <strong className="text-white">embed-multilingual-v3.0</strong> — supports 100+ languages. Useful when your
            knowledge base spans English, Spanish, French, Japanese, and more.
          </li>
        </ul>
        <Callout variant="insight">
          Think of asymmetric modes like telling the translation service: "This text is a question" vs "This text is a
          reference document." The same words get translated differently depending on their role — improving search
          accuracy by 5–15% in practice.
        </Callout>
      </LessonSection>

      <LessonSection title="Other commercial providers">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Voyage AI (Voyage-3)</strong> — frequently tops retrieval benchmarks. Popular
            for high-stakes RAG where every percentage point of accuracy matters.
          </li>
          <li>
            <strong className="text-white">Google (text-embedding-004)</strong> — strong multilingual support. Integrates
            natively with Vertex AI if you are already on Google Cloud.
          </li>
          <li>
            <strong className="text-white">Amazon Titan Embeddings</strong> — AWS-native option. Fits naturally into
            Bedrock pipelines if your infrastructure is on AWS.
          </li>
        </ul>
        <p className="mt-3">
          All of these work the same way: send text, get vectors, store in your vector database. The differences are
          in quality benchmarks, pricing, language support, and which cloud ecosystem they integrate with.
        </p>
      </LessonSection>

      <LessonSection title="When to hire the translation service vs host your own">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose commercial APIs when</th>
                <th className="px-4 py-3">Choose open-source (next lesson) when</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  You want fast setup with no GPU or ML ops. Strong quality out of the box. Moderate document volume.
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Data must stay on your servers (privacy/compliance). High volume makes per-token costs add up. You
                  have GPU access or can tolerate slower CPU inference.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Most teams prototype with OpenAI text-embedding-3-small (fastest to set up), then evaluate whether
          open-source or a benchmark-leading API like Voyage is worth switching to once they have real retrieval
          metrics on their own data.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Commercial APIs are like hiring a translation service — send text, get vectors, pay per token.',
          'OpenAI text-embedding-3-small is the default starting point for most RAG projects.',
          'Cohere offers separate query/document modes; Voyage and Google lead quality benchmarks.',
          'Choose commercial for convenience; choose open-source for privacy, compliance, or high-volume cost savings.',
        ]}
      />
    </LessonArticle>
  )
}
