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

export function InstallingDocker() {
  return (
    <LessonArticle>
      <Definition term="Installing Docker">
        <p>
          To practice locally, install either <strong className="text-white">Docker Desktop</strong>{' '}
          (friendly app for Windows/Mac, also available on Linux) or{' '}
          <strong className="text-white">Docker Engine</strong> on a Linux server. Both give you the{' '}
          <span className="font-mono text-sm text-docker-400">docker</span> CLI talking to a daemon.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: Desktop is the <span className="text-docker-400">starter kit with a GUI</span>;
          Engine is the lean kitchen on a server.
        </p>
      </Definition>

      <Callout variant="beginner" title="Goal for this lesson">
        Prove Docker works with <span className="font-mono text-sm text-docker-400">docker version</span>,{' '}
        <span className="font-mono text-sm text-docker-400">docker info</span>, and{' '}
        <span className="font-mono text-sm text-docker-400">docker run hello-world</span>.
      </Callout>

      <LessonSection title="Desktop vs Engine (high level)">
        <Flowchart
          title="Pick an install path"
          chart={`flowchart TB
  A[Your OS] --> B{Windows or Mac?}
  B -->|Yes| C[Docker Desktop]
  B -->|Linux laptop| D[Desktop or Engine]
  B -->|Linux server| E[Docker Engine]
  C --> F[docker CLI + daemon ready]
  D --> F
  E --> F`}
        />
        <ContentStep number={1} title="Windows / macOS">
          <p className="text-slate-300">
            Install Docker Desktop from the official site. It manages a Linux environment so Linux
            containers work. Enable virtualization (WSL2 on Windows is common).
          </p>
        </ContentStep>
        <ContentStep number={2} title="Linux">
          <p className="text-slate-300">
            Use your distro&apos;s Docker Engine packages for servers, or Desktop if you want the
            GUI. Follow official docs for your distribution.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Start the engine">
          <p className="text-slate-300">
            Open Docker Desktop (or start the service) until the daemon is running — otherwise CLI
            commands fail to connect.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Verify the install">
        <Example title="Client and server versions">{`docker version`}</Example>
        <CodeBlock title="Daemon / host summary">{`docker info`}</CodeBlock>
        <p className="mt-3 text-sm text-slate-400">
          <span className="font-mono text-docker-400">docker info</span> prints lots of detail:
          storage driver, runtime, OS, and more. You mainly care that it succeeds without a connection
          error.
        </p>
        <Callout variant="info" title="Cannot connect to the daemon?">
          Start Docker Desktop or the Docker service, wait until it is healthy, then retry. Reopen
          the terminal if needed.
        </Callout>
      </LessonSection>

      <LessonSection title="Hello World — step by step">
        <p className="text-slate-300">
          The classic first container downloads a tiny image and prints a confirmation message.
        </p>
        <ContentStep number={1} title="Run the image">
          <Example title="One command">{`docker run hello-world`}</Example>
        </ContentStep>
        <ContentStep number={2} title="What Docker did">
          <Example title="Behind the scenes">{`1. CLI asked the daemon to run hello-world
2. Image missing locally — daemon pulled from Docker Hub
3. Daemon created a container and started it
4. Container printed the hello message and exited
5. You see the success text in your terminal`}</Example>
        </ContentStep>
        <ContentStep number={3} title="Confirm leftovers">
          <CodeBlock title="See the image and exited container">{`docker images
docker ps -a`}</CodeBlock>
        </ContentStep>
        <Callout variant="tip" title="Exited is normal">
          <span className="font-mono text-sm text-docker-400">hello-world</span> is meant to print
          and quit. An exited container still appears in{' '}
          <span className="font-mono text-sm text-docker-400">docker ps -a</span>.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Docker Desktop fits most Windows/Mac beginners; Engine fits many Linux servers.',
          'docker version and docker info confirm client + daemon are healthy.',
          'docker run hello-world pulls, runs, prints, and exits — a full mini pipeline.',
          'Daemon must be running before any docker command can succeed.',
        ]}
      />
    </LessonArticle>
  )
}
