import {
  Callout,
  Definition,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToPromptEngineering() {
  return (
    <LessonArticle>
      <Definition term="Prompt Engineering">
        <p>
          <strong className="text-white">Prompt engineering</strong> is the practice of designing inputs to a
          language model so it produces the output you want — without changing the model's weights. The prompt
          is your entire interface to the model.
        </p>
        <p>
          Because models predict the next token based on everything they have seen so far, small changes in
          wording, structure, or examples can dramatically change the result.
        </p>
      </Definition>

      <LessonSection title="Why prompting matters">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>The same model can write brilliant code or produce nonsense — the prompt decides which.</li>
          <li>Good prompts reduce hallucination, improve format consistency, and cut down on retries.</li>
          <li>Prompting is free at inference time — no fine-tuning GPUs, no labelled datasets.</li>
          <li>It is the first skill to master before fine-tuning, RAG, or agents.</li>
        </ul>
      </LessonSection>

      <LessonSection title="What you will learn in this sub-topic">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Technique</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Zero-shot', 'Simple tasks, general knowledge, quick answers'],
                ['Few-shot', 'Format-sensitive tasks, classification, pattern matching'],
                ['Chain-of-thought', 'Math, logic, multi-step reasoning'],
                ['System / role prompts', 'Consistent persona, tone, and constraints'],
                ['Structured output', 'JSON, APIs, parsing downstream results'],
              ].map(([technique, best]) => (
                <tr key={technique} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{technique}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner">
        Read <em>Fundamentals</em> first — especially <em>How Language Models Work</em>. Prompting only makes
        sense once you understand that the model has no plan; it only continues text based on what you give it.
      </Callout>

      <KeyTakeaways
        items={[
          'Prompt engineering shapes model behaviour through input design — no retraining needed.',
          'Different techniques suit different tasks — there is no one-size-fits-all prompt.',
          'This sub-topic covers each technique, when to use it, and how to get the best results.',
        ]}
      />
    </LessonArticle>
  )
}
