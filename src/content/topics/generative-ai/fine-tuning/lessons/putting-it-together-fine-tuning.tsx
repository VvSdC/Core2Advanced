import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherFineTuning() {
  return (
    <LessonArticle>
      <Definition term="Fine-tuning mastery path">
        <p>
          Closing the Fine-Tuning track: a <strong className="text-white">zero-to-ship checklist</strong>, a
          decision tree across RAG / SFT / DPO / LoRA / QLoRA / Unsloth, a recommended learning order, production
          readiness practices, and where to go next for serving (Inference Optimization).
        </p>
      </Definition>

      <LessonSection title="Mastery checklist — from zero to ship">
        <ContentStep number={1} title="Clarify the job">
          <p className="text-slate-300">
            Is the gap knowledge (docs change often), behavior (tone, format, tools), or preference (A vs B answers)?
            That choice drives RAG vs SFT vs preference tuning.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Get data right">
          <p className="text-slate-300">
            Clean examples, correct chat template, leakage-free splits, versioned dataset snapshot with a hash.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Pick parameter-efficient method">
          <p className="text-slate-300">
            Default for most teams: <span className="text-genai-400">LoRA</span> or{' '}
            <span className="text-genai-400">QLoRA</span> on an Instruct base. Full fine-tune only with clear need
            and budget.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Train with sensible hyperparameters">
          <p className="text-slate-300">
            Start from a known recipe; smoke-test short sequences; then full run. Change one knob when debugging.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Evaluate like a product">
          <p className="text-slate-300">
            Golden prompts vs base, metrics where possible, careful LLM-as-judge, human spot-check. Eval loss alone
            does not ship.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Export and serve">
          <p className="text-slate-300">
            Adapter for multi-LoRA / Hub versioning; merge (+ GGUF) when you need a single local/server artifact.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Big decision tree">
        <Flowchart
          title="RAG vs SFT vs DPO vs LoRA / QLoRA / Unsloth"
          chart={`flowchart TD
  START[Need better LLM behavior?] --> K{Knowledge changes often?}
  K -->|Yes| RAG[Prefer RAG / tools]
  K -->|No| B{Need new style / format / skills?}
  B -->|Preferences A vs B| DPO[DPO / preference tuning]
  B -->|Imitation from demos| SFT[Supervised fine-tuning]
  RAG --> MAYBE{Also need style?}
  MAYBE -->|Yes| SFT
  MAYBE -->|No| DONE[Ship retrieval]
  SFT --> HW{VRAM tight?}
  HW -->|Yes| QL[QLoRA]
  HW -->|No| LORA[LoRA]
  QL --> SPEED{Want faster / easier local SFT?}
  LORA --> SPEED
  SPEED -->|Yes| UNS[Unsloth + TRL]
  SPEED -->|No| PEFT[Transformers + PEFT + TRL]
  DPO --> LORA
  UNS --> EVAL[Eval suite + version adapters]
  PEFT --> EVAL
  EVAL --> SERVE[Serve: vLLM / llama.cpp track]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['RAG', 'Fresh / large / proprietary knowledge without retraining'],
                ['SFT', 'Format, tone, procedures, tool schemas from demos'],
                ['DPO', 'Prefer ranking of answers when pairwise prefs exist'],
                ['LoRA', 'Efficient SFT when weights fit in memory'],
                ['QLoRA', 'Same as LoRA with 4-bit base for smaller GPUs'],
                ['Unsloth', 'Faster / leaner LoRA–QLoRA iteration on HF stack'],
              ].map(([name, best]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{name}</td>
                  <td className="px-4 py-3 text-genai-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recommended learning order (recap)">
        <ol className="list-decimal space-y-2 pl-5 text-slate-300">
          <li>Why fine-tune vs prompt/RAG; dataset formats and chat templates.</li>
          <li>LoRA / QLoRA concepts and training hyperparameters.</li>
          <li>Evaluation beyond loss; common pitfalls.</li>
          <li>Unsloth introduction → first SFT run → optimization tricks.</li>
          <li>Merge / export / Hub; then Inference Optimization for serving.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Production readiness">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Version data</strong> — immutable snapshot (path + hash) tied to each
            training run.
          </li>
          <li>
            <strong className="text-white">Version adapters</strong> — Hub revision or artifact store; never
            overwrite “prod” without a new tag.
          </li>
          <li>
            <strong className="text-white">Eval suite</strong> — golden prompts + metrics + human notes stored next
            to the adapter card.
          </li>
          <li>
            <strong className="text-white">Reproduce config</strong> — base model id, LoRA rank, LR, effective
            batch, seed, Unsloth/Transformers/TRL versions.
          </li>
          <li>
            <strong className="text-white">Rollback path</strong> — keep previous adapter and base-only serve ready.
          </li>
        </ul>
        <Callout variant="insight">
          Treat fine-tunes like deploys: change data or hyperparams → new version → eval gate → promote. Skip the
          gate and you will ship silent regressions.
        </Callout>
      </LessonSection>

      <LessonSection title="Next steps — serve what you trained">
        <p className="text-slate-300">
          Training is half the job. Continue into the{' '}
          <strong className="text-white">Inference Optimization</strong> track:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">vLLM</strong> — high-throughput GPU serving, multi-LoRA, OpenAI-compatible
            APIs.
          </li>
          <li>
            <strong className="text-white">llama.cpp</strong> — GGUF, local/edge, quantization, offline assistants.
          </li>
        </ul>
        <Flowchart
          title="After this track"
          chart={`flowchart LR
  FT[Fine-tuned adapter] --> V[vLLM multi-LoRA or merged]
  FT --> M[Merge + GGUF]
  M --> L[llama.cpp serve]
  V --> P[Monitor latency + quality]
  L --> P`}
        />
      </LessonSection>

      <Callout variant="tip" title="You are ready when…">
        You can explain why you chose RAG vs SFT, train a LoRA/QLoRA (optionally with Unsloth), beat the base on a
        golden set without catastrophic regressions, and version the data + adapter for rollback.
      </Callout>

      <KeyTakeaways
        items={[
          'Ship checklist: clarify job → data → LoRA/QLoRA → train → eval → export/serve.',
          'Decision tree: RAG for knowledge, SFT for demos, DPO for prefs, Unsloth for faster LoRA/QLoRA.',
          'Production: version data, adapters, configs, and an eval gate before promote.',
          'Next: Inference Optimization (vLLM / llama.cpp) to serve what you fine-tuned.',
        ]}
      />
    </LessonArticle>
  )
}
