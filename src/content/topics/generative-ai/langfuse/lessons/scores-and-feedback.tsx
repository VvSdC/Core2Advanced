import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function ScoresAndFeedback() {
  return (
    <LessonArticle>
      <LessonSection title="What is a score?">
        <p className="text-slate-300">
          A <strong className="text-white">score</strong> is a quality signal attached to a trace or a specific
          observation inside it. Scores turn "the bot felt worse this week" into a number you can chart, filter,
          and alert on.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Example</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['User feedback', 'Thumbs up / thumbs down', 'In-app buttons on every answer'],
                ['Human annotation', 'Reviewer rates faithfulness 0–1', 'Weekly QA sample review'],
                ['Automated eval', 'LLM-as-judge relevance score', 'Every production trace (covered next lesson)'],
                ['Code check', 'JSON schema valid = 1', 'Structured output pipelines'],
              ].map(([source, example, when]) => (
                <tr key={source} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{source}</td>
                  <td className="px-4 py-3 text-slate-400">{example}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="langfuse.score() API">
        <p className="text-slate-300">
          Call <code className="font-mono text-sm">langfuse.score()</code> from your backend when a user clicks
          thumbs up, or from a review script when a human annotator submits a rating.
        </p>
        <Example
          title="Record user thumbs and human review scores"
        >{`from langfuse import Langfuse

langfuse = Langfuse()

# User clicked thumbs up on this trace
langfuse.score(
    trace_id="abc-123",
    name="user-feedback",
    value=1,           # 1 = thumbs up, 0 = thumbs down
    data_type="BOOLEAN",
    comment="Helpful refund answer",
)

# Human reviewer scores faithfulness on the generation span
langfuse.score(
    trace_id="abc-123",
    observation_id="gen-456",  # attach to specific LLM call
    name="faithfulness",
    value=0.85,
    data_type="NUMERIC",
    comment="Mostly grounded; one unsupported claim",
)`}</Example>
      </LessonSection>

      <LessonSection title="Boolean vs numeric scores">
        <ContentStep number={1} title="Boolean — pass/fail signals">
          <p>
            Use for thumbs up/down, "answer accepted", "escalated to human". Value is 0 or 1. Easy to aggregate:
            "% positive this week".
          </p>
        </ContentStep>
        <ContentStep number={2} title="Numeric — graded quality">
          <p>
            Use for faithfulness (0–1), relevance (0–1), toxicity (0–1), or custom rubrics. Plot averages and
            percentiles over time.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Categorical — optional">
          <p>
            Some teams use named categories ("good", "bad", "needs_review") mapped to scores. Boolean and numeric
            cover most cases.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Attach to trace or observation">
        <p className="text-slate-300">
          <strong className="text-white">Trace-level</strong> scores rate the overall user experience — "was this
          answer helpful?" <strong className="text-white">Observation-level</strong> scores target a specific step —
          "was this retrieval relevant?" or "was this generation faithful to context?"
        </p>
        <Callout variant="beginner">
          For RAG apps, attach retrieval scores to the retrieval <em>span</em> and faithfulness scores to the{' '}
          <em>generation</em> observation. That way you know whether the bug was bad chunks or a hallucinating model.
        </Callout>
      </LessonSection>

      <LessonSection title="Human annotation in the Langfuse UI">
        <p className="text-slate-300">
          Open any trace in the dashboard and click <strong className="text-white">Add Score</strong>. Reviewers
          can rate without writing code — useful for weekly QA batches. Filter traces with no score yet, sample
          50 per week, and build a human-reviewed quality baseline.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Scores attach quality ratings to traces or individual observations (spans/generations).',
          'langfuse.score() records user thumbs, human review, or automated eval results from code.',
          'Boolean for pass/fail (thumbs); numeric for graded metrics (faithfulness 0–1).',
          'Use observation-level scores to pinpoint which step failed in multi-step RAG/agent pipelines.',
        ]}
      />
    </LessonArticle>
  )
}
