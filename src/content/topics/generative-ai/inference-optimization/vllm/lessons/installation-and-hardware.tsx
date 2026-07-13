import {
  Callout,
  CodeBlock,
  ContentStep,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function InstallationAndHardware() {
  return (
    <LessonArticle>
      <LessonSection title="What you need before installing">
        <p className="text-slate-300">
          vLLM is a <strong className="text-white">GPU-first</strong> inference engine. It compiles CUDA kernels
          at install time and expects an NVIDIA GPU with a recent driver. Plan your environment before running{' '}
          <code className="font-mono text-sm">pip install</code>.
        </p>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Python 3.9–3.12</strong> — vLLM does not support Python 3.8 or below.
            Use a virtual environment (<code className="font-mono text-sm">venv</code> or{' '}
            <code className="font-mono text-sm">conda</code>) so dependencies stay isolated.
          </li>
          <li>
            <strong className="text-white">NVIDIA GPU + driver</strong> — CUDA compute capability 7.0+ (V100, T4,
            A10, A100, H100, RTX 30xx/40xx). Check with{' '}
            <code className="font-mono text-sm">nvidia-smi</code>.
          </li>
          <li>
            <strong className="text-white">CUDA toolkit</strong> — vLLM wheels bundle CUDA 12.x; your driver must
            be new enough (typically 525+ for CUDA 12). You usually do <em>not</em> need a separate CUDA install for
            pip wheels.
          </li>
          <li>
            <strong className="text-white">Linux recommended</strong> — official wheels target Linux. Windows support
            is experimental; WSL2 with an NVIDIA GPU is the common workaround.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Install vLLM">
        <p className="text-slate-300">
          The fastest path is a pre-built wheel from PyPI. Pin a version in production so upgrades do not break
          deployments unexpectedly.
        </p>
        <Example title="Standard pip install">{`# Create and activate a virtual environment first
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\\Scripts\\activate

# Install vLLM (pulls PyTorch + CUDA runtime)
pip install vllm

# Pin for reproducibility
pip install "vllm==0.6.3"`}</Example>
        <CodeBlock title="Verify the install">{`python -c "import vllm; print(vllm.__version__)"
nvidia-smi   # confirm GPU is visible`}</CodeBlock>
        <Callout variant="tip" title="Install from source only when needed">
          Build from source if you need a bleeding-edge commit or a custom CUDA version. For learning and most
          production use, the PyPI wheel is enough:{' '}
          <code className="font-mono text-sm">pip install vllm</code>.
        </Callout>
      </LessonSection>

      <LessonSection title="GPU memory — how much VRAM do you need?">
        <p className="text-slate-300">
          VRAM must hold <strong className="text-white">model weights</strong>, the{' '}
          <strong className="text-white">KV cache</strong> (grows with context length and concurrent requests), and
          a small activation buffer. These are rough planning numbers for a single GPU at FP16/BF16 — your exact
          usage depends on <code className="font-mono text-sm">max_model_len</code> and batch size.
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Model size</th>
                <th className="px-4 py-3">FP16 weights</th>
                <th className="px-4 py-3">AWQ / GPTQ 4-bit</th>
                <th className="px-4 py-3">Typical minimum GPU</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['7B (Llama-3-8B, Mistral-7B)', '~14 GB', '~5–6 GB', '16 GB (RTX 4080, T4)'],
                ['13B', '~26 GB', '~8–10 GB', '24 GB (RTX 4090, A10)'],
                ['70B', '~140 GB', '~35–40 GB', '2× A100 80GB or 4× 24GB with tensor parallel'],
              ].map(([size, fp16, quant, gpu]) => (
                <tr key={size} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{size}</td>
                  <td className="px-4 py-3 text-slate-400">{fp16}</td>
                  <td className="px-4 py-3 text-slate-400">{quant}</td>
                  <td className="px-4 py-3 text-slate-400">{gpu}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-slate-300">
          <strong className="text-white">Quantization</strong> (AWQ, GPTQ, FP8) shrinks weight memory so smaller
          GPUs can run larger models. You trade a small quality hit for much lower VRAM. vLLM loads quantized
          checkpoints with the same <code className="font-mono text-sm">--model</code> flag — use a repo that
          already contains AWQ/GPTQ weights (e.g.{' '}
          <code className="font-mono text-sm">TheBloke/Llama-2-7B-AWQ</code>).
        </p>
        <Example title="Serve a 7B AWQ model on a 16 GB GPU">{`vllm serve TheBloke/Mistral-7B-Instruct-v0.2-AWQ \\
  --quantization awq \\
  --max-model-len 4096 \\
  --gpu-memory-utilization 0.90`}</Example>
      </LessonSection>

      <LessonSection title="CPU-only: not for real workloads">
        <p className="text-slate-300">
          vLLM can technically import on a machine without a GPU, but{' '}
          <strong className="text-white">meaningful inference requires CUDA</strong>. CPU fallback is not a
          supported production path — generation would be orders of magnitude slower than even naive HuggingFace
          CPU inference.
        </p>
        <Callout variant="beginner" title="No GPU?">
          Use cloud GPUs (Lambda, RunPod, AWS g5/p4d) or stick with API providers (OpenAI, Together) until you have
          hardware. Do not spend time tuning vLLM on CPU-only laptops except to read docs.
        </Callout>
      </LessonSection>

      <LessonSection title="Common install errors and fixes">
        <ContentStep number={1} title="CUDA driver too old">
          <p className="text-slate-300">
            Error: <code className="font-mono text-sm">CUDA driver version is insufficient</code> or PyTorch cannot
            see the GPU.
          </p>
          <CodeBlock title="Fix">{`# Upgrade NVIDIA driver, then reboot
nvidia-smi   # confirm Driver Version >= 525 for CUDA 12 wheels

# Reinstall vLLM after driver update
pip install --force-reinstall vllm`}</CodeBlock>
        </ContentStep>

        <ContentStep number={2} title="Wrong Python version">
          <p className="text-slate-300">
            Error: <code className="font-mono text-sm">No matching distribution found for vllm</code> on Python
            3.8 or 3.13.
          </p>
          <CodeBlock title="Fix">{`python --version   # must be 3.9–3.12
# Create a new venv with a supported Python, then pip install vllm`}</CodeBlock>
        </ContentStep>

        <ContentStep number={3} title="Out of memory at startup">
          <p className="text-slate-300">
            Error: <code className="font-mono text-sm">CUDA out of memory</code> when loading the model — weights
            alone exceed VRAM.
          </p>
          <CodeBlock title="Fix">{`# Use a smaller or quantized model
vllm serve TheBloke/Mistral-7B-Instruct-v0.2-AWQ --quantization awq

# Or reduce context and memory reservation
vllm serve meta-llama/Meta-Llama-3-8B-Instruct \\
  --max-model-len 2048 \\
  --gpu-memory-utilization 0.85`}</CodeBlock>
        </ContentStep>

        <ContentStep number={4} title="gcc / build tools missing (source install)">
          <p className="text-slate-300">
            Error during <code className="font-mono text-sm">pip install</code> when compiling extensions from
            source.
          </p>
          <CodeBlock title="Fix (Ubuntu)">{`sudo apt update && sudo apt install -y build-essential
# Prefer the pre-built wheel instead:
pip install vllm --only-binary :all:`}</CodeBlock>
        </ContentStep>

        <ContentStep number={5} title="Hugging Face gated models">
          <p className="text-slate-300">
            Error: <code className="font-mono text-sm">401 Unauthorized</code> when downloading Llama weights.
          </p>
          <CodeBlock title="Fix">{`# Accept the license on huggingface.co, then:
huggingface-cli login
# Or set HF_TOKEN in the environment before starting vLLM`}</CodeBlock>
        </ContentStep>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Install with pip in Python 3.9–3.12 on Linux + NVIDIA GPU; verify with nvidia-smi.',
          'Plan VRAM from model size: ~14 GB for 7B FP16, ~5 GB with AWQ; 70B needs multi-GPU or heavy quant.',
          'CPU-only machines are not viable for real vLLM inference — use cloud GPUs or APIs instead.',
          'Most install pain is old drivers, wrong Python, or OOM — fix driver, quantize, or lower max-model-len.',
        ]}
      />
    </LessonArticle>
  )
}
