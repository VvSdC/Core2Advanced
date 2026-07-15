import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PuttingItTogetherReinforcementLearning() {
  return (
    <LessonArticle>
      <Definition term="Putting preference alignment together">
        <p>
          Close the Reinforcement Learning / preference alignment track with a{' '}
          <strong className="text-white">zero-to-deploy checklist</strong>, a big decision tree (RLHF vs DPO), links
          back to Fine-Tuning (SFT/LoRA) and forward to Inference Optimization (serving), and one recap pipeline
          diagram.
        </p>
      </Definition>

      <Callout variant="beginner" title="Remember the story">
        Imitate good demos (SFT) → collect consistent preferences → align (usually DPO) → evaluate on helpfulness
        and safety → serve with guardrails. Heavy RLHF is optional, not the rite of passage.
      </Callout>

      <LessonSection title="Mastery checklist — zero to deployed aligned model">
        <ContentStep number={1} title="Clarify axes">
          <p className="text-slate-300">
            What must improve: tone, refusals, honesty, format? Write it down so labels and evals match.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Ship a solid SFT base">
          <p className="text-slate-300">
            Use Fine-Tuning track skills: clean demos, chat templates, LoRA/QLoRA, honest eval of competence.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Collect preference data">
          <p className="text-slate-300">
            Chosen/rejected triples (or KTO-style unary if that is all you have). Guidelines, agreement, good vs
            bad pair sniff tests.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Choose method">
          <p className="text-slate-300">
            Default: offline DPO. ORPO if you want joint SFT+pref. RLAIF to scale labels. RLHF when online /
            multi-reward needs justify complexity.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Train with restraint">
          <p className="text-slate-300">
            Reference = SFT, sensible β, LoRA for iteration speed, version every artifact.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Evaluate like a product">
          <p className="text-slate-300">
            Win-rates, safety and over-refusal, contamination checks, human audit, canary.
          </p>
        </ContentStep>
        <ContentStep number={7} title="Deploy with defense in depth">
          <p className="text-slate-300">
            Aligned weights plus inference guardrails; serve via Inference Optimization track (vLLM, llama.cpp,
            quantization, etc.).
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Big decision tree — need RLHF or DPO?">
        <Flowchart
          title="RLHF vs DPO (and friends)"
          chart={`flowchart TD
  START[Need preference alignment?] -->|No| SFTONLY[Improve SFT / prompts / RAG]
  START -->|Yes| DATA{Have pairwise prefs?}
  DATA -->|Unary only| KTO[Consider KTO]
  DATA -->|Pairs| Q1{Need online on-policy loop or multi-reward RM reuse?}
  Q1 -->|No| DPO[Offline DPO default]
  Q1 -->|Yes| RLHF[RLHF / online RL]
  DPO --> JOINT{Want SFT+pref one stage?}
  JOINT -->|Yes| ORPO[ORPO]
  JOINT -->|No| KEEP[Keep DPO]
  DPO --> SCALE{Need label scale?}
  KEEP --> SCALE
  ORPO --> SCALE
  KTO --> SCALE
  RLHF --> SCALE
  SCALE -->|Yes| RLAIF[Add RLAIF + human gold]
  SCALE -->|No| EVAL[Eval + ship]
  RLAIF --> EVAL`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Choose</th>
                <th className="px-4 py-3">When</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['DPO', 'Default after good SFT with clean pairs'],
                ['ORPO', 'Compress SFT+preference into one run'],
                ['KTO', 'Thumbs up/down without true pairs'],
                ['RLAIF', 'Scale judges; keep human gold'],
                ['RLHF', 'Online exploration / reward-model programs'],
              ].map(([name, when]) => (
                <tr key={name} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{name}</td>
                  <td className="px-4 py-3 text-white">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Link back: Fine-Tuning and Inference Optimization">
        <p className="text-slate-300">
          Preference alignment sits <em>between</em> learning demos and serving them efficiently. Return to{' '}
          <strong className="text-white">Fine-Tuning</strong> for SFT, LoRA/QLoRA, Unsloth, dataset prep, and chat
          templates. Move to <strong className="text-white">Inference Optimization</strong> for latency, batching,
          GGUF/vLLM, and production footprints once the aligned checkpoint earns its keep.
        </p>
        <Flowchart
          title="Where this track sits"
          chart={`flowchart LR
  FT[Fine-Tuning: SFT / LoRA] --> RL[This track: prefs / DPO / RLHF]
  RL --> INF[Inference Optimization: serve]
  RL --> SAFE[Guardrails at serve]
  SAFE --> INF`}
        />
        <Callout variant="tip" title="Do not skip the neighbors">
          A great DPO adapter with the wrong template or an unoptimized 70B on a laptop will still fail users.
          Alignment quality and serving quality are both product features.
        </Callout>
      </LessonSection>

      <LessonSection title="Recap pipeline diagram">
        <Flowchart
          title="End-to-end preference alignment pipeline"
          chart={`flowchart TB
  BASE[Base / instruct model] --> SFT[SFT with LoRA]
  SFT --> PREF[Preference data collection]
  PREF --> METHOD{Method}
  METHOD --> DPO[DPO / ORPO / KTO…]
  METHOD --> RLHF[RLHF if needed]
  METHOD --> RLAIF[AI feedback path]
  DPO --> EVAL[Win-rate + safety eval]
  RLHF --> EVAL
  RLAIF --> EVAL
  EVAL --> GUARD[Inference guardrails]
  GUARD --> SERVE[Serve optimized runtime]
  EVAL -->|Fail| PREF
  EVAL -->|Fail| SFT`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Data quality and eval discipline beat exotic losses.</li>
          <li>Offline DPO is the practical workhorse; know when RLHF/RLAIF earn their keep.</li>
          <li>Safety is training + guardrails; helpfulness and harmlessness are dual goals.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Checklist: axes → SFT → prefs → method → restrained train → multi-axis eval → guardrails + serve.',
          'Default to offline DPO after good SFT; choose RLHF when online/multi-reward needs are real.',
          'ORPO/KTO/RLAIF are specialization tools matched to data and scale — not mandatory detours.',
          'Link Fine-Tuning (SFT/LoRA) behind you and Inference Optimization ahead for production.',
          'Recap: base → SFT → preferences → align → evaluate → guard → serve; iterate on data when eval fails.',
        ]}
      />
    </LessonArticle>
  )
}
