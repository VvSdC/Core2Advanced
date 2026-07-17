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

export function Toolalpaca() {
  return (
    <LessonArticle>
      <Definition term="ToolAlpaca">
        <p>
          <strong className="text-white">ToolAlpaca</strong> is a{' '}
          <strong className="text-white">lightweight</strong> benchmark / dataset line for tool-use{' '}
          <strong className="text-white">imitation and generalization</strong>: can a model learn from
          compact tool-use demonstrations and still handle new tools or asks?
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a short practice workbook with <span className="font-mono text-sm text-genai-400">get_weather</span>{' '}
          and <span className="font-mono text-sm text-genai-400">search_docs</span> — then a quiz on a tool
          you barely saw.
        </p>
      </Definition>

      <Callout variant="beginner" title="What ToolAlpaca measures">
        How well models imitate tool-use patterns and generalize to unseen tools or instructions without
        needing the heaviest large-scale API harnesses.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Imitation of tool use">
          <p className="text-slate-300">
            After seeing examples of structured calls, does the model copy the right format and habits
            (name + args)?
          </p>
        </ContentStep>
        <ContentStep number={2} title="Generalization">
          <p className="text-slate-300">
            New tool descriptions or slightly new user asks — not only memorized demos. Generalization is the
            headline skill.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lightweight setup">
          <p className="text-slate-300">
            Compared with ToolBench-scale catalogs, ToolAlpaca is easier to approach for smaller experiments
            and compact training/eval loops.
          </p>
        </ContentStep>
        <Flowchart
          title="Imitate then generalize"
          chart={`flowchart TB
  D[Compact demos<br/>get_weather / search_docs] --> T[Train or few-shot]
  T --> N[New tool or new ask]
  N --> C[Model emits call]
  C --> S[Score imitation / generalization]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — good transfer of tool-use patterns to held-out
            tools/tasks.
          </li>
          <li>
            <strong className="text-white">Low</strong> — overfitting to demos or breaking when the tool list
            changes.
          </li>
          <li>
            Useful as a <strong className="text-white">smoke test</strong> before expensive large-scale API
            evals.
          </li>
        </ul>
        <Example title="Generalization sketch">
{`Seen in demos: get_weather(city)
Held-out tool: get_time(timezone)

High generalization: correct get_time(...) format
Low: still emits get_weather or free-form prose`}
        </Example>
      </LessonSection>

      <LessonSection title="What ToolAlpaca does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Full <strong className="text-white">live API stability</strong> at ToolBench scale.
          </li>
          <li>
            Deep <strong className="text-white">multi-turn policy</strong> agents (τ-bench).
          </li>
          <li>
            Fine-grained BFCL AST leaderboard positioning alone.
          </li>
          <li>
            Safety of tool selection.
          </li>
        </ul>
        <Callout variant="insight" title="When to use it">
          Reach for ToolAlpaca when you want a compact signal on “did our tool-use fine-tune actually
          generalize?”
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ToolAlpaca emphasizes lightweight imitation and generalization of tool use.',
          'High = transfers patterns to new tools; low = memorizes demos.',
          'Good smoke test before heavy API-scale suites.',
          'Does not replace BFCL, ToolBench, or agentic domain evals.',
        ]}
      />
    </LessonArticle>
  )
}
