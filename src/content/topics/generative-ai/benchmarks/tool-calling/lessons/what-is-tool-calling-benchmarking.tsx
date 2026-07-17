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

export function WhatIsToolCallingBenchmarking() {
  return (
    <LessonArticle>
      <Definition term="Tool calling / function calling">
        <p>
          <strong className="text-white">Tool calling</strong> (also called{' '}
          <strong className="text-white">function calling</strong>) means the model does not only chat in
          plain text — it emits a <strong className="text-white">structured call</strong> to an external tool
          your app can run, then uses the tool result to finish the answer.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the model is a receptionist who can press a button labeled{' '}
          <span className="font-mono text-sm text-genai-400">get_weather</span> or{' '}
          <span className="font-mono text-sm text-genai-400">search_docs</span> instead of guessing from memory.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Tool-calling benchmarks ask: when tools are available, does the model pick the right one, with the
        right arguments, at the right time?
      </Callout>

      <LessonSection title="A tiny fictional example">
        <Example title="User ask → structured tool call">
{`User: "What's the weather in Austin?"

Model (tool call, not a guess):
  get_weather(city="Austin")

App runs the tool → returns "72°F, sunny"
Model: "It's about 72°F and sunny in Austin."`}
        </Example>
        <p className="mt-3 text-slate-300">
          The benchmark cares whether the model produced the{' '}
          <strong className="text-white">correct call</strong> (right tool + right args), not whether it
          invented a temperature from training data.
        </p>
      </LessonSection>

      <LessonSection title="How this differs from Helpfulness and Safety">
        <ContentStep number={1} title="Helpfulness (e.g. MMLU)">
          <p className="text-slate-300">
            Measures knowledge and reasoning in text or multiple choice. It does{' '}
            <strong className="text-white">not</strong> check whether the model can call{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span> correctly.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Safety / secure generation">
          <p className="text-slate-300">
            Measures refusal of harmful asks and related risks. A model can be safe and still botch tool names
            or arguments.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tool calling (this track)">
          <p className="text-slate-300">
            Measures structured use of APIs/tools: choose, format, sequence, and sometimes execute. Different
            exam, different score.
          </p>
        </ContentStep>
        <Flowchart
          title="Three tracks, three questions"
          chart={`flowchart TB
  Q[What are you measuring?] --> H[Helpfulness<br/>Can it answer / reason?]
  Q --> S[Safety<br/>Does it refuse harm?]
  Q --> T[Tool calling<br/>Does it call tools correctly?]`}
        />
      </LessonSection>

      <LessonSection title="Learning map — Benchmarks → Tool Calling">
        <p className="text-slate-300">
          Under <strong className="text-white">Benchmarks → Tool Calling</strong> you will learn foundations,
          the top 10 most-used tool-calling benchmarks, then how to pick a small suite for your product.
        </p>
        <Flowchart
          title="Tool Calling track map"
          chart={`flowchart TB
  A[1. Foundations<br/>what / schema vs exec / call modes] --> B[2. Top 10 benchmarks<br/>BFCL ToolBench API-Bank ...]
  B --> C[3. Synthesis<br/>map + choose suite]
  C --> D[4. Put it together<br/>checklist + Agents next]`}
        />
        <ContentStep number={1} title="Foundations (you are here)">
          <p className="text-slate-300">
            What tool calling is, how schema/AST vs execution scoring works, and single vs parallel vs
            multi-turn modes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Top 10 benchmarks">
          <p className="text-slate-300">
            BFCL, ToolBench, API-Bank, Gorilla APIBench, ToolAlpaca, T-Eval, MetaTool, ToolQA,
            StableToolBench, and τ-bench.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Synthesis">
          <p className="text-slate-300">
            A master map, a decision flowchart for choosing a suite, and a checklist that links toward Agents /
            LangGraph.
          </p>
        </ContentStep>
        <Callout variant="insight" title="Jargon: structured call">
          A <strong className="text-white">structured call</strong> is a machine-readable request — usually
          tool name + arguments — that your runtime can parse and execute. Free-form “please look up weather”
          prose is not enough for most products.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Tool calling = function calling = model emits a structured call to an external tool.',
          'Helpfulness and Safety measure different things; tool benchmarks measure call quality.',
          'Tiny example: get_weather(city="Austin") instead of guessing the forecast.',
          'Track path: Foundations → Top 10 → Synthesis → Put it together.',
        ]}
      />
    </LessonArticle>
  )
}
