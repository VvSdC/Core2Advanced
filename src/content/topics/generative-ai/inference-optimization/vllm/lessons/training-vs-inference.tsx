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

export function TrainingVsInference() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Start here if inference is new">
        You may have used ChatGPT or built apps with LangChain — that is the <em>application</em> layer. This
        lesson is about what happens <em>inside</em> a GPU when a model runs. No prior GPU or serving knowledge
        required.
      </Callout>

      <Definition term="Training">
        <p>
          <strong className="text-white">Training</strong> is the process of teaching a neural network by showing
          it millions (or billions) of examples and adjusting its internal numbers — called{' '}
          <strong className="text-white">weights</strong> — so it gets better at predicting the next token.
        </p>
        <p>
          Training runs a <strong className="text-white">forward pass</strong> (compute predictions) and a{' '}
          <strong className="text-white">backward pass</strong> (compute how to fix mistakes). The backward pass
          is what makes training slow and memory-hungry. It is done <em>once</em> (or occasionally for fine-tuning),
          often on clusters of dozens or hundreds of GPUs over weeks.
        </p>
      </Definition>

      <Definition term="Inference">
        <p>
          <strong className="text-white">Inference</strong> is using a <em>finished</em> model to generate answers
          for real users. The weights are frozen — no learning happens. The model only runs a{' '}
          <strong className="text-white">forward pass</strong>: read input tokens, predict the next token, repeat.
        </p>
        <p>
          Every ChatGPT message, every code completion, every RAG answer you deploy — that is inference. It
          happens on <em>every</em> user request and must be fast enough that people do not wait.
        </p>
      </Definition>

      <LessonSection title="The driving analogy">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-5">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-violet-400">Training</div>
              <div className="mt-2 text-lg font-semibold text-white">Learning to drive</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>Takes months of lessons and practice</li>
                <li>Expensive — instructor, car rental, your time</li>
                <li>You make mistakes and correct them (backward pass)</li>
                <li>Done once; you do not re-learn every morning</li>
              </ul>
            </div>
            <div>
              <div className="text-xs font-semibold uppercase tracking-wider text-genai-400">Inference</div>
              <div className="mt-2 text-lg font-semibold text-white">Daily commute</div>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-300">
                <li>You already know how — just drive</li>
                <li>Must be reliable every single trip</li>
                <li>Speed and safety matter (latency and uptime)</li>
                <li>Thousands of trips; each one must work</li>
              </ul>
            </div>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          Companies like OpenAI, Meta, and Mistral spend enormous resources on training (learning to drive). When
          you self-host Llama or use an API, you care about inference (the daily commute). This entire vLLM track
          is about making that commute fast, cheap, and able to carry many passengers at once.
        </p>
      </LessonSection>

      <LessonSection title="Side-by-side comparison">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Aspect</th>
                <th className="px-4 py-3">Training</th>
                <th className="px-4 py-3">Inference</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['Goal', 'Learn weights from data', 'Use frozen weights to answer users'],
                ['Passes through model', 'Forward + backward', 'Forward only'],
                ['How often', 'Once (or rare fine-tunes)', 'Every API call, every chat message'],
                ['Typical hardware', 'Many GPUs (8–10,000+)', 'One to a few GPUs per server'],
                ['Duration', 'Days to months', 'Milliseconds to seconds per request'],
                ['Main cost driver', 'Compute for gradient updates', 'Serving at scale, 24/7 uptime'],
                ['Who optimizes it', 'Research / training teams', 'ML platform / inference engineers'],
              ].map(([aspect, training, inference]) => (
                <tr key={aspect} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{aspect}</td>
                  <td className="px-4 py-3 text-slate-400">{training}</td>
                  <td className="px-4 py-3 text-slate-400">{inference}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </LessonSection>

      <LessonSection title="What happens in each phase">
        <Flowchart
          title="Training vs inference data flow"
          chart={`flowchart TB
  subgraph TRAIN[Training — learn weights]
    T1[Input text batch] --> T2[Forward pass]
    T2 --> T3[Compare prediction to correct answer]
    T3 --> T4[Backward pass — compute gradients]
    T4 --> T5[Update weights]
    T5 --> T2
  end
  subgraph INF[Inference — use weights]
    I1[User prompt] --> I2[Forward pass only]
    I2 --> I3[Pick next token]
    I3 --> I4[Append to output]
    I4 --> I5{Done?}
    I5 -- no --> I2
    I5 -- yes --> I6[Return text to user]
  end
  TRAIN -.->|save checkpoint| W[(Weight file)]
  W --> INF`}
        />

        <ContentStep number={1} title="Training updates the model">
          <p>
            During training, the model sees a prompt and a known correct continuation. It predicts tokens, measures
            error, and nudges billions of weights slightly in the right direction. This repeats for trillions of
            tokens across the internet.
          </p>
        </ContentStep>

        <ContentStep number={2} title="Inference only reads weights">
          <p>
            At inference time, weights are loaded from disk into GPU memory and never change. The model reads your
            prompt and generates tokens one at a time until it stops. There is no &quot;correct answer&quot; to
            compare against — only probabilities and sampling.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Why inference has different engineering constraints">
        <p className="text-slate-300">
          Training is a batch job: slow is annoying but acceptable. Inference is a <em>service</em>: users stare at
          a loading spinner. That difference drives every optimization in this track.
        </p>

        <ul className="mt-4 list-disc space-y-3 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Latency</strong> — Users expect the first word in under a second and
            smooth streaming after. A 200 ms delay per token feels broken.
          </li>
          <li>
            <strong className="text-white">Throughput</strong> — One GPU serving one user at a time wastes 90% of
            its capacity. Production systems batch dozens of requests together.
          </li>
          <li>
            <strong className="text-white">Memory</strong> — Training needs memory for gradients; inference needs
            memory for the <em>KV cache</em> (covered in the next lesson) which grows with every generated token.
          </li>
          <li>
            <strong className="text-white">Cost per token</strong> — Training cost is amortized over the model&apos;s
            lifetime. Inference cost is paid on every single request — at scale this dominates.
          </li>
          <li>
            <strong className="text-white">Uptime</strong> — Training can pause; inference servers must stay up
            24/7 with load balancing, health checks, and graceful restarts.
          </li>
        </ul>

        <Callout variant="insight" title="Why vLLM exists">
          HuggingFace <code className="font-mono text-sm">model.generate()</code> was built for research and
          notebooks — one request, one GPU, no batching. vLLM and similar engines were built because inference at
          scale is a <em>different engineering problem</em> than training or prototyping.
        </Callout>
      </LessonSection>

      <LessonSection title="A tiny code contrast">
        <p className="text-slate-300">
          You do not need to run this now — it shows how the <em>same model file</em> is used differently:
        </p>

        <Example
          title="Training step (simplified PyTorch)"
          caption="Requires optimizer, loss function, and backward pass. Never runs in production serving."
        >{`# TRAINING — weights change every step
loss = model(input_ids, labels=labels).loss
loss.backward()          # compute gradients (memory-heavy)
optimizer.step()         # update weights
optimizer.zero_grad()`}</Example>

        <Example
          title="Inference step (simplified)"
          caption="Forward only. This is what happens millions of times per day in production."
          output="Generated tokens streamed to the user"
        >{`# INFERENCE — weights are frozen
with torch.no_grad():   # no gradients needed
    output = model.generate(input_ids, max_new_tokens=256)
# model weights identical before and after`}</Example>

        <CodeBlock title="Mental model">{`Training  = learn the recipe (once, expensive)
Inference = cook the dish   (every order, must be fast)`}</CodeBlock>
      </LessonSection>

      <Callout variant="tip" title="What comes next">
        The next lesson breaks down <em>how</em> inference works inside the model — prefill vs decode, the
        autoregressive loop, and why long answers are slow. Then we cover GPUs and memory before introducing
        vLLM itself.
      </Callout>

      <KeyTakeaways
        items={[
          'Training learns weights via forward + backward passes; inference uses frozen weights with forward only.',
          'Training runs once on many GPUs; inference runs on every user request and must be fast.',
          'Think: learning to drive (training) vs daily commute (inference).',
          'Inference optimization targets latency, throughput, memory, cost-per-token, and uptime — not accuracy.',
          'Engines like vLLM exist because serving at scale is a different problem than training or notebook prototyping.',
        ]}
      />
    </LessonArticle>
  )
}
