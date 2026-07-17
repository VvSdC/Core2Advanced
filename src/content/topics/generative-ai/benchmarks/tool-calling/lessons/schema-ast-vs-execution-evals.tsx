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
} from '../../../../../../components/content'

export function SchemaAstVsExecutionEvals() {
  return (
    <LessonArticle>
      <Definition term="Schema, AST, and execution evals">
        <p>
          Tool-calling benchmarks score models in different ways. Three common layers:{' '}
          <strong className="text-white">schema / JSON validity</strong> (is the shape parseable?),{' '}
          <strong className="text-white">AST match</strong> (does the call match the gold call as a tree?),
          and <strong className="text-white">execution success</strong> (does running the call get the right
          outcome?).
        </p>
      </Definition>

      <Callout variant="beginner" title="Plain English">
        Schema checks “is this legal JSON for the tool?” AST checks “is this the same call as the answer key?”
        Execution checks “when we run it, does the world do the right thing?”
      </Callout>

      <LessonSection title="Three grading layers">
        <ContentStep number={1} title="Schema / JSON validity">
          <p className="text-slate-300">
            The output must be parseable and match the tool’s argument types — e.g.{' '}
            <span className="font-mono text-sm text-genai-400">city</span> is a string. Broken braces or wrong
            types fail here even if the idea was right.
          </p>
        </ContentStep>
        <ContentStep number={2} title="AST match (BFCL-style idea)">
          <p className="text-slate-300">
            <strong className="text-white">AST</strong> means Abstract Syntax Tree: treat the call like a tiny
            program tree (function name + args). Compare trees to the gold call. Extra spaces or key order often
            do not matter; wrong tool name or wrong arg value does.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Execution success">
          <p className="text-slate-300">
            Run the call against a real or simulated API. Score whether the tool returns what the task needed
            (and sometimes whether the final answer is correct after using the result).
          </p>
        </ContentStep>
        <Example title="Same idea, three grades">
{`Gold: get_weather(city="Austin")

Model A: get_weather(city="Austin")  → schema OK, AST match, exec OK
Model B: get_weather(city="austin")  → may AST-fail if case matters; exec may still work
Model C: { broken json... }          → schema fail (never reaches exec)`}
        </Example>
      </LessonSection>

      <LessonSection title="BFCL AST idea in plain English">
        <p className="text-slate-300">
          On the Berkeley Function Calling Leaderboard (<span className="text-genai-400">BFCL</span>), many
          tasks grade by comparing the model’s call tree to a gold tree — without needing a live API for every
          item. Live subsets then add real execution. That split is why BFCL feels both rigorous and practical.
        </p>
        <CodeBlock title="Mental model (not a real schema dump)">{`# Think of a call as a tiny tree:
#   name: get_weather
#   args:
#     city: "Austin"
#
# Score = does the model's tree match the gold tree?`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Tradeoffs flowchart">
        <Flowchart
          title="Which scoring layer to trust?"
          chart={`flowchart TB
  A[Need fast, reproducible grading?] --> B[Schema + AST]
  A2[Need product realism?] --> C[Execution / live]
  B --> D[Pro: cheap, stable<br/>Con: may miss API quirks]
  C --> E[Pro: real success<br/>Con: flaky APIs, cost, rate limits]
  D --> F[Best practice: report both when you can]
  E --> F`}
        />
        <Callout variant="tip" title="Beginner takeaway">
          High AST accuracy means “formats the right call.” High execution success means “the call actually
          works in the environment.” Do not confuse the two headlines.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Schema = parseable + typed; AST = tree match to gold; execution = run it and check outcome.',
          'BFCL popularized AST matching for function calls in plain, comparable scores.',
          'AST is stable; execution is realistic but can be flaky or expensive.',
          'Read which layer a paper reports before comparing models.',
        ]}
      />
    </LessonArticle>
  )
}
