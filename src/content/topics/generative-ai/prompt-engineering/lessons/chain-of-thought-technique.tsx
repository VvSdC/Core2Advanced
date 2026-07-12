import {
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ChainOfThoughtTechnique() {
  return (
    <LessonArticle>
      <Definition term="Chain-of-Thought (CoT) Prompting">
        <p>
          <strong className="text-white">Chain-of-thought prompting</strong> asks the model to write intermediate
          reasoning steps before the final answer. It turns one hard leap into several smaller, reliable
          next-token predictions.
        </p>
      </Definition>

      <LessonSection title="When to use chain-of-thought">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Math and arithmetic</strong> — especially with carries, fractions, or word problems.</li>
          <li><strong className="text-white">Multi-step logic</strong> — puzzles, planning, cause-and-effect chains.</li>
          <li><strong className="text-white">Commonsense reasoning</strong> — questions needing 2+ inference steps.</li>
          <li><strong className="text-white">Debugging and analysis</strong> — "think through what could cause this error."</li>
        </ul>
      </LessonSection>

      <LessonSection title="When NOT to use chain-of-thought">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Simple factual recall — "What is the capital of Japan?"</li>
          <li>Creative writing where reasoning steps add noise.</li>
          <li>Small models (&lt;10B) — CoT rarely helps; they cannot generate useful reasoning chains.</li>
          <li>When latency and token cost matter — CoT outputs are 3–10× longer.</li>
        </ul>
      </LessonSection>

      <ContentStep number={1} title="Two ways to trigger CoT">
        <p><strong className="text-white">Few-shot CoT</strong> — include worked examples with reasoning steps:</p>
        <Example
          title="Few-shot CoT"
          output={`A: There are 3 cars originally. 2 more arrive. 3 + 2 = 5. The answer is 5.`}
        >{`prompt = """Q: There are 15 trees. Workers plant 6 more, then cut down 4. How many trees?
A: We start with 15. After planting: 15 + 6 = 21. After cutting: 21 - 4 = 17. The answer is 17.

Q: There are 3 cars in a lot. 2 more arrive. How many cars?
A:"""`}</Example>
        <p className="mt-4"><strong className="text-white">Zero-shot CoT</strong> — append one phrase, no examples:</p>
        <Example
          title="Zero-shot CoT"
        >{`prompt = """Q: A store sells packs of 6 eggs. How many packs are needed for 50 eggs?
A: Let's think step by step."""`}</Example>
      </ContentStep>

      <ContentStep number={2} title="Getting better results from CoT">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Self-consistency</strong> — run CoT 5–10 times, pick the most common final answer (see paper).</li>
          <li><strong className="text-white">Ask for structured steps</strong> — "Step 1: … Step 2: … Final answer: …"</li>
          <li><strong className="text-white">Verify</strong> — ask the model to check its own answer in a follow-up prompt.</li>
        </ul>
      </ContentStep>

      <KeyTakeaways
        items={[
          'CoT = show reasoning steps before the final answer.',
          'Best for math, logic, and multi-step problems on large models.',
          'Few-shot CoT (worked examples) or zero-shot CoT ("think step by step").',
          'Self-consistency (multiple samples + majority vote) improves accuracy further.',
        ]}
      />
    </LessonArticle>
  )
}
