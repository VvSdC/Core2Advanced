import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function Top10SecureCodeBenchmarksMap() {
  return (
    <LessonArticle>
      <Definition term="Top 10 secure code benchmarks map">
        <p>
          Secure code generation is not one score. This lesson is your{' '}
          <strong className="text-white">cheat sheet</strong> for the ten most-used benchmarks in this track —
          autocomplete vs instruct, CWE coverage, correctness+security, backend realism, and malicious intent.
        </p>
      </Definition>

      <Callout variant="beginner" title="If you only remember one rule…">
        Match the benchmark to the <span className="text-genai-400">product surface and risk</span>. IDE
        autocomplete ≠ NL codegen ≠ backend agents ≠ malware refusal.
      </Callout>

      <LessonSection title="Master table — top 10">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-3 py-3">Benchmark</th>
                <th className="px-3 py-3">Shape</th>
                <th className="px-3 py-3">Focus</th>
                <th className="px-3 py-3">Good means</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['CyberSecEval', 'Instruct + autocomplete', 'Insecure code + cyber assist', 'Lower insecure / safer assist'],
                ['SecurityEval', 'Gen / completion', 'Curated CWE coverage', 'Lower % insecure'],
                ['Asleep at the Keyboard', 'Autocomplete', 'Seminal Copilot CWE scenarios', 'Lower vulnerable suggestions'],
                ['CodeLMSec', 'Mostly instruct API', 'Black-box vuln propensity', 'Lower propensity'],
                ['LLMSecEval', 'NL instruct', 'Top-25 CWE-style NL→code', 'Lower insecure by theme'],
                ['CWEval', 'Instruct tasks', 'Correctness AND security', 'Higher joint pass'],
                ['BaxBench', 'Multi-file backends', 'Secure + correct services', 'Higher joint project success'],
                ['SecCodePLT', 'Platform tasks', 'Security-oriented code platform', 'Better platform security metrics'],
                ['CodeGuard+', 'Suite', 'Code security evaluation pack', 'Lower insecure / better suite score'],
                ['RedCode', 'Misuse prompts', 'Malicious / abusive code risk', 'Lower compliance with abuse'],
              ].map(([bench, shape, focus, good]) => (
                <tr key={bench} className="hover:bg-surface-800/50">
                  <td className="px-3 py-3 font-semibold text-white">{bench}</td>
                  <td className="px-3 py-3 text-genai-400">{shape}</td>
                  <td className="px-3 py-3">{focus}</td>
                  <td className="px-3 py-3">{good}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Axes at a glance">
        <Flowchart
          title="Pick an axis, then a suite"
          chart={`flowchart TB
  START[What worries you?] --> AC[IDE autocomplete CWEs]
  START --> NL[NL instruct insecure code]
  START --> BOTH[Correctness + security]
  START --> BE[Multi-file backends]
  START --> MAL[Malicious code intent]
  START --> CY[Cyber assist breadth]
  AC --> A1[Asleep / CyberSecEval completion]
  NL --> A2[LLMSecEval / SecurityEval / CodeLMSec]
  BOTH --> A3[CWEval]
  BE --> A4[BaxBench]
  MAL --> A5[RedCode]
  CY --> A6[CyberSecEval]
  START --> PL[Platform / suite pack]
  PL --> A7[SecCodePLT / CodeGuard+]`}
        />
        <ContentStep number={1} title="Autocomplete column">
          <p className="text-slate-300">
            <span className="text-genai-400">Asleep at the Keyboard</span> and CyberSecEval completion tracks
            are the classic IDE-copilot insecurity exams.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Instruct / NL column">
          <p className="text-slate-300">
            <span className="text-genai-400">LLMSecEval</span>, SecurityEval, CodeLMSec, and CyberSecEval
            instruct cover “write me code” chat surfaces.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Dual / realism / misuse">
          <p className="text-slate-300">
            <span className="text-genai-400">CWEval</span> for joint scoring,{' '}
            <span className="text-genai-400">BaxBench</span> for backends,{' '}
            <span className="text-genai-400">RedCode</span> for malicious intent.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Starter suite recommendation">
        <p className="text-slate-300">
          Beginners can start with three pillars, then expand:
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['1. CyberSecEval', 'Broad insecure-code + cyber-assist coverage; instruct and autocomplete awareness.'],
            ['2. SecurityEval or Asleep at the Keyboard', 'CWE-focused depth — prefer Asleep if IDE-first, SecurityEval for curated CWE gen/completion.'],
            ['3. CWEval (or BaxBench for backends)', 'CWEval for dual correctness+security; BaxBench when you ship multi-file backend agents.'],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Callout variant="tip" title="Add when relevant">
          Add RedCode for malicious-code refusal, LLMSecEval for Top-25 NL themes, CodeLMSec for black-box
          vendor APIs, SecCodePLT / CodeGuard+ for platform/suite breadth.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Top 10 span autocomplete, instruct, dual scoring, backends, platforms, and misuse.',
          'Starter suite: CyberSecEval + SecurityEval/Asleep + CWEval (or BaxBench for backends).',
          'RedCode is the malicious-intent contrast to insecure-but-benign CWE suites.',
          'Never treat one benchmark as a full secure-codegen certificate.',
        ]}
      />
    </LessonArticle>
  )
}
