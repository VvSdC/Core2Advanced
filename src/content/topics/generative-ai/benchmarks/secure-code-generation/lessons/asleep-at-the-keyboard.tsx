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

export function AsleepAtTheKeyboard() {
  return (
    <LessonArticle>
      <Definition term="Asleep at the Keyboard (Pearce et al.)">
        <p>
          <strong className="text-white">Asleep at the Keyboard</strong> is the seminal study/scenario set
          showing that IDE-style code models (notably early Copilot-era systems) often suggest{' '}
          <strong className="text-white">CWE-linked insecure completions</strong> when given security-relevant
          prefixes.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: autocomplete finishes your sentence — sometimes with the wrong address. Pearce et al. showed
          how often that “wrong address” is a security weakness.
        </p>
      </Definition>

      <Callout variant="beginner" title="What it measures">
        Propensity of autocomplete-style models to complete code into insecure patterns across curated CWE
        scenarios — the classic “Copilot insecure suggestion” exam.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="CWE scenarios as unfinished code">
          <p className="text-slate-300">
            Tasks look like partial programs that invite weak finishes — labeled with weakness families such as{' '}
            <span className="font-mono text-sm text-genai-400">[fictional CWE-STYLE-INJECT]</span>. Course
            materials never include weaponizable payloads.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Autocomplete product shape">
          <p className="text-slate-300">
            This is fundamentally an <strong className="text-white">IDE continuation</strong> story: prefix in,
            completion out — not a long NL essay prompt.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Static checking of suggestions">
          <p className="text-slate-300">
            Completions are inspected for insecure patterns (CodeQL-style / static oracles in follow-on
            harnesses). Headline takeaway historically: insecure suggestions were common.
          </p>
        </ContentStep>
        <Flowchart
          title="Asleep-at-the-Keyboard style eval"
          chart={`flowchart TB
  Pref[Security-relevant code prefix] --> Model[Autocomplete model]
  Model --> Comp[Completion]
  Comp --> Oracle[Static / CWE checks]
  Oracle --> Rate[% vulnerable suggestions]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower vulnerable-suggestion rate</strong> — safer autocomplete under
            those scenarios.
          </li>
          <li>
            <strong className="text-white">Higher rate</strong> — model often completes into weak patterns;
            risky for IDE copilots without extra filters.
          </li>
          <li>
            Modern replications should lock model decoding settings and oracle versions for fair comparison.
          </li>
        </ul>
        <Example title="Safe placeholder — completion check">
{`Prefix theme: user lookup near a query boundary
Completion flagged?: yes — [insecure pattern: SQL string concat]
Aggregate: vulnerable suggestion rate = 35% (lower is better)`}
        </Example>
      </LessonSection>

      <LessonSection title="What it does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Broad <strong className="text-white">NL instruct</strong> “write me a service” security (use
            CyberSecEval instruct / LLMSecEval).
          </li>
          <li>
            <strong className="text-white">Correctness + security jointly</strong> on the same scored tasks
            (CWEval).
          </li>
          <li>
            <strong className="text-white">Malicious code intent</strong> (RedCode) or chat jailbreaks.
          </li>
          <li>
            Every language/ecosystem — classic scenarios are limited; treat as foundational, not exhaustive.
          </li>
        </ul>
        <Callout variant="tip" title="Why beginners still learn it">
          It established the autocomplete insecurity narrative that later suites (CyberSecEval completion
          tracks, SecurityEval, etc.) industrialize.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Asleep at the Keyboard = seminal Copilot-era CWE autocomplete scenarios (Pearce et al.).',
          'Measures vulnerable completion rates under security-relevant prefixes.',
          'Lower vulnerable-suggestion rate is better for IDE copilots.',
          'Does not cover full instruct codegen, dual correctness, or malware intent alone.',
        ]}
      />
    </LessonArticle>
  )
}
