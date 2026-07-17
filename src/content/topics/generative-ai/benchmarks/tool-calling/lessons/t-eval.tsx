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

export function TEval() {
  return (
    <LessonArticle>
      <Definition term="T-Eval">
        <p>
          <strong className="text-white">T-Eval</strong> evaluates{' '}
          <strong className="text-white">tool-augmented agents step by step</strong>. Instead of only scoring
          the final answer, it checks intermediate abilities: planning, tool selection, argument formatting,
          and using tool results.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: grading each station on an assembly line — not only whether the finished package looks OK.
        </p>
      </Definition>

      <Callout variant="beginner" title="What T-Eval measures">
        Step-wise competence of a tool-using agent: did each stage of the trajectory look correct, not just
        the final sentence?
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Step-wise scoring">
          <p className="text-slate-300">
            Break the agent trajectory into steps (plan, choose tool, fill args, read result, answer). Score
            those skills separately when the protocol allows.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Tool-augmented agent behavior">
          <p className="text-slate-300">
            The model may call <span className="font-mono text-sm text-genai-400">search_docs</span>, read the
            return value, then call <span className="font-mono text-sm text-genai-400">get_weather</span> —
            each hop can be graded.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Diagnosis over vanity finals">
          <p className="text-slate-300">
            Two agents can both “kind of answer,” but only one chose tools correctly. T-Eval-style evals
            surface that difference.
          </p>
        </ContentStep>
        <Flowchart
          title="Step-wise agent evaluation"
          chart={`flowchart TB
  S1[Plan] --> S2[Select tool]
  S2 --> S3[Fill arguments]
  S3 --> S4[Consume tool result]
  S4 --> S5[Final answer]
  S1 -.-> G1[Step score]
  S2 -.-> G2[Step score]
  S3 -.-> G3[Step score]
  S4 -.-> G4[Step score]
  S5 -.-> G5[Final score]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">High</strong> — strong across steps (or on the reported skill
            dimensions).
          </li>
          <li>
            <strong className="text-white">Low on one step</strong> — e.g. great planning but bad argument
            filling; fix that stage.
          </li>
          <li>
            Final-only success can <strong className="text-white">hide</strong> lucky guesses; step scores
            reduce that illusion.
          </li>
        </ul>
        <Example title="Same final, different path">
{`Ask: "Austin weather + packing tip from docs"

Agent A: correct search_docs → correct get_weather → good answer
Agent B: skips tools, guesses weather → maybe lucky text

T-Eval-style step scores: A high, B low on tool steps.`}
        </Example>
      </LessonSection>

      <LessonSection title="What T-Eval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Single-number <strong className="text-white">AST leaderboard</strong> purity like BFCL’s main
            brand.
          </li>
          <li>
            Thousands of live third-party APIs (ToolBench scale).
          </li>
          <li>
            Industry-domain compliance scripts (τ-bench retail/airline style).
          </li>
          <li>
            Chat safety / refusal.
          </li>
        </ul>
        <Callout variant="tip" title="When to use it">
          Use T-Eval thinking when you are debugging an agent loop and “final answer accuracy” is too coarse.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'T-Eval scores tool-augmented agents step by step, not only finals.',
          'High overall or high per-step = reliable trajectories; low pinpoints weak stages.',
          'Helps diagnose plan vs select vs call vs consume-result failures.',
          'Complements BFCL finals and agentic domain suites.',
        ]}
      />
    </LessonArticle>
  )
}
