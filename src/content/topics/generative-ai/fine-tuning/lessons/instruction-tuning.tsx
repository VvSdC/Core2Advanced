import {
  Callout,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function InstructionTuning() {
  return (
    <LessonArticle>
      <Definition term="Instruction tuning">
        <p>
          <strong className="text-white">Instruction tuning</strong> is a form of{' '}
          <strong className="text-white">supervised fine-tuning (SFT)</strong> where each example is an{' '}
          <span className="text-genai-400">instruction → response</span> pair (sometimes with optional context).
          The goal is to teach the model to follow natural-language tasks: “summarize…”, “translate…”, “write a
          poem…”, “extract JSON…”.
        </p>
      </Definition>

      <LessonSection title="Same SFT machinery, instruction-shaped data">
        <p className="text-slate-300">
          Mechanically it is still forward → loss → backward → optimizer. What changes is the{' '}
          <em>dataset distribution</em>: instead of only continuing articles or code files, examples look like
          tasks a user would ask an assistant.
        </p>
        <Flowchart
          title="Where instruction tuning sits"
          chart={`flowchart TB
  A[Base pretrained model] --> B[Instruction tuning SFT]
  B --> C[Instruct / Chat checkpoint]
  C --> D[Optional: preference / RLHF alignment]
  C --> E[Optional: your domain SFT]`}
        />
      </LessonSection>

      <LessonSection title="Alpaca- and ShareGPT-style formats">
        <p className="text-slate-300">
          Two historical formats you will still see in open datasets and tooling docs:
        </p>
        <Example
          title="Alpaca-style (flat fields)"
          caption="instruction + optional input + output. Simple for single-turn tasks."
        >{`{
  "instruction": "Rewrite the sentence in a formal tone.",
  "input": "hey can u send the report asap",
  "output": "Could you please send the report at your earliest convenience?"
}`}</Example>
        <Example
          title="ShareGPT-style (multi-turn messages)"
          caption="A list of role-tagged turns — closer to chat UIs and modern chat templates."
        >{`{
  "conversations": [
    {"from": "human", "value": "Write a haiku about debugging."},
    {"from": "gpt", "value": "Stack traces whispering\\nCoffee cold, cursor blinking\\nOne typo, whole night"}
  ]
}`}</Example>
        <Callout variant="tip">
          Whatever JSON you start with, training code must convert it into the model&apos;s{' '}
          <strong className="text-white">chat template</strong> (next lesson). Format mismatches cause silent quality
          loss.
        </Callout>
      </LessonSection>

      <LessonSection title="Why “Write a poem” works better after instruction tuning">
        <div className="mt-2 space-y-3">
          {[
            [
              'Base model prior',
              'Saw “Write a poem” in the wild as web text — sometimes continues with more instructions, ads, or unrelated prose.',
            ],
            [
              'Instruction-tuned prior',
              'Saw thousands of examples where an instruction is followed by a complete helpful response. The assistant role becomes the default.',
            ],
            [
              'Practical effect',
              'Higher chance of a self-contained poem (or JSON, or summary) instead of rambling completion.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title="Base model vs Instruct model">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Base</th>
                <th className="px-4 py-3">Instruct / Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Default behavior', 'Continue the prompt as text', 'Answer as an assistant'],
                ['Prompting', 'Often needs careful completions', 'Natural “please do X” works'],
                ['Training data flavor', 'Internet / code mix', '+ instruction-response SFT'],
                ['Your fine-tune start', 'Possible but harder for chat apps', 'Usual starting checkpoint'],
              ].map(([aspect, base, instruct]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-slate-400">{base}</td>
                  <td className="px-4 py-3 text-genai-400">{instruct}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          Names vary: Instruct, Chat, IT (instruction-tuned). Read the model card — if it mentions chat templates
          and “assistant” roles, you are on an instruction-tuned lineage.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Instruction tuning = SFT on instruction→response (and chat) data.',
          'Alpaca = flat fields; ShareGPT-style = multi-turn conversations — both must map to chat templates.',
          'Instruct models follow task prompts more reliably than raw base models.',
          'For product fine-tunes, start from an Instruct/Chat checkpoint unless you have a strong reason not to.',
        ]}
      />
    </LessonArticle>
  )
}
