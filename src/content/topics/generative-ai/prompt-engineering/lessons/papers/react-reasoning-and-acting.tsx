import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2210.03629'

export function ReactReasoningAndActing() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="ReAct: Synergizing Reasoning and Acting in Language Models"
        authors="Yao et al. (Princeton / Google)"
        year="2022"
        url={PAPER_URL}
      >
        Interleaves <strong className="text-white">thinking and tool use</strong> in the prompt — the foundation
        of modern AI agents that search, calculate, and browse.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        ReAct extends chain-of-thought from "think then answer" to "think, act, observe, repeat." Read after
        CoT and Structured Output lessons — it bridges prompting and agents.
      </Callout>

      <LessonSection title="Background — reasoning alone is not enough">
        <p>
          Chain-of-thought helps models reason, but they are still limited to training data. They cannot look up
          live information, run code, or query a database. ReAct combines <strong className="text-white">reasoning
          traces</strong> with <strong className="text-white">actions</strong> (tool calls) in a single prompt loop.
        </p>
      </LessonSection>

      <LessonSection title="How ReAct works">
        <Flowchart
          title="ReAct loop"
          chart={`flowchart TB
  A([User question]) --> B[Thought: plan what to do]
  B --> C[Action: call a tool e.g. Search, Calculator]
  C --> D[Observation: tool result]
  D --> E{Enough info?}
  E -- no --> B
  E -- yes --> F[Thought: final reasoning]
  F --> G([Answer])`}
        />

        <ContentStep number={1} title="Thought → Action → Observation">
          <p>The model generates three types of lines in sequence:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Thought</strong> — internal reasoning about what to do next.</li>
            <li><strong className="text-white">Action</strong> — a tool invocation (e.g. <code className="font-mono text-sm">Search["Apple stock price"]</code>).</li>
            <li><strong className="text-white">Observation</strong> — the result returned by the tool, fed back into the prompt.</li>
          </ul>
          <p className="mt-3">The loop repeats until the model has enough information to answer.</p>
        </ContentStep>

        <ContentStep number={2} title="Why interleave instead of plan-then-act?">
          <p>
            Earlier approaches planned all actions upfront, then executed. ReAct adjusts the plan after each
            observation — like a human who searches, reads the result, and refines their next step. This reduces
            hallucinated facts and error propagation.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Outperformed chain-of-thought alone on question answering and fact verification tasks.</li>
          <li>Generated human-like, interpretable trajectories (you can read the model's reasoning and tool use).</li>
          <li>Reduced hallucination by grounding answers in tool observations.</li>
          <li>Became the template for LangChain agents, OpenAI function calling, and most AI agent frameworks.</li>
        </ul>
      </LessonSection>

      <LessonSection title="When to use ReAct-style prompting">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Use</strong> — questions needing live data, calculations, or database lookups.</li>
          <li><strong className="text-white">Use</strong> — building agents that search the web, run code, or call APIs.</li>
          <li><strong className="text-white">Skip</strong> — tasks answerable from the model's training knowledge alone.</li>
        </ul>
        <Callout variant="tip">
          Modern APIs (OpenAI tools, Claude tool use) implement ReAct under the hood. Understanding this paper
          helps you design better tool descriptions and debug agent loops.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'ReAct interleaves Thought → Action → Observation in a loop.',
          'Combines CoT reasoning with real tool use — reduces hallucination.',
          'Foundation for modern AI agents and function-calling APIs.',
          'Use when answers need live data or computation beyond the model weights.',
        ]}
      />
    </LessonArticle>
  )
}
