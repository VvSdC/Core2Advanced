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

export function ImagesExplained() {
  return (
    <LessonArticle>
      <Definition term="Docker image">
        <p>
          A <strong className="text-white">Docker image</strong> is a{' '}
          <strong className="text-white">read-only template</strong> (blueprint) that describes
          what a container should contain: filesystem layers, default commands, and metadata. An
          image is <strong className="text-white">not</strong> a running process.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: an image is a <span className="text-docker-400">recipe and frozen meal kit</span>;
          a container is cooking (or serving) that kit.
        </p>
      </Definition>

      <Callout variant="beginner" title="Blueprint first">
        You pull or build images. You <em>run</em> containers. Mixing those words is the #1 beginner
        confusion — keep them separate.
      </Callout>

      <LessonSection title="Images as blueprints">
        <Flowchart
          title="Image → many containers"
          chart={`flowchart TB
  I[Image: nginx blueprint]
  I --> C1[Container A]
  I --> C2[Container B]
  I --> C3[Container C]`}
        />
        <p className="text-slate-300">
          One image can start many containers — like printing many copies from one PDF. Each
          container gets its own writable layer on top while the image stays read-only.
        </p>
        <ContentStep number={1} title="Read-only template">
          <p className="text-slate-300">
            The image content does not change when a container runs. Changes live in the container.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Named and tagged">
          <p className="text-slate-300">
            Names like <span className="font-mono text-sm text-docker-400">nginx:latest</span> point
            at a specific image version (tags). Prefer explicit tags when learning production habits.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Layers and base images">
        <p className="text-slate-300">
          Images are stacked as <strong className="text-white">layers</strong>. A{' '}
          <strong className="text-white">base image</strong> (for example a minimal Linux userspace)
          sits at the bottom; your app files and packages stack on top. Shared layers save disk
          space when many images reuse the same base.
        </p>
        <Example title="Layer cake (conceptual)">
{`Layer 3  — your app files
Layer 2  — installed packages
Layer 1  — base OS userspace (e.g. alpine / debian)
(Host kernel is NOT inside the image — shared at runtime)`}
        </Example>
        <Callout variant="tip" title="Recipe analogy">
          Changing one ingredient (one layer) does not always rebuild the whole cake from scratch —
          Docker can reuse unchanged layers.
        </Callout>
      </LessonSection>

      <LessonSection title="Image ≠ running process">
        <p className="text-slate-300">
          Listing images shows what is stored locally. Listing containers shows what is created or
          running. You can have an image with zero containers, or many containers from one image.
        </p>
        <CodeBlock title="Meet the image commands">
{`# Download an image from a registry (often Docker Hub)
docker pull nginx

# List images on this machine
docker images
# (modern alias)
docker image ls`}
        </CodeBlock>
        <Example
          title="After a pull"
          caption="Exact columns vary by Docker version"
          output={`REPOSITORY   TAG       IMAGE ID       CREATED       SIZE
nginx        latest    a1b2c3d4e5f6   2 weeks ago   187MB`}
        >
{`docker pull nginx
docker images`}
        </Example>
        <Callout variant="info" title="Where did it come from?">
          <span className="font-mono text-sm text-docker-400">docker pull</span> fetches layers
          from a registry. Later lessons cover Docker Hub and private registries.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'An image is a read-only blueprint — not a running process.',
          'Images are built from layers; base images sit at the bottom of the stack.',
          'One image can create many containers.',
          'docker pull downloads images; docker images lists what you have locally.',
        ]}
      />
    </LessonArticle>
  )
}
