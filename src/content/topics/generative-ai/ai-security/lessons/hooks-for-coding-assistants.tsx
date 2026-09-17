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

export function HooksForCodingAssistants() {
  return (
    <LessonArticle>
      <Definition term="Hooks for coding assistants">
        <p>
          AI coding assistants like <strong className="text-white">Claude Code</strong> and{' '}
          <strong className="text-white">GitHub Copilot</strong> can edit files and run shell commands on a
          developer&apos;s machine. Both expose <strong className="text-white">hooks</strong> — JSON-configured
          scripts that fire on lifecycle events — so a security or platform team can enforce policy deterministically,
          without trusting the model to behave.
        </p>
        <p className="mt-2 text-slate-300">
          This is exactly how you build guardrails for <span className="text-genai-400">AI developer workflows</span>:
          block irreversible commands, stop supply-chain attacks, redact secrets and PII, and run static analysis on
          every edit — all at the <code>preToolUse</code> / <code>PostToolUse</code> boundary.
        </p>
      </Definition>

      <Callout variant="beginner" title="Same idea, two dialects">
        You learned the generic hook lifecycle last lesson. Claude Code and Copilot implement the very same events —
        they just spell them differently and read config from different files. Learn one, and the other is a
        translation.
      </Callout>

      <LessonSection title="Side-by-side: where config lives and what fires">
        <div className="mt-2 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-200">
                <th className="py-2 pr-4"></th>
                <th className="py-2 pr-4">Claude Code</th>
                <th className="py-2">GitHub Copilot</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Project config</td>
                <td className="py-2 pr-4"><code>.claude/settings.json</code></td>
                <td className="py-2"><code>.github/hooks/*.json</code></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Personal config</td>
                <td className="py-2 pr-4"><code>~/.claude/settings.json</code></td>
                <td className="py-2"><code>~/.copilot/hooks/*.json</code></td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Org-enforced</td>
                <td className="py-2 pr-4">Managed settings</td>
                <td className="py-2">Policy hooks (admin, cannot be disabled)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Before a tool runs</td>
                <td className="py-2 pr-4"><code>PreToolUse</code> (can block)</td>
                <td className="py-2"><code>preToolUse</code> (can deny)</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">After a tool runs</td>
                <td className="py-2 pr-4"><code>PostToolUse</code> (feedback)</td>
                <td className="py-2">—</td>
              </tr>
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">On prompt</td>
                <td className="py-2 pr-4"><code>UserPromptSubmit</code></td>
                <td className="py-2"><code>userPromptSubmitted</code></td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-white">On session start</td>
                <td className="py-2 pr-4"><code>SessionStart</code></td>
                <td className="py-2"><code>sessionStart</code></td>
              </tr>
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="Policy hooks are the enterprise superpower">
          Copilot&apos;s <strong>policy hooks</strong> load before all others and cannot be turned off by
          <code> disableAllHooks</code> or folder-trust settings. That is how a security team ships a
          non-removable guardrail to every engineer&apos;s machine — the developer cannot opt out.
        </Callout>
      </LessonSection>

      <LessonSection title="Claude Code: block destructive commands">
        <p className="text-slate-300">
          Claude Code hooks are the <em>only</em> deterministic control in the tool: a <code>PreToolUse</code> hook
          that denies a call blocks it even in <code>bypassPermissions</code> mode. Register a matcher on the{' '}
          <code>Bash</code> tool and point it at a guard script.
        </p>
        <Example title=".claude/settings.json">{`{
  "hooks": {
    "PreToolUse": [
      {
        "matcher": "Bash",
        "hooks": [
          { "type": "command", "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/guard.sh", "timeout": 5 }
        ]
      }
    ],
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          { "type": "command", "command": "\\"$CLAUDE_PROJECT_DIR\\"/.claude/hooks/scan.sh" }
        ]
      }
    ]
  }
}`}</Example>
        <p className="text-slate-300">
          The guard reads the event JSON on <code>stdin</code>. Two ways to reply: exit code <code>2</code> to block
          (stderr becomes the reason), or print a JSON verdict for fine-grained control.
        </p>
        <Example title=".claude/hooks/guard.sh — exit-code style">{`#!/usr/bin/env bash
event="$(cat)"
cmd="$(echo "$event" | jq -r '.tool_input.command // empty')"

# Irreversible / destructive operations
if echo "$cmd" | grep -Eq 'rm -rf (/|~)|git push .*--force|DROP TABLE|mkfs|dd if='; then
  echo "Blocked: irreversible command. Use a reversible alternative or ask a human." >&2
  exit 2
fi
exit 0`}</Example>
        <Example title="…or a JSON verdict (allow / deny / ask)">{`# printed on stdout instead of using exit codes
{
  "hookSpecificOutput": {
    "hookEventName": "PreToolUse",
    "permissionDecision": "deny",
    "permissionDecisionReason": "curl | bash download-and-run is not allowed"
  }
}`}</Example>
      </LessonSection>

      <LessonSection title="GitHub Copilot: the same guard, Copilot dialect">
        <p className="text-slate-300">
          Copilot loads hooks from <code>.github/hooks/*.json</code>. A <code>preToolUse</code> hook receives the{' '}
          <code>toolName</code> and JSON-encoded <code>toolArgs</code>, and returns a decision. Put it under version
          control in the repo and it applies to everyone working in that repo.
        </p>
        <Example title=".github/hooks/security.json">{`{
  "version": 1,
  "hooks": {
    "preToolUse": [
      { "run": "./.github/hooks/deny-dangerous.sh" }
    ],
    "sessionStart": [
      { "run": "echo 'Org policy: destructive & supply-chain-risky commands are blocked.'" }
    ]
  }
}`}</Example>
        <Example title=".github/hooks/deny-dangerous.sh">{`#!/usr/bin/env bash
event="$(cat)"
name="$(echo "$event" | jq -r '.toolName')"
args="$(echo "$event" | jq -r '.toolArgs | tostring')"

if [ "$name" = "bash" ]; then
  if echo "$args" | grep -Eq 'sudo |curl .*\\| *sh|wget .*\\| *sh|rm -rf /|mkfs|dd if='; then
    echo '{"permissionDecision":"deny","reason":"High-risk command blocked by org policy."}'
    exit 0
  fi
fi
# print nothing / allow
exit 0`}</Example>
        <Callout variant="tip" title="Test enforcement on background agents too">
          Enforcement can differ between the interactive assistant and cloud / sub-agent execution. Always verify
          your deny rule actually fires in <em>every</em> execution path your org uses — don&apos;t assume a repo
          hook covers background agents.
        </Callout>
      </LessonSection>

      <LessonSection title="The four guardrails you actually ship">
        <p className="text-slate-300">
          These map directly to real supply-chain and data-protection requirements for AI-assisted development.
        </p>
        <ContentStep number={1} title="Block irreversible commands (pre-tool)">
          <p className="text-slate-300">
            Deny <code>rm -rf</code>, force-pushes, <code>DROP TABLE</code>, disk operations. The cheapest, highest-value
            guard — pure deterministic pattern matching.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stop software supply-chain attacks (pre-tool)">
          <p className="text-slate-300">
            Block <code>curl … | bash</code> download-and-run, installs from unpinned or untrusted registries, and
            edits to lockfiles or CI config that introduce unknown dependencies. This is where an agent is most
            easily tricked into pulling malicious packages.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Redact PII &amp; secrets in real time (prompt + post-tool)">
          <p className="text-slate-300">
            On <code>UserPromptSubmit</code>, strip API keys, tokens, and personal data before they reach the model
            or your logs. On <code>PostToolUse</code>, scan tool output for the same before it re-enters context.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Run static analysis on every edit (post-tool)">
          <p className="text-slate-300">
            Hook <code>Edit|Write</code> to a SAST/secret scanner (e.g. semgrep, a secret detector). If it flags
            insecure code, feed the finding back so the assistant fixes it in the same turn.
          </p>
        </ContentStep>
        <Flowchart
          title="A layered coding-assistant guardrail"
          chart={`flowchart TB
  P[Prompt submitted] --> RED[Redact secrets/PII]
  RED --> MODEL[Assistant plans an action]
  MODEL --> PRE{Pre-tool hook}
  PRE -->|irreversible / supply-chain| DENY[Deny + reason]
  PRE -->|safe| RUN[Run tool: edit / bash]
  RUN --> POST[Post-tool hook]
  POST --> SAST[SAST + secret scan]
  SAST -->|clean| DONE[Continue]
  SAST -->|finding| FIX[Return finding -> assistant fixes]`}
        />
      </LessonSection>

      <LessonSection title="Rollout tips">
        <ul className="mt-1 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Log before you block.</strong> Ship in observe-only mode first, watch what would have been denied, then enforce.</li>
          <li><strong className="text-white">Keep pre-tool hooks fast.</strong> They run synchronously and add latency to every action — set tight timeouts.</li>
          <li><strong className="text-white">Give a useful reason.</strong> The deny message is fed back to the model; a good reason lets it self-correct instead of retrying blindly.</li>
          <li><strong className="text-white">Enforce centrally.</strong> Use policy/managed hooks so developers can&apos;t silently disable the guardrail.</li>
          <li><strong className="text-white">Harden the hook itself.</strong> Quote inputs, avoid <code>eval</code>; the hook processes untrusted, model-generated strings.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Claude Code (.claude/settings.json) and GitHub Copilot (.github/hooks/*.json) expose the same hook lifecycle in different dialects.',
          'Pre-tool hooks are deterministic: Claude Code blocks even in bypassPermissions mode; Copilot policy hooks cannot be disabled by users.',
          'Reply via exit code 2 (stderr = reason) or a JSON verdict (allow / deny / ask) with a human-readable reason the model can act on.',
          'Four high-value guardrails: block irreversible commands, stop supply-chain attacks, redact PII/secrets, and run SAST on every edit.',
          'Roll out observe-first, keep hooks fast, return actionable reasons, enforce centrally, and harden the hook against injection.',
        ]}
      />
    </LessonArticle>
  )
}
