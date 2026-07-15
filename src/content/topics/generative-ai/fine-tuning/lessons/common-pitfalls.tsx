import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CommonPitfalls() {
  return (
    <LessonArticle>
      <Definition term="Fine-tuning pitfalls">
        <p>
          Recurring mistakes that make LoRA/QLoRA “fail” even when the tooling works: wrong chat templates, data
          leakage, too little or overfit data, aggressive learning rates, and evaluating only on training-style
          prompts. Most disasters are data/process — not Unsloth kernels.
        </p>
      </Definition>

      <Callout variant="beginner" title="Symptom ≠ root cause">
        “Loss went down but answers are weird” usually means formatting or leakage, not that you need a fancier
        optimizer.
      </Callout>

      <LessonSection title="Wrong chat template">
        <p className="text-slate-300">
          Instruct models are trained with specific special tokens and role markers. If you train with raw
          <code className="font-mono text-sm"> Instruct: / Response:</code> text but serve with the official Llama /
          Qwen / Mistral template (or vice versa), the model never sees a consistent format.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Always use <code className="font-mono text-sm">apply_chat_template</code> (or library helpers).</li>
          <li>Match system/user/assistant roles to how you will call the API later.</li>
          <li>Print one formatted sample before training — read it like a human.</li>
        </ul>
        <Example title="Sanity print">{`print(tokenizer.apply_chat_template(
    sample_messages, tokenize=False, add_generation_prompt=False
))
# Must look like official chat format for that model family`}</Example>
      </LessonSection>

      <LessonSection title="Leaking answers into prompts / data leakage">
        <ContentStep number={1} title="Answer in the user turn">
          <p className="text-slate-300">
            Accidentally putting the target solution inside the user message. The model “cheats” during training and
            looks amazing on similar leaked prompts — then fails on clean inputs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Train/eval contamination">
          <p className="text-slate-300">
            Eval prompts (or near-duplicates) appear in the train set. Metrics look great; production does not.
            Hold out by <span className="text-genai-400">hash / clustering / explicit IDs</span>, not only random
            shuffle on paraphrases of the same tickets.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Retrieval leakage">
          <p className="text-slate-300">
            Fine-tuning on documents you later retrieve in RAG can hide that the model memorized rather than
            generalized. Prefer RAG for knowledge; SFT for style/format/procedure.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Too few examples, too many epochs">
        <p className="text-slate-300">
          Fifty noisy rows × twenty epochs teaches quirks and typos. Prefer more diverse, clean examples and{' '}
          <strong className="text-white">1–3 epochs</strong>. If the set is tiny, consider fewer steps, heavier
          regularization, or whether prompting/RAG is the better tool.
        </p>
        <Callout variant="insight">
          High-quality hundreds of examples usually beat low-quality tens of thousands for niche assistants.
        </Callout>
      </LessonSection>

      <LessonSection title="Learning rate too high → gibberish">
        <p className="text-slate-300">
          Classic failure mode: loss spikes, NaNs, or fluent-looking nonsense that ignores instructions. Drop LR by
          2–5×, shorten warmup debugging runs, confirm you did not accidentally unfreeze the full model when you
          meant LoRA-only.
        </p>
      </LessonSection>

      <LessonSection title="Evaluating only on train-style prompts">
        <p className="text-slate-300">
          If every eval prompt looks like your JSONL template, you only validate memorization of that style. Include
          messy user phrasing, shorter/longer turns, multilingual quirks, and “must not break” general questions.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Compare against the <strong className="text-white">base Instruct</strong> model.</li>
          <li>Track win rate + regressions, not only “sounds fine.”</li>
          <li>Re-run the suite for every adapter version you might ship.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Debugging flowchart">
        <Flowchart
          title="Fine-tune went sideways"
          chart={`flowchart TD
  BAD[Bad outputs / weird train] --> T{Template OK?}
  T -->|No| FIX[Fix chat template + reformat data]
  T -->|Yes| L{Leakage / labels?}
  L -->|Yes| CLEAN[Clean data + re-split]
  L -->|No| LR{Loss exploding?}
  LR -->|Yes| DROP[Lower LR / check LoRA-only]
  LR -->|No| EP{Overfit signals?}
  EP -->|Yes| CUT[Fewer epochs / more data]
  EP -->|No| GOLD[Expand golden eval vs base]
  FIX --> RETRY[Short smoke train]
  CLEAN --> RETRY
  DROP --> RETRY
  CUT --> RETRY
  GOLD --> RETRY`}
        />
      </LessonSection>

      <LessonSection title="Quick checklist before blaming the library">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Printed one formatted training string — looks correct?</li>
          <li>Train and serve use the same template?</li>
          <li>No answers in user fields; no eval duplicates in train?</li>
          <li>LR and epochs in a sensible LoRA range?</li>
          <li>Tried base vs FT on messy real prompts?</li>
        </ul>
        <Callout variant="tip">
          If Unsloth’s official notebook works on a known dataset but yours does not, diff your data formatting —
          not your CUDA first.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Wrong chat templates silently ruin SFT — print samples early.',
          'Watch for answer leakage and train/eval contamination.',
          'Few examples × many epochs overfits; high LR causes gibberish.',
          'Eval on real messy prompts vs base model, not only train clones.',
        ]}
      />
    </LessonArticle>
  )
}
