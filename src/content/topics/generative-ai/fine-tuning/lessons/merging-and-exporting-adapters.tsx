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

export function MergingAndExportingAdapters() {
  return (
    <LessonArticle>
      <Definition term="Adapter merge & export">
        <p>
          After LoRA/QLoRA training you either keep a small <strong className="text-white">adapter</strong>{' '}
          (delta weights) or <strong className="text-white">merge</strong> those deltas into the base model to
          produce a single set of weights. Then you may push to the Hub, convert to GGUF for llama.cpp, or serve
          adapters dynamically (e.g. vLLM multi-LoRA).
        </p>
      </Definition>

      <LessonSection title="Save LoRA adapter vs merge into base">
        <ContentStep number={1} title="Adapter-only save">
          <p className="text-slate-300">
            Saves megabytes of LoRA matrices + config. At inference you load base + adapter. Great for many
            specialized behaviors on one backbone.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Merge into base">
          <p className="text-slate-300">
            Bake LoRA into the full weights (<code className="font-mono text-sm">merge_and_unload</code>-style).
            Inference becomes a normal single model — simpler for some servers, required for some conversion
            pipelines.
          </p>
        </ContentStep>
        <CodeBlock title="Illustrative PEFT-style merge">{`# After training with PEFT / Unsloth
model = model.merge_and_unload()   # conceptual API
model.save_pretrained("merged_model")
tokenizer.save_pretrained("merged_model")
# Keep a copy of the adapter folder too!`}</CodeBlock>
        <Callout variant="beginner">
          Merging is irreversible for that file. Always retain the adapter checkpoint if you might retrain or
          A/B later.
        </Callout>
      </LessonSection>

      <LessonSection title="Push to the Hugging Face Hub">
        <p className="text-slate-300">
          Version artifacts publicly or privately. Adapters and merged models both push like any Transformers
          repo. Tag with base model id, training commit, and eval notes in the model card.
        </p>
        <Example title="What to document on the card">{`base_model: meta-llama/Llama-3.1-8B-Instruct
adapter_type: LoRA r=16
data: support-v3 (hash ...)
eval: golden-50 win-rate 62%
chat_template: same as base Instruct
license / data restrictions`}</Example>
        <CodeBlock title="Illustrative Hub push">{`# huggingface-cli login   # once
# adapter folder OR merged folder
from huggingface_hub import HfApi
api = HfApi()
api.upload_folder(
    folder_path="lora_adapter",
    repo_id="org/support-bot-lora",
    repo_type="model",
)`}</CodeBlock>
      </LessonSection>

      <LessonSection title="GGUF path for llama.cpp (high-level)">
        <p className="text-slate-300">
          Local/CPU-friendly serving often wants <strong className="text-white">GGUF</strong>. Typical flow:
        </p>
        <Flowchart
          title="From LoRA to llama.cpp"
          chart={`flowchart LR
  A[LoRA adapter] --> M[Merge into HF base]
  M --> C[convert_hf_to_gguf]
  C --> Q[Optional llama-quantize]
  Q --> R[llama.cpp / llama-server]`}
        />
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>Merge first for the simplest conversion path.</li>
          <li>
            Some tools advertise LoRA+GGUF workflows — still verify template and quant quality on your prompts.
          </li>
          <li>
            Deep dive lives in the <span className="text-genai-400">Inference Optimization → llama.cpp</span> track.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Serve with vLLM multi-LoRA">
        <p className="text-slate-300">
          If you have one base and many customer/domain adapters, <strong className="text-white">vLLM multi-LoRA</strong>{' '}
          loads the base once and swaps adapters per request. Avoids N full-model footprints. Enable LoRA on the
          server, register modules, request by adapter name.
        </p>
        <Callout variant="tip">
          Multi-LoRA needs unmerged adapters (or equivalent). A fully merged model is just another base — great for
          single-purpose fleets, wasteful if you need 20 specialties.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision: adapter serving vs merged weights">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Keep adapters', 'Many variants, A/B tests, vLLM multi-LoRA, small Hub footprints'],
                ['Merge weights', 'One production skill, simple HF/vLLM single-model serve'],
                ['Merge + GGUF', 'Desktop / edge / llama.cpp deployment'],
                ['Both', 'Serve adapters in cluster; ship merged+GGUF for offline builds'],
              ].map(([choice, when]) => (
                <tr key={choice} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{choice}</td>
                  <td className="px-4 py-3 text-genai-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Pick an export path"
          chart={`flowchart TD
  START[Trained LoRA] --> N{How many variants?}
  N -->|Many on one base| AD[Ship adapters + multi-LoRA]
  N -->|One skill only| MER{Where will it run?}
  MER -->|GPU server| HF[Merge → vLLM / Transformers]
  MER -->|Local / CPU| GGUF[Merge → GGUF → llama.cpp]
  AD --> HUB[Version on Hub + model card]
  HF --> HUB
  GGUF --> HUB`}
        />
      </LessonSection>

      <KeyTakeaways
        items={[
          'Adapters are small and flexible; merges are simple single files.',
          'Always keep adapter checkpoints even after merging.',
          'Hub + model cards version base, data, and eval alongside weights.',
          'GGUF usually wants a merge; vLLM multi-LoRA wants adapters.',
        ]}
      />
    </LessonArticle>
  )
}
