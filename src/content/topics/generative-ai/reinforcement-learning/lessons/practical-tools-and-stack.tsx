import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PracticalToolsAndStack() {
  return (
    <LessonArticle>
      <Definition term="Practical alignment stack">
        <p>
          Most beginner-friendly LLM preference work sits on the Hugging Face ecosystem:{' '}
          <strong className="text-white">Transformers</strong> for models,{' '}
          <strong className="text-white">PEFT / LoRA</strong> for cheap adapters, and{' '}
          <strong className="text-white">TRL</strong> trainers for SFT, DPO, and RL-style loops. Optional
          accelerators (e.g. Unsloth) speed up the same conceptual pipeline.
        </p>
        <p className="mt-2 text-slate-300">
          Focus on roles and flow — exact class names and arguments drift across library versions.
        </p>
      </Definition>

      <Callout variant="beginner" title="Learn the cast of characters">
        SFTTrainer teaches demonstrations. DPOTrainer (or equivalent) teaches preferences. PPO-style trainers
        support classic RLHF when you truly need them. LoRA keeps GPU memory from owning your budget.
      </Callout>

      <LessonSection title="Hugging Face TRL at a glance">
        <ContentStep number={1} title="SFTTrainer — imitate">
          <p className="text-slate-300">
            Supervised fine-tuning on instruction/chat demos. Build a solid reference policy before preference
            stages.
          </p>
        </ContentStep>
        <ContentStep number={2} title="DPOTrainer — prefer">
          <p className="text-slate-300">
            Offline preference optimization on prompt / chosen / rejected. Common next step after SFT for product
            teams.
          </p>
        </ContentStep>
        <ContentStep number={3} title="PPO / RL concepts — reinforce">
          <p className="text-slate-300">
            Classic RLHF path: sample from the policy, score with a reward model (or reward function), update with
            an RL algorithm while staying near a reference. More moving parts than DPO.
          </p>
        </ContentStep>
        <Flowchart
          title="TRL-shaped tooling map"
          chart={`flowchart TB
  DATA_SFT[Demo dataset] --> SFT[SFTTrainer]
  SFT --> REF[SFT / reference checkpoint]
  DATA_PREF[Preference pairs] --> DPO[DPOTrainer]
  REF --> DPO
  DPO --> OUT[Aligned adapter / model]
  REF --> PPO[PPO-style RLHF path]
  RM[Reward model] --> PPO
  PPO --> OUT2[Aligned policy]
  OUT --> EVAL[Eval + Hub versioning]
  OUT2 --> EVAL`}
        />
      </LessonSection>

      <LessonSection title="PEFT / LoRA for alignment stages">
        <p className="text-slate-300">
          Preference training usually updates the same idea as SFT: freeze most base weights, train small{' '}
          <strong className="text-white">LoRA</strong> adapters. That means you can keep an SFT adapter, train a
          preference adapter on top (or continue from SFT adapters), and version adapters on the Hub without
          full-finetune cost.
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Memory</strong> — QLoRA-style 4-bit bases make preference runs viable on
            smaller GPUs.
          </li>
          <li>
            <strong className="text-white">Iteration</strong> — swap adapters for A/B product experiments.
          </li>
          <li>
            <strong className="text-white">Merge later</strong> — export a single artifact for serving when needed.
          </li>
        </ul>
        <Callout variant="tip" title="Match the chat template">
          SFT, DPO, and serving must share the same role formatting. Template mismatches look like “preference
          training failed” when the model never saw the right structure.
        </Callout>
      </LessonSection>

      <LessonSection title="Open-source recipe overview (conceptual)">
        <CodeBlock title="Illustrative pipeline — not a pinned version guide">{`# 1) SFT on demonstrations (conceptual)
# SFTTrainer(model=..., train_dataset=demos, peft_config=lora, ...)

# 2) Freeze / copy SFT as reference
# ref_model = load_frozen(sft_checkpoint)

# 3) DPO on preference triples
# DPOTrainer(
#   model=policy_with_lora,
#   ref_model=ref_model,
#   train_dataset=prefs,   # prompt, chosen, rejected
#   beta=...,
# )

# 4) Evaluate win-rate + safety, then push adapter revision
# model.push_to_hub("org/assistant-dpo-v3")`}</CodeBlock>
        <Flowchart
          title="Recipe stages"
          chart={`flowchart LR
  A[Prepare datasets] --> B[SFT + LoRA]
  B --> C[Preference DPO]
  C --> D[Eval suite]
  D --> E[Export / merge / serve]
  D -->|Fail| A`}
        />
        <p className="mt-4 text-slate-300">
          Community cookbooks (TRL docs, Unsloth examples, Hub spaces) implement this shape with current APIs.
          Copy a maintained recipe, then change data — do not invent a stack from a random outdated gist.
        </p>
      </LessonSection>

      <LessonSection title="Unsloth, TRL, and preference training">
        <p className="text-slate-300">
          <strong className="text-white">Unsloth</strong> optimizes memory and speed for LoRA/QLoRA training on
          common Hugging Face workflows. For preference work, treat it as an accelerator around the same
          conceptual stages (SFT then DPO-style preference), not as a different alignment theory.
        </p>
        <ContentStep number={1} title="Use Unsloth when iteration speed matters">
          <p className="text-slate-300">Local experimentation and quick adapter loops benefit most.</p>
        </ContentStep>
        <ContentStep number={2} title="Keep TRL concepts in your head">
          <p className="text-slate-300">Regardless of speedups, you still need reference, pairs, β caution, and eval.</p>
        </ContentStep>
        <ContentStep number={3} title="Validate the served artifact">
          <p className="text-slate-300">
            Fast train ≠ correct chat template or merge. Test the exact weights you will deploy.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Stack slogan">
          Transformers + PEFT + TRL (+ optional Unsloth) covers most beginner-to-product preference alignment
          needs. Graduate to custom RLHF infra when online multi-reward research demands it.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'TRL provides SFTTrainer, DPOTrainer, and PPO-style paths for imitation, preferences, and classic RLHF.',
          'PEFT/LoRA (and QLoRA) make alignment stages memory-friendly and versionable as adapters.',
          'Recipes are conceptual: demos → SFT → preference → eval → export; APIs change — copy maintained examples.',
          'Unsloth accelerates LoRA/QLoRA training; it does not replace preference data quality or evaluations.',
          'Always align chat templates across SFT, DPO, and serving.',
        ]}
      />
    </LessonArticle>
  )
}
