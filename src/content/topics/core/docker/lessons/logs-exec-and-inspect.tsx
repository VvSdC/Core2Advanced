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
} from '../../../../../components/content'

export function LogsExecAndInspect() {
  return (
    <LessonArticle>
      <Definition term="Debug a running container">
        <p>
          When something fails, you rarely guess — you <strong className="text-white">read logs</strong>,
          optionally <strong className="text-white">open a shell</strong> inside, and{' '}
          <strong className="text-white">inspect</strong> config and processes.
        </p>
        <p className="mt-2 text-slate-300">
          These three tools — logs, exec, inspect — cover most beginner debugging.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Logs tell you what happened; exec lets you look around; inspect shows how it was configured.
      </Callout>

      <LessonSection title="Debugging workflow">
        <Flowchart
          title="Calm container debugging"
          chart={`flowchart TB
  A[Something wrong] --> B[docker ps -a]
  B --> C[docker logs name]
  C --> D{Need live stream?}
  D -->|yes| E[docker logs -f]
  D -->|no| F{Need a shell?}
  E --> F
  F -->|yes| G[docker exec -it name sh]
  F -->|no| H[docker inspect / top]
  G --> H
  H --> I[Fix config or image]`}
        />
      </LessonSection>

      <LessonSection title="Read output: docker logs">
        <p className="text-slate-300">
          Containers write stdout/stderr. Docker stores that stream so you can read it even after the
          process exits.
        </p>
        <Example title="Basic log commands" caption="Use the container name or ID">
{`docker run -d --name web -p 8080:80 nginx:1.27

docker logs web
docker logs --tail 50 web
docker logs --since 10m web
docker logs --timestamps web`}
        </Example>
        <ContentStep number={1} title="Follow logs live">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-docker-400">docker logs -f</span> is like{' '}
            <span className="font-mono text-sm text-docker-400">tail -f</span> — new lines appear as they
            happen. Press Ctrl+C to stop following (the container keeps running).
          </p>
          <CodeBlock title="Follow and combine options">
{`docker logs -f web
docker logs -f --tail 100 web
docker logs -f --since 2m web`}
          </CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="Empty logs?">
          The app may log to a file inside the container instead of stdout. Then use exec to open that
          file, or fix the app to log to the console.
        </Callout>
      </LessonSection>

      <LessonSection title="Open a shell: docker exec">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-docker-400">docker exec</span> runs a{' '}
          <strong className="text-white">new</strong> command in an already-running container — perfect
          for an interactive shell.
        </p>
        <CodeBlock title="Interactive shell patterns">
{`# Alpine / many slim images use sh
docker exec -it web sh

# Debian/Ubuntu-based images often have bash
docker exec -it web bash

# One-shot command (no shell)
docker exec web ls -la /usr/share/nginx/html
docker exec web nginx -t
docker exec -u root web id`}
        </CodeBlock>
        <Callout variant="insight" title="-it explained">
          <span className="font-mono text-sm text-docker-400">-i</span> keeps stdin open;{' '}
          <span className="font-mono text-sm text-docker-400">-t</span> allocates a terminal. Together
          they make an interactive session feel normal.
        </Callout>
        <Example title="Quick peek from outside">
{`docker exec -it web sh
# inside the container:
pwd
ls /
cat /etc/os-release
exit`}
        </Example>
      </LessonSection>

      <LessonSection title="Inspect config and processes">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-docker-400">docker inspect</span> returns JSON about
          the container: mounts, env, IP, restart policy, and more.{' '}
          <span className="font-mono text-sm text-docker-400">docker top</span> shows processes like
          <span className="font-mono text-sm text-docker-400"> ps</span> inside.
        </p>
        <CodeBlock title="inspect and top">
{`docker inspect web
docker inspect --format '{{.State.Status}}' web
docker inspect --format '{{.NetworkSettings.IPAddress}}' web
docker inspect --format '{{json .Config.Env}}' web

docker top web
docker top web aux`}
        </CodeBlock>
        <ContentStep number={2} title="Format filters help">
          <p className="text-slate-300">
            Full inspect is huge. Use{' '}
            <span className="font-mono text-sm text-docker-400">--format</span> to pull one field so you
            are not scrolling forever.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Put it together">
        <CodeBlock title="A realistic debug pass">
{`docker ps -a
docker logs --tail 100 api
docker logs -f api          # Ctrl+C when enough
docker exec -it api sh      # or bash
docker top api
docker inspect --format '{{.HostConfig.PortBindings}}' api`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-docker-400">docker logs</span> and <span className="font-mono text-sm text-docker-400">logs -f</span> are your first stop.</>,
          <><span className="font-mono text-sm text-docker-400">docker exec -it name sh/bash</span> opens a second shell inside.</>,
          <><span className="font-mono text-sm text-docker-400">inspect</span> shows config; <span className="font-mono text-sm text-docker-400">top</span> shows processes.</>,
          <>Workflow: ps → logs → exec → inspect/top → fix.</>,
        ]}
      />
    </LessonArticle>
  )
}
