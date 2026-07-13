import {
  Callout,
  CodeBlock,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function AdvancedWorkflows() {
  return (
    <LessonArticle>
      <LessonSection title="Beyond download-and-run">
        <p className="text-slate-300">
          Production llama.cpp users rarely stop at pre-built GGUF files from Hugging Face. This lesson covers the
          advanced pipeline: convert your own models, merge LoRA adapters, custom quantization, and a brief look at
          distributed RPC inference.
        </p>
      </LessonSection>

      <LessonSection title="convert-hf-to-gguf.py — Hugging Face to GGUF">
        <p className="text-slate-300">
          The conversion script lives in the llama.cpp repo under{' '}
          <code className="font-mono text-sm">convert_hf_to_gguf.py</code>. It reads PyTorch/safetensors weights and
          emits a <code className="font-mono text-sm">.gguf</code> file llama.cpp can load.
        </p>
        <CodeBlock title="Convert a Hugging Face model">{`# Clone llama.cpp and install Python deps
git clone https://github.com/ggerganov/llama.cpp
cd llama.cpp
pip install -r requirements.txt

# Convert (FP16 intermediate — quantize in next step)
python convert_hf_to_gguf.py \\
  /path/to/huggingface-model \\
  --outfile ./models/my-model-f16.gguf \\
  --outtype f16`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">--outtype</strong> — f16 for intermediate; q8_0 or leave quant to{' '}
            <code className="font-mono text-sm">llama-quantize</code>.
          </li>
          <li>
            <strong className="text-white">Custom architectures</strong> — check llama.cpp docs; new models land
            quickly but may need a recent commit.
          </li>
          <li>
            <strong className="text-white">Tokenizer included</strong> — GGUF bundles vocab and chat template
            metadata.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Merge LoRA into base weights">
        <p className="text-slate-300">
          Serving a LoRA adapter separately is not always supported. The common path:{' '}
          <strong className="text-white">merge LoRA into base weights</strong>, then convert to GGUF.
        </p>
        <CodeBlock title="Merge with Hugging Face PEFT">{`from peft import PeftModel
from transformers import AutoModelForCausalLM, AutoTokenizer

base = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.1-8B-Instruct")
model = PeftModel.from_pretrained(base, "/path/to/lora-adapter")
merged = model.merge_and_unload()

merged.save_pretrained("./merged-model")
AutoTokenizer.from_pretrained("meta-llama/Llama-3.1-8B-Instruct").save_pretrained("./merged-model")`}</CodeBlock>
        <CodeBlock title="Then convert merged weights">{`python convert_hf_to_gguf.py ./merged-model \\
  --outfile ./models/my-lora-merged-f16.gguf`}</CodeBlock>
        <Callout variant="tip">
          llama.cpp also supports runtime LoRA via <code className="font-mono text-sm">--lora</code> flags on some
          builds — merging is simpler for deployment and Ollama import.
        </Callout>
      </LessonSection>

      <LessonSection title="Custom quantization with llama-quantize">
        <p className="text-slate-300">
          After FP16 GGUF conversion, <code className="font-mono text-sm">llama-quantize</code> produces smaller,
          faster variants. You control the exact quant recipe — unlike pre-built Hub files.
        </p>
        <CodeBlock title="Quantize to Q4_K_M">{`./build/bin/llama-quantize \\
  ./models/my-model-f16.gguf \\
  ./models/my-model-Q4_K_M.gguf \\
  Q4_K_M`}</CodeBlock>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">When to use</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Q4_K_M', 'Default production quant — size/speed/quality balance'],
                ['Q5_K_M', 'When Q4 quality fails on your eval set'],
                ['Q8_0', 'Near-full precision, still smaller than F16'],
                ['IQ2_XXS / IQ3_XXS', 'Extreme compression — always validate quality'],
              ].map(([type, when]) => (
                <tr key={type} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{type}</td>
                  <td className="px-4 py-3 text-slate-400">{when}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="llama.cpp RPC — distributed inference (brief)">
        <p className="text-slate-300">
          <strong className="text-white">RPC</strong> splits a model across machines: a{' '}
          <code className="font-mono text-sm">rpc-server</code> on a remote host holds GPU layers; your local{' '}
          <code className="font-mono text-sm">llama-cli</code> or <code className="font-mono text-sm">llama-server</code>{' '}
          offloads compute over the network. Useful when one machine lacks enough VRAM but you have a small GPU farm
          on a LAN — not a replacement for vLLM tensor parallel at datacenter scale.
        </p>
        <CodeBlock title="RPC sketch">{`# On GPU worker machine
./build/bin/rpc-server -H 0.0.0.0 -p 50052

# On client — offload layers to remote
./build/bin/llama-cli \\
  -m ./models/70B-Q4_K_M.gguf \\
  -ngl 0 \\
  --rpc 192.168.1.10:50052`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>Network latency hurts tg throughput — best on fast local networks.</li>
          <li>Experimental for many setups; test with llama-bench before production.</li>
          <li>For 100+ concurrent users, prefer vLLM TP/PP over DIY RPC.</li>
        </ul>
      </LessonSection>

      <LessonSection title="End-to-end advanced pipeline">
        <CodeBlock title="Full workflow">{`1. Fine-tune or download HF model
2. (Optional) merge LoRA with PEFT
3. convert_hf_to_gguf.py → F16 GGUF
4. llama-quantize → Q4_K_M GGUF
5. llama-bench → validate pp/tg
6. llama-server → deploy
7. (Optional) import into Ollama via Modelfile`}</CodeBlock>
      </LessonSection>

      <Callout variant="beginner">
        Master the convert → quantize → bench loop once. After that, every new model or fine-tune follows the same
        recipe — no dependency on third-party GGUF uploads.
      </Callout>

      <KeyTakeaways
        items={[
          'convert_hf_to_gguf.py turns Hugging Face weights into GGUF — the gateway to custom models.',
          'Merge LoRA before conversion for simplest deployment; runtime --lora is an alternative on supported builds.',
          'llama-quantize lets you pick exact quant types — benchmark each on your hardware and prompts.',
          'RPC splits layers across LAN machines for VRAM pooling — niche; vLLM wins at datacenter concurrency.',
        ]}
      />
    </LessonArticle>
  )
}
