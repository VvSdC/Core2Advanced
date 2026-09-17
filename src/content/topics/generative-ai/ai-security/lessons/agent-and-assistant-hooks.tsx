import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../components/content'

export function AgentAndAssistantHooks() {
  return (
    <LessonArticle>
      <Definition term="Hooks">
        <p>
          A <strong className="text-white">hook</strong> is a small piece of your own code that an agent runtime
          runs automatically at a fixed point in its loop — when a session starts, when a prompt is submitted,
          <em> before</em> a tool runs, or <em>after</em> it returns. The runtime pauses, hands your code the event
          data, and waits for a verdict.
        </p>
        <p className="mt-2 text-slate-300">
          The key property: a <span className="text-genai-400">pre-tool hook is deterministic</span>. Unlike a
          system-prompt instruction (&ldquo;please don&apos;t run destructive commands&rdquo;) which the model may
          ignore, a hook is code — if it says <em>deny</em>, the action does not happen. Full stop.
        </p>
      </Definition>

      <Callout variant="beginner" title="Prompt vs hook — the one-line difference">
        Telling the model &ldquo;never run <code>rm -rf</code>&rdquo; is a <em>request</em>. A pre-tool hook that
        rejects any command containing <code>rm -rf</code> is a <em>guarantee</em>. Guardrails for agents are built
        out of hooks precisely because hooks are non-negotiable.
      </Callout>

      <LessonSection title="Why agents need hooks">
        <p className="text-slate-300">
          A chatbot only produces text. An <strong className="text-white">agent</strong> produces actions: it edits
          files, runs shell commands, calls APIs, opens pull requests. The moment a model can act, three problems
          appear that no amount of prompting fully solves:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Irreversibility</strong> — some actions (delete, force-push, drop table) cannot be undone.</li>
          <li><strong className="text-white">Non-determinism</strong> — the same prompt can produce a safe plan today and a risky one tomorrow.</li>
          <li><strong className="text-white">Untrusted input</strong> — content the agent reads (a file, a web page, a tool result) may itself contain injected instructions.</li>
        </ul>
        <p className="mt-3 text-slate-300">
          Hooks are where you insert deterministic control between the model&apos;s <em>intent</em> and the
          system&apos;s <em>action</em>.
        </p>
        <Flowchart
          title="The hook sits between intent and action"
          chart={`flowchart LR
  M[Model decides: run a tool] --> PRE[Pre-tool hook]
  PRE -->|allow| EXE[Tool executes]
  PRE -->|deny + reason| BACK[Reason returned to model]
  EXE --> POST[Post-tool hook]
  POST --> NEXT[Next model step]
  BACK --> NEXT`}
        />
      </LessonSection>

      <LessonSection title="The lifecycle events you can hook">
        <p className="text-slate-300">
          Names differ between runtimes, but the events line up almost one-to-one. These are the control points you
          will see in Claude Code, GitHub Copilot, and agent SDKs alike.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-200">
                <th className="py-2 pr-4">Event</th>
                <th className="py-2 pr-4">Fires</th>
                <th className="py-2 pr-4">Can block?</th>
                <th className="py-2">Typical use</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Session start</td>
                <td className="py-2 pr-4">Session begins / resumes</td>
                <td className="py-2 pr-4">No</td>
                <td className="py-2">Inject context, show a policy banner, env checks</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Prompt submit</td>
                <td className="py-2 pr-4">User sends a prompt</td>
                <td className="py-2 pr-4">Yes</td>
                <td className="py-2">Redact secrets, block disallowed asks, add context</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Pre-tool use</td>
                <td className="py-2 pr-4">Before any tool runs</td>
                <td className="py-2 pr-4"><strong className="text-white">Yes</strong></td>
                <td className="py-2">Deny dangerous commands, gate side effects — the powerful one</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Post-tool use</td>
                <td className="py-2 pr-4">After a tool succeeds</td>
                <td className="py-2 pr-4">Feedback only</td>
                <td className="py-2">Format code, lint, run tests, scan output, add context</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-white">Stop / session end</td>
                <td className="py-2 pr-4">Turn or session finishes</td>
                <td className="py-2 pr-4">Sometimes</td>
                <td className="py-2">Completion checks, cleanup, audit logging</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Pre-tool is the security workhorse">
          Almost every agent security guardrail — blocking destructive commands, enforcing supply-chain rules,
          requiring approval — is a <strong>pre-tool</strong> hook, because it is the only place you can stop an
          action <em>before</em> it happens and hand the model a reason to try a safer path.
        </Callout>
      </LessonSection>

      <LessonSection title="How a hook communicates a decision">
        <p className="text-slate-300">
          The contract is simple and consistent across tools: the runtime sends the event as JSON on{' '}
          <code>stdin</code>, and your hook replies through its <strong className="text-white">exit code</strong> or
          a small JSON object on <code>stdout</code>.
        </p>
        <ContentStep number={1} title="Read the event">
          <p className="text-slate-300">
            You receive the tool name and its arguments — e.g. <code>{'{ tool: "Bash", input: { command: "..." } }'}</code>.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decide">
          <p className="text-slate-300">Run whatever logic you like: regex, an allowlist, a SAST scanner, even another model.</p>
        </ContentStep>
        <ContentStep number={3} title="Reply">
          <p className="text-slate-300">
            Exit <code>0</code> to allow; a non-zero code (or a JSON <code>deny</code>) to block and return a reason
            the agent can read and react to.
          </p>
        </ContentStep>
        <Example title="A minimal pre-tool guard (shell)">{`#!/usr/bin/env bash
# Reads the tool event JSON from stdin, blocks destructive shell commands.
payload="$(cat)"
cmd="$(echo "$payload" | jq -r '.tool_input.command // empty')"

if echo "$cmd" | grep -Eq 'rm -rf /|mkfs|dd if=|git push --force|DROP TABLE'; then
  echo "Blocked: irreversible/destructive command." >&2
  exit 2          # non-zero => deny; stderr becomes the reason shown to the model
fi
exit 0            # allow`}</Example>
        <Callout variant="tip" title="Untrusted input flows through hooks too">
          Your hook receives model- and tool-generated strings. Quote variables, avoid <code>eval</code>, and never
          pass raw payloads into a shell. A careless guard script can itself become the injection vector it was
          meant to stop.
        </Callout>
      </LessonSection>

      <LessonSection title="Hooks vs the other control layers">
        <p className="text-slate-300">
          Hooks are one layer of agent safety. They pair with the others rather than replacing them:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Instructions / system prompt</strong> — soft guidance the model usually follows.</li>
          <li><strong className="text-white">Permission modes</strong> — the runtime asks the user before risky actions.</li>
          <li><strong className="text-white">Hooks</strong> — deterministic code that can override both, even in &ldquo;auto-approve&rdquo; modes.</li>
          <li><strong className="text-white">Sandboxing</strong> — containers, restricted filesystems, network egress limits underneath it all.</li>
        </ul>
        <Callout variant="tip" title="Defense in depth, again">
          Instructions reduce how often the model <em>tries</em> something risky; hooks guarantee what happens{' '}
          <em>when</em> it does; the sandbox limits the blast radius if everything else fails.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A hook is your code that the agent runtime runs at a fixed lifecycle point — and a pre-tool hook is deterministic: deny means the action never runs.',
          'Agents need hooks because actions are irreversible, non-deterministic, and can be triggered by untrusted input a prompt cannot fully guard.',
          'Common events: session start, prompt submit, pre-tool use (the security workhorse), post-tool use, and stop/session end.',
          'The contract is uniform: event JSON in via stdin, decision out via exit code or a small JSON verdict with a reason.',
          'Hooks complement instructions, permission modes, and sandboxing — layers, not substitutes.',
        ]}
      />
    </LessonArticle>
  )
}
