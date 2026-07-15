import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ComparingAlignmentMethods() {
  return (
    <LessonArticle>
      <Definition term="Comparing alignment methods">
        <p>
          Teams choose among <strong className="text-white">SFT only</strong>, classic{' '}
          <strong className="text-white">RLHF</strong>, <strong className="text-white">DPO</strong>,{' '}
          <strong className="text-white">ORPO</strong>, and <strong className="text-white">RLAIF</strong>-heavy
          pipelines using roughly four lenses: cost, complexity, data needs, and training stability.
        </p>
        <p className="mt-2 text-slate-300">
          There is no single “best.” There is a best <em>for your stage, data, and risk budget</em>.
        </p>
      </Definition>

      <Callout variant="beginner" title="Start from the problem">
        Missing skills → more SFT. Fluent but worse preferences → DPO/ORPO/RLHF. Need labels at scale → RLAIF (plus
        humans for truth). Do not skip that diagnosis.
      </Callout>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">Cost</th>
                <th className="px-4 py-3">Complexity</th>
                <th className="px-4 py-3">Data needs</th>
                <th className="px-4 py-3">Stability (beginner view)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'SFT only',
                  'Low–med',
                  'Low',
                  'Demonstrations',
                  'Predictable if data clean',
                ],
                [
                  'RLHF',
                  'High',
                  'High',
                  'Prefs + RM + on-policy samples',
                  'More knobs; reward hacking risk',
                ],
                [
                  'DPO',
                  'Med',
                  'Med-low',
                  'Chosen/rejected pairs',
                  'Usually smoother than PPO for teams',
                ],
                [
                  'ORPO',
                  'Med',
                  'Med',
                  'Pairs (+ imitation in one run)',
                  'Watch joint-loss tradeoffs',
                ],
                [
                  'RLAIF*',
                  'Label cost ↓, compute may ↑',
                  'Med',
                  'AI ( + human gold) feedback',
                  'Judge quality dominates',
                ],
              ].map(([m, cost, cx, data, stab]) => (
                <tr key={m} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{m}</td>
                  <td className="px-4 py-3">{cost}</td>
                  <td className="px-4 py-3">{cx}</td>
                  <td className="px-4 py-3 text-white">{data}</td>
                  <td className="px-4 py-3 text-slate-400">{stab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-slate-400 text-sm">
          *RLAIF is a feedback source, not a full substitute for choosing SFT/DPO/RLHF as the optimizer.
        </p>
        <Flowchart
          title="How the stacks relate"
          chart={`flowchart TB
  SFT[SFT only] --> Q{Need preference alignment?}
  Q -->|No| SHIP[Evaluate and ship]
  Q -->|Yes| PATH{Which path?}
  PATH --> DPO[DPO on pairs]
  PATH --> ORPO[ORPO combined]
  PATH --> RLHF[RM + RL]
  PATH --> RLAIF[AI feedback into DPO/RLHF]
  DPO --> EVAL[Shared eval: win-rate + safety]
  ORPO --> EVAL
  RLHF --> EVAL
  RLAIF --> EVAL`}
        />
      </LessonSection>

      <LessonSection title="Cost, complexity, data, stability — in words">
        <ContentStep number={1} title="Cost">
          <p className="text-slate-300">
            Humans dominate cost for preferences. RLAIF trades human hours for GPU/API hours and quality control.
            RLHF adds reward-model training and online sampling cost on top.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Complexity">
          <p className="text-slate-300">
            SFT &lt; DPO ≈ ORPO &lt; RLHF for most teams&apos; mental load. More stages means more ways to fail
            silently (bad RM, unstable PPO, mismatched templates).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Data needs">
          <p className="text-slate-300">
            SFT wants great demos. DPO/ORPO want consistent pairs. KTO wants unary labels. RLHF wants prefs plus
            careful on-policy generation. RLAIF wants rubrics and gold holds.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Stability">
          <p className="text-slate-300">
            Offline DPO is usually easier to debug than full RL. All preference methods can overfit styles that
            win pairwise evals but annoy users — that is an eval problem as much as a loss problem.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Practical pick guide: startups vs labs">
        <Flowchart
          title="Startup vs lab leaning"
          chart={`flowchart TB
  WHO{Team context?} -->|Startup / small product| ST[Path A]
  WHO -->|Research lab / frontier| LAB[Path B]
  ST --> S1[Strong SFT + LoRA]
  S1 --> S2[Offline DPO]
  S2 --> S3[Human spot + LLM judge eval]
  S3 --> S4[Inference guardrails]
  LAB --> L1[SFT + rich preference ops]
  L1 --> L2{Need online / multi-reward?}
  L2 -->|Often yes| L3[RLHF / online RL]
  L2 -->|Often no| L4[DPO family + RLAIF scale]
  L3 --> L5[Heavy eval + red team]
  L4 --> L5`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Context</th>
                <th className="px-4 py-3">Typical stack</th>
                <th className="px-4 py-3">Skip early</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Startup',
                  'SFT → DPO → eval → serve',
                  'Custom PPO RLHF, method tourism',
                ],
                [
                  'Scale-up product',
                  'SFT → DPO/ORPO + light RLAIF',
                  'Ignoring human gold / safety evals',
                ],
                [
                  'Lab / frontier',
                  'Full preference ops; RLHF when justified',
                  'Shipping without red-team depth',
                ],
              ].map(([ctx, stack, skip]) => (
                <tr key={ctx} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{ctx}</td>
                  <td className="px-4 py-3 text-white">{stack}</td>
                  <td className="px-4 py-3 text-slate-400">{skip}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Default pick">
          If unsure: <span className="text-genai-400">SFT quality first, then DPO, then evaluate</span>. Add
          RLAIF for label scale. Add RLHF only when you have a concrete reason the offline path fails.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Compare methods on cost, complexity, data needs, and stability — not hype alone.',
          'SFT only is fine until preference axes matter; DPO is the usual next step.',
          'RLHF costs more complexity and can be less stable for small teams; powerful when online/multi-reward is required.',
          'ORPO compresses stages; RLAIF scales labels but inherits judge bias.',
          'Startups: SFT→DPO→eval. Labs: richer preference ops and RLHF when justified.',
        ]}
      />
    </LessonArticle>
  )
}
