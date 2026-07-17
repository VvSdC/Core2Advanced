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

export function Securityeval() {
  return (
    <LessonArticle>
      <Definition term="SecurityEval">
        <p>
          <strong className="text-white">SecurityEval</strong> is a curated benchmark focused on{' '}
          <strong className="text-white">CWE-oriented code generation and completion</strong>. Each task is
          tied to a weakness category so you can see which insecurity types a model tends to emit.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a spelling test organized by error type — not just “wrong,” but “usually doubles
          consonants.”
        </p>
      </Definition>

      <Callout variant="beginner" title="What SecurityEval measures">
        How often model-generated (or completed) code triggers CWE-linked insecure patterns under a fixed set
        of security-relevant coding prompts.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Curated CWE scenarios">
          <p className="text-slate-300">
            Tasks are designed around weakness families such as{' '}
            <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-INJECT]</span> or{' '}
            <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-PATH]</span> — educational
            labels only in this course.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Generation and completion">
          <p className="text-slate-300">
            Depending on the harness, the model may write from a description or finish a stub. The shared idea:
            security-relevant coding under automatic checking.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Static / rule oracles">
          <p className="text-slate-300">
            Outputs are typically graded by static analysis or pattern rules that flag insecure snippets — not
            by shipping real malware.
          </p>
        </ContentStep>
        <Flowchart
          title="SecurityEval pipeline (conceptual)"
          chart={`flowchart TB
  T[CWE-curated tasks] --> M[Model generates / completes]
  M --> O[Static / pattern oracle]
  O --> S[% insecure by CWE family]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower % insecure</strong> — fewer flagged weakness patterns across
            the curated set (better security propensity).
          </li>
          <li>
            <strong className="text-white">Higher % insecure</strong> — model often proposes weak code for those
            CWEs; dig into which families dominate.
          </li>
          <li>
            Always compare under the <strong className="text-white">same oracle version</strong> and prompt
            set.
          </li>
        </ul>
        <Example title="Safe placeholder — scorecard line">
{`CWE family: [fictional CWE-STYLE-INJECT]
Prompt style: generation
Oracle: static rules
Insecure rate: 22% (lower is better)`}
        </Example>
      </LessonSection>

      <LessonSection title="What SecurityEval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Whether code is <strong className="text-white">functionally correct</strong> on unit tests (pair
            with HumanEval or CWEval).
          </li>
          <li>
            <strong className="text-white">Intentional malware / abusive tooling</strong> generation (see
            RedCode).
          </li>
          <li>
            Large <strong className="text-white">multi-file production backends</strong> (see BaxBench).
          </li>
          <li>
            Chat jailbreak refusal outside coding (Secure Text Generation).
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          SecurityEval is a strong CWE-focused pillar next to CyberSecEval’s broader cyber coverage and
          Asleep-at-the-Keyboard’s seminal autocomplete scenarios.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SecurityEval = curated CWE-focused generation/completion security eval.',
          'Primary signal: lower insecure rate (often broken down by CWE family).',
          'Graded mainly via static / pattern oracles on security-relevant tasks.',
          'Does not alone measure correctness, malware intent, or multi-file backends.',
        ]}
      />
    </LessonArticle>
  )
}
