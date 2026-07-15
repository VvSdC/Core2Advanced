import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FineTuningWithUnsloth() {
  return (
    <LessonArticle>
      <Definition term="Unsloth SFT pipeline">
        <p>
          An end-to-end path: load a base (often 4-bit) model with{' '}
          <strong className="text-white">FastLanguageModel</strong>, attach LoRA adapters, format chat data with
          the model’s template, train with a TRL-style <strong className="text-white">SFTTrainer</strong>, then
          save the adapter. APIs evolve — treat code below as a mental walkthrough, not a pinned recipe.
        </p>
      </Definition>

      <Callout variant="beginner" title="Version-agnostic note">
        Import paths and argument names change across Unsloth / Transformers / TRL releases. Always cross-check
        the current Unsloth docs or notebooks for your installed versions.
      </Callout>

      <LessonSection title="Pipeline overview">
        <Flowchart
          title="Unsloth supervised fine-tuning (SFT)"
          chart={`flowchart LR
  L[Load FastLanguageModel] --> A[Attach LoRA]
  A --> D[Format dataset + chat template]
  D --> T[SFTTrainer train]
  T --> S[Save adapter]
  S --> O[Optional: merge / export]`}
        />
      </LessonSection>

      <LessonSection title="Step-by-step walkthrough">
        <ContentStep number={1} title="Load the model">
          <p className="text-slate-300">
            Unsloth’s loader typically sets max sequence length, quantization (e.g. 4-bit), and dtype handling.
            You get a model + tokenizer ready for PEFT.
          </p>
          <CodeBlock title="Illustrative load (pseudocode / shapes vary)">{`from unsloth import FastLanguageModel

model, tokenizer = FastLanguageModel.from_pretrained(
    model_name="unsloth/Meta-Llama-3.1-8B-Instruct-bnb-4bit",
    max_seq_length=2048,
    load_in_4bit=True,   # QLoRA-style footprint
    # dtype / device settings per docs
)`}</CodeBlock>
        </ContentStep>

        <ContentStep number={2} title="Attach LoRA">
          <p className="text-slate-300">
            Tell Unsloth which modules get adapters and the rank / alpha. Only adapter weights train; base stays
            frozen (especially under QLoRA).
          </p>
          <CodeBlock title="Illustrative LoRA attach">{`model = FastLanguageModel.get_peft_model(
    model,
    r=16,
    lora_alpha=32,
    lora_dropout=0,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
    # use_gradient_checkpointing / rslora flags vary by version
)`}</CodeBlock>
        </ContentStep>

        <ContentStep number={3} title="Chat template handling">
          <p className="text-slate-300">
            Instruct models expect messages wrapped with special tokens (
            <code className="font-mono text-sm">&lt;|user|&gt;</code>, etc.). Use the tokenizer’s chat template
            (or Unsloth helpers) so train-time formatting matches inference-time formatting.
          </p>
          <Example title="Messages → one training string">{`messages = [
  {"role": "system", "content": "You are a helpful support agent."},
  {"role": "user", "content": "How do I reset my password?"},
  {"role": "assistant", "content": "Open Settings → Security → Reset password."},
]
# Prefer tokenizer.apply_chat_template(messages, tokenize=False, ...)
# Wrong template = model learns nonsense roles`}</Example>
          <Callout variant="insight">
            Mismatched templates are one of the most common “Unsloth didn’t work” bugs — usually the data, not the
            kernels.
          </Callout>
        </ContentStep>

        <ContentStep number={4} title="Train with SFTTrainer">
          <p className="text-slate-300">
            Plug the PEFT model, tokenizer, and dataset into TRL’s SFTTrainer (or the version Unsloth’s notebook
            wraps). Set learning rate, batch, accumulation, epochs/max_steps as in the hyperparameters lesson.
          </p>
          <CodeBlock title="Illustrative trainer sketch">{`from trl import SFTTrainer
from transformers import TrainingArguments

trainer = SFTTrainer(
    model=model,
    tokenizer=tokenizer,
    train_dataset=dataset,       # already templated or via formatting_func
    # dataset_text_field / packing args differ by TRL version
    args=TrainingArguments(
        per_device_train_batch_size=2,
        gradient_accumulation_steps=4,
        learning_rate=2e-4,
        num_train_epochs=1,
        fp16=True,               # or bf16 if supported
        logging_steps=10,
        output_dir="outputs",
    ),
)
trainer.train()`}</CodeBlock>
        </ContentStep>

        <ContentStep number={5} title="Save the adapter">
          <p className="text-slate-300">
            Persist LoRA weights (and tokenizer) to a folder. Later merge into base, push to Hub, or serve as a
            multi-LoRA adapter. Saving only adapters is small and version-control friendly.
          </p>
          <CodeBlock title="Illustrative save">{`model.save_pretrained("lora_adapter")
tokenizer.save_pretrained("lora_adapter")
# Some Unsloth helpers also offer merge_and_unload / GGUF export utilities`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Dataset shape — keep it simple">
        <p className="text-slate-300">
          Start with instruction-response pairs or multi-turn chats that match production. Prefer quality and
          template correctness over tens of thousands of noisy rows. While debugging, use a tiny subset and short{' '}
          <span className="text-genai-400">max_seq_length</span> so each iteration finishes in minutes.
        </p>
      </LessonSection>

      <LessonSection title="After training — sanity check">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Generate on a few golden prompts with the adapter attached.</li>
          <li>Compare to the base Instruct model with the <em>same</em> chat template.</li>
          <li>Confirm the model did not forget basic instructions you still need.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Unsloth SFT flow: FastLanguageModel → LoRA → template dataset → SFTTrainer → save adapter.',
          'Chat templates must match training and serving — verify early.',
          'Code shapes are stable conceptually; check versioned docs for exact APIs.',
          'Iterate on a small subset before burning a full-night train.',
        ]}
      />
    </LessonArticle>
  )
}
