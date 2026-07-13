import {
  Callout,
  CodeBlock,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function FirstRunCli() {
  return (
    <LessonArticle>
      <LessonSection title="Your first command">
        <p className="text-slate-300">
          <code className="font-mono text-sm">llama-cli</code> is the fastest way to run a GGUF model locally.
          You need two things: a built <code className="font-mono text-sm">llama-cli</code> binary and a{' '}
          <code className="font-mono text-sm">.gguf</code> model file. The three flags you will use every day
          are <code className="font-mono text-sm">-m</code> (model), <code className="font-mono text-sm">-p</code>{' '}
          (prompt), and <code className="font-mono text-sm">-n</code> (how many tokens to generate).
        </p>
        <CodeBlock title="Minimal first run">{`llama-cli -m ./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \\
  -p "What is llama.cpp in one sentence?" \\
  -n 64`}</CodeBlock>
        <Callout variant="beginner" title="Flag cheat sheet">
          <code className="font-mono text-sm">-m</code> model path ·{' '}
          <code className="font-mono text-sm">-p</code> prompt text ·{' '}
          <code className="font-mono text-sm">-n</code> max tokens to predict ·{' '}
          <code className="font-mono text-sm">-c</code> context size ·{' '}
          <code className="font-mono text-sm">-ngl</code> GPU layers
        </Callout>
      </LessonSection>

      <LessonSection title="One-shot generation — complete examples">
        <p className="text-slate-300">
          One-shot mode runs a single prompt and exits. Add GPU offload and sampling flags as needed.
        </p>
        <ContentStep number={1} title="Factual Q&A (deterministic)">
          <CodeBlock title="Low temperature for facts">{`llama-cli -m model.gguf \\
  -p "List three benefits of local LLM inference." \\
  -n 150 \\
  --temp 0.2 \\
  -ngl 99`}</CodeBlock>
        </ContentStep>

        <ContentStep number={2} title="Creative writing">
          <CodeBlock title="Higher temperature">{`llama-cli -m model.gguf \\
  -p "Write a haiku about compiling C++ at midnight." \\
  -n 80 \\
  --temp 0.9 \\
  --top-p 0.95`}</CodeBlock>
        </ContentStep>

        <ContentStep number={3} title="Longer output with context">
          <CodeBlock title="Set context and token limit">{`llama-cli -m model.gguf \\
  -c 4096 \\
  -p "Summarize the history of transformer models." \\
  -n 512 \\
  --repeat-penalty 1.1`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interactive chat mode">
        <p className="text-slate-300">
          Omit <code className="font-mono text-sm">-p</code> or pass <code className="font-mono text-sm">--interactive</code>{' '}
          to enter a REPL-style chat. The model applies the chat template from the GGUF metadata (for
          instruct models). Type your message, press Enter, and read the streamed reply.
        </p>
        <Example title="Start interactive chat">{`llama-cli -m ./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \\
  -c 4096 \\
  -ngl 99 \\
  --color

# Inside the session:
# > Hello! What can you help me with?
# (model streams response)
# > /exit   or Ctrl+C to quit`}</Example>
        <Callout variant="tip">
          Use an <strong className="text-white">-Instruct</strong> or chat-tuned GGUF for interactive mode.
          Base models without chat templates will not follow conversation format correctly.
        </Callout>
      </LessonSection>

      <LessonSection title="Useful flags for daily work">
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Flag</th>
                <th className="px-4 py-3">What it does</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['-m / --model', 'Path to .gguf file (required)'],
                ['-p / --prompt', 'Input text for one-shot mode'],
                ['-n / --predict', 'Max tokens to generate (default 128)'],
                ['-c / --ctx-size', 'Context window in tokens'],
                ['-ngl / --n-gpu-layers', 'Layers to offload to GPU'],
                ['-t / --threads', 'CPU threads for non-GPU layers'],
                ['--temp', 'Sampling temperature'],
                ['-s / --seed', 'Random seed for reproducible output'],
                ['-v / --verbose', 'Print timing and memory stats'],
              ].map(([flag, desc]) => (
                <tr key={flag} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-xs text-genai-400">{flag}</td>
                  <td className="px-4 py-3 text-slate-400">{desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="End-to-end workflow">
        <p className="text-slate-300">
          Here is a practical sequence from download to chatting — copy, adjust paths, and run.
        </p>
        <CodeBlock title="Full beginner workflow">{`# 1. Download a small instruct model (example)
huggingface-cli download bartowski/Llama-3.2-3B-Instruct-GGUF \\
  Llama-3.2-3B-Instruct-Q4_K_M.gguf --local-dir ./models

# 2. Quick test
llama-cli -m ./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \\
  -p "Say hello in three languages." -n 100 -ngl 99

# 3. Open interactive chat
llama-cli -m ./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \\
  -c 4096 -ngl 99 --color

# 4. Check performance
llama-cli -m ./models/Llama-3.2-3B-Instruct-Q4_K_M.gguf \\
  -p "Test" -n 1 -v`}</CodeBlock>
        <Callout variant="insight" title="If nothing prints">
          Confirm the GGUF path is correct, try <code className="font-mono text-sm">-n 128</code> or higher,
          and add <code className="font-mono text-sm">-v</code> to see whether the model loaded. OOM errors
          mean you need a smaller quant, lower <code className="font-mono text-sm">-c</code>, or fewer{' '}
          <code className="font-mono text-sm">-ngl</code> layers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Minimum run: llama-cli -m model.gguf -p "prompt" -n 64.',
          'Use -ngl 99 for full GPU offload when VRAM allows; -c sets context window size.',
          'Omit -p or use --interactive for multi-turn chat with instruct models.',
          'Add -v to debug load times; lower quant or n_ctx if you hit out-of-memory errors.',
        ]}
      />
    </LessonArticle>
  )
}
