import {
  Callout,
  CodeBlock,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function MultiLoraServing() {
  return (
    <LessonArticle>
      <LessonSection title="One base model, many fine-tunes">
        <p className="text-slate-300">
          Fine-tuning with <strong className="text-white">LoRA (Low-Rank Adaptation)</strong> trains small adapter
          matrices instead of full weights. A 7B base model plus dozens of LoRA adapters might add only megabytes
          per adapter — versus gigabytes for full fine-tunes. vLLM can serve{' '}
          <strong className="text-white">many LoRA adapters on one shared base model</strong>, switching per
          request.
        </p>
        <Definition term="Multi-LoRA serving">
          <p>
            Loading one copy of base weights in GPU memory and dynamically applying different LoRA adapters per
            request (or per batch slot). Dramatically cheaper than deploying one full model per customer or use
            case.
          </p>
        </Definition>
        <div className="mt-4 rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="text-slate-400">Cost comparison (illustrative)</div>
          <div className="mt-2 text-slate-300">10 full fine-tunes of 7B → 10× GPU memory</div>
          <div className="mt-1 text-genai-400">1 base + 10 LoRAs in vLLM → ~1× base memory + small overhead</div>
        </div>
      </LessonSection>

      <LessonSection title="Enabling LoRA in vLLM">
        <p className="text-slate-300">
          Use <code className="font-mono text-sm">--enable-lora</code> and point to a base model. Adapters can be
          registered at startup or passed per request via the OpenAI-compatible API using{' '}
          <code className="font-mono text-sm">model</code> or LoRA-specific fields.
        </p>
        <CodeBlock title="Server with LoRA support">{`python -m vllm.entrypoints.openai.api_server \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --enable-lora \\
  --max-loras 8 \\
  --max-lora-rank 64 \\
  --max-cpu-loras 16 \\
  --lora-modules support-bot=./loras/support \\
               legal-bot=./loras/legal \\
               sales-bot=./loras/sales`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">max-loras</strong> — max adapters loaded on GPU simultaneously.
          </li>
          <li>
            <strong className="text-white">max-cpu-loras</strong> — adapters staged on CPU and swapped in on demand.
          </li>
          <li>
            <strong className="text-white">lora-modules</strong> — name=path pairs exposed to clients.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Requesting a specific adapter">
        <CodeBlock title="OpenAI-compatible client">{`from openai import OpenAI

client = OpenAI(base_url="http://localhost:8000/v1", api_key="EMPTY")

# Use a registered LoRA by model name
response = client.chat.completions.create(
    model="support-bot",
    messages=[{"role": "user", "content": "How do I reset my password?"}],
)

# Or base model without adapter
response = client.chat.completions.create(
    model="meta-llama/Llama-3.1-8B-Instruct",
    messages=[{"role": "user", "content": "Hello"}],
)`}</CodeBlock>
        <Callout variant="tip">
          Name adapters clearly in production (<code className="font-mono text-sm">customer-acme-v3</code>) and pin
          versions in your API gateway. LoRA swaps are fast but not free — batch requests using the same adapter
          when possible.
        </Callout>
      </LessonSection>

      <LessonSection title="Architecture and limits">
        <Flowchart
          title="Multi-LoRA request flow"
          chart={`flowchart LR
  R[Request with adapter ID] --> S[Scheduler assigns batch slot]
  S --> B[Shared base weights on GPU]
  B --> L[Apply LoRA delta for this slot]
  L --> O[Generate tokens]
  O --> N[Next request may use different LoRA]`}
        />
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Constraint</th>
                <th className="px-4 py-3">Impact</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Many unique adapters per batch', 'More memory + kernel overhead; throughput drops'],
                ['High max-lora-rank', 'Larger adapter matrices; fewer concurrent adapters'],
                ['Adapter cold-load from CPU', 'Latency spike on first request after swap'],
                ['Incompatible LoRA target modules', 'Server fails at load — verify training config matches base'],
              ].map(([constraint, impact]) => (
                <tr key={constraint} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{constraint}</td>
                  <td className="px-4 py-3 text-slate-400">{impact}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Production patterns">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Tenant routing</strong> — API gateway maps customer ID → LoRA name;
            one vLLM fleet serves all tenants.
          </li>
          <li>
            <strong className="text-white">Warm adapters</strong> — pre-load top-N adapters by traffic; keep long
            tail on CPU.
          </li>
          <li>
            <strong className="text-white">Same base only</strong> — all LoRAs must target the same base
            architecture and tokenizer.
          </li>
          <li>
            <strong className="text-white">Eval per adapter</strong> — quality varies; benchmark each LoRA before
            exposing to users.
          </li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Multi-LoRA serving shares one base model across many fine-tuned adapters — huge cost savings vs full fine-tunes.',
          'Enable with --enable-lora, register modules with --lora-modules, and route clients by model name.',
          'Batch same-adapter requests when possible; cap max-loras to what your GPU memory allows.',
          'Ideal for multi-tenant SaaS, per-customer tone, or domain-specific bots on one hardware footprint.',
        ]}
      />
    </LessonArticle>
  )
}
