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

export function ChatTemplatesAndRoles() {
  return (
    <LessonArticle>
      <Definition term="Chat template">
        <p>
          A <strong className="text-white">chat template</strong> is the exact string format a model expects for
          multi-turn messages — special markers for <span className="text-genai-400">system</span>,{' '}
          <span className="text-genai-400">user</span>, and <span className="text-genai-400">assistant</span> roles.
          Training and inference must use the <em>same</em> template the model was taught, or it may ignore
          instructions, jumble roles, or generate stop tokens incorrectly.
        </p>
      </Definition>

      <LessonSection title="Roles: system, user, assistant">
        <div className="mt-2 space-y-3">
          {[
            [
              'system',
              'High-level rules and persona (“You are a billing assistant. Always answer in JSON.”). Not every model uses this role, but when it does, put policy here.',
            ],
            [
              'user',
              'What the human (or calling app) asked. Can include pasted context, but role is still “user.”',
            ],
            [
              'assistant',
              'What the model should say. In training data, this is your labeled target completion.',
            ],
          ].map(([role, body]) => (
            <div key={role} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="font-mono text-sm font-semibold text-genai-400">{role}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <Flowchart
          title="Message flow into the model"
          chart={`flowchart LR
  S[system] --> T[Chat template renderer]
  U[user] --> T
  A[assistant targets] --> T
  T --> X[Single token string]
  X --> M[Model train / generate]`}
        />
      </LessonSection>

      <LessonSection title="Why ChatML, Llama-3, and friends differ">
        <p className="text-slate-300">
          Each model family invents delimiter tokens. Examples (simplified):
        </p>
        <CodeBlock title="Conceptual ChatML-style markers">{`<|im_start|>system
You are helpful.<|im_end|>
<|im_start|>user
Hello!<|im_end|>
<|im_start|>assistant
`}</CodeBlock>
        <CodeBlock title="Conceptual Llama-3-style markers">{`<|begin_of_text|><|start_header_id|>system<|end_header_id|>

You are helpful.<|eot_id|><|start_header_id|>user<|end_header_id|>

Hello!<|eot_id|><|start_header_id|>assistant<|end_header_id|>

`}</CodeBlock>
        <Callout variant="beginner" title="Key idea">
          You almost never hand-write these in production. Hugging Face{' '}
          <code className="font-mono text-sm">tokenizer.apply_chat_template(...)</code> (or your trainer&apos;s
          equivalent) applies the template from the model&apos;s <code className="font-mono text-sm">tokenizer_config</code>.
          Your job: feed a list of role/content messages and trust that helper — for the{' '}
          <strong className="text-white">same</strong> model you will train and serve.
        </Callout>
      </LessonSection>

      <LessonSection title="Wrong template = broken fine-tune">
        <p className="text-slate-300">
          If you train with Alpaca plain text but serve with Llama-3 headers (or mix two formats in one dataset), the
          model learns the wrong “punctuation” for conversation. Symptoms: ignoring the system prompt, repeating
          user text, never stopping, or acting like a base completion model again.
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['Train and serve mismatch', 'Learned pattern ≠ inference pattern → chaos.'],
            ['Missing end-of-turn tokens', 'Model never learned when to stop generating.'],
            ['Roles collapsed into one blob', 'Model cannot tell instruction from answer.'],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <LessonSection title="Correctly formatted training sample">
        <p className="text-slate-300">
          Think in messages first; let the template render second:
        </p>
        <Example
          title="Messages you provide to the trainer"
          caption="During SFT, loss is typically applied on the final assistant turn (and sometimes prior assistant turns)."
        >{`messages = [
  {"role": "system", "content": "You are a concise support bot. Answer in one short paragraph."},
  {"role": "user", "content": "Do you ship internationally?"},
  {"role": "assistant", "content": "Yes — we ship to most countries. Delivery times and fees appear at checkout by destination."},
]`}</Example>
        <Callout variant="insight">
          Multi-turn samples include earlier user/assistant turns as context and still end with the target assistant
          reply. Keep style consistent across the dataset.
        </Callout>
      </LessonSection>

      <LessonSection title="Why this matters before LoRA">
        <p className="text-slate-300">
          <strong className="text-white">LoRA</strong> (Low-Rank Adaptation) and other PEFT methods only change{' '}
          <em>how</em> weights are updated — they do not fix bad formatting. If templates are wrong, you efficiently
          fine-tune the model to follow the wrong script. Nail roles + chat templates before you spend GPU hours on
          LoRA ranks and learning rates.
        </p>
        <Flowchart
          title="Order of operations"
          chart={`flowchart TD
  A[Pick Instruct checkpoint] --> B[Learn its chat template]
  B --> C[Convert dataset → messages]
  C --> D[Render with apply_chat_template]
  D --> E[Then configure LoRA / SFT hyperparams]
  E --> F[Train and evaluate]`}
        />
        <Callout variant="tip">
          Before a long run: render 3–5 samples to plain text and read them. If delimiters look wrong to a human,
          they are wrong for the model.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'system / user / assistant roles structure chat; templates encode them as special tokens.',
          'ChatML, Llama-3, etc. differ — always use the model’s official chat template.',
          'Wrong template silently breaks fine-tunes and inference.',
          'Format data correctly before LoRA: PEFT speeds training but cannot rescue role mismatch.',
        ]}
      />
    </LessonArticle>
  )
}
