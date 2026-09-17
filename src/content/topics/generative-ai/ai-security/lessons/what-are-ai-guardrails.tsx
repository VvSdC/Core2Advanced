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

export function WhatAreAiGuardrails() {
  return (
    <LessonArticle>
      <Definition term="AI guardrails">
        <p>
          <strong className="text-white">Guardrails</strong> are the checks that sit <em>around</em> a model at run
          time — before the prompt reaches it, and after the model (or a tool it calls) produces output. They
          inspect, block, rewrite, or log traffic so that a system built on an unpredictable model behaves
          predictably enough to ship.
        </p>
        <p className="mt-2 text-slate-300">
          A model&apos;s weights give it <span className="text-genai-400">instincts</span>. Guardrails give the
          product <span className="text-genai-400">rules</span>. Instincts can be jailbroken, drift between model
          versions, or simply be wrong on the long tail. Rules are deterministic, auditable, and change without a
          training run.
        </p>
      </Definition>

      <Callout variant="beginner" title="A guardrail is just a checkpoint">
        Think of an airport. The plane (the model) can fly anywhere, but every passenger passes through security on
        the way in and customs on the way out. Guardrails are those checkpoints for text, tool calls, and actions.
      </Callout>

      <LessonSection title="Why alignment alone is not enough">
        <p className="text-slate-300">
          Safety fine-tuning (SFT, RLHF, Constitutional AI) makes harmful answers <em>less likely</em>. It cannot
          make them impossible. Three gaps remain no matter how well you train:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Jailbreaks.</strong> Clever prompts route around learned refusals. New
            attacks appear faster than you can retrain.
          </li>
          <li>
            <strong className="text-white">Policy lag.</strong> Your rules change on Monday; a new fine-tune takes
            weeks. A guardrail changes in minutes.
          </li>
          <li>
            <strong className="text-white">Real-world actions.</strong> When a model can call tools — run a shell
            command, hit an API, delete a file — a wrong answer is no longer just text. It has consequences.
          </li>
        </ul>
        <Callout variant="insight" title="Defense in depth">
          Trained instincts and run-time rules are complementary layers, not competitors. Alignment handles the
          nuanced common case; guardrails add hard stops for the sharp edges and a place to log everything.
        </Callout>
      </LessonSection>

      <LessonSection title="The three places a guardrail can sit">
        <p className="text-slate-300">
          Every guardrail lives at one of three checkpoints. Knowing which one you need is half the design work.
        </p>
        <ContentStep number={1} title="Input guardrails (before the model)">
          <p className="text-slate-300">
            Scan the incoming request. Catch prompt-injection attempts, off-topic or disallowed asks, and redact
            secrets or PII <em>before</em> they ever reach the model or get logged.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Output guardrails (after the model)">
          <p className="text-slate-300">
            Scan the generated answer. Block toxicity, filter leaked PII, verify the response is grounded in
            retrieved context, and enforce format or policy constraints before the user sees it.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tool / action guardrails (around side effects)">
          <p className="text-slate-300">
            Gate what the model is allowed to <em>do</em>. Allowlist which tools it can call, require approval for
            destructive commands, and check arguments (paths, SQL, shell) before execution.
          </p>
        </ContentStep>
        <Flowchart
          title="Where guardrails live in the request path"
          chart={`flowchart LR
  U[User request] --> IN[Input guardrail]
  IN -->|clean| M[LLM]
  IN -->|blocked| R1[Reject / rewrite]
  M --> TOOL{Wants a tool?}
  TOOL -->|yes| GATE[Tool guardrail]
  GATE -->|allow| EXE[Execute]
  GATE -->|deny| R2[Block + reason]
  TOOL -->|no| OUT[Output guardrail]
  EXE --> OUT
  OUT -->|clean| RESP[Response to user]
  OUT -->|violation| R3[Filter / regenerate]`}
        />
      </LessonSection>

      <LessonSection title="Deterministic vs model-based guardrails">
        <p className="text-slate-300">
          Guardrails come in two flavours, and good systems mix them. The choice is a trade-off between speed,
          cost, and how &ldquo;fuzzy&rdquo; the thing you are catching is.
        </p>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="border-b border-slate-700 text-slate-200">
                <th className="py-2 pr-4">Type</th>
                <th className="py-2 pr-4">How it works</th>
                <th className="py-2 pr-4">Great at</th>
                <th className="py-2">Weak at</th>
              </tr>
            </thead>
            <tbody className="text-slate-300">
              <tr className="border-b border-slate-800">
                <td className="py-2 pr-4 font-medium text-white">Deterministic</td>
                <td className="py-2 pr-4">Regex, allow/deny lists, schema and type checks, string rules</td>
                <td className="py-2 pr-4">Secrets, known-bad commands, exact formats — fast &amp; free</td>
                <td className="py-2">Meaning, paraphrases, novel attacks</td>
              </tr>
              <tr>
                <td className="py-2 pr-4 font-medium text-white">Model-based</td>
                <td className="py-2 pr-4">A classifier or small LLM judges the text (toxicity, injection, topic)</td>
                <td className="py-2 pr-4">Nuance, intent, fuzzy categories</td>
                <td className="py-2">Latency, cost, its own false positives</td>
              </tr>
            </tbody>
          </table>
        </div>
        <Example title="Same goal, two guardrails">{`# Deterministic: catch an obvious secret before it is logged
import re
AWS_KEY = re.compile(r"AKIA[0-9A-Z]{16}")
if AWS_KEY.search(user_input):
    block("Request contains what looks like an AWS access key.")

# Model-based: catch a jailbreak that no regex can describe
verdict = injection_classifier(user_input)   # -> {label: "attack", score: 0.97}
if verdict.label == "attack" and verdict.score > 0.8:
    block("Prompt-injection attempt detected.")`}</Example>
        <Callout variant="tip" title="Cheap first, smart second">
          Order your checks: run fast deterministic rules first and short-circuit on a hit. Only pay for a model
          classifier on the traffic that survives. This keeps latency and cost down for the 99% that is benign.
        </Callout>
      </LessonSection>

      <LessonSection title="What a guardrail does when it fires">
        <p className="text-slate-300">
          Blocking is only one option. A mature guardrail chooses a response proportional to the risk:
        </p>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Block</strong> — refuse and return a safe message (high-severity).</li>
          <li><strong className="text-white">Rewrite / redact</strong> — strip the PII, mask the secret, keep going.</li>
          <li><strong className="text-white">Regenerate</strong> — ask the model to try again with a stricter instruction.</li>
          <li><strong className="text-white">Ask</strong> — escalate to a human for approval (destructive actions).</li>
          <li><strong className="text-white">Log &amp; allow</strong> — permit but record for audit and later tuning.</li>
        </ul>
        <Callout variant="tip" title="Every guardrail has two failure modes">
          A <strong>false negative</strong> lets harm through; a <strong>false positive</strong> blocks a legitimate
          user. You cannot drive both to zero. Decide, per category, which error is more expensive and tune the
          threshold accordingly — then measure both.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Guardrails are run-time checks around the model — deterministic rules and auditable behavior on top of fuzzy model instincts.',
          'Alignment reduces harm; guardrails add hard stops, fast policy updates, and control over real-world actions.',
          'Three checkpoints: input (before the model), output (after the model), and tool/action (around side effects).',
          'Mix deterministic checks (fast, exact) with model-based checks (nuanced) — cheap first, smart second.',
          'A guardrail can block, redact, regenerate, ask a human, or log-and-allow — and every one trades false positives against false negatives.',
        ]}
      />
    </LessonArticle>
  )
}
