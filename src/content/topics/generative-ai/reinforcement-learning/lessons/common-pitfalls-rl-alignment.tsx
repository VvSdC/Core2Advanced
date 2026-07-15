import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function CommonPitfallsRlAlignment() {
  return (
    <LessonArticle>
      <Definition term="Common preference-alignment pitfalls">
        <p>
          Most failed DPO/RLHF projects are not “math mistakes.” They are{' '}
          <strong className="text-white">weak SFT</strong>, <strong className="text-white">noisy preferences</strong>,{' '}
          <strong className="text-white">over-pushing β / reward</strong>, or using preference training as the wrong
          tool (e.g. to memorize facts). This lesson is a debugging field guide.
        </p>
      </Definition>

      <Callout variant="beginner" title="Fix foundations first">
        Preference tuning ranks among things the model can already say. If it cannot perform the task, go back to
        SFT (or RAG) before collecting more pairs.
      </Callout>

      <LessonSection title="Pitfall: weak SFT then DPO on noise">
        <p className="text-slate-300">
          Running DPO on contradictory or low-quality pairs after a half-broken SFT yields a model that is
          confidently wrong in a preferred tone. Annotators disagree → the loss still squeezes a winner → you learn
          average confusion.
        </p>
        <Example title="Smell test">{`Symptom: after DPO, style is nicer but task success plummeted
Likely: SFT never taught the skill; prefs only ranked vibe
Fix: rebuild demos; check preference agreement; then retry DPO`}</Example>
        <Flowchart
          title="Foundation check"
          chart={`flowchart TB
  BAD[DPO looks worse] --> Q1{SFT can do task?}
  Q1 -->|No| SFT[Improve SFT / data]
  Q1 -->|Yes| Q2{Prefs consistent?}
  Q2 -->|No| CLEAN[Clean guidelines + relabel]
  Q2 -->|Yes| NEXT[Check beta / eval contamination]`}
        />
      </LessonSection>

      <LessonSection title="Pitfall: too-large β / over-optimizing preferred style">
        <p className="text-slate-300">
          Aggressive preference pressure can snap the model into a caricature of whatever wins pairwise judges:
          endless apologies, extreme verbosity, formulaic “as an AI…” hedging, or hair-trigger refusals.
        </p>
        <ContentStep number={1} title="Symptoms">
          <p className="text-slate-300">
            Huge style shift, length hacking, repetition, win-rate up on a judge that likes essays, users say
            “annoying.”
          </p>
        </ContentStep>
        <ContentStep number={2} title="Fixes">
          <p className="text-slate-300">
            Lower β / preference strength, shorten training, mix in more diverse pairs, add over-refusal and
            brevity axes to eval.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Judge hacking">
          If your LLM judge scores “longer = better,” offline DPO will discover encyclopedic waffle. Fix the judge
          and the data, not only β.
        </Callout>
      </LessonSection>

      <LessonSection title="Pitfall: preference training to memorize facts">
        <p className="text-slate-300">
          Preference methods are for <em>ranking behaviors</em>. Teaching a catalog of product SKUs, weekly prices,
          or legal statutes belongs in <strong className="text-white">RAG</strong>, tools, or carefully designed
          SFT — not “chosen answer that happened to include the fact.” Facts in prefs get stale, and rejected
          answers may still contain partial truths you accidentally suppress.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Need</th>
                <th className="px-4 py-3">Right tool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Tone, safety posture, ranking A vs B', 'Preference (DPO / RLHF / …)'],
                ['Format / skill imitation', 'SFT'],
                ['Changing proprietary knowledge', 'RAG / tools'],
                ['Latency / cost at serve time', 'Inference optimization'],
              ].map(([need, tool]) => (
                <tr key={need} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-white">{need}</td>
                  <td className="px-4 py-3 font-semibold text-genai-400">{tool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Other frequent traps">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Template mismatch</strong> — train with one chat format, serve another.
          </li>
          <li>
            <strong className="text-white">Eval contamination</strong> — preference set overlaps golden prompts.
          </li>
          <li>
            <strong className="text-white">Skipping safety eval</strong> — win-rate up, refusals destroyed.
          </li>
          <li>
            <strong className="text-white">Method tourism</strong> — swapping IPO/ORPO/DPO weekly without a
            baseline.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Debugging flowchart">
        <Flowchart
          title="Preference training not behaving — debug tree"
          chart={`flowchart TB
  START[Problem after preference run] --> A{Task competence down?}
  A -->|Yes| SFT[Repair SFT / demos]
  A -->|No| B{Style caricature / length hack?}
  B -->|Yes| BETA[Reduce β / shorter train / fix judge]
  B -->|No| C{Safety worse or over-refuse?}
  C -->|Yes| SAFE[Rebalance safety pairs + eval axes]
  C -->|No| D{Win-rate flat?}
  D -->|Yes| DATA[Data quality / coverage / agreement]
  D -->|No| E{Facts wrong / stale?}
  E -->|Yes| RAG[Use RAG/tools — wrong tool was prefs]
  E -->|No| F[Check templates, contamination, serve path]
  SFT --> RETRY[Retry preference]
  BETA --> RETRY
  SAFE --> RETRY
  DATA --> RETRY
  RAG --> RETRY
  F --> RETRY`}
        />
        <Callout variant="tip" title="Change one variable">
          When debugging, alter data <em>or</em> β <em>or</em> train length <em>or</em> judge — not all at once —
          or you will not know which fix worked.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Weak SFT + noisy prefs produce stylish failures — fix foundations and agreement first.',
          'Too-large β / over-optimization creates caricature styles and length hacking; also audit your judge.',
          'Do not use preference training to memorize facts — use RAG, tools, or SFT for knowledge.',
          'Watch templates, contamination, safety vs over-refusal, and method tourism.',
          'Debug with a tree: competence → style → safety → data → wrong tool → plumbing.',
        ]}
      />
    </LessonArticle>
  )
}
