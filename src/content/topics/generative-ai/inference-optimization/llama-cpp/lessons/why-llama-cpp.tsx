import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function WhyLlamaCpp() {
  return (
    <LessonArticle>
      <LessonSection title="The question every beginner asks">
        <p className="text-slate-300">
          You can already use ChatGPT, Claude, or Gemini in a browser. So why would anyone download a model,
          install software, and run an LLM on their own laptop? The answer is not &quot;because it is cool&quot; —
          it is because <strong className="text-white">local inference solves real problems</strong> that cloud
          APIs cannot.
        </p>
        <p className="mt-4 text-slate-300">
          <strong className="text-white">llama.cpp</strong> is one of the most popular tools for running open-weight
          models on your own hardware. It is lightweight, runs without a datacenter GPU, and powers many tools you
          may already use (including Ollama under the hood). This lesson explains <em>why</em> it exists before
          we dive into <em>how</em> it works.
        </p>
      </LessonSection>

      <Definition term="Local inference">
        <p>
          <strong className="text-white">Local inference</strong> means the language model runs entirely on your
          machine — your laptop, desktop, or edge device. Your prompts and generated text never leave your computer
          unless you choose to send them somewhere else.
        </p>
        <p>
          Think of it like cooking at home vs ordering delivery. Cloud APIs are delivery: convenient, but someone
          else handles your ingredients (data) and charges per meal (token). Local inference is your own kitchen:
          you buy groceries once (download a model), and cook as much as you want.
        </p>
      </Definition>

      <LessonSection title="Four reasons people run LLMs locally">
        <ContentStep number={1} title="Privacy — your data stays yours">
          <p className="text-slate-300">
            When you send a prompt to OpenAI or Anthropic, that text travels over the internet and is processed on
            their servers. For personal notes, medical records, legal documents, or proprietary code, that is a
            dealbreaker. With llama.cpp, the model reads your prompt from{' '}
            <strong className="text-white">your RAM</strong>, not a remote datacenter.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Cost — no per-token bills">
          <p className="text-slate-300">
            Cloud APIs charge per million tokens. Heavy daily use adds up fast — especially for agents that loop
            hundreds of times. A one-time download of a quantized model plus free electricity on your existing
            hardware can be <strong className="text-white">dramatically cheaper</strong> at personal or small-team
            scale. You pay in time and hardware, not API invoices.
          </p>
        </ContentStep>

        <ContentStep number={3} title="Offline — no internet required">
          <p className="text-slate-300">
            Planes, remote field sites, secure air-gapped networks, and unreliable Wi-Fi all block cloud APIs.
            A local model works whenever your machine is on. Journalists, researchers, and developers in low-connectivity
            environments rely on this constantly.
          </p>
        </ContentStep>

        <ContentStep number={4} title="No GPU required — CPU and Apple Silicon work">
          <p className="text-slate-300">
            Datacenter tools like <strong className="text-white">vLLM</strong> assume NVIDIA GPUs with lots of VRAM.
            llama.cpp was built from day one to run efficiently on{' '}
            <strong className="text-white">CPUs</strong>, <strong className="text-white">Apple Silicon (Metal)</strong>,
            and modest consumer GPUs. You do not need an A100 to chat with a 7B model on your MacBook.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Cloud APIs vs local llama.cpp vs GPU servers">
        <p className="text-slate-300">
          These are not competitors in the same category — they solve different jobs. Pick based on your constraints.
        </p>

        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Approach</th>
                <th className="px-4 py-3">Best for</th>
                <th className="px-4 py-3">Trade-offs</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                [
                  'Cloud API (OpenAI, etc.)',
                  'Fastest setup, best frontier models, no hardware',
                  'Privacy risk, ongoing cost, needs internet, rate limits',
                ],
                [
                  'llama.cpp (local)',
                  'Privacy, offline, personal dev, edge devices',
                  'You manage models and hardware; smaller models than GPT-4',
                ],
                [
                  'vLLM (GPU server)',
                  'Production serving, many concurrent users, max throughput',
                  'Needs NVIDIA GPU(s), complex ops, not a laptop tool',
                ],
              ].map(([approach, best, tradeoffs]) => (
                <tr key={approach} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{approach}</td>
                  <td className="px-4 py-3 text-genai-400">{best}</td>
                  <td className="px-4 py-3 text-slate-400">{tradeoffs}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <Flowchart
          title="Where does your prompt go?"
          chart={`flowchart TB
  subgraph CLOUD[Cloud API]
    C1[Your prompt] --> C2[Internet]
    C2 --> C3[Provider GPU farm]
    C3 --> C4[Response streamed back]
  end
  subgraph LOCAL[llama.cpp local]
    L1[Your prompt] --> L2[Your CPU / GPU / RAM]
    L2 --> L3[Response on screen]
  end
  subgraph SERVER[vLLM datacenter]
    S1[Many users] --> S2[Load balancer]
    S2 --> S3[GPU cluster with batching]
  end`}
        />

        <Callout variant="insight">
          Use cloud APIs when you want the smartest model with zero setup. Use llama.cpp when data must stay local,
          you are offline, or API costs hurt. Use vLLM when you are serving a product to hundreds of users on GPUs
          you control.
        </Callout>
      </LessonSection>

      <LessonSection title="Who actually uses llama.cpp?">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Developers</strong> — prototyping agents, testing prompts, integrating
            LLMs into apps without API keys
          </li>
          <li>
            <strong className="text-white">Privacy-conscious users</strong> — journaling, therapy notes, internal
            company docs
          </li>
          <li>
            <strong className="text-white">Mac and Linux enthusiasts</strong> — running Mistral, Llama, or Qwen on
            a laptop with Metal or CPU
          </li>
          <li>
            <strong className="text-white">Embedded and edge</strong> — Raspberry Pi-class devices, offline kiosks,
            robots with on-device reasoning
          </li>
          <li>
            <strong className="text-white">Ollama users</strong> — Ollama wraps llama.cpp (and other engines) for
            a simpler experience; understanding llama.cpp explains what happens underneath
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="What you will learn in this sub-topic">
        <Flowchart
          title="Zero to llama.cpp mastery"
          chart={`flowchart TB
  W[Why local — this lesson] --> H[Hardware — CPU, GPU, RAM]
  H --> B[Basics — tokens, prefill, decode]
  B --> F[Files — GGUF format and downloads]
  F --> I[Intro — llama.cpp, Ollama, vs vLLM]
  I --> G[GGML — tensor library and backends]`}
        />
        <p className="mt-4 text-slate-300">
          By the end you will know how to choose hardware, pick a model file, understand what happens when you type
          a prompt, and run inference confidently — even if you never touch CUDA code.
        </p>
      </LessonSection>

      <Callout variant="beginner" title="Prerequisites">
        Basic comfort with downloading files and running terminal commands helps. No GPU or C++ experience required.
        Familiarity with &quot;what is an LLM&quot; from Fundamentals is enough to start.
      </Callout>

      <KeyTakeaways
        items={[
          'Local inference keeps your data on your machine — critical for privacy and regulated industries.',
          'No per-token API bills; you invest in hardware and model files instead.',
          'llama.cpp runs offline and does not require a datacenter NVIDIA GPU.',
          'Cloud APIs = convenience; llama.cpp = local control; vLLM = high-throughput GPU serving.',
          'Next: understand RAM vs VRAM and which hardware you actually need.',
        ]}
      />
    </LessonArticle>
  )
}
