import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function FullVsParameterEfficient() {
  return (
    <LessonArticle>
      <Definition term="Full fine-tuning vs PEFT">
        <p>
          <strong className="text-white">Full fine-tuning</strong> updates <em>all</em> (or nearly all) model
          weights during training. <strong className="text-white">PEFT</strong> (Parameter-Efficient Fine-Tuning)
          freezes the base model and trains only a small set of extra parameters — adapters such as{' '}
          <span className="text-genai-400">LoRA</span> — that steer behavior.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: full fine-tuning rebuilds the entire engine for a new fuel. PEFT bolts on a tunable
          carburetor — most of the car stays stock, the new part is small, swapable, and cheap to store.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why this lesson exists">
        Choosing full vs PEFT often decides whether you can train on a hobby GPU, how many specialized models you
        can keep, and how badly you risk wiping general skills.
      </Callout>

      <LessonSection title="Full fine-tuning — update everything">
        <ContentStep number={1} title="What happens">
          <p className="text-slate-300">
            Gradients flow through the whole network. The checkpoint you save is a complete new copy of the model
            (or a full delta of comparable size).
          </p>
        </ContentStep>
        <ContentStep number={2} title="VRAM and storage reality">
          <p className="text-slate-300">
            Training needs weights, gradients, and optimizer states — often several times the model size in GPU
            memory. Storing five full 7B or 70B variants means five near-identical giant files.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Forgetting risk">
          <p className="text-slate-300">
            Large updates can overwrite general knowledge (catastrophic forgetting), especially with narrow datasets
            and many epochs. Powerful when data is broad and compute is abundant; risky as a default hobby setup.
          </p>
        </ContentStep>
        <Flowchart
          title="Full fine-tune cost shape"
          chart={`flowchart LR
  BASE[Base weights] --> TRAIN[Update all parameters]
  TRAIN --> VRAM[High VRAM: weights + grads + optimizer]
  TRAIN --> DISK[Full-size checkpoint per variant]
  TRAIN --> RISK[Higher forgetting if data is narrow]`}
        />
      </LessonSection>

      <LessonSection title="PEFT — freeze base, train adapters">
        <p className="text-slate-300">
          With <strong className="text-white">LoRA</strong> and similar methods, you insert small trainable matrices
          into attention (and sometimes MLP) layers. During training, only those matrices — and maybe a few extras —
          receive gradients. At inference you can merge adapters into the base or load them on the fly.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Freeze</strong> billions of base parameters.
          </li>
          <li>
            <strong className="text-white">Train</strong> millions (or fewer) of adapter parameters.
          </li>
          <li>
            <strong className="text-white">Store</strong> each specialty as a small file sitting on one shared base.
          </li>
        </ul>
        <Flowchart
          title="PEFT mental model"
          chart={`flowchart TB
  BASE[Frozen base LLM] --> AD[Small trainable adapters]
  DATA[Your SFT / preference data] --> AD
  AD --> OUT[Adapted behavior]
  OUT --> SAVE[Save adapter weights only]
  SAVE --> MULTI[Many adapters · one base]`}
        />
        <Callout variant="tip" title="Serving note">
          Production stacks (e.g. vLLM multi-LoRA) often keep one base and swap adapters per request — impossible
          when every specialty is a full duplicate of all weights.
        </Callout>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Dimension</th>
                <th className="px-4 py-3">Full fine-tuning</th>
                <th className="px-4 py-3">PEFT (e.g. LoRA)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Trainable params', 'All / nearly all', 'Tiny fraction'],
                ['GPU VRAM', 'Very high', 'Much lower'],
                ['Checkpoint size', '~Full model size each time', 'Adapter MBs–GBs'],
                ['Multi-task models', 'Expensive copies', 'Many adapters · shared base'],
                ['Forgetting', 'Higher risk if aggressive', 'Often gentler (base frozen)'],
                ['Peak capability', 'Can win with huge data/compute', 'Excellent for most product SFT'],
                ['Hobby laptop', 'Often impossible for 7B+ full FT', 'Common sweet spot'],
                ['Research cluster', 'Feasible; still costly', 'Still preferred for iteration speed'],
              ].map(([dim, full, peft]) => (
                <tr key={dim} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{dim}</td>
                  <td className="px-4 py-3 text-slate-400">{full}</td>
                  <td className="px-4 py-3 text-genai-400">{peft}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Decision guide — hobby laptop vs research cluster">
        <Flowchart
          title="Should I full fine-tune or use PEFT?"
          chart={`flowchart TB
  START([Starting a fine-tune]) --> HW{Hardware?}
  HW -->|Hobby laptop / single consumer GPU| PEFT1[Start with PEFT / LoRA]
  HW -->|Multi-GPU research cluster| NEED{Need absolute max capacity?}
  NEED -->|No — iterate fast| PEFT2[Still prefer PEFT first]
  NEED -->|Yes — large curated corpus| FULL[Consider full FT]
  PEFT1 --> Q{Quality enough?}
  PEFT2 --> Q
  Q -->|Yes| SHIP[Ship / merge / evaluate]
  Q -->|No| DATA[Improve data · rank · LR]
  DATA --> Q
  FULL --> REG[Strong regularization · mixed data · careful eval]
  REG --> SHIP`}
        />
        <ContentStep number={1} title="Default for learners">
          <p className="text-slate-300">
            Use PEFT. Spend energy on dataset quality, evals, and stopping criteria — not on fighting OOM errors.
          </p>
        </ContentStep>
        <ContentStep number={2} title="When full FT is justified">
          <p className="text-slate-300">
            Massive, diverse domain corpora; CPT-scale runs; lab budgets; ablation research comparing capacity
            ceilings. Even then, many labs still use LoRA for most product iterations.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Hybrid thinking">
          <p className="text-slate-300">
            Quantized base + LoRA (QLoRA-style setups) further stretch hobby hardware. PEFT choice is orthogonal to
            SFT vs DPO — you can PEFT either objective.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Cost of being wrong">
          Starting with PEFT and scaling up is cheap. Starting with full FT on a weak dataset burns GPU time and
          may still underperform a clean LoRA run.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Full fine-tuning updates all weights — high VRAM, large checkpoints, higher forgetting risk.',
          'PEFT freezes the base and trains small adapters (e.g. LoRA) for efficient specialization.',
          'Hobby hardware almost always starts with PEFT; clusters still benefit from adapters for iteration.',
          'Compare along VRAM, storage, multi-adapter serving, forgetting, and peak capacity.',
          'Improve data before “graduating” to full fine-tuning.',
        ]}
      />
    </LessonArticle>
  )
}
