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

export function ContainersExplained() {
  return (
    <LessonArticle>
      <Definition term="Docker container">
        <p>
          A <strong className="text-white">container</strong> is a{' '}
          <strong className="text-white">running or stopped instance</strong> of an image. The
          image is the template; the container is the live (or paused) copy with its own writable
          state on top.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: the image is a <span className="text-docker-400">class</span>; a container is an{' '}
          <span className="text-docker-400">object</span> created from that class.
        </p>
      </Definition>

      <Callout variant="beginner" title="Stopped still counts">
        A container can exist while not running — like a paused video game save.{' '}
        <span className="font-mono text-sm text-docker-400">docker ps -a</span> shows stopped ones
        too.
      </Callout>

      <LessonSection title="Lifecycle at a glance">
        <Flowchart
          title="Container lifecycle"
          chart={`flowchart TB
  A[Create from image] --> B[Run / start]
  B --> C[Stop]
  C --> B
  C --> D[Remove]
  B --> D`}
        />
        <ContentStep number={1} title="Create / run">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-docker-400">docker run</span> creates a
            container from an image and usually starts it in one step.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Stop">
          <p className="text-slate-300">
            Stopping keeps the container around (filesystem changes may remain) but ends the main
            process.
          </p>
        </ContentStep>
        <ContentStep number={3} title="Remove">
          <p className="text-slate-300">
            <span className="font-mono text-sm text-docker-400">docker rm</span> deletes the
            container instance. The image usually stays on disk unless you remove it separately.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Essential commands">
        <CodeBlock title="Create and run">
{`# Pull if needed, create, and start
docker run nginx

# Detached (background) with a friendly name
docker run -d --name web nginx`}
        </CodeBlock>
        <Example
          title="List running containers"
          caption="Add -a to include stopped containers"
        >
{`docker ps
docker ps -a`}
        </Example>
        <CodeBlock title="Stop and remove">
{`docker stop web
docker rm web

# Force-remove a running container (use carefully)
docker rm -f web`}
        </CodeBlock>
        <Callout variant="tip" title="Names help beginners">
          Use <span className="font-mono text-sm text-docker-400">--name</span> so you type{' '}
          <span className="font-mono text-sm text-docker-400">web</span> instead of a random ID
          hash.
        </Callout>
      </LessonSection>

      <LessonSection title="What changes when a container runs">
        <p className="text-slate-300">
          Docker adds a <strong className="text-white">writable layer</strong> for that container.
          Logs, temp files, and edits inside the container live there until you remove the
          container (unless you use volumes — a later topic).
        </p>
        <Example title="Image vs container checklist">
{`Image:
  - stored on disk
  - read-only blueprint
  - listed by: docker images

Container:
  - created from an image
  - running or stopped
  - listed by: docker ps / docker ps -a`}
        </Example>
        <Callout variant="info" title="Removing is intentional">
          Deleting a container is normal cleanup. Rebuild from the image anytime with{' '}
          <span className="font-mono text-sm text-docker-400">docker run</span> again.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'A container is an instance of an image — running or stopped.',
          'Lifecycle: create/run → stop → remove (you can restart before remove).',
          'docker run, docker ps, docker stop, and docker rm are the core verbs.',
          'Removing a container does not automatically delete its image.',
        ]}
      />
    </LessonArticle>
  )
}
