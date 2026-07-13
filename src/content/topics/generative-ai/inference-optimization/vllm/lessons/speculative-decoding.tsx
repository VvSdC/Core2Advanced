import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function SpeculativeDecoding() {
  return (
    <LessonArticle>
      <LessonSection title="Decode is sequential — unless you cheat">
        <p className="text-slate-300">
          Autoregressive decoding generates one token at a time; each step waits for the previous. That serial loop
          caps throughput. <strong className="text-white">Speculative decoding</strong> uses a small{' '}
          <strong className="text-white">draft model</strong> to propose several tokens ahead, then a large{' '}
          <strong className="text-white">target model</strong> verifies them in parallel. Accepted tokens skip
          expensive target-model steps.
        </p>
        <Definition term="Speculative decoding">
          <p>
            A fast draft model generates K candidate tokens. The target model runs one forward pass to validate all
            K tokens. Matching tokens are accepted in bulk; on mismatch, generation resumes from the first rejected
            token. Net speedup when the draft model agrees with the target often enough.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="How the draft/target dance works">
        <ContentStep number={1} title="Draft proposes">
          <p className="text-slate-300">
            A small model (e.g., Llama-3.2-1B) quickly generates 4–8 candidate tokens using its own weights.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Target verifies">
          <p className="text-slate-300">
            The large model (e.g., Llama-3.1-70B) evaluates all draft tokens in a single batched forward pass —
            checking whether it would have produced the same tokens.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Accept or rollback">
          <p className="text-slate-300">
            Accepted tokens are emitted immediately. On the first mismatch, discard remaining draft tokens and
            continue from the target model's correction — no quality loss vs standard decoding when implemented
            correctly.
          </p>
        </ContentStep>
        <Flowchart
          title="Speculative decoding loop"
          chart={`flowchart TD
  D[Draft model — fast] --> T[Propose tokens t1..tk]
  T --> V[Target model — one forward pass]
  V --> A{All match?}
  A -->|Yes| E[Emit k tokens — big speedup]
  A -->|No| R[Emit tokens until mismatch]
  R --> D`}
        />
      </LessonSection>

      <LessonSection title="Enabling speculative decoding in vLLM">
        <CodeBlock title="Draft model configuration">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-70B-Instruct \\
  --speculative-model meta-llama/Llama-3.2-1B-Instruct \\
  --num-speculative-tokens 5 \\
  --tensor-parallel-size 4`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">speculative-model</strong> — smaller model from same family when
            possible (shared tokenizer, aligned distributions).
          </li>
          <li>
            <strong className="text-white">num-speculative-tokens</strong> — how many tokens to draft per round;
            too high wastes verification work if acceptance rate is low.
          </li>
          <li>
            <strong className="text-white">VRAM cost</strong> — both models load in memory; draft model overhead
            is small relative to 70B target.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="When speedup appears — and when it does not">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Factor</th>
                <th className="px-4 py-3">Higher acceptance → faster</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Draft/target alignment', 'Same model family, similar training data'],
                ['Task type', 'Predictable text (summaries) vs creative/open-ended'],
                ['Temperature', 'Low temperature → higher acceptance rate'],
                ['Draft model size', 'Too small → low acceptance; too large → draft not fast enough'],
                ['Batch size', 'Spec decode helps most at batch=1 interactive decode'],
              ].map(([factor, effect]) => (
                <tr key={factor} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{factor}</td>
                  <td className="px-4 py-3 text-slate-400">{effect}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip">
          Typical speedups: <strong className="text-white">1.5×–2.5×</strong> on decode-heavy workloads when draft
          and target are well matched. Measure acceptance rate in vLLM logs — if below ~60%, try a larger draft or
          fewer speculative tokens.
        </Callout>
      </LessonSection>

      <Callout variant="beginner">
        Speculative decoding preserves output quality (same distribution as target model) — it is not an
        approximation like quantization. The tradeoff is extra VRAM for the draft model and tuning overhead.
      </Callout>

      <KeyTakeaways
        items={[
          'Draft model proposes tokens; target model verifies in one pass — accepted tokens skip serial decode steps.',
          'Enable with --speculative-model and tune --num-speculative-tokens for your acceptance rate.',
          'Best on decode-bound workloads with aligned draft/target pairs and moderate temperature.',
          'No quality loss when correct — measure acceptance rate and end-to-end TPOT to validate speedup.',
        ]}
      />
    </LessonArticle>
  )
}
