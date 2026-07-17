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

export function PuttingItTogetherToolCalling() {
  return (
    <LessonArticle>
      <Definition term="Putting it together — tool calling">
        <p>
          You now have foundations, the top 10 tool-calling benchmarks, and a way to choose a suite. Mastery
          is <strong className="text-white">matching evals to product shape</strong>, locking protocols, and
          reading AST vs execution vs agent success without mixing them up.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a checklist, a short mastery recap, and clear next steps toward Agents / LangGraph.
        </p>
      </Definition>

      <Callout variant="beginner" title="The five-step habit">
        Map tool risks → pick suites → lock tool lists/protocol → read BFCL with agent + API-scale → always
        keep a private tool pack.
      </Callout>

      <LessonSection title="Checklist">
        <ContentStep number={1} title="Map product tool risks">
          <p className="text-slate-300">
            Wrong args? Over-calling? Doc hallucination? Many APIs? Multi-turn support policies? Write the
            list before you pick datasets.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pick a minimal suite">
          <p className="text-slate-300">
            Default: BFCL + τ-bench + StableToolBench/ToolBench. Add MetaTool, ToolQA, Gorilla, API-Bank,
            T-Eval, ToolAlpaca as needed.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Lock the setup">
          <p className="text-slate-300">
            Same tool definitions, system prompt, temperature, and (for live/sim) API harness version for every
            model you compare.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Interpret layers separately">
          <p className="text-slate-300">
            High AST with low τ-bench means “formats calls” ≠ “finishes domain tasks.” Do not celebrate the
            wrong green number.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Pair with Helpfulness and Safety">
          <p className="text-slate-300">
            Run helpfulness and safety suites on the <strong className="text-white">same model build</strong>.
            A great tool-caller can still be wrong on facts or unsafe in chat.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Decision reminder">
        <Flowchart
          title="Ship-ready tool-eval loop"
          chart={`flowchart TB
  A[BFCL] --> C[Candidate model]
  B[τ-bench] --> C
  S[StableToolBench / ToolBench] --> C
  C --> D{Calls OK and tasks OK?}
  D -->|No| E[Fix prompts / tools / agent graph]
  E --> C
  D -->|Yes| F[Private tool pack]
  F --> G{Pass?}
  G -->|Yes| H[Ship with monitoring]
  G -->|No| E`}
        />
        <Example title="One-page scorecard idea">
{`Model build: ...
Tool calling:
  BFCL AST / live / multi-turn: ...
  τ-bench success: ...
  StableToolBench: ...
  (+ MetaTool / ToolQA / Gorilla if in scope)
Private tools: pass/fail
Also: Helpfulness + Safety on same build
Verdict: ship / hold`}
        </Example>
      </LessonSection>

      <LessonSection title="Mastery recap — one line each">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Tool calling</strong> — structured calls to tools like{' '}
            <span className="font-mono text-sm text-genai-400">get_weather</span> /{' '}
            <span className="font-mono text-sm text-genai-400">search_docs</span>.
          </li>
          <li>
            <strong className="text-white">Schema / AST vs execution</strong> — tree match vs run-it success.
          </li>
          <li>
            <strong className="text-white">Modes</strong> — single, parallel, multi-turn, abstain.
          </li>
          <li>
            <strong className="text-white">BFCL</strong> — de facto function-calling standard.
          </li>
          <li>
            <strong className="text-white">ToolBench / StableToolBench</strong> — API-scale (stable preferred
            for regressions).
          </li>
          <li>
            <strong className="text-white">API-Bank / T-Eval / MetaTool</strong> — stages, steps, decisioning.
          </li>
          <li>
            <strong className="text-white">Gorilla / ToolAlpaca / ToolQA</strong> — docs, generalization, QA
            with tools.
          </li>
          <li>
            <strong className="text-white">τ-bench</strong> — realistic domain agents.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Next steps — Agents / LangGraph">
        <ContentStep number={1} title="Conceptually link to Agents">
          <p className="text-slate-300">
            Benchmarks tell you if the model can call tools. <strong className="text-white">Agent</strong>{' '}
            tracks teach loops: plan → act (tool) → observe → repeat — the runtime pattern products use.
          </p>
        </ContentStep>
        <ContentStep number={2} title="LangGraph-style orchestration">
          <p className="text-slate-300">
            Frameworks like <strong className="text-white">LangGraph</strong> (and similar graph/agent runners)
            wire tools into stateful multi-step flows. Eval scores should inform graph design: retries, tool
            routers, human handoff.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Private tool pack forever">
          <p className="text-slate-300">
            Encode your real tools (fictionalized in course materials) and re-run on every release. Public
            benches lag your schema changes.
          </p>
        </ContentStep>
        <Callout variant="tip" title="Shipping rule of thumb">
          Public tool benchmarks inform; private tool tests and agent trajectory reviews decide. Prefer boring,
          repeated measurements over one leaderboard screenshot.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Workflow: map risks → pick suites → lock protocol → read layers apart → private pack.',
          'Starter: BFCL + τ-bench + StableToolBench/ToolBench; pair with Helpfulness and Safety.',
          'Mastery is choosing and interpreting axes — not memorizing every paper title.',
          'Next: Agents / LangGraph-style orchestration and release-gated private tool evals.',
        ]}
      />
    </LessonArticle>
  )
}
