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

export function ImageCommands() {
  return (
    <LessonArticle>
      <Definition term="Docker image">
        <p>
          An <strong className="text-white">image</strong> is a read-only blueprint: the files and
          settings needed to start a container. Think of it as a recipe; a container is one cooked
          meal from that recipe.
        </p>
        <p className="mt-2 text-slate-300">
          You download images with <span className="font-mono text-sm text-docker-400">docker pull</span>,
          list them, tag them, inspect them, and delete ones you no longer need.
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        Pull images from a registry, list what you have locally, then tag or remove them as needed.
      </Callout>

      <LessonSection title="Download an image: docker pull">
        <p className="text-slate-300">
          <span className="font-mono text-sm text-docker-400">docker pull</span> fetches an image from
          Docker Hub (or another registry) onto your machine.
        </p>
        <Example title="Pull common base images" caption="Tag after the colon chooses a version">
{`docker pull nginx
docker pull nginx:1.27
docker pull python:3.12-slim
docker pull node:20-alpine`}
        </Example>
        <Callout variant="tip" title="Always prefer a tag">
          <span className="font-mono text-sm text-docker-400">nginx</span> alone means{' '}
          <span className="font-mono text-sm text-docker-400">nginx:latest</span>. For real projects,
          pin a version like <span className="font-mono text-sm text-docker-400">nginx:1.27</span>.
        </Callout>
      </LessonSection>

      <LessonSection title="List images: docker images / docker image ls">
        <p className="text-slate-300">
          Both commands show the same local image list. Modern docs prefer the{' '}
          <span className="font-mono text-sm text-docker-400">docker image</span> form.
        </p>
        <CodeBlock title="List local images">
{`docker images
docker image ls

# Filter by name
docker images nginx
docker image ls --filter "reference=python*"`}
        </CodeBlock>
        <ContentStep number={1} title="Read the columns">
          <p className="text-slate-300">
            You will see <strong className="text-white">REPOSITORY</strong>,{' '}
            <strong className="text-white">TAG</strong>, <strong className="text-white">IMAGE ID</strong>,
            created time, and size. The ID is a short hash you can use in other commands.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Tag, history, and inspect">
        <Flowchart
          title="Image lifecycle basics"
          chart={`flowchart TB
  A[docker pull] --> B[Local image store]
  B --> C[docker tag]
  C --> D[New name:tag]
  B --> E[docker history / inspect]
  B --> F[docker rmi / prune]`}
        />
        <CodeBlock title="Give an image another name">
{`# Format: docker tag SOURCE TARGET
docker tag nginx:1.27 my-nginx:dev
docker tag python:3.12-slim myregistry.example.com/app/api:1.0.0

docker images`}
        </CodeBlock>
        <CodeBlock title="See layers and details">
{`# Layer history (what built the image)
docker history nginx:1.27
docker history --no-trunc nginx:1.27

# Full JSON metadata
docker image inspect nginx:1.27
docker inspect nginx:1.27`}
        </CodeBlock>
        <Callout variant="insight" title="inspect vs history">
          <span className="font-mono text-sm text-docker-400">history</span> shows build layers.{' '}
          <span className="font-mono text-sm text-docker-400">inspect</span> dumps config: env vars,
          exposed ports, entrypoint, and more.
        </Callout>
      </LessonSection>

      <LessonSection title="Remove images: docker rmi">
        <p className="text-slate-300">
          Delete by name:tag or by image ID. Docker refuses if a running container still uses the
          image — stop and remove that container first.
        </p>
        <Example title="Remove one or more images">
{`docker rmi nginx:1.27
docker rmi my-nginx:dev
docker image rm python:3.12-slim

# Force only when you understand why it is locked
docker rmi -f <image_id>`}
        </Example>
      </LessonSection>

      <LessonSection title="Quick cleanup: docker image prune">
        <p className="text-slate-300">
          <strong className="text-white">Dangling</strong> images are leftover layers with no tag
          (often after rebuilds). Prune removes those safely by default.
        </p>
        <CodeBlock title="Prune unused image layers">
{`# Remove dangling images (confirm with y)
docker image prune

# Preview what would be removed
docker image prune --dry-run

# Remove ALL unused images (more aggressive — ask first)
# docker image prune -a`}
        </CodeBlock>
        <Callout variant="tip" title="Start gentle">
          Use plain <span className="font-mono text-sm text-docker-400">docker image prune</span>{' '}
          first. Save <span className="font-mono text-sm text-docker-400">-a</span> for later when you
          know which images you still need.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          <>Pull with <span className="font-mono text-sm text-docker-400">docker pull name:tag</span>.</>,
          <>List with <span className="font-mono text-sm text-docker-400">docker images</span> or <span className="font-mono text-sm text-docker-400">docker image ls</span>.</>,
          <>Tag, history, and inspect help you rename and understand images.</>,
          <>Remove with <span className="font-mono text-sm text-docker-400">docker rmi</span>; prune dangling leftovers with <span className="font-mono text-sm text-docker-400">docker image prune</span>.</>,
        ]}
      />
    </LessonArticle>
  )
}
