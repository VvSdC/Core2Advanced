import {
  Callout,
  ContentStep,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function EvaluatorsAndLlmAsJudge() {
  return (
    <LessonArticle>
      <LessonSection title="Connect to Evaluating RAG">
        <p className="text-slate-300">
          In <em>RAG → Evaluating RAG</em> you learned metrics like{' '}
          <strong className="text-white">faithfulness</strong> (is the answer grounded in retrieved context?) and{' '}
          <strong className="text-white">answer relevancy</strong> (does it address the question?). LangSmith
          evaluators run those same checks automatically — on datasets during experiments and on live production
          traces.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">RAG metric</th>
                <th className="px-4 py-3">What it checks</th>
                <th className="px-4 py-3">LangSmith built-in</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Faithfulness', 'Answer supported by context chunks?', 'LLM-as-judge faithfulness template'],
                ['Answer relevancy', 'Answer addresses the user question?', 'Relevance evaluator template'],
                ['Correctness', 'Matches expected output (if provided)?', 'String match / LLM judge'],
              ].map(([metric, check, builtin]) => (
                <tr key={metric} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>
                  <td className="px-4 py-3 text-slate-400">{check}</td>
                  <td className="px-4 py-3 text-genai-400">{builtin}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Built-in evaluator templates">
        <p className="text-slate-300">
          LangSmith ships 30+ evaluator templates you can attach to experiments or online evals without writing
          code. Pick from the UI or import pre-built evaluators in Python.
        </p>
        <ContentStep number={1} title="Common templates">
          <p>
            <strong className="text-white">Faithfulness</strong>,{' '}
            <strong className="text-white">answer relevancy</strong>,{' '}
            <strong className="text-white">conciseness</strong>,{' '}
            <strong className="text-white">hallucination</strong>, and{' '}
            <strong className="text-white">criteria</strong> (score against custom rubric). Each uses an LLM to
            judge the output — hence "LLM-as-judge."
          </p>
        </ContentStep>
        <ContentStep number={2} title="Attach to evaluate()">
          <p>
            Pass evaluators to <code className="font-mono text-sm">evaluate()</code> when running experiments.
            Every dataset row gets scored automatically; results appear in the comparison view.
          </p>
        </ContentStep>
        <Flowchart
          title="LLM-as-judge flow"
          chart={`flowchart LR
  A[Chain output + context] --> B[Judge LLM prompt]
  B --> C[Score 0–1 + reasoning]
  C --> D[Stored on trace / experiment row]`}
        />
      </LessonSection>

      <LessonSection title="Custom evaluators in Python">
        <p className="text-slate-300">
          Built-in templates cover common cases. For domain-specific rules — JSON schema checks, keyword presence,
          regex patterns — write a custom evaluator function.
        </p>
        <Example title="Custom evaluator function">{`from langsmith.schemas import Run, Example

def has_citation(run: Run, example: Example) -> dict:
    """Score 1 if answer contains a source citation."""
    output = run.outputs.get("answer", "")
    score = 1.0 if "[Source:" in output else 0.0
    return {"key": "has_citation", "score": score}

# Use in evaluate()
results = evaluate(
    chain.invoke,
    data="support-rag-golden-set",
    evaluators=[has_citation, faithfulness_evaluator],
)`}</Example>
        <Callout variant="tip">
          Combine <strong className="text-white">code evaluators</strong> (cheap, deterministic) with{' '}
          <strong className="text-white">LLM-as-judge</strong> (nuanced, expensive). Use code for hard rules;
          use judges for subjective quality.
        </Callout>
      </LessonSection>

      <LessonSection title="When to use which evaluator">
        <div className="mt-4 space-y-3">
          {[
            ['Code check', 'Output is valid JSON, contains required field', 'Every row — fast and free'],
            ['LLM-as-judge', 'Answer is helpful and grounded', 'Sample 10–20% in production; all rows offline'],
            ['Human annotation', 'Subjective tone or brand voice', 'Weekly QA queue (next lesson)'],
          ].map(([type, example, when]) => (
            <div key={type} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{type}</p>
              <p className="mt-1 text-sm text-slate-400">{example}</p>
              <p className="mt-1 text-xs text-genai-400">{when}</p>
            </div>
          ))}
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'LangSmith evaluators implement the same RAG metrics you learned in Evaluating RAG.',
          '30+ built-in templates: faithfulness, relevance, conciseness, hallucination, and more.',
          'Write custom Python evaluators for domain rules; combine with LLM-as-judge for nuance.',
          'Attach evaluators to evaluate() for offline experiments or online production scoring.',
        ]}
      />
    </LessonArticle>
  )
}
