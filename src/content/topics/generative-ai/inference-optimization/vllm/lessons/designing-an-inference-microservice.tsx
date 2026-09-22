import {
  Callout,
  ContentStep,
  Definition,
  Example,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DesigningAnInferenceMicroservice() {
  return (
    <LessonArticle>
      <Callout variant="beginner" title="Read this after">
        You have seen <em>vLLM Architecture</em>, <em>Deployment Patterns</em>, and{' '}
        <em>Throughput vs Latency</em>. This lesson zooms out: how do you design the whole microservice around
        the engine, and who on the team owns each piece?
      </Callout>

      <Definition term="Inference microservice">
        <p>
          A stateless, horizontally scalable HTTP/gRPC service whose job is to accept a prompt request, run it
          through an LLM, and return a completion — with sane SLOs, safe rollouts, observability, and cost
          controls. The <em>engine</em> (vLLM, TGI, TensorRT-LLM) is the core; the <em>microservice</em> is
          everything you wrap around it so it is production-worthy.
        </p>
      </Definition>

      <LessonSection title="The reference architecture">
        <Flowchart
          title="An inference microservice, end to end"
          chart={`flowchart TB
  CLIENT[Client / app]
  CLIENT --> GW[API Gateway<br/>auth, rate limit, WAF]
  GW --> ROUTER[Router / LB<br/>model + region + tenant]
  ROUTER --> GUARD_IN[Input Guardrails<br/>PII, prompt-injection]
  GUARD_IN --> SVC[Inference Service<br/>OpenAI-compatible API]
  SVC --> CACHE[(Prompt / Answer Cache)]
  SVC --> ENGINE["Engine (vLLM / TGI / TRT-LLM)"]
  ENGINE --> GUARD_OUT[Output Guardrails<br/>toxicity, groundedness]
  GUARD_OUT --> RESP[Streaming response]
  SVC -.-> OBS[(Metrics / Logs / Traces)]
  SVC -.-> BILL[(Usage & Cost meter)]`}
        />
        <p className="mt-3 text-slate-300">
          Every arrow is a place a request can fail. Every box is a place a team can specialise. Design them as
          separate concerns.
        </p>
      </LessonSection>

      <LessonSection title="The five design decisions that dominate everything else">
        <ContentStep number={1} title="One model per pod, or many?">
          <p className="text-slate-300">
            The cleanest design is <strong className="text-white">one model per deployment</strong> — a pod
            runs exactly one base model, sized for its GPU. Different models become different services behind a
            <em>model router</em>. Alternative: multi-LoRA on a shared base (vLLM supports hundreds of adapters
            per replica) — cheap when everyone uses the same base with different fine-tunes.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Optimise for latency (chat) or throughput (batch)?">
          <p className="text-slate-300">
            You cannot have both at once from the same replica. Two-pool pattern:
          </p>
          <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-300">
            <li><strong className="text-white">Latency pool</strong> — small <code>max_num_seqs</code>, tight TTFT, streams tokens. Serves user chat.</li>
            <li><strong className="text-white">Throughput pool</strong> — large batches, high <code>max_num_seqs</code>, high GPU utilisation. Serves offline jobs, RAG indexing, evals.</li>
          </ul>
        </ContentStep>
        <ContentStep number={3} title="Sync request-response or async job?">
          <p className="text-slate-300">
            Short chat completions run over the OpenAI-compatible HTTP endpoint with SSE streaming. Long jobs
            (a 50-turn research agent, a bulk-summarise) belong on a queue with a job ID and a result endpoint.
            Do not run 60-second requests over a synchronous HTTP path — you will fight timeouts everywhere
            (gateway, LB, mesh, client).
          </p>
        </ContentStep>
        <ContentStep number={4} title="Where do guardrails run?">
          <p className="text-slate-300">
            Input and output guardrails live <em>outside</em> the engine — usually a sidecar or a thin wrapper
            around the OpenAI-compatible client — so they can be updated without redeploying the model. See the
            <em> AI Security &amp; Guardrails</em> subtopic for the placement pattern.
          </p>
        </ContentStep>
        <ContentStep number={5} title="Statelessness and the KV cache paradox">
          <p className="text-slate-300">
            HTTP layer must be stateless (any pod can serve any request). But the engine holds a very stateful
            KV cache and a prefix cache — that state is where the speed comes from. Reconcile with{' '}
            <strong className="text-white">consistent-hash routing on prefix</strong>: identical system prompts
            land on the same replica so the prefix cache hits, without making the service statefully aware.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Interfaces — pick one and be strict">
        <p className="text-slate-300">
          Ship an <strong className="text-white">OpenAI-compatible</strong> HTTP surface even for self-hosted
          models. Every SDK, every framework (LangChain, LlamaIndex, LlamaStack), every eval tool speaks it.
          You get to swap providers with an env var change.
        </p>
        <Example title="Minimal contract">{`POST /v1/chat/completions
  headers: Authorization: Bearer <api-key>
           x-tenant-id: <tenant>          # for routing + billing
           x-request-id: <uuid>           # for tracing
  body:    { model, messages, stream, temperature, max_tokens, ... }

response (stream=false): OpenAI chat.completion
response (stream=true):  text/event-stream of chat.completion.chunk

GET  /v1/models        # discoverable list
GET  /healthz          # liveness (process up)
GET  /readyz           # readiness (engine loaded, KV budget available)
GET  /metrics          # Prometheus`}</Example>
      </LessonSection>

      <LessonSection title="Reliability — the SLOs you must own">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Metric</th>
                <th className="px-4 py-3">Typical target (chat)</th>
                <th className="px-4 py-3">What breaks it</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['TTFT p95', '< 500 ms', 'Cold prefix cache, long system prompt, saturated batch'],
                ['TPOT p95', '< 40 ms',  'Over-scheduling, KV pressure, small model on wrong GPU'],
                ['Availability', '99.9% monthly', 'Pod restarts, engine crashes on OOM, dependency outage'],
                ['Wrong-response rate', '< eval threshold', 'Model regression on release; missing guardrail'],
                ['Cost per 1K tokens', 'Under budget', 'Idle GPUs, no prompt cache, wrong-sized model'],
              ].map(([m, t, b]) => (
                <tr key={m}>
                  <td className="px-4 py-3 font-semibold text-white">{m}</td>
                  <td className="px-4 py-3 text-slate-400">{t}</td>
                  <td className="px-4 py-3 text-slate-400">{b}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="tip" title="Two-signal alerting">
          Alert on TTFT p95 <em>and</em> queue depth together — TTFT alone flaps under normal load, queue depth
          alone hides when concurrency changed. Together they catch real saturation.
        </Callout>
      </LessonSection>

      <LessonSection title="Rolling out safely">
        <ContentStep number={1} title="Canary by traffic percentage">
          <p className="text-slate-300">
            Route 1–5% of traffic to a new model or engine version. Watch quality metrics from online evals in
            addition to latency. If online evals regress, roll back before the canary widens.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Shadow before canary">
          <p className="text-slate-300">
            For a completely new model, mirror requests to the new engine and compare responses offline. No
            user impact; you learn regressions before flipping any traffic.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Version pinning">
          <p className="text-slate-300">
            Model name in the API is really <em>model + version</em>. Clients specify{' '}
            <code>llama-3-8b@2025-09-01</code>, not just <code>llama-3-8b</code>. Otherwise you cannot A/B or
            roll back.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Autoscaling GPUs is harder than autoscaling CPUs">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Cold start is slow</strong> — loading a 70B model takes 60–180 s. Scale on <em>predicted</em> load, not reactive CPU utilisation, and keep a warm pool.</li>
          <li><strong className="text-white">CPU/memory metrics are meaningless</strong> — scale on TTFT p95, queue depth, or GPU busy% (via <code>nvidia-smi</code>/DCGM exporter). Not container CPU.</li>
          <li><strong className="text-white">Spot GPUs need graceful drain</strong> — a preemption signal must stop accepting requests, flush the KV cache, and rehome traffic before eviction.</li>
          <li><strong className="text-white">Scale-to-zero is a business decision</strong> — pay less at night vs pay for a 3-minute cold-start. Both are valid.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Cost controls that live in the service">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li><strong className="text-white">Per-tenant quotas</strong> — tokens/day and RPS caps enforced at the gateway.</li>
          <li><strong className="text-white">Prompt caching</strong> — enabled at the engine (vLLM prefix caching) and, when using a hosted API, via provider prompt caching.</li>
          <li><strong className="text-white">Answer caching</strong> — for deterministic prompts (temperature 0, cacheable business queries), cache the completion by hash.</li>
          <li><strong className="text-white">Right-model routing</strong> — small model for easy queries, big model on escalation. Track the routing decision in the trace.</li>
          <li><strong className="text-white">Cap output tokens</strong> — the single biggest runaway-cost lever.</li>
        </ul>
      </LessonSection>

      <LessonSection title="Observability that survives real incidents">
        <p className="text-slate-300">
          Three signals are non-negotiable. Add them from day one:
        </p>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-slate-300">
          <li><strong className="text-white">Metrics</strong> (Prometheus): TTFT, TPOT, tokens/sec, KV cache utilisation, queue depth, batch size, GPU busy%, error rate per model.</li>
          <li><strong className="text-white">Traces</strong> (OpenTelemetry): request ID all the way from gateway → router → guardrails → engine → response. Use it to answer &ldquo;why was this one slow?&rdquo;.</li>
          <li><strong className="text-white">Logs</strong>: prompt + response hashes (never raw), tokens in/out, tenant, model version, guardrail decisions, cache hit/miss. See the Langfuse and LangSmith lessons for tooling.</li>
        </ol>
      </LessonSection>

      <LessonSection title="Who owns what — team roles">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">What they own</th>
                <th className="px-4 py-3">Where they show up in the diagram</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['ML Engineer',            'Model choice, fine-tuning, evals, prompt design, quantization',            'Engine + evals'],
                ['ML Platform / MLOps',    'Serving engine tuning, GPU packing, autoscaling, deployment pipeline',      'Router → engine + observability'],
                ['SRE / Platform',         'Kubernetes, gateway, LB, health checks, capacity, incident response',       'Gateway + LB + runtime'],
                ['Security',               'Auth, rate limits, guardrails, PII redaction, jailbreak detection',         'Gateway + guardrails'],
                ['Data Engineer',          'RAG ingestion, embedding pipelines, dataset governance',                    'Upstream of the service (RAG side)'],
                ['Product / PM',           'Use cases, SLAs, quality targets, cost budgets',                            'Everywhere as requirements'],
                ['Legal / Compliance',     'Data residency, retention, audit, model-use policy',                        'Guardrails + logging'],
              ].map(([r, own, where]) => (
                <tr key={r}>
                  <td className="px-4 py-3 font-semibold text-white">{r}</td>
                  <td className="px-4 py-3 text-slate-400">{own}</td>
                  <td className="px-4 py-3 text-slate-400">{where}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Callout variant="insight" title="The interface is the org chart">
          Draw the microservice diagram, then draw a box around each team&rsquo;s scope. Wherever those two
          boxes disagree, you have a coordination cost that will show up as an incident. Redesign the service
          <em> or</em> redesign the team so the boundaries match.
        </Callout>
      </LessonSection>

      <LessonSection title="A pre-launch checklist">
        <ul className="list-disc space-y-1 pl-5 text-slate-300">
          <li>OpenAI-compatible endpoint with <code>/healthz</code> and <code>/readyz</code>.</li>
          <li>Auth, rate limit, and per-tenant quota at the gateway.</li>
          <li>Input + output guardrails wired as separate services.</li>
          <li>Prompt cache on; consistent-hash routing on system prompt.</li>
          <li>TTFT p95, TPOT p95, queue depth, GPU busy% dashboards + alerts.</li>
          <li>Traces from gateway → engine with request ID propagation.</li>
          <li>Canary and shadow rollout runbooks; model versions pinned.</li>
          <li>Graceful drain script for spot preemption / rolling restart.</li>
          <li>Online eval sampling &gt;= 1% of traffic through LangSmith / Langfuse.</li>
          <li>Per-tenant cost dashboard.</li>
        </ul>
      </LessonSection>

      <KeyTakeaways
        items={[
          'The inference microservice is the wrapper: gateway, router, guardrails, engine, cache, observability, and cost meter. The engine is one component of many.',
          'Design decisions that dominate everything else: one-model-per-pod vs multi-LoRA, latency vs throughput pool, sync vs async, guardrail placement, and prefix-consistent routing.',
          'Ship an OpenAI-compatible surface even for self-hosted models — every tool and SDK speaks it.',
          'Own SLOs on TTFT p95, TPOT p95, availability, wrong-response rate, and cost per 1K tokens.',
          'Autoscale on TTFT / queue depth / GPU busy%, not on CPU. Keep a warm pool because cold starts are minutes, not seconds.',
          'Team roles map onto boxes in the architecture — ML, MLOps, SRE, security, data, product, legal. When the diagram and the org chart disagree, expect incidents.',
        ]}
      />
    </LessonArticle>
  )
}
