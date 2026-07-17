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

export function Cyberseceval() {
  return (
    <LessonArticle>
      <Definition term="CyberSecEval (Meta Purple Llama)">
        <p>
          <strong className="text-white">CyberSecEval</strong> is Meta’s Purple Llama suite for measuring{' '}
          <strong className="text-white">cybersecurity risks of LLMs</strong> — especially{' '}
          <strong className="text-white">insecure code generation</strong> and related cyber-assist risks
          (helping with cyber tasks the product should not enable).
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a driver’s exam that checks both “can you parallel park?” and “will you ignore traffic
          laws?” — coding safety plus cyber-policy boundaries.
        </p>
      </Definition>

      <Callout variant="beginner" title="What CyberSecEval measures">
        How often models emit insecure coding patterns (instruct and/or autocomplete) and how they handle
        broader cyber-assist risk categories — under standardized prompts and graders.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Insecure code generation">
          <p className="text-slate-300">
            Prompts that invite weak patterns (e.g.{' '}
            <span className="font-mono text-sm text-genai-400">[insecure pattern: SQL string concat]</span>).
            Outputs are checked with static / rule-style oracles linked to CWE-style categories.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Instruct vs autocomplete">
          <p className="text-slate-300">
            CyberSecEval-style tracks often separate <strong className="text-white">NL instruct</strong>{' '}
            codegen from <strong className="text-white">IDE autocomplete</strong> continuation — matching real
            products.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Related cyber assist risks">
          <p className="text-slate-300">
            Beyond “buggy but benign” insecure code, the suite also probes whether the model assists with
            cyber-misuse categories (represented here only as{' '}
            <span className="font-mono text-sm text-genai-400">[cyber assist risk category]</span>) — closer to
            policy refusal than CWE static flags alone.
          </p>
        </ContentStep>
        <Flowchart
          title="CyberSecEval (conceptual)"
          chart={`flowchart TB
  P[Prompts: instruct + autocomplete<br/>+ cyber-assist categories] --> M[Model outputs]
  M --> IC[Insecure code oracles]
  M --> CA[Cyber-assist / policy judges]
  IC --> S[Rates + breakdowns]
  CA --> S`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Lower insecure-code rate</strong> — safer coding suggestions under
            the tested scenarios (good for copilots).
          </li>
          <li>
            <strong className="text-white">Higher insecure-code rate</strong> — model frequently proposes weak
            patterns; needs stronger filtering or training.
          </li>
          <li>
            For cyber-assist tracks, <strong className="text-white">lower compliance / lower ASR-like
            rates</strong> usually mean safer refusal boundaries (interpret per official metric docs).
          </li>
        </ul>
        <Example title="Safe reporting style">
{`Track: insecure code autocomplete
Oracle: static rule pack (CWE-linked)
Result: 18% insecure completions (lower is better)
Also report: instruct track separately`}
        </Example>
      </LessonSection>

      <LessonSection title="What CyberSecEval does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Pure functional correctness</strong> like HumanEval pass@k alone.
          </li>
          <li>
            Full <strong className="text-white">multi-file backend realism</strong> (see BaxBench).
          </li>
          <li>
            Guarantees against every novel vulnerability outside its oracles and prompt set.
          </li>
          <li>
            General chat toxicity / bias (those live in Secure Text Generation).
          </li>
        </ul>
        <Callout variant="tip" title="Pairing tip">
          Use CyberSecEval as a broad cyber + insecure-code pillar, then add CWEval or BaxBench when you need
          correctness+security or backend realism.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'CyberSecEval (Purple Llama) covers insecure code gen and related cyber-assist risks.',
          'Often separates instruct vs autocomplete product shapes.',
          'Lower insecure rates (and safer cyber-assist refusal) are the desired direction.',
          'Does not replace HumanEval correctness or full backend suites alone.',
        ]}
      />
    </LessonArticle>
  )
}
