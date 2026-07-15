import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function OrpoKtoIpoAndFriends() {
  return (
    <LessonArticle>
      <Definition term="Preference method family">
        <p>
          After DPO became popular, many related recipes appeared. They share the goal — align from human (or AI)
          feedback — but differ in <strong className="text-white">what labels look like</strong> and whether they
          fold SFT-like learning into the same run.
        </p>
        <p className="mt-2 text-slate-300">
          You do not need every acronym. Learn DPO first, then pick a variant that matches your{' '}
          <em>data shape</em>, not the trendiest paper title.
        </p>
      </Definition>

      <Callout variant="beginner" title="One recommendation up front">
        Start with <strong className="text-white">DPO after good SFT</strong> for most products. Treat ORPO, KTO,
        IPO, and SimPO as tools for special data or research needs — not as day-one required reading.
      </Callout>

      <LessonSection title="ORPO — odds ratio preference optimization">
        <p className="text-slate-300">
          <strong className="text-white">ORPO</strong> combines an SFT-style objective with a preference
          (odds-ratio) term in <em>one</em> training stage. Idea: teach “produce good answers” and “prefer chosen
          over rejected” together instead of always running SFT then a separate DPO pass.
        </p>
        <Flowchart
          title="Separate stages vs ORPO-style combined run"
          chart={`flowchart TB
  subgraph SEP[Common path]
    S1[SFT] --> D1[DPO on pairs]
  end
  subgraph ORP[ORPO idea]
    O1[Single run: SFT-like + odds-ratio preference]
  end
  SEP --> OUT[Aligned model]
  ORP --> OUT`}
        />
        <Callout variant="insight" title="When ORPO appeals">
          You want fewer pipeline stages and already have preference pairs plus the desire to keep imitation
          quality high in the same optimization. Still evaluate carefully — combined losses can trade off oddly.
        </Callout>
      </LessonSection>

      <LessonSection title="KTO — thumbs up / thumbs down without pairs">
        <p className="text-slate-300">
          <strong className="text-white">KTO</strong> (Kahneman–Tversky Optimization, as commonly referred in the
          LLM tooling world) works with <em>desirable / undesirable</em> feedback — closer to a thumbs up or down
          on a single answer — rather than requiring a chosen/rejected pair for every prompt.
        </p>
        <ContentStep number={1} title="You have binary-ish feedback">
          <p className="text-slate-300">Users like / dislike a reply, or a filter flags a completion as bad.</p>
        </ContentStep>
        <ContentStep number={2} title="You lack clean A vs B pairs">
          <p className="text-slate-300">Collecting pairs is expensive; unary labels may already exist in logs.</p>
        </ContentStep>
        <ContentStep number={3} title="You still need a reference sense of “normal”">
          <p className="text-slate-300">
            Like other preference methods, stability still depends on not crushing the base chat skills.
          </p>
        </ContentStep>
        <Flowchart
          title="Pairs vs unary feedback"
          chart={`flowchart LR
  PAIR[Prompt + chosen + rejected] --> DPO[DPO / ORPO / IPO…]
  UNI[Prompt + answer + good/bad] --> KTO[KTO-style methods]
  PAIR --> NEED[Need comparative labels]
  UNI --> NEED2[Need quality labels only]`}
        />
      </LessonSection>

      <LessonSection title="IPO and SimPO (brief)">
        <p className="text-slate-300">
          <strong className="text-white">IPO</strong> (Identity Preference Optimization) is another preference
          objective designed to be more robust to overfitting preferences in some settings — think of it as a
          sibling of DPO with a different mathematical “shape,” still trained from pairwise-like signals.
        </p>
        <p className="mt-3 text-slate-300">
          <strong className="text-white">SimPO</strong> aims for a simpler preference learning setup (often
          discussed as avoiding an explicit reference model in the usual DPO sense) while still using preference
          rankings. Treat both as “variants on the DPO theme” until you have a concrete reason to switch.
        </p>
        <Callout variant="tip" title="Avoid method shopping">
          If win-rate is flat, improve data and SFT before swapping IPO ↔ DPO ↔ SimPO weekly.
        </Callout>
      </LessonSection>

      <LessonSection title="Decision table — which method for which data">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Your data / goal</th>
                <th className="px-4 py-3">Prefer</th>
                <th className="px-4 py-3">Why (one line)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Clean chosen/rejected pairs after solid SFT',
                  'DPO',
                  'Simple, widely supported default',
                ],
                [
                  'Want SFT + preference in one stage',
                  'ORPO',
                  'Odds-ratio + imitation combined',
                ],
                [
                  'Mostly thumbs up/down, few true pairs',
                  'KTO',
                  'Unary desirable / undesirable signal',
                ],
                [
                  'Research / alternate pairwise objective',
                  'IPO / SimPO',
                  'Try after DPO baseline is measured',
                ],
                [
                  'Need online RL + reusable reward model',
                  'RLHF (PPO etc.)',
                  'Heavier stack; not day-one for most startups',
                ],
              ].map(([data, method, why]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-white">{data}</td>
                  <td className="px-4 py-3 font-semibold text-genai-400">{method}</td>
                  <td className="px-4 py-3 text-slate-400">{why}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Flowchart
          title="Pick from data shape first"
          chart={`flowchart TB
  START[Have feedback?] --> Q1{Pairwise A vs B?}
  Q1 -->|Yes| Q2{Need joint SFT+pref?}
  Q2 -->|No| DPO[DPO]
  Q2 -->|Yes| ORPO[ORPO]
  Q1 -->|Unary good/bad| KTO[KTO]
  DPO --> BASE[Record eval baseline]
  ORPO --> BASE
  KTO --> BASE
  BASE --> MAYBE{Still stuck?}
  MAYBE -->|Yes| ALT[Consider IPO/SimPO or RLHF]
  MAYBE -->|No| SHIP[Ship candidate]`}
        />
      </LessonSection>

      <LessonSection title="Practical recommendation">
        <ContentStep number={1} title="Qualify SFT">
          <p className="text-slate-300">If demos are wrong, preference methods paint over a weak foundation.</p>
        </ContentStep>
        <ContentStep number={2} title="Run DPO on consistent pairs">
          <p className="text-slate-300">Establish a win-rate and safety baseline you trust.</p>
        </ContentStep>
        <ContentStep number={3} title="Only then specialize">
          <p className="text-slate-300">
            Move to ORPO (pipeline compression), KTO (unary labels), or IPO/SimPO (research hunger) with a
            hypothesis — not curiosity alone.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ORPO folds SFT-like and preference signals into one training stage using an odds-ratio idea.',
          'KTO suits thumbs-up / thumbs-down style feedback when clean pairs are scarce.',
          'IPO and SimPO are DPO-family variants — learn them after a measured DPO baseline.',
          'Match method to data type: pairs → DPO/ORPO; unary → KTO; full RL stack → RLHF when needed.',
          'Default advice: start with DPO after good SFT; avoid shopping methods before fixing data and evals.',
        ]}
      />
    </LessonArticle>
  )
}
