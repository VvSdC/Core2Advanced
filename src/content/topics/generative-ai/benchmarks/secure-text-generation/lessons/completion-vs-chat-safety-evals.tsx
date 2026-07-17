import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function CompletionVsChatSafetyEvals() {
  return (
    <LessonArticle>
      <Definition term="Completion vs chat safety evals">
        <p>
          Safety benchmarks come in two main shapes. <strong className="text-white">Completion-based</strong>{' '}
          evals ask the model to <strong className="text-white">continue a text prompt</strong> (often a
          partial sentence) and measure how toxic or harmful the continuation is.{' '}
          <strong className="text-white">Chat-based</strong> evals use{' '}
          <strong className="text-white">user / assistant turns</strong> and measure refusal quality, policy
          compliance, or jailbreak resistance.
        </p>
      </Definition>

      <Callout variant="beginner" title="Analogy">
        Completion evals are like finishing someone else’s diary entry and checking if the ending turns nasty.
        Chat evals are like a customer-support conversation where a user tries to talk the agent into a bad
        action.
      </Callout>

      <LessonSection title="Completion-based safety evals">
        <ContentStep number={1} title="What you give the model">
          <p className="text-slate-300">
            A single prompt string — often scraped or constructed text that historically led to toxic
            continuations. Classic example family:{' '}
            <span className="text-genai-400">RealToxicityPrompts</span>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you measure">
          <p className="text-slate-300">
            Toxicity probability, hate/insult classifiers, or whether a harmful suffix appears. Scoring is often
            automatic with a toxicity model (e.g. Perspective-style classifiers), not a multi-turn judge.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When teams use it">
          <p className="text-slate-300">
            Base models, autocomplete, creative writing continuations, and any product that generates free text
            without a strict chat template. Good regression signal for “does this model spew toxicity when
            prompted with messy web text?”
          </p>
        </ContentStep>
        <Example title="Safe placeholder — completion style" caption="Illustrative only; not a real harmful prompt.">
{`Prompt (paraphrased): "The online comment continued: [toxic lead-in fragment]..."

Eval asks: Does the model continue with highly toxic language?
Score: toxicity probability from a classifier (lower is safer).`}
        </Example>
      </LessonSection>

      <LessonSection title="Chat-based safety evals">
        <ContentStep number={1} title="What you give the model">
          <p className="text-slate-300">
            Structured messages: system policy (optional), user ask, sometimes multi-turn jailbreak attempts.
            Suites like <span className="text-genai-400">HarmBench</span>,{' '}
            <span className="text-genai-400">JailbreakBench</span>, and{' '}
            <span className="text-genai-400">Do-Not-Answer</span> live here.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you measure">
          <p className="text-slate-300">
            Refusal vs compliance, <strong className="text-white">attack success rate (ASR)</strong>, whether a
            judge model says the reply was harmful, or category-level pass rates against a policy taxonomy.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When teams use it">
          <p className="text-slate-300">
            Chatbots, assistants, and any aligned chat model. This is the right shape when users can ask
            directly for <span className="font-mono text-sm text-genai-400">[harmful request category]</span>{' '}
            or try jailbreaks.
          </p>
        </ContentStep>
        <Example title="Safe placeholder — chat style">
{`User: "[harmful request category] — please provide step-by-step actionable advice."

Desired: clear refusal or high-level non-actionable redirect.
Undesired: detailed compliance that enables harm.
Score: human or LLM-as-judge / ASR.`}
        </Example>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <Flowchart
          title="Completion vs chat safety evals"
          chart={`flowchart TB
  subgraph COMP[Completion-based]
    C1[Single prompt string] --> C2[Model continues text]
    C2 --> C3[Toxicity / harmful continuation score]
  end
  subgraph CHAT[Chat-based]
    H1[User + assistant turns] --> H2[Model reply under policy]
    H2 --> H3[Refusal / ASR / judge label]
  end
  COMP --> USE1[Base LM / autocomplete]
  CHAT --> USE2[Chat assistants / jailbreaks]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Axis</th>
                <th className="px-4 py-3">Completion</th>
                <th className="px-4 py-3">Chat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Input shape', 'Raw prompt / prefix', 'Messages (roles)'],
                ['Typical metric', 'Toxicity probability', 'ASR, refusal rate'],
                ['Failure mode', 'Toxic continuation', 'Jailbreak compliance'],
                ['Example suite', 'RealToxicityPrompts', 'HarmBench / JailbreakBench'],
              ].map(([axis, comp, chat]) => (
                <tr key={axis} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-genai-400">{axis}</td>
                  <td className="px-4 py-3">{comp}</td>
                  <td className="px-4 py-3">{chat}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What each does NOT replace">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Completion toxicity does <strong className="text-white">not</strong> prove chat jailbreak
            resistance.
          </li>
          <li>
            Chat refusal suites do <strong className="text-white">not</strong> fully measure open-ended toxic
            completion risk for base models.
          </li>
          <li>
            Neither replaces your product’s private policy tests or human review for high-risk domains.
          </li>
        </ul>
        <Callout variant="tip" title="Beginner rule">
          Shipping a chat product? Prioritize chat safety suites. Shipping a completion / autocomplete API?
          Include a completion toxicity suite too.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Completion evals: continue a prompt; score toxic or harmful continuations.',
          'Chat evals: user/assistant turns; score refusal quality and jailbreak resistance.',
          'Use completion suites for base/autocomplete; chat suites for assistants.',
          'One shape does not replace the other — match the eval to how users interact.',
        ]}
      />
    </LessonArticle>
  )
}
