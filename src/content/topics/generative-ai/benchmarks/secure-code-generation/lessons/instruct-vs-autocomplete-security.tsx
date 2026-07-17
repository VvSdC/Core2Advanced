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

export function InstructVsAutocompleteSecurity() {
  return (
    <LessonArticle>
      <Definition term="Instruct vs autocomplete security">
        <p>
          Secure-code benchmarks come in two main shapes.{' '}
          <strong className="text-white">Instruct (NL codegen)</strong> gives a natural-language request —
          “write a function that …” — and scores the full answer.{' '}
          <strong className="text-white">Autocomplete (IDE continuation)</strong> gives a partial code prefix
          and scores how the model finishes it — like GitHub Copilot-style completion.
        </p>
        <p className="mt-2 text-slate-300">
          Suites in the <span className="text-genai-400">CyberSecEval</span> family explicitly separate these
          modes because products fail differently in chat codegen vs IDE autocomplete.
        </p>
      </Definition>

      <Callout variant="beginner" title="Analogy">
        Instruct is a homework essay: “Write a login handler.” Autocomplete is finishing someone else’s half-
        written file mid-line. Same topic, different exam format.
      </Callout>

      <LessonSection title="Instruct / NL codegen security">
        <ContentStep number={1} title="What you give the model">
          <p className="text-slate-300">
            A chat- or instruction-style prompt describing a feature that touches risky areas (auth, queries,
            file I/O) — without teaching real exploits.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you measure">
          <p className="text-slate-300">
            Whether the generated program contains insecure patterns tagged by CWE-style rules, e.g.{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When teams use it">
          <p className="text-slate-300">
            Chat coding assistants, “generate a service from a ticket,” and agentic codegen from natural
            language. Matches how many users ask models to write whole functions.
          </p>
        </ContentStep>
        <Example title="Safe placeholder — instruct style">
{`User: "Write a tiny API handler that looks up a user by name."

Eval checks (conceptually):
  Did the model use [insecure pattern: SQL string concat]?
  Or a safer parameterized query placeholder?

Score: insecure vs secure under the suite's oracle.`}
        </Example>
      </LessonSection>

      <LessonSection title="Autocomplete / IDE continuation security">
        <ContentStep number={1} title="What you give the model">
          <p className="text-slate-300">
            A code prefix that already steers toward a risky API (partial query builder, partial crypto call).
            The model only continues from the cursor.
          </p>
        </ContentStep>
        <ContentStep number={2} title="What you measure">
          <p className="text-slate-300">
            Whether the <strong className="text-white">completion</strong> finishes in an insecure way — the
            classic “Copilot suggested a vulnerable line” concern from Asleep-at-the-Keyboard-style work.
          </p>
        </ContentStep>
        <ContentStep number={3} title="When teams use it">
          <p className="text-slate-300">
            IDE copilots and inline completion APIs. CyberSecEval-style{' '}
            <strong className="text-white">insecure code completion</strong> tracks this product surface.
          </p>
        </ContentStep>
        <Example title="Safe placeholder — autocomplete style">
{`Prefix (fictional, truncated):
  // lookup user
  query = "SELECT ... WHERE name = " +

Eval asks: Does the completion keep concatenating untrusted input,
or switch to a safe placeholder pattern?

(Never paste real exploit payloads into course materials.)`}
        </Example>
      </LessonSection>

      <LessonSection title="CyberSecEval-style distinction">
        <Flowchart
          title="Same risk theme, two product shapes"
          chart={`flowchart TB
  R[Security-relevant coding task] --> I{Product shape?}
  I -->|Chat / NL instruct| N[Full program from instructions]
  I -->|IDE autocomplete| A[Continue a code prefix]
  N --> O1[Static / rule oracle on whole output]
  A --> O2[Static / rule oracle on completion]
  O1 --> S[Insecure rate / CWE breakdown]
  O2 --> S`}
        />
        <p className="mt-3 text-slate-300">
          A model can look decent on instruct tasks and still complete insecure prefixes in the IDE — or the
          reverse. Always match the benchmark shape to the product you ship.
        </p>
        <Callout variant="tip" title="Beginner rule">
          Shipping an IDE plugin? Prioritize autocomplete security suites. Shipping a “write me an app”
          chatbot? Prioritize instruct / NL suites. Best practice: run both if you offer both surfaces.
        </Callout>
      </LessonSection>

      <LessonSection title="What each shape does NOT measure alone">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Instruct-only</strong> — not how the model behaves mid-file in an
            editor.
          </li>
          <li>
            <strong className="text-white">Autocomplete-only</strong> — not multi-file backend realism (see
            BaxBench) or intentional malware generation (see RedCode).
          </li>
          <li>
            Neither shape alone proves <strong className="text-white">functional correctness</strong> — pair
            with HumanEval / CWEval-style dual scoring when you need both.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Instruct = NL “write code” prompts; autocomplete = IDE-style prefix completion.',
          'CyberSecEval-style evals treat these as different product risks.',
          'Match benchmark shape to chat codegen vs IDE copilot.',
          'Neither shape alone measures correctness + security + malicious intent together.',
        ]}
      />
    </LessonArticle>
  )
}
