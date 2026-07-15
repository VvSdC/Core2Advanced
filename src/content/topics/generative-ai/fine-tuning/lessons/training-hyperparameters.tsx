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

export function TrainingHyperparameters() {
  return (
    <LessonArticle>
      <Definition term="Training hyperparameters">
        <p>
          <strong className="text-white">Hyperparameters</strong> are the knobs you set before training that control
          how the optimizer updates the model — learning rate, batch size, epochs, warmup, and related settings.
          They are not learned from data; you choose them. For LoRA/QLoRA, good defaults exist, but understanding
          each knob helps you debug weird loss curves.
        </p>
      </Definition>

      <Callout variant="beginner" title="Start here">
        You do not need to tune everything on day one. Pick a sensible recipe, train once, look at loss and
        qualitative outputs, then change <em>one</em> thing at a time.
      </Callout>

      <LessonSection title="The core knobs">
        <ContentStep number={1} title="Learning rate (LR)">
          <p className="text-slate-300">
            How big each weight update is. Too high → loss spikes, gibberish, or NaNs. Too low → almost no learning.
            For LoRA/QLoRA, typical ranges are often around <span className="text-genai-400">1e-4 to 2e-4</span>{' '}
            (sometimes higher for tiny adapters). Full fine-tunes usually need much smaller LRs.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Batch size">
          <p className="text-slate-300">
            How many examples the GPU processes in one forward/backward pass{' '}
            (<code className="font-mono text-sm">per_device_train_batch_size</code>. Limited by VRAM. Smaller batches
            are noisier gradients; larger are stabler but hungrier for memory.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Gradient accumulation">
          <p className="text-slate-300">
            Simulate a larger batch when VRAM is tight: run several micro-batches, accumulate gradients, then step
            the optimizer once. You get a bigger effective batch without fitting it all at once.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Epochs vs max_steps">
          <p className="text-slate-300">
            An <strong className="text-white">epoch</strong> is one full pass over the training set.{' '}
            <strong className="text-white">max_steps</strong> caps how many optimizer steps run regardless of epochs.
            Small datasets overfit quickly — prefer fewer epochs or an early stop via max_steps + eval.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Warmup">
          <p className="text-slate-300">
            Start LR near zero and ramp up for the first N steps. Softens early noisy updates when the model first
            sees your domain data. Common: a few percent of total steps (e.g. 3–10% warmup ratio).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Effective batch size">
        <Definition term="Effective batch size">
          <p>
            <code className="font-mono text-sm text-genai-400">
              effective_batch = per_device_batch × gradient_accumulation × num_gpus
            </code>
            . This is what the optimizer “feels.” Matching published recipes often means matching effective batch,
            not the raw micro-batch alone.
          </p>
        </Definition>
        <Example title="Same effective batch, different hardware">{`# Want effective batch ≈ 16
# 1× GPU, 16 GB:
per_device_train_batch_size = 2
gradient_accumulation_steps = 8   # 2 × 8 = 16

# 1× GPU with more VRAM:
per_device_train_batch_size = 4
gradient_accumulation_steps = 4   # 4 × 4 = 16`}</Example>
      </LessonSection>

      <LessonSection title="Packing vs padding">
        <p className="text-slate-300">
          Training sequences have different lengths. Two strategies waste less compute on empty tokens:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Padding</strong> — pad every sequence in a batch to the longest (or to
            <code className="font-mono text-sm"> max_seq_length</code>). Simple; pads are ignored in the loss but
            still cost FLOPs/memory in attention unless carefully masked.
          </li>
          <li>
            <strong className="text-white">Packing</strong> — concatenate several short examples into one long
            sequence (with boundaries) so the model processes denser tokens per step. Often faster throughput;
            setup is slightly more involved.
          </li>
        </ul>
        <Callout variant="tip">
          For beginners, padding + a modest <code className="font-mono text-sm">max_seq_length</code> is fine. Turn
          on packing once the pipeline works and you want more tokens/sec.
        </Callout>
      </LessonSection>

      <LessonSection title="Beginner recipes for LoRA / QLoRA">
        <CodeBlock title="Sensible starting recipe (illustrative)">{`# QLoRA / LoRA SFT — starting point, not law
learning_rate = 2e-4
per_device_train_batch_size = 2
gradient_accumulation_steps = 4   # effective batch ≈ 8
num_train_epochs = 1              # or 2–3 if dataset is tiny
warmup_ratio = 0.03
max_seq_length = 2048             # drop to 512 while debugging
lr_scheduler_type = "cosine"
# LoRA: r=8 or 16, alpha ≈ 2×r, dropout 0–0.05`}</CodeBlock>
        <p className="mt-3 text-slate-300">
          Prefer <strong className="text-white">1–3 epochs</strong> on small custom datasets. Huge epoch counts
          often memorize formatting quirks instead of generalizing.
        </p>
      </LessonSection>

      <LessonSection title="When loss looks weird — what to change first">
        <Flowchart
          title="Debugging weird training loss"
          chart={`flowchart TD
  W[Weird loss] --> S{Symptom?}
  S -->|Spikes / NaN / gibberish| LR[Lower LR by 2–5×]
  S -->|Flat / no drop| UP[Check data + chat template]
  S -->|Train↓ eval↑| OF[Fewer epochs / more data]
  S -->|OOM| MEM[Smaller batch or seq len]
  LR --> ONE[Change one knob]
  UP --> ONE
  OF --> ONE
  MEM --> ONE
  ONE --> RETRY[Rerun short train]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Loss explodes or output is nonsense</strong> — lower learning rate first.
          </li>
          <li>
            <strong className="text-white">Loss barely moves</strong> — verify labels, chat template, and that you
            are training the right tokens (not only padding).
          </li>
          <li>
            <strong className="text-white">Train loss great, real prompts bad</strong> — overfitting; cut epochs or
            enrich/hold out better eval data.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LR, batch, accumulation, epochs/max_steps, and warmup are the main training knobs.',
          'Effective batch size = micro-batch × accumulation × GPUs — match recipes on that number.',
          'Padding is simpler; packing packs more useful tokens per step once things work.',
          'Weird loss: change one thing — usually LR first, then data/template, then epochs.',
        ]}
      />
    </LessonArticle>
  )
}
