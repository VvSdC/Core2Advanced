import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  ResearchPaperHeader,
} from '../../../../../../components/content'

const PAPER_URL = 'https://arxiv.org/abs/2201.11903'

export function ChainOfThoughtPrompting() {
  return (
    <LessonArticle>
      <ResearchPaperHeader
        title="Chain-of-Thought Prompting Elicits Reasoning in Large Language Models"
        authors="Wei et al. (Google)"
        year="2022"
        url={PAPER_URL}
      >
        Showed that asking a model to <strong className="text-white">"think step by step"</strong> before
        answering dramatically improves reasoning — no retraining required.
      </ResearchPaperHeader>

      <Callout variant="beginner" title="Read this after">
        You know models predict one token at a time. This paper shows a simple prompting trick that makes
        large models far better at math and logic — by letting them write intermediate steps first. Read after{' '}
        <em>How Language Models Work</em> and <em>GPT-3</em>.
      </Callout>

      <LessonSection title="Background — the reasoning problem">
        <p>
          GPT-3 could answer simple questions but failed badly on multi-step problems: arithmetic with carries,
          commonsense puzzles needing 3+ logical steps, word problems. Standard prompting jumped straight to the
          answer — and large models often got it wrong.
        </p>
        <p className="mt-3">
          Humans solve hard problems by writing intermediate steps. Wei et al. asked:{' '}
          <em>what if we prompt the model to do the same?</em>
        </p>
      </LessonSection>

      <LessonSection title="The core idea — chain-of-thought (CoT)">
        <ContentStep number={1} title="Standard vs chain-of-thought prompting">
          <Example
            title="Without CoT — model often fails"
            output={`Q: Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many does he have?
A: 11   ← wrong (correct: 11 is actually right here, but harder problems fail)`}
          >{`# Standard prompt — question → answer directly
prompt = """Q: Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many does he have?
A:"""`}</Example>
          <Example
            title="With CoT — model shows its work"
            output={`A: Roger started with 5 balls. 2 cans of 3 is 6 balls.
5 + 6 = 11. The answer is 11.`}
          >{`# Chain-of-thought — include reasoning examples in the prompt
prompt = """Q: Roger has 5 tennis balls. He buys 2 cans of 3 balls each. How many does he have?
A: Roger started with 5 balls. 2 cans of 3 is 6 balls. 5 + 6 = 11. The answer is 11.

Q: The cafeteria had 23 apples. They used 20 and bought 6 more. How many now?
A:"""`}</Example>
          <p className="mt-3">
            The model continues the pattern: it writes reasoning steps as tokens, then the final answer. Each
            intermediate step is just another next-token prediction — the same mechanism from{' '}
            <em>How Language Models Work</em>.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Why it works">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li><strong className="text-white">Decomposes hard problems</strong> — one big leap becomes several small, reliable steps.</li>
            <li><strong className="text-white">More tokens to reason</strong> — the model has more positions to build up intermediate state via attention.</li>
            <li><strong className="text-white">Trained on explanations</strong> — web text contains millions of worked examples (math solutions, tutorials).</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Key results">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Benchmark</th>
                <th className="px-4 py-3">Standard prompting</th>
                <th className="px-4 py-3">Chain-of-thought</th>
                <th className="px-4 py-3">Gain</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['GSM8K (grade-school math)', '~18%', '~57%', '+39 pts'],
                ['SVAMP (math word problems)', '~63%', '~74%', '+11 pts'],
                ['Date understanding', '~49%', '~79%', '+30 pts'],
                ['StrategyQA (commonsense)', '~65%', '~72%', '+7 pts'],
              ].map(([bench, standard, cot, gain]) => (
                <tr key={bench} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{bench}</td>
                  <td className="px-4 py-3 font-mono text-red-400">{standard}</td>
                  <td className="px-4 py-3 font-mono text-genai-400">{cot}</td>
                  <td className="px-4 py-3 text-slate-400">{gain}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight">
          CoT gains are largest on problems that <em>humans</em> also solve step by step. On simple recall
          tasks (e.g. "What is the capital of France?") CoT adds no benefit.
        </Callout>
      </LessonSection>

      <LessonSection title="Important caveats">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Only works on large models</strong> — models below ~100B showed little benefit. Small models lack capacity to generate useful reasoning chains.</li>
          <li><strong className="text-white">Costs more tokens</strong> — a 5-step reasoning chain means 5× more output tokens to pay for at inference.</li>
          <li><strong className="text-white">Can hallucinate steps</strong> — the model may write plausible-sounding but wrong intermediate reasoning.</li>
          <li><strong className="text-white">"Think step by step"</strong> — the zero-shot variant (just adding that phrase) also helps, without full worked examples.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Connection to Fundamentals">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Fundamentals lesson</th>
                <th className="px-4 py-3">How this paper connects</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['How Language Models Work', 'Reasoning steps are just more tokens — same next-token mechanism'],
                ['Large Language Models', 'CoT is a key reason LLMs feel "smart" on hard problems'],
                ['Small Language Models', 'CoT largely does not work on SLMs — another SLM vs LLM gap'],
                ['GPT-3 Few-Shot', 'Extends few-shot prompting with worked reasoning examples'],
              ].map(([lesson, connection]) => (
                <tr key={lesson} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{lesson}</td>
                  <td className="px-4 py-3 text-slate-400">{connection}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Prompting models to show intermediate steps dramatically improves multi-step reasoning.',
          'Biggest gains on math and logic — tasks humans also solve step by step.',
          'Works mainly on large models; SLMs see little benefit.',
          '"Think step by step" is the zero-shot version — no examples needed.',
        ]}
      />
    </LessonArticle>
  )
}
