import {
  Callout,
  ContentStep,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function PlaygroundAndDebugging() {
  return (
    <LessonArticle>
      <LessonSection title="The Playground — re-run without redeploying">
        <p className="text-slate-300">
          The Langfuse <strong className="text-white">Playground</strong> lets you take a real trace, edit the
          prompt or model settings, and re-run with the <em>same inputs</em> — instantly. No code change, no
          deploy, no waiting for another user to hit the bug.
        </p>
        <Flowchart
          title="Trace → Playground flow"
          chart={`flowchart LR
  A[Bad trace in dashboard] --> B[Open in Playground]
  B --> C[Edit prompt / model / temp]
  C --> D[Re-run with same inputs]
  D --> E{Better?}
  E -- yes --> F[Save as new prompt version]
  E -- no --> C`}
        />
      </LessonSection>

      <LessonSection title="Jump from a bad trace to the Playground">
        <ContentStep number={1} title="Find the trace">
          <p>
            Search by userId, sessionId, low faithfulness score, or user thumbs down. Open the trace tree — see
            retrieval chunks, prompt sent, model output.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Click Open in Playground">
          <p>
            Langfuse pre-fills the generation with the exact prompt, variables, and model from that trace. You
            start from a perfect reproduction of the failure.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Edit and re-run">
          <p>
            Tweak the system prompt, change temperature, swap GPT-4o for mini, or fix a template variable. Hit run.
            Compare new output to the original side by side.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Save the fix">
          <p>
            When the output looks good, save as a new prompt version and promote the staging label after an
            experiment run.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Debug workflow for support tickets">
        <p className="text-slate-300">
          Support ticket: "Bot told me gift refunds take 60 days." Your workflow:
        </p>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="font-mono text-slate-300 space-y-2">
            <div>1. Find trace by user email + timestamp</div>
            <div>2. Check retrieval span — wrong chunks ranked first (general policy, not gifts)</div>
            <div>3. Open generation in Playground — model hallucinated 60 days (not in any chunk)</div>
            <div>4. Fix: add "only use context" instruction → re-run → grounded answer</div>
            <div>5. Save prompt v6, run dataset experiment, promote label</div>
            <div>6. Reply to user with correct policy + internal fix deployed</div>
          </div>
        </div>
        <Callout variant="insight">
          Without Langfuse, step 2–4 take hours of log archaeology. With trace + Playground, often under 15
          minutes.
        </Callout>
      </LessonSection>

      <LessonSection title="What to check in the trace tree">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Retrieval</strong> — were the right documents returned? Wrong chunks → fix embedding, k, or reranker.</li>
          <li><strong className="text-white">Prompt</strong> — which version and variables? Missing context placeholder → template bug.</li>
          <li><strong className="text-white">Generation</strong> — model, temperature, token count. High temp on factual task → lower it.</li>
          <li><strong className="text-white">Tool calls</strong> — did the agent call the right API with correct args?</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Playground re-runs a trace with edited prompt/model settings — same inputs, no redeploy.',
          'Open any bad trace in Playground to reproduce and fix failures in minutes.',
          'Support ticket workflow: find trace → inspect spans → fix in Playground → save prompt version.',
          'Check retrieval, prompt version, and generation settings before blaming "the model".',
        ]}
      />
    </LessonArticle>
  )
}