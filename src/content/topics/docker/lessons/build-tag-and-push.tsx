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

export function BuildTagAndPush() {
  return (
    <LessonArticle>
      <Definition term="Build, tag, push">
        <p>
          After you write a Dockerfile, you <strong className="text-white">build</strong> a local
          image, give it a <strong className="text-white">registry-ready name</strong>, then{' '}
          <strong className="text-white">push</strong> it so other machines can pull it.
        </p>
        <p className="mt-2 text-slate-300">
          Think: compile locally → label the package → upload to the warehouse (registry).
        </p>
      </Definition>

      <Callout variant="beginner" title="One sentence version">
        <span className="font-mono text-sm text-docker-400">docker build -t</span> creates the image;{' '}
        <span className="font-mono text-sm text-docker-400">docker push</span> uploads after login.
      </Callout>

      <LessonSection title="Build with a tag">
        <Flowchart
          title="Local build to registry"
          chart={`flowchart TB
  A[Dockerfile] --> B[docker build -t]
  B --> C[Local image name:tag]
  C --> D[docker login]
  D --> E[docker push]
  E --> F[Registry]
  F --> G[Others docker pull]`}
        />
        <p className="text-slate-300">
          The <span className="font-mono text-sm text-docker-400">.</span> at the end is the{' '}
          <strong className="text-white">build context</strong> — usually the current folder.
        </p>
        <Example title="Build and name the image">
{`# -t sets repository:tag
docker build -t my-api:1.0.0 .
docker build -t my-api:latest .

# Different Dockerfile path
docker build -f Dockerfile.prod -t my-api:prod .

docker images | grep my-api`}
        </Example>
        <ContentStep number={1} title="Run what you just built">
          <CodeBlock title="Smoke-test locally">
{`docker run --rm -p 3000:3000 my-api:1.0.0
docker run -d --name api -p 3000:3000 my-api:1.0.0
docker logs -f api`}
          </CodeBlock>
        </ContentStep>
      </LessonSection>

      <LessonSection title="Registry naming: registry/name:tag">
        <p className="text-slate-300">
          To push, the image name must include the registry host (and often a username/project path).
        </p>
        <CodeBlock title="Tagging for Docker Hub and others">
{`# Docker Hub: username/repository:tag
docker tag my-api:1.0.0 youruser/my-api:1.0.0
docker tag my-api:1.0.0 youruser/my-api:latest

# Other registries
docker tag my-api:1.0.0 ghcr.io/youruser/my-api:1.0.0
docker tag my-api:1.0.0 registry.example.com/team/my-api:1.0.0

# Or build already tagged for the registry
docker build -t youruser/my-api:1.0.0 .`}
        </CodeBlock>
        <Callout variant="tip" title="latest is a label, not magic">
          <span className="font-mono text-sm text-docker-400">latest</span> is just a tag people often
          update. Prefer version tags like <span className="font-mono text-sm text-docker-400">1.0.0</span>{' '}
          for deployments you can roll back.
        </Callout>
      </LessonSection>

      <LessonSection title="Login and push">
        <p className="text-slate-300">
          You must authenticate before pushing to a private (or Hub) registry.
        </p>
        <CodeBlock title="Login then push">
{`# Docker Hub
docker login
# Username / password or access token

# GitHub Container Registry example
docker login ghcr.io -u YOUR_USER

docker push youruser/my-api:1.0.0
docker push youruser/my-api:latest

# Verify from another machine / clean pull
docker pull youruser/my-api:1.0.0`}
        </CodeBlock>
        <Callout variant="insight" title="Push fails with denied?">
          Check the image name matches your username/org, that you logged into the right registry, and
          that the repo exists / you have write permission.
        </Callout>
      </LessonSection>

      <LessonSection title="Teaser: multi-stage builds">
        <p className="text-slate-300">
          Advanced images often use <strong className="text-white">two stages</strong>: one to compile,
          one slim runtime. You copy only the built artifact forward — smaller, safer final images.
        </p>
        <CodeBlock title="Multi-stage sketch (preview)">
{`# Stage 1: build
FROM node:20-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: run (smaller)
FROM node:20-alpine
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY package*.json ./
RUN npm ci --omit=dev
CMD ["node", "dist/server.js"]`}
        </CodeBlock>
        <Callout variant="beginner" title="Learn this later">
          Master single-stage Dockerfiles first. Multi-stage is the next optimization once builds work.
        </Callout>
      </LessonSection>

      <LessonSection title="End-to-end mini flow">
        <CodeBlock title="Build → tag → push checklist">
{`docker build -t my-api:1.0.0 .
docker tag my-api:1.0.0 youruser/my-api:1.0.0
docker login
docker push youruser/my-api:1.0.0`}
        </CodeBlock>
      </LessonSection>

      <KeyTakeaways
        items={[
          <><span className="font-mono text-sm text-docker-400">docker build -t name:tag .</span> builds from the current context.</>,
          <>Registry tags look like <span className="font-mono text-sm text-docker-400">user/repo:1.0.0</span> or <span className="font-mono text-sm text-docker-400">ghcr.io/…</span>.</>,
          <>Login, then <span className="font-mono text-sm text-docker-400">docker push</span>.</>,
          <>Multi-stage builds shrink production images — a later skill.</>,
        ]}
      />
    </LessonArticle>
  )
}
