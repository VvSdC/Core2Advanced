import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SamplingAndDecoding() {
  return (
    <LessonArticle>
      <LessonSection title="From logits to words — what sampling means">
        <p className="text-slate-300">
          After each forward pass, the model outputs a score for every token in its vocabulary — the{' '}
          <strong className="text-white">logits</strong>. Sampling turns those scores into one chosen token.
          llama.cpp exposes this through CLI flags on <code className="font-mono text-sm">llama-cli</code> and{' '}
          <code className="font-mono text-sm">llama-server</code>. Tweaking them changes creativity,
          repetition, and output structure.
        </p>
        <Definition term="Decoding strategy">
          <p>
            The rule for picking the next token. <strong className="text-white">Greedy</strong> always picks the
            highest score (temperature 0). <strong className="text-white">Stochastic</strong> sampling adds
            randomness so outputs vary between runs — controlled by temperature, top-k, top-p, and min-p.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Temperature — creativity dial">
        <p className="text-slate-300">
          <code className="font-mono text-sm">--temp</code> scales logits before softmax. Low temperature
          sharpens the distribution (more deterministic); high temperature flattens it (more random, creative,
          sometimes incoherent).
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Temperature</th>
                <th className="px-4 py-3">Behavior</th>
                <th className="px-4 py-3">Use case</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['0.0', 'Greedy — same output every run', 'Code, JSON, factual Q&A'],
                ['0.7', 'Balanced default for chat', 'General conversation'],
                ['1.0+', 'Very creative, higher risk', 'Brainstorming, fiction'],
              ].map(([temp, behavior, use]) => (
                <tr key={temp} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-genai-400">{temp}</td>
                  <td className="px-4 py-3 text-slate-400">{behavior}</td>
                  <td className="px-4 py-3 text-slate-400">{use}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="top_k, top_p, and min_p — filter the candidates">
        <p className="text-slate-300">
          Raw sampling over 128k tokens is noisy. These filters restrict which tokens can be chosen:
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">top_k</strong> (<code className="font-mono text-sm">--top-k</code>) —
            only consider the K highest-scoring tokens. Default 40 is a solid starting point.
          </li>
          <li>
            <strong className="text-white">top_p</strong> (<code className="font-mono text-sm">--top-p</code>) —
            nucleus sampling: take the smallest set of tokens whose cumulative probability ≥ p. 0.9 is common.
          </li>
          <li>
            <strong className="text-white">min_p</strong> (<code className="font-mono text-sm">--min-p</code>) —
            drop tokens below min_p × highest token probability. Removes unlikely tail tokens; try 0.05.
          </li>
        </ul>
        <CodeBlock title="Balanced chat sampling">{`llama-cli -m model.gguf -p "Explain recursion simply" \\
  --temp 0.7 \\
  --top-k 40 \\
  --top-p 0.9 \\
  --min-p 0.05`}</CodeBlock>
        <Callout variant="tip">
          Use <strong className="text-white">top_p OR top_k</strong>, not necessarily both cranked up. Many
          users set top_k to 0 (disabled) and rely on top_p alone for cleaner results.
        </Callout>
      </LessonSection>

      <LessonSection title="repeat_penalty — stop the loops">
        <p className="text-slate-300">
          LLMs can get stuck repeating phrases.{' '}
          <code className="font-mono text-sm">--repeat-penalty</code> (default 1.1) down-weights tokens that
          already appeared. Values above 1.0 discourage repetition; 1.0 disables the penalty.
        </p>
        <CodeBlock title="Reduce repetition on long outputs">{`llama-cli -m model.gguf \\
  -p "Write a 500-word essay on..." \\
  -n 600 \\
  --repeat-penalty 1.15 \\
  --repeat-last-n 64`}</CodeBlock>
        <p className="mt-4 text-slate-300">
          <code className="font-mono text-sm">--repeat-last-n</code> limits how far back the penalty looks (64
          tokens by default). Increase for longer documents; decrease if the model avoids valid repeated terms
          (e.g. variable names in code).
        </p>
      </LessonSection>

      <LessonSection title="Grammar (GBNF) — constrain output shape">
        <p className="text-slate-300">
          <strong className="text-white">GBNF</strong> (GGML BNF) lets you force the model to emit only tokens
          matching a grammar — JSON, SQL, or custom formats. Pass a grammar file with{' '}
          <code className="font-mono text-sm">--grammar-file</code> or inline with{' '}
          <code className="font-mono text-sm">--grammar</code>.
        </p>
        <CodeBlock title="Simple JSON grammar (json.gbnf)">{`root   ::= object
object ::= "{" ws pair ("," ws pair)* "}" ws
pair   ::= string ":" ws value
value  ::= string | number
string ::= "\\"" [^"]* "\\""
number ::= [0-9]+
ws     ::= [ \\t\\n]*`}</CodeBlock>
        <CodeBlock title="Run with grammar constraint">{`llama-cli -m model.gguf \\
  -p "Return user data as JSON" \\
  --temp 0.2 \\
  --grammar-file json.gbnf`}</CodeBlock>
        <Flowchart
          title="Sampling pipeline per token"
          chart={`flowchart LR
  A[Model logits] --> B[Apply repeat penalty]
  B --> C[Divide by temperature]
  C --> D[Softmax to probabilities]
  D --> E[Filter: top_k / top_p / min_p]
  E --> F{Grammar active?}
  F -->|Yes| G[Mask illegal tokens]
  F -->|No| H[Sample token]
  G --> H`}
        />
        <Callout variant="beginner">
          For structured output, combine <strong className="text-white">low temperature (0–0.3)</strong> with a
          GBNF grammar. Sampling randomness fights grammar constraints and can slow generation.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Temperature controls randomness — 0 for deterministic, ~0.7 for chat, higher for creative writing.',
          'top_p, top_k, and min_p filter unlikely tokens before sampling; top_p 0.9 is a safe default.',
          'repeat_penalty (1.1–1.2) reduces loops; tune repeat-last-n for long-form or code.',
          'GBNF grammars constrain output to valid JSON or custom formats via --grammar-file.',
        ]}
      />
    </LessonArticle>
  )
}
