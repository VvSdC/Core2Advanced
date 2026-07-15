import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function IntroductionToUnsloth() {
  return (
    <LessonArticle>
      <Definition term="Unsloth">
        <p>
          <strong className="text-white">Unsloth</strong> is an open-source toolkit for{' '}
          <strong className="text-white">faster, more memory-efficient LLM fine-tuning</strong> — especially
          LoRA/QLoRA — built to work with the Hugging Face ecosystem. It provides optimized model loading,
          custom kernels, and training helpers so you can fine-tune larger models on consumer GPUs with less
          waiting and less VRAM.
        </p>
      </Definition>

      <Callout variant="beginner" title="What you still need">
        Unsloth speeds up <em>how</em> you train. It does not invent good data, choose the right task, or replace
        evaluation. A fast train on bad labels still produces a bad model — just sooner.
      </Callout>

      <LessonSection title="Why people use Unsloth">
        <p className="text-slate-300">
          Community and docs often claim roughly <span className="text-genai-400">~2× faster training</span> and{' '}
          <span className="text-genai-400">lower VRAM</span> versus naive Transformers + PEFT setups. Treat those
          as <strong className="text-white">order-of-magnitude marketing-ish claims</strong>: real gains depend on
          model, sequence length, batch size, GPU, CUDA stack, and whether you already use solid baselines
          (FlashAttention, packing, 4-bit, etc.).
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Speed</strong> — optimized kernels and training paths reduce idle GPU
            time on common SFT/LoRA workloads.
          </li>
          <li>
            <strong className="text-white">Memory</strong> — 4-bit loading + LoRA + checkpointing patterns make
            7B–8B (and sometimes larger) SFT realistic on 16–24 GB cards.
          </li>
          <li>
            <strong className="text-white">Ergonomics</strong> — <code className="font-mono text-sm">FastLanguageModel</code>{' '}
            APIs wrap common load / LoRA / save steps with fewer boilerplate mistakes.
          </li>
        </ul>
        <Callout variant="insight">
          Benchmark on <em>your</em> model and seq length before citing “2×” in a report. A fair comparison uses
          the same data, effective batch, and precision.
        </Callout>
      </LessonSection>

      <LessonSection title="How Unsloth relates to Hugging Face">
        <Flowchart
          title="Unsloth sits on the HF training stack"
          chart={`flowchart TB
  U[Unsloth FastLanguageModel] --> HF[Transformers model + tokenizer]
  U --> PEFT[PEFT LoRA adapters]
  U --> TRL[TRL SFTTrainer / similar trainers]
  HF --> TRAIN[Training loop]
  PEFT --> TRAIN
  TRL --> TRAIN
  TRAIN --> AD[Saved adapter / merged weights]`}
        />
        <ContentStep number={1} title="Transformers">
          <p className="text-slate-300">
            Base models and tokenizers still come from Hugging Face Transformers (or compatible checkpoints). Unsloth
            patches/optimizes loading and selected ops; it is not a separate model zoo philosophy.
          </p>
        </ContentStep>
        <ContentStep number={2} title="PEFT">
          <p className="text-slate-300">
            LoRA (and related) adapters are the PEFT idea — train small matrices. Unsloth helps you attach and train
            them efficiently.
          </p>
        </ContentStep>
        <ContentStep number={3} title="TRL">
          <p className="text-slate-300">
            Training loops for SFT (and other alignment recipes) commonly use Hugging Face{' '}
            <strong className="text-white">TRL</strong> trainers. Unsloth notebooks often plug into SFTTrainer-
            style APIs rather than inventing a totally new paradigm.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="When Unsloth vs plain Transformers + PEFT">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Situation</th>
                <th className="px-4 py-3">Lean toward</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Consumer GPU, want QLoRA SFT quickly', 'Unsloth'],
                ['Learning the raw PEFT / Trainer APIs end-to-end', 'Plain Transformers + PEFT + TRL'],
                ['Unusual model or custom research fork', 'Plain stack (fewer magic patches)'],
                ['Team already standardized on Unsloth notebooks', 'Unsloth'],
                ['Need exact reproducibility of an old HF-only script', 'Match that script; do not force Unsloth'],
              ].map(([sit, lean]) => (
                <tr key={sit} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-white">{sit}</td>
                  <td className="px-4 py-3 text-genai-400">{lean}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          Plain Transformers + PEFT is always a valid path. Unsloth is a productivity and efficiency layer for the
          common fine-tuning path — not a requirement to understand LoRA conceptually.
        </p>
      </LessonSection>

      <LessonSection title="Mental model for beginners">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Same goals as usual SFT</strong> — teach format, tone, or domain behavior
            with labeled examples.
          </li>
          <li>
            <strong className="text-white">Same risks</strong> — bad chat templates, leakage, overfitting, weak eval.
          </li>
          <li>
            <strong className="text-white">Different delivery</strong> — faster iteration so you can afford more
            experiments <em>if</em> you spend saved time on data and eval.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="tip" title="Learning order">
        Learn LoRA/QLoRA concepts and dataset formatting first, then speed up with Unsloth. Otherwise you will
        struggle to debug whether a bug is “Unsloth-specific” or “basic fine-tuning mistake.”
      </Callout>

      <KeyTakeaways
        items={[
          'Unsloth = faster / lower-VRAM fine-tuning helpers on top of the HF + PEFT + TRL world.',
          'Speed/VRAM claims are real often enough to try — but verify on your setup.',
          'Use Unsloth for practical SFT/LoRA; use plain PEFT when you need maximum transparency or custom research.',
          'Good data and eval still matter more than kernel speed.',
        ]}
      />
    </LessonArticle>
  )
}
