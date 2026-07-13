import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SemanticChunking() {
  return (
    <LessonArticle>
      <Definition term="Semantic chunking">
        <p>
          <strong className="text-white">Semantic chunking</strong> groups sentences that are about the same
          topic, regardless of paragraph breaks or heading structure. It detects where the <em>meaning</em>{' '}
          shifts — like a skilled reader who notices "okay, now we're talking about something different" —
          and starts a new chunk at that point.
        </p>
        <p>
          Unlike fixed-size splitting (cut every N tokens) or structure-aware splitting (cut at headings),
          semantic chunking uses <strong className="text-white">embeddings</strong> — the same kind of
          number representations used in retrieval — to decide where topics change.
        </p>
      </Definition>

      <LessonSection title="The problem semantic chunking solves">
        <p className="text-slate-300">
          Some documents mix many topics inside long paragraphs with no headings. Research papers, annual
          reports, and meeting transcripts often read like one continuous stream: three sentences about
          refunds, then four about shipping, then two about hiring — all in the same paragraph.
        </p>
        <p className="mt-4 text-slate-300">
          Recursive splitting would keep all of those sentences in one chunk because they share a paragraph.
          Structure-aware splitting cannot help because there are no headings. Semantic chunking notices the
          topic shift and splits there.
        </p>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Before — one long paragraph, no headings</div>
          <div className="mt-2 font-mono text-slate-200">
            "Our refund policy allows returns within 30 days of purchase. Customers must provide proof of
            purchase. Refunds are processed within 5–7 business days. We offer free shipping on orders over
            $50. Standard delivery takes 3–5 business days. Express shipping costs $15. We are hiring 20
            engineers in Q3. Applications close August 31st."
          </div>
        </div>

        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">After semantic chunking — three topic groups</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 1 (refunds): "Our refund policy allows returns within 30 days of purchase. Customers
              must provide proof of purchase. Refunds are processed within 5–7 business days."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 2 (shipping): "We offer free shipping on orders over $50. Standard delivery takes 3–5
              business days. Express shipping costs $15."
            </div>
            <div className="border-l-2 border-genai-500 pl-3">
              Chunk 3 (hiring): "We are hiring 20 engineers in Q3. Applications close August 31st."
            </div>
          </div>
        </div>

        <Callout variant="beginner">
          Semantic chunking is like a librarian who reads every sentence and files them into topic folders —
          "Refunds," "Shipping," "Hiring" — even when the author never added section headings.
        </Callout>
      </LessonSection>

      <LessonSection title="How it works, step by step">
        <Flowchart
          title="Semantic boundary detection"
          chart={`flowchart LR
  S1["S1: Refund policy"] --> C1{"Similar to S2?"}
  C1 -- yes --> S2["S2: 30-day window"]
  S2 --> C2{"Similar to S3?"}
  C2 -- yes --> S3["S3: Proof required"]
  S3 --> C3{"Similar to S4?"}
  C3 -- no --> B[Boundary — new chunk]
  B --> S4["S4: Shipping costs"]`}
        />

        <ContentStep number={1} title="Split the document into sentences">
          <p>
            Break the text at sentence boundaries (periods, question marks, exclamation marks). Each sentence
            becomes a candidate unit.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Embed each sentence">
          <p>
            Run every sentence through the same embedding model you use for retrieval. Each sentence becomes
            a vector — a list of numbers representing its meaning.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Compare consecutive sentences">
          <p>
            Measure <strong className="text-white">cosine similarity</strong> between each pair of
            neighboring sentences. Similarity is a score from 0 (completely unrelated) to 1 (nearly
            identical). Sentences about the same topic score high (0.8–0.95). Sentences about different
            topics score low (0.2–0.4).
          </p>
        </ContentStep>

        <ContentStep number={4} title="Cut where similarity drops">
          <p>
            When similarity between two consecutive sentences falls below a threshold you set (commonly
            0.5–0.7), that is a <strong className="text-white">semantic boundary</strong> — start a new chunk.
          </p>
        </ContentStep>

        <ContentStep number={5} title="Clean up edge cases">
          <p>
            Merge chunks that ended up too small (one sentence). Cap chunks that grew too large (split at
            the weakest similarity point inside). This keeps chunk sizes practical.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Similarity scores in action">
        <p className="mb-4 text-slate-300">
          Here is what the similarity scores look like for our example paragraph. Watch where the score
          drops — that is where the topic changes.
        </p>

        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-xs font-medium text-slate-400">Consecutive sentence similarity</div>
          <div className="mt-2 space-y-2 font-mono text-slate-200">
            <div>
              S1↔S2: 0.91 <span className="text-slate-400">("refund policy" → "30 days")</span>{' '}
              <span className="text-genai-400">same chunk</span>
            </div>
            <div>
              S2↔S3: 0.85 <span className="text-slate-400">("30 days" → "proof required")</span>{' '}
              <span className="text-genai-400">same chunk</span>
            </div>
            <div>
              S3↔S4: 0.34 <span className="text-slate-400">("proof required" → "free shipping")</span>{' '}
              <span className="text-amber-400">← boundary! new chunk</span>
            </div>
            <div>
              S4↔S5: 0.88 <span className="text-slate-400">("free shipping" → "3–5 days delivery")</span>{' '}
              <span className="text-genai-400">same chunk</span>
            </div>
            <div>
              S5↔S6: 0.82 <span className="text-slate-400">("delivery" → "express $15")</span>{' '}
              <span className="text-genai-400">same chunk</span>
            </div>
            <div>
              S6↔S7: 0.29 <span className="text-slate-400">("express $15" → "hiring engineers")</span>{' '}
              <span className="text-amber-400">← boundary! new chunk</span>
            </div>
            <div>
              S7↔S8: 0.79 <span className="text-slate-400">("hiring" → "applications close")</span>{' '}
              <span className="text-genai-400">same chunk</span>
            </div>
          </div>
        </div>

        <Callout variant="insight">
          The big drops (0.34 and 0.29) happen exactly where a human reader would say "new topic." Semantic
          chunking automates that judgment using math instead of rules.
        </Callout>
      </LessonSection>

      <LessonSection title="Pros and cons">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Pros</th>
                <th className="px-4 py-3">Cons</th>
              </tr>
            </thead>
            <tbody>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Chunks are topically coherent — no mid-topic cuts
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Slower: must embed every sentence at index time
                </td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Works on unstructured prose with no headings
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Variable chunk sizes — some tiny, some large
                </td>
              </tr>
              <tr className="hover:bg-surface-800/50">
                <td className="px-4 py-3 text-slate-400">
                  Handles mixed-topic paragraphs that fool other strategies
                </td>
                <td className="px-4 py-3 text-slate-400">
                  Threshold tuning required — no universal default
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Threshold tuning — the one knob that matters">
        <p className="text-slate-300">
          The similarity threshold controls how aggressively the splitter creates boundaries:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Threshold too low (e.g. 0.3)</strong> — merges unrelated
            sentences. Refund and shipping end up in the same chunk.
          </li>
          <li>
            <strong className="text-white">Threshold too high (e.g. 0.9)</strong> — over-splits. Every
            sentence becomes its own chunk, losing context.
          </li>
          <li>
            <strong className="text-white">Sweet spot (e.g. 0.5–0.7)</strong> — splits at genuine topic
            changes, keeps related sentences together.
          </li>
        </ul>
        <p className="mt-4 text-slate-300">
          There is no universal best value. Test with 20–50 questions from your documents and check whether
          the right chunk appears in the top results.
        </p>
      </LessonSection>

      <LessonSection title="When to use semantic chunking">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Use it</strong> for long reports, research papers, transcripts,
            and any prose that mixes topics without clear headings.
          </li>
          <li>
            <strong className="text-white">Skip it</strong> when documents have clear headings (use
            structure-aware) or uniform short sections (use recursive). Semantic chunking adds cost and
            complexity you may not need.
          </li>
        </ul>

        <Callout variant="tip">
          For structured docs with clear headings, structure-aware chunking is simpler and equally effective.
          Reserve semantic chunking for the messy, mixed-topic documents where nothing else works.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Semantic chunking groups sentences by meaning — boundaries form where topics shift.',
          'It embeds each sentence and compares neighbors; low similarity = new chunk.',
          'Best for mixed-topic unstructured prose (reports, papers, transcripts).',
          'Slower than recursive splitting because every sentence gets embedded at index time.',
          'Tune the similarity threshold on your own data — too low merges topics, too high over-splits.',
        ]}
      />
    </LessonArticle>
  )
}
