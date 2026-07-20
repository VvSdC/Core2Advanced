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

export function FirstContainersWalkthrough() {
  return (
    <LessonArticle>
      <Definition term="Your first real container">
        <p>
          This lesson is an <strong className="text-white">end-to-end practice run</strong>: pull
          nginx, run it in the background, map a port, hit it from your machine, check logs, open a
          shell inside, then stop and remove the container.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a <span className="text-docker-400">guided lab tour</span> — do each step once;
          muscle memory sticks.
        </p>
      </Definition>

      <Callout variant="beginner" title="Before you start">
        Docker must be installed and the daemon running (
        <span className="font-mono text-sm text-docker-400">docker version</span> works). Use a
        free port — we map host <span className="font-mono text-sm text-docker-400">8080</span> →
        container <span className="font-mono text-sm text-docker-400">80</span>.
      </Callout>

      <LessonSection title="The whole path at a glance">
        <Flowchart
          title="nginx walkthrough"
          chart={`flowchart TB
  A[docker pull nginx] --> B[docker run -d -p 8080:80]
  B --> C[curl or browser localhost:8080]
  C --> D[docker logs]
  D --> E[docker exec]
  E --> F[docker stop + rm]`}
        />
      </LessonSection>

      <LessonSection title="Step-by-step commands">
        <ContentStep number={1} title="Pull the image">
          <CodeBlock title="Download nginx">
{`docker pull nginx`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={2} title="Run detached with a port">
          <Example
            title="Background container named web"
            caption="-d = detached, -p = publish ports, --name = friendly name"
          >
{`docker run -d --name web -p 8080:80 nginx`}
          </Example>
        </ContentStep>
        <ContentStep number={3} title="Hit it from the host">
          <CodeBlock title="Request the welcome page">
{`# macOS / Linux / Git Bash
curl http://localhost:8080

# PowerShell
curl http://localhost:8080
# or open http://localhost:8080 in a browser`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={4} title="Inspect and logs">
          <CodeBlock title="Is it running? What did it log?">
{`docker ps
docker logs web`}
          </CodeBlock>
        </ContentStep>
        <ContentStep number={5} title="Exec into the container">
          <Example title="Interactive shell inside web">
{`docker exec -it web bash
# inside the container you might try: ls /usr/share/nginx/html
# then: exit`}
          </Example>
          <Callout variant="tip" title="bash not found?">
            Some slim images only have <span className="font-mono text-sm text-docker-400">sh</span>:
            use <span className="font-mono text-sm text-docker-400">docker exec -it web sh</span>.
          </Callout>
        </ContentStep>
        <ContentStep number={6} title="Stop and remove">
          <CodeBlock title="Clean up">
{`docker stop web
docker rm web`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Full sequence to copy">
        <CodeBlock title="Paste-friendly walkthrough">
{`docker pull nginx
docker run -d --name web -p 8080:80 nginx
curl http://localhost:8080
docker ps
docker logs web
docker exec -it web bash
# type: exit
docker stop web
docker rm web
docker ps -a`}
        </CodeBlock>
        <p className="text-slate-300">
          After <span className="font-mono text-sm text-docker-400">docker rm web</span>,{' '}
          <span className="font-mono text-sm text-docker-400">docker ps -a</span> should no longer
          list <span className="font-mono text-sm text-docker-400">web</span>. The{' '}
          <span className="font-mono text-sm text-docker-400">nginx</span> image usually remains —
          list it with <span className="font-mono text-sm text-docker-400">docker images</span>.
        </p>
        <Callout variant="info" title="What you just practiced">
          pull → run → publish port → request → logs → exec → stop → rm. That loop is everyday
          Docker for exploring images.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'docker run -d -p maps a host port to a container port while running in the background.',
          'curl/browser verifies the app; docker logs and exec help you inspect it.',
          'stop ends the process; rm deletes the container instance.',
          'Images remain after container removal until you remove the image separately.',
        ]}
      />
    </LessonArticle>
  )
}
