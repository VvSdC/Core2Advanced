import {
  Callout,
  CodeBlock,
  Flowchart,
  KeyTakeaways,
  LessonArticle,
  LessonSection,
} from '../../../../../../components/content'

export function ProductionDeployment() {
  return (
    <LessonArticle>
      <LessonSection title="From llama-server to production">
        <p className="text-slate-300">
          Running <code className="font-mono text-sm">llama-server</code> in a terminal works for development.
          Production means the process survives reboots, stays within resource limits, sits behind a reverse proxy,
          and reports health to orchestrators.
        </p>
        <Flowchart
          title="Production topology"
          chart={`flowchart LR
  C[Clients] --> RP[Reverse proxy / TLS]
  RP --> S1[llama-server instance]
  RP --> S2[llama-server instance]
  S1 --> M[GGUF on disk / volume]
  S2 --> M`}
        />
      </LessonSection>

      <LessonSection title="systemd service">
        <p className="text-slate-300">
          On Linux VMs, <strong className="text-white">systemd</strong> keeps llama-server running, restarts on
          failure, and applies cgroup resource limits.
        </p>
        <CodeBlock title="/etc/systemd/system/llama-server.service">{`[Unit]
Description=llama.cpp inference server
After=network.target

[Service]
Type=simple
User=llama
WorkingDirectory=/opt/llama.cpp
ExecStart=/opt/llama.cpp/llama-server \\
  -m /data/models/Llama-3.1-8B-Q4_K_M.gguf \\
  -c 8192 -ngl 99 --host 127.0.0.1 --port 8080
Restart=on-failure
RestartSec=5

# Resource limits
MemoryMax=24G
CPUQuota=800%

[Install]
WantedBy=multi-user.target`}</CodeBlock>
        <CodeBlock title="Enable and manage">{`sudo systemctl daemon-reload
sudo systemctl enable --now llama-server
sudo systemctl status llama-server
journalctl -u llama-server -f`}</CodeBlock>
        <ul className="mt-4 list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">Bind to 127.0.0.1</strong> — expose only through nginx/Caddy with TLS.
          </li>
          <li>
            <strong className="text-white">MemoryMax</strong> — prevents runaway context growth from taking down
            the host.
          </li>
          <li>
            <strong className="text-white">Dedicated user</strong> — do not run as root.
          </li>
        </ul>
      </LessonSection>

      <LessonSection title="Docker deployment">
        <CodeBlock title="Dockerfile sketch">{`FROM ghcr.io/ggerganov/llama.cpp:full-cuda

COPY models/ /models/
EXPOSE 8080

CMD ["--server", "-m", "/models/Llama-3.1-8B-Q4_K_M.gguf",
     "-c", "8192", "-ngl", "99", "--host", "0.0.0.0", "--port", "8080"]`}</CodeBlock>
        <CodeBlock title="docker run with GPU and limits">{`docker run -d --name llama \\
  --gpus all \\
  --memory=24g --cpus=8 \\
  -p 8080:8080 \\
  -v /data/models:/models:ro \\
  --restart unless-stopped \\
  my-llama-server:latest`}</CodeBlock>
        <Callout variant="tip">
          Pin image tags and mount models read-only. Pre-bake GGUF into the image for immutable deploys, or mount a
          volume for easier model swaps without rebuilds.
        </Callout>
      </LessonSection>

      <LessonSection title="Reverse proxy and TLS">
        <p className="text-slate-300">
          Terminate TLS at nginx or Caddy. Enable streaming for Server-Sent Events — disable response buffering.
        </p>
        <CodeBlock title="nginx upstream">{`upstream llama_backend {
    least_conn;
    server 127.0.0.1:8080;
    server 127.0.0.1:8081;
}

server {
    listen 443 ssl;
    server_name llm.example.com;

    location / {
        proxy_pass http://llama_backend;
        proxy_http_version 1.1;
        proxy_set_header Connection "";
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Health checks">
        <p className="text-slate-300">
          llama-server exposes HTTP endpoints for readiness. Use them in Kubernetes probes or external uptime
          monitors — not just TCP port checks.
        </p>
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>
            <strong className="text-white">GET /health</strong> — server is up and model loaded (when supported by
            your build).
          </li>
          <li>
            <strong className="text-white">Synthetic completion</strong> — periodic short prompt from outside the
            cluster validates end-to-end inference.
          </li>
          <li>
            <strong className="text-white">Long initialDelaySeconds</strong> — large GGUF load can take minutes on
            cold start.
          </li>
          <li>
            <strong className="text-white">Liveness vs readiness</strong> — readiness fails during model swap;
            liveness should tolerate long generations.
          </li>
        </ul>
        <CodeBlock title="Kubernetes probe sketch">{`readinessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 120
  periodSeconds: 10
livenessProbe:
  httpGet:
    path: /health
    port: 8080
  initialDelaySeconds: 180
  periodSeconds: 30`}</CodeBlock>
      </LessonSection>

      <LessonSection title="Resource limits checklist">
        <ul className="list-disc space-y-2 pl-5 text-slate-300">
          <li>Size RAM for model weights + KV cache at max context × expected parallel slots.</li>
          <li>Set <code className="font-mono text-sm">-np</code> (parallel slots) to cap concurrent requests.</li>
          <li>Monitor GPU VRAM — <code className="font-mono text-sm">-ngl</code> offloads layers; too many slots OOMs.</li>
          <li>Log rotation for journald or Docker — long-running servers generate verbose stats.</li>
          <li>Auth and rate limits at the proxy — llama-server has no built-in multi-tenant security.</li>
        </ul>
      </LessonSection>

      <Callout variant="beginner">
        llama.cpp production is usually <strong className="text-white">one model per instance</strong>. Scale by
        adding replicas behind a load balancer — not by cramming many unrelated models into one process.
      </Callout>

      <KeyTakeaways
        items={[
          'Use systemd or Docker with restart policies, memory limits, and read-only model mounts.',
          'Terminate TLS at a reverse proxy; disable buffering for streaming responses.',
          'Health checks must account for long model load times — use /health plus synthetic completions.',
          'Cap parallelism with -np and cgroup limits; auth belongs at the gateway, not inside llama-server.',
        ]}
      />
    </LessonArticle>
  )
}
