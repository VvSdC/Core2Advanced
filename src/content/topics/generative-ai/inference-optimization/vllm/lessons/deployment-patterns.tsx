import {
  Callout,
  CodeBlock,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function DeploymentPatterns() {
  return (
    <LessonArticle>
      <LessonSection title="From laptop to production fleet">
        <p className="text-slate-300">
          Running <code className="font-mono text-sm">vllm serve</code> locally is step one. Production means
          containerized replicas, orchestration, load balancing, health checks, and graceful upgrades — without
          dropping in-flight generations.
        </p>
        <Flowchart
          title="Typical production topology"
          chart={`flowchart LR
  C[Clients] --> LB[Load balancer / API gateway]
  LB --> R1[vLLM replica 1]
  LB --> R2[vLLM replica 2]
  LB --> R3[vLLM replica N]
  R1 --> G[GPU node]
  R2 --> G
  R3 --> G`}
        />
      </LessonSection>

      <LessonSection title="Docker deployment">
        <p className="text-slate-300">
          Use the official <code className="font-mono text-sm">vllm/vllm-openai</code> image (or build from source
          for bleeding-edge features). Mount Hugging Face cache, pass GPU devices, and expose port 8000.
        </p>
        <CodeBlock title="docker run">{`docker run --gpus all -d \\
  --name vllm-llama8b \\
  -p 8000:8000 \\
  -v ~/.cache/huggingface:/root/.cache/huggingface \\
  -e HF_TOKEN=$HF_TOKEN \\
  vllm/vllm-openai:latest \\
  --model meta-llama/Llama-3.1-8B-Instruct \\
  --max-model-len 8192 \\
  --gpu-memory-utilization 0.90`}</CodeBlock>
        <Callout variant="tip">
          Pin image tags in production (<code className="font-mono text-sm">v0.6.3</code> not{' '}
          <code className="font-mono text-sm">latest</code>). vLLM releases move quickly; unexpected upgrades break
          serving.
        </Callout>
      </LessonSection>

      <LessonSection title="Kubernetes patterns">
        <p className="text-slate-300">
          Each vLLM pod typically requests one or more full GPUs via device plugins (NVIDIA GPU Operator). Use a
          Deployment with <code className="font-mono text-sm">replicas</code> scaled to GPU capacity — not HPA on
          CPU (meaningless for LLM serving).
        </p>
        <CodeBlock title="Kubernetes Deployment sketch">{`apiVersion: apps/v1
kind: Deployment
metadata:
  name: vllm-llama8b
spec:
  replicas: 2
  template:
    spec:
      containers:
        - name: vllm
          image: vllm/vllm-openai:v0.6.3
          args:
            - --model=meta-llama/Llama-3.1-8B-Instruct
            - --max-model-len=8192
          resources:
            limits:
              nvidia.com/gpu: 1
          ports:
            - containerPort: 8000
          livenessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 120
            periodSeconds: 30
          readinessProbe:
            httpGet:
              path: /health
              port: 8000
            initialDelaySeconds: 60
            periodSeconds: 10`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Long initialDelaySeconds</strong> — model load takes 1–5+ minutes for
            large models.
          </li>
          <li>
            <strong className="text-white">One model per Deployment</strong> — different models = different
            Deployments and Services.
          </li>
          <li>
            <strong className="text-white">PVC for model cache</strong> — avoid re-downloading weights on every
            pod restart.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Load balancer and routing">
        <div className="overflow-x-auto rounded-xl border border-surface-600">
          <table className="w-full text-sm text-slate-300">
            <thead>
              <tr className="border-b border-surface-600 bg-surface-800 text-left text-xs uppercase tracking-wider text-slate-400">
                <th className="px-4 py-3">Layer</th>
                <th className="px-4 py-3">Role</th>
                <th className="px-4 py-3">Notes</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-600">
              {[
                ['L7 LB (nginx, Envoy, ALB)', 'Route /v1/chat/completions to vLLM pool', 'Round-robin or least-conn; enable streaming'],
                ['API gateway', 'Auth, rate limits, model routing', 'Map external model names to internal LoRA IDs'],
                ['Service mesh', 'mTLS, retries, circuit breakers', 'Careful with retries on long streams — duplicate tokens'],
                ['Sticky sessions', 'Usually NOT needed', 'vLLM is stateless per request; KV is internal'],
              ].map(([layer, role, notes]) => (
                <tr key={layer} className="hover:bg-surface-800/50">
                  <td className="px-4 py-3 font-semibold text-white">{layer}</td>
                  <td className="px-4 py-3 text-slate-400">{role}</td>
                  <td className="px-4 py-3 text-slate-400">{notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <CodeBlock title="nginx upstream (streaming)">{`upstream vllm_backend {
    least_conn;
    server vllm-1:8000;
    server vllm-2:8000;
}

location /v1/ {
    proxy_pass http://vllm_backend;
    proxy_http_version 1.1;
    proxy_set_header Connection "";
    proxy_buffering off;          # required for SSE streaming
    proxy_read_timeout 300s;
}`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Health checks">
        <p className="text-slate-300">
          vLLM exposes <code className="font-mono text-sm">GET /health</code> — returns 200 when the server is ready
          to accept traffic. Use readiness to stop routing during model load; use liveness to restart stuck pods.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Readiness</strong> — fail until model weights loaded and CUDA
            initialized.
          </li>
          <li>
            <strong className="text-white">Liveness</strong> — detect deadlocks; avoid aggressive timeouts during
            long generations.
          </li>
          <li>
            <strong className="text-white">Synthetic canary</strong> — periodic short completion from outside the
            cluster validates end-to-end path.
          </li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        Scale horizontally (more replicas) before vertically (bigger GPUs) when TTFT queue depth is the bottleneck.
        Each replica needs its own GPU(s) — vLLM does not share one model across nodes without tensor/pipeline
        parallel configured explicitly.
      </Callout>

      <KeyTakeaways
        items={[
          'Containerize with official vLLM images; pin versions and mount HF cache volumes.',
          'Kubernetes: GPU requests, long probe delays, /health for readiness, one Deployment per model.',
          'Load balancers must disable buffering for SSE streaming; least-conn beats round-robin under load.',
          'vLLM is stateless per request — scale replicas horizontally without sticky sessions.',
        ]}
      />
    </LessonArticle>
  )
}
