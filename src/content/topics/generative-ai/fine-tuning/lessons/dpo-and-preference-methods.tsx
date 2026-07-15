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

export function DpoAndPreferenceMethods() {
  return (
    <LessonArticle>
      <Definition term="DPO (Direct Preference Optimization)">
        <p>
          <strong className="text-white">DPO</strong> trains a language model to prefer{' '}
          <span className="text-genai-400">chosen</span> answers over{' '}
          <span className="text-genai-400">rejected</span> ones <em>directly</em>, without training a separate
          reward model or running a reinforcement-learning loop.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: instead of hiring a food critic (reward model) and then coaching the chef with a complicated
          points system (RL), you show the chef two plates and say “nudge toward this one, away from that one” —
          every cooking session looks like ordinary practice with a clear preference signal.
        </p>
      </Definition>

      <Callout variant="beginner" title="What you need to know">
        Same preference triples as RLHF (prompt, chosen, rejected). Different training recipe. If you can run SFT,
        you are much closer to DPO than to full RLHF.
      </Callout>

      <LessonSection title="DPO in plain English">
        <ContentStep number={1} title="Start from an SFT (or reference) model">
          <p className="text-slate-300">
            You need a model that already answers reasonably. DPO nudges that policy; it does not invent chat
            ability from a raw base in one magic step.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Show chosen vs rejected for each prompt">
          <p className="text-slate-300">
            For each prompt, increase the relative probability of the chosen completion and decrease it for the
            rejected one — while staying close to the original model so quality does not collapse.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Train with a preference loss">
          <p className="text-slate-300">
            The optimizer sees both answers and learns “raise chosen / lower rejected” under a KL-style restraint
            toward the reference. No outer RL loop, no PPO hyperparameters to babysit day one.
          </p>
        </ContentStep>
        <Flowchart
          title="DPO loop (intuition)"
          chart={`flowchart TB
  SFT[SFT / reference model] --> DATA[Preference dataset]
  DATA --> PAIR[prompt + chosen + rejected]
  PAIR --> LOSS[DPO loss: prefer chosen over rejected]
  LOSS --> NEW[Updated policy]
  NEW --> EVAL[Eval helpfulness / safety]
  EVAL -->|More data| DATA`}
        />
      </LessonSection>

      <LessonSection title="If you see a formula — what it means">
        <p className="text-slate-300">
          Papers often write something like: the loss encourages a higher{' '}
          <strong className="text-white">log-probability ratio</strong> for the chosen answer than for the rejected
          one, relative to a frozen reference model. You do not need to derive it to use DPO libraries.
        </p>
        <CodeBlock title="Intuition, not a full derivation">{`# Conceptual — libraries implement the exact loss
# Make chosen more likely than rejected vs the reference model:

prefer(chosen | prompt)  >  prefer(rejected | prompt)

# "prefer" ≈ how much more the new model likes an answer
# compared to the frozen SFT/reference model
# β controls how hard you push (and how close you stay)`}</CodeBlock>
        <Callout variant="insight" title="β and the reference">
          Think of β as “how strongly preferences overwrite the SFT habits.” Too aggressive → weird style or
          over-refusal. Too weak → preferences barely stick. Always validate on held-out prompts.
        </Callout>
      </LessonSection>

      <LessonSection title="Chosen / rejected pair example">
        <Example title="Support-tone preference pair">{`{
  "prompt": "A user is angry their package is late. Draft a reply.",
  "chosen": "I'm sorry your package is late — that's frustrating. I've checked the status; it's out for delivery today. Here's what you can do if it doesn't arrive by 8pm...",
  "rejected": "Per our SLA, delays may occur. Track at the URL. Further inquiries: ticket queue."
}`}</Example>
        <p className="mt-4 text-slate-300">
          Both are “on topic.” Chosen is empathetic and actionable — that preference is what DPO learns to amplify.
        </p>
      </LessonSection>

      <LessonSection title="ORPO, KTO, and friends (brief)">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Method</th>
                <th className="px-4 py-3">One-line idea</th>
                <th className="px-4 py-3">Beginner note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['DPO', 'Directly optimize chosen ≻ rejected vs a reference', 'Most common next step after SFT'],
                ['ORPO', 'Odds-ratio preference + SFT-like signal in one run', 'Can combine stages; try after you get DPO'],
                ['KTO', 'Uses desirable / undesirable feedback (not only pairs)', 'Useful when you lack clean pairs'],
                ['RLHF', 'Reward model + RL on the policy', 'More moving parts; research / large labs'],
              ].map(([method, idea, note]) => (
                <tr key={method} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{method}</td>
                  <td className="px-4 py-3 text-white">{idea}</td>
                  <td className="px-4 py-3 text-slate-400">{note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Learning order">
          Master SFT quality → collect good preference pairs → run DPO → only then explore ORPO/KTO variants for
          your data shape. Avoid method-shopping before your evaluations are solid.
        </Callout>
      </LessonSection>

      <LessonSection title="Preference tuning vs more SFT">
        <Flowchart
          title="What should I do next?"
          chart={`flowchart TB
  PROB[Model problem] --> Q1{Wrong format / skills missing?}
  Q1 -->|Yes| SFT[More / better SFT data]
  Q1 -->|No| Q2{Fluent but rude, unsafe, or worse than alternatives?}
  Q2 -->|Yes| PREF[Preference method e.g. DPO]
  Q2 -->|No| Q3{Domain dialect weak?}
  Q3 -->|Yes| CPT[Consider CPT then SFT]
  Q3 -->|No| PROMPT[Improve prompts / RAG first]`}
        />
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">More SFT</strong> when the model cannot perform the task or format at
            all — teach the skill with clear demonstrations.
          </li>
          <li>
            <strong className="text-white">Preference tuning</strong> when it can do the task but often picks the
            less preferred style, safety posture, or completeness.
          </li>
          <li>
            Preference data on garbage SFT usually paints over a weak foundation — fix demos first.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="insight" title="Go deeper in Reinforcement Learning">
        This lesson is the Fine-Tuning preview. Under{' '}
        <strong className="text-white">Model Alignment → Reinforcement Learning</strong> you will find multi-part
        DPO, full RLHF/PPO, preference data collection, ORPO/KTO/IPO, RLAIF, evaluation, and production pitfalls —
        still written for absolute beginners.
      </Callout>

      <KeyTakeaways
        items={[
          'DPO aligns on chosen vs rejected pairs without a separate reward model + RL loop.',
          'Intuition: raise chosen likelihood relative to rejected, while staying near the reference/SFT model.',
          'ORPO and KTO are alternatives for combined objectives or non-pairwise feedback — learn them after DPO.',
          'Use more SFT for missing skills; use preference methods for ranking among already-capable answers.',
          'Next: Reinforcement Learning track for full DPO mechanics, RLHF, and method comparisons.',
        ]}
      />
    </LessonArticle>
  )
}
