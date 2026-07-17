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

export function Seccodeplt() {
  return (
    <LessonArticle>
      <Definition term="SecCodePLT">
        <p>
          <strong className="text-white">SecCodePLT</strong> is a{' '}
          <strong className="text-white">security-oriented code platform / benchmark</strong> for studying how
          code models behave on security-relevant programming tasks — a shared playground with tasks, checks,
          and reporting conventions aimed at secure code generation research.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a gym with many machines labeled by muscle group — here the “machines” are security coding
          scenarios and grading tools.
        </p>
      </Definition>

      <Callout variant="beginner" title="What SecCodePLT measures">
        Model performance on a security-focused coding platform: insecure vs safer generations across its
        task library, under the platform’s evaluation tooling.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Platform + benchmark">
          <p className="text-slate-300">
            Beyond a single CSV of prompts, SecCodePLT-style efforts provide a{' '}
            <strong className="text-white">platform</strong>: tasks, runners, and metrics so labs can repeat
            experiments consistently.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Security-oriented coding tasks">
          <p className="text-slate-300">
            Prompts touch weakness themes (CWE-linked) and ask models to write or repair code without teaching
            real exploits — flags look like{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Comparable research signal">
          <p className="text-slate-300">
            Useful when you want a community-aligned security coding eval surface rather than inventing a
            private rubric from scratch.
          </p>
        </ContentStep>
        <Flowchart
          title="SecCodePLT (conceptual)"
          chart={`flowchart TB
  Lib[Security task library] --> Run[Platform runner]
  Run --> Model[Code model under test]
  Model --> Out[Generated / repaired code]
  Out --> Grade[Platform security + quality checks]
  Grade --> Report[Benchmark report]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher secure / successful rates</strong> (per platform metrics) —
            better security-oriented coding behavior on its tasks.
          </li>
          <li>
            <strong className="text-white">Lower rates / higher insecure flags</strong> — model struggles on
            the platform’s security scenarios.
          </li>
          <li>
            Always cite the <strong className="text-white">platform version</strong> and metric definitions —
            platforms evolve.
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Platform: SecCodePLT (version X)
Task split: generation / repair (as applicable)
Insecure flag rate: ... (lower better)
Task success per docs: ...`}
        </Example>
      </LessonSection>

      <LessonSection title="What SecCodePLT does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Every other suite’s exact prompt distribution (CyberSecEval ≠ SecCodePLT).
          </li>
          <li>
            Non-code <strong className="text-white">chat jailbreak</strong> robustness.
          </li>
          <li>
            Guaranteed coverage of <strong className="text-white">malicious intent</strong> categories
            (contrast with RedCode).
          </li>
          <li>
            Your private product languages or frameworks if they are outside the platform’s support.
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Treat SecCodePLT as a security-coding platform pillar; still run CyberSecEval / CWEval / RedCode for
          axes it may not emphasize.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SecCodePLT is a security-oriented code platform and benchmark.',
          'Measures insecure vs successful behavior on its security coding tasks.',
          'Cite platform version when comparing models.',
          'Does not replace cyber-assist, dual-correctness, or malware-intent suites by itself.',
        ]}
      />
    </LessonArticle>
  )
}
