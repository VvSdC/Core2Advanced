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

export function RegistriesAndDockerHub() {
  return (
    <LessonArticle>
      <Definition term="Image registries">
        <p>
          A <strong className="text-white">registry</strong> is a server that stores Docker images
          so you can <strong className="text-white">pull</strong> (download) and{' '}
          <strong className="text-white">push</strong> (upload) them.{' '}
          <strong className="text-white">Docker Hub</strong> is the well-known public registry
          beginners meet first.
        </p>
        <p className="mt-2 text-slate-300">
          Analogy: a registry is an <span className="text-docker-400">app store for images</span> —
          some shelves are public, some are private lockers for your team.
        </p>
      </Definition>

      <Callout variant="beginner" title="Public vs private">
        Public images are visible to the world (great for open-source bases). Private registries or
        private Hub repos keep company images behind login.
      </Callout>

      <LessonSection title="Where images live">
        <Flowchart
          title="Local machine ↔ registry"
          chart={`flowchart TB
  L[Your machine — local images]
  R[Registry — Docker Hub or private]
  L -->|docker push| R
  R -->|docker pull| L`}
        />
        <ContentStep number={1} title="Public registries">
          <p className="text-slate-300">
            Anyone can pull many public images (rate limits may apply). Docker Hub hosts official
            and community content.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Private registries">
          <p className="text-slate-300">
            Companies use private Hub repos, cloud registries (ECR, GCR, ACR), or self-hosted
            registries for internal images.
          </p>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Login, pull, push (high level)">
        <p className="text-slate-300">
          Pulling public images often works without login. Pushing to your account, or pulling
          private images, needs authentication.
        </p>
        <CodeBlock title="Typical beginner commands">
{`# Sign in to Docker Hub (opens browser or asks for credentials)
docker login

# Download an image
docker pull nginx:alpine

# After you build/tag an image for YOUR namespace:
# docker tag my-app:1.0 youruser/my-app:1.0
# docker push youruser/my-app:1.0`}
        </CodeBlock>
        <Example title="Reading an image name">
{`nginx                 → library/official-style short name on Hub
youruser/my-app:1.0   → user or org namespace + repository + tag
registry.example/app  → often a private/custom registry host`}
        </Example>
        <Callout variant="tip" title="Tag before push">
          Registries organize images by name and tag. Untagged local experiments are not automatically
          on Hub — you tag and push intentionally.
        </Callout>
      </LessonSection>

      <LessonSection title="Official vs community images">
        <p className="text-slate-300">
          <strong className="text-white">Official images</strong> (and verified publishers) are
          curated starting points — still review docs and tags. Community images vary wildly in
          quality and trust. Prefer known bases; avoid random &quot;hacked together&quot; images
          for secrets or production.
        </p>
        <ContentStep number={1} title="Check the source">
          <p className="text-slate-300">
            Look at the publisher, last update, pull count as a weak signal, and especially the
            Dockerfile or docs when available.
          </p>
        </ContentStep>
        <ContentStep number={2} title="Pin tags">
          <p className="text-slate-300">
            Prefer <span className="font-mono text-sm text-docker-400">nginx:1.27</span> over
            floating <span className="font-mono text-sm text-docker-400">latest</span> when you care
            about reproducibility.
          </p>
        </ContentStep>
        <Callout variant="info" title="Security mindset">
          Pulling an image runs someone else&apos;s filesystem as your container. Treat untrusted
          images like untrusted installers.
        </Callout>
      </LessonSection>

      <KeyTakeaways
        items={[
          'Registries store images; Docker Hub is the default public one for many beginners.',
          'docker login, pull, and push are the high-level registry verbs.',
          'Public vs private controls who can see and download an image.',
          'Prefer official/verified sources and pinned tags; treat unknown images cautiously.',
        ]}
      />
    </LessonArticle>
  )
}
