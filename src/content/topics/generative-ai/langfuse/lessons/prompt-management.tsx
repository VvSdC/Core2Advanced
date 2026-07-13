import {
  Callout,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PromptManagement() {
  return (
    <LessonArticle>
      <LessonSection title="Why prompts in code are a trap">
        <p className="text-slate-300">
          Most teams start with prompts as Python strings in Git. That works until someone edits a line, deploys,
          and nobody notices quality dropped. There is no version number on a string — just a silent regression.
        </p>
        <div className="mt-4 space-y-3">
          {[
            ['No version history', 'Git blame shows who changed it, not which version ran in production on Tuesday.'],
            ['No A/B testing', 'Comparing "old prompt" vs "new prompt" requires redeploying code, not a label flip.'],
            ['No trace link', 'When a user complains, you cannot see which prompt version produced that answer.'],
          ].map(([problem, detail]) => (
            <div key={problem} className="rounded-xl border border-surface-600 bg-surface-800/50 p-4">
              <p className="text-sm font-semibold text-white">{problem}</p>
              <p className="mt-1 text-sm text-slate-400">{detail}</p>
            </div>
          ))}
        </div>
        <Callout variant="insight">
          Langfuse Prompt Management moves prompts to a central UI with versions, labels, and automatic linking to
          traces — so you can ship prompt changes without shipping new application code.
        </Callout>
      </LessonSection>

      <LessonSection title="Create and version prompts in the UI">
        <ContentStep number={1} title="Create a prompt in Langfuse">
          <p>
            In the Langfuse dashboard, go to <strong className="text-white">Prompts</strong> and create a new prompt
            (e.g. <code className="font-mono text-sm">support-rag-answer</code>). Paste your system and user
            template with <code className="font-mono text-sm">{'{{context}}'}</code> and{' '}
            <code className="font-mono text-sm">{'{{question}}'}</code> placeholders. Each save creates a new
            version (v1, v2, v3…).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Labels — production vs staging">
          <p>
            Pin a label like <code className="font-mono text-sm">production</code> to version 3 and{' '}
            <code className="font-mono text-sm">staging</code> to version 4. Your app fetches by label — flip
            staging to production in the UI when you are ready, no redeploy required.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Review diffs before promoting">
          <p>
            Compare v3 vs v4 side by side in the UI. See exactly what changed before you move the production
            label.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Fetch at runtime with the SDK">
        <p className="text-slate-300">
          At request time, fetch the prompt by name and label. Langfuse returns the compiled template and links
          every generation to that prompt version automatically.
        </p>
        <Example
          title="Fetch prompt and link to generation"
        >{`from langfuse import Langfuse

langfuse = Langfuse()

# Fetch "production" label — cached locally after first call
prompt = langfuse.get_prompt("support-rag-answer", label="production")

# Compile with runtime variables
compiled = prompt.compile(context=chunks, question=user_query)

# Use compiled messages in your LLM call
# Langfuse links this generation to prompt version + name
generation = langfuse.start_generation(
    name="rag-answer",
    model="gpt-4o",
    prompt=prompt,  # links trace to prompt v3
    input=compiled,
)
# ... call OpenAI, then generation.end(output=answer)`}</Example>
        <Callout variant="tip">
          Pass the <code className="font-mono text-sm">prompt</code> object into{' '}
          <code className="font-mono text-sm">start_generation</code> (or use LangChain callback handlers) so
          every trace shows <em>which prompt version</em> ran — essential for debugging regressions.
        </Callout>
      </LessonSection>

      <LessonSection title="Caching — no extra latency">
        <p className="text-slate-300">
          Fetching a prompt on every request sounds slow. It is not — the SDK caches prompts in memory after the
          first fetch. Subsequent calls read from cache (milliseconds). You can set a TTL or call{' '}
          <code className="font-mono text-sm">langfuse.get_prompt(..., cache_ttl_seconds=300)</code> to refresh
          periodically without hitting the API every time.
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Typical latency impact</div>
          <div className="mt-2 font-mono text-slate-300 space-y-1">
            <div>First request (cold): ~50–100ms (one API call)</div>
            <div>All later requests (cached): ~0ms</div>
          </div>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Hard-coded prompts cause silent regressions — no version, no trace link, no safe rollback.',
          'Create prompts in Langfuse UI; version each edit; use labels (production/staging) for deployment.',
          'Fetch with langfuse.get_prompt(name, label) at runtime and pass prompt into generations for trace linking.',
          'SDK caches prompts locally — no meaningful latency added after the first fetch.',
        ]}
      />
    </LessonArticle>
  )
}
