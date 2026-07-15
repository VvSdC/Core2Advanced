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

export function LoraPart3ConfigPractice() {
  return (
    <LessonArticle>
      <Definition term="LoRA config recipe">
        <p>
          A practical LoRA setup is a small set of knobs: <strong className="text-white">rank r</strong>,{' '}
          <strong className="text-white">alpha</strong>, <strong className="text-white">target modules</strong>,{' '}
          <strong className="text-white">dropout</strong>, and a slightly higher{' '}
          <strong className="text-white">learning rate</strong> than you would use for full fine-tuning. Get
          these roughly right and data quality will dominate the rest.
        </p>
      </Definition>

      <LessonSection title="Choosing rank — r = 8 / 16 / 32 / 64">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">r</th>
                <th className="px-4 py-3">When to choose</th>
                <th className="px-4 py-3">Watch out</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['8', 'First experiments; style / tone / short formats', 'May underfit complex multi-skill datasets'],
                ['16', 'Default starting point for many chat / domain adapters', 'Still cheap — try before jumping higher'],
                ['32', 'Richer domains, larger diverse instruction sets', 'More VRAM; confirm eval gains vs r=16'],
                ['64', 'Hard tasks where r=32 clearly plateaus', 'Diminishing returns common; check overfitting'],
              ].map(([r, when, watch]) => (
                <tr key={r} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{r}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                  <td className="px-4 py-3 text-slate-400">{watch}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Workflow">
          Start at <strong className="text-white">r=16</strong>. If train loss plateaus and eval still weak,
          try r=32. If train loss drops but eval worsens, you are overfitting — fix data / epochs / LR, not only
          rank.
        </Callout>
      </LessonSection>

      <LessonSection title="Alpha recipe — α = 2 × r">
        <p className="text-slate-300">
          A widely used default is <strong className="text-white">lora_alpha = 2 * r</strong> (so the effective
          scale <code className="font-mono text-sm">α/r = 2</code>). Examples: r=16 → α=32; r=64 → α=128. You
          can deviate, but stick to this recipe until you have a reason and an eval curve.
        </p>
        <Example title="Common pairs">{`r=8   → alpha=16
r=16  → alpha=32   # very common default
r=32  → alpha=64
r=64  → alpha=128`}</Example>
      </LessonSection>

      <LessonSection title="Which layers to target for Llama / Mistral">
        <p className="text-slate-300">
          HuggingFace module names for Llama-family and Mistral are usually{' '}
          <code className="font-mono text-sm">q_proj</code>, <code className="font-mono text-sm">k_proj</code>,{' '}
          <code className="font-mono text-sm">v_proj</code>, <code className="font-mono text-sm">o_proj</code>,
          plus MLP <code className="font-mono text-sm">gate_proj</code>,{' '}
          <code className="font-mono text-sm">up_proj</code>, <code className="font-mono text-sm">down_proj</code>.
        </p>
        <ContentStep number={1} title="Minimal baseline">
          <p>
            Target <code className="font-mono text-sm">["q_proj", "v_proj"]</code> — fast iterations, often
            enough for light domain adaptation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Strong default for instruct / domain">
          <p>
            Target all attention + MLP linears (often via{' '}
            <code className="font-mono text-sm">target_modules="all-linear"</code> in recent peft, or an explicit
            list of the seven names above).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Learning rate note">
          <p>
            LoRA learning rates are often <strong className="text-white">higher</strong> than full FT — e.g.
            1e-4 to 5e-4 as a search band (depends on scheduler and batch size). Full FT might live nearer
            1e-5–5e-5. Always validate on a holdout set.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="HuggingFace peft — LoraConfig example">
        <CodeBlock title="Minimal LoRA with peft + transformers">{`from peft import LoraConfig, get_peft_model, TaskType
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "meta-llama/Llama-3.1-8B-Instruct"
model = AutoModelForCausalLM.from_pretrained(model_id, torch_dtype="auto", device_map="auto")
tokenizer = AutoTokenizer.from_pretrained(model_id)

lora_config = LoraConfig(
    r=16,
    lora_alpha=32,          # 2 * r
    lora_dropout=0.05,
    bias="none",
    task_type=TaskType.CAUSAL_LM,
    target_modules=["q_proj", "k_proj", "v_proj", "o_proj",
                    "gate_proj", "up_proj", "down_proj"],
)

model = get_peft_model(model, lora_config)
model.print_trainable_parameters()
# Expect: trainable% well under 1–2% for typical setups`}</CodeBlock>
        <Callout variant="insight">
          Pair this with HuggingFace <code className="font-mono text-sm">Trainer</code> / TRL{' '}
          <code className="font-mono text-sm">SFTTrainer</code>. After training,{' '}
          <code className="font-mono text-sm">model.save_pretrained("./my-lora")</code> saves the adapter, not
          the full base.
        </Callout>
      </LessonSection>

      <LessonSection title="Common misconfigs">
        <Flowchart
          title="Misconfig → symptom → fix"
          chart={`flowchart TD
  M1[r huge, tiny data] --> S1[Overfit memorization]
  S1 --> F1[Lower r / fewer epochs / more diverse data]
  M2[alpha absurdly high] --> S2[Unstable loss spikes]
  S2 --> F2[Use alpha ≈ 2*r; lower LR]
  M3[Wrong target names] --> S3[0 trainable params or no change]
  S3 --> F3[print_trainable_parameters; fix module names]
  M4[LR like full FT 1e-5] --> S4[Almost no learning]
  S4 --> F4[Try higher LR band for LoRA]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Forgetting to freeze / using full FT by accident</strong> — always
            print trainable parameter counts.
          </li>
          <li>
            <strong className="text-white">Training embedding + lm_head without need</strong> — inflates memory;
            enable only if your tokenizer/vocab truly changed.
          </li>
          <li>
            <strong className="text-white">Mismatched train vs serve template</strong> — chat templates must match
            inference or quality looks &quot;broken&quot; even with good LoRA.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Start with r=16 and alpha=2*r; climb rank only when eval proves you need more capacity.',
          'Llama/Mistral: q/k/v/o + gate/up/down (or all-linear) is a solid default target set.',
          'LoRA often uses a higher learning rate than full fine-tuning — verify with eval.',
          'Use peft LoraConfig, print trainable %, and watch for wrong module names and overfit.',
        ]}
      />
    </LessonArticle>
  )
}
