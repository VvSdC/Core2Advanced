import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function HelpfulnessAndCapabilityAxes() {
  return (
    <LessonArticle>
      <Definition term="Helpfulness / capability">
        <p>
          <strong className="text-white">Helpfulness</strong> (also called{' '}
          <strong className="text-white">capability</strong> in many leaderboards) asks: can the model answer
          correctly, reason well, write working code, and solve problems? It is different from{' '}
          <strong className="text-white">safety</strong> (refusing harmful requests, avoiding toxic output) and
          from <strong className="text-white">chat preference</strong> (which reply humans like more in a
          conversation). This track focuses on helpfulness and capability first.
        </p>
      </Definition>

      <LessonSection title="Three evaluation families — don't mix them up">
        <p className="text-slate-300">
          Imagine hiring someone. Capability is &quot;Can they do the job?&quot; Safety is &quot;Will they
          follow the rules and not cause harm?&quot; Preference is &quot;Do coworkers enjoy talking to them?&quot;
          All three matter — but one exam cannot measure all three equally.
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Helpfulness / capability',
              'Knowledge quizzes, coding tests, math problems — mostly objective scores (accuracy, pass@k).',
            ],
            [
              'Safety',
              'Red-team prompts, refusal rates, policy checks — “does the model stay within safe bounds?”',
            ],
            [
              'Chat preference',
              'Humans (or judges) pick which of two replies they prefer — often Elo rankings on arenas.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="beginner" title="This track's focus">
          We start with <span className="text-genai-400">helpfulness / capability</span> benchmarks. Safety and
          preference show up later so you can contrast what each number means.
        </Callout>
      </LessonSection>

      <LessonSection title="Capability axes (preview)">
        <p className="text-slate-300">
          Capability is not one blob. People break it into <strong className="text-white">axes</strong> — skill
          dimensions — so a model can be strong at code and weak at long documents (or the reverse).
        </p>
        <ContentStep number={1} title="Knowledge">
          <p className="text-slate-300">
            Facts and subject coverage across domains — classic home of{' '}
            <span className="text-genai-400">MMLU</span> (Massive Multitask Language Understanding).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reasoning">
          <p className="text-slate-300">
            Multi-step thinking, hard science questions — e.g.{' '}
            <span className="text-genai-400">GPQA</span> (Graduate-Level Google-Proof Q&amp;A).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Code">
          <p className="text-slate-300">
            Write programs that pass unit tests —{' '}
            <span className="text-genai-400">HumanEval</span>, <span className="text-genai-400">MBPP</span>{' '}
            (Mostly Basic Python Problems), later <span className="text-genai-400">SWE-bench</span>.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Math">
          <p className="text-slate-300">
            Grade-school and competition math — <span className="text-genai-400">GSM8K</span> (Grade School Math
            8K) and <span className="text-genai-400">MATH</span>.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Long-context (preview)">
          <p className="text-slate-300">
            Using very long inputs (many thousands of tokens) without losing the needle in the haystack. Covered
            lightly here; deep dives come in later evaluation topics.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Axes → example benchmarks">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Axis</th>
                <th className="px-4 py-3">Example benchmarks</th>
                <th className="px-4 py-3">What you learn</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Knowledge', 'MMLU, MMLU-Pro', 'Broad subject accuracy'],
                ['Reasoning', 'GPQA, BIG-Bench Hard', 'Hard multi-step questions'],
                ['Code', 'HumanEval, MBPP, SWE-bench', 'Programs that pass tests'],
                ['Math', 'GSM8K, MATH', 'Word problems & competition math'],
                ['Long-context', 'Needle-in-a-haystack style', 'Use long documents'],
              ].map(([axis, benches, learn]) => (
                <tr key={axis} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{axis}</td>
                  <td className="px-4 py-3 font-mono text-sm text-genai-400">{benches}</td>
                  <td className="px-4 py-3 text-slate-400">{learn}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Evaluation categories at a glance">
        <Flowchart
          title="Where helpfulness sits"
          chart={`flowchart TB
  A[LLM evaluation] --> B[Helpfulness / capability]
  A --> C[Safety]
  A --> D[Chat preference]
  B --> E[Knowledge]
  B --> F[Reasoning]
  B --> G[Code]
  B --> H[Math]
  B --> I[Long-context]`}
        />
        <Callout variant="insight" title="Practical tip">
          When someone says &quot;Model X is better,&quot; ask: better on <em>which axis</em>? A coding assistant
          win on HumanEval may still lose on MMLU or on an Elo chat arena.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Helpfulness/capability ≠ safety ≠ chat preference — different questions, different tests.',
          'Capability axes include knowledge, reasoning, code, math, and long-context.',
          'This track prioritizes helpfulness benchmarks (MMLU, HumanEval, GSM8K, and friends) first.',
          'Always map a score back to an axis so you know what skill it actually measured.',
        ]}
      />
    </LessonArticle>
  )
}
