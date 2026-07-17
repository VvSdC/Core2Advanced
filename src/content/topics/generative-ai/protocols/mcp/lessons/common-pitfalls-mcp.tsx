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

export function CommonPitfallsMcp() {
  return (
    <LessonArticle>
      <Definition term="Common MCP pitfalls">
        <p>
          Most MCP pain is not “JSON-RPC is hard.” It is fuzzy roles, oversized tools, skipped security, and
          assuming every host/SDK matches last month’s tutorial.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: USB failures are often wrong cable, missing driver, or power draw — not “electricity is
          broken.” Diagnose the layer.
        </p>
      </Definition>

      <Callout variant="beginner" title="Debug mantra">
        Transport up? Initialize OK? Tool listed? Policy allow? Args valid? Then blame the model.
      </Callout>

      <LessonSection title="Pitfall catalog">
        <ContentStep number={1} title="Mega-tool syndrome">
          <p className="text-slate-300">
            One tool that runs arbitrary SQL/shell is easy to demo and impossible to secure or evaluate.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Skipping initialize checks">
          <p className="text-slate-300">
            Calling tools before capabilities are negotiated leads to flaky “works on my machine” hosts.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tool name collisions">
          <p className="text-slate-300">
            Multiple servers exporting <span className="font-mono text-sm text-genai-400">search</span>{' '}
            confuse routers and models.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Secrets in prompts">
          <p className="text-slate-300">
            Pasting API keys into chat instead of server env/config guarantees leaks into logs and transcripts.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Trusting the model as a firewall">
          <p className="text-slate-300">
            Prompt injection can steer tool choice. Host policy must block dangerous calls regardless of model
            intent.
          </p>
        </ContentStep>
        <ContentStep number={6} title="Pinned tutorial rot">
          <p className="text-slate-300">
            Transports and SDK APIs evolve. Copy-pasting old snippets without reading the{' '}
            <strong className="text-white">current MCP spec</strong> wastes days.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Symptom → likely layer">
        <Flowchart
          title="Failure triage"
          chart={`flowchart TB
  A[Tool missing in UI] --> B[Config / spawn / initialize]
  C[Call errors always] --> D[Schema / auth / server bug]
  E[Works then vanishes] --> F[Process crash / list changed]
  G[Wrong side effect] --> H[Policy / wrong server / collision]
  I[Model never calls tool] --> J[Description / too many tools / prompt]`}
        />
        <Example title="False blame">
{`User: "Claude is broken"
Reality: stdio server exited on missing env var
Fix: log stderr; surface initialize failure in host UI`}
        </Example>
      </LessonSection>

      <LessonSection title="Prevention habits">
        <Flowchart
          title="Healthy MCP loop"
          chart={`flowchart TB
  A[Small tools] --> B[Allowlists]
  B --> C[Tests for list + call]
  C --> D[Versioned schemas]
  D --> E[Observability]
  E --> A`}
        />
        <Callout variant="tip" title="Write a smoke test">
          Automate: connect → initialize → tools/list contains X → tools/call X with fixture args → assert
          result shape.
        </Callout>
        <Callout variant="insight" title="Jargon: smoke test">
          A <strong className="text-white">smoke test</strong> is a quick “is the pipe on fire?” check — not
          full coverage, but catches dead servers fast.
        </Callout>
      </LessonSection>

      <LessonSection title="Recovery playbook">
        <p className="text-slate-300">
          When MCP breaks in production, walk the stack top to bottom. Skipping layers is how teams burn days
          tuning prompts while a dead stdio process is the real culprit.
        </p>
        <ContentStep number={1} title="Reset the connection">
          <p className="text-slate-300">
            Restart the host, confirm the server process is running, and re-read stderr from the last initialize
            attempt.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shrink the problem">
          <p className="text-slate-300">
            Disable all servers except one. Call a single known tool with fixture args. Add servers back one at
            a time to find collisions or auth failures.
          </p>
        </ContentStep>
        <Flowchart
          title="Five-minute recovery"
          chart={`flowchart TB
  A[Symptom] --> B[Check transport + process]
  B --> C[Re-run initialize]
  C --> D[tools/list expected tool?]
  D --> E[Direct tools/call in isolation]
  E --> F[Re-enable policy + other servers]`}
        />
        <Example title="Post-incident habit">
{`Add: automated smoke test in CI
Add: host UI surfacing initialize errors
Add: semver + changelog on server rename
→ pitfall becomes visible before users hit chat`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Triage by layer: transport, handshake, list, policy, args, then model.',
          'Avoid mega-tools, collisions, and secrets-in-chat.',
          'Never use the LLM as your only authorization layer.',
          'Re-check current MCP specs/SDKs; tutorials go stale.',
        ]}
      />
    </LessonArticle>
  )
}
