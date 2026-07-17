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

export function Mmlu() {
  return (
    <LessonArticle>
      <Definition term="MMLU (Massive Multitask Language Understanding)">
        <p>
          <strong className="text-white">MMLU</strong> is a large multiple-choice exam that asks an LLM questions
          across roughly <span className="text-genai-400">57 subjects</span> — STEM, humanities, social science,
          and more — and scores <strong className="text-white">accuracy</strong>: the share of questions where the
          model picks the correct letter.
        </p>
        <p className="mt-2 text-slate-300">
          Think of it as a standardized “how much textbook-style knowledge can this model retrieve and apply?”
          test — not a chat-quality or coding contest.
        </p>
      </Definition>

      <Callout variant="beginner" title="What MMLU measures in one sentence">
        Broad factual and exam-style knowledge across many school and professional topics, under a fixed
        multiple-choice format.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Many subjects, one format">
          <p className="text-slate-300">
            Each item is a question with usually four options (A–D). Subjects range from elementary arithmetic
            and US history to college biology, law, and medicine-style items.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Accuracy is the headline number">
          <p className="text-slate-300">
            A score of <strong className="text-white">70%</strong> means the model chose the right option on 70
            out of 100 questions (aggregated across subjects, often reported as a macro average).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Few-shot is the common setup">
          <p className="text-slate-300">
            Papers often use <span className="text-genai-400">5-shot</span>: five worked examples of the same
            subject appear before the real question so the model sees the answer format. Always check whether a
            leaderboard is 0-shot or 5-shot before comparing numbers.
          </p>
        </ContentStep>
        <Flowchart
          title="MMLU evaluation flow"
          chart={`flowchart LR
  Q[MCQ from ~57 subjects] --> PROMPT[0-shot or 5-shot prompt]
  PROMPT --> MODEL[LLM picks A/B/C/D]
  MODEL --> SCORE[Accuracy vs gold label]
  SCORE --> REPORT[Overall + per-subject scores]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher</strong> — stronger coverage of exam-style knowledge and better
            at mapping questions to the right option under that prompt setup.
          </li>
          <li>
            <strong className="text-white">Lower</strong> — weaker or uneven knowledge; the model may also fail
            the format (wrong letter style) even when it “knows” the topic in free text.
          </li>
          <li>
            Small gaps (e.g. 72% vs 74%) are often noise unless eval settings are identical and variance is
            reported.
          </li>
        </ul>
        <Callout variant="insight" title="Always match the protocol">
          Temperature, few-shot examples, answer extraction, and subject weighting all move the number. A “fair”
          comparison uses the same harness.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample question style (paraphrased)">
        <Example title="Humanities-style MMLU item">{`Subject: World History (paraphrased)

Which development most directly enabled long-distance maritime trade
in the early modern Indian Ocean?

A) Standardized global postage systems
B) Improvements in navigational instruments and ship design
C) Universal adoption of a single world currency
D) Instant radio communication between ports

Gold: B`}</Example>
        <p className="mt-4 text-slate-300">
          Real MMLU items are fixed published questions; the style above is only illustrative — never paste
          copyrighted dumps into product demos.
        </p>
      </LessonSection>

      <LessonSection title="MMLU-Pro: the harder cousin">
        <p className="text-slate-300">
          <strong className="text-white">MMLU-Pro</strong> keeps the multitask idea but makes items harder —
          more options, tougher reasoning, less chance that shallow pattern matching wins. Teams use it when
          classic MMLU scores are saturated (many strong models cluster near the top).
        </p>
        <Callout variant="tip" title="When to prefer MMLU-Pro">
          If every model you care about is already “excellent” on MMLU, switch differentiation to MMLU-Pro or
          harder knowledge suites (see GPQA).
        </Callout>
      </LessonSection>

      <LessonSection title="What MMLU does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Chat helpfulness</strong> — tone, multi-turn assistance, tool use.
          </li>
          <li>
            <strong className="text-white">Up-to-date facts</strong> — items can be outdated; high scores can
            still mean memorized old material.
          </li>
          <li>
            <strong className="text-white">Code, math contests, or agent workflows</strong> — those need their
            own benchmarks.
          </li>
          <li>
            <strong className="text-white">Safety</strong> — knowing medical facts ≠ refusing harmful asks.
          </li>
        </ul>
        <Callout variant="beginner" title="Memorization risk">
          If training data overlapped the test set, a high score can overstate true understanding. Treat MMLU as
          one signal among many, not a certificate of intelligence.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'MMLU measures multitask multiple-choice accuracy across ~57 subjects.',
          'High score ≈ stronger exam-style knowledge under a fixed protocol; low ≈ gaps or format failures.',
          '5-shot is common — always compare apples-to-apples on shot count and harness.',
          'MMLU-Pro is a harder variant when classic MMLU is saturated.',
          'It does not measure chat quality, freshness, coding agents, or safety.',
        ]}
      />
    </LessonArticle>
  )
}
