import {
  Callout,
  ContentStep,
  Definition,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
  StepSequence,
} from '../../../../../../components/content'

export function SchedulerAndRequestLifecycle() {
  return (
    <LessonArticle>
      <LessonSection title="Every request has a journey">
        <p className="text-slate-300">
          From the moment a client sends a prompt to the moment the last token streams back, a request passes
          through distinct <strong className="text-white">states</strong> managed by vLLM&apos;s scheduler.
          Understanding this lifecycle explains latency, queueing behavior, and what happens when your GPU is
          saturated.
        </p>
        <Callout variant="beginner" title="Analogy: a ride at an amusement park">
          You arrive (request submitted), wait in line (waiting queue), board the ride (prefill — loading
          everyone at once), enjoy the slow climb token by token (decode loop), and exit at the end (finished).
          If the ride is full, you keep waiting. VIP passes (priority) can jump the queue.
        </Callout>
      </LessonSection>

      <LessonSection title="Request lifecycle — state machine">
        <Flowchart
          title="Request state transitions"
          chart={`flowchart TB
  ARRIVE([Client sends request]) --> WAITING[Waiting — in queue]
  WAITING -->|Scheduler admits| PREFILL[Prefill — process prompt tokens]
  PREFILL --> DECODE[Decode — generate one token per iteration]
  DECODE -->|More tokens needed| DECODE
  DECODE -->|EOS or max_tokens| FINISHED[Finished — free KV pages]
  DECODE -->|GPU memory pressure| PREEMPTED[Preempted — swapped out]
  PREEMPTED -->|Memory available| WAITING
  FINISHED --> RESPONSE([Tokens streamed to client])`}
        />
        <p className="mt-4 text-slate-300">
          Most requests flow cleanly: <strong className="text-white">Waiting → Prefill → Decode → Finished</strong>.
          Preemption is the exception — it happens only when the GPU runs out of KV cache memory mid-flight.
        </p>
      </LessonSection>

      <StepSequence
        steps={[
          {
            title: 'Waiting — queued for admission',
            description: (
              <p>
                The request sits in a FIFO queue (or priority queue if configured). The scheduler has not
                allocated KV cache pages yet. The client may receive a HTTP 200 immediately (streaming
                connection opened) but no tokens until admission.
              </p>
            ),
          },
          {
            title: 'Prefill — process the entire prompt',
            description: (
              <p>
                The scheduler allocates KV cache pages and runs a forward pass over all prompt tokens in
                parallel. This phase is <strong className="text-white">compute-bound</strong> — latency scales
                with prompt length. Time-to-first-token (TTFT) is dominated by prefill duration.
              </p>
            ),
          },
          {
            title: 'Decode loop — one token per iteration',
            description: (
              <p>
                Each scheduler tick runs one forward pass, samples one token per active sequence, appends it
                to the output, and streams it to the client. The request stays in the decode state until a
                stopping condition is met: EOS token, <code className="text-genai-400">max_tokens</code> reached,
                or a custom stop string detected.
              </p>
            ),
          },
          {
            title: 'Finished — cleanup and memory reclaim',
            description: (
              <p>
                KV cache pages are returned to the free pool. The sequence slot opens for a new waiting request.
                The HTTP stream closes. Total latency = prefill time + (num_output_tokens × decode_time_per_token).
              </p>
            ),
          },
        ]}
      />

      <Definition term="max_num_seqs">
        <p>
          <code className="text-genai-400">max_num_seqs</code> is the maximum number of sequences (requests)
          the scheduler will run <strong className="text-white">concurrently</strong> on the GPU. It caps
          batch size for decode iterations. Higher values increase throughput but consume more KV cache memory
          per iteration. Typical values: 64–256 depending on model size and GPU VRAM.
        </p>
      </Definition>

      <LessonSection title="Scheduler decisions each iteration">
        <ContentStep number={1} title="Check finished sequences">
          <p>
            Any sequence that produced an EOS token or hit <code className="text-genai-400">max_tokens</code>{' '}
            is marked finished. Its KV pages are freed immediately via PagedAttention&apos;s page pool.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Admit waiting sequences">
          <p>
            The scheduler pulls requests from the waiting queue until either{' '}
            <code className="text-genai-400">max_num_seqs</code> is reached or GPU memory cannot fit another
            KV cache. Newly admitted requests enter prefill on the next iteration (or a dedicated prefill batch).
          </p>
        </ContentStep>
        <ContentStep number={3} title="Build and launch batch">
          <p>
            Active sequences (prefill + decode) are packed into a batch tensor. Block tables tell workers where
            each sequence&apos;s KV pages live in physical GPU memory. One forward pass executes.
          </p>
        </ContentStep>
        <ContentStep number={4} title="Apply priority (optional)">
          <p>
            vLLM supports <strong className="text-white">priority scheduling</strong> — higher-priority
            requests are admitted before lower-priority ones when slots open. Useful for production systems
            that need to favor paid users or critical workflows over background jobs.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="What happens when the GPU is full">
        <p className="text-slate-300">
          GPU memory has two limits: <strong className="text-white">sequence count</strong> (
          <code className="text-genai-400">max_num_seqs</code>) and <strong className="text-white">KV cache
          capacity</strong> (total pages available). When either limit is hit, new requests stay in the waiting
          queue.
        </p>
        <Flowchart
          title="GPU full — admission blocked"
          chart={`flowchart TB
  FULL[GPU at capacity — max_num_seqs or KV pages exhausted]
  FULL --> Q[New requests queue in Waiting state]
  Q --> MON[Scheduler monitors each iteration]
  MON --> SLOT{Slot or pages freed?}
  SLOT -->|Yes — request finished| ADMIT[Admit next waiting request]
  SLOT -->|No| PREEMPT{Enable preemption?}
  PREEMPT -->|Yes| SWAP[Swap out low-priority decode sequence]
  PREEMPT -->|No| Q
  SWAP --> ADMIT
  ADMIT --> RUN[New request enters Prefill]`}
        />
        <Callout variant="insight" title="Preemption — the last resort">
          When memory is exhausted and high-priority work arrives, vLLM can{' '}
          <strong className="text-white">preempt</strong> a running sequence — evicting its KV cache pages to
          CPU memory or discarding them (forcing a re-prefill later). This is expensive (recomputing prefill) so
          it is used sparingly. Most deployments size <code className="text-genai-400">max_num_seqs</code> and
          GPU memory to avoid preemption in normal operation.
        </Callout>
      </LessonSection>

      <LessonSection title="Tuning scheduler behavior">
        <div className="rounded-xl border border-surface-600 bg-surface-900 p-4 text-sm">
          <div className="space-y-3">
            <div>
              <code className="text-genai-400">max_num_seqs</code>
              <span className="ml-2 text-slate-400">— max concurrent sequences. ↑ throughput, ↑ memory.</span>
            </div>
            <div>
              <code className="text-genai-400">max_num_batched_tokens</code>
              <span className="ml-2 text-slate-400">— max total tokens per iteration (prefill + decode). Caps prefill burst size.</span>
            </div>
            <div>
              <code className="text-genai-400">gpu_memory_utilization</code>
              <span className="ml-2 text-slate-400">— fraction of GPU VRAM vLLM may use (default 0.9). Affects KV cache pool size.</span>
            </div>
            <div>
              <code className="text-genai-400">enable_chunked_prefill</code>
              <span className="ml-2 text-slate-400">— split long prefills across iterations so decode is not starved.</span>
            </div>
            <div>
              <code className="text-genai-400">preemption_mode</code>
              <span className="ml-2 text-slate-400">— swap (save KV to CPU) or recompute (discard and re-prefill later).</span>
            </div>
          </div>
        </div>
        <p className="mt-4 text-slate-300">
          The right settings depend on your workload: chat apps with short outputs favor high{' '}
          <code className="text-genai-400">max_num_seqs</code>; RAG with long document prefills favors chunked
          prefill and higher <code className="text-genai-400">max_num_batched_tokens</code>.
        </p>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Request lifecycle: Waiting → Prefill → Decode loop → Finished (with optional Preempted).',
          'Prefill processes the prompt (sets TTFT); decode generates one token per scheduler iteration.',
          'max_num_seqs caps concurrent sequences; gpu_memory_utilization caps total KV cache pages.',
          'When GPU is full, new requests wait in queue until a slot or pages are freed.',
          'Preemption evicts running sequences under memory pressure — expensive, avoided by proper sizing.',
        ]}
      />
    </LessonArticle>
  )
}
