import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function PerformanceTuning() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Tune one knob at a time">
        llama.cpp has many flags. Change one setting, measure tokens/sec or latency, then move on. Randomly stacking
        flags makes it hard to know what helped.
      </Callout>

      <LessonSection title="Threads (-t)">
        <Definition term="CPU threads">
          <p>
            <code className="font-mono text-sm">-t</code> sets how many CPU threads run matrix math for layers on
            CPU (and some helper work). Too few threads underuse the CPU; too many can hurt due to overhead.
          </p>
        </Definition>
        <Example title="Typical thread count">{`# Physical cores (not hyperthreads) is a good starting point
./llama-cli -m model.gguf -p "Hello" -t 8 -ngl 35

# 16-core desktop — try 8–12
./llama-server -m model.gguf --port 8080 -t 10 -ngl 99`}</Example>
        <p className="mt-4 text-slate-300">
          On Apple Silicon or high-core-count servers, experiment between{' '}
          <code className="font-mono text-sm">physical_cores</code> and{' '}
          <code className="font-mono text-sm">physical_cores - 2</code> to leave headroom for the OS.
        </p>
      </LessonSection>

      <LessonSection title="Batch size (-b)">
        <p className="text-slate-300">
          <code className="font-mono text-sm">-b</code> is the <strong className="text-white">logical batch size</strong>{' '}
          for prompt processing (prefill). Higher values can speed up long prompts and parallel workloads on GPU,
          but use more memory. Default is often 512 or 2048 depending on build.
        </p>
        <CodeBlock title="When to adjust batch">{`-b 512   # conservative — less VRAM spike during prefill
-b 2048  # faster prefill on GPU when VRAM allows
-b 4096  # server with long RAG prompts and plenty of VRAM`}</CodeBlock>
        <Callout variant="insight">
          Batch size mainly affects <em>prefill</em> (processing the prompt). Decode speed (tokens/sec while
          streaming) is more sensitive to <code className="font-mono text-sm">-ngl</code>, quant, and GPU class.
        </Callout>
      </LessonSection>

      <LessonSection title="Context size (-c)">
        <p className="text-slate-300">
          <code className="font-mono text-sm">-c</code> sets the maximum context length in tokens. Larger context
          means a bigger KV cache — linearly more memory. Only raise it if you actually need long prompts or chat
          history.
        </p>
        <Example title="Match context to your use case">{`# Short Q&A chatbot
./llama-server -m model.gguf -c 4096 -ngl 99

# Long-document RAG
./llama-server -m model.gguf -c 16384 -ngl 99 -b 2048`}</Example>
      </LessonSection>

      <LessonSection title="Memory mapping and locking">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">mmap (default on)</strong> — Maps the GGUF file from disk instead of
            loading it all into RAM at once. Faster startup, OS pages in weights on demand. Disable with{' '}
            <code className="font-mono text-sm">--no-mmap</code> only if you hit platform-specific issues.
          </li>
          <li>
            <strong className="text-white">mlock (--mlock)</strong> — Locks mapped pages in RAM so the OS cannot
            swap them to disk. Reduces latency spikes on memory-constrained machines but requires enough free RAM.
          </li>
        </ul>
        <CodeBlock title="mmap vs mlock">{`# Default: mmap on — good for most users
./llama-server -m model.gguf --port 8080

# Low-latency local server with enough RAM
./llama-server -m model.gguf --port 8080 --mlock`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Flash attention">
        <p className="text-slate-300">
          <strong className="text-white">Flash attention</strong> (when enabled in your build with{' '}
          <code className="font-mono text-sm">-fa</code> or <code className="font-mono text-sm">--flash-attn</code>)
          reduces memory and can speed up attention on supported GPUs. Requires a CUDA build with flash-attn support
          — not available on all platforms.
        </p>
        <Example title="Enable when supported">{`./llama-server -m model.gguf --port 8080 -ngl 99 -fa`}</Example>
        <Callout variant="tip">
          If the flag is ignored or errors, your binary may not include flash attention. Rebuild with the right CMake
          flags or use a prebuilt release that lists FA support.
        </Callout>
      </LessonSection>

      <LessonSection title="Practical tuning workflow">
        <ContentStep number={1} title="Establish baseline">
          <p>
            Run a fixed prompt with defaults. Note tokens/sec from the log or time a 200-token generation.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Maximize GPU offload">
          <p>
            Raise <code className="font-mono text-sm">-ngl</code> until VRAM is full without OOM. This usually gives
            the biggest win.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Tune CPU and batch">
          <p>
            Adjust <code className="font-mono text-sm">-t</code> for remaining CPU layers. Raise{' '}
            <code className="font-mono text-sm">-b</code> if prefill on long prompts is slow and VRAM allows.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Right-size context">
          <p>
            Lower <code className="font-mono text-sm">-c</code> if you do not need huge windows — frees memory for
            more <code className="font-mono text-sm">-ngl</code> or concurrent users.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Optional polish">
          <p>
            Try <code className="font-mono text-sm">--mlock</code> for stable latency,{' '}
            <code className="font-mono text-sm">-fa</code> on supported GPUs, and a faster quant only after measuring
            quality impact.
          </p>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          '-t sets CPU threads — start near physical core count.',
          '-b affects prefill batch size; higher can speed long prompts but uses more VRAM.',
          '-c caps context length — larger -c means more KV cache memory.',
          'mmap (default) speeds load; mlock prevents swapping when RAM is sufficient.',
          'Tune -ngl first, then threads/batch/context; enable flash attention only on supported builds.',
        ]}
      />
    </LessonArticle>
  )
}
