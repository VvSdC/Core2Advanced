import {
  Callout,
  CodeBlock,
  Definition,
  Example,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function OfflineInference() {
  return (
    <LessonArticle>
      <Definition term="Offline inference">
        <p>
          <strong className="text-white">Offline inference</strong> means you load a model inside your Python
          process and call <code className="font-mono text-sm">generate()</code> directly — no HTTP server, no
          OpenAI API. vLLM's <code className="font-mono text-sm">LLM</code> class wraps the same fast engine
          used by <code className="font-mono text-sm">vllm serve</code>, but for scripts, notebooks, and batch
          jobs.
        </p>
      </Definition>

      <LessonSection title="The LLM class — your first vLLM program">
        <p className="text-slate-300">
          Import <code className="font-mono text-sm">LLM</code> and{' '}
          <code className="font-mono text-sm">SamplingParams</code>, point at a Hugging Face model id, and call{' '}
          <code className="font-mono text-sm">generate()</code>. The model loads once; subsequent calls reuse the
          same GPU memory.
        </p>
        <Example
          title="Minimal offline generation"
          output={`The capital of France is Paris, a global center for art, fashion, and culture.`}
        >{`from vllm import LLM, SamplingParams

# Load model (downloads weights on first run)
llm = LLM(model="meta-llama/Meta-Llama-3-8B-Instruct")

prompts = ["The capital of France is"]
sampling = SamplingParams(temperature=0.7, max_tokens=64)

outputs = llm.generate(prompts, sampling)

for output in outputs:
    text = output.outputs[0].text
    print(text)`}</Example>
        <Callout variant="tip">
          First load can take several minutes while weights download and compile. Later runs in the same process
          are fast.
        </Callout>
      </LessonSection>

      <LessonSection title="SamplingParams — control what the model writes">
        <p className="text-slate-300">
          <code className="font-mono text-sm">SamplingParams</code> maps to the same knobs you know from OpenAI's
          API. Pass one object per <code className="font-mono text-sm">generate()</code> call (or use defaults).
        </p>
        <div className="mt-4 overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Parameter</th>
                <th className="px-4 py-3">What it does</th>
                <th className="px-4 py-3">Typical value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['temperature', 'Higher = more random; lower = more deterministic', '0.0 (exact) to 1.0 (creative)'],
                ['max_tokens', 'Hard cap on new tokens generated per prompt', '256–2048 depending on use case'],
                ['top_p', 'Nucleus sampling — only sample from top tokens whose cumulative prob ≤ p', '0.9–0.95'],
                ['top_k', 'Only consider the k highest-probability tokens each step', '40–50 (optional)'],
                ['stop', 'Stop generation when any of these strings appear', '["</s>", "\\n\\n"]'],
              ].map(([param, desc, typical]) => (
                <tr key={param} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-mono text-sm text-genai-400">{param}</td>
                  <td className="px-4 py-3 text-slate-400">{desc}</td>
                  <td className="px-4 py-3 text-slate-400">{typical}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="Full example — Llama and Mistral">
        <p className="text-slate-300">
          Use the model's <strong className="text-white">chat template</strong> for instruct models. vLLM can
          apply it via <code className="font-mono text-sm">tokenizer.apply_chat_template</code> before passing
          prompts to <code className="font-mono text-sm">generate()</code>.
        </p>
        <Example title="Mistral-7B-Instruct with chat formatting">{`from transformers import AutoTokenizer
from vllm import LLM, SamplingParams

MODEL = "mistralai/Mistral-7B-Instruct-v0.3"

tokenizer = AutoTokenizer.from_pretrained(MODEL)
llm = LLM(model=MODEL, max_model_len=4096)

messages = [
    {"role": "system", "content": "You are a concise coding assistant."},
    {"role": "user", "content": "Write a Python function to check if a string is a palindrome."},
]

prompt = tokenizer.apply_chat_template(
    messages,
    tokenize=False,
    add_generation_prompt=True,
)

sampling = SamplingParams(
    temperature=0.2,
    max_tokens=256,
    top_p=0.9,
)

outputs = llm.generate([prompt], sampling)
print(outputs[0].outputs[0].text)`}</Example>
        <CodeBlock title="Swap model id for Llama-3-8B-Instruct">{`MODEL = "meta-llama/Meta-Llama-3-8B-Instruct"
# Same pattern — change MODEL and ensure HF access for gated weights`}</CodeBlock>
        <Example
          title="Batch multiple prompts in one call"
          caption="vLLM batches prompts automatically inside generate() — great for offline eval or dataset labeling."
        >{`prompts = [
    "Summarize quantum computing in one sentence.",
    "List three benefits of unit tests.",
    "What is the time complexity of binary search?",
]

sampling = SamplingParams(temperature=0.5, max_tokens=128, top_p=0.95)
outputs = llm.generate(prompts, sampling)

for i, output in enumerate(outputs):
    print(f"--- Prompt {i + 1} ---")
    print(output.outputs[0].text)`}</Example>
      </LessonSection>

      <LessonSection title="Offline vs server — when to use which">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Use offline (LLM class)</th>
                <th className="px-4 py-3">Use server (vllm serve)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['One-off scripts, Jupyter notebooks, CI eval jobs', 'Web apps, chatbots, multiple clients'],
                ['You control the process lifecycle (load → run → exit)', 'Long-running service; model stays warm'],
                ['Batch processing a fixed dataset on one machine', 'Concurrent HTTP requests from many users'],
                ['Prototyping before exposing an API', 'LangChain / OpenAI SDK pointing at localhost'],
              ].map(([offline, server], i) => (
                <tr key={i} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 text-slate-400">{offline}</td>
                  <td className="px-4 py-3 text-slate-400">{server}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="beginner" title="Rule of thumb">
          Notebook or batch job → <code className="font-mono text-sm">LLM</code> class. Anything that needs HTTP,
          autoscaling, or LangChain's <code className="font-mono text-sm">ChatOpenAI(base_url=...)</code> → start{' '}
          <code className="font-mono text-sm">vllm serve</code> (covered in the next lesson).
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Use from vllm import LLM, SamplingParams — load once, call llm.generate(prompts, params).',
          'temperature controls randomness; max_tokens caps length; top_p limits the sampling pool.',
          'Apply chat templates for instruct models (Llama, Mistral) before generate().',
          'Offline suits scripts and batches; use vllm serve when multiple clients need HTTP access.',
        ]}
      />
    </LessonArticle>
  )
}
