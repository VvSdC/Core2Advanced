import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function TypesOfFineTuningMap() {
  return (
    <LessonArticle>
      <Definition term="Fine-tuning taxonomy">
        <p>
          Fine-tuning is not one technique — it is a <strong className="text-white">family of recipes</strong> that
          adapt a pretrained model toward your data and goals. This lesson is the{' '}
          <span className="text-genai-400">master map</span>: how SFT, instruction/chat tuning, continued
          pretraining, preference methods (RLHF/DPO), and full vs PEFT fit together.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: “cooking” covers boiling, baking, and grilling. Asking “should I cook?” is less useful than
          “what am I hungry for, and which heat method fits?” Same with fine-tuning types.
        </p>
      </Definition>

      <Callout variant="beginner" title="How to use this page">
        Skim the big flowchart once, use the table as a cheat sheet, then follow the decision guide when you start
        a real project. Other lessons in this topic zoom into each branch.
      </Callout>

      <LessonSection title="Master map of fine-tuning types">
        <Flowchart
          title="All types in one view"
          chart={`flowchart TB
  BASE[Base pretrained LLM] --> AXIS1{Objective axis}
  AXIS1 --> CPT[Continued pretraining — domain next-token]
  AXIS1 --> SFT[SFT — supervised instruction / response]
  SFT --> INST[Instruction tuning]
  SFT --> CHAT[Chat / multi-turn tuning]
  SFT --> PREF[Preference alignment]
  PREF --> RLHF[RLHF — reward model + RL]
  PREF --> DPO[DPO / ORPO / KTO]
  CPT --> SFT
  BASE --> AXIS2{Parameter axis}
  AXIS2 --> FULL[Full fine-tuning]
  AXIS2 --> PEFT[PEFT — LoRA / adapters]
  FULL -.-> CPT
  FULL -.-> SFT
  FULL -.-> PREF
  PEFT -.-> CPT
  PEFT -.-> SFT
  PEFT -.-> PREF`}
        />
        <p className="mt-4 text-slate-300">
          Two orthogonal axes: <strong className="text-white">what signal</strong> you train on (CPT, SFT,
          preference), and <strong className="text-white">which weights</strong> you update (full vs PEFT). You
          pick one from each axis for every run.
        </p>
      </LessonSection>

      <LessonSection title="Summary table — what each type is for">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Data</th>
                <th className="px-4 py-3">Teaches</th>
                <th className="px-4 py-3">Typical order</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Continued pretraining (CPT)', 'Unlabeled domain docs', 'Domain fluency / knowledge', 'Optional before SFT'],
                ['SFT (general)', 'Prompt → target response', 'Task behavior & format', 'Core after base / CPT'],
                ['Instruction tuning', 'Instruction → answer pairs', 'Follow instructions', 'Form of SFT'],
                ['Chat tuning', 'Multi-turn dialogues', 'Conversational habits', 'Form of SFT'],
                ['Preference / RLHF', 'Chosen vs rejected (+ RM + RL)', 'Human taste & safety', 'After SFT'],
                ['DPO (and similar)', 'Chosen vs rejected', 'Preferences without RL loop', 'After SFT'],
                ['Full fine-tuning', 'Any of the above', 'Maximum weight updates', 'Cross-cutting choice'],
                ['PEFT (LoRA…)', 'Any of the above', 'Efficient specialty adapters', 'Default for most builds'],
              ].map(([type, data, teaches, order]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{type}</td>
                  <td className="px-4 py-3 text-white">{data}</td>
                  <td className="px-4 py-3 text-slate-400">{teaches}</td>
                  <td className="px-4 py-3 text-slate-400">{order}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Recommended pipeline shapes">
        <ContentStep number={1} title="Generic helpful assistant">
          <p className="text-slate-300">
            Base → SFT (instruction/chat) → optional DPO/RLHF → deploy. Use PEFT unless you have cluster-scale
            reasons not to.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Heavy domain specialist">
          <p className="text-slate-300">
            Base → CPT on domain corpus → SFT on domain tasks → preference if tone/safety matters → evaluate
            domain <em>and</em> general ability.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Many product flavors">
          <p className="text-slate-300">
            One strong base + many LoRA adapters (support tone, code helper, sales FAQ) instead of many full
            copies.
          </p>
        </ContentStep>
        <Flowchart
          title="Common production path"
          chart={`flowchart LR
  B[Base] --> C{Domain gap?}
  C -->|Yes| CPT[CPT]
  C -->|No| SFT
  CPT --> SFT[SFT / chat]
  SFT --> P{Need preference?}
  P -->|Yes| DPO[DPO or RLHF]
  P -->|No| EVAL
  DPO --> EVAL[Eval]
  EVAL --> PEFT[Usually PEFT weights]
  PEFT --> PROD[Serve]`}
        />
      </LessonSection>

      <LessonSection title="Which type do I need? — decision guide">
        <Flowchart
          title="Start here when confused"
          chart={`flowchart TB
  G([What is broken?]) --> A{Cannot follow instructions / wrong format?}
  A -->|Yes| SFT[You need SFT — instruction or chat data]
  A -->|No| B{Sounds generic but mangled domain jargon?}
  B -->|Yes| CPT[Consider CPT then SFT]
  B -->|No| C{Answers OK but often worse than a better alternative?}
  C -->|Yes| PREF[Preference tuning — DPO first]
  C -->|No| D{Need many cheap variants?}
  D -->|Yes| LORA[PEFT / LoRA adapters]
  D -->|No| E{Hitting capability wall with PEFT + great data?}
  E -->|Maybe| FULL[Consider full FT on a cluster]
  E -->|No| RAG[Check prompts, RAG, evals before more training]`}
        />
        <Callout variant="tip" title="Anti-pattern">
          Do not jump to RLHF because a blog mentioned it. Most beginners under-invest in clean SFT data and clear
          evaluations — that fixes more issues than an exotic preference recipe.
        </Callout>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">SFT / instruction / chat</strong> — teach skills and interaction style.
          </li>
          <li>
            <strong className="text-white">CPT</strong> — soak in domain language before those skills.
          </li>
          <li>
            <strong className="text-white">Preference (RLHF/DPO)</strong> — rank among capable answers.
          </li>
          <li>
            <strong className="text-white">Full vs PEFT</strong> — capacity and cost, not a different “goal type.”
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Fine-tuning types split into objective (CPT, SFT, preference) and parameter strategy (full vs PEFT).',
          'SFT covers instruction and chat tuning; preference methods (RLHF/DPO) come after capable SFT.',
          'CPT is for domain fluency on unlabeled text and usually precedes SFT when there is a large gap.',
          'Use the decision flowchart: missing skills → SFT; domain dialect → CPT; ranking taste → preference; many variants → PEFT.',
          'This taxonomy lesson is the map — zoom into individual type lessons for depth.',
        ]}
      />
    </LessonArticle>
  )
}
