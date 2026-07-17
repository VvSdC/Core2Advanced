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

export function Llmseceval() {
  return (
    <LessonArticle>
      <Definition term="LLMSecEval">
        <p>
          <strong className="text-white">LLMSecEval</strong> evaluates secure code generation from{' '}
          <strong className="text-white">natural-language prompts</strong> aligned with{' '}
          <strong className="text-white">Top-25 CWE-style</strong> security themes — “describe the feature in
          English, generate code, check for weakness patterns.”
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a take-home coding assignment written in plain language, graded with a security checklist
          based on the most common weakness types.
        </p>
      </Definition>

      <Callout variant="beginner" title="What LLMSecEval measures">
        Whether NL-instructed code generations introduce insecure patterns associated with popular CWE
        categories (Top-25-style coverage).
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="NL prompts, not just prefixes">
          <p className="text-slate-300">
            Users describe what they want in natural language. That matches chat coding assistants more than
            pure IDE autocomplete.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Top-25 CWE-style themes">
          <p className="text-slate-300">
            Scenarios map to widely discussed weakness families — represented here as{' '}
            <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-INJECT]</span>,{' '}
            <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-AUTH]</span>, etc. — so
            coverage tracks industry-relevant insecurity types.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Security-oriented scoring">
          <p className="text-slate-300">
            Generated programs are checked for insecure patterns with automated oracles. The focus is security
            of the NL→code path.
          </p>
        </ContentStep>
        <Flowchart
          title="LLMSecEval pipeline (conceptual)"
          chart={`flowchart TB
  NL[NL prompt<br/>Top-25 CWE-style theme] --> Gen[Model generates code]
  Gen --> Or[Security oracle / checks]
  Or --> Sc[Insecure vs secure rates<br/>by CWE theme]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower insecure rate</strong> — better secure NL codegen on those
            themes.
          </li>
          <li>
            <strong className="text-white">Higher insecure rate</strong> — chat-style coding help often emits
            weak patterns for common CWEs.
          </li>
          <li>
            Prefer per-theme breakdowns: a model can be fine on one family and weak on another.
          </li>
        </ul>
        <Example title="Safe placeholder — NL task sketch">
{`Prompt (paraphrased): "Write a small handler that finds a record by user-provided name."
Theme: [fictional CWE-STYLE-INJECT]
Check: flags [insecure pattern: SQL string concat]?
Score contribution: insecure | secure`}
        </Example>
      </LessonSection>

      <LessonSection title="What LLMSecEval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Pure <strong className="text-white">IDE autocomplete</strong> continuation (Asleep / CyberSecEval
            completion).
          </li>
          <li>
            Joint <strong className="text-white">functionality + security</strong> as a first-class dual metric
            (CWEval).
          </li>
          <li>
            <strong className="text-white">Malicious tooling</strong> generation (RedCode) or general chat
            jailbreaks.
          </li>
          <li>
            Exhaustive coverage of every CWE — “Top-25-style” is important, not infinite.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          LLMSecEval is a natural fit for NL coding chatbots; pair with an autocomplete suite if you also ship
          an IDE plugin.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LLMSecEval = NL prompts for Top-25 CWE-style secure code evaluation.',
          'Measures insecure rates on instruct-style codegen for common weakness themes.',
          'Lower insecure rates are better; read per-theme breakdowns.',
          'Does not alone cover autocomplete, dual correctness, or malware intent.',
        ]}
      />
    </LessonArticle>
  )
}
