import {

  Callout,

  CodeBlock,

  Example,

  KeyTakeaways,

  LessonArticle,

  LessonSection,

} from '../../../../../../components/content'



export function BenchmarkingAndProfiling() {

  return (

    <LessonArticle>

      <LessonSection title="Measure before you tune">

        <p className="text-slate-300">

          llama.cpp ships <code className="font-mono text-sm">llama-bench</code> — a dedicated tool that reports

          prompt-processing (pp) and text-generation (tg) throughput in tokens per second. Without these numbers you

          are guessing which quant, GPU layer count, or context size actually helps.

        </p>

      </LessonSection>



      <LessonSection title="Running llama-bench">

        <CodeBlock title="Basic benchmark">{`# Build llama-bench alongside llama.cpp

cmake -B build && cmake --build build --config Release



./build/bin/llama-bench \\

  -m ./models/Llama-3.1-8B-Instruct-Q4_K_M.gguf \\

  -p 512 -n 128 \\

  -ngl 35`}</CodeBlock>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">

          <li>

            <strong className="text-white">-p</strong> — prompt tokens processed in the prefill (pp) phase.

          </li>

          <li>

            <strong className="text-white">-n</strong> — tokens generated in the decode (tg) phase.

          </li>

          <li>

            <strong className="text-white">-ngl</strong> — GPU layers offloaded; sweep 0, 20, 35, 99 to find the

            knee.

          </li>

          <li>

            <strong className="text-white">-b</strong> — batch size; affects prefill throughput on GPU.

          </li>

        </ul>

      </LessonSection>



      <LessonSection title="Reading pp and tg metrics">

        <div className="overflow-x-auto rounded-xl border border-surface-600">

          <table className="w-full text-sm text-slate-300">

            <thead>

              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">

                <th className="px-4 py-3">Metric</th>

                <th className="px-4 py-3">Phase</th>

                <th className="px-4 py-3">What it means</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-surface-600">

              {[

                ['pp (prompt processing)', 'Prefill', 'How fast the model ingests your prompt — matters for RAG and long context'],

                ['tg (text generation)', 'Decode', 'Tokens/sec while streaming — what users feel as "speed"'],

                ['t/s average', 'Both', 'Headline number; always check pp and tg separately'],

                ['n_kv', 'Memory', 'KV entries used — grows with context and parallel slots'],

              ].map(([metric, phase, meaning]) => (

                <tr key={metric} className="hover:bg-surface-800/50">

                  <td className="px-4 py-3 font-semibold text-white">{metric}</td>

                  <td className="px-4 py-3 text-genai-400">{phase}</td>

                  <td className="px-4 py-3 text-slate-400">{meaning}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

        <CodeBlock title="Sample llama-bench output (illustrative)">{`| model          |       size |     params | backend    | ngl | test       | t/s            |

| llama 8B Q4_K_M |   4.58 GiB |     8.03 B | CUDA       |  35 | pp 512     |  2847.12 ± 12  |

| llama 8B Q4_K_M |   4.58 GiB |     8.03 B | CUDA       |  35 | tg 128     |    89.45 ± 1   |`}</CodeBlock>

        <Callout variant="tip">

          RAG workloads are often <strong className="text-white">pp-bound</strong> (long retrieved context). Chat

          after a short prompt is <strong className="text-white">tg-bound</strong>. Optimize the phase that matches

          your app.

        </Callout>

      </LessonSection>



      <LessonSection title="Comparing quantizations">

        <p className="text-slate-300">

          Run the same benchmark across Q4_K_M, Q5_K_M, Q8_0, and IQ4_XS. Plot tg t/s vs model size and run a quick

          quality check on your prompts — not just MMLU.

        </p>

        <CodeBlock title="Sweep quants (shell loop)">{`for quant in Q4_K_M Q5_K_M Q8_0; do

  echo "=== $quant ==="

  ./build/bin/llama-bench \\

    -m "./models/Llama-3.1-8B-Instruct-\${quant}.gguf" \\

    -p 512 -n 128 -ngl 35

done`}</CodeBlock>

        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">

          <table className="w-full text-sm text-slate-300">

            <thead>

              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">

                <th className="px-4 py-3">Quant</th>

                <th className="px-4 py-3">Size</th>

                <th className="px-4 py-3">Typical tg speed</th>

                <th className="px-4 py-3">Quality</th>

              </tr>

            </thead>

            <tbody className="divide-y divide-surface-600">

              {[

                ['Q4_K_M', 'Smallest practical', 'Fastest', 'Good default for 8B chat'],

                ['Q5_K_M', 'Middle', 'Slightly slower', 'Better nuance on reasoning'],

                ['Q8_0', 'Larger', 'Slower, more VRAM', 'Near-FP16 for critical tasks'],

                ['IQ4_XS', 'Very small', 'Fast on CPU', 'Aggressive — test your use case'],

              ].map(([quant, size, speed, quality]) => (

                <tr key={quant} className="hover:bg-surface-800/50">

                  <td className="px-4 py-3 font-semibold text-white">{quant}</td>

                  <td className="px-4 py-3 text-slate-400">{size}</td>

                  <td className="px-4 py-3 text-genai-400">{speed}</td>

                  <td className="px-4 py-3 text-slate-400">{quality}</td>

                </tr>

              ))}

            </tbody>

          </table>

        </div>

      </LessonSection>



      <LessonSection title="Profiling in production">

        <Example title="Benchmark discipline">{`1. Fix hardware — same machine, driver, power mode

2. Warm up — one full run before recording

3. Change one knob — quant OR ngl OR -np per experiment

4. Record pp and tg separately, not just headline t/s

5. Store results with model hash, commit, and flags`}</Example>

        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">

          <li>

            <strong className="text-white">llama-server logs</strong> — periodic throughput lines under real load.

          </li>

          <li>

            <strong className="text-white">nvidia-smi dmon</strong> — GPU util vs memory bandwidth bottlenecks.

          </li>

          <li>

            <strong className="text-white">Compare CPU vs GPU</strong> —{' '}

            <code className="font-mono text-sm">-ngl 0</code> baseline before assuming GPU helps.

          </li>

        </ul>

      </LessonSection>



      <KeyTakeaways

        items={[

          'llama-bench reports pp (prefill) and tg (decode) tokens/sec — optimize the phase your app uses most.',

          'Sweep -ngl and quantization with the same -p/-n; record size, speed, and quality together.',

          'Q4_K_M is the usual starting quant; validate with your prompts before going smaller or larger.',

          'Change one variable per run and warm up — otherwise benchmarks lie.',

        ]}

      />

    </LessonArticle>

  )

}


