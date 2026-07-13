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

export function GpusAndMemoryBasics() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Zero GPU jargon assumed">
        If you have never bought a GPU or rented cloud hardware, start here. Every term is defined before we use
        it. No CUDA programming required — just the mental model for why inference needs special hardware and
        why &quot;out of memory&quot; errors happen.
      </Callout>

      <Definition term="GPU (Graphics Processing Unit)">
        <p>
          A <strong className="text-white">GPU</strong> is a chip designed to perform thousands of small,
          identical calculations in parallel. Originally built for video game graphics, GPUs turned out to be
          perfect for the giant matrix multiplications inside neural networks.
        </p>
        <p>
          When people say &quot;run the model on a GPU,&quot; they mean: load the model weights into the GPU&apos;s
          fast memory and let thousands of cores crunch the math — far faster than a CPU for this workload.
        </p>
      </Definition>

      <Definition term="CPU (Central Processing Unit)">
        <p>
          A <strong className="text-white">CPU</strong> is the general-purpose brain of your computer — great at
          complex logic, branching, and running your operating system. It has a few very fast cores (8–64 on a
          server). CPUs <em>can</em> run LLM inference, but for models with billions of parameters they are
          typically 10–100× slower than a GPU. CPUs are still used for API routing, tokenization, and orchestration
          around the GPU.
        </p>
      </Definition>

      <LessonSection title="Why GPUs win at matrix math">
        <p className="text-slate-300">
          A language model is mostly layers of matrix multiplication and attention. Each operation applies the
          same formula to huge arrays of numbers — exactly what GPUs are built for.
        </p>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400">CPU</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>8–64 powerful cores</li>
              <li>Excellent for sequential logic</li>
              <li>Large general RAM (64–512 GB typical)</li>
              <li>Llama-7B inference: ~1–5 tokens/sec</li>
            </ul>
          </div>
          <div className="rounded-xl border border-surface-600 bg-surface-900 p-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-genai-400">GPU</div>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-300">
              <li>Thousands of smaller cores</li>
              <li>Excellent for parallel matrix ops</li>
              <li>Specialized VRAM (see below)</li>
              <li>Llama-7B inference: ~50–150 tokens/sec</li>
            </ul>
          </div>
        </div>

        <Flowchart
          title="Where compute happens in an LLM server"
          chart={`flowchart LR
  U[User request] --> CPU[CPU — tokenize, route, JSON]
  CPU --> GPU[GPU — forward pass, generate tokens]
  GPU --> CPU
  CPU --> U[Stream response]`}
        />

        <Callout variant="insight">
          You do not need to program the GPU directly. Frameworks like PyTorch, HuggingFace, and vLLM handle that.
          Your job is choosing the right GPU, fitting the model in memory, and configuring the server.
        </Callout>
      </LessonSection>

      <LessonSection title="VRAM — the GPU's memory">
        <Definition term="VRAM (Video RAM)">
          <p>
            <strong className="text-white">VRAM</strong> is the dedicated memory attached to the GPU chip. Model
            weights, KV cache, and activations must all fit in VRAM during inference — data cannot be read from
            regular CPU RAM at full GPU speed without a severe performance penalty.
          </p>
          <p>
            When someone says &quot;a 24 GB GPU,&quot; they mean 24 GB of VRAM. This is the hard ceiling for
            what you can load and run without tricks like quantization or splitting across multiple GPUs.
          </p>
        </Definition>

        <ContentStep number={1} title="Model weights">
          <p>
            The saved checkpoint — billions of floating-point numbers. Rough rule: parameter count × bytes per
            parameter. Llama-3-8B in 16-bit (FP16) ≈ 8B × 2 bytes ≈ <strong className="text-white">16 GB</strong>.
            In 4-bit quantization ≈ <strong className="text-white">4–5 GB</strong>.
          </p>
        </ContentStep>

        <ContentStep number={2} title="KV cache">
          <p>
            Grows with every token in every active conversation. More concurrent users and longer chats mean more
            KV cache. On a busy server, KV cache can exceed weight memory. vLLM&apos;s PagedAttention manages this
            efficiently — covered in Architecture lessons.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Activations">
          <p>
            Temporary workspace during each forward pass. Usually the smallest of the three at decode time, but
            can spike during prefill of very long prompts.
          </p>
        </ContentStep>

        <Flowchart
          title="VRAM budget on a 24 GB GPU running Llama-3-8B FP16"
          chart={`flowchart TB
  V[24 GB VRAM total]
  V --> W[~16 GB weights]
  V --> KV[~4–6 GB KV cache — depends on users]
  V --> A[~1–2 GB activations + overhead]
  V --> R[Remaining headroom — often tight]`}
        />

        <Example
          title="Rough weight size calculator"
          output="Llama-3-8B FP16 ≈ 16.0 GB weights alone"
        >{`params_billions = 8
bytes_per_param = 2   # FP16
weight_gb = params_billions * bytes_per_param
print(f"Weight memory: ~{weight_gb} GB")
# Does not include KV cache or activations!`}</Example>
      </LessonSection>

      <LessonSection title="Why OOM happens">
        <Definition term="OOM (Out Of Memory)">
          <p>
            An <strong className="text-white">OOM error</strong> means the GPU ran out of VRAM. PyTorch or vLLM
            tried to allocate a tensor (weights, KV cache slot, activation buffer) and there was no room left.
            The process often crashes or rejects new requests.
          </p>
        </Definition>

        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Model too large for GPU</strong> — Loading Llama-3-70B FP16 (~140 GB)
            on a 24 GB card cannot work without quantization or multi-GPU sharding.
          </li>
          <li>
            <strong className="text-white">Too many concurrent requests</strong> — Each active chat needs KV
            cache. Fifty long conversations can exhaust memory even when the model itself fits.
          </li>
          <li>
            <strong className="text-white">Context too long</strong> — KV cache size scales with sequence length.
            A 32k-token prompt uses far more cache than a 512-token prompt.
          </li>
          <li>
            <strong className="text-white">Fragmentation</strong> — Memory allocated and freed in uneven chunks
            leaves unusable gaps. PagedAttention (vLLM) reduces this — like virtual memory for KV cache.
          </li>
        </ul>

        <CodeBlock title="Common OOM error (PyTorch)">{`torch.cuda.OutOfMemoryError: CUDA out of memory.
Tried to allocate 2.00 GiB. GPU 0 has a total capacity
of 23.65 GiB of which 128.00 MiB is free.`}</CodeBlock>

        <Callout variant="tip" title="Fixes you will learn in this track">
          Quantization (INT4/INT8), limiting <code className="font-mono text-sm">max_model_len</code>, reducing
          concurrent sequences, tensor parallelism across GPUs, and vLLM&apos;s memory-efficient KV management.
        </Callout>
      </LessonSection>

      <LessonSection title="24 GB vs 80 GB — what it means in practice">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">VRAM</th>
                <th className="px-4 py-3">Typical hardware</th>
                <th className="px-4 py-3">What fits comfortably</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['8 GB', 'RTX 3060, laptop GPUs', 'Tiny models (1–3B) or heavily quantized 7B'],
                ['12 GB', 'RTX 3060 12GB, RTX 4070', '7B INT4 with modest context'],
                ['24 GB', 'RTX 4090, A10, L4', '7B–8B FP16 or 13B quantized + serving headroom'],
                ['40 GB', 'A100 40GB', '13B–34B FP16 or larger with quantization'],
                ['80 GB', 'A100 80GB, H100 80GB', '70B quantized or 34B FP16 with batching'],
              ].map(([vram, hardware, fits]) => (
                <tr key={vram} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{vram}</td>
                  <td className="px-4 py-3 text-slate-400">{hardware}</td>
                  <td className="px-4 py-3 text-slate-400">{fits}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 text-sm text-slate-400">
          &quot;Fits&quot; means weights only — always reserve VRAM for KV cache and concurrent users in
          production. A model that barely fits alone will OOM under real traffic.
        </p>
      </LessonSection>

      <LessonSection title="Common GPUs — a brief tour">
        <ContentStep number={1} title="NVIDIA A100">
          <p>
            The workhorse datacenter GPU (2020–2023). 40 GB or 80 GB VRAM. Widely available on AWS, GCP, Azure.
            Good balance of cost and performance for 7B–70B serving. Many vLLM tutorials assume A100-class hardware.
          </p>
        </ContentStep>

        <ContentStep number={2} title="NVIDIA H100">
          <p>
            Successor to A100 (2022+). Faster matrix units, 80 GB HBM3 memory, better for large models and high
            throughput. Premium pricing — used when latency and tokens/sec justify the cost.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Consumer GPUs (RTX 4090, 4080, etc.)">
          <p>
            24 GB VRAM on a 4090 at a fraction of datacenter cost. Excellent for learning, local dev, and small
            production workloads. No NVLink for easy multi-GPU tensor parallel — datacenter cards scale better.
          </p>
        </ContentStep>

        <ContentStep number={4} title="Cloud &quot;inference&quot; instances">
          <p>
            Providers offer named SKUs: AWS <code className="font-mono text-sm">g5.xlarge</code> (A10G 24GB),{' '}
            <code className="font-mono text-sm">p4d</code> (A100), GCP <code className="font-mono text-sm">a2</code>{' '}
            (A100). When renting, match instance VRAM to your model size plus KV cache budget.
          </p>
        </ContentStep>

        <Callout variant="beginner" title="You do not need to own a GPU">
          RunPod, Lambda Labs, Vast.ai, and cloud free tiers let you rent GPUs by the hour. For this curriculum,
          an A10G or RTX 4090 class GPU is enough to follow along with 7B–8B models.
        </Callout>
      </LessonSection>

      <LessonSection title="Glossary quick reference">
        <CodeBlock title="Terms you will see everywhere">{`GPU     — parallel math chip for neural networks
CPU     — general computer brain; orchestrates, tokenizes
VRAM    — GPU memory; weights + KV cache must live here
FP16    — 16-bit floats; 2 bytes per weight (common default)
INT4    — 4-bit quantization; ~4× smaller weights, small quality tradeoff
OOM     — Out Of Memory; GPU ran out of VRAM
HBM     — High Bandwidth Memory; fast VRAM on datacenter GPUs
CUDA    — NVIDIA's programming layer (frameworks hide it from you)`}</CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'GPUs excel at parallel matrix math; CPUs orchestrate but are too slow for large LLM inference alone.',
          'VRAM is the GPU memory budget — weights, KV cache, and activations must all fit inside it.',
          'OOM means no free VRAM: model too big, too many users, or context too long.',
          '24 GB fits ~8B FP16 with serving headroom; 80 GB enables larger models and more concurrent KV cache.',
          'A100/H100 are datacenter standards; RTX 4090 is the popular consumer option for learning and small deploys.',
        ]}
      />
    </LessonArticle>
  )
}
