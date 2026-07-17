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

export function DockerArchitecture() {
  return (
    <LessonArticle>
      <Definition term="Docker architecture">
        <p>
          When you type a Docker command, the <strong className="text-white">Docker Client</strong>{' '}
          (CLI) talks to the <strong className="text-white">Docker Daemon</strong> (
          <span className="font-mono text-sm text-docker-400">dockerd</span>). The daemon pulls
          images, creates containers, and manages networking — sitting on top of the{' '}
          <strong className="text-white">host OS and kernel</strong>.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: you are the customer at a counter (CLI); the kitchen (daemon) does the cooking;
          the <span className="text-docker-400">pantry</span> is the image registry.
        </p>
      </Definition>

      <Callout variant="beginner" title="Why architecture matters">
        Errors often say &quot;Cannot connect to the Docker daemon.&quot; That means the kitchen is
        off — not that your spelling of <span className="font-mono text-sm text-docker-400">run</span>{' '}
        failed.
      </Callout>

      <LessonSection title="Client → daemon → containers">
        <Flowchart
          title="Docker architecture (critical overview)"
          chart={`flowchart TB
  CLI[Docker Client / CLI]
  DAE[Docker Daemon dockerd]
  IMG[Local images]
  CTR[Containers]
  REG[Image registry e.g. Docker Hub]
  KER[Host OS + kernel]
  CLI -->|API calls| DAE
  DAE --> IMG
  DAE --> CTR
  DAE -->|pull / push| REG
  DAE --> KER
  CTR --> KER`}
        />
        <ContentStep number={1} title="Docker Client">
          <p className="text-slate-300">
            The <span className="font-mono text-sm text-docker-400">docker</span> program you type
            in a terminal. It sends requests; it is not the engine that runs containers itself.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Docker Daemon (dockerd)">
          <p className="text-slate-300">
            Background service that builds/pulls images, starts/stops containers, and wires
            networks and volumes.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Containers on the host">
          <p className="text-slate-300">
            The daemon asks the host kernel to run isolated processes. Everything ultimately rests
            on that OS/kernel relationship.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Registries in the picture">
        <p className="text-slate-300">
          An <strong className="text-white">image registry</strong> stores images remotely.{' '}
          <strong className="text-white">Docker Hub</strong> is the default public registry many
          beginners use. The daemon pulls layers from a registry when the image is not local.
        </p>
        <Example title="What happens on docker run nginx (simplified)">
{`1. CLI → daemon: "run nginx"
2. Daemon: image missing? → pull from registry
3. Daemon: create container from image
4. Daemon: start process with isolation
5. CLI: shows output / container ID`}
        </Example>
        <CodeBlock title="Commands that touch different pieces">
{`docker version   # client + server (daemon) info
docker info      # daemon / host summary
docker pull redis
docker run -d redis`}
        </CodeBlock>
      </LessonSection>

      <LessonSection title="Host OS and kernel">
        <p className="text-slate-300">
          Linux containers need a Linux kernel. On Linux servers, Docker often runs natively. On
          Windows and macOS, Docker Desktop typically provides a Linux environment so the same
          workflow works for learners.
        </p>
        <Callout variant="tip" title="Troubleshooting map">
          CLI works but daemon errors → start Docker Desktop / dockerd. Pull fails → network or
          registry login. Run fails after pull → image/command/port issues inside the container
          story.
        </Callout>
        <Callout variant="info" title="Keep this diagram in your head">
          Client talks to daemon; daemon talks to registries and the kernel; containers are the
          result. Almost every Docker lesson plugs into this map.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'docker CLI is the client; dockerd is the daemon that does the work.',
          'Registries (like Docker Hub) store and serve images for pull/push.',
          'Containers run as isolated processes on the host OS/kernel.',
          '“Cannot connect to the Docker daemon” means the engine is not reachable.',
        ]}
      />
    </LessonArticle>
  )
}
