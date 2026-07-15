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

export function CatastrophicForgettingAndRegularization() {
  return (
    <LessonArticle>
      <Definition term="Catastrophic forgetting">
        <p>
          <strong className="text-white">Catastrophic forgetting</strong> is when fine-tuning on a new task
          overwrites useful skills the model already had. It still &quot;succeeds&quot; on your training loss
          while quietly getting worse at general chat, safety habits, math, coding, or multilingual ability it
          used to handle.
        </p>
      </Definition>

      <LessonSection title="What forgetting looks like in examples">
        <div className="space-y-3">
          {[
            [
              'Support-bot only dataset',
              'After FT, the model nails refund scripts but suddenly fails open-ended reasoning and writes brittle, template-only English everywhere.',
            ],
            [
              'Internal jargon corpus',
              'It masters company acronyms but invents wrong APIs for public libraries it previously knew — domain win, general knowledge loss.',
            ],
            [
              'Too many epochs on 200 samples',
              'Near-perfect train accuracy, collapse on slightly rephrased user questions — memorization dressed up as learning.',
            ],
          ].map(([title, body]) => (
            <div key={title} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{title}</p>
              <p className="mt-1 text-sm text-slate-400">{body}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="Analogy">
          Cramming only for one exam overnight — you ace that quiz tomorrow, then blank on everything else you
          studied last month. Fine-tuning without safeguards is the model version of that cram session.
        </Callout>
      </LessonSection>

      <LessonSection title="Mitigations that actually help">
        <ContentStep number={1} title="Lower learning rate / fewer epochs">
          <p>
            Aggressive LR and long runs drive the model harder into the new distribution. Prefer early
            plateaus on eval over &quot;one more epoch because train loss still drops.&quot;
          </p>
        </ContentStep>
        <ContentStep number={2} title="Mix general data">
          <p>
            Blend task examples with some general instruction / chat data (even 10–30% can help) so the
            optimizer is regularly reminded of broader behavior.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Prefer LoRA/QLoRA over full FT when possible">
          <p>
            Freezing most of W limits how much the model can drift. Full fine-tuning can fit the new task
            better but forgets more aggressively if data is narrow.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Regularization knobs">
          <p>
            Modest LoRA dropout, weight decay (as supported by your trainer), and not oversizing rank reduce
            memorization on tiny datasets.
          </p>
        </ContentStep>
        <Example title="Healthy data mix sketch">{`70%  domain / task examples (your goal)
20%  general helpful instruction data
10%  "keep old skills" probes you care about
     (safety refusals, math, code, multilingual smoke tests)`}</Example>
      </LessonSection>

      <LessonSection title="Early stopping and eval during training">
        <p className="text-slate-300">
          Loss on the training set is a vanity metric if you ignore holdouts. Build a small{' '}
          <strong className="text-white">eval suite</strong> with: (a) your task examples held out, (b) general
          capability smoke tests, (c) refusal / format checks if relevant. Evaluate every N steps and keep the
          best checkpoint — not necessarily the last.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Signal</th>
                <th className="px-4 py-3">What it suggests</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Train ↓ eval ↓ (task)', 'Healthy learning', 'Continue carefully'],
                ['Train ↓ task eval flat; general eval ↓', 'Forgetting / overfitting', 'Stop; mix data; lower LR'],
                ['Train ↓ both evals ↓', 'Memorization', 'Fewer epochs; more diverse data; lower r'],
                ['Everything noisy', 'Eval set too small', 'Enlarge / stabilize eval first'],
              ].map(([signal, meaning, action]) => (
                <tr key={signal} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{signal}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                  <td className="px-4 py-3 text-slate-400">{action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Early stopping">
          Patience of a few eval windows without improvement → restore the best checkpoint and stop. Overnight
          runs without eval are how silent forgetting ships to production.
        </Callout>
      </LessonSection>

      <LessonSection title="Flowchart — healthy training loop">
        <Flowchart
          title="Healthy LoRA / QLoRA loop"
          chart={`flowchart TD
  A[Prepare task + general mix + holdout eval] --> B[Start LoRA/QLoRA with modest r]
  B --> C[Train N steps]
  C --> D[Eval: task + general smoke tests]
  D --> E{Task up without general crash?}
  E -->|Yes| F{Still improving?}
  F -->|Yes| C
  F -->|No plateau| G[Save best checkpoint — stop]
  E -->|General skills drop| H[Lower LR / add mix / fewer epochs]
  H --> C
  E -->|Overfit memorization| I[Reduce epochs / r / clean data]
  I --> C`}
        />
        <Callout variant="insight">
          Forgetting is not mysterious evil — it is optimization doing exactly what you asked on a narrow
          objective. Your job is to ask for the broader objective with data mix + eval discipline.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Catastrophic forgetting = new-task gains that erase old useful behaviors.',
          'Mitigate with lower LR, fewer epochs, mixed general data, and LoRA/QLoRA over full FT when possible.',
          'Eval during training on task + general smoke tests; early-stop on the best checkpoint.',
          'A healthy loop is iterate → eval both axes → adjust data/LR/rank → stop when plateaus.',
        ]}
      />
    </LessonArticle>
  )
}
