import {
  Callout,
  CodeBlock,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function SupervisedFineTuningSft() {
  return (
    <LessonArticle>
      <Definition term="Supervised fine-tuning (SFT)">
        <p>
          <strong className="text-white">Supervised fine-tuning</strong> trains the model on explicit{' '}
          <span className="text-genai-400">(input → desired output)</span> pairs. For each example you show what a
          good answer looks like; the model adjusts weights to make those completions more likely. “Supervised”
          means a human (or a trusted teacher model) provided the target labels.
        </p>
      </Definition>

      <LessonSection title="What an SFT example looks like">
        <p className="text-slate-300">
          At minimum you need a prompt (or conversation prefix) and the completion you want. Many datasets store a
          single string that already includes both, or structured fields like <code className="font-mono text-sm">instruction</code>,{' '}
          <code className="font-mono text-sm">input</code>, and <code className="font-mono text-sm">output</code>.
        </p>
        <Example
          title="Conceptual QA pair"
          caption="The model is trained so that, given the question, it prefers the shown answer tokens."
        >{`{
  "input": "Summarize our refund policy in one sentence for gift cards.",
  "output": "Gift cards are non-refundable except where required by law; contact support with your order ID."
}`}</Example>
      </LessonSection>

      <LessonSection title="Example dataset flavors">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Task</th>
                <th className="px-4 py-3">Input</th>
                <th className="px-4 py-3">Desired output</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Q&A / support', 'User question + optional context', 'Accurate, on-brand reply'],
                ['Summarization', 'Long document or ticket thread', 'Short summary with constraints'],
                ['Code', 'Spec or buggy snippet', 'Correct function or patch'],
                ['Structured extraction', 'Unstructured email', 'JSON fields only'],
              ].map(([task, inp, out]) => (
                <tr key={task} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{task}</td>
                  <td className="px-4 py-3 text-slate-400">{inp}</td>
                  <td className="px-4 py-3 text-genai-400">{out}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="SFT data flow"
          chart={`flowchart LR
  A[Labeled pairs] --> B[Format with chat template]
  B --> C[Train: predict target tokens]
  C --> D[SFT model]`}
        />
      </LessonSection>

      <LessonSection title="Loss usually focuses on completion tokens">
        <p className="text-slate-300">
          In generative SFT you typically <strong className="text-white">mask</strong> the prompt: the model still
          reads the input, but the loss is computed mainly on the{' '}
          <span className="text-genai-400">assistant / answer tokens</span>. That way you teach the model what to
          say, not to reinvent the user&apos;s question.
        </p>
        <CodeBlock title="Mental model of token roles">{`[ USER PROMPT TOKENS ][ ASSISTANT COMPLETION TOKENS ]
        ^ usually no loss              ^ loss applied here`}</CodeBlock>
        <Callout variant="insight">
          Exact masking depends on the training library and chat template. Getting templates wrong (next lesson
          topics) can silently train on the wrong spans.
        </Callout>
      </LessonSection>

      <LessonSection title="How SFT relates to ChatGPT-style Instruct models">
        <p className="text-slate-300">
          Public “Chat” / “Instruct” models are usually{' '}
          <strong className="text-white">base models + SFT (often instruction data) + further alignment</strong>{' '}
          (like preference optimization). The SFT stage is where the model learns to follow instructions and chat
          in turns instead of only continuing raw internet text.
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Base model',
              'Great at completing text; may ignore “Write a polite email…” unless patterns appear in the prompt.',
            ],
            [
              'After instruction-style SFT',
              'Treats your request as a task and answers as an assistant — the ChatGPT-like experience users expect.',
            ],
            [
              'Your product SFT',
              'Further specializes an Instruct/Chat checkpoint on your schemas, tone, and domain examples.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner">
          When people say “we fine-tuned GPT/Llama for support,” they almost always mean an SFT (or SFT+LoRA)
          stage on conversation or instruction pairs — not pretraining from scratch.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SFT = train on (input, desired output) pairs so the model prefers your completions.',
          'Common datasets: QA, summarization, code, structured extraction.',
          'Loss usually applies to completion / assistant tokens, not the whole prompt.',
          'Instruct/Chat models are base models shaped by SFT (and later alignment); product SFT specializes them further.',
        ]}
      />
    </LessonArticle>
  )
}
