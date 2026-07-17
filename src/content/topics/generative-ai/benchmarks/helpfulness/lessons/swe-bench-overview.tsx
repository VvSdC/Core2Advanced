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

export function SweBenchOverview() {
  return (
    <LessonArticle>
      <Definition term="SWE-bench (overview)">
        <p>
          <strong className="text-white">SWE-bench</strong> evaluates whether a model (often inside an agent
          loop) can resolve <span className="text-genai-400">real GitHub issues</span> by producing a patch that
          makes the project’s tests pass. It is dramatically closer to software engineering than HumanEval or
          MBPP.
        </p>
        <p className="mt-2 text-slate-300">
          This lesson is a <em>beginner map</em> — what the benchmark is and what scores mean — not a full agent
          systems deep dive.
        </p>
      </Definition>

      <Callout variant="beginner" title="What SWE-bench measures">
        End-to-end issue fixing on real repositories: understand the bug report, edit the right files, and pass
        the relevant tests.
      </Callout>

      <LessonSection title="What does this benchmark measure?">
        <ContentStep number={1} title="Issue + codebase → patch">
          <p className="text-slate-300">
            Each instance starts from a real open-source issue (bug or feature request) and a snapshot of the
            repo. The system must edit code, not just fill one function from a docstring.
          </p>
        </ContentStep>
        <ContentStep number={2} title="“Resolved” means tests pass">
          <p className="text-slate-300">
            A task is <strong className="text-white">resolved</strong> when the submitted patch causes the fail-
            to-pass tests to succeed (and typically does not break pass-to-pass checks). Fluent explanations
            without a working patch do not count.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Much harder than HumanEval">
          <p className="text-slate-300">
            You need localization (where to edit), multi-file reasoning, dependency awareness, and often tools
            (shell, tests, search). Single-function synthesis is only a tiny slice of the skill.
          </p>
        </ContentStep>
        <Flowchart
          title="SWE-bench intuition"
          chart={`flowchart TB
  ISSUE[GitHub issue text] --> REPO[Repo snapshot]
  REPO --> AGENT[Model / agent edits files]
  AGENT --> PATCH[Proposed patch]
  PATCH --> CI[Run project tests]
  CI -->|fail-to-pass OK| RES[Resolved]
  CI -->|fail| UNRES[Unresolved]`}
        />
      </LessonSection>

      <LessonSection title="What high and low scores mean">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Higher % resolved</strong> — better at real issue fixing under that
            agent scaffold, tools, and time/budget limits.
          </li>
          <li>
            <strong className="text-white">Low</strong> — expected for raw chat models without tools; even strong
            models resolve only a fraction of instances.
          </li>
          <li>
            Always ask: same subset (Full / Verified / Lite)? same agent? same compute? Otherwise numbers are
            incomparable.
          </li>
        </ul>
        <Callout variant="insight" title="Scaffold vs model">
          A big jump on SWE-bench often comes from a better agent loop (retrieval, retries, test feedback), not
          only a smarter base LLM. Report both.
        </Callout>
      </LessonSection>

      <LessonSection title="Sample instance style (paraphrased)">
        <Example title="Issue-shaped prompt (illustrative)">{`Repository: example/http-utils (snapshot commit abc123)
Issue title: Timeout ignored when follow_redirects=True

Body (paraphrased):
  When follow_redirects is enabled, the client retries forever
  even if timeout=5 is set. Expected: stop after ~5 seconds
  and raise TimeoutError. Includes a failing unit test path.

Task: produce a patch that fixes the bug and passes the suite.`}</Example>
        <p className="mt-4 text-slate-300">
          Real SWE-bench instances cite specific repos and commits. The point: this is issue triage + coding,
          not a toy docstring.
        </p>
      </LessonSection>

      <LessonSection title="Variants you will see named">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">SWE-bench Verified / Lite</strong> — filtered or smaller sets for more
            reliable or cheaper evaluation.
          </li>
          <li>
            Leaderboards often separate <span className="text-genai-400">assisted agent frameworks</span> from
            bare model calls.
          </li>
        </ul>
        <Callout variant="tip" title="Beginner takeaway">
          Read “% resolved on SWE-bench Verified with Agent X” as an engineering-system metric, not a pure IQ
          number for the weights alone.
        </Callout>
      </LessonSection>

      <LessonSection title="Beginner pitfalls">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            Comparing a bare chat model to a full agent on the same leaderboard without labeling scaffolds.
          </li>
          <li>
            Treating a 5-point gap as decisive when budgets (time, retries, tools) differ.
          </li>
          <li>
            Ignoring that some instances need reading many files — context window and search matter.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="What SWE-bench does NOT measure">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Greenfield app design from a blank folder.</li>
          <li>Security review quality, product UX, or documentation polish.</li>
          <li>Non-GitHub workflows (tickets in proprietary tools) unless you adapt the idea.</li>
          <li>Chat helpfulness on non-coding tasks.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'SWE-bench: real GitHub issues → patches graded by project tests.',
          '“Resolved” means the fix works under the harness — not a nice explanation.',
          'Far harder and more realistic than HumanEval/MBPP short-function synth.',
          'Scores mix model skill with agent tools, retries, and budget — report the setup.',
          'It does not cover greenfield design, security audits, or general chat quality.',
        ]}
      />
    </LessonArticle>
  )
}
