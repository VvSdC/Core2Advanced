import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ContinuousBatching() {
  return (
    <LessonArticle>
      <LessonSection title="The batching problem in LLM serving">
        <p className="text-slate-300">
          GPUs are massively parallel — they are fastest when processing many items at once.{' '}
          <strong className="text-white">Batching</strong> groups multiple requests into a single forward pass
          to keep the GPU busy. But LLM generation is tricky: each request produces a different number of
          output tokens and finishes at a different time.
        </p>
        <Callout variant="beginner" title="Analogy: a bus that waits for the slowest passenger">
          Static batching is like a bus that will not leave until <em>every</em> passenger is on board, and
          will not drop anyone off until <em>every</em> passenger reaches the final stop. One person who needs
          50 stops holds up everyone who only needed 3. The bus (GPU) sits idle while waiting.
        </Callout>
      </LessonSection>

      <Definition term="Static batching">
        <p>
          In <strong className="text-white">static batching</strong>, a fixed group of requests enters a batch
          together and must all complete before the batch is released. If Request A needs 10 tokens and Request
          B needs 500 tokens, the GPU processes both for all 500 decode steps — even though Request A finished
          at step 10 and wastes 490 steps of slot capacity.
        </p>
      </Definition>

      <LessonSection title="Static batching timeline — where time is wasted">
        <Flowchart
          title="Static batching — blocked by the slowest request"
          chart={`flowchart TB
  subgraph batch ["Batch of 3 requests"]
    R1["Req 1 — 5 tokens"]
    R2["Req 2 — 20 tokens"]
    R3["Req 3 — 50 tokens"]
  end
  S1[Step 1-5: all 3 active]
  S2[Step 6-20: Req 1 slot wasted]
  S3[Step 21-50: Req 1 and 2 slots wasted]
  batch --> S1 --> S2 --> S3
  S3 --> DONE[Batch finally released]`}
        />
        <p className="mt-4 text-slate-300">
          During steps 6–50, Request 1&apos;s GPU slot does nothing useful. During steps 21–50, two slots are
          idle. At scale with variable-length outputs, static batching can waste{' '}
          <strong className="text-white">50% or more</strong> of GPU compute.
        </p>
      </LessonSection>

      <Definition term="Continuous batching (iteration-level scheduling)">
        <p>
          <strong className="text-white">Continuous batching</strong> (also called{' '}
          <strong className="text-white">iteration-level scheduling</strong>) runs the GPU forward pass one
          decode step at a time. After each step, finished requests leave the batch and new requests join —
          mid-flight, without waiting for the entire batch to complete.
        </p>
        <p className="mt-3">
          vLLM&apos;s scheduler performs this every iteration: evict done sequences, admit waiting sequences,
          rebuild the batch, launch one forward pass. The GPU almost always runs at full batch capacity.
        </p>
      </Definition>

      <LessonSection title="Continuous batching timeline — slots stay full">
        <p className="mb-4 text-slate-300">
          Here is the same three requests, but with continuous batching. When Request 1 finishes at step 5,
          Request 4 immediately takes its slot:
        </p>
        <div className="overflow-x-auto rounded-xl border border-surface-600 bg-surface-900 p-4 font-mono text-xs text-slate-300 md:text-sm">
          <div className="grid grid-cols-[80px_1fr_1fr_1fr_1fr] gap-1">
            <div className="text-slate-500">Step</div>
            <div>GPU slot 1</div>
            <div>GPU slot 2</div>
            <div>GPU slot 3</div>
            <div>GPU slot 4</div>

            <div className="text-slate-500">1–5</div>
            <div className="text-genai-400">Req 1</div>
            <div>Req 2</div>
            <div>Req 3</div>
            <div className="text-slate-600">—</div>

            <div className="text-slate-500">6</div>
            <div className="text-emerald-400">Req 4 joins</div>
            <div>Req 2</div>
            <div>Req 3</div>
            <div className="text-slate-600">—</div>

            <div className="text-slate-500">7–20</div>
            <div>Req 4</div>
            <div>Req 2</div>
            <div>Req 3</div>
            <div className="text-slate-600">—</div>

            <div className="text-slate-500">21</div>
            <div>Req 4</div>
            <div className="text-emerald-400">Req 5 joins</div>
            <div>Req 3</div>
            <div className="text-slate-600">—</div>

            <div className="text-slate-500">22–50</div>
            <div>Req 4</div>
            <div>Req 5</div>
            <div>Req 3</div>
            <div className="text-slate-600">—</div>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          No slot sits idle while work waits in the queue. Throughput (total tokens per second across all users)
          increases dramatically because the GPU processes useful work every single step.
        </p>
        <Flowchart
          title="Continuous batching loop"
          chart={`flowchart TB
  START([Scheduler tick]) --> EVICT[Remove finished requests]
  EVICT --> ADMIT[Admit new requests from queue]
  ADMIT --> BUILD[Rebuild batch tensor]
  BUILD --> FWD[One GPU forward pass]
  FWD --> APPEND[Append tokens, update KV cache]
  APPEND --> CHECK{More tokens to generate?}
  CHECK -->|Yes| START
  CHECK -->|No| FIN([Request complete])`}
        />
      </LessonSection>

      <LessonSection title="Prefill vs decode in the same scheduler">
        <ContentStep number={1} title="Prefill — process the prompt">
          <p>
            New requests first enter a <strong className="text-white">prefill</strong> phase: all prompt tokens
            are processed in parallel to fill the KV cache. Prefill is compute-heavy (large matrix multiplies).
            vLLM can batch multiple prefills together or interleave prefill with decode steps.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Decode — one token per step">
          <p>
            After prefill, the request enters the <strong className="text-white">decode</strong> loop — one
            token per iteration. This is where continuous batching matters most: decode runs thousands of times
            per request, so keeping slots full every iteration has the biggest throughput impact.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Chunked prefill">
          <p>
            Long prompts can monopolize the GPU during prefill. vLLM supports{' '}
            <strong className="text-white">chunked prefill</strong> — splitting a long prompt across multiple
            scheduler iterations so decode requests are not starved.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Continuous vs traditional batch inference">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="grid gap-6 md:grid-cols-2">
            <div>
              <div className="font-semibold text-white">Traditional (static) batching</div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-400">
                <li>Fixed batch for entire generation</li>
                <li>Blocked by slowest request</li>
                <li>Simple to implement</li>
                <li>Low GPU utilization with variable lengths</li>
                <li>Common in naive HuggingFace scripts</li>
              </ul>
            </div>
            <div>
              <div className="font-semibold text-genai-400">Continuous batching (vLLM)</div>
              <ul className="mt-2 list-disc space-y-1 pl-4 text-slate-300">
                <li>Requests join and leave every iteration</li>
                <li>GPU slots stay full</li>
                <li>Scheduler manages admission/eviction</li>
                <li>2–10× higher throughput in production</li>
                <li>Requires PagedAttention for flexible memory</li>
              </ul>
            </div>
          </div>
        </div>
        <Callout variant="insight" title="Why PagedAttention and continuous batching go together">
          Continuous batching only works if memory can be allocated and freed per-request at iteration
          granularity. PagedAttention provides exactly that — pages are freed the moment a request finishes,
          and immediately available for a newly admitted request.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Static batching waits for the slowest request — idle GPU slots waste compute on variable-length outputs.',
          'Continuous batching adds/removes requests after every decode iteration (iteration-level scheduling).',
          'The scheduler evicts finished sequences and admits waiting ones before each forward pass.',
          'Timeline effect: GPU slots stay full → dramatically higher aggregate tokens/sec (throughput).',
          'Works hand-in-hand with PagedAttention — pages freed on completion are instantly reusable.',
        ]}
      />
    </LessonArticle>
  )
}
