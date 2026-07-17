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
} from '../../../../components/content'

export function ContainerCommands() {
  return (
    <LessonArticle>
      <Definition term="Docker container">
        <p>
          A <strong className="text-white">container</strong> is a running (or stopped) instance of an
          image. Same image, many containers — like one app installer, many open windows.
        </p>
        <p className="mt-2 text-slate-300">
          You create containers with <span className="font-mono text-sm text-docker-400">docker run</span>,
          then start, stop, restart, kill, rename, or remove them.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        <span className="font-mono text-sm text-docker-400">run</span> creates and starts;{' '}
        <span className="font-mono text-sm text-docker-400">ps</span> lists; stop/start/rm manage life.
      </Callout>

      <LessonSection title="Create and start: docker run">
        <Flowchart
          title="From image to container"
          chart={`flowchart TB
  A[Image] --> B[docker run]
  B --> C[Running container]
  C --> D[docker stop]
  D --> E[Stopped container]
  E --> F[docker start]
  F --> C
  E --> G[docker rm]`}
        />
        <Example title="Everyday run flags" caption="Flags go before the image name">
{`# Foreground (logs in your terminal)
docker run nginx:1.27

# Detached (background) + name + publish port
docker run -d --name web -p 8080:80 nginx:1.27

# Env var + auto-remove when it exits
docker run --rm -e GREETING=hello alpine:3.20 printenv GREETING

# Interactive shell (practice / debug)
docker run -it --rm alpine:3.20 sh`}
        </Example>
        <ContentStep number={1} title="Remember flag order">
          <p className="text-slate-300">
            Pattern: <span className="font-mono text-sm text-docker-400">docker run [OPTIONS] IMAGE [COMMAND]</span>.
            Put <span className="font-mono text-sm text-docker-400">-d</span>,{' '}
            <span className="font-mono text-sm text-docker-400">-p</span>,{' '}
            <span className="font-mono text-sm text-docker-400">--name</span>, and{' '}
            <span className="font-mono text-sm text-docker-400">-e</span> before the image.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Common run flags (cheat table)">
        <CodeBlock title="Flags you will use constantly">
{`Flag          Meaning
----          -------
-d            Detached (run in background)
-p 8080:80    Publish host:container port
--name web    Friendly container name
-e KEY=val    Set environment variable
--rm          Delete container when it exits
-it           Interactive + TTY (for shells)
-v data:/app  Mount a volume (later lesson)
--network net Attach to a custom network`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="List containers: docker ps">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-docker-400">docker ps</span> shows{' '}
          <strong className="text-white">running</strong> containers.{' '}
          <span className="font-mono text-sm text-docker-400">docker ps -a</span> includes stopped ones.
        </p>
        <CodeBlock title="List and filter">
{`docker ps
docker ps -a
docker ps -a --filter "name=web"
docker ps -a --format "table {{.ID}}\t{{.Names}}\t{{.Status}}\t{{.Ports}}"`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Start, stop, restart, kill">
        <p className="text-slate-300">
          Use the container <strong className="text-white">name</strong> or ID. Prefer stop over kill —
          stop asks the process to shut down politely first.
        </p>
        <CodeBlock title="Lifecycle commands">
{`docker stop web
docker start web
docker restart web

# Forceful stop (last resort)
docker kill web

# Stop several at once
docker stop web db cache`}
        </CodeBlock>
        <Callout variant="tip" title="stop vs kill">
          <span className="font-mono text-sm text-docker-400">stop</span> sends SIGTERM then SIGKILL
          after a grace period. <span className="font-mono text-sm text-docker-400">kill</span> is
          immediate — use when the app is stuck.
        </Callout>
      </LessonSection>

      <LessonSection title="Remove, rename, attach">
        <CodeBlock title="Remove containers">
{`# Must be stopped first (unless -f)
docker rm web
docker rm -f web          # force: stop + remove
docker rm $(docker ps -aq)  # careful: removes ALL containers`}
        </CodeBlock>
        <CodeBlock title="Rename and attach">
{`docker rename web web-old

# Attach your terminal to a running container's main process
# (Ctrl+P then Ctrl+Q to detach without stopping)
docker attach web`}
        </CodeBlock>
        <Callout variant="insight" title="attach vs exec">
          <span className="font-mono text-sm text-docker-400">attach</span> connects to the main
          process. For a second shell inside the container, use{' '}
          <span className="font-mono text-sm text-docker-400">docker exec -it</span> (next lesson).
        </Callout>
      </LessonSection>

      <LessonSection title="Mini practice session">
        <Example title="Run, check, stop, remove">
{`docker run -d --name demo -p 8080:80 nginx:1.27
docker ps
docker stop demo
docker ps -a
docker rm demo
docker ps -a`}
        </Example>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Use <span className="font-mono text-sm text-docker-400">docker run -d --name -p -e --rm</span> deliberately.</>,
          <><span className="font-mono text-sm text-docker-400">ps</span> = running; <span className="font-mono text-sm text-docker-400">ps -a</span> = all.</>,
          <>Prefer <span className="font-mono text-sm text-docker-400">stop</span> before <span className="font-mono text-sm text-docker-400">kill</span>; remove with <span className="font-mono text-sm text-docker-400">rm</span> or <span className="font-mono text-sm text-docker-400">rm -f</span>.</>,
          <>Rename with <span className="font-mono text-sm text-docker-400">docker rename</span>; prefer exec over attach for debugging.</>,
        ]}
      />
    </LessonArticle>
  )
}
