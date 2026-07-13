import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function QuantizationDeepDive() {
  return (
    <LessonArticle>
      <LessonSection title="Why GGUF quantization exists">
        <p className="text-slate-300">
          llama.cpp runs models from <strong className="text-white">GGUF</strong> files — a format that stores
          weights in compressed numeric formats called <strong className="text-white">quants</strong>. A 7B
          model in FP16 needs ~14 GB of RAM; the same model in Q4_K_M needs ~4.5 GB. That difference is what
          makes local inference possible on a laptop.
        </p>
        <Definition term="Quantization (in llama.cpp)">
          <p>
            Replacing 16-bit floating-point weights with lower-bit integers (4-bit, 5-bit, 8-bit). Each quant
            type uses a different compression strategy — some blocks use uniform 4-bit storage (Q4_0), others
            mix bit widths per layer (K-quants) for better quality at the same file size.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="Core quant types you will see">
        <p className="text-slate-300">
          Hugging Face repos often list dozens of GGUF variants. These five families cover 90% of real-world
          choices:
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Quant</th>
                <th className="px-4 py-3">Bits (approx)</th>
                <th className="px-4 py-3">7B size</th>
                <th className="px-4 py-3">Quality</th>
                <th className="px-4 py-3">Best for</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Q4_0', '4.5', '~3.8 GB', 'Good', 'Fastest 4-bit; older baseline'],
                ['Q4_K_M', '4.8', '~4.4 GB', 'Very good', 'Default sweet spot for most users'],
                ['Q5_K_M', '5.5', '~5.1 GB', 'Excellent', 'When you have extra RAM and want quality'],
                ['Q8_0', '8.5', '~7.7 GB', 'Near-FP16', 'Production quality on 16 GB machines'],
                ['IQ quants', '2–4', '~2–4 GB', 'Varies', 'Extreme compression (IQ2_XXS, IQ3_M, IQ4_XS)'],
              ].map(([quant, bits, size, quality, best]) => (
                <tr key={quant} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{quant}</td>
                  <td className="px-4 py-3 text-slate-400">{bits}</td>
                  <td className="px-4 py-3 text-slate-400">{size}</td>
                  <td className="px-4 py-3 text-slate-400">{quality}</td>
                  <td className="px-4 py-3 text-slate-400">{best}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="What does K mean?">
          <strong className="text-white">K-quants</strong> (Q4_K_M, Q5_K_M) use mixed bit widths — attention
          and feed-forward layers get more bits than less sensitive weights. The suffix{' '}
          <code className="font-mono text-sm">_M</code> means &quot;medium&quot; mix;{' '}
          <code className="font-mono text-sm">_S</code> is smaller/faster,{' '}
          <code className="font-mono text-sm">_L</code> is larger/higher quality.
        </Callout>
      </LessonSection>

      <LessonSection title="IQ quants — import quantisation">
        <p className="text-slate-300">
          <strong className="text-white">IQ (Import Quantisation)</strong> pushes compression further using
          importance matrices and non-uniform codebooks. Files like{' '}
          <code className="font-mono text-sm">IQ2_XXS</code> or <code className="font-mono text-sm">IQ3_M</code>{' '}
          can run a 7B model on 8 GB RAM with room left for context — at the cost of more hallucination on
          math, code, and long reasoning chains.
        </p>
        <CodeBlock title="Download a specific quant from Hugging Face">{`# Example: grab Q4_K_M variant
huggingface-cli download bartowski/Llama-3.2-3B-Instruct-GGUF \\
  Llama-3.2-3B-Instruct-Q4_K_M.gguf --local-dir ./models`}</CodeBlock>
        <Callout variant="beginner">
          Start with <strong className="text-white">Q4_K_M</strong>. Only drop to IQ quants if Q4_K_M does not
          fit in RAM. Only go up to Q5_K_M or Q8_0 if you notice quality problems on your actual prompts.
        </Callout>
      </LessonSection>

      <LessonSection title="Quality vs size tradeoffs">
        <p className="text-slate-300">
          Lower quants are not equally bad at every task. Creative writing often survives Q4; structured JSON
          output, multi-step math, and code generation degrade faster as bits drop. Always test on{' '}
          <em>your</em> prompts, not benchmark scores alone.
        </p>
        <Flowchart
          title="Which quant should I pick?"
          chart={`flowchart TD
  A[How much RAM do you have?] -->|8 GB or less| B[Try Q4_K_M or IQ3_M]
  A -->|16 GB| C[Q4_K_M or Q5_K_M]
  A -->|32 GB+| D[Q5_K_M or Q8_0]
  B --> E{Quality OK on your tasks?}
  C --> E
  D --> E
  E -->|Yes| F[Use that quant]
  E -->|No, too small| G[Step up one level: Q4→Q5→Q8]
  E -->|No, too large| H[Step down or try IQ quants]`}
        />
      </LessonSection>

      <LessonSection title="Decision table — quick reference">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Your situation</th>
                <th className="px-4 py-3">Recommended quant</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['First time running any local model', 'Q4_K_M'],
                ['8 GB laptop, need long context', 'Q4_K_M or IQ3_M'],
                ['Coding / JSON / tool use', 'Q5_K_M minimum'],
                ['16 GB RAM, general chat', 'Q4_K_M or Q5_K_M'],
                ['Maximum quality, RAM not a concern', 'Q8_0 or F16'],
                ['Embedding model or tiny device', 'IQ2_XXS / IQ3_S'],
                ['Apple Silicon (Metal)', 'Q4_K_M — Metal kernels are well optimized'],
              ].map(([situation, rec]) => (
                <tr key={situation} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-300">{situation}</td>
                  <td className="px-4 py-3 font-semibold text-white">{rec}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GGUF quants trade file size and RAM for output quality — Q4_K_M is the default starting point.',
          'K-quants (Q4_K_M, Q5_K_M) mix bit widths per layer and usually beat plain Q4_0 at the same size.',
          'IQ quants squeeze models into very small RAM but hurt math, code, and reasoning tasks.',
          'Pick quant based on your RAM budget and real prompt tests, not filename alone.',
        ]}
      />
    </LessonArticle>
  )
}
