import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ReadingLeaderboards() {
  return (
    <LessonArticle>
      <Definition term="Leaderboard literacy">
        <p>
          <strong className="text-white">Reading leaderboards</strong> means interpreting public model rankings
          without treating a single number as truth. Two famous surfaces: the{' '}
          <strong className="text-white">Hugging Face Open LLM Leaderboard</strong> (mostly automated capability
          benchmarks) and <strong className="text-white">LMSYS Arena</strong> (Large Model Systems organization
          chat arena), which ranks models with <strong className="text-white">Elo</strong> ratings from human
          preference battles.
        </p>
      </Definition>

      <LessonSection title="Two popular boards — different jobs">
        <p className="text-slate-300">
          Analogy: one board is like standardized test rankings; the other is like a taste tournament where
          people vote on which reply they prefer.
        </p>
        <div className="mt-4 space-y-3">
          {[
            [
              'Hugging Face Open LLM Leaderboard',
              'Runs open models on shared academic-style benchmarks (knowledge, math, reasoning suites). Great for helpfulness/capability snapshots of open weights.',
            ],
            [
              'LMSYS Chatbot Arena (Elo)',
              'Humans see two anonymous replies and pick a winner. Elo is a rating system from chess: win → rating up, lose → rating down. Measures chat preference, not exam accuracy.',
            ],
          ].map(([label, text]) => (
            <div key={label} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{label}</p>
              <p className="mt-1 text-sm text-slate-400">{text}</p>
            </div>
          ))}
        </div>
        <Flowchart
          title="What each board emphasizes"
          chart={`flowchart TB
  A[Public leaderboards] --> B[Open LLM Leaderboard<br/>capability tests]
  A --> C[LMSYS Arena<br/>human preference Elo]
  B --> D[Accuracy / score averages]
  C --> E[Win rates → Elo]`}
        />
      </LessonSection>

      <LessonSection title="Same name ≠ same setup">
        <p className="text-slate-300">
          Seeing &quot;MMLU 72%&quot; twice does not mean the experiments match. Check{' '}
          <strong className="text-white">shots</strong> (zero-shot vs few-shot),{' '}
          <strong className="text-white">prompt templates</strong>, <strong className="text-white">model
          version</strong> (base vs chat, quantization, date), and whether the score is a single task or an
          average of many.
        </p>
        <Example title="Checklist before you trust a cell" caption="Ask these every time you compare two rows.">
{`Same benchmark name?
  → Same # of shots (0-shot vs 5-shot)?
  → Same prompt / chat template?
  → Same model checkpoint / version?
  → Same scoring script / harness?

If any "no" → do not treat the numbers as equal.`}
        </Example>
        <Callout variant="beginner" title="Driver's test analogy">
          Two people both &quot;passed driving.&quot; One took the 2020 rural test; one took the 2024 city
          parallel-parking exam. Same label, different difficulty and rules.
        </Callout>
      </LessonSection>

      <LessonSection title="Don't trust a single number">
        <ContentStep number={1} title="One axis is not the whole model">
          <p className="text-slate-300">
            A math win does not imply a coding win. A high Elo does not imply high{' '}
            <span className="text-genai-400">GSM8K</span> (Grade School Math 8K).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Noise and variance">
          <p className="text-slate-300">
            Small gaps (1–2 points) can be noise, especially on small datasets or preference votes with few
            battles.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Your product is the real exam">
          <p className="text-slate-300">
            Leaderboards shortlist candidates. Your prompts, tools, and users decide the winner.
          </p>
        </ContentStep>
        <CodeBlock title="Healthy skepticism">{`# Weak reasoning
"Model A is #1 overall" → ship it for our coding bot

# Stronger reasoning
"Model A leads on HumanEval + MBPP;
 Model B leads on Arena Elo.
 We care about code → shortlist A, then A/B test on our repo."`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Comparing two models fairly on helpfulness">
        <p className="text-slate-300">
          For helpfulness, prefer the same harness, same shots, and the same suite across both models. Then look
          at a <em>small set</em> of axes — not one blended mega-score alone.
        </p>
        <Flowchart
          title="Fair helpfulness comparison"
          chart={`flowchart TB
  A[Pick 2 candidate models] --> B[Same eval harness]
  B --> C[Same shots + prompts]
  C --> D[Run knowledge + code + math]
  D --> E[Compare per axis]
  E --> F[Shortlist → your own tests]`}
        />
        <Callout variant="insight" title="Rule of thumb">
          Compare models the way you compare students: same exam, same day, same rules — then discuss subject
          scores separately instead of only &quot;GPA.&quot;
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Open LLM Leaderboard ≈ capability exams; LMSYS Arena Elo ≈ human chat preference.',
          'Same benchmark name can hide different shots, prompts, and model versions.',
          'Never ship from a single number — check axes, gaps, and your own product tests.',
          'Fair helpfulness compares: same harness, same setup, multiple capability axes.',
        ]}
      />
    </LessonArticle>
  )
}
