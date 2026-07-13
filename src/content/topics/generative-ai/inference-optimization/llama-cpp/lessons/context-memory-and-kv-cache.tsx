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

export function ContextMemoryAndKvCache() {
  return (
    <LessonArticle>
      <LessonSection title="Context length — the model's working memory">
        <p className="text-slate-300">
          Every LLM has a maximum number of tokens it can &quot;see&quot; at once — the{' '}
          <strong className="text-white">context window</strong>. In llama.cpp you control this with{' '}
          <code className="font-mono text-sm">-c</code> / <code className="font-mono text-sm">--ctx-size</code>{' '}
          (flag name: <code className="font-mono text-sm">n_ctx</code>). A 4096 context means the model can
          process roughly 3,000 words of input plus generated output combined.
        </p>
        <Definition term="n_ctx (context size)">
          <p>
            The total token slots reserved for prompt + completion. Setting{' '}
            <code className="font-mono text-sm">n_ctx 8192</code> allocates memory for up to 8,192 tokens.
            Larger context uses more RAM — mostly because of the KV cache — even if your prompt is short.
          </p>
        </Definition>
      </LessonSection>

      <LessonSection title="n_batch — how many tokens per forward pass">
        <p className="text-slate-300">
          <code className="font-mono text-sm">-b</code> / <code className="font-mono text-sm">--batch-size</code>{' '}
          (<code className="font-mono text-sm">n_batch</code>) sets how many tokens the model processes in a
          single forward pass during <strong className="text-white">prefill</strong>. A long prompt is split
          into chunks of size <code className="font-mono text-sm">n_batch</code> and fed through the network.
        </p>
        <Callout variant="tip">
          Default <code className="font-mono text-sm">n_batch</code> is often 512 or 2048. Raising it can speed
          up long prompt ingestion but increases peak memory during prefill. Lower it if you hit OOM on huge
          documents.
        </Callout>
        <CodeBlock title="Context and batch flags">{`llama-cli -m model.gguf \\
  -c 8192 \\        # context window: 8192 tokens
  -b 512 \\         # batch size for prompt processing
  -p "Summarize this 10-page document..."`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Memory formula — plan before you run">
        <p className="text-slate-300">
          Total RAM ≈ <strong className="text-white">model weights</strong> +{' '}
          <strong className="text-white">KV cache</strong> + small overhead. Weights depend on quant (Q4_K_M
          7B ≈ 4.4 GB). KV cache depends on context size, layer count, and hidden dimension.
        </p>
        <ContentStep number={1} title="KV cache size (simplified)">
          <p className="text-slate-300">
            For a model with <strong className="text-white">L</strong> layers, hidden size{' '}
            <strong className="text-white">H</strong>, and context <strong className="text-white">n_ctx</strong>:
          </p>
          <p className="mt-2 font-mono text-sm text-genai-400">
            KV_cache ≈ 2 × L × n_ctx × H × bytes_per_element
          </p>
          <p className="mt-2 text-slate-300">
            The factor 2 is for Key and Value tensors. llama.cpp may use FP16 or quantized KV cache depending
            on flags — check <code className="font-mono text-sm">--cache-type-k</code> and{' '}
            <code className="font-mono text-sm">--cache-type-v</code> for advanced tuning.
          </p>
        </ContentStep>
        <Example title="Llama-3-8B at n_ctx 4096 (FP16 KV)">
          {`Layers (L)    = 32
Hidden (H)    = 4,096
n_ctx         = 4,096
Precision     = FP16 (2 bytes)

KV cache = 2 × 32 × 4,096 × 4,096 × 2
         ≈ 2.1 GB

Total RAM ≈ 4.4 GB (Q4_K_M weights) + 2.1 GB (KV) ≈ 6.5 GB minimum`}
        </Example>
      </LessonSection>

      <LessonSection title="KV cache in llama.cpp">
        <p className="text-slate-300">
          During prefill, llama.cpp computes Key and Value vectors for every prompt token and stores them in a
          contiguous cache. During decode, only the new token is forwarded — its K and V are appended, and
          attention reads the full history from cache.
        </p>
        <Flowchart
          title="KV cache lifecycle in llama.cpp"
          chart={`flowchart LR
  P[Prompt tokens] --> PF[Prefill batches of n_batch]
  PF --> KV[(KV cache: size n_ctx)]
  KV --> D1[Decode token 1]
  D1 --> KV
  KV --> D2[Decode token 2]
  D2 --> KV
  KV --> DN[Decode until -n or EOS]`}
        />
        <Callout variant="insight" title="Why context length matters">
          Doubling <code className="font-mono text-sm">n_ctx</code> from 4096 to 8192 roughly doubles KV cache
          RAM — even if your prompt is only 200 tokens. Set context to what you actually need; do not default
          to the model maximum unless required.
        </Callout>
      </LessonSection>

      <LessonSection title="Practical tuning tips">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">OOM at startup</strong> — lower <code className="font-mono text-sm">n_ctx</code>,
            use a smaller quant, or reduce <code className="font-mono text-sm">-ngl</code> GPU layers.
          </li>
          <li>
            <strong className="text-white">Slow long prompts</strong> — increase <code className="font-mono text-sm">n_batch</code>{' '}
            if memory allows; ensure prompt tokens are on GPU via sufficient <code className="font-mono text-sm">-ngl</code>.
          </li>
          <li>
            <strong className="text-white">Conversation truncation</strong> — when prompt + history exceeds{' '}
            <code className="font-mono text-sm">n_ctx</code>, oldest tokens are dropped. Use sliding window or
            summarize old turns in your app.
          </li>
        </ul>
        <CodeBlock title="Conservative settings for 8 GB RAM">{`llama-cli -m model-Q4_K_M.gguf \\
  -c 2048 \\
  -b 256 \\
  -ngl 20 \\
  -p "Your prompt here"`}</CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          'n_ctx sets the context window — prompt + output must fit within it; larger n_ctx uses more RAM.',
          'n_batch controls prefill chunk size — higher can speed long prompts but spikes memory.',
          'KV cache memory grows linearly with n_ctx, layers, and hidden size — plan RAM before loading.',
          'Do not max out context by default; tune n_ctx, quant, and ngl to your hardware budget.',
        ]}
      />
    </LessonArticle>
  )
}
