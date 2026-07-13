import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AnnotationQueuesAndFeedback() {
  return (
    <LessonArticle>
      <LessonSection title="Why human review still matters">
        <p className="text-slate-300">
          LLM-as-judge evaluators scale well, but humans catch things machines miss — tone, brand voice, subtle
          factual errors. <strong className="text-white">Annotation queues</strong> route production traces to
          your QA team for structured review without leaving LangSmith.
        </p>
      </LessonSection>

      <LessonSection title="Annotation queues for production traces">
        <ContentStep number={1} title="Create a queue in LangSmith">
          <p>
            Go to <strong className="text-white">Annotation Queues</strong>. Define criteria: e.g. "Sample 5% of
            production traces" or "All traces with faithfulness &lt; 0.5." Reviewers see a queue of runs to score.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Reviewers score each trace">
          <p>
            Open a trace, read the prompt, context, and output. Rate faithfulness, helpfulness, or custom rubrics.
            Scores attach to the trace permanently — filter and chart them later.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Feed failures back to datasets">
          <p>
            Traces flagged as bad go straight into your evaluation dataset. Next sprint's experiment includes
            those cases — closing the loop from production bug to regression test.
          </p>
        </ContentStep>
        <Flowchart
          title="QA team workflow"
          chart={`flowchart LR
  P[Production traces] --> Q[Annotation queue]
  Q --> R[Human reviewer scores]
  R --> S[Scores on trace]
  R --> D[Bad traces → dataset]
  D --> E[Next experiment]`}
        />
      </LessonSection>

      <LessonSection title="User feedback with run.feedback()">
        <p className="text-slate-300">
          In-app thumbs up/down is the fastest quality signal. Wire buttons in your UI to LangSmith's feedback
          API — scores appear on the trace alongside automated evals.
        </p>
        <Example title="Thumbs up / down from your app">{`from langsmith import Client

client = Client()

# After user clicks thumbs up on an answer
client.create_feedback(
    run_id=trace_run_id,
    key="user_satisfaction",
    score=1.0,           # 1 = thumbs up, 0 = thumbs down
    comment="Helpful answer",  # optional
)

# Or use the convenience method on a run object
run.feedback(key="user_satisfaction", score=0.0)`}</Example>
        <Callout variant="tip">
          Store the <code className="font-mono text-sm">run_id</code> from LangChain's callback handler when you
          return the answer to the user. Pass it to your frontend so the feedback button knows which trace to
          score.
        </Callout>
      </LessonSection>

      <LessonSection title="QA team workflow — weekly rhythm">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Day</th>
                <th className="px-4 py-3">Action</th>
                <th className="px-4 py-3">Who</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Daily', 'Review annotation queue (20 traces)', 'QA reviewer'],
                ['Daily', 'Check thumbs-down rate in dashboard', 'Engineer on call'],
                ['Weekly', 'Add bad traces to dataset, run experiment', 'Engineer + PM'],
                ['Weekly', 'Discuss recurring failure patterns', 'Full team'],
              ].map(([day, action, who]) => (
                <tr key={day + action} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{day}</td>
                  <td className="px-4 py-3 text-slate-400">{action}</td>
                  <td className="px-4 py-3 text-slate-400">{who}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <Callout variant="beginner">
        Start simple: wire thumbs up/down this week, create an annotation queue next week. Even 20 human-reviewed
        traces per week catches patterns automated evals miss.
      </Callout>

      <KeyTakeaways
        items={[
          'Annotation queues route production traces to human reviewers for structured scoring.',
          'Wire in-app thumbs up/down to run.feedback() or client.create_feedback().',
          'Bad traces from review go into datasets — production bugs become regression tests.',
          'Combine user feedback, human annotation, and automated evaluators for full coverage.',
        ]}
      />
    </LessonArticle>
  )
}
