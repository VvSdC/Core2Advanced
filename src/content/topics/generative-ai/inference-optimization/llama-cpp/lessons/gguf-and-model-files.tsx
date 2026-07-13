import {
  Callout,
  CodeBlock,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function GgufAndModelFiles() {
  return (
    <LessonArticle>
      <Definition term="GGUF">
        <p>
          <strong className="text-white">GGUF</strong> (GPT-Generated Unified Format) is the standard file format
          for running models with llama.cpp. One <code className="font-mono text-sm">.gguf</code> file contains
          model weights, architecture metadata, tokenizer data, and quantization info — everything needed to load
          and run inference without PyTorch or HuggingFace at runtime.
        </p>
        <p>
          Think of GGUF as a self-contained &quot;LLM cartridge&quot; — plug it into llama.cpp and go. No separate
          config files, no Python environment, no 50 GB of scattered checkpoints.
        </p>
      </Definition>

      <LessonSection title="How GGUF replaced GGML files">
        <p className="text-slate-300">
          Early llama.cpp used <strong className="text-white">.ggml</strong> binaries. As models grew and
          quantization matured, the format was redesigned for clarity, extensibility, and single-file distribution.
          GGUF became the default around 2023. You will still hear &quot;GGML&quot; in conversation — it now usually
          means the <em>tensor library</em> inside llama.cpp, not the old file extension.
        </p>

        <Flowchart
          title="Evolution of local model files"
          chart={`flowchart LR
  PT[PyTorch .bin / .safetensors] --> C[Convert with convert script]
  C --> GGUF[Single .gguf file]
  GGUF --> L[llama.cpp loads directly]
  OLD[Legacy .ggml] -.-> GGUF[Replaced by GGUF]`}
        />

        <Callout variant="insight">
          Most users never convert models themselves. Community publishers on HuggingFace upload ready-made GGUF
          files — you download and run.
        </Callout>
      </LessonSection>

      <LessonSection title="What is inside a GGUF file?">
        <ContentStep number={1} title="Tensor weights">
          <p className="text-slate-300">
            Billions of numbers arranged in layers (attention, feed-forward, embeddings). Quantized versions store
            these in 4-bit, 5-bit, or 8-bit integers instead of 16-bit floats — smaller file, slightly lower quality.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Architecture metadata">
          <p className="text-slate-300">
            Hidden size, number of layers, attention head count, RoPE settings — tells llama.cpp which model code path
            to use (Llama 3, Mistral, Qwen, etc.) without guessing.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Tokenizer">
          <p className="text-slate-300">
            Vocabulary and merge rules so text ↔ tokens works correctly. A broken tokenizer means gibberish output
            even with perfect weights.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Downloading from HuggingFace">
        <p className="text-slate-300">
          <strong className="text-white">HuggingFace</strong> hosts model repositories. For llama.cpp you want repos
          that publish <code className="font-mono text-sm">.gguf</code> files — often uploaded by community
          quantizers, not the original model author.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-lg font-semibold text-white">TheBloke</div>
            <div className="mt-1 text-xs text-slate-400">Legendary GGUF publisher (archived but files remain)</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>Thousands of models in every quantization</li>
              <li>Consistent naming: model-name-GGUF repo</li>
              <li>Search HuggingFace for &quot;TheBloke&quot; + model name</li>
            </ul>
          </div>
          <div className="rounded-xl border border-genai-500/30 bg-genai-500/5 p-4">
            <div className="text-lg font-semibold text-white">bartowski</div>
            <div className="mt-1 text-xs text-slate-400">Active community quantizer</div>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
              <li>High-quality quants for newest models (Llama 3, Qwen, etc.)</li>
              <li>Often first GGUF source for new releases</li>
              <li>Imatrix-based quants for better Q4 quality</li>
            </ul>
          </div>
        </div>

        <Example
          title="Typical download workflow"
          caption="Use huggingface-cli, browser download, or Ollama pull (which fetches GGUF internally)."
        >{`# Browser: huggingface.co/bartowski/Meta-Llama-3.1-8B-Instruct-GGUF
# Pick one file, e.g. Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf

huggingface-cli download bartowski/Meta-Llama-3.1-8B-Instruct-GGUF \\
  Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \\
  --local-dir ./models`}</Example>
      </LessonSection>

      <LessonSection title="Decoding file names — Q4_K_M and friends">
        <p className="text-slate-300">
          GGUF filenames look intimidating. They are a compact spec sheet. Example:{' '}
          <code className="font-mono text-sm">llama-3.2-3b-instruct-q4_k_m.gguf</code>
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Part of name</th>
                <th className="px-4 py-3">Meaning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['llama-3.2-3b', 'Base model family and size (3 billion parameters)'],
                ['instruct', 'Fine-tuned for chat / instructions (vs raw base model)'],
                ['q4', '4-bit quantization — ~4× smaller than FP16'],
                ['k', 'K-quant method — mixed bit widths per tensor for quality'],
                ['_m', 'Medium variant — balance of size vs quality within Q4_K'],
                ['.gguf', 'File format for llama.cpp'],
              ].map(([part, meaning]) => (
                <tr key={part} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-sm text-genai-400">{part}</td>
                  <td className="px-4 py-3 text-slate-400">{meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <ContentStep number={1} title="Common quant levels (beginner picks)">
          <ul className="list-disc space-y-2 pl-5 text-slate-300">
            <li>
              <strong className="text-white">Q4_K_M</strong> — default sweet spot for most laptops; good quality, ~4 GB
              for 7B
            </li>
            <li>
              <strong className="text-white">Q5_K_M</strong> — slightly larger, noticeably better for complex reasoning
            </li>
            <li>
              <strong className="text-white">Q8_0</strong> — near-original quality, much bigger; use if RAM allows
            </li>
            <li>
              <strong className="text-white">Q2_K</strong> — tiny and fast but quality suffers; emergency low-RAM only
            </li>
          </ul>
        </ContentStep>

        <ContentStep number={2} title="Rough size guide (7B model)">
          <ul className="list-disc space-y-1 pl-5 text-slate-300">
            <li>FP16 original: ~14 GB</li>
            <li>Q4_K_M: ~4.1 GB</li>
            <li>Q8_0: ~7.5 GB</li>
          </ul>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Choosing the right file for your machine">
        <Flowchart
          title="Which GGUF should I download?"
          chart={`flowchart TB
  S[Start] --> R{How much RAM/VRAM?}
  R -- 8 GB --> Q4[Q4_K_M or smaller model 3B]
  R -- 16 GB --> Q4M[Q4_K_M 7B–8B]
  R -- 32 GB+ --> Q5[Q5_K_M or Q8_0 13B+]
  Q4 --> RUN[llama.cpp -m file.gguf]
  Q4M --> RUN
  Q5 --> RUN`}
        />

        <CodeBlock title="Run your downloaded GGUF">{`./llama-cli -m ./models/Meta-Llama-3.1-8B-Instruct-Q4_K_M.gguf \\
  -p "Summarize what GGUF means in two sentences." \\
  -n 100`}</CodeBlock>

        <Callout variant="tip" title="License reminder">
          Many models require accepting a license on HuggingFace (Llama, Gemma, etc.) before download. GGUF repos
          still inherit the base model&apos;s terms — read the model card.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GGUF is a single self-contained file format for llama.cpp — weights, config, and tokenizer included.',
          'It replaced legacy .ggml files; community quantizers publish ready-to-run GGUF on HuggingFace.',
          'TheBloke and bartowski are trusted sources for pre-quantized models.',
          'Filenames encode size and quant: Q4_K_M is the usual beginner choice for 7B on 16 GB machines.',
          'Match quant level to your RAM/VRAM — smaller file is not always better if quality collapses.',
        ]}
      />
    </LessonArticle>
  )
}
