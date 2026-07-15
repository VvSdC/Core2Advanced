import {
  Callout,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PretrainingVsFineTuningVsRag() {
  return (
    <LessonArticle>
      <Definition term="Three ways to put knowledge into an LLM system">
        <p>
          You can (1) <strong className="text-white">pretrain</strong> from scratch on massive data, (2){' '}
          <strong className="text-white">fine-tune</strong> an existing model on your examples, or (3) leave the
          model alone and give it fresh documents at ask-time with{' '}
          <strong className="text-white">RAG</strong> (retrieval-augmented generation). These are complementary —
          most production systems mix them.
        </p>
      </Definition>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">Cost / time</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Pretraining',
                  'Train weights from (near) scratch on huge corpora',
                  'Extremely high — months, thousands of GPUs',
                  'Labs building foundation models',
                ],
                [
                  'Fine-tuning',
                  'Update (some) weights on your labeled examples',
                  'Medium — hours to days on a few GPUs',
                  'Style, format, domain phrasing, tool use patterns',
                ],
                [
                  'RAG',
                  'Retrieve documents; put them in the prompt',
                  'Lower to start — infra + embedding cost',
                  'Changing facts, private docs, citations',
                ],
              ].map(([name, does, cost, best]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-slate-400">{does}</td>
                  <td className="px-4 py-3 text-slate-400">{cost}</td>
                  <td className="px-4 py-3 text-genai-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Where knowledge lives"
          chart={`flowchart TB
  P[Pretraining] --> W[Inside model weights<br/>frozen knowledge soup]
  F[Fine-tuning] --> W2[Inside adapted weights<br/>your habits baked in]
  R[RAG] --> X[Outside the model<br/>docs fetched per query]
  W --> Ans[Answer]
  W2 --> Ans
  X --> Ans`}
        />
      </LessonSection>

      <LessonSection title="When each approach wins">
        <div className="mt-2 space-y-3">
          {[
            [
              'Pretraining wins when…',
              'You need a brand-new foundation model, a new modality, or a language underserved by existing models. Almost never the right first move for a product team.',
            ],
            [
              'Fine-tuning wins when…',
              'You need consistent style/format (always return JSON schema X), domain vocabulary the base model mangles, or shorter prompts because the behavior is internalized.',
            ],
            [
              'RAG wins when…',
              'Facts change weekly, you need citations, content is proprietary and must stay updatable without retraining, or you are still exploring the product.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title="“RAG first, fine-tune when needed”">
        <p className="text-slate-300">
          A reliable beginner intuition: <span className="text-genai-400">start with prompting + RAG</span>. Prove
          the product works. Fine-tune when you have clear evidence that the model{' '}
          <em>knows how to answer</em> but stubbornly fails on format, tone, or domain dialect — or when latency and
          prompt size make stuffing documents expensive.
        </p>
        <Flowchart
          title="Practical decision path"
          chart={`flowchart TD
  A[Need better answers?] --> B{Are facts in<br/>changing docs?}
  B -->|Yes| C[Try RAG + better prompts]
  B -->|No — style/format/domain| D{Do you have<br/>hundreds+ examples?}
  C --> E{Still broken on<br/>format or tone?}
  E -->|Yes| D
  E -->|No| F[Ship RAG]
  D -->|Yes| G[Consider fine-tuning]
  D -->|No| H[Collect data / keep prompting]`}
        />
        <Callout variant="insight">
          Fine-tuning embeds behavior in weights; RAG keeps knowledge editable. Mixing both is common: RAG for
          facts, fine-tuning for how the model talks about those facts.
        </Callout>
      </LessonSection>

      <LessonSection title="Cost, time, and knowledge tradeoffs">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Cost:</strong> pretrain ≫ full fine-tune ≫ LoRA fine-tune ≫ RAG indexing.
          </li>
          <li>
            <strong className="text-white">Update speed:</strong> RAG docs update in minutes; fine-tunes need a new
            training run; pretrained models update on lab timelines.
          </li>
          <li>
            <strong className="text-white">Knowledge freshness:</strong> RAG is strongest; fine-tuned “facts” can go
            stale; pretrained knowledge is a snapshot of the training cutoff.
          </li>
          <li>
            <strong className="text-white">Behavioral consistency:</strong> fine-tuning often beats prompting alone
            for rigid formats once you have good labeled examples.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Pretraining builds the foundation; fine-tuning adapts behavior; RAG supplies external, updateable knowledge.',
          'Compare on cost, update speed, and whether you need style vs fresh facts.',
          'Default intuition: RAG (and good prompts) first; fine-tune when format/style/domain still fail.',
          'Many systems use both: retrieve facts, generate in a fine-tuned style.',
        ]}
      />
    </LessonArticle>
  )
}
