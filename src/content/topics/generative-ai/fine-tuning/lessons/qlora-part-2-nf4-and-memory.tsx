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

export function QloraPart2Nf4AndMemory() {
  return (
    <LessonArticle>
      <Definition term="NF4 (NormalFloat4)">
        <p>
          <strong className="text-white">NF4</strong> is a 4-bit data type designed around the idea that
          neural network weights often look roughly <strong className="text-white">bell-curved
          (Normal)</strong>. Instead of spreading 16 possible 4-bit codes evenly, NF4 places those codes where
          typical weight values actually cluster — so each 4-bit bucket wastes less on empty ranges and
          preserves more &quot;useful&quot; precision where the mass of weights sits.
        </p>
      </Definition>

      <LessonSection title="NF4 in plain English">
        <p className="text-slate-300">
          Imagine labeling every weight with only 16 possible tags (4 bits). If you space tags evenly from
          −max to +max, many tags sit in empty desert regions almost no weights use. NF4 scoots the tags toward
          the crowded center of the bell curve so the crowded region gets finer labels. That is why NF4 works
          better than naive 4-bit for LLM weights in QLoRA.
        </p>
        <Callout variant="beginner" title="You do not hand-tune NF4">
          Libraries like <strong className="text-white">bitsandbytes</strong> implement NF4 for you. Your job
          is to set <code className="font-mono text-sm">bnb_4bit_quant_type=&quot;nf4&quot;</code> and focus on
          data, rank, and eval.
        </Callout>
      </LessonSection>

      <LessonSection title="Double quantization">
        <ContentStep number={1} title="What gets quantized twice?">
          <p>
            Besides the weights, quantization uses constant scales (and related metadata) per block. Those
            constants themselves consume memory. <strong className="text-white">Double quantization</strong>{' '}
            quantizes those constants too — shaving a bit more VRAM for free-ish.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When it helps">
          <p>
            Most useful on memory-tight GPUs where every few hundred MB matters (fitting batch size 2 instead of
            OOM at batch size 1). Quality impact is typically small compared to the base 4-bit choice itself.
          </p>
        </ContentStep>
        <Example title="Flag you will see">{`bnb_4bit_use_double_quant=True  # quantize the quantization constants`}</Example>
      </LessonSection>

      <LessonSection title="Paged optimizers — CPU offload of optimizer states">
        <p className="text-slate-300">
          Even with a 4-bit base, <strong className="text-white">optimizer states for LoRA params</strong> and
          activations can spike during training. <strong className="text-white">Paged optimizers</strong>{' '}
          (BitsAndBytes) use unified memory / paging ideas so optimizer state can spill to CPU RAM when GPU
          memory is under pressure — similar in spirit to how an OS pages memory, not a perfect free lunch, but
          often the difference between crash and finish.
        </p>
        <Flowchart
          title="Where memory goes during QLoRA"
          chart={`flowchart TB
  W4[4-bit base weights on GPU]
  A[Activations for forward/backward]
  L[LoRA params — higher precision]
  O[Optimizer states for LoRA]
  W4 --> GPU[GPU VRAM]
  A --> GPU
  L --> GPU
  O --> Page{Paged optimizer?}
  Page -->|Yes under pressure| CPU[Spill to CPU RAM]
  Page -->|Fits| GPU`}
        />
        <Callout variant="tip">
          Paging can slow steps when thrashing. Prefer a slightly smaller batch / sequence length first; use
          paged AdamW as a safety net when you are near the VRAM cliff.
        </Callout>
      </LessonSection>

      <LessonSection title="BitsAndBytesConfig example">
        <CodeBlock title="QLoRA-ready load with transformers + bitsandbytes">{`from transformers import AutoModelForCausalLM, BitsAndBytesConfig
from peft import LoraConfig, get_peft_model, prepare_model_for_kbit_training

bnb_config = BitsAndBytesConfig(
    load_in_4bit=True,
    bnb_4bit_quant_type="nf4",
    bnb_4bit_use_double_quant=True,
    bnb_4bit_compute_dtype="bfloat16",  # or torch.bfloat16
)

model = AutoModelForCausalLM.from_pretrained(
    "meta-llama/Llama-3.1-8B-Instruct",
    quantization_config=bnb_config,
    device_map="auto",
)

model = prepare_model_for_kbit_training(model)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM",
    target_modules="all-linear",
)

model = get_peft_model(model, lora_config)`}</CodeBlock>
        <Callout variant="insight">
          Training typically uses a paged AdamW variant from bitsandbytes when you enable it in your Trainer /
          TRL config — check the docs for <code className="font-mono text-sm">optim=&quot;paged_adamw_8bit&quot;</code>{' '}
          (common pattern).
        </Callout>
      </LessonSection>

      <LessonSection title="Rough VRAM table — full FT vs LoRA vs QLoRA">
        <p className="text-slate-300">
          Numbers below are <strong className="text-white">order-of-magnitude teaching estimates</strong> for
          fine-tuning (not inference). Exact usage depends on sequence length, batch size, FlashAttention,
          gradient checkpointing, and framework version.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model</th>
                <th className="px-4 py-3">Full FT (FP16)</th>
                <th className="px-4 py-3">LoRA (FP16 base)</th>
                <th className="px-4 py-3">QLoRA (4-bit base)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['7B', '60–100+ GB', '~16–24 GB', '~6–10 GB'],
                ['13B', '120–200+ GB', '~28–40 GB', '~10–16 GB'],
                ['70B', 'Multi-node / huge', 'Often multi-GPU', '~40–80 GB (config-dependent)'],
              ].map(([model, full, lora, qlora]) => (
                <tr key={model} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{model}</td>
                  <td className="px-4 py-3 text-slate-400">{full}</td>
                  <td className="px-4 py-3 text-slate-400">{lora}</td>
                  <td className="px-4 py-3 text-genai-400">{qlora}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner">
          Treat the table as a compass, not a promise. Always do a short dry-run on your machine with your max
          sequence length before committing to a long overnight train.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'NF4 packs 4-bit codes denser where Normal-like weights actually live — better than naive 4-bit.',
          'Double quantization shrinks quantization constants for a little extra VRAM savings.',
          'Paged optimizers can spill optimizer state to CPU when GPU memory spikes.',
          'QLoRA VRAM is far below full FT and usually below FP16-LoRA — verify with a short dry-run.',
        ]}
      />
    </LessonArticle>
  )
}
